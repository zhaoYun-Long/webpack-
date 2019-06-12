const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 将css提取到独立文件中
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpack = require('webpack')

module.exports = {
  entry: {
    index: './src/index.js',
    demo: './src/demo.js'
  },
  output: {
    filename: '[name].bundle.js',
    // 需要绝对路径
    path: path.resolve(__dirname, '..', 'dist')
  },
  module: {
    rules: [
      {
        // 如果用到了MiniCssExtractPlugin，则需要将style-loader替换为MiniCssExtractPlugin.loader
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          // 添加私有前缀
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
            { 
                loader: 'url-loader',
                 options: {
                     name: '[name]-[hash:6].[ext]',
                     limit: 5 * 1024,
                     outputPath: 'images'
                 }
             }
        ]
      },
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         use: [
           { 
               loader: 'url-loader',
                options: {
                    name: '[name]-[hash:6].[ext]',
                    outputPath: 'font'
                }
            }
         ]
       },
       {
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader'
       },
       {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
      //  {
      //   // `expose-loader`,将库引入到全局作用域
      //    // 解析jquery模块的绝对路径
      //    test: require.resolve('jquery'),
      //    use: {
      //      loader: 'expose-loader',
      //      options: '$'
      //    }
      //  }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['dist']
    }),
    // 多页面应用程序，多个new HtmlWebpackPlugin()
    new HtmlWebpackPlugin({
      filename: 'index.html',
      // template: path.join(__dirname, '..', './src/index.html'),
      template: path.join(__dirname, '..', 'src/index.html'),
      // 指定js文件
      chunks: ['index', 'demp']
    }),
    new HtmlWebpackPlugin({
      filename: 'demo.html',
      // template: path.join(__dirname, '..', './src/demo.html'),
      template: './src/demo.html',
      chunks: ['demo']
    }),
    // to的路径后自动导入到output中的dist目录
    new CopyWebpackPlugin([
        { from: path.join(__dirname, '..', 'assets'), to: 'assets' }
    ]),
    new MiniCssExtractPlugin({
      filename: 'test.css'
    }),
    new webpack.BannerPlugin('这是bannerPlugin'),
    // 使用内置模块ProvidePlugin为每一个模块注入jquery变量
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery'
    // })
  ]
};