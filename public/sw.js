const CACHE_NAME = 'central-ofertas-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let network handle by default, fall back gracefully
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
