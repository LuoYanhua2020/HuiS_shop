<template>
	<view class="CartParent">
		<!-- 首先是考虑新用户，没有购物车数据的情况，是显示“空空如也，去登录”-->
		<view class="CartNull" v-if="page==0">
			<!-- 中间的内容区域 -->
			<view class="Cartnull-content">
				<!-- 图片和文字 -->
				<view class="Cartnullcon_one">
					<image src="../../static/image/emptyCart.jpg"></image>
				</view>
				<view class="Cartnullcon_two">
					<span>还未登录哦~，小主</span>
					<navigator url="../Login/Login">去登录></navigator>
				</view>
			</view>
		</view>
		<!-- 考虑用户没有数据的情况 -->
		<view v-if="page==1" class="ListNull">
			<view class="ListNull_content">
				<!-- 图片和文字 -->
				<image src="../../static/image/emptyCart.jpg"></image>
				<view class="ListNullcontent_two">
					<span>空空如也，小主</span>
					<navigator url="../index/index" open-type='switchTab'>去逛逛></navigator>
				</view>
			</view>
		</view>
		<!-- 用户有数据的情况 -->
		<view v-if="page==2" class="ListNumberParent">
			<view class="ListNumber">
				<!-- 每一个商品 -->
				<view class="ListNumber_content" v-for="item in CartList" :key="item.id">
					<!-- 左边的图片和选中的图标 -->
					<view class="N_contentLeft">
						<view class="Nbig_contentLeft" :style="{backgroundImage:'url('+ item.product.image[0]+')',
					backgroundPosition:'center center',backgroundSize:'cover',backgroundRepeat:'no-repeat'}"></view>
						<p @click="ChangeSelect(item.id)">
							<image v-if="item.is_selected==1" src="../../static/icon/selected.png"></image>
							<image v-if="item.is_selected==0" src="../../static/icon/select.png"></image>
						</p>
					</view>
					<!-- 右边的文字区域 -->
					<view class="N_contentRight">
						<p>
							<text>{{item.product.title}}</text>
							<!-- 删除按钮 -->
							<span class="iconfont icon-cuowu" @click="removeCart(item.id)"></span>
						</p>
						<p>{{item.sku.value}}</p>
						<p>￥{{item.sku.price}}</p>
						<view>
							<!-- 在点击事件里，传入当前商品的数量 -->
							<button @click="Price_reduce(item.sku.id,item.quantity)">-</button>
							<span>{{item.quantity}}</span>
							<button @click="Price_add(item.sku.id,item.quantity)">+</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 给最后一个加点空间，不至于被底部清空区域遮住 -->
			<view class="Space"></view>
			<!-- 购物车下面的统计区域 -->
			<view class="ListSum">
				<!-- 左边的清空按钮 -->
				<view class="ListSum_left">
					<image v-if="Clear==true" @click="CheckedAll" src="../../static/icon/selected.png"></image>
					<image v-if="Clear==false" @click="CheckedAll" src="../../static/icon/select.png"></image>
					<text v-if="Clear==true" @click="ClearAll">清空</text>
				</view>
				<!-- 右边的文字、按钮 -->
				<view class="ListSum_right">
					<text>￥{{numprice}}</text>
					<button @click="Gopay">去结算</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 控制是显示未登录界面还是登陆后没有数据的页面或者有数据的页面
				page:2,
				// 存放用户信息
				CartList:[],
				// 所有计算后的价格
				numprice:0,
				// 控制清空按钮的颜色
				Clear:true,
				// 选中状态的商品数据
				ids:[],
				// 判断是否是第一次加载页面
				First:true
			}
		},
		// 每次重新打开项目都判断是否登录，有无token值
		onLoad() {
			this.pageChange()
		},
		methods: {
			async pageChange(){
				if(!uni.getStorageSync("token")){
					this.page=0
				}else{
					// 登录了就发起购物车数据的请求
					const res=await this.$myRequest({
						url:'/cart',
						header:uni.getStorageSync("token")
					})
					// 如果请求成功，就把数据存储在data中
					if(res.statusCode==200){
						// 现在购物车里面已经有三个数组了
						this.CartList=res.data.data
						// console.log(this.CartList[0].is_selected)
						// 同时计算出总的价格
						this.compoment()
						// 判断是否是第一次加载页面
						if(this.First){
							// 把全部商品勾选，然后把所有商品添加进ids数组里
							this.CartList.forEach(item=>{
								item.is_selected=1
							})
							this.First=false
						}
					}
					// 如果用户有数据
					if(this.CartList.length!=0){
						this.page=2
					}else{
						this.page=1
					}
				}
			},
			// 封装计算总价格方法：
			compoment(){
				let num=0
				this.CartList.map(item=>{
					// 判断是否是选中状态
					if(item.is_selected){
						const price=parseFloat(item.sku.price)
						num=price*item.quantity+num
					}
				})
				// toFixed(2)保留两位小数点
				this.numprice=num.toFixed(2)
			},
			// 首先封装修改商品的请求，加减都能调用
			async Pricechange(id,quan){
				const res=await this.$myRequest({
					method:"POST",
					header:uni.getStorageSync("token"),
					url:'/cart/edit',
					data:{sku_id:id,quantity:quan}
				})
				// 更新列表
				this.pageChange()
			},
			// 点击减少商品的按钮
			Price_reduce(id,quan){
				// 执行减1的操作，然后发起请求
				if(quan>1){
					quan=quan-1
				}else{
					return
				}
				// 调用封装的请求方法
				this.Pricechange(id,quan)
				// 同时更新总的价格
				this.compoment()
			},
			// 点击增加商品的按钮
			Price_add(id,quan){
				// 执行减1的操作，然后发起请求
				quan=quan+1
				// 调用封装的请求方法
				this.Pricechange(id,quan)
				// 同时更新总的价格
				this.compoment()
			},
			// 控制当前勾选按钮
			ChangeSelect(selectedid){
				// 首先把当前的按钮变换颜色,通过id锁定是哪条数据
				this.CartList.forEach((item)=>{
					// 判断是否符合id
					if(item.id==selectedid){
						// 等于0就添加
						if(item.is_selected==0){
							item.is_selected=1
							// this.ids.push(item)
						}else{
							item.is_selected=0
							// this.ids.filter(item1=>{
							// 	return item1.id==selectedid
							// })
						}
					}
					// 同时更新总的价格
					this.compoment()
				})
				console.log('勾选阿牛')
				// 判断，如果有一个商品没有选中，就不勾选清空按钮
				this.Clear=this.CartList.every((item)=>{
					return item.is_selected==1
				})
			},
			// 删除当前商品图标按钮功能
			async removeCart(Id){
				const res=await this.$myRequest({
					method:"POST",
					header:uni.getStorageSync("token"),
					url:'/cart/delete',
					data:{ids:[Id]}
				})
				// 更新列表
				this.pageChange()
				// 同时更新总的价格
				this.compoment()
			},
			// 实现全选，全取消的功能
			CheckedAll(){
				// 为真就是全选状态，要取消全选
				if(this.Clear){
					this.CheckedUtils(0)
				}else{
					this.CheckedUtils(1)
				}
			},
			// 封装全选状态，要取消全选
			CheckedUtils(Isselected){
				this.CartList.forEach((item)=>{
					item.is_selected=Isselected
				})
				// 同时更新总的价格
				this.compoment()
				this.Clear=!this.Clear
			},
			// 清空全部商品
			ClearAll(){
				uni.showModal({ 
				    content: '亲，确认清空购物车吗',
				    success:async (res)=>{
					   	if (res.confirm) {
							// 点击确定就发起清空的请求
							const clear=await this.$myRequest({
								method:"POST",
								header:uni.getStorageSync("token"),
								url:'/cart/clear'
							})
							// 更新列表
							this.pageChange()
						} else if (res.cancel) {
							return
						}     
					}
				});
			},
			// 去结算
			async Gopay(){
				// 查找所有选中的商品
				var arr=[]
				// 把所有选中状态商品的id放进arr数组，为后面接口数据做准备
				this.CartList.forEach(item=>{
					if(item.is_selected==1){
						arr.push(item.id)
					}
				})
				// 判断，如果没有选中任何商品，提示请求选择商品
				if(arr.length==0){
					uni.showToast({
					    title:"请选择商品~",
						icon:"none"
					})
				}else{
					// 如果有选中商品，就跳转到创建订单页面，把ids数组传进去
					uni.navigateTo({
						// 跳转页面，？后面跟id值数组
						url:"../../components/CreateOrder/CreateOrder?ids="+arr
					})
					// console.log(arr)
				}
				
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		background-color: #FFFFFF;
	}
	.CartParent{
		.CartNull{
			width: 750rpx;
			height: 1200rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			.Cartnull-content{
				width: 280rpx;
				height: 210rpx;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				.Cartnullcon_one{
					width: 100%;
					height: 150rpx;
					display: flex;
					justify-content: center;
					image{
						width: 120px;
						height: 100%;
					}
				}
				.Cartnullcon_two{
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					span{
						color: #888888;
						font-size:20rpx;
					}
					navigator{
						color: red;
						font-size:20rpx;
					}
				}
			}
		}
		.ListNull{
			width: 750rpx;
			height: 1200rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			.ListNull_content{
				width: 330rpx;
				height: 280rpx;
				image{
					width: 290rpx;
					height: 210rpx;
				}
				.ListNullcontent_two{
					display: flex;
					justify-content: space-between;
					align-items: center;
					span{
						font-size: 28rpx;
					}
					navigator{
						color: red;
						font-size: 30rpx;
					}
				}
			}
		}
		.ListNumberParent{
			width: 750rpx;
			// 给最后一个加点空间，不至于被底部清空区域遮住
			.Space{
				width: 100%;
				height: 110rpx;
			}
			.ListNumber{
				width: 750rpx;
				height: auto;
				padding-bottom: 50rpx;
				.ListNumber_content{
					width: 100%;
					height: 280rpx;
					border-bottom: 1px solid #dddddd;
					padding: 30rpx 35rpx;
					box-sizing: border-box;
					margin-bottom: 20rpx;
					display: flex;
					justify-content: space-between;
					.N_contentLeft{
						width: 270rpx;
						height: 100%;
						position: relative;
						.Nbig_contentLeft{
							width: 100%;
							height: 100%;
						}
						p{
							width: 70rpx;
							height: 70rpx;
							position: absolute;
							left: -25rpx;
							top:-25rpx;
							padding: 15rpx;
							box-sizing: border-box;
							border-radius: 50%;
							background-color: #FFFFFF;
							image{
								width: 47rpx;
								height: 47rpx;
							}
						}
					}
					.N_contentRight{
						width: 400rpx;
						height: 100%;
						p{
							line-height: 40rpx;
							margin-bottom: 10rpx;
						}
						p:nth-child(1){
							height: 21px;
							width: 100%;
							display: flex;
							justify-content: space-between;
							text{
								display: block;
								width: 90%;
								font-size: 17px;
								color: #303133;
								line-height: 21px;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
							span{
								width: 40rpx;
								height: 40rpx;
							}
						}
						p:nth-child(2){
							font-size: 16px;
							color: #909399;
							height: 27px;
							line-height: 27px;
						}
						p:nth-child(3){
							font-size: 16px;
							color: #303133;
						}
						view{
							width: 240rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							background-color: #f5f5f5;
							padding: 5px 0rpx;
							uni-button:after{
								// 取消按钮的默认样式
								border:0rpx !important;
							}
							button{
								width: 90rpx;
								height: 65rpx;
								font-size: 50rpx;
								line-height: 60rpx;
							}
							span{
								font-size: 30rpx;
							}
						}
					}
				}
			}
			.ListSum{
				width: 750rpx;
				height:60px;
				box-shadow: 0 0 20rpx 0 #888888;
				border-radius: 8px;
				position: fixed;
				bottom: 65px;
				left: 0rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: #FFFFFF;
				.ListSum_left{
					height:35px;
					border-radius: 30rpx;
					background-color: #c0c4cc;
					display: flex;
					align-items: center;
					image{
						width: 65rpx;
						height:35px;
					}
					text{
						margin:0 20rpx;
						font-size: 30rpx;
						color: #FFFFFF;
						letter-spacing: 5rpx;
					}
				}
				.ListSum_right{
					width: 420rpx;
					height:35px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					text{
						font-size: 33rpx;
					}
					button{
						width: 175rpx;
						height:40px;
						border-radius: 30rpx;
						background-color: #fa436a;
						color: #FFFFFF;
						box-shadow: 0 0 20rpx 0 #888888;
					}
				}
			}
		}
	}
</style>
