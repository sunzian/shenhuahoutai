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
                <el-select
                    v-model="query.businessCode"
                    placeholder="请选择商家"
                    class="mr10"
                    style="margin-top: 10px;"
                    @change="changeBusiness"
                >
                    <el-option
                        v-for="item in businessInfo"
                        :key="item.businessCode"
                        :label="item.businessName"
                        :value="item.businessCode"
                    ></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.cinemaCode"
                    placeholder="请选择影院"
                    class="mr10"
                    style="margin-top: 10px;"
                >
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
                <el-input placeholder="手机号" v-model="query.phone" autocomplete="off" class="mr10"></el-input>
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
                    icon="el-icon-search"
                    style="margin-top: 10px;width: 90px;"
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
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="用户" width="100">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号" width="140">
                    <template slot-scope="scope">{{scope.row.phone}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="权益卡名称">
                    <template slot-scope="scope">{{scope.row.benefitName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="订单号">
                    <template slot-scope="scope">{{scope.row.orderNumber}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付金额">
                    <template slot-scope="scope">{{scope.row.payPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="累计优惠金额">
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
                <el-table-column label="支付状态" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.payStatus=='0'">未支付</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='1'">已支付</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='2'">支付失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="权益卡状态" align="center" width="100">
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
            cinemaInfo: [],
            businessInfo: []
        };
    },
    created() {},
    mounted() {
        this.getAllBusiness();
        this.getMenu();
    },
    methods: {
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
                            console.log(oData);
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
        },
        changeBusiness(val) {
            this.query.businessCode = val;
            this.getAllCinema();
            this.$forceUpdate();
        },
        // 获取所有影院
        getAllCinema() {
            if (!this.query.businessCode) {
                return;
            }
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            jsonArr.push({ key: 'businessCode', value: this.query.businessCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinema/getCinemaListByBusinessCode', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.cinemaInfo = res;
                        console.log(res);
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
                if (!businessCode) {
                    businessCode = '';
                }
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
                jsonArr.push({ key: 'businessCode', value: businessCode });
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
                console.log(jsonArr);
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/admin/userBenefitCard/list', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            if (data.data && data.data.data) {
                                var oData = JSON.parse(Decrypt(data.data.data));
                                this.tableData = oData.pageResult.data;
                                this.totalData = oData.statistics;
                                this.query.pageSize = oData.pageResult.pageSize;
                                this.query.pageNo = oData.pageResult.pageNo;
                                this.query.totalCount = oData.pageResult.totalCount;
                                this.query.totalPage = oData.pageResult.totalPage;
                            } else {
                                this.tableData = [];
                                this.totalData = [];
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
        },
        handleSizeChange(val) {
            this.query.pageSize = val;
            this.getMenu();
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

