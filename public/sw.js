let CACHE_NAME = "app-v3";
const API_URL = "https://jsonplaceholder.typicode.com/users"; // Replace with your API URL

//incase of multiple API's ***************************************
//  const API_URLS = [
//   "https://api.example.com/data1", // Replace with your first API URL
//   "https://api.example.com/data2", // Replace with your second API URL
//   "https://api.example.com/data3", // Replace with your third API URL
// ];

// Install Event: Cache the app shell resources
this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/static/js/bundle.js",
        "/manifest.json",
        "/index.html",
        "offline.html",
        "/logo192.png",
        "/favicon.ico",
        "/ws",
        "/",
        "/users",
      ]);
    })
  );
});

// Fetch Event: Serve cached API data after the first load, or fetch from API and cache it
this.addEventListener("fetch", (event) => {
  //incase of multiple API's
  //instead of below check, check like
  // const isAPIRequest = API_URLS.some((url) => event.request.url.includes(url));
  // if (isAPIRequest) {
  if (event.request.url.includes(API_URL)) {
    // Handle API request
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // If we have the response cached, return it
          console.log("Serving cached API data:", event.request.url);
          return cachedResponse;
        }

        // If no cache, fetch from the API and cache the response
        return fetch(event.request)
          .then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              console.log("Fetched and cached API data:", event.request.url);
              return networkResponse;
            });
          })
          .catch((error) => {
            console.error("API fetch failed:", error);
            return new Response("You are offline and the data is unavailable.");
          });
      })
    );
  } else {
    // Handle non-API requests (app shell files)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).catch(() => {
          // Serve offline page if network is unavailable
          return caches.match("/offline.html");
        });
      })
    );
  }
});

this.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
