<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 演员管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="演员名称" class="handle-input mr10"></el-input>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >添加</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="sort" label="图片" width="200px">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img :src="scope.row.picture" />
                            <img
                                slot="reference"
                                :src="scope.row.picture"
                                :alt="scope.row.picture"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="国家">
                    <template slot-scope="scope">{{scope.row.country}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="介绍">
                    <template slot-scope="scope">{{scope.row.introduction}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
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
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="演员名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="国家" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.country" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="介绍" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.introduction" autocomplete="off"  type="textarea" maxlength="200" show-word-limit></el-input>
                </el-form-item>
                <el-form-item :required="true" label="演员图片" :label-width="formLabelWidth">
                    <el-upload
                        :data="type"
                        class="upload-demo"
                        drag
                        :limit="1"
                        ref="upload"
                        :before-upload="beforeUpload"
                        action="api/upload/uploadImage"
                        :on-success="setPicture"
                        multiple
                        list-type="picture"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb 建议尺寸140*195或按比例上传</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="演员名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="国家" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oCountry" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="介绍" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oIntroduction" autocomplete="off" type="textarea" maxlength="200" show-word-limit></el-input>
                </el-form-item>
                <el-form-item :required="true" label="演员图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img :src="oPicture" />
                        <img
                            slot="reference"
                            :src="oPicture"
                            :alt="oPicture"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :data="type"
                        class="upload-demo"
                        drag
                        ref="download"
                        :limit="1"
                        action="api/upload/uploadImage"
                        :before-upload="beforeUpload"
                        :on-success="onSuccess"
                        list-type="picture"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb 建议尺寸140*195或按比例上传</div>
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
            type: {
                type: 'performer'
            },
            oName: '',
            oCountry: '',
            oIntroduction: '',
            oPicture: '',
            oId: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            tableData: [],
            multipleSelection: [],
            editVisible: false,
            form: {},
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            oForm: {
                name: '',
                country: '',
                introduction: '',
                picture: '',
                id: '',
                type: []
            },
            formLabelWidth: '120px',
            value: ''
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
            https.fetchPost('/actor/addPage', '').then(data => {
                loading.close();
                    console.log(data);
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
            //新增按钮操作
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if(!this.oForm.name||!this.oForm.picture){
                this.message = '必填项不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            var jsonArr = [];
            jsonArr.push({ key: 'name', value: this.oForm.name });
            jsonArr.push({ key: 'country', value: this.oForm.country });
            jsonArr.push({ key: 'introduction', value: this.oForm.introduction });
            jsonArr.push({ key: 'picture', value: this.oForm.picture });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https.fetchPost('/actor/addActor', params).then(data => {
                        //新增
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$refs.upload.clearFiles();//清除已上传文件
                            this.$message.success(`新增成功`);
                            this.oForm.name = '';
                            this.oForm.country = '';
                            this.oForm.introduction = '';
                            this.oForm.picture = '';
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
                    this.idx = index;
                    this.form = row;
                    let jsonArr = [];
                    jsonArr.push({key: 'id', value: row.id});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({key: 'sign', value: sign});
                    let params = ParamsAppend(jsonArr);
                    https.fetchPost('/actor/deleteActor', params).then(data => {
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
            //是否修改权限
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
            https.fetchPost('/actor/getActorById', params).then(data => {
                    // console.log(data)
                    loading.close();
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.oName = JSON.parse(Decrypt(data.data.data)).name;
                        this.oCountry = JSON.parse(Decrypt(data.data.data)).country;
                        this.oIntroduction = JSON.parse(Decrypt(data.data.data)).introduction;
                        this.oPicture = JSON.parse(Decrypt(data.data.data)).picture;
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
            loading.close();
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
            if(!this.oName||!this.oPicture){
                this.message = '必填项不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            var jsonArr = [];
            jsonArr.push({ key: 'name', value: this.oName });
            jsonArr.push({ key: 'country', value: this.oCountry });
            jsonArr.push({ key: 'introduction', value: this.oIntroduction });
            jsonArr.push({ key: 'picture', value: this.oPicture });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https.fetchPost('/actor/updateActor', params).then(data => {
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = false;
                        this.$message.success(`编辑成功`);
                        this.$refs.download.clearFiles();//清除已上传文件
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
            loading.close();
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
            jsonArr.push({ key: 'name', value: name });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https.fetchPost('/actor/actorPage', params).then(data => {
                    loading.close();
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
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        beforeUpload(file) {
            //上传之前
            this.type.type = EncryptReplace('performer');
            const isLt200Kb = file.size / 1024 < 200;
            if (!isLt200Kb) {
                this.message = '图片大小不能超过200kb！';
                this.open();
                return false
            }
            return isLt200Kb
        },
        onSuccess(data) {
            // 修改图片
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.download.clearFiles();
                return;
            }
            this.oPicture = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        setPicture(data) {
            // 上传图片
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.upload.clearFiles();
                return;
            }
            console.log(data);
            this.oForm.picture = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
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
