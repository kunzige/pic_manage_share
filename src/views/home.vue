<template>
  <div id="home">

    <div class="home-left">
		<div id="clock">
		    <p class="date" :data-text="date">{{ date }}</p>
		    <p class="time" :data-text="time">{{ time }}</p>
		</div>
		<el-divider>😴</el-divider>
		<iframe height="300px" name="weather_inc" src="https://i.tianqi.com/index.php?c=code&id=55"   frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
		<el-divider >😎</el-divider>
		<div class="aplayer" style="background-color: #ecf0f3; width: 25vw; animation: light 4s ease-in-out infinite; margin-top: -8px;">
		</div>
	</div>
	<div class="home-right">
		<div class="home-title">
			<div class="my-name">
				<h3 style="color:blue; font-family:maobi; font-size: 45px;">kunzige</h3>
			</div>
				<div class="my-life">
					<h3 style="font-family:maobi;">百尺竿头，更进一步。</h3>
				</div>
			  <div class="my-icon">
				<img src="https://p0.meituan.net/dpplatform/c6a12656a0ab1238a6b8192ebce818a0349343.png" alt="">
			  </div>
		</div>
		
		<div class="home-content">
			
			<div class="tags">
				<div class="btns btn-active" @click="chooseItem($event)" index=1 >介绍</div>
				<div class="btns" @click="chooseItem($event)" index=2 >进度</div>
				<div class="btns" @click="chooseItem($event)" index=3 >功能</div>
				<div class="btns" @click="chooseItem($event)" index=4 >关于</div>
				<div class="btns" @click="chooseItem($event)" index=5 >留言</div>
			</div>
			<el-divider></el-divider>
			<div class="main-content">
				<transition name="el-zoom-in-center">
					<router-view></router-view>
				</transition>
			</div>
		</div>
	</div>
    
  </div>
</template>




<script>
import axios from 'axios'
	
export default{
	name:"home",
	data(){
		return{
			time: '',
			date: '',
			week :['星期日','星期一','星期二','星期三','星期四','星期五', '星期六'],
		}

	},
	components:{
		
	},
	methods:{
		zeroPadding(num, digit) {
		    var zero = '';
		    for(var i = 0; i < digit; i++) {
		        zero += '0';
		    }
		    return (zero + num).slice(-digit);
		},
		updateTime() {
		    var cd = new Date();
		    this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2);
		    this.date = this.zeroPadding(cd.getFullYear(), 4) + '-' + this.zeroPadding(cd.getMonth()+1, 2) + '-' + this.zeroPadding(cd.getDate(), 2) + ' ' + this.week[cd.getDay()];
		},
		chooseItem(e){
			var index=e.target.getAttribute('index')
			var btns=document.querySelectorAll(".btns")
			Array.prototype.map.call(btns,item=>{
				if(item.getAttribute('index')==index){
					item.className="btns btn-active"
					if(index==1){
						this.$router.push("/home",()=>{},()=>{})
					}else if(index==2){
						this.$router.push("/home/process",()=>{},()=>{})
					}else if(index==3){
						this.$router.push("/home/function",()=>{},()=>{})
					}else if(index==4){
						this.$router.push("/home/about",()=>{},()=>{})
					}else if(index==5){
						this.$router.push("/home/message",()=>{},()=>{})
					}
				}else{
					item.className="btns"
				}
			})
		},
				welcome(){
		  this.$notify.info({
		    title: '欢迎',
		    message: this.address,
				  duration:8000,
		  });
		},
		readBlob(blob_data){
			return new Promise(resolve=>{
				let reader = new FileReader();

				   reader.onload = function(event){
					   resolve(event.currentTarget.result)
				    }

				    reader.readAsText(blob_data);
			},reject=>{
				
			})
		}
		
	},
	mounted(){
		var timerID = setInterval(this.updateTime, 1000);
		this.updateTime();
		       var ap = new APlayer
				({
					element: document.getElementById('.aplayer'),
					narrow: false,
					autoplay: true,
					showlrc: false,
					music: {
							title: 'Bye Bye Bye',
							author: 'LoJqvestoned',
							url: 'https://www.kunzige.cc/public/byebyebye.mp3',
							pic: 'https://p2.music.126.net/__TFfEz3M6Coxauyxnmk0g==/1695446930044953.jpg'
							}
				});
				
				var btns=document.querySelectorAll(".btns")
				Array.prototype.map.call(btns,item=>{
						item.className="btns"
		
				})
				
				if(location.pathname=='/home'){
					document.querySelectorAll(".btns")[0].className="btns btn-active"
				}else if(location.pathname=='/home/process'){
					document.querySelectorAll(".btns")[1].className="btns btn-active"
				}else if(location.pathname=='/home/function'){
					document.querySelectorAll(".btns")[2].className="btns btn-active"
				}else if(location.pathname=='/home/about'){
					document.querySelectorAll(".btns")[3].className="btns btn-active"
				}else if(location.pathname=='/home/message'){
					document.querySelectorAll(".btns")[4].className="btns btn-active"
				}else if(location.pathname=='/'){
					document.querySelectorAll(".btns")[0].className="btns btn-active"
				}
	
	
		// console.clear()
	},
	created(){
		document.body.removeChild(document.getElementById('Loading'))
			axios({
				method:"GET",
				url:"https://www.kunzige.cc/api/ip",
				responseType:"arraybuffer"
			}).then(res=>{
					var blob_data=new Blob([res.data],{type:"arraybuffer"});
					(async ()=>{
						var info=await this.readBlob(blob_data)
						this.address="欢迎来自"+info.split("\n")[0]+"小伙伴\n"+"你的ip为:"+info.split("\n")[1]
						this.welcome()
					})()
				
			}).catch(err=>{
				this.address="欢迎小伙伴"
				this.welcome()
			})
		
	}
	
	
}
	

</script>





<style lang="less">
@import "../../public/init.css";
body{
	background-color:   #E1FFFF;
}


#home{
	display: flex;
	align-items: center;
	width: 100vw;
	height: 100vh;
	justify-content: space-around;
	
	*{
		font-family:"楷体";
	}
	
	.home-left{
		width: 30vw;
		overflow-x:hidden;
		height: 95vh;
		border-radius: 5vw;
		-webkit-appearance:none;
		background-color:   #E1FFFF;
		box-shadow:-6px -6px 9px rgb(255,255,255),
		6px 6px 9px rgba(143, 143, 143, 0.8);
		outline:none;
		flex-direction: column;
		display: flex;
		align-items: center;

		// 鍙栨秷鍒嗗壊绾垮浘鏍囩殑鑳屾櫙
		.el-divider__text{
			background-color: transparent;
		}
		
		#clock {
		    color:   #E1FFFF;
		    text-align: center; 
			position: relative;
			
			.time {
				font-family: 'digital', monospace;
		        letter-spacing: 0.05em;
		        font-size: 60px;
		        padding: 5px 0;
				color: rgba(38, 0, 255, 0.6);
				
		    }

			
		    .date {
				font-family: maobi;
		        font-size: 24px;
				color: rgba(38, 0, 255, 0.6);
		    }

			
			
			
		}
		

		
		.my-menu{
			width:100%;
			.el-menu-item{
				background-color: #f2f6ff;
			}
			
		.el-menu-item:hover{
			background-color: #f2f6ff;
		}
		}
	}
		
	.home-right{
		width: 65vw;
		height: 95vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background-color:   #E1FFFF;

		.home-title{
			height: 12vh;
			width: 100%;
			top:0;
			font-size: 3vh;
			border-radius: 5vw;
			-webkit-appearance:none;
			box-shadow:-6px -6px 9px rgb(255,255,255),
			6px 6px 9px rgba(143, 143, 143, 0.8);
			outline:none;
			display: flex;
			justify-content: space-around;
			align-items: center;
			background-color:   #E1FFFF;
			
			.my-icon{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 11vh;
				height: 11vh;
				border-radius: 50%;
				overflow: hidden;
				transition: 1s;
				animation: light 4s ease-in-out infinite;
				border-radius: 50%;
				box-shadow:
				inset -6px -6px 8px rgba(255,255,255,0.5),
				inset 5px 5px 8px rgba(0, 157, 255, 0.5);
				
				img{
					border-radius: 50%;
					width: 10vh;
					height: 10vh;
					
				}
			}
			.my-icon:hover{
				    transform: scale(1.25) rotate(360deg);
					cursor: pointer;

			}
			
			.my-name{
				 background-image: -webkit-linear-gradient(left,
					 #00f0f0,
					 #ff7d00 12.5%,
					 #f00f00 18.75%,
					 #00ff0f 31.25%,
					 #ff00ff 43.75%,
					 #0f7d00 62.5%,
					 #f0ff00 68.75%,
					 #00f0ff 81.25%,
					 #ff00ff 93.75%,
					 #ff0f00 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					border-radius: 15px;
					width: 170px;
					text-align: center;
					box-shadow:
					inset -6px -6px 8px rgba(255,255,255,0.5),
					inset 5px 5px 8px rgba(0, 157, 255, 0.5);
					

				}
			.my-life{
				animation: doudong 3.5s  infinite;
				transform-origin: center center;
				// color:rgba(0, 166, 255, 0.6);
				background-image: -webkit-linear-gradient(left,
									 #00f0f0,
									 #ff7d00 12.5%,
									 #f00f00 18.75%,
									 #00ff0f 31.25%,
									 #ff00ff 43.75%,
									 #0f7d00 62.5%,
									 #f0ff00 68.75%,
									 #00f0ff 81.25%,
									 #ff00ff 93.75%,
									 #ff0f00 100%);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-size: 200% 100%;

			}
		}
		
		.home-content{
			height: 78vh;
			width: 100%;
			font-size:3vh;
			border-radius: 5vw;
			-webkit-appearance:none;
			box-shadow:-5px -5px 10px rgb(255,255,255),
			5px 5px 10px rgba(143, 143, 143, 0.5);
			outline:none;
			display: flex;
			flex-direction: column;
			background-color:   #E1FFFF;
			
			.tags{
				height: 8vh;
				display: flex;
				justify-content: space-evenly;
				width: 95%;
				.btns{
					margin-left: 3vw;
					margin-top: 10px;
					width: 8vw;
					height: 80%;
					box-shadow:
					-5px -5px 5px rgba(255,255,255,0.5),
					3px 3px 3px rgba(0, 157, 255, 0.5);
					display:flex;
					justify-content: center;
					align-items: center;
					font-family: maobi;
					font-size: 2vw;
				}
				
				.btns:hover{
					cursor: pointer;

				}
				
				.btn-active{
					margin-left: 3vw;
					margin-top: 10px;
					width: 8vw;
					height: 80%;
					display:flex;
					justify-content: center;
					align-items: center;
					font-family: maobi;
					font-size: 2vw;
					box-shadow:
					inset -3px -3px 5px rgba(255,255,255,0.5),
					inset 5px 5px 8px rgba(0, 157, 255, 0.5);
					color:blue;
				}
			}
			.main-content{
				margin-left: 5vw;
				height: 56vh;
				width: 55vw;
				font-family: maobi;
				font-size: 40px;
				box-shadow:
				inset -6px -6px 8px rgba(255,255,255,0.5),
				inset 5px 5px 8px rgba(0, 157, 255, 0.5);
				overflow-y: auto;
				
				.fade-enter-active,
				.fade-leave-avtive {
				  transition: opacity 1s;
				}
				.fade-enter,
				.fade-leave-to {
				  opacity: 0;
				}
			}
		}
	}
}
.el-divider{
	background-color: #004cff !important;
	height: 1px !important;
	position: relative; 
}

// 瀛椾綋鎶栧姩
	@keyframes doudong {
	  0% {
	      transform: translate(0px, 0px) rotate(0deg);
	  }
	  2% {
	      transform: translate(-1px, 1.5px) rotate(1.5deg);
	  }
	  4% {
	      transform: translate(1.3px, 0px) rotate(-0.5deg);
	  }
	  6% {
	      transform: translate(1.4px, 1.4px) rotate(-2deg);
	  }
	  8% {
	      transform: translate(-1.3px, -1px) rotate(-1.5deg);
	  }
	  10% {
	      transform: translate(1.4px, 0px) rotate(-2deg);
	  }
	  12% {
	      transform: translate(-1.3px, -1px) rotate(-2deg);
	  }
	  14% {
	      transform: translate(1.5px, 1.3px) rotate(1.5deg);
	  }
	  16% {
	      transform: translate(1.5px, -1.5px) rotate(-1.5deg);
	  }
	  18% {
	      transform: translate(1.3px, -1.3px) rotate(-2deg);
	  }
	  20% {
	      transform: translate(1px, 1px) rotate(-0.5deg);
	  }
	  22% {
	      transform: translate(1.3px, 1.5px) rotate(-2deg);
	  }
	  24% {
	      transform: translate(-1.4px, -1px) rotate(2deg);
	  }
	  26% {
	      transform: translate(1.3px, -1.3px) rotate(0.5deg);
	  }
	  28% {
	      transform: translate(1.6px, -1.6px) rotate(-1.5deg);
	  }
	  30% {
	      transform: translate(-1.3px, -1.3px) rotate(-1.5deg);
	  }
	  32% {
	      transform: translate(-1px, 0px) rotate(2deg);
	  }
	  34% {
	      transform: translate(1.3px, 1.3px) rotate(-0.5deg);
	  }
	  36% {
	      transform: translate(1.3px, 1.6px) rotate(1.5deg);
	  }
	  38% {
	      transform: translate(1.3px, -1.6px) rotate(1.5deg);
	  }
	  40% {
	      transform: translate(-1.4px, -1px) rotate(-0.5deg);
	  }
	  42% {
	      transform: translate(-1.4px, 1.3px) rotate(-0.5deg);
	  }
	  44% {
	      transform: translate(-1.6px, 1.4px) rotate(0.5deg);
	  }
	  46% {
	      transform: translate(-2.1px, -1.3px) rotate(-0.5deg);
	  }
	  48% {
	      transform: translate(1px, 1.6px) rotate(1.5deg);
	  }
	  50% {
	      transform: translate(1.6px, 1.6px) rotate(1.5deg);
	  }
	  52% {
	      transform: translate(-1.4px, 1.6px) rotate(0.5deg);
	  }
	  54% {
	      transform: translate(1.6px, -1px) rotate(-2deg);
	  }
	  56% {
	      transform: translate(1.3px, -1.6px) rotate(-2deg);
	  }
	  58% {
	      transform: translate(-1.3px, -1.6px) rotate(0.5deg);
	  }
	  60% {
	      transform: translate(1.3px, 1.6px) rotate(-0.5deg);
	  }
	  62% {
	      transform: translate(0px, 0px) rotate(-1.5deg);
	  }
	  64% {
	      transform: translate(-1.6px, -1.6px) rotate(-2deg);
	  }
	  66% {
	      transform: translate(1.6px, -1.6px) rotate(0.5deg);
	  }
	  68% {
	      transform: translate(0px, -1.6px) rotate(-2deg);
	  }
	  70% {
	      transform: translate(-1.6px, 1px) rotate(1.5deg);
	  }
	  72% {
	      transform: translate(-1.6px, 1.6px) rotate(2deg);
	  }
	  74% {
	      transform: translate(1.3px, -1.6px) rotate(-0.5deg);
	  }
	  76% {
	      transform: translate(1.4px, 1px) rotate(-0.5deg);
	  }
	  78% {
	      transform: translate(-1px, 1.4px) rotate(2deg);
	  }
	  80% {
	      transform: translate(1.4px, 1.6px) rotate(2deg);
	  }
	  82% {
	      transform: translate(-1.6px, -1.6px) rotate(-0.5deg);
	  }
	  84% {
	      transform: translate(-1.4px, 1.4px) rotate(-2deg);
	  }
	  86% {
	      transform: translate(1px, 1.4px) rotate(-2deg);
	  }
	  88% {
	      transform: translate(-1.4px, 1.4px) rotate(-1.5deg);
	  }
	  90% {
	      transform: translate(-1.6px, -1.6px) rotate(-2deg);
	  }
	  92% {
	      transform: translate(-1.4px, 1.6px) rotate(2deg);
	  }
	  94% {
	      transform: translate(-1.6px, -1.6px) rotate(-2deg);
	  }
	  96% {
	      transform: translate(-1.4px, 1.3px) rotate(-2deg);
	  }
	  98% {
	      transform: translate(1.3px, 1px) rotate(-0.5deg);
	  }
	} 
// 鍥炬爣鍏夊湀
	@keyframes light{
		0% {
		    box-shadow: 0 0 4px red;
		}
		25% {
		    box-shadow: 0 0 16px #0f0;
		}
		50% {
		    box-shadow: 0 0 4px #00f;
		}
		75% {
		    box-shadow: 0 0 16px #0f0;
		}
		
		100% {
		    box-shadow: 0 0 4px red;
		}
	}
	

</style>


