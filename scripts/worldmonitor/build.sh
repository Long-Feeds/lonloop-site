#!/usr/bin/env bash
# Rebuild the World Monitor dashboard that lonloop.com serves at /worldmonitor/.
#
# Clones upstream at the pinned commit, applies lonloop-subpath.patch, builds a
# static bundle rooted at /worldmonitor/, and refreshes ../../worldmonitor/.
#
#   ./scripts/worldmonitor/build.sh              # pinned commit
#   WM_REF=main ./scripts/worldmonitor/build.sh  # track upstream instead
#
# Requires node 22+ and network access to github.com + registry.npmjs.org.
set -euo pipefail

UPSTREAM_REPO="https://github.com/koala73/worldmonitor.git"
# Pinned so a rebuild is reproducible and the patch keeps applying. Bump it
# deliberately, then re-run the checks in ../../worldmonitor/README.md.
UPSTREAM_REF="${WM_REF:-040424fcdc491acf84ed810fe6bf4feb35f36951}"

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(cd "$HERE/../.." && pwd)"
OUT_DIR="$SITE_ROOT/worldmonitor"
WORK_DIR="${WM_WORK_DIR:-$(mktemp -d -t worldmonitor-build)}"

echo "==> cloning $UPSTREAM_REPO @ $UPSTREAM_REF"
git clone --filter=blob:none "$UPSTREAM_REPO" "$WORK_DIR/src"
git -C "$WORK_DIR/src" checkout --quiet "$UPSTREAM_REF"

echo "==> applying lonloop-subpath.patch"
git -C "$WORK_DIR/src" apply "$HERE/lonloop-subpath.patch"

echo "==> npm install"
# The dependency tree is large and the registry connection flaky enough to
# reset mid-install; the retry/socket settings below make it survive that.
(cd "$WORK_DIR/src" && npm install --no-audit --no-fund \
  --fetch-retries=8 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=180000 \
  --fetch-timeout=900000 --maxsockets=4)

echo "==> vite build (base=/worldmonitor/)"
# VITE_WS_API_URL stays unset on purpose: the app must keep requesting bare
# /api/... paths so its exact-path public-RPC allowlist matches. functions/api/
# proxies those from the site root. See ../../worldmonitor/README.md.
(cd "$WORK_DIR/src" && VITE_VARIANT=full VITE_DISABLE_SW=true VITE_DISABLE_VERCEL_ANALYTICS=true \
  ./node_modules/.bin/vite build --base=/worldmonitor/)

echo "==> refreshing $OUT_DIR"
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"
# .br: Cloudflare compresses on the fly, so the precompressed twins are dead
# weight. pro/: a 5.4 MB Clerk-based upsell bundle the dashboard never loads.
rsync -a --exclude='*.br' --exclude='pro/' "$WORK_DIR/src/dist"/ "$OUT_DIR"/
# The build renames index.html -> dashboard.html for Vercel's router; Pages
# needs an index.html to serve /worldmonitor/.
cp "$OUT_DIR/dashboard.html" "$OUT_DIR/index.html"

echo "==> repointing cross-origin asset URLs at the local copies"
# --base cannot reach URLs the app hardcodes with a host. This one fetches the
# country boundary overrides from upstream's maps host, which only sends CORS
# headers to *.worldmonitor.app, so the browser blocks it on lonloop.com and
# the map falls back to unrefined borders. The same file ships in the build, so
# point at it. Root-absolute paths (/data/, /favico/, /map-styles/, /textures/)
# need no edit here — ../../\_redirects rewrites those onto /worldmonitor/.
# Matched by content, not filename: the bundle hash changes every build.
OVERRIDES_URL="https://maps.worldmonitor.app/country-boundary-overrides.geojson"
hits="$(grep -rl "$OVERRIDES_URL" "$OUT_DIR" || true)"
if [ -n "$hits" ]; then
  printf '%s\n' "$hits" | xargs perl -pi -e \
    's{\Qhttps://maps.worldmonitor.app/country-boundary-overrides.geojson\E}{/worldmonitor/data/country-boundary-overrides.geojson}g'
  echo "    rewrote $(printf '%s\n' "$hits" | wc -l | tr -d ' ') file(s)"
else
  echo "    nothing to rewrite — upstream may have changed the URL; re-check"
  echo "    that the map's boundary overrides still load before shipping."
fi

echo "==> done: $(find "$OUT_DIR" -type f | wc -l | tr -d ' ') files, $(du -sh "$OUT_DIR" | cut -f1)"
echo "    work dir: $WORK_DIR (delete when finished)"
