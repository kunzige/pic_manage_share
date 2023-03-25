<template>

	  <div class="register-div">
		  <el-button class="back" round type="primary" @click="toHome">
		  	
		  	<i class="iconfont icon-fanhui"></i>
		  	回到首页</el-button>
	    <div class="logo">
	      <img src="https://p0.meituan.net/dpplatform/c6a12656a0ab1238a6b8192ebce818a0349343.png" alt="">
	    </div>
	    <div class="title">图片管理系统</div>
	    <div class="sub-title">注册</div>
<!-- 	    <div class="fields">
	      <div class="username"><input type="username" class="user-input" v-model="username"  placeholder="用户名" /></div>
	      <div class="password"><input type="password" class="pass-input" v-model="password"  placeholder="密码" /></div>
		  <div class="password"><input type="password" class="pass-input" v-model="cpassword" placeholder="确认密码" /></div>
		  <div class="email"><input type="text"  class="pass-input" v-model="email" placeholder="邮箱" /></div>
		  <div class="sendmail">
			  <div class="code"><input type="text" class="pass-input" v-model="code" placeholder="请输入验证码" />
			  </div>
			  <el-button round class="send-btn" :disabled="disabled" :loading="loading" @click="sendMail">{{btnText}}</el-button>
		  </div>
	    </div> -->
		<el-form class="fields"
		 ref="register-form"
		 :model="user" 
		 :rules="formRules">
			<el-form-item prop="username">
				<el-input class="username user-input"  type="username"  v-model="user.username"  placeholder="用户名" >
				</el-input>
				<!-- <div class="username"><input type="username" class="user-input" v-model="user.username"  placeholder="用户名" /></div> -->
			</el-form-item>
			<el-form-item prop="password">
				<el-input class="password pass-input"  type="password"  v-model="user.password"  placeholder="密码" >
				</el-input>
				<!-- <div class="password"><input type="password" class="pass-input" v-model="user.password"  placeholder="密码" /></div> -->
			</el-form-item>
			<el-form-item prop="cpassword">
				<el-input class="password pass-input"  type="password"  v-model="user.cpassword"  placeholder="确认密码" >
				</el-input>
				<!-- <div class="password"><input type="password" class="pass-input" v-model="user.cpassword" placeholder="确认密码" /></div> -->
			</el-form-item>
			<el-form-item prop="email">
				<el-input class="email pass-input"  type="text"  v-model="user.email"  placeholder="邮箱" >
				</el-input>
				
				<!-- <div class="email"><input type="text"  class="pass-input" v-model="user.email" placeholder="邮箱" /></div> -->
			</el-form-item>
			<el-form-item prop="code">
				<div class="sendmail">
								<el-input class="code pass-input"  type="text"  v-model="user.code"  placeholder="验证码" >
								</el-input>
							  <!-- <div class="code"><input type="text" class="pass-input" v-model="user.code" placeholder="请输入验证码" /></div> -->
							  <el-button round class="send-btn" :disabled="disabled" :loading="loading" @click="sendMail">{{btnText}}</el-button>
				</div>
			</el-form-item>
		</el-form>
		
	    <el-button :loading="rloading" class="signin-button" @click="register">立即注册</el-button>
	    <div class="link">
	      <a href="#">忘记密码?</a> or <a href="/mpic/login">进行登陆</a>
	    </div>
	  </div>

</template>

<script>
	import axios from 'axios'
	import qs from "qs"

	export default{
		name:"register",
		methods:{
				toHome(){
					this.$router.push("/",()=>{},()=>{})
				},
				sendMail(){
					// 发送loading发送成功的话，就disabled倒计时
					let _this=this
					let waits=document.querySelector(".send-btn")
					let second=5
					_this.loading=true

					// headers:{
					// 			"content-type":"multipart/form-data",
					// 	},
					// 	data:{
					// 		mail:this.email
					// 	},
					
					axios({
						url:"http://127.0.0.1:10013/sendcode",
						method:"post",
						headers:{
							"content-type":"application/x-www-form-urlencoded",
						},
						data:qs.stringify({mail:this.user.email})
						
					}).then(res=>{
						if(res.status==200){
							this.$notify({
							  title: '成功',
							  message: '邮件发送成功',
							  type: 'success'
							});
						let myInterval=setInterval(()=>{
							_this.btnText=`${second}s后重试`
							second--
							_this.loading=false
							_this.disabled=true
							if(second==0){
								clearInterval(myInterval)
								_this.disabled=false
								_this.btnText="发送验证码"
							}
						},1000)
						
						}else{
							this.$notify.error({
							  title: '错误',
							  message: '邮件发送失败，请重试'
							});
							_this.loading=false
						}
					})
					.catch(err=>{
						this.$notify.error({
						  title: '错误',
						  message: '邮件发送失败，请重试'
						});
						_this.loading=false
					})
				}
				,register(){
					let _this=this
					this.$refs['register-form'].validate(valid=>{
						if(!valid){
							return
						}else{
							if(this.user.password!=this.user.cpassword){
								        this.$notify({
								          title: '警告',
								          message: '两次输入的密码不一致',
								          type: 'warning'
								        });
										return
							}else{
								_this.rloading=true
								let date=new Date()
								let time=date.getFullYear()+"-"+((date.getMonth()+1)>=10?(date.getMonth()+1):'0'+(date.getMonth()+1))+"-"+(date.getDate()>=10?date.getDate():'0'+date.getDate())+" "+(date.getHours()>=10?date.getHours():'0'+date.getHours())+":"+(date.getMinutes()>=10?date.getMinutes():'0'+date.getMinutes())+":"+(date.getSeconds()>=10?date.getSeconds():'0'+date.getSeconds())
								axios({
									url:"http://127.0.0.1:10013/register",
									method:"post",
									headers:{
										"content-type":"multipart/form-data"
									},
									data:{
										email:this.user.email,
										password:this.user.password,
										username:this.user.username,
										register_time:time,
										code:this.user.code
									}
								}).then(res=>{
									console.log(res)
									if(res.status==200){
										        this.$notify({
										          title: '成功',
										          message: '注册成功',
										          type: 'success'
										        });
												_this.rloading=false
												_this.$router.push('/mpic/login')
									}
								}).catch(err=>{

										this.$notify({
										  title: '警告',
										  message:err.response.data,
										  type: 'warning'
										});
										_this.rloading=false

								})
							}
						}
					})
				}
		},
		data(){
			return{
				loading:false,
				disabled:false,
				btnText:"发送验证码",
				rloading:false,
				user:{
					email:"",
					username:"",
					password:"",
					code:"",
					cpassword:""
				},
				formRules:{
					username:[{required:true,message:"请输入用户名",trigger:"blur"}],
					password:[{required:true,message:"请输入密码",trigger:"blur"}],
					cpassword:[{required:true,message:"请确认密码",trigger:"blur"}],
					code:[{required:true,message:"请输入验证码",trigger:"blur"}],
					email:[{required:true,message:"请输入邮箱",trigger:"blur"}],
				}
			}
		},
		created(){
			if(document.getElementById('Loading')){
					document.body.removeChild(document.getElementById('Loading'))
			}
		}
	}
	
</script>

<style lang="less">
	.register-div {
	    width: 400px;
	    height: 100%;
	    padding: 30px 15px 35px 35px;
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
		    width: 80px;
		    height: 80px;
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
		    padding: 0px 0px 5px 5px;
		}
		.el-form-item{
			margin-bottom: 0px !important;
			
			input::placeholder{
				color:#717171;
			}
			
			.el-form-item__error{
				top:60%;
				font-size: 18px;
			}
		}
		
		
		.fields input {
		    border: none;
		    outline: none;
		    background: none;
		    font-size: 18px;
		    color: #555;
		    padding: 5px 5px 10px 20px;
		}
		
		.username,
		.password,.email, {
		    margin-bottom: 30px;
		    border-radius: 25px;
		    box-shadow: inset 8px 8px 8px #cbced1,
		        inset -8px -8px 8px #ffffff;
		}
		.sendmail{
			display:flex;
			position: relative;
			
			.code{
				width: 50%;
				margin-bottom: 30px;
				border-radius: 25px;
				box-shadow: inset 8px 8px 8px #cbced1,
				    inset -8px -8px 8px #ffffff;
				
			}
			
			.send-btn{
				position: absolute;
				right: -10px;
				height: 40px !important;
				background-color: rgba(225, 253, 255, 0.5);
				right: 3px;
				box-shadow: 3px 5px 3px #cbced1,
				    -3px -5px 3px #ffffff;
			}
			
			.send-btn:active{
				
				box-shadow:inset 3px 5px 3px #cbced1,
				inset    -3px -5px 3px #ffffff;
			}
			
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
		    height: 40px;
		    border-radius: 20px;
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