<template>
  <el-container class="layout-container-demo" style="height: auto">
      <!--login页面无侧边栏-->
    <el-container>
      <!--多加了一个header标签 否则不垂直排列(element的锅)-->
      <el-header style="position: relative;
      background-color: var(--el-color-primary-light-7);
      color: var(--el-text-color-primary);">
        <GW-header />
      </el-header>


      <!--main------------------------------------------------------------------------------------------------------------->


      <el-main style="padding: 0;">
      <div class="box">
        <!-- 遮罩层 -->
       <div class="mask" v-if="Show_verification">
          <!-- 用来放置验证模块 -->
          <div class="verification"> 
            <GW-verification @verified="verified" @close="Show_verification_Change"></GW-verification>
          </div>
       </div>
        <div class="content">
          <div class="login-wrapper">
              <h1>您好,{{ character_str }}</h1>
              <div class="login-form">
                  <div class="username form-item">
                      <span>使用邮箱或者手机号</span>
                      <input type="text" class="input-item" :value="account"
                      @input="account = $event.target.value">
                  </div>
                  <div class="password form-item">
                      <span>密码</span>
                      <input type="password" class="input-item" v-model="password">
                  </div>
                  <button class="login-btn" @click="login_clicked">登 录</button>
              </div>
              <div class="divider">
                  <span class="line"></span>
                  <span class="divider-text">登录身份</span>
                  <span class="line"></span>
              </div>
              <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
              <el-button :disabled="character===1" @click="character=1;character_str='研究生'; console.log('当前角色:',character_str)" type="success" round>我是研究生</el-button>
              <el-button :disabled="character===2" @click="character=2;character_str='导师'; console.log('当前角色:',character_str)" type="warning" round>我是导师</el-button>
              <el-button :disabled="character===0" @click="character=0;character_str='管理员'; console.log('当前角色:',character_str)" type="danger" round>我是管理员</el-button>
              </div>
            </div>
      </div>
  </div>
      </el-main>
      <!--main------------------------------------------------------------------------------------------------------------->
      <!--footer-->
      <GW-footer/>
    </el-container>
  </el-container>
</template>

<script>
import Request from '../api/request'
import { message } from 'ant-design-vue';
import { ref, watchEffect } from 'vue'
import '../assets/css/login.css';//引入样式
//引入组件
import aside from '../components/aside.vue';
import header from '../components/header.vue';
import footer from '../components/footer.vue';
import  Vverify from "../components/verification.vue"; 
import jwt from '../../jwt';
import router from '../../router/index.js'
//
export default {
    components: {
        'GW-aside': aside,
        'GW-header': header,
        'GW-footer': footer,
        'GW-verification':Vverify
    },
    setup()
    {
      const character=ref(1);
      const character_str=ref("研究生");
      let account=ref("");
      let password=ref("");
      let Show_verification = ref(false)
      function get_data(result)//后端传回数据处理
      {
        console.log(result)
      }
      function Show_verification_Change(isClose){
        Show_verification.value=isClose;
      }
      function verified (val)  {
        if(val==true)
        {
          
          //随便设置token 方便调试
          router.replace({ path: "/home" });
          localStorage.setItem('character',character.value)
          jwt.setToken('This is a fuking token')
          
          message.success("滑块验证成功")
          console.log("滑块验证成功!")
          Show_verification.value = false
          //交给后端账号密码 获取token->设置token->检查有无token
          console.log("login请求:")
          const UUUurl=ref("");
          if(character.value===0){
            UUUurl.value='/admin/user/login';
          }else if(character.value===1){
            UUUurl.value='/student/user/login';
          }else if(character.value===2){
            UUUurl.value='/teacher/user/login';
          }
          console.log("登录访问Url:",UUUurl.value)
            Request({
                method: 'POST',
                url: UUUurl.value,
                data: {
                    account:account.value,//账户
                    password:password.value//密码
                }
            }).then(response => {
              const responseData=response.data.data
              console.log(responseData.token)
              jwt.setToken(responseData.token)//设置token
              localStorage.setItem("character",character.value)//设置角色
              message.success("登录成功,正在跳转")
              router.replace({ path: "/home" });
              return responseData
            }, error => {
            console.log('错误', error.message)
            })
        }
        else
        {
          message.error("验证失败")
          console.log("滑块验证失败!")
        }
      }
      function login_clicked(){
        console.log('用户点击了登录按钮')
        console.log(account.value)
        console.log(password.value)
        Show_verification.value = true
      }
      return{
        Show_verification_Change,
        verified,
        login_clicked,
        Show_verification,
        account,
        password,
        character,//当前角色
        character_str,//当前角色:str
        jwt
      }
    }
}
</script>
<!--样式表-->
<style scoped>
.login {
position: relative;
overflow: hidden;
background-color: #5fd05d;
min-height: 100vh; /* 设置最小高度为视口高度的100% */
.cover{
  width: fit-content;
  background-color: aliceblue;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 1000;
}
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.5);
}
.verification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
}
</style>