<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 三方比价
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
                <el-select clearable v-model="query.screenName" placeholder="请选择影厅" @change="chooseScreen" class="mr10">
                    <el-option
                        v-for="item in screenInfo"
                        :key="item.screenCode"
                        :label="item.screenName"
                        :value="item.screenName"
                    ></el-option>
                </el-select>
                <el-select clearable v-model="query.typeCode" placeholder="请选择平台" class="mr10">
                    <el-option
                        v-for="item in typeInfo"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-input v-model="query.filmName" placeholder="影片名称" class="handle-input mr10"></el-input>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <!-- <el-button
                    type="primary"
                    @click="thirdPrice"
                    style="float: right;margin-top: 10px"
                    icon="el-icon-circle-plus-outline"
                >批量修改</el-button> -->
                <el-button
                    type="primary"
                    @click="updatePage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >同步第三方价格</el-button>
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
                <el-table-column prop="code" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="time" label="影厅名称">
                    <template slot-scope="scope">{{scope.row.screenName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影片名称">
                    <template slot-scope="scope">{{scope.row.filmName}}</template>
                </el-table-column>
                <el-table-column prop="number" label="平台名称" width="110">
                    <template slot-scope="scope">{{scope.row.typeName}}</template>
                </el-table-column>
                <el-table-column prop="time" label="放映时间">
                    <template slot-scope="scope">{{scope.row.showTime}}</template>
                </el-table-column>
                <el-table-column prop="number" label="第三方售价" width="140">
                    <template slot-scope="scope">{{scope.row.settlePrice}}</template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="140" align="center" fixed="right">
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
        <!--新增弹出框-->
        <el-dialog :close-on-click-modal="false" title="获取排期" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="影院名称">
                    <el-select v-model="oForm.cinemaName" placeholder="请选择">
                        <el-option
                            v-for="info in cinemaInfo"
                            :key="info.cinemaCode"
                            :value="info.cinemaName"
                            :label="info.cinemaName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="影厅名称">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oForm.filmName"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="影片名称">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oForm.filmName"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="平台名称">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oForm.filmName"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="放映时间">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oForm.filmName"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="第三方售价">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oForm.filmName"
                        autocomplete="off"
                        disabled
                    ></el-input>
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
                <el-form-item label="影厅名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oScreenName"
                        autocomplete="off"
                        disabled
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
                <el-form-item label="平台名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oTypeName"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="放映时间" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oShowTime"
                        disabled
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="第三方售价" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oSettlePrice"
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
                <el-form-item label="第三方售价金额" :label-width="formLabelWidth">
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
            manySettlePrice: '',
            selectIdList: [],
            selectCodeList: [],
            selectId: '',
            oCinemaName: '',
            selectCodes: '',
            oCinemaCode: '',
            oScreenName: '',
            oFilmCode: '',
            oFilmName: '',
            oTypeName: '',
            oShowTime: '',
            oSettlePrice: '',
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
            cinemaInfo: [],
            screenInfo: [],
            typeInfo: [
                {
                    value: '猫眼',
                    id: 36
                },
                {
                    value: '百度糯米',
                    id: 46
                },
                {
                    value: '淘票票',
                    id: 49
                }
            ],
            form: [],
            formOne: [],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            drawer: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            oForm: {
                cinemaName: '',
                screenName: '',
                filmName: '',
                typeName: '',
                showTime: '',
                settlePrice: '',
                id: ''
            },
            formLabelWidth: '160px',
            selectValue: {},
            selectCode: {},
            value: '',
            businessInfo: []
        };
    },
    created() {},
    mounted() {
        this.getAllBusiness();
    },
    methods: {
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
                    .fetchPost('/thirdPrice/updateThirdPricePage', '')
                    .then(data => {
                        loading.close();
                        // console.log(data);
                        if (data.data.code == 'success') {
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
            jsonArr.push({ key: 'settlePrice', value: this.manySettlePrice });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.drawer == true) {
                https
                    .fetchPost('/thirdPrice/updateThirdPriceBatch', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.$message.success(`修改成功`);
                            this.selectIdList = [];
                            this.selectId = '';
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
                .fetchPost('/thirdPrice/updateThirdPrice', '')
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
                .fetchDelete('/thirdPrice/deleteThirdPrice', params)
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
                .fetchPost('/thirdPrice/getThirdPriceById', params)
                .then(data => {
                    loading.close();
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).cinemaName;
                        this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).cinemaCode;
                        this.oScreenName = JSON.parse(Decrypt(data.data.data)).screenName;
                        this.oFilmName = JSON.parse(Decrypt(data.data.data)).filmName;
                        this.oTypeName = JSON.parse(Decrypt(data.data.data)).typeName;
                        this.oShowTime = JSON.parse(Decrypt(data.data.data)).showTime;
                        this.oSettlePrice = JSON.parse(Decrypt(data.data.data)).settlePrice;
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
            jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode });
            jsonArr.push({ key: 'settlePrice', value: this.oSettlePrice });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            console.log(jsonArr);
            https
                .fetchPost('/thirdPrice/updateThirdPrice', params)
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
            let screenName = this.query.screenName;
            let typeCode = this.query.typeCode;
            let filmName = this.query.filmName;
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!businessCode) {
                businessCode = '';
            }
            if (!screenName) {
                screenName = '';
            }
            if (!typeCode) {
                typeCode = '';
            }
            if (!filmName) {
                filmName = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'businessCode', value: businessCode });
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            jsonArr.push({ key: 'screenName', value: screenName });
            jsonArr.push({ key: 'dataType', value: typeCode });
            jsonArr.push({ key: 'filmName', value: filmName });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/admin/thirdPrice/thirdPricePage', params)
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
                        } else {
                            this.tableData = []
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
        updatePage() {
            this.$confirm('同步时间可能较长，确定同步第三方价格数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let businessCode = this.query.businessCode;
                    if (!businessCode) {
                        this.message = '请选择商家！';
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
                    jsonArr.push({ key: 'businessCode', value: businessCode });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/admin/thirdPrice/synchronizedThirdPrice', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.$message({
                                    type: 'success',
                                    message: '同步成功!'
                                });
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
            this.query.screenName = '';
            this.$forceUpdate();
            this.query.cinemaCode = val;
            this.getAllScreen(val);
        },
        chooseScreen() {
            this.$forceUpdate();
            this.query.screenName = val;
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
                        console.log(res);
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

