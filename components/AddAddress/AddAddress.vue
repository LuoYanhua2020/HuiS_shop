<template>
	<view class="HarvestParent">
		<!-- 头部的个人信息 -->
		<view class="Harvest_information">
			<view>
				<text>联系人</text>
				<input placeholder="收货人姓名" v-model="contactor_name"/>
			</view>
			<view>
				<text>手机号</text>
				<input placeholder="收货人手机号码" v-model="phone"/>
			</view>
			<view>
				<text>地址</text>
				<p>
					<input v-if="areaData" placeholder="选择地区" @tap="openAddres" v-model="address"/>
					<text v-else>加载中...</text>
				</p>
			</view>
			<view>
				<text>街道</text>
				<input v-model="street"/>
			</view>
		</view>
		<!-- 设为默认 -->
		<view class="defalt">
			<text>设置为默认</text>
			 <switch :checked="is_default==0?false:true" color="#fa436a" @click="is_default==0?is_default=1:is_default=0"/>
		</view>
		<!-- 提交按钮 -->
		<view class="submitBth">
			<button @click="Submit">提交</button>
		</view>
		<!-- 弹出的选择地址的滑块框 -->
		<simple-address
		 ref="simpleAddress" :provinceData="provinceData" :cityData="cityData" :areaData="areaData"
		  :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#007AFF'></simple-address>
	</view>
</template>

<script>
	import simpleAddress from "@/components/simple-address/simple-address.nvue"
	export default {
		data() {
			return {
				cityPickerValueDefault: [0, 0,0],//弹框的初始值
				pickerText:'',
				address:'',//初始值（最后选择的地址）
				// 请求的地址id
				address_id:0,
				provinceData:[],
				cityData:[],
				areaData:[],
				// 收货人信息
				contactor_name:'',
				phone:'',
				street:'',
				// 是否设置了默认
				is_default:0,
				// 存储用户信息，拿到用户id
				UserList:[]
			}
		},
		onLoad(options) {
			// 发起省市区数据的请求
			this.getAddress()
			// 修改信息的情况就赋值相关内容
			if(options.item){
				// 把收货地址单击当前行的数据存在本地data中
				// 注意接收的时候也必须使用 JSON.parse 来进行解析！
				this.UserList=JSON.parse(options.item)
				this.getChange(this.UserList)
			}
		},
		components: {
			simpleAddress
		},
		methods: {
			getChange(options){
				this.contactor_name=options.contactor_name
				this.phone=options.phone
				this.address=options.address
				this.street=options.street
				this.is_default=options.is_default
				// console.log(options)
			},
			// 发起请求省市区数据的请求
			async getAddress(){
				const res=await this.$myRequest({
					url:'/area/index',
					header:uni.getStorageSync("token")
				})
				// console.log(res)
				// 传给本地data
				// 把地址数据处理了传给子组件
				if(res.data.data.length!=0){
					res.data.data.forEach((item)=>{
						switch(item.level){
							case 1:this.provinceData.push(item); break;
							case 2:this.cityData.push(item); break;
							case 3:this.areaData.push(item); break;
						}
					})
					// console.log(this.provinceData);
				}
			},
			// 省级联动的效果：
			openAddres() {
				// 通过$refs调到子组件的open事件，指定是simpleAddress子组件的
				this.$refs.simpleAddress.open();
			},
			// 子组件的确定按钮
			onConfirm(e) {
				this.pickerText = JSON.stringify(e);//看到返回的数据
				this.address=e.label;//把最后选择的地址回显到input框中
				// console.log(this.pickerText)
				// 那请求的adress_id赋值到本地data
				this.address_id=e.areaId
			},
			// bindTextAreaBlur: function (e) {
			//     console.log(e.detail.value)
			// },
			// 提交按钮，校验规则
			async Submit(){
				console.log(this.UserList)
				if(this.SubRule()){
					// 发起提交订单请求
					// 如果是新增地址，就没有收货地址传过来的数据
					if(this.UserList.length==0){
						var data={
							address:this.address,
							address_id: this.address_id,
							contactor_name:this.contactor_name,
							is_default:this.is_default,
							phone:this.phone,
							street:this.street
						}
					}else{
						var data={
							address:this.address,
							address_id: this.address_id,
							contactor_name:this.contactor_name,
							id:this.UserList.id,
							is_default:this.is_default,
							phone:this.phone,
							street:this.street,
							user_id:this.UserList.user_id
						}
					}
					const res=await this.$myRequest({
						url:'/user/editAddress',
						data:data,
						method:"POST",
						header:uni.getStorageSync("token")
					})
					console.log(res)
					// 如果请求成功，就提示提交地址成功
					if(res.statusCode==200){
						uni.showToast({
							title:'提交地址成功',
							icon:'success'
						})
						// 跳转回收货地址页面
						setTimeout(()=>{
							uni.navigateTo({
								 url: `../Receiving_address/Receiving_address`,
							});
						},500)
					}
				}
			},
			// 封装的校验规则
			SubRule(){
				// let reg=/^([\u4e00-\u9fa5]){2,7}$/; //只能是中文，长度为2-7位
				// 一层一层验证
				// if(!(reg.test(this.Name))){
				if(this.Name==''){
					uni.showToast({
						title:'用户名不符合规范',
						icon:'none'
					})
					return
				}else if (this.Phone==''){
					// if (!(/^1[3456789]\d{9}$/.test(this.Phone)))
					uni.showToast({
						title:'手机号不符合规范',
						icon:'none'
					})
					return
				}
				// 判断地址与街道是否为空
				else if(this.address==''&&this.street==''){
					uni.showToast({
						title:'地址或街道不能为空',
						icon:'none'
					})
					return
				}else{
					// 全部通过
					return true
				}
			}
		}
	}
</script>

<style lang="less">
.HarvestParent{
	.Harvest_information{
		width: 100%;
		background-color: #FFFFFF;
		margin-top: 15rpx;
		view{
			width: 100%;
			height: 120rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: start;
			align-items: center;
			font-size: 30rpx;
			border-bottom: 1px solid rgba(0,0,0,0.08);
			text{
				width: 90rpx;
				margin-right: 30rpx;
			}
			input{
				width: 80%;
			}
			p{
				width: 80%;
				color: #888888;
				input{
					width: 100%;
				}
			}
		}
	}
	.defalt{
		width: 100%;
		background-color: #FFFFFF;
		margin-top: 15rpx;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		box-sizing: border-box;
		text{
			font-size: 30rpx;
		}  border-color: #fa436a;
	}
	.submitBth{
		width: 100%;
		height: 85rpx;
		margin-top: 30rpx;
		button{
			width: 90%;
			height: 100%;
			background-color: #fa436a;
			color: #FFFFFF;
		}
	}
	.picker-btn {
		display: flex;
		height: 100upx;
		width: 100%;
		line-height: 100upx;
		background: #fff;
		font-size: 34upx;
		z-index: 1;
		border-bottom: 1rpx solid #f8f8f8;
	
		.left {
			flex: 1;
			color: #0076FF;
			padding-left: 40upx;
			box-sizing: border-box;
		}
	
		.right {
			flex: 1;
			text-align: right;
			padding-right: 40upx;
			color: #FE4533;
			box-sizing: border-box;
		}
	}
	
	picker-view {
		width: 100%;
		height: 500rpx;
		display: relative;
	}
	.item {
		line-height: 100rpx;
		text-align: center;
	}
	
}
page{background-color: #f1f1f1;}
		/* 提示 */
		.mind{color: #ccc;font-size: 24upx;margin:3%;}
		text{margin:1%;}
		/* 所在地区 */
		.update-message{background-color: #fff;height:95upx;line-height: 95upx;font-size: 32upx;display: flex;border-bottom:2upx solid #e4e4e4;}
		/* 文字 */
		.update-text{flex: 3;text-align: center;}
		/* 右侧input框 */
		.update-input{flex: 7;display: flex;padding: 3.5%;}
		/* 箭头 */
		.jt{height:30upx;width:30upx;margin: auto;margin-right: 20upx;}
		/* 详情 */
		.detail{background-color: #fff;width: 100%;height: 200upx;padding: 2%;}
</style>
