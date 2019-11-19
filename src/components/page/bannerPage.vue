<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 轮播图管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
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
                </el-select>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="显示" value="1"></el-option>
                    <el-option key="2" label="不显示" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.bannerLevel"
                    placeholder="轮播图级别"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="全部影院" value="1"></el-option>
                    <el-option key="2" label="部分影院" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.category"
                    placeholder="轮播图类别"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="卖品首页" value="1"></el-option>
                    <el-option key="2" label="积分商城首页" value="2"></el-option>
                    <el-option key="3" label="个人中心首页" value="3"></el-option>
                    <el-option key="4" label="支付成功页" value="4"></el-option>
                    <el-option key="5" label="放映厅首页" value="5"></el-option>
                    <el-option key="6" label="首页广告弹窗" value="6"></el-option>
                    <el-option key="7" label="今日大牌" value="7"></el-option>
                    <el-option key="8" label="签到送积分" value="8"></el-option>
                    <el-option key="9" label="分享得金币" value="9"></el-option>
                    <el-option key="10" label="积分换金币" value="10"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <!-- <el-table-column prop="name" label="轮播图级别" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.bannerLevel=='1'"
                        >全部影院</el-tag>
                        <el-tag v-else-if="scope.row.bannerLevel=='2'"
                        >部分影院</el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column label="适用影院" width="220">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <!-- <el-table-column prop="memo" label="适用影院编码" width="130">
                    <template slot-scope="scope">{{scope.row.cinemaCodes}}</template>
                </el-table-column>-->
                <el-table-column prop="sort" label="是否显示" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'">显示</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">不显示</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="开始时间" width="160px">
                    <template slot-scope="scope">{{scope.row.startDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="结束时间" width="160px">
                    <template slot-scope="scope">{{scope.row.endDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="轮播图类别" width="120px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.category=='1'">卖品首页</el-tag>
                        <el-tag v-if="scope.row.category=='2'">积分商城首页</el-tag>
                        <el-tag v-if="scope.row.category=='3'">个人中心首页</el-tag>
                        <el-tag v-if="scope.row.category=='4'">支付成功页</el-tag>
                        <el-tag v-if="scope.row.category=='5'">放映厅首页</el-tag>
                        <el-tag v-if="scope.row.category=='6'">首页广告弹窗</el-tag>
                        <el-tag v-if="scope.row.category=='7'">今日大牌</el-tag>
                        <el-tag v-if="scope.row.category=='8'">签到送积分</el-tag>
                        <el-tag v-if="scope.row.category=='9'">分享得金币</el-tag>
                        <el-tag v-if="scope.row.category=='10'">积分换金币</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="图片地址" width="200px">
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
                <el-table-column prop="sort" label="跳转类型" width="120px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.redirectType=='1'">跳转到文章</el-tag>
                        <el-tag v-if="scope.row.redirectType=='2'">跳转到电影</el-tag>
                        <el-tag v-if="scope.row.redirectType=='3'">跳转到金币商品</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="跳转的具体信息" width="130">
                    <template slot-scope="scope">{{scope.row.redirectGoal}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="备注">
                    <template slot-scope="scope">{{scope.row.memo}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
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
        <el-dialog title="新增轮播图" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <!-- <el-form-item label="轮播图级别" :label-width="formLabelWidth">
                    <el-select v-model="oForm.value" placeholder="请选择级别">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="适用影院" :label-width="formLabelWidth">
                    <el-select
                        v-model="oForm.cinemaCode"
                        placeholder="请选择影院"
                        @change="changeCinema"
                    >
                        <el-option
                            v-for="item in cinemaList"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示" :label-width="formLabelWidth">
                    <el-select v-model="oForm.statusValue" placeholder="选择是否显示">
                        <el-option
                            v-for="item in showStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始显示时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width: 200px"
                        v-model="startTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束显示时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width: 200px"
                        v-model="endTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        maxlength="30"
                        v-model="oForm.memo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="轮播图类别" :label-width="formLabelWidth">
                    <el-select v-model="oForm.bannerType" placeholder="请选择">
                        <el-option
                            v-for="item in bannerType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片地址" :label-width="formLabelWidth">
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        drag
                        :limit="8"
                        ref="upload"
                        action="/api/upload/uploadImage"
                        :on-success="onSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过300kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="跳转类型" :label-width="formLabelWidth">
                    <el-select v-model="oForm.tabType" placeholder="请选择跳转类型">
                        <el-option
                            v-for="item in tabType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转的具体类型" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="oForm.goType"
                        autocomplete="off"
                    ></el-input>
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
                <!-- <el-form-item label="轮播图级别" :label-width="formLabelWidth">
                    <el-select v-model="form.bannerLevel" placeholder="请选择级别">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="适用影院" :label-width="formLabelWidth">
                    <el-select v-model="form.cinemaCodes" placeholder="请选择影院">
                        <el-option
                            v-for="item in cinemaList"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示" :label-width="formLabelWidth">
                    <el-select v-model="form.status" placeholder="选择是否显示">
                        <el-option
                            v-for="item in showStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始显示时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width: 190px"
                        v-model="changeStartTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束显示时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width: 190px"
                        v-model="changeEndTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model.number="form.memo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="轮播图类别" :label-width="formLabelWidth">
                    <el-select v-model="oBannerType" placeholder="请选择">
                        <el-option
                            v-for="item in bannerType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片地址" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="imageUrl" />
                        <img
                            slot="reference"
                            :src="imageUrl"
                            :alt="imageUrl"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        :limit="8"
                        ref="download"
                        class="upload-demo"
                        drag
                        action="/api/upload/uploadImage"
                        :on-success="unSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过300kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="跳转类型" :label-width="formLabelWidth">
                    <el-select v-model="oTabType" placeholder="请选择跳转类型">
                        <el-option
                            v-for="item in tabType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转的具体类型" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        maxlength="9"
                        v-model="goType"
                        autocomplete="off"
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
            oBannerType: '',
            oTabType: '',
            type: {
                type: ''
            },
            imageUrl: '',
            changeStartTime: '',
            changeEndTime: '',
            startTime: '',
            endTime: '',
            oName: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            cinemaList: [], //适用影院编码
            editVisible: false,
            pageTotal: 0,
            form: {
                bannerLevel: '',
                sort: '',
                id: '',
                tabType: ''
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
            cinemaInfo: [],
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
                    label: '卖品首页 建议尺寸750*360'
                },
                {
                    value: '2',
                    label: '积分商城首页 建议尺寸710*360'
                },
                {
                    value: '3',
                    label: '个人中心首页 建议尺寸750*320'
                },
                {
                    value: '4',
                    label: '支付成功页 建议尺寸670*160'
                },
                {
                    value: '5',
                    label: '放映厅首页 建议尺寸750*360'
                },
                {
                    value: '6',
                    label: '首页广告弹窗 建议尺寸520*690'
                },
                {
                    value: '7',
                    label: '今日大牌 建议尺寸670*200'
                },
                {
                    value: '8',
                    label: '签到送积分 建议尺寸670*200'
                },
                {
                    value: '9',
                    label: '分享得金币 建议尺寸670*200'
                }
                // {
                //     value: '10',
                //     label: '积分换金币'
                // }
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
            setTimeout(() => {
                https
                    .fetchPost('/banner/addPage', '')
                    .then(data => {
                        loading.close();
                        console.log(data);
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        this.businessOptiones = JSON.parse(Decrypt(data.data.data));
                        this.cinemaList = JSON.parse(Decrypt(data.data.data)).cinemaList;
                        this.oForm.cinemaCode = JSON.parse(Decrypt(data.data.data)).cinemaList[0].cinemaCode;
                        // this.oForm.cinemaCode = cinemaCode;
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
            setTimeout(() => {
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCodes', value: this.oForm.cinemaCode });
                jsonArr.push({ key: 'bannerLevel', value: 2 });
                jsonArr.push({ key: 'status', value: this.oForm.statusValue });
                jsonArr.push({ key: 'startDate', value: this.startTime });
                jsonArr.push({ key: 'endDate', value: this.endTime });
                jsonArr.push({ key: 'memo', value: this.oForm.memo });
                jsonArr.push({ key: 'category', value: this.oForm.bannerType });
                jsonArr.push({ key: 'imageUrl', value: this.oForm.imageUrl });
                jsonArr.push({ key: 'redirectType', value: this.oForm.tabType });
                jsonArr.push({ key: 'redirectGoal', value: this.oForm.goType });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/banner/addBanner', params)
                        .then(data => {
                            //新增
                            loading.close();
                            console.log(data);
                            if (data.data.code == 'success') {
                                this.dialogFormVisible = false;
                                this.$message.success(`新增成功`);
                                this.$refs.upload.clearFiles(); //清除已上传文件
                                this.oForm.cinemaCode = '';
                                this.oForm.value = '';
                                this.oForm.statusValue = '';
                                this.startTime = '';
                                this.endTime = '';
                                this.oForm.memo = '';
                                this.oForm.bannerType = '';
                                this.oForm.imageUrl = '';
                                this.oForm.tabType = '';
                                this.oForm.goType = '';
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
                            .fetchPost('/banner/deleteBanner', params)
                            .then(data => {
                                loading.close();
                                console.log(data);
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
                    .fetchPost('/banner/modifyPage', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            let oIndex = 0; //轮播图级别下拉选显示对应的选项
                            for (let i in this.options) {
                                if (this.options[i].value == JSON.parse(Decrypt(data.data.data)).banner.bannerLevel) {
                                    oIndex = i;
                                    break;
                                }
                            }
                            this.form.bannerLevel = this.options[oIndex].value;
                            this.businessOptiones = JSON.parse(Decrypt(data.data.data)).businessInfos;
                            let index = 0; //是否显示下拉选显示对应的选项
                            for (let i in this.showStatus) {
                                if (this.options[i].value == JSON.parse(Decrypt(data.data.data)).banner.status) {
                                    index = i;
                                    break;
                                }
                            }
                            this.form.status = this.showStatus[index].value;
                            //是否显示下拉选显示对应的选项
                            this.cinemaList = JSON.parse(Decrypt(data.data.data)).cinemaList; //适用影院编码
                            for (let i in this.cinemaList) {
                                if (this.cinemaList[i].cinemaCode == JSON.parse(Decrypt(data.data.data)).banner.cinemaCodes) {
                                    this.form.cinemaCodes = this.cinemaList[i].cinemaCode;
                                    break;
                                }
                            }
                            this.changeStartTime = JSON.parse(Decrypt(data.data.data)).banner.startDate; //创建时间
                            this.changeEndTime = JSON.parse(Decrypt(data.data.data)).banner.endDate; //结束时间
                            this.form.memo = JSON.parse(Decrypt(data.data.data)).banner.memo; //备注
                            for (let i in this.bannerType) {
                                //轮播图类型下拉框显示对应的选项
                                if (this.bannerType[i].value == JSON.parse(Decrypt(data.data.data)).banner.category) {
                                    this.oBannerType = this.bannerType[i].value;
                                    break;
                                }
                            }

                            this.imageUrl = JSON.parse(Decrypt(data.data.data)).banner.imageUrl;
                            let tabIndex = 0; //跳转类型下拉选显示对应的选项
                            for (let i in this.tabType) {
                                //轮播图类型下拉框显示对应的选项
                                if (this.tabType[i].value == JSON.parse(Decrypt(data.data.data)).banner.redirectType) {
                                    tabIndex = i;
                                    break;
                                }
                            }
                            this.oTabType = this.bannerType[tabIndex].value;
                            this.goType = JSON.parse(Decrypt(data.data.data)).banner.redirectGoal;
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
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: this.form.id });
                jsonArr.push({ key: 'bannerLevel', value: 2 });
                jsonArr.push({ key: 'cinemaCodes', value: this.form.cinemaCodes });
                jsonArr.push({ key: 'status', value: this.form.status });
                jsonArr.push({ key: 'startDate', value: this.changeStartTime });
                jsonArr.push({ key: 'imageUrl', value: this.form.imageUrl });
                jsonArr.push({ key: 'endDate', value: this.changeEndTime });
                jsonArr.push({ key: 'memo', value: this.form.memo });
                jsonArr.push({ key: 'category', value: this.oBannerType });
                jsonArr.push({ key: 'redirectType', value: this.oTabType });
                jsonArr.push({ key: 'redirectGoal', value: this.goType });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                this.editVisible = false;
                https
                    .fetchPost('/banner/updateById', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.$refs.download.clearFiles(); //清除已上传文件
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
        beforeUpload() {
            //上传之前
            this.type.type = EncryptReplace('activity');
        },
        onSuccess(data) {
            //上传文件 登录超时
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.upload.clearFiles();
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
                this.$refs.download.clearFiles();
                return;
            }
            this.form.imageUrl = data.data;
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
                let status = this.query.status;
                let bannerLevel = this.query.bannerLevel;
                let cinemaCode = this.query.cinemaCode;
                let category = this.query.category;
                if (!status) {
                    status = '';
                }
                if (!bannerLevel) {
                    bannerLevel = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!category) {
                    category = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'bannerLevel', value: bannerLevel });
                jsonArr.push({ key: 'cinemaCodes', value: cinemaCode });
                jsonArr.push({ key: 'category', value: category });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/banner/bannerPage', params)
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
            }, 500);
        },
        open() {
            //错误信息弹出框
            this.$alert(this.message, '错误信息', {
                dangerouslyUseHTMLString: true
            });
        },
        changeCinema(val) {
            this.oForm.cinemaCode = val;
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

