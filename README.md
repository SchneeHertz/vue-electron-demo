# vue-electron-demo

从零开始搭建一个Vue+Electron项目

## 1. 准备文件夹
安装Node.js, Git  
新建一个根文件夹，以项目名命名，本例为vue-electron-demo  
在建立的文件夹内打开Shell(Powershell/CMD/MINGW64)  

```npm init```  
全部按默认设置，运行后生成package.json  

```git init```  
新建.gitignore文件，写入以下两行，将这两个文件夹排除出git库
```
node_modules
/dist
```  

新建public文件夹，将图标及html模板复制进去

预览下文件夹结构:  
```javascript
.
├── dist // build 后的文件夹
├── node_modules // npm 第三方库文件夹
├── public // 静态文件夹
│   ├── favicon.ico // 默认图标
│   └── index.html // html 主模板
├── src // vue相关代码文件夹
│   ├── router // vue 路由
│   │   └── index.js //  vue 路由文件
│   ├── views // vue 页面
│   │   └── Home.vue //  主页面文件
│   ├── App.vue // 主文件
│   └── main.js // vue 主js文件
├── .gitignore // git 配置文件
├── index.js  // Electron入口文件
├── package-lock.json // npm 的依赖、项目信息文件
├── package.json // npm 的依赖、项目信息文件
├── README.md
├── webpack.config.js // webpack 主配置文件
├── webpack.dev.js //开发环境配置
└── webpack.prod.js //生产环境配置
```

## 2. 设置Vue
安装Vue及相关库  
```npm install -D vue vue-router```  

在根文件夹内建立src文件夹，在src文件夹内新建  
App.vue
```
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="stylus">
body
  margin: 0

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #303133

textarea
  font-family: Arial, Helvetica, sans-serif
</style>
```
main.js  
```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

文件夹router  
文件夹router内建立index.js
```javascript
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
```  

文件夹views  
文件夹views内建立Home.vue  
```
<template>
  <p class="p-class">test</p>
</template>

<script>
export default {
  
}
</script>

<style lang="stylus" scoped>
.p-class
  color: blue
</style>
```

## 3. 设置Webpack
安装Webpack(本例为Webpack 5)及相关库  
```npm install -D webpack webpack-cli webpack-dev-server webpack-merge```  

新建webpack.config.js文件，写入webpack配置  
```javascript
const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, './src/main.js'),
    output: {
      filename: 'prod/[name].[contenthash:8].js',
      path: path.resolve(__dirname, './dist')
    }
}
```
entry为src文件夹内的main.js文件  
output为dist文件夹

设置loader  
```npm install -D @babel/core @babel/preset-env babel-loader css-loader file-loader style-loader stylus stylus-loader vue-loader  vue-template-compiler```

修改webpack.config.js文件，写入webpack loader配置  
```javascript
//省略已有配置
module.exports = {
  //省略已有配置
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
  }
}
```

设置plugins  
```npm install -D clean-webpack-plugin compression-webpack-plugin html-webpack-plugin@next```

修改webpack.config.js文件，写入webpack plugins配置  
```javascript
//省略已有配置
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
//省略已有配置
  plugins : [
    new HtmlWebpackPlugin({
      title: 'Vue Electron Demo',
      template: path.resolve(__dirname, './public/index.html')
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin()
  ]
}
```

新建webpack.dev.js文件，写入webpack开发环境配置   
```javascript
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
```
新建webpack.prod.js文件，写入webpack生产环境配置   
```javascript
const webpackConfig = require('./webpack.config')
const {merge} = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = merge(webpackConfig, {
  mode: 'production',
  plugins: [
    new CompressionPlugin()
  ]
})
```

修改package.json, 添加相关命令  
```javascript
"scripts": {
  "build": "webpack --config ./webpack.prod.js",
  "serve": "webpack serve --config ./webpack.dev.js"
}
```

## 4.设置Electron
安装Electron及相关库  
```npm install -D electron electron-builder```  

新建index.js文件  
```javascript
const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('dist/index.html')
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

修改package.json, 添加electron-builder配置及相关命令  
```javascript
"scripts": {
  "start": "electron .",
  "pack": "electron-builder --dir",
  "dist": "electron-builder"
},
"build": {
  "appId": "vue.electron.demo",
  "files": [
    "dist/index.html*",
    "dist/prod/*",
    "index.js"
  ]
}
```
至此项目搭建完成，之后只需要在src文件夹内编辑业务代码即可

## 5.相关命令

```npm run serve```  
调起webpack开发服务器(带热更新)

```npm run build```  
打包vue项目代码

```npm run start```  
调起Electron开发环境

```npm run pack```  
打包Electron应用(未压缩)，文件位于dist/win-unpacked

```npm run dist```  
生成Electron应用安装文件








