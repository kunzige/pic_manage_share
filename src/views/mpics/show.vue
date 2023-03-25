<template>
	<div class="show">
		<div class="menu-wrapper">
			<el-menu
			:mode="horizontal"
			:default-active="0"
			>
				<el-menu-item @click="clickTitle(item)" active-text-color="rgb(0,0,255)" ref="first" :index="index"  class="o-btn" v-for="item,index in labels" >
						<span >{{item}}</span>
				</el-menu-item>
			</el-menu>
		</div>
		<!-- :key="key" -->
		<div class="wrapper">
			<vueWaterfallEasy
			:imgsArr="imgArr" 
			:imgWidth="imgWidth"
			:gap="gap"
			:key="key"
			@scrollReachBottom="getData"
			:maxCols="3"
			ref="waterfall"
			:loadingDotStyle="{
				width:'25px',
				height:'25px'
			}"
			>	
				<div class="opts" slot-scope="props" >
					<a target="_blank" class="user" href="http://127.0.0.1:8080/mpic/self">
						<img :src="icon" alt="">
						
					</a>
					<div class="icons" >
						<i @click="copylink(props.value.src)" class="iconfont icon-fenxiang"></i>
						<i @click="zan(props.value.second_index,props.value.is_liked,props.value.id)" :class="{'iconfont':true,'icon-dianzan':true,'is-liked':props.value.is_liked==1}">{{props.value.like_sum}}</i>
						
					</div>
				</div>
				
				<!-- 注意最后需要使用concat -->
				<div slot="waterfall-over" class="over">
					<p >被你看光了</p>
				</div>
			</vueWaterfallEasy>
		</div>

		
		

		
	</div>
</template>


<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import useMystore from '@/store'
import { mapState,mapActions } from 'pinia'

	export default{
		name:"show",
		data(){
				return{
					imgArr:[],
					group:0,
					totalArr:[],
					gap:20,
					imgWidth:(1100-20*2)/3,
					labels:[],
					index:0,
					activeName:"",
					key:(new Date).getTime(),
					i:0,
					s:0,
					icon:""
				}
		},
		components:{
			vueWaterfallEasy
		},
		computed:{
			...mapState(useMystore,['user'])
		},
		methods:{
			getData(){
				var _this=this
				if(this.group<Math.floor(this.totalArr[this.index].length/9)){
					setTimeout(()=>{
						for(let i=(_this.group)*9;i<(_this.group)*9+9;i++){
							_this.imgArr.push(_this.totalArr[_this.index][i])
						}
						_this.group+=1
					},500)
				}else{
					var lastArr=[]
					setTimeout(()=>{
							for(let i=(_this.group)*9;i<_this.totalArr[_this.index].length;i++){
								lastArr.push(_this.totalArr[_this.index][i])
							}
							_this.imgArr.concat(lastArr)
							_this.$refs.waterfall.waterfallOver()
					},500)
				}
			},
			async clickTitle(item){
				var _this=this
				this.group=0
				this.key=(new Date).getTime()
				this.imgArr=[]
				for(let i=0;i<this.labels.length;i++){
					if(item==_this.labels[i]){
						this.index=i						
					}
				}
				
				if(_this.totalArr.length>=9){
					for(let i=0;i<9;i++){
						// _this.$set(_this.imgArr,i,_this.totalArr[i])
						_this.imgArr.push(_this.totalArr[this.index][i])
					}
				}else{
					for(let i of _this.totalArr[this.index]){
						_this.imgArr.push(i)
					}
				}
				_this.group+=1
				
			},
			async copylink(url){
				await navigator.clipboard.writeText(url)
				this.$notify({
					message:"复制链接成功"
				})
			},
			async zan(index,is_liked,p_id){
				// 发送请求添加到数据表中
				var _this=this;
				if(is_liked==0){
					// 点赞喜欢的情况
					await axios({
						url:"http://127.0.0.1:10013/action/zan",
						method:"post",
						headers:{
							"content-type":"multipart/form-data"
						},
						data:{
							token:localStorage.getItem("token"),
							pic_id:p_id
						}
					}).then(res=>{
						if(res.status==200){
							_this.$notify({
								message:"点赞成功"
							})
						_this.imgArr[index].is_liked=1
						_this.imgArr[index].like_sum=parseInt(_this.imgArr[index].like_sum)+1
						}
					}).catch(err=>{
						_this.$notify({
							message:"请登录后再进行操作"
						})
						console.log(err)
					})
				}else{
					// 取消点赞的情况
					await axios({
						url:"http://127.0.0.1:10013/action/cancelzan",
						method:"delete",
						headers:{
							"content-type":"multipart/form-data"
						},
						data:{
							token:localStorage.getItem("token"),
							pic_id:p_id
						}
					}).then(res=>{
						if(res.status==200){
							_this.$notify({
								message:"取消点赞"
							})
						}
						_this.imgArr[index].is_liked=0
						_this.imgArr[index].like_sum=parseInt(_this.imgArr[index].like_sum)-1
					}).catch(err=>{
						_this.$notify({
							message:"请登录后再进行操作"
						})	
						console.log(err)
					})
				}
			}
		},
		async created(){
			var _this=this;
			this.i=location.search.substring(1).split("&")[0].split("=")[1]
			this.s=location.search.substring(1).split("&")[1].split("=")[1]
			// 获取头像
			axios({
				url:"http://127.0.0.1:10013/get/icon",
				method:"post",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
					id:_this.$route.query.i
				}
			}).then(res=>{
				_this.icon=res.data
			}).catch(err=>{
				console.log(err)
			})
			
			await axios({
				method:"post",
				url:"http://127.0.0.1:10013/get/showdata",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
					id:_this.i,
					show_id:_this.s,
					token:localStorage.getItem("token")
				}
			}).then(res=>{
				// 标签信息
				for(let i of res.data){
					_this.labels.push(i.label)
				}
				_this.activeName=_this.labels[0]
				// 图片信息
				for(let j=0;j<res.data.length;j++){
					var temp_total=[]
					for(let i=0;i<res.data[j].data.length;i++){
						temp_total.push({src:res.data[j].data[i].pic_url,id:res.data[j].data[i].pic_id,like_sum:res.data[j].data[i].sum,first_index:j,second_index:i,is_liked:res.data[j].data[i].is_liked})
					}
					_this.totalArr.push(temp_total)
				}
				
			if(_this.totalArr[this.index].length>=9){
				for(let i=0;i<9;i++){
					// _this.$set(_this.imgArr,i,_this.totalArr[i])
					_this.imgArr.push(_this.totalArr[this.index][i])
				}
			}else{
				for(let i of _this.totalArr[this.index]){
					_this.imgArr.push(i)
				}
			}
				
				_this.group+=1
				
			// 赞信息，判断有没有token，有token查询当前用户对哪些图片点赞了
				
			}).catch(err=>{
				console.log(err)
			})
		}
		
	}
	
</script>



<style lang="less">
	.show{
		width: 100%;
		
		
		.wrapper{
			height: calc(100vh - 75px);
			margin-top: 65px;
		}
		// left:50%;
		// transform: translateX(-50%);
		
		.menu-wrapper{
			top:10px;
			height: 60px;
			width: 100%;
			position: fixed;
			text-align: center;
			display: flex;
			justify-content: space-around;
			z-index: 999;
		}
		
		.el-menu{
			display: flex;
			justify-content: space-around;
			width: 90%;
			border-radius: 30px;
			height: 55px;
			background-color: #f5eff5;
			box-shadow:
			-4px -4px 6px rgba(255, 248, 255, 0.9),
			4px 4px 6px rgba(51, 59, 211, 0.6);
			
				
			.is-active{
				border-radius: 30px;
				box-shadow:
				inset -3px -3px 5px rgba(238, 255, 253, 0.5),
				inset 3px 3px 5px rgba(0, 157, 255, 0.5);
			}
			
			.el-menu-item{
				
				
				span{
					font-size: 18px;
				}
			}
			
		}
		
		.vue-waterfall-easy-container{
			width: 90% !important;
			margin: 75px auto 0px;
			.over{
				p{
					font-size: 30px;
				}
			}
			.opts{
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				i{
					font-size: 30px;
					margin-left: 25px;
				}
				i:hover{
					cursor: pointer;
					color: blue;
				}
				.is-liked{
					color: blue;
				}
				
				.user{
					width: 30px;
					height: 30px;
					
					img{
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
			}
			
		}
	}
	
</style>