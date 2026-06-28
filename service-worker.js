const CACHE_NAME = 'japanese-drill-v2';
const APP_FILES = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './level1_01_10.json',
  './level1_11_20.json',
  './level1_21_30.json',
  './level1_31_40.json',
  './level1_41_52.json',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => {
      if (key !== CACHE_NAME) return caches.delete(key);
    })))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
