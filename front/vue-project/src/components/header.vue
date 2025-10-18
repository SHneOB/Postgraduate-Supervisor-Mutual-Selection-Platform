<template>
      <el-header>
        <div class="toolbar">
          <el-dropdown v-if="jwt.hasToken()">
            <el-icon style="margin: 10px;"><MoreFilled /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="jwt.logout()">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="success" :icon="User" round @click="router.replace('/login')" v-if="!jwt.hasToken()">登录</el-button>
          <el-button type="primary" :icon="User" round @click="router.replace('/UserInfo_manager')" v-if="jwt.hasToken() && character==0">管理员个人信息</el-button>
          <el-button type="primary" :icon="User" round @click="router.replace('/UserInfo_student')" v-if="jwt.hasToken() && character==1">研究生个人信息</el-button>
          <el-button type="primary" :icon="User" round @click="router.replace('/UserInfo_tutor')" v-if="jwt.hasToken() && character==2">导师个人信息</el-button>
        </div>
      </el-header>
</template>

<script setup>
import jwt from '../../jwt';
import {MoreFilled,Setting, House ,Document,User} from '@element-plus/icons'
import router from '../../router/index.js'
import {ref} from 'vue'
const character=localStorage.getItem('character');

</script>

<style scoped>
.el-header {
  text-align: right;
  font-size: 12px;
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.el-menu {
  border-right: none;
}
.el-main {
  padding: 0;
}
.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>