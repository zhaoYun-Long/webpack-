// import moment from 'moment'
// 手动引入语言包
// import 'moment/locale/zh-cn'

console.log('我是index.js')
// function *aa() {
//     return 666
// }

// import axios from 'axios'
// axios.get('/')

// import vue from 'vue'  //runtime-only的vue包
import Vue from 'vue/dist/vue.js'  //runtime-only的vue包
new Vue({
    el: '#App',
    data: {
        message: 'hello worlld'
    }
})