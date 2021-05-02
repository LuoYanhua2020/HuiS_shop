<template>
	<view class="OmoduleParent">
		<!-- 头部时间与文字 -->
		<view class="ModuleTop">
			<p>{{item.create_time_text}}</p>
			<!-- 判断，如果请求的status参数是-1，就是被取消的订单，显示删除按钮 -->
			<p><text>{{item.state_tip}}</text><span @tap="remove" v-if="item.status==-1?true:false" class="iconfont icon-shanchu1"></span></p>
		</view>
		<!-- 产品内容 -->
		<view class="ModuleContent">
			<!-- 上半部分的图文 -->
			<!-- 一个订单只有一个商品种类:通过判断商品只有一个种类显示，否则就显示另外一个 -->
			<view class="ModuleContentone" v-if="sing==1">
				<view><image :src="ItemContent.images[0]"></image></view>
				<view class="Contentsone">
					<p><span>{{ItemContent.title}}</span></p>
					<text>{{ItemContent.attributes}}<span>x{{ItemContent.quantity}}</span></text>
					<p>￥{{ItemContent.price}}</p>
				</view>
			</view>
			<!-- 一个订单有多个商品种类:就只显示每个商品的图片，不显示详细信息了! -->
			<view class="ModuleContentone_Img" v-else>
				<view v-for="item2 in Double" class="One_Img">
					<image :src="item2.images[0]"></image>
				</view>
			</view>
			<view class="ModuleContenttwo">
				<text>共{{sing}}件商品  实付款<span>￥{{item.products_price}}</span></text>
			</view>
		</view>
		<!-- 按钮区域 -->
		<view class="OrderBth" v-show="item.status==-1?false:true">
			<view>
				<!-- 使用子传父，@tap添加点击事件,不是@click了 -->
				<button @tap="Cancel">取消订单</button>
				<button @tap="Payment">立即支付</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:{
				type:Object, //参数名
				default:""
			}
		},
		data() {
			return {
				// 把具体的图标信息放在本地data
				// ItemContent:this.item.products[0],
				ItemContent:{},
				Double:[]
			};
		},
		computed:{
			sing(){
				return this.item.products.length
			}
		},
		// 记得，要是页面的钩子函数：
		created() {
			// console.log(this.item)
			// // 考虑到不止一款商品在同一行加入订单
			if(this.item.products.length>=2){
				this.Double=this.item.products	
			}else{
				this.ItemContent=this.item.products[0]
			}
		},
		methods:{
			Cancel(){
				// 把需要发起请求的订单号传给父级发起请求
				this.$emit("SonCancel",this.item.order_sn)
			},
			// 删除按钮
			remove(){
				// 其实删除按钮和取消订单按钮都是传order_sn，值发起请求，可以优化的！
				this.$emit("SonRemove",this.item.order_sn)
			}
		}
	}
</script>

<style scoped lang="less" scoped>
	// 删除按钮的样式
	.icon-shanchu1:before {
		color: #888888 !important;
		font-size: 35rpx;
		margin-left: 20rpx;
		border-left: 1px solid rgba(0,0,0,0.2);
		padding-left: 20rpx;
	}
.OmoduleParent{
	width: 100%;
	height: 420rpx;
	background-color: #FFFFFF;
	margin-top: 10rpx;
	.ModuleTop{
		width: 100%;
		height: 70rpx;
		border-bottom: 1px solid rgba(0,0,0,0.08);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 25rpx;
		box-sizing: border-box;
		p{
			font-size: 28rpx;
		}
		text{
			font-size: 28rpx;
			color: #888888;
		}
	}
	.ModuleContent{
		width: 100%;
		height: 240rpx;
		padding: 0 25rpx;
		box-sizing: border-box;
		border-bottom: 1px solid rgba(0,0,0,0.08);
		.ModuleContentone{
			height: 150rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			view:nth-child(1){
				width: 20%;
				height: 140rpx;
				overflow: hidden;
				image{
					width: 140rpx;
					height: 140rpx;
				}
			}
			.Contentsone{
				width: 70%;
				height: 100%;
				p{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					span{
						font-size: 30rpx;
						width: 90%;
						margin-right: 10rpx;
					}
				}
				text{
					display: block;
					font-size: 28rpx;
					color: #909399;
					margin: 15rpx 0;
					span{
						font-size: 30rpx;
						margin-left: 10rpx;
					}
				}
			}
		}
		.ModuleContentone_Img{
			height: 160rpx;
			display: flex;
			justify-content: start;
			overflow: hidden;
			.One_Img{
				width: 20%;
				height: 140rpx;
				
				overflow: hidden;
				margin-right: 10rpx;
				image{
					width: 140rpx;
					height: 140rpx;
				}
			}
		}
		.ModuleContenttwo{
			width: 100%;
			height: 60rpx;
			position: relative;
			text{
				position: absolute;
				right: 0rpx;
				top:10rpx;
				color: #909399;
				font-size: 30rpx;
				span{
					margin-left: 15rpx;
					color: black;
				}
			}
		}
	}
	.OrderBth{
		width: 100%;
		height: 110rpx;
		padding: 0 25rpx;
		box-sizing: border-box;
		// border:1px solid red;
		position: relative;
		view{
			position: absolute;
			right: 0rpx;
			top: 5rpx;
			display: flex;
			justify-content: right;
			button{
				width: 180rpx;
				height: 70rpx;
				margin: 5px 15rpx;
				background-color: rgba(0,0,0,0);
				border: 1px solid rgba(0,0,0,0.08);
				border-radius: 40rpx;
				font-size: 28rpx;
			}
			button:nth-of-type(2){
				color: #fa436a;
				background-color: rgb(253,245,230);
			}
		}
	}
}
</style>
