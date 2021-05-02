<!-- 购买类型组件 -->
<template>
	<view class="unipopup">
		<!-- 退出选择遮罩层 -->
		<view class="mask" @click="hide"></view>
		<!-- 数据结构参照：{{PurchaseType}}{{PurchaseType.skus[0]}} -->
		<!-- 内容区域 -->
		<view class="_body">
			<!-- 顶部图片与当前选中商品属性 -->
			<view class="popTop">
				<!-- 左边图片 -->
				<image class="poptop_img" :src="PurchaseType.image[0]"></image>
				<view class="popContent">
					<view>￥{{Numcontent.price}}</view>
					<p>库存：{{Numcontent.stock}}个</p>
					<p>已选：{{Numcontent.value}}</p>
				</view>
			</view>
			<!-- 属性选择区域 -->
			<view class="Choose">
				<!-- 双重嵌套 -->
				<!-- 属性 -->
				<view class="C_Item" v-for="item in PurchaseType" :key="item.id">
					<view class="C_Itemcontent">
						<text>{{item.name}}</text>
					</view>
					<!-- 属性值 -->
					<view class="C_item">
						<span :class="item1==isCheckcolor?'action':''||item1==isCheckNum?'action':''"
						 v-for="(item1,index1) in item.content" :key="index1" 
						 @click="changeItem(item1,item.name)">{{item1}}</span>
					</view>
				</view>
			</view>
			<!-- 数量 -->
			<view class="Number">
				<text>数量</text>
				<view>
					<p @click="Numberreduce"><span>-</span></p>
					<text>{{number}}</text>
					<p @click="Numberadd"><span>+</span></p>
				</view>
			</view>
			<view class="End" @click="Push">
				<text>完成</text>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props:{
			showed:{
				type:Boolean, //参数名
				default:false
			},
			// 购买类型里面的数据
			PurchaseType:{
				type:Array,
				default:[]
			},
			// 商品数量
			number:{
				type:Number, 
				default:1
			}
		},
		created() {
			// console.log(this.PurchaseType)
		},
		data() {
			return {
				// 控制当前点亮的属性为选中状态
				isCheckcolor:this.PurchaseType[0].content[0],
				// 要考虑到只有一组属性值情况
				isCheckNum:this.PurchaseType[1]==null?'':this.PurchaseType[1].content[0],
				// 图片旁边的价格、库存、已选，默认是第一个组合的数据
				Numcontent:this.PurchaseType.skus[0]
			};
		},
		methods:{
			hide(){
				this.showed=false
				this.$emit('childHide',this.showed)
			},
			// 点击切换属性组里的值
			changeItem(Item,Parentname){//深蓝色 颜色
				// 拿到全部属性组的属性（比如：颜色-n1，工位-n2），都是一样额，拿第一个就好了
				const [n1,n2]=this.PurchaseType.skus[0].keys.split(',')
				// 如果是第一个组变化
				if(n1===Parentname){
					// 修改isCheck的color值
					this.isCheckcolor=Item
				}else
				// 如果是第二组变化
				 if(n2===Parentname){
					this.isCheckNum=Item
				}
				// console.log(Item,Parentname)
				// 把最新拼接的组合拿到skus数组里,找出和组合一样的那行，拿到当前组合匹配的其他数据
				// 也要使用三目运算符判断有几组属性，if判断不行，目前考虑是uniapp的什么阻止了
				const newTeam=this.PurchaseType[1]==null?this.isCheckcolor:[this.isCheckcolor,this.isCheckNum]
				// console.log(newTeam)
				// 更新图片旁的数据区域
				this.PurchaseType.skus.forEach(item=>{
					if(item.value==newTeam){
						this.Numcontent=item
					}
				})
			},
			// 产品数量减少
			Numberreduce(){
				if(this.number>1){
					this.number--
					this.$emit('Subtraction')
				}
			},
			Numberadd(){
				this.number++
				this.$emit('Add')
			},
			// 完成按钮
			Push(){
				// 把整个skus传递过去，后期需要最新属性值的id作为请求数据传参
				this.$emit('Update',this.Numcontent)
				// 关闭子组件
				this.hide()
			}
		}
	}
</script>

<style lang="less" scoped>
	.unipopup{
		/* 底部弹框 */
		.mask {
			width: 100%;
			height: 60%;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.4);
		}
		._body{
			width: 100%;
			position: absolute;
			left: 0px;
			bottom: 100rpx;
			background-color: #fff;
			.action{
				background-color: #fbebee;
				color: #fa436a;
			}
			.popTop{
				height: 165rpx;
				position: relative;
				.poptop_img{
					width: 200rpx;
					height: 200rpx;
					position: absolute;
					left: 40rpx;
					top:-45rpx;
					border-radius: 10rpx;
				}
				.popContent{
					position: absolute;
					left: 270rpx;
					top:15rpx;
					view{
						font-size: 35rpx;
						color: #fa436a;
					}
					p{
						font-size: 28rpx;
						color:#606266;
						margin-top: 11rpx;
					}
				}
			}
			.Choose{
				width: 100%;
				.C_Item{
					margin: 20rpx 40rpx;
					box-sizing: border-box;
					.C_Itemcontent{
						font-size: 32rpx;
						color: #606266;
					}
					.C_item{
						width: 100%;
						span{
							display: inline-block;
							text-align: center;
							padding: 10rpx 20rpx;
							font-size: 30rpx;
							border-radius: 30rpx;
							background-color: #EEEEEE;
							margin: 15rpx;
						}
					}
				}
			}
			.Number{
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
					font-size: 35rpx;
					color: #555555;
					text-align: center;
				}
				view{
					display: flex;
					justify-content: space-between;
					p{
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						background-color: #fa436a;
						text-align: center;
						span{
							color: #fff;
							font-size: 50rpx;
							line-height: 2rpx;
						}
					}
				}
			}
			.End{
				margin: 15rpx;
				box-sizing: border-box;
				height: 70rpx;
				background-color: #fa436a;
				border-radius: 50rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				text{
					color: #fff;
					font-size: 40rpx;
				}
			}
		}
	}
	
</style>

