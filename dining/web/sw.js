/* Service worker: make the app open and show something without a network.

   Deliberately network-first for everything, cache only as the fallback. The
   opposite -- cache-first for the shell, which is the usual advice -- means a
   deployed change is invisible until the cache happens to turn over, and a
   stale app that looks identical to a fresh one is worse than a slow one. The
   cost is that online loads still make the request; the benefit is that what
   you see is never a lie about what is deployed. */

const VERSION = 'dining-v2';
const SHELL = [
  '/', '/index.html', '/styles.css', '/app.js',
  '/manifest.webmanifest', '/icon.svg', '/icon-maskable.svg',
  // The app cannot start without this: it carries the dates, the halls and the
  // meals that everything else is chosen from. It is also fetched before the
  // worker has activated on a first visit, so it never lands in the cache by
  // itself -- and without it an offline launch dies at boot with the whole
  // menu sitting in the cache, unreachable.
  '/api/meta',
];

self.addEventListener('install', e => {
  // Take over immediately rather than waiting for every tab to close.
  self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;   // fonts and the like

  e.respondWith((async () => {
    try {
      const fresh = await fetch(request);
      // Only cache a real answer; an error page cached is an error page served.
      if (fresh && fresh.status === 200) {
        const copy = fresh.clone();
        caches.open(VERSION).then(c => c.put(request, copy)).catch(() => {});
      }
      return fresh;
    } catch {
      const hit = await caches.match(request);
      if (hit) {
        // Let the page say the data is from a previous visit rather than
        // presenting yesterday's menu as today's.
        const h = new Headers(hit.headers);
        h.set('X-From-Cache', '1');
        return new Response(await hit.blob(), { status: hit.status, headers: h });
      }
      // Navigations fall back to the shell so the app opens rather than
      // showing the browser's dinosaur.
      if (request.mode === 'navigate') {
        const shell = await caches.match('/index.html');
        if (shell) return shell;
      }
      throw new Error('offline and uncached');
    }
  })());
});
