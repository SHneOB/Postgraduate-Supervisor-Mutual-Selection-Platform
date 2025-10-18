<template>
    <h1>axios_test.vue</h1>
    <table>
        <tbody>
            <tr v-for="index in OBJS">
                <td>{{ index.author }}</td>
            </tr>
        </tbody>
    </table>
    <button v-on:click="handler">生成杨国庆!</ button>
</template>

<script lang="ts">
import currentPage from '../views/allocation_manage.vue';
import Request from '../api/request';//实例名叫Request
import {ref} from 'vue';//ref 响应式实例 使得 变量变化时 渲染在页面上的变量也变化
export default {
    data()//一个选项式API
    {
        const test=ref(0);
    },
    /*
vue3中的setup()可以替代Vue 2中的data、computed、methods等选项
setup() 钩子是在组件中使用组合式 API 的入口，通常只在以下情况下使用：
需要在非单文件组件中使用组合式 API 时。
需要在基于选项式 API 的组件中集成基于组合式 API 的代码时。
*/
    setup() {

        const OBJS=ref();//指向一个对象 可以修改OBJS指向的对象 不能修改OBJS本身

        function handler(){
        console.log("post_data触发")
            Request({
                method: 'POST',
                url: '/posts',
                data: {
                    id: "3",
                    title: "json测试",
                    body: "json测试",
                    author: "杨国庆"
                }
            }).then(response => {//没有返回数据 所以会跳到error
            console.log(response.data)
            this.get_data();
            return response.data
            }, error => {
                this.get_data();
            console.log('错误', error.message)
            })  
        }

        function get_data(){
            Request.get("/posts")
            .then(response => {
                //你可以在选项式 API 中访问组合式 API 暴露的值，但反过来则不行
                //(组合式API:setup() 选项式AIP:vue2中的data() methods()等)
                console.log(response.data);
                this.OBJS = response.data;
            })
            .catch(error => {
                console.error(error);
            });  
        }
        return {// 返回值会暴露给模板和其他的选项式 API 钩子;其他的选项也可以通过组件实例(this.)来获取 setup() 暴露的属性：
            OBJS,
            handler,
            get_data
        };
    },

    mounted() {
    this.get_data();
    },
}
/*
关于export和import的tips:
1.具名导出(非默认导出)
export {
  Request,
  ...
}
import方法:
import {Request} from ...

2.默认导出(导出多个实例)
export defult{
  Request,
  ...
}
import方法:
import 任意名称(test) from ...
使用其中某个实例的方法:
test.某个实例名

3.默认导出(仅导出一个实例)
export defult Request
import方法:
import 任意名称(test) from ...
使用其中这个实例的方法:直接用 任意名称(test)
*/
</script>

<style scoped>
/*scoped是一个用于限定样式作用范围的关键字。在Vue.js中，当一个样式标签中包含了scoped属性时，这些样式只会作用于当前组件的元素，而不会影响到全局样式。*/ 
</style>
