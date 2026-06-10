// ============================================================
//  Begarlist 16 — Service Worker
//  Strategy:
//    • App shell (HTML/CSS/JS)  → Network-first, fallback to cache
//    • Category JSON data files → Cache-first, update in background
//    • Images (remote CDN)      → Cache-first, background update
// ============================================================

const SW_VERSION    = 'bg16-v1';
const SHELL_CACHE   = `${SW_VERSION}-shell`;
const DATA_CACHE    = `${SW_VERSION}-data`;
const IMAGE_CACHE   = `${SW_VERSION}-images`;

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
          .filter((k) => k.startsWith('bg16-') && k !== SHELL_CACHE && k !== DATA_CACHE && k !== IMAGE_CACHE)
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

  // ── Category JSON data files → Cache-first + background revalidate ──
  if (url.pathname.match(/^\/data-.+\.json$/)) {
    event.respondWith(cacheFirstWithUpdate(request, DATA_CACHE));
    return;
  }

  // ── Remote images (CDN / googleusercontent / etc.) → Cache-first ──
  if (
    url.origin !== self.location.origin &&
    request.destination === 'image'
  ) {
    event.respondWith(cacheFirstWithUpdate(request, IMAGE_CACHE));
    return;
  }

  // ── App shell & same-origin assets → Network-first ──
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirstWithFallback(request, SHELL_CACHE));
    return;
  }

  // Everything else: pass through
});

// ── STRATEGIES ────────────────────────────────────────────────

/**
 * Cache-first: serve from cache immediately.
 * Then fetch from network and update the cache silently (stale-while-revalidate).
 */
async function cacheFirstWithUpdate(request, cacheName) {
  const cache    = await caches.open(cacheName);
  const cached   = await cache.match(request);

  const fetchAndStore = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    // Return cached version right away, update cache in background
    fetchAndStore; // fire-and-forget
    return cached;
  }

  // Not in cache yet — wait for network
  const fresh = await fetchAndStore;
  if (fresh) return fresh;

  // Both cache and network failed
  return new Response('{"error":"offline"}', {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Network-first: try network, fall back to cache.
 * Updates cache on every successful network response.
 */
async function networkFirstWithFallback(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;

    // Offline fallback for HTML navigation
    if (request.destination === 'document') {
      const fallback = await cache.match('/index.html');
      if (fallback) return fallback;
    }

    return new Response('Offline', { status: 503 });
  }
}
