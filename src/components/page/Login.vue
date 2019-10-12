<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="账号">
                        <span slot="prepend" class="el-icon-lx-people"></span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <span slot="prepend" class="el-icon-lx-lock"></span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="param.code" placeholder="验证码" @keyup.enter.native="submitForm()">
                        <span slot="prepend" class="el-icon-picture-outline"></span>
                    </el-input>
                </el-form-item>
                <div class="code-img" @click="fresh">
                    <img class="code-image" :src="param.codePic"  alt="" style="">
                </div>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {Decrypt,Encrypt,preSign,EncryptReplace,ParamsAppend} from '@/aes/utils';
    import md5 from 'js-md5';
    import axios from 'axios';
    import https from "../../https";
export default {
    data: function() {
        return {
            param: {
                username: '',
                password: '',
                code:'',
                codePic:'',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
            },
        };
    },
    created() {
        this.getValidateCode()
    },
    methods: {
        getValidateCode(){//获取验证码的方法
            axios.get('/admin/validateCode', {
                responseType: 'arraybuffer'
            })
                .then(response => {
                    return 'data:image/png;base64,' + btoa(
                        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );
                }).then(data => {
                this.param.codePic=data;
            })

        },
        fresh(){//点击重新刷新验证码
            this.ruleForm.codePic=this.getValidateCode()
        },
        submitForm() {
            // localStorage.setItem('ms_username', this.param.username)
            // this.$router.push('/');
            var jsonArr = [];
            jsonArr.push({key:"userName",value:this.param.username});
            jsonArr.push({key:"password",value:this.param.password});
            jsonArr.push({key:"validateCode",value:this.param.code});
            let sign =md5(preSign(jsonArr));
            jsonArr.push({key:"sign",value:sign});
            let params = ParamsAppend(jsonArr);
            https.fetchPost('/admin/login',params).then((data) => {
                if(data.data.code== 'success'){
                    localStorage.setItem('ms_username', this.param.username)
                    this.$router.push('/');

                }else if(data.data.code=='error'){
                    alert(data.data.message)
                }
            }).catch(err=>{
                    console.log(err)
                }
            )
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
.code-img{
    width: 90px;
    height:30px;
    border: 1px solid black;
    position: relative;
    left: 92px;
    top: -7px;
    background:no-repeat;
}
</style>
