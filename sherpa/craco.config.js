const webpack = require('webpack')
module.exports = {
  babel: {
    plugins: ['babel-plugin-macros', 'babel-plugin-styled-components'],
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // eslint-disable-next-line no-param-reassign
      webpackConfig.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        http: require.resolve('http-browserify'),
        https: require.resolve('https-browserify'),
      }
      // Issue: https://github.com/webpack/changelog-v5/issues/10
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
          Buffer: ['buffer', 'Buffer'],
        })
      )
      return webpackConfig
    },
  },
}
