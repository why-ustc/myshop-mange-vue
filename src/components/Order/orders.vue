<template>
    <div>
        
        <!-- 面包屑导入 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片区域 -->
        <el-card>


            <!-- 输入框搜索区域 -->
            <el-row>
                <el-col :span='8'>
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable
                        @clear='searchEnd()'>
                        <el-button slot="append" icon="el-icon-search"  
                        @click="searchBtn()"></el-button>
                    </el-input>
                </el-col>
            </el-row>


            <!-- 表格区域 -->
             <el-table :data="orderList" stripe border style="width: 100%">
                <!-- 索引列 -->
                <el-table-column type='index' label="#">
                </el-table-column>

                <!--订单编号列  -->
                <el-table-column prop="order_number" label="订单编号" >
                </el-table-column>

                <!--订单价格列  -->
                <el-table-column prop="order_price" label="订单价格"  width="120">
                </el-table-column>

                 <!--是否付款列  -->
                <el-table-column prop="pay_status" label="是否付款" width="120">
                    <template slot-scope="">
                        <el-tag type="danger">未付款</el-tag>
                    </template>
                </el-table-column>

                <!--是否发货列  -->
                <el-table-column prop="is_send" label="是否发货" width="120">
                </el-table-column>

                <!--下单时间列  -->
                <el-table-column prop="create_time" label="下单时间" >
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>

                <!--操作列  -->
                <el-table-column  label="操作"  width="150">
                    <!-- 编辑与定位 -->
                    <template slot-scope="">
                        <el-button type="primary" size='mini' icon="el-icon-edit"
                            @click='changeAdress'></el-button>
                        <el-button type="success" size='mini' icon="
                        el-icon-location" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            
             </el-table>


             <!-- 分页功能 -->
            <el-pagination @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5,10,15,20]"
                :page-size="queryInfo.pagesize"  :total="total"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>


        </el-card>


            <!-- 修改地址弹出框 -->
            <el-dialog title="修改地址" :visible.sync="changeAdressVisible"
                width="50%" @close='changeAdressClear()'>

               <!-- `省市区县` -->
                <el-form :model="adress" :rules="adressRules" ref="adressRef" label-width="100px">
                    <!-- 级联选择器选择省市区县 -->
                    <el-form-item label="省市区/县" prop="adress1" >
                        <el-cascader v-model="adress.adress1" :options="cityData"
                            ></el-cascader>
                    </el-form-item>

                    <el-form-item label="详细地址" prop="adress2">
                        <el-input v-model="adress.adress2"></el-input>
                    </el-form-item>


                </el-form>
    

                <!-- 确认与取消按钮 -->
                <span slot="footer" class="dialog-footer">
                  <el-button @click="changeAdressVisible = false">取 消</el-button>
                  <el-button type="primary" @click="changeAdressVisible = false">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 查看物流弹出框 -->
            <el-dialog title="查看物流" :visible.sync="showProgressVisible"
                width="50%">

                <!-- 使用时间线组件 -->
                <!-- <el-timeline >
                    <el-timeline-item v-for="(activity, index) in progressDataList"
                        :key="index"
                        :timestamp="activity.time">
                        {{activity.context}}
                    </el-timeline-item>
                </el-timeline> -->
                
                <!-- 确认与取消按钮 -->
                <span slot="footer" class="dialog-footer">
                  <el-button @click="showProgressVisible = false">取 消</el-button>
                  <el-button type="primary" @click="showProgressVisible = false">确 定</el-button>
                </span>
            </el-dialog>

    </div>
</template>


<script>
    // 导入外部数据
    import cityData from './citydata.js'

export default {
    // 生命周期函数
    created(){
        // 获取所有订单数据
        this.getOrdersList();
    },

    data(){
        return {
            // 所有订单列表
            orderList:[],

            // 查询订单的 参数
            queryInfo: {
                // 查询参数：用于查询框
                query:'',
                // 当前页数
                pagenum:1,
                // 每页显示条数
                pagesize:10,
            },

            // 总数据条数
            total:0,

            // 省市区县 数据
            cityData:cityData,

            // 修改地址显示框是否 显示
            changeAdressVisible: false,

            // 地址
            adress :{
                adress1:[],
                adress2:'',
            },

            // 地址的验证规则
            adressRules:{
                adress1:[
                    { required: true, message: '请输入省市区/县', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],

                adress2:[
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
            },


            // 查看物流弹出框是否显示
            showProgressVisible:false,

            
            


        }
    },

    methods:{
        // 获取所有订单列表
        async getOrdersList(){
            const { data:res } = await this.$http.get(`orders`,
                { params:this.queryInfo })
            if(res.meta.status!==200) return this.$message.console.error('获取订单失败');
            
            // 如果获取订单成功
            this.total = res.data.total;
            this.orderList = res.data.goods; 
        },

        // 分页功能中 每页展示条数 改变时触发
        handleSizeChange(newsize){
            this.queryInfo.pagesize = newsize;
            this.getOrdersList();
        },

        // 分页功能中 当前页面 改变时触发
        handleCurrentChange(newpage){
            this.queryInfo.pagenum = newpage;
            this.getOrdersList();
        },


        // 点击搜索按钮，进行搜索
        searchBtn(){
           
            this.getOrdersList();
            console.log('我点击了搜索框');
        },

        // 搜索框清空时，要重新渲染所有数据
        searchEnd(){
            this.getOrdersList();
        },

        // 点击修改地址按钮
        changeAdress(){
            this.changeAdressVisible = true;
        },

        // 清空修改地址显示框
        changeAdressClear(){
            this.$refs.adressRef.resetFields();
        },


        // 查询物流情况按钮 点击后触发
        // 出问题了，可能是接口有问题
         showProgressBox(){

            // const { data:res } =  this.$http.get('/kuaidi/1106975712662')
            // if(res.meta.status!==200) {
            //     return this.$message.error('获取物流信息失败')
            // }
            
            // // 如果获取成功
            // this.progressDataList = res.data;
            // console.log(res.data);
           

            this.showProgressVisible = true;
        },



        

    }
}
</script>


<style lang="less" scoped>
    .el-table {
        margin:20px 0;
    }

    .el-cascader {
        width: 100%;
    }

</style>