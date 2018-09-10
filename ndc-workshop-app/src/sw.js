const version = 1;
const cache_name = `workshop_${version}`;
var workshopCaches = [];
var api_cache = "api_cache";
var urlsToCache = [
  ".",
  "index.html",
  "app.bundle.js",
  "launch-page.bundle.js",
  "add-topic.bundle.js",
  "list-topics.bundle.js",
  "app-404.bundle.js",
  "view-topic.bundle.js",
  "vendors~list-topics~view-topic.bundle.js",
  "https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Roboto:400,300,300italic,400italic,500,500italic,700,700italic"
];

importScripts("js/idb.js", "js/store.js");

self.addEventListener("install", event => {
  console.log("called service worker install");
  event.waitUntil(
    caches
      .open(cache_name)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

//activate
self.addEventListener("activate", event => {
  console.log("service worker: activate");

  event.waitUntil( async function(){
      await caches.keys().then(cacheNames =>{
        cacheNames.filter(cacheName => {
            return cacheName !== cache_name;
                })
                .map(async cacheName =>{
                    console.log(`deleting ${cacheName}`);
                    await caches.delete(cacheName);
                });
      });
      await self.clients.claim();
      
     sendAMessage("Service worker is activated");
      
  }());
});

//fetch
self.addEventListener("fetch", function(event) {
  const requestURL = new URL(event.request.url);
  console.log("Url:", requestURL);

  //we only want to handle GET request
  if (
    event.request.method !== "GET" ||
    requestURL.protocol === "chrome-extension"
  ) {
    return;
  }

  if (event.request.method === "GET") {
      //if an api call want to call network first and then cache.
    if (/^\/api\//.test(requestURL.pathname)) {
      console.log("captured api call");
     event.respondWith(networkThenCache(event.request, api_cache));
    } else {
      event.respondWith(cacheThenNetwork(event.request));
    }
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

  //Network and then cache
  function networkThenCache(request, cacheName) {
    return fromNetwork(request,1000)
      .then(response => {
        return caches
          .open(cacheName)
          .then(cache => {
            cache.put(request.url, response.clone());
            return response;
          })
          .catch(error => {
            console.log(`Cache error: ${request.url}`);
          });
      })
      .catch(reason => {
          return caches.open(cacheName).then(cache => {
              return cache.match(request).then(match => {
                return match;
              });
            });
          });
  
  
  }
  
  function fromNetwork(request, timeout) {
    return new Promise(function(resolve, reject) {
      const timeoutId = setTimeout(reject, timeout);
  
      fetch(request).then(function(response) {
        clearTimeout(timeoutId);
        console.log("From network: ", request.clone().url);
        resolve(response);
      }, reject);
    });
  }

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

 function sendAMessage(message){


    self.clients.matchAll().then(clients =>{
        clients.forEach(client => {
            client.postMessage({
                msg: message
              });
        });
      });
}



