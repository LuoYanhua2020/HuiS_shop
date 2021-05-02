<template>
	<view>
		<!-- 修改模块 -->
		<view class="modify">
			<view class="Change" v-for="item in List" :key="item.id" @click="propChange(item)">
				<text>{{item.content}}</text>
				<image :src="item.img"></image>
			</view>
		</view>
		<!-- 弹框  -->
		<view class="propParent" v-if="showDailog">
			<!-- 里面的内容 -->
			<view>
				<text>{{PropContent.content}}</text>
				<!-- 修改内容输入框 -->
				<p><input v-model="Propinput" :placeholder="PropContent.placeholder"/></p>
				<view>
					<button @click="cancel">取消</button>
					<button @click="determine">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showDailog: false, // 是否显示弹窗
				// 反正提交请求是一起提交数据到后台。数据可以模拟渲染
				List:[{
					// id=>后期判断是发起修改昵称、密码请求
					id:1,
					content:'修改昵称',
					img:'../../static/index/icon-right.png',
					placeholder:'请输入昵称'
				},{
					id:2,
					content:'修改密码',
					img:'../../static/index/icon-right.png',
					placeholder:'请输入密码'
				}],
				// 输入的内容
				Propinput:'',
				// 弹框的内容
				PropContent:{}
			}
		},
		methods: {
			propChange(el){
				// 赋值给本地
				this.PropContent=el
				console.log(this.PropContent)
				this.showDailog=true
			},
			// 取消按钮
			cancel(){
				this.showDailog=false
				this.Propinput=''
				this.PropContent={}
			},
			// 确定按钮,发起修改请求，关闭弹窗
			async determine(){
				// 判断是更改昵称还是密码
				if(this.PropContent.id==1){
					const res=await this.$myRequest({
						url:"/user/editInfo",
						method:"POST",
						data:{nickname:this.Propinput},
						header:uni.getStorageSync("token")
					})
					// 关闭窗口，清空值
					this.cancel()
					if(res.statusCode==200){
						// 修改成功提示框
						uni.showToast({title:'修改昵称成功！',icon:'success'})
					}else{
						uni.showToast({title:'修改昵称失败！'})
					}
				}else if(this.PropContent.id==2){
					const res=await this.$myRequest({
						url:"/user/editInfo",
						method:"POST",
						data:{password:this.Propinput},
						header:uni.getStorageSync("token")
					})
					this.cancel()
					if(res.statusCode==200){
						// 修改成功提示框
						uni.showToast({title:'修改密码成功！',icon:'success'})
					}else{
						uni.showToast({title:'修改密码失败！'})
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
.modify{
	width: 100%;
	.Change{
		width: 100%;
		height: 100rpx;
		background-color: #FFFFFF;
		border-bottom: 1rpx solid rgba(0,0,0,0.15);
		padding: 0rpx 25rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text{
			font-size: 30rpx;
			padding: 20px 0;
		}
		image{
			width: 50rpx;
			height: 50rpx;
		}
	}
	view:nth-child(1){
		border-top: 1rpx solid rgba(0,0,0,0.15);
	}
}
.propParent{
	width: 750rpx;
	height:100%;
	background-color: rgba(0,0,0,0.5);
	position: fixed;
	left: 0;
	top:0;
	>view{
		width: 500rpx;
		height: 330rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		position: absolute;
		left: 50%;
		top:500rpx;
		transform: translateX(-50%);
		text{
			display: block;
			width:100%;
			height:30rpx;
			text-align: center;
			padding: 25rpx 0;
		}
		p{
			width:100%;
			height:90rpx;
			margin-top: 30rpx;
			display: flex;
			justify-content:center;
			align-items: center;
			input{
				width:80%;
				height:65rpx;
				border: 1px solid rgba(0,0,0,0.15);
				padding-left: 15rpx;
				box-sizing: border-box;
			}
		}
		view{
			width:100%;
			height:90rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
		}
	}
}
</style>
