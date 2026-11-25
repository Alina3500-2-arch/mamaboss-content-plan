const cacheName = 'mamaboss-planner-offline-v2';
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.add('./')).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('mamaboss-planner-offline-') && key !== cacheName).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(cacheName).then(cache => cache.put('./', copy)).catch(() => {}));
    }
    return response;
  }).catch(() => caches.match('./')));
});
