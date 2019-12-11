<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 网络代售服务费设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" v-if="showSell">
            <div class="handle-box">
                <el-select
                    v-model="query.businessCode"
                    placeholder="请选择商家"
                    class="mr10"
                    @change="changeBusiness"
                >
                    <el-option
                        v-for="item in businessInfo"
                        :key="item.businessCode"
                        :label="item.businessName"
                        :value="item.businessCode"
                    ></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.cinemaCode"
                    placeholder="请选择影院"
                    class="handle-input mr10"
                >
                    <el-option
                        v-for="item in cinemaData"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;"  type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="影院编码" width="110">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院名称" width="280">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="省份" width="110">
                    <template slot-scope="scope">{{scope.row.province}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="城市" width="110">
                    <template slot-scope="scope">{{scope.row.city}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="详细地址">
                    <template slot-scope="scope">{{scope.row.address}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="联系方式" width="150">
                    <template slot-scope="scope">{{scope.row.serviceMobile}}</template>
                </el-table-column>
                <el-table-column label="操作" width="140" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="show(scope.row)"
                        >查看详情</el-button>
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
        <div class="container" v-if="!showSell">
            <div class="handle-box">
                <el-input placeholder="服务费规则名称" class="mr10" v-model="query.serviceFeeName" autocomplete="off"></el-input>
                <el-select
                    clearable
                    v-model="query.screenType"
                    placeholder="影厅类型"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="全部影厅" value="1"></el-option>
                    <el-option key="2" label="部分影厅" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.filmType"
                    placeholder="影片类型"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="全部影片" value="1"></el-option>
                    <el-option key="2" label="部分影片" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="启用" value="1"></el-option>
                    <el-option key="2" label="未启用" value="2"></el-option>
                </el-select>
                <el-date-picker
                    v-model="query.minStartDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="开始时间（起）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.maxStartDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="开始时间（止）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.minEndDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="结束时间（起）"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.maxEndDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="结束时间（止）"
                ></el-date-picker>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="searchEmployee">搜索</el-button>
                <el-button
                    type="primary"
                    @click="back"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >返回影院列表</el-button>
                <!-- <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-right: 10px;margin-top: 10px"
                >新增</el-button> -->
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="服务费规则名称">
                    <template slot-scope="scope">{{scope.row.serviceFeeName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影厅类型" width="120" >
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.screenType == 1" type="success">全部影厅</el-tag>
                        <el-tag v-else type="success">部分影厅</el-tag>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="name" label="影厅名称">-->
                    <!--<template-->
                        <!--v-if="scope.row.screenType == 2"-->
                        <!--slot-scope="scope"-->
                    <!--&gt;{{scope.row.screenNames}}</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="name" label="影片类型" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.filmType == 1" type="success">全部影片</el-tag>
                        <el-tag v-else type="success">部分影片</el-tag>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="name" label="影片名称" width="180">-->
                    <!--<template-->
                        <!--v-if="scope.row.filmType == 2"-->
                        <!--slot-scope="scope"-->
                    <!--&gt;{{scope.row.filmNames}}</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="memo" label="开始日期" width="160" >
                    <template slot-scope="scope">{{scope.row.startDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="结束日期" width="160" >
                    <template slot-scope="scope">{{scope.row.endDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="是否启用" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="第三方支付代售费" width="140">
                    <template slot-scope="scope">{{scope.row.thirdServiceFee}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="会员卡支付代售费" width="140">
                    <template slot-scope="scope">{{scope.row.memberServiceFee}}</template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="110" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="delChange(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column> -->
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
                <el-form-item :required="true" label="服务费规则名称：" :label-width="formLabelWidth" >
                    <el-input
                            style="width: 150px"
                            v-model="oForm.serviceFeeName"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择影厅：" :label-width="formLabelWidth" >
                    <el-radio-group v-model="oForm.selectHallType">
                        <el-radio label="1">全部影厅</el-radio>
                        <el-radio label="2">部分影厅</el-radio>
                    </el-radio-group>
                    <el-checkbox-group
                        v-model="oForm.screenCode"
                        @change="selectScreens"
                        v-if="oForm.selectHallType == 2"
                    >
                        <el-checkbox
                            v-for="item in screenInfo"
                            :label="item"
                            :key="item.screenCode"
                            :value="item.screenName"
                        >{{item.screenName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="选择影片：" :label-width="formLabelWidth" >
                    <el-radio-group v-model="oForm.selectFilmType">
                        <el-radio label="1">全部影片</el-radio>
                        <el-radio label="2">部分影片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.selectFilmType == 2" label="选择影片" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item :required="true" label="所选影片" :label-width="formLabelWidth" v-if="selectedSell.length>0&&oForm.selectFilmType == 2">
                    <div
                        v-for="(item, index) in selectedSell"
                        style="margin-bottom: 5px"
                        :key="index"
                    >
                        <el-input
                            style="width: 250px"
                            v-model="item.filmName"
                            autocomplete="off"
                            :value="item.filmCode"
                            :disabled="true"
                            :change="one(item.filmCode)"
                        ></el-input>
                        <span style="color:red;cursor: pointer;" @click="deleteSell()">删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="有效期：" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="oForm.startDate"
                        type="datetime"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>至
                    <el-date-picker
                        v-model="oForm.endDate"
                        type="datetime"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="每日时间段：" :label-width="formLabelWidth">
                    <el-time-picker
                        v-model="oForm.startDay"
                        value-format="HH:mm:ss"
                        format="HH:mm:ss"
                        placeholder="起始时间"
                    ></el-time-picker>至
                    <el-time-picker
                        v-model="oForm.endDay"
                        value-format="HH:mm:ss"
                        format="HH:mm:ss"
                        placeholder="结束时间"
                    ></el-time-picker>
                    <span style="cursor: pointer;color: blue" @click="addTime">添加</span>
                </el-form-item>
                <el-form-item label="所选时间段：" :label-width="formLabelWidth" v-if="date.length>0">
                    <div v-for="(item, index) in date" :key="index">
                        {{item}}
                        <span
                            style="color:red;cursor: pointer;"
                            @click="deletTime(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="开启状态：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="第三方支付代售费：" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        v-model="oForm.thirdServiceFee"
                        autocomplete="off"
                    ></el-input>元
                </el-form-item>
                <el-form-item :required="true" label="会员卡支付代售费：" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        v-model="oForm.memberServiceFee"
                        autocomplete="off"
                    ></el-input>元
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="详情" :visible.sync="editVisible">
            <el-form :model="form">
                <el-form-item :required="true" label="服务费规则名称：" :label-width="formLabelWidth">
                    <el-input
                            style="width: 150px"
                            v-model="oServiceFeeName"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择影厅：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oScreenType">
                        <el-radio :label="1">全部影厅</el-radio>
                        <el-radio :label="2">部分影厅</el-radio>
                    </el-radio-group>
                    <el-checkbox-group
                        v-model="oScreenCode"
                        @change="selectScreens"
                        v-if="oScreenType == 2"
                    >
                        <el-checkbox
                            v-for="item in screenInfo"
                            :label="item.screenCode"
                            :key="item.screenName"
                            :value="item.screenName"
                        >{{item.screenName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="选择影片：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oFilmType">
                        <el-radio :label="1">全部影片</el-radio>
                        <el-radio :label="2">部分影片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oFilmType == 2" label="选择影片" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item :required="true" label="所选影片" :label-width="formLabelWidth" v-if="selectedSell.length>0 && oFilmType == 2">
                    <div
                        v-for="(item, index) in selectedSell"
                        style="margin-bottom: 5px"
                        :key="index"
                    >
                        <el-input
                            style="width: 250px"
                            v-model="item.filmName"
                            autocomplete="off"
                            :value="item.filmCode"
                            :disabled="true"
                            :change="one(item.filmCode)"
                        ></el-input>
                        <span style="color:red;cursor: pointer;" @click="deleteSell()">删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="有效期：" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="oStartDate"
                        type="datetime"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>至
                    <el-date-picker
                        v-model="oEndDate"
                        type="datetime"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="每日时间段：" :label-width="formLabelWidth">
                    <el-time-picker
                        v-model="oStartDay"
                        value-format="HH:mm:ss"
                        format="HH:mm:ss"
                        placeholder="起始时间"
                    ></el-time-picker>至
                    <el-time-picker
                        v-model="oEndDay"
                        value-format="HH:mm:ss"
                        format="HH:mm:ss"
                        placeholder="结束时间"
                    ></el-time-picker>
                    <span style="cursor: pointer;color: blue" @click="addTime2">添加</span>
                </el-form-item>
                <el-form-item label="所选时间段：" :label-width="formLabelWidth" v-if="date.length>=1">
                    <div v-for="(item, index) in date" :key="index">
                        {{item}}
                        <span
                            style="color:red;cursor: pointer;"
                            @click="deletTime(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="开启状态：" :label-width="formLabelWidth">
                    <el-select v-model="oStatus" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="第三方支付代售费：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oThirdServiceFee" autocomplete="off"></el-input>元
                </el-form-item>
                <el-form-item :required="true" label="会员卡支付代售费：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oMemberServiceFee" autocomplete="off"></el-input>元
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--选择影片弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择影片" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.filmName" placeholder="影片名" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="searchFilm">搜索</el-button>
                </div>
                <el-table
                    :data="sellTableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio
                                v-model="id"
                                :label="scope.$index"
                                @change.native="getCurrentRow(scope.$index)"
                            >&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="图片">
                        <template slot-scope="scope">
                            <el-popover placement="right" title trigger="hover">
                                <img style="width:400px" :src="scope.row.image" />
                                <img
                                    slot="reference"
                                    :src="scope.row.image"
                                    :alt="scope.row.image"
                                    style="max-height: 50px;max-width: 130px"
                                />
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="影片名称">
                        <template slot-scope="scope">{{scope.row.filmName}}</template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            @size-change="handleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.filmPageNo"
                            :page-sizes="[10, 15, 20, 30]"
                            :page-size="query.filmPageSize"
                            :total="query.filmTotalCount"
                            @current-change="aCurrentChange"
                            @prev-click="aPrev"
                            @next-click="aNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button type="primary" @click="sureNext">确 定</el-button>
            </div>
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
            startSection: '',
            endSection: '',
            date: [],
            oCinemaCode: '',
            oThirdServiceFee: '',
            oStatus: '',
            oStartSection: '',
            oStartDate: '',
            oStartDay: '',
            oScreenType: '',
            oScreenNames: '',
            oScreenCodes: '',
            oServiceFeeName: '',
            oScreenCode: [],
            oScreenName: [],
            oFilmCode: [],
            oFilmName: [],
            ostartList: [],
            oEndList: [],
            oMemberServiceFee: '',
            oFilmType: '',
            oFilmNames: '',
            oFilmCodes: '',
            oEndSection: '',
            oEndDate: '',
            oEndDay: '',
            oId: '',
            drawer: false,
            showSell: true, //卖品信息页面是否展示开关
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                filmPageSize: 15,
                filmPageNo: 1
            },
            restaurants: [],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            id: '',
            dialogFormVisible: false,
            options: [
                {
                    value: '1',
                    label: '启用'
                },
                {
                    value: '2',
                    label: '未启用'
                }
            ],
            oForm: {
                name: '',
                selectHallType: '1',
                selectFilmType: '1',
                cinemaCode: '',
                serviceFee: '',
                screenCode: [],
                screenCodes: '',
                screenNames: '',
                filmCodes: '',
                filmNames: '',
                startDate: '',
                endDate: '',
                startSection: '',
                endSection: '',
                status: '',
                startDay: '',
                endDay: ''
            },
            sellTableData: [],
            selectedSell: [],
            formLabelWidth: '120px',
            selectValue: {},
            selectScreenCode: [],
            selectGroup: {},
            screenInfo: [],
            cinemaInfo: [],
            businessInfo: [],
            cinemaData: [],
            couponInfo: {},
            value: [],
            couponName: ''
        };
    },
    created() {
        this.showSell = true;
    },
    mounted() {
        this.getAllBusiness();
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
                .fetchPost('/serviceFee/addServiceFeePage', '')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = true;
                        this.getAllScreen();
                        this.date = [];
                        this.selectedSell = [];
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
        //新增按钮操作
        addRole() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if(!this.oForm.serviceFeeName||!this.oForm.status){
                this.message = '必填项不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.memberServiceFee!=0) {
                if (!this.oForm.memberServiceFee) {
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.thirdServiceFee!=0) {
                if (!this.oForm.thirdServiceFee) {
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.selectHallType==2){
                if(this.oForm.screenCode.length==0){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.selectFilmType==2){
                if(this.selectedSell.length==0){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            var jsonArr = [];
            jsonArr.push({ key: 'serviceFeeName', value: this.oForm.serviceFeeName });
            if (this.oForm.selectHallType == 2) {
                let screenCodes = [];
                let screenNames = [];
                for (let i = 0; i < this.selectScreenCode.length; i++) {
                    screenCodes.push(this.selectScreenCode[i].screenCode);
                    screenNames.push(this.selectScreenCode[i].screenName);
                }
                this.oForm.screenNames = screenNames.join(',');
                this.oForm.screenCodes = screenCodes.join(',');
                jsonArr.push({ key: 'screenCodes', value: this.oForm.screenCodes });
                jsonArr.push({ key: 'screenNames', value: this.oForm.screenNames });
            }
            jsonArr.push({ key: 'screenType', value: this.oForm.selectHallType });
            if (this.oForm.selectFilmType == 2) {
                let filmCodes = [];
                let filmNames = [];
                for (let i = 0; i < this.selectedSell.length; i++) {
                    filmCodes.push(this.selectedSell[i].filmCode);
                    filmNames.push(this.selectedSell[i].filmName);
                }
                this.oForm.filmCodes = filmCodes.join(',');
                this.oForm.filmNames = filmNames.join(',');
                jsonArr.push({ key: 'filmCodes', value: this.oForm.filmCodes });
                jsonArr.push({ key: 'filmNames', value: this.oForm.filmNames });
            }
            jsonArr.push({ key: 'filmType', value: this.oForm.selectFilmType });
            jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
            jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
            let startArr = [];
            let endArr = [];
            for (let i = 0; i < this.date.length; i++) {
                startArr.push(this.date[i].substring(0, this.date[i].indexOf('至')));
                endArr.push(this.date[i].substring(this.date[i].indexOf('至') + 1));
            }
            this.startSection = startArr.join(',');
            this.endSection = endArr.join(',');
            jsonArr.push({ key: 'startSection', value: this.startSection });
            jsonArr.push({ key: 'endSection', value: this.endSection });
            jsonArr.push({ key: 'status', value: this.oForm.status });
            jsonArr.push({ key: 'thirdServiceFee', value: this.oForm.thirdServiceFee });
            jsonArr.push({ key: 'memberServiceFee', value: this.oForm.memberServiceFee });
            jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/serviceFee/addServiceFee', params)
                    .then(data => {
                        loading.close();
                        //新增
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.show();
                            this.oForm.name = '';
                            (this.oForm.selectHallType = '1'), (this.oForm.selectFilmType = '1'), (this.oForm.cinemaCode = '');
                            this.oForm.serviceFee = '';
                            this.oForm.screenCodes = '';
                            this.oForm.screenNames = '';
                            this.oForm.filmCodes = '';
                            this.oForm.filmNames = '';
                            this.oForm.serviceFeeName = '';
                            this.oForm.startDate = '';
                            this.oForm.endDate = '';
                            this.oForm.startSection = '';
                            this.oForm.endSection = '';
                            this.oForm.status = '';
                            this.oForm.startDay = '';
                            this.oForm.endDay = '';
                            this.oForm.screenCode = [];
                            this.selectScreenCode = [];
                            this.date = [];
                            this.endSection = [];
                            this.startSection = [];
                            this.selectedSell = [];
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
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
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
                        .fetchPost('/serviceFee/deleteServiceFee', params)
                        .then(data => {
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
            https
                .fetchPost('/serviceFee/modifyServiceFeePage', params)
                .then(data => {
                    loading.close();
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.getAllScreen();
                        this.oThirdServiceFee = JSON.parse(Decrypt(data.data.data)).thirdServiceFee;
                        if (JSON.parse(Decrypt(data.data.data)).status == 1) {
                            this.oStatus = '启用';
                        } else {
                            this.oStatus = '未启用';
                        }
                        this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).cinemaCode;
                        this.oStartDate = JSON.parse(Decrypt(data.data.data)).startDate;
                        this.oScreenType = JSON.parse(Decrypt(data.data.data)).screenType;
                        this.oScreenNames = JSON.parse(Decrypt(data.data.data)).screenNames;
                        this.oScreenCodes = JSON.parse(Decrypt(data.data.data)).screenCodes;
                        this.oServiceFeeName = JSON.parse(Decrypt(data.data.data)).serviceFeeName;
                        if(JSON.parse(Decrypt(data.data.data)).screenCodes){
                            this.oScreenCode = this.oScreenCodes.split(',');
                        }
                        if(JSON.parse(Decrypt(data.data.data)).screenNames){
                            this.oScreenName = this.oScreenNames.split(',');
                        }
                        let selectScreenCode = [];
                        for (let i = 0; i < this.oScreenCode.length; i++) {
                            selectScreenCode.push({ screenCode: this.oScreenCode[i], screenName: this.oScreenName[i] });
                        }
                        this.selectScreenCode = selectScreenCode;
                        this.oMemberServiceFee = JSON.parse(Decrypt(data.data.data)).memberServiceFee;
                        this.oFilmType = JSON.parse(Decrypt(data.data.data)).filmType;
                        if (JSON.parse(Decrypt(data.data.data)).filmNames) {
                            this.oFilmNames = JSON.parse(Decrypt(data.data.data)).filmNames;
                        }
                        if (JSON.parse(Decrypt(data.data.data)).filmCodes) {
                            this.oFilmCodes = JSON.parse(Decrypt(data.data.data)).filmCodes;
                        }
                        this.oFilmName = this.oFilmNames.split(',');
                        this.oFilmCode = this.oFilmCodes.split(',');
                        let selectedSell = [];
                        for (let i = 0; i < this.oFilmCode.length; i++) {
                            selectedSell.push({ filmCode: this.oFilmCode[i], filmName: this.oFilmName[i] });
                        }
                        this.selectedSell = selectedSell;
                        this.oStartSection = JSON.parse(Decrypt(data.data.data)).startSection;
                        this.oEndSection = JSON.parse(Decrypt(data.data.data)).endSection;
                        this.oEndDate = JSON.parse(Decrypt(data.data.data)).endDate;
                        let endList = [];
                        let startList = [];
                        if (this.oStartSection != '' && this.oEndSection != '') {
                            endList = this.oEndSection.split(',');
                            startList = this.oStartSection.split(',');
                            let showTime = [];
                            for (let i = 0; i < endList.length; i++) {
                                showTime.push(startList[i] + '至' + endList[i]);
                            }
                            this.date = showTime;
                        }
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
        },
        show(row) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let filmType = this.query.filmType;
            let screenType = this.query.screenType;
            let minStartDate = this.query.minStartDate;
            let minEndDate = this.query.minEndDate;
            let maxStartDate = this.query.maxStartDate;
            let maxEndDate = this.query.maxEndDate;
            let status = this.query.status;
            let serviceFeeName = this.query.serviceFeeName;
            let cinemaCode = '';
            if (!serviceFeeName) {
                serviceFeeName = '';
            }
            if (!filmType) {
                filmType = '';
            }
            if (!screenType) {
                screenType = '';
            }
            if (!minStartDate) {
                minStartDate = '';
            }
            if (!minEndDate) {
                minEndDate = '';
            }
            if (!maxStartDate) {
                maxStartDate = '';
            }
            if (!maxEndDate) {
                maxEndDate = '';
            }
            if (!status) {
                status = '';
            }
            if (!row) {
                cinemaCode = this.cinemaCode;
            } else {
                this.cinemaCode = row.cinemaCode;
                cinemaCode = row.cinemaCode;
            }
            var jsonArr = [];
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'serviceFeeName', value: this.query.serviceFeeName });
            jsonArr.push({ key: 'screenType', value: screenType });
            jsonArr.push({ key: 'minStartDate', value: minStartDate });
            jsonArr.push({ key: 'minEndDate', value: minEndDate });
            jsonArr.push({ key: 'maxStartDate', value: maxStartDate });
            jsonArr.push({ key: 'maxEndDate', value: maxEndDate });
            jsonArr.push({ key: 'filmType', value: filmType });
            jsonArr.push({ key: 'status', value: status });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/admin/serviceFee/serviceFeePage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.showSell = false;
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
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
        // 编辑操作
        exChanger() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if(!this.oServiceFeeName||!this.oStatus){
                this.message = '必填项不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oThirdServiceFee!=0){
                if(!this.oThirdServiceFee){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oMemberServiceFee!=0){
                if(!this.oMemberServiceFee){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oScreenType==2){
                if(this.oScreenCode.length==0){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oFilmType==2){
                if(this.selectedSell.length==0){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            var jsonArr = [];
            if (this.oScreenType == 2) {
                for (let i = 0; i < this.selectScreenCode.length; i++) {
                    if (!this.selectScreenCode[i].screenCode) {
                        let screenCodes = [];
                        let screenNames = [];
                        for (let a = 0; a < this.selectScreenCode.length; a++) {
                            screenCodes.push(this.selectScreenCode[a]);
                            for (let j = 0; j < this.screenInfo.length; j++) {
                                if (this.screenInfo[j].screenCode == this.selectScreenCode[a]) {
                                    screenNames.push(this.screenInfo[j].screenName);
                                }
                            }
                        }
                        this.oScreenCodes = screenCodes.join(',');
                        this.oScreenNames = screenNames.join(',');
                    } else {
                        let screenCodes = [];
                        let screenNames = [];
                        for (let b = 0; b < this.selectScreenCode.length; b++) {
                            screenCodes.push(this.selectScreenCode[b].screenCode);
                            screenNames.push(this.selectScreenCode[b].screenName);
                        }
                        this.oScreenCodes = screenCodes.join(',');
                        this.oScreenNames = screenNames.join(',');
                    }
                }
                jsonArr.push({ key: 'screenCodes', value: this.oScreenCodes });
                jsonArr.push({ key: 'screenNames', value: this.oScreenNames });
            }
            jsonArr.push({ key: 'screenType', value: this.oScreenType });
            jsonArr.push({ key: 'filmType', value: this.oFilmType });
            if (this.oFilmType == 2) {
                let filmCodes = [];
                let filmNames = [];
                for (let i = 0; i < this.selectedSell.length; i++) {
                    filmCodes.push(this.selectedSell[i].filmCode);
                    filmNames.push(this.selectedSell[i].filmName);
                }
                this.oForm.filmCodes = filmCodes.join(',');
                this.oForm.filmNames = filmNames.join(',');
                jsonArr.push({ key: 'filmCodes', value: this.oForm.filmCodes });
                jsonArr.push({ key: 'filmNames', value: this.oForm.filmNames });
            }
            if (this.oStatus == '启用') {
                jsonArr.push({ key: 'status', value: 1 });
            } else if (this.oStatus == '未启用') {
                jsonArr.push({ key: 'status', value: 2 });
            } else {
                jsonArr.push({ key: 'status', value: this.oStatus });
            }
            let startArr = [];
            let endArr = [];
            for (let i = 0; i < this.date.length; i++) {
                startArr.push(this.date[i].substring(0, this.date[i].indexOf('至')));
                endArr.push(this.date[i].substring(this.date[i].indexOf('至') + 1));
            }
            this.oStartSection = startArr.join(',');
            this.oEndSection = endArr.join(',');
            jsonArr.push({ key: 'endDate', value: this.oEndDate });
            jsonArr.push({ key: 'startDate', value: this.oStartDate });
            jsonArr.push({ key: 'startSection', value: this.oStartSection });
            jsonArr.push({ key: 'endSection', value: this.oEndSection });
            jsonArr.push({ key: 'memberServiceFee', value: this.oMemberServiceFee });
            jsonArr.push({ key: 'thirdServiceFee', value: this.oThirdServiceFee });
            jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode });
            jsonArr.push({ key: 'serviceFeeName', value: this.oServiceFeeName });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/serviceFee/modifyServiceFee', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = false;
                        this.$message.success(`编辑成功`);
                        this.selectScreenCode = [];
                        this.selectedSell = [];
                        this.date = [];
                        this.oCinemaCode = '';
                        this.oThirdServiceFee = '';
                        this.oStatus = '';
                        this.oStartSection = '';
                        this.oStartDate = '';
                        this.oStartDay = '';
                        this.oScreenType = '';
                        this.oScreenNames = '';
                        this.oScreenCodes = '';
                        this.oScreenCode = [];
                        this.oScreenName = [];
                        this.oFilmCode = [];
                        this.oFilmName = [];
                        this.ostartList = [];
                        this.oEndList = [];
                        this.oMemberServiceFee = '';
                        this.oFilmType = '';
                        this.oFilmNames = '';
                        this.oFilmCodes = '';
                        this.oEndSection = '';
                        this.oEndDate = '';
                        this.oEndDay = '';
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
                .fetchPost('couponGroup/updateStatusById', params)
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
        searchEmployee() {
            this.query.pageNo = 1;
            this.show();
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
            let businessCode = this.query.businessCode;
            let cinemaCode = this.query.cinemaCode;
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!businessCode) {
                businessCode = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'businessCode', value: businessCode });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinema/getCinemaInfoByBusinessCode', params)
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
            },1000)
        },
        back() {
            this.showSell = true;
            this.getMenu();
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        selectStatus(val) {
            this.selectValue = val;
        },
        selectDay(val) {
            // console.log(val)
            this.checkedDays = val.join(',');
        },
        getAllBusiness() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            https
                .fetchPost('/businessInfo/getBusinessList')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.businessInfo = res;
                        this.query.businessCode = res[0].businessCode;
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
        changeBusiness(val) {
            this.query.businessCode = val;
            this.getAllCinema();
            this.$forceUpdate();
        },
        // 获取所有影院
        getAllCinema() {
            if (!this.query.businessCode) {
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
            jsonArr.push({ key: 'businessCode', value: this.query.businessCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinema/getCinemaListByBusinessCode', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let cinemas = JSON.parse(Decrypt(data.data.data));
                        this.cinemaData = cinemas;
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
        selectScreens(val) {
            this.selectScreenCode = val;
        },
        // 获取所有影厅
        getAllScreen() {
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('serviceFee/getScreenByCinemaCode', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        let screens = JSON.parse(Decrypt(data.data.data));
                        this.screenInfo = [];
                        for (let i = 0; i < screens.length; i++) {
                            let screenList = {};
                            screenList.screenCode = screens[i].screenCode;
                            screenList.screenName = screens[i].screenName;
                            this.screenInfo.push(screenList);
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
                    console.log(err);
                });
        },
        sureNext() {
            if (this.sellIndex >= 0) {
                this.selectedSell.push(this.sellTableData[this.sellIndex]);
                this.drawer = false;
                console.log(this.selectedSell);
            }
        },
        deletCoupon() {
            this.couponInfo = {};
        },
        handleSelect(item) {
            this.selectGroup = {};
            this.selectGroup = item;
        },
        // 获取所有影片
        openNext() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let filmName = this.query.filmName;
                if (!filmName) {
                    filmName = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'filmName', value: filmName });
                jsonArr.push({ key: 'pageNo', value: this.query.filmPageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.filmPageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('film/filmPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.drawer = true;
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.sellTableData = oData.data;
                            this.query.filmPageSize = oData.pageSize;
                            this.query.filmPageNo = oData.pageNo;
                            this.query.filmTotalCount = oData.totalCount;
                            this.query.filmTotalPage = oData.totalPage;
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
        getCurrentRow(index) {
            this.sellIndex = index;
        },
        one(a) {
            this.oForm.filmCode = a;
        },
        deleteSell(index) {
            this.selectedSell.splice(index, 1);
        },
        searchFilm() {
            this.openNext();
        },
        //新增套餐选择卖品页面
        aHandleSizeChange(val) {
            this.query.filmPageSize=val;
            this.openNext()
        },
        aCurrentChange(val) {
            //点击选择具体页数
            this.query.filmPageNo = val;
            this.openNext();
        },
        aPrev() {
            //分页按钮上一页
            this.query.filmPageNo--;
            this.openNext();
        },
        aNext() {
            //分页按钮下一页
            this.query.filmPageNo++;
            this.openNext();
        },
        // 添加时间段
        addTime() {
            if (this.oForm.startDay == '') {
                this.message = '请输入开始时间';
                this.open();
                return;
            }
            if (this.oForm.endDay == '') {
                this.message = '请输入结束时间';
                this.open();
                return;
            }
            let day = this.oForm.startDay + '至' + this.oForm.endDay;
            this.date.push(day);
            this.oForm.startDay = '';
            this.oForm.endDay = '';
        },
        addTime2() {
            if (this.oStartDay == '') {
                this.message = '请输入开始时间';
                this.open();
                return;
            }
            if (this.oEndDay == '') {
                this.message = '请输入结束时间';
                this.open();
                return;
            }
            let day = this.oStartDay + '至' + this.oEndDay;
            this.date.push(day);
            this.oStartDay = '';
            this.oEndDay = '';
        },
        // 删除时间段
        deletTime(index) {
            this.date.splice(index, 1);
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
