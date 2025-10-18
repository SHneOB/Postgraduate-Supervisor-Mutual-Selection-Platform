<template>
<el-footer>
    <el-divider />
    <el-row :gutter="50" class="footer"><!--布局:一个row 内 4个col 每个col里面一个tr-->

    <el-col :span="6" class="gutter-row">

        <div class="gutter-box logo-area">

        <router-link to="/test">

            <img 
            class="logo" 
            :src="logoSrc"
            alt="nav-logo"
            @mouseover="logoChange(true)"
            @mouseleave="logoChange(false)"
            />
        </router-link>  

        </div>

    </el-col>

    <el-col :span="6" class="link-area">

        <tr class="gutter-box link-area">
        <td class="title">站点</td> 

        <td>

            <router-link to="/home">首页</router-link>

        </td>

        <td>

            <router-link to="/home">关于我们</router-link>  

        </td>
        </tr>

    </el-col>

    <el-col :span="6">
    <tr class="gutter-row link-area">

        <td class="title">链接</td>

        <td>

            <a href="https://yz.chsi.com.cn/" target="_blank">中国研究生招生信息网</a>

        </td> 

        <td>

            <a href="https://www.ncut.edu.cn" target="_blank">北方工业大学</a>

        </td>

    </tr>
    </el-col>

    <el-col :span="6">
    <tr class="gutter-row link-area">
        
        <td class="title">联系我们</td>

        <td>

            <a href="mailto:2052504525@qq.com">Email</a>

        </td>
    </tr>
    </el-col>

    </el-row>

    <div class="copyright">
    <router-link to="/home">服务条款</router-link>
    <el-divider direction="vertical" />
    <router-link to="/home">隐私政策</router-link>
    <el-divider direction="vertical" />
    <a href="https://beian.miit.gov.cn/" target="_blank">京ICPxxxxxx备号xx</a>
    <br>
    Built with<a href="https://vuejs.org/" target="_blank">Vue</a>. Colored with <a href="https://element.eleme.cn" target="_blank">Element UI</a>.
    <br>
    Copyright © 2024 XXXXXXX All rights reserved.
    </div>

</el-footer>
</template>




<script lang="ts" setup>
import { ref } from 'vue';
//忽略导入文件类型检查:
// @ts-ignore
import defaultSrc from '../assets/images/kaoyan2.png';

// @ts-ignore 
import hoverSrc from '../assets/images/kaoyan1.png';

const logoSrc = ref(defaultSrc);
function logoChange(ishover: boolean) {
    logoSrc.value = ishover ? hoverSrc : defaultSrc;
}//hover作用

</script>

<style scoped>

a{
    text-decoration: none;
}
.footer {
    padding: 24px 0;
    height: 300px;
}
.router-link-active {
  text-decoration: none;
}
.link-area{
    line-height: 40px; 
    text-decoration: none;
    display: flex;
    flex-direction: column;
}
.link-area .title{
    font-size: var(--el-font-size-extra-large);
}
.logo-area {
    text-align: center;
}

.logo-area .logo {
    width: 80%;
    height: auto;
}

.slogan {
    font-size: 1rem;
    font-weight: 400;
}

.link-area a {
    color: black;
}

.link-area a:hover {
    color: #628ae8;
}

.copyright {
    text-align: center;
}
</style>