
<template>
    <div>

        <!-- 面包屑导入 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片区域 -->
        <el-card>

            <!-- 搜索框 + 添加商品框 -->
            <el-row :gutter="20">
                <el-col :span='8'>
                    <!-- 搜索框区域 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='clearSearch'>
                        <el-button slot="append" icon="el-icon-search" @click='searchGoods()'></el-button>
                    </el-input>
                </el-col>

                <el-col :span='4'>
                    <!-- 按钮区域 -->
                    <el-button type="primary" @click='addGoods()'>添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 表格展示区域 -->
            <el-table :data="goodsDataList" border stripe style="width: 100%">

                <!-- 索引列 -->
                <el-table-column type='index' label="#" >
                </el-table-column>

                <!-- 商品名称列 -->
                <el-table-column prop="goods_name" label="商品名称" >
                </el-table-column>

                <!-- 商品价格列 -->
                <el-table-column prop="goods_price" label="商品价格" width="95">
                </el-table-column>

                <!-- 商品重量列 -->
                <el-table-column prop="goods_weight" label="商品重量" width="90">
                </el-table-column>

                <!-- 创建时间列 -->
                <el-table-column  label="创建时间" width="170">
                    <!-- 使用全局过滤器--作用域插槽 -->
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>

                <!-- 操作列 -->
                <el-table-column label="操作" width="140">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <!-- 编辑操作 -->
                        <el-button type="primary" icon="el-icon-edit"
                            size='mini' @click="editGoods(scope.row)"></el-button>

                        <!-- 删除操作 -->
                        <el-button type="danger" icon="el-icon-delete"
                            size='mini' @click="deleteGoods(scope.row)"></el-button>
                    </template>
                </el-table-column>


            </el-table>


            <!-- 分页功能区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5,10,15,20]"
                :page-size="queryInfo.pagesize" :total="total"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>



        </el-card>


        <!-- 点击编辑按钮  弹出框 -->
        <el-dialog title="编辑商品信息" :visible.sync="editDialogVisible" width="50%"
            @close='dialogClose'>
           
           <el-form :model="goodsForm" :rules="goodsRules" 
            ref="goodsRef" >

                <el-form-item label="商品名称" prop="goods_name" label-width='80px'>
                  <el-input v-model="goodsForm.goods_name"></el-input>
                </el-form-item>

                <el-form-item label="商品价格" prop="goods_price" label-width='80px'>
                  <el-input v-model="goodsForm.goods_price"></el-input>
                </el-form-item>

                <el-form-item label="商品重量" prop="goods_weight" label-width='80px'>
                  <el-input v-model="goodsForm.goods_weight"></el-input>
                </el-form-item>

                <el-form-item label="创建时间" prop="add_time" label-width='80px'>
                  <el-input v-model="goodsForm.add_time"></el-input>
                </el-form-item>


           </el-form>
  
            <span slot="footer" class="dialog-footer">
                <!-- 确认与取消按钮 -->
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editFormSubmit">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>   
       
    

<script>
export default {

    //生命周期函数
    created(){
        this.getGoodsList();
    }, 


    data(){
        return {

            // 商品数据列表
            goodsDataList:[],

            // 查询参数
            queryInfo:{
                // 查询参数--绑定到搜索框中
                query:'',
                // 当前页数
                pagenum:1,
                // 每页展示 条数
                pagesize:10,
            },

            // 数据总条数
            total:0,

            // 编辑商品弹出框是否可见
            editDialogVisible:false,

            // 编辑的商品 商品信息
            goodsForm:'',

            // 编辑商品验证规则
            goodsRules:{
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 30 个字符', trigger: 'blur' } 
                ],

                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                    { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' } 
                ],

                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                    { min: 1, max: 4, message: '长度在 1 到 4 个字符', trigger: 'blur' } 
                ],

                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                    { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' } 
                ],
            },

            // 要编辑的商品 ID
            




        }
    },

    methods:{
        // 获取商品数据列表
        async getGoodsList(){
            const { data:res } = await this.$http.get(`goods`,
                    { params:this.queryInfo })
            if(res.meta.status!==200){
                return this.$message.error('获取商品数据失败');
            }
            // 如果获取成功
            this.goodsDataList = res.data.goods;
            this.total = res.data.total;
            // console.log(res);
        },

        // 分页功能区 每页展示数据量 改变时触发的函数
        handleSizeChange(newsize){
            this.queryInfo.pagesize =  newsize;
            this.getGoodsList();
        },

        // 分页功能区 当前页数 改变时触发的函数
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getGoodsList();
        },

        // 点击搜索框 进行搜索时 触发的函数
        searchGoods(){
            this.getGoodsList();
        },

        // 清空搜索框 应该重新渲染整个页面
        clearSearch(){
            this.getGoodsList();
        },

        // 点击添加商品按钮 时触发函数
        addGoods(){
            // 强制进入添加商品页面
            this.$router.push(`/goods/adds`)
        },

        // 删除商品
        async deleteGoods(goodsInfo){
            // 先询问是否确认删除
            const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            console.log(result);

            if(result === 'cancel'){
                return this.$message.info('您已取消删除操作')
            }
            // 如果确认删除
            const  { data:res } = await this.$http.delete(`goods/${goodsInfo.goods_id}`)
            if(res.meta.status!==200){
                return this.$message.error('删除商品失败')
            }

            this.getGoodsList();

            // console.log(goodsInfo);
        },

        // 编辑商品
        editGoods(goodsInfo){
            // 将商品信息赋值给 data
            this.goodsForm = goodsInfo;
            console.log(goodsInfo);

            this.editDialogVisible = true;
        },

        // 监听 dialog 关闭事件
        dialogClose(){
            this.$refs.goodsRef.resetFields();
        },

        // 编辑参数的提交事件
        async editFormSubmit(){
            const { data:res } = await this.$http.put(`goods/${this.goodsForm.goods_id}`,{ 
               goods_name:this.goodsForm.goods_name,
               goods_price:this.goodsForm.goods_price,
               goods_number:this.goodsForm.goods_number,
               goods_weight:this.goodsForm.goods_weight,
               goods_introduce:'abc',
               pics:[],
               attrs:[],  
            })
            console.log(res);
            
            if(res.meta.status!==200){
                return this.$message.error('编辑商品失败')
            }
            // 如果编辑商品成功
            this.editDialogVisible = false;
            this.$message.success('编辑商品成功');
            this.getGoodsList();
        }
    }
}
</script>


<style lang="less" scoped>
    .search {
        width: 400px;
        margin-right: 20px;
    }

    .el-breadcrumb {
        margin-bottom: 20px;
        font-size: 13px;
    }

    .el-table {
        margin-top: 20px;
        margin-bottom: 20px;
    }
</style>