<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 卖品优惠券
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="选择影院" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="margin-left: 690px"
                >生成优惠券</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="适用影院">
                    <template slot-scope="scope">{{scope.row.cinemaNames}}</template>
                </el-table-column>
                <el-table-column prop="name" label="卡券类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.reduceType == 1" type="success">兑换券</el-tag>
                        <el-tag v-else type="danger">代金券</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="卡券名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="有效期">
                    <template slot-scope="scope">{{scope.row.startDate}}至{{scope.row.endDate}}</template>
                </el-table-column>
                <!-- <el-table-column prop="sort" label="有效天数">
                    <template slot-scope="scope">{{scope.row.publishDate}}</template>
                </el-table-column> -->
                <el-table-column prop="sort" label="满多少可用">
                    <template slot-scope="scope">{{scope.row.achieveMoney}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="优惠金额">
                    <template slot-scope="scope">{{scope.row.discountMoney}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已发放">
                    <template slot-scope="scope">{{scope.row.sendNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已领取">
                    <template slot-scope="scope">{{scope.row.acquireNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已使用">
                    <template slot-scope="scope">{{scope.row.usedNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.$index, scope.row)"
                        >查看详情</el-button>
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
        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="影片编码" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.filmCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影片名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.filmName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影片版本" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.version" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影片时长" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.duration" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上映时间" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.publishDate" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="可选导演列表" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.directorId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="已选导演" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.directorId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="可选演员列表" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.castId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="已选演员" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.castId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影片介绍" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.introduction" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="评分" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.score" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地区" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.area" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.type" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="语言" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.language" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否通过" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.status" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.image" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影片剧照" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.stagePhoto" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="预告片" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.trailer" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="影片编码" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oFilmCode" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="影片名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oFilmName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影片版本" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oVersion" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影片时长" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oDuration" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上映时间" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oPublishDate" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="可选导演列表" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oDirectorId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="已选导演" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oDirectorId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="可选演员列表" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oCastId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="已选演员" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oCastId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影片介绍" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oIntroduction" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="评分" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oScore" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地区" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oArea" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="语言" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oLanguage" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否通过" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oStatus" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oImage" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影片剧照" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oStagePhoto" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="预告片" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oTrailer" autocomplete="off"></el-input>
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
            oArea: '',
            oCastId: '',
            oCreateDate: '',
            oDirectorId: '',
            oDuration: '',
            oFilmCode: '',
            oId: '',
            oImage: '',
            oIntroduction: '',
            oLanguage: '',
            oProducer: '',
            oPublishDate: '',
            oPublisher: '',
            oScore: '',
            oStagePhoto: '',
            oStatus: '',
            oTrailer: '',
            oType: '',
            oVersion: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            selectScreen: '', // 选中的影厅
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            options: [],
            oForm: {
                area: '',
                castId: '',
                createDate: '',
                directorId: '',
                duration: '',
                filmCode: '',
                filmName: '',
                id: '',
                image: '',
                introduction: '',
                language: '',
                producer: '',
                publishDate: '',
                publisher: '',
                score: '',
                stagePhoto: '',
                status: '',
                trailer: '',
                type: '',
                version: ''
            },
            formLabelWidth: '120px',
            selectValue: {},
            cinemaInfo: [],
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
            https
                .fetchPost('/film/addPage', '')
                .then(data => {
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
                    console.log(err);
                });
            loading.close();
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
            var jsonArr = [];
            jsonArr.push({ key: 'filmCode', value: this.oForm.filmCode });
            jsonArr.push({ key: 'filmName', value: this.oForm.filmName });
            jsonArr.push({ key: 'version', value: this.oForm.version });
            jsonArr.push({ key: 'duration', value: this.oForm.duration });
            jsonArr.push({ key: 'publishDate', value: this.oForm.publishDate });
            jsonArr.push({ key: 'directorId', value: this.oForm.directorId });
            jsonArr.push({ key: 'castId', value: this.oForm.castId });
            jsonArr.push({ key: 'introduction', value: this.oForm.introduction });
            jsonArr.push({ key: 'score', value: this.oForm.score });
            jsonArr.push({ key: 'area', value: this.oForm.area });
            jsonArr.push({ key: 'type', value: this.oForm.type });
            jsonArr.push({ key: 'language', value: this.oForm.language });
            jsonArr.push({ key: 'status', value: this.oForm.status });
            jsonArr.push({ key: 'image', value: this.oForm.image });
            jsonArr.push({ key: 'trailer', value: this.oForm.trailer });
            jsonArr.push({ key: 'stagePhoto', value: this.oForm.stagePhoto });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/film/addFilm', params)
                    .then(data => {
                        //新增
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.oForm.filmCode = '';
                            this.oForm.filmName = '';
                            this.oForm.version = '';
                            this.oForm.duration = '';
                            this.oForm.publishDate = '';
                            this.oForm.directorId = '';
                            this.oForm.castId = '';
                            this.oForm.introduction = '';
                            this.oForm.score = '';
                            this.oForm.area = '';
                            this.oForm.type = '';
                            this.oForm.language = '';
                            this.oForm.status = '';
                            this.oForm.image = '';
                            this.oForm.trailer = '';
                            this.oForm.stagePhoto = '';
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
                        console.log(err);
                    });
            }
            loading.close();
        },
        delChange(index, row) {
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
            let name = this.query.name;
            let status = this.query.status;
            if (!name) {
                name = '';
            }
            if (!status) {
                status = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/film/deleteFilm', params)
                .then(data => {
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
                    console.log(err);
                });
            loading.close();
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
            https
                .fetchPost('/film/getFilmById', params)
                .then(data => {
                    // console.log(data);
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.oArea = JSON.parse(Decrypt(data.data.data)).area;
                        this.oCastId = JSON.parse(Decrypt(data.data.data)).castId;
                        this.oCreateDate = JSON.parse(Decrypt(data.data.data)).createDate;
                        this.oDirectorId = JSON.parse(Decrypt(data.data.data)).directorId;
                        this.oDuration = JSON.parse(Decrypt(data.data.data)).duration;
                        this.OFilmCode = JSON.parse(Decrypt(data.data.data)).filmCode;
                        this.OFilmName = JSON.parse(Decrypt(data.data.data)).filmName;
                        this.oId = JSON.parse(Decrypt(data.data.data)).id;
                        this.oImage = JSON.parse(Decrypt(data.data.data)).image;
                        this.oIntroduction = JSON.parse(Decrypt(data.data.data)).introduction;
                        this.oLanguage = JSON.parse(Decrypt(data.data.data)).language;
                        this.oProducer = JSON.parse(Decrypt(data.data.data)).producer;
                        this.oPublishDate = JSON.parse(Decrypt(data.data.data)).publishDate;
                        this.oPublisher = JSON.parse(Decrypt(data.data.data)).publisher;
                        this.oScore = JSON.parse(Decrypt(data.data.data)).score;
                        this.oStagePhoto = JSON.parse(Decrypt(data.data.data)).stagePhoto;
                        this.oStatus = JSON.parse(Decrypt(data.data.data)).status;
                        this.oTrailer = JSON.parse(Decrypt(data.data.data)).trailer;
                        this.oType = JSON.parse(Decrypt(data.data.data)).type;
                        this.oVersion = JSON.parse(Decrypt(data.data.data)).version;
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
            var jsonArr = [];
            jsonArr.push({ key: 'filmCode', value: this.oFilmCode });
            jsonArr.push({ key: 'filmName', value: this.oFilmName });
            jsonArr.push({ key: 'version', value: this.oVersion });
            jsonArr.push({ key: 'duration', value: this.oDuration });
            jsonArr.push({ key: 'publishDate', value: this.oPublishDate });
            jsonArr.push({ key: 'directorId', value: this.oDirectorId });
            jsonArr.push({ key: 'castId', value: this.oCastId });
            jsonArr.push({ key: 'introduction', value: this.oIntroduction });
            jsonArr.push({ key: 'score', value: this.oScore });
            jsonArr.push({ key: 'area', value: this.oArea });
            jsonArr.push({ key: 'type', value: this.oType });
            jsonArr.push({ key: 'language', value: this.oLanguage });
            jsonArr.push({ key: 'status', value: this.oStatus });
            jsonArr.push({ key: 'image', value: this.oImage });
            jsonArr.push({ key: 'trailer', value: this.oTrailer });
            jsonArr.push({ key: 'stagePhoto', value: this.oStagePhoto });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            this.editVisible = false;
            https
                .fetchPost('/film/updateFilm', params)
                .then(data => {
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
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
            // jsonArr.push({ key: 'filmName', value: name });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('merchandiseCoupon/merchandiseCouponPage', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData.pageResult);
                        // console.log(this.query);
                        this.tableData = oData.pageResult.data;
                        this.query.pageSize = oData.pageResult.pageSize;
                        this.query.pageNo = oData.pageResult.pageNo;
                        this.query.totalCount = oData.pageResult.totalCount;
                        this.query.totalPage = oData.pageResult.totalPage;
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
            loading.close();
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
