<template>
	<view class="BoutiqueParent">
		<view class="BoutiqueTop">
			<text>{{Boutique.title}}</text>
		</view>
		<view class="BoutiqueContent">
			<ul>
				<li @click="navItemClick(item.id)" v-for="item in Boutique.products" :key="item.id">
					<view class="ItemImg" :style="{backgroundImage:'url('+ item.image[0]+')',
					backgroundPosition:'center center',backgroundSize:'cover',backgroundRepeat:'no-repeat'}">
					</view>
					<view>
						<span>{{item.title}}</span>
					</view>
					<text>￥{{item.price}}</text>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	export default {
		props:["Boutique"],
		data() {
			return {
				
			};
		},
		methods:{
			navItemClick(Id){
				this.$emit("navClickGo",Id)
			}
		}
	}
</script>

<style lang="less">
	.BoutiqueParent{
		margin-top: 20rpx;
		.BoutiqueTop{
			width: 100%;
			height: 85rpx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			border-left: 3px solid #fc7592;
			text{
				font-size: 30rpx;
				margin-left: 20rpx;
			}
		}
		.BoutiqueContent{
			margin-top: 5rpx;
			padding:5rpx 0;
			width: 750rpx;
			height: 340rpx;
			display: flex;
			justify-content: space-around;
			overflow: hidden;
			ul{
				width: 150%;
				height: 340rpx;
				display: flex;
				justify-content: space-between;
				flex-wrap: nowrap;
				background-color: #ffffff;
				// 让超出部分可以滑动---------------
				//设置x轴可滑动 
				overflow-x: auto; 
				//元素不换行
				white-space:nowrap;
				li{
					width: 200rpx;
					height: 340rpx;
					padding: 0 15rpx;
					.ItemImg{
						width: 200rpx;
						height: 60%;
					}
					view{
						// 文字部分变成小圆点
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-size: 28rpx;
					}
					text{
						font-size: 27rpx;
						color: red;
					}
				}
			}
		}
	}
</style>
