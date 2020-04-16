const { resolve } = require('./util')
const loaders = require('./loaders')
const plugins = require('./plugins')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const axios = require('axios')
// const bodyParser = require('body-parser')

const isProd = process.env.NODE_ENV === 'production'

const config = {
  mode: isProd ? 'production' : 'development',
  entry: {
    main: resolve('src/index.tsx'),
    // vendor: ['react', 'react-dom', 'redux', 'react-router', 'react-router-dom']
  },
  output: {
    path: resolve('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].[id].[hash:8].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'COMPONENTS': resolve('src/components'),
      'API': resolve('src/api'),
      'ASSETS': resolve('src/assets'),
      'STYLE': resolve('src/style'),
      'VIEWS': resolve('src/views'),
      'UTIL': resolve('src/util'),
      'STORE': resolve('src/store'),
      'ROUTER': resolve('src/router')
      // 'api': resolve('src/api'),
      // 'base': resolve('src/base'),
      // 'router': resolve('src/router')
    }
  },
  module: {
    rules: loaders
  },
  plugins,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            warnings: false,
            // 删除所有的 `console` 语句
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true
          },
          // 去掉注释
          output: {
            comments: false
          }
        },
        sourceMap: true
      })
    ],
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 8,
      maxInitialRequests: 8,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true
        }
      }
    }
  },
  devtool: isProd ? '' : 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    publicPath: '/',
    port: 8088
  }
}

module.exports = config
