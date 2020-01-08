<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 卖品优惠券管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    v-model="query.businessCode"
                    placeholder="请选择商家"
                    class="mr10"
                    clearable
                    @change="changeBusiness"
                >
                    <el-option
                        v-for="item in businessInfo"
                        :key="item.businessCode"
                        :label="item.businessName"
                        :value="item.businessCode"
                    ></el-option>
                </el-select>
                <el-select clearable v-model="query.commonType" placeholder="通用方式" class="handle-select mr10">
                    <el-option key="1" label="全部影院" value="1"></el-option>
                    <el-option key="2" label="指定影院" value="2"></el-option>
                </el-select>
                <el-select clearable v-model="query.cinemaCode" placeholder="请选择影院" @change="changeSearchCinema" class="mr10">
                    <el-option
                        v-for="item in cinemaData"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input placeholder="优惠券名称" class="mr10" v-model="query.name" autocomplete="off"></el-input>
                <el-select clearable v-model="query.reduceType" placeholder="优惠券类型" class="handle-select mr10">
                    <el-option key="1" label="兑换券" value="1"></el-option>
                    <el-option key="2" label="代金券" value="2"></el-option>
                </el-select>
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="0" label="未启用" value="0"></el-option>
                    <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <!-- <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float:right;margin-top: 10px"
                >生成优惠券</el-button> -->
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
                <el-table-column prop="name" label="适用影院">
                    <template slot-scope="scope">{{scope.row.cinemaNames}}</template>
                </el-table-column>
                <!--<el-table-column prop="name" label="适用卖品">-->
                    <!--<template slot-scope="scope">{{scope.row.merchandiseNames}}</template>-->
                <!--</el-table-column>-->
                <el-table-column label="优惠券名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="name" label="优惠券类型" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.reduceType == 1" type="success">兑换券</el-tag>
                        <el-tag v-else type="danger">代金券</el-tag>
                    </template>
                </el-table-column>

                <!-- <el-table-column prop="memo" label="有效期">
                    <template slot-scope="scope">{{scope.row.startDate}}至{{scope.row.endDate}}</template>
                </el-table-column> -->
                <!-- <el-table-column prop="sort" label="有效天数">
                    <template slot-scope="scope">{{scope.row.publishDate}}</template>
                </el-table-column>-->
                <el-table-column prop="sort" label="金额" width="100">
                    <template slot-scope="scope">{{scope.row.discountMoney}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="满多少可用" width="110">
                    <template slot-scope="scope">{{scope.row.achieveMoney}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="总库存" width="80">
                    <template slot-scope="scope">{{scope.row.sendNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已发放" width="80">
                    <template slot-scope="scope">{{scope.row.acquireNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已使用" width="80">
                    <template slot-scope="scope">{{scope.row.usedNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button
                            type="success"
                            v-if="scope.row.status == 0"
                            @click="changeStatus(scope.$index, scope.row)"
                        >启用</el-button> -->
                        <!-- <el-button
                            type="success"
                            v-if="scope.row.status == 1"
                            @click="changeStatus(scope.$index, scope.row)"
                        >停用</el-button> -->
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.$index, scope.row)"
                        >修改</el-button>
                        <!-- <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="delChange(scope.$index, scope.row)"
                        >删除</el-button> -->
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
        <!--新增弹出框-->
        <el-dialog :close-on-click-modal="false" title="新增" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="优惠券名称：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="15" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="通用方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.commonType" @change="selectCommonType">
                        <el-radio :label="1" :disabled="showCommonType">全部影院</el-radio>
                        <el-radio :label="2" :disabled="showCommonType">指定影院</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="选择影院：" :label-width="formLabelWidth" v-if="oForm.commonType == 2">
                    <el-radio-group v-model="oForm.cinemaCode" @change="selectCinema">
                        <el-radio
                            v-for="item in cinemaInfo"
                            :label="item.cinemaCode"
                            :key="item.cinemaCode"
                            :value="item.cinemaName"
                        >{{item.cinemaName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="选择商品：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.selectMerchandiseType" @change="clearMerchandiseCode()">
                        <el-radio label="0">全部商品</el-radio>
                        <el-radio label="1">部分商品</el-radio>
                        <el-radio label="2">排除商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.selectMerchandiseType==1||oForm.selectMerchandiseType==2" label="适用卖品：" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="oForm.merchandiseCode" @change="selectGoods">
                        <el-checkbox
                            v-for="item in goodsInfo"
                            :label="item.merchandiseCode"
                            :key="item.merchandiseCode"
                            :value="item.merchandiseName"
                        >{{item.merchandiseName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="支付类型：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.validPayType">
                        <el-radio label="0">全部</el-radio>
                        <el-radio label="1">仅非会员卡支付</el-radio>
                        <el-radio label="2">仅会员卡支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="优惠方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.reduceType" @change="clearDiscountMoney()">
                        <el-radio label="1">固定价格（兑换券）</el-radio>
                        <el-radio label="2">满减（代金券）</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.reduceType == 1" label="固定金额：" :label-width="formLabelWidth">
                    <el-input placeholder="所选卖品以此价格结算" style="width: 150px" v-model="oForm.discountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.reduceType==2" label="减免金额：" :label-width="formLabelWidth">
                    满
                    <el-input style="width: 150px" v-model="oForm.achieveMoney" autocomplete="off"></el-input>减
                    <el-input style="width: 150px" v-model="oForm.discountMoney" autocomplete="off"></el-input>
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
                <el-form-item :required="true" label="节假日是否可用：" :label-width="formLabelWidth">
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
                    <el-checkbox-group :max="6" v-model="oForm.checkedDays" @change="selectDay">
                        <el-checkbox
                            v-for="(day, index) in oForm.exceptWeekDay"
                            :label="index+1"
                            :key="day"
                        >{{day}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="oForm.reduceType==2" :required="true" label="是否和活动共用" :label-width="formLabelWidth">
                    <el-select v-model="oForm.activityTogether" placeholder="请选择">
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="库存：" :label-width="formLabelWidth">
                    <el-input style="width: 100px" v-model="oForm.sendNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="使用须知：" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        show-word-limit
                        maxlength="150"
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
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="优惠券名称：" :label-width="formLabelWidth">
                    <el-input style="width: 180px" maxlength="15" v-model="oName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="通用方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oCommonType" @change="selectCommonType2">
                        <el-radio :label="1" disabled>全部影院</el-radio>
                        <el-radio :label="2" disabled>指定影院</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="所选影院" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oCinemaNames"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <!-- <el-form-item :required="true" label="选择影院：" :label-width="formLabelWidth" v-if="oCommonType == 2">
                    <el-radio-group v-model="oCinemaCode" @change="selectCinema">
                        <el-radio
                                v-for="item in cinemaInfo"
                                :label="item.cinemaCode"
                                :key="item.cinemaCode"
                                :value="item.cinemaName"
                        >{{item.cinemaName}}</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item :required="true" label="选择商品：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oSelectMerchandiseType" @change="clearMerchandiseCode()">
                        <el-radio label="0">全部商品</el-radio>
                        <el-radio label="1">部分商品</el-radio>
                        <el-radio label="2">排除商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oSelectMerchandiseType==1||oSelectMerchandiseType==2" label="适用卖品：" :label-width="formLabelWidth">
                    <!-- <el-checkbox-group v-model="oMerchandiseCode" @change="selectGoods">
                        <el-checkbox
                                v-for="item in goodsInfo"
                                :label="item.merchandiseCode"
                                :key="item.merchandiseCode"
                                :value="item.merchandiseName"
                        >{{item.merchandiseName}}</el-checkbox>
                    </el-checkbox-group> -->
                    <el-input
                        style="width: 250px"
                        v-model="oMerchandiseNames"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="支付类型：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oValidPayType">
                        <el-radio label="0">全部</el-radio>
                        <el-radio label="1">仅非会员卡支付</el-radio>
                        <el-radio label="2">仅会员卡支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="优惠方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oReduceType" @change="clearDiscountMoney()">
                        <el-radio label="1">固定价格（兑换券）</el-radio>
                        <el-radio label="2">满减（代金券）</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oReduceType == 1" label="固定金额：" :label-width="formLabelWidth">
                    <el-input placeholder="所选卖品以此价格结算" style="width: 150px" v-model="oDiscountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oReduceType==2" label="减免金额：" :label-width="formLabelWidth">
                    满
                    <el-input style="width: 150px" v-model="oAchieveMoney" autocomplete="off"></el-input>减
                    <el-input style="width: 150px" v-model="oDiscountMoney" autocomplete="off"></el-input>
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
                <el-form-item :required="true" label="节假日是否可用：" :label-width="formLabelWidth">
                    <el-select v-model="oHolidayValid" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="星期几不可用：" :label-width="formLabelWidth">
                    <el-checkbox-group :max="6" v-model="oCheckedDays" @change="selectDay">
                        <el-checkbox
                                v-for="item in oExceptWeekDay"
                                :label="item.index"
                                :key="item.index"
                                :value="item.value"
                        >{{item.value}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="oReduceType==2" :required="true" label="是否和活动共用" :label-width="formLabelWidth">
                    <el-select v-model="oActivityTogether" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="库存：" :label-width="formLabelWidth">
                    <el-input style="width: 100px" v-model="oSendNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="使用须知：" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="150"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="oCouponDesc"
                    ></el-input>
                </el-form-item>
            </el-form>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取消</el-button>
                 <el-button type="primary" @click="exChanger">确 定</el-button>
            </span> -->
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
            oExceptWeekDay: [
                {
                    index:"1",
                    value:'星期一'
                },
                {
                    index:"2",
                    value:'星期二'
                },
                {
                    index:"3",
                    value:'星期三'
                },
                {
                    index:"4",
                    value:'星期四'
                },
                {
                    index:"5",
                    value:'星期五'
                },
                {
                    index:"6",
                    value:'星期六'
                },
                {
                    index:"7",
                    value:'星期日'
                },
            ],
            oCheckedDays:[],
            oMerchandiseName: '',
            showCommonType: false,
            oCommonType: '',
            oCinemaCode: '',
            oMerchandiseCode: [],
            oSelectMerchandiseType: '',
            oCinemaNames: '',
            oName: '',
            oStartDate: '',
            oHolidayValid: '',
            oEndDate: '',
            oValidPayType: '',
            oReduceType: '',
            oDiscountMoney: '',
            oAchieveMoney: '',
            oSendNumber: '',
            oActivityTogether: '',
            oCouponDesc: '',
            oId: '',
            oStatus: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
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
                commonType: '1',
                merchandiseName: '',
                merchandiseCode: [],
                checkedDays: [],
                exceptWeekDay: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                startDate: '',
                endDate: '',
                validPayType: '0',
                achieveMoney: '',
                discountMoney: '',
                selectMerchandiseType: '0',
                reduceType: '1',
                holidayValid: '1',
                activityTogether: '1',
                couponDesc: '',
                id: '',
                status: '0'
            },
            formLabelWidth: '120px',
            selectValue: {},
            selectGoodsCode: {},
            cinemaInfo: [],
            cinemaData: [],
            businessInfo: [],
            goodsInfo: [],
            value: '',
            rowMess: '',
        };
    },
    created() {},
    mounted() {
        this.getAllBusiness();
    },
    methods: {
        clearDiscountMoney(){
            this.oForm.discountMoney='';
            this.oForm.achieveMoney='';
            this.oDiscountMoney='';
            this.oAchieveMoney='';
        },
        clearMerchandiseCode(){
            this.oForm.merchandiseCode=[];
            this.oMerchandiseCode=[];
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
            https
                .fetchPost('merchandiseCoupon/merchandiseCouponAddPage', '')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = true;
                        this.oForm.merchandiseCode = [];
                        // this.getAllGoods();
                        if (JSON.parse(Decrypt(data.data.data)).adminFlag <= 1) {
                            this.oForm.commonType = 1
                        } else {
                            this.oForm.commonType = 2;
                            this.showCommonType = true;
                        }
                        // console.log(this.oForm.checkedDays)
                        // let checkedDays = this.oForm.checkedDays.join(',');
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
            if (!this.oForm.name){
                this.message = '优惠券名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.commonType) {
                this.message = '类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oForm.commonType == 2) {
                if (!this.oForm.cinemaCode){
                    this.message = '所选影院不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oForm.selectMerchandiseType){
                this.message = '卖品类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.selectMerchandiseType==1||this.oForm.selectMerchandiseType==2){
                if(this.oForm.merchandiseCode.length==0){
                    this.message = '所选卖品不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oForm.validPayType){
                this.message = '支付类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.reduceType){
                this.message = '优惠方式不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.reduceType==1){
                if(this.oForm.discountMoney>=0){
                    if(!this.oForm.discountMoney){
                        this.message = '固定金额不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oForm.discountMoney<0){
                    this.message = '固定金额不能小于0！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.reduceType==2){
                if(this.oForm.discountMoney>=0||this.oForm.achieveMoney>=0){
                    if(!this.oForm.discountMoney||!this.oForm.achieveMoney){
                        this.message = '减免金额不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oForm.discountMoney<0||this.oForm.achieveMoney<0){
                    this.message = '减免金额不能小于0！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oForm.achieveMoney==0&&this.oForm.discountMoney==0){
                    this.message = '请输入合理的满减金额！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oForm.status){
                this.message = '开启状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.holidayValid){
                this.message = '节假日是否可用不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.activityTogether){
                this.message = '是否和活动共用不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.sendNumber!=0){
                if(!this.oForm.sendNumber){
                    this.message = '库存不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                else if(this.oForm.sendNumber<0){
                    this.message = '库存不能小于0！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.reduceType==1&&this.oForm.discountMoney==0){
                if(this.oForm.validPayType==0||this.oForm.validPayType==2){
                    this.message = '优惠券0元固定价格的时候只能选择非会员支付！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (this.oForm.cinemaCode == true) {
                this.oForm.cinemaCode = this.cinemaInfo[0].cinemaCode;
            }
            if(this.oForm.reduceType==1){
                this.oForm.activityTogether=='0'
            }
            var jsonArr = [];
            jsonArr.push({ key: 'name', value: this.oForm.name });
            jsonArr.push({ key: 'commonType', value: this.oForm.commonType });
            jsonArr.push({ key: 'cinemaCodes', value: this.selectValue });
            jsonArr.push({ key: 'selectMerchandiseType', value: this.oForm.selectMerchandiseType });
            jsonArr.push({ key: 'merchandiseCode', value: this.selectGoodsCode });
            // jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
            // jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
            jsonArr.push({ key: 'reduceType', value: this.oForm.reduceType });
            jsonArr.push({ key: 'validPayType', value: this.oForm.validPayType });
            jsonArr.push({ key: 'achieveMoney', value: this.oForm.achieveMoney });
            jsonArr.push({ key: 'discountMoney', value: this.oForm.discountMoney });
            jsonArr.push({ key: 'status', value: this.oForm.status });
            jsonArr.push({ key: 'holidayValid', value: this.oForm.holidayValid });
            jsonArr.push({ key: 'exceptWeekDay', value: this.checkedDays });
            jsonArr.push({ key: 'activityTogether', value: this.oForm.activityTogether });
            jsonArr.push({ key: 'sendNumber', value: this.oForm.sendNumber });
            jsonArr.push({ key: 'couponDesc', value: this.oForm.couponDesc });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('merchandiseCoupon/addMerchandiseCoupon', params)
                    .then(data => {
                        loading.close();
                        //新增
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.oForm.name = '';
                            this.oForm.commonType = '1';
                            this.oForm.cinemaCode = [];
                            this.cinemaInfo = [];
                            this.oForm.cinemaName = '';
                            this.oForm.merchandiseCode = [];
                            this.oForm.merchandiseName = '';
                            this.oForm.selectMerchandiseType = '0';
                            this.oForm.validPayType = '0';
                            this.oForm.reduceType = '1';
                            this.oForm.achieveMoney = '';
                            this.oForm.discountMoney = '';
                            this.oForm.holidayValid = '1';
                            this.oForm.checkedDays = [];
                            this.oForm.status = '0';
                            this.oForm.activityTogether = '1';
                            this.oForm.sendNumber = '';
                            this.oForm.couponDesc = '';
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
                    this.idx = index;
                    this.form = row;
                    let jsonArr = [];
                    jsonArr.push({ key: 'id', value: row.id });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('merchandiseCoupon/deleteById', params)
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
            https
                .fetchPost('/admin/merchandiseCoupon/getMerchandiseCouponById', params)
                .then(data => {
                    loading.close();
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.cinemaInfo = [];
                        this.oMerchandiseCode = [];
                        for (let i = 0; i < JSON.parse(Decrypt(data.data.data)).cinemaList.length; i++) {
                            let cinemaList = {};
                            cinemaList.cinemaCode = JSON.parse(Decrypt(data.data.data)).cinemaList[i].cinemaCode;
                            cinemaList.cinemaName = JSON.parse(Decrypt(data.data.data)).cinemaList[i].cinemaName;
                            this.cinemaInfo.push(cinemaList);
                        }
                        this.oMerchandiseName = JSON.parse(Decrypt(data.data.data)).coupon.merchandiseNames;
                        this.oCommonType = JSON.parse(Decrypt(data.data.data)).coupon.commonType;
                        this.oCinemaNames = JSON.parse(Decrypt(data.data.data)).coupon.cinemaNames;
                        this.oMerchandiseNames = JSON.parse(Decrypt(data.data.data)).coupon.merchandiseNames;
                        this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).coupon.cinemaCodes;
                        this.oName = JSON.parse(Decrypt(data.data.data)).coupon.name;
                        // this.oStartDate = JSON.parse(Decrypt(data.data.data)).coupon.startDate;
                        this.oSendNumber = JSON.parse(Decrypt(data.data.data)).coupon.sendNumber;
                        // this.oEndDate = JSON.parse(Decrypt(data.data.data)).coupon.endDate;
                        if (JSON.parse(Decrypt(data.data.data)).coupon.validPayType == 0) {
                            this.oValidPayType = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).coupon.validPayType == 1) {
                            this.oValidPayType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).coupon.validPayType == 2) {
                            this.oValidPayType = '2';
                        }
                        this.oAchieveMoney = JSON.parse(Decrypt(data.data.data)).coupon.achieveMoney;
                        if (JSON.parse(Decrypt(data.data.data)).coupon.reduceType == 1) {
                            this.oReduceType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).coupon.reduceType == 2) {
                            this.oReduceType = '2';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).coupon.selectMerchandiseType == 0) {
                            this.oSelectMerchandiseType = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).coupon.selectMerchandiseType == 1) {
                            this.oSelectMerchandiseType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).coupon.selectMerchandiseType == 2) {
                            this.oSelectMerchandiseType = '2';
                        }
                        this.oDiscountMoney = JSON.parse(Decrypt(data.data.data)).coupon.discountMoney;
                        this.oCouponDesc = JSON.parse(Decrypt(data.data.data)).coupon.couponDesc;
                        if(JSON.parse(Decrypt(data.data.data)).coupon.exceptWeekDay){
                            this.oCheckedDays = JSON.parse(Decrypt(data.data.data)).coupon.exceptWeekDay.split(",");
                        }
                        else {
                            this.oCheckedDays =[]
                        }
                        if(JSON.parse(Decrypt(data.data.data)).coupon.merchandiseCode){
                            this.oMerchandiseCode = JSON.parse(Decrypt(data.data.data)).coupon.merchandiseCode.split(",");
                        }
                        this.oId = JSON.parse(Decrypt(data.data.data)).coupon.id;
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).coupon.activityTogether) {
                                this.oActivityTogether = this.canUse[x].value;
                                break;
                            }
                        }
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).coupon.holidayValid) {
                                this.oHolidayValid = this.canUse[x].value;
                                break;
                            }
                        }
                        for (let x in this.options) {
                            if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).coupon.status) {
                                this.oStatus = this.options[x].value;
                                break;
                            }
                        }
                        // this.getAllGoods(this.oCinemaCode);
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
            if (!this.oName){
                this.message = '优惠券名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oCommonType == 2) {
                if (!this.oCinemaCode){
                    this.message = '所选影院不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oSelectMerchandiseType){
                this.message = '卖品类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oSelectMerchandiseType==1||this.oSelectMerchandiseType==2){
                if(this.oMerchandiseCode.length==0){
                    this.message = '所选卖品不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oValidPayType){
                this.message = '支付类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oReduceType){
                this.message = '优惠方式不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oReduceType==1){
                if(this.oDiscountMoney>0){
                    if(!this.oDiscountMoney){
                        this.message = '固定金额不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oDiscountMoney<0){
                    this.message = '固定金额不能小于0！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oReduceType==2){
                if(this.oDiscountMoney>0||this.oAchieveMoney>0){
                    if(!this.oDiscountMoney||!this.oAchieveMoney){
                        this.message = '减免金额不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oDiscountMoney<0||this.oAchieveMoney<0){
                    this.message = '减免金额不能小于0！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oAchieveMoney==0&&this.oDiscountMoney==0){
                    this.message = '请输入合理的满减金额！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oStatus){
                this.message = '开启状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oHolidayValid){
                this.message = '节假日是否可用不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oActivityTogether){
                this.message = '是否和活动共用不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oSendNumber!=0){
                if(!this.oSendNumber){
                    this.message = '库存不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                else if(this.oSendNumber<0){
                    this.message = '库存不能小于0！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oReduceType==1&&this.oDiscountMoney==0){
                if(this.oValidPayType==0||this.oValidPayType==2){
                    this.message = '优惠券0元固定价格的时候只能选择非会员支付！';
                    this.open();
                    loading.close();
                    return;
                }

            }
            var jsonArr = [];
            jsonArr.push({ key: 'name', value: this.oName });
            jsonArr.push({ key: 'commonType', value: this.oCommonType });
            jsonArr.push({ key: 'cinemaCodes', value: this.oCinemaCode });
            jsonArr.push({ key: 'selectMerchandiseType', value: this.oSelectMerchandiseType });
            jsonArr.push({ key: 'merchandiseCode', value: this.oMerchandiseCode.join(',') });
            jsonArr.push({ key: 'reduceType', value: this.oReduceType });
            jsonArr.push({ key: 'achieveMoney', value: this.oAchieveMoney });
            jsonArr.push({ key: 'discountMoney', value: this.oDiscountMoney });
            // jsonArr.push({ key: 'startDate', value: this.oStartDate});
            // jsonArr.push({ key: 'endDate', value: this.oEndDate });
            jsonArr.push({ key: 'status', value: this.oStatus });
            jsonArr.push({ key: 'couponDesc', value: this.oCouponDesc });
            jsonArr.push({ key: 'holidayValid', value: this.oHolidayValid });
            jsonArr.push({ key: 'exceptWeekDay', value: this.oCheckedDays.join(',') });
            jsonArr.push({ key: 'validPayType', value: this.oValidPayType });
            jsonArr.push({ key: 'sendNumber', value: this.oSendNumber });
            jsonArr.push({ key: 'activityTogether', value: this.oActivityTogether });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/merchandiseCoupon/updateCouponById', params)
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
        // 修改状态
        changeStatus(index, row) {
            if(row.status==0){
                this.rowMess='启用'
            }
            if(row.status==1){
                this.rowMess='停用'
            }
            this.$confirm('是否确定'+this.rowMess+'此优惠券?', '提示', {
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
                        .fetchPost('merchandiseCoupon/updateCouponStatusById', params)
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
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消修改'
                });
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
            setTimeout(() => {
            let businessCode = this.query.businessCode;
            let cinemaCode = this.query.cinemaCode;
            let reduceType = this.query.reduceType;
            let commonType = this.query.commonType;
            let name = this.query.name;
            let status = this.query.status;
            if (!businessCode) {
                businessCode = '';
            }
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!reduceType) {
                reduceType = '';
            }
            if (!commonType) {
                commonType = '';
            }
            if (!name) {
                name = '';
            }
            if (!status) {
                status = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'businessCode', value: businessCode });
            jsonArr.push({ key: 'reduceType', value: reduceType });
            jsonArr.push({ key: 'commonType', value: commonType });
            jsonArr.push({ key: 'name', value: name });
            jsonArr.push({ key: 'status', value: status });
            jsonArr.push({ key: 'cinemaCodes', value: cinemaCode });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/admin/merchandiseCoupon/merchandiseCouponPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        if (data.data && data.data.data) {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.tableData = oData.pageResult.data;
                            this.query.pageSize = oData.pageResult.pageSize;
                            this.query.pageNo = oData.pageResult.pageNo;
                            this.query.totalCount = oData.pageResult.totalCount;
                            this.query.totalPage = oData.pageResult.totalPage;
                        } else {
                            this.tableData = [];
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
                },1000)
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        selectCommonType(val) {
            if (val == 2) {
                // this.getAllGoods(this.oForm.cinemaCode);
            } else {
                // this.getAllGoods();
            }
        },
        selectCommonType2(val) {
            if (val == 2) {
                // this.getAllGoods(this.oCinemaCode);
            } else {
                // this.getAllGoods();
            }
        },
        selectCinema(val) {
            console.log(val);
            this.oMerchandiseCode=[];
            this.selectValue = val;
            // this.getAllGoods(val);
        },
        selectGoods(val) {
            // console.log(val)
            let selectValue = val.join(',');
            this.selectGoodsCode = selectValue;
        },
        selectDay(val) {
            // console.log(val)
            this.checkedDays = val.join(',');
        },
        // 获取所有影院
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
        changeBusiness(val) {
            this.query.cinemaCode = '';
            this.cinemaData = [];
            this.query.businessCode = val;
            this.getAllCinema();
            this.$forceUpdate();
        },
        changeSearchCinema(val) {
            this.$forceUpdate();
            this.query.cinemaCode = val;
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
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.cinemaData = res;
                        this.oForm.cinemaCode = this.cinemaInfo[0].cinemaCode;
                        this.selectValue = this.cinemaInfo[0].cinemaCode;
                        console.log(res);
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
        // 获取所选影院卖品
        getAllGoods(value) {
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: value });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/admin/merchandiseCoupon/getMerchandiseByCinemaCode', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        let goods = JSON.parse(Decrypt(data.data.data));
                        this.goodsInfo = [];
                        for (let i = 0; i < goods.length; i++) {
                            let goodsList = {};
                            goodsList.merchandiseCode = goods[i].merchandiseCode;
                            goodsList.merchandiseName = goods[i].merchandiseName;
                            this.goodsInfo.push(goodsList);
                        }
                        // console.log(this.goodsInfo);
                        // console.log(this.oExceptWeekDay);
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
