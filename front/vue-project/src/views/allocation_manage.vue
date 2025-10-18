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
            <el-table v-loading="false"  :data="tableData"  max-height="800" border style="width: 100%;margin-top: 20px;margin-bottom: 20px;">
              <el-table-column  prop="account" label="账号" width="120" />
              <el-table-column  prop="name" label="导师" width="120" />
              <el-table-column prop="research" label="研究方向" width="120" />
              <el-table-column prop="sex" label="性别" width="120" />
              <el-table-column prop="selected" label="已选名额" width="120" />
              <el-table-column prop="last" label="剩余名额" width="120" />
              <el-table-column prop="quota" label="总可带生名额" width="120" />
              <el-table-column fixed="right" label="操作" width="120"> 
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
              </el-table-column>
  </el-table>
  
  <el-dialog
    v-model="dialogVisible"
    title="编辑"
    width="500"
    :before-close="handleClose"
  >
    <span>名额分配</span>
  <el-form :model="form" label-width="auto" style="max-width: 600px"> 
    <!--导师信息-->
    <el-form-item label="姓名">  
        <el-input disabled v-model="form.name"/> 
    </el-form-item>  
    <el-form-item label="性别">  
        <el-input disabled v-model="form.sex"/> 
    </el-form-item>  
    <el-form-item label="研究方向">  
        <el-input disabled v-model="form.research"/> 
    </el-form-item> 
    <el-form-item label="已选人数">  
        <el-input disabled v-model="form.selected"/> 
    </el-form-item>
    <el-form-item label="剩余名额">  
        <el-input disabled v-model="form.last"/> 
    </el-form-item>
    <!--可编辑信息-->
    <el-form-item label="带生名额">
      <el-input v-model="form.quota" />
    </el-form-item>
  </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="EditConfirm">确认修改</el-button>
      </div>
    </template>
  </el-dialog> 
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
          id:null,//信息id
          account:"",//导师账号
          name:"",//导师名称
          sex:"",//性别
          research:"",//研究方向名称
          selected:0,//已选人数
          last:0,//剩余可选
          quota:0,//可带生数量
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

    const handleClose = (done: () => void) => {
      ElMessageBox.confirm('确定要关闭表单?') // 处理表单取消后询问是否需要关闭表单
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
      //数据处理:
      if (form.value.quota !== undefined && form.value.selected !== undefined) {  
    form.value.last = form.value.quota - form.value.selected;  //总名额修改 需要更新数据
  }  else
  {
    console.warn("数据更新失败!")
  }
      //
      // 把编辑后的表单传给后端
      console.log("向后端提交的数据", form.value);
      const UUUurl = '/admin/allocation';
      Request({
        method: 'PUT',
        url: UUUurl,
        data: {
          id: form.value.id,//信息id
          //selected:form.value.selected,//已选名额
          //last:form.value.last,//剩余名额
          quota:form.value.quota,//总可带名额
        }
      }).then(response => {
        get_data();
        return response;
      }).catch((error) => {
        get_data();
        console.log(error);
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
      handleEdit,
      EditConfirm,
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