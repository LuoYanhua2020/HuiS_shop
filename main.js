import Vue from 'vue'
import App from './App'
// 引入api.js文件
import {myRequest} from './util/api.js'
// 挂载到全局，让每个页面都可以调用$myRequest方法
Vue.prototype.$myRequest=myRequest

//引入vuex
import store from './store/store.js'
//把vuex定义成全局组件
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'



const app = new Vue({
    ...App,
	//挂载
	store
})
app.$mount()
