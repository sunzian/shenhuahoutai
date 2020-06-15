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
                <el-select
                    clearable
                    filterable
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
                <el-select filterable clearable v-model="query.cinemaCode" placeholder="请选择影院" @change="changeSearchCinema" class="mr10">
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-select clearable v-model="query.screenCode" placeholder="请选择影厅" class="mr10">
                    <el-option
                            v-for="item in screenInfo"
                            :key="item.screenCode"
                            :label="item.screenName"
                            :value="item.screenCode"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="影片名称"
                    v-model="query.filmName"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    placeholder="订单号"
                    v-model="query.submitOrderCode"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input placeholder="手机号" v-model="query.mobile" autocomplete="off" class="mr10"></el-input>
                <el-input
                        placeholder="会员卡号"
                        v-model="query.cardNo"
                        autocomplete="off"
                        class="mr10"
                        style="margin-top: 10px"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.payWay"
                    placeholder="支付方式"
                    class="handle-select mr10"
                >
                    <el-option key="0" label="微信" value="0"></el-option>
                    <el-option key="1" label="会员卡" value="1"></el-option>
                    <el-option key="2" label="app会员卡" value="2"></el-option>
                    <el-option key="3" label="app微信" value="3"></el-option>
                    <el-option key="4" label="app支付宝" value="4"></el-option>
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
                    v-model="query.orderStatus"
                    placeholder="订单状态"
                    class="handle-select mr10"
                >
                    <el-option key="4" label="未取票" value="4"></el-option>
                    <el-option key="5" label="已取票" value="5"></el-option>
                    <el-option key="6" label="已退票" value="6"></el-option>
                    <el-option key="0" label="锁座失败" value="0"></el-option>
                    <el-option key="1" label="已锁座" value="1"></el-option>
                    <el-option key="2" label="已提交" value="2"></el-option>
                    <el-option key="3" label="下单失败" value="3"></el-option>
                </el-select>
                <el-date-picker
                    v-model="query.startDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    default-time="06:00:00"
                    placeholder="支付开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.endDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    default-time="06:00:00"
                    placeholder="支付结束时间（止）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.sessionStartDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    default-time="06:00:00"
                    placeholder="场次开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.sessionEndDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="场次结束时间（止）"
                ></el-date-picker>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    style="margin-top: 10px;width: 90px;"
                    @click="Search"
                    class="mr10"
                >搜索</el-button>
                <el-button
                    type="primary"
                    @click="derive"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >导出</el-button>
            </div>
            <div class="handle-box">
                票数：
                <el-input
                    style="width: 100px"
                    v-model="totalData.totalTicketNumber"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>原价：
                <el-input
                    style="width: 100px"
                    v-model="totalData.totalOriginalPrice"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>总实付：
                <el-input
                    style="width: 100px"
                    v-model="totalData.totalActualPrice"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>优惠券金额：
                <el-input
                    style="width: 100px"
                    v-model="totalData.totalCouponDiscount"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>活动优惠：
                <el-input
                    style="width: 100px"
                    v-model="totalData.totalActivityDiscount"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>平台代售费：
                <el-input
                    style="width: 100px"
                    v-model="totalData.totalPlatHandFee"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>回传金额：
                <el-input
                    style="width: 100px"
                    v-model="totalData.totalSubmitPrice"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>上报金额：
                <el-input
                    style="width: 100px"
                    v-model="totalData.totalReportPrice"
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
                highlight-current-row
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="影院编码" width="85">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column label="订单号" width="100">
                    <template slot-scope="scope">{{scope.row.submitOrderCode}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="场次时间" width="100">
                    <template slot-scope="scope">{{scope.row.sessionTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影片名称" width="100">
                    <template slot-scope="scope">{{scope.row.filmName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="会员卡号码" width="110">
                    <template slot-scope="scope">{{scope.row.cardNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号码" width="110">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影厅名称" width="125">
                    <template slot-scope="scope">{{scope.row.screenName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="票数" width="50">
                    <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="座位" width="80">
                    <template slot-scope="scope">{{scope.row.seatName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="原价" width="60">
                    <template slot-scope="scope">{{scope.row.totalOriginalPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="最低票价活动" width="80">
                    <template slot-scope="scope">{{scope.row.totalLowestPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="实付价" width="70">
                    <template slot-scope="scope">{{scope.row.totalActualPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="回传金额" width="80">
                    <template slot-scope="scope">{{scope.row.totalSubmitPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="服务费" width="70">
                    <template slot-scope="scope">{{scope.row.totalServiceFee}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="平台代售费" width="100">
                    <template slot-scope="scope">{{scope.row.totalPlatHandFee}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="活动优惠" width="80">
                    <template slot-scope="scope">{{scope.row.totalActivityDiscount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="优惠券优惠" width="100">
                    <template slot-scope="scope">{{scope.row.totalCouponDiscount}}</template>
                </el-table-column>
                <!--<el-table-column prop="memo" label="上报金额" width="80">-->
                <!--<template slot-scope="scope">{{scope.row.totalReportPrice}}</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="memo" label="支付时间" width="100">
                    <template slot-scope="scope">{{scope.row.payTime}}</template>
                </el-table-column>
                <el-table-column label="支付方式" align="center" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.payWay=='0'">微信</el-tag>
                        <el-tag v-else-if="scope.row.payWay=='1'">会员卡</el-tag>
                        <el-tag v-else-if="scope.row.payWay=='2'">app会员卡</el-tag>
                        <el-tag v-else-if="scope.row.payWay=='3'">app微信</el-tag>
                        <el-tag v-else-if="scope.row.payWay=='4'">app支付宝</el-tag>
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
                <el-table-column label="订单状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.orderStatus=='0'" type="danger">锁座失败</el-tag>
                        <el-tag v-else-if="scope.row.orderStatus=='1'" type="success">已锁座</el-tag>
                        <el-tag v-else-if="scope.row.orderStatus=='2'" type="danger">已提交</el-tag>
                        <el-tag v-else-if="scope.row.orderStatus=='3'" type="danger">下单失败</el-tag>
                        <el-tag v-else-if="scope.row.orderStatus=='4'" type="danger">未取票</el-tag>
                        <el-tag v-else-if="scope.row.orderStatus=='5'" type="danger">已取票</el-tag>
                        <el-tag v-else-if="scope.row.orderStatus=='6'" type="danger">已退票</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="开卡影院" width="185">
                    <template slot-scope="scope">{{scope.row.openCardCinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="消费影院" width="185">
                    <template slot-scope="scope">{{scope.row.bindCardCinemaName}}</template>
                </el-table-column>
                <!--<el-table-column label="取票状态" align="center">-->
                <!--<template slot-scope="scope">-->
                <!--<el-tag v-if="scope.row.printStatus=='0'" type="danger">未取票</el-tag>-->
                <!--<el-tag v-else-if="scope.row.printStatus=='1'" type="success">已取票</el-tag>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="退票状态" align="center">-->
                <!--<template slot-scope="scope">-->
                <!--<el-tag v-if="scope.row.cancelStatus=='1'" type="success">已退票</el-tag>-->
                <!--<el-tag v-else type="danger">未退票</el-tag>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <!-- <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            v-if="scope.row.payStatus=='1'"
                            @click="refundTicket(scope.$index, scope.row)"
                        >退款</el-button> -->
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="addChange(scope.$index, scope.row)"
                        >查看</el-button>
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
                <el-form-item label="开卡影院" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.openCardCinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="绑卡影院" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.bindCardCinemaName"
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
                        v-model="form.orderStatus"
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
import { Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend } from '@/aes/utils';
import md5 from 'js-md5';
import axios from 'axios';
import https from '../../https';
export default {
    name: 'basetable',
    data() {
        return {
            cinemaInfo: [],
            businessInfo: [],
            screenInfo: [],
            totalData: [],
            tableData: [],
            message: '', //弹出框消息
            query: {
                payStatus:'1',
                pageNo: 1,
                pageSize: 15,
                startDate: '',
                endDate: '',
            },
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            formLabelWidth: '120px',
            businessInfoList: [],
            value: '',
            form: []
        };
    },
    created() {},
    mounted() {
        this.getAllBusiness();
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
                    .fetchPost('/admin/ticketOrder/getOrderById', params)
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
                            } else if (JSON.parse(Decrypt(data.data.data)).payWay == 2) {
                                this.form.payWay = 'app会员卡';
                            } else if (JSON.parse(Decrypt(data.data.data)).payWay == 3) {
                                this.form.payWay = 'app微信';
                            } else if (JSON.parse(Decrypt(data.data.data)).payWay == 4) {
                                this.form.payWay = 'app支付宝';
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
                            if (JSON.parse(Decrypt(data.data.data)).orderStatus == 0) {
                                this.form.orderStatus = '锁座失败';
                            } else if (JSON.parse(Decrypt(data.data.data)).orderStatus == 1) {
                                this.form.orderStatus = '已锁座';
                            } else if (JSON.parse(Decrypt(data.data.data)).orderStatus == 2) {
                                this.form.orderStatus = '已提交';
                            } else if (JSON.parse(Decrypt(data.data.data)).orderStatus == 3) {
                                this.form.orderStatus = '下单失败';
                            } else if (JSON.parse(Decrypt(data.data.data)).orderStatus == 4) {
                                this.form.orderStatus = '未取票';
                            } else if (JSON.parse(Decrypt(data.data.data)).orderStatus == 5) {
                                this.form.orderStatus = '已取票';
                            } else if (JSON.parse(Decrypt(data.data.data)).orderStatus == 6) {
                                this.form.orderStatus = '已退票';
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
        derive() {
            // const loading = this.$loading({
            //     lock: true,
            //     text: 'Loading',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.7)',
            //     target: document.querySelector('.div1')
            // });
            setTimeout(() => {
                let cinemaCode = this.query.cinemaCode;
                let businessCode = this.query.businessCode;
                let orderNo = this.query.orderNo;
                let mobile = this.query.mobile;
                let payWay = this.query.payWay;
                let payStatus = this.query.payStatus;
                let orderStatus = this.query.orderStatus;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let sessionStartDate = this.query.sessionStartDate;
                let sessionEndDate = this.query.sessionEndDate;
                let screenCode = this.query.screenCode;
                if (!screenCode) {
                    screenCode = '';
                }
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
                if (!payStatus) {
                    payStatus = '';
                }
                if (!orderStatus) {
                    orderStatus = '';
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
                jsonArr.push({ key: 'tableName', value: 'ticket_order' });
                jsonArr.push({
                    key: 'exportKeysJson',
                    value:
                        "['id','cinemaCode','screenName','orderNo','submitOrderCode','sessionTime','mobile','filmName','seatName','number','totalOriginalPrice','totalPrice','totalServiceFee','totalPlatHandFee','totalCinemaAllowance','totalLowestPrice','totalActivityDiscount','totalCouponDiscount','totalActualPrice','totalReportPrice','totalSubmitPrice','chPayStatus','chPayWay','payTime','chOrderStatus','submitTime','openCardCinemaName','bindCardCinemaName','chActivityType','activityName','userCouponName','printNo','submitMessage','cancelTime','totalRefundHandFee','refundReason','tradeNo']"
                });
                jsonArr.push({
                    key: 'exportTitlesJson',
                    value:
                        "['ID','影院编码','影厅名称','本地单号','售票系统单号','场次时间','手机号','影片名称','座位','数量','总原价','原票价','服务费','代售费','影院补贴','最低票价','活动优惠金额','优惠券优惠金额','实付金额','上报金额','回传金额','支付状态','支付方式','支付时间','订单状态','下单时间','开卡影院','消费影院','活动类型','活动名称','优惠券名称','取票码','下单失败原因','退票时间','退票手续费','退款原因','支付交易号']"
                });
                jsonArr.push({ key: 'businessCode', value: businessCode });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'screenCode', value: screenCode });
                jsonArr.push({ key: 'orderNo', value: orderNo });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'payWay', value: payWay });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'orderStatus', value: orderStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'sessionStartDate', value: sessionStartDate });
                jsonArr.push({ key: 'sessionEndDate', value: sessionEndDate });
                var params = ParamsAppend(jsonArr);
                let businessName = '';
                for (let i = 0;i < this.businessInfo.length; i ++) {
                    if (businessCode == this.businessInfo[i].businessCode) {
                        businessName = this.businessInfo[i].businessName
                    }
                }
                let myObj = {
                    method: 'get',
                    url: '/exportExcel/ticketOrder',
                    fileName: businessName + '_影票订单统计',
                    params: params
                };
                https.exportCouponMethod(myObj);
                // loading.close();
            }, 1500);
        },
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
        getAllBusiness() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            https
                .fetchPost('businessInfo/getBusinessList')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.businessInfo = res;
                        this.query.businessCode = res[0].businessCode;
                        this.getAllCinema();
                        //获取当前时间
                        var day1 = new Date();
                        day1.setTime(day1.getTime()-24*60*60*1000);
                        var s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
                        //获取昨天时间
                        var day2 = new Date();
                        day2.setTime(day2.getTime());
                        var s2 = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();
                        //加上早上六点
                        this.query.startDate=this.timestampToTime(new Date(s1).getTime()+21600000)
                        this.query.endDate=this.timestampToTime(new Date(s2).getTime()+21600000)
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
            this.getAllScreen(val);
            this.$forceUpdate();
            this.query.cinemaCode = val;
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
                let submitOrderCode = this.query.submitOrderCode;
                let mobile = this.query.mobile;
                let cardNo = this.query.cardNo;
                let payWay = this.query.payWay;
                let payStatus = this.query.payStatus;
                let orderStatus = this.query.orderStatus;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let sessionStartDate = this.query.sessionStartDate;
                let sessionEndDate = this.query.sessionEndDate;
                let filmName = this.query.filmName;
                let screenCode = this.query.screenCode;
                if (!screenCode) {
                    screenCode = '';
                }
                if (!filmName) {
                    filmName = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!businessCode) {
                    businessCode = '';
                }
                if (!submitOrderCode) {
                    submitOrderCode = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!cardNo) {
                    cardNo = '';
                }
                if (!payWay) {
                    payWay = '';
                }
                if (!payStatus) {
                    payStatus = '';
                }
                if (!orderStatus) {
                    orderStatus = '';
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
                jsonArr.push({ key: 'filmName', value: filmName });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'screenCode', value: screenCode });
                jsonArr.push({ key: 'businessCode', value: businessCode });
                jsonArr.push({ key: 'submitOrderCode', value: submitOrderCode });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'cardNo', value: cardNo });
                jsonArr.push({ key: 'payWay', value: payWay });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'orderStatus', value: orderStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'sessionStartDate', value: sessionStartDate });
                jsonArr.push({ key: 'sessionEndDate', value: sessionEndDate });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                console.log(jsonArr);
                https
                    .fetchPost('admin/ticketOrder/ticketOrderPage', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            if (data.data && data.data.data) {
                                var oData = JSON.parse(Decrypt(data.data.data));
                                this.tableData = oData.pageResult.data;
                                this.totalData = oData.statistics;
                                this.query.pageSize = oData.pageResult.pageSize;
                                this.query.pageNo = oData.pageResult.pageNo;
                                this.query.totalCount = oData.pageResult.totalCount;
                                this.query.totalPage = oData.pageResult.totalPage;
                                this.getAllScreen();
                            } else {
                                this.tableData = [];
                                this.totalData = [];
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
            }, 1000);
        },
        // 退票
        refundTicket(index, row) {
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
                            .fetchPost('/admin/ticketOrder/refundTicketAmount', params)
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
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        handleSizeChange(val) {
            this.query.pageSize=val;
            this.getMenu()
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
        timestampToTime (timestamp) {
            const dateObj = new Date(+timestamp) // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
            const year = dateObj.getFullYear() // 获取年，
            const month = dateObj.getMonth() + 1 // 获取月，必须要加1，因为月份是从0开始计算的
            const date = dateObj.getDate() // 获取日，记得区分getDay()方法是获取星期几的。
            const hours = this.pad(dateObj.getHours())  // 获取时, pad函数用来补0
            const minutes =  this.pad(dateObj.getMinutes()) // 获取分
            const seconds =  this.pad(dateObj.getSeconds()) // 获取秒
            return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds
        },
        pad(str) {
            return +str >= 10 ? str : '0' + str
        },
        // 获取所有影厅
        getAllScreen(val) {
            if (!val) {
                return;
            }
            var jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: val });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/screenInfo/getScreenByCinema', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.screenInfo = res;
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

