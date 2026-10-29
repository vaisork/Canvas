// Service Worker mínimo para /reservar/ (solo shell estático; jamás API ni pagos)
const CACHE_NAME = 'canvas90-reservar-shell-v1';
const SHELL_ASSETS = [
  '/reservar/',
  '/reservar/index.html',
  '/reservar/manifest.webmanifest',
  '/assets/css/shell.css?v=1',
  '/assets/js/site-shell.js?v=9',
  '/assets/img/canvas-icon-mark.png',
  '/assets/img/icon-pulso.png',
  '/assets/img/icon-origen.png',
  '/assets/img/reservar-icon.svg',
  '/assets/img/reservar-192.png',
  '/assets/img/reservar-512.png',
  '/assets/img/reservar-512-maskable.png',
  '/assets/img/reservar-180.png'
];

function isDynamicOrExternal(url) {
  if (url.origin !== self.location.origin) return true;
  if (url.hostname.includes('webhook.glampingojodeagua.mx')) return true;
  if (
    url.pathname.includes('/disponibilidad') ||
    url.pathname.includes('/apartar') ||
    url.pathname.includes('/pagos') ||
    url.pathname.includes('/canvas/')
  ) {
    return true;
  }
  return false;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('canvas90-reservar-shell-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (isDynamicOrExternal(url)) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/reservar/index.html').then((r) => r || caches.match('/reservar/'))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
