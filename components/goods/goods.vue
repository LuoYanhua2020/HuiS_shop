<template>
	<view class="Goodsparent">
		<!-- 头部区域 -->
		<view class="GoodsTop">
			<!-- 通过判断数据状态，给相应的容器加下边框 -->
			<!-- 添加点击事件，改变数据就改变了类 -->
			<view :class="sortclass==0?'active':''" @click="checksortone">
				<text>综合排序</text>
			</view>
			<view :class="sortclass==1?'active':''" @click="checksorttwo">
				<text>销量优先</text>
			</view>
			<view :class="priceOrde!=null?'active':''" @click="checkprice">
				<text>价格</text>
				<p class="priceTop">
					<image :src="priceOrde==1?'../../static/icon/Putaway1.png':'../../static/icon/Putaway.png'"></image>
					<image :src="priceOrde==2?'../../static/icon/more1.png':'../../static/icon/more.png'"></image>
				</p>
			</view>
		</view>
		<!-- 下方内容部位 -->
		<view class="GoodsContent">
			<!-- 每一个商品具体内容 -->
			<view class="Goodschilds" v-for="item in dataList" :key="item.id" @click="navClickGoItem(item.id)">
				<view class="childimg">
					<image mode="aspectFit" :src="item.image[0]"></image>
				</view>
				<view>
					<text>{{item.title}}</text>
				</view>
				<view>
					<p>￥{{item.price}}</p>
					<p>已售{{item.sold_count}}</p>
				</view>
			</view>
		</view>
		<view class="GoodsBootom">
			<text>没有更多内容了...</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//页面的数据源
				dataList:[],
				// 0：商品综合排列；1：表示销量领先
				sorts:0,
				// 控制“综合排列”和“销量领先”的类样式
				sortclass:0,
				// 表示升序降序
				priceOrde:null,
				// 控制是升序还是降序
				// num:0,
				// 接收id值
				Id:''
			}
		},
		onLoad(options) {
			// 接收传过来的id值
			this.getList(options.id)
			// 接收本页面的id值
			this.Id=options.id
		},
		methods: {
			// 发起请求数据的请求
			async getList(id){
				const res=await this.$myRequest({
					url:"/product/getList?cat_id="+id+"&sort="+this.sorts+"&priceOrder="+this.priceOrde+"&kw=",
				})
				// console.log(res)
				this.dataList=res.data.data.data
				// 获取到数据赋值本地data
				// console.log(this.dataList)
			},
			// 点击，改变数据
			checksortone(){
				this.sorts=0
				// 改变类样式
				this.sortclass=0
				this.priceOrde=null
				this.getList(this.Id)
			},
			checksorttwo(){
				this.sorts=1
				// 改变类样式
				this.sortclass=1
				this.priceOrde=null
				this.getList(this.Id)
			},
			// 点击价格按钮
			checkprice(){
				// 改变类样式,前面两个都没有样式了
				this.sortclass=3
				// 判断是升序还是降序
				if(this.priceOrde==1){
					this.priceOrde=2
				}else{
					this.priceOrde=1
				}
				this.sorts=2
				// 更新数据列表
				this.getList(this.Id)
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
			}
		}
		
	}
</script>

<style lang="less">
.active{
	border-bottom: 1px solid red;
	color:red;
}
.Goodsparent{
	.GoodsTop{
		width: 100%;
		height: 95rpx;
		background-color: #FFFFFF;
		display: flex;
		flex-wrap: wrap;
		margin-top: 5rpx;
		justify-content: space-around;
		.priceTop{
			width: 20%;
			height: 60%;
			margin-left: 10rpx;
		}
	}
	view{
		width: 180rpx;
		height: 100%;
		// border:1px solid red;
		display: flex;
		justify-content:center;
		align-items: center;
		text{
			font-size: 35rpx;
		}
		p{
			width: 30%;
			height: 75%;
			display: flex;
			justify-content:center;
			flex-wrap: wrap;
			image{
				width: 22rpx;
				height:22rpx;
			}
		}
	}
	.GoodsContent{
		width: 100%;
		background-color: #FFFFFF;
		display: flex;
		flex-wrap: wrap;
		padding: 35rpx;
		box-sizing: border-box;
		justify-content: space-between;
		.Goodschilds{
			width: 48%;
			display: flex;
			flex-wrap: wrap;
			view{
				width: 100%;
				display: flex;
				justify-content: space-between;
				text{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 30rpx;
					line-height: 70rpx;
				}
				p{
					font-size: 30rpx;
					line-height: 70rpx;
					margin-left:20rpx;
					box-sizing: border-box;
				}
			}
			.childimg{
				width: 100%;
				height: 350rpx;
				border-radius: 20rpx;
				overflow: hidden;
				image{
					width: 110%;
				}
			}
		}
	}
	.GoodsBootom{
		width: 100%;
		height: 60rpx;
		margin-top: 20rpx;
		text{
			font-size: 35rpx;
			color: #555555;
		}
	}
}
</style>
