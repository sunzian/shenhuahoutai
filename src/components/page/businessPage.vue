<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影管管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="影管名称" class="handle-input mr10"></el-input>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="影管名称">
                    <template slot-scope="scope">{{scope.row.businessName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影管描述">
                    <template slot-scope="scope">{{scope.row.businessMemo}}</template>
                </el-table-column>
                <el-table-column prop="logo" label="影管logo">
                    <template slot-scope="scope">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="hover">
                            <img style="width: 400px" :src="scope.row.businessLogo"/>
                            <img slot="reference" :src="scope.row.businessLogo" :alt="scope.row.businessLogo" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="联系人信息">
                    <template slot-scope="scope">{{scope.row.businessMobile}}</template>
                </el-table-column>
                <!--<el-table-column prop="year" label="金币过期年数">-->
                    <!--<template slot-scope="scope">{{scope.row.goldExpireYears}}</template>-->
                <!--</el-table-column>-->
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="delChange(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageNo"
                    :page-size="query.pageSize"
                    :total="query.totalCount"
                    @current-change="currentChange"
                    @prev-click="prev"
                    @next-click="next"
                ></el-pagination>
            </div>
        </div>
        <!--新增弹出框-->
        <el-dialog title="新增影城" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="商家名" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        maxlength="10"
                        show-word-limit
                        v-model="oForm.name"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商家描述" :label-width="formLabelWidth">
                    <el-input
                        maxlength="30"
                        type="textarea"
                        :rows="2"
                        show-word-limit
                        v-model="oForm.memo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商家logo" :label-width="formLabelWidth">
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            :limit="1"
                            class="upload-demo"
                            drag
                            ref="upload"
                            action="/api/upload/uploadImage"
                            :on-success="onSuccess"
                            multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb 建议尺寸200*200或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商家电话" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        v-model="oForm.mobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <!--<el-form-item label="金币过期年数" :label-width="formLabelWidth">-->
                    <!--<el-input-->
                        <!--style="width: 150px"-->
                        <!--maxlength="9"-->
                        <!--v-model.number="oForm.goldExpireYears"-->
                        <!--autocomplete="off"-->
                    <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="会员卡积分兑换比例" :label-width="formLabelWidth">-->
                    <!--<el-input-->
                        <!--style="width: 150px"-->
                        <!--maxlength="9"-->
                        <!--v-model.number="oForm.percentageOfPointsIntoGold"-->
                        <!--autocomplete="off"-->
                    <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="过期优惠券是否发送短信通知会员" :label-width="formLabelWidth">-->
                    <!--<el-select v-model="oForm.messageForExpireTickets" placeholder="请选择">-->
                        <!--<el-option-->
                                <!--v-for="item in options"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value"-->
                        <!--&gt;</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="优惠券到期前几天发送短信通知会员" :label-width="formLabelWidth">-->
                    <!--<el-input-->
                        <!--style="width: 150px"-->
                        <!--maxlength="9"-->
                        <!--v-model.number="oForm.aheadDaysForMessage"-->
                        <!--autocomplete="off"-->
                    <!--&gt;</el-input>-->
                <!--</el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="商家名称">
                    <el-input
                        style="width: 250px"
                        maxlength="10"
                        show-word-limit
                        v-model="oName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商家描述">
                    <el-input
                        maxlength="30"
                        type="textarea"
                        :rows="2"
                        show-word-limit
                        v-model.trim="oMemo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商家logo">
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            :limit="1"
                            class="upload-demo"
                            drag
                            ref="upload"
                            action="/api/upload/uploadImage"
                            :on-success="unSuccess"
                            multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb 建议尺寸200*200或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商家电话">
                    <el-input
                            style="width: 250px"
                            v-model="oMobile"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <!--<el-form-item label="金币过期年数">-->
                    <!--<el-input-->
                        <!--style="width: 70px"-->
                        <!--min="1"-->
                        <!--maxlength="7"-->
                        <!--v-model.trim="oGold"-->
                        <!--autocomplete="off"-->
                    <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="会员卡积分兑换比例">-->
                    <!--<el-input-->
                            <!--style="width: 250px"-->
                            <!--min="1"-->
                            <!--maxlength="7"-->
                            <!--v-model.trim="oPercentageOfPointsIntoGold"-->
                            <!--autocomplete="off"-->
                    <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="过期优惠券是否发送短信通知会员">-->
                    <!--<el-select v-model="oMessageForExpireTickets" placeholder="请选择">-->
                        <!--<el-option-->
                                <!--v-for="item in options"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value"-->
                        <!--&gt;</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="优惠券到期前几天发送短信通知会员">-->
                    <!--<el-input-->
                            <!--style="width: 70px"-->
                            <!--min="1"-->
                            <!--maxlength="7"-->
                            <!--v-model.trim="oAheadDaysForMessage"-->
                            <!--autocomplete="off"-->
                    <!--&gt;</el-input>-->
                <!--</el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
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
            options: [{
                value: '0',
                label: '否'
            }, {
                    value: '1',
                    label: '是'
                }],
            type:{
                type: ""
            },
            oName: '',
            oId: '',
            oMemo: '',
            oLogo: '',
            oMobile: '',
            oGold: '',
            oPercentageOfPointsIntoGold: '',
            oMessageForExpireTickets: '',
            oAheadDaysForMessage: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            form: [],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            oForm: {
                name: '',
                memo: '',
                logo: '',
                mobile: '',
                goldExpireYears: '',
                percentageOfPointsIntoGold: '',
                messageForExpireTickets: '',
                aheadDaysForMessage: '',
                ticketingSystemType: '',
                ticketingSystemAccount: '',
                ticketingSystemPassword: '',
                miniAppId: '',
                interfaceAddress: '',
                memberInterfaceAddress: ''
            },
            formLabelWidth: '160px',
            selectValue: {},
            value: ''
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        beforeUpload(){//上传之前
            this.type.type=EncryptReplace('business')
        },
        onSuccess(data){//上传文件 登录超时
            console.log(data);
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.upload.clearFiles();
                return;
            }
            this.oForm.logo=data.data
            if(data.code=='nologin'){
                this.message=data.message
                this.open()
                this.$router.push('/login');
            }
        },
        unSuccess(data){//上传文件 登录超时
            // console.log(data);
            // console.log(data);
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.upload.clearFiles();
                return;
            }
            this.oLogo=data.data
            if(data.code=='nologin'){
                this.message=data.message
                this.open()
                this.$router.push('/login');
            }
        },
        addPage() {
            //获取新增按钮权限
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            https
                .fetchPost('/businessInfo/addPage', '')
                .then(data => {
                    loading.close();
                    console.log(data);
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = true;
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
        addRole() {
            //新增按钮操作
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            jsonArr.push({ key: 'businessName', value: this.oForm.name });
            jsonArr.push({ key: 'businessMemo', value: this.oForm.memo });
            jsonArr.push({ key: 'businessLogo', value: this.oForm.logo });
            jsonArr.push({ key: 'businessMobile', value: this.oForm.mobile });
            // jsonArr.push({ key: 'goldExpireYears', value: this.oForm.goldExpireYears });
            // jsonArr.push({ key: 'percentageOfPointsIntoGold', value: this.oForm.percentageOfPointsIntoGold });
            // jsonArr.push({ key: 'messageForExpireTickets', value: this.oForm.messageForExpireTickets });
            // jsonArr.push({ key: 'aheadDaysForMessage', value: this.oForm.aheadDaysForMessage });
            jsonArr.push({ key: 'ticketingSystemType', value: this.oForm.ticketingSystemType });
            jsonArr.push({ key: 'ticketingSystemAccount', value: this.oForm.ticketingSystemAccount });
            jsonArr.push({ key: 'ticketingSystemPassword', value: this.oForm.ticketingSystemPassword });
            jsonArr.push({ key: 'miniAppId', value: this.oForm.miniAppId });
            jsonArr.push({ key: 'interfaceAddress', value: this.oForm.interfaceAddress });
            jsonArr.push({ key: 'memberInterfaceAddress', value: this.oForm.memberInterfaceAddress });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/businessInfo/addBusinessInfo', params)
                    .then(data => {
                        loading.close();
                        //新增
                        // console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.$refs.upload.clearFiles();//清除已上传文件
                            this.oForm.name = '';
                            this.oForm.memo = '';
                            this.oForm.logo = '';
                            this.oForm.mobile = '';
                            this.oForm.goldExpireYears = '';
                            this.oForm.percentageOfPointsIntoGold = '';
                            this.oForm.messageForExpireTickets = '';
                            this.oForm.aheadDaysForMessage = '';
                            this.oForm.ticketingSystemType = '';
                            this.oForm.ticketingSystemAccount = '';
                            this.oForm.ticketingSystemPassword = '';
                            this.oForm.miniAppId = '';
                            this.oForm.interfaceAddress = '';
                            this.oForm.memberInterfaceAddress = '';
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
            }
        },
        delChange(index, row) {
            //删除数据
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)',
                        target: document.querySelector('.div1')
                    });
                    this.idx = index;
                    this.form = row;
                    let name = this.query.name;
                    let status = this.query.status;
                    if (!name) {
                        name = '';
                    }
                    if (!status) {
                        status = '';
                    }
                    let jsonArr = [];
                    jsonArr.push({ key: 'id', value: row.id });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchDelete('/businessInfo/deleteBusinessInfo', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.$message.error(`删除了`);
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
                })   .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        addChange(index, row) {
            //是否拥有修改权限
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            this.idx = index;
            this.form = row;
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/businessInfo/modifyPage', params)
                .then(data => {
                    loading.close();
                    // console.log(data);
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.oName = JSON.parse(Decrypt(data.data.data)).businessName;
                        this.oMemo = JSON.parse(Decrypt(data.data.data)).businessMemo;
                        this.oMobile = JSON.parse(Decrypt(data.data.data)).businessMobile;
                        this.oLogo = JSON.parse(Decrypt(data.data.data)).businessLogo;
                        this.oGold = JSON.parse(Decrypt(data.data.data)).goldExpireYears;
                        this.oPercentageOfPointsIntoGold = JSON.parse(Decrypt(data.data.data)).percentageOfPointsIntoGold;
                        for (let x in this.options) {
                            if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).messageForExpireTickets) {
                                this.oMessageForExpireTickets = this.options[x].value;
                                break;
                            }
                        }
                        this.oAheadDaysForMessage = JSON.parse(Decrypt(data.data.data)).aheadDaysForMessage;
                        this.oId = JSON.parse(Decrypt(data.data.data)).id;
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
        // 编辑操作
        exChanger() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            // jsonArr.push({ key: 'goldExpireYears', value: this.oGold });
            jsonArr.push({ key: 'businessName', value: this.oName });
            jsonArr.push({ key: 'businessMobile', value: this.oMobile });
            jsonArr.push({ key: 'businessMemo', value: this.oMemo });
            jsonArr.push({ key: 'businessLogo', value: this.oLogo });
            // jsonArr.push({ key: 'percentageOfPointsIntoGold', value: this.oPercentageOfPointsIntoGold });
            // jsonArr.push({ key: 'messageForExpireTickets', value: this.oMessageForExpireTickets });
            // jsonArr.push({ key: 'aheadDaysForMessage', value: this.oAheadDaysForMessage });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            console.log(params);
            console.log(jsonArr);
            this.editVisible = false;
            https
                .fetchPost('/businessInfo/updateById', params)
                .then(data => {
                    loading.close();
                    console.log(data);
                    if (data.data.code == 'success') {
                        this.$refs.upload.clearFiles();//清除已上传文件
                        this.$message.success(`编辑成功`);
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
        Search() {
            this.query.pageNo = 1;
            this.getMenu();
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
            let name = this.query.name;
            let status = this.query.status;
            if (!name) {
                name = '';
            }
            if (!status) {
                status = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'businessName', value: name });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/businessInfo/businessInfoPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
                        // console.log(this.query);
                        this.tableData = oData.data;
                        this.query.pageSize = oData.pageSize;
                        this.query.pageNo = oData.pageNo;
                        this.query.totalCount = oData.totalCount;
                        this.query.totalPage = oData.totalPage;
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
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        currentChange(val) {
            //点击选择具体页数
            this.query.pageNo = val;
            this.getMenu();
        },
        prev() {
            //分页按钮上一页
            this.query.pageNo--;
            this.getMenu();
        },
        next() {
            //分页按钮下一页
            this.query.pageNo++;
            this.getMenu();
        }
    }
};
</script>

<style scoped>
    .handle-box {
        width: 100%;
        margin-bottom: 20px;
        font-size: 14px;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .mr10 {
        width: 16%;
        margin-right: 10px;
    }
</style>

