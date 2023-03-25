<template>
	<div class="pics">
			<div class="pics-left">
				
				<el-button class="back" round type="primary" @click="back">
					
					<i class="iconfont icon-fanhui"></i>
					回到首页</el-button>
				<div class="public-list">
					<h1>公益CDN列表</h1>
					<div class="btn-list">
					<el-button class="cdn-btn" round type="primary" @click="useMt">
						<svg class="icon">
							<use xlink:href="#icon-meituan"></use>
						</svg>
						imgTP</el-button>
						<el-button class="cdn-btn" round type="primary" @click="useWangyi">
							<svg class="icon">
								<use xlink:href="#icon-wangyiyunyinle"></use>
							</svg>
							牛图 CDN</el-button>
						<el-button class="cdn-btn" round type="primary" @click="useJd">
							<svg class="icon">
								<use xlink:href="#icon-jingdongicon-"></use>
							</svg>
							<!-- <i class="iconfont icon-fanhui"></i> -->
						OPPO CDN</el-button>

					</div>
				</div>
			</div>
			
			<div class="pics-right">
				<div class="upload">
					<router-view :key="$route.fullPath" >
					</router-view>
				</div>
			</div>

	</div>
</template>

<script>
	import "../../public/iconfont.js"
	import layout from "./home.vue"
	
	export default{
		name:"pics",
		components:{layout},
		 computed: {
			key(){
		      return this.$route.path + (new Date).getTime();
		    },

		  },
		data(){
			return{
				routerAlive:true,
			}
		},
		methods:{
			back(){
				this.$router.replace("/",()=>{},()=>{})
			},
			useMt(){
				this.$router.push("/pics/mt",()=>{},()=>{})


			},
			useWangyi(){
				this.$router.push("/pics/wangyi",()=>{},()=>{})

			},
			useJd(){
				this.$router.push("/pics/jd",()=>{},()=>{})

			}
		},
		mounted(){
			var btns=document.querySelectorAll(".cdn-btn")
			Array.prototype.map.call(btns,item=>{
					item.className="el-button cdn-btn el-button--primary is-round"
					
			})
			if(location.pathname=='/pics/mt' || location.pathname=='/pics'){
				btns[0].className="el-button cdn-btn el-button--primary is-round actived"
			}else if(location.pathname=='/pics/wangyi'){
				btns[1].className="el-button cdn-btn el-button--primary is-round actived"
			}else if(location.pathname=='/pics/jd'){
				btns[2].className="el-button cdn-btn el-button--primary is-round actived"
			}
			

			
		},
		updated(){
			var btns=document.querySelectorAll(".cdn-btn")
			Array.prototype.map.call(btns,item=>{
					item.className="el-button cdn-btn el-button--primary is-round"
					
			})
			if(location.pathname=='/pics/mt' || location.pathname=='/pics'){
				btns[0].className="el-button cdn-btn el-button--primary is-round actived"
			}else if(location.pathname=='/pics/wangyi'){
				btns[1].className="el-button cdn-btn el-button--primary is-round actived"
			}else if(location.pathname=='/pics/jd'){
				btns[2].className="el-button cdn-btn el-button--primary is-round actived"
			}else if(location.pathname=='/pics/qq'){
				btns[3].className="el-button cdn-btn el-button--primary is-round actived"
			}
		},
		created(){
			document.body.removeChild(document.getElementById('Loading'))
		}	
	}
	
</script>

<style lang="less">
	.pics{
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: #ececec;
	
			
			.pics-left{
				border-radius: 30px;
				width: 25vw;
				height: 95vh;
				box-shadow:
				inset -3px -3px 5px rgba(0, 123, 255, 0.5),
				inset 3px 3px 5px rgba(0, 123, 255, 0.5);
				
				.back{
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					margin-top: 5px;
					margin-left: 10px;
					box-shadow:
					-3px -3px 5px rgba(234, 255, 254, 0.5),
					3px 3px 5px rgba(0, 123, 255, 0.5);
				}
				
				.back:active{
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					margin-left: 10px;
					box-shadow:
					inset -3px -3px 5px rgba(234, 255, 254, 0.5),
					inset 3px 3px 5px rgba(0, 123, 255, 0.5);
					
				}
				.public-list{
					font-family:maobi;
					text-align: center;
					margin-top: 10px;
					
					.btn-list{
						display: flex;
						flex-direction: column;
						align-items: center;
						
						
						.el-button{
							font-size: 20px;
							width:20vw;
							margin-top: 30px;
							
							svg{
								width: 20px;
								height: 20px;
								font-size: 20px;
							}
							i{
								font-size: 20px;
							}
						}
						
						.cdn-btn{
							background-color: rgba(225, 253, 255, 0.5);
							color:blue;
							box-shadow:
							-3px -3px 5px rgba(234, 255, 254, 0.5),
							3px 3px 5px rgba(0, 123, 255, 0.5);
						}
						
						.cdn-btn:active{
							background-color: rgba(225, 253, 255, 0.5);
							color:blue;
							margin-left: 10px;
							box-shadow:
							inset -3px -3px 5px rgba(234, 255, 254, 0.5),
							inset 3px 3px 5px rgba(0, 123, 255, 0.5);
						}
						
					}
				}
				
				
			}
			
			.pics-right{
				border-radius: 30px;
				width: 66vw;
				height: 95vh;
				box-shadow:
				inset -3px -3px 5px rgba(0, 123, 255, 0.5),
				inset 3px 3px 5px rgba(0, 123, 255, 0.5);
				font-family: maobi;
				h3{
					font-size: 30px;
					margin-top: 10px;
					margin-left: 15px;
				}
				
				.upload{
					margin-top: 20px;
					display: flex;
					// justify-content: center;
					
					.el-upload-dragger{
						width: 50vw;
						height: 60vh;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
					}
				}
			}

	}
	.actived{
		background-color: rgba(110, 205, 255, 0.2) !important;
		box-shadow:
		inset -3px -3px 5px rgba(234, 255, 254, 0.5),
		inset 3px 3px 5px rgba(0, 123, 255, 0.5) !important;
	}
</style>