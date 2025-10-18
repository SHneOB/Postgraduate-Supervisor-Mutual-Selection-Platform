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
            <el-breadcrumb-item>研究生入口</el-breadcrumb-item>
            <el-breadcrumb-item>综合信息统计</el-breadcrumb-item>
          </el-breadcrumb>

            <div class="container">
                <el-form @submit.native.prevent :model="form" label-width="auto" style="margin-left:10px;display: flex;"> 
                <el-form-item label="导师姓名">
                <el-input @keyup.enter.native="handleQuery()" v-model="form.search_name" style="margin-right: 10px;"/>
                </el-form-item>
                <el-button @click="handleQuery()" type="success" plain >查询</el-button>
                </el-form>           
                
                <!--导师数据展示-->
                <el-table v-loading="false" :data="tableData"  max-height="800" border style="width: 100%;margin-bottom: 20px;">
                    <el-table-column  prop="account" label="账号" width="120" />
                    <el-table-column  prop="name" label="导师" width="120" />
                    <el-table-column prop="research" label="研究方向" width="120" />
                    <el-table-column prop="sex" label="性别" width="120" />
                    <el-table-column prop="selected" label="已选名额" width="120" />
                    <el-table-column prop="last" label="剩余名额" width="120" />
                    <el-table-column prop="quota" label="总可带生名额" width="120" />
                </el-table>
                <!--分页-->
                <div class="demo-pagination-block">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :size="size"
                    :disabled="disabled"
                    :background="background"
                    layout="prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
                </div>
            </div>  
        </el-main>
        <GW-footer/>
      </el-container>
    </el-container>
  </template> 
  <script lang="ts">
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  import {ArrowRight } from '@element-plus/icons'
//分页栏所需的变量
const currentPage = ref(1)
const pageSize = ref(5)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
const total=ref(1);
//
  export default {
    setup(){
      let dialogVisible=ref(false);
      let Add_dialogVisible=ref(false);
      //是否弹出对话框
      const tutor_research=ref("xxxx");
      const tutor_quota=ref(0);
      const tutor_selected=ref(0);
      const tutor_last=ref(0);
        const tableData = ref([
        {
        id: 1,
        account: "220018",
        name: "王老师",
        sex: "女",
        title: "教授",
        phone: "15513065088",
        email: "123@163.com",
        dept: "信息学院",
        office: "瀚学楼0001",
        research: "人工智能",
        year: 2022,
        quota:100,
        last:20,
        selected:80
        },
        {
        id: 2,
        account: "220019",
        name: "张老师",
        sex: "男",
        title: "教授",
        phone: "15513065088",
        email: "456@163.com",
        dept: "信息学院",
        office: "瀚学楼0001",
        research: "大数据",
        year: 2022,
        quota:100,
        last:20,
        selected:80
        },
        {
        id: 3,
        account: "220020",
        name: "李老师",
        sex: "男",
        title: "教授",
        phone: "15513065088",
        email: "789@163.com",
        dept: "信息学院",
        office: "瀚学楼0001",
        research: "嵌入式开发",
        year: 2022,
        quota:100,
        last:20,
        selected:80
        }
        ]);
        const form=ref({
            search_name:"",
            search_account:""
        });
  const copyOFrow=ref({});
  ////////////////////////////////////////////////////////////////////////以上为数据 以下为函数
//分页
const handleSizeChange = (val: number) => {
console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log("当前页:",currentPage.value)
    get_data()
}
  //
const get_data = () => {
    const UUUurl = '/student/statistics/statisticsTeacher' ;
      console.log("get_data:");
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
          name: form.value.search_name,
          pageNum: currentPage.value,
          pageSize: pageSize.value
        }
      }).then((response) => {
        total.value = response.data.total;
        tableData.value = response.data.data.records;
        console.log("get的数据:",tableData.value)
        return response;
      }).catch((error) => {
        console.log('get报错', error.message);
      });
    };
    //查询
    const handleQuery=()=>{
      const UUUurl = '/student/statistics/statisticsTeacher' ;
      console.log("查询老师:",form.value.search_name);
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
          name: form.value.search_name,
          pageNum: currentPage.value,
          pageSize: pageSize.value
        }
      }).then((response) => {
        total.value = response.data.total;
        tableData.value = response.data.data.records;
        console.log("查询的数据:",tableData.value)
        return response;
      }).catch((error) => {
        console.log('查询报错', error.message);
      });
    }
    //页面初始
    onMounted(() => {
      get_data();
    });

    return {
      ArrowRight,
      //
      currentPage,
      pageSize,
      size,
      background,
      disabled,
      total,
      handleSizeChange,
      handleCurrentChange,
      //
      tutor_research,
        tutor_quota,
        tutor_selected,
        tutor_last,
      tableData,
      copyOFrow,
      form,
      dialogVisible,
      Add_dialogVisible,
      get_data,
      handleQuery
    };
  },
  components: {
    'GW-aside': aside,
    'GW-header': header,
    'GW-footer': footer
  }
};
  </script>
  <!--样式表-->
  <style scoped>
  @import url('../assets/Mycss.css');
  </style>