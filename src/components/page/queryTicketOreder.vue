<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 查询影票订单
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button style="float: right" type="warning" @click="addPage">查询影票订单</el-button>
            </div>
            <el-form v-model="oForm">
                <el-form-item label="订单号" :label-width="formLabelWidth">
                    <el-input style="width: 350px" v-model="oForm.orderCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-divider></el-divider>
            </el-form>
            <el-form v-model="oForm">
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-input :disabled="true" onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 250px"
                              v-model="oForm.status" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="出票状态" :label-width="formLabelWidth">
                    <el-input :disabled="true" onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 250px"
                              v-model="oForm.printStatus" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="退票状态" :label-width="formLabelWidth">
                    <el-input :disabled="true" onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 250px"
                              v-model="oForm.cancelStatus" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="接口入参" :label-width="formLabelWidth">
                    <el-input :disabled="true" type="textarea" :rows="8" onkeyup="this.value=this.value.replace(/\D/g,'')"
                              style="width: 600px" v-model="oForm.interfaceInput" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="接口出参" :label-width="formLabelWidth">
                    <el-input :disabled="true" type="textarea" :rows="8" onkeyup="this.value=this.value.replace(/\D/g,'')"
                              style="width: 600px" v-model="oForm.interfaceOutput" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {fetchData} from '../../api/index';
    import {Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend} from '@/aes/utils';
    import md5 from 'js-md5';
    import axios from 'axios';
    import https from "../../https";
    export default {
        name: 'basetable',
        data() {
            return {
                userName: '',
                message: '',//弹出框消息
                drawer: false,//弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 15
                },
                tableData: [],
                cinemaInfo: [],
                filmInfo: [],
                sellTableData: [],
                pageTotal: 0,
                form: {
                    memo: '',
                    sort: '',
                    id: '',
                },
                oForm: {
                    userName: '',
                    userPass: '',
                    value: '',
                    realName: '',
                    callNumber: '',
                    businessCode: '',
                    memo: '',
                    printStatus: '',
                    cancelStatus: '',
                    interfaceInput: '',
                    interfaceOutput: '',
                    status: '',
                },
                idx: -1,
                id: -1,
                formLabelWidth: '120px',
                selectValue: {},
                selectCode: {},
                sessionId: '',
                sessionTime: '',
                options: [{
                    value: '1',
                    label: '正常'
                },
                    {
                        value: '2',
                        label: '禁用'
                    }],
                value: ''
            };
        },
        created() {
        },
        mounted() {
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
                var jsonArr = [];
                jsonArr.push({key: 'orderCode', value: this.oForm.orderCode});
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                let params = ParamsAppend(jsonArr);
                setTimeout(() => {
                    https.fetchPost('/interface/queryTicketOrder', params)
                        .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.$message.success(`成功`);
                                    // this.getMenu();
                                    console.log(JSON.parse(Decrypt(data.data.data)));
                                    // this.oForm.printStatus = JSON.parse(Decrypt(data.data.data)).printStatus;
                                    if(JSON.parse(Decrypt(data.data.data)).printStatus=="Yes"){
                                        this.oForm.printStatus='已出票'
                                    }else{
                                        this.oForm.printStatus='未出票'
                                    }
                                    if(JSON.parse(Decrypt(data.data.data)).cancelStatus=="Yes"){
                                        this.oForm.cancelStatus='已退票'
                                    }else{
                                        this.oForm.cancelStatus='未退票'
                                    }
                                    // this.oForm.cancelStatus = JSON.parse(Decrypt(data.data.data)).cancelStatus;
                                    this.oForm.interfaceInput = JSON.parse(Decrypt(data.data.data)).interfaceInput;
                                    this.oForm.interfaceOutput = JSON.parse(Decrypt(data.data.data)).interfaceOutput;
                                    this.oForm.status = JSON.parse(Decrypt(data.data.data)).status;
                                } else if (data.data.code == 'nologin') {
                                    this.message = data.data.message;
                                    this.open();
                                    this.$router.push('/login');
                                } else {
                                    this.message = data.data.message;
                                    this.open();
                                }
                            }
                        )
                }, 500);
            },
            open() {
                //信息提示弹出框
                this.$alert(this.message, '信息提示', {
                    dangerouslyUseHTMLString: true
                });
            },
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
</style>
