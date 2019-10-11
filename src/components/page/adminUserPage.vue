<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商家账号管理
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
                <el-table-column prop="name" label="用户名">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">{{scope.row.createDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="描述">
                    <template slot-scope="scope">{{scope.row.memo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="真实姓名">
                    <template slot-scope="scope">{{scope.row.realName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="呼叫号码">
                    <template slot-scope="scope">{{scope.row.callNumber}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影院公司名">
                    <template slot-scope="scope">{{scope.row.businessName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="影院编码">
                    <template slot-scope="scope">{{scope.row.cinemaCodes}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="登陆时间">
                    <template slot-scope="scope">{{scope.row.loginDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="登录IP">
                <template slot-scope="scope">{{scope.row.loginIp}}</template>
            </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'" type='success'
                        >成功</el-tag>
                        <el-tag v-else type='danger'
                        >未通过</el-tag>
                    </template>
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
        <el-dialog title="新增角色" :visible.sync="dialogFormVisible">
            <el-form v-model="oForm">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.userName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.userPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="oForm.value" placeholder="请选择状态">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="真实姓名" :label-width="formLabelWidth">
                    <el-input style="width: 250px" maxlength="9" v-model.number="oForm.realName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="呼叫号码" :label-width="formLabelWidth">
                    <el-input style="width: 250px" maxlength="18" v-model.number="oForm.callNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影院公司名" :label-width="formLabelWidth">
                    <el-select v-model="selectList.businessCode" >
                        <el-option
                                v-for="item in selectList"
                                :key="item.businessCode"
                                :label="item.businessName"
                                :value="item.businessCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input style="width: 250px" maxlength="9" v-model.number="oForm.memo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" :label-width="formLabelWidth">
                    <el-tree
                            ref="tree"
                            :data="data"
                            show-checkbox
                            node-key="id"
                            :default-expanded-keys="[2, 3]"
                            :default-checked-keys="[5]"
                            :props="defaultProps">
                    </el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="getCheckedKeys">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="userName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="selectValue">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="真实姓名" :label-width="formLabelWidth">
                    <el-input style="width: 250px"  maxlength="9" v-model="form.realName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="呼叫号码" :label-width="formLabelWidth">
                    <el-input style="width: 250px"  maxlength="18" v-model="form.callNumber" autocomplete="off"></el-input>
                </el-form-item >
                <el-form-item label="影院公司名" :label-width="formLabelWidth">
                    <el-select v-model="selectCode">
                        <el-option
                                v-for="item in businessInfoList"
                                :key="item.businessCode"
                                :label="item.businessName"
                                :value="item.businessCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input style="width: 250px"  maxlength="9" v-model="form.memo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" :label-width="formLabelWidth">
                    <el-tree
                            ref="tree"
                            :data="data"
                            show-checkbox
                            node-key="id"
                            :default-expanded-keys="expandedKeys"
                            :default-checked-keys="checkedKeys"
                            :props="defaultProps">
                    </el-tree>
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
                checkedKeys:[],//自动勾选的树级菜单栏目
                expandedKeys:[],//自动展开的树级菜单栏目
                data: [],//树级菜单
                defaultProps: {//数级菜单配置
                    children: 'submenuList',
                    label: 'menuName'
                },
                userName:'',
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
                    userName: '',
                    userPass: '',
                    value: '',
                    realName: '',
                    callNumber: '',
                    businessCode: '',
                    memo: '',
                },
                selectList:[],
                formLabelWidth: '120px',
                selectValue:{},
                selectCode:{},
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
                businessInfoList:[],
                value: ''
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
                    https.fetchPost('/user/addAdminPage','').then((data) => {
                        console.log(data);
                        if(data.data.code == 'success'){
                            this.oForm=[]
                            this.dialogFormVisible = true
                            // console.log(JSON.parse(JSON.stringify(JSON.parse(Decrypt(data.data.data)).permissionList).replace(/submenuList/g,'children').replace(/menuName/g,'label')));
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            this.data=JSON.parse(Decrypt(data.data.data)).permissionList
                            this.selectList =JSON.parse(Decrypt(data.data.data)).businessInfoList
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
            getCheckedKeys() {//新增数据操作
                // console.log(this.$refs.tree.getCheckedKeys());
                // console.log(this.$refs.tree.getHalfCheckedKeys());
                // console.log(this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()));
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    var jsonArr = [];
                    jsonArr.push({key:"userName",value:this.oForm.userName});
                    jsonArr.push({key:"userPass",value:this.oForm.userPass});
                    jsonArr.push({key:"status",value:this.oForm.value});
                    jsonArr.push({key:"memo",value:this.oForm.memo});
                    jsonArr.push({key:"realName",value:this.oForm.realName});
                    jsonArr.push({key:"callNumber",value:this.oForm.callNumber});
                    jsonArr.push({key:"businessCode",value:this.selectList.businessCode});
                    jsonArr.push({key:"menuIds",value:this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    let params = ParamsAppend(jsonArr);
                    if(this.dialogFormVisible == true){
                        https.fetchPost('/user/addAdminUser',params).then((data) => {//新增
                            console.log(data);
                            if(data.data.code=='success'){
                                this.dialogFormVisible = false
                                this.$message.success(`新增成功`);
                                // this.oForm.name = ''
                                // this.oForm.value = ''
                                // this.oForm.memo = ''
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
                    // let name=this.query.name
                    // let status=this.query.status
                    // if(!name){
                    //     name=''
                    // }
                    // if(!status){
                    //     status=''
                    // }
                    let jsonArr = [];
                    jsonArr.push({key:"id",value:row.id});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    let params = ParamsAppend(jsonArr);
                    https.fetchPost('/user/deleteAdminUser',params).then((data) => {
                        console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if(data.data.code=='success'){
                            this.$message.error(`删除了`);
                            this.getMenu()
                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message
                            this.open()
                            this.$router.push('/login');
                        }
                        else{
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
                    https.fetchPost('/user/modifyAdminPage',params).then((data) => {
                        console.log(data);
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if(data.data.code=='success'){
                            this.editVisible = true;
                            this.form.id=row.id;
                            this.userName = JSON.parse(Decrypt(data.data.data)).userInfo.userName
                            this.form.realName = JSON.parse(Decrypt(data.data.data)).userInfo.realName
                            this.form.callNumber = JSON.parse(Decrypt(data.data.data)).userInfo.callNumber
                            this.form.memo = JSON.parse(Decrypt(data.data.data)).userInfo.memo
                            // this.form.businessCode = JSON.parse(Decrypt(data.data.data)).userInfo.businessCode
                            this.expandedKeys = JSON.parse(Decrypt(data.data.data)).openPermissionIds
                            this.checkedKeys =JSON.parse(Decrypt(data.data.data)).exitPermissionIds
                            this.data=JSON.parse(Decrypt(data.data.data)).permissionList //权限数据
                            this.businessInfoList = JSON.parse(Decrypt(data.data.data)).businessInfoList //定义下拉选的内容
                            let _index = 0;  //下拉选显示对应的选项
                            for(let x in this.options){
                                if(this.options[x].value==JSON.parse(Decrypt(data.data.data)).userInfo.status){
                                    _index=x;
                                    break;
                                }
                            }
                            this.selectValue = this.options[_index].value;

                            let oIndex = 0;  //下拉选显示对应的选项
                            for(let i in this.businessInfoList){
                                if(this.businessInfoList[i].businessCode==JSON.parse(Decrypt(data.data.data)).userInfo.businessCode){
                                    oIndex=i;
                                    break;
                                }
                            }
                            this.selectCode = this.businessInfoList[oIndex].businessCode;


                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message
                            this.open()
                            this.$router.push('/login');
                        }
                        else{
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
            // 修改操作
            exChanger() {
                // console.log(this.$refs.tree.getCheckedKeys());
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
                    jsonArr.push({key:"userName",value:this.userName});
                    jsonArr.push({key:"status",value:this.selectValue});
                    // jsonArr.push({key:"userCode",value:this.form.userCode});
                    jsonArr.push({key:"realName",value:this.form.realName});
                    jsonArr.push({key:"callNumber",value:this.form.callNumber});
                    jsonArr.push({key:"memo",value:this.form.memo});
                    jsonArr.push({key:"businessCode",value:this.selectCode});
                    jsonArr.push({key:"menuIds",value:this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    console.log(jsonArr)
                    let params = ParamsAppend(jsonArr);
                    this.editVisible = false;
                    https.fetchPost('/user/modifyAdminUser',params).then((data) => {
                        console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if(data.data.code=='success'){
                            this.$message.success(`编辑成功`);
                            this.getMenu()
                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message
                            this.open()
                            this.$router.push('/login');
                        }
                        else{
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
                    let businessCode=this.query.businessCode
                    let userName=this.query.userName
                    let status=this.query.status
                    if(!businessCode){
                        businessCode=''
                    }
                    if(!userName){
                        userName=''
                    }
                    if(!status){
                        status=''
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"businessCode",value:businessCode});
                    jsonArr.push({key:"userName",value:userName});
                    jsonArr.push({key:"status",value:status});
                    jsonArr.push({key:"pageNo",value:this.query.pageNo});
                    jsonArr.push({key:"pageSize",value:this.query.pageSize});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/user/businessUserPage',params).then((data) => {
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
