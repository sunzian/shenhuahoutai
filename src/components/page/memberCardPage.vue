<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 会员卡用户列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.cinemaCode" placeholder="请选择开卡影院" class="mr10">
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="会员卡号"
                    v-model="query.orderNo"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    placeholder="手机号"
                    v-model="query.mobile"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    placeholder="员工推荐编码"
                    v-model="query.employeeCode"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.payWay"
                    placeholder="绑卡状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="绑定" value="1"></el-option>
                    <el-option key="2" label="未绑定" value="2"></el-option>
                </el-select>
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
            <div class="handle-box">
                余额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.balance"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>积分：
                <el-input
                    style="width: 150px"
                    v-model="totalData.creditsAmount"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="开卡影院">
                    <template slot-scope="scope">{{scope.row.openCardCinemaName}}</template>
                </el-table-column>
                <el-table-column label="卡号" width="200">
                    <template slot-scope="scope">{{scope.row.cardNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="会员卡等级" width="150">
                    <template slot-scope="scope">{{scope.row.levelName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="用户名" width="140">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="开卡手机号" width="150">
                    <template slot-scope="scope">{{scope.row.userMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="员工推荐编码" width="150">
                    <template slot-scope="scope">{{scope.row.employeeCode}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="最近余额" width="120">
                    <template slot-scope="scope">{{scope.row.balance}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="最近积分" width="120">
                    <template slot-scope="scope">{{scope.row.creditsAmount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="绑定手机号码" width="140">
                    <template slot-scope="scope">{{scope.row.bindUserMobile}}</template>
                </el-table-column>
                <el-table-column label="是否被绑定" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.bindStatus=='1'">绑定</el-tag>
                        <el-tag v-else>未绑定</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="addChange(scope.$index, scope.row)"
                            v-if="scope.row.bindStatus=='1'"
                        >解绑</el-button>
                    </template>
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
                let orderNo = this.query.orderNo;
                let mobile = this.query.mobile;
                let employeeCode = this.query.employeeCode;
                let payWay = this.query.payWay;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!orderNo) {
                    orderNo = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!employeeCode) {
                    employeeCode = '';
                }
                if (!payWay) {
                    payWay = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'tableName', value: "third_party_member_card" });
                jsonArr.push({ key: 'exportKeysJson', value: "['id','openCardCinemaCode','openCardCinemaName','bindCardCinemaCode','bindCardCinemaName','employeeCode','cardNo','levelCode','levelName','userMobile','userName','cnSex','balance','creditsAmount','cnBindStatus','bindUserMobile','cnOffOrOnLine']"});
                jsonArr.push({ key: 'exportTitlesJson', value:"['ID','开卡影院编码','开卡影院名称','绑卡影院编码','绑卡影院名称','员工推荐编码','卡号','卡等级编号','卡等级名称','卡用户手机号','用户名','性别','余额','积分','绑定状态','绑卡手机号','是否线上卡']" });
                jsonArr.push({ key: 'openCardCinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'bindStatus', value: payWay });
                jsonArr.push({ key: 'cardNo', value: orderNo });
                jsonArr.push({ key: 'userMobile', value: mobile });
                var params = ParamsAppend(jsonArr);
                let myObj = {
                    method: 'get',
                    url: 'exportExcel/thirdPartyMemberCard',
                    fileName: '会员卡用户列表统计',
                    params: params
                };
                https.exportMethod(myObj);
                loading.close();
            }, 1500);
        },
        addChange(index, row) {
            this.$confirm('此操作将解绑会员卡, 是否继续?', '提示', {
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
                    setTimeout(() => {
                        this.idx = index;
                        this.form = row;
                        var jsonArr = [];
                        jsonArr.push({ key: 'id', value: row.id });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/memberCard/unbindMemberCard', params)
                            .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.message = '解绑成功！';
                                    this.open();
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
                    }, 500);
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消解绑'
                    });
                });
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
                let orderNo = this.query.orderNo;
                let mobile = this.query.mobile;
                let employeeCode = this.query.employeeCode;
                let payWay = this.query.payWay;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!orderNo) {
                    orderNo = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!employeeCode) {
                    employeeCode = '';
                }
                if (!payWay) {
                    payWay = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'openCardCinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'cardNo', value: orderNo });
                jsonArr.push({ key: 'userMobile', value: mobile });
                jsonArr.push({ key: 'employeeCode', value: employeeCode });
                jsonArr.push({ key: 'bindStatus', value: payWay });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/memberCard/memberCardPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.tableData = oData.pageResult.data;
                            this.totalData = oData.statistics;
                            this.query.pageSize = oData.pageResult.pageSize;
                            this.query.pageNo = oData.pageResult.pageNo;
                            this.query.totalCount = oData.pageResult.totalCount;
                            this.query.totalPage = oData.pageResult.totalPage;
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

