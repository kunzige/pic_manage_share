<template>
  <div id="app">
	<transition name="el-zoom-in-center">
	  <router-view />
	</transition>
  </div>
</template>




<script>
import "../public/iconfont.js"

export default{
	name:"App",
	data(){
		return{
			address:""
		}
	},
	created(){
		//获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
		var info = navigator.userAgent;
		//通过正则表达式的test方法判断是否包含“Mobile”字符串
		var isPhone = /mobile|iPhone/i.test(info);
		//如果包含“Mobile”（是手机设备）则返回true
		if(isPhone){
			this.$router.replace("/mhome",()=>{},()=>{});
		}
	},
	mounted(){
	}
}
	

</script>






<style lang="less">
@import "../public/init.css";
#app{
    .fade-enter-active,
  .fade-leave-avtive {
    transition: opacity 1s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  

  margin: 0 auto;
}


</style>


