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
            <!--搜索-->
            <el-button :disabled="stu" @click="change_display()" type="primary" class="manage_button"  >查询学生</el-button>
            <el-button :disabled="!stu" @click="change_display()" type="primary" class="manage_button" >查询老师</el-button>
            <el-form @submit.native.prevent :model="form" label-width="auto" style="max-width: 300px;margin-left:10px;display: flex;"> 
            <el-form-item :label="displayType">
            <el-input v-model="form.search" @keyup.enter.native="get_data()" style="margin-right: 10px;"/>
            </el-form-item>
            <el-button @click="get_data()" type="success" plain >查询</el-button>
            <el-button @click="change_display()" type="success" plain >导出</el-button>
            </el-form>           
            <!--学生数据展示-->
            <el-table v-loading="false" v-if="stu" :data="tableData"  max-height="800" border style="width: 100%;margin-bottom: 20px;">
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
            <!--导师数据展示-->
            <el-table v-loading="false" v-if="!stu" :data="tableData"  max-height="800" border style="width: 100%;margin-bottom: 20px;">
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
      let stu=ref(true);//正在查询学生还是老师
      let displayType=ref("学生姓名");//查询类型说明
    const tableData = ref([
      {
        id: 1,
        account: "22101020399",
        name: "张三",
        sex: "男",
        className: "计19-1",
        dept: "机材学院",
        major: "计算机科学与技术",
        phone: "133xxxxxxx",
        email: "138xxxxxxx@xxx.com",
        year: 2022,
        teacherName:"张老师"
      },
      {
        id: 2,
        account: "22101020409",
        name: "李四",
        sex: "男",
        className: "计19-1",
        dept: "信息学院",
        major: "计算机科学与技术",
        phone: "133xxxxxxx",
        email: "138xxxxxxx@xxx.com",
        year: 2022,
        teacherName:"李老师"
      },
      {
        id: 3,
        account: "22101020409",
        name: "王五",
        sex: "男",
        className: "计19-1",
        dept: "信息学院",
        major: "计算机科学与技术",
        phone: "133xxxxxxx",
        email: "138xxxxxxx@xxx.com",
        year: 2022,
        teacherName:"王老师"
      }
    ]);
    const form=ref({
        search:""
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
const change_display=()=>{//处理显示切换
  stu.value=!stu.value;
  currentPage.value=1;//每次切换显示后 当前页面都为1
  if(stu.value)
  {
    displayType.value="学生姓名"
  }else
  {
    displayType.value="导师姓名"
  }
  get_data();
  }
  //
const get_data = () => {
    const UUUurl = stu.value ? '/admin/statistics/studentPage' : '/admin/statistics/teacherPage'; // 根据stu.value的值决定URL 
      console.log("get_data:");
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
          name: form.value.search,
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
        const UUUurl = stu.value ? '#查询学生 ': '#查询老师'; // 根据stu.value的值决定URL 
    }
    //页面初始
    onMounted(() => {
      get_data();
    });

    return {
      currentPage,
      pageSize,
      size,
      background,
      disabled,
      total,
      handleSizeChange,
      handleCurrentChange,
      //
      stu,
      change_display,
      displayType,
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