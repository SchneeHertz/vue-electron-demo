const webpackConfig = require('./webpack.config')
const {merge} = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = merge(webpackConfig, {
  mode: 'production',
  plugins: [
    new CompressionPlugin()
  ]
})