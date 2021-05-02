<template>
	<view class="CartParent">
		<!-- 头部地址区域 -->
		<navigator class="createTop" url="../Receiving_address/Receiving_address">
			<view class="createTop_null">
				<p class="iconfont icon-location"></p>
			</view>
			<!-- 显示地址区域 -->
			<view v-if="addressList" class="Adress">
				<view class="Adress_top">
					<text>{{addressList.contactor_name}}</text>
					<text>{{addressList.phone}}</text>
				</view>
				<view class="Adress_bottom">
					<text>{{addressList.address}}</text>
					<text>{{addressList.street}}</text>
				</view>
			</view>
			<view class="createTop_null" >
				<image src="../../static/index/icon-right.png"></image>
			</view>
			<!-- 那条线 -->
			<view class="LineBottom">
				<image src="../../static/image/line.png"></image>
			</view>
		</navigator>
		<!-- 商品信息区域 -->
		<view class="ProductInformation_parent">
			<view class="ProductInformation" v-if="createList!=[]" v-for="item in createList" :key="item.id">
				<!-- 左边图片区域 -->
				<image class="InformationLeft" mode="aspectFill" :src="item.product.image[0]"></image>
				<!-- 右边文字区域 -->
				<view class="InformationRight">
					<p><text>{{item.product.title}}</text></p>
					<p><text>{{item.sku.value}}</text></p>
					<p><text>￥{{item.sku.price}}<span>x{{item.quantity}}</span></text></p>
				</view>
			</view>
		</view>
		<!-- 商品金额区域 -->
		<view class="ProductPrice">
			<view class="ProductPAll">
				<text>商品全额</text>
				<p>￥ <span>{{PriceList.products_price}}</span></p>
			</view>
			<view class="FullDiscount ProductPAll">
				<text>优惠全额</text>
				<p>- ￥ <span>{{PriceList.discount_price}}</span></p>
			</view>
			<view class="ProductPAll">
				<text>运费</text>
				<p>￥ <span>免运费</span></p>
			</view>
			<view class="Remarks">
				<text>备注</text>
				<input placeholder="请填写备注信息" v-model="RemarkText"/>
			</view>
			<view class="Product_bottom"></view>
		</view>
		<!-- 下方的“实付款”区域-->
		<view class="ActualPayment">
			<p>实付款</p>
			<text>￥{{PriceList.order_price}}</text>
			<!-- 判断，如果有地址，就可以提交，如果没有地址，就禁用按钮 -->
			<button class="Submit" :class="addressList&&PriceList.order_price?'active':''" @click="PushOrder">提交订单</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 订单信息
				createList:[],
				// 图片路径
				// InformationImg:'',
				// 地址数据
				addressList:[],
				// 价格信息
				PriceList:{
					// 商品全额
					products_price:0,
					// 优惠全额
					discount_price:0,
					//实付款
					order_price:0
				},
				// 临时存储上一页传的值
				options:[],
				RemarkText:''
			}
		},
		onLoad(options) {
			this.options=options
			// console.log(options)
			// 获取产品信息接口
			this.getProducInformation(options)
			// 获取地址和价格
			this.getAddress(options)			
		},
		methods: {
			async getProducInformation(options){
				// 如果没有传值ids就是详情页的立即购买按钮跳转
				if(options.ids==undefined){
					// 发送请求
					const res=await this.$myRequest({
						url:'/cart',
						header:uni.getStorageSync("token"),
						data:{sku_id:options.sku_id,quantity:options.quantity}
					})
					// console.log(res)
					this.createList=res.data.data
					// this.InformationImg=this.createList.product.image[0]
				}else{
					// 购物车的去结算跳转
					// 先把传过来的字符串解析成数组
					var arr=options.ids.split(',')
					// 得到购物车id相应的数据
					const res=await this.$myRequest({
						url:'/cart/updateStatus',
						method:"POST",
						header:uni.getStorageSync("token"),
						data:{ids:arr} 
					})
					// console.log(res)
					this.createList=res.data.data
					// 然后再发起cart请求获取所有购物车的信息，使用所有id查找对应数据渲染：
					// 好像也不需要这个接口的数据
					// const ress=await this.$myRequest({
					// 	url:'/cart',
					// 	header:uni.getStorageSync("token")
					// })
				}
				// console.log(this.createList)
			},
			// 获取收货地址的接口
			async getAddress(options){
				const res=await this.$myRequest({
					url:'/user/getAddress',
					header:uni.getStorageSync("token")
				})
				// console.log(res.data.data)
				// 现在是要把数据做判断，先看有没有默认的地址，
				const Add=res.data.data.filter((item)=>{
					return item.is_default==1
				})
				// 因为filter是数组的方法，对象外面会包裹一层数组，后期不好拿数据
				this.addressList=Add[0]
				// 如果没有默认地址就先把第一个地址默认
				if(this.addressList==''){
					this.addressList=res.data.data[0]
				}
				// console.log(this.addressList)
				// 后面再调用,获取商品价格
				// 这样解决了this.addressList.id请求数据还没到接口提前发出一直获取不到数据
				this.getPrice(options)
			},
			async getPrice(options){
				const res=await this.$myRequest({
					url:'/order/getPrice',
					header:uni.getStorageSync("token"),
					method:"POST",
					data:{
						desc: "",
						address_id:this.addressList.id,
						quantity:options.quantity,
						sku_id:options.sku_id
					}
				})
				// console.log(res)
				// 如果address_id为空，返回的信息，data也是null，可以判断是否返回价格信息
				if(res.data.data==null){
					// 提示错误信息
					uni.showToast({
						title:res.data.msg
					})
				}else{
					// 有信息就赋值到本地data中
					this.PriceList=res.data.data
					// console.log(this.PriceList)
				}
			},
			// 提交订单按钮
			async PushOrder(){
				// 提交也分两种情况；详情页跳转提交订单与购物车多产品提交订单
				if(this.options.ids==undefined){
					var res=await this.$myRequest({
						url:'/order/add',
						header:uni.getStorageSync("token"),
						method:"POST",
						data:{
							address_id:this.addressList.id,
							quantity:this.options.quantity,
							remark:this.RemarkText,
							sku_id:this.options.sku_id
						}
					})
					// console.log(res)
				}else{
					// 购物车多产品提交订单
					var res=await this.$myRequest({
						url:'/order/add',
						header:uni.getStorageSync("token"),
						method:"POST",
						data:{
							address_id:this.addressList.id,
							remark:this.RemarkText
						}
					})
					// console.log(res)
				}
				// 如果有错误，提示错误消息
				if(res.data.data==null){
					uni.showToast({
					    title:res.data.msg,
						icon:"none"
					})
				}else{
					// 请求成功就获取订单号res.data.data,然后跳转到支付页面
					// 跳转到支付页面
					uni.navigateTo({
						url:"../../components/payment/payment?order_sn="+res.data.data+"&orderPrice="+this.PriceList.order_price
					})
				}
			}
		}
	}
</script>

<style lang="less">
.CartParent{
	.createTop{
		width: 100%;
		background-color: #FFFFFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: fixed;
		z-index: 10;
		margin-bottom: 20rpx;
		.createTop_null{
			width: 40px;
			padding: 15rpx 0;
			box-sizing: border-box;
			image{
				width: 65rpx;
				height: 63rpx;
			}
		}
		.Adress{
			width: 85%;
			.Adress_top{
				width: 100%;
				// 后面会变化的最好不要用高度，用padding更好
				padding:5rpx 0;
				text:nth-child(1){
					font-size: 35rpx;
					margin-right: 20rpx;
					box-sizing: border-box;
				}
				text:nth-child(2){
					font-size: 30rpx;
				}
			}
			.Adress_bottom{
				width: 100%;
				padding-bottom: 22rpx;
				text{
					width: 100%;
					font-size: 30rpx;
					color: #909399;
				}
				text:nth-child(1){
					margin-right: 15rpx;
					box-sizing: border-box;
				}
			}
		}
		.LineBottom{
			width: 100%;
			position: absolute;
			bottom: -10rpx;
			left: 0rpx;
			image{
				width: 100%;
				height: 6rpx;
			}
		}
	}
	.ProductInformation_parent{
		padding-top: 140rpx;
		.ProductInformation{
			width: 100%;
			height: 190rpx;
			background-color: #FFFFFF;
			padding: 0 30rpx 20rpx 30rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.InformationLeft{
				width: 25%;
				height: 100%;
			}
			.InformationRight{
				width: 72%;
				height: 100%;
				p{
					width: 100%;
					height: 25%;
					margin-top: 10rpx;
				}
				p:nth-child(1){
					// 多余部分变成小圆点,设置在父级
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 30rpx;
				}
				p:nth-child(2){
					font-size: 28rpx;
					color: #888888;
				}
				p:nth-child(3){
					font-size: 35rpx;
					text{
						span{
							font-size: 30rpx;
							color: #666666;
							margin-left: 22rpx;
							letter-spacing: 10rpx;
						}
					}
				}
			}
		}
	}
	.ProductPrice{
		width: 100%;
		height:430rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 15rpx;
		.ProductPAll{
			width: 90%;
			height: 50px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid rgba(0,0,0,0.07);
			text{
				color:#888888;
				line-height: 20rpx;
				font-size: 30rpx;
			}
		}
		.FullDiscount{
			p{
				color:#fa436a;
			}
		}
		.Remarks{
			width: 90%;
			height: 50px;
			display: flex;
			justify-content: start;
			align-items: center;
			text{
				color:#888888;
				margin-right: 50rpx;
				font-size: 30rpx;
			}
			input{
				width: 82%;
			}
		}
		// 空标签，用来防止商品太多，备注被提交订单行遮盖
		.Product_bottom{
			width: 100%;
			height: 130rpx;
		}
	}
	.ActualPayment{
		width: 100%;
		height: 50px;
		position: fixed;
		bottom: 5rpx;
		left: 0rpx;
		background-color: #FFFFFF;
		box-shadow: 0 -1px 5px rgb(0 0 0 / 20%);
		display: flex;
		justify-content: start;
		align-items: center;
		p{
			margin:0rpx 30rpx;
			color: #606266;
			font-size: 30rpx;
		}
		text{
			color:#fa436a;
			font-size: 30rpx;
		}
		.Submit{
			width: 270rpx;
			height: 100%;
			position: absolute;
			right: 0rpx;
			top:0rpx;
			color: #FFFFFF;
			font-size:38rpx;
			background-color: #999999;
		}
		.active{
			background-color: #fa436a;
		}
	}
}
</style>
