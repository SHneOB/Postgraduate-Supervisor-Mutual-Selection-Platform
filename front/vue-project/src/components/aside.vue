<template>
      <el-aside style="min-height: 100%;">
        <div style="background-color:  var(--el-color-primary-light-8); height: 60px; line-height: 60px; font-size: 20px; display: flex; align-items: center; justify-content: center">
        <span class="logo-title" v-show="!isCollapse">研究生导师双选系统</span>
        </div>
          <el-menu :default-active="$route.path" router><!--给el-menu加上router属性 使menu-item可以直接路由-->
            <el-menu-item index="/home"><el-icon><House /></el-icon>首页</el-menu-item>
            <el-menu-item index="/UserInfo_manager" v-if="character==0 || character==3"><el-icon><Setting /></el-icon>管理员个人中心</el-menu-item>
            <el-menu-item index="/UserInfo_student" v-if="character==1 || character==3"><el-icon><Setting /></el-icon>研究生个人中心</el-menu-item>
            <el-menu-item index="/UserInfo_tutor" v-if="character==2 || character==3"><el-icon><Setting /></el-icon>导师个人中心</el-menu-item>
            <el-sub-menu index="1" v-if="character==0 || character==3">
              <template #title><el-icon><UserFilled /></el-icon>
              管理员入口
              </template>
              <el-menu-item-group>
                <template #title>管理</template>
                <el-menu-item index="/users_manage">用户信息管理</el-menu-item>
                <el-menu-item index="/tutor_manage">导师信息管理</el-menu-item>
                <el-menu-item index="/student_manage">研究生信息管理</el-menu-item>
                <el-menu-item index="/allocation_manage">名额分配管理</el-menu-item>
                <el-menu-item index="/query_manage">综合查询统计</el-menu-item>
                <el-menu-item index="/match_manage">匹配导师</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2" v-if="character==2 || character==3">
              <template #title><el-icon><UserFilled /></el-icon>
              导师入口
              </template>
              <el-menu-item-group>
                <el-menu-item index="/Confirm_tutor">导师确认管理</el-menu-item>
                <el-menu-item index="/query_tutor">综合查询统计</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="3" v-if="character==1 || character==3">
              <template #title><el-icon><UserFilled /></el-icon>
              研究生入口
              </template>
              <el-menu-item-group>
                <el-menu-item index="/Confirm_student">研究生志愿填报</el-menu-item>
                <el-menu-item index="/query_student">综合查询统计</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="4" v-if="character==3">
              <template #title>
              测试页面们
              </template>
              <el-menu-item-group>
                <template #title>组1</template>
                <el-menu-item index="/ax_test">axios测试</el-menu-item>
                <el-menu-item index="/test">测试页面</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
      </el-aside>
  </template>
  
  <script setup>
  import {UserFilled,Setting, House ,Document} from '@element-plus/icons'
  import {ref} from 'vue'
  const character=localStorage.getItem('character');//初始化为3 不存在的角色
  </script>
  
  <style scoped>
 .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
  }
 .el-aside {
    color: var(--el-text-color-primary);
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