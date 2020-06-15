<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 第三方平台设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    v-model="query.versionCode"
                    placeholder="版本代号"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="普通版" value="1"></el-option>
                    <el-option key="2" label="红色版" value="2"></el-option>
                    <el-option key="3" label="黑金版" value="3"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="小程序名称" class="handle-input mr10"></el-input>
                <el-input v-model="query.appId" placeholder="小程序appId" class="handle-input mr10"></el-input>
                <el-select
                    clearable
                    v-model="query.auditStatus"
                    placeholder="审核状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="未审核" value="1"></el-option>
                    <el-option key="2" label="审核中" value="2"></el-option>
                    <el-option key="3" label="加急审核中" value="3"></el-option>
                    <el-option key="4" label="审核延后" value="4"></el-option>
                    <el-option key="5" label="审核通过" value="5"></el-option>
                    <el-option key="6" label="已发布" value="6"></el-option>
                    <el-option key="-1" label="审核失败" value="-1"></el-option>
                    <el-option key="-2" label="审核已撤回" value="-2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="授权状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="已授权" value="1"></el-option>
                    <el-option key="2" label="取消授权" value="2"></el-option>
                </el-select>
                <el-button
                    style="margin-top: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="Search"
                >搜索</el-button>
            </div>
            <div class="handle-box2">

                <el-button
                    style="margin-top: 10px;margin-right:10px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="allPublishCode"
                >批量发布代码</el-button>
                <el-button
                    style="margin-top: 10px;margin-right:10px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="allRevertCode"
                >批量版本回退</el-button>
                <el-button
                    style="margin-top: 10px;margin-right:10px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="allBackCodeAudit"
                >批量撤回审核</el-button>
                <el-button
                    style="margin-top: 10px;margin-right:10px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="allQueryLatestAuditStatus"
                >批量刷新审核状态</el-button>
                <el-button
                    style="margin-top: 10px;margin-right:10px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="allAuditCode"
                >批量提交审核</el-button>
                <el-button
                    style="margin-top: 10px;margin-right:10px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="allUploadCode"
                >批量上传代码</el-button>
                <el-button
                    style="margin-top: 10px;margin-right:10px;"
                    type="success"
                    @click="selectAll"
                >全选</el-button>
            </div>
            <el-table
                :data="tableData"
                height="500"
                border
                class="table"
                ref="recordTable"
                :row-key="getRowKeys"
                highlight-current-row
                header-cell-class-name="table-header"
                @selection-change="selectThisPage"
                @select="selectOne"
            >
                <el-table-column
                    type="selection"
                    :selectable="canSelect"
                    :reserve-selection="true"
                    width="55"
                ></el-table-column>
                <el-table-column prop="code" label="小程序名称">
                    <template slot-scope="scope">{{scope.row.miniName}}</template>
                </el-table-column>
                <el-table-column prop="time" label="小程序appId">
                    <template slot-scope="scope">{{scope.row.miniAppId}}</template>
                </el-table-column>
                <el-table-column prop="name" label="版本代号" width="80px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.versionCode=='1'">普通版</el-tag>
                        <el-tag v-else-if="scope.row.versionCode=='2'" type="danger">红色版</el-tag>
                        <el-tag v-else-if="scope.row.versionCode=='3'" type="info">黑金版</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="版本说明" align="center" width="80px">
                    <template slot-scope="scope">{{scope.row.versionDesc}}</template>
                </el-table-column>
                <el-table-column prop="number" label="授权状态" width="80px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'" type="info">已授权</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">取消授权</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="审核状态" width="80px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.auditStatus=='1'" type="info">未审核</el-tag>
                        <el-tag v-else-if="scope.row.auditStatus=='2'">审核中</el-tag>
                        <el-tag v-else-if="scope.row.auditStatus=='3'" type="success">加急审核中</el-tag>
                        <el-tag v-else-if="scope.row.auditStatus=='4'">审核延后</el-tag>
                        <el-tag v-else-if="scope.row.auditStatus=='5'">审核通过</el-tag>
                        <el-tag v-else-if="scope.row.auditStatus=='6'" type="success">已发布</el-tag>
                        <el-tag v-else-if="scope.row.auditStatus=='-1'" type="danger">审核失败</el-tag>
                        <el-tag v-else-if="scope.row.auditStatus=='-2'" type="danger">审核已撤回</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="拒绝原因" align="center" width="500px">
                    <template slot-scope="scope">{{scope.row.refuseReason}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="500px;" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="setProgram(scope.$index, scope.row)"
                        >设置</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-refresh"
                            class="red"
                            @click="addCode(scope.row)"
                        >生成二维码</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-upload"
                            @click="uploadCode(scope.row)"
                        >上传代码</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-arrow-right"
                            @click="auditCode(scope.row)"
                        >提交审核</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-d-arrow-right"
                            @click="speedAuditCode(scope.row)"
                        >加急审核</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-refresh"
                            @click="queryLatestAuditStatus(scope.row)"
                        >刷新审核状态</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-arrow-left"
                            @click="backCodeAudit(scope.row)"
                        >撤回审核</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-d-arrow-left"
                            @click="revertCode(scope.row)"
                        >版本回退</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-thumb"
                            @click="publishCode(scope.row)"
                        >发布代码</el-button>
                        <!-- <el-button
                            type="text"
                            icon="el-icon-thumb"
                            @click="showLimitNum(scope.row)"
                        >查询审核次数</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page="query.pageNo"
                    :page-sizes="[1]"
                    :page-size="query.pageSize"
                    :total="query.totalCount"
                    @current-change="currentChange"
                    @prev-click="prev"
                    @next-click="next"
                ></el-pagination>
            </div>
        </div>
        <!-- 设置弹出框 -->
        <el-dialog :close-on-click-modal="false" title="第三方平台设置" :visible.sync="editVisible">
            <div>
                <span style="font-weight: bold">服务器域名</span>
                <el-form :model="setForm">
                    <el-form-item
                        label="request合法域名:"
                        :label-width="formLabelWidth"
                        :required="true"
                    >
                        <el-input
                            style="width:300px;margin-bottom:5px;"
                            v-model="setForm.addRequestUrl"
                        >
                            <template slot="prepend">https://</template>
                        </el-input>
                        <el-button
                            type="primary"
                            style="margin-left: 10px;"
                            @click="addRequestUrl"
                        >确认添加</el-button>
                        <div
                            v-for="(item, index) in setForm.requestList"
                            style="margin-bottom: 5px;"
                            :key="index"
                        >
                            <div>
                                <el-input style="width:300px;" v-model="item.url" :disabled="true">
                                    <!-- <template slot="prepend">https://</template> -->
                                </el-input>
                                <span
                                    style="color: red;cursor: pointer;margin-left: 10px;"
                                    @click="deleteRequestUrl(index)"
                                >删除</span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="socket合法域名:" :label-width="formLabelWidth">
                        <el-input
                            style="width:300px;margin-bottom:5px;"
                            v-model="setForm.addSocketUrl"
                        >
                            <template slot="prepend">wss://</template>
                        </el-input>
                        <el-button
                            type="primary"
                            style="margin-left: 10px;"
                            @click="addSocketUrl"
                        >确认添加</el-button>
                        <div
                            v-for="(item, index) in setForm.socketList"
                            style="margin-bottom: 5px"
                            :key="index"
                        >
                            <div>
                                <el-input style="width:300px;" v-model="item.url" :disabled="true">
                                    <!-- <template slot="prepend">wss://</template> -->
                                </el-input>
                                <span
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="deleteSocketUrl(index)"
                                >删除</span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="uploadFile合法域名:" :label-width="formLabelWidth">
                        <el-input
                            style="width:300px;margin-bottom:5px;"
                            v-model="setForm.addUploadFileUrl"
                        >
                            <template slot="prepend">https://</template>
                        </el-input>
                        <el-button
                            type="primary"
                            style="margin-left: 10px;"
                            @click="addUploadFileUrl"
                        >确认添加</el-button>
                        <div
                            v-for="(item, index) in setForm.uploadFileList"
                            style="margin-bottom: 5px"
                            :key="index"
                        >
                            <div>
                                <el-input style="width:300px;" v-model="item.url" :disabled="true">
                                    <!-- <template slot="prepend">https://</template> -->
                                </el-input>
                                <span
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="deleteUploadFileUrl(index)"
                                >删除</span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="downloadFile合法域名:" :label-width="formLabelWidth">
                        <el-input
                            style="width:300px;margin-bottom:5px;"
                            v-model="setForm.addDownloadFileUrl"
                        >
                            <template slot="prepend">https://</template>
                        </el-input>
                        <el-button
                            type="primary"
                            style="margin-left: 10px;"
                            @click="addDownloadFileUrl"
                        >确认添加</el-button>
                        <div
                            v-for="(item, index) in setForm.downloadFileList"
                            style="margin-bottom: 5px"
                            :key="index"
                        >
                            <div>
                                <el-input style="width:300px;" v-model="item.url" :disabled="true">
                                    <!-- <template slot="prepend">https://</template> -->
                                </el-input>
                                <span
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="deleteDownloadFileUrl(index)"
                                >删除</span>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <span style="font-weight: bold;">体验者</span>
                <el-form :model="experienceForm">
                    <el-form-item label="添加体验者:" :label-width="formLabelWidth">
                        <el-input
                            style="width:300px;margin-bottom:5px;margin-right:10px;"
                            v-model="experienceForm.addWxId"
                            placeholder="请输入微信号"
                        ></el-input>
                        <el-input
                            style="width:300px;margin-bottom:5px;"
                            v-model="experienceForm.addWxName"
                            placeholder="请输入微信号对应的微信昵称"
                        ></el-input>
                        <el-button type="primary" style="margin-left: 10px;" @click="addWxId">确认添加</el-button>
                        <div
                            v-for="(item, index) in experienceForm.wxIdList"
                            style="margin-bottom: 5px"
                            :key="index"
                        >
                            <div>
                                <el-input
                                    style="width:300px; margin-right:10px"
                                    v-model="item.id"
                                    :disabled="true"
                                ></el-input>
                                <el-input style="width:300px;" v-model="item.name" :disabled="true"></el-input>
                                <span
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="deleteWxId(index)"
                                >删除</span>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="giveUp">取 消</el-button>
                <el-button type="primary" @click="sureUrl">确 认</el-button>
            </span>
        </el-dialog>

        <!-- 上传代码弹出框 -->
        <el-dialog :close-on-click-modal="false" title="上传代码" :visible.sync="uploadVisible">
            <el-form :model="uploadForm">
                <el-form-item label="版本号：" :label-width="formLabelWidth" :required="true">
                    <el-input style="width: 250px" v-model="uploadForm.version" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="版本描述：" :label-width="formLabelWidth" :required="true">
                    <el-input style="width: 250px" v-model="uploadForm.des" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="模板id：" :label-width="formLabelWidth" :required="true">
                    <el-input style="width: 250px" v-model="uploadForm.id" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploadVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureUpload">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 批量上传代码弹出框 -->
        <el-dialog :close-on-click-modal="false" title="批量上传代码" :visible.sync="allUploadVisible">
            <el-form :model="allUploadForm">
                <el-form-item label="版本号：" :label-width="formLabelWidth" :required="true">
                    <el-input
                        style="width: 250px"
                        v-model="allUploadForm.version"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="版本描述：" :label-width="formLabelWidth" :required="true">
                    <el-input style="width: 250px" v-model="allUploadForm.des" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="模板id：" :label-width="formLabelWidth" :required="true">
                    <el-input style="width: 250px" v-model="allUploadForm.id" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="allUploadVisible = false">取 消</el-button>
                <el-button type="primary" @click="allSureUpload">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 审核代码弹出框 -->
        <el-dialog :close-on-click-modal="false" title="审核代码" :visible.sync="auditVisible">
            <el-form :model="auditForm">
                <el-form-item label="版本说明：" :label-width="formLabelWidth" :required="true">
                    <el-input
                        type="textarea"
                        style="width: 250px"
                        v-model="auditForm.versionDesc"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="反馈内容：" :label-width="formLabelWidth" :required="true">
                    <el-input
                        type="textarea"
                        style="width: 250px"
                        v-model="auditForm.feedbackInfo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="auditVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureAudit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 批量审核代码弹出框 -->
        <el-dialog :close-on-click-modal="false" title="批量审核代码" :visible.sync="allAuditVisible">
            <el-form :model="allAuditForm">
                <el-form-item label="版本说明：" :label-width="formLabelWidth" :required="true">
                    <el-input
                        type="textarea"
                        style="width: 250px"
                        v-model="allAuditForm.versionDesc"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="反馈内容：" :label-width="formLabelWidth" :required="true">
                    <el-input
                        type="textarea"
                        style="width: 250px"
                        v-model="allAuditForm.feedbackInfo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="allAuditVisible = false">取 消</el-button>
                <el-button type="primary" @click="allSureAudit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 体验版二维码弹出框 -->
        <el-dialog :close-on-click-modal="false" title="二维码" :visible.sync="codeVisible">
            <el-form :model="codeForm">
                <el-popover placement="right" title trigger="hover">
                    <img :src="codeForm.code" />
                    <img
                        slot="reference"
                        :src="codeForm.code"
                        :alt="codeForm.code"
                        style="max-height: 50px;max-width: 130px"
                    />
                </el-popover>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="codeVisible = false">确 定</el-button>
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
            message: '', //弹出框消息
            tableData: [],
            allCheck: 1,
            checkList: [],
            query: {
                pageNo: 1,
                pageSize: 1,
                versionCode: '1'
            },
            setForm: {
                addRequestUrl: '',
                addSocketUrl: '',
                addUploadFileUrl: '',
                addDownloadFileUrl: '',
                requestList: [
                    {
                        url: ''
                    }
                ],
                socketList: [
                    {
                        url: ''
                    }
                ],
                uploadFileList: [
                    {
                        url: ''
                    }
                ],
                downloadFileList: [
                    {
                        url: ''
                    }
                ]
                // udpList: [
                //     {
                //         url: ''
                //     }
                // ]
            }, // 域名
            requestUrlList: [],
            socketUrlList: [],
            uploadFileUrlList: [],
            downloadFileUrlList: [],
            experienceForm: {
                addWxId: '',
                addWxName: '',
                wxIdList: [
                    {
                        id: '',
                        name: ''
                    }
                ]
            }, // 体验者
            uploadForm: {
                des: '',
                version: '',
                id: ''
            }, // 上传代码
            allUploadForm: {
                des: '',
                version: '',
                id: ''
            }, // 批量上传代码
            auditForm: {
                versionDesc: '',
                feedbackInfo: ''
            }, // 审核代码
            allAuditForm: {
                allAersionDesc: '',
                allFeedbackInfo: ''
            }, // 批量审核代码
            codeForm: {
                code: ''
            }, // 二维码
            editVisible: false,
            uploadVisible: false,
            allUploadVisible: false,
            codeVisible: false,
            auditVisible: false,
            allAuditVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            formLabelWidth: '180px'
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        // 列表页数据
        getMenu() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let name = this.query.name;
            let appId = this.query.appId;
            let version = this.query.version;
            let versionCode = this.query.versionCode;
            let status = this.query.status;
            let auditStatus = this.query.auditStatus;
            if (!name) {
                name = '';
            }
            if (!appId) {
                appId = '';
            }
            if (!version) {
                version = '';
            }
            if (!versionCode) {
                versionCode = '';
            }
            if (!status) {
                status = '';
            }
            if (!auditStatus) {
                auditStatus = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'miniName', value: name });
            jsonArr.push({ key: 'miniAppId', value: appId });
            jsonArr.push({ key: 'version', value: version });
            jsonArr.push({ key: 'versionCode', value: versionCode });
            jsonArr.push({ key: 'status', value: status });
            jsonArr.push({ key: 'auditStatus', value: auditStatus });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/getPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let oData = JSON.parse(Decrypt(data.data.data));
                        this.query.pageSize = oData.pageSize;
                        this.query.pageNo = oData.pageNo;
                        this.query.totalCount = oData.totalCount;
                        this.query.totalPage = oData.totalPage;
                        this.tableData = oData.data;
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

        // 查询服务平台当月提审限额和加急次数
        showLimitNum(row) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            jsonArr.push({ key: 'miniAppId', value: row.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/showLimitNum', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.message = JSON.parse(Decrypt(data.data.data));
                        this.open();
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

        // 进入设置弹窗
        setProgram(index, row) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            this.miniAppId = row.miniAppId;
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'miniAppId', value: row.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/getDoMain', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        let urlList = JSON.parse(Decrypt(data.data.data));
                        if (urlList.alreadyrequestdomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadyrequestdomain.length; i++) {
                                newArr.push({ url: urlList.alreadyrequestdomain[i] });
                            }
                            this.setForm.requestList = newArr;
                        }
                        if (urlList.alreadywsrequestdomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadywsrequestdomain.length; i++) {
                                newArr.push({ url: urlList.alreadywsrequestdomain[i] });
                            }
                            this.setForm.socketList = newArr;
                        }
                        if (urlList.alreadyuploaddomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadyuploaddomain.length; i++) {
                                newArr.push({ url: urlList.alreadyuploaddomain[i] });
                            }
                            this.setForm.uploadFileList = newArr;
                        }
                        if (urlList.alreadydownloaddomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadydownloaddomain.length; i++) {
                                newArr.push({ url: urlList.alreadydownloaddomain[i] });
                            }
                            this.setForm.downloadFileList = newArr;
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

            // 获取体验者
            https
                .fetchPost('/WXThirdParty/queryMemberAuth', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        let wxIdList = JSON.parse(Decrypt(data.data.data));
                        if (wxIdList.members.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < wxIdList.members.length; i++) {
                                newArr.push({ id: wxIdList.members[i].userstr, name: wxIdList.members[i].nickName });
                            }
                            this.experienceForm.wxIdList = newArr;
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

        // 添加删除request合法域名
        addRequestUrl() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'requestdomain', value: this.setForm.addRequestUrl });
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/addDoMain', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let urlList = JSON.parse(Decrypt(data.data.data));
                        if (urlList.alreadyrequestdomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadyrequestdomain.length; i++) {
                                newArr.push({ url: urlList.alreadyrequestdomain[i] });
                            }
                            this.setForm.requestList = newArr;
                        }
                        this.setForm.addRequestUrl = '';
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
        deleteRequestUrl(index) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'requestdomain', value: this.setForm.requestList[index].url });
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/deleteDoMain', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let urlList = JSON.parse(Decrypt(data.data.data));
                        if (urlList.alreadyrequestdomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadyrequestdomain.length; i++) {
                                newArr.push({ url: urlList.alreadyrequestdomain[i] });
                            }
                            this.setForm.requestList = newArr;
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

        // 添加删除socket合法域名
        addSocketUrl() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'wsrequestdomain', value: this.setForm.addSocketUrl });
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/addDoMain', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let urlList = JSON.parse(Decrypt(data.data.data));
                        if (urlList.alreadywsrequestdomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadywsrequestdomain.length; i++) {
                                newArr.push({ url: urlList.alreadywsrequestdomain[i] });
                            }
                            this.setForm.socketList = newArr;
                        }
                        this.setForm.addSocketUrl = '';
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
        deleteSocketUrl(index) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'wsrequestdomain', value: this.setForm.socketList[index].url });
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/deleteDoMain', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let urlList = JSON.parse(Decrypt(data.data.data));
                        if (urlList.alreadywsrequestdomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadywsrequestdomain.length; i++) {
                                newArr.push({ url: urlList.alreadywsrequestdomain[i] });
                            }
                            this.setForm.socketList = newArr;
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

        // 添加删除uploadFile合法域名
        addUploadFileUrl() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'uploaddomain', value: this.setForm.addUploadFileUrl });
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/addDoMain', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let urlList = JSON.parse(Decrypt(data.data.data));
                        if (urlList.alreadyuploaddomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadyuploaddomain.length; i++) {
                                newArr.push({ url: urlList.alreadyuploaddomain[i] });
                            }
                            this.setForm.uploadFileList = newArr;
                        }
                        this.setForm.addUploadFileUrl = '';
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
        deleteUploadFileUrl(index) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'uploaddomain', value: this.setForm.uploadFileList[index].url });
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/deleteDoMain', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let urlList = JSON.parse(Decrypt(data.data.data));
                        if (urlList.alreadyuploaddomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadyuploaddomain.length; i++) {
                                newArr.push({ url: urlList.alreadyuploaddomain[i] });
                            }
                            this.setForm.uploadFileList = newArr;
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

        // 添加删除downloadFile合法域名
        addDownloadFileUrl() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'downloaddomain', value: this.setForm.addDownloadFileUrl });
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/addDoMain', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let urlList = JSON.parse(Decrypt(data.data.data));
                        if (urlList.alreadydownloaddomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadydownloaddomain.length; i++) {
                                newArr.push({ url: urlList.alreadydownloaddomain[i] });
                            }
                            this.setForm.downloadFileList = newArr;
                        }
                        this.setForm.addDownloadFileUrl = '';
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
        deleteDownloadFileUrl(index) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'downloaddomain', value: this.setForm.downloadFileList[index].url });
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/deleteDoMain', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let urlList = JSON.parse(Decrypt(data.data.data));
                        if (urlList.alreadydownloaddomain.length > 0) {
                            let newArr = [];
                            for (let i = 0; i < urlList.alreadydownloaddomain.length; i++) {
                                newArr.push({ url: urlList.alreadydownloaddomain[i] });
                            }
                            this.setForm.downloadFileList = newArr;
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

        // 添加删除体验者
        addWxId() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'wechatid', value: this.experienceForm.addWxId });
            jsonArr.push({ key: 'nickName', value: this.experienceForm.addWxName });
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/bindMember', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let wxId = JSON.parse(Decrypt(data.data.data));
                        this.experienceForm.wxIdList.push({ id: wxId.userName, name: wxId.nickName });
                        this.experienceForm.addWxId = '';
                        this.experienceForm.addWxName = '';
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
        deleteWxId(index) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'wechatid', value: this.experienceForm.wxIdList[index].id });
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/unBindMember', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.experienceForm.wxIdList.splice(index, 1);
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

        // 取消
        giveUp() {
            this.setForm.requestList = [{ url: '' }];
            this.requestUrlList = [];
            this.miniAppId = '';
            this.editVisible = false;
        },

        // 确认修改
        sureUrl() {
            this.miniAppId = '';
            this.editVisible = false;
        },

        // 打开上传代码窗口
        uploadCode(row) {
            this.uploadVisible = true;
            this.miniAppId = row.miniAppId;
        },

        // 确认上传
        sureUpload() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            jsonArr.push({ key: 'template_id', value: this.uploadForm.id });
            jsonArr.push({ key: 'user_version', value: this.uploadForm.version });
            jsonArr.push({ key: 'user_des', value: this.uploadForm.des });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/uploadCode', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.uploadVisible = false;
                        this.message = '上传成功！';
                        this.open();
                        this.miniAppId = '';
                        this.uploadForm.id = '';
                        this.uploadForm.version = '';
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

        // 批量确认上传
        allSureUpload() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let jsonArr = [];
            if (this.allCheck % 2 == 0) {
                let name = this.query.name;
                let appId = this.query.appId;
                let version = this.query.version;
                let versionCode = this.query.versionCode;
                let status = this.query.status;
                let auditStatus = this.query.auditStatus;
                if (!name) {
                    name = '';
                }
                if (!appId) {
                    appId = '';
                }
                if (!version) {
                    version = '';
                }
                if (!versionCode) {
                    versionCode = '';
                }
                if (!status) {
                    status = '';
                }
                if (!auditStatus) {
                    auditStatus = '';
                }
                jsonArr.push({ key: 'byCondition', value: 2 });
                jsonArr.push({ key: 'miniName', value: name });
                jsonArr.push({ key: 'miniAppId', value: appId });
                jsonArr.push({ key: 'version', value: version });
                jsonArr.push({ key: 'versionCode', value: versionCode });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'auditStatus', value: auditStatus });
            } else {
                jsonArr.push({ key: 'byCondition', value: 1 });
                jsonArr.push({ key: 'idStr', value: this.selectId });
            }
            jsonArr.push({ key: 'template_id', value: this.allUploadForm.id });
            jsonArr.push({ key: 'user_version', value: this.allUploadForm.version });
            jsonArr.push({ key: 'user_des', value: this.allUploadForm.des });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/batchUploadCode', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.allUploadVisible = false;
                        this.message = JSON.parse(Decrypt(data.data.data));
                        this.open();
                        this.allUploadForm.id = '';
                        this.allUploadForm.version = '';
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

        // 打开审核代码窗口
        auditCode(row) {
            this.auditVisible = true;
            this.miniAppId = row.miniAppId;
        },

        // 确认审核
        sureAudit() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            jsonArr.push({ key: 'miniAppId', value: this.miniAppId });
            jsonArr.push({ key: 'versionDesc', value: this.auditForm.versionDesc });
            jsonArr.push({ key: 'feedbackInfo', value: this.auditForm.feedbackInfo });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/submitAudit', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.message = '提交成功！';
                        this.open();
                        this.auditVisible = false;
                        this.miniAppId = '';
                        this.auditForm.versionDesc = '';
                        this.auditForm.feedbackInfo = '';
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

        // 批量确认审核
        allSureAudit() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let jsonArr = [];
            if (this.allCheck % 2 == 0) {
                let name = this.query.name;
                let appId = this.query.appId;
                let version = this.query.version;
                let versionCode = this.query.versionCode;
                let status = this.query.status;
                let auditStatus = this.query.auditStatus;
                if (!name) {
                    name = '';
                }
                if (!appId) {
                    appId = '';
                }
                if (!version) {
                    version = '';
                }
                if (!versionCode) {
                    versionCode = '';
                }
                if (!status) {
                    status = '';
                }
                if (!auditStatus) {
                    auditStatus = '';
                }
                jsonArr.push({ key: 'byCondition', value: 2 });
                jsonArr.push({ key: 'miniName', value: name });
                jsonArr.push({ key: 'miniAppId', value: appId });
                jsonArr.push({ key: 'version', value: version });
                jsonArr.push({ key: 'versionCode', value: versionCode });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'auditStatus', value: auditStatus });
            } else {
                jsonArr.push({ key: 'byCondition', value: 1 });
                jsonArr.push({ key: 'idStr', value: this.selectId });
            }
            jsonArr.push({ key: 'versionDesc', value: this.allAuditForm.versionDesc });
            jsonArr.push({ key: 'feedbackInfo', value: this.allAuditForm.feedbackInfo });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/batchSubmitAudit', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.message = JSON.parse(Decrypt(data.data.data));
                        this.open();
                        this.allAuditVisible = false;
                        this.allAuditForm.versionDesc = '';
                        this.allAuditForm.feedbackInfo = '';
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

        // 加急审核
        speedAuditCode(row) {
            this.$confirm('此操作将加急审核, 是否继续?', '提示', {
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
                    var jsonArr = [];
                    jsonArr.push({ key: 'miniAppId', value: row.miniAppId });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/WXThirdParty/speedupAudit', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.message = '加急成功！';
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
                        message: '已取消操作'
                    });
                });
        },

        // 刷新审核状态
        queryLatestAuditStatus(row) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            jsonArr.push({ key: 'miniAppId', value: row.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/queryLatestAuditStatus', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
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

        // 撤回审核
        backCodeAudit(row) {
            this.$confirm('此操作将撤回审核, 是否继续?', '提示', {
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
                    var jsonArr = [];
                    jsonArr.push({ key: 'miniAppId', value: row.miniAppId });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/WXThirdParty/backCodeAudit', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.message = '撤回成功！';
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
                        message: '已取消操作'
                    });
                });
        },

        // 版本回退
        revertCode(row) {
            this.$confirm('此操作将回退至上一个版本, 是否继续?', '提示', {
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
                    var jsonArr = [];
                    jsonArr.push({ key: 'miniAppId', value: row.miniAppId });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/WXThirdParty/revertCode', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.message = '回退成功！';
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
                        message: '已取消操作'
                    });
                });
        },

        // 发布代码
        publishCode(row) {
            this.$confirm('此操作将发布代码, 是否继续?', '提示', {
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
                    var jsonArr = [];
                    jsonArr.push({ key: 'miniAppId', value: row.miniAppId });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/WXThirdParty/publishCode', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.message = '发布成功！';
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
                        message: '已取消操作'
                    });
                });
        },

        // 生成体验版二维码
        addCode(row) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            // 获取域名
            var jsonArr = [];
            jsonArr.push({ key: 'miniAppId', value: row.miniAppId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/WXThirdParty/getTestCode', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.codeVisible = true;
                        let code = JSON.parse(Decrypt(data.data.data));
                        this.codeForm.code = code;
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

        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },

        // 点击全选
        selectAll() {
            if (this.allCheck % 2 == 1) {
                this.tableData.forEach(row => {
                    this.$refs.recordTable.toggleRowSelection(row, true);
                });
            } else {
                this.$refs.recordTable.clearSelection();
            }
            this.allCheck += 1;
        },

        selectOne() {
            if (this.allCheck % 2 == 0) {
                this.allCheck += 1;
            }
        },

        // 能否单选
        canSelect() {
            if (this.allCheck % 2 == 1) {
                return true;
            } else {
                return false;
            }
        },

        // 获取id
        getRowKeys(row) {
            return row.id;
        },

        // 选中当前页
        selectThisPage(rows) {
            this.selectId = '';
            for (let i = 0; i < rows.length; i++) {
                this.selectId += ',' + rows[i].id;
            }
            if (this.selectId.substring(1).length > 0) {
                this.selectId = this.selectId.substring(1);
            }
            this.checkList = rows;
        },

        // 批量上传代码
        allUploadCode() {
            if (!this.selectId) {
                this.message = '请选择小程序！';
                this.open();
                return;
            } else {
                this.allUploadVisible = true;
            }
        },

        // 批量提交审核
        allAuditCode() {
            if (!this.selectId) {
                this.message = '请选择小程序！';
                this.open();
                return;
            } else {
                this.allAuditVisible = true;
            }
        },

        // 批量刷新审核状态
        allQueryLatestAuditStatus() {
            if (!this.selectId) {
                this.message = '请选择小程序！';
                this.open();
                return;
            } else {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                let jsonArr = [];
                if (this.allCheck % 2 == 0) {
                    let name = this.query.name;
                    let appId = this.query.appId;
                    let version = this.query.version;
                    let versionCode = this.query.versionCode;
                    let status = this.query.status;
                    let auditStatus = this.query.auditStatus;
                    if (!name) {
                        name = '';
                    }
                    if (!appId) {
                        appId = '';
                    }
                    if (!version) {
                        version = '';
                    }
                    if (!versionCode) {
                        versionCode = '';
                    }
                    if (!status) {
                        status = '';
                    }
                    if (!auditStatus) {
                        auditStatus = '';
                    }
                    jsonArr.push({ key: 'byCondition', value: 2 });
                    jsonArr.push({ key: 'miniName', value: name });
                    jsonArr.push({ key: 'miniAppId', value: appId });
                    jsonArr.push({ key: 'version', value: version });
                    jsonArr.push({ key: 'versionCode', value: versionCode });
                    jsonArr.push({ key: 'status', value: status });
                    jsonArr.push({ key: 'auditStatus', value: auditStatus });
                } else {
                    jsonArr.push({ key: 'byCondition', value: 1 });
                    jsonArr.push({ key: 'idStr', value: this.selectId });
                }
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/WXThirdParty/batchQueryLatestAuditStatus', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.message = JSON.parse(Decrypt(data.data.data));
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
            }
        },

        // 批量撤回审核状态
        allBackCodeAudit() {
            if (!this.selectId) {
                this.message = '请选择小程序！';
                this.open();
                return;
            } else {
                this.$confirm('此操作将撤回审核, 是否继续?', '提示', {
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
                        let jsonArr = [];
                        if (this.allCheck % 2 == 0) {
                            let name = this.query.name;
                            let appId = this.query.appId;
                            let version = this.query.version;
                            let versionCode = this.query.versionCode;
                            let status = this.query.status;
                            let auditStatus = this.query.auditStatus;
                            if (!name) {
                                name = '';
                            }
                            if (!appId) {
                                appId = '';
                            }
                            if (!version) {
                                version = '';
                            }
                            if (!versionCode) {
                                versionCode = '';
                            }
                            if (!status) {
                                status = '';
                            }
                            if (!auditStatus) {
                                auditStatus = '';
                            }
                            jsonArr.push({ key: 'byCondition', value: 2 });
                            jsonArr.push({ key: 'miniName', value: name });
                            jsonArr.push({ key: 'miniAppId', value: appId });
                            jsonArr.push({ key: 'version', value: version });
                            jsonArr.push({ key: 'versionCode', value: versionCode });
                            jsonArr.push({ key: 'status', value: status });
                            jsonArr.push({ key: 'auditStatus', value: auditStatus });
                        } else {
                            jsonArr.push({ key: 'byCondition', value: 1 });
                            jsonArr.push({ key: 'idStr', value: this.selectId });
                        }
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/WXThirdParty/batchBackCodeAudit', params)
                            .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.message = JSON.parse(Decrypt(data.data.data));
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
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
            }
        },

        // 批量版本回退
        allRevertCode() {
            if (!this.selectId) {
                this.message = '请选择小程序！';
                this.open();
                return;
            } else {
                this.$confirm('此操作将回退版本, 是否继续?', '提示', {
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
                        let jsonArr = [];
                        if (this.allCheck % 2 == 0) {
                            let name = this.query.name;
                            let appId = this.query.appId;
                            let version = this.query.version;
                            let versionCode = this.query.versionCode;
                            let status = this.query.status;
                            let auditStatus = this.query.auditStatus;
                            if (!name) {
                                name = '';
                            }
                            if (!appId) {
                                appId = '';
                            }
                            if (!version) {
                                version = '';
                            }
                            if (!versionCode) {
                                versionCode = '';
                            }
                            if (!status) {
                                status = '';
                            }
                            if (!auditStatus) {
                                auditStatus = '';
                            }
                            jsonArr.push({ key: 'byCondition', value: 2 });
                            jsonArr.push({ key: 'miniName', value: name });
                            jsonArr.push({ key: 'miniAppId', value: appId });
                            jsonArr.push({ key: 'version', value: version });
                            jsonArr.push({ key: 'versionCode', value: versionCode });
                            jsonArr.push({ key: 'status', value: status });
                            jsonArr.push({ key: 'auditStatus', value: auditStatus });
                        } else {
                            jsonArr.push({ key: 'byCondition', value: 1 });
                            jsonArr.push({ key: 'idStr', value: this.selectId });
                        }
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/WXThirdParty/batchRevertCode', params)
                            .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.message = JSON.parse(Decrypt(data.data.data));
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
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
            }
        },

        // 批量发布代码
        allPublishCode() {
            if (!this.selectId) {
                this.message = '请选择小程序！';
                this.open();
                return;
            } else {
                this.$confirm('此操作将发布代码, 是否继续?', '提示', {
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
                        let jsonArr = [];
                        if (this.allCheck % 2 == 0) {
                            let name = this.query.name;
                            let appId = this.query.appId;
                            let version = this.query.version;
                            let versionCode = this.query.versionCode;
                            let status = this.query.status;
                            let auditStatus = this.query.auditStatus;
                            if (!name) {
                                name = '';
                            }
                            if (!appId) {
                                appId = '';
                            }
                            if (!version) {
                                version = '';
                            }
                            if (!versionCode) {
                                versionCode = '';
                            }
                            if (!status) {
                                status = '';
                            }
                            if (!auditStatus) {
                                auditStatus = '';
                            }
                            jsonArr.push({ key: 'byCondition', value: 2 });
                            jsonArr.push({ key: 'miniName', value: name });
                            jsonArr.push({ key: 'miniAppId', value: appId });
                            jsonArr.push({ key: 'version', value: version });
                            jsonArr.push({ key: 'versionCode', value: versionCode });
                            jsonArr.push({ key: 'status', value: status });
                            jsonArr.push({ key: 'auditStatus', value: auditStatus });
                        } else {
                            jsonArr.push({ key: 'byCondition', value: 1 });
                            jsonArr.push({ key: 'idStr', value: this.selectId });
                        }
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/WXThirdParty/batchPublishCode', params)
                            .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.message = JSON.parse(Decrypt(data.data.data));
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
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
            }
        },

        handleSizeChange(val) {
            this.query.pageSize = val;
            this.getMenu();
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
    },

    watch: {
        tableData: {
            handler(value) {
                if (this.allCheck % 2 == 0) {
                    let that = this;
                    let len = that.checkList.length;
                    value.forEach(row => {
                        for (let i = 0; i < len; i++) {
                            if (row.id === that.checkList[i].id) {
                                that.$refs.recordTable.toggleRowSelection(row, false);
                                break;
                            } else {
                                that.$refs.recordTable.toggleRowSelection(row, true);
                            }
                        }
                    });
                }
            },
            deep: true
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

.handle-box2 {
    width: 100%;
    margin-bottom: 80px;
    font-size: 14px;
}
.handle-box2 > button {
    float: right;
}
.table {
    width: 100%;
    font-size: 14px;
}
.mr10 {
    width: 16%;
    margin-right: 10px;
}
.show {
    display: none;
}
</style>

