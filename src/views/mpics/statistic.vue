<template>
	<div class="statistic">
		<div class="cards">
			<el-card class="box-card">
			  <div slot="header" class="clearfix">
			    <h2>托管图片总数</h2>
			  </div>
			<div class="card-content">
				<h3 style="font-size: 30px;">{{pic_num}}张</h3>
				<div style="color: blue; font-size: 50px;">
					<i class="el-icon-picture-outline" ></i>
				</div>
			</div>
				
			</el-card>
			<el-card class="box-card">
			  <div slot="header" class="clearfix">
			    <h2>标签总数</h2>
			  </div>
			  
			  <div class="card-content">
				  <h3 style="font-size: 30px;">{{label_num}}个</h3>
			  	<div style="color: blue; font-size: 50px;">
			  		<i class="el-icon-folder-opened"></i>
			  	</div>
			  </div>
				
			</el-card>
		</div>
		<div class="chart" ref="chart">
			
		</div>
	</div>
</template>

<script>
	import * as echarts from "echarts"
	import axios from 'axios'
	
	export default{
		name:"statistic",
		data(){
			return {
				label_num:0,
				pic_num:0,
				data1:[],
				data2:[],
				data3:[],
				randomColor:[]
				
			}
		},
		methods:{
			generateColor(){
			            var sum = ""
			            for (var i = 0; i < 6; i++) {
			                sum += Math.floor(Math.random() * 16).toString(16)
			            }
			            return`#${sum}`;
			        }
		},
		async mounted(){
			this.data1=[]
			this.data2=[]
			axios({
				url:"http://127.0.0.1:10013/statistic/labelcount",
				method:"post",
				headers:{
					"content-type":"multipart/form-data"
				},
				data:{
					token:localStorage.getItem("token")
				}
			}).then(res=>{
				// 响应数量
				let _this=this
				_this.pic_num=res.data.pic_sum
				_this.label_num=res.data.label_sum
				_this.$refs.chart.style.height=res.data.label_sum*70+"px"
				
				for(let i in res.data){
					if(i!="pic_sum" && i!="label_sum"){
						_this.data1.push(i)
						_this.data2.push(res.data[i])
					}
				}
				let total=0
				for(let x=0;x<_this.data2.length;x++){
					total+=_this.data2[x]
				}
				for(let x=0;x<_this.data2.length;x++){
					_this.data3.push(total)
				}
				for(let x=0;x<_this.data2.length;x++){
					_this.randomColor.push(_this.generateColor())
				}
				let mychart = echarts.init(_this.$refs.chart)
						mychart.setOption({
						title: {
							text: '各标签存储数量',
							textStyle:{
							color:"blue",
						}
					},
							  grid: {
								left: '15%',
								right: '5%',
								bottom:'1%',
								containLabel:false, 
							  },
							  xAxis: {
								type: 'value',
								boundaryGap: [0, 0.01],
								show:false
							  },
							  yAxis: [{
								type: 'category',
								data: _this.data1,
								axisLabel:{
									color:"rgba(0,0,0,0.8)",
								},
								axisLine:{
									show:false
								},
								axisTick:{
									show:false
								}
							  },{
								type: 'category',
								data: _this.data1,
								axisLabel:{
									color:"rgba(0,0,0,0.8)",
									show:false,
								},
								axisLine:{
									show:false
								},
								axisTick:{
									show:false
								}
							  }],
							  series: [
								{
								  type: 'bar',
								  data: _this.data2,
								  yAxisIndex:0,
								  itemStyle:{
									 barBorderRadius:20,
									 color:function(params){
										 return _this.randomColor[params.dataIndex]
									 }
				
								  },
								  barCategoryGap:60,
								  barWidth:10,
								  label:{
									  show:true,
									  formatter:'{c}张',
									  position:"outside",
									  color:'#000'
								  }
								},
								{
								  type: 'bar',
								  data: _this.data3,
								  yAxisIndex:1,
								  barCategoryGap:60,
								  barWidth:15,
								  itemStyle:{
										barBorderRadius:20,
										borderWidth:3,
										color:"none",
										borderColor:"#00e1ec"
								  },
								}
							  ]
						})
				
			}).catch(err=>{
				console.log(err)
			})
			
			
			
		}
	}
</script>

<style lang="less">
	.statistic{
		display: flex;
		flex-wrap: wrap;
		
		.cards{
			margin-top: 10px;
			display:flex;
			width: 100%;
			justify-content: space-evenly;
			
			.el-card{
				width: 48%;
				
				.card-content{
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
			}
		}
		
		.chart{
			margin-top: 20px;
			width: 100%;
		}
	}
	
</style>