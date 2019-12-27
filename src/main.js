import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './assets/icon/css/iconfont.css'






import {post,get,patch,put} from "./assets/axiostool.js"
//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$fetch = get;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;





Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
