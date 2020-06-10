<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 自选套餐
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
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
                <el-input
                    placeholder="套餐名称"
                    v-model="query.comboName"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="上架状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="上架" value="1"></el-option>
                    <el-option key="2" label="下架" value="2"></el-option>
                </el-select>
                <el-button
                    style="margin-top: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="Search"
                >搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >添加</el-button>
            </div>
            <el-table
                :data="tableData"
                height="500"
                border
                class="table"
                ref="multipleTable"
                highlight-current-row
                header-cell-class-name="table-header"
            >
                <el-table-column prop="code" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="code" label="套餐名称">
                    <template slot-scope="scope">{{scope.row.comboName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="套餐图片">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width:400px" :src="scope.row.comboImage" />
                            <img
                                slot="reference"
                                :src="scope.row.comboImage"
                                :alt="scope.row.comboImage"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="套餐基础价格">
                    <template slot-scope="scope">{{scope.row.basePrice}}</template>
                </el-table-column>
                <el-table-column prop="sort" align="center" label="上架状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'">上架</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'">下架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="展示顺序">
                    <template slot-scope="scope">{{scope.row.showSeqNo}}</template>
                </el-table-column>
                <el-table-column label="操作" width="140" align="center" fixed="right">
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
        <el-dialog :close-on-click-modal="false" title="新增套餐" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="影院名称：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.cinemaName" placeholder="请选择" @change="getCinemaCode">
                        <el-option
                            v-for="info in cinemaInfo"
                            :key="info.cinemaCode"
                            :value="info.cinemaName"
                            :label="info.cinemaName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="套餐名称：" :label-width="formLabelWidth">
                    <el-input v-model="oForm.comboName" autocomplete="off" style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="套餐图片：" :label-width="formLabelWidth">
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
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸200*200或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="套餐：" :label-width="formLabelWidth">
                    <div v-for="(item, index) in comboList" style="margin-bottom: 5px" :key="index">
                        <span>{{item.name}}</span>
                        <span class="deleteGoodsItem" @click="deleteGoodsItem(index)">删除该商品</span>
                        <br />
                        <span class="addGoodsItem" @click="openNext(item.id)">点击添加</span>
                        <div v-for="(goodsItem, inx) in item.itemList" :key="inx">
                            <div>
                                <el-input
                                    v-model="goodsItem.name"
                                    autocomplete="off"
                                    :value="goodsItem.code"
                                    :disabled="true"
                                    style="width: 150px"
                                ></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                                数量：
                                <el-input
                                    v-model="goodsItem.count"
                                    autocomplete="off"
                                    :value="goodsItem.count"
                                    style="width: 100px"
                                    onkeyup="this.value=this.value.replace(/\D/g,'')"
                                    @input="changeInput($event, index, inx)"
                                ></el-input>浮动价格：
                                <el-input
                                    v-model="goodsItem.price"
                                    autocomplete="off"
                                    :value="goodsItem.price"
                                    style="width: 100px"
                                    onkeyup="this.value=this.value.replace(/[^0-9-.]+/,'')"
                                    @input="changeInput($event, index, inx)"
                                ></el-input>
                                <span
                                    style="color:red;cursor: pointer;"
                                    @click="deleteSell(index, inx)"
                                >删除</span>
                            </div>
                        </div>
                    </div>
                    <el-button type="primary" @click="addComboGoods">添加主商品</el-button>
                </el-form-item>
                <el-form-item :required="true" label="套餐基础价格：" :label-width="formLabelWidth">
                    <el-input
                        v-model="oForm.basePrice"
                        autocomplete="off"
                        style="width: 220px"
                        onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>
                    <span
                        style="font-size:16px;color:red;margin-left:10px"
                    >套餐实际价格 = 套餐基础价格 + 商品浮动价格</span>
                </el-form-item>
                <el-form-item label="展示顺序(越小越靠前)：" :label-width="formLabelWidth">
                    <el-input
                        v-model="oForm.showSeqNo"
                        autocomplete="off"
                        style="width: 220px"
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="套餐描述：" :label-width="formLabelWidth">
                    <el-input
                        v-model="oForm.comboDesc"
                        type="textarea"
                        show-word-limit
                        maxlength="200"
                        :rows="5"
                        style="width: 300px"
                    ></el-input>
                </el-form-item>
                <el-form-item label="卖品分类：" :label-width="formLabelWidth">
                    <el-select clearable v-model="oForm.typeCode" placeholder="请选择分类">
                        <el-option
                            v-for="item in selectValue"
                            :key="item.typeName"
                            :label="item.typeName"
                            :value="item.typeCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="上架状态：" :label-width="formLabelWidth">
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
        <el-dialog :close-on-click-modal="false" title="修改套餐" :visible.sync="editVisible">
            <el-form :model="updateForm">
                <el-form-item :required="true" label="影院名称：" :label-width="formLabelWidth">
                    <el-input
                        v-model="updateForm.cinemaName"
                        autocomplete="off"
                        :disabled="true"
                        style="width: 220px"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="套餐名称：" :label-width="formLabelWidth">
                    <el-input
                        v-model="updateForm.comboName"
                        autocomplete="off"
                        style="width: 220px"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="套餐图片：" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img :src="updateForm.comboImage" />
                        <img
                            slot="reference"
                            :src="updateForm.comboImage"
                            :alt="updateForm.comboImage"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        drag
                        action="/api/upload/uploadImage"
                        ref="download"
                        :limit="1"
                        :on-exceed="exceed"
                        :on-success="unSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div
                            class="el-upload__tip"
                            slot="tip"
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸200*200或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="套餐：" :label-width="formLabelWidth">
                    <div v-for="(item, index) in comboList" style="margin-bottom: 5px" :key="index">
                        <span>{{item.name}}</span>
                        <span class="deleteGoodsItem" @click="deleteGoodsItem(index)">删除该商品</span>
                        <br />
                        <span class="addGoodsItem" @click="openNext(item.id)">点击添加</span>
                        <div v-for="(goodsItem, inx) in item.itemList" :key="inx">
                            <div>
                                <el-input
                                    v-model="goodsItem.name"
                                    autocomplete="off"
                                    :value="goodsItem.code"
                                    :disabled="true"
                                    style="width: 150px"
                                ></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                                数量：
                                <el-input
                                    v-model="goodsItem.count"
                                    autocomplete="off"
                                    :value="goodsItem.count"
                                    style="width: 100px"
                                    onkeyup="this.value=this.value.replace(/\D/g,'')"
                                    @input="changeInput($event, index, inx)"
                                ></el-input>浮动价格：
                                <el-input
                                    v-model="goodsItem.price"
                                    autocomplete="off"
                                    :value="goodsItem.price"
                                    style="width: 100px"
                                    onkeyup="this.value=this.value.replace(/[^0-9-.]+/,'')"
                                    @input="changeInput($event, index, inx)"
                                ></el-input>
                                <span
                                    style="color:red;cursor: pointer;"
                                    @click="deleteSell(index, inx)"
                                >删除</span>
                            </div>
                        </div>
                    </div>
                    <el-button type="primary" @click="addComboGoods">添加主商品</el-button>
                </el-form-item>
                <el-form-item :required="true" label="套餐基础价格：" :label-width="formLabelWidth">
                    <el-input
                        v-model="updateForm.basePrice"
                        autocomplete="off"
                        style="width: 220px"
                        onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>
                    <span
                        style="font-size:16px;color:red;margin-left:10px"
                    >套餐实际价格 = 套餐基础价格 + 商品浮动价格</span>
                </el-form-item>
                <el-form-item label="展示顺序(越小越靠前)：" :label-width="formLabelWidth">
                    <el-input
                        v-model="updateForm.showSeqNo"
                        autocomplete="off"
                        style="width: 220px"
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="套餐描述：" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        show-word-limit
                        maxlength="200"
                        :rows="5"
                        style="width: 300px"
                        v-model="updateForm.comboDesc"
                    ></el-input>
                </el-form-item>
                <el-form-item label="卖品分类：" :label-width="formLabelWidth">
                    <el-select clearable v-model="updateForm.typeCode" placeholder="请选择分类">
                        <el-option
                            v-for="item in selectValue"
                            :key="item.typeName"
                            :label="item.typeName"
                            :value="item.typeCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="上架状态：" :label-width="formLabelWidth">
                    <el-select v-model="updateForm.status" placeholder="请选择">
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
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--选择卖品弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择卖品" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input
                        v-model="query.merchandiseName"
                        placeholder="卖品名称"
                        class="handle-input mr12"
                    ></el-input>
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
                    <el-table-column prop="sort" label="卖品名称">
                        <template slot-scope="scope">{{scope.row.merchandiseName}}</template>
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
            drawer: false,
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                aPageNo: 1,
                aPageSize: 15
            },
            options: [
                {
                    value: '1',
                    label: '上架'
                },
                {
                    value: '2',
                    label: '不上架'
                }
            ],
            type: {
                type: ''
            },
            status: [
                {
                    value: '1',
                    label: '上架'
                },
                {
                    value: '2',
                    label: '不上架'
                }
            ],
            cinemaInfo: [],
            cardList: [],
            selectValue: [], // 卖品分类
            form: [],
            tableData: [],
            multipleSelection: [],
            sellTableData: [], // 卖品table
            selectedSell: [], // 所选卖品
            sellIndex: -1, // 所选卖品index
            comboList: [
                // 卖品套餐
                {
                    name: '商品1',
                    id: 1,
                    itemList: []
                },
                {
                    name: '商品2',
                    id: 2,
                    itemList: []
                }
            ],
            comboItemId: 0, // 选择的套餐主商品id
            delList: [],
            couponList: [],
            couponInfo: [],
            fileList: [],
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            couponId: '',
            dialogFormVisible: false,
            oForm: {
                cinemaName: '',
                cinemaCode: '',
                comboName: '', // 套餐名称
                comboImage: '', // 套餐图片
                basePrice: '', // 套餐基础价格
                showSeqNo: '0', // 展示顺序
                status: '', // 启用状态
                comboDesc: '', // 套餐描述
                typeCode: '' // 套餐分类
            },
            updateForm: {
                cinemaCode: '',
                comboName: '', // 套餐名称
                comboImage: '', // 套餐图片
                basePrice: '', // 套餐基础价格
                showSeqNo: '0', // 展示顺序
                status: '', // 启用状态
                comboDesc: '', // 套餐描述
                id: '',
                typeCode: '' // 套餐分类
            },
            formLabelWidth: '160px',
            selectValue: {},
            selectCode: {},
            couponName: '',
            value: '',
            checkAll: false,
            isIndeterminate: true,
            adminFlag: 0, // 1:影管 2:门店
            syncCinemaList: [] // 可同步的影院列表
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
                .fetchPost('/ownMerchandiseSet/addPage', '')
                .then(data => {
                    this.cardList = [];
                    this.fileList = [];
                    this.comboList = [];
                    this.comboList.push({ name: '商品1', id: 1, itemList: [] }, { name: '商品2', id: 2, itemList: [] });
                    loading.close();
                    if (data.data.code == 'success') {
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
            if (!this.oForm.cinemaCode || this.oForm.cinemaCode == '') {
                this.message = '请选择影院！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.comboName || this.oForm.comboName == '') {
                this.message = '套餐名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.comboImage || this.oForm.comboImage == '') {
                this.message = '套餐图片不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.basePrice || this.oForm.basePrice <= 0) {
                this.message = '套餐基础价格必须大于0，请检查！';
                this.open();
                loading.close();
                return;
            }
            for (let i = 0; i < this.comboList.length; i++) {
                if (this.comboList[i].itemList.length == 0) {
                    this.message = '套餐内商品不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                for (let j = 0; j < this.comboList[i].itemList.length; j++) {
                    if (
                        !this.comboList[i].itemList[j].count ||
                        this.comboList[i].itemList[j].count == '' ||
                        this.comboList[i].itemList[j].count == 0
                    ) {
                        this.message = '套餐内卖品数量必须大于0，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.comboList[i].itemList[j].price === false || this.comboList[i].itemList[j].price === '') {
                        this.message = '套餐内浮动价格不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
            }
            if (!this.oForm.status) {
                this.message = '状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            var jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
            jsonArr.push({ key: 'comboName', value: this.oForm.comboName });
            jsonArr.push({ key: 'comboImage', value: this.oForm.comboImage });
            jsonArr.push({ key: 'basePrice', value: this.oForm.basePrice });
            jsonArr.push({ key: 'status', value: this.oForm.status });
            jsonArr.push({ key: 'showSeqNo', value: this.oForm.showSeqNo });
            jsonArr.push({ key: 'comboDesc', value: this.oForm.comboDesc });
            jsonArr.push({ key: 'typeCode', value: this.oForm.typeCode });
            let merSetDetailsJson = [];
            for (let i = 0; i < this.comboList.length; i++) {
                for (let j = 0; j < this.comboList[i].itemList.length; j++) {
                    merSetDetailsJson.push({
                        inCode: this.comboList[i].id,
                        merCode: this.comboList[i].itemList[j].code,
                        merNumber: this.comboList[i].itemList[j].count,
                        floatPrice: this.comboList[i].itemList[j].price
                    });
                }
            }
            jsonArr.push({ key: 'merSetDetailsJson', value: JSON.stringify(merSetDetailsJson) });
            console.log(jsonArr);
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/ownMerchandiseSet/add', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = false;
                        this.$message.success(`新增成功`);
                        this.getMenu();
                        this.oForm.cinemaCode = '';
                        this.oForm.cinemaName = '';
                        this.oForm.comboName = ''; // 套餐名称
                        this.oForm.comboImage = ''; // 套餐图片
                        this.oForm.basePrice = ''; // 套餐基础价格
                        this.oForm.showSeqNo = '0'; // 展示顺序
                        this.oForm.status = ''; // 启用状态
                        this.oForm.comboDesc = ''; // 套餐描述
                        this.oForm.typeCode = ''; // 卖品分类
                        this.comboList = [];
                        this.comboList.push({ name: '商品1', id: 1, itemList: [] }, { name: '商品2', id: 2, itemList: [] });
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
        delChange(index, row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
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
                    let jsonArr = [];
                    jsonArr.push({ key: 'id', value: row.id });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchDelete('/ownMerchandiseSet/delete', params)
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
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
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
                .fetchPost('/ownMerchandiseSet/updatePage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        this.editVisible = true;
                        this.updateForm.cinemaName = JSON.parse(Decrypt(data.data.data)).ownMerchandiseSet.cinemaName;
                        this.oForm.cinemaCode = JSON.parse(Decrypt(data.data.data)).ownMerchandiseSet.cinemaCode;
                        this.updateForm.comboName = JSON.parse(Decrypt(data.data.data)).ownMerchandiseSet.comboName;
                        this.updateForm.comboImage = JSON.parse(Decrypt(data.data.data)).ownMerchandiseSet.comboImage;
                        this.updateForm.basePrice = JSON.parse(Decrypt(data.data.data)).ownMerchandiseSet.basePrice;
                        this.updateForm.typeCode = JSON.parse(Decrypt(data.data.data)).ownMerchandiseSet.typeCode;
                        for (let i in this.status) {
                            //下拉框显示对应的选项
                            if (this.status[i].value == JSON.parse(Decrypt(data.data.data)).ownMerchandiseSet.status) {
                                this.updateForm.status = this.status[i].value;
                                break;
                            }
                        }
                        this.updateForm.showSeqNo = JSON.parse(Decrypt(data.data.data)).ownMerchandiseSet.showSeqNo;
                        this.updateForm.comboDesc = JSON.parse(Decrypt(data.data.data)).ownMerchandiseSet.comboDesc;
                        this.updateForm.id = JSON.parse(Decrypt(data.data.data)).ownMerchandiseSet.id;
                        let arr = JSON.parse(Decrypt(data.data.data)).merSetDetails;
                        let list = [];
                        let arr1 = [];
                        let arr2 = [];
                        let arr3 = [];
                        let arr4 = [];
                        let arr5 = [];
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].inCode == 1) {
                                arr1.push({
                                    name: arr[i].merName,
                                    code: arr[i].merCode,
                                    count: arr[i].merNumber,
                                    price: arr[i].floatPrice
                                });
                            }
                            if (arr[i].inCode == 2) {
                                arr2.push({
                                    name: arr[i].merName,
                                    code: arr[i].merCode,
                                    count: arr[i].merNumber,
                                    price: arr[i].floatPrice
                                });
                            }
                            if (arr[i].inCode == 3) {
                                arr3.push({
                                    name: arr[i].merName,
                                    code: arr[i].merCode,
                                    count: arr[i].merNumber,
                                    price: arr[i].floatPrice
                                });
                            }
                            if (arr[i].inCode == 4) {
                                arr4.push({
                                    name: arr[i].merName,
                                    code: arr[i].merCode,
                                    count: arr[i].merNumber,
                                    price: arr[i].floatPrice
                                });
                            }
                            if (arr[i].inCode == 5) {
                                arr5.push({
                                    name: arr[i].merName,
                                    code: arr[i].merCode,
                                    count: arr[i].merNumber,
                                    price: arr[i].floatPrice
                                });
                            }
                        }
                        if (arr1.length > 0) {
                            list.push({ name: '商品1', id: 1, itemList: arr1 });
                        }
                        if (arr2.length > 0) {
                            list.push({ name: '商品2', id: 2, itemList: arr2 });
                        }
                        if (arr3.length > 0) {
                            list.push({ name: '商品3', id: 3, itemList: arr3 });
                        }
                        if (arr4.length > 0) {
                            list.push({ name: '商品4', id: 4, itemList: arr4 });
                        }
                        if (arr5.length > 0) {
                            list.push({ name: '商品5', id: 5, itemList: arr5 });
                        }
                        this.comboList = list;
                        this.queryMerType();
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
            if (!this.oForm.cinemaCode || this.oForm.cinemaCode == '') {
                this.message = '请选择影院！';
                this.open();
                loading.close();
                return;
            }
            if (!this.updateForm.comboName || this.updateForm.comboName == '') {
                this.message = '套餐名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.updateForm.comboImage || this.updateForm.comboImage == '') {
                this.message = '套餐图片不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.updateForm.basePrice || this.updateForm.basePrice <= 0) {
                this.message = '套餐基础价格必须大于0，请检查！';
                this.open();
                loading.close();
                return;
            }
            for (let i = 0; i < this.comboList.length; i++) {
                if (this.comboList[i].itemList.length == 0) {
                    this.message = '套餐内商品不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                for (let j = 0; j < this.comboList[i].itemList.length; j++) {
                    if (
                        !this.comboList[i].itemList[j].count ||
                        this.comboList[i].itemList[j].count == '' ||
                        this.comboList[i].itemList[j].count == 0
                    ) {
                        this.message = '套餐内卖品数量必须大于0，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.comboList[i].itemList[j].price === false || this.comboList[i].itemList[j].price === '') {
                        this.message = '套餐内浮动价格不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
            }
            if (!this.updateForm.status) {
                this.message = '状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
            jsonArr.push({ key: 'comboName', value: this.updateForm.comboName });
            jsonArr.push({ key: 'comboImage', value: this.updateForm.comboImage });
            jsonArr.push({ key: 'basePrice', value: this.updateForm.basePrice });
            jsonArr.push({ key: 'status', value: this.updateForm.status });
            jsonArr.push({ key: 'showSeqNo', value: this.updateForm.showSeqNo });
            jsonArr.push({ key: 'comboDesc', value: this.updateForm.comboDesc });
            jsonArr.push({ key: 'typeCode', value: this.updateForm.typeCode });
            jsonArr.push({ key: 'id', value: this.updateForm.id });
            let merSetDetailsJson = [];
            for (let i = 0; i < this.comboList.length; i++) {
                for (let j = 0; j < this.comboList[i].itemList.length; j++) {
                    merSetDetailsJson.push({
                        inCode: this.comboList[i].id,
                        merCode: this.comboList[i].itemList[j].code,
                        merNumber: this.comboList[i].itemList[j].count,
                        floatPrice: this.comboList[i].itemList[j].price
                    });
                }
            }
            jsonArr.push({ key: 'merSetDetailsJson', value: JSON.stringify(merSetDetailsJson) });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/ownMerchandiseSet/update', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = false;
                        this.$message.success(`编辑成功`);
                        this.oForm.cinemaCode = '';
                        this.oForm.cinemaName = '';
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
        getCinemaCode(e) {
            //获取所选影院编码
            for (let i = 0; i < this.cinemaInfo.length; i++) {
                if (this.cinemaInfo[i].cinemaName == e) {
                    this.oForm.cinemaCode = this.cinemaInfo[i].cinemaCode;
                }
            }
            this.oForm.typeCode = '';
            this.queryMerType();
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
            let status = this.query.status;
            let comboName = this.query.comboName;
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!status) {
                status = '';
            }
            if (!comboName) {
                comboName = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            jsonArr.push({ key: 'comboName', value: comboName });
            jsonArr.push({ key: 'status', value: status });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/ownMerchandiseSet/page', params)
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
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
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
        handleSizeChange(val) {
            this.query.pageSize = val;
            this.getMenu();
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
        deletCoupon() {
            this.groupName = '';
            this.couponId = '';
        },
        // 搜索卖品
        SearchSell() {
            this.query.pageNo = 1;
            this.openNext(e);
        },
        // 所选卖品index
        getCurrentRow(index) {
            this.sellIndex = index;
        },
        // 确认卖品
        sureNext() {
            if (this.sellIndex >= 0) {
                // 选了数据
                let a = false;
                for (let i = 0; i < this.comboList.length; i++) {
                    for (let j = 0; j < this.comboList[i].itemList.length; j++) {
                        if (this.sellTableData[this.sellIndex].merchandiseCode == this.comboList[i].itemList[j].code) {
                            a = true;
                        }
                    }
                }
                if (a) {
                    this.message = '不能添加相同卖品！';
                    this.open();
                    return;
                } else {
                    this.comboList[this.comboItemId - 1].itemList.push({
                        name: this.sellTableData[this.sellIndex].merchandiseName,
                        code: this.sellTableData[this.sellIndex].merchandiseCode,
                        count: 1,
                        price: 0
                    });
                }
                this.drawer = false;
            }
        },
        // 查询卖品分类
        queryMerType() {
            if (!this.oForm.cinemaCode) {
                this.message = '请选择影院~';
                this.open();
                return;
            }
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/ownMerchandiseSet/queryMerType', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.selectValue = oData;
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
        one(a) {
            //获取卖品绑定的value值
            this.oForm.filmCode = a;
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
        openNext(e) {
            //获取商品列表
            // index = e - 1
            if (e) {
                if (this.comboList[e - 1].itemList.length > 5) {
                    this.message = '商品内最多六个卖品~';
                    this.open();
                    return;
                }
            }
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                if (e) {
                    this.comboItemId = e;
                }
                let jsonArr = [];
                let merchandiseName = this.query.merchandiseName;
                if (!merchandiseName) {
                    merchandiseName = '';
                }
                jsonArr.push({ key: 'merchandiseName', value: merchandiseName });
                jsonArr.push({ key: 'pageNo', value: this.query.aPageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.aPageSize });
                jsonArr.push({ key: 'merchandiseStatus', value: 1 });
                jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/merchandise/list', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.drawer = true;
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.query.merchandiseName = '';
                            this.sellTableData = oData.data;
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
            }, 500);
        },
        // 删除商品
        deleteGoodsItem(index) {
            if (this.comboList.length < 3) {
                this.message = '套餐内至少含有两个商品~';
                this.open();
                return;
            }
            this.comboList.splice(index, 1);
            for (let i = 0; i < this.comboList.length; i++) {
                this.comboList[i].name = '商品' + (i + 1);
                this.comboList[i].id = i + 1;
            }
        },
        // 删除所选卖品
        deleteSell(index, inx) {
            this.comboList[index].itemList.splice(inx, 1);
        },
        // 更改卖品数量
        changeInput(e, index, inx) {
            this.$forceUpdate();
        },
        //新增套餐选择卖品页面
        aHandleSizeChange(val) {
            this.query.aPageSize = val;
            this.openNext();
        },
        aCurrentChange(val) {
            //点击选择具体页数
            this.query.aPageNo = val;
            this.openNext();
        },
        aPrev() {
            //分页按钮上一页
            this.query.aPageNo--;
            this.openNext();
        },
        aNext() {
            //分页按钮下一页
            this.query.aPageNo++;
            this.openNext();
        },
        // 新增主商品
        addComboGoods() {
            if (this.comboList.length > 4) {
                this.message = '套餐内最多五个商品~';
                this.open();
                return;
            } else {
                this.comboList.push({ name: '商品' + (this.comboList.length + 1), id: this.comboList.length + 1, itemList: [] });
            }
        },
        exceed(data) {
            if (data.length == 1) {
                this.message = '只能上传一张图片，如需重新上传请删除第一张图！';
                this.open();
            }
        },
        beforeUpload(file) {
            //上传之前
            this.type.type = EncryptReplace('business');
            const isLt200Kb = file.size / 1024 < 200;
            if (!isLt200Kb) {
                this.message = '图片大小不能超过200kb！';
                this.open();
                return false;
            }
            return isLt200Kb;
        },
        onSuccess(data) {
            //上传文件 登录超时
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.upload.clearFiles();
                return;
            }
            this.oForm.comboImage = data.data;
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
.addGoodsItem {
    width: 20px;
    height: 20px;
    color: #409eff;
    cursor: pointer;
}

.deleteGoodsItem {
    width: 20px;
    height: 20px;
    color: red;
    cursor: pointer;
}
</style>

