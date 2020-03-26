<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 扫码领券管理
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
                <el-input v-model="query.name" placeholder="活动名称" class="handle-input mr10"></el-input>
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="不启用" value="1"></el-option>
                    <el-option key="2" label="启用" value="2"></el-option>
                    <el-option key="3" label="过期" value="3"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                        type="primary"
                        @click="addPage"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px"
                >添加</el-button>
            </div>
            <el-table
                    :data="tableData"
                    height="500"
                    border
                    class="table"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="code" label="适用影院" width="320">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="code" label="活动名称" width="210">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="code" label="活动二维码" width="210">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width:400px" :src="scope.row.qrCode" />
                            <img
                                slot="reference"
                                :src="scope.row.qrCode"
                                :alt="scope.row.qrCode"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="活动开始时间" width="165">
                    <template slot-scope="scope">{{scope.row.startDate}}</template>
                </el-table-column>
                <el-table-column prop="name" label="活动结束时间" width="165">
                    <template slot-scope="scope">{{scope.row.endDate}}</template>
                </el-table-column>
                <el-table-column prop="name" label="活动总数量" width="65">
                    <template slot-scope="scope">{{scope.row.store}}</template>
                </el-table-column>
                <el-table-column prop="name" label="已领取数量" width="95">
                    <template slot-scope="scope">{{scope.row.getNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'">不启用</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">启用</el-tag>
                        <el-tag v-else-if="scope.row.status=='3'">过期</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
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
        <!--新增弹出框-->
        <el-dialog :close-on-click-modal="false" title="新增" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="通用方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.commonType" @change="clearCinema()">
                        <el-radio :label="1">全部影院</el-radio>
                        <el-radio :label="2">指定影院</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="选择影院"
                        :label-width="formLabelWidth"
                        v-if="oForm.commonType == 2"
                >
                    <el-checkbox-group v-model="oForm.cinemaCodes" @change="clearCinema()">
                        <el-checkbox
                                v-for="item in cinemaInfo"
                                :label="item.cinemaCode"
                                :key="item.cinemaCode"
                                :value="item.cinemaName"
                        >{{item.cinemaName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="活动名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择优惠券" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选优惠券"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0"
                        :required="true"
                >
                    <div v-for="(item, index) in selectedSell" style="margin-bottom: 5px" :key="index">
                        <el-input
                                style="width: 200px"
                                v-model="item.name"
                                autocomplete="off"
                                :value="item.id"
                                :disabled="true"
                                :change="one(item.id)"
                        >
                        </el-input>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        单次扫码领取数量：
                        <el-input
                                style="width: 70px"
                                v-model="item.num"
                                autocomplete="off"
                                :value="item.num"
                                @input="changeInput($event)"
                        ></el-input>
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deleteSell(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="活动开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oForm.startDate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="活动结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oForm.endDate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="时间类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.effectiveTimeType">
                        <el-radio :label="1">固定几天后过期</el-radio>
                        <el-radio :label="2">指定时间段</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="oForm.effectiveTimeType==2" :required="true" label="时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oForm.couponStartDate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择开始时间"
                    ></el-date-picker>至
                    <el-date-picker
                            v-model="oForm.couponEndDate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择结束时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item v-if="oForm.effectiveTimeType==1" :required="true" label="领取后几天过期" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oForm.overDays" autocomplete="off" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="用户是否每天可以领取" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.purchaseType">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--<el-form-item :required="true" label="用户限购次数" :label-width="formLabelWidth">-->
                    <!--<el-input style="width: 250px" min="1" v-model="oForm.purchaseNumber" autocomplete="off" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item :required="true" label="活动总数量" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oForm.store" autocomplete="off" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')"></el-input>
                </el-form-item>
                <el-form-item label="活动说明" :label-width="formLabelWidth">
                    <el-input
                            style="width: 300px"
                            :rows="5"
                            min="1"
                            type="textarea"
                            show-word-limit
                            maxlength="200"
                            v-model="oForm.memo"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="开启状态" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="editVisible">
            <el-form :model="form">
                <el-form-item :required="true" label="通用方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oCommonType" @change="clearCinema()">
                        <el-radio :label="1">全部影院</el-radio>
                        <el-radio :label="2">指定影院</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="选择影院"
                        :label-width="formLabelWidth"
                        v-if="oCommonType == 2"
                >
                    <el-checkbox-group v-model="oCinemaCodes" @change="clearCinema()">
                        <el-checkbox
                                v-for="item in cinemaInfo"
                                :label="item.cinemaCode"
                                :key="item.cinemaCode"
                                :value="item.cinemaName"
                        >{{item.cinemaName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="活动名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择优惠券" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选优惠券"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0"
                        :required="true"
                >
                    <div v-for="(item, index) in selectedSell" style="margin-bottom: 5px" :key="index">
                        <el-input
                                style="width: 200px"
                                v-model="item.name"
                                autocomplete="off"
                                :value="item.id"
                                :disabled="true"
                                :change="one(item.id)"
                        >
                        </el-input>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        单次扫码领取数量：
                        <el-input
                                style="width: 70px"
                                v-model="item.num"
                                autocomplete="off"
                                :value="item.num"
                                @input="changeInput($event)"
                        ></el-input>
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deleteSell(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="活动开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oStartDate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="活动结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oEndDate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="时间类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="oEffectiveTimeType">
                        <el-radio :label="1">固定几天后过期</el-radio>
                        <el-radio :label="2">指定时间段</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="oEffectiveTimeType==2" :required="true" label="时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oCouponStartDate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择开始时间"
                    ></el-date-picker>至
                    <el-date-picker
                            v-model="oCouponEndDate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择结束时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item v-if="oEffectiveTimeType==1" :required="true" label="领取后几天过期" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oOverDays" autocomplete="off"  onkeyup="this.value=this.value.replace(/[^0-9]+/,'')"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="用户是否每天可以领取" :label-width="formLabelWidth">
                    <el-radio-group v-model="oPurchaseType">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--<el-form-item :required="true" label="用户限购次数" :label-width="formLabelWidth">-->
                    <!--<el-input style="width: 250px" min="1" v-model="oPurchaseNumber" autocomplete="off" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item :required="true" label="活动总数量" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oStore" autocomplete="off" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')"></el-input>
                </el-form-item>
                <el-form-item label="已领取数量" :label-width="formLabelWidth">
                    <el-input disabled style="width: 250px" min="1" v-model="oGetNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动说明" :label-width="formLabelWidth">
                    <el-input
                            style="width: 300px"
                            :rows="5"
                            min="1"
                            type="textarea"
                            show-word-limit
                            maxlength="200"
                            v-model="oMemo"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="活动二维码" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oQrCode"/>
                        <img
                                slot="reference"
                                :src="oQrCode"
                                :alt="oQrCode"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                </el-form-item>
                <el-form-item :required="true" label="开启状态" :label-width="formLabelWidth">
                    <el-select v-model="oStatus" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增优惠券弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择优惠券" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.name" placeholder="优惠券名称" class="handle-input mr12"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="openNext">搜索</el-button>
                </div>
                <el-table
                        :data="sellTableData"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                        :row-key="getFilmId"
                >
                    <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                    <el-table-column prop="sort" label="优惠券名称">
                        <template slot-scope="scope">{{scope.row.name}}</template>
                    </el-table-column>
                    <el-table-column label="优惠券类型" prop="sort">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.couponType == 1" type="success">影票优惠券</el-tag>
                            <el-tag v-else-if="scope.row.couponType == 2" type="success">卖品优惠券</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠金额">
                        <template slot-scope="scope">
                            <el-tag
                                    v-if="scope.row.reduceType == 1"
                                    type="success"
                            >固定{{scope.row.discountMoney}}元</el-tag>
                            <el-tag
                                    v-else-if="scope.row.reduceType == 2 && scope.row.couponType == 2"
                                    type="success"
                            >满{{scope.row.achieveMoney}}减{{scope.row.discountMoney}}</el-tag>
                            <el-tag
                                    v-else-if="scope.row.reduceType == 2 && scope.row.couponType == 1"
                                    type="success"
                            >减{{scope.row.discountMoney}}元</el-tag>
                            <el-tag
                                    v-else-if="scope.row.reduceType == 3 && scope.row.couponType == 1"
                                    type="success"
                            >满{{scope.row.achieveMoney}}张减{{scope.row.discountMoney}}元</el-tag>
                            <el-tag
                                    v-else-if="scope.row.reduceType == 4 && scope.row.couponType == 1"
                                    type="success"
                            >满{{scope.row.achieveMoney}}减{{scope.row.discountMoney}}元</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            @size-change="aHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.aPageNo"
                            :page-sizes="[10, 15, 20, 30]"
                            :page-size="query.aPageSize"
                            :total="query.aTotalCount"
                            @current-change="aCurrentChange"
                            @prev-click="aPrev"
                            @next-click="aNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button type="primary" @click="sureNext">确 定</el-button>
            </div>
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
                selectedSell: [],
                sellTableData: [],
                oCommonType: '',
                oGetNumber: '',
                oCinemaCodes:[],
                oName: '',
                oStartDate: '',
                oEndDate: '',
                oPurchaseType: '',
                oPurchaseNumber: '',
                oEffectiveTimeType: '',
                oCouponStartDate: '',
                oCouponEndDate: '',
                oOverDays: '',
                oStore: '',
                oMemo: '',
                oQrCode: '',
                oStatus: '', // 启用状态
                oId: '',
                groupName: '',
                drawer: false,
                message: '', //弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 15,
                    aPageNo: 1,
                    aPageSize: 15,
                    name:''
                },
                options: [
                    {
                        value: '2',
                        label: '启用'
                    },
                    {
                        value: '1',
                        label: '未启用'
                    }
                ],
                cinemaList: [], //影院列表
                cinemaInfo: [],
                form: [],
                tableData: [],
                multipleSelection: [],
                delList: [],
                couponList: [],
                couponInfo: [],
                editVisible: false,
                pageTotal: 0,
                idx: -1,
                id: -1,
                couponId: '',
                dialogFormVisible: false,
                oForm: {
                    cinemaName: '',
                    name: '',
                    cinemaCodes: [],
                    levelCode: '',
                    ruleName: '', // 规则名称
                    rechargeAmount: '', // 充值金额
                    givenType: '', // 赠送类型
                    givenMoney: '', //赠送金额
                    overDays: '', //赠送金额
                    effectiveTimeType: '', //赠送金额
                    couponStartDate: '', //赠送金额
                    couponEndDate: '', //赠送金额
                    givenCouponGroupId: '', //赠送优惠券
                    ruleMemo: '', // 活动描述
                    commonType: '', // 活动描述
                    status: '', // 启用状态
                    store: '',
                    memo: '',
                    id: '',
                    purchaseType: 1,
                    purchaseNumber: 1,
                    startDate: '',
                    endDate: ''
                },
                formLabelWidth: '160px',
                couponName: '',
                value: ''
            };
        },
        created() {},
        mounted() {
            this.getMenu();
        },
        methods: {
            clearCinema(){
                this.selectedSell=[];
            },
            openNext() {
                //获取优惠券列表
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                this.$refs.multipleTable.clearSelection();
                if(this.oForm.cinemaCodes.length==0&&this.oForm.commonType==2){
                    this.message = '请先选择影院！';
                    this.open();
                    loading.close();
                    return;
                }
                setTimeout(() => {
                    let name=this.query.name;
                    if(!name){
                        name=''
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"name",value:name});
                    jsonArr.push({key:"cinemaCodes",value:this.oForm.cinemaCodes.join(",")});
                    jsonArr.push({key:"commonType",value:this.oForm.commonType});
                    jsonArr.push({key:"pageNo",value:this.query.aPageNo});
                    jsonArr.push({key:"pageSize",value:this.query.aPageSize});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/merchandiseCoupon/getCouponByCinemaCodeForGroup',params).then((data) => {
                        loading.close();
                        if(data.data.code=='success') {
                            this.drawer=true;
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
                            this.sellTableData = oData.pageResult.data;
                            console.log(this.sellTableData);
                            this.query.aPageSize = oData.pageResult.pageSize;
                            this.query.aPageNo = oData.pageResult.pageNo;
                            this.query.aTotalCount = oData.pageResult.totalCount;
                            this.query.aTotalPage = oData.pageResult.totalPage
                            this.query.name = ''
                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message;
                            this.open();
                            this.$router.push('/login');
                        }else{
                            this.message=data.data.message;
                            this.open()
                        }

                    }).catch(err=>{
                            loading.close();
                            console.log(err)
                        }
                    )
                }, 500);
            },
            sureNext() {
                // if(this.sellIndex>=0){
                //     // this.selectedSell=[]
                //     if(!this.sellTableData[this.sellIndex].num){
                //         this.message = '请填写单次扫码领取数量！';
                //         this.open();
                //         loading.close();
                //         return;
                //     }
                //     else {
                //         this.selectedSell.push(this.sellTableData[this.sellIndex]);
                //     }
                //
                // }
                // console.log(this.selectedSell);
                let selectedSell = [];
                this.selectedSell = selectedSell.concat(this.multipleSelection);
                console.log(this.selectedSell);
                this.drawer = false;
            },
            getFilmId(row) {
                return row.id;
            },
            one(a){//获取影片绑定的value值
                this.ticketIds =a
            },
            changeInput() {
                this.$forceUpdate();
            },
            deleteSell(index) {
                console.log(index);
                this.selectedSell.splice(index, 1);
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
                    .fetchPost('/sweepCodeGetCoupon/addPage', '')
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.oForm.commonType=1;
                            this.oForm.cinemaCodes=[];
                            this.oForm.name='';
                            this.selectedSell=[];
                            this.oForm.startDate='';
                            this.oForm.endDate='';
                            this.oForm.effectiveTimeType=1;
                            this.oForm.purchaseType=1;
                            this.oForm.purchaseNumber=1;
                            this.oForm.couponStartDate='';
                            this.oForm.couponEndDate='';
                            this.oForm.overDays='';
                            this.oForm.store='';
                            this.oForm.memo='';
                            this.oForm.status='1';
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
                var jsonArr = [];
                let coupon = [];
                for (let i = 0; i < this.selectedSell.length; i++) {
                    coupon.push(this.selectedSell[i].id + '=' + this.selectedSell[i].num);
                }
                let newCoupon = coupon.join(',');
                jsonArr.push({ key: 'commonType', value: this.oForm.commonType });
                jsonArr.push({ key: 'cinemaCodes', value: this.oForm.cinemaCodes.join(',') });
                jsonArr.push({ key: 'name', value: this.oForm.name });
                jsonArr.push({ key: 'couponList', value: newCoupon });
                jsonArr.push({ key: 'effectiveTimeType', value: this.oForm.effectiveTimeType });
                jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
                jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
                jsonArr.push({ key: 'status', value: this.oForm.status });
                jsonArr.push({ key: 'couponStartDate', value: this.oForm.couponStartDate });
                jsonArr.push({ key: 'couponEndDate', value: this.oForm.couponEndDate });
                jsonArr.push({ key: 'overDays', value: this.oForm.overDays });
                jsonArr.push({ key: 'store', value: this.oForm.store });
                jsonArr.push({ key: 'purchaseType', value: this.oForm.purchaseType });
                jsonArr.push({ key: 'purchaseNumber', value: 1 });
                jsonArr.push({ key: 'getNumber', value:0 });
                jsonArr.push({ key: 'memo', value: this.oForm.memo });
                console.log(jsonArr);
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https.fetchPost('/sweepCodeGetCoupon/add', params).then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
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
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
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
                        let jsonArr = [];
                        jsonArr.push({ key: 'id', value: row.id });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchDelete('/sweepCodeGetCoupon/deleteById', params)
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
                this.oForm.cinemaCode=row.cinemaCode
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: row.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/cinema/myCinemaPage', '')
                    .then(data => {
                        this.cinemaList = JSON.parse(Decrypt(data.data.data)).data;
                    })
                    .catch(err => {
                        console.log(err);
                    });
                https
                    .fetchPost('/sweepCodeGetCoupon/updatePage', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            if (JSON.parse(Decrypt(data.data.data)).commonType == 1) {
                                this.oCommonType = 1;
                            }
                            if (JSON.parse(Decrypt(data.data.data)).commonType == 2) {
                                this.oCommonType = 2;
                            }
                            if (this.oCommonType == 2) {
                                this.oCinemaCodes = JSON.parse(Decrypt(data.data.data)).cinemaCodes.split(',');
                            }
                            this.oName = JSON.parse(Decrypt(data.data.data)).name;
                            //优惠券
                            if(JSON.parse(Decrypt(data.data.data)).couponDetailList){
                                this.selectedSell=[];
                                for(let x in JSON.parse(Decrypt(data.data.data)).couponDetailList){
                                    let json={};
                                    json.id=JSON.parse(Decrypt(data.data.data)).couponDetailList[x].couponId;
                                    json.name=JSON.parse(Decrypt(data.data.data)).couponDetailList[x].couponName;
                                    json.num=JSON.parse(Decrypt(data.data.data)).couponDetailList[x].number;
                                    this.selectedSell.push(json)
                                }
                            }
                            this.oStartDate = JSON.parse(Decrypt(data.data.data)).startDate;
                            this.oEndDate = JSON.parse(Decrypt(data.data.data)).endDate;
                            if (JSON.parse(Decrypt(data.data.data)).effectiveTimeType == 1) {
                                this.oEffectiveTimeType = 1;
                            }
                            if (JSON.parse(Decrypt(data.data.data)).effectiveTimeType == 2) {
                                this.oEffectiveTimeType = 2;
                            }
                            if (JSON.parse(Decrypt(data.data.data)).purchaseType == 1) {
                                this.oPurchaseType = 1;
                            }
                            if (JSON.parse(Decrypt(data.data.data)).purchaseType == 2) {
                                this.oPurchaseType = 2;
                            }
                            this.oPurchaseNumber = JSON.parse(Decrypt(data.data.data)).purchaseNumber;
                            this.oPurchaseNumber = JSON.parse(Decrypt(data.data.data)).purchaseNumber;
                            this.oCouponEndDate = JSON.parse(Decrypt(data.data.data)).couponEndDate;
                            this.oOverDays = JSON.parse(Decrypt(data.data.data)).overDays;
                            this.oStore = JSON.parse(Decrypt(data.data.data)).store;
                            this.oMemo = JSON.parse(Decrypt(data.data.data)).memo;
                            this.oQrCode = JSON.parse(Decrypt(data.data.data)).qrCode;
                            this.oGetNumber = JSON.parse(Decrypt(data.data.data)).getNumber;
                            //开启状态下拉选显示对应的选项
                            for (let x in this.options) {
                                if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).status) {
                                    this.oStatus = this.options[x].value;
                                    break;
                                }
                            }
                            this.editVisible = true;
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
                let coupon = [];
                for (let i = 0; i < this.selectedSell.length; i++) {
                    coupon.push(this.selectedSell[i].id + '=' + this.selectedSell[i].num);
                }
                let newCoupon = coupon.join(',');
                jsonArr.push({ key: 'commonType', value: this.oCommonType });
                if(this.oCommonType==2){
                    jsonArr.push({ key: 'cinemaCodes', value: this.oCinemaCodes.join(',') });
                }
                jsonArr.push({ key: 'name', value: this.oName });
                jsonArr.push({ key: 'couponList', value: newCoupon });
                jsonArr.push({ key: 'effectiveTimeType', value: this.oEffectiveTimeType });
                jsonArr.push({ key: 'startDate', value: this.oStartDate });
                jsonArr.push({ key: 'endDate', value: this.oEndDate });
                jsonArr.push({ key: 'status', value: this.oStatus });
                jsonArr.push({ key: 'couponStartDate', value: this.oCouponStartDate });
                jsonArr.push({ key: 'couponEndDate', value: this.oCouponEndDate });
                jsonArr.push({ key: 'overDays', value: this.oOverDays });
                jsonArr.push({ key: 'store', value: this.oStore });
                jsonArr.push({ key: 'getNumber', value: this.oGetNumber });
                jsonArr.push({ key: 'purchaseType', value: this.oPurchaseType });
                jsonArr.push({ key: 'purchaseNumber', value: 1 });
                jsonArr.push({ key: 'memo', value: this.oMemo });
                jsonArr.push({ key: 'oQrCode', value: this.oQrCode });
                jsonArr.push({ key: 'id', value: this.form.id });
                console.log(jsonArr);
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/sweepCodeGetCoupon/update', params)
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
            getCinemaCode(e) {
                //获取所选影院编码
                for (let i = 0; i < this.cinemaInfo.length; i++) {
                    if (this.cinemaInfo[i].cinemaName == e) {
                        this.oForm.cinemaCode = this.cinemaInfo[i].cinemaCode;
                    }
                }
                this.getAllCinemaCard();
            },
            getCardInfo(e) {
                this.oForm.levelName = e;
                // 获取所选会员卡名称
                for (let i = 0; i < this.cardList.length; i++) {
                    if (this.cardList[i].levelName == e) {
                        this.oForm.levelCode = this.cardList[i].levelCode;
                    }
                }
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
                let name = this.query.name;
                let status = this.query.status;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!name) {
                    name = '';
                }
                if (!status) {
                    status = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'name', value: name });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/sweepCodeGetCoupon/page', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            this.tableData = oData.data;
                            console.log(this.tableData);
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
            open() {
                //信息提示弹出框
                this.$alert(this.message, '信息提示', {
                    dangerouslyUseHTMLString: true
                });
            },
            cancel() {
                this.$confirm('该操作将清空页面数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.dialogFormVisible = false;
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
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
            handleSizeChange(val) {
                this.query.pageSize=val;
                this.getMenu()
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
            aCurrentChange(val) {
                //点击选择具体页数
                this.query.aPageNo = val;
                this.openNext();
            },
            aHandleSizeChange(val) {
                this.query.aPageSize=val;
                this.openNext()
            },
            aPrev() {
                //分页按钮上一页
                this.query.aPageNo--;
                this.openNext();
            },
            aNext() {
                //分页按钮下一页
                this.query.aPageNo++;
                this.openNext();
            },
            // 获取所有影院
            getAllCinema() {
                https
                    .fetchPost('/cinema/getAllCinema')
                    .then(data => {
                        if (data.data.code == 'success') {
                            var res = JSON.parse(Decrypt(data.data.data));
                            console.log(res);
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
            // 获取所有券包
            getAllCoupon() {
                let couponName=this.couponName;
                if(!couponName){
                    couponName=''
                }
                if (!this.oForm.cinemaCode || this.oForm.cinemaCode == '') {
                    this.message = '请选择影院';
                    this.open();
                    return;
                }
                let jsonArr = [];
                jsonArr.push({ key: 'groupName', value: couponName });
                jsonArr.push({ key: 'pageNo', value: this.query.aPageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.aPageSize });
                jsonArr.push({ key: 'cinemaCodes', value: this.oForm.cinemaCode });
                jsonArr.push({ key: 'status', value: 1 });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                console.log(jsonArr);
                https
                    .fetchPost('/couponGroup/couponGroupPage', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            this.couponName='';
                            var res = JSON.parse(Decrypt(data.data.data));
                            if (res.data.length == 0) {
                                this.message = '暂无券包';
                                this.open();
                                return;
                            }
                            this.couponList = res.data;
                            console.log(res);
                            this.query.aPageSize = res.pageSize;
                            this.query.aPageNo = res.pageNo;
                            this.query.aTotalCount = res.totalCount;
                            this.query.aTotalPage = res.totalPage
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
                        console.log(err);
                    });
            },
            // 更换券包
            changeCoupon() {
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCodes', value: this.form.cinemaCode });
                jsonArr.push({ key: 'status', value: 1 });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/couponGroup/couponGroupPage', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            var res = JSON.parse(Decrypt(data.data.data));
                            console.log(res);
                            if (res.data.length == 0) {
                                this.message = '暂无券包';
                                this.open();
                                return;
                            }
                            this.couponList = res.data;
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
                        console.log(err);
                    });
            },
            // 获取所有影院会员卡
            getAllCinemaCard() {
                let jsonArr = [];
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
                jsonArr.push({ key: 'status', value: 1 });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/rechargeCardRule/listCardLevel', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            var res = JSON.parse(Decrypt(data.data.data));
                            this.cardList = res.data;
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
    .mr12 {
        width: 30%;
        margin-right: 10px;
    }
</style>

