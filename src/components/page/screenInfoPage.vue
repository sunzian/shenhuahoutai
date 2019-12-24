<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影厅及座位管理
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
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >重新获取影厅</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" style="float: right;margin-top: 10px" @click="getScreenSeat">获取选中影厅座位</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="selectAll"
            >
				<el-table-column type="selection" width="55">
                </el-table-column>
                <!-- <el-table-column prop="name" label="影院编码" width="130">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column> -->
                <el-table-column prop="name" label="影院名称" width="260">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column label="影厅编号" width="150">
                    <template slot-scope="scope">{{scope.row.screenCode}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影厅名称">
                    <template slot-scope="scope">{{scope.row.screenName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="座位数" width="90">
                    <template slot-scope="scope">{{scope.row.seatCount}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="影厅类型" width="110">
                    <template slot-scope="scope">{{scope.row.screenType}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="第三方影厅名称" width="110">
                    <template slot-scope="scope">{{scope.row.thirdPartyScreenName}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
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
        <!--新增弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择影院" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="所属影院" :label-width="formLabelWidth">
                    <el-select
                        placeholder="选择影院"
                        v-model="cinemaInfo.cinemaName"
                        @change="chengeCinema"
                    >
                        <el-option
                            v-for="info in cinemaInfo"
                            :key="info.cinemaCode"
                            :value="info.cinemaName"
                            :label="info.cinemaName"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
            <el-form ref="screenForm" :model="screenForm">
                <el-form-item label="第三方影厅名称" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        type="textarea"
                        maxlength="50"
                        :rows="5"
                        show-word-limit
                        v-model="screenForm.thirdPartyScreenName"
                        autocomplete="off"
                    ></el-input>
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
            oName: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            screenForm: {
                cinemaCode: ''
            },
            selectScreen: '', // 选中的影厅
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            options: [],
            oForm: {
                cinemaCode: ''
            },
            formLabelWidth: '120px',
            selectValue: {},
            cinemaInfo: [],
            screenInfo: [],
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
                .fetchPost('/screenInfo/addPage', '')
                .then(data => {
                    loading.close();
                    console.log(data);
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
            var jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/screenInfo/updateScreenInfo', params)
                    .then(data => {
                        loading.close();
                        //新增
                        // console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`获取成功`);
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
            jsonArr.push({ key: 'roleName', value: name });
            jsonArr.push({ key: 'status', value: status });
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/role/deleteRole', params)
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
        addChange(index, row) {
            //是否修改权限
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/screenInfo/updatePage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.screenForm = JSON.parse(Decrypt(data.data.data));
                        this.editVisible = true
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
            if (this.screenForm.thirdPartyScreenName.split(" ").join("").length == 0) {
                this.message = '影厅名称不能为空或纯空格！';
                this.open();
                loading.close();
                return
            }
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: this.screenForm.id });
            jsonArr.push({ key: 'thirdPartyScreenName', value: this.screenForm.thirdPartyScreenName });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/screenInfo/updateScreenName', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = false;
                        this.$message.success(`编辑成功`);
                        this.editVisible = false
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
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!screenCode) {
                screenCode = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode});
            jsonArr.push({ key: 'screenCode', value: screenCode });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/screenInfo/screenInfoPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        console.log(oData);
                        // console.log(this.query);
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
        getAllCinema() {
            // 获取所有影院
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
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        // 多选影厅
        selectAll(e) {
            this.selectScreen = "";
            for ( let i = 0; i < e.length; i ++) {
               this.selectScreen+=","+e[i].cinemaCode+"="+ e[i].screenCode;
            }
            if(this.selectScreen.substring(1).length>0){
                this.selectScreen=this.selectScreen.substring(1);
            }
        },
        // 获取选中影厅座位
        getScreenSeat() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCodes', value: this.selectScreen });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/screenSeat/batchUpdateScreenSeat', params)
                .then(data => {
                    loading.close();
                    console.log(data);
                    if (data.data.code == 'success') {
                        this.$message.success(`获取成功`);
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
        },
        // 选择影院
        chengeCinema() {
            for (let i = 0; i < this.cinemaInfo.length; i++) {
                if (this.cinemaInfo.cinemaName == this.cinemaInfo[i].cinemaName) {
                    this.oForm.cinemaCode = this.cinemaInfo[i].cinemaCode;
                }
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
