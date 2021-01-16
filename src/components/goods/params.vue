<template>
    <div>
        
        <!-- 面包屑导入 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>

            <!-- 警告区域 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数" 
            type="warning" show-icon></el-alert>

            <!-- 选择区域 -->
            <el-row class="selectCates">
                <el-col >
                    <span>选择商品分类：</span> 
                    <el-cascader v-model="selectKeysId" :options="catesList"
                        :props="cascaderProps"
                        @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <!-- 动态参数 与 静态属性区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabsChange">
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数按钮区 -->
                    <el-button type="primary" size='mini' :disabled='isdisabled' 
                    class="addParams" @click="addParams()">添加参数</el-button>

                    <!-- 参数的表格区 -->
                    <el-table :data="catesParamsList"  border stripe >

                        <!-- 扩展列 -->
                        <el-table-column type="expand">
                            <!-- 展开列想放入的数据 需要用作用域插槽 -->
                            <template slot-scope="">

                            </template>
                        </el-table-column>

                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <!-- 参数名称列 -->
                        <el-table-column prop="attr_name" label="参数名称">
                        </el-table-column>

                        <!-- 操作列 -->
                        <el-table-column  label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size='small' 
                                @click="editParams(scope.row)">编辑</el-button>

                                <el-button type="danger" size='small'
                                @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>

                </el-tab-pane>


                <el-tab-pane label="静态属性" name="only">
                     <el-button type="primary" size='mini' :disabled='isdisabled' 
                     class="addParams" @click='addAttribute()' >添加属性</el-button>

                     <!-- 参数的表格区 -->
                    <el-table :data="catesParamsList" stripe  border>
                        <el-table-column type="expand"></el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>

                        <el-table-column prop="attr_name" label="属性名称">
                        </el-table-column>

                        <!-- 操作列 -->
                        <el-table-column  label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size='small' 
                                    @click="editParams(scope.row)">编辑</el-button>

                                <el-button type="danger" size='small' 
                                    @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                        
                    </el-table>
                </el-tab-pane>

            </el-tabs>


            <!-- 添加动态参数++静态属性弹出框----直接重复套用 -->
            <el-dialog :title=" '添加'+whichTitle" :visible.sync="addParamsVisible" @close='addParamsClose'>

                <el-form :model="addParamsInfo" :rules="addParamsRules" ref="addParamsRef" >
                    <el-form-item :label="whichTitle" label-width='100px' prop='attr_name'>
                        <el-input v-model="addParamsInfo.attr_name"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 弹出框底部确认与取消按钮 -->
                <div slot="footer" class="dialog-footer">
                    <el-button @click=" addParamsVisible= false">取 消</el-button>
                    <el-button type="primary" @click="addParamsSubmit()">确 定</el-button>
                </div>
            </el-dialog>


            <!-- 编辑动态参数 + 静态属性 -->
            <el-dialog :title=" '编辑'+whichTitle" :visible.sync="editParamsVisible" @close='editParamsClose'>

                <el-form :model="editParamsInfo" :rules="editParamsRules" ref="editParamsRef" >
                    <el-form-item :label="whichTitle" label-width='100px' prop='attr_name'>
                        <el-input v-model="editParamsInfo.attr_name"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 弹出框底部确认与取消按钮 -->
                <div slot="footer" class="dialog-footer">
                    <el-button @click=" editParamsVisible= false">取 消</el-button>
                    <el-button type="primary" @click="editParamsSubmit()">确 定</el-button>
                </div>
            </el-dialog>

        </el-card>




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
            // 商品列表数据
            catesList:[],

            // 级联选择器 设置规则
            cascaderProps:{
                // 触发方式
                expandTrigger:'hover',
                // 级联选择器选中的 唯一属性
                value:'cat_id',
                // 显示在选择器中的 值
                label:'cat_name',
                // 父元素中 子数组名称
                children:'children'
            },

            // 级联选择器中选中的 ID 数组值
            selectKeysId:[],


            // tabs 中选中的 标签页
            activeName:'many',

            // 获取到的每个商品的参数
            catesParamsList:[],

            // 添加动态参数弹出框是否显示
            addParamsVisible:false,

            // 添加动态参数规则
            addParamsRules:{
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
            },

            // 添加动态参数的 信息
            addParamsInfo:{
                // 参数名称
                attr_name:'',
            },




            // 编辑 动态参数+静态属性 弹出框是否显示
            editParamsVisible:false,

            // 编辑 参数 弹出框的 信息,等下要查询并赋值给他
            editParamsInfo:{},

            // 编辑弹出框的验证规则
            editParamsRules:{
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
            },

            // 要编辑参数对象的 ID 
            editID:'',






        }
    },

    methods:{
        // 获取所有商品数据列表
        async getCatesList(){
            const { data:res } = await this.$http.get(`categories`);

            if(res.meta.status!==200){
                return this.$message.error('获取商品数据列表失败')
            }
            this.catesList = res.data;
            // console.log(this.catesList);
        },

        // 选中级联选择器时 触发的函数
        handleChange(){
           this.getParamsList();
            
            
            
        },

        // tabs 标签页 改变标签时触发
        handleTabsChange(){
           

            // 
            this.getParamsList();
        },

        // 获取所有的参数列表
        async getParamsList(){
            // 判断是否为第三级分类
            if(this.selectKeysId.length !==3){
                this.selectKeysId = [];
                return;
            }
            // 获取所有的参数列表
            const { data:res } = await this.$http.get(`categories/${this.selectKeysId[2]}/attributes`,
                { params:{ sel: this.activeName } })
            
            // console.log(res);
            if(res.meta.status !==200){
                return this.$message.error('获取商品参数失败')
            }
            // 获取成功的话
            this.catesParamsList = res.data;
        },

        // 添加动态参数按钮 
        addParams(){

            this.addParamsVisible = true;
        },

        //添加动态参数的提交
        async addParamsSubmit(){
            // 预验证

            const { data:res } = await this.$http.post(`categories/${this.selectKeysId[2]}/attributes`,
                { attr_name:this.addParamsInfo.attr_name,attr_sel:this.activeName })
            if(res.meta.status!==201){
                return this.$message.error('添加参数失败')
            }
            // 如果添加成功
            this.getParamsList();
            this.$message.success('添加参数成功')
            this.addParamsVisible = false;
        }, 

        // 添加动态参数弹出框的关闭事件
        addParamsClose(){
            this.addParamsInfo = {};
        },

        // 添加静态属性按钮 触发
        addAttribute(){
            this.addParamsVisible = true;
        },



        // 删除某分类 id 下 的参数
        async deleteParams(deleteParamsInfo){
    
            //先询问是否确认删除参数
            const result = await this.$confirm('此操作将永久删除该'+this.whichTitle+'，' +'是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>{return err})
            if(result !=='confirm'){
                return this.$message.info('您已取消了删除操作')
            }
            // 如果确认删除， axios请求
            const { data:res } = await this.$http.delete(`categories/${this.selectKeysId[2]}/attributes/${deleteParamsInfo.attr_id}`)
            if(res.meta.status!==200){
                return this.$message.error('删除'+this.whichTitle+'失败')
            }
            // 如果删除成功
            this.$message.success('删除'+this.whichTitle+'成功')
            this.getParamsList();
        },



        // 点击编辑按钮触发：编辑某分类id下的参数
        async editParams(editInfo){
            // 将要编辑参数的 id  赋值保存
            this.editID = editInfo.attr_id;

            // 根据 Id 查询参数并赋值给 data
            const { data:res } = await this.$http.get(`categories/${this.selectKeysId[2]}/attributes/${editInfo.attr_id}`,{ params:{ attr_sel:this.activeName } })
              
            if(res.meta.status!==200){
                return this.$message.error('获取'+this.whichTitle+'失败')
            }
            console.log(editInfo);
            // 如果获取成功
            this.editParamsInfo = res.data;
            console.log(this.editParamsInfo);
            
            this.editParamsVisible = true;
        },

        // 监听编辑参数 弹出框的 关闭事件
        editParamsClose(){
            this.$refs.editParamsRef.resetFields();
        },

        // 编辑 参数弹出框的 确认提交事件
        async editParamsSubmit(){
            const { data:res } = await this.$http.put(`categories/${this.selectKeysId[2]}/attributes/${this.editID}`,
            { attr_name:this.editParamsInfo.attr_name,attr_sel:this.activeName });

            if(res.meta.status!==200){
                return this.$message.error('编辑'+this.whichTitle+'失败')
            }
            // 如果编辑成功
            this.$message.success('编辑'+this.whichTitle+'成功')
            this.editParamsVisible = false;
            this.getParamsList();
        }


    },

    computed:{
        // 添加参数 与 添加属性按钮 是否禁用
        isdisabled(){
            if(this.selectKeysId.length<3){
                return true;
            }else {
                return false;
            }
        },

        whichTitle(){
            if(this.activeName === 'many'){
                return '动态参数'
            }else {
                return '静态属性'
            }
        }


    }
}
</script>




<style lang="less" scoped>
    .el-breadcrumb {
        font-size: 10px;
        margin-bottom: 20px;
    }

    .selectCates {
        margin: 15px 0;
    }

    .addParams {
        margin-bottom: 20px;
    }
   
    

    
    
</style>