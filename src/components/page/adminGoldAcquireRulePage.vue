<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 金币获取规则设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    v-model="query.businessCode"
                    placeholder="请选择商家"
                    class="mr10"
                    clearable
                    @change="changeBusiness"
                >
                    <el-option
                        v-for="item in businessInfo"
                        :key="item.businessCode"
                        :label="item.businessName"
                        :value="item.businessCode"
                    ></el-option>
                </el-select>
                <el-button
                    style="margin-top: 10px;margin-left: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="Search"
                >搜索</el-button>
            </div>
            <el-form v-model="oForm">
                <el-form-item :required="true" label="邀请注册获得金币数量" :label-width="formLabelWidth">
                    <el-input
                        disabled
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                        style="width: 250px"
                        v-model="oForm.miniRegisterNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="1积分兑换" :label-width="formLabelWidth">
                    <el-input
                        disabled
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                        style="width: 250px"
                        v-model="oForm.pointChangePercent"
                        autocomplete="off"
                    ></el-input>金币
                </el-form-item>
            </el-form>
            <!-- <div style="float: right" slot="footer" class="dialog-footer">
                <el-button style="float: right;margin-top: -10px" type="primary" @click="addPage">确 定</el-button>
            </div>-->
        </div>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import { Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend } from '@/aes/utils';
import md5 from 'js-md5';
import axios from 'axios';
import https from '../../https';
export default {
    name: 'basetable',
    data() {
        return {
            userName: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            tableData: [],
            businessInfo: [],
            pageTotal: 0,
            form: {
                memo: '',
                sort: '',
                id: ''
            },
            oForm: {
                userName: '',
                userPass: '',
                value: '',
                realName: '',
                callNumber: '',
                businessCode: '',
                memo: ''
            },
            idx: -1,
            id: -1,
            formLabelWidth: '120px',
            selectValue: {},
            selectCode: {},
            options: [
                {
                    value: '1',
                    label: '正常'
                },
                {
                    value: '2',
                    label: '禁用'
                }
            ],
            value: ''
        };
    },
    created() {},
    mounted() {
        this.getAllBusiness();
    },
    methods: {
        addPage() {
            //获取新增按钮权限
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if (!this.oForm.miniRegisterNumber || !this.oForm.pointChangePercent) {
                this.message = '必填项不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: this.oForm.id });
            jsonArr.push({ key: 'miniRegisterNumber', value: this.oForm.miniRegisterNumber });
            jsonArr.push({ key: 'pointChangePercent', value: this.oForm.pointChangePercent });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            console.log(jsonArr);
            setTimeout(() => {
                https.fetchPost('/goldAcquireRule/updateGoldAcquireRule', params).then(data => {
                    loading.close();
                    console.log(data);
                    if (data.data.code == 'success') {
                        this.$message.success(`成功`);
                        this.getMenu();
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    } else {
                        this.message = data.data.message;
                        this.open();
                    }
                });
            }, 500);
        },
        Search() {
            this.query.pageNo = 1;
            this.getMenu();
        },
        getAllBusiness() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            https
                .fetchPost('/businessInfo/getBusinessList')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.businessInfo = res;
                        this.query.businessCode = res[0].businessCode;
                        this.getMenu();
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    } else {
                        this.message = data.data.message;
                        this.open();
                    }
                })
                .catch(err => {
                    loading.close();
                    console.log(err);
                });
        },
        changeBusiness(val) {
            this.query.businessCode = val;
            this.$forceUpdate();
        },
        getMenu() {
            //获取菜单栏
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let businessCode = this.query.businessCode;
                if (!businessCode) {
                    businessCode = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'businessCode', value: businessCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/admin/goldAcquireRule/page', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            if (data.data && data.data.data) {
                                this.oForm = JSON.parse(Decrypt(data.data.data));
                            } else {
                                this.oForm.miniRegisterNumber = '';
                                this.oForm.pointChangePercent = '';
                            }
                        } else if (data.data.code == 'nologin') {
                            this.message = data.data.message;
                            this.open();
                            this.$router.push('/login');
                        } else {
                            this.message = data.data.message;
                            this.open();
                        }
                    })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                    });
            }, 1000);
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}
</style>
