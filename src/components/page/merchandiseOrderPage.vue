<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 卖品订单
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
                        placeholder="卖品名称"
                        v-model="query.merNames"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-input
                    placeholder="订单号"
                    v-model="query.submitOrderCode"
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
                    placeholder="取货码"
                    v-model="query.printNo"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-select
                        clearable
                        v-model="query.deliveryType"
                        placeholder="取货方式"
                        class="handle-select mr10"
                >
                    <el-option key="0" label="自取" value="0"></el-option>
                    <el-option key="1" label="送至影厅" value="1"></el-option>
                </el-select>
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
                    <el-option key="0" label="下单失败" value="0"></el-option>
                    <el-option key="1" label="下单成功" value="1"></el-option>
                </el-select>
                <el-date-picker
                    v-model="query.startDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    class="mr10"
                    placeholder="支付开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.endDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="支付结束时间（止）"
                    class="mr10"
                ></el-date-picker>
                <el-button type="primary" style="margin-top: 10px;width: 90px;" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                        type="primary"
                        @click="derive"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px"
                >导出</el-button>
                <el-button
                    type="primary"
                    @click="showCinema = true"
                    style="margin-top: 10px;width: 150px;"
                >打开卖品通知</el-button>
            </div>
            <div class="handle-box">
                总原价：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalOriginalPrice"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>总实付金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalActualPrice"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>总优惠券优惠金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalCouponDiscount"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>总活动优惠金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalActivityDiscount"
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
                <el-table-column prop="name" label="影院编码" width="85">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column label="备注" width="135">
                    <template slot-scope="scope">{{scope.row.deliveryMemo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="送货地址" width="90">
                    <template slot-scope="scope">{{scope.row.deliveryAddress}}</template>
                </el-table-column>
                <el-table-column label="订单号" width="135">
                    <template slot-scope="scope">{{scope.row.submitOrderCode}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号码" width="110">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="送餐手机号" width="110">
                    <template slot-scope="scope">{{scope.row.deliveryMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="取货码" width="85">
                    <template slot-scope="scope">{{scope.row.printNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="卖品内容" width="110">
                    <template slot-scope="scope">{{scope.row.merNames}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="原价" width="60">
                    <template slot-scope="scope">{{scope.row.totalOriginalPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="实付价" width="70">
                    <template slot-scope="scope">{{scope.row.totalActualPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="活动优惠" width="80">
                    <template slot-scope="scope">{{scope.row.totalActivityDiscount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="优惠券优惠" width="100">
                    <template slot-scope="scope">{{scope.row.totalCouponDiscount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="优惠券名称" width="100">
                    <template slot-scope="scope">{{scope.row.userCouponName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付时间" width="100">
                    <template slot-scope="scope">{{scope.row.payTime}}</template>
                </el-table-column>
                <el-table-column label="支付方式" align="center" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.payWay=='0'">微信</el-tag>
                        <el-tag v-else-if="scope.row.payWay=='1'">会员卡</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="支付状态" align="center" >
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.payStatus=='1'">支付成功</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='2'">支付失败</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='3'">退款成功</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="下单状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.submitStatus=='0'" type="danger">下单失败</el-tag>
                        <el-tag v-else-if="scope.row.submitStatus=='1'" type="success">下单成功</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="取货方式" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.deliveryType=='0'">自取</el-tag>
                        <el-tag v-else-if="scope.row.deliveryType=='1'">送至影厅</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            v-if="scope.row.payStatus=='1'"
                            @click="refundGoods(scope.$index, scope.row)"
                        >退款</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="addChange(scope.$index, scope.row)"
                        >查看</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-setting"
                                @click="updateStatus(scope.$index, scope.row)"
                                v-if="scope.row.deliveryType==0&&scope.row.deliveryStatus==0&&scope.row.payStatus==1&&scope.row.submitStatus==1"
                        >取货</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-setting"
                                @click="updateStatus(scope.$index, scope.row)"
                                v-if="scope.row.deliveryType==1&&scope.row.deliveryStatus==0&&scope.row.payStatus==1&&scope.row.submitStatus==1"
                        >确认送达</el-button>
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
                <el-form-item label="本地单号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.orderNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="系统单号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.submitOrderCode"
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
                <el-form-item label="卖品内容" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.merNames"
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
                <el-form-item label="送餐手机号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.deliveryMobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.userName"
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
                <el-form-item label="活动名称" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.activityName"
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
                <el-form-item label="优惠券名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.userCouponName"
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
                <el-form-item label="支付交易号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.tradeNo"
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
                <el-form-item label="取货码" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.printNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="取餐方式" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.deliveryType"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="送货地址" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.deliveryAddress"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.deliveryMemo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退卖品状态" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cancelStatus"
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
                <el-form-item label="退款时间" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.refundTime"
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 选择影院 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="showCinema">
            <el-form>
                <el-form-item label="适用影院" :label-width="formLabelWidth">
                    <el-select v-model="order.cinemaCode" placeholder="请选择影院">
                        <el-option
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showCinema = false">取 消</el-button>
                <el-button type="primary" @click="openOrderNotice">确 定</el-button>
            </div>
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
                payStatus:'1',
                pageNo: 1,
                pageSize: 15
            },
            editVisible: false,
            showCinema: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            formLabelWidth: '120px',
            businessInfoList: [],
            value: '',
            form: [],
            cinemaInfo: [],
            order: {
                cinemaCode: ''
            }
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        updateStatus(index, row){
            this.$confirm('此操作将修改卖品状态, 是否继续?', '提示', {
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
                            .fetchPost('/merchandiseOrder/updateStatusById', params)
                            .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.$message.success(`成功`);
                                    this.getMenu()
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
                        message: '已取消删除'
                    });
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
                    .fetchPost('/merchandiseOrder/getMerchandiseOrderById', params)
                    .then(data => {
                        loading.close();
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
                                this.form.cancelStatus = '未退货';
                            } else if (JSON.parse(Decrypt(data.data.data)).cancelStatus == 1) {
                                this.form.cancelStatus = '已退货';
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
                            if (JSON.parse(Decrypt(data.data.data)).deliveryType == 0) {
                                this.form.deliveryType = '自取';
                            } else if (JSON.parse(Decrypt(data.data.data)).deliveryType == 1) {
                                this.form.deliveryType = '送至影厅';
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
                        this.order.cinemaCode = this.cinemaInfo[0].cinemaCode
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
                let payWay = this.query.payWay;
                let payStatus = this.query.payStatus;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let printNo = this.query.printNo;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!orderNo) {
                    orderNo = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!printNo) {
                    printNo = '';
                }
                if (!payWay) {
                    payWay = '';
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
                jsonArr.push({ key: 'tableName', value: "merchandise_order" });
                jsonArr.push({ key: 'exportKeysJson', value: "['id','cinemaCode','orderNo','userName','mobile','merNames','totalOriginalPrice','totalActivityDiscount','totalCouponDiscount','totalActualPrice','chPayStatus','chPayWay','payTime','chSubmitStatus','submitTime','chDeliveryType','submitOrderCode','printNo','userCouponName','deliveryAddress','chActivityType','activityName','tradeNo','deliveryMemo','chCancelStatus','refundReason','refundTime','submitMessage']"});
                jsonArr.push({ key: 'exportTitlesJson', value:"['ID','影院编码','本地单号','用户','手机号','卖品内容','总原价','活动优惠金额','优惠券优惠金额','实付金额','支付状态','支付方式','支付时间','下单状态','下单时间','取货方式','系统单号','取货码','优惠券名称','送货地址','活动类型','活动名称','支付交易号','备注','退卖品状态','退款原因','退款时间','下单失败原因']" });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'orderNo', value: orderNo });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'payWay', value: payWay });
                jsonArr.push({ key: 'printNo', value: printNo });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                var params = ParamsAppend(jsonArr);
                console.log(jsonArr);
                let myObj = {
                    method: 'get',
                    url: '/exportExcel/merchandiseOrder',
                    fileName: '卖品订单统计',
                    params: params
                };
                https.exportMethod(myObj);
                loading.close();
            }, 1500);
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
                let submitOrderCode = this.query.submitOrderCode;
                let mobile = this.query.mobile;
                let printNo = this.query.printNo;
                let payWay = this.query.payWay;
                let payStatus = this.query.payStatus;
                let submitStatus = this.query.submitStatus;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let merNames = this.query.merNames;
                let deliveryType = this.query.deliveryType;
                if (!deliveryType) {
                    deliveryType = '';
                }
                if (!merNames) {
                    merNames = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!submitOrderCode) {
                    submitOrderCode = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!printNo) {
                    printNo = '';
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
                jsonArr.push({ key: 'deliveryType', value: deliveryType });
                jsonArr.push({ key: 'merNames', value: merNames });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'submitOrderCode', value: submitOrderCode });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'printNo', value: printNo });
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
                    .fetchPost('/merchandiseOrder/merchandiseOrderPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
                            this.tableData = oData.pageResult.data;
                            this.totalData = oData.totalMerchandiseOrder;
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
        // 退货
        refundGoods(index, row) {
            this.$confirm('此操作将退款, 是否继续?', '提示', {
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
                        var jsonArr = [];
                        jsonArr.push({ key: 'id', value: row.id });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/merchandiseOrder/refundMerchandiseAmount', params)
                            .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.message = '退款成功！';
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
                        message: '已取消退款'
                    });
                });
        },
        openOrderNotice() {
            let cinemaCode = this.order.cinemaCode;
            const { href } = this.$router.resolve({
                path: `/merchandiseOrderNotice?cinemaCode=${cinemaCode}`
            });
            window.open(href, '_blank');
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
.red {
    color: #ff0000;
}
.mr10 {
    width: 16%;
    margin-right: 10px;
}
</style>

