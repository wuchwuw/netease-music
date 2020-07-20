const { resolve } = require('./util')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isProd = process.env.NODE_ENV === 'production'

module.exports = [
  // {
  //   test: /\.(ts|tsx)$/,
  //   enforce: 'pre',
  //   loader: 'eslint-loader',
  //   options: {
  //     emitWarning: true, // eslint警告
  //     formatter: require('eslint-friendly-formatter')
  //   },
  //   exclude: /node_modules/
  // },
  {
    test: /\.(ts|tsx|js|jsx)$/,
    loader: 'babel-loader',
    include: [resolve('src')]
  },
  {
    test: /\.less$/,
    use: [
      { loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader' },
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: '[local]___[hash:base64:5]'
          },
          importLoaders: 1
        }
      },
      {
        loader: "less-loader"
      }
    ]
  },
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader'
    ]
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 1,
      name: `/fonts/[name].[hash].[ext]`
    }
  },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      name: `[name].[hash].[ext]`,
      limit: 2000
    }
  }
]