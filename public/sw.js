/// <reference lib="webworker" />

const CACHE_NAME = 'binmaster-v2';
const BASE = '/binmaster';
const STATIC_ASSETS = [
  `${BASE}/`,
  `${BASE}/manifest.json`,
  `${BASE}/icons/icon-192.png`,
  `${BASE}/icons/icon-512.png`,
];

// Install event — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Some assets may not be available yet, that's OK
      });
    })
  );
  self.skipWaiting();
});

// Activate event — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event — network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Chrome extensions and other non-http requests
  if (!request.url.startsWith('http')) return;

  // Skip API requests
  if (request.url.includes('/api/')) return;

  // For page/app requests — network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (request.mode === 'navigate') {
            return caches.match(`${BASE}/`);
          }
          return new Response('Hors ligne', { status: 503 });
        });
      })
  );
});
