<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 会员卡充值订单
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.cinemaCode" placeholder="请选择注册影院" class="mr10">
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-select clearable v-model="query.rechargeCinemaCode" placeholder="请选择充值影院" class="mr10">
                    <el-option
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="手机号"
                    v-model="query.mobile"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    placeholder="会员卡号"
                    v-model="query.cardNo"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                        placeholder="推荐员工编码"
                        v-model="query.employeeCode"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.payStatus"
                    placeholder="支付状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="支付成功" value="1"></el-option>
                    <el-option key="2" label="支付失败" value="2"></el-option>
                    <el-option key="3" label="退款成功" value="3"></el-option>
                </el-select>
                <el-date-picker
                    v-model="query.startDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="充值开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.endDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="充值结束时间（止）"
                ></el-date-picker>
                <el-select
                        clearable
                        v-model="query.rechargeStatus"
                        placeholder="充值状态"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="充值成功" value="1"></el-option>
                    <el-option key="2" label="充值失败" value="2"></el-option>
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
                总实付金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalActualPrice"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>总充值金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalRechargeAmount"
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
                <el-table-column prop="name" label="注册影院">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column label="充值影院">
                    <template slot-scope="scope">{{scope.row.rechargeCinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="卡号" width="130">
                    <template slot-scope="scope">{{scope.row.cardNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号" width="130">
                    <template slot-scope="scope">{{scope.row.mobilePhone}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付金额" width="90">
                    <template slot-scope="scope">{{scope.row.payAmount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="赠送金额" width="90">
                    <template slot-scope="scope">{{scope.row.givenMoney}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="充值金额" width="90">
                    <template slot-scope="scope">{{scope.row.rechargeAmount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="充值时间" width="160">
                    <template slot-scope="scope">{{scope.row.payTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="推荐员工编码" width="120">
                    <template slot-scope="scope">{{scope.row.employeeCode}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付状态" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.payStatus=='0'" type="danger">未支付</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='1'" type="success">支付成功</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='2'" type="danger">支付失败</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='3'" type="success">退款成功</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="充值状态" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.rechargeStatus=='1'" type="success">充值成功</el-tag>
                        <el-tag v-else-if="scope.row.rechargeStatus=='2'" type="danger">充值失败</el-tag>
                    </template>
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
        <!-- 详情弹出框 -->
        <el-dialog :close-on-click-modal="false" title="详情" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="本地订单号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.rechargeOrderNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="开卡影院" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="充值影院" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.rechargeCinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="卡号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cardNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.mobilePhone"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="用户" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.userName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="实付金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.payAmount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="充值金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.rechargeAmount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="赠送类型" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.givenType"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="赠送券包id" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.givenCouponGroupId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="优惠券领取后过期天数" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.overDays"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="赠送金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.givenMoney"
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
                <el-form-item label="支付订单号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.payTradeNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="充值状态" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.rechargeStatus"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="充值失败原因" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        type="textarea"
                        style="width: 250px"
                        v-model="form.errorMsg"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退款详情" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        type="textarea"
                        style="width: 250px"
                        v-model="form.refundMsg"
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
                let employeeCode = this.query.employeeCode;
                let cinemaName = this.query.cinemaName;
                let rechargeCinemaName = this.query.rechargeCinemaName;
                let cardNo = this.query.cardNo;
                let mobilePhone = this.query.mobile;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let userName = this.query.userName;
                let payStatus = this.query.payStatus;
                let rechargeStatus = this.query.rechargeStatus;
                if (!cinemaName) {
                    cinemaName = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!rechargeCinemaName) {
                    rechargeCinemaName = '';
                }
                if (!cardNo) {
                    cardNo = '';
                }
                if (!mobilePhone) {
                    mobilePhone = '';
                }
                if (!userName) {
                    userName = '';
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
                if (!rechargeStatus) {
                    rechargeStatus = '';
                }
                if (!employeeCode) {
                    employeeCode = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'tableName', value: "member_card_recharge" });
                jsonArr.push({ key: 'exportKeysJson', value: "['id','cinemaCode','cinemaName','rechargeCinemaCode','rechargeCinemaName','cardNo','userName','mobilePhone','rechargeAmount','payAmount','chPayStatus','chRechargeStatus','payTime','chGivenType','groupName','givenMoney','errorMsg','refundMsg','rechargeOrderNo','payTradeNo','employeeCode']"});
                jsonArr.push({ key: 'exportTitlesJson', value:"['ID','开卡影院编码','开卡影院名称','充值影院编码','充值影院名称','卡号','用户','手机号','充值金额','支付金额','支付状态','充值状态','充值时间','赠送类型','赠送券包','赠送金额','充值失败原因','退款详情','充值订单号','支付交易号','推荐员工编码']" });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'cardNo', value: cardNo });
                jsonArr.push({ key: 'employeeCode', value: employeeCode });
                jsonArr.push({ key: 'mobilePhone', value: mobilePhone });
                jsonArr.push({ key: 'rechargeCinemaName', value: rechargeCinemaName });
                jsonArr.push({ key: 'cinemaName', value: cinemaName });
                jsonArr.push({ key: 'userName', value: userName });
                jsonArr.push({ key: 'rechargeStatus', value: rechargeStatus });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                var params = ParamsAppend(jsonArr);
                console.log(jsonArr);
                let myObj = {
                    method: 'get',
                    url: '/exportExcel/memberCardRecharge',
                    fileName: '会员卡充值订单统计',
                    params: params
                };
                https.exportMethod(myObj);
                loading.close();
            }, 1500);
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
                    .fetchPost('/memberCardRecharge/getRechargeDetailById', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            this.form.id = row.id;
                            this.form = JSON.parse(Decrypt(data.data.data));
                            if (JSON.parse(Decrypt(data.data.data)).payWay == 0) {
                                this.form.payWay = '微信';
                            } else if (JSON.parse(Decrypt(data.data.data)).payWay == 1) {
                                this.form.payWay = '会员卡';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).payStatus == 0) {
                                this.form.payStatus = '未支付';
                            } else if (JSON.parse(Decrypt(data.data.data)).payStatus == 1) {
                                this.form.payStatus = '支付成功';
                            } else if (JSON.parse(Decrypt(data.data.data)).payStatus == 2) {
                                this.form.payStatus = '支付失败';
                            } else if (JSON.parse(Decrypt(data.data.data)).payStatus == 3) {
                                this.form.payStatus = '退款成功';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).givenType == 1) {
                                this.form.givenType = '不赠送';
                            } else if (JSON.parse(Decrypt(data.data.data)).givenType == 2) {
                                this.form.givenType = '赠送RMB';
                            } else if (JSON.parse(Decrypt(data.data.data)).givenType == 3) {
                                this.form.givenType = '赠送券包';
                            } else if (JSON.parse(Decrypt(data.data.data)).givenType == 4) {
                                this.form.givenType = '两者都送';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).rechargeStatus == 1) {
                                this.form.rechargeStatus = '充值成功';
                            } else if (JSON.parse(Decrypt(data.data.data)).rechargeStatus == 2) {
                                this.form.rechargeStatus = '充值失败';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).cancelStatus == 0) {
                                this.form.cancelStatus = '未退票';
                            } else if (JSON.parse(Decrypt(data.data.data)).cancelStatus == 1) {
                                this.form.cancelStatus = '已退票';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).submitStatus == 0) {
                                this.form.submitStatus = '未下单';
                            } else if (JSON.parse(Decrypt(data.data.data)).submitStatus == 1) {
                                this.form.submitStatus = '下单成功';
                            } else if (JSON.parse(Decrypt(data.data.data)).submitStatus == 2) {
                                this.form.submitStatus = '下单失败';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).activityType == 1) {
                                this.form.activityType = '特惠';
                            } else if (JSON.parse(Decrypt(data.data.data)).activityType == 2) {
                                this.form.activityType = '立减';
                            } else if (JSON.parse(Decrypt(data.data.data)).activityType == 3) {
                                this.form.activityType = '权益卡';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).refundStatus == 0) {
                                this.form.refundStatus = '未退款';
                            } else if (JSON.parse(Decrypt(data.data.data)).refundStatus == 1) {
                                this.form.refundStatus = '已退款';
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
        // 获取所有影院
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
                let employeeCode = this.query.employeeCode;
                let cardNo = this.query.cardNo;
                let mobile = this.query.mobile;
                let payStatus = this.query.payStatus;
                let rechargeStatus = this.query.rechargeStatus;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let rechargeCinemaCode = this.query.rechargeCinemaCode;
                if (!rechargeCinemaCode) {
                    rechargeCinemaCode = '';
                }
                if (!employeeCode) {
                    employeeCode = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!cardNo) {
                    cardNo = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!payStatus) {
                    payStatus = '';
                }
                if (!rechargeStatus) {
                    rechargeStatus = '';
                }
                if (!startDate) {
                    startDate = '';
                }
                if (!endDate) {
                    endDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'rechargeCinemaCode', value: rechargeCinemaCode });
                jsonArr.push({ key: 'employeeCode', value: employeeCode });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'cardNo', value: cardNo });
                jsonArr.push({ key: 'mobilePhone', value: mobile });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'rechargeStatus', value: rechargeStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/memberCardRecharge/memberCardRechargePage', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            this.tableData = oData.memberCardRecharge.data;
                            this.totalData = oData.memberCardStatistics;
                            this.query.pageSize = oData.memberCardRecharge.pageSize;
                            this.query.pageNo = oData.memberCardRecharge.pageNo;
                            this.query.totalCount = oData.memberCardRecharge.totalCount;
                            this.query.totalPage = oData.memberCardRecharge.totalPage;
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

