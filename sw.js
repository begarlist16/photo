// ============================================================
//  Begarlist 16 — Service Worker
//  Strategy:
//    • App shell (HTML/CSS/JS)  → Network-first, fallback to cache
//    • Category JSON data files → Cache-first, background revalidate
//    • External images (CDN)    → Pass through (no caching — CORS)
// ============================================================

const SW_VERSION  = 'bg16-v1';
const SHELL_CACHE = `${SW_VERSION}-shell`;
const DATA_CACHE  = `${SW_VERSION}-data`;

// Files to pre-cache on install (app shell)
const SHELL_FILES = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
];

// ── INSTALL ───────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

// ── ACTIVATE ──────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('bg16-') && k !== SHELL_CACHE && k !== DATA_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH ─────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // ── Let external requests (images, fonts, etc.) pass through untouched ──
  // Attempting to cache cross-origin responses without CORS headers fails.
  if (url.origin !== self.location.origin) return;

  // ── Category JSON data files → Cache-first + background revalidate ──
  if (url.pathname.match(/^\/data-.+\.json$/)) {
    event.respondWith(cacheFirstWithUpdate(request, DATA_CACHE));
    return;
  }

  // ── App shell & same-origin assets → Network-first ──
  event.respondWith(networkFirstWithFallback(request, SHELL_CACHE));
});

// ── STRATEGIES ────────────────────────────────────────────────

/**
 * Cache-first: serve from cache immediately.
 * Fetch from network and update cache silently in background (stale-while-revalidate).
 */
async function cacheFirstWithUpdate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchAndStore = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) {
    fetchAndStore; // fire-and-forget background update
    return cached;
  }

  const fresh = await fetchAndStore;
  if (fresh) return fresh;

  return new Response('{"error":"offline"}', {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Network-first: try network, fall back to cache.
 */
async function networkFirstWithFallback(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;

    if (request.destination === 'document') {
      const fallback = await cache.match('/index.html');
      if (fallback) return fallback;
    }

    return new Response('Offline', { status: 503 });
  }
}
