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
                <el-input v-model="query.name" placeholder="小程序名称" class="handle-input mr10"></el-input>
                <el-input v-model="query.appId" placeholder="小程序appId" class="handle-input mr10"></el-input>
                <el-input v-model="query.version" placeholder="版本代号" class="handle-input mr10"></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="审核状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="未审核" value="1"></el-option>
                    <el-option key="2" label="审核中" value="2"></el-option>
                    <el-option key="3" label="审核成功" value="3"></el-option>
                    <el-option key="4" label="审核失败" value="4"></el-option>
                </el-select>
                <el-button
                    style="margin-top: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
                >搜索</el-button>
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
                <el-table-column prop="code" label="小程序名称">
                    <template slot-scope="scope">{{scope.row.mimiProgramName}}</template>
                </el-table-column>
                <el-table-column prop="time" label="小程序appId">
                    <template slot-scope="scope">{{scope.row.mimiProgramAppId}}</template>
                </el-table-column>
                <el-table-column prop="name" label="版本代号">
                    <template slot-scope="scope">{{scope.row.mimiProgramVersion}}</template>
                </el-table-column>
                <el-table-column prop="number" label="审核状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.mimiProgramStatus=='1'" type="info">未审核</el-tag>
                        <el-tag v-else-if="scope.row.mimiProgramStatus=='2'">审核中</el-tag>
                        <el-tag v-else-if="scope.row.mimiProgramStatus=='3'" type="success">审核成功</el-tag>
                        <el-tag v-else-if="scope.row.mimiProgramStatus=='4'" type="danger">审核失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="setProgram(scope.$index, scope.row)"
                        >设置</el-button>
                        <el-button type="text" icon="el-icon-upload">上传代码</el-button>
                        <el-button type="text" icon="el-icon-thumb">提交审核</el-button>
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
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="第三方平台设置" :visible.sync="editVisible">
            <div>
                <span style="font-weight: bold">服务器域名</span>
                <el-form :model="setForm">
                    <el-form-item
                        label="request合法域名:"
                        :label-width="formLabelWidth"
                        :required="true"
                    >
                        <div
                            v-for="(item, index) in setForm.requestList"
                            style="margin-bottom: 5px"
                            :key="index"
                        >
                            <div>
                                <el-input style="width:300px;" v-model="item.url">
                                    <template slot="prepend">https://</template>
                                </el-input>
                                <span
                                    v-if="index == 0"
                                    style="color: red;cursor: pointer;margin-left: 10px;"
                                    @click="addRequestUrl"
                                >添加</span>
                                <span
                                    v-else
                                    style="color: red;cursor: pointer;margin-left: 10px;"
                                    @click="deleteRequestUrl(index)"
                                >删除</span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="socket合法域名:" :label-width="formLabelWidth">
                        <div
                            v-for="(item, index) in setForm.socketList"
                            style="margin-bottom: 5px"
                            :key="index"
                        >
                            <div>
                                <el-input style="width:300px;" v-model="item.url">
                                    <template slot="prepend">wss://</template>
                                </el-input>
                                <span
                                    v-if="index == 0"
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="addSocketUrl"
                                >添加</span>
                                <span
                                    v-else
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="deleteSocketUrl(index)"
                                >删除</span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="uploadFile合法域名:" :label-width="formLabelWidth">
                        <div
                            v-for="(item, index) in setForm.uploadFileList"
                            style="margin-bottom: 5px"
                            :key="index"
                        >
                            <div>
                                <el-input style="width:300px;" v-model="item.url">
                                    <template slot="prepend">https://</template>
                                </el-input>
                                <span
                                    v-if="index == 0"
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="addUploadFileUrl"
                                >添加</span>
                                <span
                                    v-else
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="deleteUploadFileUrl(index)"
                                >删除</span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="downloadFile合法域名:" :label-width="formLabelWidth">
                        <div
                            v-for="(item, index) in setForm.downloadFileList"
                            style="margin-bottom: 5px"
                            :key="index"
                        >
                            <div>
                                <el-input style="width:300px;" v-model="item.url">
                                    <template slot="prepend">https://</template>
                                </el-input>
                                <span
                                    v-if="index == 0"
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="addDownloadFileUrl"
                                >添加</span>
                                <span
                                    v-else
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="deleteDownloadFileUrl(index)"
                                >删除</span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="udp合法域名:" :label-width="formLabelWidth">
                        <div
                            v-for="(item, index) in setForm.udpList"
                            style="margin-bottom: 5px"
                            :key="index"
                        >
                            <div>
                                <el-input style="width:300px;" v-model="item.url">
                                    <template slot="prepend">udp://</template>
                                </el-input>
                                <span
                                    v-if="index == 0"
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="addUdpUrl"
                                >添加</span>
                                <span
                                    v-else
                                    style="color:red;cursor: pointer;margin-left: 10px;"
                                    @click="deleteUdpUrl(index)"
                                >删除</span>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <span style="font-weight: bold;">体验者</span>
                <el-form :model="experienceForm">
                    <el-form-item
                        label="添加体验者:"
                        :label-width="formLabelWidth"
                        :required="true"
                        >
                        <div
                            v-for="(item, index) in experienceForm.wxIdList"
                            style="margin-bottom: 5px"
                            :key="index"
                        >
                            <div>
                                <el-input style="width:300px;" v-model="item.id" placeholder="微信号">
                                </el-input>
                                <span
                                    v-if="index == 0"
                                    style="color: red;cursor: pointer;margin-left: 10px;"
                                    @click="addWxId"
                                >添加</span>
                                <span
                                    v-else
                                    style="color: red;cursor: pointer;margin-left: 10px;"
                                    @click="deleteWxId(index)"
                                >删除</span>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="giveUp">取 消</el-button>
                <el-button type="primary" @click="sureUrl">保存并提交</el-button>
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
            tableData: [
                {
                    mimiProgramName: 'aaa',
                    mimiProgramAppId: '111111',
                    mimiProgramVersion: '1.0.0',
                    mimiProgramStatus: 1
                },
                {
                    mimiProgramName: 'bbb',
                    mimiProgramAppId: '222222',
                    mimiProgramVersion: '1.0.0',
                    mimiProgramStatus: 2
                },
                {
                    mimiProgramName: 'ccc',
                    mimiProgramAppId: '333333',
                    mimiProgramVersion: '1.0.0',
                    mimiProgramStatus: 3
                },
                {
                    mimiProgramName: 'ddd',
                    mimiProgramAppId: '444444',
                    mimiProgramVersion: '1.0.0',
                    mimiProgramStatus: 4
                },
                {
                    mimiProgramName: 'eee',
                    mimiProgramAppId: '555555',
                    mimiProgramVersion: '1.0.0',
                    mimiProgramStatus: 1
                },
                {
                    mimiProgramName: 'fff',
                    mimiProgramAppId: '666666',
                    mimiProgramVersion: '1.0.0',
                    mimiProgramStatus: 2
                },
                {
                    mimiProgramName: 'ggg',
                    mimiProgramAppId: '777777',
                    mimiProgramVersion: '1.0.0',
                    mimiProgramStatus: 3
                },
                {
                    mimiProgramName: 'hhh',
                    mimiProgramAppId: '888888',
                    mimiProgramVersion: '1.0.0',
                    mimiProgramStatus: 4
                }
            ],
            query: {
                pageNo: 1,
                pageSize: 15
            },
            setForm: {
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
                ],
                udpList: [
                    {
                        url: ''
                    }
                ]
            },
            requestUrlList: [],
            socketUrlList: [],
            uploadFileUrlList: [],
            downloadFileUrlList: [],
            udpUrlList: [],
            experienceForm: {
                wxIdList: [
                    {
                        id : ''
                    }
                ]
            },
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            formLabelWidth: '180px'
        };
    },
    created() {},
    mounted() {},
    methods: {
        setProgram() {
            this.editVisible = true;
        },

        // 添加删除request合法域名
        addRequestUrl() {
            this.setForm.requestList.push({ url: '' });
        },
        deleteRequestUrl(index) {
            this.setForm.requestList.splice(index, 1);
        },

        // 添加删除socket合法域名
        addSocketUrl() {
            this.setForm.socketList.push({ url: '' });
        },
        deleteSocketUrl(index) {
            this.setForm.socketList.splice(index, 1);
        },

        // 添加删除uploadFile合法域名
        addUploadFileUrl() {
            this.setForm.uploadFileList.push({ url: '' });
        },
        deleteUploadFileUrl(index) {
            this.setForm.uploadFileList.splice(index, 1);
        },

        // 添加删除downloadFile合法域名
        addDownloadFileUrl() {
            this.setForm.downloadFileList.push({ url: '' });
        },
        deleteDownloadFileUrl(index) {
            this.setForm.downloadFileList.splice(index, 1);
        },

        // 添加删除udp合法域名
        addUdpUrl() {
            this.setForm.udpList.push({ url: '' });
        },
        deleteUdpUrl(index) {
            this.setForm.udpList.splice(index, 1);
        },

        // 添加删除体验者
        addWxId() {
            this.experienceForm.wxIdList.push({ id: '' });
        },
        deleteWxId(index) {
            this.experienceForm.wxIdList.splice(index, 1);
        },

        // 取消
        giveUp() {
            this.setForm.requestList = [{ url: '' }];
            this.requestUrlList = [];
            this.editVisible = false;
        },
        sureUrl() {
            for (let i = 0; i < this.setForm.requestList.length; i++) {
                if (this.setForm.requestList[i].url == '') {
                    return;
                }
            }
            let requestUrlList = JSON.stringify(this.setForm.requestList);
            this.requestUrlList = JSON.parse(requestUrlList);
            for (let i = 0; i < this.requestUrlList.length; i++) {
                this.requestUrlList[i].url = 'https://' + this.requestUrlList[i].url;
            }
            let socketUrlList = JSON.stringify(this.setForm.socketList);
            this.socketUrlList = JSON.parse(socketUrlList);
            for (let i = 0; i < this.socketUrlList.length; i++) {
                this.socketUrlList[i].url = 'wss://' + this.socketUrlList[i].url;
            }
            let uploadFileUrlList = JSON.stringify(this.setForm.uploadFileList);
            this.uploadFileUrlList = JSON.parse(uploadFileUrlList);
            for (let i = 0; i < this.uploadFileUrlList.length; i++) {
                this.uploadFileUrlList[i].url = 'https://' + this.uploadFileUrlList[i].url;
            }
            let downloadFileUrlList = JSON.stringify(this.setForm.downloadFileList);
            this.downloadFileUrlList = JSON.parse(downloadFileUrlList);
            for (let i = 0; i < this.downloadFileUrlList.length; i++) {
                this.downloadFileUrlList[i].url = 'https://' + this.downloadFileUrlList[i].url;
            }
            let udpUrlList = JSON.stringify(this.setForm.udpList);
            this.udpUrlList = JSON.parse(udpUrlList);
            for (let i = 0; i < this.udpUrlList.length; i++) {
                this.udpUrlList[i].url = 'udp://' + this.udpUrlList[i].url;
            }
            this.editVisible = false;
        },
        // setProgram(index, row) {
        //     //是否拥有修改权限
        //     const loading = this.$loading({
        //         lock: true,
        //         text: 'Loading',
        //         spinner: 'el-icon-loading',
        //         background: 'rgba(0, 0, 0, 0.7)',
        //         target: document.querySelector('.div1')
        //     });
        //     this.idx = index;
        //     this.form = row;
        //     var jsonArr = [];
        //     jsonArr.push({ key: 'id', value: row.id });
        //     let sign = md5(preSign(jsonArr));
        //     jsonArr.push({ key: 'sign', value: sign });
        //     let params = ParamsAppend(jsonArr);
        //     https
        //         .fetchPost('/thirdPrice/getThirdPriceById', params)
        //         .then(data => {
        //             loading.close();
        //             if (data.data.code == 'success') {
        //                 this.editVisible = true;
        //                 this.oCinemaName = JSON.parse(Decrypt(data.data.data)).cinemaName;
        //                 this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).cinemaCode;
        //                 this.oScreenName = JSON.parse(Decrypt(data.data.data)).screenName;
        //                 this.oFilmName = JSON.parse(Decrypt(data.data.data)).filmName;
        //                 this.oTypeName = JSON.parse(Decrypt(data.data.data)).typeName;
        //                 this.oShowTime = JSON.parse(Decrypt(data.data.data)).showTime;
        //                 this.oSettlePrice = JSON.parse(Decrypt(data.data.data)).settlePrice;
        //                 this.oId = JSON.parse(Decrypt(data.data.data)).id;
        //             } else if (data.data.code == 'nologin') {
        //                 this.message = data.data.message;
        //                 this.open();
        //                 this.$router.push('/login');
        //             } else {
        //                 this.message = data.data.message;
        //                 this.open();
        //             }
        //         })
        //         .catch(err => {
        //             loading.close();
        //             console.log(err);
        //         });
        // },
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
            let screenName = this.query.screenName;
            let typeCode = this.query.typeCode;
            let filmName = this.query.filmName;
            if (!cinemaCode) {
                cinemaCode = '';
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
                .fetchPost('/thirdPrice/thirdPricePage', params)
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
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
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

