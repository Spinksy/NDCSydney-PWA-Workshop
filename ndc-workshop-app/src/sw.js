workbox.skipWaiting();
workbox.clientsClaim();

importScripts("js/idb.js", "js/store.js");

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



workbox.precaching.precacheAndRoute(self.__precacheManifest);