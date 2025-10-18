<template>
    <el-container class="layout-container-demo" style="height: auto">
      
      <GW-aside />
      <el-container>
        <!--多加了一个header标签 否则不垂直排列(element的锅)-->
        <el-header style="position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);">
          <GW-header />
        </el-header>
        <el-main style="padding: 0;">
          <!--面包屑-->
        <el-breadcrumb :separator-icon="ArrowRight" style="margin: 20px;">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>导师个人中心</el-breadcrumb-item>
        </el-breadcrumb>
         <!--导师信息-->
          <div class="container">
            <div >导师个人信息</div>
            <el-form :model="form" label-width="auto" style="max-width: 600px">
              <el-form-item label="导师账号">
                <el-input disabled v-model="form.account"/>
              </el-form-item>
              <el-form-item  label="姓名">
                <el-input disabled v-model="form.name"/>
              </el-form-item>
              <el-form-item label="性别">
                <el-input disabled v-model="form.sex"/>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="form.password"/>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input
                placeholder="11位手机号"
                maxlength="11"
                v-model="form.phone" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="form.email" />
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input type="textarea"
                    placeholder="请输入内容"
                    :rows="5"
                    maxlength="300"
                    show-word-limit
                    style="width: 100%" v-model="form.profile"/>
              </el-form-item>
              <el-button @click="formSubmit()" type="primary" plain style="margin: 50px;">确认更改</el-button>
              <el-button @click="formReset()" type="plain" plain style="margin: 50px;" >重置</el-button>
            </el-form>
          </div>

          <el-dialog
            style="display: flex; /* 启用Flexbox布局 */  
            flex-direction: column; /* 设置主轴方向为垂直方向 */  
            align-items: center; /* 在交叉轴上居中对齐子元素（这里是水平居中，因为主轴是垂直的） */  
            justify-content: center"
            v-model="Confirm_dialogVisible"
            width="400"
          >
          <h2>真的要修改吗！</h2>
          <div class="dialogConfirm">
            <el-button type="primary" @click="formSubmit_Confirm">确认</el-button>
            <el-button @click="Confirm_dialogVisible = false">再想想</el-button>
          </div>
        </el-dialog>
        </el-main>
        <GW-footer/>
      </el-container>
    </el-container>
  </template>
  
  <script lang="ts">
  import {ArrowRight } from '@element-plus/icons'
  import aside from '../components/aside.vue';
  import header from '../components/header.vue';
  import footer from '../components/footer.vue';
  import{onMounted, reactive, ref} from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import type { Action } from 'element-plus'
  import { message } from 'ant-design-vue';
  import Request from '@/api/request';
  import jwt from '../../jwt';
  import type { ComponentSize } from 'element-plus'
  export default {
    setup(){
      let Confirm_dialogVisible=ref(false);
      const form=ref({//用来保存修改后的表单数据
      id:null,//int
      account:"00001",
      sex:"男",
      profile:"XXXX大学,教授",
      phone:"12345678910",
      email:"456123@qq.com",
      password: "",
      name: "王刚",
      });
      const get_data = async() => {
      const UUUurl = "/teacher/user/personalInfo";
      console.log("get_data:");
        Request({
          method: 'GET',
          url: UUUurl,
        }).then((response) => {
          form.value = response.data.data;
          console.log("get的数据:",form.value)
          return response;
        }).catch((error) => {
          console.log('get报错', error.message);
        });
      };
      const formReset=async()=>{
        console.log("Reset:");
        //调用get_data 重置form数据
        await get_data();
        console.log("get_data完成")
      };
      const formSubmit=()=>{
        console.log("Submit:");
        Confirm_dialogVisible.value=true;
      };
      const formSubmit_Confirm=()=>{
        Confirm_dialogVisible.value = false;//confirm对话框隐藏
        console.log("SubmitConfirm:");
        const UUUurl = "/teacher/user/editInfo";
        Request({
          method: 'POST',
          url: UUUurl,
          data: {
            password: form.value.password,
            phone: form.value.phone,
            email:form.value.email,
            profile: form.value.profile
        }
        }).then((response) => {
          form.value = response.data.data;
          console.log("SubmitConfirm数据:",form.value)
          return response;
        }).catch((error) => {
          console.log('SubmitConfirm报错', error.message);
        });
      };
      onMounted(() => {
        get_data();
      });
      return {
        ArrowRight,
        Confirm_dialogVisible,
        form,
        formReset,
        formSubmit,
        formSubmit_Confirm
      };
    },
      components: {
          'GW-aside': aside,
          'GW-header': header,
          'GW-footer': footer
      },
  }
  </script>
  <!--样式表-->
  <style scoped>
  @import url('../assets/Mycss.css');
  </style>