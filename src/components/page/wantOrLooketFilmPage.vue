<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影片评论管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select style="margin-bottom: 10px" clearable v-model="query.cinemaCode" placeholder="请选择影院" class="mr10">
                    <el-option
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-input v-model="query.filmName" placeholder="影片名" class="handle-input mr10"></el-input>
                <el-select clearable v-model="query.status" placeholder="通过状态" class="mr10">
                    <el-option key="1" label="未审核" value="1"></el-option>
                    <el-option key="2" label="通过" value="2"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                highlight-current-row
                header-cell-class-name="table-header"
             >
                <el-table-column prop="name" label="影院名称" width="200">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影片名称" width="160">
                    <template slot-scope="scope">{{scope.row.filmName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="评论用户名称" width="160">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="评论内容" width="230">
                    <template slot-scope="scope">{{scope.row.comment}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="评论时间" width="160">
                    <template slot-scope="scope">{{scope.row.commentDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="通过状态" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1">未审核</el-tag>
                        <el-tag v-else>通过</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="点赞数量" width="100">
                    <template slot-scope="scope">{{scope.row.thumbNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="评分" width="100">
                    <template slot-scope="scope">{{scope.row.score}}</template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="success"
                                @click="changeStatus(scope.$index, scope.row)"
                        >通过
                        </el-button>
                        <el-button
                                type="danger"
                                @click="delChange(scope.$index, scope.row)"
                        >不通过
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.$index,scope.row)"
                        >查看</el-button>
                        <!--<el-button-->
                            <!--type="text"-->
                            <!--icon="el-icon-delete"-->
                            <!--@click="delChange(scope.$index,scope.row)"-->
                        <!--&gt;删除</el-button>-->
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
        <el-dialog :close-on-click-modal="false" title="详情" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="影院名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oCinemaName" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="影片名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oFilmName" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="评论用户名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oUserName" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="评论内容" :label-width="formLabelWidth">
                    <el-input style="width: 250px" type="textarea" v-model="oComment" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="评论时间" :label-width="formLabelWidth">
                    <el-input style="width: 250px" disabled v-model="oCommentDate" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="点赞数量" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oThumbNumber" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="评分" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oScore" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="通过状态" :label-width="formLabelWidth">
                    <el-select v-model="oStatus" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="管理员回复" :label-width="formLabelWidth">
                    <el-input style="width: 250px" type="textarea" v-model="oReplyComment" maxlength="100"
                        show-word-limit autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="回复时间" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oReplyDate" autocomplete="off" disabled></el-input>
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
            oFilmName: '',
            oCinemaName: '',
            oUserName: '',
            oComment: '',
            oCommentDate: '',
            oThumbNumber: '',
            oReplyComment: '',
            oId: '',
            oReplyDate: '',
            oScore: '',
            oStatus: '',
            oTrailer: '',
            oType: '',
            rowMess: '',
            videoFlag: false,
            videoForm: {},
            type: {
                type: ''
            },
            photoType: {
                type: ''
            },
            dialogImageUrl: '',
            dialogVisible: false,
            oDimensional: '',
            oCommentType: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                oPageNo: 1,
                opageSize: 15,
                aPageNo: 1,
                apageSize: 15,
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            fileList: [],
            videoList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: '',
            dialogFormVisible: false,
            videoUploadPercent: 0,
            options: [
                {
                    value: '1',
                    label: '不通过'
                },
                {
                    value: '2',
                    label: '通过'
                }
            ],
            formLabelWidth: '120px',
            selectValue: {},
            cinemaInfo: [],
            value: ''
        };
    },
    created() {},
    mounted() {
        this.getMenu();
        this.getAllCinema();
    },
    methods: {
        // 修改状态
        changeStatus(index, row) {
            this.$confirm('是否确定通过此评论?', '提示', {
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
                    var jsonArr = [];
                    jsonArr.push({key: 'id', value: row.id});
                    jsonArr.push({key: 'commentType', value: row.commentType});
                    jsonArr.push({key: 'status', value: 2});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({key: 'sign', value: sign});
                    console.log(jsonArr);
                    let params = ParamsAppend(jsonArr);
                    https.fetchPost('/wantOrLooketFilm/updateStatus', params).then(data => {
                        loading.close();
                        console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.$message.success(`修改成功`);
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
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消修改'
                });
            })
        },
        delChange(index, row) {
            //删除数据
            this.$confirm('是否确定不通过此评论?', '提示', {
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
                    let jsonArr = [];
                    jsonArr.push({ key: 'id', value: row.id });
                    jsonArr.push({ key: 'commentType', value: row.commentType });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/wantOrLooketFilm/deleteById', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.$message.error(`修改成功`);
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
                })  .catch(() => {
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
            jsonArr.push({ key: 'commentType', value: row.commentType });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/wantOrLooketFilm/getCommodityDetailById', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).cinemaName;
                        this.oCommentType = JSON.parse(Decrypt(data.data.data)).commentType;
                        this.oFilmName = JSON.parse(Decrypt(data.data.data)).filmName;
                        this.oUserName = JSON.parse(Decrypt(data.data.data)).userName;
                        this.oComment = JSON.parse(Decrypt(data.data.data)).comment;
                        this.oCommentDate = JSON.parse(Decrypt(data.data.data)).commentDate;
                        this.oThumbNumber = JSON.parse(Decrypt(data.data.data)).thumbNumber;
                        this.oReplyComment = JSON.parse(Decrypt(data.data.data)).replyComment;
                        this.oReplyDate = JSON.parse(Decrypt(data.data.data)).replyDate;
                        this.oScore = JSON.parse(Decrypt(data.data.data)).score;
                        this.oId = JSON.parse(Decrypt(data.data.data)).id;
                        for (let x in this.options) {
                            if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).status) {
                                this.oStatus = this.options[x].value;
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
            var jsonArr = [];
            jsonArr.push({ key: 'replyComment', value: this.oReplyComment });
            jsonArr.push({ key: 'commentType', value: this.oCommentType });
            jsonArr.push({ key: 'status', value: this.oStatus });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/wantOrLooketFilm/updateStatusOrReplyComment', params)
                .then(data => {
                    loading.close();
                    // console.log(JSON.parse(Decrypt(data.data.data)));
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
            let cinemaCode = this.query.cinemaCode;
            let filmName = this.query.filmName;
            if (!name) {
                name = '';
            }
            if (!filmName) {
                filmName = '';
            }
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!status) {
                status = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            jsonArr.push({ key: 'userName', value: name });
            jsonArr.push({ key: 'filmName', value: filmName });
            jsonArr.push({ key: 'status', value: status });
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/wantOrLooketFilm/page', params)
                .then(data => {
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
        },
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
        // 获取所有导演
        getAllDirector() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let directorName = this.query.directorName;
            if (!directorName) {
                directorName = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'pageNo', value: this.query.oPageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.oPageSize });
            jsonArr.push({ key: 'name', value: directorName });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/director/directorPage',params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let director = JSON.parse(Decrypt(data.data.data));
                        console.log(director);
                        this.allDirector = true;
                        this.directorTableData = director.data;
                        this.query.oPageSize = director.pageSize;
                        this.query.oPageNo = director.pageNo;
                        this.query.oTotalCount = director.totalCount;
                        this.query.oTotalPage = director.totalPage;
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
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
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
