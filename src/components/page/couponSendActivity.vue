<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 送券活动管理
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
                <el-table-column prop="code" label="活动名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="code" label="送券活动类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type=='1'"
                        >注册送券</el-tag>
                        <!--<el-tag v-else-if="scope.row.type=='2'"-->
                        <!--&gt;活动抢券</el-tag>-->
                        <!--<el-tag v-else-if="scope.row.type=='3'"-->
                        <!--&gt;生日送券</el-tag>-->
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="活动开始时间">
                    <template slot-scope="scope">{{scope.row.startDate}}</template>
                </el-table-column>
                <el-table-column prop="name" label="活动结束时间">
                    <template slot-scope="scope">{{scope.row.endDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="开启状态" >
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='0'"
                        >未启用</el-tag>
                        <el-tag v-else-if="scope.row.status=='1'"
                        >启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="是否限制总数">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isLimitTotal=='0'"
                        >不限制</el-tag>
                        <el-tag v-else-if="scope.row.isLimitTotal=='1'"
                        >限制</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="限购总数">
                    <template slot-scope="scope">{{scope.row.totalNumber}}</template>
                </el-table-column>
                <el-table-column prop="number" label="剩余总数">
                    <template slot-scope="scope">{{scope.row.totalSurplus}}</template>
                </el-table-column>
                <el-table-column prop="booleans" label="活动描述">
                    <template slot-scope="scope">{{scope.row.activityDesc}}</template>
                </el-table-column>
                <el-table-column prop="booleans" label="领取后多少天失效">
                    <template slot-scope="scope">{{scope.row.validDay}}</template>
                </el-table-column>
                <el-table-column prop="booleans" label="券包名称">
                    <template slot-scope="scope">{{scope.row.couponGroupName}}</template>
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
        <el-dialog title="设置活动" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="活动名称：" :label-width="formLabelWidth">
                    <el-input style="width: 250px" min="1" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动图片：" :label-width="formLabelWidth">
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="imgType"
                            ref="download"
                            class="upload-demo"
                            drag
                            action="/api/upload/uploadImage"
                            :on-success="unSuccess"
                            multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="选择影院：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.cinemaCode" placeholder="请选择" @change="getCardInfo">
                        <el-option
                                v-for="info in cinemaList"
                                :key="info.cinemaCode"
                                :value="info.cinemaCode"
                                :label="info.cinemaName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="送券活动类型：" :label-width="formLabelWidth">-->
                    <!--<el-select v-model="oForm.type" placeholder="请选择" @change="getCardInfo">-->
                        <!--<el-option-->
                                <!--v-for="info in type"-->
                                <!--:key="info.value"-->
                                <!--:value="info.value"-->
                                <!--:label="info.label"-->
                        <!--&gt;</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="活动开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oForm.startDate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oForm.endDate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开启状态：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否限制总数：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.isLimitTotal">
                        <el-radio label="0">不限制</el-radio>
                        <el-radio label="1">限制</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="oForm.isLimitTotal==1" label="限购总数：" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            min="1"
                            v-model="oForm.totalNumber"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="活动描述：" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            min="1"
                            v-model="oForm.activityDesc"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="领取后多少天失效：" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            min="1"
                            v-model="oForm.validDay"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="设置券包："
                        :label-width="formLabelWidth">
                    <el-button type="primary" @click="getAllCoupon">选择券包</el-button>
                </el-form-item>
                <el-form-item
                        v-if="couponId"
                        label="所选券包："
                        :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="groupName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                            v-if="groupName"
                            style="color:red;cursor: pointer;"
                            @click="deletCoupon"
                    >删除</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="价格设置" :visible.sync="editVisible">
            <el-form :model="form">
            <el-form-item label="活动名称：" :label-width="formLabelWidth">
                <el-input style="width: 250px" min="1" v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
                <el-form-item label="活动图片：" :label-width="formLabelWidth">
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="imgType"
                            ref="download"
                            class="upload-demo"
                            drag
                            action="/api/upload/uploadImage"
                            :on-success="unSuccess"
                            multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            <el-form-item label="选择影院：" :label-width="formLabelWidth">
                <el-select v-model="form.cinemaCode" placeholder="请选择" @change="getCardInfo">
                    <el-option
                            v-for="info in cinemaList"
                            :key="info.cinemaCode"
                            :value="info.cinemaCode"
                            :label="info.cinemaName"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="送券活动类型：" :label-width="formLabelWidth">
                <el-select v-model="form.type" placeholder="请选择" @change="getCardInfo">
                    <el-option
                            v-for="info in type"
                            :key="info.value"
                            :value="info.value"
                            :label="info.label"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动开始时间" :label-width="formLabelWidth">
                <el-date-picker
                        v-model="form.startDate"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="活动结束时间" :label-width="formLabelWidth">
                <el-date-picker
                        v-model="form.endDate"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="开启状态：" :label-width="formLabelWidth">
                <el-select v-model="form.status" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否限制总数：" :label-width="formLabelWidth">
                <el-radio-group v-model="form.isLimitTotal">
                    <el-radio label="0">不限制</el-radio>
                    <el-radio label="1">限制</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.isLimitTotal==1" label="限购总数：" :label-width="formLabelWidth">
                <el-input
                        style="width: 250px"
                        min="1"
                        v-model="form.totalNumber"
                        autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="活动描述：" :label-width="formLabelWidth">
                <el-input
                        style="width: 250px"
                        min="1"
                        v-model="form.activityDesc"
                        autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="领取后多少天失效：" :label-width="formLabelWidth">
                <el-input
                        style="width: 250px"
                        min="1"
                        v-model="form.validDay"
                        autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                    label="设置券包："
                    :label-width="formLabelWidth">
                <el-button type="primary" @click="changeCoupon">选择券包</el-button>
            </el-form-item>
            <el-form-item
                    v-if="couponId"
                    label="所选券包："
                    :label-width="formLabelWidth">
                <el-input style="width: 150px" v-model="groupName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                <span
                        v-if="groupName"
                        style="color:red;cursor: pointer;"
                        @click="deletCoupon"
                >删除</span>
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
                    <el-input v-model="couponName" placeholder="券包名称" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="getAllCoupon">搜索</el-button>
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
                <el-button type="primary" @click="sureNext(couponId)">确 定</el-button>
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
                oActivityImageUrl:'',
                imgType: {
                    type: ''
                },
                oCinemaName: '',
                oCardLevelName: '',
                oRuleName: '', // 规则名称
                oRechargeAmount: '', // 充值金额
                oGivenType: '', // 赠送类型
                oGivenMoney: '', //赠送金额
                oGivenCouponGroupId: '', //赠送优惠券
                oRuleMemo: '', // 活动描述
                oCouponGroupName: '',
                oStartDate: '',
                oEndDate: '',
                oStatus: '', // 启用状态
                oId: '',
                groupName: '',
                drawer: false,
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
                        value: '0',
                        label: '未启用'
                    }
                ],
                type: [
                    {
                        value: '1',
                        label: '注册送券'
                    },
                    // {
                    //     value: '2',
                    //     label: '活动抢券'
                    // },
                    // {
                    //     value: '3',
                    //     label: '生日送券'
                    // },
                ],
                cinemaList:[],//影院列表
                cinemaInfo: [],
                cardList: [],
                form: [],
                tableData: [],
                multipleSelection: [],
                delList: [],
                couponList: [],
                couponInfo: [],
                editVisible: false,
                pageTotal: 0,
                idx: -1,
                id: -1,
                couponId: '',
                dialogFormVisible: false,
                oForm: {
                    cinemaName: '',
                    levelCode: '',
                    ruleName: '', // 规则名称
                    rechargeAmount: '', // 充值金额
                    givenType: '', // 赠送类型
                    givenMoney: '', //赠送金额
                    givenCouponGroupId: '', //赠送优惠券
                    ruleMemo: '', // 活动描述
                    status: '', // 启用状态
                    id: '',
                    startDate: '',
                    endDate: ''
                },
                formLabelWidth: '160px',
                selectValue: {},
                selectCode: {},
                couponName: '',
                value: ''
            };
        },
        created() {},
        mounted() {
            this.getMenu();
        },
        methods: {
            beforeUpload() {
                //上传之前
                this.imgType.type = EncryptReplace('activity');
            },
            unSuccess(data) {
                if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.download.clearFiles();
                return;
            }
                this.oActivityImageUrl = data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
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
                https.fetchPost('/cinema/myCinemaPage', '').then(data => {
                    loading.close();
                   this.cinemaList=JSON.parse(Decrypt(data.data.data)).data;
                }).catch(err => {
                    loading.close();
                    console.log(err);
                });
                https.fetchPost('/couponSendActivity/addPage', '').then(data => {
                    loading.close();
                        // this.cinemaInfo = JSON.parse(Decrypt(data.data.data));
                    console.log(data);
                    if (data.data.code == 'success') {
                            for (let key in this.oForm) {
                                this.oForm[key] = '';
                            }
                            this.couponId = '';
                            this.groupName = '';
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
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
                jsonArr.push({ key: 'activityImageUrl', value: this.oActivityImageUrl });
                jsonArr.push({ key: 'name', value: this.oForm.name });
                jsonArr.push({ key: 'type', value: '1' });
                jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
                jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
                jsonArr.push({ key: 'status', value: this.oForm.status });
                jsonArr.push({ key: 'isLimitTotal', value: this.oForm.isLimitTotal });
                jsonArr.push({ key: 'totalNumber', value: this.oForm.totalNumber });
                jsonArr.push({ key: 'activityDesc', value: this.oForm.activityDesc });
                jsonArr.push({ key: 'validDay', value: this.oForm.validDay });
                jsonArr.push({ key: 'couponGroupId', value: this.couponId });
                console.log(jsonArr);
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/couponSendActivity/addCouponSendActivity', params)
                        .then(data => {
                            loading.close();
                            console.log(data);
                            if (data.data.code == 'success') {
                                this.$refs.download.clearFiles();//清除已上传文件
                                this.dialogFormVisible = false;
                                this.$message.success(`新增成功`);
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
                            .fetchDelete('/couponSendActivity/deleteById', params)
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
                https.fetchPost('/cinema/myCinemaPage', '').then(data => {
                    this.cinemaList=JSON.parse(Decrypt(data.data.data)).data;
                }).catch(err => {
                    console.log(err);
                });
                https.fetchPost('/couponSendActivity/updatePage', params).then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            this.editVisible = true;
                            this.couponId=JSON.parse(Decrypt(data.data.data)).couponGroupId
                            // console.log(this.couponId);
                            //获取券包
                            let jsonArr=[]
                            jsonArr.push({ key: 'cinemaCodes', value: this.form.cinemaCode });
                            jsonArr.push({ key: 'status', value: 1 });
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
                                    console.log(this.couponList);
                                    for (let i = 0; i < this.couponList.length; i++) {
                                        if (this.couponList[i].id == this.couponId) {
                                            this.groupName = this.couponList[i].groupName;
                                        }
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
                            //送券活动类型下拉选显示对应的选项
                            for (let x in this.type) {
                                if (this.type[x].value == JSON.parse(Decrypt(data.data.data)).type) {
                                    this.form.type = this.type[x].value;
                                    break;
                                }
                            }
                            //开启状态下拉选显示对应的选项
                            for (let x in this.options) {
                                if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).status) {
                                    this.form.status = this.options[x].value;
                                    break;
                                }
                            }
                            if (JSON.parse(Decrypt(data.data.data)).isLimitTotal == 0) {
                                this.form.isLimitTotal = '0';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).isLimitTotal == 1) {
                                this.form.isLimitTotal = '1';
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
                jsonArr.push({ key: 'cinemaCode', value: this.form.cinemaCode});
                jsonArr.push({ key: 'activityImageUrl', value: this.oActivityImageUrl});
                jsonArr.push({ key: 'name', value: this.form.name });
                jsonArr.push({ key: 'type', value: this.form.type });
                jsonArr.push({ key: 'startDate', value: this.form.startDate });
                jsonArr.push({ key: 'endDate', value: this.form.endDate });
                jsonArr.push({ key: 'status', value: this.form.status });
                jsonArr.push({ key: 'isLimitTotal', value: this.form.isLimitTotal });
                jsonArr.push({ key: 'totalNumber', value: this.form.totalNumber });
                jsonArr.push({ key: 'activityDesc', value: this.form.activityDesc });
                jsonArr.push({ key: 'validDay', value: this.form.validDay });
                jsonArr.push({ key: 'couponGroupId', value: this.couponId });
                jsonArr.push({ key: 'id', value: this.form.id });
                console.log(jsonArr);
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                this.editVisible = false;
                https.fetchPost('/couponSendActivity/updateCouponSendActivityById', params).then(data => {
                        loading.close();
                        console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.$refs.download.clearFiles();//清除已上传文件
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
            getCinemaCode(e) {
                //获取所选影院编码
                for (let i = 0; i < this.cinemaInfo.length; i++) {
                    if (this.cinemaInfo[i].cinemaName == e) {
                        this.oForm.cinemaCode = this.cinemaInfo[i].cinemaCode;
                    }
                }
                this.getAllCinemaCard();
            },
            getCardInfo(e) {
                this.oForm.levelName = e;
                // 获取所选会员卡名称
                for (let i = 0; i < this.cardList.length; i++) {
                    if (this.cardList[i].levelName == e) {
                        this.oForm.levelCode = this.cardList[i].levelCode;
                    }
                }
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
                https.fetchPost('/couponSendActivity/couponSendActivityPage', params).then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.tableData = oData.data;
                            console.log(this.tableData);
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
            open() {
                //错误信息弹出框
                this.$alert(this.message, '错误信息', {
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
            sureNext(id) {
                this.couponId = id;
                for (let i = 0; i < this.couponList.length; i++) {
                    if (this.couponList[i].id == this.couponId) {
                        this.groupName = this.couponList[i].groupName;
                    }
                }
                this.drawer = false;
            },
            // 获取所有影院
            getAllCinema() {
                https.fetchPost('/cinema/getAllCinema').then(data => {
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
            // 获取所有券包
            getAllCoupon() {
                if (!this.oForm.cinemaCode || this.oForm.cinemaCode == '') {
                    this.message = '请选择影院';
                    this.open();
                    return;
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCodes', value: this.oForm.cinemaCode });
                jsonArr.push({ key: 'status', value: 1 });
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
                            console.log(this.couponList);
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
                        console.log(err);
                    });
            },
            // 更换券包
            changeCoupon() {
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCodes', value: this.form.cinemaCode });
                jsonArr.push({ key: 'status', value: 1 });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https.fetchPost('/couponGroup/couponGroupPage', params).then(data => {
                        if (data.data.code == 'success') {
                            var res = JSON.parse(Decrypt(data.data.data));
                            console.log(res);
                            if (res.data.length == 0) {
                                this.message = '暂无券包';
                                this.open();
                                return;
                            }
                            this.couponList = res.data;
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
                        console.log(err);
                    });
            },
            // 获取所有影院会员卡
            getAllCinemaCard() {
                let jsonArr = [];
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
                jsonArr.push({ key: 'status', value: 1 });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/rechargeCardRule/listCardLevel', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            var res = JSON.parse(Decrypt(data.data.data));
                            this.cardList = res.data;
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

