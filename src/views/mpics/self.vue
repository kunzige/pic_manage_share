<template>
	<div class="self">
		<div class="self_left">
			<div class="self_img">
				<img @click="iconFormVisible=true" title="修改头像" class="self_icon" :src="user.icon" alt="">
			</div>
			<p class="self_username">{{username}}</p>
			<input @change="changeIcon" type="file" hidden ref="file">
			<el-dialog   title="修改头像" :visible.sync="iconFormVisible"
			:close-on-click-modal="false"
			>
			 <div class="iconform" style="height: 160px; display: flex; flex-direction: column; align-items: center;">
				 <div >
					 <p>原头像：</p>	<img :src="user.icon"  alt=""  class="oldicon">
				 </div>
				 
				 <el-button v-show="!showNew" @click="iconbtn" type="primary" round>上传头像</el-button>
				 
				<div v-show="showNew">
					<p>新头像：</p>	<img src="" @click="$refs.file.click()"  ref="newicon"  alt="" class="newicon" >
				</div>
			 </div>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="iconCancel">取 消</el-button>
			    <el-button :loading="iconLoading" type="primary" @click="iconConfirm">确 定</el-button>
			  </div>
			</el-dialog>
			
			<el-dialog 
			:close-on-click-modal="false"
			title="修改用户信息" :visible.sync="dialogFormVisible">
			  <el-form 
			  :model="newuser"
			  :rules="formRules"
			  ref="user_info"
			  >
			    <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
			      <el-input v-model="newuser.name" autocomplete="off"></el-input>
			    </el-form-item>
				<el-form-item label="电话号码" :label-width="formLabelWidth" prop="name">
				  <el-input v-model="newuser.phone" autocomplete="off"></el-input>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">取 消</el-button>
			    <el-button type="primary" :loading="modifyLoading" @click="modifyinfo">确 定</el-button>
			  </div>
			</el-dialog>
			
			<el-form class="common-info">
				<el-form-item label="用户ID" label-width="70px" >
					<el-input  disabled :placeholder="id"></el-input>
				</el-form-item>
				<el-form-item label="用户名" label-width="70px" prop="username">
					<el-tag style="width: 230px; height: 50px; line-height: 40px; font-size: 18px;">
						{{user.username}}
					</el-tag>
				</el-form-item>
				<el-form-item label="邮箱" label-width="70px">
					<el-tag style="width: 230px; height: 50px; line-height: 40px; font-size: 18px;">
						{{user.email}}
					</el-tag>
				</el-form-item>
				<el-form-item label="电话号码" label-width="70px">
					<el-input disabled :placeholder="user.phone"> </el-input>
				</el-form-item>
				<el-button class="modify" @click="dialogFormVisible = true" style="position: absolute; right: 10px; bottom:5px;">修改</el-button>
			</el-form>
		</div>
		<div class="self_right">
			<div style="height: 45px;">
				<el-button class="gomanage" @click="goManage">回到首页</el-button>
			</div>
			<div class="relative_info">
				<el-menu mode="horizontal"
				:default-active="0"
				>	
					<el-menu-item v-for="value,index in items" :index="index" @click="changeIndex(index)">{{value}}</el-menu-item>
					<el-menu-item v-if="id==1" :index="4" @click="changeIndex(4)">接口审核</el-menu-item>
					<el-menu-item v-if="id==1" :index="5" @click="changeIndex(5)">用户管理</el-menu-item>
				</el-menu>
					<store v-if="index==0"></store>
					<share v-if="index==1"></share>
					<zan v-if="index==2"></zan>
					<follow v-if="index==3"></follow>
					<interfacelist v-if="index==4"></interfacelist>
					<manage v-if="index==5"></manage>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios"
import { Icon } from "element-ui"
import jwt from "jsonwebtoken"
import { mapState,mapActions } from 'pinia'
import  usemyStore  from '@/store'
import store from '@/views/mpics/self/store'
import share from "@/views/mpics/self/share"
import zan from "@/views/mpics/self/zan"
import follow from "@/views/mpics/self/follow"
import interfacelist from "@/views/mpics/self/interface_list"
import manage from "@/views/mpics/self/manage"

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
				index:0,
				items:["个人信息","我的分享","我的点赞","我的关注"],
				formRules:{
					name:[{required:true,message:"请输入用户名",trigger:"blur"},],
					phone:[{required:true,message:"请输入手机号",trigger:"blur"},]
				},
				modifyLoading:false
			}
		},
		components:{
			store,
			share,
			zan,
			follow,
			interfacelist,
			manage
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
			modifyinfo(){
				var _this=this;
				this.modifyLoading=true
				this.$refs["user_info"].validate(valid=>{
					if(valid){
						axios({
							url:"http://127.0.0.1:10013/modify/info",
							method:"POST",
							headers:{
								"content-type":"multipart/form-data"
							},
							data:{
								token:localStorage.getItem("token"),
								newname:this.newuser.name,
								newphone:this.newuser.phone
							}
						}).then(res=>{
							if(res.status==200){
								this.dialogFormVisible = false
								_this.$notify({
									type:"success",
									message:"修改成功"
								})
								this.user.name=this.newuser.name
								this.user.phone=this.newuser.phone
								this.modifyLoading=false
							}
						}).catch(err=>{
							_this.$notify({
								type:"error",
								message:"修改失败"
							})
							this.modifyLoading=false
						})
					}else{
						this.modifyLoading=false
						return
					}
				})
				
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
			},
			changeIndex(index){
					this.index=index
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
	
	.self{
		display: flex;
		height: 100vh;
		background-color: #f5f5f5;
		
		.self_left{
			flex:4;
			background-color: #f5f5f5;
			display: flex;
			align-items: center;
			flex-direction: column;
			
			.iconform{
				display: flex;
				justify-content: center;
				
				.oldicon{
					border-radius: 50%;
					width: 70px;
					height: 70px;
				}
				.newicon{
					border-radius: 50%;
					width: 70px;
					height: 70px;
				}
				
				.newicon:hover{
					cursor:pointer;
				}
			}
			
			.self_img{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 15vh;
				height: 15vh;
				border-radius: 50%;
				overflow: hidden;
				transition: 1s;
				animation: light 4s ease-in-out infinite;
				border-radius: 50%;
				box-shadow:
				inset -6px -6px 8px rgba(255,255,255,0.5),
				inset 5px 5px 8px rgba(0, 157, 255, 0.5);
				
				.self_icon{
						border-radius: 50%;
						width: 13vh;
						height: 13vh;
				}

				.self_icon:hover{
					cursor:pointer;
				}
			}
			
			.self_username{
				font-size: 20px;
			}
			.common-info{
				width: 25vw;
				height: 60vh;
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-evenly;
				border-radius: 20px;
				box-shadow:
				inset -3px -3px 5px rgba(0, 123, 255, 0.5),
				inset 3px 3px 5px rgba(0, 123, 255, 0.5);
				
				input{
					font-size: 18px;
				}
				
				.el-input__inner{
					width: 18vw;
					height: 6vh;
				}
			}
			
			
		}

		.self_right{
			flex:6.5;
			background-color: #f5f5f5;
			position: relative;
			
			.gomanage{
					border-radius: 30px;
					margin-left: 10px;
					border:none;
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					box-shadow:
						-3px -3px 5px rgba(234, 255, 254, 0.5),
						3px 3px 5px rgba(0, 123, 255, 0.5);
					
				}
				
				.gomanage:active{
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					box-shadow:
					inset -3px -3px 5px rgba(234, 255, 254, 0.5),
					inset 3px 3px 5px rgba(0, 123, 255, 0.5);
					
				}
			
			.relative_info{
				width: 60vw;
				background-color: #f5f5f5;
				border-radius: 10px;
				margin-top: 10px;
				overflow-y:auto;
				height: 88vh;
				box-shadow:
				-3px -3px 5px rgba(0, 123, 255, 0.5),
				3px 3px 5px rgba(0, 123, 255, 0.5); 
				
			}
			
			.el-menu{
				height: 50px;
				
				.el-menu-item{
					border-radius: 30px;
					margin:5px;
					border:none;
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					height: 40px;
					line-height: 40px;
					box-shadow:
						-3px -3px 5px rgba(234, 255, 254, 0.5),
						3px 3px 5px rgba(0, 123, 255, 0.5);
					
				}
				
				.el-menu-item:active{
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					box-shadow:
					inset -3px -3px 5px rgba(234, 255, 254, 0.5),
					inset 3px 3px 5px rgba(0, 123, 255, 0.5);
					
				}
				
				.is-active{
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					box-shadow:
					inset -3px -3px 5px rgba(234, 255, 254, 0.5),
					inset 3px 3px 5px rgba(0, 123, 255, 0.5);
					
				}
			}
			
		}
		
	}
</style>