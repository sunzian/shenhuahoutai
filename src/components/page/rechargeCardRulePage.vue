<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 规则管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="影院名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="margin-left: 730px"
                >添加</el-button>
            </div>
            <el-table
                :data="tableData"
                height="500"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="code" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="code" label="影院编码">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="充值规则名称">
                    <template slot-scope="scope">{{scope.row.ruleName}}</template>
                </el-table-column>
                <el-table-column prop="number" label="会员卡类别名称">
                    <template slot-scope="scope">{{scope.row.cardLevelName}}</template>
                </el-table-column>
                <el-table-column prop="number" label="充值金额">
                    <template slot-scope="scope">{{scope.row.rechargeAmount}}</template>
                </el-table-column>
                <el-table-column prop="number" label="赠送金额">
                    <template slot-scope="scope">{{scope.row.givenMoney}}</template>
                </el-table-column>
                <el-table-column prop="booleans" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">已开通</el-tag>
                        <el-tag v-else type="danger">未开通</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
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
        <el-dialog title="设置规则" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="影院名称"  :label-width="formLabelWidth">
                    <el-select v-model="oForm.cinemaName" placeholder="请选择" @change="getCinemaCode">
                        <el-option
                            v-for="info in cinemaInfo"
                            :key="info.cinemaCode"
                            :value="info.cinemaName"
                            :label="info.cinemaName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="充值规则名称"  :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oForm.ruleName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="充值金额(起充金额)" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oForm.rechargeAmount" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="赠送金额" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oForm.givenMoney"
                        autocomplete="off"
                        placeholder="不填默认为0"
                    ></el-input>
                </el-form-item>
                <el-form-item label="设置优惠券" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oForm.givenTicketsParams"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="优惠描述" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oForm.ruleMemo" placeholder="建议长度不超过15字" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
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
                        disabled
                        v-model="oCinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="充值规则名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oRuleName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="充值金额(起充金额)" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oRechargeAmount" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="赠送金额" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oGivenMoney"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="设置优惠券" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        min="1"
                        v-model="oGivenTicketsParams"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="优惠描述" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oRuleMemo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oStatus" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
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
            oCinemaName: '',
            oRuleName: '', // 规则名称
            oRechargeAmount: '', // 充值金额
            oGivenType: '', // 赠送类型
            oGivenMoney: '', //赠送金额
            oGivenTicketsParams: '', //赠送优惠券
            oRuleMemo: '', // 活动描述
            oStatus: '', // 启用状态
            oId: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 10
            },
            options: [
                {
                    value: '1',
                    label: '启用'
                },
                {
                    value: '2',
                    label: '未启用'
                }
            ],
            cinemaInfo: [],
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
                ruleName: '', // 规则名称
                rechargeAmount: '', // 充值金额
                givenType: '', // 赠送类型
                givenMoney: '', //赠送金额
                givenTicketsParams: '', //赠送优惠券
                ruleMemo: '', // 活动描述
                status: '', // 启用状态
                id: '',
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
                .fetchPost('/rechargeCardRule/addPage', '')
                .then(data => {
                    this.cinemaInfo = JSON.parse(Decrypt(data.data.data));
                    console.log(this.cinemaInfo)
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = true;
                        // this.getAllCinema();
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
            loading.close();
        },
        addRole() {
            //新增按钮操作
            // const loading = this.$loading({
            //     lock: true,
            //     text: 'Loading',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.7)',
            //     target: document.querySelector('.div1')
            // });
            //获取所选影院编码
            // for (let i = 0; i < this.cinemaInfo.length; i++) {
            //     if (this.cinemaInfo[i].cinemaName == this.oForm.cinemaName) {
            //         this.oForm.cinemaCode = this.cinemaInfo[i].cinemaCode;
            //     }
            // }
            console.log(this.cardList)
            console.log(this.oForm.cinemaCode)
            return
            var jsonArr = [];
            if (this.oForm.givenMoney != '') {
                jsonArr.push({ key: 'givenMoney', value: this.oForm.givenMoney });
            }
            jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
            jsonArr.push({ key: 'cinemaName', value: this.oForm.cinemaName });
            jsonArr.push({ key: 'ruleName', value: this.oForm.ruleName });
            jsonArr.push({ key: 'rechargeAmount', value: this.oForm.rechargeAmount });
            jsonArr.push({ key: 'givenType', value: 1 }); // 赠送类型
            jsonArr.push({ key: 'cardLevelCode', value: 8888 });
            jsonArr.push({ key: 'cardLevelName', value: "普通类型" });
            // jsonArr.push({ key: 'givenType', value: this.oForm.givenType }); // 赠送类型
            jsonArr.push({ key: 'ruleMemo', value: this.oForm.ruleMemo });
            jsonArr.push({ key: 'status', value: 1 });
            // jsonArr.push({ key: 'status', value: this.oForm.status });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/rechargeCardRule/addRechargeCardRule', params)
                    .then(data => {
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
                        console.log(err);
                    });
                loading.close();
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
                .fetchDelete('/rechargeCardRule/deleteRechargeCardRule', params)
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
            loading.close();
        },
        addChange(index, row) {
            //是否拥有修改权限
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
                .fetchPost('/rechargeCardRule/modifyPage', params)
                .then(data => {
                    console.log(data)
                    if (data.data.code == 'success') {
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        this.editVisible = true;
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).rechargeCardRules.cinemaName;
                        this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).rechargeCardRules.cinemaCode;
                        this.oRuleName = JSON.parse(Decrypt(data.data.data)).rechargeCardRules.ruleName;
                        this.oRechargeAmount = JSON.parse(Decrypt(data.data.data)).rechargeCardRules.rechargeAmount;
                        this.oGivenMoney = JSON.parse(Decrypt(data.data.data)).rechargeCardRules.givenMoney;
                        this.oRuleMemo = JSON.parse(Decrypt(data.data.data)).rechargeCardRules.ruleMemo;
                        this.oStatus = JSON.parse(Decrypt(data.data.data)).rechargeCardRules.Status;
                        this.oId = JSON.parse(Decrypt(data.data.data)).rechargeCardRules.id;
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
            loading.close();
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
            var jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode });
            jsonArr.push({ key: 'ruleName', value: this.oRuleName });
            jsonArr.push({ key: 'rechargeAmount', value: this.oRechargeAmount });
            jsonArr.push({ key: 'ruleMemo', value: this.oRuleMemo });
            // jsonArr.push({ key: 'cinemaName', value: this.oForm.cinemaName });
            jsonArr.push({ key: 'givenType', value: 1 }); // 赠送类型
            jsonArr.push({ key: 'cardLevelCode', value: 8888 });
            jsonArr.push({ key: 'cardLevelName', value: "普通类型" });
            // jsonArr.push({ key: 'givenType', value: this.oGivenType }); // 赠送类型
            // jsonArr.push({ key: 'givenMoney', value: this.oGivenMoney });
            jsonArr.push({ key: 'status', value: 1 });
            // jsonArr.push({ key: 'status', value: this.oStatus });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
                        console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            this.editVisible = false;
            https
                .fetchPost('/rechargeCardRule/modifyRechargeCardRule', params)
                .then(data => {
                    console.log(data);
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
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
                    console.log(err);
                });
            loading.close();
        },
        Search() {
            this.query.pageNo = 1;
            this.getMenu();
        },
        getCinemaCode(e) {
            //获取所选影院编码
            for (let i = 0; i < this.cinemaInfo.length; i++) {
                if (this.cinemaInfo[i].cinemaName == e) {
                    this.oForm.cinemaCode = this.cinemaInfo[i].cinemaCode;
                }
            }
            this.getAllCinemaCard(this.oForm.cinemaCode);
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
            // jsonArr.push({ key: 'cinemaName', value: name });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/rechargeCardRule/rechargePage', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
                        this.tableData = oData.data;
                        this.query.pageSize = oData.pageSize;
                        this.query.pageNo = oData.pageNo;
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
                    console.log(err);
                });
            loading.close();
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
                        console.log(res);
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
        // 获取所有影院会员卡
        getAllCinemaCard(cinemaCode) {
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/rechargeCardRule/listCardLevel', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.cardList = res;
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

