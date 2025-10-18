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
        <el-button @click="handleAdd()" type="primary" success style="padding: 10px;margin: 10px;">添加研究生信息</el-button>
          <el-table v-loading="false"  :data="tableData"  max-height="800" border style="width: 100%;margin-top: 20px;margin-bottom: 20px;">
            <el-table-column  prop="account" label="研究生账号" width="100" />
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
                <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button link type="primary" size="small" @click="DeleteConfirm(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

<el-dialog
  v-model="dialogVisible"
  title="编辑"
  width="500"
  :before-close="handleClose"
>
  <span>研究生信息-编辑</span>

<el-form :model="form" label-width="auto" style="max-width: 600px">
  <el-form-item label="研究生账号">
    <el-input v-model="form.account" />
  </el-form-item>
  <el-form-item label="姓名">
    <el-input v-model="form.name" />
  </el-form-item>
  <el-form-item label="性别">
    <el-input v-model="form.sex" />
  </el-form-item>
  <el-form-item label="班级">
    <el-input v-model="form.className" />
  </el-form-item>
  <el-form-item label="学院">
    <el-input v-model="form.dept" />
  </el-form-item>
  <el-form-item label="专业">
    <el-input v-model="form.major" />
  </el-form-item>
  <el-form-item label="手机号">
    <el-input v-model="form.phone" />
  </el-form-item>
  <el-form-item label="邮箱">
    <el-input v-model="form.email" />
  </el-form-item>
  <el-form-item label="年度">
    <el-input v-model="form.year" />
  </el-form-item>
</el-form>
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="EditConfirm">确认修改</el-button>
    </div>
  </template>
</el-dialog> 

<el-dialog
  v-model="Add_dialogVisible"
  title="添加研究生信息"
  width="500"
  :before-close="handleClose"
>
  <span>研究生信息-添加</span>

  <el-form :model="form" label-width="auto" style="max-width: 600px">
  <el-form-item label="研究生账号">
    <el-input v-model="form.account" />
  </el-form-item>
  <el-form-item label="姓名">
    <el-input v-model="form.name" />
  </el-form-item>
  <el-form-item label="性别">
    <el-input v-model="form.sex" />
  </el-form-item>
  <el-form-item label="班级">
    <el-input v-model="form.className" />
  </el-form-item>
  <el-form-item label="学院">
    <el-input v-model="form.dept" />
  </el-form-item>
  <el-form-item label="专业">
    <el-input v-model="form.major" />
  </el-form-item>
  <el-form-item label="手机号">
    <el-input v-model="form.phone" />
  </el-form-item>
  <el-form-item label="邮箱">
    <el-input v-model="form.email" />
  </el-form-item>
  <el-form-item label="年度">
    <el-input v-model="form.year" />
  </el-form-item>
</el-form>
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="Add_dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="AddConfirm">Confirm</el-button>
    </div>
  </template>
</el-dialog> 

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
import axios from 'axios';
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
import { Delete } from '@element-plus/icons';

//分页栏所需的变量
const currentPage = ref(1)
const pageSize = ref(5)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
//
export default {
  setup(){
    let dialogVisible=ref(false);
    let Add_dialogVisible=ref(false);
    //是否弹出对话框
    const total=ref(1);
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
        year: 2022
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
        year: 2022
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
        year: 2022
      }
    ]);
const form=ref({
    id:null,
    account:"",
    password:"",
    name:"",
    sex:"",
    phone:"",
    email:"",
    course:"",
    dept:"",
    office:"",
    profile:"",
    className:"",
    major:"",
    achievement:"",
    requirement:"",
    research:"",
    status:null,//判断是否首次登录
    year:""//年度
});
const copyOFrow=ref({
});

/////////////////////////////////////////以上为数据 以下为函数
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
      const UUUurl = '/admin/student/page';
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

    const handleClose = (done: () => void) => {
      ElMessageBox.confirm('Are you sure to close this dialog?') // 处理表单取消后询问是否需要关闭表单
          .then(() => {
            done();
          })
          .catch(() => {
            // catch error
          });
    };

    const handleEdit = (index, row) => { // 处理编辑
      console.log("当前行数据:", row);
      form.value = JSON.parse(JSON.stringify(row)); // 把表格数据复制到表单对象上去
      copyOFrow.value = JSON.parse(JSON.stringify(row)); // 保存将要被修改的数据
      console.log("当前编辑的数据", form.value);
      dialogVisible.value = true;
    };

    const EditConfirm = () => { // 编辑确认
      dialogVisible.value = false;
      Add_dialogVisible.value = false; // 关闭对话框
      console.log("EditConfirm");
      // 把编辑后的表单传给后端
      console.log("向后端提交的数据", form.value);
      const UUUurl = '/admin/student';
      Request({
        method: 'PUT',
        url: UUUurl,
        data: {
          id: form.value.id,
          account: form.value.account,
          className: form.value.className,
          dept:form.value.dept,
          name: form.value.name,
          sex: form.value.sex,
          phone: form.value.phone,
          email: form.value.email,
          major: form.value.major,
          year: form.value.year
        }
      }).then(response => {
        get_data();
        return response;
      }).catch((error) => {
        get_data();
        console.log(error);
      });
    };

    const handleAdd = () => { // 添加
      console.log("点击了添加研究生");
      Add_dialogVisible.value = true;
      form.value = {
        id: null,
        account: "",
        password: "",
        name: "",
        className:"",
        major:"",
        sex: "",
        phone: "",
        email: "",
        course: "",
        dept: "",
        office: "",
        profile: "",
        achievement: "",
        requirement: "",
        research: "",
        status: null,
        year: ""
      };
    };

    const AddConfirm = () => { // 添加确认
      dialogVisible.value = false;
      Add_dialogVisible.value = false; // 关闭对话框
      console.log("AddConfirm");
      // 把编辑后的表单传给后端
      console.log("向后端提交的数据", form.value);
      const UUUurl = '/admin/student';
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
          //id: form.value.id,
          account: form.value.account,
          className: form.value.className,
          dept:form.value.dept,
          name: form.value.name,
          sex: form.value.sex,
          phone: form.value.phone,
          email: form.value.email,
          major: form.value.major,
          year: form.value.year
        }
      }).then(response => {
        get_data();
        return response;
      }).catch((error) => {
        get_data();
        console.log(error);
      });
    };
    const DeleteConfirm = (index, row)=>{
          ElMessageBox.confirm(
      '确实要删除?',
      'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '不要',
        type: 'warning',
      }
    )
      .then(() => {
        handleDelete(index, row);//确认提交
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消提交',
        })
      })    
    };
    const handleDelete = (index, row) => { // 删除
      console.log("handleDelete");
      form.value = JSON.parse(JSON.stringify(row)); // 把表格数据复制到表单对象上去
      const Delete_id = form.value.id; // 获取要删除的信息的id
      const UUUurl = '/admin/student/' + Delete_id;
      Request({
        method: 'delete',
        url: UUUurl,
      }).then(response => {
        console.log(response);
        get_data();
        return response;
      }).catch((error) => {
        get_data();
        console.error(error);
      });
    };

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
      tableData,
      copyOFrow,
      form,
      dialogVisible,
      Add_dialogVisible,
      get_data,
      handleClose,
      handleAdd,
      handleEdit,
      DeleteConfirm,
      handleDelete,
      AddConfirm,
      EditConfirm,
    };
  },
  components: {
    'GW-aside': aside,
    'GW-header': header,
    'GW-footer': footer
  }
};
//
  /*学生信息字段
  id: 1,//int
      account:"账号",
      password: "密码",
      name: "姓名",
      sex: "性别",
      GPA:"绩点",
      className: "班级",
      dept: "学院",
      major: "专业",
      phone: "手机号",
      email: "邮箱",
      prifile:"个人简介",
      specialty:"专业特长",
      requirement:"导师要求",
      teacher_id:1,//int
      status:"",//是否首次登录,varchar
      year: "年度",
*/
</script>
<!--样式表-->
<style scoped>
  @import url('../assets/Mycss.css');
</style>
