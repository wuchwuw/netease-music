const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('./util')
const isProd = process.env.NODE_ENV === 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SentryWebpackPlugin = require("@sentry/webpack-plugin")
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const WorkboxPlugin = require('workbox-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// const isProd = process.env.NODE_ENV === 'production'

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"'+ process.env.NODE_ENV + '"',
    }
  }),
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    // favicon: resolve('src/favicon.ico'),
    filename: 'index.html',
    template: resolve('public/index.html'),
    inject: true
  })
]

if (isProd) {
  plugins = plugins.concat([
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: 'chunks/[name].[id].[hash:8].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      inject: true,
      favicon: 'public/favicon.ico',
      chunksSortMode: 'dependency',
      minify: {
        // https://github.com/kangax/html-minifier#options-quick-reference
        removeComments: true,
        collapseWhitespace: true
      },
      cnzz: true
    }),
    new SentryWebpackPlugin({
      // sentry-cli configuration
      authToken: '51729a6886c9460d89d5b4f8f76c87f7408b0f01f6f344738d58a1c3f2ee4d8d',
      org: "wu-chong",
      project: "wu-chong",
      include: ".",
      ignore: ["node_modules", "webpack.config.js", '.prettierrc.js'],
    }),
  ])
}

// if (process.env.analyze === 'true') {
//   plugins.push(new BundleAnalyzerPlugin())
// }

module.exports = plugins