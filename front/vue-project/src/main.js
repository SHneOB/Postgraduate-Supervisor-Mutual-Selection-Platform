import { createApp, render } from 'vue'
import App from './App.vue'
//引入router
import router from '../router'
//引入插件
import ElementPlus from 'element-plus'
//引入css文件
import 'element-plus/theme-chalk/index.css';
import 'element-plus/dist/index.css'
//引入axios
import axios from 'axios'
//引入axios中的实例

createApp(App).use(router).use(ElementPlus).use(axios).provide('$axios',axios).mount('#app')

//全局异常处理 给力
window.addEventListener('unhandledrejection', (event) => {
    console.log(event.reason);
  });
//app.config.globalProperties.$axios = axios//挂载到全局
