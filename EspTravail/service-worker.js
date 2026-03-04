const CACHE_NAME = 'svt-manager-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// تثبيت Service Worker وحفظ الملفات الأساسية
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// جلب الملفات من الذاكرة المؤقتة أو الشبكة
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إرجاع النسخة المخزنة إن وجدت، وإلا جلبها من الإنترنت
                return response || fetch(event.request);
            })
    );
});