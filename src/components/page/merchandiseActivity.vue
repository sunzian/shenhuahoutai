<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 卖品活动管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.reduceType" placeholder="优惠方式" class="handle-select mr10">
                    <el-option key="1" label="特惠活动" value="1"></el-option>
                    <el-option key="2" label="立减活动" value="2"></el-option>
                </el-select>
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="启用" value="1"></el-option>
                    <el-option key="2" label="未启用" value="0"></el-option>
                </el-select>
                <el-select clearable v-model="query.cinemaCode" placeholder="影院" class="handle-select mr10">
                    <el-option
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="活动名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                        type="primary"
                        @click="addPage"
                        icon="el-icon-circle-plus-outline"
                        style="margin-left: 315px"
                >新增活动</el-button>
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
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="适用商品">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.selectMerchandiseType == 0">全部商品</el-tag>
                        <el-tag v-else-if="scope.row.selectMerchandiseType == 1" >{{scope.row.merchandiseName}}</el-tag>
                        <el-tag v-else-if="scope.row.selectMerchandiseType == 2" >除{{scope.row.merchandiseName}}外所有商品</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="活动名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="有效期" width="320">
                    <template slot-scope="scope">{{scope.row.startDate}}至{{scope.row.endDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="限购总数" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isLimitTotal == 0">不限购</el-tag>
                        <el-tag v-else-if="scope.row.isLimitTotal == 1" >{{scope.row.totalNumber}}，剩余{{scope.row.totalSurplus}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="个人限购">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isLimitSingle == 0">不限购</el-tag>
                        <el-tag v-else-if="scope.row.isLimitSingle == 1" >{{scope.row.singleNumber}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="优惠方式" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.reduceType == 1">特惠价格</el-tag>
                        <el-tag v-else-if="scope.row.reduceType == 2" >满减金额</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="金额">
                    <template slot-scope="scope">{{scope.row.discountMoney}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
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
                <el-form-item label="活动名称：" :label-width="formLabelWidth" prop="name">
                    <el-input style="width: 150px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择影院：" :label-width="formLabelWidth" prop="cinemaName">
                    <el-radio-group v-model="oForm.code" @change="selectCinema">
                        <el-radio
                                v-for="item in cinemaInfo"
                                :label="item.cinemaCode"
                                :key="item.cinemaCode"
                                :value="item.cinemaName"
                        >{{item.cinemaName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="优惠方式：" :label-width="formLabelWidth" prop="reduceType">
                    <el-radio-group v-model="oForm.reduceType">
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">满减</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="固定金额：" :label-width="formLabelWidth" v-if="oForm.reduceType == 1">
                    <el-input style="width: 150px" v-model="oForm.discountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="减免金额：" :label-width="formLabelWidth" v-if="oForm.reduceType == 2">
                    满
                    <el-input style="width: 150px" v-model="oForm.achieveMoney" autocomplete="off"></el-input>减
                    <el-input style="width: 150px" v-model="oForm.discountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择商品：" :label-width="formLabelWidth" prop="filmName">
                    <el-radio-group v-model="oForm.selectFilmType">
                        <el-radio label="0">全部商品</el-radio>
                        <el-radio label="1">部分商品</el-radio>
                        <el-radio v-if="oForm.reduceType==2" label="2">排除商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="oForm.selectFilmType != 0" label="选择商品" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选商品"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0&&oForm.selectFilmType==1"
                >
                    <div v-for="(item, index) in selectedSell" style="margin-bottom: 5px">
                        <el-input
                                style="width: 250px"
                                v-model="item.merchandiseName"
                                autocomplete="off"
                                :value="item.merchandiseCode"
                                :disabled="true"
                                :change="one(item.merchandiseCode)"
                        >
                        </el-input>
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deleteSell()"
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
                <el-form-item label="可用时间段：" :label-width="formLabelWidth">
                    <el-time-picker
                            is-range
                            type="date"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            v-model="value1"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围">
                    </el-time-picker>
                    <span style="cursor: pointer;color: blue" @click="addTime">添加</span>
                </el-form-item>
                <el-form-item
                        label="所选时间段："
                        :label-width="formLabelWidth"
                        v-if="dateInfo.length>0">
                    <div v-for="(item, index) in dateInfo">
                        {{item}}
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deletTime(index)"
                        >删除</span>
                    </div>
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
                <el-form-item label="是否和券共用" :label-width="formLabelWidth">
                    <el-select v-model="oForm.activityTogether" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否限制张数：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.oCanNum" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动总张数：" v-if="oForm.oCanNum==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.oNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否限制个人张数：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.oneCanNum" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="限购时间：" v-if="oForm.oneCanNum==1" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.limitSingleUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="个人总张数：" v-if="oForm.oneCanNum==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.oneNum" autocomplete="off"></el-input>
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
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!--新增抽屉弹出框-->
        <el-dialog title="选择卖品" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.name" placeholder="角色名" class="handle-input mr10"></el-input>
                    <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                        <el-option key="1" label="审核中" value="1"></el-option>
                        <el-option key="2" label="未审核" value="2"></el-option>
                        <el-option key="3" label="通过" value="3"></el-option>
                        <el-option key="4" label="审核失败" value="4"></el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
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
                            <el-radio v-model="id" :label="scope.$index" @change.native="getCurrentRow(scope.$index)">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="图片">
                        <template slot-scope="scope">
                            <el-popover
                                    placement="right"
                                    title=""
                                    trigger="hover">
                                <img style="width:400px" :src="scope.row.merchandisePic"/>
                                <img slot="reference" :src="scope.row.merchandisePic" :alt="scope.row.merchandisePic" style="max-height: 50px;max-width: 130px">
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="影片名称" width="150">
                        <template slot-scope="scope">{{scope.row.merchandiseName}}</template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="query.pageNo"
                            :page-size="query.pageSize"
                            :total="query.totalCount"
                            @current-change="aCurrentChange"
                            @prev-click='aPrev'
                            @next-click="aNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button type="primary" @click="sureNext">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="详情" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="活动名称：" :label-width="formLabelWidth">
                    <span>{{oName}}</span>
                </el-form-item>
                <el-form-item label="适用影院名称：" :label-width="formLabelWidth">
                    <span>{{oCinemaName}}</span>
                </el-form-item>
                <el-form-item label="有效期：" :label-width="formLabelWidth">
                    <span>{{oCreateDate}}</span>
                    至
                    <span>{{oEndDate}}</span>
                </el-form-item>
                <el-form-item label="支付类型：" :label-width="formLabelWidth">
                    <span v-if="oValidPayType == 0">全部</span>
                    <span v-if="oValidPayType == 1">仅非会员卡支付</span>
                    <span v-if="oValidPayType == 2">仅会员卡支付</span>
                </el-form-item>
                <el-form-item label="优惠方式：" :label-width="formLabelWidth">
                    <span v-if="oReduceType == 1">特惠价格{{oDiscountMoney}}元</span>
                    <span v-if="oReduceType == 2">满{{oAchieveMoney}}元减{{oDiscountMoney}}元</span>
                </el-form-item>
                <el-form-item label="启用状态：" :label-width="formLabelWidth">
                    <span v-if="oStatus == 1">启用</span>
                    <span v-if="oStatus == 0">未启用</span>
                </el-form-item>
                <el-form-item label="节假日是否可用：" :label-width="formLabelWidth">
                    <span v-if="oIsHolidayValid == 1">是</span>
                    <span v-if="oIsHolidayValid == 0">否</span>
                </el-form-item>
                <el-form-item
                        label="可用时间段"
                        :label-width="formLabelWidth"
                        v-if="canTimeList.length>0"
                >
                    <div v-for="(item, index) in canTimeList" style="margin-bottom: 5px">
                        <el-input
                                style="width: 150px"
                                v-model="item.startTime"
                                autocomplete="off"
                                :disabled="true"
                        >
                        </el-input>至
                        <el-input
                                style="width: 150px"
                                v-model="item.endTime"
                                autocomplete="off"
                                :disabled="true"
                        >
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item label="星期几不可用：" :label-width="formLabelWidth">
                    <span>{{oValidWeekDay}}</span>
                </el-form-item>
                <el-form-item label="是否和券共用：" :label-width="formLabelWidth">
                    <span v-if="oIsCouponTogether == 1">是</span>
                    <span v-if="oIsCouponTogether == 0">否</span>
                </el-form-item>
                <el-form-item label="限制张数：" :label-width="formLabelWidth">
                    <span v-if="oIsLimitTotal == 0">不限制</span>
                    <span v-if="oIsLimitTotal == 1">总数:{{oTotalNumber}} 剩余{{oTotalSurplus}}</span>
                </el-form-item>
                <el-form-item label="限制个人张数：" :label-width="formLabelWidth">
                    <span v-if="oIsLimitSingle == 0">不限制</span>
                    <span v-if="oIsLimitSingle == 1">总数:{{oSingleNumber}}</span>
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
                selectedSell:[],
                sellIndex:'',
                sellTableData:[],
                drawer: false,//新增抽屉弹出框
                value1:'',
                oCinemaName: '',
                oScreenName: '',
                oFilmFormatName:'',
                selectFilmFormatType:'',
                selectHallType:'',
                selectFilmType:'',
                oFilmName: '',
                oName: '',
                oCreateDate: '',
                oEndDate: '',
                oValidPayType: '',
                oReduceType: '',
                oDiscountMoney: '',
                oAchieveMoney: '',
                oCouponDesc: '',
                oIsHolidayValid:'',
                oValidWeekDay:'',
                oIsCouponTogether:'',
                oId: '',
                oIsLimitTotal:'',
                oTotalNumber:'',
                oTotalSurplus:'',
                oIsLimitSingle:'',////
                oSingleNumber:'',
                oStatus: '',
                formatList:[],//电影制式列表
                message: '', //弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 10
                },
                restaurants: [],
                merSelect:[],
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
                options: [{
                    value: '0',
                    label: '未启用'
                },
                    {
                        value: '1',
                        label: '启用'
                    }],
                canUse: [{
                    value: '0',
                    label: '否'
                },
                    {
                        value: '1',
                        label: '是'
                    }],
                oForm: {
                    name: '',
                    cinemaName: '',
                    cinemaCode: [],
                    screenName: '',
                    screenCode: [],
                    formatCode:[],
                    selectFilmType: '0',//选择影片
                    selectHallType: '0',//选择影厅
                    selectMovieType:'0',//选择制式
                    code:[],//选择影院
                    filmCode: '',
                    filmName: '',
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
                selectFormatCode: {},
                selectFilm: {},
                cinemaInfo: [],
                screenInfo: [],
                filmInfo: [],//所选影片
                dateInfo:[],//所选时间段
                startArr:[],
                endArr:[],
                value: '',
                canTimeList:[],//可用时间段列表
            };
        },
        created() {},
        mounted() {
            this.getMenu();
        },
        methods: {
            deleteSell(index) {
                this.selectedSell.splice(index, 1);
            },
            getCurrentRow(index){
                this.sellIndex=index
            },
            addTime(){
                // 筛选重复时间段
                var result = this.dateInfo.some(item => {
                    if (item == this.value1) {
                        return true;
                    }
                });
                if (result) {
                    return;
                }
                this.dateInfo.push(this.value1);
                this.startArr.push(this.value1[0])
                this.endArr.push(this.value1[1])
                console.log(this.startArr.join(','));
                console.log(this.endArr.join(','));
            },
            deletTime(index) {
                this.dateInfo.splice(index, 1);
                this.startArr.splice(index, 1);
                this.endArr.splice(index, 1);
            },
            addPage() {
                //获取新增按钮权限
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                https.fetchPost('/merchandiseDiscountActivity/addPage', '').then(data => {
                    loading.close();
                    console.log(data);
                    if (data.data.code == 'success') {
                        this.selectedSell=[];
                        // console.log(this.cinemaInfo);
                        this.oForm.code = this.cinemaInfo[0].cinemaCode;
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        // let formats = JSON.parse(Decrypt(data.data.data)).formatList;
                        // this.formatList = [];
                        // for (let i = 0; i < formats.length; i++) {
                        //     let formatList = {};
                        //     formatList.formatCode = formats[i].formatCode;
                        //     formatList.formatName = formats[i].formatName;
                        //     this.formatList.push(formatList);
                        // }
                        // this.formatList=JSON.parse(Decrypt(data.data.data)).formatList
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
            addRole() {//新增按钮操作
                console.log(this.selectedSell);
                for(let x in this.selectedSell){
                    this.merSelect.push(this.selectedSell[x].merchandiseCode)
                }
                console.log(this.merSelect.join(','));
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                if (this.oForm.code == true) {
                    this.oForm.code = this.cinemaInfo[0].code;
                }
                let filmeCodes = [];
                for (let i = 0; i < this.filmInfo.length; i++) {
                    filmeCodes.push(this.filmInfo[i].filmCode);
                }
                if (this.oForm.selectHallType == 0) {
                    this.selectScreenCode = '';
                }
                if (this.oForm.reduceType == 1) {
                    this.oForm.achieveMoney = '';
                }
                var jsonArr = [];
                jsonArr.push({ key: 'name', value: this.oForm.name });
                jsonArr.push({ key: 'cinemaCode', value: this.selectValue });
                jsonArr.push({ key: 'selectMerchandiseType', value: this.oForm.selectFilmType });
                if(this.oForm.selectFilmType!=0){
                    jsonArr.push({ key: 'merchandiseCode', value: this.merSelect.join(',') });
                }
                jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
                jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
                jsonArr.push({ key: 'reduceType', value: this.oForm.reduceType });
                if( this.oForm.reduceType==2){
                    jsonArr.push({ key: 'achieveMoney', value: this.oForm.achieveMoney });
                }
                jsonArr.push({ key: 'validPayType', value: this.oForm.validPayType });
                jsonArr.push({ key: 'discountMoney', value: this.oForm.discountMoney });
                jsonArr.push({ key: 'status', value: this.oForm.status });
                jsonArr.push({ key: 'isHolidayValid', value: this.oForm.holidayValid });
                jsonArr.push({ key: 'validWeekDay', value: this.checkedDays });
                jsonArr.push({ key: 'isCouponTogether', value: this.oForm.activityTogether });
                jsonArr.push({ key: 'activityDesc', value: this.oForm.couponDesc });
                jsonArr.push({ key: 'startTimeVal', value: this.startArr.join(',')});
                jsonArr.push({ key: 'endTimeVal', value: this.endArr.join(',')});
                jsonArr.push({ key: 'isLimitTotal', value: this.oForm.oCanNum });
                if(this.oForm.oCanNum!=0){
                    jsonArr.push({ key: 'totalNumber', value: this.oForm.oNum });
                }
                if(this.oForm.oneCanNum!=0){
                    jsonArr.push({ key: 'singleNumber', value: this.oForm.oneNum });
                    jsonArr.push({ key: 'limitSingleUnit', value: this.oForm.limitSingleUnit });
                }
                jsonArr.push({ key: 'isLimitSingle', value: this.oForm.oneCanNum });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https.fetchPost('/merchandiseDiscountActivity/addActivity', params).then(data => {//新增
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.selectedSell=[];
                            this.merSelect=[];
                            this.oForm.name = '';
                            this.selectValue = [];
                            this.oForm.selectHallType = '0';
                            this.selectScreenCode = '';
                            this.oForm.selectFilmType = '0';
                            this.oForm.filmCode = '';
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
                            this.oForm.oCanNum = '';
                            this.oForm.oNum = '';
                            this.oForm.oneCanNum = '';
                            this.oForm.oneNum = '';
                            this.oForm.selectMovieType = '0';
                            this.oForm.formatCode = '';
                            this.oForm.code = '';
                            this.getMenu();
                        } else if (data.data.code == 'nologin') {
                            this.message = data.data.message;
                            this.open();
                            this.$router.push('/login');
                        } else {
                            this.message = data.data.message;
                            this.open();
                        }
                    }).catch(err => {
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
                }).then(() => {
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
                    https.fetchPost('/merchandiseDiscountActivity/deleteById', params).then(data => {
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
            addChange(index, row) {
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
                https.fetchPost('/filmDiscountActivity/getTimesById', params).then(data => { //查询可用时间段
                    loading.close();
                    console.log(data);
                    if(JSON.parse(Decrypt(data.data.data))){
                        this.canTimeList=JSON.parse(Decrypt(data.data.data))
                    }
                    console.log(this.canTimeList);

                }).catch(err => {
                    loading.close();
                    console.log(err);
                });
                https.fetchPost('/merchandiseDiscountActivity/getActivityById', params).then(data => {
                    loading.close();
                    console.log(data);
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).cinemaName;
                        this.oScreenName = JSON.parse(Decrypt(data.data.data)).screenName;
                        this.selectHallType =JSON.parse(Decrypt(data.data.data)).selectHallType;
                        this.selectFilmFormatType =JSON.parse(Decrypt(data.data.data)).selectFilmFormatType;
                        this.selectFilmType =JSON.parse(Decrypt(data.data.data)).selectFilmType;
                        this.oFilmFormatName = JSON.parse(Decrypt(data.data.data)).filmFormatName;
                        this.oFilmName = JSON.parse(Decrypt(data.data.data)).filmName;
                        this.oName = JSON.parse(Decrypt(data.data.data)).name;
                        this.oCreateDate = JSON.parse(Decrypt(data.data.data)).createDate;
                        this.oEndDate = JSON.parse(Decrypt(data.data.data)).endDate;
                        this.oValidPayType = JSON.parse(Decrypt(data.data.data)).validPayType;
                        this.oReduceType = JSON.parse(Decrypt(data.data.data)).reduceType;
                        this.oAchieveMoney = JSON.parse(Decrypt(data.data.data)).achieveMoney;
                        this.oDiscountMoney = JSON.parse(Decrypt(data.data.data)).discountMoney;
                        this.oIsHolidayValid = JSON.parse(Decrypt(data.data.data)).isHolidayValid;
                        this.oValidWeekDay = JSON.parse(Decrypt(data.data.data)).validWeekDay;
                        this.oIsCouponTogether = JSON.parse(Decrypt(data.data.data)).isCouponTogether;
                        this.oCouponDesc = JSON.parse(Decrypt(data.data.data)).activityDesc
                        this.oIsLimitTotal = JSON.parse(Decrypt(data.data.data)).isLimitTotal
                        this.oTotalNumber = JSON.parse(Decrypt(data.data.data)).totalNumber
                        this.oTotalSurplus = JSON.parse(Decrypt(data.data.data)).totalSurplus
                        this.oIsLimitSingle = JSON.parse(Decrypt(data.data.data)).isLimitSingle
                        this.oSingleNumber = JSON.parse(Decrypt(data.data.data)).singleNumber
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
                https.fetchPost('/film/updateFilm', params).then(data => {
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
                https.fetchPost('/merchandiseDiscountActivity/updateStatusById', params).then(data => {
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
            },
            Search() {
                console.log(this.query.reduceType);
                console.log(this.query.status);
                console.log(this.query.cinemaCode);
                console.log(this.query.name);
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
                let jsonArr = [];
                jsonArr.push({ key: 'name', value: this.query.name });
                jsonArr.push({ key: 'status', value: this.query.status });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'reduceType', value: this.query.reduceType });
                jsonArr.push({ key: 'cinemaCode', value: this.query.cinemaCode });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                // jsonArr.push({ key: 'filmName', value: name });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                var params = ParamsAppend(jsonArr);
                https.fetchPost('/merchandiseDiscountActivity/page', params).then(data => {
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
                console.log(val)
                // let selectValue = val.join(',');
                this.selectValue = val;
                this.getAllScreen(val);
            },
            selectScreens(val) {
                // console.log(val)
                let selectValue = val.join(',');
                this.selectScreenCode = selectValue;
                console.log(selectValue);
            },
            selectFormat(val) {
                // console.log(val)
                this.selectFormatCode = val.join(',');
                console.log(this.selectFormatCode);
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
                https.fetchPost('filmCoupon/getScreenInfoByCinemaCode', params).then(data => {
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
            },
            one(a){//获取卖品绑定的value值
                console.log(a);
                this.oForm.filmCode =a
            },
            sureNext() {
                if(this.sellIndex>=0){
                    // this.selectedSell=[]
                    this.selectedSell.push(this.sellTableData[this.sellIndex]);
                }
                this.drawer = false;
            },
            openNext() {
                //获取商品列表
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let jsonArr = [];
                    jsonArr.push({key:"pageNo",value:this.query.pageNo});
                    jsonArr.push({key:"pageSize",value:this.query.pageSize});
                    jsonArr.push({key:"merchandiseStatus",value:1});
                    jsonArr.push({key:"cinemaCode",value:this.oForm.code});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/merchandise/list',params).then((data) => {
                        loading.close();
                        console.log(data);
                        if(data.data.code=='success') {
                            this.drawer=true
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
                            this.sellTableData = oData.data;
                            this.query.pageSize = oData.pageSize;
                            this.query.pageNo = oData.pageNo;
                            this.query.totalCount = oData.totalCount;
                            this.query.totalPage = oData.totalPage
                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message
                            this.open()
                            this.$router.push('/login');
                        }else{
                            this.message=data.data.message
                            this.open()
                        }

                    }).catch(err=>{
                        loading.close();
                        console.log(err)
                        }
                    )
                }, 500);
            },
            //新增套餐选择卖品页面
            aCurrentChange(val){//点击选择具体页数
                this.query.pageNo = val;
                this.openNext()
            },
            aPrev(){//分页按钮上一页
                this.query.pageNo--;
                this.openNext()
            },
            aNext(){//分页按钮下一页
                this.query.pageNo++;
                this.openNext()
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

