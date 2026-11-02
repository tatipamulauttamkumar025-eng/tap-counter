const CACHE = "tallyx-v13";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icons/tallyx-192.png", "./icons/tallyx-512.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key === "tap-counter-v1" || (key.startsWith("tallyx-") && key !== CACHE))
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
