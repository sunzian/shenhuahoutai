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
            <!--<div class="handle-box">-->
                <!--<el-select-->
                    <!--clearable-->
                    <!--v-model="query.cinemaCode"-->
                    <!--placeholder="请选择影院"-->
                    <!--class="handle-input mr10"-->
                <!--&gt;-->
                    <!--<el-option-->
                        <!--v-for="item in cinemaInfo"-->
                        <!--:key="item.cinemaCode"-->
                        <!--:label="item.cinemaName"-->
                        <!--:value="item.cinemaCode"-->
                    <!--&gt;</el-option>-->
                <!--</el-select>-->
                <!--<el-button style="margin-top: 10px;width: 90px;"  type="primary" icon="el-icon-search" @click="Search">搜索</el-button>-->
            <!--</div>-->
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
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
                <el-table-column label="操作" width="160" align="center" fixed="right">
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
        <!--卖品信息展示页面-->
        <div class="container" v-if="!showSell">
            <div class="handle-box">
                <el-input v-model="query.merchandiseName" placeholder="商品名称" class="handle-input mr10"></el-input>
                <el-select clearable v-model="query.merchandiseStatus" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="上架" value="1"></el-option>
                    <el-option key="2" label="下架" value="2"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="back"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
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
                <!--<el-table-column prop="sort" label="商品描述">-->
                    <!--<template slot-scope="scope">{{scope.row.merchandiseDesc}}</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="sort" label="展示顺序" width="150">
                    <template slot-scope="scope">{{scope.row.showSeqNo}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="分类" width="150">
                    <template slot-scope="scope">{{scope.row.typeName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态" width="150">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.merchandiseStatus=='1'" type="success">上架</el-tag>
                        <el-tag v-else-if="scope.row.merchandiseStatus=='2'" type="danger">下架</el-tag>
                    </template>
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
                        @size-change="oHandleSizeChange"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="query.pageNo"
                        :page-sizes="[10, 15, 20, 30]"
                        :page-size="query.pageSize"
                        :total="query.totalCount"
                        @current-change="oCurrentChange"
                        @prev-click="oPrev"
                        @next-click="oNext"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
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
                    <el-popover placement="right" title trigger="hover">
                        <img style="width:400px" :src="oImageUrl" />
                        <img
                            slot="reference"
                            :src="oImageUrl"
                            :alt="oImageUrl"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        drag
                        :limit="1"
                        :on-exceed="exceed"
                        ref="upload"
                        action="/api/upload/uploadImage"
                        :on-success="unSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过100kb 建议尺寸600*480或按比例上传</div>
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
                <!--<el-form-item label="库存" :label-width="formLabelWidth">-->
                    <!--<el-input style="width: 250px" v-model="form.stockCount" autocomplete="off" type="number"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item :required="true" label="状态" :label-width="formLabelWidth">
                    <el-select v-model="oMerchandiseStatus" placeholder="请选择状态">
                        <el-option
                                v-for="item in showStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
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
            oImageUrl: '',
            oMerchandiseStatus: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
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
            value: '',
            restaurants: [],
            state: '',
            timeout: null,
            selectFilm: {},
            filmInfo: [],
            cinemaInfo: []
        };
    },
    created() {
        this.showSell=true;
    },
    mounted() {
        this.getMenu();
        this.getAllCinema();
    },
    methods: {
        exceed(data){
            console.log(data);
            if(data.length==1){
                this.message = '只能上传一张图片，如需重新上传请删除第一张图！';
                this.open();
            }
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
                        this.form = row;
                        let jsonArr = [];
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
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            this.form.name = JSON.parse(Decrypt(data.data.data)).merchandise.merchandiseName;
                            this.oImageUrl = JSON.parse(Decrypt(data.data.data)).merchandise.merchandisePic;
                            this.form.merchandiseDesc = JSON.parse(Decrypt(data.data.data)).merchandise.merchandiseDesc;
                            this.form.standardPrice = JSON.parse(Decrypt(data.data.data)).merchandise.standardPrice;
                            this.form.settlePrice = JSON.parse(Decrypt(data.data.data)).merchandise.settlePrice;
                            this.form.showSeqNo = JSON.parse(Decrypt(data.data.data)).merchandise.showSeqNo;
                            this.form.typeCode = JSON.parse(Decrypt(data.data.data)).merchandise.typeCode;
                            this.form.stockCount = JSON.parse(Decrypt(data.data.data)).merchandise.stockCount;
                            this.selectValue = JSON.parse(Decrypt(data.data.data)).merchandiseType;
                            this.oMerchandiseStatus = JSON.parse(Decrypt(data.data.data)).merchandise.merchandiseStatus;
                            for (let x in this.showStatus) {
                                if (this.showStatus[x].value == JSON.parse(Decrypt(data.data.data)).merchandise.merchandiseStatus) {
                                    this.oMerchandiseStatus = this.showStatus[x].value;
                                    break;
                                }
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
                if(!this.oMerchandiseStatus){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: this.form.id });
                jsonArr.push({ key: 'showSeqNo', value: this.form.showSeqNo });
                jsonArr.push({ key: 'merchandiseDesc', value: this.form.merchandiseDesc });
                jsonArr.push({ key: 'stockCount', value: this.form.stockCount });
                jsonArr.push({ key: 'merchandisePic', value: this.oImageUrl });
                jsonArr.push({ key: 'typeCode', value: this.form.typeCode });
                jsonArr.push({ key: 'merchandiseStatus', value: this.oMerchandiseStatus });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                console.log(params);
                https
                    .fetchPost('/merchandise/modify', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = false;
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
            this.refresh();
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
                let jsonArr = [];
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/cinema/myCinemaPage', params)
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
                            cinemaInfo.cinemaName = cinemas[i].cinemaName;
                            cinemaInfo.cinemaCode = cinemas[i].cinemaCode;
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
                let merchandiseName = this.query.merchandiseName;
                let merchandiseStatus = this.query.merchandiseStatus;
                if (!merchandiseName) {
                    merchandiseName = '';
                }
                if (!merchandiseStatus) {
                    merchandiseStatus = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'merchandiseName', value: merchandiseName });
                jsonArr.push({ key: 'merchandiseStatus', value: merchandiseStatus });
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
                            this.$message.success(`同步成功`);
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
        beforeUpload(file) {
            //上传之前
            this.type.type = EncryptReplace('business');
            const isLt100Kb = file.size / 1024 < 100;
            if (!isLt100Kb) {
                this.message = '图片大小不能超过100kb！';
                this.open();
                return false
            }
            return isLt100Kb
        },
        onSuccess(data) {
            //上传文件 登录超时
            // console.log(data);
            this.oImageUrl = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        unSuccess(data) {
            //修改上传文件 登录超时
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.upload.clearFiles();
                return;
            }
            this.oImageUrl = data.data;
            if (data.code == 'nologin') {
                this.$refs.upload.clearFiles();
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
        oHandleSizeChange(val) {
            this.query.pageSize=val;
            this.refresh()
        },
        oCurrentChange(val) {
            //点击选择具体页数
            this.query.pageNo = val;
            this.refresh();
        },
        oPrev() {
            //分页按钮上一页
            this.query.pageNo--;
            this.refresh();
        },
        oNext() {
            //分页按钮下一页
            this.query.pageNo++;
            this.refresh();
        }
    }
};
</script>

<style>
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }
</style>

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

