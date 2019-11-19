<template>
    <div>
        <!--第一列-->
        <div class="crumbs" style="width: 100%;margin-left: 30px">
            <el-breadcrumb separator="/" style="width: 100%">
                <el-breadcrumb-item style="width: 100%">
                    <b style="font-size: 20px;float: left">经营概况</b>
                    <b @click="refresh" style="font-size: 20px;float: right;cursor: pointer;color:#009FFF;margin-right: 70px">刷新数据</b>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
            <el-col :span="11" style="margin-left: 30px;margin-top: 10px">
                <el-card shadow="hover" class="mgb20" style="height:352px;">
                    <div style="float: left;"><b>昨日</b></div>
                    <div style="float: right"><b>平台排名</b>&nbsp;<b class="red">2</b></div>
                    <div class="clear"></div>
                    <div style="background: #EFEDED;width: 45%;float: left;text-align: center;margin-top: 30px;height: 110px;line-height: 45px;margin-left: 40px">
                        <div class="grid-num blue">{{aForm.totalFilmIncome}}</div>
                        <div>票房收入</div>
                    </div>
                    <div style="background: #D3D1D1;width: 45%;float: left;text-align: center;margin-top: 30px;height: 110px;line-height: 45px">
                        <div class="grid-num blue">{{aForm.totalTicketNumber}}</div>
                        <div>人次</div>
                    </div>
                    <div style="background: #FCE3E3;width: 30%;float: left;text-align: center;margin-top: 30px;height: 110px;line-height: 45px;margin-left: 40px">
                        <div class="grid-num blue">{{aForm.totalMerchandiseIncome}}</div>
                        <div>卖品收入</div>
                    </div>
                    <div style="background: #D9E4E9;width: 30%;float: left;text-align: center;margin-top: 30px;height: 110px;line-height: 45px">
                        <div class="grid-num blue">{{aForm.totalMemberCardIncome}}</div>
                        <div>会员卡收入</div>
                    </div>
                    <div style="background: #CFDEC6;width: 30%;float: left;text-align: center;margin-top: 30px;height: 110px;line-height: 45px">
                        <div class="grid-num blue">{{aForm.totalServiceChargeIncome}}</div>
                        <div>服务费收入</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="11" style="margin-left: 100px;margin-top: 10px">
                <el-card shadow="hover" class="mgb20" style="height:352px;">
                    <div style="float: left;"><b>累积</b></div>
                    <div style="float: right"><b>平台排名</b>&nbsp;<b class="red">2</b></div>
                    <div class="clear"></div>
                    <div style="width: 45%;float: left;text-align: center;margin-top: 30px;height: 110px;line-height: 45px;margin-left: 40px">
                        <div class="grid-num blue">{{oForm.totalFilmIncome}}</div>
                        <div>票房收入</div>
                    </div>
                    <div style="width: 45%;float: left;text-align: center;margin-top: 30px;height: 110px;line-height: 45px">
                        <div class="grid-num blue">{{oForm.totalTicketNumber}}</div>
                        <div>人次</div>
                    </div>
                    <div style="width: 30%;float: left;text-align: center;margin-top: 30px;height: 110px;line-height: 45px;margin-left: 40px">
                        <div class="grid-num blue">{{oForm.totalMerchandiseIncome}}</div>
                        <div>卖品收入</div>
                    </div>
                    <div style="width: 30%;float: left;text-align: center;margin-top: 30px;height: 110px;line-height: 45px">
                        <div class="grid-num blue">{{oForm.totalMemberCardIncome}}</div>
                        <div>会员卡收入</div>
                    </div>
                    <div style="width: 30%;float: left;text-align: center;margin-top: 30px;height: 110px;line-height: 45px">
                        <div class="grid-num blue">{{oForm.totalServiceChargeIncome}}</div>
                        <div>服务费收入</div>
                    </div>
                </el-card>
            </el-col>
        <!--第二列-->
        <div class="crumbs" style="width: 100%;margin-left: 30px">
            <el-breadcrumb separator="/" style="width: 100%">
                <el-breadcrumb-item style="width: 100%">
                    <b style="font-size: 20px;float: left">会员概况</b>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-col :span="7" style="margin-left: 30px;margin-top: 10px">
            <el-card shadow="hover" class="mgb20" style="height:352px;">
                <div style="float: left;"><b>注册用户总数</b></div>
                <div class="clear"></div>
                <div style="width: 90%;float: left;text-align: center;margin-top: 30px;height: 150px;border-bottom: 3px solid #DCDCDC;line-height: 90px;margin-left: 30px">
                    <div class="grid-num blue">{{form.totalRegisterUser}}</div>
                </div>
                <div style="width: 90%;float: left;text-align: center;margin-top: 30px;height: 90px;margin-left: 30px;line-height: 90px;">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">昨日注册用户总数</div>
                    <div class="grid-num  blue" style="float: right;width: 45%;font-size: 18px">{{form.totalYesterdayRegisterUser}}</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="7" style="margin-left: 90px;margin-top: 10px">
            <el-card shadow="hover" class="mgb20" style="height:352px;">
                <div style="width: 90%;float: left;text-align: center;margin-top: 10px;height: 90px;border-bottom: 3px solid #DCDCDC;margin-left: 30px;line-height: 45px">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">绑定注册会员总数</div>
                    <div class="grid-num blue" style="float: right;width: 45%;font-size: 18px">{{form.totalRegisterMemberUser}}</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">
                        <span>转化率</span>
                        <span class="red">{{form.percentConversion}}%</span>
                    </div>
                </div>
                <div style="width: 90%;float: left;text-align: center;margin-top: 10px;height: 90px;border-bottom: 3px solid #DCDCDC;margin-left: 30px;line-height: 45px">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">会员卡内余额</div>
                    <div class="grid-num red" style="float: right;width: 45%;font-size: 18px">{{form.totalMemberUserBalance}}</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">
                        <span>消费占比</span>
                        <span class="red">{{form.consumptionRate}}%</span>
                    </div>
                </div>
                <div style="width: 90%;float: left;text-align: center;margin-top: 20px;height: 90px;margin-left: 30px;line-height: 90px">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">昨日注册会员总数</div>
                    <div class="grid-num blue" style="float: right;width: 45%;font-size: 18px">{{form.totalYesterdayMemberUser}}</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="7" style="margin-left: 90px;margin-top: 10px">
            <el-card shadow="hover" class="mgb20" style="height:352px;">
                <div style="width: 90%;float: left;text-align: center;margin-top: 10px;height: 90px;border-bottom: 3px solid #DCDCDC;margin-left: 30px;line-height: 45px">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">权益卡会员总数</div>
                    <div class="grid-num blue" style="float: right;width: 45%;font-size: 18px">{{benForm.totalBenefitCardUser}}</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">
                        <span>转化率</span>
                        <span class="red">{{benForm.percentConversion}}%</span>
                    </div>
                </div>
                <div style="width: 90%;float: left;text-align: center;margin-top: 10px;height: 90px;border-bottom: 3px solid #DCDCDC;margin-left: 30px;line-height: 45px">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">累积卡费收入</div>
                    <div class="grid-num red" style="float: right;width: 45%;font-size: 18px">{{benForm.totalBenefitCardPrice}}</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">
                        <span>消费占比</span>
                        <span class="red">{{benForm.consumptionRate}}%</span>
                    </div>
                </div>
                <div style="width: 90%;float: left;text-align: center;margin-top: 20px;height: 90px;margin-left: 30px;line-height: 90px">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">昨日权益卡新增总数</div>
                    <div class="grid-num blue" style="float: right;width: 45%;font-size: 18px">{{benForm.yesterdayBenefitCardUser}}</div>
                </div>
            </el-card>
        </el-col>
        <!--第三列-->
        <div class="crumbs" style="width: 100%;margin-left: 30px">
            <el-breadcrumb separator="/" style="width: 100%">
                <el-breadcrumb-item style="width: 100%">
                    <b style="font-size: 20px;float: left">消费频次</b>
                    <el-select v-model="value" @change="getCinema" filterable placeholder="请选择" style="float: left;margin-left: 30px;margin-top: -5px">
                        <el-option
                                v-for="item in cities"
                                :key="item.city"
                                :label="item.city"
                                :value="item.city">
                        </el-option>
                    </el-select>
                    <el-select v-model="value1" filterable placeholder="请选择" style="float: left;margin-left: 10px;margin-top: -5px">
                        <el-option
                                v-for="item in cinemas"
                                :key="item.cinemaCode"
                                :label="item.cinemaName"
                                :value="item.cinemaCode">
                        </el-option>
                    </el-select>
                    <div style="float: right;width: 400px;margin-right: 600px">
                        <div @click="getEchars1" style="float: left;width: 60px;height: 30px;background: white;border: 1px solid #DCDCDC;text-align: center;line-height: 30px">近一周</div>
                        <div @click="getEchars2" style="float: left;width: 60px;height: 30px;background: white;border: 1px solid #DCDCDC;text-align: center;line-height: 30px">近一月</div>
                        <div @click="getEchars3" style="float: left;width: 60px;height: 30px;background: white;border: 1px solid #DCDCDC;text-align: center;line-height: 30px">近三月</div>
                        <div @click="getEchars4" style="float: left;width: 60px;height: 30px;background: white;border: 1px solid #DCDCDC;text-align: center;line-height: 30px">近半年</div>
                    </div>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-col :span="10" style="margin-left:100px">
            <div>
                <div id="main" style="width: 600px;height: 400px;"></div>
            </div>
        </el-col>
        <el-col :span="10" style="margin-left: 100px">
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
                options:[{
                    value: '选项1',
                    label: '黄金糕'
                }],
                cities:[],
                cinemas:[],
                value: '',
                value1: '',
                type: '',
                charts: '',
                tableData:[],
                // opinion:['男','女'],
                // opinionData:[
                //     {value:335, name:'男'},
                //     {value:310, name:'女'},
                // ]
                opinionData:[]
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
            this.getCity();
        },
        methods: {
            open() {
                //错误信息弹出框
                this.$alert(this.message, '错误信息', {
                    dangerouslyUseHTMLString: true
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
                    // console.log(data);
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        // console.log(oData);
                        this.form=oData
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
                    // console.log(data);
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        // console.log(oData);
                        this.oForm=oData
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
                    // console.log(data);
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        // console.log(oData);
                        this.aForm=oData
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
                    // console.log(data);
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        // console.log(oData);
                        this.benForm=oData
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
            getCity() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                https.fetchPost('/dataStatistics/getCityList','').then(data => {
                    loading.close();
                    // console.log(data);
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        // console.log(oData);
                        this.cities=oData

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
            getCinema() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                var jsonArr = [];
                jsonArr.push({ key: 'city', value: this.value });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/dataStatistics/getCinemaByCity',params).then(data => {
                    this.value1='';
                    loading.close();
                    // console.log(data);
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        // console.log(oData);
                        this.cinemas=oData
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
            getEchars1() {
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
                    console.log(data);
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
                        this.tableData=oData.consumeStatisticsList
                        this.opinionData=oData.diagram
                        this.$nextTick(function() {
                            this.drawPie('main')
                        });
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
            getEchars2() {
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
                    console.log(data);
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
                        this.tableData=oData.consumeStatisticsList
                        this.opinionData=oData.diagram
                        this.$nextTick(function() {
                            this.drawPie('main')
                        });
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
            getEchars3() {
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
                    console.log(data);
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
                        this.tableData=oData.consumeStatisticsList
                        this.opinionData=oData.diagram
                        this.$nextTick(function() {
                            this.drawPie('main')
                        });
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
            getEchars4() {
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
                    console.log(data);
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
                        this.tableData=oData.consumeStatisticsList
                        this.opinionData=oData.diagram
                        this.$nextTick(function() {
                            this.drawPie('main')
                        });
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
                    // console.log(data);
                    if (data.data.code == 'success') {
                        this.getMenu();
                        this.getMenu1();
                        this.getMenu2();
                        this.getBenMenu();
                        this.getCity();
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
            }

            },
            changeDate() {
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
                });
            }
    }
</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }
    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }
    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }
    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }
    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
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
    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }
    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }
    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }
    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }
    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }
    .user-info-list span {
        margin-left: 70px;
    }
    .mgb20 {
        margin-bottom: 20px;
    }
    .todo-item {
        font-size: 14px;
    }
    .todo-item-del {
        text-decoration: line-through;
        color: #999;
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
</style>
