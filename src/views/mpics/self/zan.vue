<template>
    <div class="zan" v-loading="loading">
        <!-- :key="key" -->
        <div class="wrapper">
            <vueWaterfallEasy
            :imgsArr="imgArr" 
            :imgWidth="imgWidth"
            :gap="gap"
            :key="key"
            @scrollReachBottom="getData"
            :maxCols="2"
            ref="waterfall"
            :loadingDotStyle="{
                width:'25px',
                height:'25px'
            }"
            >   
                <div class="opts" slot-scope="props" >
                    <a target="_blank" class="user" :href="props.value.user_home" >
                        <img :src="props.value.icon" alt="">
                        
                    </a>
                    <div class="icons" >
                        <i @click="copylink(props.value.src)" class="iconfont icon-fenxiang"></i>
                        <i @click="zan(props.value.index,props.value.is_liked,props.value.id)" :class="{'iconfont':true,'icon-dianzan':true,'is-liked':props.value.is_liked==1}">{{props.value.like_sum}}</i>
                        
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
        name:"zan",
        data(){
                return{
                    imgArr:[],
                    group:0,
                    totalArr:[],
                    gap:20,
                    imgWidth:(600-20)/2,
                    index:0,
                    activeName:"",
                    key:(new Date).getTime(),
					loading:false,
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
                if(this.group<Math.floor(this.totalArr.length/9)){
                    setTimeout(()=>{
                        for(let i=(_this.group)*9;i<(_this.group)*9+9;i++){
                            _this.imgArr.push(_this.totalArr[i])
                        }
                        _this.group+=1
                    },500)
                }else{
                    var lastArr=[]
                    setTimeout(()=>{
                            for(let i=(_this.group)*9;i<_this.totalArr.length;i++){
                                lastArr.push(_this.totalArr[i])
                            }
                            _this.imgArr.concat(lastArr)
                            _this.$refs.waterfall.waterfallOver()
                    },500)
                }
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
			this.loading=true
            
            await axios({
                method:"post",
                url:"http://127.0.0.1:10013/get/like",
                headers:{
                    "content-type":"multipart/form-data"
                },
                data:{
                    token:localStorage.getItem("token")
                }
            }).then(res=>{
                // 图片信息
					this.loading=false
                    for(let i=0;i<res.data.length;i++){
                        _this.totalArr.push({icon:res.data[i].icon,index:i,src:res.data[i].pic_url,id:res.data[i].pic_id,like_sum:res.data[i].like_sum,is_liked:res.data[i].is_liked,user_home:`http://localhost:8080/mpic/user?i=${res.data[i].user_id}`})
                    }

                
            if(_this.totalArr.length>=9){
                for(let i=0;i<9;i++){
                    // _this.$set(_this.imgArr,i,_this.totalArr[i])
                    _this.imgArr.push(_this.totalArr[i])
                }
            }else{
                for(let i of _this.totalArr){
                    _this.imgArr.push(i)
                }
            }
                
                _this.group+=1
                
            // 赞信息，判断有没有token，有token查询当前用户对哪些图片点赞了
                
            }).catch(err=>{
				this.loading=false
                console.log(err)
            })
        }
        
    }
    
</script>



<style lang="less">
    .zan{
        width: 100%;
        
        
        .wrapper{
            height: calc(80vh - 15px);
            margin-top: 15px;
        }
        // left:50%;
        // transform: translateX(-50%);
        
        
        
        .vue-waterfall-easy-container{
            width: 90% !important;
            margin: 15px auto 0px;
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