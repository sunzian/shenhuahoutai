<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="角色名" class="handle-input mr10"></el-input>
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="正常" value="1"></el-option>
                    <el-option key="2" label="禁用" value="2"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button type="primary"  @click="addPage" icon="el-icon-circle-plus-outline" style="float: right;margin-top: 10px">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                highlight-current-row
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="角色名">
                    <template slot-scope="scope">{{scope.row.roleName}}</template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">{{scope.row.createDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="描述">
                    <template slot-scope="scope">{{scope.row.memo}}</template>
                </el-table-column>
                <!--<el-table-column prop="sort" label="排序">-->
                    <!--<template slot-scope="scope">{{scope.row.sort}}</template>-->
                <!--</el-table-column>-->
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'" type='success'
                        >正常</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'" type='danger'
                        >禁用</el-tag>
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
        <el-dialog :close-on-click-modal="false" title="新增角色" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="角色名" :label-width="formLabelWidth">
                    <el-input style="width: 250px" maxlength="10" show-word-limit v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input maxlength="30" type="textarea"
                              :rows="2" show-word-limit v-model="oForm.memo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="状态" :label-width="formLabelWidth">
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
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="角色名" :label-width="formLabelWidth">
                    <el-input style="width: 250px" maxlength="10" show-word-limit v-model="oName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input maxlength="30" type="textarea"
                              :rows="2" show-word-limit v-model="form.memo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="状态" :label-width="formLabelWidth">
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
                pageSize:15

            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {
                memo: '',
                id:'',
            },
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            oForm: {
                name: '',
                memo: '',
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
                label: '正常'
            }, {
                value: '2',
                label: '禁用'
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
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                https.fetchPost('/role/addPage','').then((data) => {
                    loading.close();
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
                    loading.close();
                    console.log(err)
                    }
                )
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
                jsonArr.push({key:"roleName",value:this.oForm.name});
                jsonArr.push({key:"status",value:this.oForm.value});
                jsonArr.push({key:"memo",value:this.oForm.memo});
                let sign =md5(preSign(jsonArr));
                jsonArr.push({key:"sign",value:sign});
                let params = ParamsAppend(jsonArr);
                if(this.dialogFormVisible == true){
                    https.fetchPost('/role/addRole',params).then((data) => {//新增
                        loading.close();
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
                        loading.close();
                        console.log(err)
                        }
                    )
                }
            }, 500);
        },
        delChange(index, row){//删除数据
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
                            loading.close();
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
                                loading.close();
                                console.log(err)
                            }
                        )
                    }, 500);
                }) .catch(() => {
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
            setTimeout(() => {
                this.idx = index;
                this.form = row;
                var jsonArr = [];
                jsonArr.push({key:"id",value:row.id});
                let sign =md5(preSign(jsonArr));
                jsonArr.push({key:"sign",value:sign});
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/role/modifyPage',params).then((data) => {
                    loading.close();
                    if(data.data.code=='success'){
                        this.editVisible = true;
                        this.oName=JSON.parse(Decrypt(data.data.data)).roleName;
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
                    loading.close();
                    console.log(err)
                    }
                )
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
                var jsonArr = [];
                jsonArr.push({key:"id",value:this.form.id});
                jsonArr.push({key:"roleName",value:this.oName});
                jsonArr.push({key:"memo",value:this.form.memo});
                jsonArr.push({key:"status",value:this.selectValue});
                let sign =md5(preSign(jsonArr));
                jsonArr.push({key:"sign",value:sign});
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/role/modifyRole',params).then((data) => {
                    loading.close();
                    if(data.data.code=='success'){
                        this.editVisible = false;
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
                    loading.close();
                    console.log(err)
                    }
                )
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
                https.fetchPost('/role/rolePage',params).then((data) => {
                    loading.close();
                    if(data.data.code=='success') {
                        var oData = JSON.parse(Decrypt(data.data.data));
                        this.tableData = oData.data;
                        console.log(JSON.parse(Decrypt(data.data.data)))
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
                    loading.close();
                    console.log(err)
                    }
                )
            }, 500);
        },
        open() {     //信息提示弹出框
            this.$alert(this.message, '信息提示', {
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
