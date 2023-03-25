import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia, PiniaVuePlugin } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'



// 状态管理
Vue.use(PiniaVuePlugin)
const pinia = createPinia()
// 本地数据持久化
pinia.use(piniaPluginPersist)

// 引入element组件
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

// 图片点击放大组件
import Viewer from  'v-viewer'
import "viewerjs/dist/viewer.css"

Vue.use(Viewer)


window.router=router

Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
  router,
  pinia,
  render: h => h(App),
}).$mount('#app')
