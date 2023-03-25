<template>
	<div class="follow" v-loading="loading">
		<h2 style="text-align: center;">我的关注</h2>
		<el-card v-for="item in followData">
			<div class="wrapper">
				<a target="_blank" :href="item.infopage"><img :src="item.src" alt=""></a>
				<div class="info">
					<p class="username">{{item.username}}</p>
					<p class="email">{{item.email}}</p>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
export default{
	name:"follow",
	data(){
		return{
			followData:[],
			loading:false
		}
	},
	methods:{

	},
	created(){
		this.loading=true
		axios({
			url:"http://127.0.0.1:10013/get/follow",
			method:"post",
			headers:{
				"content-type":"multipart/form-data"
			},
			data:{
				token:localStorage.getItem("token")
			}
		}).then(res=>{
			console.log(res)
			this.loading=false
			for(let i of res.data){
				this.followData.push({src:i.icon,username:i.username,email:i.email,infopage:`http://localhost:8080/mpic/user?i=${i.id}`})
			}
			
		}).catch(err=>{
			this.loading=false
			console.log(err)
		})
	}
}
</script>

<style lang="less">
	.follow{
		width: 100%;
		
		.el-card{
			margin-top: 10px;
			
			.wrapper{
				display: flex;
				align-items: center;
				margin-top: 10px;
				
				img{
					width: 50px;
					height: 50px;
					border-radius: 50%;
				}
				
				.info{
					margin-left: 10px;
				}
			}
		}
	
	}
</style>