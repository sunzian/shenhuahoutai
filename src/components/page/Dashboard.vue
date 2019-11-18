<template>
    <div>
        <!--第一列-->
        <div class="crumbs" style="width: 100%">
            <el-breadcrumb separator="/" style="width: 100%">
                <el-breadcrumb-item style="width: 100%">
                    <b style="font-size: 20px;float: left">经营概况</b>
                    <b style="font-size: 20px;float: right;cursor: pointer;color:#009FFF;">刷新数据</b>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
            <el-col :span="10" style="margin-left:100px">
                <el-card shadow="hover" class="mgb20" style="height:352px;">
                    <div style="float: left;"><b>昨日</b></div>
                    <div style="float: right"><b>平台排名</b>&nbsp;<b style="color: red">2</b></div>
                    <div class="clear"></div>
                    <div style="background: #EFEDED;width: 45%;float: left;text-align: center;margin-top: 30px;height: 90px">
                        <div class="grid-num">99999</div>
                        <div>票房收入</div>
                    </div>
                    <div style="background: #D3D1D1;width: 45%;float: left;text-align: center;margin-top: 30px;height: 90px">
                        <div class="grid-num">3999</div>
                        <div>人次</div>
                    </div>
                    <div style="background: #FCE3E3;width: 30%;float: left;text-align: center;margin-top: 30px;height: 90px">
                        <div class="grid-num">99999</div>
                        <div>卖品收入</div>
                    </div>
                    <div style="background: #D9E4E9;width: 30%;float: left;text-align: center;margin-top: 30px;height: 90px">
                        <div class="grid-num">99999</div>
                        <div>会员卡收入</div>
                    </div>
                    <div style="background: #CFDEC6;width: 30%;float: left;text-align: center;margin-top: 30px;height: 90px">
                        <div class="grid-num">99999</div>
                        <div>服务费收入</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="10" style="margin-left: 100px">
                <el-card shadow="hover" class="mgb20" style="height:352px;">
                    <div style="float: left;"><b>昨日</b></div>
                    <div style="float: right"><b>平台排名</b>&nbsp;<b style="color: red">2</b></div>
                    <div class="clear"></div>
                    <div style="background: #EFEDED;width: 45%;float: left;text-align: center;margin-top: 30px;height: 90px">
                        <div class="grid-num">99999</div>
                        <div>票房收入</div>
                    </div>
                    <div style="background: #D3D1D1;width: 45%;float: left;text-align: center;margin-top: 30px;height: 90px">
                        <div class="grid-num">3999</div>
                        <div>人次</div>
                    </div>
                    <div style="background: #FCE3E3;width: 30%;float: left;text-align: center;margin-top: 30px;height: 90px">
                        <div class="grid-num">99999</div>
                        <div>卖品收入</div>
                    </div>
                    <div style="background: #D9E4E9;width: 30%;float: left;text-align: center;margin-top: 30px;height: 90px">
                        <div class="grid-num">99999</div>
                        <div>会员卡收入</div>
                    </div>
                    <div style="background: #CFDEC6;width: 30%;float: left;text-align: center;margin-top: 30px;height: 90px">
                        <div class="grid-num">99999</div>
                        <div>服务费收入</div>
                    </div>
                </el-card>
            </el-col>
        <!--第二列-->
        <div class="crumbs" style="width: 100%">
            <el-breadcrumb separator="/" style="width: 100%">
                <el-breadcrumb-item style="width: 100%">
                    <b style="font-size: 20px;float: left">会员概况</b>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-col :span="6" style="margin-left: 100px">
            <el-card shadow="hover" class="mgb20" style="height:352px;">
                <div style="float: left;"><b>注册用户总数</b></div>
                <div class="clear"></div>
                <div style="background: #EFEDED;width: 90%;float: left;text-align: center;margin-top: 30px;height: 90px;border-bottom: 3px solid black">
                    <div class="grid-num">12345678</div>
                </div>
                <div style="background: #EFEDED;width: 90%;float: left;text-align: center;margin-top: 30px;height: 90px">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">昨日注册用户总数</div>
                    <div class="grid-num" style="float: right;width: 45%;font-size: 18px">12345678</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="6" style="margin-left: 100px">
            <el-card shadow="hover" class="mgb20" style="height:352px;">
                <div style="background: #EFEDED;width: 90%;float: left;text-align: center;margin-top: 10px;height: 90px;border-bottom: 3px solid black">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">绑定注册会员总数</div>
                    <div class="grid-num" style="float: right;width: 45%;font-size: 18px">12345678</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">
                        <span>转化率</span>
                        <span>8.88%</span>
                    </div>
                </div>
                <div style="background: #EFEDED;width: 90%;float: left;text-align: center;margin-top: 10px;height: 90px;border-bottom: 3px solid black">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">绑定注册会员总数</div>
                    <div class="grid-num" style="float: right;width: 45%;font-size: 18px">12345678</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">
                        <span>转化率</span>
                        <span>8.88%</span>
                    </div>
                </div>
                <div style="background: #EFEDED;width: 90%;float: left;text-align: center;margin-top: 20px;height: 90px">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">昨日注册用户总数</div>
                    <div class="grid-num" style="float: right;width: 45%;font-size: 18px">12345678</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="6" style="margin-left: 100px">
            <el-card shadow="hover" class="mgb20" style="height:352px;">
                <div style="background: #EFEDED;width: 90%;float: left;text-align: center;margin-top: 10px;height: 90px;border-bottom: 3px solid black">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">绑定注册会员总数</div>
                    <div class="grid-num" style="float: right;width: 45%;font-size: 18px">12345678</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">
                        <span>转化率</span>
                        <span>8.88%</span>
                    </div>
                </div>
                <div style="background: #EFEDED;width: 90%;float: left;text-align: center;margin-top: 10px;height: 90px;border-bottom: 3px solid black">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">绑定注册会员总数</div>
                    <div class="grid-num" style="float: right;width: 45%;font-size: 18px">12345678</div>
                    <div class="clear"></div>
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">
                        <span>转化率</span>
                        <span>8.88%</span>
                    </div>
                </div>
                <div style="background: #EFEDED;width: 90%;float: left;text-align: center;margin-top: 20px;height: 90px">
                    <div class="grid-num" style="float: left;width: 45%;font-size: 18px">昨日注册用户总数</div>
                    <div class="grid-num" style="float: right;width: 45%;font-size: 18px">12345678</div>
                </div>
            </el-card>
        </el-col>
        <!--第三列-->
        <div class="crumbs" style="width: 100%">
            <el-breadcrumb separator="/" style="width: 100%">
                <el-breadcrumb-item style="width: 100%">
                    <b style="font-size: 20px;float: left">消费频次</b>
                    <el-select v-model="value" filterable placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="value" filterable placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
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
                <div style="float: left;"><b>昨日</b></div>
                <div style="float: right"><b>平台排名</b>&nbsp;<b style="color: red">2</b></div>
                <div class="clear"></div>
                <div style="background: #EFEDED;width: 45%;float: left;text-align: center;margin-top: 30px;height: 90px">
                    <div class="grid-num">99999</div>
                    <div>票房收入</div>
                </div>
                <div style="background: #D3D1D1;width: 45%;float: left;text-align: center;margin-top: 30px;height: 90px">
                    <div class="grid-num">3999</div>
                    <div>人次</div>
                </div>
                <div style="background: #FCE3E3;width: 30%;float: left;text-align: center;margin-top: 30px;height: 90px">
                    <div class="grid-num">99999</div>
                    <div>卖品收入</div>
                </div>
                <div style="background: #D9E4E9;width: 30%;float: left;text-align: center;margin-top: 30px;height: 90px">
                    <div class="grid-num">99999</div>
                    <div>会员卡收入</div>
                </div>
                <div style="background: #CFDEC6;width: 30%;float: left;text-align: center;margin-top: 30px;height: 90px">
                    <div class="grid-num">99999</div>
                    <div>服务费收入</div>
                </div>
            </el-card>
        </el-col>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import bus from '../common/bus';
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                options:[{
                    value: '选项1',
                    label: '黄金糕'
                }],
                value: '',
                charts: '',
                opinion:['男','女'],
                opinionData:[
                    {value:335, name:'男'},
                    {value:310, name:'女'},

                ]
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
            })
        },
        methods: {
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
                            name:'性别',
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
</style>
