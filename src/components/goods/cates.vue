<template>
    <div>
      
        <!-- 面包屑导入 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片区域 -->
        <el-card>

            <!-- 添加分类按钮区 -->
            <el-button type="primary" class="addCatesBtn" 
                @click="addCates()">添加分类</el-button>


            <!-- 表格区域 -->
            <tree-table :data='catesList' :columns="columns"  :showIndex='true'
                :selection-type='false' border :expand-type='false'
                index-text='#'>

                <!-- 第二列-是否有效列 -->
                <template slot="isOk" slot-scope="scope">
                    <i v-if="!scope.row.cat_deleted"  class="el-icon-success"
                        style="color:lightgreen"></i>
                    <i v-else class="el-icon-warning" style="color:lightgreen"></i>
                </template>

                <!-- 第三列--排序列 -->
                <template slot="sort" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level === 1" type='success'>二级</el-tag>
                    <el-tag v-else type='warning'>三级</el-tag>
                </template>

                <!-- 第四列--操作列:  编辑 + 删除操作-->
                <template slot="operate" slot-scope="scope">
                    <el-button type="primary" size='small' @click='editCates(scope.row)'>编辑</el-button>

                    <el-button type="danger" size='small' @click="deleteCates(scope.row)">删除</el-button>

                </template>

            </tree-table>


            <!-- 分页区域 -->
            <el-pagination :current-page="queryInfo.pagenum" :page-sizes="[ 3, 5, 10,15]"
                :page-size="queryInfo.pagesize" :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handlePagenumChange">

            </el-pagination>
        
        </el-card>


        <!-- 添加分类 弹出框 -->
        <el-dialog title="添加分类" :visible.sync="addCatesVisible" @close='addCatesClose()'>
            
            <!-- 分类名称 -->
            <el-form :model="addCatesInfo" :rules="addCatesRules" ref="addCatesRef" >
                <el-form-item label="分类名称" prop="cat_name" label-width="100px">
                    <el-input v-model="addCatesInfo.cat_name"></el-input>
                </el-form-item>
            

            <!-- 级联选择框 -->
            <!-- :options:指定数据源  :props：用来指定配置对象规则  -->
                <el-form-item label='父级分类' label-width="100px"> 
                    <el-cascader v-model="catesParentsId"
                    :options="options" :props="selectSetting"
                    @change="selectCatesChange" 
                    clearable ></el-cascader>
                </el-form-item>
            </el-form>


            <!--弹出框的 底部取消与确认 按钮  -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="addCatesVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCateSubmit()">确 定</el-button>
            </div>
        </el-dialog>


        <!-- 编辑分类 弹出框 -->
        <el-dialog title="编辑分类" :visible.sync="editDilalogVisible">
            <el-form :model="editCatesForm" :rules="editCatesRules" ref="editCatesRef">

                <el-form-item label="分类名称" prop="cat_name" label-width='100px'>
                    <el-input v-model="editCatesForm.cat_name" ></el-input>
                </el-form-item>
        
            </el-form>

            <div slot="footer" >
                <el-button @click=" editDilalogVisible= false">取 消</el-button>
                <el-button type="primary" @click="editCatesSubmit()">确 定</el-button>
            </div>
        </el-dialog>


         

    </div>
</template>


<script>
export default {
    
    // 生命周期函数
    created(){
        this.getCatesList();
    },
    
    data(){
        return {

            // 商品分类数据列表
            catesList:[],

            // 查询商品列表参数
            queryInfo:{
                type:3,

                // 当前页码值
                pagenum:1,

                // 每页显示数据数
                pagesize:5,
            },

            // 商品列表总条数
            total:0,

            // 商品列表 列的 配置
            columns:[
                // 第一列：分类名称列
                {
                    // 列标题
                    label:'分类名称',
                    // 列中内容值
                    prop:"cat_name",
                },
                
                // 第二列：是否有效列
                {
                    label:'是否有效',
                    // 列类型是 template
                    type: 'template',
                    // 插槽名 是 isOk 
                    template: 'isOk',
                },

                // 第三列：排序列
                {
                    label:'排序',
                    // 列类型是 template
                    type: 'template',
                    // 插槽名 是 isOk 
                    template: 'sort',
                },

                // 第四列：操作列
                {
                    label:'操作',
                    // 列类型是 template
                    type: 'template',
                    // 插槽名 是 isOk 
                    template: 'operate',
                },

            
            ],

            // 添加分类的 显示
            addCatesVisible:false,

            // 添加分类 的信息
            addCatesInfo:{
                // 父分类 ID，先默认添加的是一级分类
                cat_pid:0,
                // 添加的分类名称
                cat_name:'',
                //添加分类的等级,先默认为0，表示一级分类
                cat_level:0,
            },

            // 添加分类的校验规则
            addCatesRules:{
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
            },


            // 级联选择器的 数据(父类名称)
            options:[],
                

            // 选中的父级分类的 id，双向绑定，必须是数组
            catesParentsId:[],

            // // 级联选择器 的配置
            selectSetting:{
                // 级联选择器触发条件
                expandTrigger:'hover',
                // 选中的 项
                value:'cat_id',
                // 级联框看到的值
                label:'cat_name',
                // 级联的 方式
                children:'children'
            },

            // 编辑分类弹出框 是否显示
            editDilalogVisible:false,

            // 编辑分类对应的数据
            editCatesForm:{
                // 分类名字
                cat_name:'',
                
            },

            // 编辑分类验证规则
            editCatesRules:{
                cat_name:[
                     { required: true, message: '请输入分类名称', trigger: 'blur' },
                     { min: 2, max:10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ]
            },

            // 编辑分类 的ID
            editCatesId:'',

            

    
        }
    },

        
    

    methods:{
        // 获取商品分类数据列表函数
        async getCatesList(){
            const { data:res } = await this.$http.get(`categories`,{ params:this.queryInfo });
            if(res.meta.status !==200){
                return this.$message.error('获取商品列表失败');
            }

            // 如果获取成功，赋值给data
            this.catesList = res.data.result;

            this.total = res.data.total;
        },

        // 分页区域 每页展示数据量改变 处理函数
        handleSizeChange(newsize){
            this.queryInfo.pagesize = newsize;

            // 重新渲染页面
            this.getCatesList();
        },

        // 分页区域 当前页面 改变  处理函数
        handlePagenumChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getCatesList();
        },


        // 点击 添加分类按钮 触发弹出框
        async addCates(){
            // 获取父类 名称并赋值给 data
            const { data:res } = await this.$http.get(`categories`,{ params:{ type:2 } })
            // 将父级分类 赋值给 data
            this.options = res.data;
            console.log(this.options);

            this.addCatesVisible = true;
        },

        // 选中 父类 选择器后
        async selectCatesChange(){
            if(this.catesParentsId.length){
                this.addCatesInfo.cat_pid = this.catesParentsId[
                    this.catesParentsId.length-1];
                this.addCatesInfo.cat_level = this.catesParentsId.length;
               
            }

            
        },
        
        // 确认提交 添加分类请求
        async addCateSubmit(){
            const { data:res } = await this.$http.post(`categories`,this.addCatesInfo)
            if(res.meta.status!==201){
                return this.$message.error('添加分类失败')
            }

            // 添加成功的话
            this.$message.success('添加分类成功');
            this.addCatesVisible = false;
            this.getCatesList();
        },

        // 添加分类对话框关闭
        addCatesClose(){
            this.$refs.addCatesRef.resetFields();

            // 清空选中的 父类数组ID
            this.catesParentsId = [];
            
            // 
            this.addCatesInfo.cat_pid = 0;
            this.addCatesInfo.cat_level = 0;
        },

        // 点击编辑分类按钮
        async editCates(editCatesInfo){
            
            //根据 ID 查询分类信息  并赋值给data
            const { data:res } = await this.$http.get(`categories/${editCatesInfo.cat_id}`)
            if(res.meta.status!==200) return this.$message.error('获取分类信息失败')
            
            this.editCatesForm.cat_name = res.data.cat_name;
            this.editCatesId = res.data.cat_id;


            this.editDilalogVisible = true;
        },

        // 编辑分类提交按钮
        async editCatesSubmit(){
            const { data:res } = await this.$http.put(`categories/${this.editCatesId}`,
                { cat_name:this.editCatesForm.cat_name })
            
            if(res.meta.status!==200) return this.$message.error('编辑分类失败')

            // 编辑成功的话
            this.$message.success('编辑分类成功')
            this.editDilalogVisible = false;
            this.getCatesList();
        },

        // 点击删除分类按钮
        async deleteCates(deleteCateInfo){

            // this.deleteCateInfo.cat_id = this.deleteCatesId;
            // 询问用户是否确定删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>{return err});
            console.log(confirmResult);

            if(confirmResult ==='cancel'){
                return this.$message.info('您取消了删除操作')
            }

            // 如果确认删除--发送 axios请求
            const { data:res } = await this.$http.delete(`categories/${deleteCateInfo.cat_id}`)
            if(res.meta.status!==200) return this.$message.error('删除分类失败')

            // 如果删除成功，重新渲染页面
            this.getCatesList();
        },





    }
}
</script>


<style lang="less" scoped>
    .bread {
        font-size: 12px;
    }

    .el-card {
        margin-top: 20px;
    }

    .addCatesBtn {
        margin-bottom: 20px;
    }

    .el-pagination {
        margin-top: 20px;
    }
</style>