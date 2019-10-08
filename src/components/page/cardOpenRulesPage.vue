<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 开卡规则管理
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
                <el-table-column label="操作" width="180" align="center" fixed="right">
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
            <el-form v-model="oForm">
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
                    <el-input style="width: 150px" maxlength="9" v-model="oForm.ruleCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开卡规则名称" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="oForm.ruleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动描述" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="oForm.ruleMemo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="会员卡类型" :label-width="formLabelWidth">
                    <el-select v-model="oForm.memberCardType" placeholder="请选择会员卡类型">
                        <el-option
                                v-for="item in memberCardTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="会员卡类别编码" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="oForm.cardLevelCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="会员卡类别名称" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="oForm.cardLevelName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="充值金额" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="oForm.rechargeAmount" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="赠送类型" :label-width="formLabelWidth">
                    <el-select v-model="oForm.givenType" placeholder="请选择赠送类型">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="赠送金额" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="oForm.givenMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="赠送的券id和张数" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="oForm.givenTicketsParams" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                            style="width: 190px"
                            v-model="startTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                            style="width: 190px"
                            v-model="endTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="启用状态" :label-width="formLabelWidth">
                    <el-select v-model="oForm.statusValue" placeholder="选择是否启用">
                        <el-option
                                v-for="item in showStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
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
                <el-form-item label="影院编码" :label-width="formLabelWidth">
                    <el-select v-model="form.cinemaCode" placeholder="请选择影院">
                        <el-option
                                v-for="item in cinemaList"
                                :key="item.cinemaCode"
                                :label="item.cinemaName"
                                :value="item.cinemaCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开卡规则编码" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="form.ruleCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开卡规则名称" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="form.ruleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动描述" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="form.ruleMemo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="会员卡类型" :label-width="formLabelWidth">
                    <el-select v-model="form.memberCardType" placeholder="请选择会员卡类型">
                        <el-option
                                v-for="item in memberCardTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="会员卡类别编码" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="form.cardLevelCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="会员卡类别名称" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="form.cardLevelName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="充值金额" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="form.rechargeAmount" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="赠送类型" :label-width="formLabelWidth">
                    <el-select v-model="form.givenType" placeholder="请选择赠送类型">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="赠送金额" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="form.givenMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="赠送的券id和张数" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model="form.givenTicketsParams" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                            style="width: 190px"
                            v-model="changeStartTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                            style="width: 190px"
                            v-model="changeEndTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="启用状态" :label-width="formLabelWidth">
                    <el-select v-model="form.statusValue" placeholder="选择是否启用">
                        <el-option
                                v-for="item in showStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
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
                memberCardTypeList:[
                    {
                        value: '1',
                        label: '权益卡'
                    }, {
                        value: '2',
                        label: '普通卡'
                    }
                ],
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
                    label: '不赠送'
                }, {
                    value: '2',
                    label: '赠送RMB'
                }, {
                    value: '3',
                    label: '赠送券包'
                }, {
                    value: '4',
                    label: '两者都送'
                }],
                showStatus: [{
                    value: '1',
                    label: '启用'
                }, {
                    value: '2',
                    label: '不启用'
                }],
                businessOptiones:[],
                value: '',
                goType:'',
                cinemaList:[],
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
                        // console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if(data.data.code == 'success'){
                            this.oForm=[]
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
                }, 500);
            },
            addRole(){ //新增按钮操作
                // console.log(this.oForm.cinemaCode);
                // console.log(this.oForm.ruleCode);
                // console.log(this.oForm.ruleName);
                // console.log(this.oForm.ruleMemo);
                // console.log(this.startTime);//开始时间
                // console.log(this.endTime);//结束时间
                // console.log(this.oForm.memberCardType);
                // console.log(this.oForm.cardLevelCode);
                // console.log(this.oForm.cardLevelName);
                // console.log(parseInt(this.oForm.rechargeAmount).toFixed(2));
                // console.log(this.oForm.givenType);
                // console.log(parseInt(this.oForm.givenMoney).toFixed(2));
                // console.log(this.oForm.givenTicketsParams);
                // console.log(this.oForm.statusValue);
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    var jsonArr = [];
                    jsonArr.push({key:"cinemaCode",value:this.oForm.cinemaCode});
                    jsonArr.push({key:"ruleCode",value:this.oForm.ruleCode});
                    jsonArr.push({key:"ruleName",value:this.oForm. ruleName});
                    jsonArr.push({key:"ruleMemo",value:this.oForm. ruleMemo});
                    jsonArr.push({key:"memberCardType",value:this.oForm.memberCardType});
                    jsonArr.push({key:"cardLevelCode",value:this.oForm.cardLevelCode});
                    jsonArr.push({key:"cardLevelName",value:this.oForm.cardLevelName});
                    jsonArr.push({key:"rechargeAmount",value:parseInt(this.oForm.rechargeAmount).toFixed(2)});
                    jsonArr.push({key:"givenType",value:this.oForm.givenType});
                    jsonArr.push({key:"givenMoney",value:parseInt(this.oForm.givenMoney).toFixed(2)});
                    jsonArr.push({key:"givenTicketsParams",value:this.oForm.givenTicketsParams});
                    jsonArr.push({key:"startDate",value:this.startTime});
                    jsonArr.push({key:"endDate",value:this.endTime});
                    jsonArr.push({key:"status",value:this.oForm.statusValue});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    let params = ParamsAppend(jsonArr);
                    if(this.dialogFormVisible == true){
                        https.fetchPost('/openCardRule/addOpenCardRule',params).then((data) => {//新增
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
                    https.fetchPost('/openCardRule/deleteOpenCardRule',params).then((data) => {
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
                    https.fetchPost('/openCardRule/modifyPage',params).then((data) => {
                        console.log(data);
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if(data.data.code=='success'){
                            this.editVisible = true;
                            this.cinemaList = JSON.parse(Decrypt(data.data.data)).cinemaList  //影院编码下拉选显示对应的选项
                            let oIndex = 0;
                            for(let i in this.cinemaList){
                                if(this.cinemaList[i].cinemaCode==JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.cinemaCode){
                                    oIndex=i;
                                    break;
                                }
                            }
                            this.form.cinemaCode = this.cinemaList[oIndex].cinemaCode; //影院编码下拉选显示对应的选项
                            let businessIndex = 0;  //会员卡类型下拉选显示对应的选项
                            for(let i in this.memberCardTypeList){
                                if(this.memberCardTypeList[i].value==JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.memberCardType){
                                    businessIndex=i;
                                    break;
                                }
                            }
                            this.form.memberCardType = this.memberCardTypeList[businessIndex].value; //会员卡类型下拉选显示对应的选项

                            let index = 0;//赠送类型下拉选显示对应的选项
                            for(let i in this.options){
                                if(this.options[i].value ==JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.givenType){
                                    index=i;
                                    break
                                }
                            }
                            this.form.givenType = this.options[index].value//赠送类型下拉选显示对应的选项


                            let statusIndex = 0;//是否启用下拉选显示对应的选项
                            for(let i in this.showStatus){
                                if(this.showStatus[i].value ==JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.statusValue){
                                    statusIndex=i;
                                    break
                                }
                            }
                            this.form.statusValue = this.showStatus[statusIndex].value//是否启用下拉选显示对应的选项

                            this.changeStartTime = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.createDate//创建时间
                            this.changeEndTime = JSON.parse(Decrypt(data.data.data)).memberCardOpenRules.endDate//endDate
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
                console.log(this.form.cinemaCode);
                console.log(this.form.ruleCode);
                console.log(this.form.ruleName);
                console.log(this.form.ruleMemo);
                console.log(this.form.memberCardType);
                console.log(this.form.cardLevelCode);
                console.log(this.form.cardLevelName);
                console.log(this.form.rechargeAmount);
                console.log(this.form.givenType);
                console.log(this.form.givenMoney);
                console.log(this.form.givenTicketsParams);
                console.log(this.changeStartTime);
                console.log(this.changeEndTime);
                console.log(this.form.statusValue);
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    var jsonArr = [];
                    jsonArr.push({key:"id",value:this.form.id});
                    jsonArr.push({key:"cinemaCode",value:this.form.cinemaCode});
                    jsonArr.push({key:"ruleCode",value:this.form.ruleCode});
                    jsonArr.push({key:"ruleName",value:this.form.ruleName});
                    jsonArr.push({key:"ruleMemo",value:this.form.ruleMemo});
                    jsonArr.push({key:"memberCardType",value:this.form.memberCardType});
                    jsonArr.push({key:"cardLevelCode",value:this.form.cardLevelCode});
                    jsonArr.push({key:"cardLevelName",value:this.form.cardLevelName});
                    jsonArr.push({key:"rechargeAmount",value:parseInt(this.form.rechargeAmount).toFixed(2)});
                    jsonArr.push({key:"givenType",value:this.form.givenType});
                    jsonArr.push({key:"givenMoney",value:parseInt(this.form.rechargeAmount).toFixed(2)});
                    jsonArr.push({key:"givenTicketsParams",value:this.form.givenTicketsParams});
                    jsonArr.push({key:"startDate",value:this.changeStartTime});
                    jsonArr.push({key:"endDate",value:this.changeEndTime});
                    jsonArr.push({key:"status",value:this.form.statusValue});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    console.log(jsonArr);
                    let params = ParamsAppend(jsonArr);
                    console.log(params);
                    this.editVisible = false;
                    https.fetchPost('/openCardRule/modifyOpenCardRule',params).then((data) => {
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
                }, 500);
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


