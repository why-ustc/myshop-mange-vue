<template>
    <div>

        <!-- 面包屑导入 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>

            <!-- 提示信息区域 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable='false'></el-alert>


            <!-- 步骤 step 栏 -->
            <el-steps :active="activeName-0" align-center>
                <el-step title="基本信息" ></el-step>
                <el-step title="商品参数" ></el-step>
                <el-step title="商品属性" ></el-step>
                <el-step title="商品图片" ></el-step>
                <el-step title="商品内容" ></el-step>
                <el-step title="完成" ></el-step>
            </el-steps>



            <!-- tabs 栏 -->
            <el-form :model="stepsFormData" :rules="stepFormRules" ref="stepFormRef" 
                label-width="100px" :label-position=" 'top' ">

                <el-tabs v-model="activeName" :tab-position="'left'" 
                    :before-leave='tabsBeforeLeave' @tab-click='tabsChange()'>

                    <!-- 步骤一：添加基本信息 -->
                    <el-tab-pane label="基本信息" name='0'>

                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="stepsFormData.goods_name"></el-input>
                        </el-form-item>

                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="stepsFormData.goods_price"></el-input>
                        </el-form-item>

                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="stepsFormData.goods_weight"></el-input>
                        </el-form-item>

                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="stepsFormData.goods_number"></el-input>
                        </el-form-item>

                        <el-form-item label="商品分类" width='400'>
                            <!-- 级联选择器 -->
                            <el-cascader v-model="selectKeysId" :options="goodsOptions"
                                :props="cascaderProps"
                                @change="handleChange"></el-cascader>
                        </el-form-item>

                    </el-tab-pane>

                    <!-- 步骤二：添加商品参数 -->
                    <el-tab-pane label="商品参数" name='1'>

                        <el-form-item :label="item.attr_name" prop="goods_name" v-for="item in manyDataList"
                            :key="item.attr_id">
                            <el-checkbox-group v-model="checkList">
                                <el-checkbox border size='mini' :label="item" v-for="(item,index) in checkList"
                                    :key="index"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                    </el-tab-pane>

                    <!-- 步骤三：添加商品属性 -->
                    <el-tab-pane label="商品属性" name='2'>

                        <el-form-item :label="item.attr_name"  v-for="item in onlyDataList"
                            :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>

                    </el-tab-pane>
                    
                    <!-- 步骤四：上传图片 -->
                    <el-tab-pane label="商品图片" name='3'>
                        
                        <!-- action: 图片上传到的服务器地址 -->
                        <!-- on-preview:预览功能  on-remove：移除图片功能 --> 
                        <el-upload :action="onloadImageUrl" list-type="picture"
                            :on-preview="handlePreview" :on-remove="handleRemove"
                            :headers='headersObject' :on-success='uploadSuccess'>
                            <el-button size="small" type="primary">点击上传</el-button>
                            
                        </el-upload>

                    </el-tab-pane>

                    <!-- 步骤五：富文本编辑器 -->
                    <el-tab-pane label="商品内容" name='4'>

                        <!-- 富文本编辑器区域  添加运行依赖:vue-quill-editor-->
                        <quill-editor  v-model="stepsFormData.goods_introduce">
                        </quill-editor>

                        <!-- 添加商品按钮 -->
                        <el-button type='primary' @click="addSubmit"
                            class="submit">添加商品</el-button>

                    </el-tab-pane>

                </el-tabs>
            
            </el-form>


        </el-card>


        <!-- 预览图片时 弹出的 dialog -->
        <el-dialog title="图片预览" :visible.sync="imgDialogVisible"
            width="50%" >

            <img :src="imgUrl" alt="" class="img">
           
        </el-dialog>

    </div>
</template>

<script>
export default {
    // 生命周期函数
    created(){
        // 获取商品分类数据用于步骤一级联选择器
        this.getGoodsList();
        
    },

    data(){
        return {
            // 激活的步骤条
            activeName:'0',

            // 添加商品 form 中的数据信息
            stepsFormData:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                // 商品所属的分类数组
                goods_cat:[],
                // 商品描述
                goods_introduce:'',

                // 图片上传 图片文件数组
                pics:[],

                // 商品动态参数 与静态属性 的数组
                attrs:[],
            },

            //添加商品验证规则
            stepFormRules:{
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' } 
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

            } ,

            // 级联选择器选中的分类 Id数组
            selectKeysId:[],

            // 级联选择器数据源-商品分类列表
            goodsOptions:[],

            // 级联选择器 配置规则
            cascaderProps:{
                // 触发方式
                expandTrigger:'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },

            // 步骤二中 参数复选框 数据数组
            checkList:['红色','黄色','绿色'],

            // 步骤二中 总数据信息
            manyDataList:[],


            // 步骤三中 总属性信息
            onlyDataList:[],

            // 步骤四 图片上传 地址
            onloadImageUrl:'http://127.0.0.1:8888/api/private/v1/upload',

            // 绑定上传图片的请求头
            headersObject:{
                Authorization:window.sessionStorage.getItem('token')
            },


            // 预览图片时 是否显示
            imgDialogVisible:false,

            // 要预览图片的url
            imgUrl:'',







        }
    },

    methods:{
        // 获取商品分类数据列表 给级联选择器用
        async getGoodsList(){
            const { data:res } = await this.$http.get(`categories`);
            if(res.meta.status!==200){
                return this.$message.error('获取数据列表失败')
            }
            this.goodsOptions = res.data;
        },

        // // 控制只能选第三级分类，否则无效
         handleChange(){
             if(this.selectKeysId.length!==3){
                 this.selectKeysId = []
             }
         },

        //  切换 tabs 触发
        tabsBeforeLeave(newActiveName, oldActiveName){
            // 如果选中的不是第三级分类，不允许切换标签
            if(!this.goodsId){
                this.$message.error('请先选择商品分类')
                return false
            }
        },

        // tabs栏 切换触发的函数
        async tabsChange(){

            // 如果是第二步：获取对应数据并渲染
            if(this.activeName === '1'){
                const { data:res } = await this.$http.get(`categories/${this.goodsId}/attributes`,
                    { params:{ sel:'many' } })
                if(res.meta.status!==200){
                    return this.$message.error('获取数据列表失败')
                }
                // 获取成功的话
                this.manyDataList = res.data;
                console.log(res.data);
                
            }

            // 如果是第三步：获取对应属性并渲染
            if(this.activeName === '2'){
                const { data:res } = await this.$http.get(`categories/${this.goodsId}/attributes`,
                    { params:{ sel:'only' } })
                // console.log(res);

                if(res.meta.status!==200){
                    return this.$message.error('获取商品数据失败')
                }
                this.onlyDataList = res.data;
            }



        },


        // 图片上传 预览图片触发
        handlePreview(file){
            // 先获取要预览图片时的 url
            this.imgUrl = file.response.data.url;
            this.imgDialogVisible = true;
            // console.log(file.response.data.url);
            // console.log(file);
            
            // 再把这个图片渲染到 dialog 中
        },

        // 图片上传 移除图片触发
        handleRemove(file){
            // 先找到 移除图片的 临时路径
            const removePath = file.response.data.tmp_path;
            // 遍历图片数组 获取要移除图片的索引
            const index = this.stepsFormData.pics.findIndex(x=>{
                x.pic === removePath
            })
            this.stepsFormData.pics.splice(index,1);
            console.log(this.stepsFormData);

           
        },

        // 文件上传成功时的钩子函数
        uploadSuccess(response){
            // 获取图片上传后 服务器返回的临时路径 并赋值 data
            const temPath = { pic:response.data.tmp_path }
            this.stepsFormData.pics.push(temPath);

            // console.log(this.stepsFormData);
        },

        // 最后一步中的 提交 新添加的商品
        addSubmit(){
            this.stepsFormData.goods_cat = this.selectKeysId.join(',');
            // 先进行表单的预验证
            this.$refs.stepFormRef.validate(async  valid=>{
                if(!valid){
                    return this.$message.error('请填写必要的表单项')
                }

                // 执行添加商品所需要参数的 转换格式


                // 预验证没问题就提交 axios 请求
                
                const { data:res } = await this.$http.post(`goods`,this.stepsFormData)
                // console.log(res);
                if(res.meta.status!==201){
                    return  this.$message.error('添加商品失败')
                }
                // 如果添加成功--强制跳转到商品列表页面
                this.$message.success('添加商品成功');
                this.$router.push(`/goods`)

            })

            console.log(this.stepsFormData);
        },

        
        
    

        
    },

    computed:{
        // 级联选择器选中的数据 返回第三级分类
        // 控制只能选第三级分类，否则无效
        goodsId(){
            if(this.selectKeysId.length !==3){
                return null
            }else {
                return this.selectKeysId[2]
            }
        }
    }
}
</script>


<style lang="less" scoped>

    .el-breadcrumb {
        margin-bottom: 20px;
        font-size: 13px;
    }

    .el-alert {
        margin-bottom: 20px;
    }

    .el-steps {
        margin-bottom: 20px;
    }

    .img {
        width: 100%;
    }

    .submit {
        margin-top: 20px;
    }
    
</style>