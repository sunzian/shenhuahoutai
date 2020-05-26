<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 会员卡等级管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--影院信息展示页面-->
        <div class="container" v-if="showSell">
            <!--<div class="handle-box">-->
                <!--<el-select-->
                    <!--clearable-->
                    <!--v-model="query.cinemaCode"-->
                    <!--placeholder="请选择影院"-->
                    <!--class="handle-input mr10"-->
                <!--&gt;-->
                    <!--<el-option-->
                        <!--v-for="item in cinemaInfo"-->
                        <!--:key="item.cinemaCode"-->
                        <!--:label="item.cinemaName"-->
                        <!--:value="item.cinemaCode"-->
                    <!--&gt;</el-option>-->
                <!--</el-select>-->
                <!--<el-button style="margin-top: 10px;width: 90px;"  type="primary" icon="el-icon-search" @click="Search">搜索</el-button>-->
            <!--</div>-->
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="影院编码" width="120">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院名称" width="280">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="省份" width="120">
                    <template slot-scope="scope">{{scope.row.province}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="城市" width="120">
                    <template slot-scope="scope">{{scope.row.city}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="联系方式" width="150">
                    <template slot-scope="scope">{{scope.row.serviceMobile}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="详细地址">
                    <template slot-scope="scope">{{scope.row.address}}</template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-setting"
                                @click="UserPassword(scope.$index, scope.row)"
                        >获取卡等级</el-button>
                        <el-button type="text" icon="el-icon-view" @click="show(scope.row)">查看</el-button>
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
        <!--卡等级信息展示页面-->
        <div class="container" v-if="!showSell">
            <div class="handle-box">
                <el-input v-model="query.levelName" placeholder="会员卡名称" class="handle-input mr10"></el-input>
                <el-select
                        clearable
                        v-model="query.status"
                        placeholder="状态"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="正常" value="1"></el-option>
                    <el-option key="2" label="禁用" value="2"></el-option>
                </el-select>
                <el-button  style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                        type="primary"
                        @click="updatePrice"
                        style="float: right;margin-top: 10px"
                        icon="el-icon-circle-plus-outline"
                >刷新影城会员价</el-button>
                <el-button
                        type="primary"
                        @click="back"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px"
                >返回卡等级管理</el-button>
            </div>
            <el-table
                    :data="oTableData"
                    border
                    class="table"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="sort" label="适用影院类型"  align="center" width="110">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.applyType == 1" type="success">全部影院</el-tag>
                        <el-tag v-else-if="scope.row.applyType == 2" type="success">部分影院</el-tag>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="name" label="适用影院">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-tag type="success">{{scope.row.cinemaNames}}</el-tag>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="name" label="会员卡名称">
                    <template slot-scope="scope">{{scope.row.levelName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="会员卡图片" width="200px">
                    <template slot-scope="scope">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="hover">
                            <img style="width: 400px" :src="scope.row.cardPicture"/>
                            <img slot="reference" :src="scope.row.cardPicture" :alt="scope.row.cardPicture" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="开卡工本费">
                    <template slot-scope="scope">{{scope.row.cardCostFee}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="会员卡会费" width="150">
                    <template slot-scope="scope">{{scope.row.memberFee}}</template>
                </el-table-column>
                <el-table-column prop="name" label="默认卡号">
                    <template slot-scope="scope">{{scope.row.cardNo}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态"  align="center" width="150">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
                        <el-tag v-else-if="scope.row.status == 2" type="danger">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="success"
                                v-if="scope.row.status == 2"
                                @click="changeStatus(scope.$index, scope.row)"
                        >启用</el-button>
                        <el-button
                                type="success"
                                v-if="scope.row.status == 1"
                                @click="changeStatus(scope.$index, scope.row)"
                        >停用</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        @size-change="oHandleSizeChange"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="query.pageNo"
                        :page-sizes="[10, 15, 20, 30]"
                        :page-size="query.pageSize"
                        :total="query.totalCount"
                        @current-change="oCurrentChange"
                        @prev-click="oPrev"
                        @next-click="oNext"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="通用方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oCommonType" @change="selectCinema">
                        <el-radio :label="1">全部影院</el-radio>
                        <el-radio :label="2">指定影院</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="选择影院"
                        :label-width="formLabelWidth"
                        v-if="oCommonType == 2"
                >
                    <el-checkbox-group v-model="oMerchandiseCode" @change="selectGoods">
                        <el-checkbox
                                v-for="item in goodsInfo"
                                :label="item.merchandiseCode"
                                :key="item.merchandiseCode"
                                :value="item.merchandiseName"
                        >{{item.merchandiseName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="会员卡名称" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.name"
                            autocomplete="off"
                            :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会员卡图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oImage" />
                        <img
                                slot="reference"
                                :src="oImage"
                                :alt="oImage"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            drag
                            :limit="1"
                            :on-exceed="exceed"
                            ref="download"
                            action="/api/upload/uploadImage"
                            :on-success="unSuccess"
                            multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb 建议670*420</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="工本费" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.standardPrice"
                            autocomplete="off"
                            :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会费" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.settlePrice"
                            autocomplete="off"
                            :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="默认卡号" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.cardNo"
                            autocomplete="off"
                    ></el-input>
                    <br>
                    <span style="font-size:12px;">提供一张有效的并且卡类型相同的会员卡号（只用于查询会员价）</span>
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
                selectValue: [],
                goodsInfo: [],
                businessCode: '', // 商家编码
                showSell: true, //卖品信息页面是否展示开关
                type: {
                    type: ''
                },
                oName: '',
                oCommonType: '',
                oMerchandiseCode: [],
                selectGoodsCode: {},
                message: '', //弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 15
                },
                tableData: [],
                oTableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                checkedCities: [],
                oCheckedCities: [],
                cities: [], //增加页面影院
                oCities: [], //修改页面影院
                pageTotal: 0,
                form: {
                    memo: '',
                    sort: '',
                    id: '',
                },
                idx: -1,
                id: -1,
                oImage: '',
                dialogFormVisible: false,
                formLabelWidth: '120px',
                selectValue: {},
                options: [
                    {
                        value: '1',
                        label: '正常'
                    },
                    {
                        value: '2',
                        label: '禁用'
                    }
                ],
                value: '',
                restaurants: [],
                state: '',
                timeout: null,
                selectFilm: {},
                filmInfo: [],
                rowMess:'',
                cinemaInfo: []
            };
        },
        created() {
            this.showSell=true;
        },
        mounted() {
            this.getMenu();
            this.getAllCinema();
        },
        methods: {
            selectGoods(val) {
                // console.log(val)
                let selectValue = val.join(',');
                this.selectGoodsCode = selectValue;
                console.log(this.selectGoodsCode);
            },
            updatePrice() {
                if (!this.cinemaCode) {
                    this.message = '请选择影院！';
                    this.open();
                    return;
                }
                this.$confirm('该操作将花费较长时间, 是否继续?', '提示', {
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
                        jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/sessionInfo/updateMemberPrice', params)
                            .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.$message.success(`刷新成功`);
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
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
            },
            exceed(data){
                console.log(data);
                if(data.length==1){
                    this.message = '只能上传一张图片，如需重新上传请删除第一张图！';
                    this.open();
                }
            },
            // 修改状态
            changeStatus(index, row) {
                if(row.status==2){
                    this.rowMess='启用'
                }
                if(row.status==1){
                    this.rowMess='停用'
                }
                this.$confirm('是否确定'+this.rowMess+'此会员卡?', '提示', {
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
                        this.idx = index;
                        this.form = row;
                        var jsonArr = [];
                        let status;
                        if (row.status == 1) {
                            status = 2;
                        } else if (row.status == 2) {
                            status = 1;
                        }
                        jsonArr.push({ key: 'id', value: row.id });
                        jsonArr.push({ key: 'status', value: status });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        console.log(jsonArr);
                        let params = ParamsAppend(jsonArr);
                        https.fetchPost('/memberCardLevel/modifyCardStatus', params).then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.$message.success(`修改成功`);
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
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            },
            delChange(index, row) {
                //删除数据
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
                        setTimeout(() => {
                            this.idx = index;
                            this.form = row;
                            let jsonArr = [];
                            jsonArr.push({ key: 'id', value: row.id });
                            let sign = md5(preSign(jsonArr));
                            jsonArr.push({ key: 'sign', value: sign });
                            let params = ParamsAppend(jsonArr);
                            https
                                .fetchPost('goldCommodity/deleteById', params)
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
                        }, 500);
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
                setTimeout(() => {
                    this.idx = index;
                    this.form = row;
                    var jsonArr = [];
                    jsonArr.push({ key: 'id', value: row.id });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https.fetchPost('/memberCardLevel/modifyPage', params).then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                console.log(JSON.parse(Decrypt(data.data.data)));
                                this.editVisible = true;
                                this.oMerchandiseCode = [];
                                this.businessCode = JSON.parse(Decrypt(data.data.data)).businessCode;
                                if (JSON.parse(Decrypt(data.data.data)).applyType == 2) {
                                    if(JSON.parse(Decrypt(data.data.data)).cinemaCodes){
                                        this.oMerchandiseCode = JSON.parse(Decrypt(data.data.data)).cinemaCodes.split(",");
                                        this.selectGoodsCode= JSON.parse(Decrypt(data.data.data)).cinemaCodes.split(",");
                                    }
                                }
                                this.oCommonType = JSON.parse(Decrypt(data.data.data)).applyType;
                                this.form.name = JSON.parse(Decrypt(data.data.data)).levelName;
                                this.oImage = JSON.parse(Decrypt(data.data.data)).cardPicture;
                                this.form.standardPrice = JSON.parse(Decrypt(data.data.data)).cardCostFee;
                                this.form.settlePrice = JSON.parse(Decrypt(data.data.data)).memberFee;
                                this.form.cardNo = JSON.parse(Decrypt(data.data.data)).cardNo;
                            } else if (data.data.code == 'nologin') {
                                this.message = data.data.message;
                                this.open();
                                this.$router.push('/login');
                            } else {
                                this.message = data.data.message;
                                this.open();
                            }
                        }).then(() =>{
                            this.selectCinema();
                        })
                        .catch(err => {
                            loading.close();
                            console.log(err);
                        });
                }, 500);
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
                if (!this.oCommonType) {
                    this.message = '通用方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oCommonType == 2) {
                    var arr = Object.keys(this.selectGoodsCode);
                    if (!this.selectGoodsCode){
                        this.message = '所选影院不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                setTimeout(() => {
                    var jsonArr = [];
                    jsonArr.push({ key: 'id', value: this.form.id });
                    jsonArr.push({ key: 'cardPicture', value: this.oImage });
                    jsonArr.push({ key: 'applyType', value: this.oCommonType });
                    jsonArr.push({ key: 'cinemaCodes', value: this.selectGoodsCode });
                    jsonArr.push({ key: 'cardNo', value: this.form.cardNo });
                    jsonArr.push({ key: 'openRuleCode', value: '' });
                    jsonArr.push({ key: 'rechargeRuleCode', value: ''});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    console.log(jsonArr);
                    let params = ParamsAppend(jsonArr);
                    https.fetchPost('/memberCardLevel/modify', params).then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.editVisible = false;
                                this.$message.success(`编辑成功`);
                                this.$refs.download.clearFiles();//清除已上传文件
                                this.show();
                            } else if (data.data.code == 'nologin') {
                                this.message = data.data.message;
                                this.open();
                                this.$router.push('/login');
                            } else {
                                this.message = data.data.message;
                                this.form.cardNo='';
                                this.open();
                            }
                        })
                        .catch(err => {
                            loading.close();
                            console.log(err);
                        });
                }, 500);
            },
            Search() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let levelName = this.query.levelName;
                    let status = this.query.status;
                    if (!levelName) {
                        levelName = '';
                    }
                    if (!status) {
                        status = '';
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"levelName",value:levelName});
                    jsonArr.push({key:"status",value:status});
                    jsonArr.push({ key: 'pageNo', value: '1' });
                    jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                    jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/memberCardLevel/list', params).then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.oTableData = oData.data;
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
                            loading.close();
                            console.log(err);
                        });
                }, 500);
            },
            selectCinema(){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let levelName = this.query.levelName;
                    let status = this.query.status;
                    if (!levelName) {
                        levelName = '';
                    }
                    if (!status) {
                        status = '';
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"levelName",value:levelName});
                    jsonArr.push({key:"status",value:status});
                    jsonArr.push({key:"businessCode",value:this.businessCode});
                    jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                    jsonArr.push({ key: 'pageSize', value: 200 });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/cinema/myCinemaPage', params).then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            let goods = JSON.parse(Decrypt(data.data.data)).data;
                            this.goodsInfo = [];
                            for (let i = 0; i < goods.length; i++) {
                                let goodsList = {};
                                goodsList.merchandiseCode = goods[i].cinemaCode;
                                goodsList.merchandiseName = goods[i].cinemaName;
                                this.goodsInfo.push(goodsList);
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
                    let levelName = this.query.levelName;
                    let status = this.query.status;
                    if (!levelName) {
                        levelName = '';
                    }
                    if (!status) {
                        status = '';
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"levelName",value:levelName});
                    jsonArr.push({key:"status",value:status});
                    jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                    jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/cinema/myCinemaPage', params).then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                var oData = JSON.parse(Decrypt(data.data.data));
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
                            loading.close();
                            console.log(err);
                        });
                }, 500);
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
                                cinemaInfo.cinemaName = cinemas[i].cinemaName;
                                cinemaInfo.cinemaCode = cinemas[i].cinemaCode;
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
            refresh() {
                //刷新卖品页面
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let jsonArr = [];
                    jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                    jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                    jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/merchandise/list', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                var oData = JSON.parse(Decrypt(data.data.data));
                                this.oTableData = oData.data;
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
                            loading.close();
                            console.log(err);
                        });
                }, 500);
            },
            show(row) {
                //获取卡等级页面列表
                this.showSell = false;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    if(row&&row.cinemaCode){
                        this.cinemaCode = row.cinemaCode;
                    }
                    let jsonArr = [];
                    jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                    jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                    jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/memberCardLevel/list', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                var oData = JSON.parse(Decrypt(data.data.data));
                                console.log(oData);
                                // // console.log(this.query);
                                this.oTableData = oData.data;
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
                            loading.close();
                            console.log(err);
                        });
                }, 500);
            },
            UserPassword(index, row) {
                //获取卡等级
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    this.cinemaCode = row.cinemaCode;
                    let jsonArr = [];
                    jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/memberCardLevel/queryCardLevel', params)
                        .then(data => {
                            loading.close();
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
                            loading.close();
                            console.log(err);
                        });
                }, 500);
            },
            beforeUpload(file) {
                //上传之前
                this.type.type = EncryptReplace('card');
                const isLt200Kb = file.size / 1024 < 200;
                if (!isLt200Kb) {
                    this.message = '图片大小不能超过200kb！';
                    this.open();
                    return false
                }
                return isLt200Kb
            },
            unSuccess(data) {
                console.log(data);
                if (data.status == '-1') {
                    this.message=data.message;
                    this.open();
                    this.$refs.download.clearFiles();
                    return
                }
                this.oImage= data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            back() {
                this.showSell = true;
                this.getMenu();
            },
            open() {
                //信息提示弹出框
                this.$alert(this.message, '信息提示', {
                    dangerouslyUseHTMLString: true
                });
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
            oHandleSizeChange(val) {
                this.query.pageSize=val;
                this.show()
            },
            oCurrentChange(val) {
                //点击选择具体页数
                this.query.pageNo = val;
                this.show();
            },
            oPrev() {
                //分页按钮上一页
                this.query.pageNo--;
                this.show();
            },
            oNext() {
                //分页按钮下一页
                this.query.pageNo++;
                this.show();
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
