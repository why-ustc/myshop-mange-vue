<template>

    <!-- 整个登录界面 -->
    <div class="login_container">
        <!-- 登录界面框 -->
        <div class="login_box">

            <!-- 登录框中的 Vue 头像 -->
            <div class="logo_box">
                <img src="../assets/logo.png" alt="">
            </div>

           
            <el-form  label-width="0px" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">

                 <!-- 用户名输入框 -->
                <el-form-item  class="username" prop='username'>
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>

                 <!--密码输入框 -->
                <el-form-item  class="password"  prop='password' >

                    <el-input   v-model="loginForm.password" prefix-icon="el-icon-s-cooperation" type='password'></el-input>
                </el-form-item>

                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login_submit()">登录</el-button>
                    <el-button type="info" @click="login_reset()">重置</el-button>
                </el-form-item>

            </el-form>


        </div>
        
    </div>
</template>


<script>
export default {
    data(){
        return {

            // 双向绑定 输入的数据 值
            loginForm:{
                username:'admin',
                password:'123456'
            },

            // 校验规则
            loginFormRules: {
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]

            }
        }
    },

    methods:{
        //1： 登录操作
        login_submit(){
            // 表单的预验证--跟回调函数，第一个参数 Boolean值，表示验证的成功失败；第二个参数：未通过校验的字段
            // valid =true,验证成功，否则验证失败
            this.$refs.loginFormRef.validate(async valid=>{ 
                console.log(valid);
                if(!valid) return;

                //否则就是验证成功--发送 axios 请求获取数据. 数据赋值给 res
                const { data: res } = await this.$http.post("login", this.loginForm);
                console.log(res);

                if(res.meta.status !==200){
                    return this.$message.error('登陆失败')
                }

                // 如果登录成功，则继续往下进行
                this.$message.success('登录成功');

                //3.3: 将登陆成功后的token， 保存到客户端的 sessionStorage中
                // 原因： 3.3.1:项目中出现了登录之外的 API,必须在登录之后才能访问
                //        3.3.2:token 只应在当前网站打开期间有效，所以将 token 保存在 sessionStorage 中,而不是 localStorage
                window.sessionStorage.setItem('token',res.data.token);

                // 编程式导航，登录成功进入到下一个页面
                this.$router.push('/home')

            })
           
        },
        //2：重置表单函数
        login_reset(){
            this.$refs.loginFormRef.resetFields();
        }
    }
}


</script>

<style lang="less" scoped>

    .login_container{
        width: 100%;
        height: 100%;
        background-color: #2b4b6b;

    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        border-radius: 3px;

        .logo_box {
            width: 130px;
            height: 130px;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            padding: 10px;
            background-color: #fff;
            border-radius: 50%;
            box-shadow: 0 0 10px #ddd;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }

    .username {
        margin-top: 100px;
        margin-left:10px;
        margin-right: 10px;
        
    }

    .password {
        margin-left:10px;
        margin-right: 10px;
    }

    .btns {
        position: absolute;
        right:10px;
        margin-top:8px ;
    }

</style>