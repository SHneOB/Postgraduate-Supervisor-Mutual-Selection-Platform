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
        <el-button :disabled="stu" @click="change_display()" type="primary" class="manage_button" plain >研究生信息管理</el-button>
        <el-button :disabled="!stu" @click="change_display()" type="primary" class="manage_button" plain>导师信息管理</el-button>
        <el-button @click="handleAdd()" type="primary" success class="manage_button"> {{ stu ? '添加研究生账户' : '添加导师账户' }}</el-button>
<!--以下是学生的信息-->
          <el-table v-if="stu" v-loading="false"  :data="tableData"  max-height="800" border style="width: 100%;margin-top: 20px;margin-bottom: 20px;">
            <el-table-column prop="account" label="账号" width="520" />
            <el-table-column prop="name" label="学生" width="520" />
            <el-table-column  fixed="right" label="操作" width="130">   
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">设置密码</el-button>
                <el-button link type="primary" size="small" @click="DeleteConfirm(scope.$index, scope.row)">删除账户</el-button>
              </template>
            </el-table-column>
          </el-table>
<!--以下是导师的信息-->
          <el-table v-if="!stu" v-loading="false"  :data="tableData"  max-height="800" border style="width: 100%;margin-top: 20px;margin-bottom: 20px;">
            <el-table-column prop="account" label="账号" width="520" />
            <el-table-column prop="name" label="导师" width="520" />
            <el-table-column fixed="right" label="操作" width="130">   
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">设置密码</el-button>
                <el-button link type="primary" size="small" @click="DeleteConfirm(scope.$index, scope.row)">删除账户</el-button>
              </template>
            </el-table-column>
          </el-table>
<el-dialog v-model="dialogVisible" :title="stu ? '编辑研究生账户' : '编辑导师账户'" width="500" :before-close="handleClose">
  <span v-if="stu">研究生</span><span v-if="!stu">导师</span>
<el-form :model="form" label-width="auto" style="max-width: 600px">
  <!--以下是学生的信息-->
  <el-form-item v-if="stu" label="账号"><el-input disabled v-model="form.account" /></el-form-item>
  <el-form-item v-if="stu" label="学生姓名"><el-input disabled v-model="form.name" /></el-form-item>
  <el-form-item v-if="stu" label="密码"><el-input v-model="form.password" /></el-form-item>
  <!--以下是导师的信息-->
  <el-form-item v-if="!stu" label="账号"><el-input disabled v-model="form.account" /></el-form-item>
  <el-form-item v-if="!stu" label="导师姓名"><el-input disabled v-model="form.name" /></el-form-item>
  <el-form-item v-if="!stu" label="密码"><el-input v-model="form.password" /></el-form-item>
</el-form>
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="EditConfirm">确认修改</el-button>
    </div>
  </template>
</el-dialog> 
      
<el-dialog v-model="Add_dialogVisible" :title="stu ? '添加研究生账户' : '添加导师账户'" width="500":before-close="handleClose">
  <span v-if="stu">研究生</span><span v-if="!stu">导师</span>
  <el-form :model="form" label-width="auto" style="max-width: 600px">
  <!--以下是学生的信息-->
  <el-form-item v-if="stu" label="账号"><el-input  v-model="form.account" /></el-form-item>
  <el-form-item v-if="stu" label="学生姓名"><el-input  v-model="form.name" /></el-form-item>
  <el-form-item v-if="stu" label="密码"><el-input v-model="form.password" /></el-form-item>
  <!--以下是导师的信息-->
  <el-form-item v-if="!stu" label="账号"><el-input  v-model="form.account" /></el-form-item>
  <el-form-item v-if="!stu" label="导师姓名"><el-input  v-model="form.name" /></el-form-item>
  <el-form-item v-if="!stu" label="密码"><el-input v-model="form.password" /></el-form-item>

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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
const total=ref(1);
const currentPage = ref(1)
const pageSize = ref(5)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
//
export default {
  setup(){
    let Add_dialogVisible=ref(false);
    let dialogVisible=ref(false);
    let stu=ref(true);//表示正在管理学生的数据
    //是否弹出对话框
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
        year: 2022
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
        year: 2022
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
        year: 2022
        }
    ]);
    const form=ref({//用来保存修改后的表单数据
      id: null,
        account: "",
        password: "",
        name: "",
        sex: "",
        title: "",
        phone: "",
        email: "",
        course: "",
        dept: "",
        office: "",
        profile: "",
        achievement: "",
        requirement: "",
        selected: "",
        last: "",
        quota: "",
        research: "",
        status: null,
        year: ""
    });
const copyOFrow=ref({});//保存修改前的表单数据
/////////////////////////////////////////以上为数据 以下为函数
//分页数据处理
const handleSizeChange = (val: number) => {
console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log("当前页:",currentPage.value)
get_data()
}
//
const get_data = () => {
  const UUUurl = stu.value ? '/admin/student/page' : '/admin/teacher/page'; // 根据stu.value的值决定URL 
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
ElMessageBox.confirm('Are you sure to close this dialog?')//处理表单cancle后 询问是否需要关闭表单
  .then(() => {
    done()
  })
  .catch(() => {
    // catch error
  })
}

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
      console.log("向后端提交的数据", form.value);
      // 把编辑后的表单传给后端
      if(stu.value===true)
      {
        const UUUurl = '/admin/student/updateAccount';
        Request({
          method: 'PUT',
          url: UUUurl,
          data: {
            id: form.value.id,
            //account: form.value.account,
            //name: form.value.name,
            password:form.value.password,
          }
        }).then(response => {
          get_data();
          return response;
        }).catch((error) => {
          get_data();
          console.log(error);
        });
      }else
      {
        const UUUurl = '/admin/teacher/updateAccount';
        Request({
          method: 'PUT',
          url: UUUurl,
          data: {
            id: form.value.id,
            //account: form.value.account,
            //name: form.value.name,
            password:form.value.password,
          }
        }).then(response => {
          get_data();
          return response;
        }).catch((error) => {
          get_data();
          console.log(error);
        });
      }
    };

    const handleAdd = () => { // 添加
      console.log("点击了添加导师");
      Add_dialogVisible.value = true;
      form.value = {
        id: null,
        account: "",
        password: "",
        name: "",
        sex: "",
        title: "",
        phone: "",
        email: "",
        course: "",
        dept: "",
        office: "",
        profile: "",
        achievement: "",
        requirement: "",
        selected: "",
        last: "",
        quota: "",
        research: "",
        status: null,
        year: ""
      };
    };

    const AddConfirm = () => { // 添加确认
      dialogVisible.value = false;
      Add_dialogVisible.value = false; // 关闭对话框
      console.log("AddConfirm");
      console.log("向后端提交的数据", form.value);
      // 把编辑后的表单传给后端
      if(stu.value===true)//如果添加的是学生
      {
        const UUUurl = '/admin/student/addAccount';
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
            //id: form.value.id,
            account: form.value.account,
            name: form.value.name,
            password:form.value.password,
        }
      }).then(response => {
        get_data();
        return response;
      }).catch((error) => {
        get_data();
        console.log(error);
      });
      }
      else//如果添加的是老师
      {
        const UUUurl = '/admin/teacher/addAccount';
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
            //id: form.value.id,
            account: form.value.account,
            name: form.value.name,
            password:form.value.password,
        }
      }).then(response => {
        get_data();
        return response;
      }).catch((error) => {
        get_data();
        console.log(error);
      });
      }
    };
    const DeleteConfirm = (index, row)=>{//删除确认
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
      //将数据发给后端:
      if(stu.value===true)//删除的是学生账户信息
      {
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
      }
      else//删除的是导师账户信息
      {
        const Delete_id = form.value.id; // 获取要删除的信息的id
      const UUUurl = '/admin/teacher/' + Delete_id;
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
      }
    };

  const change_display=()=>{//处理显示切换
  stu.value=!stu.value;
  currentPage.value=1;//每次切换显示后 当前页面都为1
  get_data();
  }
  
    onMounted(() => {
      get_data();
    });
//////////////
return{
  currentPage,
      pageSize,
      size,
      background,
      disabled,
      total,
  //
tableData,
copyOFrow,
form,
dialogVisible,
Add_dialogVisible,
stu,
get_data,
handleClose,
handleEdit,
DeleteConfirm,
handleDelete,
AddConfirm,
handleAdd,
EditConfirm,
change_display,
handleCurrentChange,
handleSizeChange,
}
},
    components: {//选项式API:vue2中注册组件的方法
        'GW-aside': aside,
        'GW-header': header,
        'GW-footer': footer
    }
}
//
</script>
<!--样式表-->
<style scoped>
@import url('../assets/Mycss.css');
</style>