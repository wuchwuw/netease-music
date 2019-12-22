const { resolve } = require('./util')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// const isProd = process.env.NODE_ENV === 'production'

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
      { loader: 'style-loader' },
      {
        loader: "css-loader"
        // options: {
        //   sourceMap: true,
        //   modules: true
        // }
      },
      {
        loader: "less-loader"
      }
    ]
  },
  // {
  //   test: /\.less$/,
  //   use: [
  //     'style-loader',
  //     'css-loader',
  //     'less-loader'
  //   ]
  // },
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
  // {
  //   test: /\.styl$/,
  //   use: [
  //     isProd ? MiniCssExtractPlugin.loader : 'style-loader',
  //     'css-loader',
  //     'stylus-loader'
  //   ]
  // },
  // {
  //   test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  //   loader: 'url-loader',
  //   options: {
  //     limit: 1,
  //     name: 'fonts/[name].[hash].[ext]'
  //   }
  // },
  // {
  //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  //   loader: 'url-loader',
  //   options: {
  //     name: `images/[name].[hash].[ext]`,
  //     limit: 2000
  //   }
  // }
]