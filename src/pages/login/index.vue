<template>
  <div class="login">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm.username" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code" style="width: 250px">
        <el-input v-model="ruleForm.code"></el-input>
        <div class="code-img" @click="fresh">
          <img class="code-image" :src="ruleForm.codePic"  alt="">
        </div>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button class="reset" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
    import {Decrypt,Encrypt,preSign,EncryptReplace} from '@/aes/utils'
    import https from "../../https";
    const crypto = require('crypto');
    import axios from 'axios';
    import md5 from 'js-md5'
  export default {
        name: "index",
        data() {
            var validateUser = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账号'));
                }  else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                }  else {
                    callback();
                }
            };
            var validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入验证码'));
                }  else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    code: '',
                    codePic:'',
                },
                rules: {
                    username: [
                        { validator: validateUser, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    code: [
                        { validator: validateCode, trigger: 'blur' }
                    ],

                }
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
                    this.ruleForm.codePic=data;
                })

            },
            fresh(){//点击重新刷新验证码
                this.ruleForm.codePic=this.getValidateCode()
            },
            submitForm(formName) {// 点击确认
                this.$router.push('/HelloWorld')
                var jsonArr = [];
                jsonArr.push({key:"userName",value:this.ruleForm.username});
                jsonArr.push({key:"password",value:this.ruleForm.password});
                jsonArr.push({key:"validateCode",value:this.ruleForm.code});
                let sign =EncryptReplace(md5(preSign(jsonArr)));
                let params ={'userName': EncryptReplace(this.ruleForm.username), 'password': EncryptReplace(this.ruleForm.password), 'validateCode': EncryptReplace(this.ruleForm.code),'sign':sign}
                console.log(params)
                https.fetchPost('/admin/login',params).then((data) => {
                    if(data.data.code== 'success'){
                        alert(data.data.message)

                    }else if(data.data.code=='error'){
                        alert(data.data.message)
                    }
                }).catch(err=>{
                        console.log(err)
                    }
                )
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>
.demo-ruleForm{
  margin-left: 30%;
  margin-top: 15%;
  width: 500px;
}
  .code-img{
    width: 180px;
    height:40px;
    border: 1px solid black;
    position: relative;
    left: 220px;
    top: -40px;
    background:no-repeat;
  }
  .code-image{
    width: 180px;
    height:40px;
  }
  .submit{
    position: relative;
    left: 100px;
  }
  .reset{
    position: relative;
    left: 100px;
  }
</style>
