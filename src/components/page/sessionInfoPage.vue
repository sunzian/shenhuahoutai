<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 排期管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.cinemaCode" placeholder="请选择影院" class="mr10" @change="chooseCinema">
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-select clearable v-model="query.screenCode" placeholder="请选择影厅" class="mr10">
                    <el-option
                        v-for="item in screenInfo"
                        :key="item.screenCode"
                        :label="item.screenName"
                        :value="item.screenCode"
                    ></el-option>
                </el-select>
                <el-input v-model="query.filmName" placeholder="影片名称" class="handle-input mr10"></el-input>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                        type="primary"
                        @click="thirdPrice"
                        style="float: right;margin-top: 10px"
                        icon="el-icon-circle-plus-outline"
                >批量修改会员价</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >重新获取排期</el-button>
            </div>
            <el-table
                :data="tableData"
                height="500"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="code" label="影院名称" width="160" fixed>
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影片名称" width="140" fixed>
                    <template slot-scope="scope">{{scope.row.filmName}}</template>
                </el-table-column>
                <el-table-column prop="time" label="影厅名称" width="140">
                    <template slot-scope="scope">{{scope.row.screenName}}</template>
                </el-table-column>
                <el-table-column prop="time" label="放映时间" width="160">
                    <template slot-scope="scope">{{scope.row.sessionTime}}</template>
                </el-table-column>
                <el-table-column prop="number" label="时长（分钟）" width="110">
                    <template slot-scope="scope">{{scope.row.duration}}</template>
                </el-table-column>
                <el-table-column prop="number" label="语言" width="80">
                    <template slot-scope="scope">{{scope.row.language}}</template>
                </el-table-column>
                <el-table-column prop="number" label="标准价" width="80">
                    <template slot-scope="scope">{{scope.row.standardPrice}}</template>
                </el-table-column>
                <el-table-column prop="booleans" label="结算价" width="80">
                    <template slot-scope="scope">{{scope.row.settlePrice}}</template>
                </el-table-column>
                <el-table-column prop="booleans" label="最低价" width="80">
                    <template slot-scope="scope">{{scope.row.lowestPrice}}</template>
                </el-table-column>
                <el-table-column prop="number" label="会员价" width="80">
                    <template slot-scope="scope">{{scope.row.memberPrice}}</template>
                </el-table-column>
                <el-table-column prop="time" label="增值服务费" width="110">
                    <template slot-scope="scope">{{scope.row.ticketFee}}</template>
                </el-table-column>
                <el-table-column prop="time" label="影院补贴" width="100">
                    <template slot-scope="scope">{{scope.row.cinemaAllowance}}</template>
                </el-table-column>
                <el-table-column prop="time" label="第三方支付代售费" width="150">
                    <template slot-scope="scope">{{scope.row.thirdPartyPayCommissionFee}}</template>
                </el-table-column>
                <el-table-column prop="time" label="会员卡支付代售费" width="150">
                    <template slot-scope="scope">{{scope.row.memberCardPayCommissionFee}}</template>
                </el-table-column>
                <!--<el-table-column label="操作" width="100" align="center" fixed="right">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button-->
                            <!--type="text"-->
                            <!--icon="el-icon-edit"-->
                            <!--@click="addChange(scope.$index, scope.row)"-->
                        <!--&gt;价格设置</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
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
        <el-dialog title="获取排期" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="影院名称" :label-width="formLabelWidth">
                    <el-select v-model="oForm.cinemaName" placeholder="请选择">
                        <el-option
                            v-for="info in cinemaInfo"
                            :key="info.cinemaCode"
                            :value="info.cinemaName"
                            :label="info.cinemaName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="oForm.startDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="oForm.endDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="价格设置" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="影院名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oCinemaName"
                        disabled
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="影片名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oFilmName"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="放映时间" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oSessionTime"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="标准价" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oStandardPrice"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="增值服务费" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oTicketFee" disabled autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="第三方支付代售费" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oThirdPartyPayCommissionFee"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会员卡支付代售费" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oMemberCardPayCommissionFee"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 批量修改弹出框 -->
        <el-dialog title="批量修改" :visible.sync="drawer">
            <el-form ref="formOne" v-model="formOne">
                <el-form-item label="会员价" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            min="1"
                            v-model="manySettlePrice"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button type="primary" @click="sureThirdPrice">确 定</el-button>
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
            formOne:[],
            manySettlePrice:'',
            drawer:false,
            oCinemaName: '',
            oCinemaCode: '',
            oScreenCode: '',
            oScreenName: '',
            oSessionCode: '',
            oSessionTime: '',
            oFilmCode: '',
            oFilmName: '',
            oDuration: '',
            oLanguage: '',
            oDimensional: '',
            oStandardPrice: '',
            oSettlePrice: '',
            oLowestPrice: '',
            oMemberPrice: '',
            oTicketFee: '',
            oCinemaAllowance: '',
            oThirdPartyPayCommissionFee: '',
            oMemberCardPayCommissionFee: '',
            oListingPrice: '',
            oSessionId: '',
            oSessionKey: '',
            oSeatVersion: '',
            oIsArea: '',
            oId: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            boolean: [
                {
                    value: '是',
                    id: '1'
                },
                {
                    value: '否',
                    id: '2'
                }
            ],
            cinemaInfo: [],
            screenInfo: [],
            selectIdList: [],
            selectCodeList: [],
            selectId:'',
            selectCodes:'',
            form: [],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            oForm: {
                cinemaName: '',
                cinemaCode: '',
                startDate: '',
                endDate: ''
            },
            formLabelWidth: '160px',
            selectValue: {},
            selectCode: {},
            value: ''
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        thirdPrice() {
            //获取批量修改按钮权限
            if(this.multipleSelection.length==0){
                this.message = '请先勾选需要修改的影片';
                this.open();
            }else {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                https
                    .fetchPost('/sessionInfo/batchUpdatePage', '')
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            console.log(this.multipleSelection);
                            for(let x in this.multipleSelection){
                                this.selectIdList.push(this.multipleSelection[x].id)
                                this.selectCodeList.push(this.multipleSelection[x].cinemaCode)
                            }
                            this.selectId=this.selectIdList.join(',');
                            this.selectCodes=this.selectCodeList.join(',');
                            console.log(this.selectId);
                            console.log(this.selectCodes);
                            this.drawer = true;
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
        sureThirdPrice(){
            //提交确认批量修改
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: this.selectId});
            jsonArr.push({ key: 'cinemaCode', value: this.selectCodes});
            jsonArr.push({ key: 'memberPrice', value: this.manySettlePrice });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.drawer == true) {
                https
                    .fetchPost('/sessionInfo/batchUpdateMemberPrice', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.$message.success(`修改成功`);
                            this.selectIdList=[];
                            this.selectId='';
                            this.selectCodes='';
                            this.manySettlePrice='';
                            this.getMenu();
                            this.drawer = false;
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
                .fetchPost('/sessionInfo/updatePage', '')
                .then(data => {
                    loading.close();
                    // console.log(data);
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = true;
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
            //获取所选影院编码
            for (let i = 0; i < this.cinemaInfo.length; i++) {
                if (this.cinemaInfo[i].cinemaName == this.oForm.cinemaName) {
                    this.oForm.cinemaCode = this.cinemaInfo[i].cinemaCode;
                }
            }
            var jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
            jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
            jsonArr.push({ key: 'endtDate', value: this.oForm.endDate });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/sessionInfo/updateSessionInfo', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`获取成功`);
                            for (let key in this.oForm) {
                                this.oForm[key] = '';
                            }
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
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
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
            https
                .fetchDelete('/cinema/deleteCinema', params)
                .then(data => {
                    loading.close();
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
                    loading.close();
                    console.log(err);
                });
        },
        // addChange(index, row) {
        //     //是否拥有修改权限
        //     const loading = this.$loading({
        //         lock: true,
        //         text: 'Loading',
        //         spinner: 'el-icon-loading',
        //         background: 'rgba(0, 0, 0, 0.7)',
        //         target: document.querySelector('.div1')
        //     });
        //     this.idx = index;
        //     this.form = row;
        //     var jsonArr = [];
        //     jsonArr.push({ key: 'id', value: row.id });
        //     let sign = md5(preSign(jsonArr));
        //     jsonArr.push({ key: 'sign', value: sign });
        //     let params = ParamsAppend(jsonArr);
        //     https
        //         .fetchPost('/sessionInfo/getSessionInfoById', params)
        //         .then(data => {
        //             loading.close();
        //             console.log(data)
        //             console.log(JSON.parse(Decrypt(data.data.data)));
        //             if (data.data.code == 'success') {
        //                 this.editVisible = true;
        //                 this.oCinemaName = JSON.parse(Decrypt(data.data.data)).cinemaName;
        //                 this.oFilmName = JSON.parse(Decrypt(data.data.data)).filmName;
        //                 this.oSessionTime = JSON.parse(Decrypt(data.data.data)).sessionTime;
        //                 this.oStandardPrice = JSON.parse(Decrypt(data.data.data)).standardPrice;
        //                 this.oTicketFee = JSON.parse(Decrypt(data.data.data)).ticketFee;
        //                 this.oThirdPartyPayCommissionFee = JSON.parse(Decrypt(data.data.data)).thirdPartyPayCommissionFee;
        //                 this.oMemberCardPayCommissionFee = JSON.parse(Decrypt(data.data.data)).memberCardPayCommissionFee;
        //                 this.oId = JSON.parse(Decrypt(data.data.data)).id;
        //             } else if (data.data.code == 'nologin') {
        //                 this.message = data.data.message;
        //                 this.open();
        //                 this.$router.push('/login');
        //             } else {
        //                 this.message = data.data.message;
        //                 this.open();
        //             }
        //         })
        //         .catch(err => {
        //             loading.close();
        //             console.log(err);
        //         });
        // },
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
            jsonArr.push({ key: 'thirdPartyPayCommissionFee', value: this.oThirdPartyPayCommissionFee });
            jsonArr.push({ key: 'memberCardPayCommissionFee', value: this.oMemberCardPayCommissionFee });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            console.log(jsonArr);
            https
                .fetchPost('/sessionInfo/updatePartyPayCommissionFee', params)
                .then(data => {
                    loading.close();
                    console.log(data);
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
            let cinemaCode = this.query.cinemaCode;
            let screenCode = this.query.screenCode;
            let filmName = this.query.filmName;
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!screenCode) {
                screenCode = '';
            }
            if (!filmName) {
                filmName = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            jsonArr.push({ key: 'screenCode', value: screenCode });
            jsonArr.push({ key: 'filmName', value: filmName });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr)
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/sessionInfo/sessionInfoPage', params)
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
                        this.getAllScreen();
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
        // 获取所有影院
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
        chooseCinema(val) {
            this.getAllScreen(val);
        },

        // 获取所有影厅
        getAllScreen(val) {
            if (!val) {
                return
            }
            var jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: val });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/screenInfo/getScreenByCinema',params)
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.screenInfo = res;
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

