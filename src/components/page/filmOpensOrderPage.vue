<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 点映订单
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.cinemaCode" placeholder="请选择影院" class="mr10">
                    <el-option
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input
                        placeholder="用户手机号"
                        v-model="query.userMobile"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-input
                        placeholder="推荐人手机号"
                        v-model="query.shareUserMobile"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-input
                        placeholder="订单编号"
                        v-model="query.orderNo"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-input
                        placeholder="电影名称"
                        v-model="query.filmName"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-input
                        placeholder="点映名称"
                        v-model="query.filmOpensName"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-select
                        clearable
                        v-model="query.payStatus"
                        placeholder="支付状态"
                        class="handle-select mr10"
                >
                    <el-option key="0" label="未支付" value="0"></el-option>
                    <el-option key="1" label="支付成功" value="1"></el-option>
                    <el-option key="2" label="支付失败" value="2"></el-option>
                    <el-option key="3" label="退款成功" value="3"></el-option>
                </el-select>
                <el-date-picker
                        v-model="query.sessionStartDate"
                        type="datetime"
                        class="mr10"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="放映开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                        v-model="query.sessionEndDate"
                        type="datetime"
                        class="mr10"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="放映结束时间（止）"
                ></el-date-picker>
                <el-date-picker
                        v-model="query.payStartDate"
                        type="datetime"
                        class="mr10"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="支付开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                        v-model="query.payEndDate"
                        type="datetime"
                        class="mr10"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="支付结束时间（止）"
                ></el-date-picker>
                <el-button
                        type="primary"
                        icon="el-icon-search"
                        style="margin-top: 10px;width: 90px;"
                        @click="Search"
                >搜索</el-button>
                <el-button
                        type="primary"
                        @click="derive"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px"
                >导出</el-button>
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
                <el-table-column prop="name" label="影院名称" width="220">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column label="订单编号" width="150">
                    <template slot-scope="scope">{{scope.row.orderNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="电影名称" width="150">
                    <template slot-scope="scope">{{scope.row.filmName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="放映时间" width="160">
                    <template slot-scope="scope">{{scope.row.sessionTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="用户手机号" width="115">
                    <template slot-scope="scope">{{scope.row.userMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="推荐人手机号" width="115">
                    <template slot-scope="scope">{{scope.row.shareUserMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="购买数量" width="95">
                    <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="订单总原价" width="95">
                    <template slot-scope="scope">{{scope.row.totalOriginalPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="订单总实付价" width="130">
                    <template slot-scope="scope">{{scope.row.totalActualPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付时间" width="160">
                    <template slot-scope="scope">{{scope.row.payTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付状态" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.payStatus=='0'" type="danger">未支付</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='1'" type="success">支付成功</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='2'" type="danger">支付失败</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='3'" type="success">退款成功</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="160">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-setting"
                                @click="addChange(scope.$index, scope.row)"
                        >查看详情</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                v-if="scope.row.payStatus=='1'"
                                @click="refundGoods(scope.$index, scope.row)"
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
                <el-form-item label="订单编号" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.orderNo"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影院名称" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.cinemaName"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影厅名称" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.screenName"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="电影名称" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.filmName"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="放映时间" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.sessionTime"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="用户电话号码" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.userMobile"
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
                <el-form-item label="订单总原价" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.totalOriginalPrice"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="订单总实付价" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.totalActualPrice"
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
                            v-model="form.totalRefundPrice"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="退款原因" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            type="textarea"
                            :rows="4"
                            v-model="form.refundReason"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
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
                    pageSize: 15
                },
                editVisible: false,
                pageTotal: 0,
                idx: -1,
                id: -1,
                formLabelWidth: '120px',
                businessInfoList: [],
                value: '',
                form: [],
                cinemaInfo: []
            };
        },
        created() {},
        mounted() {
            this.getMenu();
        },
        methods: {
            // 退款
            refundGoods(index, row) {
                this.$confirm('此操作将退款, 是否继续?', '提示', {
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
                        setTimeout(() => {
                            var jsonArr = [];
                            jsonArr.push({ key: 'id', value: row.id });
                            let sign = md5(preSign(jsonArr));
                            jsonArr.push({ key: 'sign', value: sign });
                            let params = ParamsAppend(jsonArr);
                            https
                                .fetchPost('/filmOpensOrder/filmOpensOrderRefund', params)
                                .then(data => {
                                    loading.close();
                                    if (data.data.code == 'success') {
                                        this.message = '退款成功！';
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
                        }, 500);
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消退款'
                        });
                    });
            },
            derive(){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let cinemaCode = this.query.cinemaCode;
                    let orderNo = this.query.orderNo;
                    let userMobile = this.query.userMobile;
                    let filmName = this.query.filmName;
                    let filmOpensName = this.query.filmOpensName;
                    let payStatus = this.query.payStatus;
                    let sessionStartDate = this.query.sessionStartDate;
                    let sessionEndDate = this.query.sessionEndDate;
                    let payStartDate = this.query.payStartDate;
                    let payEndDate = this.query.payEndDate;
                    if (!orderNo) {
                        orderNo = '';
                    }
                    if (!userMobile) {
                        userMobile = '';
                    }
                    if (!cinemaCode) {
                        cinemaCode = '';
                    }
                    if (!filmName) {
                        filmName = '';
                    }
                    if (!filmOpensName) {
                        filmOpensName = '';
                    }
                    if (!payStatus) {
                        payStatus = '';
                    }
                    if (!sessionStartDate) {
                        sessionStartDate = '';
                    }
                    if (!sessionEndDate) {
                        sessionEndDate = '';
                    }
                    if (!payStartDate) {
                        payStartDate = '';
                    }
                    if (!payEndDate) {
                        payEndDate = '';
                    }
                    let jsonArr = [];
                    jsonArr.push({ key: 'tableName', value: "film_opens_order" });
                    jsonArr.push({ key: 'exportKeysJson', value: "['cinemaName',  'screenName', 'filmName', 'filmOpensName', 'sessionTime', 'orderNo', 'userMobile', 'number','totalOriginalPrice', 'totalActualPrice', 'payStatusText', 'payTime', 'refundReason', 'refundTime', 'totalRefundPrice']"});
                    jsonArr.push({ key: 'exportTitlesJson', value:"['影院名称', '影厅名称', '电影名称', '点映名称', '放映时间', '订单编号', '用户手机号', '购买数量', '订单总原价', '订单总实付价','支付状态', '支付时间', '退款原因', '退款时间', '退款金额']" });
                    jsonArr.push({ key: 'orderNo', value: orderNo });
                    jsonArr.push({ key: 'userMobile', value: userMobile });
                    jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                    jsonArr.push({ key: 'filmName', value: filmName });
                    jsonArr.push({ key: 'filmOpensName', value: filmOpensName });
                    jsonArr.push({ key: 'payStatus', value: payStatus });
                    jsonArr.push({ key: 'sessionStartDate', value: sessionStartDate });
                    jsonArr.push({ key: 'sessionEndDate', value: sessionEndDate });
                    jsonArr.push({ key: 'payStartDate', value: payStartDate });
                    jsonArr.push({ key: 'payEndDate', value: payEndDate });
                    var params = ParamsAppend(jsonArr);
                    console.log(jsonArr);
                    let myObj = {
                        method: 'get',
                        url: '/exportExcel/exportFilmOpensOrder',
                        fileName: '点映订单统计',
                        params: params
                    };
                    https.exportMethod(myObj);
                    loading.close();
                }, 1500);
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
                        .fetchPost('/filmOpensOrder/getOrderDetail', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.editVisible = true;
                                this.form.id = row.id;
                                this.form = JSON.parse(Decrypt(data.data.data));
                                console.log(JSON.parse(Decrypt(data.data.data)));
                                if (JSON.parse(Decrypt(data.data.data)).payStatus == 0) {
                                    this.form.payStatus = '未支付';
                                } else if (JSON.parse(Decrypt(data.data.data)).payStatus == 1) {
                                    this.form.payStatus = '支付成功';
                                } else if (JSON.parse(Decrypt(data.data.data)).payStatus == 2) {
                                    this.form.payStatus = '支付失败';
                                } else if (JSON.parse(Decrypt(data.data.data)).payStatus == 3) {
                                    this.form.payStatus = '退款成功';
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
            // 获取所有影院
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
                    let cinemaCode = this.query.cinemaCode;
                    let orderNo = this.query.orderNo;
                    let userMobile = this.query.userMobile;
                    let filmName = this.query.filmName;
                    let filmOpensName = this.query.filmOpensName;
                    let payStatus = this.query.payStatus;
                    let sessionStartDate = this.query.sessionStartDate;
                    let sessionEndDate = this.query.sessionEndDate;
                    let payStartDate = this.query.payStartDate;
                    let payEndDate = this.query.payEndDate;
                    let shareUserMobile = this.query.shareUserMobile;
                    if (!shareUserMobile) {
                        shareUserMobile = '';
                    }
                    if (!orderNo) {
                        orderNo = '';
                    }
                    if (!userMobile) {
                        userMobile = '';
                    }
                    if (!cinemaCode) {
                        cinemaCode = '';
                    }
                    if (!filmName) {
                        filmName = '';
                    }
                    if (!filmOpensName) {
                        filmOpensName = '';
                    }
                    if (!payStatus) {
                        payStatus = '';
                    }
                    if (!sessionStartDate) {
                        sessionStartDate = '';
                    }
                    if (!sessionEndDate) {
                        sessionEndDate = '';
                    }
                    if (!payStartDate) {
                        payStartDate = '';
                    }
                    if (!payEndDate) {
                        payEndDate = '';
                    }
                    let jsonArr = [];
                    jsonArr.push({ key: 'orderNo', value: orderNo });
                    jsonArr.push({ key: 'userMobile', value: userMobile });
                    jsonArr.push({ key: 'shareUserMobile', value: shareUserMobile });
                    jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                    jsonArr.push({ key: 'filmName', value: filmName });
                    jsonArr.push({ key: 'filmOpensName', value: filmOpensName });
                    jsonArr.push({ key: 'payStatus', value: payStatus });
                    jsonArr.push({ key: 'sessionStartDate', value: sessionStartDate });
                    jsonArr.push({ key: 'sessionEndDate', value: sessionEndDate });
                    jsonArr.push({ key: 'payStartDate', value: payStartDate });
                    jsonArr.push({ key: 'payEndDate', value: payEndDate });
                    jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                    jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/filmOpensOrder/filmOpensOrderPage', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.getAllCinema();
                                var oData = JSON.parse(Decrypt(data.data.data));
                                console.log(oData);
                                this.tableData = oData.data;
                                this.totalData = oData;
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
                }, 500);
            },
            open() {
                //信息提示弹出框
                this.$alert(this.message, '信息提示', {
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
    .red {
        color: #ff0000;
    }
    .mr10 {
        width: 16%;
        margin-right: 10px;
    }
</style>

