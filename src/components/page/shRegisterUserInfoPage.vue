<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 神画活动报名记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.cinemaCode" placeholder="请选择影院" class="mr10">
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="手机号码"
                    v-model="query.userMobile"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <!-- <el-select
                    clearable
                    v-model="query.giftType"
                    placeholder="礼物类型"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="优惠券" value="1"></el-option>
                    <el-option key="2" label="实物" value="2"></el-option>
                </el-select> -->
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    style="margin-top: 10px;width: 90px;"
                    @click="Search"
                >搜索</el-button>
                <el-button
                        type="primary"
                        @click="derive"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px"
                >导出</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                highlight-current-row
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="用户名称">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="用户手机号">
                    <template slot-scope="scope">{{scope.row.userMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="用户生日">
                    <template slot-scope="scope">{{scope.row.birthday}}</template>
                </el-table-column>
                <el-table-column label="用户性别">
                    <template slot-scope="scope">{{scope.row.userSex}}</template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="query.pageNo"
                        :page-sizes="[10, 15, 20, 30]"
                        :page-size="query.pageSize"
                        :total="query.totalCount"
                        @current-change="currentChange"
                        @prev-click="prev"
                        @next-click="next"
                ></el-pagination>
            </div>
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
            totalData: [],
            tableData: [],
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            formLabelWidth: '120px',
            businessInfoList: [],
            value: '',
            form: [],
            cinemaInfo: []
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
                derive(){
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let cinemaCode = this.query.cinemaCode;
                let userMobile = this.query.userMobile;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!userMobile) {
                    userMobile = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'tableName', value: "ticket_order" });
                jsonArr.push({ key: 'exportKeysJson', value: "['cinemaName','userName','userMobile','birthday','userSex']"});
                jsonArr.push({ key: 'exportTitlesJson', value:"['影院名称','用户名','用户手机号','生日','性别']" });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'userMobile', value: userMobile });
                var params = ParamsAppend(jsonArr);
                let myObj = {
                    method: 'get',
                    url: '/exportExcel/shRegisterUserInfo',
                    fileName: '神画活动报名记录',
                    params: params
                };
                https.exportMethod(myObj);
                loading.close();
            }, 1500);
        },
        Search() {
            this.query.pageNo = 1;
            this.getMenu();
        },
        getAllCinema() {
            https
                .fetchPost('/cinema/getAllCinema')
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.cinemaInfo = res;
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
                    console.log(err);
                });
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
                let cinemaCode = this.query.cinemaCode;
                let userMobile = this.query.userMobile;
                let giftType = this.query.giftType;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!userMobile) {
                    userMobile = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'userMobile', value: userMobile });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/shRegisterUserInfo/page', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.tableData = oData.data;
                            this.query.pageSize = oData.pageSize;
                            this.query.pageNo = oData.pageNo;
                            this.query.totalCount = oData.totalCount;
                            this.query.totalPage = oData.totalPage;
                            this.getAllCinema();
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
            }, 500);
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
        handleSizeChange(val) {
            this.query.pageSize=val;
            this.getMenu()
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

