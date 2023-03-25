<template>
  <div class="about">
    <div class="img" ></div>
	<br>
	<div class="info">
		<h3>自述</h3>
		<p>职业：学生</p>
		<p>目标：吃喝玩乐</p>
		<br>
		<el-divider></el-divider>
		<h3>名言</h3>
		<div style="width: 100%; height: 20vh; background-color: rgba(100,100,100,0.7); display: flex; justify-content: center; align-items: center;">
			  <p>兴趣是最好的老师</p>
		</div>
		<br>
		<el-divider></el-divider>
		<h3>skill</h3>
		<ul>
			<li>·javascript</li>
			<li>·python</li>
			<li>·golang</li>
			<li>·java</li>
			<li>·shell</li>
		</ul>
		<br>
		<el-divider></el-divider>
		<h3>爱好</h3>
		<p>breaking、跑步、玩</p>
		<br>
		<el-divider></el-divider>
		<h3>联系方式</h3>
		<P>email：kunzige666@qq.com</P>
		<br>
	</div>
	<br>
  </div>

</template>

<script>
	export default{
		name:"About"
	}
</script>

<style lang="less">
	.about{
		font-size: 20px;
		
		.img{
			width: 100%;
			height: 40vh;
			background-image: url("https://p0.meituan.net/dpplatform/4d93bd556d7a56e90ae638e8e9e89aeb678349.png");
			background-size: cover;
			background-repeat:no-repeat;
		}
		.info{
			margin-left: 5px;
		}
	}
	
</style>