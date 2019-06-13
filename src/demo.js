// console.log('我是demo.js')
// function *aa() {
//     return 666
// }

// aa().next()
// import './api/test.css'
// 测试动态导入
console.log('测试动态导入')
// 动态导入jquery
import('jquery').then(({ default: $ }) => {
    // 执行resolve是表示jquery导入完成
})

