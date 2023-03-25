<template>
	<div class="manage-pic">
		<keep-alive>
			<transition name="el-zoom-in-center">
				<router-view ></router-view>
			</transition>
		</keep-alive>
	</div>
		
</template>

<script>
	import usemyStore from "@/store"
	import { mapActions } from "pinia"
	
	export default{
		name:"managePic",
		created(){
				if(document.getElementById('Loading')){
					document.body.removeChild(document.getElementById('Loading'))
				}

		},
		methods:{
			...mapActions(usemyStore,['getuserData'])
		},
		mounted(){
			if(localStorage.getItem("token")){
				this.getuserData()
			}
		},
	}
	
</script>

<style lang="less">

	
</style>