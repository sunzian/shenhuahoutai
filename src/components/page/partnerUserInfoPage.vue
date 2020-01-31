<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商户账号设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- <div class="handle-box">
                <el-input placeholder="用户名" class="mr10" v-model="query.userName" autocomplete="off"></el-input>
                <el-input placeholder="真实姓名" class="mr10" v-model="query.realName" autocomplete="off"></el-input>
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="正常" value="1"></el-option>
                    <el-option key="2" label="禁用" value="2"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >新增</el-button>
            </div> -->
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                highlight-current-row
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="用户名" width="130">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="真实姓名" width="140">
                    <template slot-scope="scope">{{scope.row.realName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="描述" width="180">
                    <template slot-scope="scope">{{scope.row.memo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="联系方式" width="130">
                    <template slot-scope="scope">{{scope.row.callNumber}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="商户名" width="130">
                    <template slot-scope="scope">{{scope.row.businessName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="登陆时间" width="160">
                    <template slot-scope="scope">{{scope.row.loginDate}}</template>
                </el-table-column>
                <el-table-column label="创建时间" width="160">
                    <template slot-scope="scope">{{scope.row.createDate}}</template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'" type="success">正常</el-tag>
                        <el-tag v-else-if="scope.row.status=='2'" type="danger">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center"  fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="UserPassword(scope.$index, scope.row)"
                        >密码设置</el-button>
                        <el-button
                            v-if="scope.row.adminFlag !='1'"
                            type="text"
                            icon="el-icon-edit"
                            @click="addChange(scope.$index, scope.row)"
                        >修改</el-button>
                        <!-- <el-button
                            v-if="scope.row.adminFlag !='1'"
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="delChange(scope.$index, scope.row)"
                        >删除</el-button> -->
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
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="用户名" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="userName" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item :required="true" label="状态" :label-width="formLabelWidth">
                    <el-select v-model="selectValue" disabled>
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="真实姓名" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        maxlength="9"
                        v-model="form.realName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="联系电话" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        maxlength="18"
                        onkeyup="this.value=this.value.replace(/[^0-9-]+/,'')"
                        v-model="form.callNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        maxlength="50"
                        v-model="form.memo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    v-if="partnerCode"
                    label="所属商户："
                    :label-width="formLabelWidth"
                    :required="true"
                    >
                    <el-input
                        style="width: 250px"
                        v-model="partnerName"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改密码弹出框 -->
        <el-dialog :close-on-click-modal="false" title="修改密码" :visible.sync="passShow">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="旧密码" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        style="width: 250px"
                        placeholder="密码长度最高16位"
                        maxlength="16"
                        v-model="oldPass"
                        autocomplete="off"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="新密码" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        style="width: 250px"
                        placeholder="密码长度最高16位"
                        maxlength="16"
                        v-model="newPass"
                        autocomplete="off"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="确认密码" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        style="width: 250px"
                        placeholder="密码长度最高16位"
                        maxlength="16"
                        v-model="surePass"
                        autocomplete="off"
                        show-password
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="passShow = false">取 消</el-button>
                <el-button type="primary" @click="surePassword">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 选择商户弹出窗 -->
        <el-dialog :close-on-click-modal="false" title="选择商户" :visible.sync="drawerPartner">
            <div class="container">
                <div class="handle-box">
                    <el-input
                        v-model="query.partnerName"
                        placeholder="商户名称"
                        class="handle-input mr12"
                        style="width: 250px;margin-right:10px;"
                        @input="changePartnerName($event)"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="getPartner">搜索</el-button>
                </div>
                <el-table
                    :data="partnerList"
                    border
                    class="table"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="partnerCode" :label="scope.row.partnerCode">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="商户名称" width="150">
                        <template slot-scope="scope">{{scope.row.partnerName}}</template>
                    </el-table-column>
                    <el-table-column label="门店地址">
                        <template slot-scope="scope">{{scope.row.address}}</template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        background
                        @size-change="bHandleSizeChange"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="query.oPageNo"
                        :page-sizes="[10, 15, 20, 30]"
                        :page-size="query.oPageSize"
                        :total="query.oTotalCount"
                        @current-change="oCurrentChange"
                        @prev-click="oPrev"
                        @next-click="oNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawerPartner = false">取 消</el-button>
                <el-button type="primary" @click="surePartner(partnerCode)">确 定</el-button>
            </div>
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
                oldPass:'',//旧密码
                newPass:'',//新密码
                surePass:'',//确认密码
                passShow:false,//修改密码页面
                drawer: false,//新增抽屉弹出框
                checkAll: false,
                drawerPartner: false,
                checkedCities: [],
                oCheckedCities:[],
                cities: [],//增加页面影院
                oCities: [],//修改页面影院
                isIndeterminate: true,
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
                    pageSize:15
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                partnerList: [],
                editVisible: false,
                pageTotal: 0,
                form: {
                    realName: '',
                    callNumber: '',
                    memo: '',
                    sort: '',
                    id:'',
                },
                partnerCode: '',
                partnerName: '',
                idx: -1,
                id: -1,
                dialogFormVisible: false,
                oForm: {
                    userName: '',
                    userPass: '',
                    value: '1',
                    realName: '',
                    callNumber: '',
                    memo: '',
                    partnerCode: ''
                },
                selectList:[],//新增角色
                oSelectList:[],//修改角色
                formLabelWidth: '120px',
                selectValue:{},
                selectCode:{},
                options: [{
                    value: '1',
                    label: '正常'
                },
                {
                    value: '2',
                    label: '禁用'
                }],
            businessInfoList: [],
            value: ''
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        UserPassword(index, row) {
            //校验修改密码权限
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
                https
                    .fetchPost('/cinemaPartner/updateUserPasswordPage', '')
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.oldPass = '';
                            this.newPass = '';
                            this.surePass = '';
                            this.form.id = row.id;
                            this.passShow = true;
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
        surePassword() {
            //确认修改密码
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                if (this.newPass == '' || this.surePass == '' || this.oldPass == '') {
                    this.message = '请输入密码';
                    this.open();
                    loading.close();
                    return
                }
                if (this.newPass != this.surePass) {
                    this.message = '两次密码输入不一致';
                    this.open();
                    loading.close();
                    return
                }
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: this.form.id });
                jsonArr.push({ key: 'oldPassword', value: this.oldPass });
                jsonArr.push({ key: 'newPassword', value: this.newPass });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                this.passShow = false;
                https
                    .fetchPost('/cinemaPartner/updateUserPassword', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.$message.success(`密码修改成功`);
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
            }, 500);
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
            setTimeout(() => {
                https
                    .fetchPost('/cinemaPartner/addPartnerUserPage', '')
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = true;
                            this.partnerCode = '';
                            this.partnerName = '';
                        } else if (data.data.code == 'nologin') {
                            this.message = data.data.message;
                            this.open();
                            this.$router.push('/login');
                        } else {
                            this.message = data.data.message;
                            this.open();
                        }
                        }
                    )
                }, 500);
            },
        getCheckedKeys() {//新增数据操作
            const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
            if(!this.oForm.userName){
                this.message = '用户名不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.oForm.userPass){
                this.message = '密码不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.oForm.value){
                this.message = '状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.oForm.realName){
                this.message = '真实姓名不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.oForm.callNumber){
                this.message = '联系电话不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.callNumber.length!=11){
                this.message = '请输入正确的联系电话！';
                this.open();
                loading.close();
                return;
            }
            if(this.partnerCode==''){
                this.message = '所选商户不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            var jsonArr = [];
            jsonArr.push({key:"userName",value:this.oForm.userName});
            jsonArr.push({key:"userPass",value:this.oForm.userPass});
            jsonArr.push({key:"status",value:this.oForm.value});
            jsonArr.push({key:"memo",value:this.oForm.memo});
            jsonArr.push({key:"realName",value:this.oForm.realName});
            jsonArr.push({key:"callNumber",value:this.oForm.callNumber});
            jsonArr.push({key:"cinemaCodes",value:this.partnerCode});
            let sign =md5(preSign(jsonArr));
            jsonArr.push({key:"sign",value:sign});
            let params = ParamsAppend(jsonArr);
            if(this.dialogFormVisible == true){
                https.fetchPost('/cinemaPartner/addPartnerUser',params).then((data) => {//新增
                        loading.close();
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.oForm.value='1';
                            this.oForm.userName='';
                            this.oForm.userPass='';
                            this.oForm.memo='';
                            this.oForm.realName='';
                            this.oForm.callNumber='';
                            this.partnerCode = '';
                            this.partnerName = '';
                            this.getMenu();
                        } else if (data.data.code == 'nologin') {
                            this.message = data.data.message;
                            this.open();
                            this.$router.push('/login');
                        } else {
                            this.message = data.data.message;
                            this.open();
                        }
                    }
                )
            }
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
                            let jsonArr = [];
                            jsonArr.push({key:"id",value:row.id});
                            let sign =md5(preSign(jsonArr));
                            jsonArr.push({key:"sign",value:sign});
                            let params = ParamsAppend(jsonArr);
                            https.fetchPost('/cinemaPartner/deletePartnerUser',params).then((data) => {
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
                        }, 500);
                    })  .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        addChange(index, row) {
            //是否修改权限
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                // this.idx = index;
                // this.form = row;
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: row.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/cinemaPartner/modifyPartnerUserPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            console.log(JSON.parse(Decrypt(data.data.data)))
                            this.editVisible = true;
                            this.form.id = row.id;
                            this.userName = JSON.parse(Decrypt(data.data.data)).partnerUser.userName;
                            this.form.realName = JSON.parse(Decrypt(data.data.data)).partnerUser.realName;
                            this.form.callNumber = JSON.parse(Decrypt(data.data.data)).partnerUser.callNumber;
                            this.form.memo = JSON.parse(Decrypt(data.data.data)).partnerUser.memo;
                            // 下拉选显示对应的选项
                            for (let x in this.options) {
                                if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).partnerUser.status) {
                                    this.selectValue = this.options[x].value;
                                    break;
                                }
                            }
                            this.partnerName = JSON.parse(Decrypt(data.data.data)).partner.partnerName;
                            this.partnerCode = JSON.parse(Decrypt(data.data.data)).partner.partnerCode;
                        } else if (data.data.code == 'nologin') {
                            this.message = data.data.message;
                            this.open();
                            this.$router.push('/login');
                        } else {
                            this.message = data.data.message;
                            this.open();
                        }
                    }).catch(err=>{
                        loading.close();
                        console.log(err)
                        }
                    )
                }, 500);
            },
            // 修改操作
        exChanger() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if(!this.userName){
                this.message = '用户名不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.selectValue){
                this.message = '状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.form.realName){
                this.message = '真实姓名不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(!this.form.callNumber){
                this.message = '联系电话不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.form.callNumber.length!=11){
                this.message = '请输入正确的联系电话！';
                this.open();
                loading.close();
                return;
            }
            if(this.partnerCode==''){
                this.message = '所选商户不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            var jsonArr = [];
            jsonArr.push({key:"id",value:this.form.id});
            jsonArr.push({key:"userName",value:this.userName});
            jsonArr.push({key:"status",value:this.selectValue});
            jsonArr.push({key:"realName",value:this.form.realName});
            jsonArr.push({key:"callNumber",value:this.form.callNumber});
            jsonArr.push({key:"memo",value:this.form.memo});
            jsonArr.push({key:"cinemaCodes",value:this.partnerCode});
            let sign =md5(preSign(jsonArr));
            jsonArr.push({key:"sign",value:sign});
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https.fetchPost('/cinemaPartner/modifyPartnerUser',params).then((data) => {
                loading.close();
                if (data.data.code == 'success') {
                    this.$message.success(`编辑成功`);
                    this.getMenu();
                    this.editVisible = false;
                } else if (data.data.code == 'nologin') {
                    this.message = data.data.message;
                    this.open();
                    this.$router.push('/login');
                } else{
                    this.message=data.data.message
                    this.open()
                }
            }).catch(err=>{
                loading.close();
                console.log(err)
                }
            )
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
                    let realName=this.query.realName;
                    let userName=this.query.userName;
                    let status=this.query.status;
                    if(!realName){
                        realName=''
                    }
                    if(!userName){
                        userName=''
                    }
                    if(!status){
                        status=''
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"realName",value:realName});
                    jsonArr.push({key:"userName",value:userName});
                    jsonArr.push({key:"status",value:status});
                    jsonArr.push({key:"pageNo",value:this.query.pageNo});
                    jsonArr.push({key:"pageSize",value:this.query.pageSize});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/cinemaPartner/getPartnerUser',params).then((data) => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.tableData = oData;
                            // this.query.pageSize = oData.pageResult.pageSize;
                            // this.query.pageNo = oData.pageResult.pageNo;
                            // this.query.totalCount = oData.pageResult.totalCount;
                            // this.query.totalPage = oData.pageResult.totalPage;
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
        // 获取所有商户
        getPartner() {
            let partnerName = this.query.partnerName;
            if (!partnerName) {
                partnerName = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'partnerName', value: partnerName });
            jsonArr.push({ key: 'pageNo', value: this.query.oPageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.oPageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinemaPartner/getPartnerPage', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.query.partnerName = '';
                        this.partnerList = res.data;
                        this.query.oPageSize = res.pageSize;
                        this.query.oPageNo = res.pageNo;
                        this.query.oTotalCount = res.totalCount;
                        this.query.oTotalPage = res.totalPage;
                        this.drawerPartner = true;
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
        changePartnerName(e) {
            this.$forceUpdate();
        },
        surePartner(id) {
            this.partnerCode = id;
            for (let i = 0; i < this.partnerList.length; i++) {
                if (this.partnerList[i].partnerCode == this.partnerCode) {
                    this.partnerName = this.partnerList[i].partnerName;
                }
            }
            this.drawerPartner = false;
        },
        deletPartner() {
            this.partnerCode = '';
            this.partnerName = '';
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            this.query.pageSize=val;
            this.getMenu()
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
        bHandleSizeChange(val) {
            this.query.bPageSize = val;
            this.changeCoupon();
        },
        oCurrentChange(val) {
            //点击选择具体页数
            this.query.oPageNo = val;
            this.getPartner();
        },
        oPrev() {
            //分页按钮上一页
            this.query.oPageNo--;
            this.getPartner();
        },
        oNext() {
            //分页按钮下一页
            this.query.oPageNo++;
            this.getPartner();
        },
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
