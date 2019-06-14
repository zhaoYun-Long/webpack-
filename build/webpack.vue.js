// 这个webpack的配置文件就是用来打包vue全家桶的
const path = require('path')
const webpack = require('webpack')
module.exports = {
    mode: 'production',
    entry: {
        vue: [
            'vue/dist/vue.js',
            'vue-router'
        ]
    },
    output: {
        // output要使用绝对路径
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]_dll.js',
        library: '[name]_dll'  // 最终会在全局暴露出一个vue_dll对象
    },
    plugins: [
        // 生成清单文件
        new webpack.DllPlugin({
            name: '[name]_dll',
            // path: manifest.json生成的文件夹及名字
            // manifest.json:清单文件
            path: path.resolve(__dirname, '../dist/manifest.json')
        })
    ]
}