<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 签到送金币规则设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--签到规则页面-->
        <div class="container">
            <el-form ref="form1" :model="form1">
                <!-- <el-form-item label="连续签到天数" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form1.days"
                            autocomplete="off"
                            :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="连续签到奖励" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form1.oGoldAward"
                            autocomplete="off"
                    ></el-input>
                </el-form-item> -->
                <el-form-item :required="true" label="签到规则说明" :label-width="formLabelWidth">
                    <el-input style="width: 250px;" type="textarea" maxlength="50" show-word-limit v-model="form1.oSignTips" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                    v-if="showRule"
            >
                <el-table-column prop="name" label="连续签到天数">
                    <template slot-scope="scope">{{scope.row.continuousDays}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="奖励金币数量">
                    <template slot-scope="scope">{{scope.row.goldAward}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="!scope.row.id"
                                type="text"
                                icon="el-icon-circle-plus-outline"
                                @click="addChange(scope.$index, scope.row)"
                        >新增</el-button>
                        <el-button v-if="scope.row.id"
                                type="text"
                                icon="el-icon-circle-plus-outline"
                                @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer" style="float:right;margin-top: -10px">
                <el-button style="float: right;margin-top: 10px;" type="primary" @click="exAddChanger">确 定</el-button>
            </span>
        </div>
        <!-- 新增奖项弹出框 -->
        <el-dialog title="新增" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="连续签到天数" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="oContinuousDays"
                            autocomplete="off"
                            :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="奖励金币数量" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="oGoldAward"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oContinuousDays==7" label="是否设置连续7天额外奖励" :label-width="formLabelWidth">
                    <el-radio-group v-model="oExtraFlag">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oExtraFlag==1&&oContinuousDays==7" label="额外奖励的礼物名称" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="oExtraPrizeName"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oExtraFlag==1&&oContinuousDays==7" label="额外奖励的礼物图片" :label-width="formLabelWidth">
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            ref="download"
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
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb 建议尺寸150*150或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" v-if="oExtraFlag==1&&oContinuousDays==7" label="领取后几天过期" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="oExpireDays"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oExtraFlag==1&&oContinuousDays==7" label="额外奖励的礼物类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="oExtraPrizeType">
                        <el-radio label="1">优惠券</el-radio>
                        <el-radio label="2">实物</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oExtraPrizeType==1&&oContinuousDays==7" label="选择优惠券" :label-width="formLabelWidth">
                    <el-button type="primary" @click="getAllCoupon">选择优惠券</el-button>
                </el-form-item>
                <el-form-item :required="true" v-if="oExtraPrizeType==1&&oContinuousDays==7" label="所选优惠券：" :label-width="formLabelWidth">
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
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
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="couponInfo.id" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠券类型">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.couponType=='1'">影票优惠券</el-tag>
                            <el-tag v-else-if="scope.row.couponType=='2'">卖品优惠券</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠券名称">
                        <template slot-scope="scope">{{scope.row.name}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠券说明">
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
                oContinuousDays:'',
                oGoldAward:'',
                oSignTips:'',
                oExtraFlag:'',
                oExtraPrizeName:'',
                oExtraPrizePicture:'',
                oExpireDays:'',
                oExtraPrizeType:'',
                drawer:false,
                couponName:'',
                showRule: true,
                sellTableData:[],
                type: {
                    type: ''
                },
                message: '', //弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 15
                },
                tableData: [],
                oTableData: [],
                multipleSelection: [],
                editVisible: false,
                pageTotal: 0,
                pForm:{
                    memo: '',
                    sort: '',
                    id: ''
                },
                form: {
                    memo: '',
                    sort: '',
                    id: ''
                },
                form1: {
                    days:'1',
                    sort: '',
                    id: '',
                    oGoldAward: '',
                    oSignTips: '',
                },
                formLabelWidth: '120px',
                value: '',
                timeout: null,
                options: [{
                    value: '0',
                    label: '未启用'
                }, {
                    value: '1',
                    label: '启用'
                }],
                prizeType: [{
                    value: '1',
                    label: '优惠券'
                }, {
                    value: '2',
                    label: '实物'
                }],
                couponInfo: {},
                prizeInfoList:[],
                index:'',
                id:'',
            };
        },
        created() {},
        mounted() {
            this.getMenu();
        },
        methods: {
            beforeUpload() {
                //上传之前
                this.type.type = EncryptReplace('activity');
            },
            unSuccess(data) {
                // console.log(data);
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.download.clearFiles();
                    return;
                }
                this.oExtraPrizePicture = data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            addChange(index,row){
                this.index=index;
                this.oContinuousDays=row.continuousDays;
                this.oGoldAward=row.goldAward;
                if(row.extraFlag==1){
                    this.oExtraFlag='1'
                }
                if(row.extraFlag==2){
                    this.oExtraFlag='2'
                }
                this.oExtraPrizeName=row.extraPrizeName;
                this.oExtraPrizePicture=row.extraPrizePicture;
                this.oExpireDays=row.expireDays;
                if(row.extraPrizeType==1){
                    this.oExtraPrizeType='1'
                }
                if(row.extraPrizeType==2){
                    this.oExtraPrizeType='2'
                }
                this.editVisible=true;
            },
            exChanger() {
                if(!this.oGoldAward){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oContinuousDays==7){
                    if(!this.oExtraFlag){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oContinuousDays==7&&this.oExtraFlag==1){
                    if(!this.oExtraPrizeName||!this.oExtraPrizePicture||!this.oExpireDays||!this.oExtraPrizeType){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if(this.oExtraPrizeType==1){
                        if(!this.couponInfo.couponName){
                            this.message = '必填项不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                }
                this.tableData[this.index].continuousDays=this.oContinuousDays
                this.tableData[this.index].goldAward=this.oGoldAward
                this.tableData[this.index].extraFlag=this.oExtraFlag
                this.tableData[this.index].extraPrizeName=this.oExtraPrizeName
                this.tableData[this.index].extraPrizePicture=this.oExtraPrizePicture
                this.tableData[this.index].extraPrizeType=this.oExtraPrizeType
                this.tableData[this.index].couponId=this.couponInfo.id
                this.tableData[this.index].expireDays=this.oExpireDays
                this.editVisible=false;
            },
            getAllCoupon() {
                // 获取所有优惠券
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
                let jsonArr = [];
                jsonArr.push({ key: 'simpleType', value: 1 });
                jsonArr.push({ key: 'name', value: name });
                jsonArr.push({ key: 'status', value: 1 });
                jsonArr.push({ key: 'cinemaCodes', value: this.cinemaCode });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                var params = ParamsAppend(jsonArr);
                https.fetchPost('/merchandiseCoupon/merchandiseCouponPage', params).then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let oData = JSON.parse(Decrypt(data.data.data));
                        this.drawer = true;
                        this.sellTableData = oData.pageResult.data;
                        console.log(this.sellTableData);
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
            exAddChanger(){
                //新增确定按钮
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                if(!this.form1.oSignTips){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                this.showRule = false;
                let jsonArr = [];
                let goldAward;
                jsonArr.push({key:"id",value:this.id});
                jsonArr.push({key:"signTips",value:this.form1.oSignTips});
                for (let i = 0;i < this.tableData.length;i ++) {
                    if (!this.tableData[i].goldAward) {
                        this.message = '连续签到奖励不能为空，请检查！';
                        this.open();
                        loading.close();
                        this.showRule = true;
                        return;
                    }
                    if (this.tableData[i].id == 1) {
                        goldAward = this.tableData[i].goldAward;
                        this.tableData.splice(i,1)
                    }
                }
                jsonArr.push({key:"goldAward",value:goldAward});
                jsonArr.push({key:"extraSignRuleJson",value: JSON.stringify(this.tableData)});
                console.log(jsonArr)
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                    https.fetchPost('/signinRule/updateSigninRule',params).then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.$message.success(`成功`);
                            this.getMenu();
                            // this.showRule = true;
                        } else if (data.data.code == 'nologin') {
                            this.message = data.data.message;
                            this.open();
                            this.$router.push('/login');
                        } else {
                            this.message = data.data.message;
                            this.open();
                            this.showRule = true;
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
                setTimeout(() => {
                    https.fetchPost('/signinRule/signinRulePage','').then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            oData.extraRuleList.unshift({continuousDays: 1,goldAward: oData.goldAward,id: 1})
                            console.log(oData);
                            this.id=oData.id;
                            this.tableData = oData.extraRuleList;
                            this.form1.oGoldAward=oData.goldAward
                            this.form1.oSignTips=oData.signTips;
                            this.showRule = true;
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


