<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 卖品信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--影院信息展示页面-->
        <div class="container" v-if="showSell">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="角色名" class="handle-input mr10"></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="审核中" value="1"></el-option>
                    <el-option key="2" label="未审核" value="2"></el-option>
                    <el-option key="3" label="通过" value="3"></el-option>
                    <el-option key="4" label="审核失败" value="4"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="影院编码">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="省份">
                    <template slot-scope="scope">{{scope.row.province}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="城市">
                    <template slot-scope="scope">{{scope.row.city}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="详细地址">
                    <template slot-scope="scope">{{scope.row.address}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="联系方式" width="150">
                    <template slot-scope="scope">{{scope.row.serviceMobile}}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="UserPassword(scope.$index, scope.row)"
                        >同步卖品</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="show(scope.row)">编辑</el-button>
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
        <!--卖品信息展示页面-->
        <div class="container" v-if="!showSell">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="角色名" class="handle-input mr10"></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="审核中" value="1"></el-option>
                    <el-option key="2" label="未审核" value="2"></el-option>
                    <el-option key="3" label="通过" value="3"></el-option>
                    <el-option key="4" label="审核失败" value="4"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="back"
                    icon="el-icon-circle-plus-outline"
                    style="margin-left: 400px"
                >返回卖品列表</el-button>
            </div>
            <el-table
                :data="oTableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
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
                <el-table-column prop="name" label="商品名">
                    <template slot-scope="scope">{{scope.row.merchandiseName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="零售价">
                    <template slot-scope="scope">{{scope.row.standardPrice}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="结算价">
                    <template slot-scope="scope">{{scope.row.settlePrice}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="商品描述">
                    <template slot-scope="scope">{{scope.row.merchandiseDesc}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="展示顺序" width="150">
                    <template slot-scope="scope">{{scope.row.showSeqNo}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="分类" width="150">
                    <template slot-scope="scope">{{scope.row.typeName}}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
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
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="商品名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="form.name"
                        autocomplete="off"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商品图片" :label-width="formLabelWidth">
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        drag
                        action="/api/upload/uploadImage"
                        :on-success="unSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品描述" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="form.merchandiseDesc"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="零售价" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="form.standardPrice"
                        autocomplete="off"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="结算价" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="form.settlePrice"
                        autocomplete="off"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="展示顺序" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.showSeqNo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.stockCount" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类" :label-width="formLabelWidth">
                    <el-select v-model="form.typeCode" placeholder="请选择分类">
                        <el-option
                            v-for="item in selectValue"
                            :key="item.typeCode"
                            :label="item.typeName"
                            :value="item.typeCode"
                        ></el-option>
                    </el-select>
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
            selectValue: [],
            showSell: true, //卖品信息页面是否展示开关
            type: {
                type: ''
            },
            oName: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 10
            },
            tableData: [],
            oTableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            checkedCities: [],
            oCheckedCities: [],
            cities: [], //增加页面影院
            oCities: [], //修改页面影院
            pageTotal: 0,
            form: {
                memo: '',
                sort: '',
                id: ''
            },
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            selectValue: {},
            options: [
                {
                    value: '1',
                    label: '审核中'
                },
                {
                    value: '2',
                    label: '未审核'
                },
                {
                    value: '3',
                    label: '通过'
                },
                {
                    value: '4',
                    label: '审核失败'
                }
            ],
            showType: [
                {
                    value: '1',
                    label: '纯金币兑换'
                },
                {
                    value: '2',
                    label: '纯RMB兑换'
                },
                {
                    value: '3',
                    label: '金币 + RMB 兑换'
                }
            ],
            showStatus: [
                {
                    value: '1',
                    label: '上架'
                },
                {
                    value: '2',
                    label: '未上架'
                }
            ],
            commodityType: [
                {
                    value: '1',
                    label: '实物'
                },
                {
                    value: '2',
                    label: '优惠券'
                }
            ],
            assignType: [
                {
                    value: '0',
                    label: '不允许指定日期'
                },
                {
                    value: '1',
                    label: '指定日期'
                },
                {
                    value: '2',
                    label: '指定每月几号'
                },
                {
                    value: '3',
                    label: '指定每月第几周'
                },
                {
                    value: '4',
                    label: '指定每周几'
                }
            ],
            limitType: [
                {
                    value: '0',
                    label: '不限制'
                },
                {
                    value: '1',
                    label: '限制每年可兑换数量'
                },
                {
                    value: '2',
                    label: '限制每月可兑换数量'
                },
                {
                    value: '3',
                    label: '限制每周可兑换数量'
                }
            ],
            value: '',
            restaurants: [],
            state: '',
            timeout: null,
            selectFilm: {},
            filmInfo: []
        };
    },
    created() {
        this.showSell=true;
    },
    mounted() {
        this.getMenu();
    },
    methods: {
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
                        // jsonArr.push({key:"roleName",value:name});
                        // jsonArr.push({key:"status",value:status});
                        jsonArr.push({ key: 'id', value: row.id });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('goldCommodity/deleteById', params)
                            .then(data => {
                                loading.close();
                                // console.log(data);
                                // console.log(JSON.parse(Decrypt(data.data.data)));
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
                this.form = row;
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: row.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/merchandise/modifyPage', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            this.form.name = JSON.parse(Decrypt(data.data.data)).merchandise.merchandiseName;
                            this.form.imageUrl = JSON.parse(Decrypt(data.data.data)).merchandise.merchandisePic;
                            this.form.merchandiseDesc = JSON.parse(Decrypt(data.data.data)).merchandise.merchandiseDesc;
                            this.form.standardPrice = JSON.parse(Decrypt(data.data.data)).merchandise.standardPrice;
                            this.form.settlePrice = JSON.parse(Decrypt(data.data.data)).merchandise.settlePrice;
                            this.form.showSeqNo = JSON.parse(Decrypt(data.data.data)).merchandise.showSeqNo;
                            this.form.typeCode = JSON.parse(Decrypt(data.data.data)).merchandise.typeCode;
                            this.form.stockCount = JSON.parse(Decrypt(data.data.data)).merchandise.stockCount;
                            this.selectValue = JSON.parse(Decrypt(data.data.data)).merchandiseType;
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
            setTimeout(() => {
                if (!this.form.image_url) {
                    this.form.image_url = this.form.imageUrl;
                }
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: this.form.id });
                jsonArr.push({ key: 'showSeqNo', value: this.form.showSeqNo });
                jsonArr.push({ key: 'merchandiseDesc', value: this.form.merchandiseDesc });
                jsonArr.push({ key: 'stockCount', value: this.form.stockCount });
                jsonArr.push({ key: 'merchandisePic', value: this.form.image_url });
                jsonArr.push({ key: 'typeCode', value: this.form.typeCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                console.log(params);
                this.editVisible = false;
                https
                    .fetchPost('/merchandise/modify', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.$message.success(`编辑成功`);
                            this.refresh();
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
                let status = this.query.status;
                if (!name) {
                    name = '';
                }
                if (!status) {
                    status = '';
                }
                let jsonArr = [];
                // jsonArr.push({key:"roleName",value:name});
                // jsonArr.push({key:"status",value:status});
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/cinema//myCinemaPage', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
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
                loading.close();
            }, 500);
        },
        refresh() {
            //刷新卖品页面
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let name = this.query.name;
                let status = this.query.status;
                if (!name) {
                    name = '';
                }
                if (!status) {
                    status = '';
                }
                let jsonArr = [];
                // jsonArr.push({key:"roleName",value:name});
                // jsonArr.push({key:"status",value:status});
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/merchandise/list', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // // console.log(this.query);
                            this.oTableData = oData.data;
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
        show(row) {
            //获取卖品页面列表
            this.showSell = false;
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                this.cinemaCode = row.cinemaCode;
                let name = this.query.name;
                let status = this.query.status;
                if (!name) {
                    name = '';
                }
                if (!status) {
                    status = '';
                }
                let jsonArr = [];
                // jsonArr.push({key:"roleName",value:name});
                // jsonArr.push({key:"status",value:status});
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/merchandise/list', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // // console.log(this.query);
                            this.oTableData = oData.data;
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
        UserPassword(index, row) {
            //商品同步
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                this.cinemaCode = row.cinemaCode;
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/merchandise/queryMerchandise', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
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
        beforeUpload() {
            //上传之前
            this.type.type = EncryptReplace('business');
        },
        onSuccess(data) {
            //上传文件 登录超时
            // console.log(data);
            this.form.image_url = data.data;
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
        back() {
            this.showSell = true;
            this.getMenu();
        },
        open() {
            //错误信息弹出框
            this.$alert(this.message, '错误信息', {
                dangerouslyUseHTMLString: true
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

