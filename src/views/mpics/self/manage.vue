<template>
	<div class="manage" v-loading="loading">
		<el-dialog
		  class="notice"
		  title="通知用户"
		  :visible.sync="noticeVisible"
		  width="30%"
		  :close-on-click-modal="false"
		  :close-on-press-escape="false"
		  >
		  <el-form
		  :model="notice"
		  ref="notice"
		  :rules="noticeRules"
		  >
			  <el-form-item label="输入标题" label-width="400" prop="title">
				  <el-input placeholder="输入通知的标题" v-model="notice.title"></el-input>
			  </el-form-item>
			  <el-form-item label="输入内容" label-width="400" prop="content">
				  <el-input placeholder="输入通知的内容" v-model="notice.content" type="textarea"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="noticeVisible = false">取 消</el-button>
		    <el-button type="primary" @click="confirmNotice">确 定</el-button>
		  </span>
		</el-dialog>
		
		<el-dialog
		  class="store"
		  title="存储管理"
		  :visible.sync="dialogVisible"
		  width="30%"
		  :close-on-click-modal="false"
		  :close-on-press-escape="false"
		  >
		  <el-form
		  ref="store"
		  :rules="storeRules"
		  :model="store"
		  >
			  <el-form-item label="用户存储总数:">
				  <el-tag type="warning">{{store.sum}}</el-tag>
			  </el-form-item>
			  <el-form-item label="用户当前存储容量:">
			  	  <el-tag type="danger">{{store.max}}</el-tag>
			  </el-form-item>
			  <el-form-item label="设置存储容量:" label-width="400" prop="newmax">
				  <el-input v-model="store.newmax" placeholder="输入该用户的最大数量"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="confirmStore">确 定</el-button>
		  </span>
		</el-dialog>
		
		<h2 style="text-align: center;">用户管理</h2>
		<el-card v-for="item in userData">
			<div class="wrapper">
				<a target="_blank" :href="item.infopage"><img :src="item.src" alt=""></a>
				<div class="info">
					<p class="username">{{item.username}}</p>
					<p class="email">{{item.email}}</p>
				</div>
				<div class="operation">
					<el-button round @click="clickStore(item.id)" type="danger">存储管理</el-button>
					<el-button round @click="clickNotice(item.id)" type="warning">通知</el-button>
					
					<el-popconfirm
					  title="确定删除该用户吗?"
					  @confirm="confirmDelete(item.id)"
					>
					  <el-button style="margin-left: 10px;" round  slot="reference" type="primary">删除用户</el-button>
					</el-popconfirm>

				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default{
		name:"manage",
		data(){
			return {
				userData:[],
				dialogVisible:false,
				noticeVisible:false,
				notice:{
					title:"",
					content:""
				},
				currentid:0,
				noticeRules:{
					title:[
						{required:"true",message:"标题不能为空",trigger:"blur"},],
					content:[{required:"true",message:"内容不能为空",trigger:"blur"}]
				},
				store:{
					max:0,
					sum:0,
					newmax:""
				},
				storeRules:{
					newmax:[{required:"true",message:"数值不能为空",trigger:"blur"}]
				},
				loading:false
			}
		},
		methods:{
				confirmNotice(){
					var _this=this;
					this.$refs["notice"].validate(valid=>{
						if(valid){
							// 发送通知
							axios({
								url:"http://127.0.0.1:10013/feedback/infonotice",
								method:"post",
								headers:{
									"content-type":"multipart/form-data"
								},
								data:{
									token:localStorage.getItem("token"),
									user_id:this.currentid,
									content:this.notice.content,
									title:this.notice.title
								}
							}).then(res=>{
								if(res.status==200){
									_this.$notify({
										type:"success",
										message:"成功发送通知"
									})
								}
							}).catch(err=>{
								console.lof(err)
							})
						}else{
							return
						}
					})
				},
				confirmStore(){
					var _this=this;
					this.$refs["store"].validate(valid=>{
						if(valid){
							axios({
								url:"http://127.0.0.1:10013/modify/store",
								method:"post",
								headers:{
									"content-type":"multipart/form-data"
								},
								data:{
									token:localStorage.getItem("token"),
									newmax:this.store.newmax,
									user_id:this.currentid
								}
							}).then(res=>{
								if(res.status==200){
									_this.$notify({
										type:"success",
										message:"修改用户最多存储数量成功"
									})
								}
							}).catch(err=>{
								console.log(err)
							})
						}else{
							return
						}
					})
				},
				clickStore(id){
					this.currentid=id
					this.dialogVisible = true
					// 获取用户存储信息
					axios({
						url:"http://127.0.0.1:10013/get/store",
						method:"post",
						headers:{
							"content-type":"multipart/form-data"
						},
						data:{
							id:id,
							token:localStorage.getItem("token")
						}
					}).then(res=>{
						this.store.sum=res.data.sum
						this.store.max=res.data.max
					}).catch(err=>{
						console.log(err)
					})
				},
				clickNotice(id){
					this.currentid=id
					this.noticeVisible = true
				},
				confirmDelete(id){
					var _this=this;
					axios({
						url:"http://127.0.0.1:10013/delete/user",
						method:"delete",
						headers:{
							"content-type":"multipart/form-data"
						},
						data:{
							token:localStorage.getItem("token"),
							user_id:id
						}
					}).then(res=>{
						if(res.status==200){
							_this.$notify({
								type:"success",
								message:"成功删除用户"
							})
							// 更新列表
							this.userData=[]
							axios({
								url:"http://127.0.0.1:10013/get/alluser",
								method:"post",
								headers:{
									"content-type":"multipart/form-data"
								},
								data:{
									token:localStorage.getItem("token")
								}
							}).then(res=>{
								for(let i of res.data){
									this.userData.push({id:i.id,src:i.icon,username:i.username,email:i.email,infopage:`http://localhost:8080/mpic/user?i=${i.id}`})
								}
							}).catch(err=>{
								console.log(err)
							})
						}
					}).catch(err=>{
						console.log(err)
					})
				}
		},
		created(){
			this.loading=true
			axios({
				url:"http://127.0.0.1:10013/get/alluser",
				method:"post",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
					token:localStorage.getItem("token")
				}
			}).then(res=>{
				this.loading=false
				for(let i of res.data){
					this.userData.push({id:i.id,src:i.icon,username:i.username,email:i.email,infopage:`http://localhost:8080/mpic/user?i=${i.id}`})
				}
			}).catch(err=>{
				this.loading=false
				console.log(err)
			})
		}
	}
</script>

<style lang="less">
	.manage{
		width: 100%;
		
		.notice{
			// 富文本高度
			.el-textarea__inner{
				height: 150px;
			}
			
			.el-form-item__error{
				font-size: 15px;
			}
			
		}
		
		.store{
			
			
			.el-form-item__error{
				font-size: 15px;
			}
		}
		
		.el-card{
			margin-top: 10px;
			
			.wrapper{
				display: flex;
				align-items: center;
				margin-top: 10px;
				position: relative;
				
				img{
					width: 50px;
					height: 50px;
					border-radius: 50%;
				}
				
				.info{
					margin-left: 10px;
				}
				.operation{
					position: absolute;
					top:50%;
					transform: translateY(-50%);
					right: 20px;
					

				}
			}
		}
		
	}
	
</style>