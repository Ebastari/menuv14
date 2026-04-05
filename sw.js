
/* Montana AI Pro - Service Worker v4.6.0 */
let website_id = 227;
let website_pixel_key = 'QI9L3YVVrSysO4g0';

const SHELL_CACHE = 'montana-shell-v4.6.0';
const STATIC_CACHE = 'montana-static-v4.6.0';
const DATA_CACHE = 'montana-data-v4.6.0';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/metadata.json',
  '/robots.txt',
  '/sitemap.xml',
  '/googlef5cab2ebc4f2ab35.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.all(PRECACHE_URLS.map(async (url) => {
        try {
          await cache.add(new Request(url, { cache: 'reload' }));
        } catch (error) {
          console.warn('[SW] Precache skipped:', url, error);
        }
      }));
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (![SHELL_CACHE, STATIC_CACHE, DATA_CACHE].includes(cacheName)) {
            return caches.delete(cacheName);
          }

          return Promise.resolve(false);
        })
      );

      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }

      await self.clients.claim();
    })()
  );
});

const isCacheableResponse = (response) => response && (response.ok || response.type === 'opaque');

const putInCache = async (cacheName, request, response) => {
  if (!isCacheableResponse(response)) {
    return;
  }

  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  const networkPromise = fetch(request)
    .then(async (response) => {
      await putInCache(cacheName, request, response);
      return response;
    })
    .catch(() => null);

  return cachedResponse || networkPromise || Response.error();
};

const networkFirst = async (request, cacheName, fallbackUrl, preloadResponsePromise) => {
  try {
    const preloadResponse = preloadResponsePromise ? await preloadResponsePromise : null;
    if (preloadResponse) {
      await putInCache(cacheName, request, preloadResponse);
      return preloadResponse;
    }

    const response = await fetch(request);
    await putInCache(cacheName, request, response);
    return response;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    if (fallbackUrl) {
      const shellCache = await caches.open(SHELL_CACHE);
      const fallbackResponse = await shellCache.match(fallbackUrl);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    throw error;
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (!/^https?:$/.test(url.protocol) || url.pathname.endsWith('/sw.js') || url.hostname.includes('google-analytics')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, SHELL_CACHE, '/index.html', event.preloadResponse));
    return;
  }

  if (url.hostname.includes('script.google.com') || url.hostname.includes('open-meteo.com')) {
    event.respondWith(networkFirst(request, DATA_CACHE));
    return;
  }

  const isStaticAsset = url.origin === self.location.origin && (
    url.pathname.startsWith('/assets/') ||
    ['script', 'style', 'font', 'image'].includes(request.destination)
  );

  if (isStaticAsset) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  if (['style', 'font', 'image'].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

try {
  importScripts("https://app.pushaja.com/pixel_service_worker.js");
} catch (e) {
  console.warn('[SW] PushAja import failed:', e);
}
