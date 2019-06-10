## webpack小知识点笔记

### 关于 url-loader
> 1. url-loader是对file-loader进行的封装，使用时要提前安装file-loader。
> 2. 功能更强大，小于limit的将转为base64格式的数据。（大图没必要转为base64）。
> 3. outputPath: '文件夹名字' (打包完成后的图片会放在dist下的对应的文件夹中)。
> 4. name: '[name]-[hash:6].[ext]', 自定义打包后的图片名

### 关于 babel-loaer
> 1. 在babel7中，所有的模块都放在@babel下，@babel/core为核心包, @babel/preset-env为语法包
> 2. 当使用generate或async时，需要安装`@babel/plugin-transform-runtime (-D) @babel/runtime (-S)`
> 3. babel在看到对象调用方法时默认不会进行转换,所以如同includes这样的新方法，babel默认不会转换，此时需要@babel/polyfill

### 关于source map
> 1. 推荐使用`cheap-module-eval-source-map`, cheap相对较快, eval不会额外生成map文件

### 关于clean-webpack-plugin
> 1. 用法改了，详见文档

### webpack内置插件
1. BannerPlugin 为js文件添加注释信息

