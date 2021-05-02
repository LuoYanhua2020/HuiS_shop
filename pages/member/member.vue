<template>
	<view class="pageParent">
		<!-- 登录上背景与下面的立即登录模块 -->
		<view class="page_header">
			<image src="../../static/image/user-bg.jpg" mode="aspectFill"></image>
			<view class="page_headbg">
				<image src="../../static/image/vip-card-bg.png"></image>
				<navigator url="../../pages/Login/Login" v-show="UserList.length==0">立即登录</navigator>
			</view>
			<!-- 登录头像与文字 -->
			<p class="page_headcontent">
				<image v-show="UserList.length==0" src="../../static/image/default_img.jpg" mode="aspectFill"></image>
				<image v-show="UserList.length!=0" :src="UserList.avatar" mode="aspectFill"></image>
				<text v-show="UserList.length==0">登录</text>
				<text v-show="UserList.length!=0">{{UserList.nickname}}</text>
			</p>
		</view>
		<!-- （优化,使用v-for）全部订单模块 -->
		<view class="Allorder">
			<navigator class="orders" url="../../components/Order/Order?state=0">
				<view><image mode="aspectFit" src="../../static/image/All_orders.png"></image></view>
				<text>全部订单</text>
			</navigator>
			<navigator class="orders" url="../../components/Order/Order?state=1">
				<view><image mode="aspectFit" src="../../static/image/To_paid.png"></image></view>
				<text>待付款</text>
			</navigator>
			<navigator class="orders" url="../../components/Order/Order?state=2">
				<view><image mode="aspectFit" src="../../static/image/To_received.png"></image></view>
				<text>待收货</text>
			</navigator>
			<navigator class="orders" url="../../components/Order/Order?state=3">
				<view><image mode="aspectFit" src="../../static/image/To_evaluated.png"></image></view>
				<text>待评价</text>
			</navigator>
		</view>
		<!-- 地址管理栏 -->
		<view class="AddManagement">
			<view class="AddManagements">
				<view>
					<image src="../../static/image/adress.png"></image>
				</view>
				<navigator url="../../components/Receiving_address/Receiving_address">
					<text>地址管理</text>
					<image src="../../static/index/icon-right.png"></image>
				</navigator>
			</view>
			<view class="AddManagements">
				<view>
					<image src="../../static/image/like.png"></image>
				</view>
				<navigator>
					<text>我的收藏</text>
					<image src="../../static/index/icon-right.png"></image>
				</navigator>
			</view>
			<view class="AddManagements">
				<view>
					<image src="../../static/image/serUp.png"></image>
				</view>
				<navigator url="../../components/setUp/setUp">
					<text>设置</text>
					<image src="../../static/index/icon-right.png"></image>
				</navigator>
			</view>
		</view>
		<!-- 登录后会显示一个“退出登录" 的按钮-->
		<view class="MemberGo" v-show="UserList.length!=0">
			<button @click="signOut">退出登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 验证是否登录，有无token，控制页面元素的显示与隐藏
				// isShow:false,
				// 现在不用了，直接判断里面有没有值，检验有没有登录
				UserList:[]
			}
		},
		// 反复打开页面出发
		onShow(){
			// 页面加载，判断有没有登录，有无token值
			this.getLocal()
		},
		methods: {
			async getLocal(){
				// 判断有没有登录，有无token值
				if(uni.getStorageSync("token")){
					// 发起请求：
					const res=await this.$myRequest({
						url:'/user',
						header:uni.getStorageSync("token")
					})
					// console.log(res)
					// 发起请求的同时，存数据在vuex中
					// "getUserModel"指定mutations里面的方法
					// res.data.data是存的变量
					this.$store.commit('setUserModel',res.data.data)
					// 拿取vuex里面的数据放在本地data中
					this.UserList=this.$store.getters.getUserModel
					// console.log(this.UserList)
				}else{
					this.UserList=[]
					// 在vuex中的数据也要清除
					this.$store.commit('removeUserModel')
					// console.log(this.UserList)
				}
			},
			// 退出登录
			async signOut(){
				if(uni.getStorageSync("token")){
					const res=await this.$myRequest({
						url:'/index/logout',
						method:"POST",
						header:uni.getStorageSync("token")
					})
					// 清除本地的token
					uni.removeStorage({key: 'id'});
					uni.removeStorage({key: 'token'});
					uni.showToast({
						title:'退出登录成功！',
						icon:'success'
					})
					// 刷新页面
					this.getLocal()
				}
			}
		}
	}
</script>

<style lang="less">
	.pageParent{
		.page_header{
			width: 100%;
			height: 430rpx;
			background-color: #FFFFFF;
			position: relative;
			border-bottom-right-radius:20%;
			border-bottom-left-radius:20%;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
			.page_headbg{
				width: 90%;
				height: 400rpx;
				background-color: #000000;
				opacity: 0.75;
				position: absolute;
				top:300rpx;
				left: 38rpx;
				border-radius: 50rpx;
				overflow: hidden;
				image{
					width: 90%;
					height: 90%;
					position: absolute;
					top:10rpx;
					left: 200rpx;
				}
				navigator{
					width: 160rpx;
					height: 50rpx;
					position: absolute;
					top:20rpx;
					right: 50rpx;
					text-align: center;
					line-height: 50rpx;
					font-size: 10rpx;
					color: #36343c;
					border-radius: 20rpx;
					background: -webkit-gradient(linear,left top,right top,from(#f9e6af),to(#ffd465));
				}
			}
			.page_headcontent{
				position: absolute;
				top:120rpx;
				left: 50rpx;
				display: flex;
				align-items: center;
				image{
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
					margin-right: 30rpx;
				}
				text{
					font-size: 25px;
				}
			}
		}
		.Allorder{
			width: 90%;
			height: 210rpx;
			display: flex;
			justify-content: space-between;
			background-color: #FFFFFF;
			margin: 40rpx 0 0 40rpx;
			border-radius: 40rpx;
			display: flex;
			align-items: center;
			.orders{
				width: 25%;
				height: 110rpx;
				display: flex;
				justify-content:center;
				align-items: center;
				flex-wrap: wrap;
				image{
					width: 60rpx;
					height: 60rpx;
				}
				text{
					width: 100%;
					text-align: center;
				}
			}
		}
		.AddManagement{
			width: 90%;
			height: 380rpx;
			margin: 15rpx 0 0 40rpx;
			background-color: #FFFFFF;
			padding: 2rpx 30rpx;
			box-sizing: border-box;
			.AddManagements{
				width: 100%;
				height: 70rpx;
				padding:20rpx 0px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				view{
					width: 10%;
					height: 100%;
					display: flex;
					align-items: center;
					image{
						width: 51rpx;
						height: 45rpx;
					}
				}
				navigator{
					width: 90%;
					height: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1px solid #dddddd;
					padding:10rpx 0px;
					image{
						width: 80rpx;
						height: 80rpx;
					}
					text{
						font-size: 30rpx;
					}
				}
			}
			view:nth-child(3){
				view:nth-child(2){
					border-bottom: 0px;
				}
			}
		}
		.MemberGo{
			width: 90%;
			height: 100rpx;
			margin: 0 auto;
			background-color: #FFFFFF;
			display: flex;
			justify-content: center;
			uni-button:after{
				border: 0px !important;
			}
			button{
				width: 250rpx;
				height: 80rpx;
				font-size:35rpx;
				color: red;
				background-color: initial;
			}
		}
	}
	
</style>
