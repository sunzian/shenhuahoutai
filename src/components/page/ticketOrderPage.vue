<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影票订单
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
                    placeholder="订单号"
                    style="width: 150px"
                    v-model="query.orderNo"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    placeholder="手机号"
                    style="width: 150px"
                    v-model="query.mobile"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.payWay"
                    placeholder="支付方式"
                    class="handle-select mr10"
                >
                    <el-option key="0" label="微信" value="0"></el-option>
                    <el-option key="1" label="会员卡" value="1"></el-option>
                </el-select>
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
                <el-select
                    clearable
                    v-model="query.submitStatus"
                    placeholder="下单状态"
                    class="handle-select mr10"
                >
                    <el-option key="0" label="未下单" value="0"></el-option>
                    <el-option key="1" label="下单成功" value="1"></el-option>
                    <el-option key="2" label="下单失败" value="2"></el-option>
                </el-select>
                <el-date-picker
                    style="width: 200px;"
                    v-model="query.startDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    default-time="06:00:00"
                    placeholder="开始时间"
                ></el-date-picker>至
                <el-date-picker
                    style="width: 200px;"
                    v-model="query.endDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="结束时间"
                ></el-date-picker>
                <el-button type="primary" icon="el-icon-search" style="margin-top: 10px;" @click="Search">搜索</el-button>
            </div>
            <div class="handle-box">
                总实付价：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalActualPrice"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>总优惠券金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalCouponDiscount"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>总原价：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalOriginalPrice"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>总平台代售费：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalPlatHandFee"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>总回传金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalSubmitPrice"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>总票数：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalTicketNumber"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>总活动优惠金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalActivityDiscount"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
            </div>
            <el-table
                :data="tableData"
                border
                height="500px"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="影院编码">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column label="订单号">
                    <template slot-scope="scope">{{scope.row.orderNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号码">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="场次时间">
                    <template slot-scope="scope">{{scope.row.sessionTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影片名称">
                    <template slot-scope="scope">{{scope.row.filmName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="票数">
                    <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="座位">
                    <template slot-scope="scope">{{scope.row.seatName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影票原价">
                    <template slot-scope="scope">{{scope.row.totalOriginalPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影票实付价">
                    <template slot-scope="scope">{{scope.row.totalActualPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="服务费">
                    <template slot-scope="scope">{{scope.row.totalServiceFee}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="平台手续费">
                    <template slot-scope="scope">{{scope.row.totalPlatHandFee}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="活动优惠金额">
                    <template slot-scope="scope">{{scope.row.totalActivityDiscount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="优惠券优惠金额">
                    <template slot-scope="scope">{{scope.row.totalCouponDiscount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影票最低金额">
                    <template slot-scope="scope">{{scope.row.totalLowestPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="售票系统回传金额">
                    <template slot-scope="scope">{{scope.row.totalSubmitPrice}}</template>
                </el-table-column>
                <el-table-column label="支付方式" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row. payWay=='0'">微信</el-tag>
                        <el-tag v-else-if="scope.row. payWay=='1'">会员卡</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="支付状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.payStatus=='0'" type="danger">未支付</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='1'" type="success">支付成功</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='2'" type="danger">支付失败</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='3'" type="success">退款成功</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="支付时间">
                    <template slot-scope="scope">{{scope.row.payTime}}</template>
                </el-table-column>
                <el-table-column label="下单状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.submitStatus=='0'" type="danger">未下单</el-tag>
                        <el-tag v-else-if="scope.row.submitStatus=='1'" type="success">下单成功</el-tag>
                        <el-tag v-else-if="scope.row.submitStatus=='2'" type="danger">下单失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="取票状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.printStatus=='0'" type="danger">未取票</el-tag>
                        <el-tag v-else-if="scope.row.printStatus=='1'" type="success">已取票</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="退票状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cancelStatus=='1'" type="success">已退票</el-tag>
                        <el-tag v-else type="danger">未退票</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
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
        <el-dialog title="详情" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="本地单号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.orderNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="售票系统单号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.submitOrderCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.mobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院编码" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cinemaCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影片名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.filmName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影片场次时间" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.sessionTime"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="座位" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.seatName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="票数" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.number"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="原价" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalOriginalPrice"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="服务费" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalServiceFee"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="实付金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalActualPrice"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="活动类型" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.activityType"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="活动优惠金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalActivityDiscount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="优惠券优惠金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalCouponDiscount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="优惠券名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.userCouponName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="网络代售费" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalPlatHandFee"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="最低价" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalLowestPrice"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院补贴" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalCinemaAllowance"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="订单支付类型" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.payWay"
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
                <el-form-item label="订单状态" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.submitStatus"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="取票码" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.printNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="下单失败原因" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        type="textarea"
                        style="width: 250px"
                        v-model="form.submitMessage"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退票状态" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cancelStatus"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退票时间" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cancelTime"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退票手续费" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalRefundHandFee"
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
                <el-form-item label="退款失败原因" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.refundApply"
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
                pageSize: 10
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
                    .fetchPost('/ticketOrder/getOrderById', params)
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
                let cinemaCode = this.query.cinemaCode
                let orderNo = this.query.orderNo;
                let mobile = this.query.mobile;
                let payWay = this.query.payWay;
                let payStatus = this.query.payStatus;
                let submitStatus = this.query.submitStatus;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!orderNo) {
                    orderNo = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!payWay) {
                    payWay = '';
                }
                if (!payStatus) {
                    payStatus = '';
                }
                if (!submitStatus) {
                    submitStatus = '';
                }
                if (!startDate) {
                    startDate = '';
                }
                if (!endDate) {
                    endDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'orderNo', value: orderNo });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'payWay', value: payWay });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'submitStatus', value: submitStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/ticketOrder/ticketOrderPage', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
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
            //错误信息弹出框
            this.$alert(this.message, '错误信息', {
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
    margin-bottom: 20px;
    font-size: 14px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
</style>

