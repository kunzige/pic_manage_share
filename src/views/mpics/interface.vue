<template>
	<div class="interface">
		<h2>如果您有好的免费接口，请提供给我。</h2>
		
		<div class="input-form">
			<el-form
			:model="input"
			ref="form"
			:rules="formRules"
			>
				<el-form-item
				label-width="150px"
				label="请输入接口地址:"
				prop="api"
				>
					<el-input style="width: 300px;" v-model="input.api" placeholder="请输入接口地址"></el-input>
				</el-form-item>
				
				<el-form-item
				label-width="150px"
				label="参数说明:"
				prop="argu"
				>
					<el-input 
					type="textarea"
					style="width: 300px;" v-model="input.argu" placeholder="参数说明|JSON格式"></el-input>
				</el-form-item>
				
					<el-form-item
					>
						<el-button @click="submit" 
						:loading="loading"
						style="margin-left: 400px; width: 80px;" type="primary" >提交</el-button>
					</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default{
		name:"interface",
		data(){
			return{
				input:{
					argu:"",
					api:"",
				},
				formRules:{
					api:[{required:true,message:"链接不能为空",trigger:"blur"},
					{pattern:/http|https:\/\/.*/i,message:"输入正确的url格式，以http/https开头",trigger:"change"}],
					argu:[{required:true,message:"参数不能为空",trigger:"blur"}]
				},
				loading:false,
			}
		},
		methods:{
			submit(){
				// 校验表单
				var _this=this
				this.$refs["form"].validate(valid=>{
					if(valid){
						try{
							JSON.parse(_this.input.argu)
							// 是JSON格式提交到数据库
							_this.loading=true
							axios({
								url:"http://127.0.0.1:10013/feedback/api",
								method:"post",
								headers:{
									"content-type":"multipart/form-data"
								},
								data:{
									api:this.input.api,
									argument:this.input.argu
								}
							}).then(res=>{
								if(res.status==200){
									_this.$notify({
										type:"success",
										message:"提交api成功"
									})
									_this.loading=false
								}
							}).catch(err=>{
								_this.loading=false
								console.log(err)
							})
						}catch(err){
							_this.loading=false
							console.log(err)
							_this.$notify({
								type:"error",
								message:"请输入JSON格式数据"
							})
						}
					}else{
						return
					}
				})
			}
		}
	}
	
</script>

<style lang="less">
	.interface{
		h2{
			font-size: 25px;
		}
		
		.input-form{
			margin-top: 20px;
			
			.el-form-item__error{
				font-size: 18px;
			}
			
			.el-form-item{
				margin-top: 20px;
				
				.el-textarea__inner{
					height: 250px;
				}
			}
			

		}
		
	}
</style>