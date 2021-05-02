<template>
	<view class="detailsParent">
		<!-- 头部图片区域 -->
		<view class="GoodTop">
			<swiper class="GoodTopbanner" indicator-dots circular autoplay indicator-color="#dddddd">
			<!-- 轮播的每一项 -->
				<swiper-item v-for="(item,index) in List.image" :key="index">
					<!-- 使用样式嵌入，完美解决背景图大小居中问题！！ -->
					<view class="TopImg" :style="{backgroundImage:'url('+ List.image[0]+')',
					backgroundPosition:'center center',backgroundSize:'cover',backgroundRepeat:'no-repeat'}"></view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 价格详情区域 -->
		<view class="GoodContent">
			<view class="Content-one">
				<text>{{List.title}}</text>
			</view>
			<view class="Content-two">
				<text>￥{{skus.price}}</text>
				<span>{{skus.market_price}}</span>
			</view>
			<view class="Content-three">
				<view>
					<span>销量：</span>
					<span>{{skus.sold_count}} 个</span>
				</view>
				<view>
					<span>库存：</span>
					<span>{{skus.stock}} 个</span>
				</view>
			</view>
			<view class="Content-four" @click="Show">
				<view>
					<span>购买类型：</span>
					<text>{{skus.value}}</text>
				</view>
				<image src="../../static/index/icon-right.png"></image>
			</view>
		</view>
		<!-- 数量区域 -->
		<view class="GoodNumber">
			<text>数量</text>
			<view>
				<image @click="Numberreduce" mode="aspectFit" src="../../static/icon/reduce.png"></image>
				<text>{{quantity}}</text>
				<image @click="Numberadd" mode="aspectFit" src="../../static/icon/add.png"></image>
			</view>
		</view>
		<!-- 评论区域 -->
		<view class="GoodComment">
			<view class="Comment-one">
				<view>
					<text>评价</text>
					<span>({{Length}})</span>
				</view>
				<view>
					<text>好评率:</text>
					<span>{{Comment.good_review}}</span>
				</view>
			</view>
			<view class="Comment-two">
				<text>没有了</text>
			</view>
		</view>
		<!-- 图文详情区域 -->
		<view class="GoodImgDetails">
			<view class="ImgDetails-top">
				<text space="emsp">—— 图文详情 ——</text>
			</view>
			<!-- 如果他的数组长度没有2，说明只有头部展示行图片，没有详情图片 -->
			<view v-if="List.image.length>1" class="ImgDetails-img">
				<view v-for="(item,index) in List.image">
					<!-- 第一个是头部图片，要排除 -->
					<image v-if="index!=0" :src="item" mode="aspectFill"></image>
				</view>
			</view>
			<view v-else class="ImgDetails-null">
				
			</view>
		</view>
		<!-- 购物车下面的统计区域 -->
		<view class="EditBottom">
			<!-- 左边的清空按钮 -->
			<view class="EditBottom_left">
				<navigator url="../../pages/index/index" open-type='switchTab'>
					<image src="../../static/icon/home.png"></image>
					<text>首页</text>
				</navigator>
				<navigator url="../../pages/cart/cart" open-type='switchTab'>
					<image src="../../static/icon/cart.png"></image>
					<text>购物车</text>
				</navigator>
				<p @click="changeCollection">
					<image src="../../static/icon/Collection.png"></image>
					<!-- <image src="../../static/icon/Collectioned.png"></image> -->
					<text>收藏</text>
				</p>
			</view>
			<!-- 右边的文字、按钮 -->
			<view class="EditBottom_right">
				<button @click="BuyNow">立即购买</button>
				<button @click="AddCart">加入购物车</button>
			</view>
		</view>
		<!-- 弹出框组件 -->
		<uniPopup class="_popup" v-show="isShow"
		@childHide="Hide"
		 :PurchaseType="PurchaseType"
		 :number="quantity"
		 @Subtraction='Numberreduce'
		 @Add='Numberadd'
		 @Update="Pupdate"></uniPopup>
	</view>
</template>

<script>
	import uniPopup from "../uniPopup.vue";
	export default {
		data() {
			return {
				List:[],
				// 所有评论的数据
				Comment:[],
				Length:'',
				// 商品的数量
				quantity:1,
				// 存储skus
				skus:[],
				windowHeight: "200px",
				// 控制弹出框是否显示
				isShow:false,
				// 购买类型数据
				PurchaseType:[]
			}
		},
		components:{
			uniPopup
		},
		onLoad(options) {
			this.getSwipers(options.id)
			this.getComment(options.id)
		},
		methods: {
			// 发起请求数据的请求
			async getSwipers(id){
				const res=await this.$myRequest({
					url:"/product?id="+id
				})
				// console.log(res)
				this.List=res.data.data
				// console.log(this.List)
				// skus存储到本地data中
				this.skus=this.List.skus[0]
				// console.log(this.skus)
				// 将“购买类型”数据处理一下，放在同一个数组中，然后尺寸存在本地data中
				res.data.data.attrGroup.forEach((item,index)=>{
					// 记得添加id
					this.PurchaseType.push({name:item,id:index})
				})
				res.data.data.attrItems.forEach((item,index)=>{
					this.PurchaseType[index].content=item
				})
				// 类型结果数组与图片的数据
				this.PurchaseType.skus=this.List.skus
				this.PurchaseType.image=this.List.image
				// console.log(this.PurchaseType)
			},
			// 发起评论的请求
			async getComment(id){
				const res=await this.$myRequest({
					url:"/product/getReviews?id="+id+"&page=1"
				})
				// console.log(res)
				this.Comment=res.data.data
				// 评价的数量
				const num=this.Comment.data
				this.Length=num.length
				// console.log(this.Comment)
			},
			// 控制收藏的事件
			changeCollection(){
				
			},
			// 加入购物车
			async AddCart(){
				// 判断有没有登录
				if(uni.getStorageSync("token")){
					// 发起请求
					const res=await this.$myRequest({
						method:"POST",
						header:uni.getStorageSync("token"),
						url:'/cart/add',
						data:{sku_id:this.skus.id,quantity: this.quantity}
					})
					// 弹出添加购物车成功的提示信息
					uni.showToast({
					    title:"加入购物车成功！" 
					})
				}
			},
			// 产品数量减少
			Numberreduce(){
				if(this.quantity>1){
					this.quantity--
				}
			},
			Numberadd(){
				this.quantity++
			},
			// 立即购买
			BuyNow(){
				// 跳转页面传递参数
				uni.navigateTo({
					// 跳转页面，？后面跟id值
					// 把两个请求参数传过去
					url:"../CreateOrder/CreateOrder?sku_id="+this.skus.id+"&quantity="+this.quantity
				})
			},
			// 点击展示弹出框
			Show(){
				this.isShow=true;
			},
			// 接收子组件传递的弹框关闭事件
			Hide(e){//e==false
				this.isShow=e;
			},
			// 子组件的完成按钮，更新父组件数据
			Pupdate(e){
				// 这样，父组件的购买类型、价格.....自动全部更换最新的
				// 立即购买的BuyNow发送的this.skus.id也是最新的
				this.skus=e
			}
		}
	}
</script>

<style lang="less" scoped>
	uni-swiper .uni-swiper-dot-active {
	    width: 10px !important;  
	    background-color: #dddddd;  
		border-radius: 20rpx;
	}
	.detailsParent{
		// padding: 0 20rpx;
		// box-sizing: border-box;
		// display: flex;
		// justify-content: center;
		// flex-wrap: wrap;
		.GoodTop{
			width: 750rpx;
			height: 710rpx;
			overflow: hidden;
			.GoodTopbanner{
				width: 100%;
				height: 100%;
				.TopImg{
					width: 100%;
					height: 100%;
				}
			}
		}
		.GoodContent{
			width: 750rpx;
			height: 340rpx;
			box-sizing: border-box;
			padding: 28rpx;
			background-color: #ffffff;
			.Content-one{
				width: 100%;
				height: 90rpx;
				text{
					width: 100%;
					height: 100%;
					font-size: 34rpx;
				}
			}
			.Content-two{
				width: 100%;
				height: 44rpx;
				margin: 15rpx 0;
				text{
					color: red;
					font-size: 38rpx;
					margin-right: 15rpx;
				}
				span{
					font-size: 30rpx;
					color: #555555;
					text-decoration:line-through;
				}
			}
			.Content-three{
				width: 100%;
				height: 45rpx;
				display: flex;
				justify-content: space-between;
				view{
					width: 50%;
					height: 100%;
					span{
						width: 50%;
						height: 100%;
						text-align: center;
						color: #555555;
						font-size: 26rpx;
					}
				}
			}
			.Content-four{
				width: 100%;
				height: 60rpx;
				margin: 25rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				view{
					span{
						width: 50%;
						height: 100%;
						text-align: center;
						color: #555555;
						font-size: 33rpx;
					}
					text{
						width: 50%;
						height: 100%;
						text-align: center;
						color: #222222;
						font-size: 33rpx;
					}
				}
				image{
					width: 80rpx;
					height: 65rpx;
					margin-right: 15rpx;
				}
			}
		}
		.GoodNumber{
			width: 100%;
			height: 90rpx;
			background-color: #FFFFFF;
			margin-top: 5rpx;
			padding: 28rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			text{
				width: 70rpx;
				font-size: 31rpx;
				color: #555555;
			}
			view{
				width: 150rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				image{
					width: 70rpx;
					height: 70rpx;
				}
				text{
					text-align: center;
					font-size: 36rpx;
				}
			}
		}
		.GoodComment{
			width: 750rpx;
			background-color: #FFFFFF;
			margin-top: 15rpx;
			padding: 28rpx;
			box-sizing: border-box;
			.Comment-one{
				width: 100%;
				display: flex;
				justify-content: space-between;
				font-size: 31rpx;
				color: #555555;
			}
			.Comment-two{
				width: 100%;
				height: 40rpx;
				margin: 20rpx 0;
				text-align: center;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		.GoodImgDetails{
			width: 750rpx;
			background-color: #FFFFFF;
			margin-top: 15rpx;
			.ImgDetails-top{
				width: 100%;
				height: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				text{
					font-size: 39rpx;
					color: #555555;
					span{
						color: black;
					}
				}
			}
			.ImgDetails-img{
				width: 100%;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				image{
					width: 600rpx;
					height: 690rpx;
				}
			}
			.ImgDetails-null{
				width: 100%;
				height: 200rpx;
			}
		}
		.EditBottom{
			width: 94%;
			height:120rpx;
			box-shadow: 0 0 20rpx 0 #888888;
			border-radius: 18rpx;
			position: fixed;
			bottom: 25rpx;
			left: 50%;
			transform: translateX(-50%);
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #FFFFFF;
			.EditBottom_left{
				width: 45%;
				height:85rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				navigator,p{
					width: 33%;
					height: 100%;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					image{
						width:50rpx;
						height:50rpx;
						margin-bottom: 5rpx;
					}
					text{
						font-size: 25rpx;
						color: #888888;
					}
				}
			}
			.EditBottom_right{
				width: 55%;
				height:45px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: linear-gradient(90deg,#ffac30,#fa436a,#f56c6c);
				border-radius: 60rpx;
				button{
					width: 50%;
					height:40px;
					font-size: 30rpx;
					text-align: center;
					background-color: rgba(0,0,0,0);
					color: #FFFFFF;
				}
			}
		}
		._popup{
			width: 100%;
			height: 1350rpx;
			position: fixed;
			background-color: rgba(0, 0, 0, 0.4);
			top:90rpx;
			left:0rpx;
			overflow: hidden;
			animation-name: example;
			animation-duration: 1s;
		}
		// 使用css实现动画
		@keyframes example {
			from {
				transform: translateY(400%);
				opacity: 0;
			}
	
			to {
				transform: translateY(0%);
				opacity: 1;
			}
		}
	}
</style>
