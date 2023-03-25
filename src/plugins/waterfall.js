!function(){
	var waterFall=function(opt){
		this.el= document.getElementsByClassName(opt.el)[0]	//输入类名，获取父元素
		this.columns=opt.columns
		this.gap=opt.gap
		this.imgArr=opt.imgArr
		this.itemWidth=(this.el.offsetWidth-(this.columns-1)*this.gap)/this.columns
		
		// 获取所有项
		this.items=this.el.getElementsByClassName("item")
		// 排第一行
		
		// 第一排的高度
		this.heightArr=[]

	}
	
	waterFall.prototype.init=function(){
		this.render()
	}

	waterFall.prototype.render=function(){
		var item=null;
		for(let i =0;i<this.imgArr.length;i++){
			item=this.items[i]
			item.className+=" animate__animated animate__flipInX"
			item.style.width=this.itemWidth+"px"
			item.style.outline="6px solid rgba(166,255,107,0.5)"
			item.querySelector("img").style.width=this.itemWidth+"px"
			item.style.visibility="visible"
			if(i<this.columns){			
				item.style.left=(this.itemWidth+this.gap)*i+"px"
				item.style.top=0+"px"
				this.heightArr.push(item.offsetHeight)
			}else{
				var minIndex=getminIndex(this.heightArr)
				item.style.top=((this.heightArr[minIndex])+this.gap)+"px"
				item.style.left=minIndex*(this.itemWidth+this.gap)+"px"
				this.heightArr[minIndex]+=(item.offsetHeight+this.gap)
			}
		}
	}

	function getminIndex(arr){
		var min = Math.min(...arr)
		return arr.indexOf(min)
	}

	window.waterFall=waterFall
}()