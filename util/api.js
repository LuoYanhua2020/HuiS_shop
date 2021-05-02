// 声明BASE_URL，域名的前缀
const BASE_URL="http://47.56.173.44/shopdemo/public/index.php/addons/xshop"
// options就是调用myRequest传的请求后缀
export const myRequest=(options)=>{
	// 返回一个异步的封装
	return new Promise((resolve,reject)=>{
		// 发起请求
		uni.request({
			url:BASE_URL+options.url,
			// 拿到请求方式，不传默认为get
			method:options.method||'GET',
			// 请求数据不传默认空对象
			data:options.data||{},
			// 添加请求头
			// 有需要发送token的就在请求时加一个header属性，不然就默认为空对象
			header:{"Xshop-Token":options.header}||{},
			success: (res) => {
				// 判断请求失败就返回，显示提示消息
				if(res.statusCode !== 200){
					return
					// 显示提示消息
					uni.showToast({
						title:"获取数据失败啦"
					})
				}
				// 如果数据请求成功就调用Promise的resolve方法
				resolve(res)
			},
			// 服务器出问题，请求失败，返回错误信息
			// 如果是本地运行app.js配置环境，可以把cmd对话框关掉，模拟服务器出问题
			fail: (err) => {
				// 显示提示消息
				uni.showToast({
					title:"请求接口失败啦"
				})
				// 调用Promise的reject方法
				reject(err)
			}
		})
	})
}
// myRequest({
// 	url:'/nav',
// method:'POST',
// data:{nav_type: [0, 1, 2]}
// })