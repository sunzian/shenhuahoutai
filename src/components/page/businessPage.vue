<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商家管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="商家名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button type="primary"  @click="addPage" icon="el-icon-circle-plus-outline"  style="margin-left: 730px">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="商家名称">
                    <template slot-scope="scope">{{scope.row.businessName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="商家描述">
                    <template slot-scope="scope">{{scope.row.businessMemo}}</template>
                </el-table-column>
                <el-table-column label="商家logo">
                    <template slot-scope="scope">{{scope.row.businessLogo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="商家电话">
                    <template slot-scope="scope">{{scope.row.businessMobile}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="金币过期年数">
                    <template slot-scope="scope">{{scope.row.goldExpireYears}}</template>
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
        <el-dialog title="新增角色" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="角色名" :label-width="formLabelWidth">
                    <el-input style="width: 250px" maxlength="10" show-word-limit v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input maxlength="30" type="textarea"
                              :rows="2" show-word-limit v-model="oForm.memo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input style="width: 150px" maxlength="9" v-model.number="oForm.sort" autocomplete="off"></el-input>
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="角色名">
                    <el-input style="width: 250px" maxlength="10" show-word-limit v-model="oName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" >
                    <el-input maxlength="30" type="textarea"
                              :rows="2" show-word-limit v-model="form.memo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" >
                    <el-input style="width: 250px" min="1"  maxlength="7" v-model="form.sort" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="selectValue">
                        <el-option
                                v-for="item in options"
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
                https.fetchPost('/role/addPage','').then((data) => {
                    console.log(data);
                    if(data.data.code == 'success'){
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
            },
            addRole(){ //新增按钮操作
                var jsonArr = [];
                jsonArr.push({key:"roleName",value:this.oForm.name});
                jsonArr.push({key:"status",value:this.oForm.value});
                jsonArr.push({key:"memo",value:this.oForm.memo});
                jsonArr.push({key:"sort",value:this.oForm.sort});
                let sign =md5(preSign(jsonArr));
                jsonArr.push({key:"sign",value:sign});
                let params = ParamsAppend(jsonArr);
                if(this.dialogFormVisible == true){
                    https.fetchPost('/role/addRole',params).then((data) => {//新增
                        // console.log(data);
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
            },
            delChange(index, row){//删除数据
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
                jsonArr.push({key:"roleName",value:name});
                jsonArr.push({key:"status",value:status});
                jsonArr.push({key:"id",value:row.id});
                let sign =md5(preSign(jsonArr));
                jsonArr.push({key:"sign",value:sign});
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/role/deleteRole',params).then((data) => {
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
            },
            addChange(index, row){//是否修改权限
                this.idx = index;
                this.form = row;
                var jsonArr = [];
                jsonArr.push({key:"id",value:row.id});
                let sign =md5(preSign(jsonArr));
                jsonArr.push({key:"sign",value:sign});
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/role/modifyPage',params).then((data) => {
                    // console.log(data);
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if(data.data.code=='success'){
                        this.editVisible = true;
                        this.oName=JSON.parse(Decrypt(data.data.data)).roleName;
                        this.form.sort=JSON.parse(Decrypt(data.data.data)).sort;
                        this.form.memo=JSON.parse(Decrypt(data.data.data)).memo;
                        this.form.id=row.id;
                        this.value=JSON.parse(Decrypt(data.data.data)).status;
                        let _index = 0;
                        for(let x in this.options){
                            if(this.options[x].value==JSON.parse(Decrypt(data.data.data)).status){
                                _index=x;
                                break;
                            }
                        }
                        this.selectValue = this.options[_index].value;

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
            },
            // 编辑操作
            exChanger() {
                console.log(this.form.sort);
                // console.log(this.from.sort.toString());
                var jsonArr = [];
                jsonArr.push({key:"id",value:this.form.id});
                jsonArr.push({key:"roleName",value:this.oName});
                jsonArr.push({key:"sort",value:''+this.form.sort+''});
                jsonArr.push({key:"memo",value:this.form.memo});
                jsonArr.push({key:"status",value:this.selectValue});
                let sign =md5(preSign(jsonArr));
                jsonArr.push({key:"sign",value:sign});
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                console.log(params);
                this.editVisible = false;
                https.fetchPost('/role/modifyRole',params).then((data) => {
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
            },
            Search(){
                this.query.pageNo=1
                this.getMenu()
            },
            getMenu(){//获取菜单栏
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
                https.fetchPost('/businessInfo/businessInfoPage',params).then((data) => {
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

