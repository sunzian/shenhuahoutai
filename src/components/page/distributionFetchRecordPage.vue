<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户分销提现记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input
                    placeholder="手机号"
                    v-model="query.userMobile"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    placeholder="提现编号"
                    v-model="query.fetchCode"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option key="0" label="审核中" value="0"></el-option>
                    <el-option key="1" label="成功" value="1"></el-option>
                    <el-option key="-1" label="提现失败" value="-1"></el-option>
                </el-select>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    style="margin-top: 10px;width: 90px;"
                    @click="Search"
                >搜索</el-button>
                <el-button
                        type="primary"
                        @click="derive"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px"
                >导出</el-button>
                <el-button
                        type="primary"
                        @click="downderive"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px;margin-left:10px"
                >导入
                </el-button>
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
                <el-table-column label="提现编号">
                    <template slot-scope="scope">{{scope.row.fetchCode}}</template>
                </el-table-column>
                <el-table-column label="持卡人">
                    <template slot-scope="scope">{{scope.row.cardHolder}}</template>
                </el-table-column>
                <el-table-column label="用户手机号">
                    <template slot-scope="scope">{{scope.row.userMobile}}</template>
                </el-table-column>
                <el-table-column label="提现金额">
                    <template slot-scope="scope">{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column label="开户银行">
                    <template slot-scope="scope">{{scope.row.bankName}}</template>
                </el-table-column>
                <el-table-column label="收款账号">
                    <template slot-scope="scope">{{scope.row.cardNumber}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="卡类型" width="110">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cardType=='1'" type="danger">储蓄卡</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="提现状态" width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'" type="danger">成功</el-tag>
                        <el-tag v-else-if="scope.row.status=='-1'" type="success">提现失败</el-tag>
                        <el-tag v-else-if="scope.row.status=='0'" type="success">审核中</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="160" >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="addChange(scope.$index, scope.row)"
                        >查看</el-button>
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
        <!-- 详情弹出框 -->
        <el-dialog :close-on-click-modal="false" title="详情" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="提现编号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.fetchCode"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="卡类型" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cardType"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="开户银行" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.bankName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="开户支行" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.branchBankName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="收款账号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cardNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="持卡人" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cardHolder"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="身份证号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.identityNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="联系电话" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.userMobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="提现金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.userMobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="提现状态" :label-width="formLabelWidth">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.status == '-1'" :required="true" label="提现返回结果" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        style="width: 250px"
                        v-model="form.result"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 导入excel -->
        <el-dialog :close-on-click-modal="false" title="导入excel" :visible.sync="excelVisible">
            <el-form :model="excelForm">
                <el-form-item :required="true" label="下载导入模板：" :label-width="formLabelWidth">
                    <a
                            href="https://wanht.oss-cn-hangzhou.aliyuncs.com/images/business/2020-07/202007031152475c8228.xlsx"
                    >点击下载模板</a>
                </el-form-item>
                <el-form-item :required="true" label="选择excel文件：" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            :action="uploadAction"
                            ref="upload"
                            :on-change="changeExcel"
                            :on-success="uploadExcel"
                            :before-upload="beforeExcel"
                            :auto-upload="false"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">请按模板上传，上传模板只能是 xls、xlsx格式!</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="excelVisible = false">取 消</el-button>
                <el-button type="primary" @click="downExcel">确 定</el-button>
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
            totalData: [],
            tableData: [],
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            successUpLoad: false,
            excelForm: {},
            uploadAction: 'api/distributionFetchRecord/importExcelFetchCode',
            excelVisible: false,
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            rowMess:'',
            formLabelWidth: '120px',
            businessInfoList: [],
            value: '',
            form: [],
            cinemaInfo: [],
            status: [
                {
                    value: '0',
                    label: '审核中'
                },
                {
                    value: '1',
                    label: '成功'
                },
                {
                    value: '-1',
                    label: '提现失败'
                }
            ]
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        downderive() {
            this.excelVisible = true;
        },
        changeExcel(file, fileList) {
            this.hasExcel = true;
        },
        beforeExcel(file) {
            const extension = file.name.split('.')[file.name.split('.').length - 1] === 'xls';
            const extension2 = file.name.split('.')[file.name.split('.').length - 1] === 'xlsx';
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (!extension && !extension2) {
                this.message = '上传模板只能是 xls、xlsx格式!';
                this.open();
            }
            if (!isLt2M) {
                this.message = '上传模板大小不能超过 10MB!';
                this.open();
            }
            return extension || extension2;
        },
        uploadExcel(response) {
            this.successUpLoad = true;
            this.message = response.message;
            this.open();
            this.$refs.upload.clearFiles();
            this.hasExcel = false;
            this.excelVisible = false;
        },
        downExcel() {
            if (this.hasExcel == false) {
                this.message = '请上传文件！';
                this.open();
                return;
            }
            this.$refs.upload.submit();
            this.getMenu();
        },
        derive(){
            setTimeout(() => {
                let fetchCode = this.query.fetchCode;
                let status = this.query.status;
                let userMobile = this.query.userMobile;
                if (!fetchCode) {
                    fetchCode = '';
                }
                if (!status) {
                    status = '';
                }
                if (!userMobile) {
                    userMobile = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'fetchCode', value: fetchCode });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'userMobile', value: userMobile });
                jsonArr.push({ key: 'tableName', value: "member_user" });
                jsonArr.push({ key: 'exportKeysJson', value: "['userMobile','cardTypeString','bankName','branchBankName','cardNumber','cardHolder','identityNumber','concatMobile','money','result','fetchCode','statusString']"});
                jsonArr.push({ key: 'exportTitlesJson', value:"['用户手机号','卡类型','开户银行','开户支行','收款账号','持卡人','身份证号','联系电话','提现金额','提现返回结果','提现编号','状态']" });
                var params = ParamsAppend(jsonArr);
                let myObj = {
                    method: 'get',
                    url: '/exportExcel/distributionFetchRecord',
                    fileName: '用户分销提现记录统计',
                    params: params
                };
                https.exportCouponMethod(myObj);
            }, 500);
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
                    .fetchPost('/distributionFetchRecord/getById', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            this.form.id = row.id;
                            this.form = JSON.parse(Decrypt(data.data.data));
                            console.log(JSON.parse(Decrypt(data.data.data)))
                            if (JSON.parse(Decrypt(data.data.data)).cardType == 1) {
                                this.form.cardType = '储蓄卡';
                            }
                            for (let x in this.status) {
                                if (this.status[x].value == JSON.parse(Decrypt(data.data.data)).status) {
                                    this.form.status = this.status[x].value;
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
        exChanger() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if (!this.form.status) {
                this.message = '提现状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.form.status == '-1') {
                if (!this.form.result || this.form.result == '') {
                    this.message = '提现返回结果不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            setTimeout(() => {
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: this.form.id });
                jsonArr.push({ key: 'status', value: this.form.status });
                if (this.form.status == '-1') {
                    jsonArr.push({ key: 'result', value: this.form.result });
                }
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/distributionFetchRecord/updateStatusById', params)
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
                let fetchCode = this.query.fetchCode;
                let status = this.query.status;
                let userMobile = this.query.userMobile;
                if (!fetchCode) {
                    fetchCode = '';
                }
                if (!status) {
                    status = '';
                }
                if (!userMobile) {
                    userMobile = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'fetchCode', value: fetchCode });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'userMobile', value: userMobile });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                console.log(jsonArr)
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/distributionFetchRecord/page', params)
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

