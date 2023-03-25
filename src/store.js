import { defineStore } from 'pinia'
import jwt from "jsonwebtoken"
import axios from "axios"


export default defineStore('myStore', {
  // arrow function recommended for full type inference
  state: () => {  
	return {
		user:{}
	}
  },
  actions:{
		changeInfo(){
			
		},
		changeuserIcon(url){
			this.user.icon=url
		},
		getuserData(){
			(async ()=>{
				const content=await axios({
					url:"http://127.0.0.1:10013/get/user",
					method:"post",
					headers:{
						"content-type":"multipart/form-data"
					},
					data:{
						token:localStorage.getItem("token")
					}
				});
				this.user={
					username:content.data.username,
					icon:content.data.icon,
					reg_time:content.data.register_time,
					email:content.data.email,
					labels:content.data.labels,
					sum:content.data.sum,
					phone:content.data.phone,
				}
			})();
		}
  },
  preset:{
	  storage:localStorage,
	  paths:["user"]
  }
})
	