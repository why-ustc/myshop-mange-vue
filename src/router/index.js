import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'

// 路由懒加载
// let Login = () =>
//     import ( /* webpackChunkName: "group-foo" */ '../components/Login.vue')

import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/User/user.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Cates from '../components/goods/cates.vue'
import Goods from '../components/goods/goods.vue'
import Params from '../components/goods/params.vue'
import Adds from '../components/goods/adds.vue'
import Order from '../components/Order/orders.vue'
import Report from '../components/reports.vue'


Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Cates },
                { path: '/goods', component: Goods },
                { path: `/goods/adds`, component: Adds },
                { path: '/params', component: Params },
                { path: '/orders', component: Order },
                { path: '/reports', component: Report },




            ]

        }
    ]
});




//**** 总结就是：没有登录 不能进入其他页面，没登录就强制进入登录页面。登录之后也就有了 token->允许进入下个想去的页面  */

//2：针对整个路由规则，挂载路由导航守卫控制访问权限：对应登录组件 3.3----如果用户没有登录，但是直接通过URL访问特定页面，需要重新导航到登录页面。
router.beforeEach((to, from, next) => {
    //2.1: to 将要访问路径，from 从哪个路径过来, next 想去哪个路径
    //     next()--表示放行；next('/login')--强制跳转 。
    //     对路径进行判断

    //登录页没有权限，直接放行
    if (to.path === '/login') return next();

    //如果不是登录页，就获取token,如果有token,即已经登录，就放行下个页面
    const tokenstr = window.sessionStorage.getItem('token');

    // 如果 tokenstr 为空，即未登录，强制跳转
    if (!tokenstr) return next('/login')

    // 否则，放行
    next();

})




export default router