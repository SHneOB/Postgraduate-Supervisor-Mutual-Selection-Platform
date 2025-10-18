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
            <el-breadcrumb-item>导师入口</el-breadcrumb-item>
            <el-breadcrumb-item>综合信息统计</el-breadcrumb-item>
          </el-breadcrumb>    

            <div class="container" style=" flex-direction: row;">
                <el-form-item  label="研究方向">
                <el-input disabled v-model="tutor_research"/>
                </el-form-item>
                <el-form-item  label="总名额">
                    <el-input disabled v-model="tutor_quota"/>
                </el-form-item>
                <el-form-item  label="剩余名额">
                    <el-input disabled v-model="tutor_last"/>
                </el-form-item>
                <el-form-item  label="已选名额">
                    <el-input disabled v-model="tutor_selected"/>
                </el-form-item>
            </div>
            <div class="container">
                <el-form @submit.native.prevent :model="form" label-width="auto" style="margin-left:10px;display: flex;"> 
                <el-form-item label="学生姓名">
                <el-input @keyup.enter.native="handleQuery()" v-model="form.search_name" style="margin-right: 10px;"/>
                </el-form-item>
                <el-form-item label="学生学号">
                <el-input @keyup.enter.native="handleQuery()" v-model="form.search_account" style="margin-right: 10px;"/>
                </el-form-item>
                <el-button @click="handleQuery()" type="success" plain >查询</el-button>
                </el-form>           
                
                <!--学生数据展示-->
                <el-table v-loading="false" :data="tableData"  max-height="800" border style="width: 100%;margin-bottom: 20px;">
                <el-table-column  prop="account" label="研究生账号" width="120" />
                <el-table-column prop="name" label="姓名" width="120" />
                <el-table-column prop="teacherName" label="导师姓名" width="120" />
                <el-table-column prop="sex" label="性别" width="80" />
                <el-table-column prop="className" label="班级" width="120" />
                <el-table-column prop="dept" label="学院" width="120" />
                <el-table-column prop="major" label="专业" width="160" />
                <el-table-column  prop="phone" label="手机号" width="120"/>
                <el-table-column  prop="email" label="邮箱" width="120"/>
                <el-table-column  prop="year" label="年度" width="120"/>
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
      const tutor_research=ref("人工智能")
      const tutor_quota=ref(100);
      const tutor_selected=ref(20);
      const tutor_last=ref(80);
        const tableData = ref([
        {
        id: 1,
        account: "22101020399",
        name: "张三",
        sex: "男",
        className: "计19-1",
        dept: "机材学院",
        major: "计算机科学与技术",
        phone: "15513065033",
        email: "3333@qq.com",
        year: 2022,
        teacherName:"未匹配老师"
      },
      {
        id: 2,
        account: "22101020409",
        name: "李四",
        sex: "男",
        className: "计19-1",
        dept: "信息学院",
        major: "计算机科学与技术",
        phone: "13312341234",
        email: "13812341234@163.com",
        year: 2022,
        teacherName:"未匹配老师"
      },
      {
        id: 3,
        account: "22101020409",
        name: "王五",
        sex: "男",
        className: "计19-1",
        dept: "信息学院",
        major: "计算机科学与技术",
        phone: "13312341234",
        email: "13812341234@163.com",
        year: 2022,
        teacherName:"未匹配老师"
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
          //获取导师研究方向，名额信息。
          const UUurl = "/teacher/user/getLast";
        console.log("get_data:");
        Request({
          method: 'GET',
          url: UUurl,
        }).then((response) => {
          tutor_research.value=response.data.data.research;
          tutor_quota.value=response.data.data.quota;
          tutor_selected.value=response.data.data.selected;
          tutor_last.value=response.data.data.last;
          console.log("get导师的数据:",tutor_research.value,tutor_quota.value,tutor_selected.value,tutor_last.value)
          return response;
        }).catch((error) => {
          console.log('get报错', error.message);
        });
        //获取研究生信息。
    const UUUurl = '/teacher/statistics/statisticsStudent' ; 
      console.log("get_data:");
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
          account: form.value.search_account,
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
        const UUUurl = '/teacher/statistics/statisticsStudent';
        console.log("query:");
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
          account: form.value.search_account,
          name: form.value.search_name,
          pageNum: currentPage.value,
          pageSize: pageSize.value
        }
      }).then((response) => {
        total.value = response.data.total;
        tableData.value = response.data.data.records;
        console.log("查询到的数据:",tableData.value)
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