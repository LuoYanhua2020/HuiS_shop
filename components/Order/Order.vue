<template>
	<view>
		<!-- 头部组件 tabtap接收子组件传的当前点亮的组件下标-->
		<swiperTabHead class="swiperTabHead" :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap"></swiperTabHead>
		<!-- 下面的内容区域 -->
		<!-- <view class="uni-tab-bar"> -->
			<!-- 用uniapp自带的轮播组件包裹 -->
		    <swiper class="swiper-box" :style="{height:swiperheight+'rpx'}" :current="tabIndex" @change="tabChange">
				<!-- 每一个轮播里面的内容 -->
		        <swiper-item v-for="(items,index) in newslist" :key="index">
					<!-- y轴滑动 -->
		            <scroll-view scroll-y class="list">
		                <template>
							<!-- 判断当前订单页面是否有内容，没有内容显示默认图片是否 -->
							<view class="Receiving_null" v-show="items.list.length==0">
								<image src="../../static/image/Receiving_address.png"></image>
							</view>
		                    <!-- 图文列表 -->
		                    <!-- 现在渲染每一个订单状态的组件 -->
							<order-module class="Module" @SonRemove="SonRemove"
							 v-show="items.list.length!=0"
							 @SonCancel="SonCancel" v-for="item in items.list" :key="item.id" :item="item" ></order-module>
							 <!-- 没有更多区域 -->
							 <view v-if="None" class="Bottom_none"><p>没有更多数据了哦~</p></view>
		                </template>
		            </scroll-view>
		        </swiper-item>
		    </swiper>
		<!-- </view> -->
	</view>
</template>
<script>
	import swiperTabHead from "../swiper-tab-head.vue";
	// 引入渲染每个订单内容组件
	import OrderModule from '../OrderModule.vue';
	//先定义page，用于存储自增的值
	// 但是也需要控制page到5就可以了
	var page = 2;
	export default {
		data() {
			return {
				tabIndex:0,// 选中的
				tabBars:[
					{ name:"全部订单",id:1},
					{ name:"待付款",id:2},
					{ name:"待收货",id:3},
					{ name:"待评价",id:4}
				],
				// 动态获取页面高度
				swiperheight:0,
				// 每个页面的数据
				newslist:[
					{id:0,list:[]},
					{id:1,list:[]},
					{id:2,list:[]},
					{id:3,list:[]}
				],
				// 定义state的值
				state:0,
				loadingText:'加载中...',
				// 控制没有更多显示
				None:false
			}
		},
		// 引入头部组件
		components:{
		    swiperTabHead,
			OrderModule
		},
		onLoad(options) {
			// 获取上一个页面传过来的state值
			this.state=options.state
			// 动态根据“我的”页面传过来的state值，显示不同的“订单状态”页面
			// 进来就加载
			this.Showorder(options.state)
			
			// 页面切换动画的效果实现
			uni.getSystemInfo({
			    success:(res)=>{
			        let height = res.windowHeight-uni.upx2px(100)
			        this.swiperheight = height;
			    }
			})
		},
		// 监听触底
		onReachBottom() {
		     this.getnewsList();
		},
		methods: {
			// 发起请求
			getOrder(State){
				// 给相应的数组组件相应的数据
				this.newslist.forEach(async item=>{
					// 判断是哪个订单状态
					if(item.id==State){
						// 赋值,增加判断，减少资源浪费,不用切换一次就发起一次请求
						// if(item.list.length<1){
							//但是点击不同订单，内容高度不能再重新计算了。。。
							// 删除订单也不能再次刷新页面数据了
							const res=await this.$myRequest({
								url:'/order',
								header:uni.getStorageSync("token"),
								data:{state:State,page:1}
							})
							// console.log(res)
							item.list=res.data.data.data
							// console.log(item.list)
							
							// 动态把页面长度获取传值
							if(item.list.length!=0){
								this.swiperheight=(item.list.length*430)+60
								// console.log(item.list.length)
							}else{
								// 注意！考虑没有数据的情况，显示默认空的图片
								// 给一个全屏的长度
								this.swiperheight=750
							}
						// }
					}
				})
			},
			async getnewsList() { 
				// 暂时只允许加载4次，page从2开始的
				if(page<=5){
					// 显示加载中动画
					uni.showLoading({title: '加载中',mask:true});
					const resule=await this.$myRequest({
						url:'/order',
						header:uni.getStorageSync("token"),
						data:{state:this.state,page:page}
					})
					// console.log(resule)
					page++; //每触底一次 page +1
					this.newslist.forEach(item=>{
						if(item.id==this.tabIndex){
							//将数据拼接在一起
							item.list=item.list.concat(resule.data.data.data)
							// 延迟滑动条高度
							this.swiperheight=(item.list.length*430)+60
						}
					})
					if(resule){
						uni.hideLoading();
					}
				}else{
					// 展示没有更多标签
					this.None=true
					return false
				}
			},
			// 点击导航栏切换组件内容
			tabtap(index){
			    this.tabIndex = index;
				// 点击不同的导航“订单状态”，获得不同的内容
				// 同样发起请求，获取数据
				this.getOrder(index)
				// console.log(index)
				// console.log(this.newslist[index])
			},		
			//滑动切换导航
			tabChange(e){
				this.tabIndex = e.detail.current;
				// 滑动页发起请求，请求数据
				this.getOrder(e.detail.current)
			},
			// 封装
			PostApi(el,Api,value){
				// 弹出确定取消的消息框
				uni.showModal({
				    content: `亲，确认${value}订单吗`,
				    success:async (res)=>{
					   	if (res.confirm) {
							// 点击确定就发起清空的请求
							const clear=await this.$myRequest({
								method:"POST",
								header:uni.getStorageSync("token"),
								url:Api,
								// 请求的订单号--el
								data:{order_sn:el}
							})
							// 更新列表
							this.getOrder(this.state)
						} else if (res.cancel) {
							return
						}     
					}
				});
			},
			// 父级接收取消订单的点击事件
			SonCancel(el){
				this.PostApi(el,"/order/cancel","取消")
			},
			// 删除订单的点击事件
			SonRemove(el){
				this.PostApi(el,"/order/del","删除")
			},
			// 决定刚开始进来，显示哪个订单内容
			Showorder(state){
				// console.log(state)
				// 知道结果的值的判断用switch优化
				switch(state){
					// 将当前锁定到的页面，显示到相应的tabIndex
					case '0':
					this.tabIndex=0;
					this.getOrder(state); 
					break;
					
					case '1':
					this.tabIndex=1;
					this.getOrder(state);
					break;
					
					case '2':
					this.tabIndex=2;
					this.getOrder(state);
					break;
					 
					case '3':
					this.tabIndex=3;
					this.getOrder(state);
					 break;
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.swiperTabHead{
		/* 让导航栏悬浮 */
		position: fixed;
		top: 70rpx;
		left: 0rpx;
		width: 100%;
		height: 75rpx;
		z-index: 99;
	}
	.swiper-box{
		padding-top:75rpx;
	}
	.Receiving_null{
		width: 100%;
		height: 700rpx;
		position: fixed;
		image{
			width:180rpx;
			height:180rpx;
			position: absolute;
			left: 50%;
			bottom: 0rpx;
			transform: translateX(-50%);
		}
	}
	.Bottom_none{
		width: 100%;
		height: 60rpx;
		display: flex;
		justify-content: center;
		margin-top: 30rpx;
		p{
			font-size: 25rpx;
			color: #888;
		}
	}
</style>
