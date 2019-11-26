<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 开卡规则管理
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
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="启用" value="1"></el-option>
                    <el-option key="2" label="禁用" value="2"></el-option>
                </el-select>
                <el-button
                    style="margin-top: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="Search"
                >搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right"
                >添加</el-button>
            </div>
            <el-table
                :data="tableData"
                height="500"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="code" label="影院编码" width="140">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="code" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="开卡规则名称" width="160">
                    <template slot-scope="scope">{{scope.row.ruleName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="会员卡名称" width="120">
                    <template slot-scope="scope">{{scope.row.cardLevelName}}</template>
                </el-table-column>
                <el-table-column prop="number" label="充值金额" width="100">
                    <template slot-scope="scope">{{scope.row.rechargeAmount}}</template>
                </el-table-column>
                <el-table-column prop="sort" align="center" label="赠送类型" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.givenType=='1'">不赠送</el-tag>
                        <el-tag v-else-if="scope.row.givenType=='2'">赠送金额</el-tag>
                        <el-tag v-else-if="scope.row.givenType=='3'">赠送券包</el-tag>
                        <el-tag v-else-if="scope.row.givenType=='4'">两者都送</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="赠送金额" width="100">
                    <template slot-scope="scope">{{scope.row.givenMoney}}</template>
                </el-table-column>
                <el-table-column prop="number" label="赠送券包">
                    <template slot-scope="scope">{{scope.row.couponGroupName}}</template>
                </el-table-column>
                <el-table-column prop="booleans" align="center" label="状态" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
                        <el-tag v-else-if="scope.row.status == 2" type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
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
        <el-dialog title="新增规则" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="影院名称：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.cinemaName" placeholder="请选择" @change="getCinemaCode">
                        <el-option
                            v-for="info in cinemaInfo"
                            :key="info.cinemaCode"
                            :value="info.cinemaName"
                            :label="info.cinemaName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="会员卡名称：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.levelName" placeholder="请选择" @change="getCardInfo">
                        <el-option
                            v-for="info in cardList"
                            :key="info.levelName"
                            :value="info.levelCode"
                            :label="info.levelName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="开卡规则名称：" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model.trim="oForm.ruleName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="赠送类型：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.givenType" placeholder="请选择">
                        <el-option
                            v-for="item in type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="设置券包："
                    :label-width="formLabelWidth"
                    v-if="oForm.givenType == 3"
                    :required="true"
                >
                    <el-button type="primary" @click="getAllCoupon">选择券包</el-button>
                </el-form-item>
                <el-form-item
                    label="所选券包："
                    :label-width="formLabelWidth"
                    v-if="oForm.givenType == 3 || oForm.givenType == 4"
                    :required="true"
                >
                    <el-input style="width: 150px" v-model="groupName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                        v-if="groupName"
                        style="color:red;cursor: pointer;"
                        @click="deletCoupon"
                    >删除</span>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.givenType == 3" label="领取后过期天数：" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model.trim="oForm.overDays" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="优惠描述：" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model.trim="oForm.ruleMemo"
                        placeholder="建议长度不超过15字"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="有效期：" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="oForm.startDate"
                        type="datetime"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>至
                    <el-date-picker
                        v-model="oForm.endDate"
                        type="datetime"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="状态：" :label-width="formLabelWidth">
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
        <el-dialog title="修改规则" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="影院名称：" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        disabled
                        v-model="oCinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="会员卡名称：" :label-width="formLabelWidth">
                    <el-select v-model="oCardLevelName" placeholder="请选择" @change="getCardInfo">
                        <el-option
                            v-for="info in cardList"
                            :key="info.levelName"
                            :value="info.levelCode"
                            :label="info.levelName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="开卡规则名称：" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model.trim="oRuleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="赠送类型：" :label-width="formLabelWidth">
                    <el-select v-model="oGivenType" placeholder="请选择">
                        <el-option
                            v-for="item in type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="已设券包："
                    :label-width="formLabelWidth"
                    v-if="oGivenType == 3 || oGivenType == '赠送券包'"
                    :required="true"
                >
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="groupName"
                        autocomplete="off"
                        disabled
                    ></el-input>
                    <el-button type="primary" @click="changeCoupon">更换券包</el-button>
                </el-form-item>
                <el-form-item :required="true" v-if="oGivenType == 3 || oGivenType == '赠送券包'" label="领取后过期天数：" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model.trim="oOverDays" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="优惠描述：" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model.trim="oRuleMemo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="有效期：" :label-width="formLabelWidth" prop="date1">
                    <el-date-picker
                        v-model="oStartDate"
                        type="datetime"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>至
                    <el-date-picker
                        v-model="oEndDate"
                        type="datetime"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="状态：" :label-width="formLabelWidth">
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
        <!-- 选择优惠券弹出窗 -->
        <el-dialog title="选择优惠券" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="couponName" placeholder="券包名称" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="getAllCoupon">搜索</el-button>
                </div>
                <el-table
                    :data="couponList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="couponId" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="券包名称" width="150">
                        <template slot-scope="scope">{{scope.row.groupName}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠券详情">
                        <template slot-scope="scope">
                            <span
                                v-for="item in scope.row.couponList"
                                :key="item"
                            >{{item.couponName}}x{{item.number}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button type="primary" @click="sureNext(couponId)">确 定</el-button>
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
            oCinemaName: '',
            oCardLevelCode: '',
            oCardLevelName: '',
            oRuleName: '', // 规则名称
            oRechargeAmount: '', // 充值金额
            oGivenType: '', // 赠送类型
            oOverDays: '',
            oGivenMoney: '', //赠送金额
            oGivenCouponGroupId: '', //赠送优惠券
            oRuleMemo: '', // 活动描述
            oCouponGroupName: '',
            oStartDate: '',
            oEndDate: '',
            oStatus: '', // 启用状态
            oId: '',
            groupName: '',
            drawer: false,
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            options: [
                {
                    value: '1',
                    label: '启用'
                },
                {
                    value: '2',
                    label: '禁用'
                }
            ],
            type: [
                {
                    value: '1',
                    label: '不赠送'
                },
                {
                    value: '3',
                    label: '赠送券包'
                }
            ],
            cinemaInfo: [],
            cardList: [],
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
                levelCode: '',
                ruleName: '', // 规则名称
                rechargeAmount: '', // 充值金额
                givenType: '', // 赠送类型
                givenMoney: '', //赠送金额
                givenCouponGroupId: '', //赠送优惠券
                ruleMemo: '', // 活动描述
                status: '', // 启用状态
                id: '',
                startDate: '',
                endDate: ''
            },
            formLabelWidth: '160px',
            selectValue: {},
            selectCode: {},
            couponName: '',
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
                .fetchPost('/openCardRule/addPage', '')
                .then(data => {
                    this.cardList = [];
                    loading.close();
                    this.cinemaInfo = JSON.parse(Decrypt(data.data.data));
                    if (data.data.code == 'success') {
                        for (let key in this.oForm) {
                            this.oForm[key] = '';
                        }
                        this.couponId = '';
                        this.groupName = '';
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
            if(!this.oForm.cinemaName||!this.oForm.levelName||!this.oForm.ruleName||!this.oForm.givenType||!this.oForm.startDate||!this.oForm.endDate||!this.oForm.status){
                this.message = '必填项不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }else if(this.oForm.givenType==3){
                if(!this.groupName ||!this.oForm.overDays){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            var jsonArr = [];
            if (this.couponId != '') {
                jsonArr.push({ key: 'givenCouponGroupId', value: this.couponId });
            }
            jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
            jsonArr.push({ key: 'ruleName', value: this.oForm.ruleName });
            jsonArr.push({ key: 'rechargeAmount', value: '0' });
            jsonArr.push({ key: 'cardLevelCode', value: this.oForm.levelName });
            // jsonArr.push({ key: 'cardLevelName', value: this.oForm.levelName });
            jsonArr.push({ key: 'givenType', value: this.oForm.givenType });
            jsonArr.push({ key: 'overDays', value: this.oForm.overDays });
            jsonArr.push({ key: 'ruleMemo', value: this.oForm.ruleMemo });
            jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
            jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
            jsonArr.push({ key: 'status', value: this.oForm.status });
            console.log(jsonArr);
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/openCardRule/addOpenCardRule', params)
                    .then(data => {
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
                        .fetchDelete('/openCardRule/deleteOpenCardRule', params)
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
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/openCardRule/modifyPage', params)
                .then(data => {
                    loading.close();
                    console.log(data);
                    if (data.data.code == 'success') {
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        // JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.cinemaCode
                        // this.oForm.cinemaCode=JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.cinemaCode
                        // this.getAllCinemaCard();
                        this.editVisible = true;
                        this.cardList = JSON.parse(Decrypt(data.data.data)).cardLevelList;
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.cinemaName;
                        this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.cinemaCode;
                        for (let x in JSON.parse(Decrypt(data.data.data)).cardLevelList) {
                            if (JSON.parse(Decrypt(data.data.data)).cardLevelList[x].levelCode == JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.cardLevelCode) {
                                this.oCardLevelName = JSON.parse(Decrypt(data.data.data)).cardLevelList[x].levelCode;
                                break;
                            }
                        }
                        this.oRuleName = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.ruleName;
                        this.oOverDays = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.overDays;
                        this.oRechargeAmount = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.rechargeAmount;
                        this.groupName = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.couponGroupName;
                        this.couponId = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenCouponGroupId;
                        if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenMoney) {
                            this.oGivenMoney = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenMoney;
                        }
                        if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenType == 1) {
                            this.oGivenType = '不赠送';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenType == 2) {
                            this.oGivenType = '赠送金额';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenType == 3) {
                            this.oGivenType = '赠送券包';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenType == 4) {
                            this.oGivenType = '两者都送';
                        }
                        this.oRuleMemo = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.ruleMemo;
                        this.oStartDate = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.startDate;
                        this.oEndDate = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.endDate;
                        if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.status == 1) {
                            this.oStatus = '启用';
                        } else {
                            this.oStatus = '未启用';
                        }
                        this.oId = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.id;
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
            if(!this.oCinemaName||!this.oCardLevelName||!this.oRuleName||!this.oGivenType||!this.oStartDate||!this.oEndDate||!this.oStatus){
                this.message = '必填项不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }else if(this.oGivenType==3){
                if(!this.groupName ||!this.oOverDays){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            var jsonArr = [];
            if (this.oGivenType == '不赠送') {
                jsonArr.push({ key: 'givenType', value: 1 });
                this.oGivenMoney = '';
                this.couponId = '';
                this.groupName = '';
            } else if (this.oGivenType == '赠送金额') {
                jsonArr.push({ key: 'givenType', value: 2 });
                this.couponId = '';
                this.groupName = '';
                if (this.oGivenMoney == '') {
                    alert('请输入赠送金额');
                    loading.close();
                    return;
                }
            } else if (this.oGivenType == '赠送券包') {
                jsonArr.push({ key: 'givenType', value: 3 });
                this.oGivenMoney = '';
                if (this.couponId == '' || !this.couponId) {
                    alert('请选择券包');
                    loading.close();
                    return;
                }
            } else if (this.oGivenType == '两者都送') {
                jsonArr.push({ key: 'givenType', value: 4 });
                if (this.oGivenMoney == '') {
                    alert('请输入赠送金额');
                    loading.close();
                    return;
                }
                if (this.couponId == '' || !this.couponId) {
                    alert('请选择券包');
                    loading.close();
                    return;
                }
            } else {
                jsonArr.push({ key: 'givenType', value: this.oGivenType });
            }
            if (this.oGivenType == 1) {
                this.couponId = '';
                this.groupName = '';
            }
            if (this.oGivenType == 3) {
                if (this.couponId == '' || !this.couponId) {
                    alert('请选择券包');
                    loading.close();
                    return;
                }
            }
            if (this.oStatus == '启用') {
                jsonArr.push({ key: 'status', value: 1 });
            } else if (this.oStatus == '未启用') {
                jsonArr.push({ key: 'status', value: 2 });
            } else {
                jsonArr.push({ key: 'status', value: this.oStatus });
            }
            // if (this.oGivenMoney != '') {
            //     jsonArr.push({ key: 'givenMoney', value: this.oGivenMoney });
            // }
            if (this.couponId != '') {
                jsonArr.push({ key: 'givenCouponGroupId', value: this.couponId });
            }
            jsonArr.push({ key: 'ruleName', value: this.oRuleName });
            jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode });
            jsonArr.push({ key: 'startDate', value: this.oStartDate });
            jsonArr.push({ key: 'endDate', value: this.oEndDate });
            jsonArr.push({ key: 'rechargeAmount', value: '0' });
            jsonArr.push({ key: 'ruleMemo', value: this.oRuleMemo });
            jsonArr.push({ key: 'overDays', value: this.oOverDays });
            jsonArr.push({ key: 'cardLevelCode', value: this.oCardLevelName });
            // jsonArr.push({ key: 'cardLevelName', value: this.oCardLevelName });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            this.editVisible = false;
            https
                .fetchPost('/openCardRule/modifyOpenCardRule', params)
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
            // console.log(e);
            // this.oForm.levelName = e;
            // console.log(this.oForm.levelName);
            // console.log(this.cardList);
            // // 获取所选会员卡名称
            // for (let i = 0; i < this.cardList.length; i++) {
            //     if (this.cardList[i].levelCode == e) {
            //         console.log(1);
            //         this.oForm.levelName = this.cardList[i].levelCode;
            //     }
            // }
            // console.log(this.oForm.levelName)
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
            let status = this.query.status;
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!status) {
                status = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            jsonArr.push({ key: 'status', value: status });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/openCardRule/openPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
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
            //错误信息弹出框
            this.$alert(this.message, '错误信息', {
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
        deletCoupon() {
            this.groupName = '';
            this.couponId = '';
        },
        sureNext(id) {
            this.couponId = id;
            for (let i = 0; i < this.couponList.length; i++) {
                if (this.couponList[i].id == this.couponId) {
                    this.groupName = this.couponList[i].groupName;
                }
            }
            this.drawer = false;
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
            if (!this.oForm.cinemaCode || this.oForm.cinemaCode == '') {
                this.message = '请选择影院';
                this.open();
                return;
            }
            if (!this.couponName) {
                this.couponName = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCodes', value: this.oForm.cinemaCode });
            jsonArr.push({ key: 'groupName', value: this.couponName });
            jsonArr.push({ key: 'status', value: 1 });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            console.log(jsonArr);
            https
                .fetchPost('/couponGroup/couponGroupPage', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        if (res.data.length == 0) {
                            this.message = '暂无券包';
                            this.couponName = '';
                            this.open();
                            return;
                        }
                        this.couponList = res.data;
                        console.log(this.couponList);
                        this.query.pageSize = res.pageSize;
                        this.query.pageNo = res.pageNo;
                        this.query.totalCount = res.totalCount;
                        this.query.totalPage = res.totalPage;
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
            jsonArr.push({ key: 'cinemaCodes', value: this.oCinemaCode });
            jsonArr.push({ key: 'status', value: 1 });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            console.log(jsonArr);
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
                        this.query.pageSize = res.pageSize;
                        this.query.pageNo = res.pageNo;
                        this.query.totalCount = res.totalCount;
                        this.query.totalPage = res.totalPage;
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
                        console.log(res);
                        this.cardList = res;
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
</style>

