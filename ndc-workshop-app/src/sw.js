//  ?. Add consts and pre-load array of files

// ? sync add import scripts for accessing IndexedDB

self.addEventListener("install", event => {
  console.log("called service worker install");

  //??.add code to manage pre-loading assets

  //lets force the waiting service worker become the active one
  return self.skipWaiting();
});

//activate
self.addEventListener("activate", event => {
  console.log("service worker: activate");
  self.clients.Claim(); 
});

//fetch
self.addEventListener("fetch", function(event) {
  const requestURL = new URL(event.request.url);
  console.log("Url:", requestURL.url);
  
  //add code to manage fetch events
  
});

//??.Add cache then network function

 //?? Add network then cache.

  //sync event
self.addEventListener("sync", event => {
  console.log("service worker: sync");
});

// push notification event

//Add sendMessage function



