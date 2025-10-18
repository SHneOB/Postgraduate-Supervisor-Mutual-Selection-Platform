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
            <el-breadcrumb-item>选择研究生</el-breadcrumb-item>
          </el-breadcrumb>          

          <div class="container"  style=" flex-direction: row;">
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
          <el-table v-loading="false"  :data="tableData" @selection-change="handleSelectChange"
          row-key="id"
           max-height="800" border style="width: 100%;margin-top: 20px;margin-bottom: 20px;">
            <el-table-column  type="selection" :reserve-selection="true" width="55" />
            <el-table-column  prop="account" label="研究生账号" width="150" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="sex" label="性别" width="60" />
            <el-table-column  prop="email" label="邮箱" width="180"/>
            <el-table-column  prop="phone" label="手机号" width="150"/>
            <el-table-column  prop="profile" label="个人简介" width="220"/>
            <el-table-column  prop="state" label="状态" width="120"/>
            <el-table-column  prop="reason" label="审批原因" width="240"/>
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
          <div class="dialogConfirm">
            <el-button @click="Agree()" type="success" >同意</el-button>
            <el-button @click="Refuse()" type="danger" >拒绝</el-button>
          </div>

        </div>
          <el-dialog
            style="display: flex; /* 启用Flexbox布局 */  
            flex-direction: column; /* 设置主轴方向为垂直方向 */  
            align-items: center; /* 在交叉轴上居中对齐子元素（这里是水平居中，因为主轴是垂直的） */  
            justify-content: center"
            v-model="Agree_Confirm_dialogVisible"
            width="400"
          >
          <h2>请输入审批理由(同意)</h2>
          <el-input type="textarea"
                    placeholder="请输入内容"
                    :rows="3"
                    maxlength="50"
                    show-word-limit
                    style="width: 100%" v-model="form.reason"/>
          <div class="dialogConfirm">
            <el-button type="primary" @click="Agree_Confirm()">确认</el-button>
            <el-button @click="Agree_Confirm_dialogVisible = false">再想想</el-button>
          </div>
        </el-dialog>

        <el-dialog
            style="display: flex; /* 启用Flexbox布局 */  
            flex-direction: column; /* 设置主轴方向为垂直方向 */  
            align-items: center; /* 在交叉轴上居中对齐子元素（这里是水平居中，因为主轴是垂直的） */  
            justify-content: center"
            v-model="Refuse_Confirm_dialogVisible"
            width="400"
          >
          <h2>请输入审批理由(拒绝)</h2>
          <el-input type="textarea"
                    placeholder="请输入内容"
                    :rows="3"
                    maxlength="50"
                    show-word-limit
                    style="width: 100%" v-model="form.reason"/>
          <div class="dialogConfirm">
            <el-button type="primary" @click="Refuse_Confirm()">确认</el-button>
            <el-button @click="Refuse_Confirm_dialogVisible = false">再想想</el-button>
          </div>
        </el-dialog>
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
      const Agree_Confirm_dialogVisible=ref(false);
      const Refuse_Confirm_dialogVisible=ref(false);
      const tutor_research=ref("")
      const tutor_quota=ref(0);
      const tutor_selected=ref(0);
      const tutor_last=ref(0);
      const tableData=ref([
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
        profile:"XX大学本科在读....",
        state:"已同意",
        year: 2022,
        reason:"符合要求,批准录取"
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
        profile:"XX大学本科在读....",
        state:"已拒绝",
        year: 2022,
        reason:"不符合要求,不予录取"
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
        profile:"XX大学本科在读....",
        state:"未处理",
        year: 2022,
        reason:""
      }
  ]);
  const selectedIds=ref([]);
      const form=ref({//用来保存修改后的表单数据
      id:null,
      reason:""
      });
      ///////////////////////////////////////////////////////
      //分页函数
      const handleSizeChange = (val: number) => {
        console.log(`${val} items per page`)
        }
        const handleCurrentChange = (val: number) => {
        console.log("当前页:",currentPage.value)
        get_data()
        }
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
        //获取研究生信息
        const UUUurl = "/teacher/confirm/getStudentVolunteer";
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
      const handleSelectChange = async(rows)=>{
        console.log("handleSelectChange:");
        //将选中的id加入selectedIds
        selectedIds.value = rows.map((row) => row.id)
        console.log(selectedIds.value)
      };
      const Agree = () => {
        console.log("Agree:");
        Agree_Confirm_dialogVisible.value = true;
      };
      const Agree_Confirm = () => {
        message.success("成功处理研究生申请！");
        Agree_Confirm_dialogVisible.value = false;
        console.log("Agree_Confirm :");
        //将收集到的id和审批理由发给后端:同意
        const UUUurl = "/teacher/confirm/acceptStudent";
        console.log("accepted confirmed:",selectedIds.value,form.value.reason);
        Request({
          method: 'POST',
          url: UUUurl,
          data: {
          ids: selectedIds.value,
          reason:form.value.reason
          }
        }).then((response) => {
          console.log("返回的数据:",response)
          return response;
        }).catch((error) => {
          console.log('Agree_Confirm报错', error.message);
        });
      };
      const Refuse = () => {
        console.log("Refuse:");
        Refuse_Confirm_dialogVisible.value = true;
      };
      const Refuse_Confirm = () => {
        Refuse_Confirm_dialogVisible.value = false;
        console.log("Refuse_Confirm :");
        //将收集到的id和审批理由发给后端: 拒绝
        const UUUurl = "/teacher/confirm/refuseStudent";
        console.log("accepted confirmed:",selectedIds.value,form.value.reason);
        Request({
          method: 'POST',
          url: UUUurl,
          data: {
          ids: selectedIds.value,
          reason:form.value.reason
        }
        }).then((response) => {
          console.log("返回的数据:",response)
          return response;
        }).catch((error) => {
          console.log('Refuse_Confirm报错', error.message);
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
      //
        ArrowRight,
        //
        Agree_Confirm_dialogVisible,
        Refuse_Confirm_dialogVisible,
        form,
        tableData,
        tutor_research,
        tutor_quota,
        tutor_selected,
        tutor_last,
        handleSelectChange,
        Agree,
        Agree_Confirm,
        Refuse,
        Refuse_Confirm
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
  <style lang="less" scoped>
  @import url('../assets/Mycss.css');
  
  /deep/.el-table__header-wrapper  .el-checkbox{
	display:none
}
  </style>