<template>
    <div>
        
        <!-- 其标签就是其类名 -->
        <el-container class="el-container">

                <!-- 头部区域 -->
                <el-header>
                    <!-- 左边图像区域 -->
                    <div>
                        <img src="../assets/heima.png" alt="">
                  
                        <span>电商后台管理系统</span>

                        <el-button type="info"  class="back" @click="goback()">退出</el-button>
                    </div>
                </el-header>
        

                <el-container>
                <!-- 左 侧边栏区域开始 -->
                <el-aside width="200px">

                    <!-- 侧边栏的折叠按钮 -->
                    <div class="fold" @click="fold()">
                        | | |
                    </div>
                    
                    <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" 
                        :unique-opened='true'  :collapse="isCollapse" :default-active="activePath"
                        :collapse-transition="false" :router="true">
                            <!-- 一级菜单 -->
                        <el-submenu :index='item.id+" "' v-for="item in menuList" :key="item.id">

                            <!-- 一级菜单模板 -->
                            <template slot="title">
                                <!-- 一级菜单图标 -->
                                <i class="el-icon-location"></i>
                                <!-- 一级菜单文本 -->
                                <span>{{item.authName}}</span>
                            </template>

                                    <!-- 二级菜单 -->
                                <el-menu-item :index="'/'+itemSon.path+'' " v-for="itemSon in  item.children" 
                                    :key="itemSon.id" @click="saveActivePath('/'+itemSon.path+'')">
                                     <!-- 二级菜单模板 -->
                                    <template slot="title">
                                    <!-- 二级菜单图标 -->
                                    <i class="el-icon-location"></i>
                                    <!-- 二级菜单文本 -->
                                    <span>{{itemSon.authName}}</span>
                                    </template>
                                </el-menu-item>
                        </el-submenu>
                            
                    </el-menu>

                </el-aside>
                <!-- 左 侧边栏区域结束 -->



                <!-- 中间主体区域 -->
                <el-main>

                    <!-- 放一个路由占位符，因为要显示其他组件的数据 -->
                    <router-view></router-view>
                </el-main>
                
            </el-container>
        </el-container>
        
    </div>
</template>

<script>
export default {

    // 生命周期函数
    created(){
        // 一打开页面就获取 整个菜单列表
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath')
    },

    data(){
        return {
            // menuList:获取菜单列表后赋值给 此数据
            menuList:[],

            // 是否展开：
            isCollapse:false,

            // 当前激活变蓝色 的菜单
            activePath:'',
        }
        
    },

    methods:{

        // 点击退出按钮，回到登录界面
        goback(){
            this.$router.push('/login')
        },

        // 获取菜单列表函数--对应文档  1.4.2
        async getMenuList(){
            const { data:res } = await this.$http.get('menus');
            // console.log(res);

            if(res.meta.status !== 200){
                return this.$message.error('获取菜单列表失败')
            }

            // 如果获取正确， 就将菜单列表赋值给 menuList
            this.menuList = res.data;
            console.log(this.menuList);
        },

        // 折叠菜单栏
        fold(){
            this.isCollapse = !this.isCollapse;
          
        },

        saveActivePath(activePath){
            window.sessionStorage.setItem('activePath',activePath)
        }

        
    }
}
</script>



<style lang="less" scoped>

    .el-container {
        width: 100%;
        height: 100%;
    }
    
    .el-header {
        background-color: #373d41;

        img {
            position: absolute;
            left: 0;
        }

        span {
            position: absolute;
            margin-left: 50px;
            top: 20px;
            font-size: 19px;
            color: #fff;
        }

        .back {
            position: absolute;
            right:10px;
            top: 10px;
        }
    }

    .el-aside {
        background-color:#333744; 
        height: 660px;

        .aside_menu {
           
            border-right: 0;
        }

        .text {
            color: #fff;
            
        }

        .fold {
            background-color:  #4A5064;
            text-align: center;
            font-size: 10px;
            line-height: 24px;
            color: #fff;
            cursor:pointer;
        }
    }

    .el-main {
        background-color: #EAEDF1;
    }

    .el-menu {
        border-right: 0;
    }



    
</style>