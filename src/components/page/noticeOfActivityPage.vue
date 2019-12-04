<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 轮播图文章管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" v-if="showSell">
            <div class="handle-box">
                <el-select
                    v-model="query.name"
                    clearable
                    placeholder="选择影院"
                    class="handle-input mr10"
                >
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
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
                <el-table-column prop="name" label="影院编码" width="140">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="省份" width="140">
                    <template slot-scope="scope">{{scope.row.province}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="城市" width="140">
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
                        >查看文章列表</el-button>
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
                <el-input v-model="query.title" placeholder="标题名称" class="handle-input mr10"></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="未上线" value="1"></el-option>
                    <el-option key="2" label="上线" value="2"></el-option>
                </el-select>
                <el-button  style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="searchNotice">搜索</el-button>
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
                >新增</el-button>
            </div>
            <el-table
                :data="oTableData"
                border
                height="400"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="标题">
                    <template slot-scope="scope">{{scope.row.title}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="发布时间">
                    <template slot-scope="scope">{{scope.row.publishDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="封面图片" width="200">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width: 400px" :src="scope.row.imageUrl" />
                            <img
                                slot="reference"
                                :src="scope.row.imageUrl"
                                :alt="scope.row.imageUrl"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="上线状态" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'">未上线</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">上线</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="点击量" width="160">
                    <template slot-scope="scope">{{scope.row.viewNum}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="点赞数量" width="130">
                    <template slot-scope="scope">{{scope.row.upvoteNum}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.$index, scope.row)"
                        >修改</el-button>
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
        <el-dialog :close-on-click-modal="false" title="新增文章" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="标题" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        maxlength="30"
                        v-model="oForm.title"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="概述" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        type="textarea"
                        show-word-limit
                        maxlength="150"
                        v-model="oForm.summary"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="封面图片" :label-width="formLabelWidth">
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        drag
                        :limit="1"
                        ref="download"
                        action="/api/upload/uploadImage"
                        :on-success="onSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div
                            class="el-upload__tip"
                            slot="tip"
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸750*360或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="内容" :label-width="formLabelWidth">
                    <quill-editor
                        ref="text"
                        v-model="oForm.content"
                        class="myQuillEditor"
                        :options="editorOption"
                    />
                </el-form-item>
                <el-form-item :required="true" label="上线状态" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.status">
                        <el-radio label="1">未上线</el-radio>
                        <el-radio label="2">上线</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
            <el-form>
                <el-form-item :required="true" label="标题" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        maxlength="30"
                        v-model="oTitle"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="概述" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        type="textarea"
                        show-word-limit
                        maxlength="150"
                        v-model="oSummary"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="封面图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img :src="oImageUrl" />
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
                        <div
                            class="el-upload__tip"
                            slot="tip"
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸750*360或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="内容" :label-width="formLabelWidth">
                    <quill-editor
                        ref="text"
                        v-model="oContent"
                        class="myQuillEditor"
                        :options="editorOption"
                    />
                </el-form-item>
                <el-form-item :required="true" label="上线状态" :label-width="formLabelWidth">
                    <el-radio-group v-model="oStatus">
                        <el-radio :label="1">未上线</el-radio>
                        <el-radio :label="2">上线</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="发布时间" :label-width="formLabelWidth">
                    <el-input style="width: 250px" :disabled="true" v-model="oPublishDate"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';
import { fetchData } from '../../api/index';
import { Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend } from '@/aes/utils';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import md5 from 'js-md5';
import axios from 'axios';
import https from '../../https';
export default {
    name: 'basetable',
    data() {
        return {
            oBannerType: '',
            oTitle: '',
            oCinemaCode: '',
            oSummary: '',
            oImageUrl: '',
            oContent: '',
            oStatus: '',
            oPublishDate: '',
            type: {
                type: ''
            },
            imageUrl: '',
            editorOption: {},
            changeStartTime: '',
            showSell: true,
            changeEndTime: '',
            startTime: '',
            endTime: '',
            oName: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            cinemaInfo: [],
            tableData: [],
            oTableData: [],
            multipleSelection: [],
            delList: [],
            cinemaList: [], //适用影院编码
            editVisible: false,
            pageTotal: 0,
            form: {
                bannerLevel: '',
                sort: '',
                id: ''
            },
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            oForm: {
                name: '',
                memo: '',
                sort: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
                value: '',
                statusValue: '',
                cinemaCode: ''
            },
            formLabelWidth: '120px',
            selectValue: {},
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
            lineStatus: [
                {
                    value: '1',
                    label: '未上线'
                },
                {
                    value: '2',
                    label: '上线'
                }
            ],
            showStatus: [
                {
                    value: '1',
                    label: '显示'
                },
                {
                    value: '2',
                    label: '不显示'
                }
            ],
            businessOptiones: [],
            bannerType: [
                {
                    value: '1',
                    label: '卖品首页'
                },
                {
                    value: '2',
                    label: '积分商城首页'
                },
                {
                    value: '3',
                    label: '个人中心首页'
                },
                {
                    value: '4',
                    label: '支付成功页'
                },
                {
                    value: '5',
                    label: '放映厅首页'
                },
                {
                    value: '6',
                    label: '首页广告弹窗'
                },
                {
                    value: '7',
                    label: '今日大牌'
                },
                {
                    value: '8',
                    label: '签到送积分'
                },
                {
                    value: '9',
                    label: '分享得金币'
                },
                {
                    value: '10',
                    label: '积分换金币'
                }
            ],
            tabType: [
                {
                    value: '1',
                    label: '跳转到文章'
                },
                {
                    value: '2',
                    label: '跳转到电影'
                },
                {
                    value: '3',
                    label: '跳转到金币商品'
                }
            ],
            value: '',
            goType: ''
        };
    },
    components: { quillEditor },
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
            setTimeout(() => {
                https
                    .fetchPost('/noticeOfActivity/addPage', '')
                    .then(data => {
                        loading.close();
                        // this.cinemaInfo = JSON.parse(Decrypt(data.data.data)).cinemaList;
                        if (data.data.code == 'success') {
                            if (this.$refs.download) {
                                this.$refs.download.clearFiles();
                            }
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
        addRole() {
            //新增按钮操作
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if(!this.oForm.title||!this.summary||!this.imageUrl||!this.oForm.content||!this.oForm.status){
                this.message = '必填项不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            setTimeout(() => {
                var jsonArr = [];
                    jsonArr.push({ key: 'content', value: this.oForm.content });
                // if (this.oForm.type == 1) {
                //     jsonArr.push({ key: 'imageContent', value: this.oForm.imageContent });
                // }
                jsonArr.push({ key: 'cinemaCodes', value: this.cinemaCode });
                jsonArr.push({ key: 'title', value: this.oForm.title });
                jsonArr.push({ key: 'summary', value: this.oForm.summary });
                jsonArr.push({ key: 'imageUrl', value: this.oForm.imageUrl });
                jsonArr.push({ key: 'status', value: this.oForm.status });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/noticeOfActivity/addNoticeOfActivity', params)
                        .then(data => {
                            //新增
                            loading.close();
                            if (data.data.code == 'success') {
                                this.dialogFormVisible = false;
                                this.$message.success(`新增成功`);
                                this.oForm.cinemaCode = '';
                                this.$refs.download.clearFiles();
                                this.oForm.content = '';
                                this.oForm.imageContent = '';
                                this.oForm.title = '';
                                this.oForm.summary = '';
                                this.oForm.status = '';
                                this.oForm.imageUrl = '';
                                this.oForm.publishDate = '';
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
                            .fetchPost('/noticeOfActivity/deleteNoticeOfActivity', params)
                            .then(data => {
                                loading.close();
                                console.log(data);
                                // console.log(JSON.parse(Decrypt(data.data.data)));
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
                    .fetchPost('/noticeOfActivity/modifyPage', params)
                    .then(data => {
                        loading.close();
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).cinemaCodes;
                            this.oContent = JSON.parse(Decrypt(data.data.data)).content;
                            this.oImageUrl = JSON.parse(Decrypt(data.data.data)).imageUrl;
                            this.oPublishDate = JSON.parse(Decrypt(data.data.data)).publishDate;
                            this.oStatus = JSON.parse(Decrypt(data.data.data)).status;
                            this.oSummary = JSON.parse(Decrypt(data.data.data)).summary;
                            this.oTitle = JSON.parse(Decrypt(data.data.data)).title;
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
            if(!this.oTitle||!this.oSummary||!this.oImageUrl||!this.oContent||!this.oStatus){
                this.message = '必填项不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            setTimeout(() => {
                var jsonArr = [];
                jsonArr.push({ key: 'content', value: this.oContent });
                jsonArr.push({ key: 'cinemaCodes', value: this.oCinemaCode });
                jsonArr.push({ key: 'title', value: this.oTitle });
                jsonArr.push({ key: 'summary', value: this.oSummary });
                jsonArr.push({ key: 'imageUrl', value: this.oImageUrl });
                jsonArr.push({ key: 'status', value: this.oStatus });
                jsonArr.push({ key: 'publishDate', value: this.oPublishDate });
                jsonArr.push({ key: 'id', value: this.oId });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/noticeOfActivity/updateNoticeOfActivityById', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.editVisible = false;
                            this.$refs.upload.clearFiles(); //清除已上传文件
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
        beforeUpload(file) {
            //上传之前
            this.type.type = EncryptReplace('activity');
            const isLt200Kb = file.size / 1024 < 200;
            if (!isLt200Kb) {
                this.message = '图片大小不能超过200kb！';
                this.open();
                return false
            }
            return isLt200Kb
        },
        onSuccess(data) {
            //上传文件 登录超时
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.download.clearFiles();
                return;
            }
            this.oForm.imageUrl = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        unSuccess(data) {
            //上传文件 登录超时
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.upload.clearFiles();
                return;
            }
            this.oImageUrl = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        Search() {
            this.query.pageNo = 1;
            this.getMenu();
        },
        searchNotice() {
            this.query.pageNo = 1;
            this.show();
        },
        back() {
            this.showSell = true;
            this.getMenu();
        },
        show(row) {
            //获取详细信息
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            this.showSell = false;
            setTimeout(() => {
                let status = this.query.status;
                let title = this.query.title;
                // let cinemaName = this.query.cinemaName;
                if (!status) {
                    status = '';
                }
                if (!title) {
                    title = '';
                }
                // if (!cinemaName) {
                //     cinemaName = '';
                // }
                if (row) {
                    this.cinemaCode = row.cinemaCode;
                }
                let jsonArr = [];
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'title', value: title });
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('noticeOfActivity/noticeOfActivityPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            this.oTableData = oData.data;
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

