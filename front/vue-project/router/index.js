import {createRouter, createWebHashHistory,createWebHistory} from "vue-router";
import { message } from 'ant-design-vue';
import jwt from '../jwt'
 //该路由设置貌似产生了死循环导致报错,但不影响使用
const routes = [
    {
    path: '/index',
    redirect: '/',
    },
    {
    path: '/home',
    redirect: '/',
    },
    {
      path: '/',
      name: 'Home',
        meta: {
            title: '主页',
            requireAuth: false,
          },
        component:()=>import("../src/views/HomeView.vue")
    },
    {
      path:"/login",
      meta: {
          title: '登录',
          requireAuth: false,
        },
      component:()=>import("../src/views/login.vue")
  },
    {
        path:"/UserInfo_manager",
        meta: {
            title: '管理员个人中心',
            requireAuth: true,
          },
        component:()=>import("../src/views/UserInfo_manager.vue")
    },
    {
      path:"/UserInfo_student",
      meta: {
          title: '研究生个人中心',
          requireAuth: true,
        },
      component:()=>import("../src/views/UserInfo_student.vue")
  },
  {
    path:"/UserInfo_tutor",
    meta: {
        title: '导师个人中心',
        requireAuth: true,
      },
    component:()=>import("../src/views/UserInfo_tutor.vue")
  },
  {
    path:"/Confirm_tutor",
    meta: {
        title: '导师确认页面',
        requireAuth: true,
      },
    component:()=>import("../src/views/Confirm_tutor.vue")
  },
  {
    path:"/query_tutor",
    meta: {
        title: '导师查询页面',
        requireAuth: true,
      },
    component:()=>import("../src/views/query_tutor.vue")
  },
  {
    path:"/Confirm_student",
    meta: {
        title: '研究生填报志愿页面',
        requireAuth: true,
      },
    component:()=>import("../src/views/Confirm_student.vue")
  },
  {
    path:"/query_student",
    meta: {
        title: '研究生查询页面',
        requireAuth: true,
      },
    component:()=>import("../src/views/query_student.vue")
  },
    {
      path:"/users_manage",
      meta: {
          title: '用户账号管理',
          requireAuth: false,
        },
      component:()=>import("../src/views/users_manage.vue")
    },
    {
      path:"/tutor_manage",
      meta: {
          title: '导师信息管理',
          requireAuth: false,
        },
      component:()=>import("../src/views/tutor_manage.vue")
    },
    {
      path:"/student_manage",
      meta: {
          title: '研究生信息管理',
          requireAuth: false,
        },
      component:()=>import("../src/views/student_manage.vue")
    },
    {
      path:"/allocation_manage",
      meta: {
          title: '名额分配管理',
          requireAuth: false,
        },
      component:()=>import("../src/views/allocation_manage.vue")
    },
    {
      path:"/query_manage",
      meta: {
          title: '综合查询',
          requireAuth: false,
        },
      component:()=>import("../src/views/query_manage.vue")
    },
    {
      path:"/match_manage",
      meta: {
          title: '匹配导师',
          requireAuth: false,
        },
      component:()=>import("../src/views/match_manage.vue")
    } ,
    {
      path:"/test",
      meta: {
          title: 'test',
          requireAuth: false,
        },
      component:()=>import("../src/views/test.vue")
    },
    {
      path:"/ax_test",
      meta: {
          title: 'axios_test',
          requireAuth: false,
        },
      component:()=>import("../src/views/axios_test.vue")
  }
]
 
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
          // 用户通过浏览器的“后退”按钮导航，回到之前保存的滚动位置
          return savedPosition;
        } else {
          // 用户通过页面上的链接跳转，滚动到页面顶部
          return { top: 0 };
        }
      }
});

// 路由守卫
router.beforeEach((to,from,next) => {
  
    // 设置页面标题
    let wholeTitle = to.meta.title + " | 研选网";
    document.title = wholeTitle;//添加标签
    //在设置next时 要非常严谨 否则会出现无限嵌套循环导致报错
    
    if(!(
      to.name==='Home'||to.path==='/login'
      /*
      ||to.path==='/test'
      ||to.path=='/UserInfo_manager'||to.path=='/UserInfo_student'||to.path=='/UserInfo_tutor'
      ||to.path=='/tutor_manage'||to.path=='/student_manage'||to.path=='/users_manage'||to.path=='/allocation_manage'||to.path=='/query_manage'||to.path=='/match_manage'
      ||to.path=='/Confirm_student'||to.path=='/query_student'
      ||to.path=='/Confirm_tutor'||to.path=='/query_tutor'
      */
    ))//豁免网页
    {
      if(jwt.hasToken())
      {
        console.log("jwt验证通过");
        next();//验证通过:放行
      }
      else
      {//验证不通过 跳转到登录界面使用户先登录
        console.log("jwt验证不通过");
        message.error("请先登录")
        next('/login');
      }
    }
    else//去到不需要验证的网页时直接放行
    {
      console.log("该页无需登录,放行");
      next();
    }
    

    //如果用户已经登录 则不能进入登录网页
  });

export default router