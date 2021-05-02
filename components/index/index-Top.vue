<template>
	<view id="parent">
		<view id="Top">
			<view>
				<p v-if="isTrue" class="iconfont icon-sousuo"></p>
				<input type="text" placeholder="请输入关键词搜索" @blur="getfoucus" @focus="getfoucus">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isTrue:true
			};
		},
		methods:{
			getfoucus(){
				this.isTrue=!this.isTrue
			}
		}
	}
</script>
<style scoped lang="less">
	#Top {
	    width: 95%;
	    height: 60rpx;
	    margin: 0rpx auto;
	    margin-top: 5rpx;
	    display: flex;
		justify-content: center;
		background-color: rgb(235,235,235);
		border-radius: 30rpx;
		view{
			display: flex;
			justify-content: center;
			align-items: center;
			p{
				width: 10%;
				margin-right: 20rpx;
			}
			input {
				width: 100%;
				height: 100%;
				font-size: 30rpx;
			}
		}
	}
	#parent{
		padding-top: 15rpx;
	}
</style>
