<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影院管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="影院名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="margin-left: 730px"
                >新增</el-button>
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
                    <template slot-scope="scope" v-if="scope.row.openSnackStatus == 1">已开通</template>
                    <template slot-scope="scope" v-else>未开通</template>
                </el-table-column>
                <el-table-column prop="booleans" label="是否小卖配送">
                    <template slot-scope="scope" v-if="scope.row.snackDispatcherStatus == 1">是</template>
                    <template slot-scope="scope" v-else>否</template>
                </el-table-column>
                <el-table-column prop="booleans" label="是否可退票">
                    <template slot-scope="scope" v-if="scope.row.refundable == 1">是</template>
                    <template slot-scope="scope" v-else>否</template>
                </el-table-column>
                <el-table-column prop="booleans" label="是否可退票">
                    <template slot-scope="scope">{{scope.row.refundable}}</template>
                </el-table-column>
                <el-table-column prop="number" label="剩余票数">
                    <template slot-scope="scope">{{scope.row.remainTicketsNumber}}</template>
                </el-table-column>
                <el-table-column prop="string" label="短信平台类型">
                    <template slot-scope="scope">{{scope.row.messagePlatformType}}</template>
                </el-table-column>
                <el-table-column prop="booleans" label="是否开通服务">
                    <template slot-scope="scope" v-if="scope.row.openStatus == 1">是</template>
                    <template slot-scope="scope" v-else>否</template>
                </el-table-column>
                <el-table-column prop="time" label="到期时间">
                    <template slot-scope="scope">{{scope.row. expireDate}}</template>
                </el-table-column>
                <el-table-column prop="string" label="费用支付类型">
                    <template slot-scope="scope" v-if="scope.row.openStatus == 1">包年</template>
                    <template slot-scope="scope" v-else>按票收费</template>
                </el-table-column>
                <el-table-column prop="string" label="票价上报方式">
                    <template slot-scope="scope" v-if="scope.row.paymentType == 1">标准价格上报</template>
                    <template slot-scope="scope" v-else>优惠后价格上报</template>
                </el-table-column>
                <el-table-column prop="booleans" label="是否开通会员卡功能">
                    <template slot-scope="scope" v-if="scope.row.reportedType == 1">开通</template>
                    <template slot-scope="scope" v-else>未开通</template>
                </el-table-column>
                <el-table-column prop="booleans" label="会员卡是否门店通用">
                    <template slot-scope="scope" v-if="scope.row.memberCardCommonUseStatus == 1">是</template>
                    <template slot-scope="scope" v-else>否</template>
                </el-table-column>
                <el-table-column prop="booleans" label="会员卡支付是否可用优惠券">
                    <template slot-scope="scope" v-if="scope.row.ticketsForMemberCardPayStatus == 1">是</template>
                    <template slot-scope="scope" v-else>否</template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed='right'>
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
        <!--新增弹出框-->
        <el-dialog title="新增影院" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="影院名" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        maxlength="10"
                        show-word-limit
                        v-model="oForm.name"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院描述" :label-width="formLabelWidth">
                    <el-input
                        maxlength="30"
                        type="textarea"
                        :rows="2"
                        show-word-limit
                        v-model="oForm.memo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院logo" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.logo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院电话" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.mobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="金币过期年数" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.goldExpireYears"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会员卡积分兑换比例" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.percentageOfPointsIntoGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="过期优惠券是否发送短信通知会员" :label-width="formLabelWidth">
                    <el-select v-model="oForm.messageForExpireTickets" placeholder="请选择">
                        <el-option label="是" value="shanghai"></el-option>
                        <el-option label="否" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优惠券到期前几天发送短信通知会员" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.aheadDaysForMessage"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="售票系统类型" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.ticketingSystemType"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="售票系统账号" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.ticketingSystemAccount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="售票系统密码" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.ticketingSystemPassword"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="小程序appId" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.miniAppId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="售票系统接口地址" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.interfaceAddress"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="售票系统会员接口地址" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.memberInterfaceAddress"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="影院编码">
                    <el-input
                        style="width: 250px"
                        maxlength="10"
                        show-word-limit
                        v-model="oName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院名称">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="所在省份">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="所在城市">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="经度">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="纬度">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="关联商家编码">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院联系人姓名">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院联系人电话">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="客服电话">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影厅数量">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="售票系统影院内码">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                        disabled='true'
                    ></el-input>
                </el-form-item>
                <el-form-item label="第三方比价影院编码">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="开场前的购票时间限制">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="开场前的退票时间限制">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退票手续费">
                    <el-input
                        maxlength="30"
                        type="textarea"
                        :rows="2"
                        show-word-limit
                        v-model.trim="oMemo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="第三方支付代售费（微信支付）">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model.number="oMobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会员卡支付代售费">
                    <el-input
                        style="width: 250px"
                        min="1"
                        maxlength="7"
                        v-model="oLogo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院会员服务协议">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="购票提示">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="是否开通套餐">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="是否小卖配送">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="是否可退票">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="剩余票数">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="卖品显示开始时间">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="卖品显示结束时间">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="短信平台类型">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="短信平台账号">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="短信平台密码">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="短信平台签名id">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="是否开通服务">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="到期时间">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="费用支付类型">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="票价上报方式">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="是否开通会员卡功能">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会员卡是否门店通用">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会员卡支付是否可用优惠券">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="小程序appSecret">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="小程序支付商户号">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="小程序支付密钥">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="小程序退款证书阿里云路径">
                    <el-input
                        style="width: 50px"
                        min="1"
                        maxlength="7"
                        v-model.trim="oGold"
                        autocomplete="off"
                    ></el-input>
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
            oName: '',
            oId: '',
            oCode: '',
            oMemo: '',
            oLogo: '',
            oMobile: '',
            oGold: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 10
            },
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
                name: '',
                memo: '',
                logo: '',
                mobile: '',
                goldExpireYears: '',
                percentageOfPointsIntoGold: '',
                messageForExpireTickets: '',
                aheadDaysForMessage: '',
                ticketingSystemType: '',
                ticketingSystemAccount: '',
                ticketingSystemPassword: '',
                miniAppId: '',
                interfaceAddress: '',
                memberInterfaceAddress: ''
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
        addPage() {
            //获取新增按钮权限
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            https
                .fetchPost('/businessInfo/addPage', '')
                .then(data => {
                    console.log(data);
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = true;
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
            loading.close();
        },
        addRole() {
            //新增按钮操作
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            jsonArr.push({ key: 'businessName', value: this.oForm.name });
            jsonArr.push({ key: 'businessMemo', value: this.oForm.memo });
            jsonArr.push({ key: 'businessLogo', value: this.oForm.logo });
            jsonArr.push({ key: 'businessMobile', value: this.oForm.mobile });
            jsonArr.push({ key: 'goldExpireYears', value: this.oForm.goldExpireYears });
            jsonArr.push({ key: 'percentageOfPointsIntoGold', value: this.oForm.percentageOfPointsIntoGold });
            jsonArr.push({ key: 'messageForExpireTickets', value: this.oForm.messageForExpireTickets });
            jsonArr.push({ key: 'aheadDaysForMessage', value: this.oForm.aheadDaysForMessage });
            jsonArr.push({ key: 'ticketingSystemType', value: this.oForm.ticketingSystemType });
            jsonArr.push({ key: 'ticketingSystemAccount', value: this.oForm.ticketingSystemAccount });
            jsonArr.push({ key: 'ticketingSystemPassword', value: this.oForm.ticketingSystemPassword });
            jsonArr.push({ key: 'miniAppId', value: this.oForm.miniAppId });
            jsonArr.push({ key: 'interfaceAddress', value: this.oForm.interfaceAddress });
            jsonArr.push({ key: 'memberInterfaceAddress', value: this.oForm.memberInterfaceAddress });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/businessInfo', params)
                    .then(data => {
                        //新增
                        // console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.oForm.name = '';
                            this.oForm.memo = '';
                            this.oForm.logo = '';
                            this.oForm.mobile = '';
                            this.oForm.goldExpireYears = '';
                            this.oForm.percentageOfPointsIntoGold = '';
                            this.oForm.messageForExpireTickets = '';
                            this.oForm.aheadDaysForMessage = '';
                            this.oForm.ticketingSystemType = '';
                            this.oForm.ticketingSystemAccount = '';
                            this.oForm.ticketingSystemPassword = '';
                            this.oForm.miniAppId = '';
                            this.oForm.interfaceAddress = '';
                            this.oForm.memberInterfaceAddress = '';
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
                loading.close();
            }
        },
        delChange(index, row) {
            //删除数据
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            this.idx = index;
            this.form = row;
            let name = this.query.name;
            let status = this.query.status;
            if (!name) {
                name = '';
            }
            if (!status) {
                status = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchDelete('/businessInfo/deleteBusinessInfo', params)
                .then(data => {
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
                    console.log(err);
                });
            loading.close();
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
                    // console.log(data);
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.oName = JSON.parse(Decrypt(data.data.data)).businessName;
                        this.oMemo = JSON.parse(Decrypt(data.data.data)).businessMemo;
                        this.oMobile = JSON.parse(Decrypt(data.data.data)).businessMobile;
                        this.oLogo = JSON.parse(Decrypt(data.data.data)).businessLogo;
                        this.oCode = JSON.parse(Decrypt(data.data.data)).businessCode;
                        this.oGold = JSON.parse(Decrypt(data.data.data)).goldExpireYears;
                        this.oId = JSON.parse(Decrypt(data.data.data)).id;
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
            loading.close();
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
            jsonArr.push({ key: 'goldExpireYears', value: this.oGold });
            jsonArr.push({ key: 'businessName', value: this.oName });
            jsonArr.push({ key: 'businessMobile', value: this.oMobile });
            jsonArr.push({ key: 'businessMemo', value: this.oMemo });
            jsonArr.push({ key: 'businessLogo', value: this.oLogo });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            console.log(params);
            console.log(jsonArr);
            this.editVisible = false;
            https
                .fetchPost('/businessInfo/updateById', params)
                .then(data => {
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
                    console.log(err);
                });
            loading.close();
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
                    console.log(err);
                });
            loading.close();
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

