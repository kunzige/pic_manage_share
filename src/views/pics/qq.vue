<template>
	<div :key="$route.fullPath" class="qq">
		<h3 >Image Upload -- 腾讯</h3>
		<div class="upload-box" style="margin-top: 10px;">
			<i class="iconfont icon-shangchuan" style="font-size: 80px; display: flex; flex-direction: column; justify-content: center;" @click="popout">
				<div style=" display: flex;justify-content: center; width: 80px;"><p style="font-size: 15px;">选择文件</p></div>
			</i>
			<input type="file" class="choose_file" ref="choose_file" @change="choose_file(event)" />
			<img class="preview-img"  src="" ref="preview-img" >
			<p>{{name}}</p>
			<el-button class="upload-file" type="primary" @click="upload" v-if="!loading" >点击上传</el-button>
			<el-button class="upload-file" type="primary" @click="upload" v-if="loading" :loading="loading" disabled>处理中</el-button>
			<div class="data">
				<h2>实时数据</h2>
				<div v-for="item in img">
					<el-descriptions title="相关信息">
					    <el-descriptions-item ><el-tag>文件名:</el-tag> {{item.name}}</el-descriptions-item>
					    <el-descriptions-item ><el-tag type="warning">链接:</el-tag> {{item.url}}</el-descriptions-item>
		
					</el-descriptions>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios"
	export default{
		name:"qq",
		data(){
			return{
				name:"",
				img:[],
				loading:false
			}
		},
		methods:{
			upload(){
				if(!this.$refs["choose_file"].files[0]){
					this.warn()
					return
				}
				this.loading=true
				let formData=new FormData();
				formData.append("file",this.$refs["choose_file"].files[0]);

					axios({
						method:"post",
						url:"https://yh-pic.ihcloud.net/api/qq.php",
						data:formData,
						responseType:"arraybuffer",
						timeout:40000
					}).then(content=>{
						this.loading=false
						var blob_data=new Blob([content.data],{type:"arraybuffer"});
						(async()=>{
							var json_data=await this.readBlob(blob_data)
							if(json_data.code==403){
								this.error()
							}else{
								this.img.push({"name":json_data.data.name,"url":json_data.data.url})
								this.success()
							}
						})()
						
					}).catch(err=>{
							this.error()
					})


			},
			choose_file(){
				var file=this.$refs["choose_file"].files[0]
				this.name=file.name
				const blob=window.URL.createObjectURL(file)
				this.$refs["preview-img"].src=blob
				this.$refs["preview-img"].style.display="block"
		
			},
			popout(){
				document.querySelector(".choose_file").click()
			},
			readBlob(blob_data){
				return new Promise(resolve=>{
					let reader = new FileReader();
					//调用方法读取
					   reader.onload = function(event){
						   var json_data=JSON.parse(event.currentTarget.result)
						   resolve(json_data)
					    }
					    //调用方法读取
					    reader.readAsText(blob_data);
				},reject=>{
					
				})
			},
			success(){
				this.$notify({
				  title: '成功',
				  message: '上传成功',
				  type: 'success'
				});
					},
		  error() {
			this.$notify.error({
			  title: '错误',
			  message: '上传失败，格式不符合规范!'
			});
		  },
		warn() {
		  this.$notify({
			title: '警告',
			message:'请选择图片',
			type: 'warning'
		  });
		},
		}
	}
	
</script>

<style lang="less" >
	.qq{
		font-family: 'maobi';
		width: 70vw;
		height: 86vh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		
		.upload-box{
			margin-top: 20px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-direction: column;
			width: 50vw;
			height: 78vh;
			box-shadow:
			-3px -3px 5px rgba(0, 123, 255, 0.5),
			3px 3px 5px rgba(0, 123, 255, 0.5);
			
			.preview-img{
				width: 15vw;
				height: 20vh;
				max-width: 50%;
				max-height: 100%;
				display: none;
			}
			
			.upload-file{
				margin-top: 10px;
				border-radius: 20px;
				margin-left: 200px;
				background-color: rgba(225, 253, 255, 0.5);
				color:blue;
				box-shadow:
					-3px -3px 5px rgba(234, 255, 254, 0.5),
					3px 3px 5px rgba(0, 123, 255, 0.5);
				
			}
			
			.upload-file:active{
				background-color: rgba(225, 253, 255, 0.5);
				color:blue;
				box-shadow:
				inset -3px -3px 5px rgba(234, 255, 254, 0.5),
				inset 3px 3px 5px rgba(0, 123, 255, 0.5);
				
			}
			
			.choose_file{
				display: none;
			}
			i:hover{
				cursor: pointer;
			}
			.data{
				width: 50vw;
				overflow-y:auto;
				.el-descriptions-item__label{
					display: none;
				}
			}
		}
	}
</style>