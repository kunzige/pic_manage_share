<template>
	<div class="home">
		<div class="main">
			<div class="menu">
				<el-button class="back" round type="primary" @click="toHome">
					<i class="iconfont icon-fanhui"></i>
					回到首页</el-button>
					
				<h3 style="margin-top: 10px; font-size: 45px; text-align: center;">相关操作</h3>
				<div class="btn-list" @click="clickItem">
					<el-menu
					>
					  <el-menu-item ref="first" index="1" class="o-btn">
											<i class="el-icon-upload"></i>
											<span>图片上传</span>
										</el-menu-item>
					  <el-menu-item ref="second" class="o-btn" index="2">
					    <i class="el-icon-menu"></i>
					    <span slot="title">图片管理</span>
					  </el-menu-item>
						<el-menu-item ref="third" index="3">
						  <i class="el-icon-share"></i>
						  <span slot="title">分享图片</span>
						</el-menu-item>
						<el-menu-item ref="fourth" index="4">
						  <i class="el-icon-s-data"></i>
						  <span slot="title">统计数据</span>
						</el-menu-item>
						<el-menu-item ref="fifth" index="5">
						  <i class="iconfont icon-jiekou" style="margin-right: 10px;"></i>
						  <span slot="title">免费接口</span>
						</el-menu-item>
					</el-menu>
				</div>
			</div>
			
			
			<div class="content">
				<div class="header">
					<div class="title">
						<span>图片管理分享平台</span>
					</div>
					
						  <el-dropdown>
							<div class="el-dropdown-link header-right">
								<div class="name">
									<div>
										<p style="white-space: nowrap;  line-height:9vh;">{{user.username}}</p>
									</div>
								</div>
								<div class="icon">
									<img :src="user.icon" alt="">
								</div>
							</div>
						    <template #dropdown>
						      <el-dropdown-menu>
						        <el-dropdown-item divided>
									<div @click="toSelf"><i class="el-icon-user-solid"></i>我的相关</div>
								</el-dropdown-item>
						        <el-dropdown-item divided>
									<div @click="toNotice" class="notification">
										<el-badge :value="notice_num" class="item" type="primary">
										  <i class="iconfont icon-tongzhi"></i>公告通知
										</el-badge>
									</div>
								</el-dropdown-item>
						        <el-dropdown-item divided>
									<div @click="logout"><i class="iconfont icon-tuichu"></i>退出登陆</div>
								</el-dropdown-item>
						      </el-dropdown-menu>
						    </template>
						  </el-dropdown>
					

				</div>
				<div class="content-main">
					<keep-alive :include="['add','remove']">
						<router-view></router-view>
					</keep-alive>
				</div>
			</div>
		</div>
		
	</div>
		
</template>

<script>
	// import add from './add.vue'
	// import generate from "./generate.vue"
	// import statistic from "./statistic.vue"
	// import remove from "./remove.vue"
	import jwt from "jsonwebtoken"
	
	import { mapState,mapActions } from 'pinia'
	import  usemyStore  from '@/store'
	export default{
		name:"managePic",
		created(){
			var _this=this;
			if(document.getElementById('Loading')){
				document.body.removeChild(document.getElementById('Loading'))
			}
			axios({
				url:"http://127.0.0.1:10013/get/notice",
				method:"post",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
					token:localStorage.getItem("token")
				}
			}).then(res=>{
				_this.notice_num=res.data.sum
			}).catch(err=>{
				_this.$notify({
					type:"error",
					message:"发生了一些错误"
				})
				console.log(err)
			})
		},
		computed: {
		  ...mapState(usemyStore, ['user']),
		},
		data(){
			return{
				index:1,
				notice_num:0
			}
		},
		activated() {
			// this.getuserData()
		},
		components:{
			// add,
			// generate,
			// statistic,
			// remove
		},
		methods:{
			clickItem(e){
				if(e.target.innerText.length>4){
					return
				}
				for(let i=0;i<5;i++){
					this.$refs["third"].$parent.$children[i].$el.className="el-menu-item o-btn"
				}
				if(e.target.innerText=="图片上传"){
					this.$router.push("/mpic/manage/add",()=>{},()=>{})
					this.$refs["first"].$el.className+=" is-active"
				}else if(e.target.innerText=="图片管理"){
					this.$router.push("/mpic/manage/remove",()=>{},()=>{})
					this.$refs["second"].$el.className+=" is-active"
				}else if(e.target.innerText=="分享图片"){
					this.$router.push("/mpic/manage/generate",()=>{},()=>{})
					this.$refs["third"].$el.className+=" is-active"
				}else if(e.target.innerText=="统计数据"){
					this.$router.push("/mpic/manage/statistic",()=>{},()=>{})
					this.$refs["fourth"].$el.className+=" is-active"
				}else if(e.target.innerText=="免费接口"){
					this.$router.push("/mpic/manage/interface",()=>{},()=>{})
					this.$refs["fifth"].$el.className+=" is-active"
				}
			},
			toHome(){
				this.$router.push("/",()=>{},()=>{})
			},
			toSelf(){
				this.$router.push("/mpic/self",()=>{},()=>{})
			},
			toShare(){
				this.$router.push("/mpic/share",()=>{},()=>{})
			},
			toInterface(){
				this.$router.push("/mpic/interface",()=>{},()=>{})
			},
			toNotice(){
				this.$router.push("/mpic/notice",()=>{},()=>{})
			},
			logout(){
				localStorage.removeItem("token");
				this.$message({
					generateClose: true,
					message: '已退出登陆。',
					type: 'success'
				});
				this.$router.push("/mpic/login");

			},
		},
		mounted(){
			if(location.pathname=="/mpic/manage/statistic"){
				this.$refs["fourth"].$el.className+=" is-active"
			}else if(location.pathname=="/mpic/manage/generate"){
				this.$refs["third"].$el.className+=" is-active"
			}else if(location.pathname=="/mpic/manage/remove"){
				this.$refs["second"].$el.className+=" is-active"
			}else if(location.pathname=="/mpic/manage/add"){
				this.$refs["first"].$el.className+=" is-active"
			}else if(location.pathname=="/mpic/manage/interface"){
				this.$refs["fifth"].$el.className+=" is-active"
			}
		}
	}
	
</script>

<style lang="less">
	.home{
		*{
			font-family:"楷体";
		}
		
		.main{
			display: flex;
			justify-content:space-between;
			background-color: #f5f5f5;
			
			.menu{
				margin-top:20px;
				margin-left: 20px;
				width: 25vw;
				height: 93vh;
				padding-left:5px;
				padding-right: 5px;
				padding-top: 10px;
				border-radius: 30px;
				overflow-x:hidden;
				box-shadow:
				-4px -4px 7px rgba(255, 255, 255, 0.99),
				4px 4px 7px rgba(0, 123, 255, 0.6);
				background-color: #f5f5f5;
				
				
				.back{
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					margin-top: 5px;
					margin-left: 10px;
					box-shadow:
					-3px -3px 5px rgba(234, 255, 254, 0.5),
					3px 3px 5px rgba(0, 123, 255, 0.5);
					border: none;
				}
				
				.back:active{
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					margin-left: 10px;
					box-shadow:
					inset -3px -3px 5px rgba(234, 255, 254, 0.5),
					inset 3px 3px 5px rgba(0, 123, 255, 0.5);
					
				}
				
				.el-menu{
					// background-color: #5759ec;
					border-radius: 20px;
					border: none;
					background-color: #f5f5f5;
					display: flex;
					align-items: center;
					flex-direction: column;;
				}
				
				.el-menu-item{
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					border-radius: 30px;
					box-shadow:
					-3px -3px 5px rgba(234, 255, 254, 0.5),
					3px 3px 5px rgba(0, 123, 255, 0.5);
					width: 88%;
					margin-top: 15px;
				}
				.el-menu-item:hover{
					cursor: pointer;
				}
				
				.is-active{
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					box-shadow:
					inset -3px -3px 5px rgba(234, 255, 254, 0.5),
					inset 3px 3px 5px rgba(0, 123, 255, 0.5);
				}
			}
			.content{
				.header{
					width: 66vw;
					margin-right: 20px;
					margin-top: 20px;
					height: 10vh;
					border-radius: 30px;
					display: flex;
					position: relative;
					justify-content: space-between;
					align-items: center;
					box-shadow:
					-3px -3px 5px rgba(255, 255, 255, 0.95),
					3px 3px 5px rgba(0, 123, 255, 0.5);
					
					.title{
						font-size: 30px;
						height: 60px;
						line-height: 60px;
					}
					
					.name{
						position: absolute;
						right: 5vw;
						font-size: 30px;
					}
					
					.icon{
						display: flex;
						justify-content: center;
						align-items: center;
						width: 9vh;
						height: 9vh;
						border-radius: 50%;
						overflow: hidden;
						transition: 1s;
						animation: light 4s ease-in-out infinite;
						border-radius: 50%;
						box-shadow:
						inset -6px -6px 8px rgba(255,255,255,0.5),
						inset 5px 5px 8px rgba(0, 157, 255, 0.5);
						
						img{
							border-radius: 50%;
							width: 7vh;
							height: 7vh;
							
						}
					}
					
					.icon:hover{
				    transform: scale(1.15) rotate(360deg);
					cursor: pointer;

			}
				}
				
				.content-main{
					overflow-x: hidden;
					width: 66vw;
					height: 80vh;
					box-shadow:
					3px 3px 5px rgba(0, 123, 255, 0.8),
					4px 4px 6px rgba(0, 123, 255, 0.8);
					margin-top: 20px;
					border-radius: 15px;
				}
			}
		}
	}
	
</style>