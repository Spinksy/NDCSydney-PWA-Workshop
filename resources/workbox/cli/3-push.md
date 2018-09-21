

#### Push notification

```js
self.addEventListener('push', (event) => {
  console.log('Push triggered');
  const title = 'Get Started With Workbox';
  const options = {
    body: event.data.text()
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
```
