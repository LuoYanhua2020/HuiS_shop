<template>
	<view class="ReceivingAddress">
		<!-- 用户没有收货地址的情况 -->
		<view class="Receiving_null" v-if="adressList.length==0">
			<image src="../../static/image/Receiving_address.png"></image>
		</view>
		<!-- 用户有收货地址的情况 -->
		<view v-else class="Receiving_Number">
			<view class="Receivings" v-for="item in adressList" :key="item.id">
				<!-- 判断如果是默认地址就显示，默认标识 -->
				<view v-if="item.is_default==1?true:false" class="ReceivingsLeft"><text>默认</text></view>
				<view class="Receivings_left">
					<view class="Adress_top">
						<text>{{item.address}}</text>
						<text>{{item.street}}</text>
					</view>
					<view class="Adress_bottom">
						<text>{{item.contactor_name}}</text>
						<text>{{item.phone}}</text>
					</view>
				</view>
				<view class="Receivings_right">
					<p @click="getDetails(item)" class="iconfont icon-bianji"></p>
					<p @click="removeDetails(item.id)" class="iconfont icon-shanchu1"></p>
				</view>
			</view>
		</view>
		<!-- 下方的按钮 -->
		<view class="BottomBth">
			<navigator url="../AddAddress/AddAddress">新增地址</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				adressList:[]
			}
		},
		onLoad() {
			this.getAdress()
		},
		methods: {
			// 获取收货地址的接口
			async getAdress(){
				const res=await this.$myRequest({
					url:'/user/getAddress',
					header:uni.getStorageSync("token")
				})
				this.adressList=res.data.data
				console.log(this.adressList)
			},
			getDetails(item){
				// 跳转到新增地址页面，传递数组参数
				uni.navigateTo({
					// 注意的是传递数据的时候必须使用 JSON.stringify 将其转为 JSON 字符串
					 url: `../AddAddress/AddAddress?item=${encodeURIComponent(JSON.stringify(item))}`,
				});
			},
			// 删除当前行的地址
			async removeDetails(id){
				// console.log(id)
				uni.showModal({
				    content: '亲，确认删除当前行地址吗',
				    success:async (res)=>{
					   	if (res.confirm) {
							// 点击确定就发起清空的请求
							const res=await this.$myRequest({
								url:'/user/delAddress',
								header:uni.getStorageSync("token"),
								data:{
									address_id:id
								},
								method:"POST",
							})
							// console.log(res)
							// 更新列表
							this.getAdress()
						} else if (res.cancel) {
							return
						}     
					}
				}); 
			}
		}
	}
</script>

<style lang="less">
	page{
		background-color: #FFFFFF;
	}
.ReceivingAddress{
	width: 750rpx;
	.Receiving_null{
		width: 100%;
		height: 700rpx;
		position: relative;
		image{
			width:180rpx;
			height:180rpx;
			position: absolute;
			left: 50%;
			bottom: 0rpx;
			transform: translateX(-50%);
		}
	}
	.BottomBth{
		width: 100%;
		height: 90rpx;
		position: fixed;
		left: 0rpx;
		bottom: 10rpx;
		display: flex;
		justify-content: center;
		navigator{
			width: 90%;
			height: 100%;
			font-size: 20px;
			color: #fff;
			background-color: #fa436a;
			text-align: center;
			padding-top: 20rpx;
			box-sizing: border-box;
			border-radius: 10px;
		}
	}
	.Receiving_Number{
		width: 100%;
		border-top: 1px solid rgba(0,0,0,0.15);
		padding-bottom: 100rpx;
		.Receivings{
			width: 100%;
			padding: 15rpx 20rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid rgba(0,0,0,0.15);
			.ReceivingsLeft{
				width:13%;
				display: flex;
				justify-content: center;
				align-items: center;
				text{
					color: red;
					font-size: 20rpx;
					border:1px solid red;
					padding: 7rpx;
					box-sizing: border-box;
				}
			}
			.Receivings_left{
				width:75%;
				.Adress_top{
					width: 100%;
					padding: 5rpx 0;
					text{
						font-size: 30rpx;
						margin-right: 20rpx;
					}
				}
				.Adress_bottom{
					width: 100%;
					padding: 15rpx 0;
					text{
						font-size: 28rpx;
						color: #909399;
					}
					text:nth-child(1){
						margin-right: 15rpx;
					}
				}
			}
			.Receivings_right{
				width:18%;
				display: flex;
				justify-content: space-evenly;
				align-items: center;
			}
		}
	}
}
</style>
