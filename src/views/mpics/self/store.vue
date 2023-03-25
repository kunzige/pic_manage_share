<template>
	<div class="store">
		<el-descriptions  title="相关信息" direction="vertical" :column="1" border>
		<el-descriptions-item label="注册时间">
				<el-tag>
					{{user.reg_time}}
				</el-tag>
			</el-descriptions-item>
		    <el-descriptions-item label="存储图片总数">
				<el-tag size="small" style="font-size: 20px;"  type="warning">{{user.sum}}</el-tag>
				
			</el-descriptions-item>
			<el-descriptions-item label="使用过的图片标签">
				<el-tag style="margin-left: 10px; font-size: 18px;" size="small" type="info" v-for="item in user.labels" >{{item}}</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="备注">
			  <el-tag size="small" style="font-size: 18px;">普通用户</el-tag>
			</el-descriptions-item>
			</el-descriptions>
	</div>
</template>

<script>
import { Icon } from "element-ui"
import jwt from "jsonwebtoken"
import { mapState,mapActions } from 'pinia'
import  usemyStore  from '@/store'
import store from '@/views/mpics/self/store'
	
	export default{
		name:"self",
		data(){
			return{
				dialogFormVisible:false,
				iconFormVisible:false,
				showNew:false,
				iconLoading:false,
				id:"",
				newuser:{
					name:"",
					phone:""
				},
			}
		},
		computed: {
		  ...mapState(usemyStore, ['user']),
		},
		methods:{
			goManage(){
				this.$router.push("/mpic",()=>{},()=>{})
			},
			changeIcon(e){
					this.showNew=true
					var iconFile=this.$refs.file.files[0]
					var iconurl=URL.createObjectURL(iconFile)
					this.$refs.newicon.src=iconurl
			},
			iconbtn(){
				this.$refs.file.click()

			},
			...mapActions(usemyStore,["changeuserIcon"]),
			iconConfirm(){
				let _this=this
				this.iconLoading=true;
				var formData=new FormData()
				formData.append("file",this.$refs.file.files[0])
				formData.append("type","feedback")
				axios({
					url:"https://api.open.oppomobile.com/api/utility/upload",
					method:"post",
					headers:{
						"content-type":"multipart/form-data",
					},
					data:formData
					
				}).then(res=>{
					if(res.status==403){
						// 报错
						_this.error()
						_this.showNew=false
					}else{
						// 数据放到数据库，提示成功
						axios({
							url:"http://127.0.0.1:10013/modify/icon",
							method:"post",
							headers:{
								"content-type":"multipart/form-data",
								
							},
							data:{
								"token":localStorage.getItem("token"),
								"newicon":res.data.data.url,
							}
						}).then(res=>{
							if(res.status==200){
								_this.success()
								_this.iconLoading=false
								_this.user.icon=res.data.newicon
								_this.changeuserIcon(res.data.newicon)
								_this.iconFormVisible=false
								_this.$refs.file.value=""
								_this.showNew=false
							}else{
								_this.iconLoading=false
								_this.error()
							}
						}).catch(err=>{
							_this.iconLoading=false
							_this.error()
						})
						
					}
				}).catch(err=>{
					_this.iconLoading=false
					_this.error()
				})
			},
			iconCancel(){
				this.iconFormVisible = false
				this.showNew=false
			},
			success(){
				this.$notify({
				  title: '成功',
				  message: '修改个人信息成功',
				  type: 'success'
				});
			},
			error(){
				this.$notify.error({
				  title: '错误',
				  message: '修改信息失败'
				});
			}
		},
		mounted() {
			let token=localStorage.getItem("token");
			jwt.verify(token,"mysite.kunzige",(err,userinfo)=>{
				if(err){
					
				}else{
					this.id=userinfo.id

				}
			});
		},
		created(){
			if(document.getElementById('Loading')){
				document.body.removeChild(document.getElementById('Loading'))
			}
			
		}
	}
</script>

<style lang="less">
	.store{
		margin-top: 10px;
		
		.el-descriptions{
			background-color: #f5f5f5;
			
			.el-descriptions__title{
				margin-left: 10px;
			}
			
			.el-tag--light{
				margin-top: 10px;
			}
		}
			
	}
</style>