// service-worker.js
const CACHE_NAME = "blomi-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/base.css",
  "/form.css",
  "/layout.css",
  "/components.css",
  "/time-entry.css",
  "/responsive.css",
  "/bottom-bar.css",
  "/settings.css",
  "/utils.js",
  "/data.js",
  "/timer.js",
  "/modal.js",
  "/client.js",
  "/project.js",
  "/time-entry.js",
  "/view.js",
  "/main.js",
  "/logo.svg",
  "/logo-192x192.png",
  "/logo-512x512.png",
  "/manifest.json",
];

// התקנת Service Worker
self.addEventListener("install", (event) => {
  console.log("Installing service worker...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// הפעלת Service Worker
self.addEventListener("activate", (event) => {
  console.log("Activating service worker...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// טיפול בבקשות רשת
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // החזר מהמטמון אם קיים
      if (response) {
        return response;
      }

      // העתק הבקשה כי אי אפשר להשתמש בה פעמיים
      return fetch(event.request).then((response) => {
        // בדוק אם קיבלנו תגובה תקינה
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // העתק התגובה כי אי אפשר להשתמש בה פעמיים
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
