<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 金币商品管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="角色名" class="handle-input mr10"></el-input>
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="审核中" value="1"></el-option>
                    <el-option key="2" label="未审核" value="2"></el-option>
                    <el-option key="3" label="通过" value="3"></el-option>
                    <el-option key="4" label="审核失败" value="4"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button type="primary"  @click="addPage" icon="el-icon-circle-plus-outline"  style="margin-left: 600px">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="商品名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="商品图片">
                    <template slot-scope="scope">{{scope.row.image_url}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="商品描述">
                    <template slot-scope="scope">{{scope.row.memo}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="库存">
                    <template slot-scope="scope">{{scope.row.store}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="兑换方式">
                    <template slot-scope="scope">{{scope.row.change_type}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="所需金币数量">
                    <template slot-scope="scope">{{scope.row.gold}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="所需RMB">
                    <template slot-scope="scope">{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="允许兑换的门店">
                    <template slot-scope="scope">{{scope.row.cinema_codes}}</template>
                </el-table-column>
                <el-table-column label="上架状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'" type='success'
                        >成功</el-tag>
                        <el-tag v-else type='danger'
                        >未通过</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序">
                    <template slot-scope="scope">{{scope.row.sort}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="商品类型">
                    <template slot-scope="scope">{{scope.row.commodity_type}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="优惠券id">
                    <template slot-scope="scope">{{scope.row.ticket_ids}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="是否指定日期可以兑换">
                    <template slot-scope="scope">{{scope.row.assign_type}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="对应上方参数的具体日期信息">
                    <template slot-scope="scope">{{scope.row.assign_info}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="是否限制一段时间内可兑换数量">
                    <template slot-scope="scope">{{scope.row.limit_type}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="对应上方的限制兑换数量">
                    <template slot-scope="scope">{{scope.row.limit_number}}</template>
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
                        @prev-click='prev'
                        @next-click="next"
                ></el-pagination>
            </div>
        </div>
        <!--新增弹出框-->
        <el-dialog title="新增商品" :visible.sync="dialogFormVisible">
            <el-form v-model="oForm">
                <el-form-item label="商品类型" :label-width="formLabelWidth">
                    <el-select v-model="oForm.commodity_type" placeholder="请选择兑换方式">
                        <el-option
                                v-for="item in commodityType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品图片" :label-width="formLabelWidth">
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            drag
                            action="/api/upload/uploadImage"
                            :on-success="onSuccess"
                            multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品描述" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.memo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.store" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="兑换方式" :label-width="formLabelWidth">
                    <el-select v-model="oForm.change_type" placeholder="请选择兑换方式">
                        <el-option
                                v-for="item in showType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所需金币数量" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.gold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所需RMB" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.money" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="允许兑换的门店" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.cinema_codes" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上架状态" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择兑换方式">
                        <el-option
                                v-for="item in showStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优惠券id" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.ticket_ids" autocomplete="off"></el-input>
                    <el-autocomplete
                            v-model="state"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="是否指定日期可以兑换" :label-width="formLabelWidth">
                    <el-select v-model="oForm.assign_type" placeholder="请选择兑换方式">
                        <el-option
                                v-for="item in assignType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对应上方参数的具体日期信息" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.assign_info" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否限制一段时间内可兑换数量" :label-width="formLabelWidth">
                    <el-select v-model="oForm.limit_type" placeholder="请选择兑换方式">
                        <el-option
                                v-for="item in limitType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对应上方的限制兑换数量" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.limit_number" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="商品名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品图片" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.imageUrl" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品描述" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.memo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.store" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="已兑换数量" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.alredyChangedNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="兑换方式" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.changeType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所需金币数量" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.gold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所需RMB" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.money" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="允许兑换的门店" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.cinemaCodes" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上架状态" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.status" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="关联商家编码" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.businessCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品类型" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.commodityType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="优惠券id" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.ticketIds" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否指定日期可以兑换" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.assignType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="对应上方参数的具体日期信息" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.assignInfo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否限制一段时间内可兑换数量" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.limitType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="对应上方的限制兑换数量" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.limitNumber" autocomplete="off"></el-input>
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
    import {Decrypt,Encrypt,preSign,EncryptReplace,ParamsAppend} from '@/aes/utils';
    import md5 from 'js-md5';
    import axios from 'axios';
    import https from "../../https";
    export default {
        name: 'basetable',
        data() {
            return {
                type:{
                    // sign: "ed8u$input7$input7jpYsRe8t2aKSKBF/cJ21S1z/10SqwBE2XAQ=",
                    type: ""
                },
                oName:'',
                message:'',//弹出框消息
                query: {
                    pageNo:1,
                    pageSize:10

                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {
                    memo: '',
                    sort: '',
                    id:'',
                },
                idx: -1,
                id: -1,
                dialogFormVisible: false,
                oForm: {
                    name: '',
                    memo: '',
                    sort: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: '',
                    value:'1'
                },
                formLabelWidth: '120px',
                selectValue:{},
                options: [{
                    value: '1',
                    label: '审核中'
                }, {
                    value: '2',
                    label: '未审核'
                }, {
                    value: '3',
                    label: '通过'
                }, {
                    value: '4',
                    label: '审核失败'
                }],
                showType: [{
                    value: '1',
                    label: '纯金币兑换'
                }, {
                    value: '2',
                    label: '纯RMB兑换'
                }, {
                    value: '3',
                    label: '金币 + RMB 兑换'
                }],
                showStatus: [{
                    value: '1',
                    label: '上架'
                }, {
                    value: '2',
                    label: '未上架'
                }],
                commodityType: [{
                    value: '1',
                    label: '实物'
                }, {
                    value: '2',
                    label: '优惠券'
                }],
                assignType: [{
                    value: '0',
                    label: '不允许指定日期'
                }, {
                    value: '1',
                    label: '指定日期'
                }, {
                    value: '2',
                    label: '指定每月几号'
                }, {
                    value: '3',
                    label: '指定每月第几周'
                }, {
                    value: '4',
                    label: '指定每周几'
                }],
                limitType: [{
                    value: '0',
                    label: '不限制'
                }, {
                    value: '1',
                    label: '限制每年可兑换数量'
                }, {
                    value: '2',
                    label: '每月'
                }, {
                    value: '3',
                    label: '每周'
                }],
                value: '',
                restaurants: [],
                state: '',
                timeout:  null
            };
        },
        created() {

        },
        mounted(){
            this.getMenu()
        },
        methods: {
            querySearchAsync(queryString, cb) {
                console.log(queryString);
                var jsonArr=[];
                jsonArr.push({key:"couponName",value:queryString});
                let sign =md5(preSign(jsonArr));
                jsonArr.push({key:"sign",value:sign});
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/merchandiseCoupon/getCouponByName',params).then((data) => {
                    console.log(data);
                    if(data.data.code == 'success'){
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        var results =JSON.parse(Decrypt(data.data.data))


                            cb(results);
                    }else if(data.data.code=='nologin'){
                        this.message=data.data.message
                        this.open()
                        this.$router.push('/login');
                    }else {
                        this.message=data.data.message
                        this.open()
                    }
                }).catch(err=>{
                        console.log(err)
                    }
                )
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            addPage(){//获取新增按钮权限
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    https.fetchPost('/goldCommodity/addPage','').then((data) => {
                        // console.log(data);
                        if(data.data.code == 'success'){
                            this.oForm=[]
                            this.dialogFormVisible = true
                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message
                            this.open()
                            this.$router.push('/login');
                        }else {
                            this.message=data.data.message
                            this.open()
                        }
                    }).catch(err=>{
                            console.log(err)
                        }
                    )
                    loading.close();
                }, 500);
            },
            addRole(){ //新增按钮操作
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    var jsonArr = [];
                    jsonArr.push({key:"name",value:this.oForm.name});
                    jsonArr.push({key:"imageUrl",value:this.oForm.image_url});
                    jsonArr.push({key:"memo",value:this.oForm.memo});
                    jsonArr.push({key:"store",value:this.oForm.store});
                    jsonArr.push({key:"changeType",value:this.oForm.change_type});
                    jsonArr.push({key:"gold",value:this.oForm.gold});
                    jsonArr.push({key:"money",value:this.oForm.money});
                    jsonArr.push({key:"cinemaCodes",value:this.oForm.cinema_codes});
                    jsonArr.push({key:"status",value:this.oForm.status});
                    jsonArr.push({key:"commodityType",value:this.oForm.commodity_type});
                    jsonArr.push({key:"ticketIds",value:this.oForm.ticket_ids});
                    jsonArr.push({key:"assignType",value:this.oForm.assign_type});
                    jsonArr.push({key:"assignInfo",value:this.oForm.assign_info});
                    jsonArr.push({key:"limitType",value:this.oForm.limit_type});
                    jsonArr.push({key:"limitNumber",value:this.oForm.limit_number});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    let params = ParamsAppend(jsonArr);
                    console.log(params);
                    if(this.dialogFormVisible == true){
                        https.fetchPost('/goldCommodity/addGoldCommodity',params).then((data) => {//新增
                            console.log(data);
                            if(data.data.code=='success'){
                                this.dialogFormVisible = false
                                this.$message.success(`新增成功`);
                                this.oForm.name = ''
                                this.oForm.value = ''
                                this.oForm.memo = ''
                                this.getMenu()
                            }else if(data.data.code=='nologin'){
                                this.message=data.data.message
                                this.open()
                                this.$router.push('/login');
                            }else{
                                this.message=data.data.message
                                this.open()
                            }
                        }).catch(err=>{
                                console.log(err)
                            }
                        )
                    }
                    loading.close();
                }, 500);
            },
            delChange(index, row){//删除数据
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
                    let name=this.query.name
                    let status=this.query.status
                    if(!name){
                        name=''
                    }
                    if(!status){
                        status=''
                    }
                    let jsonArr = [];
                    // jsonArr.push({key:"roleName",value:name});
                    // jsonArr.push({key:"status",value:status});
                    jsonArr.push({key:"id",value:row.id});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    let params = ParamsAppend(jsonArr);
                    https.fetchPost('goldCommodity/deleteById',params).then((data) => {
                        // console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if(data.data.code=='success'){
                            this.$message.error(`删除了`);
                            this.getMenu()
                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message
                            this.open()
                            this.$router.push('/login');
                        }else{
                            this.message=data.data.message
                            this.open()
                        }
                    }).catch(err=>{
                            console.log(err)
                        }
                    )
                    loading.close();
                }, 500);
            },
            addChange(index, row){//是否修改权限
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
                    jsonArr.push({key:"id",value:row.id});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    let params = ParamsAppend(jsonArr);
                    https.fetchPost('goldCommodity/modifyPage',params).then((data) => {
                        console.log(data);
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if(data.data.code=='success'){
                            this.editVisible = true;
                            this.form.name=JSON.parse(Decrypt(data.data.data)).goldCommodity.name;
                            this.form.imageUrl=JSON.parse(Decrypt(data.data.data)).goldCommodity.imageUrl;
                            this.form.memo=JSON.parse(Decrypt(data.data.data)).goldCommodity.memo;
                            this.form.store=JSON.parse(Decrypt(data.data.data)).goldCommodity.store;
                            this.form.alredyChangedNumber=JSON.parse(Decrypt(data.data.data)).goldCommodity.alredyChangedNumber;
                            this.form.changeType=JSON.parse(Decrypt(data.data.data)).goldCommodity.changeType;
                            this.form.gold=JSON.parse(Decrypt(data.data.data)).goldCommodity.gold;
                            this.form.money=JSON.parse(Decrypt(data.data.data)).goldCommodity.money;
                            this.form.cinemaCodes=JSON.parse(Decrypt(data.data.data)).goldCommodity.cinemaCodes;
                            this.form.status=JSON.parse(Decrypt(data.data.data)).goldCommodity.status;
                            this.form.businessCode=JSON.parse(Decrypt(data.data.data)).goldCommodity.businessCode;
                            this.form.commodityType=JSON.parse(Decrypt(data.data.data)).goldCommodity.commodityType;
                            this.form.ticketIds=JSON.parse(Decrypt(data.data.data)).goldCommodity.ticketIds;
                            this.form.assignType=JSON.parse(Decrypt(data.data.data)).goldCommodity.assignType;
                            this.form.assignInfo=JSON.parse(Decrypt(data.data.data)).goldCommodity.assignInfo;
                            this.form.limitType=JSON.parse(Decrypt(data.data.data)).goldCommodity.limitType;
                            this.form.limitNumber=JSON.parse(Decrypt(data.data.data)).goldCommodity.limitNumber;
                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message
                            this.open()
                            this.$router.push('/login');
                        }else{
                            this.message=data.data.message
                            this.open()
                        }
                    }).catch(err=>{
                            console.log(err)
                        }
                    )
                    loading.close();
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
                setTimeout(() => {
                    console.log(this.form.sort);
                    // console.log(this.from.sort.toString());
                    var jsonArr = [];
                    jsonArr.push({key:"id",value:this.form.id});
                    jsonArr.push({key:"name",value:this.form.name});
                    jsonArr.push({key:"imageUrl",value:this.form.imageUrl});
                    jsonArr.push({key:"memo",value:this.form.memo});
                    jsonArr.push({key:"store",value:this.form.store});
                    jsonArr.push({key:"alredyChangedNumber",value:this.form.alredyChangedNumber});
                    jsonArr.push({key:"changeType",value:this.form.changeType});
                    jsonArr.push({key:"gold",value:this.form.gold});
                    jsonArr.push({key:"money",value:this.form.money});
                    jsonArr.push({key:"cinemaCodes",value:this.form.cinemaCodes});
                    jsonArr.push({key:"status",value:this.form.status});
                    jsonArr.push({key:"businessCode",value:this.form.businessCode});
                    jsonArr.push({key:"commodityType",value:this.form.commodityType});
                    jsonArr.push({key:"ticketIds",value:this.form.ticketIds});
                    jsonArr.push({key:"assignType",value:this.form.assignType});
                    jsonArr.push({key:"assignInfo",value:this.form.assignInfo});
                    jsonArr.push({key:"limitType",value:this.form.limitType});
                    jsonArr.push({key:"limitNumber",value:this.form.limitNumber});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    console.log(jsonArr);
                    let params = ParamsAppend(jsonArr);
                    console.log(params);
                    this.editVisible = false;
                    https.fetchPost('goldCommodity/updateById',params).then((data) => {
                        // console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if(data.data.code=='success'){
                            this.$message.success(`编辑成功`);
                            this.getMenu()
                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message
                            this.open()
                            this.$router.push('/login');
                        }else{
                            this.message=data.data.message
                            this.open()
                        }
                    }).catch(err=>{
                            console.log(err)
                        }
                    )
                    loading.close();
                }, 500);
            },
            Search(){
                this.query.pageNo=1
                this.getMenu()
            },
            getMenu(){//获取菜单栏
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let name=this.query.name
                    let status=this.query.status
                    if(!name){
                        name=''
                    }
                    if(!status){
                        status=''
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"roleName",value:name});
                    jsonArr.push({key:"status",value:status});
                    jsonArr.push({key:"pageNo",value:this.query.pageNo});
                    jsonArr.push({key:"pageSize",value:this.query.pageSize});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/goldCommodity/goldCommodityPage',params).then((data) => {
                        // console.log(data);
                        if(data.data.code=='success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
                            this.tableData = oData.data;
                            this.query.pageSize = oData.pageSize;
                            this.query.pageNo = oData.pageNo;
                            this.query.totalCount = oData.totalCount;
                            this.query.totalPage = oData.totalPage
                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message
                            this.open()
                            this.$router.push('/login');
                        }else{
                            this.message=data.data.message
                            this.open()
                        }

                    }).catch(err=>{
                            console.log(err)
                        }
                    )
                    loading.close();
                }, 500);
            },
            beforeUpload(){//上传之前
                this.type.type=EncryptReplace('business')
            },
            onSuccess(data){//上传文件 登录超时
                // console.log(data);
                this.oForm.image_url=data.data
                if(data.code=='nologin'){
                    this.message=data.message
                    this.open()
                    this.$router.push('/login');
                }
            },
            open() {     //错误信息弹出框
                this.$alert(this.message, '错误信息', {
                    dangerouslyUseHTMLString: true
                });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            currentChange(val){//点击选择具体页数
                this.query.pageNo = val
                this.getMenu()
            },
            prev(){//分页按钮上一页
                this.query.pageNo--
                this.getMenu()
            },
            next(){//分页按钮下一页
                this.query.pageNo++
                this.getMenu()
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
