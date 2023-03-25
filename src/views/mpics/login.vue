<template>

	  <div class="login-div">
		  <el-button class="back" round type="primary" @click="toHome">
		  	
		  	<i class="iconfont icon-fanhui"></i>
		  	回到首页</el-button>
	    <div class="logo">
	      <img src="https://p0.meituan.net/dpplatform/c6a12656a0ab1238a6b8192ebce818a0349343.png" alt="">
	    </div>
	    <div class="title">图片管理系统</div>
	    <div class="sub-title">登陆</div>
	    <el-form class="fields"
		:model="user"
		:rules="formRules"
		ref="login-form"
		>
			<el-form-item prop="email">
				<el-input class="username user-input"  type="text" v-model="user.email"  placeholder="邮箱" >
				</el-input>
			</el-form-item>
			
	      <!-- <div class="username"><input type="username" class="user-input" placeholder="用户名" /></div> -->
	     <el-form-item prop="password">
			 <el-input class="password pass-input"  type="password"  v-model="user.password"  placeholder="密码" >
			 </el-input>
		 </el-form-item>
		  <!-- <div class="password"><input type="password" class="pass-input" placeholder="密码" /></div> -->
			<el-button class="signin-button" :loading="loading"  @click="login">立即登陆</el-button>
		</el-form>
	    <div class="link">
	      <a href="#">忘记密码?</a> or <a href="/mpic/register">注册账号</a>
	    </div>
	  </div>

</template>

<script>
	import jwt from "jsonwebtoken"
	import axios from "axios"
	import crypto from "crypto"
	import { Message } from 'element-ui';
	import {mapActions} from 'pinia'
	import usemyStore from '@/store'
	
	export default{
		name:"login",
		methods:{
				toHome(){
					this.$router.push("/",()=>{},()=>{})
				},
				login(){
					let _this=this
					_this.$refs["login-form"].validate(valid=>{
						if(valid){
							var e_password=crypto.createHash('md5').update(_this.user.password).digest('hex').toUpperCase() //转化为16进制
							_this.loading=true
							axios({
								url:"http://127.0.0.1:10013/login",
								method:"post",
								headers:{
									"content-type":"multipart/form-data"
								},
								data:{
									email:this.user.email,
									password:e_password
								}
							}).then(res=>{
								if(res.status==200){
									_this.loading=false
									_this.$message({
										showClose: true,
										message: '恭喜你，登陆成功。',
										type: 'success'
									});
									localStorage.setItem("token",res.data.token)
									localStorage.setItem("refresh_token",res.data.refresh_token)
									_this.$router.push("/mpic/manage",()=>{},()=>{})
									_this.getuserData()
								}
								
							}).catch(err=>{
								_this.loading=false
								_this.$notify.error({
								  title: '错误',
								  message: '用户名/密码错误'
								});
							})
						}else{
							return
						}
					})
				},
				...mapActions(usemyStore,['getuserData'])
		},
		data(){
			return{
				user:{
					email:"",
					password:""
				},
				loading:false,
				formRules:{
					email:[{required:true,message:"请输入邮箱",trigger:"blur"}],
					password:[{required:true,message:"请输入密码",trigger:"blur"}]
				}
			}
		},
		created(){
			if(document.getElementById('Loading')){
					document.body.removeChild(document.getElementById('Loading'))
			}
		},
		mounted(){

		}
	}
	
</script>

<style lang="less">
	.login-div {
	    width: 400px;
	    height: 100%;
	    padding: 60px 35px 35px 35px;
	    border-radius: 40px;
	    background: #ecf0f3;
	    box-shadow: 13px 13px 20px #cbced1,
	        -13px -13px 20px #ffffff;
	        margin: 0 auto;
			
		.back{
			position: absolute;
			left:10px;
			top:5px;
			background-color: rgba(225, 253, 255, 0.5);
			color:blue;
			box-shadow:
			-3px -3px 5px rgba(234, 255, 254, 0.5),
			3px 3px 5px rgba(0, 123, 255, 0.5);
		}
		
		.back:active{
			background-color: rgba(225, 253, 255, 0.5);
			color:blue;
			box-shadow:
			inset -3px -3px 5px rgba(234, 255, 254, 0.5),
			inset 3px 3px 5px rgba(0, 123, 255, 0.5);
			
		}
		.logo {
		    width: 100px;
		    height: 100px;
		    border-radius: 50%;
		    margin: 0 auto;
		    box-shadow:
		        /* logo shadow */
		        0px 0px 2px #5f5f5f,
		        /* offset */
		        0px 0px 0px 5px #ecf0f3,
		        /*bottom right */
		        8px 8px 15px #a7aaaf,
		        /* top left */
		        -8px -8px 15px #ffffff;
		}
		.logo img{
		    width: 100%;
		    height: 100%;
		    border-radius: 50%;
		}
		.title {
		    text-align: center;
		    font-size: 28px;
		    padding-top: 24px;
		    letter-spacing: 0.5px;
		}
		
		.sub-title {
		    text-align: center;
		    font-size: 15px;
		    padding-top: 7px;
		    letter-spacing: 3px;
		}
		
		.fields {
		    width: 100%;
		    padding: 75px 5px 5px 5px;
			
			.el-form-item{
				
				.el-form-item__error{
					top:65%;
					font-size: 18px;
				}
			}
		}
		
		.fields input {
		    border: none;
		    outline: none;
		    background: none;
		    font-size: 18px;
		    color: #6581ff;
			font-size: 18px;
		    padding: 20px 15px 20px 5px;
			
		}
		
		.fields input::placeholder{
		    color:#767676;
		}
		
		.username,
		.password {
		    margin-bottom: 30px;
		    border-radius: 25px;
		    box-shadow: inset 8px 8px 8px #cbced1,
		        inset -8px -8px 8px #ffffff;
		}
		
		.fields svg {
		    height: 22px;
		    margin: 0 10px -3px 25px;
		}
		
		.signin-button {
		    outline: none;
		    border: none;
		    cursor: pointer;
		    width: 100%;
		    height: 60px;
		    border-radius: 30px;
		    font-size: 20px;
		    font-weight: 700;
		    font-family: 'Lato', sans-serif;
		    color: #fff;
		    text-align: center;
		    background: #24cfaa;
		    box-shadow: 3px 3px 8px #b1b1b1,
		        -3px -3px 8px #ffffff;
		    transition: 0.5s;
		}
		
		.signin-button:hover {
		    background: #2fdbb6;
		}
		
		.signin-button:active {
		    background: #1da88a;
		}
		
		.link {
		    padding-top: 20px;
		    text-align: center;
		}
		
		.link a {
		    text-decoration: none;
		    color: #aaa;
		    font-size: 15px;
		}
		
	}

</style>