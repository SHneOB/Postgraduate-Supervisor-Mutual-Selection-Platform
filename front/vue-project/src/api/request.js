import axios from "axios";
import { message } from "ant-design-vue";
import router from "../../router/index.js"
const Request = axios.create({//声明了一个名为request的实例对象 
    baseURL: 'http://localhost:8080',//'https://famous-rarely-clam.ngrok-free.app',
    timeout: 10000,//超时设置
  });
// 添加请求拦截器
Request.interceptors.request.use(function (config) {
  console.log("request中间件:请求发送前")
  const token=localStorage.getItem("Authorization");
  if(!((config.url=="/teacher/user/login")||(config.url=="/student/user/login")||(config.url=="/student/user/login"))){//如果当前页面不是登录页面 给请求添加token
    console.log("访问后端url:",config.url)
    console.log("非登录页,请求头添加token:")
    if(token!=null)//请求头添加token
    {
      console.log("token存在:",token)
      config.headers.token = token;
    }
    else{
      console.log("token不存在")
      message.error('登录信息失效,请重新登录!');
      router.replace({ path: "/login" });
    }
  }
  console.log("请求信息抛出:",config)
  //返回config
  return config;
}, function (error) {
  console.log("request中间件:请求发送失败")
  // 对请求错误做些什么 
  return Promise.reject(error);
});

/*
// 添加响应拦截器
Request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  const responseData=response.data;//respnseData保存返回数据 可以不用
  console.log(responseData)
  console.log(responseData[0].token)
  if(response.status === 200){ //code为200 成功
      localStorage.setItem("Authorization",responseData[0].token) //如果返回了token那就更新token
          return response;//返回响应的数据
  }else{
      return  Promise.reject(response)  
  }
}, function (error) {
  // 对响应错误做点什么
  if(error.response.status){
    switch(error.response.status){
      //未登录,跳转到登录页并携带当前页路径，登录成功后跳转
      case 401:
          router.replace({
            path:'/login',
            query:{redirect:router.currentRoute.fullPath}
          })
      //token过期，对用户提示然后清除本地token再跳转
      case 403:
          Toast({
            message:'登陆过期',
            duration:1000,
          })
          localStorage.removeItem('Authorization')
          //store.commit('token')
          setTimeout(() => {
              router.replace({
                path:'/login',
                query:{redirect:router.currentRoute.fullPath}
              })
          },1000)
      //请求不存在		
      case 404:
          Toast({
            message:'请求不存在',
            duration:1000,
          })
      break
      
      //其他错误，提示错误
      default:
          Toast({
            message:error.response.data.message,
            duration:1000,
          })
    }
  }
  return Promise.reject(error);
});
*/
export default Request//默认导出该组件 其他组件导入任意命名