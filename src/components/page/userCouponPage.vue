<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户优惠券列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.cinemaCode" placeholder="请选择优惠券所属影院" class="mr10">
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="用户手机号"
                    v-model="query.userMobile"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                        placeholder="优惠券名称"
                        v-model="query.couponName"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-input
                    placeholder="订单号"
                    v-model="query.orderNo"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                        placeholder="发放批次编号/券码"
                        v-model="query.sendCode"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="使用状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="未使用" value="1"></el-option>
                    <el-option key="2" label="已使用" value="2"></el-option>
                    <el-option key="3" label="已过期" value="3"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.couponType "
                    placeholder="优惠券类型"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="影票" value="1"></el-option>
                    <el-option key="2" label="卖品" value="2"></el-option>
                    <el-option key="3" label="金币商城商品" value="3"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.getType"
                    placeholder="领取类型"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="注册送券" value="1"></el-option>
                    <el-option key="2" label="聊天室领取" value="2"></el-option>
                    <el-option key="3" label="转盘抽奖" value="3"></el-option>
                    <el-option key="4" label="连续签到7天之后领取" value="4"></el-option>
                    <el-option key="5" label="金币商城兑换" value="5"></el-option>
                    <el-option key="6" label="后台发放" value="6"></el-option>
                    <el-option key="7" label="会员卡注册送券" value="7"></el-option>
                    <el-option key="8" label="会员卡充值送券" value="8"></el-option>
                    <el-option key="9" label="权益卡券包" value="9"></el-option>
                    <el-option key="10" label="员工推荐充值赠送" value="10"></el-option>
                    <el-option key="11" label="绑定售票系统的券" value="11"></el-option>
                    <el-option key="12" label="绑定本平台的券" value="12"></el-option>
                    <el-option key="13" label="点映组团成功送券" value="13"></el-option>
                    <el-option key="14" label="扫码领券" value="14"></el-option>
                </el-select>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    style="margin-top: 10px;width: 90px;"
                    @click="Search"
                >搜索</el-button>
                <el-button
                        type="primary"
                        @click="delAllcoupon"
                        style="float: right;margin-top: 10px"
                        icon="el-icon-circle-plus-outline"
                >批量删除优惠券</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                highlight-current-row
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="优惠券所属影院" width="190">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="用户名称" width="100">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="用户手机号" width="120">
                    <template slot-scope="scope">{{scope.row.userMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="优惠券名称" width="220">
                    <template slot-scope="scope">{{scope.row.couponName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="发放批次编号/券码" width="180">
                    <template slot-scope="scope">{{scope.row.sendCode}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="领取/绑定时间" width="160">
                    <template slot-scope="scope">{{scope.row.createDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="有效期开始时间" width="160">
                    <template slot-scope="scope">{{scope.row.startTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="有效期结束时间" width="160">
                    <template slot-scope="scope">{{scope.row.endTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="使用时间" width="160">
                    <template slot-scope="scope">{{scope.row.useTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="使用状态" width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'">未使用</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">已使用</el-tag>
                        <el-tag v-else-if="scope.row.status=='3'">已过期</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="领取类型" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.getType=='1'">注册送券</el-tag>
                        <el-tag v-else-if="scope.row.getType=='2'">聊天室领取</el-tag>
                        <el-tag v-else-if="scope.row.getType=='3'">转盘抽奖</el-tag>
                        <el-tag v-else-if="scope.row.getType=='4'">连续签到7天之后领取</el-tag>
                        <el-tag v-else-if="scope.row.getType=='5'">金币商城兑换</el-tag>
                        <el-tag v-else-if="scope.row.getType=='6'">后台发放</el-tag>
                        <el-tag v-else-if="scope.row.getType=='7'">会员卡注册送券</el-tag>
                        <el-tag v-else-if="scope.row.getType=='8'">会员卡充值送券</el-tag>
                        <el-tag v-else-if="scope.row.getType=='9'">权益卡券包</el-tag>
                        <el-tag v-else-if="scope.row.getType=='10'">员工推荐充值赠送</el-tag>
                        <el-tag v-else-if="scope.row.getType=='11'">绑定售票系统的券</el-tag>
                        <el-tag v-else-if="scope.row.getType=='12'">绑定本平台的券</el-tag>
                        <el-tag v-else-if="scope.row.getType=='13'">点映组团成功送券</el-tag>
                        <el-tag v-else-if="scope.row.getType=='14'">扫码领券</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="使用订单号" align="center" width="200">
                    <template slot-scope="scope">{{scope.row.orderNum}}</template>
                </el-table-column>
              <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            v-if="scope.row.status!='2'"
                            icon="el-icon-setting"
                            @click="delChange(scope.$index, scope.row)"
                        >删除</el-button>
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
            cinemaInfo: []
        };
    },
    created() {},
    mounted() {
        this.getMenu();
        this.getAllCinema();
    },
    methods: {
        delAllcoupon() {
            if(!this.multipleSelection||this.multipleSelection.length==0){
                this.message = '请先勾选需要删除的优惠券！';
                this.open();
                return;
            }
            this.$confirm('此操作将永久删除优惠券, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)',
                        target: document.querySelector('.div1')
                    });
                    let couponArr=[];
                    for(let x in this.multipleSelection){
                        couponArr.push(this.multipleSelection[x].id)
                    }
                    console.log(couponArr.join(','));
                    let deleteType='';
                    if(this.multipleSelection.length==15){
                        deleteType=2
                    }else{
                        deleteType=1
                    }
                    var jsonArr = [];
                    jsonArr.push({ key: 'deleteType', value: deleteType });
                    jsonArr.push({ key: 'ids', value: couponArr.join(',') });
                    jsonArr.push({ key: 'cinemaCode', value: this.query.cinemaCode });
                    jsonArr.push({ key: 'userMobile', value: this.query.userMobile });
                    jsonArr.push({ key: 'status', value: this.query.status });
                    jsonArr.push({ key: 'getType', value: this.query.getType});
                    jsonArr.push({ key: 'orderNum', value: this.query.orderNo});
                    jsonArr.push({ key: 'couponName', value: this.query.couponName});
                    jsonArr.push({ key: 'sendCode', value: this.query.sendCode});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    console.log(jsonArr);
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/userCoupon/deleteUserCouponBatch', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.$message.success(`删除成功`);
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
            })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        delChange(index, row) {
            //删除数据
            this.$confirm('此操作将永久删除该优惠券, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            this.idx = index;
            this.form = row;
            let jsonArr = [];
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchDelete('/userCoupon/deleteUserCoupon', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.$message.error(`删除了`);
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
            })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
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
                        res.unshift({cinemaName:'全部影院',cinemaCode: '0'})
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
                let sendCode = this.query.sendCode;
                let couponType  = this.query.couponType ;
                let orderNo = this.query.orderNo;
                let userMobile = this.query.userMobile;
                let status = this.query.status;
                let getType = this.query.getType;
                let couponName = this.query.couponName;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!couponType ) {
                    couponType  = '';
                }
                if (!sendCode) {
                    sendCode = '';
                }
                if (!couponName) {
                    couponName = '';
                }
                if (!orderNo) {
                    orderNo = '';
                }
                if (!userMobile) {
                    userMobile = '';
                }
                if (!status) {
                    status = '';
                }
                if (!getType) {
                    getType = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'couponType', value: couponType  });
                jsonArr.push({ key: 'orderNum', value: orderNo });
                jsonArr.push({ key: 'couponName', value: couponName });
                jsonArr.push({ key: 'userMobile', value: userMobile });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'sendCode', value: sendCode });
                jsonArr.push({ key: 'getType', value: getType });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/userCoupon/page', params)
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
            console.log(val);
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

