<template>
	<view class="home">
		<index-top></index-top>
		<!-- 轮播图组件 -->
		<view class="Swiper">
			<swiper indicator-dots circular autoplay indicator-color="#dddddd">
			<!-- 轮播的每一项 -->
				<swiper-item v-for="item in swiper" :key="item.id">
					<image :src="item.image" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 产品分类区域 -->
		<view class="classiF">
			<view class="classChild" v-for="item in classification" :key="item.id" @click="PushGo(item.target)">
				<view>
					<image :src="item.image"></image>
				</view>
				<text>{{item.title}}</text>
			</view>
		</view>
		<!-- 广告栏区域 -->
		<view class="advertiseM">
			<image :src="advertisement.image"></image>
		</view>
		<!-- 分类精选文字栏 -->
		<navigator class="FenContent" url="../classif/classif" open-type='switchTab'>
			<view>
				<image src="../../static/icon/h1.png"></image>
				<text>分类精选</text>
			</view>
			<image src='../../static/index/icon-right.png'></image>
		</navigator>
		<!-- 精品沙发区域 -->
		<boutique-area :Boutique="BoutiqueSofa" @navClickGo="navClickGoItem"></boutique-area>
		<!-- 精品女装区域 -->
		<boutique-area :Boutique="BoutiqueWomen" @navClickGo="navClickGoItem"></boutique-area>
	</view>
</template>

<script>
	// 引入首页头部组件
	import indexTop from '../../components/index/index-Top.vue'
	// 引入精品模块组件
	import BoutiqueArea from '../../components/index/Boutique-area.vue'
	
	export default {
		data() {
			return {
				// 轮播图的数据
				swiper:[],
				// 分类的数据
				classification:[],
				// 广告栏数据
				advertisement:[],
				// 精品沙发区域数据
				BoutiqueSofa:[],
				// 精品女装区域数据
				BoutiqueWomen:[]
			}
		},
		onLoad() {
			this.getSwipers(),
			// 调用精品区域数据的请求
			this.getBoutique()			
		},
		methods: {
			// 发起请求，获取轮播图的数据
			async getSwipers(){
				// console.log("获取数据")
				
				// 封装后的发起请求
				// 返回promise对象就可以使用async优化
				const res=await this.$myRequest({
					url:'/nav',
					data:{nav_type: [0, 1, 2]},
					method:"POST",
				})
				// console.log(res)
				// 赋值给轮播图的数据容器
				this.swiper=res.data.data[0]
				// 赋值给产品分类区域的数据容器
				this.classification=res.data.data[1]
				// 赋值给广告区域的数据容器
				this.advertisement=res.data.data[2][0]
			},
			// 在首页发起产品的请求，传给子组件
			async getBoutique(){
				const res=await this.$myRequest({
					url:'/product/getHomeProducts',
				})
				// console.log(res)
				// 传值给data的精品沙发区域数据
				this.BoutiqueSofa=res.data.data.home_recommend_products[0]
				// 传值给data的精品女装区域数据
				this.BoutiqueWomen=res.data.data.home_recommend_products[1]
			},
			// 导航点击跳转到商品详情页
			navClickGoItem(Id){
				// 得到每一个产品唯一的id为索引，跳转相应的页面
				// console.log(Id)
				// 进行页面的跳转
				uni.navigateTo({
					// 跳转页面，？后面跟id值
					url:"../../components/details/details?id="+Id
				})
			},
			// 跳转商品列表页,接收数据item
			PushGo(item){
				// console.log(item)
				// 跳转页面
				uni.navigateTo({
					// 把parent_id传过去，是那个页面的请求参数
					url:"../../components/goods/goods?id="+item
				})
			}
		},
		components:{
			indexTop,
			BoutiqueArea
		}
	}
</script>

<style lang="less" scoped>
	.home{
		.Swiper{
			padding-top: 15rpx;
			swiper{
				width: 710rpx;
				height: 370rpx;
				margin: 0rpx auto;
				border-radius: 15rpx;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.classiF{
			width: 750rpx;
			height: 165rpx;
			display: flex;
			justify-content: space-around;
			padding: 25rpx 0;
			background-color: #FFFFFF;
			.classChild{
				width: 23%;
				height: 100%;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				view{
					width: 100%;
					height: 65%;
					text-align: center;
					image{
						width: 70%;
						height: 100%;
					}
				}
				text{
					font-size: 30rpx;
					text-align: center;
				}
			}
		}
		.advertiseM{
			width: 750rpx;
			height: 180rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.FenContent{
			width: 750rpx;
			height: 130rpx;
			background-color: #ffffff;
			margin-top: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 40rpx;
			box-sizing: border-box;
			view{
				display: flex;
				justify-content: space-between;
				align-items: center;
				image{
					width: 90rpx;
					height: 90rpx;
					margin-right: 20rpx;
				}
				text{
					font-size: 36rpx;
				}
			}
			image{
				width: 90rpx;
				height: 80rpx;
			}
		}
		
	}
</style>
