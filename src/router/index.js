import Vue from 'vue'
import VueRouter from 'vue-router'
import { Notification } from 'element-ui';
import jwt from "jsonwebtoken"

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name:"home",
		component: ()=>import("@/views/home.vue"),
		children:[
			{
				path:"",
				name:"introduction",
				component:()=>import("@/views/home/introduction.vue")
			},
		]
	},
	{
    path: '/home',
    component: ()=>import("@/views/home.vue"),
	children:[
		{
			path:"",
			name:"introduction",
			component:()=>import("@/views/home/introduction.vue")
		},
		{
			path:"about",
			name:"about",
			component:()=>import("@/views/home/About.vue")
		},
		{
			path:"function",
			component:()=>import("@/views/home/function.vue")
		},
		{
			path:"process",
			name:"rocess",
			component:()=>import("@/views/home/process.vue")
		},
		{
			path:"message",
			name:"message",
			component:()=>import("@/views/home/message.vue")
		}
	]
  },
	{
		path:"/pics",
		name:"pics",
		component:()=>import("@/views/pics.vue"),
		children:[
		{
			path:"",
			component:()=>import("@/views/pics/mt.vue")
		},
		{
			path:"mt",
			name:"mt",
			component:()=>import("@/views/pics/mt.vue"),
		},
		{
			path:"wangyi",
			name:"wangyi",
			component:()=>import("@/views/pics/wangyi.vue"),
			meta:{
				name:"网易"
			}
		},
		{
			path:"jd",
			name:"jd",
			component:()=>import("@/views/pics/jd.vue"),
		},
		{
			path:"qq",
			name:"qq",
			component:()=>import("@/views/pics/qq.vue"),
		}
		]
	},
	{
		path:"/mhome",
		component:()=>import("@/views/mobile_home.vue")
	},
	{
		path:"/mpic",
		component:()=>import("@/views/manage_pic.vue"),
		redirect:"/mpic/login",
		children:[
			{
				path:"manage",
				redirect:"/mpic/manage/add",
				component:()=>import("@/views/mpics/home.vue"),
				beforeEnter:(to,from,next)=>{
					let token=localStorage.getItem("token")
					jwt.verify(token,"mysite.kunzige",(err,userinfo)=>{
						if(err){
							axios({
								url:"http://127.0.0.1:10013/user/reauth",
								method:"post",
								headers:{
									"content-type":"multipart/form-data"
								},
								data:{
									refresh_token:localStorage.getItem("refresh_token")
								}
							}).then(res=>{
								jwt.verify(res.data.token,"mysite.kunzige",(err,userinfo)=>{
									if(err){
										Notification({
										  title: '警告',
										  message: '需要先登陆再进行查看',
										  type: 'warning'
										});
										router.push("/mpic/login",()=>{},()=>{})
									}else{
										localStorage.setItem("token",res.data.token)
										next()
									}
								})
							}).catch(err=>{
								console.log(err)
							})
						}else{
							next()
						}
					})
				},
				children:[
					{
						path:"add",
						component:()=>import("@/views/mpics/add")
					},
					{
						path:"remove",
						component:()=>import("@/views/mpics/remove")
					},
					{
						path:"generate",
						component:()=>import("@/views/mpics/generate")
					},
					{
						path:"statistic",
						component:()=>import("@/views/mpics/statistic")
					},
					{
						path:"edit",
						component:()=>import("@/views/mpics/edit")
					},{
						path:"interface",
						component:()=>import("@/views/mpics/interface")
					}
				]
			},
			{
				path:"login",
				name:"login",
				component:()=>import("@/views/mpics/login.vue"),
				beforeEnter:(to,from,next)=>{
					let token=localStorage.getItem("token")
					jwt.verify(token,"mysite.kunzige",(err,userinfo)=>{
						if(err){
							next()
						}else{
						router.push("/mpic/manage",()=>{},()=>{})
						}
					})
				},
			},
			{
					path:"notice",
					component:()=>import("@/views/mpics/notice")
			},
			{
				path:"register",
				component:()=>import("@/views/mpics/register.vue")
			},
			{
				path:"user",
				component:()=>import("@/views/mpics/user.vue")
			},
			{
				path:"self",
				component:()=>import("@/views/mpics/self.vue"),
				beforeEnter:(to,from,next)=>{
					let token=localStorage.getItem("token")
					jwt.verify(token,"mysite.kunzige",(err,userinfo)=>{
						if(err){
							axios({
								url:"http://127.0.0.1:10013/user/reauth",
								method:"post",
								headers:{
									"content-type":"multipart/form-data"
								},
								data:{
									refresh_token:localStorage.getItem("refresh_token")
								}
							}).then(res=>{
								jwt.verify(res.data.token,"mysite.kunzige",(err,userinfo)=>{
									if(err){
										Notification({
										  title: '警告',
										  message: '需要先登陆再进行查看',
										  type: 'warning'
										});
										router.push("/mpic/login",()=>{},()=>{})
									}else{
										localStorage.setItem("token",res.data.token)
										next()
									}
								})
							}).catch(err=>{
								console.log(err)
							})
						}else{
							next()
						}
					})
				},
			},
			{
				path:"show",
				component:()=>import("@/views/mpics/show.vue")	
			},{
				path:"share",
				component:()=>import("@/views/mpics/self/share.vue")
			}
		]
	},
	{
		path:"*",
		name:"notfound",
		component:()=>import("@/views/notfound.vue")
	}, 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
