'use strict';

// Static Files as version
var staticCache = 'v0.01';

// Files to cache
var files = [
    './',
    './index.html',
    './assets/icons/icon-72x72.png',
    './assets/icons/icon-96x96.png',
    './assets/icons/icon-128x128.png',
    './assets/icons/icon-144x144.png',
    './assets/icons/icon-152x152.png',
];

// Install
self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(staticCache).then(cache => {
            return cache
                .addAll(files)
                .then(() => console.log('App Version: ' + staticCache))
                .catch(err => console.error('Error adding files to cache', err));
        }),
    );
});

// Activate
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== staticCache) {
                        console.info('Deleting Old Cache', cache);
                        return caches.delete(cache);
                    }
                }),
            );
        }),
    );
    return self.clients.claim();
});

// Fetch
self.addEventListener('fetch', e => {
    const req = e.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) return e.respondWith(cacheFirst(req));
    else return e.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
    let cacheRes = await caches.match(req);
    return cacheRes || fetch(req);
}

async function networkFirst(req) {
    const dynamicCache = await caches.open('dynamic');
    try {
        const networkResponse = await fetch(req);
        if (req.method !== 'POST') dynamicCache.put(req, networkResponse.clone());
        return networkResponse;
    } catch (err) {
        const cacheResponse = await caches.match(req);
        return cacheResponse;
    }
}
