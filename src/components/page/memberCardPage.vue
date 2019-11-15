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
                    placeholder="绑卡状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="绑定" value="1"></el-option>
                    <el-option key="2" label="未绑定" value="2"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" style="margin-top: 10px;" @click="Search">搜索</el-button>
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
                <el-table-column prop="name" label="开卡影院">
                    <template slot-scope="scope">{{scope.row.openCardCinemaName}}</template>
                </el-table-column>
                <el-table-column label="卡号">
                    <template slot-scope="scope">{{scope.row.cardNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="会员卡等级名称">
                    <template slot-scope="scope">{{scope.row.levelName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号">
                    <template slot-scope="scope">{{scope.row.userMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="用户名">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="余额">
                    <template slot-scope="scope">{{scope.row.balance}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="积分">
                    <template slot-scope="scope">{{scope.row.creditsAmount}}</template>
                </el-table-column>
                <el-table-column label="是否被绑定" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.bindStatus=='1'">绑定</el-tag>
                        <el-tag v-else>未绑定</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="addChange(scope.$index, scope.row)"
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
                    .fetchPost('/memberCard/unbindMemberCard', params)
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
                jsonArr.push({ key: 'openCardCinemaName', value: cinemaCode });
                jsonArr.push({ key: 'CardrNo', value: orderNo });
                jsonArr.push({ key: 'userMobile', value: mobile });
                jsonArr.push({ key: 'bindStatus', value: payWay });
                let sign = md5(preSign(jsonArr));
                console.log(jsonArr)
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/memberCard/memberCardPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            this.tableData = oData.data;
                            this.query.pageSize = oData.pageSize;
                            this.query.pageNo = oData.pageNo;
                            this.query.totalCount = oData.totalCount;
                            this.query.totalPage = oData.totalPage;
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

