import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式
import './assets/css/global.css'

// 导入新依赖-树形表格
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器依赖的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme



// 导入 nprogress  js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入 axios 并挂载，用来发请求
import axios from 'axios'

// 在request 拦截器，展示进度条--NProgress.start()
// 在request 拦截器，展示进度条--NProgress.start()
//  axios的基准 URL地址
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 设置拦截器---API文档：需要授权的 API (只有登录页面不需要授权)，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
axios.interceptors.request.use(config => {
    // 展示进度条
    NProgress.start();
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})

// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
    // 隐藏进度条
    // 隐藏进度条
    NProgress.done()
    return config
})

//之后使用this.$http.post/get 就是使用 axios 请求
Vue.prototype.$http = axios





// 挂载新依赖-树形表格
Vue.component('tree-table', TreeTable)

// 全局挂载富文本编辑器组件
Vue.use(VueQuillEditor)






// 全局定义一个过滤器
// 全局定义一个过滤器
// 参数一:过滤器名字，参数二：过滤器处理函数
Vue.filter('dateFormat', function(originValue) {
    const date = new Date(originValue);

    // 获取年月日 时分秒
    const y = date.getFullYear();
    // 月份从0开始算的->加 1，使用字符串方法 给月份补 0,长度不足2 就补0
    const m = (date.getMonth() + 1 + '').padStart(2, '0');
    const d = (date.getDay() + '').padStart(2, '0');

    const hh = (date.getHours() + '').padStart(2, '0');
    const mm = (date.getMinutes() + '').padStart(2, '0');
    const ss = (date.getSeconds() + '').padStart(2, '0');

    // 返回最终结果--> 标准的时间显示：俩种方式
    // return `yyyy-mm-dd hh:mm:ss`
    return `${y}-${m}-${d} ${hh}:-${mm}:${ss}`

})


Vue.config.productionTip = false


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')