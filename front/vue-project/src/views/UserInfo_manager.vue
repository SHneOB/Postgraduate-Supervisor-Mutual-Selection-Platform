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
          <el-breadcrumb-item>管理员个人中心</el-breadcrumb-item>
        </el-breadcrumb>
        <!--个人信息-->
        <div class="container">
          <div >管理员个人信息</div>
          <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item  label="账号"><el-input disabled v-model="form.account" /></el-form-item>
            <el-form-item  label="姓名"><el-input disabled v-model="form.name" /></el-form-item>
            <el-form-item  label="密码"><el-input disabled v-model="form.password" /></el-form-item>
          </el-form>
        </div>
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
    const form=ref({//用来保存修改后的表单数据
    id:1,//int
    account:"0001",
    password: "123456",
    name: "admin",
    });
    const get_data = async() => {
      const UUUurl = "/admin/user/personalInfo";
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
    onMounted(() => {
      get_data();
    });
    return {
      ArrowRight,
      form,
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