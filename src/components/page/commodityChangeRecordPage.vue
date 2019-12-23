<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 金币商城订单
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.cinemaCode" @change="changeSearchCinema" placeholder="请选择影院" class="mr10">
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-select clearable v-model="query.partnerCode" placeholder="请选择商家" class="mr10">
                    <el-option
                        v-for="item in partnerInfo"
                        :key="item.partnerCode"
                        :label="item.partnerName"
                        :value="item.partnerCode"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="商品名称"
                    class="mr10"
                    v-model="query.commodityName"
                    autocomplete="off"
                ></el-input>
                <el-input placeholder="订单号" class="mr10" v-model="query.orderNo" autocomplete="off"></el-input>
                <el-input placeholder="手机号" class="mr10" v-model="query.mobile" autocomplete="off"></el-input>
                <el-select
                    clearable
                    v-model="query.settleStatus"
                    placeholder="商户订单是否结算"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="未结算" value="1"></el-option>
                    <el-option key="2" label="已结算" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.changeType"
                    placeholder="兑换方式"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="纯金币兑换" value="1"></el-option>
                    <el-option key="2" label="纯RMB兑换" value="2"></el-option>
                    <el-option key="3" label="金币加RMB兑换" value="3"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="核销状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="未核销" value="1"></el-option>
                    <el-option key="2" label="已核销" value="2"></el-option>
                    <el-option key="3" label="已过期" value="3"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.payStatus"
                    placeholder="兑换状态"
                    class="handle-select mr10"
                >
                    <el-option key="0" label="待支付" value="0"></el-option>
                    <el-option key="1" label="兑换成功" value="1"></el-option>
                    <el-option key="2" label="兑换失败" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.refundStatus"
                    placeholder="退款状态"
                    class="handle-select mr10"
                >
                    <el-option key="0" label="未退款" value="0"></el-option>
                    <el-option key="1" label="退款成功" value="1"></el-option>
                    <el-option key="2" label="退款失败" value="2"></el-option>
                </el-select>
                <el-date-picker
                    class="mr10"
                    v-model="query.startDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="兑换开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                    class="mr10"
                    v-model="query.endDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="兑换结束时间（止）"
                ></el-date-picker>
                <el-button
                    style="margin-top: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
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
                总支付金币：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalGold"
                    :disabled="true"
                    autocomplete="off"
                ></el-input>总支付金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalMoney"
                    :disabled="true"
                    autocomplete="off"
                ></el-input>总退款金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalRefundPrice"
                    :disabled="true"
                    autocomplete="off"
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
                <el-table-column prop="name" label="兑换影院名称">
                    <template slot-scope="scope">{{scope.row.exchangeCinemaName}}</template>
                </el-table-column>
                <el-table-column label="订单号" width="190">
                    <template slot-scope="scope">{{scope.row.orderNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号码" width="120">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="商品名称">
                    <template slot-scope="scope">{{scope.row.commodityName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="兑换方式" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.changeType=='1'">纯金币兑换</el-tag>
                        <el-tag v-else-if="scope.row.changeType=='2'">纯RMB兑换</el-tag>
                        <el-tag v-else-if="scope.row.changeType=='3'">金币加RMB兑换</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="消耗金币" width="90">
                    <template slot-scope="scope">{{scope.row.gold}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付金额" width="90">
                    <template slot-scope="scope">{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column label="兑换状态" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row. payStatus=='0'">待支付</el-tag>
                        <el-tag v-else-if="scope.row. payStatus=='1'">兑换成功</el-tag>
                        <el-tag v-else-if="scope.row. payStatus=='2'">兑换失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="兑换时间" width="150">
                    <template slot-scope="scope">{{scope.row.payTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="核销状态" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'">未核销</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">已核销</el-tag>
                        <el-tag v-else-if="scope.row.status=='3'">已过期</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="领取时间" width="150">
                    <template slot-scope="scope">{{scope.row.getDate}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="100">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="addChange(scope.$index, scope.row)"
                        >查看详情</el-button>
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
        <!-- 详情弹出框 -->
        <el-dialog :close-on-click-modal="false" title="详情" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="领取影院名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.exchangeCinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="订单编号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.orderNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="用户手机号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.mobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="兑换方式" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.changeType"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="支付的金币数量" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.gold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="支付的RMB" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.money"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="领取状态" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.status"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="支付交易号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.tradeNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="支付状态" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.payStatus"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="支付时间" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.payTime"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="支付回调信息" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.payReturnMsg"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退款状态" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.refundStatus"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退款交易号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.refundNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退款原因" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.refundReason"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="微信退款回复" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.refundApply"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退款时间" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.refundTime"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退款金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.refundPrice"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商品名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.commodityName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
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
            partnerInfo: []
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        derive() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let cinemaCode = this.query.cinemaCode;
                let partnerCode = this.query.partnerCode;
                let settleStatus = this.query.settleStatus;
                let orderNo = this.query.orderNo;
                let commodityName = this.query.commodityName;
                let mobile = this.query.mobile;
                let status = this.query.status;
                let payStatus = this.query.payStatus;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let refundStatus = this.query.refundStatus;
                let changeType = this.query.changeType;
                if (!changeType) {
                    changeType = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!partnerCode) {
                    partnerCode = '';
                }
                if (!settleStatus) {
                    settleStatus = '';
                }
                if (!orderNo) {
                    orderNo = '';
                }
                if (!commodityName) {
                    commodityName = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!refundStatus) {
                    refundStatus = '';
                }
                if (!status) {
                    status = '';
                }
                if (!payStatus) {
                    payStatus = '';
                }
                if (!startDate) {
                    startDate = '';
                }
                if (!endDate) {
                    endDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'tableName', value: 'commodity_change_record' });
                jsonArr.push({
                    key: 'exportKeysJson',
                    value:
                        "['id','cinemaCode','cinemaName','partnerName','chSettleStatusString','orderNo','mobile','commodityName','gold','money','getDate','payTime','chPayStatus','tradeNo','payReturnMsg','chChangeType','chStatus','chRefundStatus','refundNo','refundReason','refundApply','refundTime','refundPrice']"
                });
                jsonArr.push({
                    key: 'exportTitlesJson',
                    value:
                        "['ID','影院编码','影院名称','商户名称','商户订单结算状态','订单号','手机号','商品名称','消费金币','支付金额','领取时间','兑换时间','兑换状态','支付交易号','支付回调消息','兑换方式','核销状态','退款状态','退款交易号','退款原因','微信退款回复','退款时间','退款金额']"
                });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'partnerCode', value: partnerCode });
                jsonArr.push({ key: 'settleStatus', value: settleStatus });
                jsonArr.push({ key: 'orderNo', value: orderNo });
                jsonArr.push({ key: 'commodityName', value: commodityName });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'refundStatus', value: refundStatus });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'changeType', value: changeType });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                var params = ParamsAppend(jsonArr);
                let myObj = {
                    method: 'get',
                    url: '/exportExcel/commodityChangeRecord',
                    fileName: '金币商城订单统计',
                    params: params
                };
                https.exportMethod(myObj);
                loading.close();
            }, 1500);
        },
        changeSearchCinema(val) {
            this.partnerInfo = [];
            this.getSearchPartner(val);
        },
        getSearchPartner(val) {
            let cinemaCode = val;
            if (!cinemaCode) {
                cinemaCode = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCodes', value: cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinemaPartner/page', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.partnerInfo = res.data;
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
        addChange(index, row) {
            //是否修改权限
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
                    .fetchPost('/commodityChangeRecord/getById', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            this.form.id = row.id;
                            this.form = JSON.parse(Decrypt(data.data.data));
                            if (JSON.parse(Decrypt(data.data.data)).changeType == 1) {
                                this.form.changeType = '纯金币兑换';
                            } else if (JSON.parse(Decrypt(data.data.data)).changeType == 2) {
                                this.form.changeType = '纯RMB兑换';
                            } else if (JSON.parse(Decrypt(data.data.data)).changeType == 3) {
                                this.form.changeType = '金币加RMB兑换';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).status == 1) {
                                this.form.status = '未领取';
                            } else if (JSON.parse(Decrypt(data.data.data)).status == 2) {
                                this.form.status = '已领取';
                            } else if (JSON.parse(Decrypt(data.data.data)).status == 3) {
                                this.form.status = '已过期';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).payStatus == 0) {
                                this.form.payStatus = '未支付';
                            } else if (JSON.parse(Decrypt(data.data.data)).payStatus == 1) {
                                this.form.payStatus = '支付成功';
                            } else if (JSON.parse(Decrypt(data.data.data)).payStatus == 2) {
                                this.form.payStatus = '支付失败';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).refundStatus == 0) {
                                this.form.refundStatus = '未退款';
                            } else if (JSON.parse(Decrypt(data.data.data)).refundStatus == 1) {
                                this.form.refundStatus = '退款成功';
                            } else if (JSON.parse(Decrypt(data.data.data)).refundStatus == 2) {
                                this.form.refundStatus = '退款失败';
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
                let orderNo = this.query.orderNo;
                let mobile = this.query.mobile;
                let payStatus = this.query.payStatus;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let changeType = this.query.changeType;
                let status = this.query.status;
                let refundStatus = this.query.refundStatus;
                let cinemaCode = this.query.cinemaCode;
                let partnerCode = this.query.partnerCode;
                let settleStatus = this.query.settleStatus;
                let commodityName = this.query.commodityName;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!partnerCode) {
                    partnerCode = '';
                }
                if (!settleStatus) {
                    settleStatus = '';
                }
                if (!commodityName) {
                    commodityName = '';
                }
                if (!orderNo) {
                    orderNo = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!status) {
                    status = '';
                }
                if (!changeType) {
                    changeType = '';
                }
                if (!payStatus) {
                    payStatus = '';
                }
                if (!refundStatus) {
                    refundStatus = '';
                }
                if (!startDate) {
                    startDate = '';
                }
                if (!endDate) {
                    endDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'orderNo', value: orderNo });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'partnerCode', value: partnerCode });
                jsonArr.push({ key: 'settleStatus', value: settleStatus });
                jsonArr.push({ key: 'commodityName', value: commodityName });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'changeType', value: changeType });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'refundStatus', value: refundStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/commodityChangeRecord/commodityChangeRecordPage', params)
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
            this.query.pageSize = val;
            this.getMenu();
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


