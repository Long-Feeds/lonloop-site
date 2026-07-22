# /worldmonitor — self-hosted World Monitor dashboard

A static build of [koala73/worldmonitor](https://github.com/koala73/worldmonitor)
(AGPL-3.0) served from `lonloop.com/worldmonitor`, defaulting to Chinese.

Everything in this directory except this README is generated. To rebuild:

```bash
./scripts/worldmonitor/build.sh
```

Pinned upstream commit: `040424f` (v2.10.0).

## What upstream is, and what we actually run

Upstream is a Vite frontend plus ~60 Vercel Edge Functions, Redis, seeder cron
jobs and an AIS WebSocket relay. lonloop.com is a static Cloudflare Pages site,
so only the frontend is self-hosted; every `/api/*` call is proxied server-side
to upstream's public API host (`api.worldmonitor.app`) by
`functions/api/[[path]].js`.

That means the dashboard is **live but not independent** — it renders our build
against upstream's data plane. If they change or retire those endpoints, panels
here go dark. A genuinely standalone deployment needs the Docker stack from
upstream's `SELF_HOSTING.md` (Redis + seeders + a dozen third-party API keys).

## The four things that had to change

`scripts/worldmonitor/lonloop-subpath.patch` is deliberately small. Each hunk
exists for a reason that will bite again on the next upstream bump:

- **`main.ts` — service worker off** (`VITE_DISABLE_SW=true`). Registration is
  hardcoded to `('/sw.js', { scope: '/' })`. At a subpath that either 404s or,
  worse, takes over the whole apex domain.
- **`i18n.ts` — default locale zh.** Detection order drops `navigator` and
  `fallbackLng` becomes `zh`, so the dashboard opens in Chinese regardless of
  browser locale. `?lang=xx` and an explicit pick in Settings → Language still
  win; upstream's own `zh.json` supplies the strings, and its coverage is
  partial (some panel chrome stays English).
- **`DeckGLMap.ts` — RTL plugin path.** `setRTLTextPlugin('/mapbox-gl-rtl-text.min.js')`
  is a URL, not an import, so Vite's asset base never rewrites it. Now built
  from `import.meta.env.BASE_URL`.
- **`secondary-startup.ts` — Vercel Analytics off** (`VITE_DISABLE_VERCEL_ANALYTICS=true`).
  `/_vercel/insights/*` only exists on Vercel; off-platform it is a guaranteed
  404 plus a console error on every load.

## Why the API proxy sits at the site root

The obvious layout — proxying `/worldmonitor/api/*` — fails. The app decides
which endpoints are callable without an API key using **exact-path** allowlists
(`PUBLIC_SHARED_RPC_PATHS` in `src/shared/public-rpc-cache.ts`). Any prefix makes
those lookups miss, the `public=1` marker never gets attached, and upstream
answers 401. So the asset base moves to `/worldmonitor/` while API paths stay
verbatim at the origin root, which is what those allowlists expect.

Consequence to remember: **`lonloop.com/api/*` is now owned by this proxy.** If
the main site ever needs its own API route, one of the two has to move.

The proxy also rewrites `Set-Cookie` to drop the `Domain=` attribute — the
anonymous session minted by `POST /api/wm-session` is what unlocks `rss-proxy`
and the `*-batch` RPCs, and a cookie scoped to `worldmonitor.app` is silently
dropped by a browser on lonloop.com.

## Verified

Against `wrangler pages dev`, Chrome with an `en-US` locale (so the forced
default is doing the work, not the machine's locale):

- 33/33 `/api/*` calls returned < 400
- 0 non-API 4xx/5xx, 0 console errors
- `<html lang>` = `zh-CN`
