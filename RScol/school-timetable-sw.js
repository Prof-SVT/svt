const CACHE_PREFIX = 'school-timetable:' + self.registration.scope + ':';
const CACHE_NAME = CACHE_PREFIX + 'v2-green';
const LOCAL_FILES = [
  './index.html',
  './school-timetable.webmanifest',
  './school-timetable-assets/ministry-logo.png',
  './school-timetable-assets/tajawal-regular.ttf',
  './school-timetable-assets/tajawal-bold.ttf',
  './school-timetable-assets/app-icon.svg',
  './school-timetable-assets/icon-192.png',
  './school-timetable-assets/icon-512.png',
  './school-timetable-assets/icon-maskable-512.png'
];
const APP_URL = new URL('./index.html', self.registration.scope).href;
const ROOT_URL = new URL('./', self.registration.scope).href;
const LOCAL_URLS = new Set(LOCAL_FILES.map(path => new URL(path, self.registration.scope).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(LOCAL_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(names => Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map(name => caches.delete(name)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  url.search = '';
  url.hash = '';
  if (url.origin !== self.location.origin) return;
  const isAppPage = event.request.mode === 'navigate' && (url.href === APP_URL || url.href === ROOT_URL);
  if (!isAppPage && !LOCAL_URLS.has(url.href)) return;
  if (isAppPage) {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(APP_URL, copy)));
      }
      return response;
    }).catch(() => caches.match(APP_URL)));
  } else {
    event.respondWith(caches.match(event.request, { ignoreSearch: true }).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)));
      }
      return response;
    })));
  }
});
