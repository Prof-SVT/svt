const CACHE_NAME = 'pwa-gas-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png'
];

// تثبيت الـ Service Worker وحفظ الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// جلب الملفات من الكاش عند انقطاع الإنترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});