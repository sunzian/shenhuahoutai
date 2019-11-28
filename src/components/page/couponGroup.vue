<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 券包设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.cinemaCode" placeholder="请选择影院" class="handle-input mr10">
                    <el-option
                        v-for="item in cinemaData"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input placeholder="券包名称" class="mr10" v-model="query.groupName" autocomplete="off"></el-input>
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="启用" value="1"></el-option>
                    <el-option key="0" label="未启用" value="0"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >生成券包</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="适用影院">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column label="券包名称">
                    <template slot-scope="scope">{{scope.row.groupName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="券包说明">
                    <template slot-scope="scope">{{scope.row.memo}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已发放数量" width="110">
                    <template slot-scope="scope">{{scope.row.hasSendNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态" width="110">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="success"
                            v-if="scope.row.status == 0"
                            @click="changeStatus(scope.$index, scope.row)"
                        >启用</el-button>
                        <el-button
                            type="success"
                            v-if="scope.row.status == 1"
                            @click="changeStatus(scope.$index, scope.row)"
                        >停用</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.$index, scope.row)"
                        >修改</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="delChange(scope.$index, scope.row)"
                        >删除</el-button>
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
        <!--新增弹出框-->
        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="券包名称：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择影院：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.cinemaCode" @change="selectCinema">
                        <el-radio
                            v-for="item in cinemaInfo"
                            :label="item.cinemaCode"
                            :key="item.cinemaCode"
                            :value="item.cinemaName"
                        >{{item.cinemaName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="选择优惠券" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选优惠券"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0"
                        :required="true"
                >
                    <div v-for="(item, index) in selectedSell" style="margin-bottom: 5px" :key="index">
                        <el-input
                                style="width: 250px"
                                v-model="item.name"
                                autocomplete="off"
                                :value="item.id"
                                :disabled="true"
                                :change="one(item.id)"
                        >
                        </el-input>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        数量：{{item.num}}
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deleteSell(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="开启状态：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="券包说明：" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="oForm.memo"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="详情" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="适用影院名称：" :label-width="formLabelWidth">
                    <span>{{oCinemaName}}</span>
                </el-form-item>
                <el-form-item :required="true" label="券包名称：" :label-width="formLabelWidth">
                    <el-input style="width: 215px" v-model="oGroupName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择优惠券" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选优惠券"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0"
                        :required="true"
                >
                    <div v-for="(item, index) in selectedSell" style="margin-bottom: 5px" :key="index">
                        <el-input
                                style="width: 250px"
                                v-model="item.name"
                                autocomplete="off"
                                :value="item.id"
                                :disabled="true"
                                :change="one(item.id)"
                        >
                        </el-input>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        每人发放数量：{{item.num}}
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deleteSell(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="使用须知：" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="oMemo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增优惠券弹出框-->
        <el-dialog title="选择优惠券" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.name" placeholder="优惠券名称" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="openNext">搜索</el-button>
                </div>
                <el-table
                        :data="sellTableData"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="id" :label="scope.$index" @change.native="getCurrentRow(scope.$index)">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠券名称">
                        <template slot-scope="scope">{{scope.row.name}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="每人发放数量">
                        <template slot-scope="scope">
                            <el-input placeholder="输入数量" v-model="scope.row.num"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="query.aPageNo"
                            :page-size="query.aPageSize"
                            :total="query.aTotalCount"
                            @current-change="aCurrentChange"
                            @prev-click='aPrev'
                            @next-click="aNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button type="primary" @click="sureNext">确 定</el-button>
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
            oGroupName: '',
            oMemo: '',
            oId: '',
            oStatus: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                aPageNo: 1,
                aPageSize: 15
            },
            restaurants: [],
            tableData: [],
            multipleSelection: [],
            sellTableData: [],
            delList: [],
            editVisible: false,
            drawer: false,
            pageTotal: 0,
            form: {},
            selectScreen: '', // 选中的影厅
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            options: [
                {
                    value: '0',
                    label: '未启用'
                },
                {
                    value: '1',
                    label: '启用'
                }
            ],
            canUse: [
                {
                    value: '0',
                    label: '否'
                },
                {
                    value: '1',
                    label: '是'
                }
            ],
            oForm: {
                name: '',
                groupName: '',
                cinemaName: '',
                cinemaCode: [],
                reduceType: '1',
                couponName: '',
                groupId: '',
                memo: '',
                number: '',
                id: '',
                status: '0'
            },
            formLabelWidth: '120px',
            selectValue: {},
            selectScreenCode: {},
            selectGroup: {},
            cinemaInfo: [],
            cinemaData: [],
            screenInfo: [],
            couponList: [],
            selectedSell: [],
            value: '',
            sellIndex: ''
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        deleteSell(index) {
            console.log(index);
            this.selectedSell.splice(index, 1);
        },
        one(a){//获取影片绑定的value值
            console.log(a);
            this.ticketIds =a
        },
        sureNext() {
            if(this.sellIndex>=0){
                // this.selectedSell=[]
                this.selectedSell.push(this.sellTableData[this.sellIndex]);
            }
            console.log(this.selectedSell);
            this.drawer = false;
        },
        getCurrentRow(index){//优惠券弹出框index
            this.sellIndex=index;
        },
        openNext() {
            //获取优惠券列表
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let name=this.query.name;
                if(!name){
                    name=''
                }
                let jsonArr = [];
                jsonArr.push({key:"name",value:name});
                jsonArr.push({key:"cinemaCode",value:this.oForm.cinemaCode});
                jsonArr.push({key:"simpleType",value:'1'});
                jsonArr.push({key:"status",value:'1'});
                jsonArr.push({key:"pageNo",value:this.query.aPageNo});
                jsonArr.push({key:"pageSize",value:this.query.aPageSize});
                let sign =md5(preSign(jsonArr));
                console.log(jsonArr);
                jsonArr.push({key:"sign",value:sign});
                var params = ParamsAppend(jsonArr);
                https.fetchPost('/merchandiseCoupon/getCouponByCinemaCode',params).then((data) => {
                    loading.close();
                    console.log(data);
                    if(data.data.code=='success') {
                        this.drawer=true;
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
                        // console.log(this.query);
                        this.sellTableData = oData.pageResult.data;
                        console.log(this.sellTableData);
                        this.query.aPageSize = oData.pageResult.pageSize;
                        this.query.aPageNo = oData.pageResult.pageNo;
                        this.query.aTotalCount = oData.pageResult.totalCount;
                        this.query.aTotalPage = oData.pageResult.totalPage
                    }else if(data.data.code=='nologin'){
                        this.message=data.data.message;
                        this.open();
                        this.$router.push('/login');
                    }else{
                        this.message=data.data.message;
                        this.open()
                    }

                }).catch(err=>{
                        loading.close();
                        console.log(err)
                    }
                )
            }, 500);
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
                .fetchPost('couponGroup/addCouponGroupPage', '')
                .then(data => {
                    loading.close();
                    this.selectedSell=[];
                    console.log(data);
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.cinemaInfo = [];
                        for (let i = 0; i < oData.length; i++) {
                            let cinemaInfo = {};
                            cinemaInfo.cinemaCode = oData[i].cinemaCode;
                            cinemaInfo.cinemaName = oData[i].cinemaName;
                            this.cinemaInfo.push(cinemaInfo);
                        }
                        console.log(this.cinemaInfo);
                        this.oForm.cinemaCode = this.cinemaInfo[0].cinemaCode;
                        this.selectValue = this.cinemaInfo[0].cinemaCode;
                        this.dialogFormVisible = true;
                        this.oForm.name = '';
                        this.oForm.couponName = '';
                        this.oForm.cinemaCode = [];
                        this.selectValue = '';
                        this.selectGroup = {};
                        this.oForm.cinemaName = '';
                        this.oForm.status = '';
                        this.oForm.number = '';
                        this.oForm.memo = '';
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
            if(!this.oForm.name||!this.oForm.cinemaCode||!this.selectedSell||!this.oForm.status){
                this.message = '必填项不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            var jsonArr = [];
            let coupon = [];
            for (let i = 0; i < this.selectedSell.length; i++) {
                coupon.push(this.selectedSell[i].id + '=' + this.selectedSell[i].num);
            }
            let newCoupon = coupon.join(',');
            jsonArr.push({ key: 'groupName', value: this.oForm.name });
            jsonArr.push({ key: 'couponNumbers', value: newCoupon });
            jsonArr.push({ key: 'cinemaCodes', value: this.selectValue });
            jsonArr.push({ key: 'status', value: this.oForm.status });
            jsonArr.push({ key: 'memo', value: this.oForm.memo });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('couponGroup/addCouponGroup', params)
                    .then(data => {
                        //新增
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.selectedSell=[];
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
            }
        },
        delChange(index, row) {
            //删除数据
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
                        .fetchPost('couponGroup/deleteById', params)
                        .then(data => {
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
            //是否拥有权限
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
                .fetchPost('couponGroup/updateCouponGroupPage', params)
                .then(data => {
                    loading.close();
                    console.log(data);
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        //优惠券
                        if(JSON.parse(Decrypt(data.data.data)).couponGroup.couponList){
                            this.selectedSell=[];
                            for(let x in JSON.parse(Decrypt(data.data.data)).couponGroup.couponList){
                                let json={};
                                json.id=JSON.parse(Decrypt(data.data.data)).couponGroup.couponList[x].couponId;
                                json.name=JSON.parse(Decrypt(data.data.data)).couponGroup.couponList[x].couponName;
                                json.num=JSON.parse(Decrypt(data.data.data)).couponGroup.couponList[x].number;
                                this.selectedSell.push(json)
                            }
                            console.log(this.selectedSell);
                        }
                        // this.couponList = JSON.parse(Decrypt(data.data.data)).couponGroup.couponList;
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).couponGroup.cinemaName;
                        this.oForm.cinemaCode = JSON.parse(Decrypt(data.data.data)).couponGroup.cinemaCodes;
                        this.oGroupName = JSON.parse(Decrypt(data.data.data)).couponGroup.groupName;
                        this.oMemo = JSON.parse(Decrypt(data.data.data)).couponGroup.memo;
                        this.oId = JSON.parse(Decrypt(data.data.data)).couponGroup.id;
                        this.oStatus = JSON.parse(Decrypt(data.data.data)).couponGroup.status;
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
            if(!this.oGroupName||!this.selectedSell){
                this.message = '必填项不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            var jsonArr = [];
            let coupon = [];
            for (let i = 0; i < this.selectedSell.length; i++) {
                coupon.push(this.selectedSell[i].id + '=' + this.selectedSell[i].num);
            }
            let newCoupon = coupon.join(',');
            jsonArr.push({ key: 'groupName', value: this.oGroupName });
            jsonArr.push({ key: 'memo', value: this.oMemo });
            jsonArr.push({ key: 'couponNumbers', value: newCoupon });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            this.editVisible = false;
            https
                .fetchPost('couponGroup/updateCouponGroup', params)
                .then(data => {
                    loading.close();
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.$message.success(`编辑成功`);
                        this.selectedSell=[];
                        this.oForm.cinemaCode='';
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
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('couponGroup/updateStatusById', params)
                .then(data => {
                    loading.close();
                    // console.log(JSON.parse(Decrypt(data.data.data)));
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
            let groupName = this.query.groupName;
            let status = this.query.status;
            if (!groupName) {
                groupName = '';
            }
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!status) {
                status = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'groupName', value: groupName });
            jsonArr.push({ key: 'status', value: status });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            jsonArr.push({ key: 'cinemaCodes', value: cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr)
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('couponGroup/couponGroupPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
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
        },
        open() {
            //错误信息弹出框
            this.$alert(this.message, '错误信息', {
                dangerouslyUseHTMLString: true
            });
        },
        selectCinema(val) {
            console.log(val);
            this.selectValue = val;
            this.selectedSell = [];
        },
        selectDay(val) {
            // console.log(val)
            this.checkedDays = val.join(',');
        },
        // 获取所有影院
        getAllCinema() {
            https
                .fetchPost('/cinema/getAllCinema')
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        console.log(res);
                        this.cinemaData = res;
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
        // 获取所选影院影厅
        getAllScreen(value) {
            if (!value) {
                this.screenInfo = [];
                return;
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: value });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('filmCoupon/getScreenInfoByCinemaCode', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        let screens = JSON.parse(Decrypt(data.data.data));
                        this.screenInfo = [];
                        for (let i = 0; i < screens.length; i++) {
                            let screenList = {};
                            screenList.screenCode = screens[i].screenCode;
                            screenList.screenName = screens[i].screenName;
                            this.screenInfo.push(screenList);
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
                    console.log(err);
                });
        },
        // 取消按钮操作
        cancel() {
            this.$confirm('该操作将清空页面数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.dialogFormVisible = false;
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
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
        //新增优惠券页面
        aCurrentChange(val){//点击选择具体页数
            this.query.aPageNo = val;
            this.openNext()
        },
        aPrev(){//分页按钮上一页
            this.query.aPageNo--;
            this.openNext()
        },
        aNext(){//分页按钮下一页
            this.query.aPageNo++;
            this.openNext()
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
