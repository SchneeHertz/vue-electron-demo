const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    filename: 'prod/[name].[contenthash:8].js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|woff2?|eot|ttf|svg)$/i,
        loader: 'file-loader',
        options: {
          name: 'prod/[name].[contenthash:8].[ext]',
        }
      }
    ]
  },
  plugins : [
    new HtmlWebpackPlugin({
      title: 'Task List Diff',
      template: path.resolve(__dirname, './public/index.html')
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin()
  ]
}