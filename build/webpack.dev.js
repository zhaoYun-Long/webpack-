const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const webpack = require('webpack')
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV: 'true',
      test: '2'  // test后得字符串将作为js代码解析，此处的test将被解析为Number2
    })
  ]
})
