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
            <el-form @submit.native.prevent :model="form" label-width="auto" style="max-width: 300px;margin:10px;display: flex;"> 
            <el-form-item :label="displayType">
            <el-input v-model="form.search" @keyup.enter.native="get_data()" style="margin-right: 10px;"/>
            </el-form-item>
            <el-button @click="handleSearch()" type="primary" plain >查询</el-button>
            <el-button @click="" type="success" plain >导出</el-button>
            </el-form>            
            <!--数据展示-->
            <el-table v-loading="false"  :data="tableData"  max-height="800" border style="width: 100%;margin-bottom: 20px;"><el-table-column  prop="account" label="研究生账号" width="100" />
            <el-table-column prop="name" label="姓名" width="80" />
            <el-table-column prop="sex" label="性别" width="60" />
            <el-table-column prop="className" label="班级" width="60" />
            <el-table-column prop="dept" label="学院" width="100" />
            <el-table-column prop="major" label="专业" width="80" />
            <el-table-column  prop="phone" label="手机号" width="120"/>
            <el-table-column  prop="email" label="邮箱" width="120"/>
            <el-table-column  prop="year" label="年度" width="120"/>
            <el-table-column fixed="right" label="操作" width="120"> 
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handleMatch(scope.$index, scope.row)">匹配</el-button>
              </template>
            </el-table-column>
            </el-table>

            <el-dialog
              v-model="dialogVisible"
              title="编辑"
              :before-close="handleClose"
            >
            <span>为该学生分配导师:</span>
      <div class="container_unDirected">
          <el-table v-loading="false" :default-sort="{ prop: ['dept','title']}"
           :data="tableData_tutors" @selection-change="handleSelectChange"
            row-key="id" ref="multipleTableRef" 
            style="width: 100%;margin-bottom: 20px;" max-height="800" border>
            <el-table-column  type="selection" :selectable="selectable" :reserve-selection="true" width="55" />  
            <el-table-column  prop="id" label="导师编号" width="110" />
            <el-table-column  prop="name" label="导师" width="120" />
            <el-table-column prop="research" label="研究方向" width="120" />
            <el-table-column prop="title" sortable label="职称" width="120" />
            <el-table-column prop="dept" sortable label="所属学院" width="120" />
            <el-table-column prop="email" label="邮箱" width="120" />
            <el-table-column prop="phone" label="电话号码" width="120" />
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
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="dialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="matchConfirm()">确认匹配</el-button>
                </div>
              </template>
            </el-dialog> 
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
  import { ElNotification } from 'element-plus'
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
      let dialogVisible=ref(false);//是否弹出对话框
      let displayType=ref("学生姓名");//查询类型说明
      const slectedStudentId =ref(0);
      const selectedTutor = ref([]);
      const tableData_tutors = ref([
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
        phone: "13312341234",
        email: "13812341234@163.com",
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
        phone: "13312341234",
        email: "13812341234@163.com",
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
const get_data = () => {
  const UUUurl = '/admin/statistics/studentPage'; // 根据stu.value的值决定URL 
      console.log("get_data:");
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
          name: form.value.search,
          pageNum: 1,
          pageSize: 200
        }
      }).then((response) => {
        total.value = response.data.total;
        tableData.value = response.data.data.records;
        const filteredData = response.data.data.records.filter(row => row.teacherName == null);  
        tableData.value = filteredData; // 将筛选后的数据赋值给tableData.value  
        console.log("get的数据:",tableData.value)
        return response;
      }).catch((error) => {
        console.log('get报错', error.message);
      });
    };
//
      const get_Tutorsdata = () => {
      const UUUurl = '/admin/allocation/page';
      console.log("get_data:");
      Request({
        method: 'GET',
        url: UUUurl,
        params: {
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
    const handleSearch=()=>{
      const UUUurl = '/admin/statistics/studentPage'; 
      console.log("handleSearch:");
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
          name: form.value.search,
          pageNum: 1,
          pageSize: 200
        }
      }).then((response) => {
        total.value = response.data.total;
        tableData.value = response.data.data.records;
        // 筛选teacherName不为空的数据  
        const filteredData = response.data.data.records.filter(row => row.teacherName == null);  
        tableData.value = filteredData; // 将筛选后的数据赋值给tableData.value  
        console.log("search的数据:",tableData.value)
        return response;
      }).catch((error) => {
        console.log('search报错', error.message);
      });
    }
    //匹配
    const handleMatch=(index, row)=>{
      console.log("handleMatch:");
      get_Tutorsdata();
      slectedStudentId.value=row.id;
      dialogVisible.value=true;
    }
    //确认匹配
    const matchConfirm=()=>{
      console.log("handleMatch:");
      if(selectedTutor.value.length<1){
        ElNotification({
        title: '不行！！！',
        message: '最少选一个老师吧！',
        type: 'error',
        position: 'top-right',
      })
      }else{
        const UUUurl = '/admin/matchTutor/match'; // 根据stu.value的值决定URL 
      console.log("handleSearch:");
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
          studentId:slectedStudentId.value,
          teacherId:selectedTutor.value[0].id,
        }
      }).then((response) => {
        total.value = response.data.total;
        tableData.value = response.data.data.records;
        // 筛选teacherName不为空的数据  
        const filteredData = response.data.data.records.filter(row => row.teacherName == "");  
        tableData.value = filteredData; // 将筛选后的数据赋值给tableData.value  
        console.log("search的数据:",tableData.value)
        return response;
      }).catch((error) => {
        console.log('search报错', error.message);
      });
      }
    }
    const handleSelectChange = async(val: any)=>{//处理选中导师
      console.log("handleSelectChange:");
      selectedTutor.value = val.map((row) => ({  
      id: row.id,  //获取选中导师的id
      }));  
      console.log("选中条数:",selectedTutor.value.length);
      console.log("选中导师id:",selectedTutor.value[0].id);
      if(selectedTutor.value.length>=1)
      {
        ElNotification({
        title: '提示',
        message: '已达可选上限',
        type: 'warning',
        position: 'top-right',
      })
      }
      console.log(selectedTutor.value)
    };
    const selectable = (row) => {//限制选中的数量 1条
      let state=false;
      let i=0;
      for(i=0;i<selectedTutor.value.length;i++){
        if(row.id==selectedTutor.value[i].id){
          state=true;
          break;
        }
      }
      if(selectedTutor.value.length < 1 || state)return true;
      else
      {
        return false;
      }
  };
    // 处理表单取消后询问是否需要关闭表单
    const handleClose = (done: () => void) => {
      ElMessageBox.confirm('确定要关闭表单?')
          .then(() => {
            done();
          })
          .catch(() => {
            // catch error
          });
    };
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
      displayType,
      tableData,
      tableData_tutors,
      copyOFrow,
      form,
      dialogVisible,
      get_data,
      handleMatch,
      matchConfirm,
      handleSelectChange,
      selectable,
      handleClose,
      handleSearch
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
  <style lang="less" scoped>
  @import url('../assets/button.css');

  /deep/.el-table__header-wrapper  .el-checkbox{
  display:none
  }
  </style>