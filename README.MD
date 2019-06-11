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
> 1. BannerPlugin 为js文件添加注释信息

### 第三方库的两种引用方式
> 1. `expose-loader`,将库引入到全局作用域
> 2. `webpack.ProvidePlugin`, 内置插件，为每一个模块注入jquery变量

### Development / Production不同配置文件打包
> - webpack.base.js
> - webpack.prod.js
> - webpack.dev.js
> 步骤: 
> 1. 将开发环境和生产环境公用的配置放入base中，不同的配置放入prod或者dev中。
> 2. 然后在dev和prod中使用`webpack-merge`把自己的配置与base的配置合并后导出。
> 3. 将package.json中的脚本参数进行修改，通过`--config`手动指定特定的配置文件。(不加`--config`会默认使用webpack.config.js)。

### DefinePlugin
> - `DefinePlugin` 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 `DefinePlugin` 的用处，设置它，就可以忘记开发和发布构建的规则。

### module.hot
> - 模块热替换(hot module replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新所有类型的模块，而无需完全刷新。
> - 用法; 
``` 
    + if (module.hot) {
    +   module.hot.accept('./print.js', function() {
    +     console.log('Accepting the updated printMe module!');
    +     printMe();
    +   })
    + }

