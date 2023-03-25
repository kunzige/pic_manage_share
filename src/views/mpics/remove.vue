<template>
	<div class="remove">
		<el-dialog title="修改信息" :visible.sync="dialogFormVisible">

		</el-dialog>
		
			<div class="labels" style="display: flex; flex-wrap: wrap;">

				<el-menu
				mode="horizontal"
				  default-active="0"
				  >
				  <el-menu-item ref="first" index="1" @click="changeLabel(item)" class="o-btn" v-for="item,index in labels" :index="index">
						<span >{{item}}</span>
				</el-menu-item>
				</el-menu>
			</div>
			<div class="search">
				<el-input class="search-input" v-model="name" placeholder="输入图片名">
					<el-button @click="search" icon="iconfont icon-sousuo" slot="append">搜索</el-button>
				</el-input>
				
				<div class="opt">
					<el-button
					 :loading="multiLoading"
					 @click="multipleDelete" :disabled="multipleTable.length<1" class="delete" type="primary">批量删除</el-button>
				</div>
			</div>
		    <el-table
			  v-loading="dataloading"
		      :data="tableData"
		      style="width: 100%"
			  border
			  @selection-change="handleSelectionChange"
			  >
			  <el-table-column
			  type="selection"
			  ></el-table-column>
		      <el-table-column
		        prop="label"
		        label="标签名称"
		        width="120">
		      </el-table-column>
		      <el-table-column
		        prop="name"
		        label="图片名称"
		        width="120">
				<template slot-scope="scope">
					<span>{{scope.row.name}}&nbsp;&nbsp;</span>
				</template>
		      </el-table-column>
		      <el-table-column
		        prop="url"
		        label="图片预览">
				        <template slot-scope="scope">
				            <el-popover  placement="top-start" title="" trigger="hover">
				              <!-- <img  alt="" style="width: 200px;height: 200px"> -->
							  <viewer>
							  	<img class="preview" :src="scope.row.url" loading="lazy" alt="点击放大" />
							  </viewer>
							  
				              <img slot="reference" :src="scope.row.url" loading="lazy" style="width: 100px;height: 100px">
				            </el-popover>
							 
				        </template>
				
		      </el-table-column>
			  <el-table-column
			  label="公开"
			  width="100"
			  >
			  <template slot-scope="scope">
				  <el-switch
				  disabled
				    v-model="scope.row.public"
					>
				  </el-switch>
			  </template>
			  </el-table-column>
			  <el-table-column
			  width="320"
			  label="操作"
			  >
					<template scope="item" >
						<el-button class="el-icon-edit" type="warning" @click="$router.push(`/mpic/manage/edit?p=${item.row.id}&label=${item.row.label}&name=${item.row.name}&public=${item.row.public}&img=${item.row.url}`)" round>编辑</el-button>
							<el-button  type="primary" class="el-icon-link" @click="copyurl(item.row.url)" round rslot="reference">复制</el-button>
<!-- 							<el-popover
							  :ref="item.row.id"
							  :key="Math.random()"
							  placement="top"
							  width="160"
							  style="margin-left: 5px;"
							  >
							  <p>确认删除吗?</p>
							  <div style="text-align: right; margin: 0" >
								<el-button   @click="cancel(item.row.id)" type="text">取消</el-button>
								<el-button   @click="confirm(item.row.id)" type="primary">确定</el-button>
							  </div>
							  <el-button type="primary" round slot="reference">删除</el-button>
							</el-popover> -->
							<el-popconfirm
							  :key="Math.random()"
							  placement="top"
							  width="160"
							  style="margin-left: 5px;"
							  title="确认删除吗?"
							  confirm-button-text='确定'
							  cancel-button-text='取消'
							  @confirm="confirm(item.row.id)"
							  @cancel="cancel"
							>
								<el-button class="el-icon-delete" round slot="reference" type="danger">删除</el-button>
							</el-popconfirm>
							
					</template>
			  </el-table-column>
		    </el-table>
				<el-pagination
				  background
				  v-if="totallength>5"
				  style="margin-top: 10px;"
				  layout="prev, pager, next"	
				  :current-page="currentPage"
				  :page-size="5"
				  @current-change="clickPage"
				  :total="totallength">
				</el-pagination>


	</div>
</template>

<script>

	
	

	export default{
		name:"remove",
		data(){
			return{
				currentLabel:"",
				emptyData:[],
				tableData:[],
				totalData: [
						  ],
				currentPage:1,
				labels:[],
				show:true,
				name:"",
				searchData:[],
				totallength:0,
				random:Math.random(),
				dataloading:true,
				private:false,
				rlabel:"",
				dialogFormVisible:false,
				multipleTable:[],
				multiLoading:false
			}
		},
		methods:{
			clickPage(val){
				this.dataloading=true
				this.currentPage=val
				this.tableData=[]
				var arr=this.totalData.slice((this.currentPage-1)*5,this.currentPage*5)
				for(let i of arr){
					this.tableData.push(i)
				}
				this.dataloading=false
			},
			search(){
				// 校验不能为空
				if(this.name==""){
					this.$notify({
					  showClose: true,
					  type:"warning",
					  message: '搜索内容不能为空'
					});
					return
				}
				// 发送请求
				let _this=this
				_this.dataloading=true
				_this.currentPage=1
				axios({
					url:"http://127.0.0.1:10013/search",
					method:"post",
					headers:{
						"content-type":"multipart/form-data"
					},
					data:{
						keyword:this.name,
						token:localStorage.getItem("token")
					}
				}).then(res=>{
					if(res.status==200){
						_this.totalData=[]
						_this.tableData=[]
						
						for(let j=0;j<res.data.length;j++){
							_this.totalData.push({label:res.data[j].label,name:res.data[j].pic_name,url:res.data[j].pic_url,id:res.data[j].pic_id,public:res.data[j].public})
						}
						_this.totallength=_this.totalData.length
						var arr=_this.totalData.slice((this.currentPage-1)*5,this.currentPage*5)
						for(let i of arr){
							_this.tableData.push(i)
						}
						_this.dataloading=false
					}else{
						// 警告搜索失败
						
					}
				}).catch(err=>{
					
				})
			},
			changeLabel(rlabel){
				let _this=this
				_this.dataloading=true
				_this.currentLabel=rlabel
				axios({
					url:"http://127.0.0.1:10013/get/pic",
					method:"post",
					headers:{
						"content-type":"multipart/form-data"
					},
					data:{
						token:localStorage.getItem("token"),
						label:rlabel=="全部"?"":rlabel
					}
				}).then(res=>{
						_this.totalData=[]
						_this.tableData=[]
						_this.currentPage=1
						for(let j=0;j<res.data.length;j++){
							_this.totalData.push({label:res.data[j].label,name:res.data[j].pic_name,url:res.data[j].pic_url,id:res.data[j].pic_id,public:res.data[j].public})
						}
						_this.totallength=_this.totalData.length
						var arr=_this.totalData.slice((this.currentPage-1)*5,this.currentPage*5)
						for(let i of arr){
							_this.tableData.push(i)
						}
						_this.dataloading=false
				}).catch(err=>{
				// 获取图片信息失败
					console.log(err)
				})
			},
			handleSelectionChange(val){
				this.multipleTable=val
			},
			async copyurl(url){
				await navigator.clipboard.writeText(url)
				this.$notify({
				  showClose: true,
				  type:"success",
				  message: '复制url成功'
				});
			},
			cancel(id){
				this.$message({
				  showClose: true,
				  message: '取消操作'
				});
			},
			async multipleDelete(){
				// 获取到multipleTable中的数据进行批量删除并更新
				var _this=this;
				this.multiLoading=true
				// 获取总数
				console.log(this.multipleTable)
				let count=this.multipleTable.length
				let delcount=0
				for(let i of this.multipleTable){
					let content = await axios({
					url:"http://127.0.0.1:10013/delete/pic",
					method:"delete",
					headers:{
						"content-type":"multipart/form-data"
					},
					data:{
						token:localStorage.getItem("token"),
						pic_id:i.id
					}
				})
					if(content.data.status=="ok"){
						delcount+=1
					}
				}
				console.log(_this.currentLabel)
				if(delcount==count){
					//重新请求一下
					axios({
						url:"http://127.0.0.1:10013/get/pic",
						method:"post",
						headers:{
							"content-type":"multipart/form-data"
						},
						data:{
							token:localStorage.getItem("token"),
							label:_this.currentLabel
						}
					}).then(res=>{
							_this.totalData=[]
							_this.tableData=[]
							for(let j=0;j<res.data.length;j++){
								_this.totalData.push({label:res.data[j].label,name:res.data[j].pic_name,url:res.data[j].pic_url,id:res.data[j].pic_id,public:res.data[j].public,public:res.data[j].public})
							}
							_this.totallength=_this.totalData.length
							// 最后一页

							if(_this.totalData.length==(_this.currentPage-1)*5){
								// 最后一页
								_this.currentPage-=1
							 }
							
							let arr=_this.totalData.slice((this.currentPage-1)*5,this.currentPage*5)
							for(let i of arr){
								_this.tableData.push(i)
							}
							
							
								_this.multiLoading=false
								_this.$notify({
									type:"success",
									title:"成功",
									message:"批量删除成功"
								})
					})
				}
				
			},
			confirm(id){
				let _this=this
				// 发送删除请求，然后total情况共，重新添加进去分配到tableData
				axios({
					url:"http://127.0.0.1:10013/delete/pic",
					method:"delete",
					headers:{
						"content-type":"multipart/form-data"
					},
					data:{
						token:localStorage.getItem("token"),
						pic_id:id
					}
				}).then(res=>{

					
					// 更新total的
					let old_total=[]
					for(let i of _this.totalData){
						old_total.push(i)
					}
					_this.totalData=[]
					for(let i of old_total){
						if(i.id!=id){
							_this.totalData.push(i)
						}
					}

					if(_this.totalData.length==0){
						_this.tableData=[]
						_this.labels=_this.labels.filter(function(value,index,arr){
							return value!=_this.currentLabel
						})
					}
					
					if(_this.currentPage==Math.ceil(_this.totallength/5) && this.totalData.length==(_this.currentPage-1)*5){
						// 最后一页
						_this.currentPage-=1
					 }
					
					// 更新table
					_this.tableData=[]
					let arr=_this.totalData.slice((this.currentPage-1)*5,this.currentPage*5)
					for(let i of arr){
						_this.tableData.push(i)
					}
					
					_this.totallength=_this.totalData.length
						
					
					this.$message({
					  showClose: true,
					  type:"success",
					  message: '删除成功'
					});
					
					
				}).catch(err=>{
					
				})
				

			},
		},
		async created(){
			let _this=this
			
			// // 获取标签信息
			// _this.labels=["全部"]
			// await axios({
			// 	url:"http://127.0.0.1:10013/get/label",
			// 	method:"post",
			// 	headers:{
			// 		"content-type":"multipart/form-data"
			// 	},
			// 	data:{
			// 		token:localStorage.getItem("token")
			// 	}
			// }).then(res=>{
				
			// 	for(let i of res.data){
			// 		_this.labels.push(i)
			// 	}
			// })
			// .catch(err=>{
				
			// })
			
			// 请求图片信息
			await axios({
				url:"http://127.0.0.1:10013/get/pic",
				method:"post",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
					token:localStorage.getItem("token")
				}
			}).then(res=>{
					for(let j=0;j<res.data.length;j++){
						_this.totalData.push({label:res.data[j].label,name:res.data[j].pic_name,url:res.data[j].pic_url,id:res.data[j].pic_id,public:res.data[j].public,public:res.data[j].public})
					}
					_this.totallength=_this.totalData.length
					let arr=_this.totalData.slice((this.currentPage-1)*5,this.currentPage*5)
					for(let i of arr){
						_this.tableData.push(i)
					}
					_this.dataloading=false
			}).catch(err=>{
			// 获取图片信息失败
				
			})
			

	},
	async activated(){
		let _this=this
		// 更新label
		_this.labels=["全部"]
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
				_this.labels.push(res.data[i])
			}
		})
		.catch(err=>{
			console.log(err)
		})
		
		// 更新表格数据
		_this.dataloading=true
		axios({
			url:"http://127.0.0.1:10013/get/pic",
			method:"post",
			headers:{
				"content-type":"multipart/form-data"
			},
			data:{
				token:localStorage.getItem("token"),
				label:_this.currentLabel
			}
		}).then(res=>{
				_this.totalData=[]
				_this.tableData=[]
				_this.currentPage=1
				for(let j=0;j<res.data.length;j++){
					_this.totalData.push({label:res.data[j].label,name:res.data[j].pic_name,url:res.data[j].pic_url,id:res.data[j].pic_id,public:res.data[j].public})
				}
				_this.totallength=_this.totalData.length
				var arr=_this.totalData.slice((this.currentPage-1)*5,this.currentPage*5)
				for(let i of arr){
					_this.tableData.push(i)
				}
				_this.dataloading=false
		}).catch(err=>{
		// 获取图片信息失败
			console.log(err)
		})
	},
	deactivated() {

	},
}
</script>

<style lang="less">
	// 预览图片
	.preview{
		width: 400px !important;
		max-height: 35% !important;
	}
	.preview:hover{
		cursor: pointer;
	}
	
	.remove{

		
		.labels{
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
			

			
			.el-button:active{
				background-color: rgba(225, 253, 255, 0.5);
				color:blue;
				box-shadow:
				inset -3px -3px 5px rgba(234, 255, 254, 0.5),
				inset 3px 3px 5px rgba(0, 123, 255, 0.5);
				
			}
			
			.el-menu{
				background-color: #f5f5f5;
				margin-top: 5px;
				
				.el-menu-item{
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					border-radius: 20px;
					height: 40px;
					line-height: 40px;
					margin-top: 10px;
					margin-left: 10px;
					box-shadow:
					-3px -3px 5px rgba(234, 255, 254, 0.5),
					3px 3px 5px rgba(0, 123, 255, 0.5);
					border-bottom: none;
					
				}
				
				.el-menu-item:hover{
					cursor: pointer;
				}
				
				.is-active{
					background-color: rgba(225, 253, 255, 0.5);
					color:blue;
					box-shadow:
					inset -3px -3px 5px rgba(234, 255, 254, 0.1),
					inset 3px 3px 5px rgba(0, 123, 255, 0.5);
				}
				
			}
			
			
		}
		
		.search{
			margin-top: 10px;
			margin-left: 3px;
			border-radius: 15px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.delete{
				margin-right: 20px;
			}
			
			.search-input{
				width: 350px;
				background-color: #d9ecda;
				padding:5px;
			}
		}
		
		.el-table{
			margin-top: 5px;
			border-radius: 30px;
			box-shadow:
				-3px -3px 5px rgba(0, 123, 255, 0.6),
				3px 3px 5px rgba(0, 157, 255, 0.5);
				
			
			.del-btn{
				color:blue;
				height: 40px;
				border:none;
				box-shadow:
				-3px -3px 5px rgba(234, 255, 254, 0.5),
				5px 5px 5px rgba(0, 123, 255, 0.5);
			}
			
			.del-btn:active{
				background-color: rgba(225, 253, 255, 0.5);
				color:blue;
				box-shadow:
				inset -3px -3px 5px rgba(234, 255, 254, 0.5),
				inset 3px 3px 5px rgba(0, 123, 255, 0.5);
			}
			
			.el-table__cell{
				font-size: 18px !important;
			}
			
		}
		
	}
</style>