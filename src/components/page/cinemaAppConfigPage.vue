<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 扫码领券管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box" style="margin-bottom: 60px;">
                <!-- <el-select
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
                </el-select> -->
                <!-- <el-input v-model="query.name" placeholder="活动名称" class="handle-input mr10"></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="不启用" value="1"></el-option>
                    <el-option key="2" label="启用" value="2"></el-option>
                    <el-option key="3" label="过期" value="3"></el-option>
                </el-select>
                <el-button
                    style="margin-top: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="Search"
                >搜索</el-button> -->
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
                <el-table-column prop="code" label="app启动页类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.startPageType=='1'">图片</el-tag>
                        <el-tag v-else-if="scope.row.startPageType=='2'">视频</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="code" label="app启动页路径">
                    <template slot-scope="scope">{{scope.row.startPageUrl }}</template>
                </el-table-column>
                <el-table-column prop="sort" label="启动页时长">
                    <template slot-scope="scope">{{scope.row.startPageDuration }}</template>
                </el-table-column>
                <el-table-column prop="name" label="启动页跳转类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.redirectType=='1'">不跳转</el-tag>
                        <el-tag v-else-if="scope.row.redirectType=='2'">跳转到文章</el-tag>
                        <el-tag v-else-if="scope.row.redirectType=='3'">跳转到电影</el-tag>
                        <el-tag v-else-if="scope.row.redirectType=='4'">金币商品</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="支付宝appId">
                    <template slot-scope="scope">{{scope.row.aliAppId}}</template>
                </el-table-column>
                <el-table-column prop="name" label="微信appId">
                    <template slot-scope="scope">{{scope.row.wechatAppId}}</template>
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
        <el-dialog :close-on-click-modal="false" title="新增" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="app启动页类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.startPageType">
                        <el-radio label="1">图片</el-radio>
                        <el-radio label="2">视频</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="app启动页路径 (图片/视频路径) " :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            drag
                            ref="upload"
                            :limit="1"
                            action="api/upload/uploadCert"
                            :on-success="setCert1"
                            multiple
                            list-type="picture"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="启动页时长(倒计时) 秒 " :label-width="formLabelWidth">
                    <el-input
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                        v-model="oForm.startPageDuration"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="启动页跳转类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.redirectType">
                        <el-radio label="1">不跳转</el-radio>
                        <el-radio label="2">跳转到文章</el-radio>
                        <el-radio label="3">跳转到电影</el-radio>
                        <el-radio label="4">金币商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="oForm.redirectType!=1" :required="true" label="跳转路径" :label-width="formLabelWidth">
                    <el-input
                        v-model="oForm.redirectGoal"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="支付宝appId" :label-width="formLabelWidth">
                    <el-input
                        v-model="oForm.aliAppId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="支付宝appSecret" :label-width="formLabelWidth">
                    <el-input
                        :rows="5"
                        min="1"
                        type="password"
                        v-model="oForm.aliAppSecret"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="支付宝公钥" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        v-model="oForm.aliPublicKey"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="支付宝私钥" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        v-model="oForm.aliPrivateKey"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="微信appId" :label-width="formLabelWidth">
                    <el-input
                        v-model="oForm.wechatAppId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="微信appSecret" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        v-model="oForm.wechatAppSecret"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="微信商户号" :label-width="formLabelWidth">
                    <el-input
                        v-model="oForm.wechatMchId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="微信支付密钥" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        v-model="oForm.wechatPaySecret"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="微信退款证书地址" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            drag
                            ref="upload"
                            :limit="1"
                            action="api/upload/uploadCert"
                            :on-success="setCert2"
                            multiple
                            list-type="picture"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="editVisible">
            <el-form :model="eForm">
                <el-form-item :required="true" label="app启动页类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="eForm.startPageType">
                        <el-radio label="1">图片</el-radio>
                        <el-radio label="2">视频</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="app启动页路径 (图片/视频路径) " :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            ref="download"
                            :limit="1"
                            action="api/upload/uploadCert"
                            :on-success="downCert1"
                            multiple
                            list-type="picture"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="启动页时长(倒计时) 秒 " :label-width="formLabelWidth">
                    <el-input
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                        v-model="eForm.startPageDuration"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="启动页跳转类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="eForm.redirectType">
                        <el-radio label="1">不跳转</el-radio>
                        <el-radio label="2">跳转到文章</el-radio>
                        <el-radio label="3">跳转到电影</el-radio>
                        <el-radio label="4">金币商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="eForm.redirectType!=1" :required="true" label="跳转路径" :label-width="formLabelWidth">
                    <el-input
                        v-model="oForm.redirectGoal"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="支付宝appId" :label-width="formLabelWidth">
                    <el-input
                        v-model="eForm.aliAppId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="支付宝appSecret" :label-width="formLabelWidth">
                    <el-input
                        :rows="5"
                        min="1"
                        type="password"
                        v-model="eForm.aliAppSecret"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="支付宝公钥" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        v-model="eForm.aliPublicKey"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="支付宝私钥" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        v-model="eForm.aliPrivateKey"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="微信appId" :label-width="formLabelWidth">
                    <el-input
                        v-model="eForm.wechatAppId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="微信appSecret" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        v-model="eForm.wechatAppSecret"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="微信商户号" :label-width="formLabelWidth">
                    <el-input
                        v-model="eForm.wechatMchId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="微信支付密钥" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        v-model="eForm.wechatPaySecret"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="微信退款证书地址" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            ref="download"
                            :limit="1"
                            action="api/upload/uploadCert"
                            :on-success="downCert2"
                            multiple
                            list-type="picture"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            <em>点击上传</em>
                        </div>
                    </el-upload>
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
            selectedSell: [],
            sellTableData: [],
            groupName: '',
            drawer: false,
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                aPageNo: 1,
                aPageSize: 15,
                name: ''
            },
            options: [
                {
                    value: '2',
                    label: '启用'
                },
                {
                    value: '1',
                    label: '未启用'
                },
                {
                    value: '3',
                    label: '已过期',
                    disabled: true
                }
            ],
            cinemaList: [], //影院列表
            cinemaInfo: [],
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
                startPageType: '1',
                startPageUrl: '',
                startPageDuration: '',
                redirectType: '1',
                redirectGoal: '',
                aliAppId: '',
                aliAppSecret: '',
                aliPublicKey: '',
                aliPrivateKey: '',
                wechatAppId: '',
                wechatAppSecret: '',
                wechatMchId: '',
                wechatPaySecret: '',
                refundCertificateUrl: ''
            },
            eForm: {
                startPageType: '',
                startPageUrl: '',
                startPageDuration: '',
                redirectType: '',
                redirectGoal: '',
                aliAppId: '',
                aliAppSecret: '',
                aliPublicKey: '',
                aliPrivateKey: '',
                wechatAppId: '',
                wechatAppSecret: '',
                wechatMchId: '',
                wechatPaySecret: '',
                refundCertificateUrl: '',
                id: ''
            },
            formLabelWidth: '180px',
            couponName: '',
            value: ''
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        setCert1(data) {
            this.oForm.startPageUrl = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        setCert2(data) {
            this.oForm.refundCertificateUrl = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        downCert1(data) {
            this.eForm.startPageUrl = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        downCert2(data) {
            this.eForm.refundCertificateUrl = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
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
                .fetchPost('/cinemaAppConfig/addPage', '')
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
        },
        addRole() {
            if (this.oForm.startPageUrl == '') {
                this.message = '请填写启动页路径';
                this.open();
                return;
            }
            if (this.oForm.startPageDuration == '') {
                this.message = '请填写启动页时长';
                this.open();
                return;
            }
            if (this.oForm.redirectType != 1) {
                if (this.oForm.redirectGoal = '') {
                    this.message = '请填写跳转路径';
                    this.open();
                    return;
                }
            }
            if (this.oForm.aliAppId == '') {
                this.message = '请填写支付宝appId';
                this.open();
                return;
            }
            if (this.oForm.aliAppSecret == '') {
                this.message = '请填写支付宝appSecret';
                this.open();
                return;
            }
            if (this.oForm.aliPublicKey == '') {
                this.message = '请填写支付宝公钥';
                this.open();
                return;
            }
            if (this.oForm.aliPrivateKey == '') {
                this.message = '请填写支付宝私钥';
                this.open();
                return;
            }
            if (this.oForm.wechatAppId == '') {
                this.message = '请填写微信appId';
                this.open();
                return;
            }
            if (this.oForm.wechatAppSecret == '') {
                this.message = '请填写微信appSecret';
                this.open();
                return;
            }
            if (this.oForm.wechatMchId == '') {
                this.message = '请填写微信商户号';
                this.open();
                return;
            }
            if (this.oForm.wechatPaySecret == '') {
                this.message = '请填写微信支付密钥';
                this.open();
                return;
            }
            if (this.oForm.refundCertificateUrl == '') {
                this.message = '请填写微信退款证书地址';
                this.open();
                return;
            }
            //新增按钮操作
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            jsonArr.push({ key: 'startPageType', value: this.oForm.startPageType });
            jsonArr.push({ key: 'startPageUrl', value: this.oForm.startPageUrl });
            jsonArr.push({ key: 'startPageDuration', value: this.oForm.startPageDuration });
            jsonArr.push({ key: 'redirectType', value: this.oForm.redirectType });
            if (this.oForm.redirectType != 1) {
                jsonArr.push({ key: 'redirectGoal', value: this.oForm.redirectGoal });
            }
            jsonArr.push({ key: 'aliAppId', value: this.oForm.aliAppId });
            jsonArr.push({ key: 'aliAppSecret', value: this.oForm.aliAppSecret });
            jsonArr.push({ key: 'aliPublicKey', value: this.oForm.aliPublicKey });
            jsonArr.push({ key: 'aliPrivateKey', value: this.oForm.aliPrivateKey });
            jsonArr.push({ key: 'wechatAppId', value: this.oForm.wechatAppId });
            jsonArr.push({ key: 'wechatAppSecret', value: this.oForm.wechatAppSecret });
            jsonArr.push({ key: 'wechatMchId', value: this.oForm.wechatMchId });
            jsonArr.push({ key: 'wechatPaySecret', value: this.oForm.wechatPaySecret });
            jsonArr.push({ key: 'refundCertificateUrl', value: this.oForm.refundCertificateUrl });
            console.log(jsonArr);
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/cinemaAppConfig/add', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.$refs.upload.clearFiles();//清除已上传文件
                            this.oForm.startPageType = '1';
                            this.oForm.startPageUrl = '';
                            this.oForm.startPageDuration = '';
                            this.oForm.redirectType = '1';
                            this.oForm.redirectGoal = '';
                            this.oForm.aliAppId = '';
                            this.oForm.aliAppSecret = '';
                            this.oForm.aliPublicKey = '';
                            this.oForm.aliPrivateKey = '';
                            this.oForm.wechatAppId = '';
                            this.oForm.wechatAppSecret = '';
                            this.oForm.wechatMchId = '';
                            this.oForm.wechatPaySecret = '';
                            this.oForm.refundCertificateUrl = '';
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
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
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
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
                        .fetchDelete('/cinemaAppConfig/deleteById', params)
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
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinemaAppConfig/updatePage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        this.eForm.startPageType = JSON.parse(Decrypt(data.data.data)).startPageType.toString();
                        this.eForm.startPageUrl = JSON.parse(Decrypt(data.data.data)).startPageUrl;
                        this.eForm.startPageDuration = JSON.parse(Decrypt(data.data.data)).startPageDuration;
                        this.eForm.redirectType = JSON.parse(Decrypt(data.data.data)).redirectType.toString();
                        this.eForm.redirectGoal = JSON.parse(Decrypt(data.data.data)).redirectGoal;
                        this.eForm.aliAppId = JSON.parse(Decrypt(data.data.data)).aliAppId;
                        this.eForm.aliAppSecret = JSON.parse(Decrypt(data.data.data)).aliAppSecret;
                        this.eForm.aliPublicKey = JSON.parse(Decrypt(data.data.data)).aliPublicKey;
                        this.eForm.aliPrivateKey = JSON.parse(Decrypt(data.data.data)).aliPrivateKey;
                        this.eForm.wechatAppId = JSON.parse(Decrypt(data.data.data)).wechatAppId;
                        this.eForm.wechatAppSecret = JSON.parse(Decrypt(data.data.data)).wechatAppSecret;
                        this.eForm.wechatMchId = JSON.parse(Decrypt(data.data.data)).wechatMchId;
                        this.eForm.wechatPaySecret = JSON.parse(Decrypt(data.data.data)).wechatPaySecret;
                        this.eForm.refundCertificateUrl = JSON.parse(Decrypt(data.data.data)).refundCertificateUrl;
                        this.eForm.id = JSON.parse(Decrypt(data.data.data)).id;
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
        // 编辑操作
        exChanger() {
            if (this.eForm.startPageUrl == '') {
                this.message = '请填写启动页路径';
                this.open();
                return;
            }
            if (this.eForm.startPageDuration == '') {
                this.message = '请填写启动页时长';
                this.open();
                return;
            }
            if (this.eForm.redirectType != 1) {
                if (this.eForm.redirectGoal = '') {
                    this.message = '请填写跳转路径';
                    this.open();
                    return;
                }
            }
            if (this.eForm.aliAppId == '') {
                this.message = '请填写支付宝appId';
                this.open();
                return;
            }
            if (this.eForm.aliAppSecret == '') {
                this.message = '请填写支付宝appSecret';
                this.open();
                return;
            }
            if (this.eForm.aliPublicKey == '') {
                this.message = '请填写支付宝公钥';
                this.open();
                return;
            }
            if (this.eForm.aliPrivateKey == '') {
                this.message = '请填写支付宝私钥';
                this.open();
                return;
            }
            if (this.eForm.wechatAppId == '') {
                this.message = '请填写微信appId';
                this.open();
                return;
            }
            if (this.eForm.wechatAppSecret == '') {
                this.message = '请填写微信appSecret';
                this.open();
                return;
            }
            if (this.eForm.wechatMchId == '') {
                this.message = '请填写微信商户号';
                this.open();
                return;
            }
            if (this.eForm.wechatPaySecret == '') {
                this.message = '请填写微信支付密钥';
                this.open();
                return;
            }
            if (this.eForm.refundCertificateUrl == '') {
                this.message = '请填写微信退款证书地址';
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
            var jsonArr = [];
            jsonArr.push({ key: 'startPageType', value: this.eForm.startPageType });
            jsonArr.push({ key: 'startPageUrl', value: this.eForm.startPageUrl });
            jsonArr.push({ key: 'startPageDuration', value: this.eForm.startPageDuration });
            jsonArr.push({ key: 'redirectType', value: this.eForm.redirectType });
            if (this.eForm.redirectType != 1) {
                jsonArr.push({ key: 'redirectGoal', value: this.eForm.redirectGoal });
            }
            jsonArr.push({ key: 'aliAppId', value: this.eForm.aliAppId });
            jsonArr.push({ key: 'aliAppSecret', value: this.eForm.aliAppSecret });
            jsonArr.push({ key: 'aliPublicKey', value: this.eForm.aliPublicKey });
            jsonArr.push({ key: 'aliPrivateKey', value: this.eForm.aliPrivateKey });
            jsonArr.push({ key: 'wechatAppId', value: this.eForm.wechatAppId });
            jsonArr.push({ key: 'wechatAppSecret', value: this.eForm.wechatAppSecret });
            jsonArr.push({ key: 'wechatMchId', value: this.eForm.wechatMchId });
            jsonArr.push({ key: 'wechatPaySecret', value: this.eForm.wechatPaySecret });
            jsonArr.push({ key: 'refundCertificateUrl', value: this.eForm.refundCertificateUrl });
            jsonArr.push({ key: 'id', value: this.eForm.id });
            console.log(jsonArr);
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinemaAppConfig/updateById', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = false;
                        this.$refs.download.clearFiles();//清除已上传文件
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
            let cinemaCode = this.query.cinemaCode;
            let name = this.query.name;
            let status = this.query.status;
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!name) {
                name = '';
            }
            if (!status) {
                status = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            jsonArr.push({ key: 'name', value: name });
            jsonArr.push({ key: 'status', value: status });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinemaAppConfig/page', params)
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
        currentChange(val) {
            //点击选择具体页数
            this.query.pageNo = val;
            this.getMenu();
        },
        handleSizeChange(val) {
            this.query.pageSize = val;
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
</style>

