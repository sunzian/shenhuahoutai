<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 轮播图管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="审核中" value="1"></el-option>
                    <el-option key="2" label="未审核" value="2"></el-option>
                    <el-option key="3" label="通过" value="3"></el-option>
                    <el-option key="4" label="审核失败" value="4"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button type="primary"  @click="addPage" icon="el-icon-circle-plus-outline"  style="margin-left: 910px">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="商家编码">
                    <template slot-scope="scope">{{scope.row.businessCode}}</template>
                </el-table-column>
                <el-table-column label="影院编码">
                    <template slot-scope="scope">{{scope.row.cinemaCode}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="开卡规则编码" width="100px">
                    <template slot-scope="scope">{{scope.row.ruleCode}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="开卡规则名称">
                    <template slot-scope="scope">{{scope.row. ruleName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="活动描述">
                    <template slot-scope="scope">{{scope.row. ruleMemo}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="会员卡类型" width="160px">
                    <template slot-scope="scope">{{scope.row.memberCardType}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="会员卡类别编码" width="160px">
                    <template slot-scope="scope">{{scope.row.cardLevelCode}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="会员卡类别名称">
                    <template slot-scope="scope">{{scope.row.cardLevelName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="充值金额" width="120px">
                    <template slot-scope="scope">{{scope.row.rechargeAmount}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="赠送类型" width="200px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.givenType=='1'"
                        >不赠送</el-tag>
                        <el-tag v-else-if="scope.row.givenType=='2'"
                        >赠送RMB</el-tag>
                        <el-tag v-else-if="scope.row.givenType=='3'"
                        >赠送券包</el-tag>
                        <el-tag v-else-if="scope.row.givenType=='4'"
                        >两者都送</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="赠送金额" width="120px">
                    <template slot-scope="scope">{{scope.row.givenMoney}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="赠送的券id和张数">
                    <template slot-scope="scope">{{scope.row.givenTicketsParams}}</template>
                </el-table-column>
                <el-table-column label="开始时间" align="center">
                    <template slot-scope="scope">{{scope.row.startDate}}</template>
                </el-table-column>
                <el-table-column label="结束时间" align="center">
                    <template slot-scope="scope">{{scope.row.endDate}}</template>
                </el-table-column>
                <el-table-column label="启用状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'" type='success'
                        >启用</el-tag>
                        <el-tag v-else type='danger'
                        >未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
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
        <el-dialog title="新增规则" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="影院编码" :label-width="formLabelWidth">
                    <el-select v-model="oForm.cinemaCode" placeholder="请选择影院">
                        <el-option
                                v-for="item in selectValue"
                                :key="item.cinemaCode"
                                :label="item.cinemaName"
                                :value="item.cinemaCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开卡规则编码" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.ruleCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开卡规则名称" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.ruleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动描述" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.ruleMemo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="会员卡类型" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.memberCardType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="会员卡类别编码" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.cardLevelCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="会员卡类别名称" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.cardLevelName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="充值金额" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.rechargeAmount" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="赠送类型" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.givenType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="赠送金额" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.givenMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="赠送的券id和张数" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.givenTicketsParams" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.startDate" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.endDate" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="启用状态" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.status" autocomplete="off"></el-input>
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
                <el-form-item label="轮播图级别" :label-width="formLabelWidth">
                    <el-select v-model="form.bannerLevel" placeholder="请选择级别">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属商家编码" :label-width="formLabelWidth">
                    <el-select v-model="form.businessCode" placeholder="请选择商家">
                        <el-option
                                v-for="item in businessOptiones"
                                :key="item.business_code"
                                :label="item.business_name"
                                :value="item.business_code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适用影院编码" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="form.cinemaCodes" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否显示" :label-width="formLabelWidth">
                    <el-select v-model="form.status" placeholder="选择是否显示">
                        <el-option
                                v-for="item in showStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                            style="width: 190px"
                            v-model="changeStartTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                            style="width: 190px"
                            v-model="changeEndTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="form.memo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="轮播图类别" :label-width="formLabelWidth">
                    <el-select v-model="form.bannerType" placeholder="请选择商家">
                        <el-option
                                v-for="item in bannerType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片地址" :label-width="formLabelWidth">
                    <el-popover
                            placement="right"
                            title=""
                            trigger="hover">
                        <img :src="imageUrl"/>
                        <img slot="reference" :src="imageUrl" :alt="imageUrl" style="max-height: 50px;max-width: 130px">
                    </el-popover>
                    <el-upload
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
                <el-form-item label="跳转类型" :label-width="formLabelWidth">
                    <el-select v-model="form.tabType" placeholder="请选择跳转类型">
                        <el-option
                                v-for="item in tabType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转的具体类型" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="goType" autocomplete="off"></el-input>
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
                    type: "HaqvR9QhxCCGBAiSE6veKw=="
                },
                imageUrl:'',
                changeStartTime:'',
                changeEndTime:'',
                startTime:'',
                endTime:'',
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
                    bannerLevel: '',
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
                    value:'',
                    statusValue:'',
                    businessCode:'',
                    cinemaCode:'',
                },
                formLabelWidth: '120px',
                selectValue:{},
                options: [{
                    value: '1',
                    label: '商家'
                }, {
                    value: '2',
                    label: '门店'
                }],
                showStatus: [{
                    value: '1',
                    label: '显示'
                }, {
                    value: '2',
                    label: '不显示'
                }],
                businessOptiones:[],
                bannerType:[
                    {
                        value: '1',
                        label: '电影首页轮播图'
                    }
                ],
                tabType:[
                    {
                        value: '1',
                        label: '跳转到文章'
                    }
                ],
                value: '',
                goType:'',
            };
        },
        created() {

        },
        mounted(){
            this.getMenu()
        },
        methods: {
            addPage(){//获取新增按钮权限
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    https.fetchPost('/openCardRule/addPage','').then((data) => {
                        console.log(data);
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if(data.data.code == 'success'){
                            this.dialogFormVisible = true
                            this.selectValue = JSON.parse(Decrypt(data.data.data))
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
                }, 2000);
            },
            onSuccess(data){//上传文件 登录超时
                // console.log(data);
                this.oForm.imageUrl=data.data
                if(data.code=='nologin'){
                    this.message=data.message
                    this.open()
                    this.$router.push('/login');
                }
            },
            addRole(){ //新增按钮操作
                console.log(this.oForm.cinemaCode);
                console.log(oForm.ruleCode);
                console.log(oForm.ruleName);
                console.log(oForm.ruleMemo);
                // console.log(this.startTime);//开始时间
                // console.log(this.endTime);//结束时间
                // console.log(this.oForm.value);
                // console.log(this.oForm.statusValue);
                // console.log(this.oForm.memo);
                // console.log(this.oForm.businessCode);
                // console.log(this.oForm.bannerType);
                // console.log(this.oForm.tabType);
                // console.log(this.oForm.goType);
                // console.log(this.oForm.cinemaCode);
                // const loading = this.$loading({
                //     lock: true,
                //     text: 'Loading',
                //     spinner: 'el-icon-loading',
                //     background: 'rgba(0, 0, 0, 0.7)',
                //     target: document.querySelector('.div1')
                // });
                // setTimeout(() => {
                //     var jsonArr = [];
                //     jsonArr.push({key:"bannerLevel",value:this.oForm.value});
                //     jsonArr.push({key:"businessCode",value:this.oForm.businessCode});
                //     jsonArr.push({key:"cinemaCodes",value:this.oForm.cinemaCode});
                //     jsonArr.push({key:"status",value:this.oForm.statusValue});
                //     jsonArr.push({key:"startDate",value:this.startTime});
                //     jsonArr.push({key:"endDate",value:this.endTime});
                //     jsonArr.push({key:"memo",value:this.oForm.memo});
                //     jsonArr.push({key:"category",value:this.oForm.bannerType});
                //     jsonArr.push({key:"imageUrl",value:this.oForm.imageUrl});
                //     jsonArr.push({key:"redirectType",value:this.oForm.tabType});
                //     jsonArr.push({key:"redirectGoal",value:this.oForm.goType});
                //     let sign =md5(preSign(jsonArr));
                //     jsonArr.push({key:"sign",value:sign});
                //     let params = ParamsAppend(jsonArr);
                //     if(this.dialogFormVisible == true){
                //         https.fetchPost('/banner/addBanner',params).then((data) => {//新增
                //             console.log(data);
                //             if(data.data.code=='success'){
                //                 this.dialogFormVisible = false
                //                 this.$message.success(`新增成功`);
                //                 this.oForm.name = ''
                //                 this.oForm.value = ''
                //                 this.oForm.memo = ''
                //                 this.getMenu()
                //             }else if(data.data.code=='nologin'){
                //                 this.message=data.data.message
                //                 this.open()
                //                 this.$router.push('/login');
                //             }else{
                //                 this.message=data.data.message
                //                 this.open()
                //             }
                //         }).catch(err=>{
                //                 console.log(err)
                //             }
                //         )
                //     }
                //     loading.close();
                // }, 2000);
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
                    https.fetchPost('/banner/deleteBanner',params).then((data) => {
                        console.log(data);
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
                }, 2000);
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
                    https.fetchPost('/banner/modifyPage',params).then((data) => {
                        console.log(data);
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if(data.data.code=='success'){
                            this.editVisible = true;
                            let oIndex = 0;  //轮播图级别下拉选显示对应的选项
                            for(let i in this.options){
                                if(this.options[i].value==JSON.parse(Decrypt(data.data.data)).banner.bannerLevel){
                                    oIndex=i;
                                    break;
                                }
                            }
                            this.form.bannerLevel = this.options[oIndex].value;
                            this.businessOptiones = JSON.parse(Decrypt(data.data.data)).businessInfos
                            let businessIndex = 0;  //所属商家编码下拉选显示对应的选项
                            for(let i in this.businessOptiones){
                                if(this.businessOptiones[i].business_code==JSON.parse(Decrypt(data.data.data)).banner.businessCode){
                                    businessIndex=i;
                                    break;
                                }
                            }
                            this.form.businessCode = this.businessOptiones[businessIndex].business_code;
                            this.form.cinemaCodes=JSON.parse(Decrypt(data.data.data)).banner.cinemaCodes //适用影院编码
                            let index = 0;  //是否显示下拉选显示对应的选项
                            for(let i in this.showStatus){
                                if(this.options[i].value==JSON.parse(Decrypt(data.data.data)).banner.status){
                                    index=i;
                                    break;
                                }
                            }
                            this.form.status = this.showStatus[index].value;
                            this.changeStartTime = JSON.parse(Decrypt(data.data.data)).banner.createDate//创建时间
                            this.changeEndTime = JSON.parse(Decrypt(data.data.data)).banner.endDate//结束时间
                            this.form.memo= JSON.parse(Decrypt(data.data.data)).banner.memo//备注
                            let typeIndex = 0;  //轮播图级别下拉选显示对应的选项
                            for(let i in this.bannerType){//轮播图类型下拉框显示对应的选项
                                if(this.bannerType[i].value==JSON.parse(Decrypt(data.data.data)).banner.category){
                                    typeIndex=i;
                                    break;
                                }
                            }
                            this.form.bannerType = this.bannerType[typeIndex].value;
                            this.imageUrl = JSON.parse(Decrypt(data.data.data)).banner.imageUrl
                            let tabIndex = 0;  //跳转类型下拉选显示对应的选项
                            for(let i in this.tabType){//轮播图类型下拉框显示对应的选项
                                if(this.tabType[i].value==JSON.parse(Decrypt(data.data.data)).banner.redirectType){
                                    tabIndex=i;
                                    break;
                                }
                            }
                            this.form.tabType = this.bannerType[tabIndex].value;
                            this.goType = JSON.parse(Decrypt(data.data.data)).banner.redirectGoal
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
                }, 2000);
            },
            // 编辑操作
            exChanger() {
                console.log(this.form.bannerLevel);
                console.log(this.form.businessCode);
                console.log(this.form.cinemaCodes);
                console.log(this.form.status);
                console.log(this.changeStartTime);
                console.log(this.changeEndTime);
                console.log(this.form.memo);
                console.log(this.form.bannerType);
                console.log(this.form.tabType);
                console.log(this.goType);
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    // console.log(this.form.sort);
                    // console.log(this.from.sort.toString());
                    var jsonArr = [];
                    jsonArr.push({key:"id",value:this.form.id});
                    jsonArr.push({key:"bannerLevel",value:this.form.bannerLevel});
                    jsonArr.push({key:"businessCode",value:this.form.businessCode});
                    jsonArr.push({key:"cinemaCodes",value:this.form.cinemaCodes});
                    jsonArr.push({key:"status",value:this.form.status});
                    jsonArr.push({key:"startDate",value:this.changeStartTime});
                    jsonArr.push({key:"endDate",value:this.changeEndTime});
                    jsonArr.push({key:"memo",value:this.form.memo});
                    jsonArr.push({key:"category",value:this.form.bannerType});
                    jsonArr.push({key:"redirectType",value:this.form.tabType});
                    jsonArr.push({key:"redirectGoal",value:this.goType});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    console.log(jsonArr);
                    let params = ParamsAppend(jsonArr);
                    console.log(params);
                    this.editVisible = false;
                    https.fetchPost('/banner/updateById',params).then((data) => {
                        console.log(data);
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
                }, 2000);
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
                    jsonArr.push({key:"pageNo",value:this.query.pageNo});
                    jsonArr.push({key:"pageSize",value:this.query.pageSize});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/openCardRule/openPage',params).then((data) => {
                        if(data.data.code=='success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
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
                }, 2000);
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


