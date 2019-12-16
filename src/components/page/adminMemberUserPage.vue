<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 注册用户列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    v-model="query.businessCode"
                    placeholder="请选择商家"
                    class="mr10"
                    @change="changeBusiness"
                >
                    <el-option
                        v-for="item in businessInfo"
                        :key="item.businessCode"
                        :label="item.businessName"
                        :value="item.businessCode"
                    ></el-option>
                </el-select>
                <el-select clearable v-model="query.cinemaCode" placeholder="注册影院" class="mr10">
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="手机号"
                    v-model="query.mobile"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    placeholder="用户昵称"
                    v-model="query.userName"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                        placeholder="推荐员工编码"
                        v-model="query.employeeCode"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-date-picker
                    v-model="query.startDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="注册时间（起）"
                    class="mr10"
                ></el-date-picker>
                <el-date-picker
                    v-model="query.endDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="注册时间（止）"
                    class="mr10"
                ></el-date-picker>
                <el-input
                        placeholder="邀请注册人数（起）"
                        v-model="query.startRegisterNumber"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-input
                        placeholder="邀请注册人数（止）"
                        v-model="query.endRegisterNumber"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
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
            <el-table
                :data="tableData"
                border

                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
                >
                <el-table-column prop="name" label="头像" width="90">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width:400px" :src="scope.row.userHeadPic" />
                            <img
                                slot="reference"
                                :src="scope.row.userHeadPic"
                                :alt="scope.row.userHeadPic"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="昵称" width="110">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号" width="110">
                    <template slot-scope="scope">{{scope.row.userMobile}}</template>
                </el-table-column>
                <!-- <el-table-column prop="memo" label="是否在小程序上注册">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.miniRegisterStatus=='1'" type="danger">未注册</el-tag>
                        <el-tag v-else-if="scope.row.miniRegisterStatus=='2'" type="success">已注册</el-tag>
                    </template>
                </el-table-column> -->
                <el-table-column prop="memo" label="注册影院" width="160">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="注册时间" width="160">
                    <template slot-scope="scope">{{scope.row.miniRegisterDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="最近登陆时间" width="160">
                    <template slot-scope="scope">{{scope.row.loginDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="金币数量" width="90">
                    <template slot-scope="scope">{{scope.row.goldNumber}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="累计消费金额" width="110">
                    <template slot-scope="scope">{{scope.row.consumptionAmount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="最近一次消费" width="160">
                    <template slot-scope="scope">{{scope.row.lastConsumeDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="有效优惠券数量" width="130">
                    <template slot-scope="scope">{{scope.row.remainCoupons}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="推荐员工编码" width="120">
                    <template slot-scope="scope">{{scope.row.employeeCode}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="邀请注册人数" width="120">
                    <template slot-scope="scope">{{scope.row.shareRegisterNumber}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="游戏厅角色" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.userRole=='1'" type="danger">普通用户</el-tag>
                        <el-tag v-else-if="scope.row.userRole=='2'" type="success">管理员</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="是否绑卡" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.bindMemberCardStatus=='1'" type="danger">未绑定</el-tag>
                        <el-tag v-else-if="scope.row.bindMemberCardStatus=='2'" type="success">已绑定</el-tag>
                        <el-tag v-else-if="scope.row.bindMemberCardStatus=='3'" type="success">已解绑</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="100" >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="addChange(scope.$index, scope.row)"
                        >查看详情</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="changeRole(scope.$index, scope.row)"
                        >更改角色</el-button>
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
                <el-form-item label="国家" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.country"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="省份" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.province"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="城市" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.city"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.userName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.userMobile"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="是否在小程序注册" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.miniRegisterStatus"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="注册影院" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.cinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="小程序注册时间" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.miniRegisterDate"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="用户金币数量" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.goldNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="游戏厅角色" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.userRole"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="剩余优惠券数量" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.remainCoupons"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="票根数量" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.ticketStubNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="最近一次消费时间" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.lastConsumeDate"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="累计消费金额" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.consumptionAmount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="最近登陆时间" :label-width="formLabelWidth">
                    <el-input
                        :disabled="true"
                        style="width: 250px"
                        v-model="form.loginDate"
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
            rowMess:'',
            formLabelWidth: '120px',
            businessInfoList: [],
            value: '',
            form: [],
            cinemaInfo: [],
            businessInfo: []
        };
    },
    created() {},
    mounted() {
        this.getAllBusiness();
        this.getMenu();
    },
    methods: {
        derive(){
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let cinemaCode = this.query.cinemaCode;
                let businessCode = this.query.businessCode;
                let employeeCode = this.query.employeeCode;
                let userName = this.query.userName;
                let userMobile = this.query.mobile;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let startRegisterNumber = this.query.startRegisterNumber;
                let endRegisterNumber = this.query.endRegisterNumber;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!businessCode) {
                    businessCode = '';
                }
                if (!userName) {
                    userName = '';
                }
                if (!userMobile) {
                    userMobile = '';
                }
                if (!startDate) {
                    startDate = '';
                }
                if (!endDate) {
                    endDate = '';
                }
                if (!startRegisterNumber) {
                    startRegisterNumber = '';
                }
                if (!endRegisterNumber) {
                    endRegisterNumber = '';
                }
                if (!employeeCode) {
                    employeeCode = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'tableName', value: "member_user" });
                jsonArr.push({ key: 'exportKeysJson', value: "['id','cinemaCode','cinemaName','userName','userMobile','cnUserSex','birthday','userAge','chMemberType','cnBindMemberCardStatus','cnMiniRegisterStatus','cnAppRegisterStatus','miniRegisterDate','appRegisterDate','country','province','city','loginDate','goldNumber','cnUserRole','remainCoupons','ticketStubNumber','lastConsumeDate','consumptionAmount','cnStatus','employeeCode']"});
                jsonArr.push({ key: 'exportTitlesJson', value:"['ID','注册影院编码','注册影院名称','用户名','手机号','用户性别','用户生日','用户年龄','用户类型','是否绑定会员卡','是否注册小程序','是否注册APP','小程序注册时间','APP注册时间','国家','省份','城市','最近登录时间','金币数量','聊天室角色','剩余优惠券数量','票根数量','最近一次消费时间','累计消费金额','用户状态','推荐员工编码']" });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'businessCode', value: businessCode });
                jsonArr.push({ key: 'employeeCode', value: employeeCode });
                jsonArr.push({ key: 'userName', value: userName });
                jsonArr.push({ key: 'userMobile', value: userMobile });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'startRegisterNumber', value: startRegisterNumber });
                jsonArr.push({ key: 'endRegisterNumber', value: endRegisterNumber });
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
                    url: '/exportExcel/memberUser',
                    fileName: businessName + '_注册用户列表统计',
                    params: params
                };
                https.exportMethod(myObj);
                loading.close();
            }, 1500);
        },
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
                    .fetchPost('/admin/memberUser/getMemberUserById', params)
                    .then(data => {
                        loading.close();
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            this.form.id = row.id;
                            this.form = JSON.parse(Decrypt(data.data.data));
                            if (JSON.parse(Decrypt(data.data.data)).userRole == 1) {
                                this.form.userRole = '普通用户';
                            } else if (JSON.parse(Decrypt(data.data.data)).userRole == 2) {
                                this.form.userRole = '管理员';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).miniRegisterStatus == 1) {
                                this.form.miniRegisterStatus = '未注册';
                            } else if (JSON.parse(Decrypt(data.data.data)).miniRegisterStatus == 2) {
                                this.form.miniRegisterStatus = '已注册';
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
        changeRole(index, row) {
            console.log(row.userRole);
            if(row.userRole==1){
                    this.rowMess='游戏厅管理员'
            }
            if(row.userRole==2){
                this.rowMess='普通用户'
            }
            this.$confirm('此操作将用户角色更改为'+this.rowMess+', 是否继续?', '提示', {
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
                    var jsonArr = [];
                    let role = 0;
                    if (row.userRole == 1) {
                        role = 2
                    }
                    if (row.userRole == 2) {
                        role = 1
                    }
                    jsonArr.push({ key: 'id', value: row.id });
                    jsonArr.push({ key: 'userRole', value: role });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/admin/memberUser/updateUserRole',params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
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
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消更改'
                });
            });
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
            this.query.businessCode = val;
            this.getAllCinema();
            this.$forceUpdate();
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
                let cinemaCode = this.query.cinemaCode;
                let businessCode = this.query.businessCode;
                let employeeCode = this.query.employeeCode;
                let userName = this.query.userName;
                let mobile = this.query.mobile;
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let startRegisterNumber = this.query.startRegisterNumber;
                let endRegisterNumber = this.query.endRegisterNumber;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!businessCode) {
                    businessCode = '';
                }
                if (!employeeCode) {
                    employeeCode = '';
                }
                if (!userName) {
                    userName = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!startDate) {
                    startDate = '';
                }
                if (!endDate) {
                    endDate = '';
                }
                if (!startRegisterNumber) {
                    startRegisterNumber = '';
                }
                if (!endRegisterNumber) {
                    endRegisterNumber = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'businessCode', value: businessCode });
                jsonArr.push({ key: 'employeeCode', value: employeeCode });
                jsonArr.push({ key: 'userName', value: userName });
                jsonArr.push({ key: 'userMobile', value: mobile });
                jsonArr.push({ key: 'startDate', value: startDate });
                jsonArr.push({ key: 'endDate', value: endDate });
                jsonArr.push({ key: 'startRegisterNumber', value: startRegisterNumber });
                jsonArr.push({ key: 'endRegisterNumber', value: endRegisterNumber });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/admin/memberUser/memberUserPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            if (data.data && data.data.data) {
                                var oData = JSON.parse(Decrypt(data.data.data));
                                this.tableData = oData.data;
                                this.query.pageSize = oData.pageSize;
                                this.query.pageNo = oData.pageNo;
                                this.query.totalCount = oData.totalCount;
                                this.query.totalPage = oData.totalPage;
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
            }, 500);
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

