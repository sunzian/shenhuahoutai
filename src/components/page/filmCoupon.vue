<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影票优惠券
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
                </el-table-column>-->
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
                            type="success"
                            v-if="scope.row.status == 0"
                            @click="changeStatus(scope.$index, scope.row)"
                        >启用</el-button>
                        <el-button
                            type="success"
                            v-if="scope.row.status == 1"
                            @click="changeStatus(scope.$index, scope.row)"
                        >停用</el-button>
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
                <el-form-item label="优惠券名称：" :label-width="formLabelWidth" prop="name">
                    <el-input style="width: 150px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择影院：" :label-width="formLabelWidth" prop="cinemaName">
                    <el-radio-group v-model="oForm.cinemaCode" @change="selectCinema">
                        <el-radio
                            v-for="item in cinemaInfo"
                            :label="item.cinemaCode"
                            :key="item.cinemaCode"
                            :value="item.cinemaName"
                        >{{item.cinemaName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择影厅：" :label-width="formLabelWidth" prop="screenName">
                    <el-radio-group v-model="oForm.selectHallType">
                        <el-radio label="0">全部影厅</el-radio>
                        <el-radio label="1">指定影厅参加</el-radio>
                        <el-radio label="2">指定影厅不参加</el-radio>
                    </el-radio-group>
                    <el-checkbox-group
                        v-model="oForm.screenCode"
                        @change="selectScreens"
                        v-if="oForm.selectHallType != 0"
                    >
                        <el-checkbox
                            v-for="item in screenInfo"
                            :label="item.screenCode"
                            :key="item.screenCode"
                            :value="item.screenName"
                        >{{item.screenName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="选择制式：" :label-width="formLabelWidth" prop="formatName">
                    <el-radio-group v-model="oForm.selectFilmFormatType">
                        <el-radio label="0">全部制式参加</el-radio>
                        <el-radio label="1">指定制式参加</el-radio>
                        <el-radio label="2">指定制式不参加</el-radio>
                    </el-radio-group>
                    <el-checkbox-group v-model="oForm.filmFormatCode" @change="selectFormat" v-if="oForm.selectFilmFormatType != 0">
                        <el-checkbox
                                v-for="item in formatList"
                                :label="item.formatCode"
                                :key="item.formatCode"
                                :value="item.formatName"
                        >{{item.formatName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="选择影片：" :label-width="formLabelWidth" prop="filmName">
                    <el-radio-group v-model="oForm.selectFilmType">
                        <el-radio label="0">全部影片</el-radio>
                        <el-radio label="1">部分影片</el-radio>
                        <el-radio label="2">排除影片</el-radio>
                    </el-radio-group>
                    <el-col :span="12" v-if="oForm.selectFilmType != 0">
                        搜索影片：
                        <el-autocomplete
                            class="inline-input"
                            v-model="oForm.filmName"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入内容"
                            :trigger-on-focus="false"
                            @select="handleSelect"
                        ></el-autocomplete>
                        <span style="color:blue;cursor: pointer;" @click="addFilm">添加</span>
                    </el-col>
                </el-form-item>
                <el-form-item
                    label="所选影片："
                    :label-width="formLabelWidth"
                    v-if="filmInfo.length>0 && oForm.selectFilmType != 0"
                >
                    <div v-for="(item, index) in filmInfo">
                        {{item.value}}
                        <span
                            style="color:red;cursor: pointer;"
                            @click="deletFilm(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="有效期：" :label-width="formLabelWidth" prop="date1">
                    <el-date-picker
                        v-model="oForm.startDate"
                        type="datetime"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        format="yyyy-MM-dd hh:mm:ss"
                    ></el-date-picker>至
                    <el-date-picker
                        v-model="oForm.endDate"
                        type="datetime"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        format="yyyy-MM-dd hh:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="支付类型：" :label-width="formLabelWidth" prop="date2">
                    <el-radio-group v-model="oForm.validPayType">
                        <el-radio label="0">全部</el-radio>
                        <el-radio label="1">仅非会员卡支付</el-radio>
                        <el-radio label="2">仅会员卡支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="优惠方式：" :label-width="formLabelWidth" prop="reduceType">
                    <el-radio-group v-model="oForm.reduceType">
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">立减</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="固定金额："
                    :label-width="formLabelWidth"
                    v-if="oForm.reduceType == 1"
                >
                    <el-input style="width: 150px" v-model="oForm.discountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    label="减免金额："
                    :label-width="formLabelWidth"
                    v-if="oForm.reduceType == 2"
                >   立减<el-input style="width: 150px" v-model="oForm.discountMoney" autocomplete="off"></el-input>元
                </el-form-item>
                <el-form-item label="开启状态：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="节假日是否可用：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.holidayValid" placeholder="请选择">
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="星期几不可用：" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="oForm.checkedDays" @change="selectDay">
                        <el-checkbox
                            v-for="(day, index) in oForm.exceptWeekDay"
                            :label="index+1"
                            :key="day"
                        >{{day}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="是否和活动共用" :label-width="formLabelWidth">
                    <el-select v-model="oForm.activityTogether" placeholder="请选择">
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="库存：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.sendNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="使用须知：" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="oForm.couponDesc"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="详情" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="适用影片名称：" :label-width="formLabelWidth">
                    <span>{{oCinemaName}}</span>
                </el-form-item>
                <el-form-item label="适用影厅名称：" :label-width="formLabelWidth">
                    <span>{{oScreenName}}</span>
                </el-form-item>
                <el-form-item label="适用影片名称：" :label-width="formLabelWidth">
                    <span>{{oFilmName}}</span>
                </el-form-item>
                <el-form-item label="优惠券名称：" :label-width="formLabelWidth">
                    <span>{{oName}}</span>
                </el-form-item>
                <el-form-item label="有效期：" :label-width="formLabelWidth">
                    <span>{{oCreateDate}}</span>
                    至
                    <span>{{oEndDate}}</span>
                </el-form-item>
                <el-form-item label="支付类型：" :label-width="formLabelWidth">
                    <span>{{oValidPayType}}</span>
                </el-form-item>
                <el-form-item label="减免金额：" :label-width="formLabelWidth">
                    立减<span>{{oDiscountMoney}}</span>元
                </el-form-item>
                <el-form-item label="使用须知：" :label-width="formLabelWidth">
                    <span>{{oCouponDesc}}</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">确 定</el-button>
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
            oCinemaName: '',
            oScreenName: '',
            oFilmName: '',
            oName: '',
            oCreateDate: '',
            oEndDate: '',
            oValidPayType: '',
            oReduceType: '',
            oDiscountMoney: '',
            oCouponDesc: '',
            oId: '',
            oStatus: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 10
            },
            restaurants: [],
            tableData: [],
            multipleSelection: [],
            formatList:[],//电影制式列表
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            selectScreen: '', // 选中的影厅
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            options: [
                {
                    value: '0',
                    label: '未启用'
                },
                {
                    value: '1',
                    label: '启用'
                }
            ],
            canUse: [
                {
                    value: '0',
                    label: '否'
                },
                {
                    value: '1',
                    label: '是'
                }
            ],
            oForm: {
                name: '',
                cinemaName: '',
                cinemaCode: [],
                screenName: '',
                screenCode: [],
                selectFilmType: '0',
                selectHallType: '0',
                selectFilmFormatType:'0',//选择制式
                filmCode: '',
                filmName: '',
                filmFormatCode:[],
                checkedDays: [],
                exceptWeekDay: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                startDate: '',
                endDate: '',
                validPayType: '0',
                achieveMoney: '',
                discountMoney: '',
                reduceType: '1',
                couponDesc: '',
                id: '',
                status: ''
            },
            formLabelWidth: '120px',
            selectValue: {},
            selectScreenCode: {},
            selectFilm: {},
            selectFormatCode: {},
            cinemaInfo: [],
            screenInfo: [],
            filmInfo: [],
            value: ''
        };
    },
    created() {

    },
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
                .fetchPost('/filmCoupon/filmCouponAddPage', '')
                .then(data => {
                    loading.close();
                    console.log(data);
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = true;
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        let formats = JSON.parse(Decrypt(data.data.data)).formatList;
                        this.formatList = [];
                        for (let i = 0; i < formats.length; i++) {
                            let formatArr = {};
                            formatArr.formatCode = formats[i].formatCode;
                            formatArr.formatName = formats[i].formatName;
                            this.formatList.push(formatArr);
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
            if (this.oForm.cinemaCode == true) {
                this.oForm.cinemaCode = this.cinemaInfo[0].cinemaCode;
            }
            let filmeCodes = [];
            for (let i = 0; i < this.filmInfo.length; i++) {
                filmeCodes.push(this.filmInfo[i].filmCode);
            }
            this.oForm.filmCode = filmeCodes.join(',');
            if (this.oForm.selectFilmType == 0) {
                this.oForm.filmCode = '';
            }
            if (this.oForm.selectHallType == 0) {
                this.selectScreenCode = '';
            }
            if (this.oForm.reduceType == 1) {
                this.oForm.achieveMoney = '';
            }
            var jsonArr = [];
            jsonArr.push({ key: 'name', value: this.oForm.name });
            jsonArr.push({ key: 'cinemaCodes', value: this.selectValue });
            jsonArr.push({ key: 'selectHallType', value: this.oForm.selectHallType });
            jsonArr.push({ key: 'screenCode', value: this.selectScreenCode });
            jsonArr.push({ key: 'selectFilmType', value: this.oForm.selectFilmType });
            jsonArr.push({ key: 'filmCode', value: this.oForm.filmCode });
            jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
            jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
            jsonArr.push({ key: 'reduceType', value: this.oForm.reduceType });
            jsonArr.push({ key: 'validPayType', value: this.oForm.validPayType });
            // jsonArr.push({ key: 'achieveMoney', value: this.oForm.achieveMoney });
            jsonArr.push({ key: 'discountMoney', value: this.oForm.discountMoney });
            jsonArr.push({ key: 'status', value: this.oForm.status });
            jsonArr.push({ key: 'holidayValid', value: this.oForm.holidayValid });
            jsonArr.push({ key: 'exceptWeekDay', value: this.checkedDays });
            jsonArr.push({ key: 'activityTogether', value: this.oForm.activityTogether });
            jsonArr.push({ key: 'sendNumber', value: this.oForm.sendNumber });
            jsonArr.push({ key: 'couponDesc', value: this.oForm.couponDesc });
            jsonArr.push({ key: 'selectFilmFormatType', value: this.oForm.selectFilmFormatType });
            jsonArr.push({ key: 'filmFormatCode', value: this.selectFormatCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/filmCoupon/addFilmCoupon', params)
                    .then(data => {
                        loading.close();
                        //新增
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.selectFilm = {};
                            this.oForm.filmName = '';
                            this.oForm.selectHallType = '0';
                            this.oForm.selectFilmType = '0';
                            this.oForm.name = '';
                            this.oForm.cinemaCode = [];
                            this.oForm.cinemaName = '';
                            this.oForm.merchandiseCode = [];
                            this.oForm.merchandiseName = '';
                            this.oForm.startDate = '';
                            this.oForm.endDate = '';
                            this.oForm.validPayType = '';
                            this.oForm.reduceType = '';
                            this.oForm.achieveMoney = '';
                            this.oForm.discountMoney = '';
                            this.oForm.holidayValid = '';
                            this.oForm.checkedDays = [];
                            this.oForm.status = '';
                            this.oForm.activityTogether = '';
                            this.oForm.sendNumber = '';
                            this.oForm.couponDesc = '';
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
        // 取消按钮操作
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
        delChange(index, row) {
            //删除数据
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
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
                        .fetchPost('/filmCoupon/deleteById', params)
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
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        addChange: function(index, row) {
            //是否拥有权限
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
                .fetchPost('/filmCoupon/getFilmCouponById', params)
                .then(data => {
                    loading.close();
                    console.log(data);
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).cinemaNames;
                        this.oScreenName = JSON.parse(Decrypt(data.data.data)).screenNames;
                        this.oFilmName = JSON.parse(Decrypt(data.data.data)).filmNames;
                        this.oName = JSON.parse(Decrypt(data.data.data)).name;
                        this.oCreateDate = JSON.parse(Decrypt(data.data.data)).createDate;
                        this.oEndDate = JSON.parse(Decrypt(data.data.data)).endDate;
                        this.oValidPayType = JSON.parse(Decrypt(data.data.data)).validPayType;
                        this.oReduceType = JSON.parse(Decrypt(data.data.data)).reduceType;
                        this.oDiscountMoney = JSON.parse(Decrypt(data.data.data)).discountMoney;
                        this.oCouponDesc = JSON.parse(Decrypt(data.data.data)).couponDesc;
                        this.oId = JSON.parse(Decrypt(data.data.data)).id;
                        this.oStatus = JSON.parse(Decrypt(data.data.data)).status;
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
                    loading.close();
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
                    loading.close();
                    console.log(err);
                });
        },
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
                status = 0;
            } else if (row.status == 0) {
                status = 1;
            }
            jsonArr.push({ key: 'id', value: row.id });
            jsonArr.push({ key: 'status', value: status });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/filmCoupon/updateCouponStatusById', params)
                .then(data => {
                    loading.close();
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
            https.fetchPost('/filmCoupon/filmCouponPage', params).then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
                        // console.log(oData.pageResult);
                        this.cinemaInfo = [];
                        for (let i = 0; i < oData.cinemaList.length; i++) {
                            let cinemaList = {};
                            cinemaList.cinemaCode = oData.cinemaList[i].cinemaCode;
                            cinemaList.cinemaName = oData.cinemaList[i].cinemaName;
                            this.cinemaInfo.push(cinemaList);
                        }
                        console.log(this.cinemaInfo);
                        this.oForm.cinemaCode = this.cinemaInfo[0].cinemaCode;
                        this.selectValue = this.cinemaInfo[0].cinemaCode;
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
                    loading.close();
                    console.log(err);
                });
        },
        open() {
            //错误信息弹出框
            this.$alert(this.message, '错误信息', {
                dangerouslyUseHTMLString: true
            });
        },
        selectCinema(val) {
            console.log(val);
            // let selectValue = val.join(',');
            this.selectValue = val;
            this.getAllScreen(val);
        },
        selectScreens(val) {
            console.log(val)
            let selectValue = val.join(',');
            this.selectScreenCode = selectValue;
            console.log(selectValue);
        },
        selectDay(val) {
            // console.log(val)
            this.checkedDays = val.join(',');
        },
        // 获取所选影院影厅
        getAllScreen(value) {
            if (!value) {
                this.screenInfo = [];
                return;
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: value });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('filmCoupon/getScreenInfoByCinemaCode', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        let screens = JSON.parse(Decrypt(data.data.data));
                        this.screenInfo = [];
                        for (let i = 0; i < screens.length; i++) {
                            let screenList = {};
                            screenList.screenCode = screens[i].screenCode;
                            screenList.screenName = screens[i].screenName;
                            this.screenInfo.push(screenList);
                        }
                        // console.log(this.screenInfo);
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
        // 获取影片
        querySearch(queryString, cb) {
            let jsonArr = [];
            jsonArr.push({ key: 'filmName', value: queryString });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('filmCoupon/getFilmByFilmName', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        let films = JSON.parse(Decrypt(data.data.data));
                        this.restaurants = films;
                        var restaurants = this.restaurants;
                        var results = restaurants;
                        // 调用 callback 返回建议列表的数据
                        cb(results);
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
        handleSelect(item) {
            this.selectFilm = {};
            this.selectFilm = item;
        },
        // 添加所选影片
        addFilm() {
            this.selectFilm = {};
            if (this.oForm.filmName == '') {
                return
            }
            if (this.restaurants.length == 0) {
                this.message = '暂无匹配影片';
                this.open();
                return
            }
            for (var i = 0;i < this.restaurants.length; i ++) {
                if (this.oForm.filmName == this.restaurants[i].value) {
                    this.selectFilm = this.restaurants[i]
                }
            }
            if (!this.selectFilm.value) {
                return
            }
            // 筛选重复影片
            var result = this.filmInfo.some(item => {
                if (item.value == this.selectFilm.value) {
                    return true;
                }
            });
            if (result) {
                return;
            }
            this.filmInfo.push(this.selectFilm);
        },
        deletFilm(index) {
            this.filmInfo.splice(index, 1);
        },
        selectFormat(val) {
            console.log(val);
            this.selectFormatCode = val.join(',');
            console.log(this.selectFormatCode);
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
