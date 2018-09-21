### Add option

```json
{
  swDest: 'sw.js',
  clientsClaim: true,
  skipWaiting: true
}
```


### Add dynamic data (runtime) caching

```json
{
  runtimeCaching: [{
    urlPattern: new RegExp('api_url'),
    handler: 'staleWhileRevalidate'
  }]
}
```