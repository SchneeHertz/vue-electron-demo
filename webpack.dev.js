const Webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const {merge} = require('webpack-merge')

module.exports = merge(webpackConfig, {
  mode: 'development',
  devServer: {
    port: 8005,
    hot: true
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin()
  ]
})