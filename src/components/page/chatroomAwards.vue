<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 放映厅礼物列表：
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" v-if="showSell">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="选择影院" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="影院编码">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="省份">
                    <template slot-scope="scope">{{scope.row.province}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="城市">
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
                        >查看礼物详情</el-button>
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
        <div class="container" v-if="!showSell">
            <div class="handle-box">
                <el-button
                    type="primary"
                    @click="back"
                    icon="el-icon-circle-plus-outline"
                    style="margin-left: 700px"
                >返回影院列表</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="margin-left: 25px"
                >新增奖品</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="影院">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column label="礼物图片">
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
                <el-table-column prop="memo" label="名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type=='1'">优惠券</el-tag>
                        <el-tag v-else-if="scope.row.type=='2'">实物</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="房间最大发送组数">
                    <template slot-scope="scope">{{scope.row.groupNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="每组数量">
                    <template slot-scope="scope">{{scope.row.singleNumber}}</template>
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
                <el-form-item label="礼品类型：" :label-width="formLabelWidth" prop="cinemaName">
                    <el-select v-model="oForm.type" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="礼品名称：" :label-width="formLabelWidth" prop="cinemaName">
                    <el-input style="width: 150px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="优惠券名称：" :label-width="formLabelWidth" v-if="oForm.type == 1">
                    <el-button type="primary" @click="getAllCoupon">选择优惠券</el-button>
                </el-form-item>
                <el-form-item label="所选优惠券：" :label-width="formLabelWidth" v-if="oForm.type == 1">
                    <el-input
                        style="width: 150px"
                        v-model="couponInfo.couponName"
                        autocomplete="off"
                        disabled
                    ></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                        v-if="couponInfo.couponName"
                        style="color:red;cursor: pointer;"
                        @click="deletCoupon"
                    >删除</span>
                </el-form-item>
                <el-form-item label="礼品图片" :label-width="formLabelWidth" v-if="oForm.type == 2">
                    <el-upload
                        class="upload-demo"
                        action="/api/upload/uploadImage"
                        :before-upload="beforeUpload"
                        :data="type"
                        :limit="1"
                        :on-success="onSuccess"
                        :file-list="fileList"
                        list-type="picture"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="每组发放数量：" :label-width="formLabelWidth" prop="number">
                    <el-input style="width: 150px" v-model="oForm.singleNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="发放组数：" :label-width="formLabelWidth" prop="number">
                    <el-input style="width: 150px" v-model="oForm.groupNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="领取后多少天过期：" :label-width="formLabelWidth" prop="number">
                    <el-input style="width: 150px" v-model="oForm.overDays" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否限制用户每月领取数量：" :label-width="formLabelWidth" prop="number">
                    <el-select v-model="oForm.limitStatus" placeholder="请选择">
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="用户单月领取张数限制："
                    :label-width="formLabelWidth"
                    prop="number"
                    v-if="oForm.limitStatus == 2"
                >
                    <el-input
                        style="width: 150px"
                        v-model="oForm.singleLimitNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="详情" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="影院名称：" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        v-model="oCinemaName"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="奖品名称：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oName" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="奖品类型：" :label-width="formLabelWidth">
                    <el-tag v-if="oType=='1'">优惠券</el-tag>
                    <el-tag v-if="oType=='2'">实物</el-tag>
                </el-form-item>
                <el-form-item label="礼物图片：" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width:400px" :src="oImageUrl" />
                        <img
                            slot="reference"
                            :src="oImageUrl"
                            :alt="oImageUrl"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                </el-form-item>
                <el-form-item label="发放组数：" :label-width="formLabelWidth">
                    <el-input style="width: 75px" v-model="oGroupNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="每组发放数量：" :label-width="formLabelWidth">
                    <el-input style="width: 75px" v-model="oSingleNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="领取后多少天过期：" :label-width="formLabelWidth">
                    <el-input style="width: 75px" v-model="oOverDays" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否限制用户每月领取数量：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oLimitStatus">
                        <el-radio :label="1">不限制</el-radio>
                        <el-radio :label="2">限制</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="用户单月领取张数限制："
                    :label-width="formLabelWidth"
                    v-if="oLimitStatus == 2"
                >
                    <el-input style="width: 75px" v-model="oSingleLimitNumber" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 选择优惠券弹出窗 -->
        <el-dialog title="选择优惠券" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="couponName" placeholder="优惠券名称" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="getAllCoupon">搜索</el-button>
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
                            <el-radio v-model="couponInfo.id" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="图片">
                        <template slot-scope="scope">
                            <el-popover placement="right" title trigger="hover">
                                <img style="width:400px" :src="scope.row.imgUrl" />
                                <img
                                    slot="reference"
                                    :src="scope.row.imgUrl"
                                    :alt="scope.row.imgUrl"
                                    style="max-height: 50px;max-width: 130px"
                                />
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠券类型" width="150">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.couponType=='1'">影票优惠券</el-tag>
                            <el-tag v-else-if="scope.row.couponType=='2'">卖品优惠券</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠券名称" width="150">
                        <template slot-scope="scope">{{scope.row.name}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠券说明" width="150">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.reduceType=='1'">{{scope.row.discountMoney}}元兑换卷</el-tag>
                            <el-tag
                                v-else-if="scope.row.reduceType=='2'"
                            >满{{scope.row.achieveMoney}}元减{{scope.row.discountMoney}}元</el-tag>
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button type="primary" @click="sureNext(id)">确 定</el-button>
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
            oOverDays: '',
            oImageUrl: '',
            oType: '',
            oName: '',
            oSingleNumber: '',
            oGroupNumber: '',
            oId: '',
            oLimitStatus: '',
            oSingleLimitNumber: '',
            drawer: false,
            showSell:true,//卖品信息页面是否展示开关
            type: {
                type: ''
            },
            fileList: [],
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 10
            },
            restaurants: [],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            id: '',
            dialogFormVisible: false,
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
                cinemaName: '',
                cinemaCode: '',
                image_url: '',
                singleNumber: '',
                overDays: '',
                limitStatus: '',
                groupNumber: '',
                singleLimitNumber: '',
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
            couponName: ''
        };
    },
    created() {
        this.showSell=true
    },
    mounted() {
        this.getMenu();
    },
    methods: {
        addPage() {
            this.dialogFormVisible = true;
            this.oForm.name = '';
            this.oForm.cinemaCode = '';
            this.oForm.image_url = '';
            this.oForm.singleNumber = '';
            this.oForm.overDays = '';
            this.cinemaInfo = [];
            this.fileList = [];
            this.oForm.type = '';
            this.oForm.limitStatus = '';
            this.oForm.groupNumber = '';
            this.oForm.singleLimitNumber = '';
            this.oForm.type = '';
            this.getAllCinema();
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
            if (this.oForm.limitStatus == 2) {
                jsonArr.push({ key: 'monthLimitNumber', value: this.oForm.singleLimitNumber });
            }
            // 选择实物奖品
            if (this.oForm.type == 2) {
                jsonArr.push({ key: 'imageUrl', value: this.oForm.image_url });
            }
            if (this.oForm.type == 1) {
                jsonArr.push({ key: 'imageUrl', value: this.couponInfo.imgUrl });
                jsonArr.push({ key: 'couponId', value: this.couponInfo.id });
            }
            jsonArr.push({ key: 'name', value: this.oForm.name });
            jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
            jsonArr.push({ key: 'singleNumber', value: this.oForm.singleNumber });
            jsonArr.push({ key: 'overDays', value: this.oForm.overDays });
            jsonArr.push({ key: 'groupNumber', value: this.oForm.groupNumber });
            jsonArr.push({ key: 'limitStatus', value: this.oForm.limitStatus });
            jsonArr.push({ key: 'type', value: this.oForm.type });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('chatroomAwards/addAwards', params)
                    .then(data => {
                        loading.close();
                        //新增
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.show(this.cinemaCode);
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
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
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
                        .fetchPost('chatroomAwards/deleteAwards', params)
                        .then(data => {
                            if (data.data.code == 'success') {
                                this.$message.error(`删除了`);
                                this.show(this.cinemaCode);
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
        addChange(index, row){//是否修改权限
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
                jsonArr.push({key:"id",value:row.id});
                let sign =md5(preSign(jsonArr));
                jsonArr.push({key:"sign",value:sign});
                let params = ParamsAppend(jsonArr);
                https.fetchPost('chatroomAwards/updateAwardsPage',params).then((data) => {
                    loading.close();
                    console.log(data);
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if(data.data.code=='success'){
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).cinemaName;
                        this.oName = JSON.parse(Decrypt(data.data.data)).name;
                        this.oSingleNumber = JSON.parse(Decrypt(data.data.data)).singleNumber;
                        this.oGroupNumber = JSON.parse(Decrypt(data.data.data)).groupNumber;
                        this.oType = JSON.parse(Decrypt(data.data.data)).type;
                        this.oImageUrl = JSON.parse(Decrypt(data.data.data)).imageUrl;
                        this.oOverDays = JSON.parse(Decrypt(data.data.data)).overDays;
                        this.oLimitStatus = JSON.parse(Decrypt(data.data.data)).limitStatus;
                        this.oId = JSON.parse(Decrypt(data.data.data)).id;
                        this.oSingleLimitNumber = JSON.parse(Decrypt(data.data.data)).monthLimitNumber;
                        this.editVisible = true;
                    }else if(data.data.code=='nologin'){
                        this.message=data.data.message
                        this.open()
                        this.$router.push('/login');
                    }else{
                        this.message=data.data.message
                        this.open()
                    }
                }).catch(err=>{
                    loading.close();
                    console.log(err)
                    }
                )
            },
        show(row) {
            this.showSell=false
            //是否拥有权限
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if (row.cinemaCode) {
                this.cinemaCode = row.cinemaCode
            }
            var jsonArr = [];
            jsonArr.push({key:"pageNo",value:this.query.pageNo});
            jsonArr.push({key:"pageSize",value:this.query.pageSize});
            jsonArr.push({key:"cinemaCode",value:this.cinemaCode});
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/chatroomAwards/awardsPage', params)
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
            var jsonArr = [];
            if(this.oLimitStatus == 2) {
                jsonArr.push({ key: 'monthLimitNumber', value: this.oSingleLimitNumber });
            }
            jsonArr.push({ key: 'singleNumber', value: this.oSingleNumber });
            jsonArr.push({ key: 'groupNumber', value: this.oGroupNumber });
            jsonArr.push({ key: 'overDays', value: this.oOverDays });
            jsonArr.push({ key: 'limitStatus', value: this.oLimitStatus });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            this.editVisible = false;
            https
                .fetchPost('chatroomAwards/updateAwards', params)
                .then(data => {
                    loading.close();
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.$message.success(`编辑成功`);
                        this.show(this.cinemaCode);
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
        },
        back() {
            this.showSell=true
            this.getMenu();
        },
        open() {
            //错误信息弹出框
            this.$alert(this.message, '错误信息', {
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
            jsonArr.push({ key: 'simpleType', value: 1 });
            jsonArr.push({ key: 'name', value: name });
            // jsonArr.push({ key: 'endDate', value: today });
            jsonArr.push({ key: 'status', value: 1 });
            jsonArr.push({ key: 'cinemaCodes', value: this.cinemaCode });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('merchandiseCoupon/merchandiseCouponPage', params)
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
                        this.query.pageSize = oData.pageResult.pageSize;
                        this.query.pageNo = oData.pageResult.pageNo;
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
        deletCoupon() {
            this.couponInfo = {};
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
