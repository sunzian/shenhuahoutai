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
                    v-model="query.businessCode"
                    placeholder="请选择商家"
                    class="mr10"
                    filterable
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
                <el-select
                    filterable
                    clearable
                    v-model="query.cinemaCode"
                    placeholder="请选择影院"
                    @change="changeSearchCinema"
                    class="mr10"
                >
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
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
                <el-input placeholder="推荐人手机号" class="mr10" v-model="query.shareMobile" autocomplete="off"></el-input>
                <el-input placeholder="商品规格/属性" class="mr10" v-model="query.skuKeyWords" autocomplete="off"></el-input>
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
                    v-model="query.pickupWay"
                    placeholder="取货方式"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="自提" value="1"></el-option>
                    <el-option key="2" label="快递" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="订单状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="未核销" value="1"></el-option>
                    <el-option key="2" label="已核销" value="2"></el-option>
                    <el-option key="3" label="已过期" value="3"></el-option>
                    <el-option key="4" label="待发货" value="4"></el-option>
                    <el-option key="5" label="快递中" value="5"></el-option>
                    <el-option key="6" label="已送达" value="6"></el-option>
                    <el-option key="7" label="已收货" value="7"></el-option>
                </el-select>
                <!-- <el-select
                    clearable
                    v-model="query.trackingStatus"
                    placeholder="快递状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="待发货" value="1"></el-option>
                    <el-option key="2" label="快递中" value="2"></el-option>
                    <el-option key="3" label="已送达" value="3"></el-option>
                    <el-option key="4" label="已收货" value="4"></el-option>
                </el-select> -->
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
                    <!-- <el-option key="0" label="待支付" value="0"></el-option> -->
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
                <el-date-picker
                        class="mr10"
                        v-model="query.startGetDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="核销开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                        class="mr10"
                        v-model="query.endGetDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="核销结束时间（止）"
                ></el-date-picker>
                <el-select
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
                </el-select>
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
                    type="primary"
                    @click="derive"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >导出</el-button>
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
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="兑换影院名称" width="210">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="领取影院名称" width="210">
                    <template slot-scope="scope">{{scope.row.exchangeCinemaName}}</template>
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
                <el-table-column prop="memo" label="订单状态" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'">未核销</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">已核销</el-tag>
                        <el-tag v-else-if="scope.row.status=='3'">已过期</el-tag>
                        <el-tag v-else-if="scope.row.status=='4'">待发货</el-tag>
                        <el-tag v-else-if="scope.row.status=='5'">快递中</el-tag>
                        <el-tag v-else-if="scope.row.status=='6'">已送达</el-tag>
                        <el-tag v-else-if="scope.row.status=='7'">已收货</el-tag>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="memo" label="快递状态" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.trackingStatus=='1'">待发货</el-tag>
                        <el-tag v-else-if="scope.row.trackingStatus=='2'">快递中</el-tag>
                        <el-tag v-else-if="scope.row.trackingStatus=='3'">已送达</el-tag>
                        <el-tag v-else-if="scope.row.trackingStatus=='4'">已收货</el-tag>
                    </template>
                </el-table-column> -->
                <el-table-column prop="memo" label="订单类型" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.orderType=='1'">商品订单</el-tag>
                        <el-tag v-else-if="scope.row.orderType=='2'">秒杀订单</el-tag>
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
                            v-if="scope.row.pickupWay=='2' && scope.row.payStatus=='1'"
                            type="text"
                            icon="el-icon-setting"
                            @click="logChange(scope.$index, scope.row)"
                        >修改</el-button>
                        <el-button
                            v-if="scope.row.payStatus=='1' && scope.row.refundStatus !='1'"
                            type="text"
                            icon="el-icon-setting"
                            @click="showRefund(scope.$index, scope.row)"
                        >退款</el-button>
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
                <el-form-item label="订单状态" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.status"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="支付方式" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.payWay"
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
                <el-form-item label="快递公司" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.trackingName"
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
                <!-- <el-form-item label="快递状态" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.trackingStatus"
                        autocomplete="off"
                    ></el-input>
                </el-form-item> -->
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
                        type="textarea"
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
        <!-- 退款弹窗 -->
        <el-dialog :close-on-click-modal="false" title="退款" :visible.sync="refundVisible">
            <el-form :model="refundForm">
                <el-form-item :required="true" label="退款原因" :label-width="formLabelWidth">
                    <el-input
                        style="width: 300px"
                        type="textarea"
                        maxlength="150"
                        :rows="3"
                        show-word-limit
                        v-model="refundForm.refundReason"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="refundVisible = false">取消</el-button>
                <el-button type="primary" @click="refund">确 定</el-button>
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
                pageSize: 15,
                payStatus: '1',
                startDate: '',
                endDate: ''
            },
            editVisible: false,
            refundVisible: false,
            refundForm: {
                refundReason: '',
                id: ''
            },
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
    },
    methods: {
        derive() {
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
                let commodityName = this.query.commodityName;
                let orderNo = this.query.orderNo;
                let mobile = this.query.mobile;
                let shareMobile = this.query.shareMobile;
                let status = this.query.status;
                let payStatus = this.query.payStatus;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let refundStatus = this.query.refundStatus;
                let changeType = this.query.changeType;
                let payWay = this.query.payWay;
                let pickupWay = this.query.pickupWay;
                let trackingStatus = this.query.trackingStatus;
                let trackingNumber = this.query.trackingNumber;
                let commodityType = this.query.commodityType;
                let orderType = this.query.orderType;
                let skuKeyWords = this.query.skuKeyWords;
                let startGetDate = this.query.startGetDate;
                let endGetDate = this.query.endGetDate;
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
                if (!businessCode) {
                    businessCode = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
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
                if (!skuKeyWords) {
                    skuKeyWords = '';
                }
                if (!startGetDate) {
                    startGetDate = '';
                }
                if (!endGetDate) {
                    endGetDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'tableName', value: 'commodity_change_record' });
                jsonArr.push({
                    key: 'exportKeysJson',
                    value:
                        "['cinemaName','exchangeCinemaName','partnerName','chSettleStatusString','orderNo','mobile','stringPayWay','shareMobile','remark','commodityName','gold','number','money','getDate','payTime','chPayStatus','chPickupWay','trackingNumber','deliveryName','deliveryMobile','province','city','district','deliveryAddressDetail','tradeNo','payReturnMsg','chChangeType','chStatus','chRefundStatus','orderTypeName','refundNo','refundReason','refundApply','refundTime','refundPrice']"
                });
                jsonArr.push({
                    key: 'exportTitlesJson',
                    value:
                        "['兑换影院名称','领取影院名称','商户名称','商户订单结算状态','订单号','手机号','支付方式','推荐人手机号','用户备注','商品名称','消费金币','购买数量','支付金额','领取时间','下单时间','兑换状态','取货方式','物流单号','收货人名称','收货人电话','省','市','区','收货人地址','支付交易号','支付回调消息','兑换方式','订单状态','退款状态','订单类型','退款交易号','退款原因','微信退款回复','退款时间','退款金额']"
                });
                jsonArr.push({ key: 'commodityType', value: commodityType });
                jsonArr.push({ key: 'businessCode', value: businessCode });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'orderNo', value: orderNo });
                jsonArr.push({ key: 'commodityName', value: commodityName });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'shareMobile', value: shareMobile });
                jsonArr.push({ key: 'refundStatus', value: refundStatus });
                jsonArr.push({ key: 'pickupWay', value: pickupWay });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'changeType', value: changeType });
                jsonArr.push({ key: 'payWay', value: payWay });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'trackingStatus', value: trackingStatus });
                jsonArr.push({ key: 'trackingNumber', value: trackingNumber });
                jsonArr.push({ key: 'orderType', value: orderType });
                jsonArr.push({ key: 'skuKeyWords', value: skuKeyWords });
                jsonArr.push({ key: 'startGetDate', value: startGetDate });
                jsonArr.push({ key: 'endGetDate', value: endGetDate });
                var params = ParamsAppend(jsonArr);
                console.log(jsonArr);
                let businessName = '';
                for (let i = 0; i < this.businessInfo.length; i++) {
                    if (businessCode == this.businessInfo[i].businessCode) {
                        businessName = this.businessInfo[i].businessName;
                    }
                }
                let myObj = {
                    method: 'get',
                    url: '/exportExcel/commodityChangeRecord',
                    fileName: businessName + '_金币商城订单统计',
                    params: params
                };
                https.exportMethod(myObj);
                loading.close();
            }, 1500);
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
        showRefund(index, row) {
            this.refundVisible = true;
            this.refundForm.id = row.id;
        },
        refund(index, row) {
            if (this.refundForm.refundReason == '') {
                this.message = '请填写退款原因！';
                this.open();
                return;
            }
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let jsonArr = [];
            jsonArr.push({ key: 'id', value: this.refundForm.id });
            jsonArr.push({ key: 'refundReason', value: this.refundForm.refundReason });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/admin/commodityChangeRecord/verifyOrderRefund', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.$confirm(JSON.parse(Decrypt(data.data.data)), '提示', {
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
                                https
                                    .fetchPost('/admin/commodityChangeRecord/refundGoldCommodityOrder', params)
                                    .then(data => {
                                        loading.close();
                                        if (data.data.code == 'success') {
                                            this.$message.error(`退款成功~`);
                                            this.refundVisible = false;
                                            this.refundForm.refundReason = '';
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
                                this.refundVisible = false;
                                this.refundForm.refundReason = '';
                                this.$message({
                                    type: 'info',
                                    message: '已取消退款'
                                });
                            });
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
                            } else if (JSON.parse(Decrypt(data.data.data)).status == 4) {
                                this.form.status = '待发货';
                            } else if (JSON.parse(Decrypt(data.data.data)).status == 5) {
                                this.form.status = '快递中';
                            } else if (JSON.parse(Decrypt(data.data.data)).status == 6) {
                                this.form.status = '已送达';
                            } else if (JSON.parse(Decrypt(data.data.data)).status == 7) {
                                this.form.status = '已收货';
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
                        //获取当前时间
                        var day1 = new Date();
                        day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
                        var s1 = day1.getFullYear() + '-' + (day1.getMonth() + 1) + '-' + day1.getDate();
                        //获取昨天时间
                        var day2 = new Date();
                        day2.setTime(day2.getTime());
                        var s2 = day2.getFullYear() + '-' + (day2.getMonth() + 1) + '-' + day2.getDate();
                        //加上早上六点
                        this.query.startDate = this.timestampToTime(new Date(s1).getTime() + 21600000);
                        this.query.endDate = this.timestampToTime(new Date(s2).getTime() + 21600000);
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
                let status = this.query.status;
                let payWay = this.query.payWay;
                let refundStatus = this.query.refundStatus;
                let cinemaCode = this.query.cinemaCode;
                let businessCode = this.query.businessCode;
                let commodityName = this.query.commodityName;
                let pickupWay = this.query.pickupWay;
                let trackingStatus = this.query.trackingStatus;
                let trackingNumber = this.query.trackingNumber;
                let commodityType = this.query.commodityType;
                let orderType = this.query.orderType;
                let skuKeyWords = this.query.skuKeyWords;
                let startGetDate = this.query.startGetDate;
                let endGetDate = this.query.endGetDate;
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
                if (!pickupWay) {
                    pickupWay = '';
                }
                if (!businessCode) {
                    businessCode = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
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
                if (!payWay) {
                    payWay = '';
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
                if (!skuKeyWords) {
                    skuKeyWords = '';
                }
                if (!startGetDate) {
                    startGetDate = '';
                }
                if (!endGetDate) {
                    endGetDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'commodityType', value: commodityType });
                jsonArr.push({ key: 'orderNo', value: orderNo });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'businessCode', value: businessCode });
                jsonArr.push({ key: 'commodityName', value: commodityName });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'payWay', value: payWay });
                jsonArr.push({ key: 'shareMobile', value: shareMobile });
                jsonArr.push({ key: 'pickupWay', value: pickupWay });
                jsonArr.push({ key: 'payStatus', value: payStatus });
                jsonArr.push({ key: 'changeType', value: changeType });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'refundStatus', value: refundStatus });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'trackingStatus', value: trackingStatus });
                jsonArr.push({ key: 'trackingNumber', value: trackingNumber });
                jsonArr.push({ key: 'orderType', value: orderType });
                jsonArr.push({ key: 'skuKeyWords', value: skuKeyWords });
                jsonArr.push({ key: 'startGetDate', value: startGetDate });
                jsonArr.push({ key: 'endGetDate', value: endGetDate });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/admin/commodityChangeRecord/commodityChangeRecordPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            if (data.data && data.data.data) {
                                var oData = JSON.parse(Decrypt(data.data.data));
                                console.log(oData)
                                this.tableData = oData.pageResult.data;
                                this.totalData = oData.statistics;
                                this.query.pageSize = oData.pageResult.pageSize;
                                this.query.pageNo = oData.pageResult.pageNo;
                                this.query.totalCount = oData.pageResult.totalCount;
                                this.query.totalPage = oData.pageResult.totalPage;
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
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        handleSizeChange(val) {
            this.query.pageSize = val;
            this.getMenu();
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
        timestampToTime(timestamp) {
            const dateObj = new Date(+timestamp); // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
            const year = dateObj.getFullYear(); // 获取年，
            const month = dateObj.getMonth() + 1; // 获取月，必须要加1，因为月份是从0开始计算的
            const date = dateObj.getDate(); // 获取日，记得区分getDay()方法是获取星期几的。
            const hours = this.pad(dateObj.getHours()); // 获取时, pad函数用来补0
            const minutes = this.pad(dateObj.getMinutes()); // 获取分
            const seconds = this.pad(dateObj.getSeconds()); // 获取秒
            return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
        },
        pad(str) {
            return +str >= 10 ? str : '0' + str;
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


