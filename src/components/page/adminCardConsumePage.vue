<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 会员卡消费记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    v-model="query.businessCode"
                    placeholder="请选择商家"
                    class="mr10"
                    filterable
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
                <el-select filterable clearable v-model="query.cinemaCode" placeholder="请选择开卡影院"  @change="changeSearchCinema" class="mr10">
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-select filterable clearable v-model="query.consumeCinemaCode" placeholder="请选择充值影院"  @change="changeSearchCinema2" class="mr10">
                    <el-option
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="会员卡号"
                    v-model="query.orderNo"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    placeholder="手机号"
                    v-model="query.mobilePhone"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="交易状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="成功" value="1"></el-option>
                    <el-option key="2" label="失败" value="2"></el-option>
                </el-select>
                <el-date-picker
                    v-model="query.startDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="消费开始时间（起）"
                    class="mr10"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.endDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="消费结束时间（止）"
                    class="mr10"
                ></el-date-picker>
                <el-select
                        clearable
                        v-model="query.orderType"
                        placeholder="订单类型"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="购票" value="1"></el-option>
                    <el-option key="2" label="卖品" value="2"></el-option>
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
            </div>
            <div class="handle-box">
                总消费金额：
                <el-input
                    style="width: 150px"
                    v-model="totalData.totalActualPrice"
                    :disabled="true"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
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
                <el-table-column prop="name" label="开卡影院">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="消费影院">
                    <template slot-scope="scope">{{scope.row.consumeCinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="消费明细">
                    <template slot-scope="scope">{{scope.row.consumeDetail}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="消费卡号" width="110">
                    <template slot-scope="scope">{{scope.row.cardNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="下单手机号" width="110">
                    <template slot-scope="scope">{{scope.row.mobilePhone}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="消费金额" width="80">
                    <template slot-scope="scope">{{scope.row.consumeAmount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="消费时间" width="160">
                    <template slot-scope="scope">{{scope.row.consumeTime}}</template>
                </el-table-column>
                <!--<el-table-column prop="memo" label="消费结果" width="305">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-tag v-if="!scope.row.errorMessage">消费成功</el-tag>-->
                        <!--<el-tag v-else>{{scope.row.errorMessage}}</el-tag>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="订单类型" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.orderType=='1'">购票</el-tag>
                        <el-tag v-else>卖品</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="交易状态" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'" type='success'>成功</el-tag>
                        <el-tag v-else type='danger'>失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="90">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="addChange(scope.$index, scope.row)"
                        >详情</el-button>
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
                <el-form-item label="开卡影院名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="消费影院名称" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.consumeCinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会员卡所属用户" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.userName"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="卡号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cardNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="订单号" :label-width="formLabelWidth">
                    <el-input
                            :disabled="true"
                            style="width: 250px"
                            v-model="form.orderCode"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.mobilePhone"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="消费金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.consumeAmount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="消费明细" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.consumeDetail"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="交易状态" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.status"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="接口调用结果" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        type="textarea"
                        v-model="form.errorMessage"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="订单类型" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.orderType"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="消费时间" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.consumeTime"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
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
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            formLabelWidth: '120px',
            businessInfoList: [],
            value: '',
            form: [],
            cinemaInfo: [],
            businessInfo:[]
        };
    },
    created() {},
    mounted() {
        this.getAllBusiness();
    },
    methods: {
        derive(){
            // const loading = this.$loading({
            //     lock: true,
            //     text: 'Loading',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.7)',
            //     target: document.querySelector('.div1')
            // });
            setTimeout(() => {
                let cinemaCode = this.query.cinemaCode;
                let consumeCinemaCode = this.query.consumeCinemaCode;
                let businessCode = this.query.businessCode;
                let orderType = this.query.orderType;
                let cardNo = this.query.cardNo;
                let mobilePhone = this.query.mobilePhone;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                if (!orderType) {
                    orderType = '';
                }
                if (!consumeCinemaCode) {
                    consumeCinemaCode = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!businessCode) {
                    businessCode = '';
                }
                if (!cardNo) {
                    cardNo = '';
                }
                if (!mobilePhone) {
                    mobilePhone = '';
                }
                if (!startDate) {
                    startDate = '';
                }
                if (!endDate) {
                    endDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'tableName', value: "member_card_consume" });
                jsonArr.push({ key: 'exportKeysJson', value: "['id','cinemaCode','cinemaName','consumeCinemaCode','consumeCinemaName','cardNo','userName','mobilePhone','consumeAmount','consumeDetail','chStatus','orderCode','chOrderType','consumeTime','errorMessage','userName','orderCode']"});
                jsonArr.push({ key: 'exportTitlesJson', value:"['ID','开卡影院编码','开卡影院名称','消费影院编码','消费影院名称','消费卡号','会员卡所属用户','消费手机号','消费金额','消费明细','支付状态','订单号','订单类型','消费时间','接口调用结果','会员卡所属用户','订单号']" });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'consumeCinemaCode', value: consumeCinemaCode });
                jsonArr.push({ key: 'businessCode', value: businessCode });
                jsonArr.push({ key: 'cardNo', value: cardNo });
                jsonArr.push({ key: 'mobilePhone', value: mobilePhone });
                jsonArr.push({ key: 'orderType', value: orderType });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                var params = ParamsAppend(jsonArr);
                console.log(jsonArr);
                let businessName = '';
                for (let i = 0;i < this.businessInfo.length; i ++) {
                    if (businessCode == this.businessInfo[i].businessCode) {
                        businessName = this.businessInfo[i].businessName
                    }
                }
                let myObj = {
                    method: 'get',
                    url: '/exportExcel/memberCardConsume',
                    fileName: businessName + '_会员卡消费记录订单统计',
                    params: params
                };
                https.exportCouponMethod(myObj);
                // loading.close();
            }, 1500);
        },
        addChange(index, row) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: row.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/admin/memberCardConsume/getMemberCardConsumeById', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            this.editVisible = true;
                            this.form = oData;
                            if (oData.status == 1) {
                                this.form.status = '成功';
                            } else if (oData.status == 2) {
                                this.form.status = '失败';
                            }
                            if (oData.orderType == 1) {
                                this.form.orderType = '购票';
                            } else if (oData.orderType == 2) {
                                this.form.orderType = '卖品';
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
        Search() {
            this.query.pageNo = 1;
            this.getMenu();
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
            this.query.consumeCinemaCode = '';
            this.cinemaInfo = [];
            this.query.businessCode = val;
            this.getAllCinema();
            this.$forceUpdate();
        },
        changeSearchCinema(val) {
            this.$forceUpdate();
            this.query.cinemaCode = val;
        },
        changeSearchCinema2(val) {
            this.$forceUpdate();
            this.query.consumeCinemaCode = val;
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
                        this.cinemaInfo = res;
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
                let orderNo = this.query.orderNo;
                let mobilePhone = this.query.mobilePhone;
                let status = this.query.status;
                let orderType = this.query.orderType;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let consumeCinemaCode = this.query.consumeCinemaCode;
                if (!consumeCinemaCode) {
                    consumeCinemaCode = '';
                }
                if (!businessCode) {
                    businessCode = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!orderNo) {
                    orderNo = '';
                }
                if (!mobilePhone) {
                    mobilePhone = '';
                }
                if (!status) {
                    status = '';
                }
                if (!orderType) {
                    orderType = '';
                }
                if (!startDate) {
                    startDate = '';
                }
                if (!endDate) {
                    endDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'businessCode', value: businessCode });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'cardNo', value: orderNo });
                jsonArr.push({ key: 'mobilePhone', value: mobilePhone });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'orderType', value: orderType });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'consumeCinemaCode', value: consumeCinemaCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https.fetchPost('/admin/memberCardConsume/cardConsumePage', params).then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            if (data.data && data.data.data) {
                                var oData = JSON.parse(Decrypt(data.data.data));
                                this.tableData = oData.memberCardConsume.data;
                                this.totalData = oData.memberCardStatistics;
                                this.query.pageSize = oData.memberCardConsume.pageSize;
                                this.query.pageNo = oData.memberCardConsume.pageNo;
                                this.query.totalCount = oData.memberCardConsume.totalCount;
                                this.query.totalPage = oData.memberCardConsume.totalPage;
                            } else {
                                this.tableData = [];
                                this.totalData = [];
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
            }, 1000);
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        handleSizeChange(val) {
            this.query.pageSize=val;
            this.getMenu()
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

