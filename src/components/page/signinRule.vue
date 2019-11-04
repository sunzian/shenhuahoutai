<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 签到规则管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--新增游戏规则页面-->
        <div class="container">
            <el-form ref="form" :model="oForm">
                <el-form-item label="签到天数" :label-width="formLabelWidth">
                    <el-input style="width: 250px" autocomplete="off" :disabled="true" :value="1"></el-input>
                </el-form-item>
                <el-form-item label="签到奖励金币数" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="oForm.goldAward"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="签到规则" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.signTips" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="连续签到天数">
                    <template slot-scope="scope">{{scope.row.continuousDays}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="连续签到奖励">
                    <template slot-scope="scope">{{scope.row.goldAward}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-circle-plus-outline"
                                @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer" style="margin-left: 1040px">
                <el-button style="margin-top: 20px;margin-left: 78px" type="primary" @click="exAddChanger">确 定</el-button>
            </span>
        </div>
        <!-- 新增奖项弹出框 -->
        <el-dialog title="新增" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="连续签到天数" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.continuousDays"
                            autocomplete="off"
                            :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="连续签到奖励" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.goldAward"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item v-if="index==5" label="是否设置连续7天额外奖励" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.extraFlag">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.extraFlag==1&&index==5" label="额外奖励的礼物名称" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.extraPrizeName"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item v-if="form.extraFlag==1&&index==5" label="额外奖励的礼物图片" :label-width="formLabelWidth">
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
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
                <el-form-item v-if="form.extraFlag==1&&index==5" label="领取后几天过期" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.expireDays"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item v-if="form.extraFlag==1&&index==5" label="额外奖励的礼物类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.extraPrizeType">
                        <el-radio label="1">优惠券</el-radio>
                        <el-radio label="2">实物</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.extraPrizeType==1&&index==5" label="选择优惠券" :label-width="formLabelWidth">
                    <el-button type="primary" @click="getAllCoupon">选择优惠券</el-button>
                </el-form-item>
                <el-form-item v-if="form.extraPrizeType==1&&index==5" label="所选优惠券：" :label-width="formLabelWidth">
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
        <!-- 修改奖项弹出框 -->
        <el-dialog title="编辑" :visible.sync="showModify">
            <el-form ref="form" :model="pForm">
                <el-form-item label="奖品等级" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="pForm.prizeLevel"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="奖品名称" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="pForm.prizeName"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="奖品图片" :label-width="formLabelWidth">
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            drag
                            action="/api/upload/uploadImage"
                            :on-success="onSuccess"
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
                <el-form-item label="奖品个数" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="pForm.prizeNumber"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="奖品概率（小数）" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="pForm.percent"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="过期天数" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="pForm.expireDay"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="奖品类型" :label-width="formLabelWidth">
                    <el-select v-model="pForm.prizeType" placeholder="请选择类型">
                        <el-option
                                v-for="item in prizeType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="pForm.prizeType==1" label="选择优惠券" :label-width="formLabelWidth">
                    <el-button type="primary" @click="getAllCoupon">选择优惠券</el-button>
                </el-form-item>
                <el-form-item v-if="pForm.prizeType==1" label="所选优惠券：" :label-width="formLabelWidth">
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
                <el-button @click="showModify = false">取 消</el-button>
                <el-button type="primary" @click="sureChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 选择优惠券弹出窗 -->
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
        <!--修改游戏规则页面-->
        <div class="container"  v-if="changeShow">
            <div class="handle-box">
                <el-button
                        type="primary"
                        @click="back"
                        icon="el-icon-circle-plus-outline"
                        style="margin-left: 1070px"
                >返回影院列表</el-button>
            </div>
            <el-form ref="form" :model="form">
                <el-form-item label="游戏名称" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            v-model="form.gameName"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="活动开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                            style="width:250px"
                            v-model="form.startDate"
                            type="datetime"
                            value-format="yyyy-MM-dd hh:mm:ss"
                            format="yyyy-MM-dd hh:mm:ss"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                            style="width:250px"
                            v-model="form.endDate"
                            type="datetime"
                            value-format="yyyy-MM-dd hh:mm:ss"
                            format="yyyy-MM-dd hh:mm:ss"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="消耗金币" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.consumeGold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="抽奖规则说明" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.gameRule" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="添加奖项" :label-width="formLabelWidth">-->
                <el-button style="margin-left: 1107px" type="primary" @click="changePrize">添加奖项</el-button>
                <!--</el-form-item>-->
            </el-form>
            <el-table
                    style="margin-top: 20px"
                    v-if="prizeInfoList.length!=0"
                    :data="prizeInfoList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="奖品等级">
                    <template slot-scope="scope">{{scope.row.prizeLevel}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="奖品名称">
                    <template slot-scope="scope">{{scope.row.prizeName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品图片">
                    <template slot-scope="scope">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="hover">
                            <img style="width: 400px" :src="scope.row.prizePicture"/>
                            <img slot="reference" :src="scope.row.prizePicture" :alt="scope.row.prizePicture" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品总数量">
                    <template slot-scope="scope">{{scope.row.prizeNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品概率">
                    <template slot-scope="scope">{{scope.row.percent}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已中奖数量">
                    <template slot-scope="scope">{{scope.row.hasTheNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.prizeType=='1'">优惠券</el-tag>
                        <el-tag v-else-if="scope.row.prizeType=='2'">实物</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="优惠券名称">
                    <template slot-scope="scope">{{scope.row.couponName}}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="prizeModify(scope.row,scope.$index)">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="deletePrize(scope.$index)" class="red">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer" style="margin-left: 1040px">
                    <!--<el-button @click="changeShow = false,showSell=true">取 消</el-button>-->
                <el-button style="margin-top: 20px;margin-left: 78px" type="primary" @click="exChangeChanger">确 定</el-button>
            </span>
        </div>
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
                showModify:false,
                addShow:false,
                changeShow:false,
                drawer:false,
                couponName:'',
                sellTableData:[],
                showSell: true, //卖品信息页面是否展示开关
                type: {
                    type: ''
                },
                message: '', //弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 10
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
                oForm: {
                    name: '',
                    filmCode: '',
                    filmName: '',
                    startDate: '',
                    endDate: '',
                    validPayType: '0',
                    achieveMoney: '',
                    discountMoney: '',
                    reduceType: '1',
                    couponDesc: '',
                    id: '',
                    status: ''
                },
                id: -1,
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
        created() {
            this.showSell=true;
        },
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
                this.form.extraPrizePicture = data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            addChange(index,row){
                this.index=index;
                this.form.continuousDays=this.tableData[this.index].continuousDays;
                this.editVisible=true;
                console.log(this.tableData);
            },
            exChanger() {
                console.log(this.index);
                if(this.index==5){
                    this.tableData[this.index].goldAward=this.form.goldAward
                    this.tableData[this.index].extraFlag=this.form.extraFlag
                    this.tableData[this.index].extraPrizeName=this.form.extraPrizeName
                    this.tableData[this.index].extraPrizePicture=this.form.extraPrizePicture
                    this.tableData[this.index].expireDays=this.form.expireDays
                    this.tableData[this.index].extraPrizeType=this.form.extraPrizeType
                    this.tableData[this.index].couponId=this.couponInfo.id
                }else{
                    this.tableData[this.index].goldAward=this.form.goldAward
                }
                console.log(this.tableData);
                this.editVisible=false
                this.form.goldAward=''
            },
            prizeModify(row,index){
                this.oIndex=index
                console.log(index);
                this.pForm=row
                this.showModify=true
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
                // jsonArr.push({ key: 'cinemaCodes', value: this.cinemaCode });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                var params = ParamsAppend(jsonArr);
                https.fetchPost('merchandiseCoupon/merchandiseCouponPage', params).then(data => {
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
            changePrize(){//调出编辑奖项页面
                // console.log(this.prizeInfoList);
                if(this.prizeInfoList.length>=8){
                    this.message = '奖项数量最多添加8个';
                    this.open();
                }else {
                    this.editVisible=true;
                }

            },
            exAddChanger(){
                //新增确定按钮
                console.log(this.tableData);
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let jsonArr = [];
                    jsonArr.push({ key: 'goldAward', value:this.oForm.goldAward});
                    jsonArr.push({ key: 'id', value:this.id});
                    jsonArr.push({ key: 'signTips', value:this.oForm.signTips});
                    jsonArr.push({ key: 'extraSignRuleJson', value:JSON.stringify(this.tableData)});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    console.log(jsonArr);
                    let params = ParamsAppend(jsonArr);
                    console.log(params);
                    https.fetchPost('signinRule/updateSigninRule', params).then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.showSell = true;
                            this.addShow=false;
                            this.$message.success(`成功`);
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
            exChangeChanger(){
                //修改确定按钮
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let jsonArr = [];
                    jsonArr.push({ key: 'cinemaCode', value:this.cinemaCode });
                    jsonArr.push({ key: 'gameName', value:this.form.gameName });
                    jsonArr.push({ key: 'startDate', value:this.form.startDate });
                    jsonArr.push({ key: 'endDate', value:this.form.endDate });
                    jsonArr.push({ key: 'status', value:this.form.status });
                    jsonArr.push({ key: 'prizeNumber', value:this.prizeInfoList.length});
                    jsonArr.push({ key: 'consumeGold', value:this.form.consumeGold});
                    jsonArr.push({ key: 'gameRule', value:this.form.gameRule});
                    jsonArr.push({ key: 'prizeInfoJson', value:JSON.stringify(this.prizeInfoList)});
                    jsonArr.push({ key: 'id', value:this.id});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    console.log(jsonArr);
                    let params = ParamsAppend(jsonArr);
                    console.log(params);
                    https.fetchPost('turnplateGameRule/updateTurnplateGameRuleById', params).then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.showSell = true;
                            this.changeShow=false;
                            this.$message.success(`修改成功`);
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
            sureChanger(){
                // 编辑奖项操作
                let onePrize={
                    prizeLevel:this.pForm.prizeLevel,
                    prizeName:this.pForm.prizeName,
                    prizePicture:this.pForm.image_url,
                    prizeNumber:this.pForm.prizeNumber,
                    percent:this.pForm.percent,
                    prizeType:this.pForm.prizeType,
                    expireDay:this.pForm.expireDay,
                    couponId:this.couponInfo.id,
                    couponName:this.couponInfo.couponName
                };
                this.prizeInfoList[this.oIndex]=onePrize;
                this.pForm.prizeLevel='';
                this.pForm.prizeName='';
                this.pForm.image_url='';
                this.pForm.expireDay='';
                this.pForm.prizeNumber='';
                this.pForm.percent='';
                this.pForm.prizeType='';
                this.couponInfo={};
                this.showModify = false
            },
            deletePrize(index){//删除具体某一奖项
                this.prizeInfoList.splice(index,1)
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
                            console.log(oData);
                            this.id=oData.id;
                            // console.log(this.query);
                            this.oForm.goldAward=oData.goldAward
                            this.oForm.signTips=oData.signTips
                            this.tableData = oData.extraRuleList;
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
                }, 500);
            },
            show(row) {
                this.id=row.id;
                this.cinemaCode=row.cinemaCode;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let jsonArr1 = [];
                    jsonArr1.push({ key: 'cinemaCode', value: this.cinemaCode });
                    let sign1 = md5(preSign(jsonArr1));
                    jsonArr1.push({ key: 'sign', value: sign1 });
                    var params1 = ParamsAppend(jsonArr1);
                    https.fetchPost('/turnplateGameRule/getByCinemaCode',params1).then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.prizeInfoList=[];
                            if(data.data.data==null){//新增
                                console.log('新增');
                                this.showSell=false;
                                this.addShow=true;
                            }
                            else{//编辑
                                console.log('编辑');
                                this.showSell=false;
                                this.changeShow=true;
                                console.log(JSON.parse(Decrypt(data.data.data)));
                                this.form=JSON.parse(Decrypt(data.data.data))
                                this.prizeInfoList=JSON.parse(Decrypt(data.data.data)).prizeInfoList;
                                //兑换方式下拉选显示对应的选项
                                //   console.log(typeof JSON.parse(Decrypt(data.data.data)).goldCommodity.changeType);
                                for (let x in this.options) {
                                    if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).status) {
                                        this.form.status = this.options[x].value;
                                        break;
                                    }
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
                            loading.close();
                            console.log(err);
                        });
                }, 500);
            },
            beforeUpload() {
                //上传之前
                this.type.type = EncryptReplace('activity');
            },
            onSuccess(data) {
                //上传文件 登录超时
                // console.log(data);
                this.form.image_url = data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            open() {
                //错误信息弹出框
                this.$alert(this.message, '错误信息', {
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


