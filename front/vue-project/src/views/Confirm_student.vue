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
          <el-breadcrumb-item>填报志愿</el-breadcrumb-item>
        </el-breadcrumb>          
        <!--进度条-->
        <div class="container">
          <el-steps style="width: 800px" :active="phase" finish-status="success" align-center>
              <el-step title="个人信息检查" description="检查并补充个人信息" :icon="Edit"/>
              <el-step title="选择导师" description="选择中意的导师" :icon="Stamp"/>
              <el-step title="选择完成" description="确认并且投递志愿" :icon="Tickets"/>
          </el-steps>
        </div>
        <!--阶段一 确认个人信息-->
      <div v-if="phase==0" class="container">
        <div style="font-family:Microsoft Yahei;font-weight: 600;font-size: 30px;margin: 20px;">检查个人信息</div>
          <el-form :model="Confirm_form" label-width="auto" style="max-width: 600px">
            <!--研究生信息-->
            <el-form-item label="研究生账号">
              <el-input disabled v-model="Confirm_form.account"/>
            </el-form-item>
            <el-form-item  label="姓名">
              <el-input disabled v-model="Confirm_form.name"/>
            </el-form-item>
            <el-form-item label="性别">
              <el-input disabled v-model="Confirm_form.sex"/>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input
              disabled
              placeholder="11位手机号"
              maxlength="11"
              v-model="Confirm_form.phone" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input disabled v-model="Confirm_form.email" />
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input disabled type="textarea"
                  placeholder="请输入内容"
                  :rows="5"
                  maxlength="300"
                  style="width: 100%" v-model="Confirm_form.profile"/>
            </el-form-item>
          </el-form>
          <el-button @click="phase=1;get_data()" type="primary" style="margin: 50px;">下一步</el-button>
      </div>
      <!--阶段二 选择导师-->
        <div v-if="phase==1" class="container_unDirected"><!--隐藏该块用v-show 否则bug?-->
          <!--<el-switch
              v-model="filted"
              @click="filter()"
              class="mb-2"
              active-text="不看满员导师"
          />-->
          <el-table v-loading="false" :default-sort="{ prop: ['dept','title']}"
           :data="tableData" @selection-change="handleSelectChange"
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
          <el-button @click="phase=0"  style="margin: 50px;">上一步</el-button>
          <el-button @click="CreatVolunteerForm()" type="primary" style="margin: 50px;">下一步</el-button>
      </div>
      <!--阶段三 确认志愿信息-->
      <div v-if="phase==2" class="container" style="font-family: KaiTi;font-weight: 600">
        <el-watermark :font="watermark_font" :content="[Confirm_form.name, Confirm_form.account]" class="volunteerForm">
          <div style="font-size: 30px;margin: 20px;">志愿结果</div>
          <div style="margin: 20px;width: 90%;">
            <div>----第一志愿----</div>
            <el-form  label-width="auto" style="max-width: 600px">
              <el-form-item  label="导师编号"><el-input disabled v-model="volunteerShow[0].id" /></el-form-item>
              <el-form-item  label="导师"><el-input disabled v-model="volunteerShow[0].name" /></el-form-item>
              <el-form-item  label="研究方向"><el-input disabled v-model="volunteerShow[0].research" /></el-form-item>
            </el-form>
          </div>
          <div style="margin: 20px;width: 90%;">
            <div>----第二志愿----</div>
            <el-form label-width="auto" style="max-width: 600px">
              <el-form-item  label="导师编号"><el-input disabled v-model="volunteerShow[1].id" /></el-form-item>
              <el-form-item  label="导师"><el-input disabled v-model="volunteerShow[1].name" /></el-form-item>
              <el-form-item  label="研究方向"><el-input disabled v-model="volunteerShow[1].research" /></el-form-item>
            </el-form>
          </div>
          <div style="margin: 20px;width: 90%;">
            <div>----第三志愿----</div>
            <el-form  label-width="auto" style="max-width: 600px">
              <el-form-item  label="导师编号"><el-input disabled v-model="volunteerShow[2].id" /></el-form-item>
              <el-form-item  label="导师"><el-input disabled v-model="volunteerShow[2].name" /></el-form-item>
              <el-form-item  label="研究方向"><el-input disabled v-model="volunteerShow[2].research" /></el-form-item>
            </el-form>
          </div>      
        </el-watermark>
          <div>
            <el-button @click="phase=1;volunteerData=[]"  style="margin: 30px;">上一步</el-button>
            <el-button @click="SubmitConfirm" type="primary" style="margin: 30px;">确认投递志愿</el-button>
          </div>
      </div>
      <!--阶段四 完成志愿投递 可以返回主页-->
      <div v-if="phase==3" class="container">
          <el-result
          icon="success"
          title="志愿已投递"
          sub-title="可返回首页"
          ></el-result>
          <el-button @click="this.$router.push('/home')" type="primary">回到首页</el-button>
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
import{onMounted, reactive, ref,watch} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Action } from 'element-plus';
import { message } from 'ant-design-vue';
import Request from '@/api/request';
import jwt from '../../jwt';
import type { ComponentSize } from 'element-plus'
import { ElNotification } from 'element-plus'
import {ArrowRight,Edit, Tickets,Stamp } from '@element-plus/icons'
import type { ElTable } from 'element-plus'
//水印
const watermark_font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})
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
    const maxselection=3;
    const Agree_Confirm_dialogVisible=ref(false);
    const phase=ref(0);//当前阶段
    const filted=ref(false);
    const Confirm_form=ref({//确认当前个人信息
      id:1,//int
      account:"22101020327",
      sex:"男",
      profile:"北方工业大学在读本科生",
      phone:"123456879",
      email:"456123@qq.com",
      password: "",
      name: "张无三",
    });
    //导师信息
    const tableData=ref([
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
    const selectedData=ref([]);//选中导师的信息
    const volunteerData=ref([]);//志愿信息
    const volunteerShow=ref([//用于展示志愿数据(初始为空)
      {
        id:"",
        name:"",
        research:"",
      },
      {
        id:"",
        name:"",
        research:"",
      },
      {
        id:"",
        name:"",
        research:"",
      }
    ]);
    //////////////////////////////////////////////////////////
    //分页函数
      const handleSizeChange = (val: number) => {
      console.log(`${val} items per page`)
      }
      const handleCurrentChange = (val: number) => {
      console.log("当前页:",currentPage.value)
      get_data()
      }
      const get_Userdata = async() => {//获取个人信息
      const UUUurl = "/student/user/personalInfo";
      console.log("get_Userdata:");
      Request({
        method: 'GET',
        url: UUUurl,
      }).then((response) => {
        Confirm_form.value = response.data.data;
        console.log("get_Userdata的数据:",Confirm_form.value)
        return response;
      }).catch((error) => {
        console.log('get_Userdata报错', error.message);
      });
      };      
    const get_data = async() => {//获取导师信息
      const UUUurl = "/student/teacherInfo/getTeacher";
      console.log("获取导师信息:");
      Request({
          method: 'POST',
          url: UUUurl,
          data: {
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
    
    const get_data_filted = async() => {
      const UUUurl = "#";
      console.log("get_data_filted:");
    };
    //
  const handleSelectChange = async(val: any)=>{//处理选中导师
      console.log("handleSelectChange:");
      selectedData.value = val.map((row) => ({  
      id: row.id,  
      name: row.name,  
      research: row.research,  
      }));  
      console.log("选中条数:",selectedData.value.length);
      if(selectedData.value.length>=maxselection)
      Notifacation();
      console.log(selectedData.value)
    };
    const Notifacation = () => {//上限提示
      ElNotification({
        title: '提示',
        message: '选择的导师数量已达上限',
        type: 'warning',
      })
    }
    const selectable = (row) => {//限制选中的数量
      let state=false;
      let i=0;
      for(i=0;i<selectedData.value.length;i++){
        if(row.id==selectedData.value[i].id){
          state=true;
          break;
        }
      }
      if(selectedData.value.length < maxselection || state)return true;
      else
      {
        return false;
      }
  };
  const CreatVolunteerForm=()=>{//创建志愿表单
    console.log("CreatVolunteerForm:")
    let i=0;
    //展示数据置空
    for(i=0;i<3;i++)
      {
        volunteerShow.value[i]={
          id:null,
          name:"",
          research:"",
        };
      }
    selectedData.value.forEach((item) => {  
      volunteerData.value.push({  
        id: item.id,  
        name: item.name,  
        research: item.research,  
      });
      
      //获取展示数据
      for(i=0;i<volunteerData.value.length;i++)
      {
        volunteerShow.value[i]=volunteerData.value[i];
      }
    });
    console.log(volunteerData.value)
    if(volunteerData.value.length<1)//如果没有选择导师 不让通过 跳出提示
    {
      ElNotification({
        title: '不行！！！',
        message: '至少选择一个导师！！！',
        type: 'error',
        position: 'top-right',
      })
      ElNotification({
        title: '不行！！！',
        message: '至少选择一个导师！！！',
        type: 'error',
        position: 'bottom-right',
      })
      ElNotification({
        title: '不行！！！',
        message: '至少选择一个导师！！！',
        type: 'error',
        position: 'bottom-left',
      })
      ElNotification({
        title: '不行！！！',
        message: '至少选择一个导师！！！',
        type: 'error',
        position: 'top-left',
      })
    }else
    phase.value=2;//跳转到检查志愿阶段
  }
  const SubmitConfirm = async() => {//确认是否提交志愿
  ElMessageBox.confirm(
  '确实要提交志愿?',
  'Warning',
  {
    confirmButtonText: '确认',
    cancelButtonText: '不要',
    type: 'warning',
  }
)
  .then(() => {
    SubmitVolunteerForm();//确认提交
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '取消提交',
    })
  })
}
  const SubmitVolunteerForm=async()=>{//提交志愿表单
    console.log("SubmitVolunteerForm:")
    const UUUurl = "/student/volunteer/submitVolunteer";
    const submitData=ref([]);
    let i=0;
    selectedData.value.forEach((item) => {//获取选中导师的id
      submitData.value[i]=item.id;
      i++;
    });
    console.log(submitData.value)
      Request({
          method: 'POST',
          url: UUUurl,
          data: {
          teacherIds: submitData.value,
          }
        }).then((response) => {
          total.value = response.data.total;
          tableData.value = response.data.data;
          console.log("get的数据:",tableData.value)
          message.success("提交成功");//错误提示
          phase.value=3;//跳转到完成投递界面
          return response;
        }).catch((error) => {
          message.error("投递失败,请重试");//错误提示
          console.log('get报错', error.message);
        });
  }
    //同意后的处理
    const Agree = () => {
      console.log("Agree:");
      Agree_Confirm_dialogVisible.value = true;
    };
    const Agree_Confirm = () => {
      Agree_Confirm_dialogVisible.value = false;
      console.log("Agree_Confirm :");
      //将收集到的id和审批理由发给后端:同意
    };
    const filter = async()=>{
      console.log("过滤的数据:");
      if(filted.value==true){
          console.log("过滤的数据:");
          await get_data();
      }else
      if(filted.value==false)
      {           
          console.log("未过滤的数据:");
          await get_data_filted();
      }
    }
    /////////////////////////////////////////////////
    onMounted(() => {
      get_Userdata();
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
      watermark_font,
      ArrowRight,
      Edit,
      Tickets,
      Stamp,
      //
      phase,
      filted,
      //
      SubmitConfirm,
      SubmitVolunteerForm,
      CreatVolunteerForm,
      Agree_Confirm_dialogVisible,
      Confirm_form,
      tableData,
      volunteerData,
      volunteerShow,
      filter,
      handleSelectChange,
      selectable,
      Agree,
      Agree_Confirm,
      get_data
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