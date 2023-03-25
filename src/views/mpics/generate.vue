<template>
	<div class="show">
		<div class="labels" style="display: flex; flex-wrap: wrap;">
			<div class="label" v-for="item,index in labels">
				<el-button @click="chooseLabel(item,index,$event)">
					<span class="name" v-text="item"></span>
				</el-button>
				<i :ref=index @click="onClose($event,item)" class="el-icon-close close"></i>
			</div>
			
		</div>
		<div class="showchoose">
			<h3>你已选择的标签是：</h3>
			<el-tag
			v-for="item,index in choosedlabel"
			type="danger"
			effect="dark"
			  :key="item">
			  {{item}}
			</el-tag>
		</div>
		<div class="generate">
			<el-button @click="generate" :loading="loading" type="primary">点击生成</el-button>
			<h2>访问链接：</h2>
			<div v-for="item in links">
				<el-descriptions title="相关信息">
				    <el-descriptions-item >
						<el-tag type="warning">标签:</el-tag> 
						{{item.label}}
					</el-descriptions-item>
					<el-descriptions-item ><el-tag type="warning">链接:</el-tag> 
						<el-link :href="item.link" target="href">{{item.link}}</el-link>
					</el-descriptions-item>
					
				</el-descriptions>
			</div>
			
		</div>
	</div>
</template>

<script>
	// import axios from 'axios'
	
	export default{
		name:"generate",
		data(){
			return{
				labels:[],
				choosedlabel:[],
				links:[],
				loading:false
				
			}
		},
		methods:{
			chooseLabel(item,index,e){
				// 避免重复标签
				if(this.choosedlabel.includes(item)){
					this.$notify({
					          title: '警告',
					          message: '不能选重复标签',
					          type: 'warning'
					        });
					return
				}
				// 避免标签太多
				if(this.choosedlabel.length>4){
					this.$notify({
					  title: '警告',
					  message: '标签不能超过5个',
					  type: 'warning'
					});
					return
				}
				
				if(e.target.className.includes("el-button")){
					e.target.style.boxShadow="inset -3px -3px 5px rgba(234, 255, 254, 0.5),inset 3px 3px 5px rgba(0, 123, 255, 0.5)"
					this.$refs[index][0].style.display="block"
					this.choosedlabel.push(item)
				}else if(e.target.className.includes("name")){
					e.target.parentElement.parentElement.style.boxShadow="inset -3px -3px 5px rgba(234, 255, 254, 0.5),inset 3px 3px 5px rgba(0, 123, 255, 0.5)"
					this.$refs[index][0].style.display="block"
					this.choosedlabel.push(item)
				}else{
					
				}

			},
			onClose(e,item){
				e.target.parentElement.children[0].style.boxShadow="-3px -3px 5px rgba(234, 255, 254, 0.5), 3px 3px 5px rgba(0, 123, 255, 0.5)"
				e.target.style.display="none"
				this.choosedlabel=this.choosedlabel.filter((value,index,arr)=>{
					return value!=item
				})
			},
			generate(){
				// 不能为空
				if(this.choosedlabel.length==0){
					this.$notify({
					  title: '警告',
					  message: '标签不能为空',
					  type: 'warning'
					});
					return
				}
				this.loading=true
				// 不为空，请求数据把链接填充进去
				axios({
					url:"http://127.0.0.1:10013/show/generate",
					method:"post",
					headers:{
						"content-type":"multipart/form-data"
					},
					data:{
						labels:this.choosedlabel+"",
						token:localStorage.getItem("token")
					}
					
				}).then(res=>{
					this.links.push({link:`http://127.0.0.1:8080/mpic/show?i=${res.data.id}&s=${res.data.show_id}`,label:this.choosedlabel})
					this.$notify({
					  title: '成功',
					  message: '生成访问链接成功',
					  type: 'success'
					});
					this.loading=false
				}).catch(err=>{
					this.$notify({
					  title: '失败',
					  message: '不能重复生成相同相同标签的链接',
					});
					this.loading=false
					// console.log(err)
				})
			}
		},
		mounted(){
			let _this=this
			this.labels=[]
			// 获取标签信息
			axios({
				url:"http://127.0.0.1:10013/get/label",
				method:"post",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
					token:localStorage.getItem("token")
				}
			}).then(res=>{
				for(let i of res.data){
					_this.labels.push(i)
				}
			})
			.catch(err=>{
				
			})
		},
	}
</script>

<style lang="less">
	.show{
	
		.labels{
			
			.label{
				position: relative;
				
				.el-button{
					margin-top: 10px;
					border-radius: 20px;
					margin-left: 10px;
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					box-shadow:
						-3px -3px 5px rgba(234, 255, 254, 0.5),
						3px 3px 5px rgba(0, 123, 255, 0.5);
					
				}
				
				.close{
					position: absolute;
					top:15px;
					right: 8px;
					font-size: 3px;
					color: blue;
					display:none;
				}
				.close:hover{
					cursor: pointer;
				}
			}

		}
		
	.showchoose{
		margin-top: 15px;
		font-size: 25px;
		
		.el-tag{
			margin-left: 10px;
			font-size: 30px;
			margin-top: 10px;
		}
	}
		
		
	.generate{
		display: flex;
		flex-direction: column;
		font-size: 20px;
		margin-top: 10px;
		
		.has-colon::after{
			content:"";
		}
		
		.el-button{
			align-self: flex-end;
			margin-right: 30px;
		}
	}
}
	
</style>