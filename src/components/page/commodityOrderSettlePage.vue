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
                <el-select
                    clearable
                    v-model="query.cinemaCode"
                    @change="changeSearchCinema"
                    placeholder="请选择影院"
                    class="mr10"
                >
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
                <el-input
                    placeholder="推荐人手机号"
                    class="mr10"
                    v-model="query.shareMobile"
                    autocomplete="off"
                ></el-input>
                <!-- <el-select
                        clearable
                        v-model="query.settleStatus"
                        placeholder="商户订单是否结算"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="未结算" value="1"></el-option>
                    <el-option key="2" label="已结算" value="2"></el-option>
                </el-select>-->
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
                    v-model="query.payWay"
                    placeholder="支付方式"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="微信小程序支付" value="1"></el-option>
                    <el-option key="2" label="app微信支付" value="2"></el-option>
                    <el-option key="3" label="app支付宝支付" value="3"></el-option>
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
                    v-model="query.pickupWay"
                    placeholder="取货方式"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="自提" value="1"></el-option>
                    <el-option key="2" label="快递" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.trackingStatus"
                    placeholder="快递状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="待发货" value="1"></el-option>
                    <el-option key="2" label="快递中" value="2"></el-option>
                    <el-option key="3" label="已送达" value="3"></el-option>
                    <el-option key="4" label="已收货" value="4"></el-option>
                </el-select>
                <el-input
                    placeholder="快递单号"
                    class="mr10"
                    v-model="query.trackingNumber"
                    autocomplete="off"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.payStatus"
                    placeholder="兑换状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="兑换成功" value="1"></el-option>
                    <el-option key="2" label="兑换失败" value="2"></el-option>
                    <el-option key="3" label="兑换超时" value="3"></el-option>
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
                <!-- <el-select
                        clearable
                        v-model="query.commodityType"
                        placeholder="商品类型"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="实物" value="1"></el-option>
                    <el-option key="2" label="优惠券" value="2"></el-option>
                    <el-option key="3" label="券包" value="3"></el-option>
                    <el-option key="4" label="商户商品" value="4"></el-option>
                    <el-option key="5" label="权益卡" value="5"></el-option>
                </el-select>-->
                <el-select
                    clearable
                    v-model="query.orderType"
                    placeholder="订单类型"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="商品订单" value="1"></el-option>
                    <el-option key="2" label="秒杀订单" value="2"></el-option>
                </el-select>
                <el-button
                    style="margin-top: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="Search"
                >搜索</el-button>
                <el-button
                    style="margin-top: 10px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="settleOrders"
                >批量修改订单结算</el-button>
                <el-button
                    style="margin-top: 10px;margin-right:10px;"
                    type="success"
                    @click="selectAll"
                >全选</el-button>
                <!-- <el-button
                        type="primary"
                        @click="derive"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px;margin-left:10px"
                >导出
                </el-button>-->
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
                ></el-input>总购买数量：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalNumber"
                    :disabled="true"
                    autocomplete="off"
                ></el-input>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                highlight-current-row
                :row-key="getRowKeys"
                header-cell-class-name="table-header"
                @selection-change="selectThisPage"
                @select="selectOne"
            >
                <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                <el-table-column prop="name" label="兑换影院名称" width="210">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="领取影院名称" width="210">
                    <template slot-scope="scope">{{scope.row.exchangeCinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="收款影院名称" width="210">
                    <template slot-scope="scope">{{scope.row.payCinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="会员手机号" width="110">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="推荐人手机号" width="110">
                    <template slot-scope="scope">{{scope.row.shareMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="商品名称" width="180">
                    <template slot-scope="scope">{{scope.row.commodityName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="购买数量" width="80">
                    <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="消耗金币" width="80">
                    <template slot-scope="scope">{{scope.row.gold}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="实付" width="60">
                    <template slot-scope="scope">{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="下单时间" width="160">
                    <template slot-scope="scope">{{scope.row.payTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付方式" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.payWay=='1'">微信小程序支付</el-tag>
                        <el-tag v-else-if="scope.row.payWay=='2'">app微信支付</el-tag>
                        <el-tag v-else-if="scope.row.payWay=='3'">app支付宝支付</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="兑换状态" align="center" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row. payStatus=='0'">待支付</el-tag>
                        <el-tag v-else-if="scope.row. payStatus=='1'">兑换成功</el-tag>
                        <el-tag v-else-if="scope.row. payStatus=='2'">兑换失败</el-tag>
                        <el-tag v-else-if="scope.row. payStatus=='3'">兑换超时</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="退款状态" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.refundStatus=='0'">未退款</el-tag>
                        <el-tag v-else-if="scope.row.refundStatus=='1'">退款成功</el-tag>
                        <el-tag v-else-if="scope.row.refundStatus=='2'">退款失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="取货方式" align="center" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pickupWay=='1'">自提</el-tag>
                        <el-tag v-else-if="scope.row.pickupWay=='2'">快递</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="核销状态" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'">未核销</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">已核销</el-tag>
                        <el-tag v-else-if="scope.row.status=='3'">已过期</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="订单类型" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.orderType=='1'">商品订单</el-tag>
                        <el-tag v-else-if="scope.row.orderType=='2'">秒杀订单</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="快递状态" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.trackingStatus=='1'">待发货</el-tag>
                        <el-tag v-else-if="scope.row.trackingStatus=='2'">快递中</el-tag>
                        <el-tag v-else-if="scope.row.trackingStatus=='3'">已送达</el-tag>
                        <el-tag v-else-if="scope.row.trackingStatus=='4'">已收货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="订单结算状态" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.settleStatus=='1'">未结算</el-tag>
                        <el-tag v-else-if="scope.row.settleStatus=='2'">已结算</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="收货人手机号" width="110">
                    <template slot-scope="scope">{{scope.row.deliveryMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="收货人名称" width="120">
                    <template slot-scope="scope">{{scope.row.deliveryName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="领取时间" width="160">
                    <template slot-scope="scope">{{scope.row.getDate}}</template>
                </el-table-column>
                <el-table-column label="订单号" width="190">
                    <template slot-scope="scope">{{scope.row.orderNo}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="addChange(scope.$index, scope.row)"
                        >查看</el-button>
                        <el-button
                            v-if="scope.row.settleStatus=='1' && scope.row.commodityType=='4'"
                            type="text"
                            icon="el-icon-setting"
                            @click="settle(scope.$index, scope.row)"
                        >订单结算</el-button>
                        <!-- <el-button
                                v-if="scope.row.pickupWay=='2' && scope.row.refundStatus != '1' && scope.row.payStatus == '1'"
                                type="text"
                                icon="el-icon-setting"
                                @click="logChange(scope.$index, scope.row)"
                        >修改
                        </el-button>-->
                        <!-- <el-button
                                v-if="scope.row.pickupWay=='1' && scope.row.status=='1' && scope.row.refundStatus!='1' && scope.row.payStatus == '1'"
                                type="text"
                                icon="el-icon-setting"
                                @click="statusChange(scope.$index, scope.row)"
                        >核销
                        </el-button>-->
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
                <el-form-item label="商品名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.commodityName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item v-if="form.attribute" label="商品属性" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.attribute"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item v-if="form.specifications" label="商品规格" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.specifications"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
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
                        id="inviteCode"
                    ></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                        style="color: rgb(64,158,255);cursor: pointer;"
                        @click="copy"
                    >点击复制订单号</span>
                </el-form-item>
                <el-form-item label="用户手机号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.mobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="推荐人手机号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.shareMobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="用户备注" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.remark"
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
                <el-form-item label="兑换方式" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.payWay"
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
                <el-form-item label="购买数量" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.number"
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
                <el-form-item label="取货方式" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.pickupWay"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="物流单号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.trackingNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="快递状态" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.trackingStatus"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="收货人名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.deliveryName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="收货人电话" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.deliveryMobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="收货人地址" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        type="textarea"
                        rows="4"
                        v-model="form.deliveryAddressDetail"
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改物流弹出框 -->
        <el-dialog :close-on-click-modal="false" title="物流" :visible.sync="logVisible">
            <el-form ref="form" :model="form1">
                <el-form-item label="领取影院名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form1.exchangeCinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="订单编号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form1.orderNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="物流单号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form1.trackingNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="收货人名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form1.deliveryName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="收货人电话" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form1.deliveryMobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="收货人地址" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        type="textarea"
                        rows="4"
                        v-model="form1.deliveryAddressDetail"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商品名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form1.commodityName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="物流公司名称" :label-width="formLabelWidth">
                    <el-select clearable v-model="form1.trackingName" placeholder="请选择">
                        <el-option
                            v-for="item in supportDeliveryList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="(form1.trackingName!='zxps')"
                    label="物流单号"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        style="width: 250px"
                        v-model="form1.trackingNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    v-if="(form1.trackingName!='zxps')"
                    label="物流状态"
                    :label-width="formLabelWidth"
                >
                    <el-select v-model="form1.trackingStatus" placeholder="请选择商品类型">
                        <el-option
                            v-for="item in commodityType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="logVisible = false">取 消</el-button>
                <el-button type="primary" @click="exLogChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 导入excel -->
        <el-dialog :close-on-click-modal="false" title="导入excel" :visible.sync="excelVisible">
            <el-form :model="excelForm">
                <el-form-item :required="true" label="下载导入模板：" :label-width="formLabelWidth">
                    <a
                        href="http://wanht.oss-cn-hangzhou.aliyuncs.com/images/excel/template/金币商城_物流订单导入模板.xlsx"
                    >点击下载模板</a>
                </el-form-item>
                <el-form-item :required="true" label="选择excel文件：" :label-width="formLabelWidth">
                    <el-upload
                        class="upload-demo"
                        :action="uploadAction"
                        ref="upload"
                        :on-change="changeExcel"
                        :on-success="uploadExcel"
                        :before-upload="beforeExcel"
                        :auto-upload="false"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">请按模板上传，上传模板只能是 xls、xlsx格式!</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="excelVisible = false">取 消</el-button>
                <el-button type="primary" @click="downExcel">确 定</el-button>
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
            allCheck: 1, // 单数未全选，双数全选
            checkList: [],
            type: {
                type: ''
            },
            excelForm: {},
            excelVisible: false,
            uploadAction: 'api/commodityChangeRecord/importExcelTrackingInfo',
            hasExcel: false,
            successUpLoad: false,
            query: {
                pageNo: 1,
                pageSize: 15,
                payStatus: '1'
            },
            editVisible: false,
            logVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            formLabelWidth: '180px',
            businessInfoList: [],
            value: '',
            form: [],
            form1: [],
            supportDeliveryList: [],
            cinemaInfo: [],
            partnerInfo: [],
            commodityType: [
                {
                    value: '1',
                    label: '待发货'
                },
                {
                    value: '2',
                    label: '快递中'
                },
                {
                    value: '3',
                    label: '已送达'
                },
                {
                    value: '4',
                    label: '已收货'
                }
            ]
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        // 订单结算
        settle(index, row) {
            this.$confirm('此操作将结算订单, 是否继续?', '提示', {
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
                    var jsonArr = [];
                    jsonArr.push({ key: 'id', value: row.id });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/cinemaPartner/orderSettleAccounts', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.message = `订单结算成功！`;
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
                            console.log(err);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
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
                let partnerCode = this.query.partnerCode;
                let settleStatus = this.query.settleStatus;
                let orderNo = this.query.orderNo;
                let commodityName = this.query.commodityName;
                let mobile = this.query.mobile;
                let shareMobile = this.query.shareMobile;
                let status = this.query.status;
                let payStatus = this.query.payStatus;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let commodityType = this.query.commodityType;
                let refundStatus = this.query.refundStatus;
                let changeType = this.query.changeType;
                let payWay = this.query.payWay;
                let pickupWay = this.query.pickupWay;
                let trackingStatus = this.query.trackingStatus;
                let trackingNumber = this.query.trackingNumber;
                let orderType = this.query.orderType;
                if (!orderType) {
                    orderType = '';
                }
                if (!commodityType) {
                    commodityType = '';
                }
                if (!trackingStatus) {
                    trackingStatus = '';
                }
                if (!trackingNumber) {
                    trackingNumber = '';
                }
                if (!changeType) {
                    changeType = '';
                }
                if (!payWay) {
                    payWay = '';
                }
                if (!pickupWay) {
                    pickupWay = '';
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
                if (!shareMobile) {
                    shareMobile = '';
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
                        "['cinemaName','exchangeCinemaName','partnerName','payCinemaName','chSettleStatusString','orderNo','mobile','stringPayWay','shareMobile','remark','commodityName','gold','number','money','getDate','payTime','chPayStatus','chPickupWay','trackingNumber','chTrackingStatus','deliveryName','deliveryMobile','province','city','district','deliveryAddressDetail','tradeNo','payReturnMsg','chChangeType','chStatus','chRefundStatus','orderTypeName','refundNo','refundReason','refundApply','refundTime','refundPrice']"
                });
                jsonArr.push({
                    key: 'exportTitlesJson',
                    value:
                        "['兑换影院名称','领取影院名称','商户名称','收款影院名称','商户订单结算状态','订单号','手机号','支付方式','推荐人手机号','用户备注','商品名称','消费金币','购买数量','支付金额','领取时间','下单时间','兑换状态','取货方式','物流单号','快递状态','收货人名称','收货人电话','省','市','区','收货人地址','支付交易号','支付回调消息','兑换方式','核销状态','退款状态','订单类型','退款交易号','退款原因','微信退款回复','退款时间','退款金额']"
                });
                jsonArr.push({ key: 'commodityType', value: commodityType });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'partnerCode', value: partnerCode });
                jsonArr.push({ key: 'settleStatus', value: settleStatus });
                jsonArr.push({ key: 'orderNo', value: orderNo });
                jsonArr.push({ key: 'commodityName', value: commodityName });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'shareMobile', value: shareMobile });
                jsonArr.push({ key: 'refundStatus', value: refundStatus });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'changeType', value: changeType });
                jsonArr.push({ key: 'payWay', value: payWay });
                jsonArr.push({ key: 'pickupWay', value: pickupWay });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'trackingStatus', value: trackingStatus });
                jsonArr.push({ key: 'trackingNumber', value: trackingNumber });
                jsonArr.push({ key: 'orderType', value: orderType });
                var params = ParamsAppend(jsonArr);
                let myObj = {
                    method: 'get',
                    url: '/exportExcel/commodityChangeRecord',
                    fileName: '金币商城订单统计',
                    params: params
                };
                https.exportCouponMethod(myObj);
                // loading.close();
            }, 1500);
        },
        downderive() {
            this.excelVisible = true;
        },
        changeExcel(file, fileList) {
            this.hasExcel = true;
        },
        beforeExcel(file) {
            const extension = file.name.split('.')[file.name.split('.').length - 1] === 'xls';
            const extension2 = file.name.split('.')[file.name.split('.').length - 1] === 'xlsx';
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (!extension && !extension2) {
                this.message = '上传模板只能是 xls、xlsx格式!';
                this.open();
            }
            if (!isLt2M) {
                this.message = '上传模板大小不能超过 10MB!';
                this.open();
            }
            return extension || extension2;
        },
        uploadExcel(response) {
            this.successUpLoad = true;
            this.message = response.message;
            this.open();
            this.$refs.upload.clearFiles();
            this.hasExcel = false;
            this.excelVisible = false;
        },
        downExcel() {
            if (this.hasExcel == false) {
                this.message = '请上传文件！';
                this.open();
                return;
            }
            this.$refs.upload.submit();
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
            jsonArr.push({ key: 'pageSize', value: 200 });
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
                            console.log(JSON.parse(Decrypt(data.data.data)));
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
                            if (JSON.parse(Decrypt(data.data.data)).payWay == 1) {
                                this.form.payWay = '微信小程序支付';
                            } else if (JSON.parse(Decrypt(data.data.data)).payWay == 2) {
                                this.form.payWay = 'app微信支付';
                            } else if (JSON.parse(Decrypt(data.data.data)).payWay == 3) {
                                this.form.payWay = 'app支付宝支付';
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
                            } else if (JSON.parse(Decrypt(data.data.data)).payStatus == 3) {
                                this.form.payStatus = '支付过期';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).refundStatus == 0) {
                                this.form.refundStatus = '未退款';
                            } else if (JSON.parse(Decrypt(data.data.data)).refundStatus == 1) {
                                this.form.refundStatus = '退款成功';
                            } else if (JSON.parse(Decrypt(data.data.data)).refundStatus == 2) {
                                this.form.refundStatus = '退款失败';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).trackingStatus == 1) {
                                this.form.trackingStatus = '待发货';
                            } else if (JSON.parse(Decrypt(data.data.data)).trackingStatus == 2) {
                                this.form.trackingStatus = '快递中';
                            } else if (JSON.parse(Decrypt(data.data.data)).trackingStatus == 3) {
                                this.form.trackingStatus = '已送达';
                            } else if (JSON.parse(Decrypt(data.data.data)).trackingStatus == 4) {
                                this.form.trackingStatus = '已收货';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).pickupWay == 1) {
                                this.form.pickupWay = '自提';
                            } else if (JSON.parse(Decrypt(data.data.data)).pickupWay == 2) {
                                this.form.pickupWay = '快递';
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
        logChange(index, row) {
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
                    .fetchPost('/commodityChangeRecord/updateTrackingInfoPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.logVisible = true;
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            this.form1.id = row.id;
                            this.form1 = JSON.parse(Decrypt(data.data.data)).commodityChangeRecord;
                            this.supportDeliveryList = JSON.parse(Decrypt(data.data.data)).supportDeliveryList;
                            for (let x in this.commodityType) {
                                if (
                                    this.commodityType[x].value == JSON.parse(Decrypt(data.data.data)).commodityChangeRecord.trackingStatus
                                ) {
                                    this.form1.trackingStatus = this.commodityType[x].value;
                                    break;
                                }
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
        // 编辑物流操作
        exLogChanger() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: this.form1.id });
                jsonArr.push({ key: 'trackingName', value: this.form1.trackingName });
                jsonArr.push({ key: 'trackingNumber', value: this.form1.trackingNumber });
                jsonArr.push({ key: 'trackingStatus', value: this.form1.trackingStatus });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/commodityChangeRecord/updateTrackingInfo', params)
                    .then(data => {
                        loading.close();
                        // console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.logVisible = false;
                            this.$message.success(`编辑成功`);
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
        },
        statusChange(index, row) {
            this.$confirm('此操作将核销商品, 是否继续?', '提示', {
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
                    var jsonArr = [];
                    jsonArr.push({ key: 'id', value: row.id });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/commodityChangeRecord/verificationCommodityOrder', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.message = `核销成功！`;
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
                            console.log(err);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消更改'
                    });
                });
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
                let shareMobile = this.query.shareMobile;
                let payStatus = this.query.payStatus;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let changeType = this.query.changeType;
                let payWay = this.query.payWay;
                let status = this.query.status;
                let refundStatus = this.query.refundStatus;
                let cinemaCode = this.query.cinemaCode;
                let partnerCode = this.query.partnerCode;
                let commodityName = this.query.commodityName;
                let pickupWay = this.query.pickupWay;
                let trackingStatus = this.query.trackingStatus;
                let trackingNumber = this.query.trackingNumber;
                let orderType = this.query.orderType;
                if (!orderType) {
                    orderType = '';
                }
                if (!trackingStatus) {
                    trackingStatus = '';
                }
                if (!trackingNumber) {
                    trackingNumber = '';
                }
                if (!pickupWay) {
                    pickupWay = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!partnerCode) {
                    partnerCode = '';
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
                if (!shareMobile) {
                    shareMobile = '';
                }
                if (!status) {
                    status = '';
                }
                if (!changeType) {
                    changeType = '';
                }
                if (!payWay) {
                    payWay = '';
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
                jsonArr.push({ key: 'settleStatus', value: 1 });
                jsonArr.push({ key: 'commodityName', value: commodityName });
                jsonArr.push({ key: 'commodityType', value: 4 });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'shareMobile', value: shareMobile });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'changeType', value: changeType });
                jsonArr.push({ key: 'payWay', value: payWay });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'refundStatus', value: refundStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'pickupWay', value: pickupWay });
                jsonArr.push({ key: 'trackingStatus', value: trackingStatus });
                jsonArr.push({ key: 'trackingNumber', value: trackingNumber });
                jsonArr.push({ key: 'orderType', value: orderType });
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
                            console.log(oData);
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
        },
        // 复制订单号
        copy() {
            var Url = this.form.orderNo;
            var oInput = document.createElement('input');
            oInput.value = Url;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand('Copy'); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.style.display = 'none';
            alert('复制成功！');
        },
        // 获取id
        getRowKeys(row) {
            return row.id;
        },
        // 选中当前页
        selectThisPage(rows) {
            this.selectId = '';
            for (let i = 0; i < rows.length; i++) {
                this.selectId += ',' + rows[i].id;
            }
            if (this.selectId.substring(1).length > 0) {
                this.selectId = this.selectId.substring(1);
            }
            this.checkList = rows;
        },

        // 点击全选
        selectAll() {
            if (this.allCheck % 2 == 1) {
                this.tableData.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row, true);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
            this.allCheck += 1;
        },

        selectOne() {
            if (this.allCheck % 2 == 0) {
                this.allCheck += 1;
            }
        },
        // 批量结算
        settleOrders() {
            if (!this.selectId) {
                this.message = '请选择商品！';
                this.open();
                return;
            } else {
                this.$confirm('此操作将批量结算订单, 是否继续?', '提示', {
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
                        let jsonArr = [];
                        if (this.allCheck % 2 == 0) {
                            let orderNo = this.query.orderNo;
                            let mobile = this.query.mobile;
                            let shareMobile = this.query.shareMobile;
                            let payStatus = this.query.payStatus;
                            let startDate = this.query.startDate;
                            let endDate = this.query.endDate;
                            let changeType = this.query.changeType;
                            let payWay = this.query.payWay;
                            let status = this.query.status;
                            let refundStatus = this.query.refundStatus;
                            let cinemaCode = this.query.cinemaCode;
                            let partnerCode = this.query.partnerCode;
                            let commodityName = this.query.commodityName;
                            let pickupWay = this.query.pickupWay;
                            let trackingStatus = this.query.trackingStatus;
                            let trackingNumber = this.query.trackingNumber;
                            let orderType = this.query.orderType;
                            if (!orderType) {
                                orderType = '';
                            }
                            if (!trackingStatus) {
                                trackingStatus = '';
                            }
                            if (!trackingNumber) {
                                trackingNumber = '';
                            }
                            if (!pickupWay) {
                                pickupWay = '';
                            }
                            if (!cinemaCode) {
                                cinemaCode = '';
                            }
                            if (!partnerCode) {
                                partnerCode = '';
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
                            if (!shareMobile) {
                                shareMobile = '';
                            }
                            if (!status) {
                                status = '';
                            }
                            if (!changeType) {
                                changeType = '';
                            }
                            if (!payWay) {
                                payWay = '';
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
                            jsonArr.push({ key: 'orderIdList', value: '' });
                            jsonArr.push({ key: 'orderNo', value: orderNo });
                            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                            jsonArr.push({ key: 'partnerCode', value: partnerCode });
                            jsonArr.push({ key: 'settleStatus', value: 1 });
                            jsonArr.push({ key: 'commodityName', value: commodityName });
                            jsonArr.push({ key: 'commodityType', value: 4 });
                            jsonArr.push({ key: 'mobile', value: mobile });
                            jsonArr.push({ key: 'shareMobile', value: shareMobile });
                            jsonArr.push({ key: 'payStatus', value: payStatus });
                            jsonArr.push({ key: 'changeType', value: changeType });
                            jsonArr.push({ key: 'payWay', value: payWay });
                            jsonArr.push({ key: 'status', value: status });
                            jsonArr.push({ key: 'refundStatus', value: refundStatus });
                            jsonArr.push({ key: 'startDate', value: startDate });
                            jsonArr.push({ key: 'endDate', value: endDate });
                            jsonArr.push({ key: 'pickupWay', value: pickupWay });
                            jsonArr.push({ key: 'trackingStatus', value: trackingStatus });
                            jsonArr.push({ key: 'trackingNumber', value: trackingNumber });
                            jsonArr.push({ key: 'orderType', value: orderType });
                            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                            let sign = md5(preSign(jsonArr));
                            jsonArr.push({ key: 'sign', value: sign });
                            let params = ParamsAppend(jsonArr);
                            https
                                .fetchPost('/commodityChangeRecord/orderSettleAccounts', params)
                                .then(data => {
                                    loading.close();
                                    if (data.data.code == 'success') {
                                        this.message = `批量订单结算成功！`;
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
                                    console.log(err);
                                });
                        } else {
                            jsonArr.push({ key: 'orderIdList', value: this.selectId });
                            let sign = md5(preSign(jsonArr));
                            jsonArr.push({ key: 'sign', value: sign });
                            let params = ParamsAppend(jsonArr);
                            https
                                .fetchPost('/commodityChangeRecord/orderSettleAccounts', params)
                                .then(data => {
                                    loading.close();
                                    if (data.data.code == 'success') {
                                        this.message = `批量订单结算成功！`;
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
                                    console.log(err);
                                });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
            }
        }
    },

    watch: {
        tableData: {
            handler(value) {
                if (this.allCheck % 2 == 0) {
                    let that = this;
                    let len = that.checkList.length;
                    value.forEach(row => {
                        for (let i = 0; i < len; i++) {
                            if (row.id === that.checkList[i].id) {
                                that.$refs.multipleTable.toggleRowSelection(row, false);
                                break;
                            } else {
                                that.$refs.multipleTable.toggleRowSelection(row, true);
                            }
                        }
                    });
                }
            },
            deep: true
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
    margin-top: 10px;
}
</style>


