<template>
	<div class="inter-list" v-loading="loading">
		<div v-for="item in list">
			<el-descriptions title="相关信息">
			    <el-descriptions-item ><el-tag type="warning">链接：</el-tag> {{item.api}}
				</el-descriptions-item>
				<el-descriptions-item colspan="3"><el-tag type="warning">参数说明:</el-tag> {{item.argument}}</el-descriptions-item>
				<el-descriptions-item ><el-tag type="warning">审核:</el-tag><el-button @click="reject(item.api_id)" :disabled="item.agreed==1" round size="mini" type="danger">反对</el-button> <el-button @click="agree(item.api_id,item.api)" :class="{'el-icon-circle-check':item.agreed==1}" size="mini" :disabled="item.agreed==1" round type="primary">同意</el-button> </el-descriptions-item>
			</el-descriptions>
		</div>
	</div>
</template>

<script>
	export default{
		name:"inter-list",
		data(){
			return{
				list:[],
				loading:false,
			}
		},
		methods:{
			agree(api_id,api){
				var _this=this
				// 发送请求
				axios({
					url:"http://127.0.0.1:10013/action/agree",
					method:"POST",
					headers:{
						"content-type":"multipart/form-data"
					},
					data:{
						api_id:api_id,
						token:localStorage.getItem("token")
					}
				}).then(res=>{
					if(res.status==200){
						_this.$notify({
							type:"success",
							message:"已同意"
						})
						// 发送通知
						axios({
							url:"http://127.0.0.1:10013/feedback/notice",
							method:"post",
							headers:{
								"content-type":"multipart/form-data"
							},
							data:{
								token:localStorage.getItem("token"),
								content:`您提供的api:${api}已被管理员同意使用!`,
								title:"api提交结果"
							}
						}).then(res=>{
							
						}).catch(err=>{
							_this.$notify({
								type:"error",
								message:"发生错误"
							})
						})
						
						// 更新数据
						axios({
							url:"http://127.0.0.1:10013/get/apilist",
							method:"post",
							headers:{
								"content-type":"multipart/form-data"
							},
							data:{
								
							}
						}).then(res=>{
							_this.list=[]
							for(let i of res.data){
								this.list.push(i)
							}
						}).catch(err=>{
							_this.$notify({
								type:"error",
								message:"发生错误"
							})
							console.log(err)
						})
					}
				}).catch(err=>{
					_this.$notify({
						type:"error",
						message:"发生错误"
					})
					console.log(err)
				})
			},
			reject(api_id){
				
			}
		},
		created(){
			this.loading=true
			// 获取所有的提交的api
			axios({
				url:"http://127.0.0.1:10013/get/apilist",
				method:"post",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
				}
			}).then(res=>{
				this.loading=false
				for(let i of res.data){
					this.list.push(i)
				}
			}).catch(err=>{
				this.loading=false
				console.log(err)
			})
		},
		updated(){
			var alllink=document.querySelectorAll(".el-descriptions__body  table  tbody  tr  td:nth-child(2)")
			if(alllink){
				alllink.forEach(td=>{
					td.setAttribute("colspan","2")
				}) 
			}
		},
	}
	
</script>

<style lang="less">
	.inter-list{
		
		.el-descriptions-item__label{
			display: none;
		}
	}
	
</style>