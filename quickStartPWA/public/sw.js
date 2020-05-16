//todo: make some alert appear or something on register
var cacheName = "cache-v2";

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache
        .addAll([
          "./",
          "/icons/list256.png",
          "/icons/list512.png",
          "./manifest.json",
          "./index.js",
          "./index.html",
        ])
        .then(function () {
          console.log("cached!");
          self.skipWaiting();
        });
    })
  );
});

self.addEventListener("activate", (event) => {
  var cacheKeeplist = ["cache-v2"];

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (cacheKeeplist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetchAndCache(event.request);
    })
  );
});
function fetchAndCache(url) {
  return fetch(url)
    .then(function (response) {
      // Check if we received a valid response
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return caches.open(CACHE_NAME).then(function (cache) {
        cache.put(url, response.clone());
        console.log("service worker")
        return response;
      });
    })
    .catch(function (error) {
     alert("Request failed:", error);
      // You could return a custom offline 404 page here
    });
}
