<template>
		<div class="notfound">
			
			<div class="wrapper">
				<div class="main-container">
				  <div class="img-container container-item">
				    <img src="./404.svg">
				  </div>
				  <div class="text-container container-item">
				    <div class="code">404</div>
				    <div class="msg">你查看的页面貌似丢失了呢...</div>
				    <div class="action" @click="$router.push('/')">返回首页,查看更多内容.</div>
				  </div>
				</div>
			</div>
		</div>
</template>


<script>
	export default{
		name:"notfound",
		created(){
			if(document.getElementById('Loading')){
				document.body.removeChild(document.getElementById('Loading'))
			}
		}
	}
</script>



<style lang="less">
	.notfound{
		.wrapper{
			display: flex;
			align-items: center;
			height: 100vh;
			
			.main-container {
			margin: 0 auto;
			  width: 80%;
			  max-width: 1000px;
			  max-height: 500px;
			  min-width: 600px;
			  background-color: white;
			  font-size: 0;
			  border-radius: 20px;
			  box-shadow: 0 0 50px 0 rgba(146, 146, 146, 0.63);
			}
			
			.main-container .container-item {
			  display: inline-block;
			  vertical-align: middle;
			  width: 50%;
			}
			
			.main-container .img-container {
			  background-color: rgba(253, 216, 168, 0.692);
			  border-top-left-radius: 20px;
			  border-bottom-left-radius: 20px;
			}
			
			.main-container .text-container .code {
			  font-size: clamp(150px,20vw,200px);
			  font-family: 'Arial Narrow';
			  color: rgb(86, 86, 253);
			  font-weight: bolder;
			  text-align: center;
			}
			
			.main-container .text-container .msg {
			  font-size: 18px;
			  text-align: center;
			  font-weight: 200;
			  margin-bottom: 20px;
			}
			
			.main-container .text-container .action {
			  font-size: 15px;
			  font-weight: 200;
			  text-align: center;
			  text-decoration-line: underline;
			  cursor: pointer;
			}
		}
		
	
		
	}
	
</style>