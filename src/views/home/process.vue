<template>
	<div class="process">
			<el-timeline>
				<svg class="icon">
					<use xlink:href="#icon-songxiyiwancheng-bian"></use>
				</svg>
				<span>&nbsp;&nbsp;&nbsp;&nbsp;已完成</span>
				<el-timeline-item   timestamp="2020-10-24" placement="top">
				  <el-card>
				    <h2>开发主页面</h2>
				    <p>完成这个主页的布局。</p>
				  </el-card>
				</el-timeline-item>
				<svg class="icon">
					<use xlink:href="#icon-songxiyiwancheng-bian"></use>
				</svg>
				<span>&nbsp;&nbsp;&nbsp;&nbsp;已完成</span>
		      <el-timeline-item color="blue" icon="el-icon-more" timestamp="2022-10-25" placement="top" >
				
				<el-card>
					<h2>开发图床api</h2>
					<p>根据爬虫，获取一些公共图床的api，自己封装接口，实现免费图床。</p>
		        </el-card>
		      </el-timeline-item>
			  <svg class="icon">
			  	<use xlink:href="#icon-kaifaguanli"></use>
			  </svg>
<!-- 			  <svg class="icon">
			  	<use xlink:href="#icon-jihua"></use>
			  </svg> -->
			  <span>&nbsp;&nbsp;&nbsp;&nbsp;已完成</span>
			 <el-timeline-item color="blue" icon="el-icon-more" timestamp="2023-1-9" placement="top" >
				<el-card>
					<h2>开发图片管理分享平台</h2>
					<p>根据用户上传的图片进行分类管理，把不同标签的图片进行分享展示。</p>
			   </el-card>
			 </el-timeline-item>
			 
		    </el-timeline>
	</div>
</template>

<script>
	export default{
		name:"function",
		data(){
			return{
			}
		}
	}
</script>

<style lang="less">
	.process{
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		
		.el-timeline{
			position: relative;
			
			.icon{
				width: 20px;
				height: 20px;
				position: absolute;
				left: -5px;
				z-index: 999;
			}
			
			span{
				color:blue;
			}
			
			.el-timeline-item__node--normal{
				display: none;
			}
			
		}
		
		.el-card{
			font-size: 15px;
			display: flex;
			height: 15vh;
			width:45vw;
			overflow-y: auto;
			box-shadow:
			-5px -5px 10px rgba(249, 247, 255, 1),
			5px 5px 10px rgba(0, 157, 255, 0.5);

			
		}
		.el-timeline-item__tail{
			border-left:1px solid #988aff !important ;
			overflow-y: hidden;
			z-index: 0;
		
		}
		

	}
</style>