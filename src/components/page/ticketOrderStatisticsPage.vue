<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影票帐单
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select  style="margin-bottom: 10px" clearable v-model="query.cinemaCode" placeholder="请选择影院" class="mr10">
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-date-picker
                    v-model="query.startDate"
                    type="datetime"
                    class="mr10"
                    style="margin-bottom: 10px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    default-time="06:00:00"
                    placeholder="支付开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.endDate"
                    type="datetime"
                    class="mr10"
                    style="margin-bottom: 10px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="支付结束时间（止）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.sessionStartDate"
                    type="datetime"
                    class="mr10"
                    style="margin-bottom: 10px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    default-time="06:00:00"
                    placeholder="场次开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.sessionEndDate"
                    type="datetime"
                    class="mr10"
                    style="margin-bottom: 10px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="场次结束时间（止）"
                ></el-date-picker>
                <el-button
                        type="primary"
                        icon="el-icon-search"
                        style="width: 90px;margin-left: 0"
                        @click="Search"
                >搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                highlight-current-row
            >
                <!-- <el-table-column label="影院名称">
                    <template slot-scope="scope">{{scope.row.submitOrderCode}}</template>
                </el-table-column> -->
                <el-table-column label="订单数">
                    <template slot-scope="scope">{{scope.row.totalOrderNum}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影票数">
                    <template slot-scope="scope">{{scope.row.totalTicketNum}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="票款">
                    <template slot-scope="scope">{{scope.row.totalTicketPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="退票数">
                    <template slot-scope="scope">{{scope.row.totalRefundTicketNum}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="退款">
                    <template slot-scope="scope">{{scope.row.totalRefundPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="退票手续费">
                    <template slot-scope="scope">{{scope.row.totalRefundFee}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="合计影票数">
                    <template slot-scope="scope">{{scope.row.totalRealityTicketNum}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="合计票款">
                    <template slot-scope="scope">{{scope.row.totalRealityTicketPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影院服务费">
                    <template slot-scope="scope">{{scope.row.totalServiceFee}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="代售费">
                    <template slot-scope="scope">{{scope.row.totalPlatHandFee}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="实结金额">
                    <template slot-scope="scope">{{scope.row.totalActualPrice}}</template>
                </el-table-column>
                <el-table-column label="明细下载" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-upload"
                            class="blue"
                            @click="derive(scope.$index, scope.row)"
                        >导出</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
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
            </div> -->
        </div>
    </div>
</template>

<script>
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
            screenInfo: [],
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
        Search() {
            this.query.pageNo = 1;
            this.getMenu();
        },
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
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let sessionStartDate = this.query.sessionStartDate;
                let sessionEndDate = this.query.sessionEndDate;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!startDate) {
                    startDate = '';
                }
                if (!endDate) {
                    endDate = '';
                }
                if (!sessionStartDate) {
                    sessionStartDate = '';
                }
                if (!sessionEndDate) {
                    sessionEndDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'tableName', value: "ticket_order" });
                jsonArr.push({ key: 'exportKeysJson', value: "['id','cinemaCode','screenName','orderNo','submitOrderCode','sessionTime','cardNo','mobile','filmName','seatName','number','totalOriginalPrice','totalPrice','totalServiceFee','totalPlatHandFee','totalCinemaAllowance','totalLowestPrice','realisticPrice','totalActivityDiscount','totalCouponDiscount','totalActualPrice','totalReportPrice','totalSubmitPrice','chPayStatus','chPayWay','payTime','chOrderStatus','submitTime','openCardCinemaName','bindCardCinemaName','chActivityType','activityName','userCouponName','printNo','submitMessage','cancelTime','totalRefundHandFee','refundReason','tradeNo']"});
                jsonArr.push({ key: 'exportTitlesJson', value:"['ID','影院编码','影厅名称','本地单号','售票系统单号','场次时间','会员卡号','手机号','影片名称','座位','数量','应付','票价','服务费','代售费','影院补贴','最低票价','实际票价','活动优惠','优惠券优惠','实付','上报金额','回传金额','支付状态','支付方式','支付时间','订单状态','下单时间','开卡影院','消费影院','活动类型','活动名称','优惠券名称','取票码','下单失败原因','退票时间','退票手续费','退款原因','支付交易号']" });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'sessionStartDate', value: sessionStartDate });
                jsonArr.push({ key: 'sessionEndDate', value: sessionEndDate });
                console.log(jsonArr)
                var params = ParamsAppend(jsonArr);
                let myObj = {
                    method: 'get',
                    url: '/ticketOrderStatistics/export',
                    fileName: '影票帐单统计',
                    params: params
                };
                https.exportMethod(myObj);
                loading.close();
            }, 1500);
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
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let sessionStartDate = this.query.sessionStartDate;
                let sessionEndDate = this.query.sessionEndDate;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!startDate) {
                    startDate = '';
                }
                if (!endDate) {
                    endDate = '';
                }
                if (!sessionStartDate) {
                    sessionStartDate = '';
                }
                if (!sessionEndDate) {
                    sessionEndDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'sessionStartDate', value: sessionStartDate });
                jsonArr.push({ key: 'sessionEndDate', value: sessionEndDate });
                // jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                // jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/ticketOrderStatistics/page', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            let arr = [];
                            var oData = JSON.parse(Decrypt(data.data.data));
                            arr.push(oData);
                            this.tableData = arr;
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
        },
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
.red {
    color: #ff0000;
}
.mr10 {
    width: 16%;
    margin-right: 10px;
}
</style>

