<template>
    <div class="login-wrap">
        <div class="head">
            <div class="head-logo">
                <img class="wht-logo" src="../../assets/img/wht-logo.png" />
                <div>
                    <div>kaleidoscope</div>
                    <div>万·画·筒</div>
                </div>
            </div>
            <div class="team-phone">
                合作电话：
                <a>400-825-7789</a>
            </div>
        </div>

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
                    <el-input
                        v-model="param.code"
                        placeholder="验证码"
                        @keyup.enter.native="submitForm()"
                    >
                        <span slot="prepend" class="el-icon-picture-outline"></span>
                    </el-input>
                    <div v-if="show" style="color: red;margin-left: 65px;margin-top: 15px;">{{time}}</div>
                </el-form-item>
                <div class="code-img" @click="fresh">
                    <img class="code-image" :src="param.codePic" alt style />
                </div>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
        <!-- <div class="data-info">
            业务详情：多媒体技术，电子商务技术、网络技术、计算机软硬件的技术 开发、技术咨询、技术服务、成果转让代办票务:广告的设计、制作、代理、发布(儿沙及许可证的凭有效许可证经营):食品、电子产品、纸制品、橡胶制品、塑料制品，日用百货的
            销售；电影发行。(依法须经批准的项目，经相关部门批准后方可开展经营活动)
        </div> -->
        <!-- <div class="data-info">
            业务详情：<br/>通过提供助力影院自经营的互联网产品平台；为影院提供自经营的一系列解决方案，通过底层大数据的精准算法以强大的功能服务于影院的整体经营。
万画筒多媒体科技有限公司致力于服务终端影城，为影片的精准营销提供方案，增加客户的粘性，做好渠道下沉服务。
        </div> -->

        <div class="bottom">
            <div>
                <span>
                    客服电话：
                    <span>400-825-7789</span>
                </span>&nbsp;&nbsp;
                <span>业务处理邮箱：zjwanhuatong@163.com</span>
            </div>
            <div style="display: flex;align-item: center;">
                <img class="wht-logo" src="../../assets/img/wht-logo.png" />&nbsp;&nbsp;
                <span>Copyright © 2019-2020 万画筒科技公司版权所有</span>&nbsp;&nbsp;
                <!-- <span>浙江省杭州市拱墅区蓝钻天城2幢2单元1309室</span> -->
            </div>
        </div>
    </div>
</template>

<script>
import { Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend } from '@/aes/utils';
import md5 from 'js-md5';
import axios from 'axios';
import https from '../../https';
export default {
    data: function() {
        return {
            message: '',
            time: '',
            show: false,
            param: {
                username: '',
                password: '',
                code: '',
                codePic: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.checkLogin();
        this.getValidateCode();
    },
    methods: {
        getValidateCode() {
            //获取验证码的方法
            axios
                .get('/admin/validateCode', {
                    responseType: 'arraybuffer'
                })
                .then(response => {
                    return (
                        'data:image/png;base64,' +
                        btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                    );
                })
                .then(data => {
                    this.param.codePic = data;
                });
        },
        fresh() {
            //点击重新刷新验证码
            this.ruleForm.codePic = this.getValidateCode();
        },
        submitForm() {
            // localStorage.setItem('ms_username', this.param.username)
            // this.$router.push('/');
            var jsonArr = [];
            jsonArr.push({ key: 'userName', value: this.param.username });
            jsonArr.push({ key: 'password', value: this.param.password });
            jsonArr.push({ key: 'validateCode', value: this.param.code });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/admin/login', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        this.show = false;
                        console.log(data);
                        localStorage.setItem('ms_username', this.param.username);
                        this.$router.push('/dashboard');
                    } else if (data.data.code == 'error') {
                        this.show = false;
                        this.message = data.data.message;
                        this.open();
                        this.fresh();
                    } else if (data.data.code == 'wrongPassword') {
                        this.show = true;
                        this.time = '剩余输入密码次数' + JSON.parse(Decrypt(data.data.data)) + '次';
                        this.message = data.data.message;
                        this.open();
                        this.fresh();
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        checkLogin() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            https
                .fetchPost('/admin/checkLogin')
                .then(data => {
                    loading.close();
                    if (data.data.status == 0) {
                        localStorage.setItem('ms_username', data.data.message);
                        this.$router.push('/dashboard');
                    } else {
                        this.$router.push('/login');
                    }
                })
                .catch(err => {
                    loading.close();
                    console.log(err);
                });
        }
    }
};
</script>

<style scoped>
.head {
    padding: 30px 48px 19px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.head-logo {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 120px;
}
.wht-logo {
    width: 25px;
    height: 25px;
}
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #fff;
    font-size: 16px;
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
    position: relative;
    left: 50%;
    top: 15%;
    width: 350px;
    margin: -190px 0 0 210px;
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
.code-img {
    width: 90px;
    height: 30px;
    border: 1px solid black;
    position: relative;
    left: 92px;
    top: -7px;
    background: no-repeat;
}

.data-info {
    width: 500px;
    margin-left: 23%;
    position: relative;
    top: 50px;
}

.bottom {
    padding: 34px 0 19px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
</style>
