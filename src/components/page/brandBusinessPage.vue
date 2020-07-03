<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 品牌商管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    clearable
                    v-model="query.commonType"
                    placeholder="通用方式"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="全部影院" value="1"></el-option>
                    <el-option key="2" label="部分影院" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.cinemaCodes"
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
                    <el-option key="2" label="停用" value="2"></el-option>
                </el-select>
                <el-input
                    placeholder="品牌商名称"
                    v-model="query.name"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    placeholder="品牌商电话"
                    v-model="query.mobile"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
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
                >新增</el-button>
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
                <el-table-column prop="sort" label="适用影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column label="品牌商名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="是否显示" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'">启用</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">停用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="品牌商电话">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="品牌商地址">
                    <template slot-scope="scope">{{scope.row.address }}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
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
        <el-dialog :close-on-click-modal="false" title="新增合作商家" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="通用方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.commonType">
                        <el-radio label="2">指定影院</el-radio>
                        <el-radio label="1">全部影院</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="oForm.commonType==2" :required="true" label="适用影院" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="oForm.cinemaCodes" @change="changeCinema">
                        <el-checkbox
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaCode"
                            :value="item.cinemaCode"
                        >{{item.cinemaName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="品牌商名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        maxlength="30"
                        v-model="oForm.name"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="品牌商电话" :label-width="formLabelWidth" :required="true">
                    <el-input
                        style="width: 250px"
                        maxlength="30"
                        v-model="oForm.mobile"
                        autocomplete="off"
                        type="number"
                        onkeyup="this.value=this.value.replace(/[^0-9-]+/,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="品牌商地址" :label-width="formLabelWidth" :required="true">
                    <el-input
                        style="width: 250px"
                        maxlength="30"
                        v-model="oForm.address"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="状态" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="选择是否启用">
                        <el-option
                            v-for="item in showStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="品牌商描述" :label-width="formLabelWidth">
                    <el-input
                            style="width: 300px"
                            type="textarea"
                            maxlength="200"
                            :rows="5"
                            show-word-limit
                            v-model="oForm.memo"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="changeForm">
                <el-form-item :required="true" label="通用方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="changeForm.commonType">
                        <el-radio label="2">指定影院</el-radio>
                        <el-radio label="1">全部影院</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="changeForm.commonType==2" label="适用影院" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="changeForm.cinemaCodes" @change="changeCinema2">
                        <el-checkbox
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaCode"
                            :value="item.cinemaCode"
                        >{{item.cinemaName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="品牌商名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        maxlength="30"
                        v-model="changeForm.name"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="品牌商电话" :label-width="formLabelWidth" :required="true">
                    <el-input
                        style="width: 250px"
                        maxlength="30"
                        v-model="changeForm.mobile"
                        autocomplete="off"
                        type="number"
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="品牌商地址" :label-width="formLabelWidth" :required="true">
                    <el-input
                        style="width: 250px"
                        maxlength="200"
                        v-model="changeForm.address"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="状态" :label-width="formLabelWidth">
                    <el-select v-model="changeForm.status" placeholder="选择是否启用">
                        <el-option
                            v-for="item in showStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="商户描述" :label-width="formLabelWidth">
                    <el-input
                            style="width: 300px"
                            type="textarea"
                            maxlength="200"
                            :rows="5"
                            show-word-limit
                            v-model="changeForm.memo"
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
            oBannerType: '',
            oTabType: '',
            type: {
                type: ''
            },
            imageUrl: '',
            changeStartTime: '',
            changeEndTime: '',
            startTime: '',
            endTime: '',
            oName: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                aPageNo: 1,
                aPageSize: 15
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            cinemaList: [], //适用影院编码
            editVisible: false,
            drawer: false,
            drawer1: false,
            drawer2: false,
            pageTotal: 0,
            changeForm: {
                commonType: '',
                name: '',
                memo: '',
                mobile: '',
                address: '',
                status: '',
                cinemaCodes: [],
                id: ''
            },
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            oForm: {
                commonType: '1',
                name: '',
                mobile: '',
                address: '',
                memo: '',
                status: '',
                cinemaCodes: []
            },
            formLabelWidth: '120px',
            selectValue: {},
            cinemaInfo: [],
            options: [
                {
                    value: '1',
                    label: '全部影院'
                },
                {
                    value: '2',
                    label: '部分影院'
                }
            ],
            showStatus: [
                {
                    value: '1',
                    label: '启用'
                },
                {
                    value: '2',
                    label: '停用'
                }
            ],
            businessOptiones: [],
            value: '',
            goType: '',
            goldData: [],
            selectedSell: [],
            sellIndex: ''
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
            setTimeout(() => {
                https
                    .fetchPost('/brandBusiness/addPage', '')
                    .then(data => {
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
            }, 500);
        },
        cancelAdd() {
            this.dialogFormVisible = false
            this.oForm.cinemaCodes = [];
            this.oForm.status = '';
            this.oForm.name = '';
            this.oForm.mobile = '';
            this.oForm.address = '';
            this.oForm.memo = '';
            this.oForm.commonType = '1'
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
            if (this.oForm.commonType == '2' && this.oForm.cinemaCodes.length == 0) {
                this.message = '所选影院不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oForm.name == '') {
                this.message = '品牌商名称不能为空！';
                this.open();
                loading.close();
                return;
            }
            if (this.oForm.mobile == '') {
                this.message = '品牌商电话不能为空！';
                this.open();
                loading.close();
                return;
            }
            if (this.oForm.address == '') {
                this.message = '品牌商地址不能为空！';
                this.open();
                loading.close();
                return;
            }
            if (this.oForm.status == '') {
                this.message = '状态不能为空！';
                this.open();
                loading.close();
                return;
            }
            if (this.oForm.memo == '') {
                this.message = '品牌商描述不能为空！';
                this.open();
                loading.close();
                return;
            }
            setTimeout(() => {
                var jsonArr = [];
                jsonArr.push({ key: 'commonType', value: this.oForm.commonType });
                if (this.oForm.commonType == '2') {
                    let cinemaCodes = this.oForm.cinemaCodes.join(",");
                    jsonArr.push({ key: 'cinemaCodes', value: cinemaCodes });
                }
                jsonArr.push({ key: 'status', value: this.oForm.status });;
                jsonArr.push({ key: 'name', value: this.oForm.name });
                jsonArr.push({ key: 'mobile', value: this.oForm.mobile });
                jsonArr.push({ key: 'address', value: this.oForm.address });
                jsonArr.push({ key: 'memo', value: this.oForm.memo });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/brandBusiness/add', params)
                        .then(data => {
                            //新增
                            loading.close();
                            if (data.data.code == 'success') {
                                this.dialogFormVisible = false;
                                this.$message.success(`新增成功`);
                                this.oForm.cinemaCodes = [];
                                this.oForm.status = '';
                                this.oForm.mobile = '';
                                this.oForm.name = '';
                                this.oForm.address = '';
                                this.oForm.memo = '';
                                this.oForm.commonType = '1'
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
            }, 500);
        },
        delChange(index, row) {
            //删除数据
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
                        this.idx = index;
                        this.changeForm = row;
                        let jsonArr = [];
                        jsonArr.push({ key: 'id', value: row.id });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/brandBusiness/deleteById', params)
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
                    }, 500);
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
            setTimeout(() => {
                this.idx = index;
                // this.changeForm = row;
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: row.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/brandBusiness/updatePage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            let index = 0; //是否显示下拉选显示对应的选项
                            for (let i in this.showStatus) {
                                if (this.options[i].value == JSON.parse(Decrypt(data.data.data)).status) {
                                    index = i;
                                    break;
                                }
                            }
                            this.changeForm.status = this.showStatus[index].value;
                            this.changeForm.commonType = JSON.parse(Decrypt(data.data.data)).commonType.toString();
                            if (this.changeForm.commonType == '2') {
                                this.changeForm.cinemaCodes = JSON.parse(Decrypt(data.data.data)).cinemaCodes.split(",");
                            }
                            this.changeForm.name = JSON.parse(Decrypt(data.data.data)).name;
                            this.changeForm.mobile = JSON.parse(Decrypt(data.data.data)).mobile;
                            this.changeForm.address = JSON.parse(Decrypt(data.data.data)).address;
                            this.changeForm.memo = JSON.parse(Decrypt(data.data.data)).memo;
                            this.changeForm.id = JSON.parse(Decrypt(data.data.data)).id;
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
        // 编辑操作
        exChanger() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if (this.changeForm.commonType == '2' && this.changeForm.cinemaCodes.length == 0) {
                this.message = '所选影院不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.changeForm.name == '') {
                this.message = '品牌商名称不能为空！';
                this.open();
                loading.close();
                return;
            }
            if (this.changeForm.mobile == '') {
                this.message = '品牌商电话不能为空！';
                this.open();
                loading.close();
                return;
            }
            if (this.changeForm.address == '') {
                this.message = '品牌商地址不能为空！';
                this.open();
                loading.close();
                return;
            }
            if (this.changeForm.memo == '') {
                this.message = '品牌商描述不能为空！';
                this.open();
                loading.close();
                return;
            }
            if (this.changeForm.status == '') {
                this.message = '状态不能为空！';
                this.open();
                loading.close();
                return;
            }
            setTimeout(() => {
                var jsonArr = [];
                jsonArr.push({ key: 'commonType', value: this.changeForm.commonType });
                if (this.changeForm.commonType == '2') {
                    let cinemaCodes = this.changeForm.cinemaCodes.join(",");
                    jsonArr.push({ key: 'cinemaCodes', value: cinemaCodes });
                }
                jsonArr.push({ key: 'name', value: this.changeForm.name });
                jsonArr.push({ key: 'status', value: this.changeForm.status });
                jsonArr.push({ key: 'mobile', value: this.changeForm.mobile });
                jsonArr.push({ key: 'address', value: this.changeForm.address });
                jsonArr.push({ key: 'memo', value: this.changeForm.memo });
                jsonArr.push({ key: 'id', value: this.changeForm.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/brandBusiness/updateById', params)
                    .then(data => {
                        loading.close();
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
            }, 500);
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
                let name = this.query.name;
                let cinemaCodes = this.query.cinemaCodes;
                let commonType = this.query.commonType;
                let mobile = this.query.mobile;
                let status = this.query.status;
                if (!name) {
                    name = '';
                }
                if (!commonType) {
                    commonType = '';
                }
                if (!cinemaCodes) {
                    cinemaCodes = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!status) {
                    status = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'commonType', value: commonType });
                jsonArr.push({ key: 'cinemaCodes', value: cinemaCodes });
                jsonArr.push({ key: 'name', value: name });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr)
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/brandBusiness/page', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData)
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
            }, 500);
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        changeCinema(val) {
            this.oForm.cinemaCodes = val;
        },
        changeCinema2(val) {
            this.changeForm.cinemaCodes = val;
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
        aHandleSizeChange(val) {
            this.query.aPageSize=val;
            this.openNext()
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

