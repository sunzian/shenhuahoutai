<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影票订单
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input placeholder="订单号" style="width: 150px" v-model="query.orderNo" autocomplete="off"></el-input>
                <el-input placeholder="手机号" style="width: 150px" v-model="query.mobile" autocomplete="off"></el-input>
                <el-select clearable v-model="query.payWay" placeholder="支付方式" class="handle-select mr10">
                    <el-option key="0" label="微信" value="0"></el-option>
                    <el-option key="1" label="会员卡" value="1"></el-option>
                </el-select>
                <el-select clearable v-model="query.payStatus" placeholder="支付状态" class="handle-select mr10">
                    <el-option key="1" label="支付成功" value="1"></el-option>
                    <el-option key="2" label="支付失败" value="2"></el-option>
                    <el-option key="3" label="退款成功" value="3"></el-option>
                </el-select>
                <el-select clearable v-model="query.submitStatus" placeholder="下单状态" class="handle-select mr10">
                    <el-option key="0" label="未下单" value="0"></el-option>
                    <el-option key="1" label="下单成功" value="1"></el-option>
                    <el-option key="2" label="下单失败" value="2"></el-option>
                </el-select>
                <el-date-picker
                        style="width: 200px;"
                        v-model="query.startDate"
                        type="date"
                        placeholder="开始时间">
                </el-date-picker>至
                <el-date-picker
                        style="width: 200px;"
                        v-model="query.endDate"
                        type="date"
                        placeholder="结束时间">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
            </div>
            <div class="handle-box">
                总实付价<el-input placeholder="订单号" style="width: 150px" v-model="query.orderNo" autocomplete="off"></el-input>
                总优惠券金额<el-input placeholder="手机号" style="width: 150px" v-model="query.mobile" autocomplete="off"></el-input>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="影院编码">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column label="订单号">
                    <template slot-scope="scope">{{scope.row.orderNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="场次时间">
                    <template slot-scope="scope">{{scope.row.sessionTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号码">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影片名称">
                    <template slot-scope="scope">{{scope.row.filmName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="票数">
                    <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="座位">
                    <template slot-scope="scope">{{scope.row.seatName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影票总原价">
                    <template slot-scope="scope">{{scope.row.totalOriginalPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影票总实付价">
                    <template slot-scope="scope">{{scope.row.totalActualPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="总服务费">
                    <template slot-scope="scope">{{scope.row.totalServiceFee}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="总平台手续费">
                    <template slot-scope="scope">{{scope.row.totalPlatHandFee}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="活动优惠金额">
                    <template slot-scope="scope">{{scope.row.totalActivityDiscount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影票优惠券优惠金额">
                    <template slot-scope="scope">{{scope.row.totalCouponDiscount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付时间">
                    <template slot-scope="scope">{{scope.row.payTime}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="总最低金额">
                    <template slot-scope="scope">{{scope.row.totalLowestPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="售票系统总提交票价">
                    <template slot-scope="scope">{{scope.row.totalSubmitPrice}}</template>
                </el-table-column>
                <el-table-column label="支付方式" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row. payWay=='0'">微信</el-tag>
                        <el-tag v-else-if="scope.row. payWay=='1'">会员卡</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="下单状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.submitStatus=='0'" type="danger">未下单</el-tag>
                        <el-tag v-else-if="scope.row.submitStatus=='1'" type="success">下单成功</el-tag>
                        <el-tag v-else-if="scope.row.submitStatus=='2'" type="danger">下单失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="取票状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.printStatus=='0'" type="danger">未取票</el-tag>
                        <el-tag v-else-if="scope.row.printStatus=='1'" type="success">已取票</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="退票状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cancelStatus=='1'" type="success">已退票</el-tag>
                        <el-tag v-else type="danger">未退票</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="支付状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.payStatus=='0'" type="danger">未支付</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='1'" type="success">支付成功</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='2'" type="danger">支付失败</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='3'" type="success">退款成功</el-tag>
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
                dialogFormVisible: false,
                formLabelWidth: '120px',
                options: [{
                    value: '1',
                    label: '正常'
                },
                    {
                        value: '2',
                        label: '禁用'
                    }],
                businessInfoList: [],
                value: ''
            };
        },
        created() {},
        mounted() {
            this.getMenu();
        },
        methods: {
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
                    let orderNo=this.query.orderNo;
                    let mobile=this.query.mobile;
                    let payWay=this.query.payWay;
                    let payStatus=this.query.payStatus;
                    let submitStatus=this.query.submitStatus;
                    let startDate=this.query.startDate;
                    let endDate=this.query.endDate;
                    if(!orderNo){
                        orderNo=''
                    }
                    if(!mobile){
                        mobile=''
                    }
                    if(!payWay){
                        payWay=''
                    }
                    if(!payStatus){
                        payStatus=''
                    }
                    if(!submitStatus){
                        submitStatus=''
                    }
                    if(!startDate){
                        startDate=''
                    }
                    if(!endDate){
                        endDate=''
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"orderNo",value:orderNo});
                    jsonArr.push({key:"mobile",value:mobile});
                    jsonArr.push({key:"payWay",value:payWay});
                    jsonArr.push({key:"payStatus",value:payStatus});
                    jsonArr.push({key:"submitStatus",value:submitStatus});
                    jsonArr.push({key:"startDate",value:startDate});
                    jsonArr.push({key:"endDate",value:endDate});
                    jsonArr.push({key:"pageNo",value:this.query.pageNo});
                    jsonArr.push({key:"pageSize",value:this.query.pageSize});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/ticketOrder/ticketOrderPage',params).then((data) => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
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

