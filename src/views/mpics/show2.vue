<template>
	<div class="show">
		<el-menu
		mode="horizontal"
		  default-active="0"
		  >
		  <el-menu-item ref="first" index="1"  class="o-btn" v-for="item,index in labels" :index="index">
				<span >{{item}}</span>
		</el-menu-item>
		</el-menu>
		
			<div  class="wrapper">
				<div  v-for="item in imgArr" class="item" ref="item">
					<img  :src="item.pic_url" alt="">
					<div class="operate">
						<el-button size="mini" round type="primary">复制链接</el-button>
						<div class="icons">
							<i class="el-icon-star-off"></i>
						</div>
					</div>
				</div>
				<div class="bottom">
					<p>被你看光喽</p>
				</div>
			</div>
	</div>
</template>

<script>
	import "@/plugins/waterfall.js"
	import "animate.css"
	
	export default{
		name:"show",
		data(){
			return {
				imgArr:[],
				loaded:false,
				totalArr:[],
				group:0,
				columns:3,
				labels:["动漫","自然","美女"]
			}
		},
		methods:{
			scrollFn(){
				var _this=this
				var winHeight=window.innerHeight
				var st=document.documentElement.scrollTop
				var docHeight=document.documentElement.scrollHeight
				
				if(!this.loaded){
					if(Math.ceil((winHeight+st))>=docHeight){
						// 触底后的操作
						if((this.group+1)>=Math.ceil(this.totalArr.length/(this.columns*this.columns))){
							for(var i=_this.group*(_this.columns*_this.columns);i<_this.totalArr.length;i++){
								console.log(i)
								_this.imgArr.push(_this.totalArr[i])
							}
							this.loaded=true
						}else{
								for(var i=_this.group*(_this.columns*_this.columns);i<(_this.group+1)*(_this.columns*_this.columns);i++){
									_this.$set(_this.imgArr,i,_this.totalArr[i])
									// _this.imgArr.push(_this.totalArr[i])
								}
								_this.group++
							if(Math.ceil((winHeight+st))>=docHeight){
								console.log("触底了")
							}
							console.log(this.imgArr)
						}
					}
				}else{
					
				}

				

			}
		},
		async created(){

		},
		async mounted(){
			window.addEventListener("scroll",this.scrollFn);
			var _this=this;
			await axios({
				method:"post",
				url:"http://127.0.0.1:10013/get/showdata",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
					id:1,
					show_id:4
				}
			}).then(res=>{
				for(let i of res.data[0].data){
					_this.totalArr.push(i)
					// _this.imgArr.push(i)
				}
				for(let i=_this.group*(_this.columns*_this.columns);i<(_this.group+1)*(_this.columns*_this.columns);i++){
					_this.imgArr.push(_this.totalArr[i])
				}
				_this.group+=1
			}).catch(err=>{
				console.log(err)
			})
			
			window.onload=function(){
				var waterfall=new waterFall({
						el:"wrapper",
						columns:_this.columns,
						gap:30,
						imgArr:_this.imgArr
					})
				document.body.removeChild(document.getElementById('Loading'))
				waterfall.init()
			}
		},

	}
</script>

<style lang="less">
.show{
	.el-menu{
		height: 60px;
		position: fixed;
		top:0;
		z-index:999;
		width: 100%;
		display: flex;
		justify-content: space-between;
		
		span{
			font-size: 25px;
		}
	}
	
	.wrapper{
		width: 1200px;
		position: relative;
		margin: 0 auto;
		margin-top: 75px;
		
		.item{
			position: absolute;
			--animation-duration: 0.3s;
			visibility: hidden;
			
			.operate{
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30px;
				
				i:hover{
					cursor: pointer;
				}
			}
		}
		img{
			width: 0px;
			height: 100%;
		}
		.bottom{
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}
}

</style>


