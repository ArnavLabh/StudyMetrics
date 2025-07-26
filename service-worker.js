const CACHE_NAME = 'studymetrics-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
    })
);
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
event.respondWith(
  caches.match(event.request)
    .then(response => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(response => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Don't cache API calls
        if (!event.request.url.includes('/api/')) {
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }

        return response;
      });
    })
    .catch(() => {
      // Offline fallback
      if (event.request.destination === 'document') {
        return caches.match('/index.html');
      }
    })
);
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
const cacheWhitelist = [CACHE_NAME];

event.waitUntil(
  caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      })
    );
  })
);
});

// Background sync for saving data
self.addEventListener('sync', event => {
if (event.tag === 'sync-user-data') {
  event.waitUntil(syncUserData());
}
});

async function syncUserData() {
try {
  const cache = await caches.open(CACHE_NAME);
  const pendingRequests = await cache.match('pending-sync');
  
  if (pendingRequests) {
    const requests = await pendingRequests.json();
    
    for (const reqData of requests) {
      await fetch(reqData.url, {
        method: reqData.method,
        headers: reqData.headers,
        body: reqData.body
      });
    }
    
    // Clear pending requests
    await cache.delete('pending-sync');
  }
} catch (error) {
  console.error('Sync failed:', error);
}
}

// Push notifications
self.addEventListener('push', event => {
const options = {
  body: event.data ? event.data.text() : 'New update available',
  icon: '/icons/icon-192x192.png',
  badge: '/icons/icon-72x72.png',
  vibrate: [100, 50, 100],
  data: {
    dateOfArrival: Date.now(),
    primaryKey: 1
  }
};

event.waitUntil(
  self.registration.showNotification('StudyMetrics', options)
);
});