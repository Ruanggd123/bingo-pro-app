const CACHE_NAME = 'bingo-pro-v5';
const BASE = '/bingo-pro-app/';
const urlsToCache = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png',
  BASE + 'lib/tesseract/tesseract.min.js',
  BASE + 'lib/tesseract/worker.min.js',
  BASE + 'lib/tesseract/tesseract-core-simd-lstm.wasm.js',
  BASE + 'lib/lang/eng.traineddata.gz'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          console.log('Deletando cache antigo:', name);
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Forçar recarregamento para index.html (não usar cache antigo)
  if (event.request.url.endsWith('index.html') || event.request.url === BASE) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function(response) {
          if(!response || response.status !== 200) {
            return response;
          }
          var responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
  );
});
