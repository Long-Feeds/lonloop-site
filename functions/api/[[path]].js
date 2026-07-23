/**
 * Same-origin API proxy for the self-hosted World Monitor dashboard.
 *
 * The dashboard is a static build of github.com/koala73/worldmonitor served from
 * /worldmonitor/. Its data layer lives in 60+ Vercel Edge Functions we don't run,
 * so every /api/* call is forwarded to the project's public API host.
 *
 * Why a server-side proxy instead of letting the browser call it directly:
 * upstream's CORS allowlist only admits *.worldmonitor.app origins, so a direct
 * cross-origin fetch from lonloop.com is blocked. Proxying makes it same-origin,
 * which sidesteps CORS entirely.
 *
 * Why this lives at the site root rather than under /worldmonitor/api/: the app
 * gates its public (key-free) endpoints through exact-path allowlists — see
 * PUBLIC_SHARED_RPC_PATHS in src/shared/public-rpc-cache.ts. Any path prefix
 * makes those lookups miss, the `public=1` marker never gets attached, and
 * upstream answers 401. Only the asset base is relocated to the subpath.
 */

const UPSTREAM_ORIGIN = 'https://api.worldmonitor.app';
const UPSTREAM_SITE = 'https://www.worldmonitor.app';

// Hop-by-hop and Cloudflare-injected headers that must not be replayed upstream.
const STRIPPED_REQUEST_HEADERS = new Set([
  'host',
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  'cf-connecting-ip',
  'cf-ipcountry',
  'cf-ray',
  'cf-visitor',
  'cf-worker',
  'x-forwarded-host',
  'x-forwarded-proto',
]);

// fetch() decodes the upstream body, so replaying the original encoding headers
// would describe the payload incorrectly.
const STRIPPED_RESPONSE_HEADERS = new Set([
  'content-encoding',
  'content-length',
  'transfer-encoding',
  'connection',
  // Same-origin from the browser's point of view — CORS headers are noise here,
  // and upstream's ACAO names a host that isn't ours.
  'access-control-allow-origin',
  'access-control-allow-credentials',
  // Rewritten and re-emitted below; iterating headers would also fold multiple
  // Set-Cookie lines into one comma-joined value.
  'set-cookie',
]);

/**
 * Re-scope an upstream cookie to this origin.
 *
 * /api/wm-session mints the anonymous session that the keyed endpoints
 * (rss-proxy, the *-batch RPCs) check. Its Set-Cookie carries a
 * `Domain=...worldmonitor.app` attribute, which a browser on lonloop.com
 * silently drops — no session, and those endpoints answer 401/503. Dropping the
 * attribute pins the cookie to whatever host served it, which is what we want.
 */
function rescopeCookie(cookie, isInsecureOrigin) {
  let out = cookie.replace(/;\s*domain=[^;]*/gi, '');
  if (isInsecureOrigin) {
    // Local `wrangler pages dev` runs over http, where Secure cookies and
    // SameSite=None (which implies Secure) are both rejected.
    out = out.replace(/;\s*secure/gi, '').replace(/;\s*samesite=none/gi, '; SameSite=Lax');
  }
  return out;
}

export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);

  const segments = Array.isArray(params.path) ? params.path : [params.path].filter(Boolean);
  const target = `${UPSTREAM_ORIGIN}/api/${segments.join('/')}${url.search}`;

  const headers = new Headers();
  for (const [name, value] of request.headers) {
    if (!STRIPPED_REQUEST_HEADERS.has(name.toLowerCase())) headers.set(name, value);
  }
  // Upstream sits behind a WAF that blocks requests lacking a browser-shaped
  // origin/referer pair, and its CORS layer keys off Origin.
  headers.set('origin', UPSTREAM_SITE);
  headers.set('referer', `${UPSTREAM_SITE}/`);

  const init = {
    method: request.method,
    headers,
    redirect: 'follow',
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
  }

  let upstream;
  try {
    upstream = await fetch(target, init);
  } catch (error) {
    return Response.json(
      { error: 'upstream_unreachable', message: String(error), target },
      { status: 502 }
    );
  }

  const responseHeaders = new Headers();
  for (const [name, value] of upstream.headers) {
    if (!STRIPPED_RESPONSE_HEADERS.has(name.toLowerCase())) responseHeaders.set(name, value);
  }

  const insecure = url.protocol === 'http:';
  const cookies = typeof upstream.headers.getSetCookie === 'function'
    ? upstream.headers.getSetCookie()
    : [];
  for (const cookie of cookies) {
    responseHeaders.append('set-cookie', rescopeCookie(cookie, insecure));
  }

  responseHeaders.set('x-wm-proxy', 'lonloop');

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
