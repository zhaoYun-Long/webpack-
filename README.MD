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
> - `DefinePlugin` 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 `DefinePlugin` 的用处.
### module.hot
> - 模块热替换(hot module replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新所有类型的模块，而无需完全刷新。
> - 用法; 
``` 
 if (module.hot) {
   module.hot.accept('./print.js', function() {
     console.log('Accepting the updated printMe module!');
     printMe();
   })
 }
```
### 关于webpack优化
1. production模式打包自带优化
- tree shaking
> tree shaking是一个术语，通常用于打包时移除js中未引用的代码（dead-code）,它依赖于es6模块化系统中import和export的**静态结构(编译时加载)**特性

- scope hoisting
> `scope hoisting`的作用是将模块之间的关系进行结果推测，可以将webpack打包出的代码更小，运行更快。
> `scope hoisting`的实现原理其实很简单，分析模块之间的依赖关系，尽可能把打散的模块合并到一个函数中去，但前期是不能造成代码冗余，因此只有那些被引用了一次的模块才能被合并（类似于预执行的效果）。由于`scope hoisting`需要分析出模块之间的依赖关系，因此代码中需要采用es6模块化语句，不然他将无法生效，原因也是因为es6模块化的**静态结构**
> `scope hoisting`使用了`ModuleConcatenationPlugin`,该插件`production`模式下默认启用，其他模式禁用
- 代码压缩
> 所有代码使用`UglifyjsPlugin`进行压缩，混淆

2. css优化
- 将css提取到独立文件中
> `mini-css-extract-plugin`是用于将css提取为独立的文件的插件，对每个包含css的js文件都会创建一个css文件，支持按需加载css和sourceMap。只能用在webpack4中，只针对css。
- 为css添加兼容性前缀
> 选择`postcss-loader`和`autoprefixer`， 并且需要一个配置文件。
- 开启css压缩(webpack5好像要集成此功能)
> 使用`optimize-css-assets-webpack-plugin`插件压缩css，但是配置css压缩时会覆盖掉webpack默认的优化配置，导致js代码无法压缩，所以需要手动导入压缩插件`terser-webpack-plugin`,然后配置`optimization`项。



