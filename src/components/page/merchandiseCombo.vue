<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 购票推荐卖品设置
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
                <el-table-column label="操作" width="160" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="show(scope.row)">编辑</el-button>
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
        <!--卖品套餐展示页面-->
        <div class="container" v-if="!showSell">
            <div class="handle-box">
                <el-input v-model="query.comboName" placeholder="套餐名字" class="handle-input mr10"></el-input>
                <el-select clearable v-model="query.comboType" placeholder="套餐类型" class="handle-select mr10">
                    <el-option key="1" label="单人套餐" value="1"></el-option>
                    <el-option key="2" label="双人套餐" value="2"></el-option>
                    <el-option key="3" label="多人套餐" value="3"></el-option>
                </el-select>
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="上架" value="1"></el-option>
                    <el-option key="2" label="下架" value="2"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
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
                >新增套餐</el-button>
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
                <el-table-column prop="name" label="图片">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width:400px" :src="scope.row.imageUrl" />
                            <img
                                slot="reference"
                                :src="scope.row.imageUrl"
                                :alt="scope.row.imageUrl"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="套餐名字">
                    <template slot-scope="scope">{{scope.row.comboName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="套餐价格">
                    <template slot-scope="scope">{{scope.row.originalPrice}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="展示顺序">
                    <template slot-scope="scope">{{scope.row.showSeqNo}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="套餐类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.comboType=='1'">单人套餐</el-tag>
                        <el-tag v-else-if="scope.row.comboType=='2'">双人套餐</el-tag>
                        <el-tag v-else-if="scope.row.comboType=='3'">多人套餐</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'">上架</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">下架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center" fixed="right">
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
        <!--新增弹出框-->
        <el-dialog :close-on-click-modal="false" title="新增套餐" :visible.sync="dialogFormVisible">
            <el-form v-model="oForm">
                <el-form-item :required="true" label="套餐名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.comboName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="套餐图片" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            action="/api/upload/uploadImage"
                            :before-upload="beforeUpload"
                            :data="type"
                            :limit="1"
                            :on-exceed="exceed"
                            ref="download"
                            :on-success="onSuccess"
                            :file-list="fileList"
                            list-type="picture"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div
                                slot="tip"
                                class="el-upload__tip"
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸300*240或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="选择商品" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                    label="所选商品"
                    :label-width="formLabelWidth"
                    v-if="selectedSell.length>0"
                    :required="true"
                >
                    <div v-for="(item, index) in selectedSell" style="margin-bottom: 5px" :key="index">
                        <el-input
                            style="width: 250px"
                            v-model="item.merchandiseName"
                            autocomplete="off"
                            :value="item.merchandiseCode"
                            :disabled="true"
                            :change="one(item.merchandiseCode)"
                        ></el-input>
                        <span style="color:red;cursor: pointer;" @click="deleteSell()">删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.showSeqNo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="套餐价格" :label-width="formLabelWidth">
                    <el-input :disabled="true" style="width: 250px" v-model="oForm.originalPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="套餐类型" :label-width="formLabelWidth">
                    <el-select v-model="oForm.comboType" placeholder="请选择套餐类型">
                        <el-option
                            v-for="item in showTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="套餐状态" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择套餐状态">
                        <el-option
                            v-for="item in showStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
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
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="套餐名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.comboName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="套餐图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oImageUrl" />
                        <img
                            slot="reference"
                            :src="oImageUrl"
                            :alt="oImageUrl"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        ref="download"
                        drag
                        :limit="1"
                        :on-exceed="exceed"
                        action="/api/upload/uploadImage"
                        :on-success="unSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb 建议尺寸300*240或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="选择商品" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                    label="所选商品"
                    :label-width="formLabelWidth"
                    v-if="selectedSell.length>0"
                    :required="true"
                >
                    <div v-for="(item, index) in selectedSell" style="margin-bottom: 5px" :key="index">
                        <el-input
                            style="width: 250px"
                            v-model="item.merchandiseName"
                            autocomplete="off"
                            :value="item.merchandiseCode"
                            :disabled="true"
                            :change="one(item.merchandiseCode)"
                        ></el-input>
                        <span style="color:red;cursor: pointer;" @click="deleteSell()">删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.showSeqNo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="套餐价格" :label-width="formLabelWidth">
                    <el-input :disabled="true" style="width: 250px" v-model="form.originalPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="套餐类型" :label-width="formLabelWidth">
                    <el-select v-model="form.comboType" placeholder="请选择套餐类型">
                        <el-option
                            v-for="item in showTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="套餐状态" :label-width="formLabelWidth">
                    <el-select v-model="form.status" placeholder="请选择套餐状态">
                        <el-option
                            v-for="item in showStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增抽屉弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择卖品" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.merchandiseName" placeholder="卖品名称" class="handle-input mr12"></el-input>
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
                            <el-radio
                                    v-model="id"
                                    :label="scope.$index"
                                    @change.native="getCurrentRow(scope.$index)"
                            >&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="图片">
                        <template slot-scope="scope">
                            <el-popover placement="right" title trigger="hover">
                                <img style="width:400px" :src="scope.row.merchandisePic" />
                                <img
                                        slot="reference"
                                        :src="scope.row.merchandisePic"
                                        :alt="scope.row.merchandisePic"
                                        style="max-height: 50px;max-width: 130px"
                                />
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="卖品名称" width="150">
                        <template slot-scope="scope">{{scope.row.merchandiseName}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="卖品价格" width="150">
                        <template slot-scope="scope">{{scope.row.standardPrice}}</template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            @size-change="aHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.pageNo"
                            :page-sizes="[10, 15, 20, 30]"
                            :page-size="query.pageSize"
                            :total="query.totalCount"
                            @current-change="aCurrentChange"
                            @prev-click="aPrev"
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
            sellIndex: '', //被选中的index值
            selectedSell: [], //被选中商品
            fileList: [],
            drawer: false, //新增抽屉弹出框
            showSell: true, //卖品信息页面是否展示开关
            type: {
                type: ''
            },
            oName: '',
            message: '', //弹出框消息
            query: {
                merchandiseName:'',
                pageNo: 1,
                pageSize: 15
            },
            oForm: {
                name: '',
                memo: '',
                sort: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
                value: '1',
                merchandiseCode: '',
            },
            tableData: [],
            oTableData: [],
            sellTableData: [],
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
                id: ''
            },
            idx: -1,
            id: -1,
            oCinemaCode:'',
            dialogFormVisible: false,
            formLabelWidth: '120px',
            selectValue: {},
            showTypes: [
                {
                    value: '1',
                    label: '单人套餐'
                },
                {
                    value: '2',
                    label: '双人套餐'
                },
                {
                    value: '3',
                    label: '多人套餐'
                }
            ],
            showStatus: [
                {
                    value: '1',
                    label: '上架'
                },
                {
                    value: '2',
                    label: '下架'
                }
            ],
            value: '',
            restaurants: [],
            state: '',
            oImageUrl: '',
            timeout: null,
            selectFilm: {},
            filmInfo: [],
            cinemaInfo: []
        };
    },
    created() {
        this.showSell = true;
        this.selectedSell = [];
    },
    mounted() {
        this.getMenu();
        this.getAllCinema();
    },
    methods: {
        exceed(data){
            console.log(data);
            if(data.length==1){
                this.message = '只能上传一张图片，如需重新上传请删除第一张图！';
                this.open();
            }
        },
        deleteSell(index) {
            this.selectedSell.splice(index, 1);
            this.oForm.originalPrice=''
        },
        getCurrentRow(index) {
            this.sellIndex = index;
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
            setTimeout(() => {
                https
                    .fetchPost('/merchandiseCombo/addPage', '')
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.selectedSell = [];
                            this.fileList = [];
                            this.oForm.image_url = '';
                            if (this.$refs.upload) {
                                this.$refs.upload.clearFiles();
                            }
                            this.oForm = [];
                            this.dialogFormVisible = true;
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
        addRole() {
            //新增按钮操作
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if(!this.oForm.comboName){
                this.message = '套餐名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.oForm.image_url){
                this.message = '套餐图片不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.selectedSell.length==0){
                this.message = '所选商品不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.oForm.comboType){
                this.message = '套餐类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.oForm.status){
                this.message = '套餐状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            setTimeout(() => {
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                jsonArr.push({ key: 'comboName', value: this.oForm.comboName });
                jsonArr.push({ key: 'imageUrl', value: this.oForm.image_url });
                jsonArr.push({ key: 'showSeqNo', value: this.oForm.showSeqNo });
                jsonArr.push({ key: 'comboType', value: this.oForm.comboType });
                jsonArr.push({ key: 'merchandiseSet', value: this.oForm.merchandiseCode });
                jsonArr.push({ key: 'originalPrice', value: this.oForm.originalPrice });
                jsonArr.push({ key: 'status', value: this.oForm.status });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/merchandiseCombo/addMerchandiseCombo', params)
                        .then(data => {
                            loading.close();
                            //新增
                            if (data.data.code == 'success') {
                                this.dialogFormVisible = false;
                                this.$message.success(`新增成功`);
                                this.$refs.upload.clearFiles();
                                this.oForm.name = '';
                                this.oForm.value = '';
                                this.oForm.memo = '';
                                this.refresh();
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
            }, 500);
        },
        one(a) {
            //获取卖品绑定的value值
            this.oForm.merchandiseCode = a;
        },
        sureNext() {
            if (this.sellIndex >= 0) {
                this.selectedSell = [];
                this.selectedSell.push(this.sellTableData[this.sellIndex]);
            }
            this.oForm.originalPrice=this.sellTableData[this.sellIndex].settlePrice;
            console.log(this.selectedSell);
            this.drawer = false;
        },
        openNext() {     //获取商品列表
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let merchandiseName = this.query.merchandiseName;
                if (!merchandiseName) {
                    merchandiseName = '';
                }
                let jsonArr = [];
                jsonArr.push({key:"merchandiseName",value:merchandiseName});
                jsonArr.push({key:"cinemaCode",value:this.oCinemaCode});
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/merchandise/list', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.drawer = true;
                            this.query.merchandiseName='';
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.sellTableData = oData.data;
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
                            .fetchPost('/merchandiseCombo/deleteMerchandiseCombo', params)
                            .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.$message.error(`删除了`);
                                    this.refresh();
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
                }) .catch(() => {
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
                https
                    .fetchPost('/merchandiseCombo/modifyPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.selectedSell=[];
                            this.oForm.merchandiseCode=(JSON.parse(Decrypt(data.data.data))).merchandiseSet;
                            let json ={
                                merchandiseName:(JSON.parse(Decrypt(data.data.data))).merchandiseName,
                                merchandiseCode:(JSON.parse(Decrypt(data.data.data))).merchandiseSet
                            };
                            if (this.$refs.download){
                                this.$refs.download.clearFiles();
                            }
                            this.editVisible = true;
                            // this.form.typeName=JSON.parse(Decrypt(data.data.data)).typeName;
                            this.oImageUrl=JSON.parse(Decrypt(data.data.data)).imageUrl;
                            // this.form.showSeqNo=JSON.parse(Decrypt(data.data.data)).showSeqNo;
                            //套餐类型下拉选显示对应的选项
                            for (let x in this.showTypes) {
                                if (this.showTypes[x].value == JSON.parse(Decrypt(data.data.data)).comboType) {
                                    this.form.comboType = this.showTypes[x].value;
                                    break;
                                }
                            }
                            //套餐状态下拉选显示对应的选项
                            for (let x in this.showStatus) {
                                if (this.showStatus[x].value == JSON.parse(Decrypt(data.data.data)).status) {
                                    this.form.status = this.showStatus[x].value;
                                    break;
                                }
                            }
                            if(this.selectedSell[0]){
                                return
                            }
                            this.selectedSell.push(json);
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
        // 编辑操作
        exChanger() {
            console.log(this.selectedSell);
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if(!this.form.comboName){
                this.message = '套餐名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.oImageUrl){
                this.message = '套餐图片不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.selectedSell.length==0){
                this.message = '所选商品不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.form.comboType){
                this.message = '套餐类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.form.status){
                this.message = '套餐状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            setTimeout(() => {
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: this.form.id });
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                jsonArr.push({ key: 'comboName', value: this.form.comboName });
                jsonArr.push({ key: 'imageUrl', value: this.oImageUrl });
                jsonArr.push({ key: 'showSeqNo', value: this.form.showSeqNo });
                jsonArr.push({ key: 'comboType', value: this.form.comboType });
                jsonArr.push({ key: 'merchandiseSet', value: this.selectedSell[0].merchandiseCode });
                jsonArr.push({ key: 'originalPrice', value: this.form.originalPrice });
                jsonArr.push({ key: 'status', value: this.form.status });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                console.log(jsonArr);
                https
                    .fetchPost('/merchandiseCombo/modifyMerchandiseCombo', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.editVisible = false;
                            this.selectedSell = [];
                            this.$message.success(`编辑成功`);
                            this.$refs.download.clearFiles();
                            this.refresh();
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
        Search() {
            this.query.pageNo = 1;
            this.refresh();
        },
        back() {
            this.showSell = true;
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
            setTimeout(() => {
                let jsonArr = [];
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/cinema/myCinemaPage', params)
                    .then(data => {
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
                let comboName = this.query.comboName;
                let status = this.query.status;
                let comboType = this.query.comboType;
                if (!comboName) {
                    comboName = '';
                }
                if (!status) {
                    status = '';
                }
                if (!comboType) {
                    comboType = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'comboName', value: comboName});
                jsonArr.push({ key: 'status', value: status});
                jsonArr.push({ key: 'comboType', value: comboType});
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/merchandiseCombo/list', params)
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
            //获取卖品套餐页面列表
            this.oCinemaCode=row.cinemaCode;
            this.showSell = false;
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                this.cinemaCode = row.cinemaCode;
                let comboName = this.query.comboName;
                if (!comboName) {
                    comboName = '';
                }
                let jsonArr = [];
                jsonArr.push({key:"comboName",value:comboName});
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/merchandiseCombo/list', params)
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
        beforeUpload(file) {
            //上传之前
            this.type.type = EncryptReplace('business');
            const isLt200Kb = file.size / 1024 < 200;
            if (!isLt200Kb) {
                this.message = '图片大小不能超过200kb！';
                this.open();
                return false
            }
            return isLt200Kb
        },
        onSuccess(data) {
            //上传文件 登录超时
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.upload.clearFiles();
                return;
            }
            this.oForm.image_url = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        unSuccess(data) {
            //修改上传文件 登录超时
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.download.clearFiles();
                return;
            }
            this.oImageUrl = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
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
        //影院页面
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
        //卖品页面
        oHandleSizeChange(val) {
            this.query.pageSize=val;
            this.refresh()
        },
        oCurrentChange(val) {
            //点击选择具体页数
            this.query.pageNo = val;
            this.refresh();
        },
        oPrev() {
            //分页按钮上一页
            this.query.pageNo--;
            this.refresh();
        },
        oNext() {
            //分页按钮下一页
            this.query.pageNo++;
            this.refresh();
        },
        //新增套餐选择卖品页面
        aHandleSizeChange(val) {
            this.query.pageSize=val;
            this.openNext()
        },
        aCurrentChange(val) {
            //点击选择具体页数
            this.query.pageNo = val;
            this.openNext();
        },
        aPrev() {
            //分页按钮上一页
            this.query.pageNo--;
            this.openNext();
        },
        aNext() {
            //分页按钮下一页
            this.query.pageNo++;
            this.openNext();
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
    .mr12 {
        width: 30%;
        margin-right: 10px;
    }
</style>

