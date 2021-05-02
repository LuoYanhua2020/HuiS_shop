<template>
	<view class="ClassIfParent">
		<!-- 左侧菜单-scroll-view:可以滚动的区域 -->
		<!-- scroll-y：属性在一定范围区域滑动可以纵向滚动 -->
		<scroll-view class="Classif-Left" scroll-y>
			<!-- 比较当前点亮的下标与当前点亮的是否一致,确认点亮的类是否添加进 -->
			<view :class="activeing===index?'active':''" @click="change(index,item)" v-for="(item,index) in classList" :key="item.id">{{item.name}}</view>
		</scroll-view>
		<!-- 右侧 -->
		<scroll-view class="Classif-Right" scroll-y>
			<!-- 每一个大块区域 -->
			<view class="Right-parent" v-for="item in activeList" :key="item.id">
				<!-- 每一个区域的标题 -->
				<text>{{item.name}}</text>
				<!-- 每个区的产品 -->
				<view class="Right-content">
					<!-- 每一块产品 -->
					<view v-for="item1 in item.childlist" @click="PushGo(item1.id)">
						<image :src="item1.image"></image>
						<p>{{item1.name}}</p>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 数据
				classList:[],
				// 声明当前点亮的是哪一个分类
				activeing:0,
				// 下标对应的数据
				activeList:[]
			}
		},
		onLoad() {
			this.getPicsCate()
		},
		methods: {
			// 发起数据请求
			async getPicsCate(){
				const res=await this.$myRequest({
					url:"/category"
				})
				this.classList=res.data.data
				// console.log(this.classList)
				// 开头就给到默认的第一个
				this.change(0,res.data.data[0])
			},
			// 改变高亮的点击事件
			// 传递下标改变高亮的同时，把数据也传入事件
			async change(index,item){
				this.activeing=index
				this.activeList=item.childlist
				// console.log(this.activeList)
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
		}
	}
</script>

<style lang="less">
	// 外面有一个page标签的包裹,所以ClassIfParent没有占据100%
	page{
		height: 100%;
		.ClassIfParent{
			height: 100%;
			display: flex;
			.Classif-Left{
				width: 180rpx;
				height: 100%;
				background-color: #FFFFFF;
				view{
					height: 85rpx;
					line-height:85rpx;
					font-size: 30rpx;
					color: #555;
					text-align: center;
					// border: 1px solid red;
				}
				// 当前在的页面
				.active{
					border-left: 2px solid red;
					background-color: rgb(245,245,245);
					color: red;
				}
			}
			.Classif-Right{
				width: 570rpx;
				height: 100%;
				// border:1px solid red;
				padding-top: 10rpx;
				padding-left:20rpx;
				box-sizing:border-box;
				display: flex;
				.Right-parent{
					width: 100%;
					margin: 20rpx 0;
					box-sizing:border-box;
					text{
						display: block;
						font-size: 30rpx;
						margin: 20rpx 0;
					}
					.Right-content{
						width: 100%;
						padding: 10rpx;
						box-sizing: border-box;
						display: flex;
						justify-content: start;
						flex-wrap: wrap;
						align-items: center;
						background-color: #FFFFFF;
						view{
							width:145rpx;
							height: 225rpx;
							display: flex;
							justify-content: center;
							flex-wrap: wrap;
							margin: 10rpx 17rpx;
							box-sizing: border-box;
							image{
								width: 145rpx;
								height: 160rpx;
							}
							p{
								font-size: 30rpx;
								margin: 5rpx 0;
								color: #666666;
							}
						}
					}
				}
			}
		}
	}

</style>
