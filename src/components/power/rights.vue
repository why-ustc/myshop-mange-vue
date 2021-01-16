<template>
    <div>
       
        <!-- 面包屑导入 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图区 -->
        <el-card>
            <!-- 表格区 -->
            <el-table :data="rightsList" border stripe style="width: 100%">
                <!-- 索引列 -->
                <el-table-column type='index'>
                </el-table-column>

                <!-- 日期列 -->
                <el-table-column prop="authName" label="日期">
                </el-table-column>

                <!-- 路径 一列 -->
                <el-table-column prop="path" label="路径">
                </el-table-column>


                <!-- 权限等级 一列 -->
                <el-table-column  label="权限等级">

                    <!-- 使用 作用域插槽 自定义输出格式 -->
                    <!-- 因为其他列就是 用对象数组 rightsList 中的某属性作为列中数据，而此列不同里面要放 tag，所以必须使用 作用域插槽 -->
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level ==0">一级权限</el-tag>
                        <el-tag v-else-if="scope.row.level ==1" type="success">二级权限</el-tag>
                        <el-tag v-else type='warning'>三级权限</el-tag>
                    </template>
                </el-table-column>


                
            </el-table>


        </el-card>



    </div>
</template>





<script>
export default {

    // 生命周期函数
    created(){
        this.getRightsList();
    },
    
    data(){
        return {
            // 所有 权限列表
            rightsList:[],
        }
    },

    methods:{
        // 获取所有的权限列表
        async getRightsList(){
            const { data:res } = await this.$http.get('rights/list');

            // "id": 101, "authName": "商品管理", "level": "0",
            // "pid": 0, "path": null
            // console.log(res);
            if(res.meta.status !==200){
                return this.$message.error('获取权限列表失败')
            }
            // 获取权限列表成功，就将 权限列表赋值给 rightsList
            this.rightsList = res.data;


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
</style>