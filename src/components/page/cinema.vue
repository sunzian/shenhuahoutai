<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影院设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.cinemaName" placeholder="影院名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                height="500"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="code" label="影院编码" fixed>
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院名称" fixed>
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="time" label="开场前的购票时间限制">
                    <template slot-scope="scope">{{scope.row.buyMinutesLimit}}</template>
                </el-table-column>
                <el-table-column prop="time" label="开场前的退票时间限制">
                    <template slot-scope="scope">{{scope.row.refundMinutesLimit}}</template>
                </el-table-column>
                <el-table-column prop="number" label="退票手续费">
                    <template slot-scope="scope">{{scope.row.refundFee}}</template>
                </el-table-column>
                <el-table-column prop="number" label="第三方支付代售费（微信支付）">
                    <template slot-scope="scope">{{scope.row.thirdPartyPayCommissionFee}}</template>
                </el-table-column>
                <el-table-column prop="number" label="会员卡支付代售费">
                    <template slot-scope="scope">{{scope.row.memberCardPayCommissionFee}}</template>
                </el-table-column>
                <el-table-column prop="booleans" label="是否开通套餐">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.openSnackStatus == 1" type="success">已开通</el-tag>
                        <el-tag v-else type="danger">未开通</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="booleans" label="是否小卖配送">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.snackDispatcherStatus == 1" type="success">是</el-tag>
                        <el-tag v-else type="danger">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="booleans" label="是否可退票">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.refundable == 1" type="success">是</el-tag>
                        <el-tag v-else type="danger">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="剩余票数">
                    <template slot-scope="scope">{{scope.row.remainTicketsNumber}}</template>
                </el-table-column>
                <el-table-column prop="string" label="短信平台类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.messagePlatformType == 1" type="info">专信云</el-tag>
                        <el-tag v-else type="info">三体</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="booleans" label="是否开通服务">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.openStatus == 1" type="success">是</el-tag>
                        <el-tag v-else type="danger">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="到期时间">
                    <template slot-scope="scope">{{scope.row.expireDate}}</template>
                </el-table-column>
                <el-table-column prop="string" label="费用支付类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.paymentType == 1" type="info">包年</el-tag>
                        <el-tag v-else type="info">按票收费</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="string" label="票价上报方式">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.reportedType == 1" type="info">标准价格上报</el-tag>
                        <el-tag v-else type="info">优惠后价格上报</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="booleans" label="是否开通会员卡功能">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.openMemberCardStatus == 1" type="success">开通</el-tag>
                        <el-tag v-else type="danger">未开通</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="booleans" label="会员卡是否门店通用">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.memberCardCommonUseStatus == 1" type="success">是</el-tag>
                        <el-tag v-else type="danger">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="booleans" label="会员卡支付是否可用优惠券">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.ticketsForMemberCardPayStatus == 1" type="success">是</el-tag>
                        <el-tag v-else type="danger">否</el-tag>
                    </template>
                </el-table-column>
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
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item prop="cinemaCode" label="影院编码" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oCinemaCode"
                        autocomplete="off"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="cinemaName" label="影院名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oCinemaName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="province" label="所在省份" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oProvince" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="city" label="所在城市" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oCity" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="address" label="详细地址" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oAddress" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="longitude" label="经度" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oLongitude" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="latitude" label="纬度" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oLatitude" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影院联系人姓名" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oConcatName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影院联系人电话" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oConcatMobile" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="serviceMobile" label="客服电话" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oServiceMobile" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开场前的购票时间限制" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oBuyMinutesLimit" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开场前的退票时间限制" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oRefundMinutesLimit" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="退票手续费" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oRefundFee" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="第三方支付代售费（微信支付）" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oThirdPartyPayCommissionFee"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会员卡支付代售费" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oMemberCardPayCommissionFee"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院会员服务协议" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oMembershipServiceAgreement"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="购票提示" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oBuyTicketHint" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="openSnackStatus" label="是否开通套餐" :label-width="formLabelWidth">
                    <el-select v-model="oOpenSnackStatus" @change="openServe">
                        <el-option
                            v-for="info in boolean"
                            :key="info.value"
                            :label="info.label"
                            :value="info.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="snackDispatcherStatus"
                    label="是否小卖配送"
                    :label-width="formLabelWidth"
                >
                    <el-select v-model="oSnackDispatcherStatus" @change="openServe">
                        <el-option
                            v-for="info in boolean"
                            :key="info.value"
                            :label="info.label"
                            :value="info.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="refundable" label="是否可退票" :label-width="formLabelWidth">
                    <el-select v-model="oRefundable" @change="openServe">
                        <el-option
                            v-for="info in boolean"
                            :key="info.value"
                            :label="info.label"
                            :value="info.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="snackBeginTime" label="卖品显示开始时间" :label-width="formLabelWidth">
                    <el-time-picker
                        type="date"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        v-model="oSnackBeginTime"
                        placeholder="选择日期时间"
                    ></el-time-picker>
                </el-form-item>
                <el-form-item prop="snackEndTime" label="卖品显示结束时间" :label-width="formLabelWidth">
                    <el-time-picker
                        type="date"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        v-model="oSnackEndTime"
                        placeholder="选择日期时间"
                    ></el-time-picker>
                </el-form-item>
                <el-form-item label="短信平台类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="oMessagePlatformType">
                        <el-radio label="1">专信云</el-radio>
                        <el-radio label="2">三体</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="注册验证码"
                    :label-width="formLabelWidth"
                    v-if="oMessagePlatformType"
                >
                    <el-input
                        style="width: 250px"
                        v-model="oMessageType1"
                        autocomplete="off"
                        v-if="oMessagePlatformType==2"
                        placeholder="短信模板id"
                    ></el-input>
                    <el-input
                        v-if="oMessagePlatformType==1"
                        style="width: 250px"
                        v-model="oMessageType1"
                        autocomplete="off"
                        type="textarea"
                        placeholder="短信内容，长度不超过200个汉字"
                        maxlength="200"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="购票成功"
                    :label-width="formLabelWidth"
                    v-if="oMessagePlatformType"
                >
                    <el-input
                        style="width: 250px"
                        v-model="oMessageType2"
                        autocomplete="off"
                        v-if="oMessagePlatformType==2"
                        placeholder="短信模板id"
                    ></el-input>
                    <el-input
                        v-if="oMessagePlatformType==1"
                        style="width: 250px"
                        v-model="oMessageType2"
                        autocomplete="off"
                        type="textarea"
                        placeholder="短信内容，长度不超过200个汉字"
                        maxlength="200"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="下单失败"
                    :label-width="formLabelWidth"
                    v-if="oMessagePlatformType"
                >
                    <el-input
                        style="width: 250px"
                        v-model="oMessageType3"
                        autocomplete="off"
                        v-if="oMessagePlatformType==2"
                        placeholder="短信模板id"
                    ></el-input>
                    <el-input
                        v-if="oMessagePlatformType==1"
                        style="width: 250px"
                        v-model="oMessageType3"
                        autocomplete="off"
                        type="textarea"
                        placeholder="短信内容，长度不超过200个汉字"
                        maxlength="200"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="退票通知"
                    :label-width="formLabelWidth"
                    v-if="oMessagePlatformType"
                >
                    <el-input
                        style="width: 250px"
                        v-model="oMessageType4"
                        autocomplete="off"
                        v-if="oMessagePlatformType==2"
                        placeholder="短信模板id"
                    ></el-input>
                    <el-input
                        v-if="oMessagePlatformType==1"
                        style="width: 250px"
                        v-model="oMessageType4"
                        autocomplete="off"
                        type="textarea"
                        placeholder="短信内容，长度不超过200个汉字"
                        maxlength="200"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="会员卡充值"
                    :label-width="formLabelWidth"
                    v-if="oMessagePlatformType"
                >
                    <el-input
                        style="width: 250px"
                        v-model="oMessageType5"
                        autocomplete="off"
                        v-if="oMessagePlatformType==2"
                        placeholder="短信模板id"
                    ></el-input>
                    <el-input
                        v-if="oMessagePlatformType==1"
                        style="width: 250px"
                        v-model="oMessageType5"
                        autocomplete="off"
                        type="textarea"
                        placeholder="短信内容，长度不超过200个汉字"
                        maxlength="200"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="卖品送餐"
                    :label-width="formLabelWidth"
                    v-if="oMessagePlatformType"
                >
                    <el-input
                        style="width: 250px"
                        v-model="oMessageType6"
                        autocomplete="off"
                        v-if="oMessagePlatformType==2"
                        placeholder="短信模板id"
                    ></el-input>
                    <el-input
                        v-if="oMessagePlatformType==1"
                        style="width: 250px"
                        v-model="oMessageType6"
                        autocomplete="off"
                        type="textarea"
                        placeholder="短信内容，长度不超过200个汉字"
                        maxlength="200"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label="短信平台账号" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oMessagePlatformAccount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="短信平台密码" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oMessagePlatformPassword"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="短信平台签名id" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oMessagePlatformSignId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="openStatus" label="是否开通服务" :label-width="formLabelWidth">
                    <el-select v-model="oOpenStatus" @change="openServe">
                        <el-option
                            v-for="info in boolean"
                            :key="info.value"
                            :label="info.label"
                            :value="info.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="openMemberCardStatus"
                    label="是否开通会员卡功能"
                    :label-width="formLabelWidth"
                >
                    <el-select v-model="oOpenMemberCardStatus" @change="openServe">
                        <el-option
                            v-for="info in boolean"
                            :key="info.value"
                            :label="info.label"
                            :value="info.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="videoStatus" label="是否开通预告片" :label-width="formLabelWidth">
                    <el-select v-model="oVideoStatus" @change="openServe">
                        <el-option
                            v-for="info in boolean"
                            :key="info.value"
                            :label="info.label"
                            :value="info.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="memberCardCommonUseStatus"
                    label="会员卡是否门店通用"
                    :label-width="formLabelWidth"
                >
                    <el-select v-model="oMemberCardCommonUseStatus" @change="openServe">
                        <el-option
                            v-for="info in boolean"
                            :key="info.value"
                            :label="info.label"
                            :value="info.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="小程序名称" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oMiniAppName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="小程序二维码" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oMiniAppQRCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="miniAppId" label="小程序appId" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oMiniAppId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    prop="miniAppSecret"
                    label="小程序appSecret"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oMiniAppSecret" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="miniMerchantNo" label="小程序支付商户号" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oMiniMerchantNo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    prop="miniMerchantSecret"
                    label="小程序支付密钥"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oMiniMerchantSecret" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    prop="miniRefundCertificateUrl"
                    label="小程序退款证书阿里云路径"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        style="width: 250px"
                        v-model="oMiniRefundCertificateUrl"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    prop="ticketingSystemAccount"
                    label="售票系统账号"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        style="width: 150px"
                        v-model="oTicketingSystemAccount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    prop="ticketingSystemPassword"
                    label="售票系统密码"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        style="width: 150px"
                        v-model="oTicketingSystemPassword"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="verificationCode" label="影院奖品核销码" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oVerificationCode" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
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
            rules: {
                cinemaCode: [{ required: true, message: '请输入影院编码', trigger: 'blur' }],
                cinemaName: [{ required: true, message: '请输入影院名称', trigger: 'blur' }],
                province: [{ required: true, message: '请输入所在省份', trigger: 'blur' }],
                city: [{ required: true, message: '请输入所在城市', trigger: 'blur' }],
                address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
                longitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
                latitude: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
                serviceMobile: [{ required: true, message: '请输入客服电话', trigger: 'blur' }],
                openSnackStatus: [{ required: true, message: '请选择', trigger: 'change' }],
                snackDispatcherStatus: [{ required: true, message: '请选择', trigger: 'change' }],
                refundable: [{ required: true, message: '请选择', trigger: 'change' }],
                snackBeginTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
                snackEndTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
                openStatus: [{ required: true, message: '请选择', trigger: 'change' }],
                openMemberCardStatus: [{ required: true, message: '请选择', trigger: 'change' }],
                videoStatus: [{ required: true, message: '请选择', trigger: 'change' }],
                memberCardCommonUseStatus: [{ required: true, message: '请选择', trigger: 'change' }],
                miniAppId: [{ required: true, message: '请输入appId', trigger: 'blur' }],
                miniAppSecret: [{ required: true, message: '请输入appSecret', trigger: 'blur' }],
                miniMerchantNo: [{ required: true, message: '请输入商户号', trigger: 'blur' }],
                miniMerchantSecret: [{ required: true, message: '请输入支付密钥', trigger: 'blur' }],
                miniRefundCertificateUrl: [{ required: true, message: '请输入路径', trigger: 'blur' }],
                ticketingSystemAccount: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                ticketingSystemPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                verificationCode: [{ required: true, message: '请输入核销码', trigger: 'blur' }]
            },
            oInterfaceAddress: '',
            oTicketingSystemType: '',
            oBelongBusinessCode: '',
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
            oTicketSystemCode: '',
            oBuyMinutesLimit: '',
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
            oId: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 10
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
            businessInfo: [], //关联商家信息
            form: [],
            tableData: [],
            multipleSelection: [],
            delList: [],
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
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
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
                        this.oMessagePlatformType = JSON.parse(Decrypt(data.data.data)).Cinema.messagePlatformType;
                        this.oMessagePlatformAccount = JSON.parse(Decrypt(data.data.data)).CinemaMessagePlatFormInfo.messagePlatformAccount;
                        this.oMessagePlatformPassword = JSON.parse(Decrypt(data.data.data)).CinemaMessagePlatFormInfo.messagePlatformPassword;
                        this.oMessagePlatformSignId = JSON.parse(Decrypt(data.data.data)).CinemaMessagePlatFormInfo.messagePlatformSignId;
                        for (let x in this.boolean) {
                            if (this.boolean[x].value == JSON.parse(Decrypt(data.data.data)).Cinema.memberCardCommonUseStatus) {
                                this.oMemberCardCommonUseStatus = this.boolean[x].value;
                                break;
                            }
                        }
                        for (let x in this.boolean) {
                            if (this.boolean[x].value == JSON.parse(Decrypt(data.data.data)).Cinema.openSnackStatus) {
                                this.oOpenSnackStatus = this.boolean[x].value;
                                break;
                            }
                        }
                        for (let x in this.boolean) {
                            if (this.boolean[x].value == JSON.parse(Decrypt(data.data.data)).Cinema.snackDispatcherStatus) {
                                this.oSnackDispatcherStatus = this.boolean[x].value;
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
                        for (let x in this.boolean) {
                            if (
                                this.boolean[x].value == JSON.parse(Decrypt(data.data.data)).CinemaMessagePlatFormInfo.messagePlatformType
                            ) {
                                this.oMessagePlatformType = this.boolean[x].value;
                                break;
                            }
                        }
                        for (let i = 0; i < JSON.parse(Decrypt(data.data.data)).MessageInfo.length; i ++) {
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 1) {
                                this.oMessageType1 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content
                            }
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 2) {
                                this.oMessageType2 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content
                            }
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 3) {
                                this.oMessageType3 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content
                            }
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 4) {
                                this.oMessageType4 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content
                            }
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 5) {
                                this.oMessageType5 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content
                            }
                            if (JSON.parse(Decrypt(data.data.data)).MessageInfo[i].messageType == 6) {
                                this.oMessageType6 = JSON.parse(Decrypt(data.data.data)).MessageInfo[i].content
                            }
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
            var jsonArr = [];
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
            jsonArr.push({ key: 'openSnackStatus', value: this.oOpenSnackStatus });
            jsonArr.push({ key: 'snackDispatcherStatus', value: this.oSnackDispatcherStatus });
            jsonArr.push({ key: 'refundable', value: this.oRefundable });
            jsonArr.push({ key: 'snackBeginTime', value: this.oSnackBeginTime });
            jsonArr.push({ key: 'snackEndTime', value: this.oSnackEndTime });
            jsonArr.push({ key: 'messagePlatformType', value: this.oMessagePlatformType });
            let messageInfos = [];
            if (this.oMessageType1) {
                messageInfos.push({ 'messageType':  1 , 'content': this.oMessageType1 });
            }
            if (this.oMessageType2) {
                messageInfos.push({ 'messageType': 2 ,  'content': this.oMessageType2 });
            }
            if (this.oMessageType3) {
                messageInfos.push({ 'messageType': 3 , 'content': this.oMessageType3 });
            }
            if (this.oMessageType4) {
                messageInfos.push({ 'messageType': 4 , 'content': this.oMessageType4 });
            }
            if (this.oMessageType5) {
                messageInfos.push({ 'messageType': 5 , 'content': this.oMessageType5 });
            }
            if (this.oMessageType6) {
                messageInfos.push({ 'messageType': 6 , 'content': this.oMessageType6 });
            }
            if (messageInfos.length>0) {
                jsonArr.push({ key: 'messageInfos', value: JSON.stringify(messageInfos)})
            }
            jsonArr.push({ key: 'messagePlatformAccount', value: this.oMessagePlatformAccount });
            jsonArr.push({ key: 'messagePlatformPassword', value: this.oMessagePlatformPassword });
            jsonArr.push({ key: 'messagePlatformSignId', value: this.oMessagePlatformSignId });
            jsonArr.push({ key: 'openStatus', value: this.oOpenStatus });
            jsonArr.push({ key: 'openMemberCardStatus', value: this.oOpenMemberCardStatus });
            jsonArr.push({ key: 'memberCardCommonUseStatus', value: this.oMemberCardCommonUseStatus });
            jsonArr.push({ key: 'miniAppSecret', value: this.oMiniAppSecret });
            jsonArr.push({ key: 'miniMerchantNo', value: this.oMiniMerchantNo });
            jsonArr.push({ key: 'miniMerchantSecret', value: this.oMiniMerchantSecret });
            jsonArr.push({ key: 'miniRefundCertificateUrl', value: this.oMiniRefundCertificateUrl });
            jsonArr.push({ key: 'ticketingSystemAccount', value: this.oTicketingSystemAccount });
            jsonArr.push({ key: 'ticketingSystemPassword', value: this.oTicketingSystemPassword });
            jsonArr.push({ key: 'miniAppId', value: this.oMiniAppId });
            jsonArr.push({ key: 'verificationCode', value: this.oVerificationCode });
            jsonArr.push({ key: 'miniAppName', value: this.oMiniAppName });
            jsonArr.push({ key: 'miniAppQRCode', value: this.oMiniAppQRCode });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            console.log(jsonArr);
            this.editVisible = false;
            https
                .fetchPost('/cinema/updateCinemaFromBusiness', params)
                .then(data => {
                    loading.close();
                    console.log(data);
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
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
            let name = this.query.name;
            let status = this.query.status;
            if (!name) {
                name = '';
            }
            if (!status) {
                status = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaName', value: name });
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
        openServe(e) {
            // 开通各种服务状态
        },
        changeGetStatus(item) {
            if (item == 1) {
                item = '是';
                return item;
            }
            if (item == 2) {
                item = '否';
                return item;
            }
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
    margin-bottom: 20px;
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

