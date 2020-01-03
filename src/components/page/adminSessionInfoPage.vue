<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 排期管理
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
                <el-select
                    clearable
                    v-model="query.cinemaCode"
                    placeholder="请选择影院"
                    class="mr10"
                    @change="chooseCinema"
                >
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-select clearable v-model="query.screenCode" placeholder="请选择影厅" @change="chooseScreen" class="mr10">
                    <el-option
                        v-for="item in screenInfo"
                        :key="item.screenCode"
                        :label="item.screenName"
                        :value="item.screenCode"
                    ></el-option>
                </el-select>
                <el-input v-model="query.filmName" placeholder="影片名称" class="handle-input mr10"></el-input>
                <el-date-picker
                    v-model="query.startDate"
                    type="date"
                    class="mr10"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="放映开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.endDate"
                    type="date"
                    class="mr10"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="放映结束时间（止）"
                ></el-date-picker>
                <el-button
                    style="margin-top: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="Search"
                >搜索</el-button>
                <!-- <el-button
                    type="primary"
                    @click="showPoster"
                    style="float: right;margin-top: 10px"
                    icon="el-icon-circle-plus-outline"
                >生成影讯</el-button>
                <el-button
                    type="primary"
                    @click="updatePrice"
                    style="float: right;margin-top: 10px"
                    icon="el-icon-circle-plus-outline"
                >刷新小程序会员价</el-button> -->
                <!--<el-button-->
                <!--type="primary"-->
                <!--@click="thirdPrice"-->
                <!--style="float: right;margin-top: 10px"-->
                <!--icon="el-icon-circle-plus-outline"-->
                <!--&gt;批量修改展示会员价</el-button>-->
                <!-- <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >重新获取排期</el-button> -->
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
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column prop="code" label="影院名称" width="200" fixed>
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影片名称" width="200" fixed>
                    <template slot-scope="scope">{{scope.row.filmName}}</template>
                </el-table-column>
                <el-table-column prop="time" label="影厅名称" width="140">
                    <template slot-scope="scope">{{scope.row.screenName}}</template>
                </el-table-column>
                <el-table-column prop="time" label="放映时间" width="160">
                    <template slot-scope="scope">{{scope.row.sessionTime}}</template>
                </el-table-column>
                <el-table-column prop="number" label="时长/分钟" width="110">
                    <template slot-scope="scope">{{scope.row.duration}}</template>
                </el-table-column>
                <el-table-column prop="number" label="语言" width="70">
                    <template slot-scope="scope">{{scope.row.language}}</template>
                </el-table-column>
                <el-table-column prop="number" label="标准价" width="70">
                    <template slot-scope="scope">{{scope.row.standardPrice}}</template>
                </el-table-column>
                <el-table-column prop="booleans" label="结算价" width="70">
                    <template slot-scope="scope">{{scope.row.settlePrice}}</template>
                </el-table-column>
                <el-table-column prop="booleans" label="最低价" width="70">
                    <template slot-scope="scope">{{scope.row.lowestPrice}}</template>
                </el-table-column>
                <!--<el-table-column prop="number" label="会员价" width="70">-->
                <!--<template slot-scope="scope">{{scope.row.memberPrice}}</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="time" label="增值服务费" width="100">
                    <template slot-scope="scope">{{scope.row.ticketFee}}</template>
                </el-table-column>
                <el-table-column prop="time" label="影院补贴" width="90">
                    <template slot-scope="scope">{{scope.row.cinemaAllowance}}</template>
                </el-table-column>
                <el-table-column prop="time" label="第三方支付代售费" width="150">
                    <template slot-scope="scope">{{scope.row.thirdPartyPayCommissionFee}}</template>
                </el-table-column>
                <el-table-column prop="time" label="会员卡支付代售费" width="150">
                    <template slot-scope="scope">{{scope.row.memberCardPayCommissionFee}}</template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="110" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.row)"
                        >编辑</el-button>
                    </template>
                </el-table-column> -->
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
        <!--编辑弹出框-->
        <el-dialog :close-on-click-modal="false" title="编辑活动" :visible.sync="showActivity">
            <el-form :model="activityForm">
                <el-form-item label="活动类型" :label-width="formLabelWidth">
                    <el-select v-model="activityForm.activityType" clearable placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.label"
                            :label="item.value"
                            :value="item.label"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动说明" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="activityForm.activityDesc"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showActivity = false">取 消</el-button>
                <el-button type="primary" @click="addActivity">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增弹出框-->
        <el-dialog :close-on-click-modal="false" title="获取排期" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="影院名称" :label-width="formLabelWidth">
                    <el-select v-model="oForm.cinemaName" placeholder="请选择">
                        <el-option
                            v-for="info in cinemaInfo"
                            :key="info.cinemaCode"
                            :value="info.cinemaName"
                            :label="info.cinemaName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="oForm.startDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="oForm.endDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="价格设置" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="影院名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oCinemaName"
                        disabled
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影片名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oFilmName"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="放映时间" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oSessionTime"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="标准价" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oStandardPrice"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="增值服务费" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oTicketFee"
                        disabled
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="第三方支付代售费" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oThirdPartyPayCommissionFee"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会员卡支付代售费" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oMemberCardPayCommissionFee"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 批量修改弹出框 -->
        <el-dialog :close-on-click-modal="false" title="批量修改" :visible.sync="drawer">
            <el-form ref="formOne" v-model="formOne">
                <el-form-item label="会员价" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="manySettlePrice"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button type="primary" @click="sureThirdPrice">确 定</el-button>
            </span>
        </el-dialog>
        <!--影讯弹出框-->
        <el-dialog :close-on-click-modal="false" title="生成影讯" :visible.sync="poster">
            <el-form :model="oForm">
                <el-form-item :required="true" label="影院名称" :label-width="formLabelWidth">
                    <el-select v-model="posterForm.cinemaCode" placeholder="请选择">
                        <el-option
                            v-for="info in cinemaInfo"
                            :key="info.cinemaCode"
                            :value="info.cinemaCode"
                            :label="info.cinemaName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="时间" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="posterForm.date"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <div style="text-align:center;color:red;">*请用谷歌浏览器或火狐浏览器最新版本生成</div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="poster = false">取 消</el-button>
                <el-button type="primary" @click="createPoster">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :close-on-press-escape="false"
            :visible.sync="showPosterImg"
            :close-on-click-modal="false"
        >
            <div id="posterHtml" ref="posterHtml">
                <div style="background: linear-gradient(to bottom, #2177b9,#da4e7b);">
                    <div class="poster-head">
                        <div
                            style="font-size: 60px;
                                margin-bottom: 25px;
                                font-weight:bold;
                                letter-spacing: 8px;
                                padding-top: 50px;
                                color:rgba(255,255,255,1);
                                font-weight: 800;
                                "
                        >今日影讯</div>
                        <div class="poster-date">{{posterContent.dateInfo}}</div>
                        <div class="poster-name">{{posterContent.cinemaName}}</div>
                        <div
                            class="poster-address el-icon-location-information"
                            style="display: block;"
                        >{{posterContent.address}}</div>
                        <div
                            class="poster-mobile el-icon-phone-outline"
                            style="display: block;"
                        >{{posterContent.serviceMobile}}</div>
                    </div>
                    <div
                        v-for="(item, index) in posterContent.filmList"
                        :key="index"
                        class="poster-session"
                    >
                        <img :src="'data:image/png;base64,'+item.image" class="poster-img" />
                        <span class="poster-filmName">
                            {{item.filmName}}
                            <span
                                style="display: inline;border:1px solid red;color: red;font-size: 18px;"
                            >{{item.dimensional}}</span>
                        </span>
                        <span
                            class="poster-area"
                        >{{item.duration}}分钟，{{item.area}}，{{item.language}}</span>
                        <div class="poster-actor">{{item.actor}}</div>
                        <div class="poster-sessionList">
                            <div
                                class="poster-sessionInfo"
                                v-for="(session, index) in item.sessionList"
                                :key="index"
                            >
                                <div
                                    style="font-size: 30px;font-weight:bold;color:rgba(51,51,51,1);"
                                >{{session.sessionTime}}</div>
                                <div>
                                    <div>{{session.sessDimensional}}&nbsp;{{session.sessLanguage}}</div>
                                    <div
                                        style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                                    >{{session.screenName}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        style="text-align: center;position: relative;top: -30px;color:rgba(255,255,255,1);font-size:18px;"
                    >以上影讯如有变动，请以当日影院公布为准</div>
                </div>
                <div class="poster-foot">
                    <img
                        :src="'data:image/png;base64,'+posterContent.miniAppQRCode"
                        class="poster-qrcode"
                    />
                    <div
                        style="display: flex;flex-direction: column;justify-content: space-around;height:152px;"
                    >
                        <span
                            style="color:rgba(77,77,77,1);font-size: 26px;font-weight:bold;"
                        >票比三家，省钱到家</span>
                        <div class="poster-btn">会员充值巨划算</div>
                    </div>
                </div>
            </div>
            <el-button @click="downLoad('posterHtml','影讯')">生成影讯</el-button>
        </el-dialog>
    </div>
</template>

<script>
import html2canvas from 'html2canvas';
import { vueCanvasPoster } from 'vue-canvas-poster';
import { fetchData } from '../../api/index';
import { Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend } from '@/aes/utils';
import md5 from 'js-md5';
import axios from 'axios';
import https from '../../https';
export default {
    name: 'basetable',
    data() {
        return {
            posterContent: '', // 文案内容
            posterImg: '', // 最终生成的海报图片
            formOne: [],
            manySettlePrice: '',
            drawer: false,
            poster: false,
            showPosterImg: false,
            showActivity: false,
            activityCinemaCode: '',
            activitySessionCode: '',
            oCinemaName: '',
            oCinemaCode: '',
            oScreenCode: '',
            oScreenName: '',
            oSessionCode: '',
            oSessionTime: '',
            oFilmCode: '',
            oFilmName: '',
            oDuration: '',
            oLanguage: '',
            oDimensional: '',
            oStandardPrice: '',
            oSettlePrice: '',
            oLowestPrice: '',
            oMemberPrice: '',
            oTicketFee: '',
            oCinemaAllowance: '',
            oThirdPartyPayCommissionFee: '',
            oMemberCardPayCommissionFee: '',
            oListingPrice: '',
            oSessionId: '',
            oSessionKey: '',
            oSeatVersion: '',
            oIsArea: '',
            oId: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            boolean: [
                {
                    value: '是',
                    id: '1'
                },
                {
                    value: '否',
                    id: '2'
                }
            ],
            options: [
                {
                    value: '见面会',
                    label: '1'
                },
                {
                    value: '点映',
                    label: '2'
                }
            ],
            cinemaInfo: [],
            screenInfo: [],
            selectIdList: [],
            selectCodeList: [],
            selectId: '',
            selectCodes: '',
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
                startDate: '',
                endDate: ''
            },
            activityForm: {
                activityType: '',
                activityDesc: '',
                activityCinemaCode: '',
                activitySessionCode: ''
            },
            posterForm: {
                cinemaCode: '',
                date: ''
            },
            formLabelWidth: '160px',
            selectValue: {},
            selectCode: {},
            value: '',
            businessInfo: []
        };
    },
    components: {
        vueCanvasPoster
    },
    created() {},
    mounted() {
        this.getAllBusiness();
    },
    methods: {
        addChange(row) {
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
                .fetchPost('/sessionInfo/modifyActivityPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        this.activityForm.activityCinemaCode = JSON.parse(Decrypt(data.data.data)).cinemaCode;
                        this.activityForm.activitySessionCode = JSON.parse(Decrypt(data.data.data)).sessionCode;
                        if (JSON.parse(Decrypt(data.data.data)).activityType && JSON.parse(Decrypt(data.data.data)).activityType == 1) {
                            this.activityForm.activityType = '见面会'
                        }
                        if (JSON.parse(Decrypt(data.data.data)).activityType && JSON.parse(Decrypt(data.data.data)).activityType == 2) {
                            this.activityForm.activityType = '点映'
                        }
                        this.activityForm.activityDesc = JSON.parse(Decrypt(data.data.data)).activityDesc;
                        this.showActivity = true;
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
            this.showActivity = true;
        },
        addActivity() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            if (this.activityForm.activityType == '见面会') {
                this.activityForm.activityType = '1'
            }
            if (this.activityForm.activityType == '点映') {
                this.activityForm.activityType = '2'
            }
            jsonArr.push({ key: 'cinemaCode', value: this.activityForm.activityCinemaCode });
            jsonArr.push({ key: 'sessionCode', value: this.activityForm.activitySessionCode });
            jsonArr.push({ key: 'activityType', value: this.activityForm.activityType });
            jsonArr.push({ key: 'activityDesc', value: this.activityForm.activityDesc });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr)
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/sessionInfo/updateSessionActivity', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.activityForm.activityCinemaCode = '';
                        this.activityForm.activitySessionCode = '';
                        this.activityForm.activityType = '';
                        this.activityForm.activityDesc = '';
                        this.showActivity = false;
                        this.message = '编辑成功！';
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
        },
        thirdPrice() {
            //获取批量修改按钮权限
            if (this.multipleSelection.length == 0) {
                this.message = '请先勾选需要修改的影片';
                this.open();
            } else {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                https
                    .fetchPost('/sessionInfo/batchUpdatePage', '')
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            console.log(this.multipleSelection);
                            for (let x in this.multipleSelection) {
                                this.selectIdList.push(this.multipleSelection[x].id);
                                this.selectCodeList.push(this.multipleSelection[x].cinemaCode);
                            }
                            this.selectId = this.selectIdList.join(',');
                            this.selectCodes = this.selectCodeList.join(',');
                            console.log(this.selectId);
                            console.log(this.selectCodes);
                            this.drawer = true;
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
            }
        },
        updatePrice() {
            if (!this.query.cinemaCode) {
                this.message = '请选择影院！';
                this.open();
                return;
            }
            this.$confirm('该操作将花费较长时间, 是否继续?', '提示', {
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
                    jsonArr.push({ key: 'cinemaCode', value: this.query.cinemaCode });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/sessionInfo/updateMemberPrice', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.$message.success(`刷新成功`);
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
                        message: '已取消'
                    });
                });
        },

        sureThirdPrice() {
            //提交确认批量修改
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: this.selectId });
            jsonArr.push({ key: 'cinemaCode', value: this.selectCodes });
            jsonArr.push({ key: 'memberPrice', value: this.manySettlePrice });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.drawer == true) {
                https
                    .fetchPost('/sessionInfo/batchUpdateMemberPrice', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.$message.success(`修改成功`);
                            this.selectIdList = [];
                            this.selectId = '';
                            this.selectCodes = '';
                            this.manySettlePrice = '';
                            this.getMenu();
                            this.drawer = false;
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
            }
        },
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
                .fetchPost('/sessionInfo/updatePage', '')
                .then(data => {
                    loading.close();
                    // console.log(data);
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = true;
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
        addRole() {
            //新增按钮操作
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            //获取所选影院编码
            for (let i = 0; i < this.cinemaInfo.length; i++) {
                if (this.cinemaInfo[i].cinemaName == this.oForm.cinemaName) {
                    this.oForm.cinemaCode = this.cinemaInfo[i].cinemaCode;
                }
            }
            var jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
            jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
            jsonArr.push({ key: 'endtDate', value: this.oForm.endDate });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/sessionInfo/updateSessionInfo', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`获取成功`);
                            for (let key in this.oForm) {
                                this.oForm[key] = '';
                            }
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
                .fetchDelete('/cinema/deleteCinema', params)
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
            jsonArr.push({ key: 'thirdPartyPayCommissionFee', value: this.oThirdPartyPayCommissionFee });
            jsonArr.push({ key: 'memberCardPayCommissionFee', value: this.oMemberCardPayCommissionFee });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            console.log(jsonArr);
            https
                .fetchPost('/sessionInfo/updatePartyPayCommissionFee', params)
                .then(data => {
                    loading.close();
                    console.log(data);
                    // console.log(JSON.parse(Decrypt(data.data.data)));
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
            setTimeout(() => {
            let businessCode = this.query.businessCode;
            let cinemaCode = this.query.cinemaCode;
            let screenCode = this.query.screenCode;
            let filmName = this.query.filmName;
            let startDate = this.query.startDate;
            let endDate = this.query.endDate;
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!businessCode) {
                businessCode = '';
            }
            if (!screenCode) {
                screenCode = '';
            }
            if (!filmName) {
                filmName = '';
            }
            if (!startDate) {
                startDate = '';
            }
            if (!endDate) {
                endDate = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'businessCode', value: businessCode });
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            jsonArr.push({ key: 'startDate', value: startDate });
            jsonArr.push({ key: 'endDate', value: endDate });
            jsonArr.push({ key: 'screenCode', value: screenCode });
            jsonArr.push({ key: 'filmName', value: filmName });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/admin/sessionInfo/sessionInfoPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        if (data.data && data.data.data) {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.tableData = oData.data;
                            this.query.pageSize = oData.pageSize;
                            this.query.pageNo = oData.pageNo;
                            this.query.totalCount = oData.totalCount;
                            this.query.totalPage = oData.totalPage;
                            this.getAllScreen();
                        } else {
                            this.tableData = [];
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
                },1000)
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '返回信息', {
                dangerouslyUseHTMLString: true
            });
        },
        // 多选操作
        handleSelectionChange(val) {
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
        },
        // 获取所有影院
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
        chooseCinema(val) {
            this.query.screenCode = '';
            this.$forceUpdate();
            this.query.cinemaCode = val;
            this.getAllScreen(val);
        },
        chooseScreen() {
            this.$forceUpdate();
            this.query.screenCode = val;
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

        showPoster() {
            this.poster = true;
            this.posterForm.cinemaCode = this.cinemaInfo[0].cinemaCode;
        },

        // 生成影讯
        createPoster() {
            if (this.posterForm.cinemaCode == '') {
                this.message = '请选择影院！';
                this.open();
                return;
            }
            if (this.posterForm.date == '') {
                this.message = '请选择日期！';
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
            jsonArr.push({ key: 'cinemaCode', value: this.posterForm.cinemaCode });
            jsonArr.push({ key: 'date', value: this.posterForm.date });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/sessionInfo/getFilmNews', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.posterContent = JSON.parse(Decrypt(data.data.data));
                        console.log(this.posterContent);
                        this.showPosterImg = true;
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

        /* 第一个参数为需要保存的div的id名
           第二个参数为保存图片的名称 */
        downLoad(divText, imgText) {
            let canvasID = this.$refs[divText];
            let that = this;
            let a = document.createElement('a');
            html2canvas(canvasID).then(canvas => {
                let dom = document.body.appendChild(canvas);
                dom.style.display = 'none';
                a.style.display = 'none';
                document.body.removeChild(dom);
                let blob = that.dataURLToBlob(dom.toDataURL('image/png'));
                a.setAttribute('href', URL.createObjectURL(blob));
                //这块是保存图片操作  可以设置保存的图片的信息
                a.setAttribute('download', imgText + '.png');
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(blob);
                document.body.removeChild(a);
            });
        },

        //图片转换格式的方法
        dataURLToBlob(dataurl) {
            let arr = dataurl.split(',');
            let mime = arr[0].match(/:(.*?);/)[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }
    }
};
</script>

<style scoped>
.posterClass .el-dialog__header {
    padding: 0;
}
.posterClass .el-dialog__body {
    padding: 0;
}
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
#posterHtml {
    position: relative;
}
.poster-head {
    position: relative;
    padding-left: 20px;
}
.poster-date {
    position: absolute;
    top: 30%;
    right: 5%;
    font-size: 24px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
}
.poster-name {
    font-size: 36px;
    margin-bottom: 26px;
    font-weight: bold;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 1);
}
.poster-address {
    font-size: 26px;
    margin-bottom: 26px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
}
.poster-mobile {
    font-size: 26px;
    margin-bottom: 35px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
}
.poster-session {
    position: relative;
    left: 15px;
    width: 90%;
    /* box-shadow:0px 7px 16px 0px rgba(3,143,228,0.45); */
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 60px;
    background: rgba(255, 255, 255, 1);
}
.poster-img {
    width: 200px;
    height: 280px;
    position: relative;
}
.poster-filmName {
    font-size: 30px;
    position: absolute;
    left: 241px;
    top: 53px;
}
.poster-area {
    color: rgba(136, 136, 136, 1);
    font-size: 22px;
    position: absolute;
    left: 241px;
    top: 123px;
}
.poster-actor {
    color: rgba(136, 136, 136, 1);
    font-size: 24px;
    position: absolute;
    left: 241px;
    top: 155px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.poster-sessionList {
    position: relative;
    margin-top: -90px;
    display: flex;
    flex-wrap: wrap;
}
.poster-sessionList > div:first-child {
    margin-left: 200px;
}
.poster-sessionInfo {
    display: flex;
    flex-direction: column;
    width: 100px;
    color: rgba(136, 136, 136, 1);
    font-size: 18px;
    height: 90px;
    font-weight: 400;
    text-align: center;
    justify-content: space-around;
    margin-bottom: 50px;
}
.poster-foot {
    position: relative;
    padding: 0 150px;
    display: flex;
    justify-content: space-around;
    height: 291px;
    align-items: center;
}
.poster-qrcode {
    width: 152px;
    height: 152px;
}
.poster-btn {
    width: 236px;
    height: 50px;
    background: rgba(0, 154, 255, 1);
    border-radius: 25px;
    color: rgba(255, 255, 255, 1);
    font-size: 22px;
    line-height: 50px;
    text-align: center;
}
</style>

