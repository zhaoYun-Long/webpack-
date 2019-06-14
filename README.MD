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

3. js优化
> - Code Spliting是webpack打包时用到的重要的优化特性之一，此特性能够把代码分离到不同的bundle中，然后可以按需加载或并行加载这些文件，代码分离可以用于获取更小的bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。有三种常见的优化方式
>
3.1 入口分离，使用`entry`配置手动的分离代码
如果入口chunks之间包含重复的模块，都会分别打包到对应的chunk文件中，且不够灵活
3.2 防止重复：，使用`SplitChunksPlugin`去重和分离chunk。默认vendors.js文件为抽出的公共js，如axios会抽出到一个单独的chunks文件中
> 使用
```
optimization: {
    splitChunks: {
    chunks: 'all'
    }
},
```
> `SplitChunksPlugin`中有一个`cacheGroups`缓存组配置
> cacheGroups: {
    // 此插件优先选择模块对应的规则组进行拆分
    // 如果这两项规则都符合，则选择权重高的一组
    vendors { // 自定义缓存组名, 通常用于第三方模块打包
      test: /[\\/]node_modules[\\/]/,
      priority: -10, // 权重
      ...
    },
    default: {  // 默认缓存组名, 通常用于自己写的模块打包
      priority: -20  // 权重
      minChunks: 2,  // 该模块至少被引用两次
      reuseExistingChunk: true, // 不会打包重用的代码
      ...
    }
  }

3.3 动态导入（懒加载）：通过模块的内联函数调用来分离代码
> webpack支持`import()`语法需要`@babel/plugin-syntax-dynamic-import`插件，动态导入的最大好处是实现了懒加载，用到哪个模块吃才会加载哪个模块，可以提高SPA应用的首屏加载速度，Vue，React，Angular框架的路由懒加载原理一样
> 用法： .babelrc文件中的plugins节点下添加`@babel/plugin-syntax-dynamic-import`
如果浏览器缺少Promise环境，则需要引入以下包使支持Promise
```
import "core-js/modules/es6.promise";
import "core-js/modules/es6.array.iterator";
```

3.4 noParse
> 功能： 阻止webpack解析一些没有其他依赖的库，提高打包速度
> 用法： 
    module: {
      noParse: /jquery|bootstrap/
    }

3.5 ignorePlugin
> 功能： 忽略第三方模块内部依赖的其他模块

3.6 `DllPlugin`与`DllReferencePlugin`
> 功能： 借助DllPlugin插件，实现将这些框架作为一个个的动态链接库，只构建一次，以后每次构件都只生成自己的业务代码，可以大大提高构建效率。主要思想在于，将一些不做修改的依赖文件，提前打包，这样我们开发代码发布的时候就不需要再对这部分代码进行打包，从而节省了打包时间。
> `DllPlugin`,使用一个单独webpack配置创建一个dll文件，并且它还创建一个manifest.json,DllReferencePlugin使用该json文件来做映射依赖性。（这个文件会告诉我们哪些文件已经提取打包好了）
> `DllReferencePlugin`,这个插件用于主webpack配置，他引用的dll需要预先构建依赖关系。
> 用vue举例：
  1. 准备一份将Vue打包成DLL的webpack配置文件,在build目录下新建一个文件，webpack.vue.js,
    配置入口：将多个要做成dll的库全放进来。
    配置出口：一定要设置library属性，将打包好的结果暴露在全局。
    配置plugin：设置打包后dll文件名和manifest文件所在地
  2. 在webpack.base.js中进行插件的配置
    使用`DllReferencePlugin`指定manifest文件的位置即可
  3. 使用`add-asset-html-plugin`将生成的vue_dll.js添加到目标html中

    



