<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 优惠券开通记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.cinemaCode" placeholder="请选择影院" class="mr10">
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="优惠券名称"
                    v-model="query.couponName"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.couponType"
                    placeholder="优惠券类型"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="影票" value="1"></el-option>
                    <el-option key="2" label="卖品" value="2"></el-option>
                    <el-option key="3" label="商城" value="3"></el-option>
                </el-select>
                <el-date-picker
                        v-model="query.startOpenDate"
                        type="datetime"
                        class="mr10"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        default-time="06:00:00"
                        placeholder="开通时间（起）"
                ></el-date-picker>
                <el-date-picker
                        v-model="query.endOpenDate"
                        type="datetime"
                        class="mr10"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="开通时间（止）"
                ></el-date-picker>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    style="margin-top: 10px;width: 90px;"
                    @click="Search"
                >搜索</el-button>
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
                <el-table-column prop="name" label="适用影院" width="200">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="优惠券名称" width="100">
                    <template slot-scope="scope">{{scope.row.couponName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="优惠券类型" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.couponType == 1">影票</el-tag>
                        <el-tag v-if="scope.row.couponType == 2">卖品</el-tag>
                        <el-tag v-if="scope.row.couponType == 3">商城</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="开通人" width="180">
                    <template slot-scope="scope">{{scope.row.openUserName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="开通时间" width="180">
                    <template slot-scope="scope">{{scope.row.createDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="开通原因">
                    <template slot-scope="scope">{{scope.row.memo}}</template>
                </el-table-column>
                <el-table-column label="起始序列号" width="180">
                    <template slot-scope="scope">{{scope.row.startNumber}}</template>
                </el-table-column>
                <el-table-column label="结束序列号" width="180">
                    <template slot-scope="scope">{{scope.row.endNumber}}</template>
                </el-table-column>
                <el-table-column label="开通数量" width="80">
                    <template slot-scope="scope">{{scope.row.openCount}}</template>
                </el-table-column>
                <el-table-column label="已使用数量" width="80">
                    <template slot-scope="scope">{{scope.row.useCount}}</template>
                </el-table-column>
                <el-table-column label="到期后未使用数量" width="80">
                    <template slot-scope="scope">{{scope.row.expireCount}}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
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
                <el-form-item label="适用影院：" :label-width="formLabelWidth">
                    <span>{{form.cinemaName}}</span>
                </el-form-item>
                <el-form-item label="优惠券名称：" :label-width="formLabelWidth">
                    <span>{{form.couponName}}</span>
                </el-form-item>
                <el-form-item label="优惠券类型：" :label-width="formLabelWidth">
                    <span v-if="form.couponType == 1">影票</span>
                    <span v-if="form.couponType == 2">卖品</span>
                    <span v-if="form.couponType == 3">商城</span>
                </el-form-item>
                <el-form-item label="开通人：" :label-width="formLabelWidth">
                    <span>{{form.openUserName}}</span>
                </el-form-item>
                <el-form-item label="开通原因：" :label-width="formLabelWidth">
                    <span>{{form.memo}}</span>
                </el-form-item>
                <el-form-item label="起始序列号：" :label-width="formLabelWidth">
                    <span>{{form.startNumber}}</span>
                </el-form-item>
                <el-form-item label="结束序列号：" :label-width="formLabelWidth">
                    <span>{{form.endNumber}}</span>
                </el-form-item>
                <el-form-item label="开通数量：" :label-width="formLabelWidth">
                    <span>{{form.openCount}}</span>
                </el-form-item>
                <el-form-item label="开通时间：" :label-width="formLabelWidth">
                    <span>{{form.createDate}}</span>
                </el-form-item>
                <el-form-item label="有效期类型：" :label-width="formLabelWidth">
                    <span v-if="form.validityType == 1">固定天数后过期</span>
                    <span v-if="form.validityType == 2">固定有效时间段</span>
                </el-form-item>
                <el-form-item label="用户绑定后有效期天数：" :label-width="formLabelWidth" v-if="form.validityType == 1">
                    <span>{{form.validityDay}}</span>
                </el-form-item>
                <el-form-item label="有效期开始时间：" :label-width="formLabelWidth" v-if="form.validityType == 2">
                    <span>{{form.startDate}}</span>
                </el-form-item>
                <el-form-item label="有效期结束时间：" :label-width="formLabelWidth" v-if="form.validityType == 2">
                    <span>{{form.endDate}}</span>
                </el-form-item>
                <el-form-item label="已使用数量：" :label-width="formLabelWidth">
                    <span>{{form.useCount}}</span>
                </el-form-item>
                <el-form-item label="已绑定数量：" :label-width="formLabelWidth">
                    <span>{{form.bindCount}}</span>
                </el-form-item>
                <el-form-item label="到期后未使用数量：" :label-width="formLabelWidth">
                    <span>{{form.expireCount}}</span>
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
            formLabelWidth: '175px',
            businessInfoList: [],
            value: '',
            form: [],
            cinemaInfo: []
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
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
                    .fetchPost('/CouponBackGround/couponOpenRecordDetail', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData)
                            this.editVisible = true;
                            this.form = oData;
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
                let cinemaCode = this.query.cinemaCode;
                let couponName = this.query.couponName;
                let couponType = this.query.couponType;
                let startOpenDate = this.query.startOpenDate;
                let endOpenDate = this.query.endOpenDate;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!couponName) {
                    couponName = '';
                }
                if (!couponType) {
                    couponType = '';
                }
                if (!startOpenDate) {
                    startOpenDate = '';
                }
                if (!endOpenDate) {
                    endOpenDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'couponName', value: couponName });
                jsonArr.push({ key: 'couponType', value: couponType });
                jsonArr.push({ key: 'startOpenDate', value: startOpenDate });
                jsonArr.push({ key: 'endOpenDate', value: endOpenDate });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/CouponBackGround/couponOpenRecordPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
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

