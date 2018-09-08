var cache_name = "workshop_v1.7";
var urlsToCache = [
  ".",
  "index.html",
  "app.bundle.js",
  "launch-page.bundle.js",
  "add-topic.bundle.js",
  "list-topics.bundle.js",
  "app-404.bundle.js",
  "https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Roboto:400,300,300italic,400italic,500,500italic,700,700italic"
];

importScripts("js/idb.js", "js/store.js");

self.addEventListener("install", event => {
  self.skipWaiting();
  console.log("called service worker install");
  event.waitUntil(
    (function() {
      caches.open(cache_name).then(function(cache) {
        return cache.addAll(urlsToCache);
      });
    })()
  );
});

//activate
self.addEventListener("activate", event => {
  console.log("service worker: activate");
  event.waitUntil(self.clients.claim());
});

//fetch
self.addEventListener("fetch", function(event) {
    const requestURL = new URL(event.request.url);
    console.log('Url:', requestURL);
    //we only want to handle GET request
    if (event.request.method !== "GET" || requestURL.protocol ==='chrome-extension') {
    return;
  }
  if (event.request.method === "GET" || event.request.mode === "navigate")
    event.respondWith(cacheThenNetwork(event.request));
});

//push
self.addEventListener("push", event => {
  console.log("Push event");
  if (event.data) {
    const payload = event.data.json();
    const title = "NDC PWA workshop";
    const options = {
      body: payload.msg,
      icon: payload.icon
    };

    event.waitUntil(self.registration.showNotification(title, options));
  }
});

//cache first
function cacheThenNetwork(request) {
    
    return caches
    .match(request)
    .then(response => {
      if (response) {
        console.log(`Found ${request.url} in cache`);
        return response;
      }

      console.log(`Nework request for ${request.url}`);
      return fetch(request).then(response => {
        if (response.status === 404) {
          //return 404 page.
        }
        return caches
          .open(cache_name)
          .then(cache => {
            cache.put(request.url, response.clone());
            return response;
          })
          .catch(error => {
            console.log(`Cache error: ${request.url}`);
          });
      });
    })
    .catch(error => {
      console.log("Error", error);
      //return offline page
    });
}

//sync event
self.addEventListener("sync", event => {
  console.log("service worker: sync");
  event.waitUntil(
    store
      .outbox("readwrite")
      .then(outbox => {
        return outbox.getAll();
      })
      .then(messages => {
        return Promise.all(
          messages.map(message => {
            return fetch("api/topics", {
              method: "POST",
              body: JSON.stringify(message),
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
            }).then(response => {
              if (response.ok) {
                return store.outbox("readwrite").then(outbox => {
                  return outbox.delete(message.id);
                });
              }
            });
          })
        );
      })
      .catch(err => console.error(err))
  );
});

function fromNetwork(request, timeout) {
  return new Promise(function(resolve, reject) {
    var timeoutId = setTimeout(reject, timeout);

    fetch(request).then(function(response) {
      clearTimeout(timeoutId);
      resolve(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(cache_name).then(function(cache) {
    return cache.match(request).then(function(match) {
      return match || Promise.reject("no-match");
    });
  });
}
