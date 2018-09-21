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