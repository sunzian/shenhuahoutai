<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 卖品通知
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="送餐地址">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">{{scope.row.orderNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="取货码">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="卖品内容">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="总数量">
                    <template slot-scope="scope">{{scope.row.printNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号">
                    <template slot-scope="scope">{{scope.row.merNames}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="订单号">
                    <template slot-scope="scope">{{scope.row.totalOriginalPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="用户名">
                    <template slot-scope="scope">{{scope.row.totalActualPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="原价">
                    <template slot-scope="scope">{{scope.row.totalActivityDiscount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="实付金额">
                    <template slot-scope="scope">{{scope.row.totalCouponDiscount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="优惠金额">
                    <template slot-scope="scope">{{scope.row.userCouponName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付状态">
                    <template slot-scope="scope">{{scope.row.payTime}}</template>
                </el-table-column>
                <el-table-column label="支付时间" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row. payWay=='0'">微信</el-tag>
                        <el-tag v-else-if="scope.row. payWay=='1'">会员卡</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="取货方式" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.deliveryType=='0'">自取</el-tag>
                        <el-tag v-else-if="scope.row.deliveryType=='1'">送至影厅</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center"  fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-setting"
                                @click="addChange(scope.$index, scope.row)"
                        >取货</el-button>
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
    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import {Decrypt,Encrypt,preSign,EncryptReplace,ParamsAppend} from '@/aes/utils';
    import md5 from 'js-md5';
    import axios from 'axios';
    import https from "../../https";
    export default {
        name: 'basetable',
        data() {
            return {
                totalData:[],
                tableData:[],
                message:'',//弹出框消息
                query: {
                    pageNo:1,
                    pageSize:10
                },
                editVisible: false,
                pageTotal: 0,
                idx: -1,
                id: -1,
                formLabelWidth: '120px',
                businessInfoList: [],
                value: '',
                form:[],
            };
        },
        created() {},
        mounted() {
            this.getMenu();
        },
        methods: {
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
                        .fetchPost('/ticketOrder/getOrderById', params)
                        .then(data => {
                            loading.close();
                            console.log(data);
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            if (data.data.code == 'success') {
                                this.editVisible = true;
                                this.form.id = row.id;
                                this.form=JSON.parse(Decrypt(data.data.data));
                                if(JSON.parse(Decrypt(data.data.data)).payWay==0){
                                    this.form.payWay='微信'
                                }else if(JSON.parse(Decrypt(data.data.data)).payWay==1){
                                    this.form.payWay='会员卡'
                                }
                                if(JSON.parse(Decrypt(data.data.data)).payStatus==0){
                                    this.form.payStatus='未支付'
                                }else if(JSON.parse(Decrypt(data.data.data)).payStatus==1){
                                    this.form.payStatus='支付成功'
                                }
                                else if(JSON.parse(Decrypt(data.data.data)).payStatus==2){
                                    this.form.payStatus='支付失败'
                                }
                                else if(JSON.parse(Decrypt(data.data.data)).payStatus==3){
                                    this.form.payStatus='退款成功'
                                }
                                if(JSON.parse(Decrypt(data.data.data)).cancelStatus==0){
                                    this.form.cancelStatus='未退票'
                                }else if(JSON.parse(Decrypt(data.data.data)).cancelStatus==1){
                                    this.form.cancelStatus='已退票'
                                }
                                if(JSON.parse(Decrypt(data.data.data)).submitStatus==0){
                                    this.form.submitStatus='未下单'
                                }else if(JSON.parse(Decrypt(data.data.data)).submitStatus==1){
                                    this.form.submitStatus='下单成功'
                                }
                                else if(JSON.parse(Decrypt(data.data.data)).submitStatus==2){
                                    this.form.submitStatus='下单失败'
                                }
                                if(JSON.parse(Decrypt(data.data.data)).activityType==1){
                                    this.form.activityType='特惠'
                                }else if(JSON.parse(Decrypt(data.data.data)).activityType==2){
                                    this.form.activityType='立减'
                                }
                                else if(JSON.parse(Decrypt(data.data.data)).activityType==3){
                                    this.form.activityType='权益卡'
                                }
                                if(JSON.parse(Decrypt(data.data.data)).refundStatus==0){
                                    this.form.refundStatus='未退款'
                                }else if(JSON.parse(Decrypt(data.data.data)).refundStatus==1){
                                    this.form.refundStatus='已退款'
                                }
                            } else if (data.data.code == 'nologin') {
                                this.message = data.data.message;
                                this.open();
                                this.$router.push('/login');
                            } else {
                                this.message = data.data.message;
                                this.open();
                            }
                        }).catch(err=>{
                            loading.close();
                            console.log(err)
                        }
                    )
                }, 500);
            },
            Search(){
                this.query.pageNo=1
                this.getMenu()
            },
            getMenu(){//获取菜单栏
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    https.fetchPost('/merchandiseOrder/merchandiseOrderNotice','').then((data) => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            this.tableData = oData.pageResult.data;
                            this.totalData = oData.totalMerchandiseOrder;
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
                }, 500);
            },
            openOrderNotice() {
                const {href} = this.$router.resolve({
                    path: `/merchandiseOrderNotice`
                });
                window.open(href, '_blank');
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
        font-size: 14px;
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

