
## Adding custom code

#### Configs

```js
workbox.skipWaiting();
workbox.clientsClaim();
```


#### Routes and strategies

```js

workbox.routing.registerRoute(
  new RegExp('/js/.*\.js'),
  workbox.strategies.staleWhileRevalidate()
);
```
