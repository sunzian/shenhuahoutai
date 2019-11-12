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
                <el-input v-model="query.name" placeholder="影院名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                        type="primary"
                        @click="addPage"
                        icon="el-icon-circle-plus-outline"
                        style="margin-left: 650px"
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
                <el-table-column prop="code" label="影院编码">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="code" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="code" label="交易方式">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.tradeType=='1'"
                        >主动充值</el-tag>
                        <el-tag v-else-if="scope.row.tradeType=='2'"
                        >购票扣除</el-tag>
                        <el-tag v-else-if="scope.row.tradeType=='3'"
                        >退票返回</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="交易明细">
                    <template slot-scope="scope">{{scope.row.tradeDetail}}</template>
                </el-table-column>
                <el-table-column prop="name" label="订单号">
                    <template slot-scope="scope">{{scope.row.orderCode}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="交易时间" >
                    <template slot-scope="scope">{{scope.row.tradeTime}}</template>
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
        <el-dialog title="设置活动" :visible.sync="dialogFormVisible">
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
                <el-form-item label="充值张数：" :label-width="formLabelWidth">
                    <el-input style="width: 200px" min="1" v-model="oForm.tradeTicketNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="充值明细：" :label-width="formLabelWidth">
                    <el-input style="width: 200px" type="textarea" min="1" v-model="oForm.tradeDetail" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
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
                    pageSize: 10
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
                oForm: {
                    cinemaName: '',
                    cinemaCode: '',
                    tradeTicketNum: '',
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
                    return;
                }
                if (!this.oForm.tradeTicketNum) {
                    this.message = '请输入数量';
                    this.open();
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
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/cinemaTicketNumRecords/addCinemaTicketNumRecords', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.dialogFormVisible = false;
                                this.$message.success(`新增成功`);
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
                // jsonArr.push({ key: 'cinemaName', value: name });
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
                            console.log(this.tableData);
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

