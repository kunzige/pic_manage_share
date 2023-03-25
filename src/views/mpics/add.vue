<template>
	<div class="add">
		<!-- 通过文件上传 -->
		<div class="upload"
		>
			<div class="head1" style="display: flex; justify-content: space-between;">
				<h2>通过文件上传保存</h2>
				<el-switch
				  v-model="public1"
				  active-text="公开"
				  inactive-text="私有"
				  style="font-size: 20px; margin-right: 20px;"
				  >
				</el-switch>
			</div>
			<div class="upload-box" style="margin-top: 10px;"
			>
				<i v-if="!loadimg" class="iconfont icon-shangchuan" style="font-size: 80px; display: flex; flex-direction: column; justify-content: center;" @click="popout">
					<div style=" display: flex;justify-content: center; width: 80px;"><p style="font-size: 15px;">选择文件</p></div>
				</i>
				<div v-else >
					<div class="lds-hourglass">
						<p style="text-align: center;">加载中....</p>
					</div>
				</div>

				<input type="file" class="choose_file" ref="choose_file" @change="choose_file(event)" />
				<img class="preview-img"  src="" ref="preview-img" >
				<p>{{file.name}}</p>
				<el-form  style="display: flex;align-items: center; justify-content: space-around;"
				:model="file"
				ref="file-label"
				:rules="fileRules"
				>
					<el-form-item prop="file_label">
						<el-input v-model="file.file_label" class="file-label" placeholder="请输入标签"></el-input>
					</el-form-item>
					<el-form-item prop="name">
						<el-input v-model="file.name" class="file-name" placeholder="请输入文件名"></el-input>
					</el-form-item>
					<el-form-item
					style="margin-left: 20px; "
					>
						  <el-select v-model="api" placeholder="节点选择"
						  style="margin-top: 10px;"
						  popper-class="remove-scrollbar"
						  >
						    <el-option
						      v-for="item in options"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
					</el-form-item>
				</el-form>
				<div class="upload-btn">
					<el-button class="upload-file" type="primary" :loading="file_loading" @click="file_upload"  >点击上传</el-button>
				</div>
			</div>
		</div>
		
		<el-divider></el-divider> 
		
		<!-- 通过保存url -->
		<div class="url">
			
			<div class="head2" style="display: flex; justify-content: space-between;">
				<h2>通过已有url保存</h2>
				<el-switch
				  v-model="public2"
				  active-text="公开"
				  inactive-text="私有"
				  style="font-size: 20px; margin-right: 20px;"
				  >
				</el-switch>
			</div>
			<div class="input-url">
				<el-tag type="warning" style="font-size:20px;">不能跨域的话会导致图片无法进行展示。</el-tag>
				<el-form 
				:model="url"
				ref="url-label"
				:rules="urlRules"
				class="input-forms" > 
					<el-form-item prop="url_label">
						<el-input class="input-label" v-model="url.url_label" placeholder="请输入标签"></el-input>
					</el-form-item>
					<el-form-item prop="name">
						<el-input class="input-url-name" v-model="url.name" placeholder="请输入图片名"></el-input>
					</el-form-item>
					<el-form-item prop="url">
						<el-input class="input-url" v-model="url.url" placeholder="请输入url"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="url_upload" :loading="url_loading" class="upload-url" type="primary">点击上传</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<el-divider></el-divider>
		<div class="data">
			<h2>实时数据</h2>
			<div v-for="item in img">
				<el-descriptions title="相关信息">
				    <el-descriptions-item style="display: inline;"><el-tag>文件名:</el-tag> <span>{{item.name}}</span></el-descriptions-item>
				    <el-descriptions-item ><el-tag type="warning">标签：</el-tag> {{item.label}}</el-descriptions-item>
					<el-descriptions-item ><el-tag type="warning">链接:</el-tag> {{item.url}}</el-descriptions-item>
					
				</el-descriptions>
			</div>
		</div>
		
	</div>
</template>

<script>
	import axios from "axios"
	
	export default {
		name:"add",
		mounted(){		
			let _this=this
			var imgshow=document.querySelector("#img")
				document.addEventListener('keydown',function(event){
				 let keyStr = event.key;
				 if((keyStr==='v'||keyStr==='V') && event.ctrlKey===true){
					 _this.cv=true;
					(async()=>{
						_this.loadimg=true;
						let data=await navigator.clipboard.read()
						let clipboardContent=data[0]
						const type=clipboardContent.types[0]
						_this.type=clipboardContent.types[0]
						let blob=await clipboardContent.getType(type);    //getType返回promise所以数据需要await进行获取。
						_this.myblob=blob
						if(type=="text/plain"){
							let text=await blob.text()    //同样返回Promise
							console.log(text)
						}else{
							const nblob=window.URL.createObjectURL(blob)
							// _this.file.name="image.png"
							_this.$refs["preview-img"].src=nblob
							_this.$refs["preview-img"].style.display="block"
							
						}
						_this.loadimg=false;
					})();
				 }
				});
		},
		data(){
			return{
				cv:false,
				file_loading:false,
				url_loading:false,
				img:[],
				file:{
					file_label:"",
					name:""
				},
				url:{
					url_label:"",
					url:"",
					name:"",
				},
				fileRules:{
					file_label:[{required:true,message:"请输入标签名",trigger:"blur"},
					{pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,message:"标签名只能是字母中文数字的组合",trigger:"change"}],
					name:[{required:true,message:"请输入文件名",trigger:"blur"},
					{pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9\.]+$/,message:"文件名只能是字母中文数字小数点的组合",trigger:"change"}]
					,
				},
				urlRules:{
					url:[{required:true,message:"请输入保存的url",trigger:"blur"},
					{pattern:/^((http|https):\/\/).*$/,message:"请输入合法的url链接，需要http/https头",trigger:"change"}
					],
					url_label:[{required:true,message:"请输入标签名",trigger:"blur"},
					{pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,message:"标签名只能是字母中文数字的组合",trigger:"change"},
					],
					name:[{required:true,message:"请输入文件名",trigger:"blur"},
					{pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,message:"文件名只能是字母中文数字的组合",trigger:"change"}]
					},
				loadimg:false,
				public1:true,
				public2:true,
				options: [{
					  value: 'http://127.0.0.1:9789/upload/imgtp',
					  label: 'imgTP'
					}, {
					  value: 'http://127.0.0.1:9789/upload/niutu',
					  label: '牛图网'
					}, {
					  value: 'https://api.open.oppomobile.com/api/utility/upload',
					  label: 'OPPO'
					}],
				api:""
			}
		},
		updated(){
			var alllink=document.querySelectorAll(".el-descriptions__body  table  tbody  tr  td:nth-child(3)")
			if(alllink){
				alllink.forEach(td=>{
					td.setAttribute("colspan","3")
				}) 
			}
		},
		methods:{
			file_upload(){
				let _this=this
				if(this.api==""){
					_this.$notify({
						type:"warning",
						message:"请选择节点"
					})
				}
				this.$refs['file-label'].validate(valid=>{
					if(valid){
						if(this.cv==true){
								let formData=new FormData();
								_this.file_loading=true
								let myfile=new window.File([this.myblob],_this.file.name,{type:this.type})
								formData.append("file",myfile);
								formData.append("type","feedback")
								axios({
									method:"post",
									url:this.api,
									data:formData,
									responseType:"arraybuffer",
									timeout:40000
								}).then(content=>{
									var blob_data=new Blob([content.data],{type:"arraybuffer"});
									(async()=>{
										var json_data=await _this.readBlob(blob_data)
										if(json_data.code==403){
											_this.error()
										}else{
											
											axios({
												url:"http://127.0.0.1:10013/add",
												method:"post",
												headers:{
													"content-type":"multipart/form-data"
												},
												data:{
													pic_name:_this.file.name,
													label:_this.file.file_label,
													pic_url:json_data.data.url,
													public:_this.public1?1:0,
													token:localStorage.getItem("token")
												}
											}).then(res=>{
								
												_this.img.push({"name":_this.file.name,"url":json_data.data.url,"label":_this.file.file_label})
												_this.file_loading=false
												_this.success()
												// 更新redis缓存
												_this.refreshcache()
											})
											.catch(err=>{
												_this.file_loading=false
												_this.error()
											})
											
										}
									})()
								}).catch(err=>{
									_this.file_loading=false
									this.error()
								})

								return
						}
						
						if(!this.$refs["choose_file"].files[0]){
							_this.warn()
							return
						}
						_this.file_loading=true
						let formData=new FormData();
						formData.append("file",this.$refs["choose_file"].files[0]);
						formData.append("type","feedback")
							axios({
								method:"post",
								url:this.api,
								data:formData,
								responseType:"arraybuffer",
								timeout:40000
							}).then(content=>{
								var blob_data=new Blob([content.data],{type:"arraybuffer"});
								(async()=>{
									var json_data=await _this.readBlob(blob_data)
									if(json_data.code==403){
										_this.error()
										_this.file_loading=false
									}else{
										axios({
											url:"http://127.0.0.1:10013/add",
											method:"post",
											headers:{
												"content-type":"multipart/form-data"
											},
											data:{
												pic_name:_this.file.name,
												label:_this.file.file_label,
												pic_url:json_data.data.url,
												public:_this.public1?1:0,
												token:localStorage.getItem("token")
											}
										}).then(res=>{
											_this.img.push({"name":json_data.data.name,"url":json_data.data.url,"label":_this.file.file_label})
											_this.file_loading=false
											_this.success()
											// 更新redis缓存
											_this.refreshcache()
										})
										.catch(err=>{
											_this.file_loading=false
											_this.error()
										})
									}
								})()
								
							}).catch(err=>{
								_this.file_loading=false
								_this.error()
							})
							
							
					}else{
						_this.$notify({
							message:"输入信息不完整"
						}) 	
						return
					}
				})
			},
			url_upload(){
				let _this=this
				_this.url_loading=true
				this.$refs['url-label'].validate(valid=>{
					if(valid){
						axios({
							url:"http://127.0.0.1:10013/add",
							method:"post",
							headers:{
								"content-type":"multipart/form-data"
							},
							data:{
								pic_name:_this.url.name,
								label:_this.url.url_label,
								pic_url:_this.url.url,
								public:_this.public2?1:0,
								token:localStorage.getItem("token")
							}
						}).then(res=>{
							_this.img.push({"name":_this.url.name,"url":_this.url.url,"label":_this.url.url_label})
							_this.url_loading=false
							_this.success()
						}).catch(err=>{
							console.log(err)
							_this.url_loading=false
							// 要么浏览器段出问题，要么服务端出问题，都会走这里
							_this.error()
						})
					}else{
						_this.url_loading=false
						this.error1()
					}
				})
			},
			choose_file(){
				this.cv=false
				this.loadimg=true
				var file=this.$refs["choose_file"].files[0]
				this.file.name=file.name
				const blob=window.URL.createObjectURL(file)
				this.$refs["preview-img"].src=blob
				this.$refs["preview-img"].style.display="block"
				this.loadimg=false
			},
			popout(){
				document.querySelector(".choose_file").click()
			},
			refreshcache(){
				// 请求刷新缓存
				axios({
					url:"http://127.0.0.1:10013/action/refresh",
					method:"post"
				}).then(res=>{
					
				}).catch(err=>{
					
				})
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
				  message: '上传失败!'
				});
			  },
			  error1() {
				this.$notify.error({
				  title: '错误',
				  message: '上传失败，请完善相关信息。'
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

<style lang="less">
// el-select滚动条问题
.remove-scrollbar{
  .el-scrollbar__wrap{
	overflow: visible;  //超出部分不滚动，直接显示
  }
  .el-scrollbar__thumb{
	display: none;  //去掉右侧滚动条
  }
}
	
.add{
	overflow-y: auto;
	
	
	.upload{
		.upload-box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-direction: column;
			
			.lds-hourglass {
			  display: inline-block;
			  position: relative;
			  width: 80px;
			  height: 80px;
			  cursor: not-allowed;
			}
			.lds-hourglass:after {
			  pointer-events: none;
			  content: " ";
			  display: block;
			  border-radius: 50%;
			  width: 0;
			  height: 0;
			  margin: 8px;
			  box-sizing: border-box;
			  border: 32px solid #fcf;
			  border-color: #fcf transparent #fcf transparent;
			  animation: lds-hourglass 1.2s infinite;
			}
			@keyframes lds-hourglass {
			  0% {
			    transform: rotate(0);
			    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
			  }
			  50% {
			    transform: rotate(900deg);
			    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
			  }
			  100% {
			    transform: rotate(1800deg);
			  }
			}
			
			
			.preview-img{
				margin-top: 20px;
				width: 15vw;
				height: 20vh;
				max-width: 50%;
				max-height: 100%;
				display: none;
			}
			
			.file-label{
				margin-top: 10px;
				
				input{
					color:blue;
					font-size: 18px;
				}
				
				input::placeholder{
				color:#627274;
				}
			}
			
			.file-name{
				margin-left: 10px;
				margin-top: 10px;
				input{
					color:blue;
					font-size: 18px;
				}

				input::placeholder{
				color:#627274;
				}
			}
			
			.el-form-item__error{
				font-size: 18px;
			}
			
			.upload-btn{
				width: 100%;
				position: relative;
				height: 40px;
			}
			
			.upload-file{
				border-radius: 20px;
				position: absolute;
				right: 50px;
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
	
	.url{
		.input-forms{
			display: flex;
			
			
			.input-label{
				width: 150px;
			}
			.input-url{
				margin-left: 5px;
				width: 350px;
			}
			.input-url-name{
				margin-left: 5px;
				width: 150px;
			}
			
			.el-form-item__error{
				font-size: 18px;
			}
			
			.upload-url{
				margin-left: 5px;
				border-radius: 20px;
				background-color: rgba(225, 253, 255, 0.5);
				color:blue;
				box-shadow:
					-3px -3px 5px rgba(234, 255, 254, 0.5),
					3px 3px 5px rgba(0, 123, 255, 0.5);
			}
			
			.upload-url:active{
				background-color: rgba(225, 253, 255, 0.5);
				color:blue;
				box-shadow:
				inset -3px -3px 5px rgba(234, 255, 254, 0.5),
				inset 3px 3px 5px rgba(0, 123, 255, 0.5);
			}
			
			input{
				font-size: 18px;
				color:rgb(0,0,255)
			}
			
			input::placeholder{
				color:#71706c;
			}
		}
	}
	
	.data{
		.el-descriptions{
			font-size: 18px;
			
			.el-descriptions-item__content{
				width: min-content;
				flex:1;
			}

			.el-descriptions-item__label::after{
				display: none;
			}
		}
		
	}
	
}
</style>