<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 员工管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" v-if="showSell">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="选择影院" class="handle-input mr10"></el-input>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="影院编码" width="110">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院名称" width="280">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="省份" width="110">
                    <template slot-scope="scope">{{scope.row.province}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="城市" width="110">
                    <template slot-scope="scope">{{scope.row.city}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="详细地址">
                    <template slot-scope="scope">{{scope.row.address}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="联系方式" width="150">
                    <template slot-scope="scope">{{scope.row.serviceMobile}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="show(scope.row)"
                        >查看员工详情</el-button>
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
        <div class="container" v-if="!showSell">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="输入员工姓名" class="handle-input mr10"></el-input>
                <el-input v-model="query.code" placeholder="输入员工编码" class="handle-input mr10"></el-input>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="searchEmployee">搜索</el-button>
                <el-button
                    type="primary"
                    @click="back"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >返回影院列表</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >新增员工</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="员工编码">
                    <template slot-scope="scope">{{scope.row.employeeCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="员工名称">
                    <template slot-scope="scope">{{scope.row.employeeName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="员工手机号">
                    <template slot-scope="scope">{{scope.row.employeeMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="推荐注册人数">
                    <template slot-scope="scope">{{scope.row.registerNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="推荐充值单数">
                    <template slot-scope="scope">{{scope.row.rechargeNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="推荐充值总金额">
                    <template slot-scope="scope">{{scope.row.rechargeMoney}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="二维码" width="150">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover" v-if="scope.row.qrCode">
                            <img style="width:400px" :src="scope.row.qrCode" />
                            <img
                                slot="reference"
                                :src="scope.row.qrCode"
                                :alt="scope.row.qrCode"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                        <el-button type="text" v-else @click="addCode(scope.row.id)">点击生成二维码</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
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
        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="员工名称：" :label-width="formLabelWidth" prop="cinemaName">
                    <el-input style="width: 150px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="员工手机号码：" :label-width="formLabelWidth" prop="cinemaName">
                    <el-input style="width: 150px" v-model="oForm.employeeMobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="详情" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="员工名称：" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        v-model="oName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="员工手机号码：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oEmployeeMobile" autocomplete="off"></el-input>
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
            oCinemaName: '',
            oName: '',
            oEmployeeMobile: '',
            oOverDays: '',
            oImageUrl: '',
            oType: '',
            oName: '',
            oSingleNumber: '',
            oGroupNumber: '',
            oId: '',
            oLimitStatus: '',
            oSingleLimitNumber: '',
            drawer: false,
            showSell: true, //卖品信息页面是否展示开关
            type: {
                type: ''
            },
            fileList: [],
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            restaurants: [],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            id: '',
            dialogFormVisible: false,
            options: [
                {
                    value: '1',
                    label: '优惠券'
                },
                {
                    value: '2',
                    label: '实物'
                }
            ],
            canUse: [
                {
                    value: '1',
                    label: '不限制'
                },
                {
                    value: '2',
                    label: '限制'
                }
            ],
            oForm: {
                name: '',
                employeeMobile: '',
                cinemaName: '',
                cinemaCode: '',
                image_url: '',
                singleNumber: '',
                overDays: '',
                limitStatus: '',
                groupNumber: '',
                singleLimitNumber: '',
                type: ''
            },
            sellTableData: [],
            formLabelWidth: '120px',
            selectValue: {},
            selectScreenCode: {},
            selectGroup: {},
            cinemaInfo: [],
            couponInfo: {},
            value: [],
            couponName: ''
        };
    },
    created() {
        this.showSell = true;
    },
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
                .fetchPost('/employee/addPage', '')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = true;
                        this.oForm.name = '';
                        this.oForm.employeeMobile = '';
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
            jsonArr.push({ key: 'employeeName', value: this.oForm.name });
            jsonArr.push({ key: 'employeeMobile', value: this.oForm.employeeMobile });
            jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/employee/addEmployee', params)
                    .then(data => {
                        loading.close();
                        //新增
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.show();
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
            this.$confirm('此操作将永久删除该员工数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
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
                        .fetchPost('/employee/deleteById', params)
                        .then(data => {
                            if (data.data.code == 'success') {
                                this.$message.error(`删除了`);
                                this.show();
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
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
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
            this.idx = index;
            this.form = row;
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('employee/updatePage', params)
                .then(data => {
                    loading.close();
                    console.log(data);
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.oName = JSON.parse(Decrypt(data.data.data)).employeeName;
                        this.oId = JSON.parse(Decrypt(data.data.data)).id;
                        this.oEmployeeMobile = JSON.parse(Decrypt(data.data.data)).employeeMobile;
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
        show(row) {
            this.showSell = false;
            //是否拥有权限
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let name = this.query.name;
            let code = this.query.code;
            if (!name) {
                name = '';
            }
            if (!code) {
                code = '';
            }
            if (row) {
                this.cinemaCode = row.cinemaCode;
            }
            var jsonArr = [];
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'name', value: this.query.name });
            jsonArr.push({ key: 'code', value: this.query.code });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/employee/employeePage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.tableData = oData.data;
                        // this.query.pageSize = oData.pageSize;
                        // this.query.pageNo = oData.pageNo;
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
            jsonArr.push({ key: 'employeeName', value: this.oName });
            jsonArr.push({ key: 'employeeMobile', value: this.oEmployeeMobile });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            this.editVisible = false;
            https
                .fetchPost('employee/updateEmployee', params)
                .then(data => {
                    loading.close();
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.$message.success(`编辑成功`);
                        this.show();
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
        // 修改状态
        changeStatus(index, row) {
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
            let status;
            if (row.status == 1) {
                status = 0;
            } else if (row.status == 0) {
                status = 1;
            }
            jsonArr.push({ key: 'id', value: row.id });
            jsonArr.push({ key: 'status', value: status });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('couponGroup/updateStatusById', params)
                .then(data => {
                    loading.close();
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.$message.success(`修改成功`);
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

        searchEmployee() {
            this.query.pageNo = 1;
            this.show();
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
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            jsonArr.push({ key: 'cinemaCode', value: name });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinema/myCinemaPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
                        this.tableData = oData.data;
                        // this.query.pageSize = oData.pageSize;
                        // this.query.pageNo = oData.pageNo;
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
        back() {
            this.showSell = true;
            this.getMenu();
        },

        // 生成二维码
        addCode(id) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let jsonArr = [];
            jsonArr.push({ key: 'id', value: id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/employee/getEmployeeCode', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.show();
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
        selectStatus(val) {
            this.selectValue = val;
        },
        selectDay(val) {
            // console.log(val)
            this.checkedDays = val.join(',');
        },
        // 获取所有影院
        getAllCinema() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            https
                .fetchPost('/cinema/getAllCinema', '')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let cinemas = JSON.parse(Decrypt(data.data.data));
                        for (let i = 0; i < cinemas.length; i++) {
                            let cinemaInfo = {};
                            cinemaInfo.label = cinemas[i].cinemaName;
                            cinemaInfo.value = cinemas[i].cinemaCode;
                            this.cinemaInfo.push(cinemaInfo);
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
        // 获取所有优惠券
        getAllCoupon() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let name = this.couponName;
            if (!name) {
                name = '';
            }
            let date = new Date();
            let today =
                date.getFullYear() +
                '-' +
                (date.getMonth() + 1) +
                '-' +
                date.getDate() +
                ' ' +
                date.getHours() +
                ':' +
                date.getMinutes() +
                ':' +
                date.getSeconds();
            let jsonArr = [];
            jsonArr.push({ key: 'simpleType', value: 1 });
            jsonArr.push({ key: 'name', value: name });
            jsonArr.push({ key: 'status', value: 1 });
            jsonArr.push({ key: 'cinemaCodes', value: this.cinemaCode });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('merchandiseCoupon/merchandiseCouponPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let oData = JSON.parse(Decrypt(data.data.data));
                        this.drawer = true;
                        this.sellTableData = oData.pageResult.data;
                        for (let i = 0; i < this.sellTableData.length; i++) {
                            this.$set(
                                this.sellTableData[i],
                                'imgUrl',
                                'http://xiangshan-wexin.oss-cn-hangzhou.aliyuncs.com/images/201909262039272.jpg'
                            );
                        }
                        // this.query.pageSize = oData.pageResult.pageSize;
                        // this.query.pageNo = oData.pageResult.pageNo;
                        this.query.totalCount = oData.pageResult.totalCount;
                        this.query.totalPage = oData.pageResult.totalPage;
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
        sureNext(id) {
            this.couponInfo.imgUrl = 'http://xiangshan-wexin.oss-cn-hangzhou.aliyuncs.com/images/201909262039272.jpg';
            for (let i = 0; i < this.sellTableData.length; i++) {
                if (this.sellTableData[i].id == this.couponInfo.id) {
                    this.couponInfo.couponName = this.sellTableData[i].name;
                }
            }
            this.drawer = false;
        },
        deletCoupon() {
            this.couponInfo = {};
        },
        handleSelect(item) {
            this.selectGroup = {};
            this.selectGroup = item;
        },
        beforeUpload() {
            //上传之前
            this.type.type = EncryptReplace('activity');
        },
        onSuccess(data) {
            //上传文件 登录超时
            console.log(data);
            this.oForm.image_url = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        unSuccess(data) {
            //修改上传文件 登录超时
            // console.log(data);
            this.form.image_url = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
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
