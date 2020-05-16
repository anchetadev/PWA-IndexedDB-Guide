# Quick start to PWA

PWA is a relatively huge topic so while quick is in the title, that surely may not be the case when setting up (It wasn't for me!). So don't be discouraged if you don't complete this as quickly as you wanted to, nothing in life worth having comes quickly (or something like that). In addition to offline features we can make our app look like a native app for phones (Instagram is PWA bet you never noticed!). I will touch on that conceptually but the main focus here will be on offline use.

Sidenote: Most browsers support PWA just be careful if you or your audience is using Safari or IE (smh keep up Apple). That being said you should use Chrome, I am using Chrome so to get the most consistency please jump on the Chrome train at least for this guide!

### Let's start with the manifest.json

["The web app manifest is a JSON file that tells the browser about your Progressive Web App and how it should behave when installed on the user's desktop or mobile device. A typical manifest file includes the app name, the icons the app should use, and the URL that should be opened when the app is launched."](https://web.dev/add-manifest/ "The first reading in the list of sources also mentions this!")

There are a ton of cool things this file can do for us for example<sup><strong>1</strong></sup>:

- `display` in its own window
- tell the page what page to open when the user visits it `start_url`
- tell what `orientation` it should be in
- Lots more!

The manifest.json in this app just has a few icons for now, that's really all that's important for now

### Now on to the Service Worker 😱

JK, it's really not that scary. In short the Service Worker's normal run through can be summated down to three events: Registration -> Installation -> Activation

1. Registration: We tell the browser that it should be aware of the Service Worker and that it will need to install it

```js
//this is in the index.html file
if ("serviceWorker" in navigator) {
  // if the service worker is available we register it
  // I also added sw.js which is the file that houses all the stuff for my service worker
  navigator.serviceWorker
    .register("./sw.js")
    .then(function (reg) {
      console.log("Successfully registered service worker", reg);
    })
    .catch(function (err) {
      console.warn("Error whilst registering service worker", err);
    });
}
```

2. Installation: When the browser detects that this is new (first time registering) or is different than the last time (if previously accessed) it will try to install the service worker. We can use the event listener called 'install' to make this happen. This is where we want to cache files which are imperative for offline function
   - 2a) After the initial page load users will benefit from PWA features since this stuff will be stored in cache! It will be persistent with the user with or without internet since the caching is done locally.

```js
// This will help us determine the version of our cache (we must change this if anything updates)
var cacheName = 'cache-v1';
self.addEventListener('install', function(e) {
    // These are the files that will be locally cached
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
                // this has to do with the behavior of the activation phase of service worker life cycle's check out source 2 at the bottom of this page!
                // in short it forces our service worker to take any updates more quickly, essentially allowing us to use a newer version of our service worker the moment the page is accessed (Otherwise you would have to close all instances of the page and then open it again to see new changes)
                self.skipWaiting();
            });
        })
    );
}
```

3.  Activation: Now that the service worker has been registered and installed it is considered activated via the 'activate' event listener! It is basically ready for use.
    - 3a) This is the place where we should delete any old, outdated stuff
    - 3b) "A service worker won't receive events like fetch and push until it successfully finishes installing and becomes "active". By default, a page's fetches won't go through a service worker unless the page request itself went through a service worker. So you'll need to refresh the page to see the effects of the service worker." <sup><strong>2</strong></sup>

```js
self.addEventListener("activate", (event) => {
  var cacheKeeplist = ["cache-v1"];
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          //if the key is not found we delete it
          if (cacheKeeplist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
```

At this point now the application now registers, installs, and activates! There's nothing here to help with the functionality yet so that is where the next event comes in

Fetch: 



##### Important to note: Refreshing the page will not properly update the Service Worker if changed or updated, you must close any tabs of your app and reopen it in a new tab/window. This will ensure that the old Service Worker has enough time to be considered out of use and so will be updated properly. Check out the service worker reading in the [Main Outline Readme](../readme.md)

<strong>1</strong>: [Manifest page of the Codelabs resource](https://codelabs.developers.google.com/codelabs/your-first-pwapp/#3 "Citing resources my English teachers would be proud")
<strong>2</strong>: [Google resource on the activate](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle "This can be confusing but don't get caught up in the details too much")(I really like the dog and cat example he uses to show how activate happens only after the first page load you'll have to read more to know what this means!)

Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
