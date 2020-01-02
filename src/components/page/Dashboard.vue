<template>
    <div>
        <!--第一列-->
        <div class="crumbs" style="width: 100%;margin-left: 1.7%">
            <el-breadcrumb separator="/" style="width: 100%">
                <el-breadcrumb-item style="width: 100%">
                    <b style="font-size: 20px;float: left">经营概况</b>
                    <b @click="refresh" style="font-size: 20px;float: right;cursor: pointer;color:#009FFF;margin-right: 4%">刷新数据</b>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-col :span="11" style="margin-left: 1.7%;margin-top: 0.8%">
                <el-card shadow="hover" class="mgb20" style="height:352px;">
                    <div style="float: left;"><b>昨日</b></div>
                    <!--<div style="float: right"><b>平台排名</b>&nbsp;<b class="red">2</b></div>-->
                    <div class="clear"></div>
                    <div style="width: 45%;float: left;text-align: center;margin-top: 1.7%;height: 110px;line-height: 45px;margin-left: 4.5%">
                        <div class="grid-num blue" style="margin-top: 4%">{{aForm.totalFilmIncome}}</div>
                        <div>票房收入</div>
                    </div>
                    <div style="width: 45%;float: left;text-align: center;margin-top: 1.7%;height: 110px;line-height: 45px">
                        <div class="grid-num blue" style="margin-top: 4%">{{aForm.totalTicketNumber}}</div>
                        <div>人次</div>
                    </div>
                    <div style="width: 30%;float: left;text-align: center;margin-top: 1.7%;height: 110px;line-height: 45px;margin-left:  4.5%">
                        <div class="grid-num blue" style="margin-top: 4%">{{aForm.totalMerchandiseIncome}}</div>
                        <div>卖品收入</div>
                    </div>
                    <div style="width: 30%;float: left;text-align: center;margin-top: 1.7%;height: 110px;line-height: 45px">
                        <div class="grid-num blue" style="margin-top: 4%">{{aForm.totalMemberCardIncome}}</div>
                        <div>会员卡收入</div>
                    </div>
                    <div style="width: 30%;float: left;text-align: center;margin-top: 1.7%;height: 110px;line-height: 45px">
                        <div class="grid-num blue" style="margin-top: 4%">{{aForm.totalServiceChargeIncome}}</div>
                        <div>服务费收入</div>
                    </div>
                </el-card>
            </el-col>
        <el-col :span="11" style="margin-left: 5%;margin-top: 0.8%">
                <el-card shadow="hover" class="mgb20" style="height:352px;">
                    <div style="float: left;"><b>累积</b></div>
                    <!--<div style="float: right"><b>平台排名</b>&nbsp;<b class="red">2</b></div>-->
                    <div class="clear"></div>
                    <div style="width: 45%;float: left;text-align: center;margin-top:  1.7%;height: 110px;line-height: 45px;margin-left:  4.5%">
                        <div class="grid-num blue" style="margin-top: 4%">{{oForm.totalFilmIncome}}</div>
                        <div>票房收入</div>
                    </div>
                    <div style="width: 45%;float: left;text-align: center;margin-top:  1.7%;height: 110px;line-height: 45px">
                        <div class="grid-num blue" style="margin-top: 4%">{{oForm.totalTicketNumber}}</div>
                        <div>人次</div>
                    </div>
                    <div style="width: 30%;float: left;text-align: center;margin-top:  1.7%;height: 110px;line-height: 45px;margin-left:  4.5%">
                        <div class="grid-num blue" style="margin-top: 4%">{{oForm.totalMerchandiseIncome}}</div>
                        <div>卖品收入</div>
                    </div>
                    <div style="width: 30%;float: left;text-align: center;margin-top:  1.7%;height: 110px;line-height: 45px">
                        <div class="grid-num blue" style="margin-top: 4%">{{oForm.totalMemberCardIncome}}</div>
                        <div>会员卡收入</div>
                    </div>
                    <div style="width: 30%;float: left;text-align: center;margin-top:  1.7%;height: 110px;line-height: 45px">
                        <div class="grid-num blue" style="margin-top: 4%">{{oForm.totalServiceChargeIncome}}</div>
                        <div>服务费收入</div>
                    </div>
                </el-card>
            </el-col>
        <!--第二列-->
        <div class="crumbs" style="width: 100%;margin-left: 1.7%">
            <el-breadcrumb separator="/" style="width: 100%">
                <el-breadcrumb-item style="width: 100%">
                    <b style="font-size: 20px;float: left">会员概况</b>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-col :span="7" style="margin-left: 1.7%;margin-top:  0.8%">
            <el-card shadow="hover" class="mgb20" style="height:352px;">
                <div style="float: left;margin-top: 3%"><b>注册用户总数</b></div>
                <div class="clear"></div>
                <div style="width: 90%;float: left;text-align: center;margin-top:  1.7%;height: 150px;border-bottom: 3px solid #DCDCDC;line-height: 90px;margin-left:  1.7%">
                    <div class="grid-num blue">{{form.totalRegisterUser}}</div>
                </div>
                <div style="width: 90%;float: left;text-align: center;margin-top:   6%;height: 90px;margin-left: 1.7%">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">昨日注册用户总数</div>
                    <div class="grid-num  blue" style="float: right;width: 45%;font-size: 18px">{{form.totalYesterdayRegisterUser}}</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="7" style="margin-left: 4.6%;margin-top:  0.8%">
            <el-card shadow="hover" class="mgb20" style="height:352px;">
                <div style="width: 90%;float: left;text-align: center;margin-top:  0.8%;height: 90px;border-bottom: 3px solid #DCDCDC;margin-left:  1.7%">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px;margin-top: 3%">绑定注册会员总数</div>
                    <div class="grid-num blue" style="float: right;width: 45%;font-size: 18px;margin-top: 3%">{{form.totalRegisterMemberUser}}</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px;margin-top: 3%">
                        <span>转化率</span>&nbsp;
                        <span class="red">{{form.percentConversion}}%</span>
                    </div>
                </div>
                <div style="width: 90%;float: left;text-align: center;margin-top:  0.8%;height: 90px;border-bottom: 3px solid #DCDCDC;margin-left:  1.7%">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px;margin-top: 3%">会员卡内余额</div>
                    <div class="grid-num red" style="float: right;width: 45%;font-size: 18px;margin-top: 3%">{{form.totalMemberUserBalance}}</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px;margin-top: 3%">
                        <span>消费占比</span>&nbsp;
                        <span class="red">{{form.consumptionRate}}%</span>
                    </div>
                </div>
                <div style="width: 90%;float: left;text-align: center;margin-top: 6%;height: 90px;margin-left:  1.7%">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">昨日注册会员总数</div>
                    <div class="grid-num blue" style="float: right;width: 45%;font-size: 18px">{{form.totalYesterdayMemberUser}}</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="7" style="margin-left: 4.6%;margin-top:  0.8%">
            <el-card shadow="hover" class="mgb20" style="height:352px;">
                <div style="width: 90%;float: left;text-align: center;margin-top:  0.8%;height: 90px;border-bottom: 3px solid #DCDCDC;margin-left:  1.7%">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px;margin-top: 3%">权益卡会员总数</div>
                    <div class="grid-num blue" style="float: right;width: 45%;font-size: 18px;margin-top: 3%">{{benForm.totalBenefitCardUser}}</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px;margin-top: 3%">
                        <span>转化率</span>&nbsp;
                        <span class="red">{{benForm.percentConversion}}%</span>
                    </div>
                </div>
                <div style="width: 90%;float: left;text-align: center;margin-top:  0.8%;height: 90px;border-bottom: 3px solid #DCDCDC;margin-left:  1.7%">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px;margin-top: 3%">累积卡费收入</div>
                    <div class="grid-num red" style="float: right;width: 45%;font-size: 18px;margin-top: 3%">{{benForm.totalBenefitCardPrice}}</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px;margin-top: 3%">
                        <span>消费占比</span>&nbsp;
                        <span class="red">{{benForm.consumptionRate}}%</span>
                    </div>
                </div>
                <div style="width: 90%;float: left;text-align: center;margin-top:   6%;height: 90px;margin-left:  1.7%">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">昨日权益卡新增总数</div>
                    <div class="grid-num blue" style="float: right;width: 45%;font-size: 18px">{{benForm.yesterdayBenefitCardUser}}</div>
                </div>
            </el-card>
        </el-col>
        <!--第三列-->
        <div class="crumbs" style="width: 100%;margin-left: 1.2%">
            <el-breadcrumb separator="/" style="width: 100%">
                <el-breadcrumb-item style="width: 100%;margin-top: 1.2%">
                    <b style="font-size: 20px;float: left">消费频次</b>
                    <el-select v-model="value1" filterable placeholder="请选择" style="float: left;margin-left:  0.8%;margin-top: -0.4%">
                        <el-option
                                v-for="item in cinemas"
                                :key="item.cinemaCode"
                                :label="item.cinemaName"
                                :value="item.cinemaCode">
                        </el-option>
                    </el-select>
                    <div style="float: left;width: 400px;margin-left:  0.8%;margin-top: -0.4%">
                        <div @click="getEchars1" class="act" :class="one?'active':'act'">近一周</div>
                        <div @click="getEchars2" class="act" :class="two?'active':'act'">近一月</div>
                        <div @click="getEchars3" class="act" :class="thr?'active':'act'">近三月</div>
                        <div @click="getEchars4" class="act" :class="fou?'active':'act'">近半年</div>
                    </div>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-col :span="10" style="margin-left: 5%">
            <div>
                <div id="main" style="width: 600px;height: 400px;"></div>
            </div>
        </el-col>
        <el-col :span="10" style="margin-left: 5%">
            <el-card shadow="hover" class="mgb20" style="height:352px;">
                <el-table
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column prop="time" label="消费次数">
                        <template slot-scope="scope">{{scope.row.number}}</template>
                    </el-table-column>
                    <el-table-column prop="number" label="顾客数">
                        <template slot-scope="scope">{{scope.row.userNumber}}</template>
                    </el-table-column>
                    <el-table-column prop="bilious" label="占比">
                        <template slot-scope="scope">{{scope.row.percentage}}%</template>
                    </el-table-column>
                </el-table>
            </el-card>
        </el-col>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import { Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend } from '@/aes/utils';
    import https from '../../https';
    import md5 from 'js-md5';
    export default {
        name: 'dashboard',
        data() {
            return {
                form:{},
                oForm:{},
                aForm:{},
                benForm:{},
                message:'',
                name: localStorage.getItem('ms_username'),
                cinemas:[],
                value: '',
                value1: '',
                type: '',
                charts: '',
                tableData:[],
                opinionData:[],
                one:false,
                two:false,
                thr:false,
                fou:false,
                firstCinema:'',
        }
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        mounted () {
            this.$nextTick(function() {
                this.drawPie('main')
            });
            this.getMenu();
            this.getMenu1();
            this.getMenu2();
            this.getBenMenu();
            this.getCinema();
            this.firMenu();
        },
        methods: {
            open() {
                //信息提示弹出框
                this.$alert(this.message, '信息提示', {
                    dangerouslyUseHTMLString: true
                });
            },
            firMenu() {
                //获取菜单栏
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                this.type=1;
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.value1 });
                jsonArr.push({ key: 'type', value: this.type });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/dataStatistics/getConsumeStatistics',params).then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.tableData=oData.consumeStatisticsList
                        this.opinionData=oData.diagram
                        this.$nextTick(function() {
                            this.drawPie('main')
                        });
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }
                    // else {
                    //     this.message = data.data.message;
                    //     this.open();
                    // }
                })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                    });
            },
            getCinema() {
                //获取菜单栏
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                https.fetchPost('/cinema/getAllCinema','').then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.cinemas=oData
                        this.firstCinema=oData[0].cinemaCode
                        this.value1=oData[0].cinemaName
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }
                    // else {
                    //     this.message = data.data.message;
                    //     this.open();
                    // }
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
                https.fetchPost('/dataStatistics/getUserStatistics','').then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.form=oData
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }
                    // else {
                    //     this.message = data.data.message;
                    //     this.open();
                    // }
                })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                    });
            },
            getMenu1() {
                //获取菜单栏
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                https.fetchPost('/dataStatistics/getCinemaStatistics','').then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.oForm=oData
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }
                    // else {
                    //     this.message = data.data.message;
                    //     this.open();
                    // }
                })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                    });
            },
            getMenu2() {
                //获取菜单栏
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                var jsonArr = [];
                jsonArr.push({ key: 'isYesterday', value: '1' });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/dataStatistics/getCinemaStatistics',params).then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.aForm=oData
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }
                    // else {
                    //     this.message = data.data.message;
                    //     this.open();
                    // }
                })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                    });
            },
            getBenMenu() {
                //获取菜单栏
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                https.fetchPost('/dataStatistics/getBenefitCardStatistics','').then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.benForm=oData
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }
                    // else {
                    //     this.message = data.data.message;
                    //     this.open();
                    // }
                })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                    });
            },
            getEchars1() {
                this.one=true;
                this.two=false;
                this.thr=false;
                this.fou=false;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                this.type=1;
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.value1 });
                jsonArr.push({ key: 'type', value: this.type });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/dataStatistics/getConsumeStatistics',params).then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.tableData=oData.consumeStatisticsList
                        this.opinionData=oData.diagram
                        this.$nextTick(function() {
                            this.drawPie('main')
                        });
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }
                    // else {
                    //     this.message = data.data.message;
                    //     this.open();
                    // }
                })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                    });
            },
            getEchars2() {
                this.one=false;
                this.two=true;
                this.thr=false;
                this.fou=false;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                this.type=2;
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.value1 });
                jsonArr.push({ key: 'type', value: this.type });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/dataStatistics/getConsumeStatistics',params).then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.tableData=oData.consumeStatisticsList
                        this.opinionData=oData.diagram
                        this.$nextTick(function() {
                            this.drawPie('main')
                        });
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }
                    // else {
                    //     this.message = data.data.message;
                    //     this.open();
                    // }
                })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                    });
            },
            getEchars3() {
                this.one=false;
                this.two=false;
                this.thr=true;
                this.fou=false;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                this.type=3;
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.value1 });
                jsonArr.push({ key: 'type', value: this.type });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/dataStatistics/getConsumeStatistics',params).then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.tableData=oData.consumeStatisticsList
                        this.opinionData=oData.diagram
                        this.$nextTick(function() {
                            this.drawPie('main')
                        });
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }
                    // else {
                    //     this.message = data.data.message;
                    //     this.open();
                    // }
                })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                    });
            },
            getEchars4() {
                this.one=false;
                this.two=false;
                this.thr=false;
                this.fou=true;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                this.type=4;
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.value1 });
                jsonArr.push({ key: 'type', value: this.type });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/dataStatistics/getConsumeStatistics',params).then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.tableData=oData.consumeStatisticsList
                        this.opinionData=oData.diagram
                        this.$nextTick(function() {
                            this.drawPie('main')
                        });
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }
                    // else {
                    //     this.message = data.data.message;
                    //     this.open();
                    // }
                })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                    });
            },
            refresh() {
                //获取菜单栏
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                https.fetchPost('/dataStatistics/refreshStatisticsData','').then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.getMenu();
                        this.getMenu1();
                        this.getMenu2();
                        this.getBenMenu();
                    } else if (data.data.code == 'nologin') {
                        this.message = data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }
                    // else {
                    //     this.message = data.data.message;
                    //     this.open();
                    // }
                })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                    });
            },
            drawPie(id){
                this.charts = echarts.init(document.getElementById(id))
                this.charts.setOption({
                    tooltip: {
                        trigger: 'item',

                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:this.opinion
                    },
                    series: [
                        {
                            name:'图表',
                            type:'pie',
                            radius:['50%','70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'blod'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:this.opinionData
                        }
                    ]
                })
            }},
    }
</script>


<style scoped>
    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }
    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }
    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }
    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }
    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }
    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }
    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }
    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }
    .user-info-list span {
        margin-left: 70px;
    }
    .mgb20 {
        margin-bottom:  1.6%;
    }
    .clear{
        clear:both;
    }
    .blue{
        color: #009FFF;
    }
    .red{
        color: #EC2F4B;
    }
    .active{
        float: left;
        width: 60px;
        height: 30px;
        background: white;
        border: 3px solid #EC2F4B;
        color: #EC2F4B;
        text-align: center;
        line-height: 30px
    }
    .act{
        float: left;
        width: 60px;
        height: 30px;
        background: white;
        border: 1px solid #DCDCDC;
        text-align: center;
        line-height: 30px
    }
</style>
