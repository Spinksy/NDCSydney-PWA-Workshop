```js
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
```