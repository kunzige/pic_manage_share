<template>
	<div class="function">
		<div class="card-cover" @click="goPic">
			<el-card >
				<h2>公共图床api</h2>
				<p>根据爬虫，获取一些公共图床的api，自己封装接口，实现免费图床。</p>
			</el-card>
			</div>
			<div class="card-cover" @click="gompic">
				<el-card >
					<h2>图片管理分享平台</h2>
					<p>基于公共图床，将图片上传信息存放，并可以进行图片展示分享。本站不做图片的保留。</p>
				</el-card>
			</div>
		
	</div>
</template>

<script>
	export default{
		name:"function",
		methods:{
			goPic(){
				var pics=this.$router.resolve("/pics",()=>{},()=>{})
				window.open(pics.href,"_blank")
			},
			gompic(){
				var pics=this.$router.resolve("/mpic",()=>{},()=>{})
				window.open(pics.href,"_blank")
			}
		}
	}
	
</script>

<style lang="less">
	.function{
		display: flex;
		overflow-y: auto;
		flex-wrap: wrap;
		height: 100%;
		box-shadow:
		-3px -3px 5px rgba(0, 123, 255, 0.5),
		3px 3px 5px rgba(0, 123, 255, 0.5);
		
		.card-cover{
			width: 30%;
			height: 30%;
			margin-top: 3%;
			margin-left:3%;
		}
		
		.el-card{
			cursor: pointer;
			font-size: 12px;
			width: 100%;
			height: 100%;
			box-shadow:
			-3px -3px 5px rgba(221, 255, 255, 0.5),
			3px 3px 5px rgba(0, 123, 255, 0.5);
			
		}
		.el-card:active{
			box-shadow:
			inset -3px -3px 5px rgba(221, 255, 255, 0.5),
			inset 3px 3px 5px rgba(0, 123, 255, 0.5);
			
		}
	}
	
</style>