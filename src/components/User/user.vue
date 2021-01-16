<template>
    <div>
        
        <!-- 面包屑导入 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图区域 -->
        <el-card class="box-card"> 

            <!-- 搜索框及添加用户按钮 -->
            <el-row :gutter="20" class="input">
                <el-col :span="8">
                    <el-input v-model="queryInfo.query"  placeholder="请输入内容" prefix-icon="el-icon-search"
                        @change="getUsersList" :clearable='true' @clear="getUsersList"></el-input>
                </el-col>

                <el-col :span="4"> 
                    <el-button type="primary" @click="addUserBtn()">添加用户</el-button>
                </el-col>
               
            </el-row>



            <!-- 用户列表 表格 -->
            <!-- stripe: 隔行有一行灰色 -->
            <el-table :data="userList" stripe border>
                <!-- 添加索引列 -->
                <el-table-column type='index' >
                </el-table-column>

                <el-table-column prop="username" label="姓名" >
                </el-table-column>

                <el-table-column prop="email" label="邮箱" >
                </el-table-column>

                <el-table-column prop="mobile" label="电话" >
                </el-table-column>

                <el-table-column prop="role_name" label="角色" >
                </el-table-column>
                
                <el-table-column  label="状态">
                   <!-- 使用作用域插槽  scope.row 就是这一行全部数据
                            slot-scope="scope" 用于接收当前作用域数据-->
                    <template slot-scope="scope">
                        <!-- {{scope.row}} -->
                        <!-- { "id": 500, "role_name": "超级管理员", "username": "admin", "create_time": 1486720211, "mobile": "12345678",  -->
                        <!-- "email": "adsfad@qq.com", "mg_state": true } -->
                        <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"> </el-switch>
                    </template>
                </el-table-column>


                <el-table-column  label="操作" >
                    <template slot-scope="scope">

                        <!-- 分别是 编辑+删除+分配角色按钮 -->
                        <!-- 分别是 编辑+删除+分配角色按钮 -->
                        <!-- 分别是 编辑+删除+分配角色按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click='editUserInfo(scope.row)'></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="deleteUserInfo(scope.row.id)"></el-button>

                        <el-tooltip content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                @click="setRoles(scope.row)"></el-button></el-tooltip>
                    </template>
                </el-table-column>
            </el-table>


            <!-- 分页区域 -->
            <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1,2,3,5]"
                :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card> 


        <!-- 点击添加用户按钮  显示的弹出框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" 
            width="32%" @close="addDialogClose()">
         
         <!-- 输入信息框 -->
        <el-form :model="addDialogForm" :rules="addDialogRules" ref="addDialogRef" label-width="100px" >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addDialogForm.username"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input v-model="addDialogForm.password"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addDialogForm.email"></el-input>
            </el-form-item>

            <el-form-item label="电话" prop="mobile">
                <el-input v-model="addDialogForm.mobile"></el-input>
            </el-form-item>


        </el-form>
     
         <div slot="footer" >
             <el-button @click="addDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="addUserForm()">确 定</el-button>
         </div>
        </el-dialog> 


        <!-- 点击编辑用户按钮  显示的弹出框 -->
        <el-dialog title="编辑用户信息" :visible.sync="editDialogVisible" 
            width="32%" @close='editDialogClose()'>
         
         <!-- 输入信息框 -->
        <el-form :model="editDialogForm" :rules="editDialogRules" ref="editDialogRef" label-width="100px" >
            <el-form-item label="用户名" >
                <el-input v-model="editDialogForm.username" disabled></el-input>
            </el-form-item>

            <!--prop是表单验证规则中的规则  v-model:绑定表单中的数据显示  -->
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editDialogForm.email"></el-input>
            </el-form-item>

            <el-form-item label="电话" prop="mobile">
                <el-input v-model="editDialogForm.mobile"></el-input>
            </el-form-item>


        </el-form>
     
         <div slot="footer" >
             <el-button @click="editDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="editUsersubmit(editDialogForm.id)">确 定</el-button>
         </div>
        </el-dialog> 


        <!-- 点击分配角色按钮 显示的弹框 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible"
            width="45%">
            <div class="userInfo">当前的用户：{{setRoleInfo.username}} </div>
            <div class="userInfo">当前的角色：{{setRoleInfo.role_name}} </div>

            <!-- 选择新角色框 -->
            <el-select v-model="selectRoleId" placeholder="请选择">
                <el-option v-for="item in selectOptions" :key="item.id" 
                    :label="item.roleName" :value="item.id">
                </el-option>
             </el-select>

            <span slot="footer" >
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRoleSubmit">确 定</el-button>
            </span>
        </el-dialog>
        




       
        


    </div>
</template>

<script>
export default {

    // 生命周期函数，vue实例创建就调用
    created(){
        this.getUsersList();
    },

    


    data(){

        // 自定义-邮箱验证
        // rule:验证规则 value:验证值 callback回调函数
        const checkEmail = (rule, value, callback) => {
            //邮箱正则表达式：regEmail.test()检验是否合法为 true
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

            if (!regEmail.test(value)) {
                return callback(new Error('请输入正确邮箱'));
            } 
            // 验证通过的话：直接回调函数
            callback();

        }
        // 并分别将 checkEmail  checkMobile绑定到表单验证规则中
        // 自定义-手机验证
        const checkMobile = (rule,value,callback)=>{
            //手机正则
            const regMobile = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
            if(!regMobile.test(value)){
                return callback(new Error('请输入正确电话号码'))
            }
            callback();
        }



        return {
            // 文档 1.3 查询参数
            queryInfo:{
                query:'',

                // 当前页数
                pagenum:1,
                // 当前每页展示 用户数量
                pagesize:2,
            },

            // 获取的用户列表
            userList:[],

            // 获取的总数据量
            total:0,

            // 添加用户 显示框的弹出与否
            addDialogVisible:false,

            // 添加用户显示框的 数据绑定
            addDialogForm:{
                username:'',
                password:'',
                email:'',
                mobile:'',
            },

            // 添加用户表格 验证规则
            addDialogRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 115 个字符', trigger: 'blur' }
                ],
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ],

            },



            // 编辑用户信息 显示框 是否显示
            editDialogVisible:false,

            // 编辑用户信息 表格数据
            editDialogForm:{},

            // 编辑用户表格 验证规则
            editDialogRules:{
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ],
            },

            // 分配角色弹框的显示
            setRoleDialogVisible:false,

            // 分配角色的用户信息
            setRoleInfo:{
                username:'',
                role_name:'',
            },

            // select-options：级联框的选项
            selectOptions:[],

            // 分配角色时选中的 角色ID
            selectRoleId:'',



            


        }
    },

    methods:{
        // 获取用户列表函数
        async getUsersList(){
            const { data:res } = await this.$http.get('users',
                { params:this.queryInfo })
            console.log(res);

            if(res.meta.status!==200){
                return this.$message.console.error('获取用户列表失败');
            }

            // 如果获取成功：
            this.userList = res.data.users;
            this.total = res.data.total;
        },

        // 添加用户操作
        addUserBtn(){
            this.addDialogVisible = !this.addDialogVisible;
        },

        // 分页中 当每页的数据量 改变
        // 此函数会自动得到 新的每页数据量
        handleSizeChange(newsize){
            // console.log(newsize);
            this.queryInfo.pagesize = newsize;

            // 重新获取用户数据--重新渲染页面
            this.getUsersList();
        },

        // 分页中 当前页的 改变
        // 此函数会自动得到 新的页数
        handleCurrentChange(newpage){
            // console.log(newpage);
            this.queryInfo.pagenum = newpage;
            // --重新渲染页面
            this.getUsersList();
        },

        // 监听 Switch 用户状态改变的函数--对应文档1.3.3
        async changeState(userInfo){
            // console.log(userInfo);
            // 发送 axios 请求，路径带 冒号 部分就要动态修改 ${}
            const { data:res }= await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            // console.log(res);

            if(res.meta.status!==200) {
                userInfo.mg_state = !userInfo.mg_state 
                this.$message.error('修改用户状态失败')
            }
            this.$message.success('修改用户状态成功')
        },

        // 添加用户表单 关闭，就重置所有内容为空
        addDialogClose(){
            this.$refs.addDialogRef.resetFields();
        },

        // 添加用户 预验证
        addUserForm(){
            
            // validate 是Form组件的一个函数方法 参数是布尔值
            this.$refs.addDialogRef.validate(async valid=>{
                // 如果验证失败 返回
                if(!valid) return 
                 
                //  验证成功，发送axios请求
                const { data:res }= await this.$http.post('users',this.addDialogForm);
                // console.log(res);

                if(res.meta.status!==201){
                    return this.message.error('添加用户失败');
                }

                // 添加成功后
                // 1:关闭 dialog 框-->2:重新渲染列表
                this.addDialogVisible = !this.addDialogVisible;

                this.getUsersList();
            })
        },

        // 点击编辑用户信息按钮--获取用户原本信息
        async editUserInfo(userInfo){
            // create_time: (...) email: "adsfadadsad@qq.com"
            // id: 500  mg_state: true mobile: "12345678"
            // role_name: "超级管理员" username: "admin
            // console.log(userInfo);

            this.editDialogVisible = true;
            
            // 发送 axios 请求，获取用户信息原本数据 并进行修改
            const { data:res } = await  this.$http.get(`users/${userInfo.id}`)

            // email: "adsfadadsad@qq.com id: 500
            // mobile: "12345678" rid: 0 username: "admin"
            console.log(res.data);
            this.editDialogForm = res.data;
        },

        // 监听编辑用户信息框的 关闭事件
        editDialogClose(){
            this.$refs.editDialogRef.resetFields();
        },

        // 编辑用户信息 提交
        async editUsersubmit(id){
            // console.log(id);

            // 编辑用户信息预验证
            this.$refs.editDialogRef.validate(async valid=>{
                if(!valid) return

                // 验证成功，发送 axios请求
                const { data:res }= await this.$http.put('users/'+id,
                    { 
                       email:this.editDialogForm.email,
                       mobile:this.editDialogForm.mobile 
                    })

                // 判断是否更新成功
                if(res.meta.status !==200){
                    return this.message.error('更新用户信息失败')
                }
                // 更新成功：有三步要做
                this.$message.success('更新用户信息成功');
                this.editDialogVisible = false;
                this.getUsersList();

                

                

            })
    

        },

        // 删除用户信息
        async deleteUserInfo(id){
            // 询问用户是否确认删除
            const deleteResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>{ return err })
            // console.log(deleteResult);

            // 如果用户点击取消，就会报错，此时用上面 .catch捕获错误并把错误抛出去
            // 现在再点击取消，返回 cancel
            //如果用户点击确认删除，则返回 confirm
            if(deleteResult !=='confirm'){
                return this.$message.info('您已取消删除操作')
            }

            // 如果确定删除，发起 axios 请求
            const { data:res } = await this.$http.delete('users/'+id)
            if(res.meta.status!==200){
                return this.$message.error('删除用户失败')
            }
            // 删除用户成功:进行以下俩步操作
            this.$message.success('删除用户成功')
            this.getUsersList();
        },

        // 点击分配角色按钮
        async setRoles(role){
            // email: "123456@qq.com id: 500 mg_state: true
            // mobile: "1343489" role_name: "超级管理员" username: "admin"
            // console.log(role);

            // 将当前用户信息赋值给 data
            this.setRoleInfo.username = role.username;
            this.setRoleInfo.role_name = role.role_name;
            this.setRoleInfo.userId = role.id;


            // 获取所有角色列表并赋值出去
            const { data:res } = await this.$http.get(`roles`);

            // id: 42 roleDesc: "技术负责人" roleName: "主管"
            // console.log(res.data);
            this.selectOptions = res.data;

            this.setRoleDialogVisible = true;
        },

        // 分配权限的提交
        async setRoleSubmit(){
            const { data:res } = await this.$http.put(`users/${this.setRoleInfo.userId}/role`,
                { rid:this.selectRoleId });
            if(res.meta.status!==200){
                return this.$message.error('分配角色失败')
            }

            // 分配角色成功的话
            this.getUsersList();
            this.setRoleDialogVisible = false;
            this.$message.success('分配权限成功')
        }
    
    }
    
}
</script>




<style lang="less" scoped>
    .el-breadcrumb {
        font-size:12px;
    }

    .el-card {
        margin-top:20px;
    }

    .input {
        margin-bottom: 16px;
    }

    .el-pagination {
        margin-top: 14px;
    }

    .userInfo {
        margin-bottom: 17px;
    }
</style>