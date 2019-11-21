<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色权限管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input class="mr10" placeholder="名称" v-model="query.name" autocomplete="off"></el-input>
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="正常" value="1"></el-option>
                    <el-option key="2" label="禁用" value="2"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="角色名" width="150">
                    <template slot-scope="scope">{{scope.row.roleName}}</template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">{{scope.row.createDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="描述">
                    <template slot-scope="scope">{{scope.row.memo}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="110">
                    <template slot-scope="scope">{{scope.row.sort}}</template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="110">
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
                                icon="el-icon-search"
                                @click="viewRolePermission(scope.$index, scope.row)"
                        >查看</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
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
        <!--查看弹出框-->
        <el-dialog title="查看" :visible.sync="viewVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="权限" >
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
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="权限" >
                    <el-tree
                            ref="tree_"
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
                data: [],//树级菜单数据
                defaultProps: {//数级菜单配置
                    children: 'submenuList',
                    label: 'menuName'
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
                viewVisible:false,
                editVisible: false,
                pageTotal: 0,
                form: {
                    memo: '',
                    sort: '',
                    id:'',
                },
                idx: -1,
                id: -1,
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
            viewRolePermission(index, row){ //获取查看页面数据
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
                    https.fetchPost('/role/viewRolePermission',params).then((data) => {
                        loading.close();
                        console.log(data);
                        if(data.data.data){
                            console.log(JSON.parse(Decrypt(data.data.data)));
                        }
                        if(data.data.code=='success'){
                            this.viewVisible = true
                            this.expandedKeys = JSON.parse(Decrypt(data.data.data)).openPermissionIds
                            this.checkedKeys =JSON.parse(Decrypt(data.data.data)).exitPermissionIds
                            this.data=JSON.parse(Decrypt(data.data.data)).existMenus //权限数据

                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message
                            this.open()
                            this.$router.push('/login');
                        }else{
                            console.log(1);
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
                    https.fetchPost('/role/permissionForRolePage',params).then((data) => {
                        loading.close();
                        console.log(data);
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if(data.data.code=='success'){
                            this.editVisible = true;
                            this.expandedKeys = JSON.parse(Decrypt(data.data.data)).openPermissionIds
                            this.checkedKeys =JSON.parse(Decrypt(data.data.data)).exitPermissionIds
                            this.data=JSON.parse(Decrypt(data.data.data)).permissionList //权限数据
                            // this.oName=JSON.parse(Decrypt(data.data.data)).roleName;
                            // this.form.sort=JSON.parse(Decrypt(data.data.data)).sort;
                            // this.form.memo=JSON.parse(Decrypt(data.data.data)).memo;
                            // this.form.id=row.id;
                            // this.value=JSON.parse(Decrypt(data.data.data)).status;
                            // let _index = 0;
                            // for(let x in this.options){
                            //     if(this.options[x].value==JSON.parse(Decrypt(data.data.data)).status){
                            //         _index=x;
                            //         break;
                            //     }
                            // }
                            // this.selectValue = this.options[_index].value;

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
                    console.log(this.$refs.tree_.getCheckedKeys());
                    var jsonArr = [];
                    jsonArr.push({key:"id",value:this.form.id});
                    jsonArr.push({key:"permissionIds",value:this.$refs.tree_.getCheckedKeys().concat(this.$refs.tree_.getHalfCheckedKeys())});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    let params = ParamsAppend(jsonArr);
                    this.editVisible = false;
                    https.fetchPost('/role/permissionForRole',params).then((data) => {
                        loading.close();
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
                        loading.close();
                        console.log(err)
                        }
                    )
                }, 500);
            },
            Search(){//搜索操作
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
                    https.fetchPost('/role/rolePermission',params).then((data) => {
                        loading.close();
                        // console.log(data);
                        if(data.data.code=='success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
                            this.tableData = oData.pageResult.data;
                            this.query.pageSize = oData.pageResult.pageSize;
                            this.query.pageNo = oData.pageResult.pageNo;
                            this.query.totalCount = oData.pageResult.totalCount;
                            this.query.totalPage = oData.pageResult.totalPage
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
