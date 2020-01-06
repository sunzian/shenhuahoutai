<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 查询会员价
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button style="float: right;margin-top: 10px" type="warning" @click="addPage">查询会员价</el-button>
            </div>
            <el-form v-model="oForm">
                <el-form-item label="影院" :label-width="formLabelWidth">
                    <el-select style="margin-bottom: 10px" clearable v-model="oForm.cinemaCode" placeholder="请选择影院"
                               class="mr10" @change="getFilm">
                        <el-option
                                v-for="item in cinemaInfo"
                                :key="item.cinemaCode"
                                :label="item.cinemaName"
                                :value="item.cinemaCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="影片" :label-width="formLabelWidth">
                    <el-select style="margin-bottom: 10px" clearable v-model="oForm.filmCode" placeholder="请选择影片"
                               class="mr10">
                        <el-option
                                v-for="item in filmInfo"
                                :key="item.filmCode"
                                :label="item.filmName"
                                :value="item.filmCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="场次" :label-width="formLabelWidth">
                    <el-button type="primary" @click="getSession">点击选择</el-button>
                </el-form-item>
                <el-form-item label="所选场次"  :label-width="formLabelWidth">
                    <el-input :disabled="true" onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 250px" v-model="sessionId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="会员号"  :label-width="formLabelWidth">
                    <el-input onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" style="width: 250px" v-model="oForm.cardNo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="会员号" :label-width="formLabelWidth">
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 250px"
                              v-model="oForm.cardNo" autocomplete="off"></el-input>
                </el-form-item>
                <el-divider></el-divider>
            </el-form>
            <el-form v-model="oForm">
                <el-form-item label="会员价" :label-width="formLabelWidth">
                    <el-input :disabled="true" onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 250px"
                              v-model="oForm.price" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="服务费" :label-width="formLabelWidth">
                    <el-input :disabled="true" onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 250px"
                              v-model="oForm.servicePrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-input :disabled="true" onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 250px"
                              v-model="oForm.status" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="接口入参" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="8" onkeyup="this.value=this.value.replace(/\D/g,'')"
                              style="width: 600px" v-model="oForm.interfaceInput" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="接口出参" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="8" onkeyup="this.value=this.value.replace(/\D/g,'')"
                              style="width: 600px" v-model="oForm.interfaceOutput" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <!--新增排期弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择影片" :visible.sync="drawer">
            <div class="container">
                <el-table
                        :data="sellTableData"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                >
                    <el-table-column label="操作" width="50" align="center">
                        <template slot-scope="scope">
                            <el-radio
                                    v-model="id"
                                    :label="scope.$index"
                                    @change.native="getCurrentRow(scope.row.id,scope.row.sessionTime)"
                            >&nbsp;
                            </el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="id" width="160">
                        <template slot-scope="scope">{{scope.row.id}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="影片名" width="160">
                        <template slot-scope="scope">{{scope.row.filmName}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="放映时间">
                        <template slot-scope="scope">{{scope.row.sessionTime}}</template>
                    </el-table-column>

                    <!--<el-table-column prop="sort" label="制式" width="80">-->
                    <!--<template slot-scope="scope">{{scope.row.dimensional}}</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="sort" label="语言" width="80">-->
                    <!--<template slot-scope="scope">{{scope.row.language}}</template>-->
                    <!--</el-table-column>-->
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button type="primary" @click="sureNext">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {fetchData} from '../../api/index';
    import {Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend} from '@/aes/utils';
    import md5 from 'js-md5';
    import axios from 'axios';
    import https from "../../https";

    export default {
        name: 'basetable',
        data() {
            return {
                userName: '',
                message: '',//弹出框消息
                drawer: false,//弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 15
                },
                tableData: [],
                cinemaInfo: [],
                filmInfo: [],
                sellTableData: [],
                pageTotal: 0,
                form: {
                    memo: '',
                    sort: '',
                    id: '',
                },
                oForm: {
                    userName: '',
                    userPass: '',
                    value: '',
                    realName: '',
                    callNumber: '',
                    businessCode: '',
                    memo: '',
                    price: '',
                    servicePrice: '',
                    interfaceInput: '',
                    interfaceOutput: '',
                    status: '',
                },
                idx: -1,
                id: -1,
                formLabelWidth: '120px',
                selectValue: {},
                selectCode: {},
                sessionId: '',
                sessionTime: '',
                options: [{
                    value: '1',
                    label: '正常'
                },
                    {
                        value: '2',
                        label: '禁用'
                    }],
                value: ''
            };
        },
        created() {
        },
        mounted() {
            this.getAllCinema()
        },
        methods: {
            getCurrentRow(index, index2) {
                this.sessionId = index;
                this.sessionTime = index2;
            },
            sureNext() {
                this.drawer = false;
            },
            getSession() {
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
                    jsonArr.push({key: 'cinemaCode', value: this.oForm.cinemaCode});
                    jsonArr.push({key: 'filmCode', value: this.oForm.filmCode});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({key: 'sign', value: sign});
                    var params = ParamsAppend(jsonArr);
                    console.log(jsonArr);
                    https
                        .fetchPost('/sessionInfo/getSessionByFilm', params)
                        .then(data => {
                            loading.close();
                            console.log(data);
                            if (data.data.code == 'success') {
                                this.drawer = true;
                                var oData = JSON.parse(Decrypt(data.data.data));
                                console.log(oData);
                                // console.log(this.query);
                                this.sellTableData = oData;
                                // this.query.aPageSize = oData.pageSize;
                                // this.query.aPageNo = oData.pageNo;
                                // this.query.aTotalCount = oData.totalCount;
                                // this.query.aTotalPage = oData.totalPage;
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
            getFilm() {
                var jsonArr = [];
                jsonArr.push({key: 'cinemaCode', value: this.oForm.cinemaCode});
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/sessionInfo/getFilmBySession', params).then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        // console.log(res);
                        this.filmInfo = res;
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
            addPage() {
                //获取新增按钮权限
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                var jsonArr = [];
                jsonArr.push({key: 'cinemaCode', value: this.oForm.cinemaCode});
                jsonArr.push({key: 'sessionId', value: this.sessionId});
                jsonArr.push({key: 'cardNo', value: this.oForm.cardNo});
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                let params = ParamsAppend(jsonArr);
                setTimeout(() => {
                    https.fetchPost('/interface/queryMemberPrice', params)
                        .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.$message.success(`成功`);
                                    // this.getMenu();
                                    console.log(JSON.parse(Decrypt(data.data.data)));
                                    this.oForm.price = JSON.parse(Decrypt(data.data.data)).price;
                                    this.oForm.servicePrice = JSON.parse(Decrypt(data.data.data)).servicePrice;
                                    this.oForm.interfaceInput = JSON.parse(Decrypt(data.data.data)).interfaceInput;
                                    this.oForm.interfaceOutput = JSON.parse(Decrypt(data.data.data)).interfaceOutput;
                                    this.oForm.status = JSON.parse(Decrypt(data.data.data)).status;
                                } else if (data.data.code == 'nologin') {
                                    this.message = data.data.message;
                                    this.open();
                                    this.$router.push('/login');
                                } else {
                                    this.message = data.data.message;
                                    this.open();
                                }
                            }
                        )
                }, 500);
            },
            open() {
                //信息提示弹出框
                this.$alert(this.message, '信息提示', {
                    dangerouslyUseHTMLString: true
                });
            },
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
</style>
