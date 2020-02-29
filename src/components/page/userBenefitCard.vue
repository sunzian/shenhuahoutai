<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 权益卡用户列表
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
                    placeholder="用户名"
                    v-model="query.userName"
                    autocomplete="off"
                    class="mr10"
                    style="margin-top: 10px;"
                ></el-input>
                <el-input
                    placeholder="手机号"
                    v-model="query.phone"
                    autocomplete="off"
                    class="mr10"
                    style="margin-top: 10px;"
                ></el-input>
                <el-input
                    placeholder="权益卡名称"
                    v-model="query.benefitName"
                    autocomplete="off"
                    class="mr10"
                    style="margin-top: 10px;"
                ></el-input>
                <el-input
                    placeholder="订单号"
                    v-model="query.orderNumber"
                    autocomplete="off"
                    class="mr10"
                    style="margin-top: 10px;"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.benefitStatus"
                    placeholder="权益卡状态"
                    class="handle-select mr10"
                    style="margin-top: 10px;"
                >
                    <el-option key="0" label="失效" value="0"></el-option>
                    <el-option key="1" label="正常" value="1"></el-option>
                    <el-option key="3" label="过期" value="3"></el-option>
                    <el-option key="4" label="续卡" value="4"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.payStatus"
                    placeholder="支付状态"
                    class="handle-select mr10"
                    style="margin-top: 10px;"
                >
                    <el-option key="0" label="未支付" value="0"></el-option>
                    <el-option key="1" label="已支付" value="1"></el-option>
                    <el-option key="2" label="支付失败" value="2"></el-option>
                </el-select>
                <el-date-picker
                        v-model="query.startTime"
                        type="datetime"
                        class="mr10"
                        style="margin-top: 10px;"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        default-time="06:00:00"
                        placeholder="过期时间（起）"
                ></el-date-picker>
                <el-date-picker
                        v-model="query.endTime"
                        type="datetime"
                        class="mr10"
                        style="margin-top: 10px;"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="过期时间（止）"
                ></el-date-picker>
                <el-date-picker
                        v-model="query.payStartTime"
                        type="datetime"
                        class="mr10"
                        style="margin-top: 10px;"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        default-time="06:00:00"
                        placeholder="支付时间（起）"
                ></el-date-picker>
                <el-date-picker
                        v-model="query.payEndTime"
                        type="datetime"
                        class="mr10"
                        style="margin-top: 10px;"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="支付时间（止）"
                ></el-date-picker>
                <el-button
                        type="primary"
                        @click="derive"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-right:10px;margin-top: 10px;"
                >导出</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    style="width: 90px;margin-left: 0"
                    @click="Search"
                >搜索</el-button>
            </div>
            <div class="handle-box">
                支付金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.payPrice"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>累计优惠金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalDiscountMoney"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                height="500"
                ref="multipleTable"
                highlight-current-row
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="影院名称" width="220">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="用户" width="120">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号" width="120">
                    <template slot-scope="scope">{{scope.row.phone}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="权益卡名称" width="160">
                    <template slot-scope="scope">{{scope.row.benefitName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="实付" width="60">
                    <template slot-scope="scope">{{scope.row.payPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="累计优惠" width="80">
                    <template slot-scope="scope">{{scope.row.totalDiscountMoney}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付时间" width="160">
                    <template slot-scope="scope">{{scope.row.payTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="生效时间" width="160">
                    <template slot-scope="scope">{{scope.row.startDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="过期时间" width="160">
                    <template slot-scope="scope">{{scope.row.endDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="订单号" width="240">
                    <template slot-scope="scope">{{scope.row.orderNumber}}</template>
                </el-table-column>
                <el-table-column label="支付状态" align="center" width="80" fixed="right">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.payStatus=='0'">未支付</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='1'">已支付</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='2'">支付失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.benefitStatus=='0'">失效</el-tag>
                        <el-tag v-else-if="scope.row.benefitStatus=='1'">正常</el-tag>
                        <el-tag v-else-if="scope.row.benefitStatus=='2'">作废</el-tag>
                        <el-tag v-else-if="scope.row.benefitStatus=='3'">过期</el-tag>
                        <el-tag v-else-if="scope.row.benefitStatus=='4'">续卡</el-tag>
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
                let userName = this.query.userName;
                let benefitStatus = this.query.benefitStatus;
                let payStatus = this.query.payStatus;
                let orderNumber = this.query.orderNumber;
                let benefitName = this.query.benefitName;
                let phone = this.query.phone;
                let startTime = this.query.startTime;
                let endTime = this.query.endTime;
                let payStartTime = this.query.payStartTime;
                let payEndTime = this.query.payEndTime;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!userName) {
                    userName = '';
                }
                if (!benefitStatus) {
                    benefitStatus = '';
                }
                if (!payStatus) {
                    payStatus = '';
                }
                if (!orderNumber) {
                    orderNumber = '';
                }
                if (!benefitName) {
                    benefitName = '';
                }
                if (!phone) {
                    phone = '';
                }
                if (!startTime) {
                    startTime = '';
                }
                if (!endTime) {
                    endTime = '';
                }
                if (!payStartTime) {
                    payStartTime = '';
                }
                if (!payEndTime) {
                    payEndTime = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'tableName', value: "user_benefitCard" });
                jsonArr.push({ key: 'exportKeysJson', value: "['cinemaName','orderNumber', 'userName', 'phone', 'benefitName','payPrice','totalDiscountMoney','payTime',   'startDate', 'endDate','stringPayStatus','stringBenefitStatus']"});
                jsonArr.push({ key: 'exportTitlesJson', value:"['影院名称','订单号', '用户', '手机号', '权益卡名称','实付', '累计优惠', '支付时间', '生效时间', '过期时间', '支付状态', '状态']" });
                jsonArr.push({ key: 'startTime', value: startTime });
                jsonArr.push({ key: 'endTime', value: endTime });
                jsonArr.push({ key: 'payStartTime', value: payStartTime });
                jsonArr.push({ key: 'payEndTime', value: payEndTime });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'userName', value: userName });
                jsonArr.push({ key: 'benefitStatus', value: benefitStatus });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'orderNumber', value: orderNumber });
                jsonArr.push({ key: 'benefitName', value: benefitName });
                jsonArr.push({ key: 'phone', value: phone });
                var params = ParamsAppend(jsonArr);
                let myObj = {
                    method: 'get',
                    url: '/exportExcel/userBenefitCard',
                    fileName: '权益卡用户列表统计',
                    params: params
                };
                https.exportMethod(myObj);
                loading.close();
            }, 1500);
        },
        addChange(index, row) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: row.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/memberCardConsume/getMemberCardConsumeById', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.editVisible = true;
                            this.form = oData;
                            if (oData.status == 1) {
                                this.form.status = '成功';
                            } else if (oData.status == 2) {
                                this.form.status = '失败';
                            }
                            if (oData.orderType == 1) {
                                this.form.orderType = '购票';
                            } else if (oData.orderType == 2) {
                                this.form.orderType = '卖品';
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
            }, 500);
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
                let userName = this.query.userName;
                let benefitStatus = this.query.benefitStatus;
                let payStatus = this.query.payStatus;
                let orderNumber = this.query.orderNumber;
                let benefitName = this.query.benefitName;
                let phone = this.query.phone;
                let startTime = this.query.startTime;
                let endTime = this.query.endTime;
                let payStartTime = this.query.payStartTime;
                let payEndTime = this.query.payEndTime;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!userName) {
                    userName = '';
                }
                if (!benefitStatus) {
                    benefitStatus = '';
                }
                if (!payStatus) {
                    payStatus = '';
                }
                if (!orderNumber) {
                    orderNumber = '';
                }
                if (!benefitName) {
                    benefitName = '';
                }
                if (!phone) {
                    phone = '';
                }
                if (!startTime) {
                    startTime = '';
                }
                if (!endTime) {
                    endTime = '';
                }
                if (!payStartTime) {
                    payStartTime = '';
                }
                if (!payEndTime) {
                    payEndTime = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'startTime', value: startTime });
                jsonArr.push({ key: 'endTime', value: endTime });
                jsonArr.push({ key: 'payStartTime', value: payStartTime });
                jsonArr.push({ key: 'payEndTime', value: payEndTime });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'userName', value: userName });
                jsonArr.push({ key: 'benefitStatus', value: benefitStatus });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'orderNumber', value: orderNumber });
                jsonArr.push({ key: 'benefitName', value: benefitName });
                jsonArr.push({ key: 'phone', value: phone });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/userBenefitCard/list', params)
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

