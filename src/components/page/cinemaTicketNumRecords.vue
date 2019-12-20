<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影院购票充值
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.cinemaName" placeholder="影院名称" class="handle-input mr10"></el-input>
                <el-select
                    clearable
                    v-model="query.tradeType"
                    placeholder="请选择交易方式"
                    class="handle-input mr10"
                >
                    <el-option key="1" label="充值张数" value="1"></el-option>
                    <el-option key="2" label="购票扣除" value="2"></el-option>
                    <el-option key="3" label="退票返回" value="3"></el-option>
                    <el-option key="4" label="充值金额" value="4"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                        type="primary"
                        @click="addPrice"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px"
                >充值购票金额</el-button>
                <el-button
                        type="primary"
                        @click="addPage"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px"
                >充值购票张数</el-button>
            </div>
            <el-table
                    :data="tableData"
                    height="500"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="code" label="影院编码" width="150">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="code" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="code" label="交易方式" width="150">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.tradeType=='1'"
                        >主动充值</el-tag>
                        <el-tag v-else-if="scope.row.tradeType=='2'"
                        >购票扣除</el-tag>
                        <el-tag v-else-if="scope.row.tradeType=='3'"
                        >退票返回</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="code" label="支付方式" width="150">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.paymentType=='1'"
                        >按票收费</el-tag>
                        <el-tag v-else-if="scope.row.paymentType=='2'"
                        >包年</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="售票系统">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.tradeType=='1'"
                        >辰星</el-tag>
                        <el-tag v-else-if="scope.row.tradeType=='2'"
                        >电影1905</el-tag>
                        <el-tag v-else-if="scope.row.tradeType=='4'"
                        >满天星</el-tag>
                        <el-tag v-if="scope.row.tradeType=='8'"
                        >粤科</el-tag>
                        <el-tag v-else-if="scope.row.tradeType=='16'"
                        >云智</el-tag>
                        <el-tag v-else-if="scope.row.tradeType=='32'"
                        >火烈鸟</el-tag>
                        <el-tag v-else-if="scope.row.tradeType=='64'"
                        >鼎星</el-tag>
                        <el-tag v-else-if="scope.row.tradeType=='128'"
                        >vista</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="交易明细">
                    <template slot-scope="scope">{{scope.row.tradeDetail}}</template>
                </el-table-column>
                <el-table-column prop="name" label="订单号">
                    <template slot-scope="scope">{{scope.row.orderCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院出票总量">
                    <template slot-scope="scope">{{scope.row.totalSaleTicketNumber}}</template>
                </el-table-column>
                <el-table-column prop="name" label="第三方支付出票数">
                    <template slot-scope="scope">{{scope.row.thirdTicketNumber}}</template>
                </el-table-column>
                <el-table-column prop="name" label="会员卡支付出票数">
                    <template slot-scope="scope">{{scope.row.memberCardTicketNumber}}</template>
                </el-table-column>
                <el-table-column prop="name" label="交易张数">
                    <template slot-scope="scope">{{scope.row.tradeTicketNum}}</template>
                </el-table-column>
                <el-table-column prop="name" label="剩余张数">
                    <template slot-scope="scope">{{scope.row.remainTicketsNumber}}</template>
                </el-table-column>
                <el-table-column prop="name" label="剩余购票金额">
                    <template slot-scope="scope">{{scope.row.remainTicketPrice}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="交易时间" >
                    <template slot-scope="scope">{{scope.row.tradeTime}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="到期时间" >
                    <template slot-scope="scope">{{scope.row.expireDate}}</template>
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
        <el-dialog :close-on-click-modal="false" title="充值张数" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="选择影院：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.cinemaCode" placeholder="请选择">
                        <el-option
                                v-for="info in cinemaInfo"
                                :key="info.cinemaCode"
                                :value="info.cinemaCode"
                                :label="info.cinemaName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易张数：" :label-width="formLabelWidth">
                    <el-input style="width: 200px" min="1" v-model="oForm.tradeTicketNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="充值明细：" :label-width="formLabelWidth">
                    <el-input style="width: 200px" type="textarea" min="1" maxlength="200" show-word-limit v-model="oForm.tradeDetail" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增弹出框-->
        <el-dialog :close-on-click-modal="false" title="充值金额" :visible.sync="dialogFormVisible2">
            <el-form :model="pForm">
                <el-form-item label="选择影院：" :label-width="formLabelWidth">
                    <el-select v-model="pForm.cinemaCode" placeholder="请选择">
                        <el-option
                                v-for="info in cinemaInfo"
                                :key="info.cinemaCode"
                                :value="info.cinemaCode"
                                :label="info.cinemaName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易金额：" :label-width="formLabelWidth">
                    <el-input style="width: 200px" min="1" v-model="pForm.tradeTicketPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="充值明细：" :label-width="formLabelWidth">
                    <el-input style="width: 200px" type="textarea" min="1" maxlength="200" show-word-limit v-model="pForm.tradeDetail" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel2">取 消</el-button>
                <el-button type="primary" @click="addRole2">确 定</el-button>
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
                oActivityImageUrl:'',
                imgType: {
                    type: ''
                },
                oCinemaName: '',
                oCardLevelName: '',
                oRuleName: '', // 规则名称
                oRechargeAmount: '', // 充值金额
                oGivenType: '', // 赠送类型
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
                        value: '0',
                        label: '未启用'
                    }
                ],
                type: [
                    {
                        value: '1',
                        label: '注册送券'
                    },
                ],
                cinemaList:[],//影院列表
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
                dialogFormVisible2: false,
                oForm: {
                    cinemaName: '',
                    cinemaCode: '',
                    tradeTicketNum: '',
                    tradeDetail: '',
                },
                pForm: {
                    cinemaName: '',
                    cinemaCode: '',
                    tradeTicketPrice: '',
                    tradeDetail: '',
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
            this.getAllCinema();
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
                https.fetchPost('/cinemaTicketNumRecords/addPage', '')
                .then(data => {
                    loading.close();
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
            addPrice() {
                //获取新增按钮权限
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                https.fetchPost('/cinemaTicketNumRecords/addPage ', '')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.dialogFormVisible2 = true;
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
                var jsonArr = [];
                if (!this.oForm.cinemaCode) {
                    this.message = '请选择影院';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.tradeTicketNum) {
                    this.message = '请输入数量';
                    this.open();
                    loading.close();
                    return;
                }
                let cinemaName = ''
                for (let i = 0; i < this.cinemaInfo.length; i ++) {
                    if (this.cinemaInfo[i].cinemaCode == this.oForm.cinemaCode) {
                        cinemaName = this.cinemaInfo[i].cinemaName
                    }
                }
                jsonArr.push({ key: 'cinemaName', value:  cinemaName});
                jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
                jsonArr.push({ key: 'tradeDetail', value: this.oForm.tradeDetail });
                jsonArr.push({ key: 'tradeTicketNum', value: this.oForm.tradeTicketNum });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/cinemaTicketNumRecords/addCinemaTicketNumRecords', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.dialogFormVisible = false;
                                this.$message.success(`充值成功`);
                                this.oForm.cinemaCode = '';
                                this.oForm.tradeDetail = '';
                                this.oForm.tradeTicketNum = '';
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
            addRole2() {
                //新增按钮操作
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                var jsonArr = [];
                if (!this.pForm.cinemaCode) {
                    this.message = '请选择影院';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.pForm.tradeTicketPrice) {
                    this.message = '请输入金额';
                    this.open();
                    loading.close();
                    return;
                }
                let cinemaName = ''
                for (let i = 0; i < this.cinemaInfo.length; i ++) {
                    if (this.cinemaInfo[i].cinemaCode == this.pForm.cinemaCode) {
                        cinemaName = this.cinemaInfo[i].cinemaName
                    }
                }
                jsonArr.push({ key: 'cinemaName', value:  cinemaName});
                jsonArr.push({ key: 'cinemaCode', value: this.pForm.cinemaCode });
                jsonArr.push({ key: 'tradeDetail', value: this.pForm.tradeDetail });
                jsonArr.push({ key: 'tradeTicketPrice', value: this.pForm.tradeTicketPrice });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible2 == true) {
                    https
                        .fetchPost('/cinemaTicketNumRecords/updateRemainTicketPrice', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.dialogFormVisible2 = false;
                                this.$message.success(`充值成功`);
                                this.pForm.cinemaCode = '';
                                this.pForm.tradeDetail = '';
                                this.pForm.tradeTicketPrice = '';
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
            getMenu() {
                //获取菜单栏
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                let cinemaName = this.query.cinemaName;
                let tradeType = this.query.tradeType;
                if (!cinemaName) {
                    cinemaName = '';
                }
                if (!tradeType) {
                    tradeType = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaName', value: cinemaName });
                jsonArr.push({ key: 'tradeType', value: tradeType });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https.fetchPost('/cinemaTicketNumRecords/list', params).then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
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
                        this.oForm.tradeTicketNum = '';
                        this.oForm.tradeDetail = '';
                        this.oForm.cinemaName = '';
                        this.oForm.cinemaCode = '';
                        this.dialogFormVisible = false;
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
            },
            cancel2() {
                this.$confirm('该操作将清空页面数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.pForm.tradeTicketNum = '';
                        this.pForm.tradeDetail = '';
                        this.pForm.cinemaName = '';
                        this.pForm.cinemaCode = '';
                        this.dialogFormVisible2 = false;
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
                https.fetchPost('/cinema/getAllCinema').then(data => {
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

