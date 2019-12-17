<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 员工管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" v-if="showSell">
            <div class="handle-box">
                <el-select
                    clearable
                    v-model="query.cinemaCode"
                    placeholder="请选择影院"
                    class="handle-input mr10"
                >
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;"  type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="影院编码" width="110">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院名称" width="280">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="省份" width="110">
                    <template slot-scope="scope">{{scope.row.province}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="城市" width="110">
                    <template slot-scope="scope">{{scope.row.city}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="详细地址">
                    <template slot-scope="scope">{{scope.row.address}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="联系方式" width="150">
                    <template slot-scope="scope">{{scope.row.serviceMobile}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="show(scope.row)"
                        >查看员工详情</el-button>
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
        <div class="container" v-if="!showSell">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="输入员工姓名" class="handle-input mr10"></el-input>
                <el-input v-model="query.code" placeholder="输入员工编码" class="handle-input mr10"></el-input>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="searchEmployee">搜索</el-button>
                <el-button
                    type="primary"
                    @click="back"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >返回影院列表</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >新增员工</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="员工编码">
                    <template slot-scope="scope">{{scope.row.employeeCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="员工名称">
                    <template slot-scope="scope">{{scope.row.employeeName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="员工手机号">
                    <template slot-scope="scope">{{scope.row.employeeMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="推荐注册人数">
                    <template slot-scope="scope">{{scope.row.registerNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="推荐充值单数">
                    <template slot-scope="scope">{{scope.row.rechargeNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="推荐充值总金额">
                    <template slot-scope="scope">{{scope.row.rechargeMoney}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="二维码（右键另存为）" align="center" width="200">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover" v-if="scope.row.qrCode">
                            <img style="width:400px" :src="scope.row.qrCode" />
                            <img
                                slot="reference"
                                :src="scope.row.qrCode"
                                :alt="scope.row.qrCode"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                        <!-- <el-button type="text" v-else @click="addCode(scope.row.id)">点击生成二维码</el-button> -->
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="delChange(scope.$index, scope.row)"
                        >删除</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-refresh"
                            class="red"
                            v-if="!scope.row.qrCode"
                            @click="addCode(scope.row.id)"
                        >生成员工二维码</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-refresh"
                            class="red"
                            v-if="scope.row.qrCode"
                            @click="addCode(scope.row.id)"
                        >刷新员工二维码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        @size-change="aHandleSizeChange"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="query.aPageNo"
                        :page-sizes="[10, 15, 20, 30]"
                        :page-size="query.aPageSize"
                        :total="query.aTotalCount"
                        @current-change="aCurrentChange"
                        @prev-click="aPrev"
                        @next-click="aNext"
                ></el-pagination>
            </div>
        </div>
        <!--新增弹出框-->
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="员工名称：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.name" maxlength="10" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="员工手机号码：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.employeeMobile" maxlength="18" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="推荐充值送券：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.couponGroupStatus">
                        <el-radio label="1">赠送</el-radio>
                        <el-radio label="2">不赠送</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        v-if="oForm.couponGroupStatus==1"
                        label="设置券包："
                        :label-width="formLabelWidth"
                        :required="true">
                    <el-button type="primary" @click="changeCoupon">选择券包</el-button>
                </el-form-item>
                <el-form-item
                        v-if="couponId&&oForm.couponGroupStatus==1"
                        label="所选券包："
                        :label-width="formLabelWidth"
                        :required="true">
                    <el-input style="width: 150px" v-model="groupName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                            v-if="groupName"
                            style="color:red;cursor: pointer;"
                            @click="deletCoupon"
                    >删除</span>
                </el-form-item>
                <el-form-item :required="true" v-if="groupName&&oForm.couponGroupStatus==1" label="领取后几天过期：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.overDays" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="员工名称：" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        v-model="oName"
                        maxlength="10"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="员工手机号码：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oEmployeeMobile" maxlength="18" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="推荐充值送券：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oCouponGroupStatus">
                        <el-radio label="1">赠送</el-radio>
                        <el-radio label="2">不赠送</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        v-if="oCouponGroupStatus==1"
                        label="设置券包："
                        :label-width="formLabelWidth"
                        :required="true">
                    <el-button type="primary" @click="changeCoupon">选择券包</el-button>
                </el-form-item>
                <el-form-item
                        v-if="couponId&&oCouponGroupStatus==1"
                        label="所选券包："
                        :label-width="formLabelWidth"
                        :required="true">
                    <el-input style="width: 150px" v-model="groupName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                            v-if="groupName"
                            style="color:red;cursor: pointer;"
                            @click="deletCoupon"
                    >删除</span>
                </el-form-item>
                <el-form-item :required="true" v-if="groupName&&oCouponGroupStatus==1" label="领取后几天过期：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oOverDays" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 选择券包弹出窗 -->
        <el-dialog :close-on-click-modal="false" title="选择券包" :visible.sync="drawerCoupon">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.groupName" placeholder="券包名称" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="changeCoupon">搜索</el-button>
                </div>
                <el-table
                        :data="couponList"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="couponId" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="券包名称" width="150">
                        <template slot-scope="scope">{{scope.row.groupName}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠券详情">
                        <template slot-scope="scope">
                            <span
                                    v-for="item in scope.row.couponList"
                                    :key="item"
                            >{{item.couponName}}x{{item.number}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            @size-change="bHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.bPageNo"
                            :page-sizes="[10, 15, 20, 30]"
                            :page-size="query.bPageSize"
                            :total="query.bTotalCount"
                            @current-change="bCurrentChange"
                            @prev-click="bPrev"
                            @next-click="bNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawerCoupon = false">取 消</el-button>
                <el-button type="primary" @click="sureAdd(couponId)">确 定</el-button>
            </div>
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
            oCinemaName: '',
            oName: '',
            oEmployeeMobile: '',
            oCouponGroupStatus: '',
            oOverDays: '',
            oImageUrl: '',
            oType: '',
            oSingleNumber: '',
            oGroupNumber: '',
            oId: '',
            oLimitStatus: '',
            oSingleLimitNumber: '',
            drawer: false,
            showSell: true, //卖品信息页面是否展示开关
            type: {
                type: ''
            },
            fileList: [],
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                aPageNo: 1,
                aPageSize: 15,
                bPageNo: 1,
                bPageSize: 15,
            },
            restaurants: [],
            tableData: [],
            multipleSelection: [],
            couponList: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            id: '',
            dialogFormVisible: false,
            drawerCoupon: false,
            options: [
                {
                    value: '1',
                    label: '优惠券'
                },
                {
                    value: '2',
                    label: '实物'
                }
            ],
            canUse: [
                {
                    value: '1',
                    label: '不限制'
                },
                {
                    value: '2',
                    label: '限制'
                }
            ],
            oForm: {
                name: '',
                employeeMobile: '',
                cinemaName: '',
                cinemaCode: '',
                image_url: '',
                singleNumber: '',
                overDays: '',
                limitStatus: '',
                groupNumber: '',
                singleLimitNumber: '',
                couponGroupStatus: '2',
                type: ''
            },
            sellTableData: [],
            formLabelWidth: '120px',
            selectValue: {},
            selectScreenCode: {},
            selectGroup: {},
            cinemaInfo: [],
            couponInfo: {},
            value: [],
            couponName: '',
            groupName: '',
            couponId:'',
        };
    },
    created() {
        this.showSell = true;
    },
    mounted() {
        this.getMenu();
        this.getAllCinema();
    },
    methods: {
        deletCoupon() {
            this.groupName = '';
            this.couponId = '';
        },
        sureAdd(id) {
            this.couponId = id;
            for (let i = 0; i < this.couponList.length; i++) {
                if (this.couponList[i].id == this.couponId) {
                    this.groupName = this.couponList[i].groupName;
                }
            }
            this.drawerCoupon = false;
        },
        // 更换券包
        changeCoupon() {
            let groupName=this.query.groupName
            if(!groupName){
                groupName=''
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCodes', value: this.cinemaCode });
            jsonArr.push({ key: 'groupName', value: groupName });
            jsonArr.push({ key: 'status', value: 1 });
            jsonArr.push({ key: 'pageNo', value: this.query.bPageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.bPageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https.fetchPost('/couponGroup/couponGroupPage', params).then(data => {
                if (data.data.code == 'success') {
                    var res = JSON.parse(Decrypt(data.data.data));
                    if (res.data.length == 0) {
                        this.message = '暂无券包';
                        this.open();
                        return;
                    }
                    this.couponList = res.data;
                    this.query.bPageSize = res.pageSize;
                    this.query.bPageNo = res.pageNo;
                    this.query.bTotalCount = res.totalCount;
                    this.query.bTotalPage = res.totalPage;
                    this.drawerCoupon = true;
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
            https
                .fetchPost('/employee/addPage', '')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = true;
                        this.oForm.name = '';
                        this.oForm.employeeMobile = '';
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
            if(!this.oForm.name){
                this.message = '员工名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.employeeMobile.length!=11){
                this.message = '请输入正确的员工手机号码！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.couponGroupStatus==1){
                if(!this.groupName){
                    this.message = '所选券包不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oForm.overDays<1){
                    this.message = '领取后几天过期必须大于1，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oForm.overDays||this.oForm.overDays==''){
                    this.message = '领取后几天过期不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            var jsonArr = [];
            jsonArr.push({ key: 'employeeName', value: this.oForm.name });
            jsonArr.push({ key: 'employeeMobile', value: this.oForm.employeeMobile });
            jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
            jsonArr.push({ key: 'couponGroupStatus', value: this.oForm.couponGroupStatus });
            jsonArr.push({ key: 'couponGroupId', value: this.couponId });
            jsonArr.push({ key: 'overDays', value: this.oForm.overDays });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/employee/addEmployee', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.oForm.couponGroupStatus='2';
                            this.couponId='';
                            this.oForm.overDays='';
                            this.groupName='';
                            this.show();
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
            this.$confirm('此操作将永久删除该员工数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.idx = index;
                    this.form = row;
                    let jsonArr = [];
                    jsonArr.push({ key: 'id', value: row.id });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/employee/deleteById', params)
                        .then(data => {
                            if (data.data.code == 'success') {
                                this.$message.error(`删除了`);
                                this.show();
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
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
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
            this.idx = index;
            this.form = row;
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('employee/updatePage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.oName = JSON.parse(Decrypt(data.data.data)).employeeName;
                        this.oId = JSON.parse(Decrypt(data.data.data)).id;
                        this.oEmployeeMobile = JSON.parse(Decrypt(data.data.data)).employeeMobile;
                        this.groupName = JSON.parse(Decrypt(data.data.data)).couponGroupName;
                        this.couponId = JSON.parse(Decrypt(data.data.data)).couponGroupId;
                        this.oCouponGroupStatus = JSON.parse(Decrypt(data.data.data)).couponGroupStatus;
                        if(JSON.parse(Decrypt(data.data.data)).couponGroupStatus==1){
                            this.oCouponGroupStatus= '1'
                        }
                        if(JSON.parse(Decrypt(data.data.data)).couponGroupStatus==2){
                            this.oCouponGroupStatus= '2'
                        }
                        this.oOverDays = JSON.parse(Decrypt(data.data.data)).overDays;
                        this.editVisible = true;
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
        show(row) {
            this.showSell = false;
            //是否拥有权限
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let name = this.query.name;
            let code = this.query.code;
            if (!name) {
                name = '';
            }
            if (!code) {
                code = '';
            }
            if (row) {
                this.cinemaCode = row.cinemaCode;
            }
            var jsonArr = [];
            jsonArr.push({ key: 'pageNo', value: this.query.aPageNo });
            jsonArr.push({ key: 'name', value: this.query.name });
            jsonArr.push({ key: 'code', value: this.query.code });
            jsonArr.push({ key: 'pageSize', value: this.query.aPageSize });
            jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/employee/employeePage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.tableData = oData.data;
                        this.query.aPageSize = oData.pageSize;
                        this.query.aPageNo = oData.pageNo;
                        this.query.aTotalCount = oData.totalCount;
                        this.query.aTotalPage = oData.totalPage;
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
        // 编辑操作
        exChanger() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if(!this.oName){
                this.message = '员工名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oEmployeeMobile.length!=11){
                this.message = '请输入正确的员工手机号码！';
                this.open();
                loading.close();
                return;
            }
            if(this.oCouponGroupStatus==1){
                if(!this.groupName){
                    this.message = '所选券包不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oOverDays<1){
                    this.message = '领取后几天过期必须大于1，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oOverDays||this.oOverDays==''){
                    this.message = '领取后几天过期不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            var jsonArr = [];
            jsonArr.push({ key: 'employeeName', value: this.oName });
            jsonArr.push({ key: 'employeeMobile', value: this.oEmployeeMobile });
            jsonArr.push({ key: 'couponGroupStatus', value: this.oCouponGroupStatus });
            jsonArr.push({ key: 'couponGroupId', value: this.couponId });
            jsonArr.push({ key: 'overDays', value: this.oOverDays });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('employee/updateEmployee', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = false;
                        this.$message.success(`编辑成功`);
                        this.couponId='';
                        this.groupName='';
                        this.show();
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
        // 修改状态
        changeStatus(index, row) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            this.idx = index;
            this.form = row;
            var jsonArr = [];
            let status;
            if (row.status == 1) {
                status = 0;
            } else if (row.status == 0) {
                status = 1;
            }
            jsonArr.push({ key: 'id', value: row.id });
            jsonArr.push({ key: 'status', value: status });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('couponGroup/updateStatusById', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.$message.success(`修改成功`);
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

        searchEmployee() {
            this.query.pageNo = 1;
            this.show();
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
            let name = this.query.name;
            let status = this.query.status;
            if (!name) {
                name = '';
            }
            if (!status) {
                status = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            jsonArr.push({ key: 'cinemaCode', value: name });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinema/myCinemaPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
                        this.tableData = oData.data;
                        // this.query.pageSize = oData.pageSize;
                        // this.query.pageNo = oData.pageNo;
                        this.query.totalCount = oData.totalCount;
                        this.query.totalPage = oData.totalPage;
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
        back() {
            this.showSell = true;
            this.getMenu();
        },

        // 生成二维码
        addCode(id) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let jsonArr = [];
            jsonArr.push({ key: 'id', value: id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/employee/getEmployeeCode', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.show();
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
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        selectStatus(val) {
            this.selectValue = val;
        },
        selectDay(val) {
            // console.log(val)
            this.checkedDays = val.join(',');
        },
        // 获取所有影院
        getAllCinema() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            https
                .fetchPost('/cinema/getAllCinema', '')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let cinemas = JSON.parse(Decrypt(data.data.data));
                        for (let i = 0; i < cinemas.length; i++) {
                            let cinemaInfo = {};
                            cinemaInfo.label = cinemas[i].cinemaName;
                            cinemaInfo.value = cinemas[i].cinemaCode;
                            this.cinemaInfo.push(cinemaInfo);
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
        },
        // 获取所有优惠券
        getAllCoupon() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let name = this.couponName;
            if (!name) {
                name = '';
            }
            let date = new Date();
            let today =
                date.getFullYear() +
                '-' +
                (date.getMonth() + 1) +
                '-' +
                date.getDate() +
                ' ' +
                date.getHours() +
                ':' +
                date.getMinutes() +
                ':' +
                date.getSeconds();
            let jsonArr = [];
            // jsonArr.push({ key: 'simpleType', value: 1 });
            jsonArr.push({ key: 'name', value: name });
            // jsonArr.push({ key: 'status', value: 1 });
            jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('merchandiseCoupon/getCouponByCinemaCode', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let oData = JSON.parse(Decrypt(data.data.data));
                        this.drawer = true;
                        this.sellTableData = oData.pageResult.data;
                        for (let i = 0; i < this.sellTableData.length; i++) {
                            this.$set(
                                this.sellTableData[i],
                                'imgUrl',
                                'http://xiangshan-wexin.oss-cn-hangzhou.aliyuncs.com/images/201909262039272.jpg'
                            );
                        }
                        // this.query.pageSize = oData.pageResult.pageSize;
                        // this.query.pageNo = oData.pageResult.pageNo;
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
        },
        sureNext(id) {
            this.couponInfo.imgUrl = 'http://xiangshan-wexin.oss-cn-hangzhou.aliyuncs.com/images/201909262039272.jpg';
            for (let i = 0; i < this.sellTableData.length; i++) {
                if (this.sellTableData[i].id == this.couponInfo.id) {
                    this.couponInfo.couponName = this.sellTableData[i].name;
                }
            }
            this.drawer = false;
        },
        handleSelect(item) {
            this.selectGroup = {};
            this.selectGroup = item;
        },
        beforeUpload() {
            //上传之前
            this.type.type = EncryptReplace('activity');
        },
        onSuccess(data) {
            //上传文件 登录超时
            console.log(data);
            this.oForm.image_url = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        unSuccess(data) {
            //修改上传文件 登录超时
            // console.log(data);
            this.form.image_url = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
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
        },
        aHandleSizeChange(val) {
            this.query.aPageSize=val;
            this.show()
        },
        aCurrentChange(val) {
            //点击选择具体页数
            this.query.aPageNo = val;
            this.show();
        },
        aPrev() {
            //分页按钮上一页
            this.query.aPageNo--;
            this.show();
        },
        aNext() {
            //分页按钮下一页
            this.query.aPageNo++;
            this.show();
        },
        bHandleSizeChange(val) {
            this.query.bPageSize=val;
            this.changeCoupon()
        },
        bCurrentChange(val) {
            //点击选择具体页数
            this.query.bPageNo = val;
            this.changeCoupon();
        },
        bPrev() {
            //分页按钮上一页
            this.query.bPageNo--;
            this.changeCoupon();
        },
        bNext() {
            //分页按钮下一页
            this.query.bPageNo++;
            this.changeCoupon();
        },
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
