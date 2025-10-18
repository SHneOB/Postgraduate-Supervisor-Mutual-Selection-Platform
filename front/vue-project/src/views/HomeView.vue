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
        <!--轮播图-->
        <el-carousel :interval="4000" type="card" height="300px" arrow="always">
          <el-carousel-item v-for="item in photos" :key="item">
            <el-image :src=" item.url " style="height: 600px;width: 100%;"></el-image>
          </el-carousel-item>
        </el-carousel>
        <!--通知消息-->
        <el-card class="announcement-board">
          <template #header>
            <span>通知栏</span>
          </template>
          <el-empty v-if="NoteData.length===0" description="暂无新消息" />
          <el-timeline>
            <el-timeline-item
              v-for="item in NoteData"
              :key="item.id"
              :timestamp="item.date"
              placement="top"
            >
              <el-card>
                <h4>{{ item.title }}</h4>
                <p>{{ item.content }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
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
  function getAssetsImages(name) {
      return new URL(`../assets/images/${name}`, import.meta.url).href;
  }
const image1=  getAssetsImages('slide_verify_picture/toki.jpg');
const image2=  getAssetsImages('slide_verify_picture/toki2.jpg');
const image3=  getAssetsImages('slide_verify_picture/toki3.jpg');
const image4=  getAssetsImages('slide_verify_picture/toki4.jpg');
const photos=ref([
      {
	        url:image1
	    },
	    {
	        url:image2
	    },
	    {
	        url:image3
	    },
	    {
	        url:image4
	    }  
]);
const NoteData = ref([
  //{ id: 1, date: '2024-05-15', title: '标题 1', content: '这里是内容 1...' },
  //{ id: 2, date: '2024-05-14', title: '标题 2', content: '这里是内容 2...' },
  // 更多公告...
]);
//分页栏所需的变量
const currentPage = ref(1)
const pageSize = ref(5)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
const total=ref(1);
//
export default {    
    components: {//选项式API:vue2中注册组件的方法
        'GW-aside': aside,
        'GW-header': header,
        'GW-footer': footer
    },
    setup(){
      onMounted(() => {
      console.log(NoteData.value)
      });
      //分页
      const handleSizeChange = (val: number) => {
      console.log(`${val} items per page`)
      }
      const handleCurrentChange = (val: number) => {
        console.log("当前页:",currentPage.value)
      get_data()
      }
      //获取NoteData
      const get_data = () => {
      const UUUurl = '#'; // 访问端口的地址
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
          NoteData.value = response.data.data.records;
          console.log("get的数据:",NoteData.value)
          return response;
        }).catch((error) => {
          console.log('get报错', error.message);
        });
      };
      //返回 暴露给模板
      return{
        //分页数据
        currentPage,
        pageSize,
        size,
        background,
        disabled,
        total,
        handleSizeChange,
        handleCurrentChange,
        //
        NoteData,//消息栏数据
        photos
      }
    }
}
//
</script>
<!--样式表-->
<style scoped>
 @import url('../assets/Mycss.css');
.el-carousel{
  margin: 30px;
}


.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>