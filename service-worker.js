const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/index.js',
  '/pan-tadeusz.pdf',
  '/test-file.dat',
  '/SampleVideo.mp4',
  '/SampleAudio.mp3',
  '/iframe.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached file if exists
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      )
  );
});