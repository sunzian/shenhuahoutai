<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 会员卡等级管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--影院信息展示页面-->
        <div class="container" v-if="showSell">
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="影院编码" width="120">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院名称" width="280">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="省份" width="120">
                    <template slot-scope="scope">{{scope.row.province}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="城市" width="120">
                    <template slot-scope="scope">{{scope.row.city}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="联系方式" width="150">
                    <template slot-scope="scope">{{scope.row.serviceMobile}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="详细地址">
                    <template slot-scope="scope">{{scope.row.address}}</template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-setting"
                                @click="UserPassword(scope.$index, scope.row)"
                        >获取卡等级</el-button>
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
        <!--卡等级信息展示页面-->
        <div class="container" v-if="!showSell">
            <div class="handle-box">
                <el-input v-model="query.levelName" placeholder="会员卡名称" class="handle-input mr10"></el-input>
                <el-select
                        clearable
                        v-model="query.status"
                        placeholder="状态"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="正常" value="1"></el-option>
                    <el-option key="2" label="禁用" value="2"></el-option>
                </el-select>
                <el-button  style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                        type="primary"
                        @click="back"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;"
                >返回卡等级管理</el-button>
            </div>
            <el-table
                    :data="oTableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="会员卡名称">
                    <template slot-scope="scope">{{scope.row.levelName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="会员卡图片" width="200px">
                    <template slot-scope="scope">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="hover">
                            <img style="width: 400px" :src="scope.row.cardPicture"/>
                            <img slot="reference" :src="scope.row.cardPicture" :alt="scope.row.cardPicture" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="开卡工本费">
                    <template slot-scope="scope">{{scope.row.cardCostFee}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="会员卡会费" width="150">
                    <template slot-scope="scope">{{scope.row.memberFee}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态"  align="center" width="150">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
                        <el-tag v-else-if="scope.row.status == 2" type="danger">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="success"
                                v-if="scope.row.status == 2"
                                @click="changeStatus(scope.$index, scope.row)"
                        >启用</el-button>
                        <el-button
                                type="success"
                                v-if="scope.row.status == 1"
                                @click="changeStatus(scope.$index, scope.row)"
                        >停用</el-button>
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
                        @current-change="oCurrentChange"
                        @prev-click="oPrev"
                        @next-click="oNext"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="会员卡名称" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.name"
                            autocomplete="off"
                            :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会员卡图片" :label-width="formLabelWidth">
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            drag
                            ref="download"
                            action="/api/upload/uploadImage"
                            :on-success="unSuccess"
                            multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过300kb 建议670*420</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="工本费" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.standardPrice"
                            autocomplete="off"
                            :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会费" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.settlePrice"
                            autocomplete="off"
                            :disabled="true"
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
                selectValue: [],
                showSell: true, //卖品信息页面是否展示开关
                type: {
                    type: ''
                },
                oName: '',
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
                options: [
                    {
                        value: '1',
                        label: '正常'
                    },
                    {
                        value: '2',
                        label: '禁用'
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
                    status = 2;
                } else if (row.status == 2) {
                    status = 1;
                }
                jsonArr.push({ key: 'id', value: row.id });
                jsonArr.push({ key: 'status', value: status });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/memberCardLevel/modifyCardStatus', params).then(data => {
                    loading.close();
                    console.log(data);
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.$message.success(`修改成功`);
                        this.$refs.download.clearFiles();//清除已上传文件
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
                    https.fetchPost('/memberCardLevel/modifyPage', params).then(data => {
                            loading.close();
                            console.log(data);
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            if (data.data.code == 'success') {
                                this.editVisible = true;
                                this.form.name = JSON.parse(Decrypt(data.data.data)).levelName;
                                this.form.imageUrl = JSON.parse(Decrypt(data.data.data)).cardPicture;
                                this.form.standardPrice = JSON.parse(Decrypt(data.data.data)).cardCostFee;
                                this.form.settlePrice = JSON.parse(Decrypt(data.data.data)).memberFee;
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
                    jsonArr.push({ key: 'cardPicture', value: this.form.image_url });
                    jsonArr.push({ key: 'openRuleCode', value: '' });
                    jsonArr.push({ key: 'rechargeRuleCode', value: ''});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    console.log(jsonArr);
                    let params = ParamsAppend(jsonArr);
                    console.log(params);
                    this.editVisible = false;
                    https.fetchPost('/memberCardLevel/modify', params).then(data => {
                            loading.close();
                            console.log(data);
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
                }, 500);
            },
            Search() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let levelName = this.query.levelName;
                    let status = this.query.status;
                    if (!levelName) {
                        levelName = '';
                    }
                    if (!status) {
                        status = '';
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"levelName",value:levelName});
                    jsonArr.push({key:"status",value:status});
                    jsonArr.push({ key: 'pageNo', value: '1' });
                    jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/memberCardLevel/list', params).then(data => {
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
                    let levelName = this.query.levelName;
                    let status = this.query.status;
                    if (!levelName) {
                        levelName = '';
                    }
                    if (!status) {
                        status = '';
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"levelName",value:levelName});
                    jsonArr.push({key:"status",value:status});
                    jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                    jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/cinema/myCinemaPage', params).then(data => {
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
                    let jsonArr = [];
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
                //获取卡等级页面列表
                this.showSell = false;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    if(row&&row.cinemaCode){
                        this.cinemaCode = row.cinemaCode;
                    }
                    let jsonArr = [];
                    jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                    jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                    jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/memberCardLevel/list', params)
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
                //获取卡等级
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
                        .fetchPost('/memberCardLevel/queryCardLevel', params)
                        .then(data => {
                            loading.close();
                            console.log(data);
                            if (data.data.code == 'success') {
                                this.$message.success(`获取成功`);
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
            beforeUpload() {
                //上传之前
                this.type.type = EncryptReplace('card');
            },
            unSuccess(data) {
                if (data.status == '-1') {
                    this.message=data.message;
                    this.open();
                    this.$refs.download.clearFiles();
                    return
                }
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
            },
            oCurrentChange(val) {
                //点击选择具体页数
                this.query.pageNo = val;
                this.show();
            },
            oPrev() {
                //分页按钮上一页
                this.query.pageNo--;
                this.show();
            },
            oNext() {
                //分页按钮下一页
                this.query.pageNo++;
                this.show();
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
