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
                <el-select
                    v-model="query.businessCode"
                    placeholder="请选择商家"
                    class="mr10"
                    @change="changeBusiness"
                >
                    <el-option
                        v-for="item in businessInfo"
                        :key="item.businessCode"
                        :label="item.businessName"
                        :value="item.businessCode"
                    ></el-option>
                </el-select>
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
                <el-form-item label="实付金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalActualPrice"
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
                <el-form-item label="网络代售费" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalPlatHandFee"
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
                <el-form-item label="最低价" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalLowestPrice"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="回传金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalSubmitPrice"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="上报金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.totalReportPrice"
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
                            .fetchPost('/admin/memberCard/unbindMemberCard', params)
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
                let orderNo = this.query.orderNo;
                let mobile = this.query.mobile;
                let payWay = this.query.payWay;
                if (!businessCode) {
                    businessCode = '';
                }
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
                let jsonArr = [];
                jsonArr.push({ key: 'businessCode', value: businessCode });
                jsonArr.push({ key: 'openCardCinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'cardNo', value: orderNo });
                jsonArr.push({ key: 'userMobile', value: mobile });
                jsonArr.push({ key: 'bindStatus', value: payWay });
                let sign = md5(preSign(jsonArr));
                console.log(jsonArr);
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/admin/memberCard/memberCardPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            this.tableData = oData.pageResult.data;
                            this.totalData = oData.statistics;
                            this.query.pageSize = oData.pageResult.pageSize;
                            this.query.pageNo = oData.pageResult.pageNo;
                            this.query.totalCount = oData.pageResult.totalCount;
                            this.query.totalPage = oData.pageResult.totalPage;
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

