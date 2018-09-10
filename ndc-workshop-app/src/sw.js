//  ?. Add consts and pre-load array of files

// ? sync add import scripts for accessing IndexedDB

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
      
      //add call to sendMessage function
      
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
    console.log(requestUrl);
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

  //sync event
self.addEventListener("sync", event => {
  console.log("service worker: sync");
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

//Add sendMessage function



