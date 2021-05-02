<template>
	<view>
		<view class="payTop">
			<text>支付金额</text>
			<p>￥{{options.orderPrice}}</p>
		</view>
		<view class="Img">
			<view>
				<image src="../../static/icon/pay.png"></image>
				<text>支付宝支付</text>
			</view>
			<image src="../../static/icon/selected.png"></image>
		</view>
		<view class="Bottom">
			<button @click="SubmitOrder">确认支付</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options:[]
			}
		},
		onLoad(options) {
			console.log(options)
			// 把order_sn: O2021042199559997传入data
			this.options=options
		},
		methods:{
			async SubmitOrder(){
				const res=await this.$myRequest({
					url:'/order/info?order_sn='+this.options.order_sn,
					header:uni.getStorageSync("token")
				})
				console.log(res)
				if(res.data.data==null){
					// 如果发生错误，提示错误信息
					uni.showToast({
					    title:res.data.msg,
						icon:"none"
					})
				}else{
					uni.showToast({
					    title:'提交订单成功！'
					})
					// 跳转到我的页面
					// 注意！！！跳转到 tabBar 页面只能使用 switchTab 跳转
					setTimeout(()=>{
						uni.switchTab({
							url:"../../pages/member/member"
						})
					},1000)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
	    background-color:#fff !important;
	}
	.payTop{
		width: 100%;
		height: 280rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
		text{
			font-size: 30rpx;
			color: #909399;
		}
		p{
			width: 100%;
			text-align: center;
			font-size: 60rpx;
			font-weight: 20rpx;
		}
	}
	.Img{
		width: 90%;
		height: 130rpx;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #e4e7ed;
		view{
			width:260rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			text{
				font-size: 33rpx;
			}
			image{
				width: 60rpx;
				height: 60rpx;
			}
		}
		image{
			width:50rpx;
			height:50rpx;
		}
	}
	.Bottom{
		width: 100%;
		margin-top: 60rpx;
		display: flex;
		justify-content: center;
		button{
			width: 90%;
			height: 90rpx;
			font-size: 17px;
			color: #fff;
			background-color: #fa436a;
			border-radius: 5px;
		}
	}
</style>
