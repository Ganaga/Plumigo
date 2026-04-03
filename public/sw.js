const CACHE_NAME = 'kidwriter-v2';
const STATIC_ASSETS = [
  '/KidWriter/',
  '/KidWriter/index.html',
  '/KidWriter/favicon.svg',
  '/KidWriter/icon-192.png',
  '/KidWriter/icon-512.png',
  '/KidWriter/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache LanguageTool API calls
  if (url.hostname === 'api.languagetool.org') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Network first for navigation and JS/CSS (get latest deploy)
      if (event.request.mode === 'navigate' || /\.(js|css)$/.test(url.pathname)) {
        return fetch(event.request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return response;
          })
          .catch(() => cached || new Response('Offline', { status: 503 }));
      }

      // Cache first for static assets
      return cached || fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
