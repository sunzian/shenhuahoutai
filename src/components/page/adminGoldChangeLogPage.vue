<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 金币明细列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                        v-model="query.businessCode"
                        placeholder="请选择商家"
                        class="mr10"
                        clearable
                        @change="changeBusiness"
                >
                    <el-option
                            v-for="item in businessInfo"
                            :key="item.businessCode"
                            :label="item.businessName"
                            :value="item.businessCode"
                    ></el-option>
                </el-select>
                <el-select clearable v-model="query.cinemaCode" placeholder="请选择影院" @change="changeSearchCinema" class="mr10">
                    <el-option
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input
                        placeholder="用户手机号"
                        v-model="query.mobilePhone"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-date-picker
                        v-model="query.startDate"
                        type="datetime"
                        class="mr10"
                        style="margin-top: 10px"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        default-time="06:00:00"
                        placeholder="操作开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                        v-model="query.endDate"
                        type="datetime"
                        class="mr10"
                        style="margin-top: 10px"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="操作结束时间（止）"
                ></el-date-picker>
                <el-select
                        clearable
                        v-model="query.Type"
                        placeholder="变动类型"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="签到获取" value="1"></el-option>
                    <el-option key="2" label="积分兑换" value="2"></el-option>
                    <el-option key="3" label="抽奖消耗" value="3"></el-option>
                    <el-option key="4" label="金币商品兑换" value="4"></el-option>
                    <el-option key="5" label="邀请好友注册得金币" value="5"></el-option>
                    <el-option key="6" label="购买影票赠送" value="6"></el-option>
                    <el-option key="7" label="购买卖品赠送" value="7"></el-option>
                    <el-option key="8" label="金币商品退款" value="8"></el-option>
                </el-select>
                <el-button
                        type="primary"
                        icon="el-icon-search"
                        style="margin-top: 10px;width: 90px;"
                        @click="Search"
                >搜索</el-button>
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
                <!--<el-table-column type="selection" width="55"></el-table-column>-->
                <el-table-column label="影院名称" width="210">
                    <template slot-scope="scope">{{scope.row.userCinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院编码" width="110">
                    <template slot-scope="scope">{{scope.row.userCinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="用户名" width="120">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="用户手机号" width="120">
                    <template slot-scope="scope">{{scope.row.userMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="金币过期时间" width="190">
                    <template slot-scope="scope">{{scope.row.overDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="操作时间" width="160">
                    <template slot-scope="scope">{{scope.row.createDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="数量" width="80">
                    <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="备注" width="480">
                    <template slot-scope="scope">{{scope.row.memo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="变动类型" width="150">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type=='1'">签到获取</el-tag>
                        <el-tag v-else-if="scope.row.type=='2'">积分兑换</el-tag>
                        <el-tag v-else-if="scope.row.type=='3'">抽奖消耗</el-tag>
                        <el-tag v-else-if="scope.row.type=='4'">金币商品兑换</el-tag>
                        <el-tag v-else-if="scope.row.type=='5'">邀请好友注册得金币</el-tag>
                        <el-tag v-else-if="scope.row.type=='6'">购买影票赠送</el-tag>
                        <el-tag v-else-if="scope.row.type=='7'">购买卖品赠送</el-tag>
                        <el-tag v-else-if="scope.row.type=='8'">金币商品退款</el-tag>
                    </template>
                </el-table-column>
                <!--<el-table-column label="操作" align="center" fixed="right">-->
                <!--<template slot-scope="scope">-->
                <!--<el-button-->
                <!--type="text"-->
                <!--icon="el-icon-setting"-->
                <!--@click="delChange(scope.$index, scope.row)"-->
                <!--&gt;删除</el-button>-->
                <!--</template>-->
                <!--</el-table-column>-->
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
            this.getAllBusiness();
        },
        methods: {
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
            },
            changeBusiness(val) {
                this.query.cinemaCode = '';
                this.cinemaInfo = [];
                this.query.businessCode = val;
                this.getAllCinema();
                this.$forceUpdate();
            },
            changeSearchCinema(val) {
                this.$forceUpdate();
                this.query.cinemaCode = val;
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
                    let startDate = this.query.startDate;
                    let endDate = this.query.endDate;
                    let mobilePhone = this.query.mobilePhone;
                    let Type = this.query.Type;
                    let businessCode = this.query.businessCode;
                    if (!businessCode) {
                        businessCode = '';
                    }
                    if (!cinemaCode) {
                        cinemaCode = '';
                    }
                    if (!startDate) {
                        startDate = '';
                    }
                    if (!endDate) {
                        endDate = '';
                    }
                    if (!mobilePhone) {
                        mobilePhone = '';
                    }
                    if (!Type) {
                        Type = '';
                    }
                    let jsonArr = [];
                    jsonArr.push({ key: 'businessCode', value: businessCode });
                    jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                    jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                    jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                    jsonArr.push({ key: 'startDate', value: startDate });
                    jsonArr.push({ key: 'endDate', value: endDate });
                    jsonArr.push({ key: 'mobilePhone', value: mobilePhone });
                    jsonArr.push({ key: 'Type', value: Type });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    console.log(jsonArr);
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/admin/goldChangeLog/goldChangeLogPage', params)
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


