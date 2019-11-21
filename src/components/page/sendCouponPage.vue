<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 优惠券发放
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div v-if="showType">
            <el-dialog
                title="请选择发送方式"
                :visible.sync="dialogVisible"
                width="30%"
                :center="true"
                :close-on-click-modal="false"
                :show-close="false"
            >
                <template>
                    <el-radio-group v-model="sendType">
                        <el-radio :label="1">筛选用户发放</el-radio>
                        <el-radio :label="2">导入excal发放</el-radio>
                    </el-radio-group>
                </template>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="sureType">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <div class="container" v-if="sendType == 1">
            <div class="handle-box" style="margin-bottom: 0;">
                <el-select
                    v-model="query.cinemaCode"
                    placeholder="请选择影院"
                    class="mr10"
                    style="margin-top: 10px;width:18%;"
                    @change="$forceUpdate()"
                >
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaName"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="手机号"
                    v-model="query.mobile"
                    autocomplete="off"
                    class="mr10"
                    style="margin-top: 10px;width:18%;"
                ></el-input>
                <el-date-picker
                    v-model="query.consumeStartDate"
                    type="datetime"
                    class="mr10"
                    style="margin-top: 10px;width:18%;"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    default-time="06:00:00"
                    placeholder="最近消费时间（起）"
                ></el-date-picker>
                <el-date-picker
                    style="margin-top: 10px;width:18%;"
                    v-model="query.consumeEndDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="最近消费时间（止）"
                ></el-date-picker>
                <el-input
                    style="margin-top: 10px;width:18%;"
                    placeholder="总消费金额（起）"
                    v-model="query.consumeStartAmount"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    style="margin-top: 10px;width:18%;"
                    placeholder="总消费金额（止）"
                    v-model="query.consumeEndAmount"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    style="margin-top: 10px;width:18%;"
                    placeholder="剩余优惠券数量（起）"
                    v-model="query.couponStartNumber"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    style="margin-top: 10px;width:18%;"
                    placeholder="剩余优惠券数量（止）"
                    v-model="query.couponEndNumber"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-select
                    v-model="query.userRole"
                    clearable
                    placeholder="聊天室角色"
                    class="mr10"
                    style="margin-top: 10px;width:18%;"
                >
                    <el-option
                        v-for="item in userRole"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-select
                    v-model="query.bindCardStatus"
                    clearable
                    placeholder="是否绑定会员卡"
                    class="mr10"
                    style="margin-top: 10px;width:18%;"
                >
                    <el-option
                        v-for="item in bindCardStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-button
                    type="primary"
                    style="margin-top: 10px;width: 90px;"
                    @click="chooseFilm"
                    class="mr10"
                >看过的电影</el-button>
            </div>
            <div v-if="filmList.length > 0">
                <span class="filmItem" v-for="(item, index) in filmList" :key="index">
                    <span>
                        <span style="color:gray">{{item.filmName}}</span>&nbsp;&nbsp;
                        <span style="color:red;cursor:pointer" @click="deleteFilm(index)">删除</span>&nbsp;&nbsp;
                    </span>
                </span>
            </div>
            <div>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    style="margin-top: 10px;width: 90px;"
                    @click="Search"
                    class="mr10"
                >搜索</el-button>
            </div>
            <div style="margin-bottom: 10px;">
                <el-button
                    type="primary"
                    style="margin-top: 10px;width: 120px;"
                    @click="sendCoupon"
                    class="mr10"
                >发放优惠券</el-button>
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
                <el-table-column prop="name" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column label="用户名">
                    <template slot-scope="scope">{{scope.row.orderNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="最近登陆时间">
                    <template slot-scope="scope">{{scope.row.filmName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号码">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
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
        <!-- 优惠券弹出框 -->
        <el-dialog title="优惠券发放" :visible.sync="editVisible">
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
        <!-- 影片弹出框 -->
        <el-dialog title="选择影片" :visible.sync="seenFilmList">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.name" placeholder="影片名称" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="chooseFilm">搜索</el-button>
                </div>
                <el-table
                        :data="seenFilmData"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="id" :label="scope.row.filmId" @change.native="getCurrentRow(scope.row.filmId)">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="影片名称">
                        <template slot-scope="scope">{{scope.row.filmName}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="影片语言">
                        <template slot-scope="scope">{{scope.row.language}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="影片导演">
                        <template slot-scope="scope">{{scope.row.director}}</template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="query.filmPageNo"
                            :page-size="query.filmPageSize"
                            :total="query.filmTotalCount"
                            @current-change="filmCurrentChange"
                            @prev-click='filmPrev'
                            @next-click="filmNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="seenFilmList = false">取 消</el-button>
                <el-button type="primary" @click="seenFilm">确 定</el-button>
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
            seenFilmData: [],
            filmList: [],
            dialogVisible: true,
            showType: true,
            seenFilmList: false,
            sendType: 1,
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            userRole: [
                {
                    value: '1',
                    label: '普通用户'
                },
                {
                    value: '2',
                    label: '管理员'
                }
            ],
            bindCardStatus: [
                {
                    value: '1',
                    label: '未绑定'
                },
                {
                    value: '2',
                    label: '已绑定'
                }
            ],
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
        this.getAllCinema();
    },
    methods: {
        sendCoupon() {},
        Search() {
            this.query.pageNo = 1;
            this.getMenu();
        },

        sureType() {
            this.dialogVisible = false;
            this.showType = false;
            this.getAllCinema();
        },

        getAllCinema() {
            https
                .fetchPost('/cinema/getAllCinema')
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.cinemaInfo = res;
                        this.query.cinemaCode = this.cinemaInfo[0].cinemaCode;
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

        // 查询看过的电影
        chooseFilm() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let filmName = this.query.filmName;
                if (!filmName) {
                    filmName = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'filmName', value: filmName });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('film/filmPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.seenFilmList = true;
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData)
                            this.seenFilmData = oData.data;
                            this.query.filmPageSize = oData.pageSize;
                            this.query.filmPageNo = oData.pageNo;
                            this.query.filmTotalCount = oData.totalCount;
                            this.query.filmTotalPage = oData.totalPage;
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

        getMenu() {
            //获取菜单栏
            // const loading = this.$loading({
            //     lock: true,
            //     text: 'Loading',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.7)',
            //     target: document.querySelector('.div1')
            // });
            setTimeout(() => {
                let cinemaCode = this.query.cinemaCode;
                let mobile = this.query.mobile;
                let consumeStartDate = this.query.consumeStartDate;
                let consumeEndDate = this.query.consumeEndDate;
                let consumeStartAmount = this.query.consumeStartAmount;
                let consumeEndAmount = this.query.consumeEndAmount;
                let couponStartNumber = this.query.couponStartNumber;
                let couponEndNumber = this.query.couponEndNumber;
                let userRole = this.query.userRole;
                let bindCardStatus = this.query.bindCardStatus;
                let filmList = this.filmList;
                let filmCodes = '';
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!consumeStartDate) {
                    consumeStartDate = '';
                }
                if (!consumeEndDate) {
                    consumeEndDate = '';
                }
                if (!consumeStartAmount) {
                    consumeStartAmount = '';
                }
                if (!consumeEndAmount) {
                    consumeEndAmount = '';
                }
                if (!couponStartNumber) {
                    couponStartNumber = '';
                }
                if (!couponEndNumber) {
                    couponEndNumber = '';
                }
                if (!userRole) {
                    userRole = '';
                }
                if (!bindCardStatus) {
                    bindCardStatus = '';
                }
                if (filmList.length > 0) {
                    for (let i = 0;i < filmList.length;i ++) {
                        if (i < filmList.length - 1) {
                            filmCodes += filmList[i].filmId + ","
                        } else {
                            filmCodes += filmList[i].filmId
                        }
                    }
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'consumeStartDate', value: consumeStartDate });
                jsonArr.push({ key: 'consumeEndDate', value: consumeEndDate });
                jsonArr.push({ key: 'consumeStartAmount', value: consumeStartAmount });
                jsonArr.push({ key: 'consumeEndAmount', value: consumeEndAmount });
                jsonArr.push({ key: 'couponStartNumber', value: couponStartNumber });
                jsonArr.push({ key: 'couponEndNumber', value: couponEndNumber });
                jsonArr.push({ key: 'userRole', value: userRole });
                jsonArr.push({ key: 'bindCardStatus', value: bindCardStatus });
                jsonArr.push({ key: 'filmCodes', value: filmCodes });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/batchSendCoupon/pageIndex', params)
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
                            // this.getAllCinema();
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
        },

        getCurrentRow(id){//影片弹出框id
            this.seenFilmId=id;
        },

        // 选择看过的影片
        seenFilm() {
            for (let i = 0;i < this.seenFilmData.length;i ++) {
                if (this.seenFilmId == this.seenFilmData[i].filmId) {
                    this.filmList.push({"filmName": this.seenFilmData[i].filmName,"filmId": this.seenFilmData[i].filmId})
                }
            }
            this.filmList = [...new Set(this.filmList)];
            this.seenFilmList = false;
        },

        // 删除看过的影片
        deleteFilm(index) {
            this.filmList.splice(index, 1);
        },

        filmCurrentChange(val){//点击选择具体页数
            this.query.filmPageNo = val;
            this.chooseFilm()
        },
        filmPrev(){//分页按钮上一页
            this.query.filmPageNo--;
            this.chooseFilm()
        },
        filmNext(){//分页按钮下一页
            this.query.filmPageNo++;
            this.chooseFilm()
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
.filmItem{
    width: 16%;
}
</style>

