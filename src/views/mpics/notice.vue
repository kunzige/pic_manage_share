<template>
	<div class="notice">
		<div class="header">
			<div class="back">
				<el-button class="back-btn" type="primary" @click="back">
					<i class="iconfont icon-fanhui"></i>
					返回</el-button>
			</div>
			<div class="icon">
				<h2><i class="iconfont icon-tongzhi"></i>公告通知</h2>
			</div>
		</div>
		
		<div class="content">
			<div class="inline" style="display: none;"></div>
			<el-card  class="box-card"  v-for="item in data">
			  <div @click="open(item.content,item.title,item.notice_id)"  class="text item">
				  <h2>{{item.title}}</h2>
			    <p>{{item.content}}</p>
				<i class="unread-point" v-if="item.is_readed==0"></i>
			  </div>
			</el-card>
			
			
		</div>
	</div>
</template>

<script>
	export default{
		name:"notice",
		methods:{
			back(){
				this.$router.back()
			},
		  open(content,title,notice_id) {
			var _this=this;
			this.$alert(content, title, {
			  confirmButtonText: '确定',
			  callback: action => {
				  axios({
					  url:"http://127.0.0.1:10013/action/read",
					  method:"post",
					  headers:{
						  "content-type":"multipart/form-data"
					  },
					  data:{
						  token:localStorage.getItem("token"),
						  notice_id:notice_id
					  }
				  }).then(res=>{
					  if(res.status==200){
						  this.$message({
						    type: 'info',
						    message:"已阅读"
						  });
					  }
				  }).catch(err=>{
					  
				  })

			  }
			});
			}
		},
		data(){
			return {
				data:[]
			}
		},
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
				_this.data=res.data.data
			}).catch(err=>{
				_this.$notify({
					type:"error",
					message:"发生了一些错误"
				})
				console.log(err)
			})
		}
	}
</script>

<style lang="less">
	.notice{
		.header{
			display: flex;
			justify-content: space-between;
			
			.back{
				margin-left: 5%;
			}
			
			.back-btn{
				background-color: rgba(225, 253, 255, 0.5);
				color:blue;
				border-radius: 20px;
				margin-top: 3px;
				height: 40px;
				box-shadow:
				-3px -3px 5px rgba(234, 255, 254, 0.5),
				3px 3px 5px rgba(0, 123, 255, 0.5);
				border: none;
			}
			
			.back-btn:active{
				box-shadow:
				inset -3px -3px 5px rgba(234, 255, 254, 0.5),
				inset 3px 3px 5px rgba(0, 123, 255, 0.5);
				
			}
			
			
			.icon{
				margin-right: 5%;
				height: 40px;
				line-height: 40px;
				margin-top: 10px;
				margin-left: 10px;
			}
		}
		
		.content{
			width: 90%;
			margin: 0 auto;
			height: calc(100vh 	- 60px);
			border-radius: 20px;
			border: 1px solid transparent;
			overflow-y: auto;
			
			.el-card{
				width: 90%;
				margin: 0 auto;
				border-radius: 25px;
				margin-top: 15px;
				margin-bottom: 15px;
				position: relative;
				
				.unread-point {
				  position: absolute;
				  top:10px;
				  right: 10px;
					background: #f23436;
					border-radius: 50%;
					width: 10px;
					height: 10px;
				}
			}
			
			.box-card:hover{
				cursor: pointer;
			}
		}
		.content::after{
			width: 90%;
			margin: 0 auto;
			height: calc(100vh 	- 60px);
			content:"";
			pointer-events: none;
			position: absolute;
			border-radius: 20px;
			top:50px;
			left: 0;
			right: 0;
			bottom: 0;
			box-shadow:
			inset -3px -3px 5px rgba(0, 123, 255, 0.5),
			inset 3px 3px 5px rgba(0, 123, 255, 0.5);
		}
		
	}
</style>