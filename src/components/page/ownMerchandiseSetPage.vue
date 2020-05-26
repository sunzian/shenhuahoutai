<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 自选套餐
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
                <el-input
                    placeholder="套餐名称"
                    v-model="query.comboName"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="上架状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="上架" value="1"></el-option>
                    <el-option key="2" label="下架" value="2"></el-option>
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
                <el-table-column prop="code" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="套餐图片">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width:400px" :src="scope.row.comboImage" />
                            <img
                                slot="reference"
                                :src="scope.row.comboImage"
                                :alt="scope.row.comboImage"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="套餐基础价格">
                    <template slot-scope="scope">{{scope.row.basePrice}}</template>
                </el-table-column>
                <el-table-column prop="sort" align="center" label="上架状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'">上架</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">下架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="展示顺序">
                    <template slot-scope="scope">{{scope.row.showSeqNo}}</template>
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
        <el-dialog :close-on-click-modal="false" title="新增套餐" :visible.sync="dialogFormVisible">
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
                <el-form-item :required="true" label="新增套餐：" :label-width="formLabelWidth">
                    <div v-for="(item, index) in comboList" style="margin-bottom: 5px" :key="index">
                        <span>{{item.name}}</span>
                        <!-- <span style="color:red;cursor: pointer;" @click="deleteSell(index)">删除</span> -->
                        <span class="addGoodsItem" @click="openNext(item.id)">点击添加</span>
                    </div>
                    <el-button type="primary" @click="addComboGoods">添加主商品</el-button>
                </el-form-item>
                <!-- <el-form-item
                        label="商品1："
                        :label-width="formLabelWidth"
                        :required="true"
                        >
                        <div
                            v-for="(item, index) in selectedSell"
                            style="margin-bottom: 5px"
                            :key="index"
                            >
                            <el-input
                                style="width: 250px"
                                v-model="item.merchandiseName"
                                autocomplete="off"
                                :value="item.merchandiseCode"
                                :disabled="true"
                                :change="one(item.merchandiseCode)"
                            ></el-input>
                            <span style="color:red;cursor: pointer;" @click="deleteSell(index)">删除</span>
                        </div>
                        <el-button type="primary" @click="openNext">点击添加</el-button>
                </el-form-item>-->
                <el-form-item :required="true" label="上架状态：" :label-width="formLabelWidth">
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
        <el-dialog :close-on-click-modal="false" title="修改规则" :visible.sync="editVisible">
            <el-form ref="form" :model="form"></el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--选择卖品弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择卖品" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input
                        v-model="query.merchandiseName"
                        placeholder="卖品名称"
                        class="handle-input mr12"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="openNext">搜索</el-button>
                </div>
                <el-table
                    :data="sellTableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio
                                v-model="id"
                                :label="scope.$index"
                                @change.native="getCurrentRow(scope.$index)"
                            >&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="图片">
                        <template slot-scope="scope">
                            <el-popover placement="right" title trigger="hover">
                                <img style="width:400px" :src="scope.row.merchandisePic" />
                                <img
                                    slot="reference"
                                    :src="scope.row.merchandisePic"
                                    :alt="scope.row.merchandisePic"
                                    style="max-height: 50px;max-width: 130px"
                                />
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="卖品名称" width="150">
                        <template slot-scope="scope">{{scope.row.merchandiseName}}</template>
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
            drawer: false,
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                aPageNo: 1,
                aPageSize: 15
            },
            options: [
                {
                    value: '1',
                    label: '上架'
                },
                {
                    value: '2',
                    label: '不上架'
                }
            ],
            type: [
                {
                    value: '1',
                    label: '上架'
                },
                {
                    value: '2',
                    label: '不上架'
                }
            ],
            cinemaInfo: [],
            cardList: [],
            form: [],
            tableData: [],
            multipleSelection: [],
            sellTableData: [], // 卖品table
            selectedSell: [], // 所选卖品
            sellIndex: -1, // 所选卖品index
            comboList: [
                // 卖品套餐
                {
                    name: '商品1',
                    id: 1,
                    itemList: []
                },
                {
                    name: '商品2',
                    id: 2,
                    itemList: []
                }
            ],
            comboItemId: 0, // 选择的套餐主商品id
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
                effectiveTimeType: '',
                startEffectDate: '',
                endEffectDate: '',
                startDate: '',
                endDate: '',
                synchronizeRule: '2',
                syncCinemaCode: []
            },
            formLabelWidth: '160px',
            selectValue: {},
            selectCode: {},
            couponName: '',
            value: '',
            checkAll: false,
            isIndeterminate: true,
            adminFlag: 0, // 1:影管 2:门店
            syncCinemaList: [] // 可同步的影院列表
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
                .fetchPost('/ownMerchandiseSet/addPage', '')
                .then(data => {
                    this.cardList = [];
                    loading.close();
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
            if (!this.oForm.cinemaName) {
                this.message = '影院名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.levelName) {
                this.message = '会员卡名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.ruleName) {
                this.message = '开卡规则名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.givenType) {
                this.message = '赠送类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.startDate || !this.oForm.endDate) {
                this.message = '开卡规则有效期不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.status) {
                this.message = '状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oForm.givenType == 3) {
                if (!this.groupName) {
                    this.message = '所选券包不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.effectiveTimeType) {
                    this.message = '券包生效方式不能为空！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.effectiveTimeType == 1) {
                    if (!this.oForm.overDays && this.oForm.overDays != 0) {
                        this.message = '券包有效期天数不能为空！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oForm.overDays <= 0) {
                        this.message = '优惠券领取后有效期天数必须大于0，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                } else if (this.oForm.effectiveTimeType == 2) {
                    if (!this.oForm.startEffectDate || !this.oForm.endEffectDate) {
                        this.message = '券包有效期时间段不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
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
            jsonArr.push({ key: 'synchronizeRule', value: this.oForm.synchronizeRule });
            if (this.oForm.synchronizeRule == 1) {
                if (this.oForm.syncCinemaCode.length == 0) {
                    this.message = '请选择同步影院~';
                    this.open();
                    loading.close();
                    return;
                }
                jsonArr.push({ key: 'cinemaCodes', value: this.oForm.syncCinemaCode.join(',') });
            }
            jsonArr.push({ key: 'givenType', value: this.oForm.givenType });
            jsonArr.push({ key: 'effectiveTimeType', value: this.oForm.effectiveTimeType });
            if (this.oForm.effectiveTimeType == 1) {
                jsonArr.push({ key: 'overDays', value: this.oForm.overDays });
            }
            if (this.oForm.effectiveTimeType == 2) {
                jsonArr.push({ key: 'startEffectDate', value: this.oForm.startEffectDate });
                jsonArr.push({ key: 'endEffectDate', value: this.oForm.endEffectDate });
            }
            jsonArr.push({ key: 'ruleMemo', value: this.oForm.ruleMemo });
            jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
            jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
            jsonArr.push({ key: 'status', value: this.oForm.status });
            console.log(jsonArr);
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.adminFlag == 1 && this.oForm.synchronizeRule == 1) {
                this.$confirm('是否同步到所选影院？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        if (this.dialogFormVisible == true) {
                            https
                                .fetchPost('/openCardRule/addOpenCardRule', params)
                                .then(data => {
                                    loading.close();
                                    if (data.data.code == 'success') {
                                        this.dialogFormVisible = false;
                                        this.$message.success(`新增成功`);
                                        this.oForm.syncCinemaCode = [];
                                        this.checkAll = false;
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
                    })
                    .catch(() => {
                        loading.close();
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
            } else {
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/openCardRule/addOpenCardRule', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.dialogFormVisible = false;
                                this.$message.success(`新增成功`);
                                this.checkAll = false;
                                this.oForm.syncCinemaCode = [];
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
                    if (data.data.code == 'success') {
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        this.editVisible = true;
                        this.cardList = JSON.parse(Decrypt(data.data.data)).cardLevelList;
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.cinemaName;
                        this.oForm.cinemaCode = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.cinemaCode;
                        this.oSynchronizeRule = '2';
                        for (let x in JSON.parse(Decrypt(data.data.data)).cardLevelList) {
                            if (
                                JSON.parse(Decrypt(data.data.data)).cardLevelList[x].levelCode ==
                                JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.cardLevelCode
                            ) {
                                this.oCardLevelName = JSON.parse(Decrypt(data.data.data)).cardLevelList[x].levelCode;
                                break;
                            }
                        }
                        this.oRuleName = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.ruleName;
                        this.oOverDays = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.overDays;
                        this.oRechargeAmount = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.rechargeAmount;
                        this.groupName = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.couponGroupName;
                        this.couponId = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenCouponGroupId;
                        this.oStartEffectDate = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.startEffectDate;
                        this.oEndEffectDate = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.endEffectDate;
                        if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenMoney) {
                            this.oGivenMoney = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenMoney;
                        }
                        // if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenType == 1) {
                        //     this.oGivenType = '不赠送';
                        // }
                        // if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenType == 2) {
                        //     this.oGivenType = '赠送金额';
                        // }
                        // if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenType == 3) {
                        //     this.oGivenType = '赠送券包';
                        // }
                        // if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenType == 4) {
                        //     this.oGivenType = '两者都送';
                        // }
                        for (let i in this.type) {
                            //轮播图类型下拉框显示对应的选项
                            if (this.type[i].value == JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenType) {
                                this.oGivenType = this.type[i].value;
                                break;
                            }
                        }
                        if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.effectiveTimeType == 1) {
                            this.oEffectiveTimeType = 1;
                        }
                        if (JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.effectiveTimeType == 2) {
                            this.oEffectiveTimeType = 2;
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
            if (!this.oCinemaName) {
                this.message = '影院名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oCardLevelName) {
                this.message = '会员卡名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oRuleName) {
                this.message = '开卡规则名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oGivenType) {
                this.message = '赠送类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oStartDate || !this.oEndDate) {
                this.message = '开卡规则有效期不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oStartDate) {
                this.message = '状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oGivenType == '赠送券包') {
                if (!this.groupName) {
                    this.message = '所选券包不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oEffectiveTimeType == 1) {
                    if (!this.oOverDays && this.oOverDays != 0) {
                        this.message = '券包有效期天数不能为空！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oOverDays <= 0) {
                        this.message = '优惠券领取后有效期天数必须大于0，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                } else if (this.oEffectiveTimeType == 2) {
                    if (!this.oStartEffectDate || !this.oEndEffectDate) {
                        this.message = '券包有效期时间段不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
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
            jsonArr.push({ key: 'synchronizeRule', value: this.oSynchronizeRule });
            if (this.oSynchronizeRule == 1) {
                if (this.oSyncCinemaCode.length == 0) {
                    this.message = '请选择同步影院~';
                    this.open();
                    loading.close();
                    return;
                }
                jsonArr.push({ key: 'cinemaCodes', value: this.oSyncCinemaCode.join(',') });
            }
            jsonArr.push({ key: 'ruleName', value: this.oRuleName });
            jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
            jsonArr.push({ key: 'startDate', value: this.oStartDate });
            jsonArr.push({ key: 'endDate', value: this.oEndDate });
            jsonArr.push({ key: 'rechargeAmount', value: '0' });
            jsonArr.push({ key: 'ruleMemo', value: this.oRuleMemo });
            jsonArr.push({ key: 'effectiveTimeType', value: this.oEffectiveTimeType });
            if (this.oEffectiveTimeType == 1) {
                jsonArr.push({ key: 'overDays', value: this.oOverDays });
            }
            if (this.oEffectiveTimeType == 2) {
                jsonArr.push({ key: 'startEffectDate', value: this.oStartEffectDate });
                jsonArr.push({ key: 'endEffectDate', value: this.oEndEffectDate });
            }
            jsonArr.push({ key: 'cardLevelCode', value: this.oCardLevelName });
            // jsonArr.push({ key: 'cardLevelName', value: this.oCardLevelName });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            if (this.adminFlag == 1 && this.oSynchronizeRule == 1) {
                this.$confirm('是否同步到所选影院？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        https
                            .fetchPost('/openCardRule/modifyOpenCardRule', params)
                            .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.editVisible = false;
                                    this.$message.success(`编辑成功`);
                                    this.oSyncCinemaCode = [];
                                    this.checkAll = false;
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
                        loading.close();
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
            } else {
                https
                    .fetchPost('/openCardRule/modifyOpenCardRule', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.editVisible = false;
                            this.$message.success(`编辑成功`);
                            this.oSyncCinemaCode = [];
                            this.checkAll = false;
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
        },
        getCardInfo(e) {
            if (e) {
                this.oForm.synchronizeRule = '2';
                this.checkAll = false;
                this.oForm.syncCinemaCode = [];
            }
        },
        getCardInfo2(e) {
            if (e) {
                this.oSynchronizeRule = '2';
                this.checkAll = false;
                this.oSyncCinemaCode = [];
            }
        },

        // 获取同步影院
        chooseSync() {
            if (!this.oForm.levelName || this.oForm.levelName == '') {
                this.message = '请选择会员卡~';
                this.open();
                this.oForm.synchronizeRule = '2';
                return;
            }
            this.groupName = '';
            if (this.oForm.synchronizeRule == 1) {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                let jsonArr = [];
                jsonArr.push({ key: 'levelCode', value: this.oForm.levelName });
                jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/openCardRule/queryCinemaByLevel', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.syncCinemaList = oData;
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

        chooseSync2() {
            if (!this.oCardLevelName || this.oCardLevelName == '') {
                this.message = '请选择会员卡~';
                this.open();
                this.oForm.synchronizeRule = '2';
                return;
            }
            this.groupName = '';
            if (this.oSynchronizeRule == 1) {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                let jsonArr = [];
                jsonArr.push({ key: 'levelCode', value: this.oCardLevelName });
                jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/openCardRule/queryCinemaByLevel', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            this.syncCinemaList = oData;
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
        handleCheckAllChange(val) {
            let arr = [];
            for (let x in this.syncCinemaList) {
                arr.push(this.syncCinemaList[x].cinemaCode);
            }
            this.oForm.syncCinemaCode = val ? arr : [];
            this.groupName = '';
            this.isIndeterminate = false;
        },
        handleCheckAllChange2(val) {
            let arr = [];
            for (let x in this.syncCinemaList) {
                arr.push(this.syncCinemaList[x].cinemaCode);
            }
            this.oSyncCinemaCode = val ? arr : [];
            this.groupName = '';
            this.isIndeterminate = false;
        },
        getSyncCinemaCode(val) {
            this.oForm.syncCinemaCode = val;
            this.groupName = '';
            let checkedCount = val.length;
            this.checkAll = checkedCount === this.syncCinemaList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.syncCinemaList.length;
        },
        getSyncCinemaCode2(val) {
            this.oSyncCinemaCode = val;
            this.groupName = '';
            let checkedCount = val.length;
            this.checkAll = checkedCount === this.syncCinemaList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.syncCinemaList.length;
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
            let comboName = this.query.comboName;
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!status) {
                status = '';
            }
            if (!comboName) {
                comboName = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            jsonArr.push({ key: 'comboName', value: comboName });
            jsonArr.push({ key: 'status', value: status });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/ownMerchandiseSet/page', params)
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
        deletCoupon() {
            this.groupName = '';
            this.couponId = '';
        },
        // 搜索卖品
        SearchSell() {
            this.query.pageNo = 1;
            this.openNext(e);
        },
        // 所选卖品index
        getCurrentRow(index) {
            this.sellIndex = index;
        },
        // 确认卖品
        sureNext() {
            if (this.sellIndex >= 0) {
                // 选了数据
                for (let i = 0; i < this.comboList.length; i++) {
                    // 判断选择的是哪一个商品
                    if (this.comboList[i].id == this.comboItemId) {
                        // 如果已经选择过了商品
                        if (this.comboList[i].itemList.length > 0) {
                            for (let j = 0; j < this.comboList[i].itemList.length; j ++) {
                                if (this.comboList[i].itemList[j].code == this.sellTableData[this.sellIndex].merchandiseCode) {
                                    this.message = '不能添加相同卖品！';
                                    this.open();
                                    return;
                                }
                            }
                        } else {
                            this.comboList[i].itemList.push({
                                name: this.sellTableData[this.sellIndex].merchandiseName,
                                code: this.sellTableData[this.sellIndex].merchandiseCode,
                                count: 1
                            });
                        }
                    }
                }
            }
            this.drawer = false;
        },
        one(a) {
            //获取卖品绑定的value值
            this.oForm.filmCode = a;
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
        openNext(e) {
            //获取商品列表
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                if (e) {
                    this.comboItemId = e;
                }
                let jsonArr = [];
                let merchandiseName = this.query.merchandiseName;
                if (!merchandiseName) {
                    merchandiseName = '';
                }
                jsonArr.push({ key: 'merchandiseName', value: merchandiseName });
                jsonArr.push({ key: 'pageNo', value: this.query.aPageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.aPageSize });
                jsonArr.push({ key: 'merchandiseStatus', value: 1 });
                jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/merchandise/list', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.drawer = true;
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.query.merchandiseName = '';
                            this.sellTableData = oData.data;
                            this.query.aPageSize = oData.pageSize;
                            this.query.aPageNo = oData.pageNo;
                            this.query.aTotalCount = oData.totalCount;
                            this.query.aTotalPage = oData.totalPage;
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
        // 删除所选卖品
        deleteSell(index) {
            this.selectedSell.splice(index, 1);
        },
        //新增套餐选择卖品页面
        aHandleSizeChange(val) {
            this.query.aPageSize = val;
            this.openNext();
        },
        aCurrentChange(val) {
            //点击选择具体页数
            this.query.aPageNo = val;
            this.openNext();
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
        addComboGoods() {
            if (this.comboList.length > 4) {
                this.message = '套餐内最多五个商品~';
                this.open();
                return;
            } else {
                this.comboList.push({ name: '商品' + (this.comboList.length + 1), id: this.comboList.length + 1, itemList: [] });
            }
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
.addGoodsItem {
    width: 20px;
    height: 20px;
    color: #409eff;
    cursor: pointer;
}
</style>

