<template>
    <view class="uni-tab-bar">
        <scroll-view class="uni-swiper-tab" scroll-x>
			<!-- 外面包裹一个view改变布局 -->
			<view class="Display">
				<!-- 每一个导航栏 -->
				<view v-for="(tab,index) in tabBars" :key="tab.id" :style="scrollStyle" class="scrollStyle">
					<!-- 每个导航栏里面的内容 -->
				    <view class="swiper-tab-list" :class="{'active' : tabIndex==index}" @tap="tabtap(index)" :style="scrollItemStyle">
				        <!-- 导航栏文本 -->
						<text>{{tab.name}} {{tab.num?tab.num:""}}</text>
						<!-- 选中时下面的红线 -->
						<view class="swiper-tab-line"></view>
				    </view>
				</view>
			</view>
        </scroll-view>
    </view>
</template>

<script>
    export default {
        props:{
			// 传过来的头部导航栏文字内容
            tabBars:Array,
			// 当前选中的组件
            tabIndex:Number,
            scrollStyle:{
                type:String,
                default:""
            },
            scrollItemStyle:{
                type:String,
                default:""
            }
        },
        methods:{
            //点击切换导航
            tabtap(index){
                // this.tabIndex = index;
                this.$emit('tabtap',index)
            }
        }
    }
</script>　

<style scoped lang="less">
.uni-swiper-tab{
        border-bottom: 1upx solid #EEEEEE;
    }
	.Display{
		width: 100%;
		display: flex;
		justify-content: start;
	}
	.scrollStyle{
		width: 25%;
		height: 100rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: center;
	}
    .swiper-tab-list{
		padding-top:25rpx;
		box-sizing: border-box;
		text{
			font-size: 32rpx;
		}
    }
    .uni-tab-bar .active{
        color: #fa436a;
    }
    .active .swiper-tab-line{
        border-bottom: 2rpx solid #fa436a;
        width: 100%;
        margin-top: 22rpx;
        border-top: 2rpx solid #fa436a;
        border-radius: 20rpx;
    }
</style>