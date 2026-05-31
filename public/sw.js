const CACHE_NAME = 'mahabir-quantum-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static shell');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event with Hybrid Strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Ignore requests that aren't GET
  if (req.method !== 'GET') return;

  // Google Sheets or WhatsApp triggers - network first
  if (req.url.includes('spreadsheets.google.com') || req.url.includes('wa.me') || req.url.includes('whatsapp')) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          // Cache a copy of the spreadsheet data for absolute offline fallback
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If offline, check if sheet is cached
          return caches.match(req);
        })
    );
    return;
  }

  // Static Assets - Stale While Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background to keep cache up to date
        fetch(req).then((freshResponse) => {
          if (freshResponse && freshResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(req, freshResponse);
            });
          }
        }).catch(() => {/* Ignore background sync failures */});
        return cachedResponse;
      }

      return fetch(req).then((freshResponse) => {
        if (!freshResponse || freshResponse.status !== 200 || freshResponse.type !== 'basic') {
          return freshResponse;
        }
        const responseClone = freshResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, responseClone);
        });
        return freshResponse;
      });
    })
  );
});
