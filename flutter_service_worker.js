'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "splash/style.css": "00b2e579596a12f3ac65c4f1d5e34a48",
"splash/img/light-3x.png": "f7cddd70038e328c13143ccfc21b453f",
"splash/img/light-4x.png": "618dae8268bc63c6622bbeed8fa4d6e5",
"splash/img/light-2x.png": "2f284778c88fe958c0c56df98a916ac9",
"splash/img/light-1x.png": "760fd5830c83ae3a452eb868d704ad08",
"splash/img/dark-4x.png": "618dae8268bc63c6622bbeed8fa4d6e5",
"splash/img/dark-2x.png": "2f284778c88fe958c0c56df98a916ac9",
"splash/img/dark-3x.png": "f7cddd70038e328c13143ccfc21b453f",
"splash/img/dark-1x.png": "760fd5830c83ae3a452eb868d704ad08",
"splash/splash.js": "123c400b58bea74c1305ca3ac966748d",
"favicon.png": "18d90872495348e25fbd88813dec4f87",
"index.html": "b157deaa3bd779069808e750fd856d3e",
"/": "b157deaa3bd779069808e750fd856d3e",
"manifest.json": "87261b628852ab7198f7ebcdf81049c0",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"icons/Icon-maskable-512.png": "ab2cec5da5a731b2333d0c4499e25c72",
"icons/Icon-maskable-192.png": "afb2aa69430d937f97ee5fd9419647a6",
"icons/Icon-192.png": "afb2aa69430d937f97ee5fd9419647a6",
"icons/Icon-512.png": "ab2cec5da5a731b2333d0c4499e25c72",
"version.json": "1daf8198bf647590d7fad7e9849bc7c1",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"main.dart.js": "091b9827251e065d233245cb2627f8db",
"assets/AssetManifest.json": "100b476a226cd1a74cad7cd9e9ccef79",
"assets/shaders/ink_sparkle.frag": "9218f435d48f471cf8c9468e8e64ceb6",
"assets/FontManifest.json": "a2346fb72bc066402045b71758a0e551",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/NOTICES": "5bd51e0afb07d532d1f351e634b487d3",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/sounds/tap.mp3": "101a48a0800b882d87cc5dc5115ec65c",
"assets/assets/sounds/flip_card.mp3": "38ba06cc64309b22dda7c5d1d28211e1",
"assets/assets/app_logo.png": "0499eee83726658367e51e502744623f",
"assets/assets/icons/gift.svg": "02792c1ea0f7459b59d829e5db49b7ce",
"assets/assets/icons/diamond.svg": "2be92bfc77f950dbf0f80a0eaba35e0c",
"assets/assets/icons/bubbles.svg": "0e0a5f380e73c24c9bd0a7d08ba0906b",
"assets/assets/icons/notebook.svg": "c1d64f30975ee25871106c877e830e82",
"assets/assets/icons/settings.svg": "80c04a25c535b2140bc5cfb053bf28a8",
"assets/assets/icons/fail.svg": "abc502b0a7bf3b2ca90305859f17f660",
"assets/assets/icons/profile.svg": "65a438bbe5d6e2a31f8c221928304bf7",
"assets/assets/icons/play.svg": "1a06d77f1600b99e27aa1364fa63c876",
"assets/assets/game_console.json": "45deb7bd77a967ca864cfb7446268c91",
"assets/assets/background.jpg": "bc83f424ff8cd4ef2452ab96a5974d9f",
"assets/assets/fonts/Beon-Regular.otf": "91e03708de4f58a628df6f6a7c26b19b",
"assets/assets/fonts/Quicksand-Regular.ttf": "6cbafd2cb6e973c96ade779edc39c62a",
"assets/assets/fonts/Quicksand-SemiBold.ttf": "9e7757030c60a7a6973c9a95d9cea1c0"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
