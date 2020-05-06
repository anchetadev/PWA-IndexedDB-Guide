var cacheName = 'cache-v1';

self.addEventListener('install', function(e) {
     e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                './',
                '/icons/list256.png',
                '/icons/list512.png',
                './manifest.json',
                './index.js',
                './index.html'
            ]).then(function() {
                console.log("cached!")
                self.skipWaiting();
            });
        })
    );
}