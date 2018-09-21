## Install

```bash
npm i -D workbox-webpack-plugin

// or

npm install workbox-webpack-plugin --save-dev

```

## Configure

```js
// Inside of webpack.config.js:
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  // Other webpack config...
  plugins: [
    // Other plugins...
    new WorkboxPlugin().GenerateSW()
  ]
};
```