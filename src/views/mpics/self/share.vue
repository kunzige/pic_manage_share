<template>
	<div class="share" v-loading="loading">
		<div class="title">
			<h2>我的分享</h2>
		</div>
		<div class="table">
			<el-table
			 border
			:data="tableData">
				<el-table-column
				 label="标签"
				 width="180"
				 >
					  <template slot-scope="scope">
							<el-tag v-for="item in scope.row.label">{{item}}</el-tag>
					  </template>
				</el-table-column>
				
				<el-table-column
				 label="分享链接">
					  <template slot-scope="scope">
							<el-link :href="scope.row.link" target="_blank">{{scope.row.link}}</el-link>
					  </template>
				</el-table-column>
				
				<el-table-column
				label="取消分享"
				class="cancelbtn"
				width="120"
				>
						<template slot-scope="scope">
							<el-popconfirm
							@confirm="confirm(scope.row.info.i,scope.row.info.s)"
							@cancel="cancel"
							  title="确认取消分享吗？"
							>
							  <el-button round  type="primary" slot="reference">取消</el-button>
							</el-popconfirm>
						</template>
				</el-table-column>
				
			</el-table>
		</div>
	</div>
</template>

<script>
	
	export default{
		name:"show",
		data(){
			return {
				tableData:[],
				totalData:[],
				group:0,
				loading:false
			}
		},
		async created(){
			this.loading=true
			await axios({
				url:"http://127.0.0.1:10013/get/link",
				method:"post",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
					token:localStorage.getItem("token")
				}
			}).then(res=>{
				// 总数据
				this.loading=false
				for(let i of res.data){
					// this.totalData.push({link:`http://127.0.0.1:8080/mpic/show?i=${i.user_id}&s=${i.show_id}`,label:i.label.split(",")})
					this.tableData.push({info:{i:i.user_id,s:i.show_id},link:`http://localhost:8080/mpic/show?i=${i.user_id}&s=${i.show_id}`,label:i.label.split(",")})
				}
				// 分组数据
				// if(this.totalData.length<=5){
				// 	for(let i of this.totalData){
				// 		this.tableData.push(i)
				// 	}
				// }else{
				// 	for(let i=this.group*5;i<this.group*5+5;i++){
				// 		this.tableData.push(this.totalData[i])
				// 	}
				// }
				
			}).catch(err=>{
				this.loading=false
				console.log(err)
			})
		},
		mounted(){
			
		},
		async activated(){
			await axios({
				url:"http://127.0.0.1:10013/get/link",
				method:"post",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
					token:localStorage.getItem("token")
				}
			}).then(res=>{
				// 总数据
				this.tableData=[]
				for(let i of res.data){
					this.tableData.push({info:{i:i.user_id,s:i.show_id},link:`http://127.0.0.1:8080/mpic/show?i=${i.user_id}&s=${i.show_id}`,label:i.label.split(",")})
				}

				
			}).catch(err=>{
				console.log(err)
			})
		},
		methods:{
			toHome(){
				this.$router.push("/mpic",()=>{},()=>{})
			},
			async confirm(i,s){
				// 数据库删除，然后过滤，清空后重新push
				await axios({
					url:"http://127.0.0.1:10013/delete/share",
					method:"delete",
					headers:{
						"content-type":"multipart/form-data"
					},
					data:{
						token:localStorage.getItem("token"),
						show_id:s
					}
				}).then(res=>{
					if(res.status==200){
						this.$notify({
							type:"success",
							message:"取消分享成功"
						})
						
						this.tableData=this.tableData.filter((value,index,arr)=>{
							return value.info.s!=s
						})
						
					}
				}).catch(err=>{
					this.$notify({
						type:'error',
						message:"删除失败"
					})
				})
			},
			cancel(){
				this.$message({
					message:"取消操作"
				})
			}
		}
	}
	
</script>

<style lang="less">
	.share{
		
		.title{
			display: flex;
			margin-top:15px;
			justify-content: center;
			
			h2{
				font-size: 20px;
			}
		}
		
		.table{
			margin-top: 10px;
			.el-tag{
				margin-left: 5px;
				margin-top: 5px;
				font-size: 20px;
			}
			.el-link{
				font-size: 15px;
			}
			
			.cell{
				font-size: 20px;
			}
		}
		
	}
	
</style>