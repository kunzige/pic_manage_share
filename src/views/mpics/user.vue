<template>
	<div class="self">
		<div class="self_left">
			<div class="self_img">
				<img @click="iconFormVisible=true" title="头像" class="self_icon" :src="user.icon" alt="">
			</div>
			<div class="header-info">
				<p class="self_username">{{user.username}}</p>
				<el-button @click="follow" v-if="is_follow==0"  icon="iconfont icon-yiguanzhu">点击关注</el-button>
				<el-button v-else @click="follow" class="is-follow" icon="iconfont icon-yiguanzhu">已关注</el-button>
			</div>
			<input  type="file" hidden ref="file">

			

			
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
			</el-form>
		</div>
		<div class="self_right">
			<div style="height: 45px;">
				<el-button class="gomanage" @click="back">返回</el-button>
			</div>
			<div class="relative_info">
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
			</div>
		</div>
	</div>
</template>

<script>
import { Icon } from "element-ui"

import store from '@/views/mpics/self/store'


	export default{
		name:"user",
		data(){
			return{
				dialogFormVisible:false,
				iconFormVisible:false,
				showNew:false,
				iconLoading:false,
				id:"",
				user:{},
				is_follow:0
			}
		},
		components:{
			store,
		},
		computed: {
		},
		methods:{
			back(){
				this.$router.push("/mpic/self",()=>{},()=>{})
			},
			follow(){
				var _this=this
				if(!localStorage.getItem("token")){
					_this.$notify({
						type:'error',
						message:"取消关注失败,请登录后操作。"
					})
				}
				if(this.is_follow==0){
					axios({
						url:"http://127.0.0.1:10013/action/follow",
						method:"post",
						headers:{
							"content-type":"multipart/form-data"
						},
						data:{
							token:localStorage.getItem("token"),
							target:this.$route.query.i
						}
					}).then(res=>{
						if(res.status==200){
							_this.$notify({
								type:"success",
								title:"成功",
								message:"关注成功"
							})
						}
						_this.is_follow=1
					}).catch(err=>{
						_this.$notify({
							type:"error",
							message:"操作失败"
						})
					})
				}else{
					axios({
						url:"http://127.0.0.1:10013/action/cancelfollow",
						method:"delete",
						headers:{
							"content-type":"multipart/form-data"
						},
						data:{
							token:localStorage.getItem("token"),
							target:this.$route.query.i
						}
					}).then(res=>{
						if(res.status==200){
							_this.$notify({
								message:"取消关注"
							})
						}
						_this.is_follow=0
					}).catch(err=>{
						_this.$notify({
							type:"error",
							message:"操作失败"
						})
					})
				}
			}
		},
		mounted() {
			
		},
		async created(){
			if(document.getElementById('Loading')){
				document.body.removeChild(document.getElementById('Loading'))
			}
			this.id=this.$route.query.i;
			await axios({
					url:"http://127.0.0.1:10013/get/info",
					method:"post",
					headers:{
						"content-type":"multipart/form-data"
					},
					data:{
						id:this.id
					}
				}).then(res=>{
					this.user={
						username:res.data.username,
						icon:res.data.icon,
						reg_time:res.data.register_time,
						email:res.data.email,
						labels:res.data.labels,
						sum:res.data.sum,
						phone:res.data.phone,
						sum:res.data.sum,
						labels:res.data.labels
					}
				})
				
				// 查看是否关注
				axios({
					url:"http://127.0.0.1:10013/get/qfollow",
					method:"post",
					headers:{
						"content-type":"multipart/form-data"
					},
					data:{
						token:localStorage.getItem("token"),
						target:this.$route.query.i
					}
				}).then(res=>{
					console.log(res)
					this.is_follow=res.data.is_follow
				})
			
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
			
			
			.header-info{
				margin-top: 10px;
				display:flex;
				align-items: center;
				justify-content: space-around;
				
				.el-button{
					margin-left: 10px;
				}
				
				
				.is-follow{
					color:blue
				}
			}
			.common-info{
				width: 25vw;
				height: 60vh;
				margin-top: 10px;
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
				width: 55vw;
				background-color: #f5f5f5;
				border-radius: 10px;
				margin-top: 10px;
				overflow-y:auto;
				height: 88vh;
				box-shadow:
				-3px -3px 5px rgba(0, 123, 255, 0.5),
				3px 3px 5px rgba(0, 123, 255, 0.5); 
				
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
				
			}
			
		}
		
	}
</style>