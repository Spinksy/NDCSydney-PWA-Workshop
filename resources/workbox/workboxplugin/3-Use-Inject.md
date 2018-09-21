### Inject method

```js
module.exports = {
  // Other webpack config...
  plugins: [
    // Other plugins...
    new workboxWebpackPlugin.InjectManifest({
      swSrc: './src/sw.js',
      swDest: 'sw.js'
    })
  ]
};
```

### And in your SW.js

```js
workbox.skipWaiting();
workbox.clientsClaim();

workbox.routing.registerRoute(
  new RegExp('https://hacker-news.firebaseio.com'),
  workbox.strategies.staleWhileRevalidate()
);


self.addEventListener('push', (event) => {
  console.log('Push triggered');
  const title = 'Get Started With Workbox';
  const options = {
    body: event.data.text()
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

workbox.precaching.precacheAndRoute([]);
```