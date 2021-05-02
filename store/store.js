import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
		// 把信息全部存在UserList中
		UserList:[]
	},
    mutations: {
		setUserModel(state,Model){
			state.UserList = Model
			// console.log(state.UserList)
		},
		// 定义一个清除UserList的方法
		removeUserModel(state){
			state.UserList =[]
		}
	},
	// 拿取数据调用：this.$store.getters.（方法名）
    getters:{
		getUserModel: (state) => {
		    // 返回改变后的数据结构
			return state.UserList
		 }
	}
})
export default store