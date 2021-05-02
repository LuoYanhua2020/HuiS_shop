<template>
	<view class="Login">
		<!-- 头部区域 -->
		<view class="Login_top">
			<text>欢迎回来！</text>
		</view>
		<!-- 身体区域 -->
		<view class="Login_content">
			<view class="contenttop">
				<!-- 添加点击事件，改变数据，达到切换类的效果 -->
				<view :class="loginWay==0?'active':''" @click="changeloginWay">
					<text>账号密码登录</text>
				</view>
				<!-- 添加点击事件，改变数据，达到切换类的效果 -->
				<view :class="loginWay==1?'active':''" @click="changeloginWay">
					<text>短信验证码登录</text>
				</view>
			</view>
			<view class="Content_content">
				<view class="content_top">
					<view v-show="loginWay==0">账户</view>
					<input v-show="loginWay==0" type="text" v-model="username" placeholder="请输入用户名/手机号码"/>
					<!-- 通过控制数据，控制显示两个内容 -->
					<view v-show="loginWay==1">手机号</view>
					<input v-show="loginWay==1" type="text" v-model="username" placeholder="请输入手机号码"/>
				</view>
				<view class="content_top content_bottom">
					<view v-show="loginWay==0">密码</view>
					<input v-show="loginWay==0" type="password" v-model="password" placeholder="8-18位不含特殊字符的数字"/>
					<!-- 通过控制数据，为false就显示三个内容 -->
					<view v-show="loginWay==1">验证码</view>
					<input v-show="loginWay==1" type="text" v-model="password" placeholder="请输入验证码"/>
					<p v-show="loginWay==1">获取验证码</p>
				</view>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="Login_bottom" @click="Gologin">
			<text>登录</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 定义一个数据，设置是账号密码状态还是短信验证码状态
				loginWay:0,
				// 用户名、账户
				username:'',
				// 密码、验证码
				password:''
			}
		},
		methods: {
			changeloginWay(){
				if(this.loginWay==0){
					this.loginWay=1
				}else{
					this.loginWay=0
				}
				this.password=""
				this.username=''
			},
			// 点击发起登录的请求
			async Gologin(){
				const res=await this.$myRequest({
					url:'/index/login',
					data:{
						username:this.username,
						password:this.password,
						loginWay:this.loginWay
					},
					method:"POST",
				})
				// console.log(res)
				// 如果请求成功，提示账户不正确
				if(res.statusCode===200){
					// 登录正确提示消息
					if(res.data.msg==''){
						uni.showToast({
							title:"登录成功!",
						})
						// 如果登录成功就将id与token值存储在本地的localStorage
						uni.setStorage({key: 'id',data: res.data.data.id});
						uni.setStorage({key: 'token',data: res.data.data.token});
						// 跳转到我的页面
						setTimeout(()=>{
							uni.switchTab({
							    url: '../member/member'
							})
						},1000)
						// 否则就把两个错误提示
					}else if(res.data.msg=='Account is incorrect'){
						uni.showToast({
							title:'账户名不符合规范',
							icon:'none'
						})
					}else if(res.data.msg=='Password is incorrect'){
						uni.showToast({
							title:'密码不符合规范',
							icon:'none'
						})
					}
				}
			}
		}
	}
</script>

<style lang="less">
page{
	background-color: #FFFFFF;
	.Login{
		padding: 0px 60rpx;
		box-sizing: border-box;
		.Login_top{
			width: 100%;
			height: 130rpx;
			margin-top: 140rpx;
			text{
				font-size: 50rpx;
				color: #555555;
			}
		}
		.Login_content{
			width: 100%;
			.contenttop{
				width: 100%;
				display: flex;
				justify-content:center;
				view{
					width: 230rpx;
					height: 80rpx;
					border:1px solid #dddddd;
					border-radius: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0 20rpx;
					text{
						color: #dddddd;
						font-size: 30rpx;
					}
				}
				.active{
					text{
						color: red;
					}
					border:1px solid red;
				}
			}
			.Content_content{
				width: 100%;
				// border:1px solid red;
				margin-top: 40rpx;
				.content_top{
					width: 100%;
					height: 130rpx;
					background-color: rgb(248,246,252);
					padding: 5px 20rpx;
					box-sizing: border-box;
					view{
						margin-top: 10rpx;
					}
					input{
						width: 90%;
						height: 50rpx;
						margin-top: 10rpx;
					}
				}
				.content_bottom{
					margin-top: 55rpx;
					position: relative;
					p{
						width: 170rpx;
						height: 45rpx;
						border:1px solid red;
						color: red;
						font-size: 30rpx;
						text-align: center;
						position: absolute;
						top:30rpx;
						right: 50rpx;
						border-radius: 20rpx;
					}
				}
			}
		}
		.Login_bottom{
			width: 100%;
			height: 80rpx;
			background-color: rgb(250,67,106);
			border-radius: 50rpx;
			text-align: center;
			margin-top: 70rpx;
			text{
				font-size: 45rpx;
				color: #FFFFFF;
				margin-top: 20rpx;
			}
		}
	}
	
}
</style>
