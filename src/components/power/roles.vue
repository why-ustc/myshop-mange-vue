<template>
    <div>
        
        <!-- 面包屑导入 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图区域 -->
        <el-card>

            
            <!-- 添加角色按钮 -->
            <el-row><el-button type="primary" class="addUserBtn"
                @click="addRole()">添加角色</el-button></el-row>
            
          
                <!-- 表格区域 -->
                <el-table :data="rolesList" border stripe style="width: 100%">

                    <!-- 扩展列 -->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                      <!-- 展开时 显示的数据  -->

                      <!-- {{scope.row}}  多层嵌套的数据-->
                      <!-- { "id": 30, "roleName": "主管", "roleDesc": "技术负责人", 
                              "children": [ { "id": 101, "authName": "商品管理", "path": "goods", 
                                  "children": [ { "id": 104, "authName": "商品列表", "path": "goods", 
                                      "children": [ { "id": 117, "authName": "商品删除", "path": "goods" } ] } ] } ] } -->

                            <el-row  v-for='(item1,index1 ) in scope.row.children'  
                                :class="['bottomBorder', index1===0 ? 'topBorder':'','margin','v-center']" :key="item1.id">
                                <!-- 渲染一级权限,宽度为5，一共24 -->
                                <el-col :span='5'>
                                    <el-tag closable type="primary" @close="deleteTagRights(scope.row.id,item1.id)">{{item1.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                                                             
                                </el-col>

                            <!-- 渲染二级+三级权限 -->
                                <el-col :span="19">
                                   <el-row v-for="(item2,index2) in item1.children" 
                                      :class="[index2===0 ? '':'topBorder','margin','v-center' ]"  :key="item2.id">
                                       <!-- 渲染第二级权限 -->
                                       <el-col :span="6">
                                           <el-tag closable type="success" @close="deleteTagRights(scope.row.id,item2.id)">{{item2.authName}}</el-tag>
                                           <i class="el-icon-caret-right"></i>
                                       </el-col>

                                       <!-- 渲染第三级权限 -->
                                       <el-col :span="18" >
                                           <el-tag closable type="warning" v-for="(item3) in item2.children" 
                                                :key="item3.id" @close="deleteTagRights(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                       </el-col>
                                   </el-row>
                                </el-col>

                            </el-row>

                           
                           
                            

                        </template>
                    </el-table-column>

                    <!-- 索引列 -->
                    <el-table-column type="index">
                    </el-table-column>
                    
                    <!-- 角色名称列 -->
                    <el-table-column prop="roleName" label="角色名称">
                    </el-table-column>

                    <!-- 角色描述列 -->
                    <el-table-column prop="roleDesc" label="角色名称">
                    </el-table-column>

                    <!-- 操作列 -->
                    <el-table-column  label="操作">
                        <!-- 因为操作列 与其他列不同，所以必须使用 作用域插槽 -->
                        <template slot-scope="scope" >
                            <el-button type="primary" size="small" icon="el-icon-edit"
                                @click='editRole(scope.row)'>编辑</el-button>
                            
                            <el-button type="warning" size="small" icon="el-icon-delete"
                                @click="deleteRole(scope.row)">删除</el-button>
                            
                            <el-button type="danger" size="small"  icon="el-icon-setting"
                                @click="setRightsBtn(scope.row)">分配权限</el-button>
                        </template>
                    </el-table-column>

    
                </el-table>
          
        </el-card>


        <!-- 分配权限按钮 弹出框 -->
        <el-dialog title="分配权限" :visible.sync="setRightsVisible" 
            @close="cleardefKeys()" width="50%">
            
            <!-- 树形权限展示列表 -->
            <el-tree :data="treeRightsList" :props="treeProps" 
                :default-expand-all='true' node-key='id' show-checkbox
                :default-checked-keys="defKeys" ref='treeRef'></el-tree>


            <!-- 确认与取消按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click=" setRightsVisible= false">取 消</el-button>
                <el-button type="primary" @click="setNewRights()">确 定</el-button>
               
            </span>
        </el-dialog>



        <!-- 编辑角色提交按钮 弹出框 -->
        <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible"
            width='40%'>

            <!-- 编辑角色信息框 -->
            <el-form ref="editDialogRef" :model="editDialogForm" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input v-model="editDialogForm.roleName"></el-input>
                </el-form-item>

                <el-form-item label="角色描述">
                    <el-input v-model="editDialogForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            
            <!-- 确认与取消按钮 -->
            <div slot="footer" >
                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoleSubmit()">确 定</el-button>
            </div>
        </el-dialog>



        <!-- 添加角色 弹出框 -->
        <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible"
            width='40%' @close="addRoleClose()">

            <!-- 添加角色信息框 -->
            <el-form ref="addDialogRef" :model="addDialogForm" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input v-model="addDialogForm.roleName"></el-input>
                </el-form-item>

                <el-form-item label="角色描述">
                    <el-input v-model="addDialogForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            
            <!-- 确认与取消按钮 -->
            <div slot="footer" >
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoleSubmit()">确 定</el-button>
            </div>
        </el-dialog>

        



    </div>
</template>



<script>
export default {

    // 生命周期函数
    created(){
        this.getRolesList();
    },
    
    data(){
        return {
            // 获取所有角色列表
            rolesList:[],

            // 分配权限 弹出框是否弹出
            setRightsVisible:false,

            // 获取所有权限，用于分配权限中
            treeRightsList:[],

            // 树形列表布置 规则
            treeProps:{
                // children 树形布置的根据 label:显示的文字
                children: 'children',
                label: 'authName'
            },

            // 树形权限 默认勾选 权限数组
            defKeys:[],

            // 点击了分配权限的 角色
            roleId:{},

            // 编辑 角色 dialog框
            editRoleDialogVisible:false,

            // 编辑角色的 信息
            editDialogForm:{
                roleName:'',
                roleDesc:'',
            },

            //编辑角色 id 的保留
            editRoleId:'', 

            // 添加角色弹框的显示
            addRoleDialogVisible:false,

            // 添加角色弹出框 添加角色的信息
            addDialogForm:{
                roleName:'',
                roleDesc:'',
            }

            
        }
    },

    methods:{
        // 获取所有的 角色列表数据
        async getRolesList(){
            const { data:res } = await this.$http.get('roles');
            // console.log(res);

            this.rolesList = res.data;
        },


        // 删除角色指定权限---未做完
        async deleteTagRights(role,rightsId){
            // console.log(role);

            // 先询问 用户是否确定删除 此权限
            const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=> {return err})

            // console.log(confirmResult);
            if(confirmResult !== 'confirm'){
                return this.$message.info('您已取消删除该权限')
            }
            // 如果确认删除权限就发起 axios 请求，进行删除
            const { data:res } = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
            // console.log(res);
            if(res.meta.status !==200){
                return this.$message.error('删除权限失败')
            }
            // 如果删除权限成功--但是此处不适合全部渲染整个页面
            // this.getRolesList();

            role.children = res.data;
        },


        // 点击分配权限按钮--开始分配权限 
        async setRightsBtn(role){
            // 发送 axios 请求获取所有权限列表并赋值给 data部分
            const { data:res }= await this.$http.get(`rights/tree`)
            // console.log(res);
            if(res.meta.status!==200){
                return this.$message.error('获取权限列表失败')
            }
            // 获取树形权限成功，就赋值给 data
            this.treeRightsList = res.data;
            console.log(role);
            this.roleId = role.id;

            this.dfGetRights(role,this.defKeys);

            // console.log('这里是：'+this.defKeys);
            this.setRightsVisible = true;
        },

        // 递归函数，用于获取 角色已经 拥有的权限
        dfGetRights(node,arr){
            if(!node.children) {
                return arr.push(node.id)
            }

            node.children.forEach(element =>this.dfGetRights(element,arr));
        },

        // 当分配权限框 消失，就要清除 权限数组
        cleardefKeys(){
            this.defKeys=[];
        },

        // 分配权限后点击 确定提交按钮
        async setNewRights(){
            const keys=[...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()];
            console.log(keys);
            const idStr=keys.join(',');

            const { data:res } = await this.$http.post(`roles/${this.roleId}/rights`,{ rids:idStr })

            if(res.meta.status !==200){
                return this.$message.error('分配权限失败')
            }

            // 分配权限成功 三步走
            this.$message.success('分配权限成功')
            this.getRolesList();
            this.setRightsVisible = false;
            
        },

        // 点击删除角色按钮 触发-->删除角色功能
        async deleteRole(role){
            // console.log(role);
            
            // 询问用户是否确认删除
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>{return err})
            // console.log(confirmResult);

            if(confirmResult === 'cancel'){
                return this.$message.error('您已取消删除')
            }
            // 如果确认删除--发送 axios 请求删除角色
            const { data:res } = await this.$http.delete(`roles/${role.id}`)
            if(res.meta.status!==200) {
                return this.$message.error('删除角色失败')
            }

            // 删除成功三步走
            this.$message.success('已成功删除角色');
            this.getRolesList()
        },


        // 点击 编辑角色按钮 触发-->编辑角色弹出框
        async editRole(role){
            // 将要编辑角色 赋值给 data
            this.editRoleId = role.id;

            // 发送 axios 请求获取角色
             const { data:res } = await this.$http.get(`roles/${role.id}`)

             if(res.meta.status!==200){
                 return this.$message.error('获取角色信息失败')
             }
            //  获取角色信息成功就赋值给 data
            this.editDialogForm = res.data;
            // console.log(this.editDialogForm);

            // 弹出 dialog 框
            this.editRoleDialogVisible = true;

        },

        // 编辑角色弹出框的确认 提交
        async editRoleSubmit(){
            const { data:res } = await this.$http.put(`roles/${this.editRoleId}`,this.editDialogForm)
            
            if(res.meta.status!==200) return this.$message.error('编辑角色失败')

            // 编辑成功
            this.editDialogForm = res.data;
            // console.log(this.editDialogForm);
            this.editRoleDialogVisible = false;
            this.getRolesList();

        },

        //  点击添加角色按钮
        async addRole(){
            this.addRoleDialogVisible = true;
        },

        // 添加角色--提交按钮
        async addRoleSubmit(){
            // 发送axios请求-添加角色
            const { data:res } = await  this.$http.post('roles',this.addDialogForm);
            if(res.meta.status!==201){
                return this.$message.error('添加角色失败')
            }
            this.$message.success('添加角色成功')
            this.addRoleDialogVisible = false;
            
            this.getRolesList();
        },

        // 监听 添加角色弹出框的 关闭
        addRoleClose(){
            this.addDialogForm = {};
        }







    }
}
</script>



<style lang="less" scoped>

    .bread {
        font-size: 13px;
    }

    .el-card {
        margin-top: 20px;
    }

    .addUserBtn {
        margin-bottom: 18px;
    }

    .topBorder {
        border-top: 1px solid #eee ;
    }

    .bottomBorder {
        border-bottom: 1px solid #eee;
    }
    .el-tag {
        margin: 8px;
    }

    .v-center {
        display: flex;
        align-items: center;
    }
    
</style>