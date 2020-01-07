<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影院信息维护
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    clearable
                    v-model="query.cinemaCode"
                    placeholder="请选择影院"
                    class="handle-input mr10"
                >
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-date-picker
                    v-model="query.startDate"
                    type="date"
                    class="mr10"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.endDate"
                    type="date"
                    class="mr10"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="结束时间（止）"
                ></el-date-picker>
                <el-select
                    clearable
                    v-model="query.paymentType"
                    placeholder="费用支付类型"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="包年" value="1"></el-option>
                    <el-option key="2" label="按票收费" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.reportedType"
                    placeholder="票价上报方式"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="标准价格上报" value="1"></el-option>
                    <el-option key="2" label="优惠后价格上报" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.orderNumber"
                    placeholder="排序规则"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="到期时间升序" value="1"></el-option>
                    <el-option key="2" label="到期时间降序" value="2"></el-option>
                    <el-option key="3" label="按剩余票数升序" value="3"></el-option>
                    <el-option key="4" label="按剩余票数降序" value="4"></el-option>
                </el-select>
                <el-select
                        clearable
                        v-model="query.miniOnLine"
                        placeholder="是否正式上线"
                        class="handle-select mr10"
                >
                    <el-option key="0" label="未上线" value="0"></el-option>
                    <el-option key="1" label="上线" value="1"></el-option>
                </el-select>
                <el-button
                    style="margin-top: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="Search"
                >搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                height="500"
                border
                class="table"
                ref="multipleTable"
                highlight-current-row
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="code" label="影院编码" fixed width="140">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院名称" fixed width="180">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="booleans" label="是否支持自主退票" align="center" width="160">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.refundable == 1" type="success">是</el-tag>
                        <el-tag v-else type="danger">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="退票手续费" width="140">
                    <template slot-scope="scope">{{scope.row.refundFee}}</template>
                </el-table-column>
                <el-table-column prop="number" label="第三方支付代售费" width="160">
                    <template slot-scope="scope">{{scope.row.thirdPartyPayCommissionFee}}</template>
                </el-table-column>
                <el-table-column prop="number" label="会员卡支付代售费" width="160">
                    <template slot-scope="scope">{{scope.row.memberCardPayCommissionFee}}</template>
                </el-table-column>
                <!--<el-table-column prop="booleans" label="是否开通套餐">-->
                <!--<template slot-scope="scope">-->
                <!--<el-tag v-if="scope.row.openSnackStatus == 1" type="success">已开通</el-tag>-->
                <!--<el-tag v-else type="danger">未开通</el-tag>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="booleans" label="是否支持卖品送餐" width="140" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.snackDispatcherStatus == 1" type="success">送至影厅</el-tag>
                        <el-tag v-else-if="scope.row.snackDispatcherStatus == 2" type="danger">否</el-tag>
                        <el-tag v-else-if="scope.row.snackDispatcherStatus == 3" type="danger">送至影厅座位</el-tag>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="string" label="短信平台">-->
                <!--<template slot-scope="scope">-->
                <!--<el-tag v-if="scope.row.messagePlatformType == 1" type="info">专信云</el-tag>-->
                <!--<el-tag v-else type="info">三体</el-tag>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="booleans" label="是否开通服务">-->
                <!--<template slot-scope="scope">-->
                <!--<el-tag v-if="scope.row.openStatus == 1" type="success">是</el-tag>-->
                <!--<el-tag v-else type="danger">否</el-tag>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="费用支付类型" width="120" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.paymentType == 1" type="info">包年</el-tag>
                        <el-tag v-else type="info">按票收费</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="剩余票数" width="90">
                    <template slot-scope="scope">{{scope.row.remainTicketsNumber}}</template>
                </el-table-column>
                <el-table-column prop="number" label="剩余购票金额" width="120">
                    <template slot-scope="scope">{{scope.row.remainTicketPrice}}</template>
                </el-table-column>
                <el-table-column prop="time" label="到期时间" width="160">
                    <template slot-scope="scope">{{scope.row.expireDate}}</template>
                </el-table-column>
                <el-table-column prop="string" label="正式上线" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.miniOnLine == 1" type="info">上线</el-tag>
                        <el-tag v-else type="info">未上线</el-tag>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="string" label="票价上报方式">-->
                <!--<template slot-scope="scope">-->
                <!--<el-tag v-if="scope.row.reportedType == 1" type="info">标准价格上报</el-tag>-->
                <!--<el-tag v-else type="info">优惠后价格上报</el-tag>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="booleans" label="是否开通会员卡">-->
                <!--<template slot-scope="scope">-->
                <!--<el-tag v-if="scope.row.openMemberCardStatus == 1" type="success">开通</el-tag>-->
                <!--<el-tag v-else type="danger">未开通</el-tag>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="booleans" label="会员卡是否门店通用">-->
                <!--<template slot-scope="scope">-->
                <!--<el-tag v-if="scope.row.memberCardCommonUseStatus == 1" type="success">是</el-tag>-->
                <!--<el-tag v-else type="danger">否</el-tag>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="booleans" label="会员卡支付是否可用优惠券">-->
                <!--<template slot-scope="scope">-->
                <!--<el-tag v-if="scope.row.ticketsForMemberCardPayStatus == 1" type="success">是</el-tag>-->
                <!--<el-tag v-else type="danger">否</el-tag>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
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
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="影院编码" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oCinemaCode"
                        autocomplete="off"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        :disabled="true"
                        v-model="oCinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="所在省份" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        :disabled="true"
                        v-model="oProvince"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="所在城市" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        :disabled="true"
                        v-model="oCity"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="详细地址" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        :disabled="true"
                        v-model="oAddress"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="经度" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        :disabled="true"
                        v-model="oLongitude"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="纬度" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        :disabled="true"
                        v-model="oLatitude"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="影院联系人姓名" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        maxlength="20"
                        v-model="oConcatName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="影院联系人电话" :label-width="formLabelWidth">
                    <el-input
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                        style="width: 250px"
                        v-model="oConcatMobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    prop="serviceMobile"
                    label="客服电话"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        style="width: 250px"
                        v-model="oServiceMobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="开场前的购票时间限制（分钟）" :label-width="formLabelWidth">
                    <el-input style="width: 250px" onkeyup="this.value=this.value.replace(/\D/g,'')" v-model="oBuyMinutesLimit" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开场前的退票时间限制（分钟）" :label-width="formLabelWidth">
                    <el-input style="width: 250px" onkeyup="this.value=this.value.replace(/\D/g,'')" v-model="oRefundMinutesLimit" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="退票手续费" :label-width="formLabelWidth">
                    <el-input style="width: 250px" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')" v-model="oRefundFee" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="第三方支付代售费" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oThirdPartyPayCommissionFee"
                        autocomplete="off"
                        onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会员卡支付代售费" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oMemberCardPayCommissionFee"
                        autocomplete="off"
                        onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="影院会员服务协议" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oMembershipServiceAgreement"
                        autocomplete="off"
                        type="textarea"
                        maxlength="2000"
                        :rows="6"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="购票提示" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        type="textarea"
                        :rows="3"
                        v-model="oBuyTicketHint"
                        maxlength="100"
                        show-word-limit
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="权益卡协议" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        type="textarea"
                        v-model="oEquityCardAgreement"
                        autocomplete="off"
                        maxlength="1000"
                        :rows="6"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label="金币活动描述 " :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oGoldActivityMemo"
                        autocomplete="off"
                        maxlength="10"
                        placeholder="最多可输入10个字"
                    ></el-input>
                </el-form-item>
                <el-form-item label="充值活动描述" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oRechargeMemo"
                        maxlength="10"
                        placeholder="最多可输入10个字"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="卖品配送方式" :label-width="formLabelWidth" :required="true">
                    <el-select v-model="oSnackDispatcherStatus" @change="openServe">
                        <el-option
                            v-for="info in delivery"
                            :key="info.value"
                            :label="info.label"
                            :value="info.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="是否可退票" :label-width="formLabelWidth">
                    <el-select v-model="oRefundable" @change="openServe">
                        <el-option
                            v-for="info in boolean"
                            :key="info.value"
                            :label="info.label"
                            :value="info.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="卖品显示开始时间" :label-width="formLabelWidth">
                    <el-time-picker
                        type="date"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        v-model="oSnackBeginTime"
                        placeholder="选择日期时间"
                    ></el-time-picker>
                </el-form-item>
                <el-form-item :required="true" label="卖品显示结束时间" :label-width="formLabelWidth">
                    <el-time-picker
                        type="date"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        v-model="oSnackEndTime"
                        placeholder="选择日期时间"
                    ></el-time-picker>
                </el-form-item>
                <!--<el-form-item label="短信平台类型" :label-width="formLabelWidth">-->
                <!--<el-radio-group v-model="oMessagePlatformType">-->
                <!--<el-radio label="1">专信云</el-radio>-->
                <!--<el-radio label="2">三体</el-radio>-->
                <!--</el-radio-group>-->
                <!--</el-form-item>-->
                <!--<el-form-item-->
                <!--label="注册验证码"-->
                <!--:label-width="formLabelWidth"-->
                <!--v-if="oMessagePlatformType"-->
                <!--&gt;-->
                <!--<el-input-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType1"-->
                <!--autocomplete="off"-->
                <!--v-if="oMessagePlatformType==2"-->
                <!--placeholder="短信模板id"-->
                <!--&gt;</el-input>-->
                <!--<el-input-->
                <!--v-if="oMessagePlatformType==1"-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType1"-->
                <!--autocomplete="off"-->
                <!--type="textarea"-->
                <!--placeholder="短信内容，长度不超过200个汉字"-->
                <!--maxlength="200"-->
                <!--show-word-limit-->
                <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item-->
                <!--label="购票成功"-->
                <!--:label-width="formLabelWidth"-->
                <!--v-if="oMessagePlatformType"-->
                <!--&gt;-->
                <!--<el-input-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType2"-->
                <!--autocomplete="off"-->
                <!--v-if="oMessagePlatformType==2"-->
                <!--placeholder="短信模板id"-->
                <!--&gt;</el-input>-->
                <!--<el-input-->
                <!--v-if="oMessagePlatformType==1"-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType2"-->
                <!--autocomplete="off"-->
                <!--type="textarea"-->
                <!--placeholder="短信内容，长度不超过200个汉字"-->
                <!--maxlength="200"-->
                <!--show-word-limit-->
                <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item-->
                <!--label="下单失败"-->
                <!--:label-width="formLabelWidth"-->
                <!--v-if="oMessagePlatformType"-->
                <!--&gt;-->
                <!--<el-input-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType3"-->
                <!--autocomplete="off"-->
                <!--v-if="oMessagePlatformType==2"-->
                <!--placeholder="短信模板id"-->
                <!--&gt;</el-input>-->
                <!--<el-input-->
                <!--v-if="oMessagePlatformType==1"-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType3"-->
                <!--autocomplete="off"-->
                <!--type="textarea"-->
                <!--placeholder="短信内容，长度不超过200个汉字"-->
                <!--maxlength="200"-->
                <!--show-word-limit-->
                <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item-->
                <!--label="退票通知"-->
                <!--:label-width="formLabelWidth"-->
                <!--v-if="oMessagePlatformType"-->
                <!--&gt;-->
                <!--<el-input-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType4"-->
                <!--autocomplete="off"-->
                <!--v-if="oMessagePlatformType==2"-->
                <!--placeholder="短信模板id"-->
                <!--&gt;</el-input>-->
                <!--<el-input-->
                <!--v-if="oMessagePlatformType==1"-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType4"-->
                <!--autocomplete="off"-->
                <!--type="textarea"-->
                <!--placeholder="短信内容，长度不超过200个汉字"-->
                <!--maxlength="200"-->
                <!--show-word-limit-->
                <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item-->
                <!--label="会员卡充值"-->
                <!--:label-width="formLabelWidth"-->
                <!--v-if="oMessagePlatformType"-->
                <!--&gt;-->
                <!--<el-input-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType5"-->
                <!--autocomplete="off"-->
                <!--v-if="oMessagePlatformType==2"-->
                <!--placeholder="短信模板id"-->
                <!--&gt;</el-input>-->
                <!--<el-input-->
                <!--v-if="oMessagePlatformType==1"-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType5"-->
                <!--autocomplete="off"-->
                <!--type="textarea"-->
                <!--placeholder="短信内容，长度不超过200个汉字"-->
                <!--maxlength="200"-->
                <!--show-word-limit-->
                <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item-->
                <!--label="卖品送餐"-->
                <!--:label-width="formLabelWidth"-->
                <!--v-if="oMessagePlatformType"-->
                <!--&gt;-->
                <!--<el-input-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType6"-->
                <!--autocomplete="off"-->
                <!--v-if="oMessagePlatformType==2"-->
                <!--placeholder="短信模板id"-->
                <!--&gt;</el-input>-->
                <!--<el-input-->
                <!--v-if="oMessagePlatformType==1"-->
                <!--style="width: 250px"-->
                <!--v-model="oMessageType6"-->
                <!--autocomplete="off"-->
                <!--type="textarea"-->
                <!--placeholder="短信内容，长度不超过200个汉字"-->
                <!--maxlength="200"-->
                <!--show-word-limit-->
                <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="短信平台账号" :label-width="formLabelWidth">-->
                <!--<el-input-->
                <!--style="width: 250px"-->
                <!--v-model="oMessagePlatformAccount"-->
                <!--autocomplete="off"-->
                <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="短信平台密码" :label-width="formLabelWidth">-->
                <!--<el-input-->
                <!--style="width: 250px"-->
                <!--v-model="oMessagePlatformPassword"-->
                <!--autocomplete="off"-->
                <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="短信平台签名id" :label-width="formLabelWidth">-->
                <!--<el-input-->
                <!--style="width: 250px"-->
                <!--v-model="oMessagePlatformSignId"-->
                <!--autocomplete="off"-->
                <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item prop="openStatus" label="是否开通服务" :label-width="formLabelWidth">-->
                <!--<el-select v-model="oOpenStatus" @change="openServe">-->
                <!--<el-option-->
                <!--v-for="info in boolean"-->
                <!--:key="info.value"-->
                <!--:label="info.label"-->
                <!--:value="info.value"-->
                <!--&gt;</el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item :required="true" label="是否开通会员卡功能" :label-width="formLabelWidth">
                    <el-select v-model="oOpenMemberCardStatus" @change="openServe">
                        <el-option
                            v-for="info in boolean"
                            :key="info.value"
                            :label="info.label"
                            :value="info.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item prop="videoStatus" label="是否开通预告片" :label-width="formLabelWidth">-->
                <!--<el-select v-model="oVideoStatus" @change="openServe">-->
                <!--<el-option-->
                <!--v-for="info in boolean"-->
                <!--:key="info.value"-->
                <!--:label="info.label"-->
                <!--:value="info.value"-->
                <!--&gt;</el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item :required="true" label="会员卡是否门店通用" :label-width="formLabelWidth">-->
                <!--<el-select v-model="oMemberCardCommonUseStatus" @change="openServe">-->
                <!--<el-option-->
                <!--v-for="info in boolean"-->
                <!--:key="info.value"-->
                <!--:label="info.label"-->
                <!--:value="info.value"-->
                <!--&gt;</el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="小程序名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        :disabled="true"
                        v-model="oMiniAppName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="小程序二维码" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oMiniAppQRCode" />
                        <img
                            slot="reference"
                            :src="oMiniAppQRCode"
                            :alt="oMiniAppQRCode"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                </el-form-item>
                <el-form-item prop="miniAppId" label="小程序appId" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        :disabled="true"
                        v-model="oMiniAppId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <!--<el-form-item-->
                <!--prop="miniAppSecret"-->
                <!--label="小程序appSecret"-->
                <!--:label-width="formLabelWidth"-->
                <!--&gt;-->
                <!--<el-input style="width: 250px" v-model="oMiniAppSecret" autocomplete="off"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="小程序支付商户号" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        :disabled="true"
                        v-model="oMiniMerchantNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <!--<el-form-item-->
                <!--prop="miniMerchantSecret"-->
                <!--label="小程序支付密钥"-->
                <!--:label-width="formLabelWidth"-->
                <!--&gt;-->
                <!--<el-input style="width: 250px" v-model="oMiniMerchantSecret" autocomplete="off"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item-->
                <!--prop="miniRefundCertificateUrl"-->
                <!--label="小程序退款证书阿里云路径"-->
                <!--:label-width="formLabelWidth"-->
                <!--&gt;-->
                <!--<el-input-->
                <!--style="width: 250px"-->
                <!--v-model="oMiniRefundCertificateUrl"-->
                <!--autocomplete="off"-->
                <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="售票系统账号" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        :disabled="true"
                        v-model="oTicketingSystemAccount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="剩余票数" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            :disabled="true"
                            v-model="oRemainTicketsNumber"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="剩余购票金额" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            :disabled="true"
                            v-model="oRemainTicketPrice"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <!--<el-form-item-->
                <!--style="width: 250px"-->
                <!--prop="ticketingSystemPassword"-->
                <!--label="售票系统密码"-->
                <!--:label-width="formLabelWidth"-->
                <!--&gt;-->
                <!--<el-input-->
                <!--style="width: 250px"-->
                <!--v-model="oTicketingSystemPassword"-->
                <!--autocomplete="off"-->
                <!--&gt;</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="售票系统类型版本(目前辰星系统)：" :label-width="formLabelWidth" prop="cinemaName">-->
                <!--<el-radio-group v-model="oTicketingSystemTypeVersion">-->
                <!--<el-radio label="1">1.0</el-radio>-->
                <!--<el-radio label="2">2.0</el-radio>-->
                <!--</el-radio-group>-->
                <!--</el-form-item>-->
                <el-form-item :required="true" label="影院奖品核销码" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oVerificationCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="小程序分享标题" :label-width="formLabelWidth">
                    <el-input
                        maxlength="25"
                        style="width: 250px"
                        v-model="oMiniShareTitle"
                        autocomplete="off"
                        placeholder="最多显示25个字"
                    ></el-input>
                </el-form-item>
                <el-form-item label="小程序分享海报" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oMiniSharePosters" />
                        <img
                            slot="reference"
                            :src="oMiniSharePosters"
                            :alt="oMiniSharePosters"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        drag
                        ref="upload"
                        action="/api/upload/uploadImage"
                        :on-success="unSuccess"
                        multiple
                        :limit="1"
                        :on-exceed="exceed"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div
                            class="el-upload__tip"
                            slot="tip"
                        >只能上传jpg/png文件，且不超过100kb 建议尺寸540*400或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="影院公告" :label-width="formLabelWidth">
                    <el-input
                        style="width: 350px"
                        type="textarea"
                        v-model="oNotice"
                        autocomplete="off"
                        :rows="7"
                        maxlength="300"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label="特色服务" :label-width="formLabelWidth">
                    <el-button @click="serveInfo = true">编辑服务</el-button>
                </el-form-item>
                <el-form-item label="是否正式上线" :label-width="formLabelWidth">
                    <el-select
                            :disabled="true"
                            v-model="oMiniOnLine"
                            style="width: 150px"
                    >
                        <el-option key="0" label="未上线" value="0"></el-option>
                        <el-option key="1" label="上线" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 查看特色服务 -->
        <el-dialog title="特色服务" :visible.sync="serveInfo">
            <div class="handle-box">
                <el-button
                    type="primary"
                    @click="addServeInfo = true"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >新增服务</el-button>
            </div>
            <el-table :data="serveData">
                <el-table-column label="特色服务名称" width="150">
                    <template slot-scope="scope">{{scope.row.serviceName}}</template>
                </el-table-column>
                <el-table-column label="特色服务内容">
                    <template slot-scope="scope">{{scope.row.serviceDetail}}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="editServe(scope)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="deleteServe(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="serveInfo = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增特色服务 -->
        <el-dialog
            width="30%"
            top="30vh"
            :close-on-click-modal="false"
            :visible.sync="addServeInfo"
        >
            <el-form>
                <el-form-item :required="true" label="特色服务名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px;"
                        v-model.trim="addServiceName"
                        autocomplete="off"
                        maxlength="8"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="特色服务内容" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px;"
                        type="textarea"
                        v-model.trim="addServiceDetail"
                        autocomplete="off"
                        maxlength="100"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addServeInfo = false">取 消</el-button>
                <el-button type="primary" @click="sureAddServe">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑特色服务 -->
        <el-dialog
            width="30%"
            top="30vh"
            :close-on-click-modal="false"
            :visible.sync="editServeInfo"
        >
            <el-form>
                <el-form-item :required="true" label="特色服务名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px;"
                        v-model.trim="editServiceName"
                        autocomplete="off"
                        maxlength="8"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="特色服务内容" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px;"
                        type="textarea"
                        v-model.trim="editServiceDetail"
                        autocomplete="off"
                        maxlength="100"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editServeInfo = false">取 消</el-button>
                <el-button type="primary" @click="sureEditServe">确 定</el-button>
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
            type: {
                type: ''
            },
            serveInfo: false,
            editServeInfo: false,
            addServeInfo: false,
            serveForm: {
                serviceName: '',
                serviceDetail: ''
            },
            addServiceName: '',
            addServiceDetail: '',
            editServiceName: '',
            editServiceDetail: '',
            oInterfaceAddress: '',
            oTicketingSystemType: '',
            oBelongBusinessCode: '',
            oTicketingSystemTypeVersion: '',
            oMiniOnLine: '',
            oMiniAppName: '',
            oMiniAppQRCode: '',
            oVideoStatus: '',
            oCinemaName: '',
            oCinemaCode: '',
            oProvince: '',
            oCity: '',
            oAddress: '',
            oLongitude: '',
            oLatitude: '',
            oConcatName: '',
            oConcatMobile: '',
            oServiceMobile: '',
            oScreenCount: '',
            oEquityCardAgreement: '',
            oGoldActivityMemo: '',
            oTicketSystemCode: '',
            oBuyMinutesLimit: '',
            oRechargeMemo: '',
            oRefundMinutesLimit: '',
            oRefundFee: '',
            oThirdPartyPayCommissionFee: '',
            oMemberCardPayCommissionFee: '',
            oMembershipServiceAgreement: '',
            oBuyTicketHint: '',
            oOpenSnackStatus: '',
            oSnackDispatcherStatus: '',
            oRefundable: '',
            oSnackBeginTime: '',
            oRemainTicketPrice: '',
            oRemainTicketsNumber: '',
            oSnackEndTime: '',
            oMessagePlatformType: '',
            oMessageType1: '',
            oMessageType2: '',
            oMessageType3: '',
            oMessageType4: '',
            oMessageType5: '',
            oMessageType6: '',
            oMessagePlatformAccount: '',
            oMessagePlatformPassword: '',
            oMessagePlatformSignId: '',
            oOpenStatus: '',
            oOpenMemberCardStatus: '',
            oMemberCardCommonUseStatus: '',
            oMiniAppSecret: '',
            oMiniMerchantNo: '',
            oMiniMerchantSecret: '',
            oMiniRefundCertificateUrl: '',
            oTicketingSystemAccount: '',
            oTicketingSystemPassword: '',
            oMiniAppId: '',
            oVerificationCode: '',
            oMiniShareTitle: '',
            oMiniSharePosters: '',
            oNotice: '',
            oId: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            boolean: [
                {
                    value: '1',
                    label: '是'
                },
                {
                    value: '2',
                    label: '否'
                }
            ],
            delivery: [
                {
                    value: '1',
                    label: '送至影厅'
                },
                {
                    value: '2',
                    label: '不配送'
                },
                {
                    value: '3',
                    label: '送至影厅座位'
                }
            ],
            miniOnLineList: [
                {
                    value: '0',
                    label:'未上线',
                },
                {
                    value: '1',
                    label:'上线',
                }
            ],
            businessInfo: [], //关联商家信息
            form: [],
            tableData: [],
            serveData: [],
            multipleSelection: [],
            delList: [],
            cinemaInfo: [],
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            oForm: {
                cinemaName: '',
                cinemaCode: '',
                province: '',
                city: '',
                address: '',
                longitude: '',
                latitude: '',
                belongBusinessCode: '', // 商家编码
                businessName: '', // 商家名称
                concatName: '',
                concatMobile: '',
                serviceMobile: '',
                screenCount: '',
                ticketSystemCode: '',
                comparePriceCode: '',
                buyMinutesLimit: '',
                refundMinutesLimit: '',
                refundFee: '',
                thirdPartyPayCommissionFee: '',
                memberCardPayCommissionFee: '',
                membershipServiceAgreement: '',
                buyTicketHint: '',
                openSnackStatus: '',
                snackDispatcherStatus: '',
                refundable: '',
                remainTicketsNumber: '',
                snackBeginTime: '',
                snackEndTime: '',
                messagePlatformType: '',
                messagePlatformAccount: '',
                messagePlatformPassword: '',
                messagePlatformSignId: '',
                openStatus: '',
                expireDate: '',
                paymentType: '',
                openMemberCardStatus: '',
                memberCardCommonUseStatus: '',
                miniAppSecret: '',
                miniMerchantNo: '',
                miniMerchantSecret: '',
                miniRefundCertificateUrl: '',
                ticketingSystemAccount: '',
                ticketingSystemPassword: '',
                miniAppId: '',
                verificationCode: ''
            },
            formLabelWidth: '160px',
            selectValue: {},
            value: ''
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        exceed(data) {
            console.log(data);
            if (data.length == 1) {
                this.message = '只能上传一张图片，如需重新上传请删除第一张图！';
                this.open();
            }
        },
        addChange(index, row) {
            //是否拥有修改权限
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            this.idx = index;
            this.form = row;
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinema/getCinemaById', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        this.editVisible = true;
                        if (
                            JSON.parse(Decrypt(data.data.data)) &&
                            JSON.parse(Decrypt(data.data.data)).cinemaSpecialService &&
                            JSON.parse(Decrypt(data.data.data)).cinemaSpecialService.serviceDetailList
                        ) {
                            this.serveData = JSON.parse(Decrypt(data.data.data)).cinemaSpecialService.serviceDetailList;
                        }
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).Cinema.cinemaName;
                        this.oBelongBusinessCode = JSON.parse(Decrypt(data.data.data)).Cinema.belongBusinessCode;
                        this.oMiniAppName = JSON.parse(Decrypt(data.data.data)).Cinema.miniAppName;
                        this.oInterfaceAddress = JSON.parse(Decrypt(data.data.data)).Cinema.interfaceAddress;
                        this.oTicketingSystemType = JSON.parse(Decrypt(data.data.data)).Cinema.ticketingSystemType;
                        this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).Cinema.cinemaCode;
                        this.oProvince = JSON.parse(Decrypt(data.data.data)).Cinema.province;
                        this.oCity = JSON.parse(Decrypt(data.data.data)).Cinema.city;
                        this.oAddress = JSON.parse(Decrypt(data.data.data)).Cinema.address;
                        this.oLongitude = JSON.parse(Decrypt(data.data.data)).Cinema.longitude;
                        this.oLatitude = JSON.parse(Decrypt(data.data.data)).Cinema.latitude;
                        this.oConcatName = JSON.parse(Decrypt(data.data.data)).Cinema.concatName;
                        this.oConcatMobile = JSON.parse(Decrypt(data.data.data)).Cinema.concatMobile;
                        this.oServiceMobile = JSON.parse(Decrypt(data.data.data)).Cinema.serviceMobile;
                        this.oScreenCount = JSON.parse(Decrypt(data.data.data)).Cinema.screenCount;
                        this.oRechargeMemo = JSON.parse(Decrypt(data.data.data)).Cinema.rechargeMemo;
                        this.oTicketSystemCode = JSON.parse(Decrypt(data.data.data)).Cinema.ticketSystemCode;
                        this.oBuyMinutesLimit = JSON.parse(Decrypt(data.data.data)).Cinema.buyMinutesLimit;
                        this.oRefundMinutesLimit = JSON.parse(Decrypt(data.data.data)).Cinema.refundMinutesLimit;
                        this.oRefundFee = JSON.parse(Decrypt(data.data.data)).Cinema.refundFee;
                        this.oThirdPartyPayCommissionFee = JSON.parse(Decrypt(data.data.data)).Cinema.thirdPartyPayCommissionFee;
                        this.oMemberCardPayCommissionFee = JSON.parse(Decrypt(data.data.data)).Cinema.memberCardPayCommissionFee;
                        this.oMembershipServiceAgreement = JSON.parse(Decrypt(data.data.data)).Cinema.membershipServiceAgreement;
                        this.oBuyTicketHint = JSON.parse(Decrypt(data.data.data)).Cinema.buyTicketHint;
                        this.oSnackBeginTime = JSON.parse(Decrypt(data.data.data)).Cinema.snackBeginTime;
                        this.oSnackEndTime = JSON.parse(Decrypt(data.data.data)).Cinema.snackEndTime;
                        this.oEquityCardAgreement = JSON.parse(Decrypt(data.data.data)).Cinema.equityCardAgreement;
                        this.oGoldActivityMemo = JSON.parse(Decrypt(data.data.data)).Cinema.goldActivityMemo;
                        this.oRemainTicketPrice = JSON.parse(Decrypt(data.data.data)).Cinema.remainTicketPrice;
                        this.oRemainTicketsNumber = JSON.parse(Decrypt(data.data.data)).Cinema.remainTicketsNumber;
                        // this.oMessagePlatformType = JSON.parse(Decrypt(data.data.data)).Cinema.messagePlatformType;
                        // this.oMessagePlatformAccount = JSON.parse(Decrypt(data.data.data)).CinemaMessagePlatFormInfo.messagePlatformAccount;
                        // this.oMessagePlatformPassword = JSON.parse(Decrypt(data.data.data)).CinemaMessagePlatFormInfo.messagePlatformPassword;
                        // this.oMessagePlatformSignId = JSON.parse(Decrypt(data.data.data)).CinemaMessagePlatFormInfo.messagePlatformSignId;
                        // for (let x in this.boolean) {
                        //     if (this.boolean[x].value == JSON.parse(Decrypt(data.data.data)).Cinema.memberCardCommonUseStatus) {
                        //         this.oMemberCardCommonUseStatus = this.boolean[x].value;
                        //         break;
                        //     }
                        // }
                        // for (let x in this.boolean) {
                        //     if (this.boolean[x].value == JSON.parse(Decrypt(data.data.data)).Cinema.openSnackStatus) {
                        //         this.oOpenSnackStatus = this.boolean[x].value;
                        //         break;
                        //     }
                        // }
                        for (let x in this.miniOnLineList) {
                            if (this.miniOnLineList[x].value == JSON.parse(Decrypt(data.data.data)).Cinema.miniOnLine) {
                                this.oMiniOnLine = this.miniOnLineList[x].value;
                                break;
                            }
                        }
                        for (let x in this.delivery) {
                            if (this.delivery[x].value == JSON.parse(Decrypt(data.data.data)).Cinema.snackDispatcherStatus) {
                                this.oSnackDispatcherStatus = this.delivery[x].value;
                                break;
                            }
                        }
                        for (let x in this.boolean) {
                            if (this.boolean[x].value == JSON.parse(Decrypt(data.data.data)).Cinema.refundable) {
                                this.oRefundable = this.boolean[x].value;
                                break;
                            }
                        }
                        for (let x in this.boolean) {
                            if (this.boolean[x].value == JSON.parse(Decrypt(data.data.data)).Cinema.openStatus) {
                                this.oOpenStatus = this.boolean[x].value;
                                break;
                            }
                        }
                        for (let x in this.boolean) {
                            if (this.boolean[x].value == JSON.parse(Decrypt(data.data.data)).Cinema.openMemberCardStatus) {
                                this.oOpenMemberCardStatus = this.boolean[x].value;
                                break;
                            }
                        }
                        // for (let x in this.boolean) {
                        //     if (
                        //         this.boolean[x].value == JSON.parse(Decrypt(data.data.data)).CinemaMessagePlatFormInfo.messagePlatformType
                        //     ) {
                        //         this.oMessagePlatformType = this.boolean[x].value;
                        //         break;
                        //     }
                        // }
                        for (let i = 0; i < JSON.parse(Decrypt(data.data.data)).MessageInfo.length; i++) {
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 1) {
                                this.oMessageType1 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content;
                            }
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 2) {
                                this.oMessageType2 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content;
                            }
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 3) {
                                this.oMessageType3 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content;
                            }
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 4) {
                                this.oMessageType4 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content;
                            }
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 5) {
                                this.oMessageType5 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content;
                            }
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 6) {
                                this.oMessageType6 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content;
                            }
                        }
                        if (JSON.parse(Decrypt(data.data.data)).Cinema.ticketingSystemTypeVersion == 1) {
                            this.oTicketingSystemTypeVersion = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).Cinema.ticketingSystemTypeVersion == 2) {
                            this.oTicketingSystemTypeVersion = '2';
                        }
                        for (let x in this.boolean) {
                            if (this.boolean[x].value == JSON.parse(Decrypt(data.data.data)).Cinema.videoStatus) {
                                this.oVideoStatus = this.boolean[x].value;
                                break;
                            }
                        }
                        this.oMiniAppSecret = JSON.parse(Decrypt(data.data.data)).Cinema.miniAppSecret;
                        this.oMiniMerchantNo = JSON.parse(Decrypt(data.data.data)).Cinema.miniMerchantNo;
                        this.oMiniMerchantSecret = JSON.parse(Decrypt(data.data.data)).Cinema.miniMerchantSecret;
                        this.oMiniRefundCertificateUrl = JSON.parse(Decrypt(data.data.data)).Cinema.miniRefundCertificateUrl;
                        this.oTicketingSystemAccount = JSON.parse(Decrypt(data.data.data)).Cinema.ticketingSystemAccount;
                        this.oTicketingSystemPassword = JSON.parse(Decrypt(data.data.data)).Cinema.ticketingSystemPassword;
                        this.oMiniAppId = JSON.parse(Decrypt(data.data.data)).Cinema.miniAppId;
                        this.oVerificationCode = JSON.parse(Decrypt(data.data.data)).Cinema.verificationCode;
                        this.oMiniAppName = JSON.parse(Decrypt(data.data.data)).Cinema.miniAppName;
                        this.oMiniAppQRCode = JSON.parse(Decrypt(data.data.data)).Cinema.miniAppQRCode;
                        this.oMiniShareTitle = JSON.parse(Decrypt(data.data.data)).Cinema.miniShareTitle;
                        this.oMiniSharePosters = JSON.parse(Decrypt(data.data.data)).Cinema.miniSharePosters;
                        this.oNotice = JSON.parse(Decrypt(data.data.data)).cinemaSpecialService.notice;
                        this.oId = JSON.parse(Decrypt(data.data.data)).Cinema.id;
                        this.openServe();
                        // 获取所选影院名称
                        for (let i = 0; i < this.businessInfo.length; i++) {
                            if (this.businessInfo[i].businessCode == this.oBelongBusinessCode) {
                                this.oBusinessName = this.businessInfo[i].businessName;
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
        },
        // 编辑操作
        exChanger() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if (!this.oConcatName.trim()) {
                this.message = '影院联系人姓名不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oConcatMobile) {
                this.message = '影院联系人电话不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oConcatMobile.length != 11) {
                this.message = '请输入正确的影院联系人电话！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oServiceMobile) {
                this.message = '客服电话不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oRefundFee<0) {
                this.message = '退票手续费必须大于0，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oThirdPartyPayCommissionFee<0) {
                this.message = '第三方支付代售费必须大于0，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oMemberCardPayCommissionFee<0) {
                this.message = '会员卡支付代售费必须大于0，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oMembershipServiceAgreement) {
                this.message = '影院会员服务协议不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oBuyTicketHint) {
                this.message = '购票提示不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oEquityCardAgreement) {
                this.message = '权益卡协议不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oSnackDispatcherStatus) {
                this.message = '是否小卖配送不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oRefundable) {
                this.message = '是否可退票不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oSnackBeginTime) {
                this.message = '卖品显示开始时间不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oSnackEndTime) {
                this.message = '卖品显示结束时间不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oOpenMemberCardStatus) {
                this.message = '是否开通会员卡功能不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oVerificationCode) {
                this.message = '影院奖品核销码不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            var jsonArr = [];
            jsonArr.push({ key: 'specialServiceJson', value: JSON.stringify(this.serveData) });
            jsonArr.push({ key: 'cinemaName', value: this.oCinemaName });
            jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode });
            jsonArr.push({ key: 'province', value: this.oProvince });
            jsonArr.push({ key: 'city', value: this.oCity });
            jsonArr.push({ key: 'address', value: this.oAddress });
            jsonArr.push({ key: 'longitude', value: this.oLongitude });
            jsonArr.push({ key: 'latitude', value: this.oLatitude });
            jsonArr.push({ key: 'concatName', value: this.oConcatName });
            jsonArr.push({ key: 'concatMobile', value: this.oConcatMobile });
            jsonArr.push({ key: 'serviceMobile', value: this.oServiceMobile });
            jsonArr.push({ key: 'buyMinutesLimit', value: this.oBuyMinutesLimit });
            jsonArr.push({ key: 'refundMinutesLimit', value: this.oRefundMinutesLimit });
            jsonArr.push({ key: 'refundFee', value: this.oRefundFee });
            jsonArr.push({ key: 'belongBusinessCode', value: this.oBelongBusinessCode });
            jsonArr.push({ key: 'ticketingSystemType', value: this.oTicketingSystemType });
            jsonArr.push({ key: 'interfaceAddress', value: this.oInterfaceAddress });
            jsonArr.push({ key: 'thirdPartyPayCommissionFee', value: this.oThirdPartyPayCommissionFee });
            jsonArr.push({ key: 'memberCardPayCommissionFee', value: this.oMemberCardPayCommissionFee });
            jsonArr.push({ key: 'membershipServiceAgreement', value: this.oMembershipServiceAgreement });
            jsonArr.push({ key: 'buyTicketHint', value: this.oBuyTicketHint });
            jsonArr.push({ key: 'rechargeMemo', value: this.oRechargeMemo });
            // jsonArr.push({ key: 'openSnackStatus', value: this.oOpenSnackStatus });
            jsonArr.push({ key: 'snackDispatcherStatus', value: this.oSnackDispatcherStatus });
            jsonArr.push({ key: 'refundable', value: this.oRefundable });
            jsonArr.push({ key: 'snackBeginTime', value: this.oSnackBeginTime });
            jsonArr.push({ key: 'snackEndTime', value: this.oSnackEndTime });
            jsonArr.push({ key: 'equityCardAgreement', value: this.oEquityCardAgreement });
            jsonArr.push({ key: 'goldActivityMemo', value: this.oGoldActivityMemo });
            jsonArr.push({ key: 'ticketingSystemTypeVersion', value: this.oTicketingSystemTypeVersion });
            // jsonArr.push({ key: 'messagePlatformType', value: this.oMessagePlatformType });
            // let messageInfos = [];
            // if (this.oMessageType1) {
            //     messageInfos.push({ 'messageType':  1 , 'content': this.oMessageType1 });
            // }
            // if (this.oMessageType2) {
            //     messageInfos.push({ 'messageType': 2 ,  'content': this.oMessageType2 });
            // }
            // if (this.oMessageType3) {
            //     messageInfos.push({ 'messageType': 3 , 'content': this.oMessageType3 });
            // }
            // if (this.oMessageType4) {
            //     messageInfos.push({ 'messageType': 4 , 'content': this.oMessageType4 });
            // }
            // if (this.oMessageType5) {
            //     messageInfos.push({ 'messageType': 5 , 'content': this.oMessageType5 });
            // }
            // if (this.oMessageType6) {
            //     messageInfos.push({ 'messageType': 6 , 'content': this.oMessageType6 });
            // }
            // if (messageInfos.length>0) {
            //     jsonArr.push({ key: 'messageInfos', value: JSON.stringify(messageInfos)})
            // }
            // jsonArr.push({ key: 'messagePlatformAccount', value: this.oMessagePlatformAccount });
            // jsonArr.push({ key: 'messagePlatformPassword', value: this.oMessagePlatformPassword });
            // jsonArr.push({ key: 'messagePlatformSignId', value: this.oMessagePlatformSignId });
            // jsonArr.push({ key: 'openStatus', value: this.oOpenStatus });
            jsonArr.push({ key: 'openMemberCardStatus', value: this.oOpenMemberCardStatus });
            // jsonArr.push({ key: 'memberCardCommonUseStatus', value: this.oMemberCardCommonUseStatus });
            // jsonArr.push({ key: 'miniAppSecret', value: this.oMiniAppSecret });
            jsonArr.push({ key: 'miniMerchantNo', value: this.oMiniMerchantNo });
            // jsonArr.push({ key: 'miniMerchantSecret', value: this.oMiniMerchantSecret });
            // jsonArr.push({ key: 'miniRefundCertificateUrl', value: this.oMiniRefundCertificateUrl });
            jsonArr.push({ key: 'ticketingSystemAccount', value: this.oTicketingSystemAccount });
            // jsonArr.push({ key: 'ticketingSystemPassword', value: this.oTicketingSystemPassword });
            jsonArr.push({ key: 'miniAppId', value: this.oMiniAppId });
            jsonArr.push({ key: 'verificationCode', value: this.oVerificationCode });
            jsonArr.push({ key: 'miniAppName', value: this.oMiniAppName });
            jsonArr.push({ key: 'miniAppQRCode', value: this.oMiniAppQRCode });
            jsonArr.push({ key: 'miniShareTitle', value: this.oMiniShareTitle });
            jsonArr.push({ key: 'miniSharePosters', value: this.oMiniSharePosters });
            jsonArr.push({ key: 'notice', value: this.oNotice });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinema/updateCinemaFromBusiness', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = false;
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
            let cinemaCode = this.query.cinemaCode;
            let orderNumber = this.query.orderNumber;
            let startDate = this.query.startDate;
            let endDate = this.query.endDate;
            let reportedType = this.query.reportedType;
            let paymentType = this.query.paymentType;
            let miniOnLine = this.query.miniOnLine;
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!miniOnLine) {
                miniOnLine = '';
            }
            if (!orderNumber) {
                orderNumber = '';
            }
            if (!startDate) {
                startDate = '';
            }
            if (!endDate) {
                endDate = '';
            }
            if (!reportedType) {
                reportedType = '';
            }
            if (!paymentType) {
                paymentType = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            jsonArr.push({ key: 'orderNumber', value: orderNumber });
            jsonArr.push({ key: 'startDate', value: startDate });
            jsonArr.push({ key: 'endDate', value: endDate });
            jsonArr.push({ key: 'reportedType', value: reportedType });
            jsonArr.push({ key: 'paymentType', value: paymentType });
            jsonArr.push({ key: 'miniOnLine', value: miniOnLine });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinema/cinemaPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
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
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        beforeUpload(file) {
            //上传之前
            this.type.type = EncryptReplace('business');
            const isLt100Kb = file.size / 1024 < 100;
            if (!isLt100Kb) {
                this.message = '图片大小不能超过100kb！';
                this.open();
                return false;
            }
            return isLt100Kb;
        },
        unSuccess(data) {
            //修改上传文件 登录超时
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.upload.clearFiles();
                return;
            }
            this.oMiniSharePosters = data.data;
            if (data.code == 'nologin') {
                this.$refs.upload.clearFiles();
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        sureAddServe() {
            if (this.addServiceName == '' || this.addServiceDetail == '') {
                this.message = '请填写服务名称或内容';
                this.open();
                return;
            } else {
                let serve = {};
                serve.serviceName = this.addServiceName;
                serve.serviceDetail = this.addServiceDetail;
                serve.id = '';
                this.serveData.push(serve);
                this.addServeInfo = false;
                this.addServiceName = '';
                this.addServiceDetail = '';
            }
        },
        sureEditServe() {
            if (this.editServiceName == '' || this.editServiceDetail == '') {
                this.message = '请填写服务名称或内容';
                this.open();
                return;
            } else {
                this.serveData[this.serveIndex].serviceName = this.editServiceName;
                this.serveData[this.serveIndex].serviceDetail = this.editServiceDetail;
                this.editServeInfo = false;
                this.editServiceName = '';
                this.editServiceDetail = '';
            }
        },
        editServe(val) {
            this.editServiceName = val.row.serviceName;
            this.editServiceDetail = val.row.serviceDetail;
            this.serveIndex = val.$index;
            this.editServeInfo = true;
        },
        deleteServe(val) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.serveData.splice(val.$index, 1);
                    this.$message.error(`删除了`);
                })  .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
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
        openServe(e) {
            // 开通各种服务状态
        }
    }
};
</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

input[type='number'] {
    -moz-appearance: textfield;
}
</style>

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

