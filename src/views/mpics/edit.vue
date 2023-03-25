<template>
	<div class="edit">
		<el-button class="back"  type="primary" @click="back">
			返回</el-button>
			<div class="img">
				<img :src="img" alt="">
			</div>
			<div class="label">
				<span>标签:</span>
				  <el-select 
				  @change="changeLabel"
				  popper-class="remove-scrollbar" v-model="label" placeholder="请选择">
				    <el-option
				      v-for="item in labels"
				      :key="item.label"
					  :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			</div>
			<div class="switch">
				<span>图片状态:</span>
				<el-switch
				  v-model="status"
						active-text="公开"
						inactive-text="私有"	
						>
				</el-switch>
			</div>
			<div class="name">
				<el-form
				:model="file"
				ref="file"
				:rules="formRules"
				>
					<el-form-item
					label="文件名:"
					prop="filename"
					>
						<el-input v-model="file.filename" placeholder="请输入文件名"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<el-button @click="modify" type="primary" :loading="loading">提交</el-button>
	</div>
</template>

<script>
	export default{
		name:"edit",
		data(){
			return {
				labels:[],
				label:"",
				file:{
					filename:""
				},
				status:false,
				id:0,
				loading:false,
				formRules:{
					filename:[{required:true,message:"文件名不能为空",trigger:"blur"}],
				},
				img:""
			}
		},
		// async activated(){
		// 	this.label=this.$route.query["label"]
		// 	this.file.filename=this.$route.query["name"]
		// 	var pub = this.$route.query["public"]
		// 	if(pub=="true"){
		// 		this.status=true
		// 	}else{
		// 		this.status=false
		// 	}
		// 	this.id=this.$route.query["p"]
		// 	this.img=decodeURI(this.$route.query["img"])
		// 	console.log(decodeURI(this.$route.query["img"]))
		// },
		async mounted(){
			 await axios({
				url:"http://127.0.0.1:10013/get/label",
				method:"post",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
					token:localStorage.getItem("token")
				}
			}).then(res=>{
				for(let i=0;i<res.data.length;i++){
					this.labels.push({label:res.data[i],value:res.data[i]})
				}
			})
			.catch(err=>{
				console.log(err)
			})
			this.label=this.$route.query["label"]
			this.file.filename=this.$route.query["name"]
			var pub = this.$route.query["public"]
			if(pub=="true"){
				this.status=true
			}else{
				this.status=false
			}
			this.id=this.$route.query["p"]
			this.img=decodeURI(this.$route.query["img"])
		},
		methods:{
			back(){
				this.$router.back()
			},
			changeLabel(value){
				this.label=value
			},
			modify(){
				this.loading=true
				this.$refs["file"].validate(async valid=>{
					if(valid){
						await axios({
							url:"http://127.0.0.1:10013/modify/pic_info",
							method:"post",
							headers:{
									"content-type":"multipart/form-data"
							},
							data:{
								token:localStorage.getItem("token"),
								id:this.id,
								label:this.label,
								name:this.file.filename,
								public:this.status+""
							}
						}).then(res=>{
							if(res.status==200){
								
								this.$notify({
									message:"修改成功"
								})
							}
						}).catch(err=>{
							this.$notify({
								title:"错误",
								message:"请检查你的输入"
							})
						})
						this.loading=false
					}else{
						this.$notify({
							message:"文件名不能为空"
						})
						this.loading=false
						return
					}
				})

			}
		}
		
	}
	
</script>

<style lang="less">
	.remove-scrollbar{
	  .el-scrollbar__wrap{
	    overflow: auto;  //超出部分不滚动，直接显示
	  }
	  .el-scrollbar__thumb{
	    // display: none;  //去掉右侧滚动条
		background-color: none;
	  }
	}
	
	.edit{
		display: flex;
		flex-direction: column;
		
		.img{
			width: 300px;
			img{
				width: 100%;
				height: 100%;
			}
		}
		
		div{
			margin:3px;
		}
		
		.el-form-item{
			position: relative;
			display: flex;
			
			.el-form-item__label{
				position: absolute;
				top:50%;
				transform:translateY(-50%);
				font-size: 18px;
				line-height: 50px;
			}	
			.el-form-item__content{
				margin-left: 85px;
			}
			
		}
		
		
		.label{
			display: flex;
			align-items: center;
			
			.el-select{
				width: 300px;
			}
		}
		
		.el-switch{
			width: 300px;
		}
		
		.el-input{
			width: 300px;
		}
		.el-button{
			width: 90px;
			margin-left: 290px;
			margin-top: 10px;
			border-radius: 30px;
		}
		.back{
			margin-left: 5px;
			border-radius: 30px;
		}
		span{
			font-size: 18px;
			font-weight: bold;
		}
		
	}
</style>