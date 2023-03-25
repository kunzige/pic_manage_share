<template>
	<div class="mobile">
		<div class="my-name">
			<p  style="margin:0 auto; width:100px;text-align: center; height: 50px;line-height: 50px;  font-size: 30px;">kunzige</p>
		</div>
		<div style="overflow:hidden; position: fixed;top:-3px; left:5px;">
			<iframe scrolling="no"  width="100px" height="100px" src="https://i.tianqi.com/index.php?c=code&id=84" frameborder="0"></iframe>
		</div><!-- 天气插件 -->
		<div class="labels" @click="clickItem">
			<p index=1 class="active label-item">首页</p>
			<p index=2 class="label-item">进程</p>
			<p index=3 class="label-item">关于</p>
			<p index=4 class="label-item">留言</p>
		</div>
		<div class="content">
			<div class="img-bac" style="position: relative;">
				<img style="width: 300px;" src="https://p0.meituan.net/dpplatform/5b7c9855ce838950143ae98459284967662722.png" alt="">
				<img style="border-radius: 50%; position: absolute; left: 38%; width: 80px; top:60%;" src="https://p0.meituan.net/dpplatform/c6a12656a0ab1238a6b8192ebce818a0349343.png" alt="" class="avactor">
			</div>
			<div class="real-content">
				<p class="saying">心存敬畏</p>
				<el-divider></el-divider>
				<div v-html="content"></div>
				
			</div>
			
		</div>
		<img src="../assets/china.svg" style="width:60px;right:0px;position:fixed;bottom:0px;">
		<div class="aplayer" style="background-color: #ecf0f3; width:66px; position: fixed; bottom:0;left:5px;"></div>
		<div class="footer">
			All Right Reserved.
		</div>
	</div>
</template>

<script>
import axios from "axios"

export default{
	name:"mobile_home",
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
					this.address="欢迎来自"+info.split("\n")[0]+"的小伙伴\n"+"您的ip地址:"+info.split("\n")[1]
					this.welcome();
					this.warn();
				})()
			
		}).catch(err=>{
			this.address="欢迎小伙伴"
			this.welcome()
			this.warn()
		})
	},
	mounted(){
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
	},
	data(){
		return{
			content:`<p class="introduce">
					&nbsp;&nbsp;&nbsp;&nbsp;分享实用小工具。😊😊😊
				</p>`
			}
	},
	methods:{
		clickItem(e){
			if(!e.target.getAttribute('index')){
				
			}else{
				var label_items=document.querySelectorAll('.label-item')
				Array.prototype.map.call(label_items,item=>{
					item.className="label-item"
				})	
				e.target.className="label-item active"
				
				var index=e.target.getAttribute('index')
				if(index==1){
					this.content=`<p class="introduce">
					&nbsp;&nbsp;&nbsp;&nbsp;分享实用小工具。😊😊😊
				</p>`
				}else if(index==2){
					this.content=`
						<ul>
							<li>
								<svg class="icon">
									<use xlink:href="#icon-songxiyiwancheng-bian"></use>
								</svg>
								<span class="time" >2022-10-25</span>
								<span>&nbsp;&nbsp;已完成</span>
								<p class="txt" >&nbsp;&nbsp;&nbsp;&nbsp;搭建个人引导页测试站</p>
							</li>
							<li>
								<svg class="icon">
									<use xlink:href="#icon-songxiyiwancheng-bian"></use>
								</svg>
								<span class="time">2022-10-25</span>
								<span>&nbsp;&nbsp;已完成</span>
								<p class="txt" >&nbsp;&nbsp;&nbsp;&nbsp;搭建公共图床API</p>
							</li>
							<li>
								<svg class="icon">
									<use xlink:href="#icon-kaifaguanli"></use>
								</svg>
								<span class="time"  style="color:#2ECC71">2022-01-09</span>
								<span style="color:#2ECC71">&nbsp;&nbsp;已完成</span>
								<p class="txt" style="color:#2ECC71">&nbsp;&nbsp;&nbsp;&nbsp;开发图片管理分享平台。</p>
							</li>

						</ul>
					`
				}else if(index==3){
					this.content=`
					<div class="about">
					<br>
					<br>
					<p >兴趣是最好的老师。</p>
					<br>
					<p>吃喝玩乐是终极目标。</p>
					</div>
					`
				}else if(index==4){
					this.content=`
					<p>开发中...😭😭😭</p>
					`
				}
			}
			
		},
		warn() {
				  this.$notify({
					title: '警告',
					message:'手机端功能暂未开发，请使用电脑端!',
					type: 'warning',
					duration:10000,
					offset:120
				  });
				},
				welcome(){
		  this.$notify.info({
		    title: '消息',
		    message: this.address,
				  duration:8000,
		  });
		},
		readBlob(blob_data){
			return new Promise(resolve=>{
				let reader = new FileReader();
				//调用方法读取
				   reader.onload = function(event){
					   resolve(event.currentTarget.result)
				    }
				    //调用方法读取
				    reader.readAsText(blob_data);
			},reject=>{
				
			})
		}
	},
};

</script>

<style lang="less">
	.mobile{
		font-family: "楷体";
		position: fixed;
		left: 0;
		top:0;
		right: 0;
		bottom: 0;
		display:flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		
		.my-name{
				width: 120px;
				text-align: center;
				height: 50px;
				line-height: 50px;
				border-radius: 30px;
				right:10px;
				position:fixed;
				top:25px;
				box-shadow:
				inset -3px -3px 6px rgba(0, 157, 255, 0.5),
				inset 5px 5px 8px rgba(0, 157, 255, 0.5);
		}
		
		.labels{
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 300px;
			height: 40px;
			margin-top: 5px;
			margin-bottom: 15px;
			border-radius: 30px;
			font-size: 18px;
			overflow:hidden;
			box-shadow:
			-5px -5px 10px rgba(249, 247, 255, 1),
			5px 5px 10px rgba(0, 157, 255, 0.5);
			
			
			p{
				flex:1;
				text-align: center;
				border-radius: 30px;
				cursor: pointer;
			}
			
			.active{
				width:75px;
				height:40px;
				line-height: 40px;
				box-shadow:
				inset -6px -6px 8px rgba(255,255,255,0.5),
				inset 5px 5px 8px rgba(0, 157, 255, 0.5);
				color:blue;
			}
			
		}
		
		
		.content{
			width: 300px;
			height: 480px;

			border-radius: 20px;
			overflow-x: hidden;
			overflow-y:auto;
			box-shadow:
			-5px -5px 10px rgba(249, 247, 255, 1),
			5px 5px 10px rgba(0, 157, 255, 0.5);
			
			.real-content{
				margin-top: 45px;
				
				.saying{
					width: 300px;
					text-align: center;
					font-size: 25px;
					font-weight: bold;
				}
				.introduce{
					font-size: 20px;
				}
			}
		}
		.about{
			width:280px;
			height:200px;
			border-radius: 30px;
			font-size: 20px;
			margin: 0 auto;
			box-shadow:
			inset -3px -3px 5px rgba(125, 132, 255, 0.5),
			inset 5px 5px 8px rgba(0, 157, 255, 0.5);
		}
		.footer{
			position:fixed;
			margin:0 auto;
			bottom:0;
		}
		li{
			border-left: 1px solid black;
			margin-left: 15px;
			padding:10px 0 0 20px;
			list-style: none;
			position: relative;
			
			svg{
				width: 20px;
				height: 20px;
				position: absolute;
				left: -10px;
			}
		}
		
	}
</style>