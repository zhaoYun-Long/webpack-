const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const webpack = require('webpack')

// 配置css压缩时会覆盖掉webpack默认的优化配置，导致js代码无法压缩，所以需要手动导入压缩插件
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV: 'false',
      test: '2'  // test后得字符串将作为js代码解析，此处的test将被解析为Number2
    })
  ],
  optimization: {
    minimizer: [new TerserPlugin({}), new OptimizeCssAssetsPlugin({})]
  }
})
