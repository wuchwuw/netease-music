const { resolve } = require('./util')
const loaders = require('./loaders')
const plugins = require('./plugins')
const TerserPlugin = require('terser-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

const config = {
  mode: isProd ? 'production' : 'development',
  entry: {
    main: resolve('src/index.tsx')
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    publicPath: '/',
    // sourceMapFilename: "[name].[id].[hash:8].js.map",
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
    }
  },
  module: {
    rules: loaders
  },
  plugins,
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // 如果在生产环境中使用 source-maps，必须设置为 true
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
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
  devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    publicPath: '/',
    port: 8088
  }
}

module.exports = config
