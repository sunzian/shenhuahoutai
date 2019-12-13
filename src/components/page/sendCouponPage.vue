<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 优惠券发放
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div v-if="showType">
            <el-dialog
                title="请选择发送方式"
                :visible.sync="dialogVisible"
                width="30%"
                :center="true"
                top="30vh"
                :close-on-click-modal="false"
                :show-close="false"
                :close-on-press-escape="false"
                >
                <template>
                    <el-radio-group v-model="sendType">
                        <el-radio :label="1">筛选用户发放</el-radio>
                        <el-radio :label="2">导入excel发放</el-radio>
                    </el-radio-group>
                </template>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="sureType">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <div class="container" v-if="sendType == 1">
            <div class="handle-box" style="margin-bottom: 0;">
                <el-select
                    v-model="query.cinemaCode"
                    placeholder="请选择影院"
                    class="mr10"
                    style="margin-top: 10px;width:18%;"
                    @change="$forceUpdate()"
                >
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaName"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="手机号"
                    v-model="query.mobile"
                    autocomplete="off"
                    class="mr10"
                    style="margin-top: 10px;width:18%;"
                ></el-input>
                <el-date-picker
                    v-model="query.consumeStartDate"
                    type="datetime"
                    class="mr10"
                    style="margin-top: 10px;width:18%;"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    default-time="06:00:00"
                    placeholder="最近消费时间（起）"
                ></el-date-picker>
                <el-date-picker
                    style="margin-top: 10px;width:18%;"
                    v-model="query.consumeEndDate"
                    type="datetime"
                    class="mr10"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="最近消费时间（止）"
                ></el-date-picker>
                <el-input
                    style="margin-top: 10px;width:18%;"
                    placeholder="总消费金额（起）"
                    v-model="query.consumeStartAmount"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    style="margin-top: 10px;width:18%;"
                    placeholder="总消费金额（止）"
                    v-model="query.consumeEndAmount"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    style="margin-top: 10px;width:18%;"
                    placeholder="剩余优惠券数量（起）"
                    v-model="query.couponStartNumber"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-input
                    style="margin-top: 10px;width:18%;"
                    placeholder="剩余优惠券数量（止）"
                    v-model="query.couponEndNumber"
                    autocomplete="off"
                    class="mr10"
                ></el-input>
                <el-select
                    v-model="query.userRole"
                    clearable
                    placeholder="游戏厅角色"
                    class="mr10"
                    style="margin-top: 10px;width:18%;"
                >
                    <el-option
                        v-for="item in userRole"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-select
                    v-model="query.bindCardStatus"
                    clearable
                    placeholder="是否绑定会员卡"
                    class="mr10"
                    style="margin-top: 10px;width:18%;"
                >
                    <el-option
                        v-for="item in bindCardStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-input
                        style="margin-top: 10px;width:18%;"
                        placeholder="邀请注册人数（起）"
                        v-model="query.startRegisterNumber"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
                <el-input
                        style="margin-top: 10px;width:18%;"
                        placeholder="邀请注册人数（止）"
                        v-model="query.endRegisterNumber"
                        autocomplete="off"
                        class="mr10"
                ></el-input>
            </div>
            <div v-if="filmList.length > 0">
                <span class="filmItem" v-for="(item, index) in filmList" :key="index">
                    <span>
                        <span style="color:gray">{{item.filmName}}</span>&nbsp;&nbsp;
                        <span
                            style="color:red;cursor:pointer"
                            @click="deleteFilm(index)"
                        >删除</span>&nbsp;&nbsp;
                    </span>
                </span>
            </div>
            <div style="float: right;">
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    style="margin-top: 10px;width: 90px;"
                    @click="Search"
                    class="mr10"
                >搜索</el-button>
            </div>
            <div style="margin-bottom: 10px; margin-top: 10px;height: 42px; float: right;">
                <el-button type="primary" style="margin-right: 10px;" @click="setConditions">发放优惠券</el-button>
            </div>
            <div style="float: right;">
                <el-button
                        type="primary"
                        style="margin-top: 10px;width: 90px;margin-right: 10px;"
                        @click="chooseFilm"
                >看过的电影</el-button>
            </div>
            <div style="float: right;">
                <el-button @click="chooseOtherType" style="margin-top: 10px;width: 120px;margin-right: 10px;">选择发放方式</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="头像" width="90">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width:400px" :src="scope.row.userHeadPic" />
                            <img
                                slot="reference"
                                :src="scope.row.userHeadPic"
                                :alt="scope.row.userHeadPic"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="昵称" width="110">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号" width="110">
                    <template slot-scope="scope">{{scope.row.userMobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="注册影院">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="注册时间" width="160">
                    <template slot-scope="scope">{{scope.row.miniRegisterDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="最近登陆时间" width="160">
                    <template slot-scope="scope">{{scope.row.loginDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="金币数量" width="90">
                    <template slot-scope="scope">{{scope.row.goldNumber}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="累计消费金额" width="110">
                    <template slot-scope="scope">{{scope.row.consumptionAmount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="最近一次消费" width="160">
                    <template slot-scope="scope">{{scope.row.lastConsumeDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="有效优惠券数量" width="130">
                    <template slot-scope="scope">{{scope.row.remainCoupons}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="邀请注册人数" width="120">
                    <template slot-scope="scope">{{scope.row.shareRegisterNumber}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="游戏厅角色" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.userRole=='1'" type="danger">普通用户</el-tag>
                        <el-tag v-else-if="scope.row.userRole=='2'" type="success">管理员</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="是否绑定会员卡" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.bindMemberCardStatus=='1'" type="danger">未绑定</el-tag>
                        <el-tag v-else-if="scope.row.bindMemberCardStatus=='2'" type="success">已绑定</el-tag>
                        <el-tag v-else-if="scope.row.bindMemberCardStatus=='3'" type="success">已解绑</el-tag>
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
        <div class="container" v-if="sendType == 2">
            <el-button @click="chooseOtherType">选择发放方式</el-button>
            <!--excel发送条件弹出框-->
            <div style="margin-left:50%;transform:translate(-50%)">
                <el-form :model="excelCouponForm">
                    <el-form-item :required="true" label="选择影院：" :label-width="formLabelWidth">
                        <el-select
                            v-model="query.cinemaCode"
                            placeholder="请选择影院"
                            class="mr10"
                            style="width:40%;"
                            @change="$forceUpdate()"
                            >
                            <el-option
                                v-for="item in cinemaInfo"
                                :key="item.cinemaName"
                                :label="item.cinemaName"
                                :value="item.cinemaCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :required="true" label="选择excel文件：" :label-width="formLabelWidth">
                        <el-upload
                            :data="paramsData"
                            class="upload-demo"
                            :action="uploadAction"
                            ref="upload"
                            :on-change="changeExcel"
                            :on-success="uploadExcel"
                            :before-upload="beforeExcel"
                            :auto-upload="false">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">
                                <em>点击上传</em>
                            </div>
                            <div
                                    class="el-upload__tip"
                                    slot="tip"
                            >上传模板只能是 xls、xlsx格式!</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item :required="true" label="选择有效时间类型：" :label-width="formLabelWidth">
                        <el-radio-group v-model="excelCouponForm.effectiveTimeType">
                            <el-radio :label="1">固定天数后过期</el-radio>
                            <el-radio :label="2">指定时间段有效</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="指定时间段："
                        :label-width="formLabelWidth"
                        v-if="excelCouponForm.effectiveTimeType == 2"
                        :required="true"
                    >
                        <el-date-picker
                            v-model="excelCouponForm.startDate"
                            type="date"
                            placeholder="开始时间"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                        ></el-date-picker>至
                        <el-date-picker
                            v-model="excelCouponForm.endDate"
                            type="date"
                            placeholder="结束时间"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item
                        label="有效期天数："
                        :label-width="formLabelWidth"
                        v-if="excelCouponForm.effectiveTimeType == 1"
                        :required="true"
                    >
                        <el-input
                            style="width: 150px"
                            placeholder="自领取之日起计算"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            v-model="excelCouponForm.overDays"
                            autocomplete="off"
                        ></el-input>天
                    </el-form-item>
                    <el-form-item :required="true" label="选择优惠券：" :label-width="formLabelWidth">
                        <el-button @click="getAllCoupon">选择优惠券</el-button>
                    </el-form-item>
                    <el-form-item
                        label="所选优惠券"
                        :label-width="formLabelWidth"
                        v-if="couponList.length>0"
                        :required="true"
                    >
                        <div
                            v-for="(item, index) in couponList"
                            style="margin-bottom: 5px"
                            :key="index"
                        >
                            <el-input
                                v-model="item.name"
                                autocomplete="off"
                                :value="item.id"
                                :disabled="true"
                                style="width: 30%;"
                            ></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                            数量：
                            <el-input
                                v-model="item.count"
                                autocomplete="off"
                                :value="item.count"
                                style="width: 30%;"
                                onkeyup="this.value=this.value.replace(/\D/g,'')"
                                @input="changeInput($event)"
                            ></el-input>
                            <span style="color:red;cursor: pointer;" @click="deleteCoupon(index)">删除</span>
                        </div>
                    </el-form-item>
                    <!-- <el-form-item label="短信模板：" :label-width="formLabelWidth" prop="screenName">
                        <el-input
                            style="width: 350px"
                            type="textarea"
                            v-model="excelCouponForm.messageContent"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item> -->
                </el-form>
                <div slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around;">
                    <!-- <el-button @click="cancel">取 消</el-button> -->
                    <el-button type="primary" @click="excelSendCoupon()">确 定</el-button>
                </div>
            </div>
        </div>
        <!-- 优惠券弹出框 -->
        <el-dialog title="选择优惠券" :visible.sync="editVisible" :show-close="false" :close-on-click-modal="false">
            <div class="container">
                <div class="handle-box">
                    <el-input
                        v-model="query.couponName"
                        placeholder="优惠券名称"
                        class="handle-input mr10"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="getAllCoupon">搜索</el-button>
                </div>
                <el-table
                    :data="couponInfo"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="changeSelectCounpon"
                    :row-key="getcouponId"
                >
                    <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                    <el-table-column prop="sort" label="优惠券名称">
                        <template slot-scope="scope">{{scope.row.name}}</template>
                    </el-table-column>
                    <el-table-column label="优惠券类型" prop="sort">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.couponType == 1" type="success">影票优惠券</el-tag>
                            <el-tag v-else-if="scope.row.couponType == 2" type="success">卖品优惠券</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠金额">
                        <template slot-scope="scope">
                            <el-tag
                                v-if="scope.row.reduceType == 1"
                                type="success"
                            >固定{{scope.row.discountMoney}}元</el-tag>
                            <el-tag
                                v-else-if="scope.row.reduceType == 2 && scope.row.couponType == 2"
                                type="success"
                            >满{{scope.row.achieveMoney}}减{{scope.row.discountMoney}}</el-tag>
                            <el-tag
                                v-else-if="scope.row.reduceType == 2 && scope.row.couponType == 1"
                                type="success"
                            >减{{scope.row.discountMoney}}元</el-tag>
                            <el-tag
                                    v-else-if="scope.row.reduceType == 3 && scope.row.couponType == 1"
                                    type="success"
                            >满{{scope.row.achieveMoney}}张减{{scope.row.discountMoney}}元</el-tag>
                            <el-tag
                                    v-else-if="scope.row.reduceType == 4 && scope.row.couponType == 1"
                                    type="success"
                            >满{{scope.row.achieveMoney}}减{{scope.row.discountMoney}}元</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            @size-change="couponHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.couponPageNo"
                            :page-sizes="[10, 15, 20, 30]"
                            :page-size="query.couponPageSize"
                            :total="query.couponTotalCount"
                            @current-change="couponCurrentChange"
                            @prev-click="couponPrev"
                            @next-click="couponNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureCoupon">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 影片弹出框 -->
        <el-dialog
            title="选择影片"
            :visible.sync="seenFilmList"
            :show-close="false"
            :close-on-click-modal="false"
            >
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.filmName" placeholder="影片名称" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="chooseFilm">搜索</el-button>
                </div>
                <el-table
                    :data="seenFilmData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="changeSelectFilm"
                    :row-key="getFilmId"
                >
                    <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                    <el-table-column prop="sort" label="影片名称">
                        <template slot-scope="scope">{{scope.row.filmName}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="影片语言">
                        <template slot-scope="scope">{{scope.row.language}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="影片导演">
                        <template slot-scope="scope">{{scope.row.director}}</template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            @size-change="filmHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.filmPageNo"
                            :page-sizes="[10, 15, 20, 30]"
                            :page-size="query.filmPageSize"
                            :total="query.filmTotalCount"
                            @current-change="filmCurrentChange"
                            @prev-click="filmPrev"
                            @next-click="filmNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="seenFilmList = false">取 消</el-button>
                <el-button type="primary" @click="sureFilm">确 定</el-button>
            </div>
        </el-dialog>
        <!--筛选用户发送条件弹出框-->
        <el-dialog
            title="设置发送条件"
            :visible.sync="sendConditions"
            :show-close="false"
            :close-on-click-modal="false"
            >
            <el-form :model="couponForm">
                <el-form-item :required="true" label="选择有效时间类型：" :label-width="formLabelWidth">
                    <el-radio-group v-model="couponForm.effectiveTimeType">
                        <el-radio :label="1">固定天数后过期</el-radio>
                        <el-radio :label="2">指定时间段有效</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="指定时间段："
                    :label-width="formLabelWidth"
                    v-if="couponForm.effectiveTimeType == 2"
                    :required="true"
                >
                    <el-date-picker
                        v-model="couponForm.startDate"
                        type="date"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                    ></el-date-picker>至
                    <el-date-picker
                        v-model="couponForm.endDate"
                        type="date"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    label="有效期天数："
                    :label-width="formLabelWidth"
                    v-if="couponForm.effectiveTimeType == 1"
                    :required="true"
                >
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')" placeholder="自领取之日起计算" style="width: 150px" v-model="couponForm.overDays" autocomplete="off"></el-input>天
                </el-form-item>
                <el-form-item :required="true" label="选择优惠券：" :label-width="formLabelWidth">
                    <el-button @click="getAllCoupon">选择优惠券</el-button>
                </el-form-item>
                <el-form-item
                    label="所选优惠券"
                    :label-width="formLabelWidth"
                    v-if="couponList.length>0"
                    :required="true"
                >
                    <div
                        v-for="(item, index) in couponList"
                        style="margin-bottom: 5px"
                        :key="index"
                    >
                        <el-input
                            style="width: 250px"
                            v-model="item.name"
                            autocomplete="off"
                            :value="item.id"
                            :disabled="true"
                        ></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                        数量：
                        <el-input
                            style="width: 150px"
                            v-model="item.count"
                            autocomplete="off"
                            :value="item.count"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            @input="changeInput($event)"
                        ></el-input>
                        <span style="color:red;cursor: pointer;" @click="deleteCoupon(index)">删除</span>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="短信模板：" :label-width="formLabelWidth" prop="screenName">
                    <el-input
                        style="width: 350px"
                        type="textarea"
                        v-model="couponForm.messageContent"
                        autocomplete="off"
                    ></el-input>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="sendCoupon">确 定</el-button>
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
            totalData: [],
            tableData: [],
            seenFilmData: [],
            filmList: [],
            couponList: [],
            selectCouponList: [],
            selectFilmList: [],
            dialogVisible: true,
            showType: true,
            seenFilmList: false,
            sendConditions: false,
            successUpLoad: false,
            sendType: 1,
            hasExcel: false,
            message: '', //弹出框消息
            uploadAction: 'api/batchSendCoupon/importExcelToSendCoupon',
            type: {},
            query: {
                pageNo: 1,
                couponPageNo: 1,
                filmPageNo: 1,
                pageSize: 15,
                filmPageSize: 10,
                couponPageSize: 10
            },
            userRole: [
                {
                    value: '1',
                    label: '普通用户'
                },
                {
                    value: '2',
                    label: '管理员'
                }
            ],
            bindCardStatus: [
                {
                    value: '1',
                    label: '未绑定'
                },
                {
                    value: '2',
                    label: '已绑定'
                }
            ],
            couponForm: {
                effectiveTimeType: 1,
                startDate: '',
                endDate: '',
                overDays: '',
                couponInfo: '',
                messageContent: ''
            },
            excelCouponForm: {
                effectiveTimeType: 1,
                startDate: '',
                endDate: '',
                overDays: '',
                couponInfo: '',
                messageContent: ''
            },
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            formLabelWidth: '120px',
            businessInfoList: [],
            value: '',
            form: [],
            cinemaInfo: [],
            couponInfo: [],
            fileList: []
        };
    },
    created() {},
    mounted() {
        this.getMenu();
        this.getAllCinema();
    },
    computed: {
        paramsData: function () {
            let params = {
                cinemaCode: this.query.cinemaCode,
                effectiveTimeType: this.excelCouponForm.effectiveTimeType,
                startDate: this.excelCouponForm.startDate,
                endDate: this.excelCouponForm.endDate,
                overDays: this.excelCouponForm.overDays,
                couponInfo: this.excelCouponForm.couponInfo,
                messageContent: this.excelCouponForm.messageContent,
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCode', value: params.cinemaCode });
            jsonArr.push({ key: 'effectiveTimeType', value: params.effectiveTimeType });
            jsonArr.push({ key: 'startDate', value: params.startDate });
            jsonArr.push({ key: 'endDate', value: params.endDate });
            jsonArr.push({ key: 'overDays', value: params.overDays });
            jsonArr.push({ key: 'couponInfo', value: params.couponInfo });
            jsonArr.push({ key: 'messageContent', value: params.messageContent });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let paramsInfo =  ParamsAppend(jsonArr);
            return paramsInfo;
        }
    },
    methods: {
        chooseOtherType() {
            this.showType = true;
            this.dialogVisible = true;
        },
        // 获取所有的优惠券
        getAllCoupon() {
            if (!this.query.cinemaCode) {
                this.message = '请选择影院';
                this.open();
                return;
            } else {
                let cinemaCode = this.query.cinemaCode;
                let couponName = this.query.couponName;
                if (!couponName) {
                    couponName = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'name', value: couponName });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'pageNo', value: this.query.couponPageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.couponPageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https.fetchPost('/merchandiseCoupon/getCouponByCinemaCode', params).then(data => {
                        if (data.data.code == 'success') {
                            var res = JSON.parse(Decrypt(data.data.data));
                            this.couponInfo = res.pageResult.data;
                            this.query.couponPageSize = res.pageResult.pageSize;
                            this.query.couponPageNo = res.pageResult.pageNo;
                            this.query.couponTotalCount = res.pageResult.totalCount;
                            this.query.couponTotalPage = res.pageResult.totalPage;
                            this.editVisible = true;
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
            }
        },

        // 选择优惠券  默认数量为一
        chooseCoupon() {
            for (let i = 0; i < this.couponInfo.length; i++) {
                if (this.sendCouponId == this.couponInfo[i].id) {
                    this.couponList.push({ couponName: this.couponInfo[i].name, couponId: this.couponInfo[i].id, count: 1 });
                }
            }
            let uniques = [];
            let stringify = {};
            for (let i = 0; i < this.couponList.length; i++) {
                let keys = Object.keys(this.couponList[i]);
                keys.sort(function(a, b) {
                    return Number(a) - Number(b);
                });
                let str = '';
                for (let j = 0; j < keys.length; j++) {
                    str += JSON.stringify(keys[j]);
                    str += JSON.stringify(this.couponList[i][keys[j]]);
                }
                if (!stringify.hasOwnProperty(str)) {
                    uniques.push(this.couponList[i]);
                    stringify[str] = true;
                }
            }
            this.couponList = uniques;
            this.editVisible = false;
        },

        changeInput() {
            this.$forceUpdate();
            let couponData = [];
            for (let i = 0; i < this.couponList.length; i++) {
                couponData.push(this.couponList[i].id + '=' + this.couponList[i].count);
            }
            this.excelCouponForm.couponInfo = couponData.join(',');
        },

        // 发放优惠券
        sendCoupon() {
            if (this.couponList.length == 0) {
                this.message = '请选择优惠券';
                this.open();
                return;
            }
            for (let i = 0;i < this.couponList.length;i ++) {
                if (this.couponList[i].count > 20) {
                    this.message = '每种优惠券单次发放数量不能大于20张！';
                    this.open();
                    return;
                }
            }
            if (this.couponForm.effectiveTimeType == 1 && this.couponForm.overDays == '') {
                this.message = '请填写有效期天数';
                this.open();
                return;
            }
            if (this.couponForm.effectiveTimeType == 1 && this.couponForm.overDays <=0) {
                this.message = '有效期天数必须大于0';
                this.open();
                return;
            }
            if (this.couponForm.effectiveTimeType == 2) {
                if (this.couponForm.startDate == '' || this.couponForm.endDate == '') {
                    this.message = '请填写时间段';
                    this.open();
                    return;
                }
            }
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let cinemaCode = this.query.cinemaCode;
            let mobile = this.query.mobile;
            let consumeStartDate = this.query.consumeStartDate;
            let consumeEndDate = this.query.consumeEndDate;
            let consumeStartAmount = this.query.consumeStartAmount;
            let consumeEndAmount = this.query.consumeEndAmount;
            let couponStartNumber = this.query.couponStartNumber;
            let couponEndNumber = this.query.couponEndNumber;
            let startRegisterNumber = this.query.startRegisterNumber;
            let endRegisterNumber = this.query.endRegisterNumber;
            let userRole = this.query.userRole;
            let bindCardStatus = this.query.bindCardStatus;
            let filmList = this.filmList;
            let filmCodes = '';
            if (!cinemaCode) {
                cinemaCode = '';
            }
            if (!mobile) {
                mobile = '';
            }
            if (!consumeStartDate) {
                consumeStartDate = '';
            }
            if (!consumeEndDate) {
                consumeEndDate = '';
            }
            if (!consumeStartAmount) {
                consumeStartAmount = '';
            }
            if (!consumeEndAmount) {
                consumeEndAmount = '';
            }
            if (!couponStartNumber) {
                couponStartNumber = '';
            }
            if (!couponEndNumber) {
                couponEndNumber = '';
            }
            if (!startRegisterNumber) {
                startRegisterNumber = '';
            }
            if (!endRegisterNumber) {
                endRegisterNumber = '';
            }
            if (!userRole) {
                userRole = '';
            }
            if (!bindCardStatus) {
                bindCardStatus = '';
            }
            if (filmList.length > 0) {
                for (let i = 0; i < filmList.length; i++) {
                    if (i < filmList.length - 1) {
                        filmCodes += filmList[i].filmCode + ',';
                    } else {
                        filmCodes += filmList[i].filmCode;
                    }
                }
            }
            let couponData = [];
            for (let i = 0; i < this.couponList.length; i++) {
                couponData.push(this.couponList[i].id + '=' + this.couponList[i].count);
            }
            this.couponForm.couponInfo = couponData.join(',');
            let jsonArr = [];
            if (this.couponForm.effectiveTimeType == 1) {
                jsonArr.push({ key: 'overDays', value: this.couponForm.overDays });
            }
            if (this.couponForm.effectiveTimeType == 2) {
                jsonArr.push({ key: 'startDate', value: this.couponForm.startDate });
                jsonArr.push({ key: 'endDate', value: this.couponForm.endDate });
            }
            jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
            jsonArr.push({ key: 'mobile', value: mobile });
            jsonArr.push({ key: 'consumeStartDate', value: consumeStartDate });
            jsonArr.push({ key: 'consumeEndDate', value: consumeEndDate });
            jsonArr.push({ key: 'consumeStartAmount', value: consumeStartAmount });
            jsonArr.push({ key: 'consumeEndAmount', value: consumeEndAmount });
            jsonArr.push({ key: 'couponStartNumber', value: couponStartNumber });
            jsonArr.push({ key: 'couponEndNumber', value: couponEndNumber });
            jsonArr.push({ key: 'startRegisterNumber', value: startRegisterNumber });
            jsonArr.push({ key: 'endRegisterNumber', value: endRegisterNumber });
            jsonArr.push({ key: 'userRole', value: userRole });
            jsonArr.push({ key: 'bindCardStatus', value: bindCardStatus });
            jsonArr.push({ key: 'filmCodes', value: filmCodes });
            jsonArr.push({ key: 'effectiveTimeType', value: this.couponForm.effectiveTimeType });
            jsonArr.push({ key: 'couponInfo', value: this.couponForm.couponInfo });
            jsonArr.push({ key: 'messageContent', value: this.couponForm.messageContent });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/batchSendCoupon/batchSendCoupon', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.sendConditions = false;
                        this.couponList = [];
                        this.couponForm.effectiveTimeType = 1;
                        this.couponForm.startDate = '';
                        this.couponForm.endDate = '';
                        this.couponForm.overDays = '';
                        this.couponForm.messageContent = '';
                        this.couponForm.couponInfo = '';
                        this.message = '优惠券将陆续发放,短时间内请勿连续发放';
                        this.open();
                        this.Search();
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

        excelSendCoupon() {
            if (this.couponList.length == 0) {
                this.message = '请选择优惠券';
                this.open();
                return;
            }
            for (let i = 0;i < this.couponList.length;i ++) {
                if (this.couponList[i].count > 20) {
                    this.message = '每种优惠券单次发放数量不能大于20张！';
                    this.open();
                    return;
                }
            }
            if (this.excelCouponForm.effectiveTimeType == 1 && this.excelCouponForm.overDays == '') {
                this.message = '请填写有效期天数';
                this.open();
                return;
            }
            if (this.excelCouponForm.effectiveTimeType == 1 && this.excelCouponForm.overDays <=0) {
                this.message = '有效期天数必须大于0';
                this.open();
                return;
            }
            if (this.excelCouponForm.effectiveTimeType == 2) {
                if (this.excelCouponForm.startDate == '' || this.excelCouponForm.endDate == '') {
                    this.message = '请填写时间段';
                    this.open();
                    return;
                }
            }
            if (this.hasExcel == false) {
                this.message = '请上传文件！';
                this.open();
                return
            }
            this.$refs.upload.submit();
        },

        // 取消发放
        cancel() {
            this.$confirm('此操作将清空数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.sendConditions = false;
                    this.couponList = [];
                    this.couponForm.effectiveTimeType = 1;
                    this.couponForm.startDate = '';
                    this.couponForm.endDate = '';
                    this.couponForm.overDays = '';
                    this.couponForm.messageContent = '';
                    this.couponForm.couponInfo = '';
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
        },

        // 显示优惠券条件弹窗
        setConditions() {
            this.sendConditions = true;
        },

        Search() {
            //获取菜单栏
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let cinemaCode = this.query.cinemaCode;
                let mobile = this.query.mobile;
                let consumeStartDate = this.query.consumeStartDate;
                let consumeEndDate = this.query.consumeEndDate;
                let consumeStartAmount = this.query.consumeStartAmount;
                let consumeEndAmount = this.query.consumeEndAmount;
                let couponStartNumber = this.query.couponStartNumber;
                let couponEndNumber = this.query.couponEndNumber;
                let startRegisterNumber = this.query.startRegisterNumber;
                let endRegisterNumber = this.query.endRegisterNumber;
                let userRole = this.query.userRole;
                let bindCardStatus = this.query.bindCardStatus;
                let filmList = this.filmList;
                let filmCodes = '';
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!mobile) {
                    mobile = '';
                }
                if (!consumeStartDate) {
                    consumeStartDate = '';
                }
                if (!consumeEndDate) {
                    consumeEndDate = '';
                }
                if (!consumeStartAmount) {
                    consumeStartAmount = '';
                }
                if (!consumeEndAmount) {
                    consumeEndAmount = '';
                }
                if (!couponStartNumber) {
                    couponStartNumber = '';
                }
                if (!couponEndNumber) {
                    couponEndNumber = '';
                }
                if (!startRegisterNumber) {
                    startRegisterNumber = '';
                }
                if (!endRegisterNumber) {
                    endRegisterNumber = '';
                }
                if (!userRole) {
                    userRole = '';
                }
                if (!bindCardStatus) {
                    bindCardStatus = '';
                }
                if (filmList.length > 0) {
                    for (let i = 0; i < filmList.length; i++) {
                        if (i < filmList.length - 1) {
                            filmCodes += filmList[i].filmCode + ',';
                        } else {
                            filmCodes += filmList[i].filmCode;
                        }
                    }
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'mobile', value: mobile });
                jsonArr.push({ key: 'consumeStartDate', value: consumeStartDate });
                jsonArr.push({ key: 'consumeEndDate', value: consumeEndDate });
                jsonArr.push({ key: 'consumeStartAmount', value: consumeStartAmount });
                jsonArr.push({ key: 'consumeEndAmount', value: consumeEndAmount });
                jsonArr.push({ key: 'couponStartNumber', value: couponStartNumber });
                jsonArr.push({ key: 'couponEndNumber', value: couponEndNumber });
                jsonArr.push({ key: 'startRegisterNumber', value: startRegisterNumber });
                jsonArr.push({ key: 'endRegisterNumber', value: endRegisterNumber });
                jsonArr.push({ key: 'userRole', value: userRole });
                jsonArr.push({ key: 'bindCardStatus', value: bindCardStatus });
                jsonArr.push({ key: 'filmCodes', value: filmCodes });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/batchSendCoupon/searchUser', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.tableData = oData.data;
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

        sureType() {
            this.dialogVisible = false;
            this.showType = false;
            this.getAllCinema();
        },

        getAllCinema() {
            https
                .fetchPost('/cinema/getAllCinema')
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.cinemaInfo = res;
                        this.query.cinemaCode = this.cinemaInfo[0].cinemaCode;
                        this.excelCouponForm.cinemaCode = this.cinemaInfo[0].cinemaCode;
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

        changeExcel(file,fileList) {
            this.hasExcel = true;
        },

        beforeExcel(file) {
            const extension = file.name.split(".")[file.name.split(".").length-1] === "xls";
            const extension2 = file.name.split(".")[file.name.split(".").length-1] === "xlsx";
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (!extension && !extension2) {
                this.message = '上传模板只能是 xls、xlsx格式!';
                this.open();
            }
            if (!isLt2M) {
                this.message = '上传模板大小不能超过 10MB!';
                this.open();
            }
            return extension || extension2;
        },

        uploadExcel(response) {
            this.successUpLoad = true;
            this.message = '优惠券将陆续发放,短时间内请勿连续发放';
            this.open();
            this.$refs.upload.clearFiles();
            this.excelCouponForm.effectiveTimeType = 1;
            this.excelCouponForm.startDate = '';
            this.excelCouponForm.endDate = '';
            this.excelCouponForm.overDays = '';
            this.excelCouponForm.couponInfo = '';
            this.couponList = [];
            this.hasExcel = false;
            this.excelCouponForm.messageContent = '';
        },

        // 查询看过的电影
        chooseFilm() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let filmName = this.query.filmName;
                if (!filmName) {
                    filmName = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'filmName', value: filmName });
                jsonArr.push({ key: 'pageNo', value: this.query.filmPageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.filmPageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('film/filmPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.seenFilmList = true;
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.seenFilmData = oData.data;
                            this.query.filmPageSize = oData.pageSize;
                            this.query.filmPageNo = oData.pageNo;
                            this.query.filmTotalCount = oData.totalCount;
                            this.query.filmTotalPage = oData.totalPage;
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
                https
                    .fetchPost('/batchSendCoupon/pageIndex')
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {

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
        changeSelectFilm(val) {
            this.selectFilmList = val;
        },

        sureFilm() {
            let filmList = [];
            this.filmList = filmList.concat(this.selectFilmList)
            this.seenFilmList = false
        },

        changeSelectCounpon(val) {
            this.selectCouponList = val;
            for (let i = 0; i < this.selectCouponList.length; i++) {
                this.selectCouponList[i].count = 1;
            }
        },

        sureCoupon() {
            let couponList = [];
            this.couponList = couponList.concat(this.selectCouponList)
            this.editVisible = false;
            let couponData = [];
            for (let i = 0; i < this.couponList.length; i++) {
                couponData.push(this.couponList[i].id + '=' + this.couponList[i].count);
            }
            this.excelCouponForm.couponInfo = couponData.join(',');
        },

        getFilmId(row) {
            return row.id;
        },

        getcouponId(row) {
            return row.id;
        },
        currentChange(val) {
            //点击选择具体页数
            this.query.pageNo = val;
            this.Search();
        },
        handleSizeChange(val) {
            this.query.pageSize=val;
            this.Search()
        },
        prev() {
            //分页按钮上一页
            this.query.pageNo--;
            this.Search();
        },

        next() {
            //分页按钮下一页
            this.query.pageNo++;
            this.Search();
        },

        getCurrentRow(id) {
            //影片弹出框id
            this.seenFilmId = id;
        },

        getCouponId(id) {
            this.sendCouponId = id;
        },

        // 选择看过的影片
        seenFilm() {
            for (let i = 0; i < this.seenFilmData.length; i++) {
                if (this.seenFilmId == this.seenFilmData[i].filmId) {
                    this.filmList.push({ filmName: this.seenFilmData[i].filmName, filmId: this.seenFilmData[i].filmId });
                }
            }
            let uniques = [];
            let stringify = {};
            for (let i = 0; i < this.filmList.length; i++) {
                let keys = Object.keys(this.filmList[i]);
                keys.sort(function(a, b) {
                    return Number(a) - Number(b);
                });
                let str = '';
                for (let j = 0; j < keys.length; j++) {
                    str += JSON.stringify(keys[j]);
                    str += JSON.stringify(this.filmList[i][keys[j]]);
                }
                if (!stringify.hasOwnProperty(str)) {
                    uniques.push(this.filmList[i]);
                    stringify[str] = true;
                }
            }
            this.filmList = uniques;
            // this.seenFilmList = false;
        },

        // 删除看过的影片
        deleteFilm(index) {
            this.filmList.splice(index, 1);
        },

        // 删除已选优惠券
        deleteCoupon(index) {
            this.couponList.splice(index, 1);
        },

        filmCurrentChange(val) {
            //点击选择具体页数
            this.query.filmPageNo = val;
            this.chooseFilm();
        },
        filmHandleSizeChange(val) {
            this.query.filmPageSize=val;
            this.chooseFilm()
        },
        filmPrev() {
            //分页按钮上一页
            this.query.filmPageNo--;
            this.chooseFilm();
        },
        filmNext() {
            //分页按钮下一页
            this.query.filmPageNo++;
            this.chooseFilm();
        },

        couponCurrentChange(val) {
            //点击选择具体页数
            this.query.couponPageNo = val;
            this.getAllCoupon();
        },
        couponHandleSizeChange(val) {
            this.query.couponPageSize=val;
            this.getAllCoupon()
        },
        couponPrev() {
            //分页按钮上一页
            this.query.couponPageNo--;
            this.getAllCoupon();
        },
        couponNext() {
            //分页按钮下一页
            this.query.couponPageNo++;
            this.getAllCoupon();
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
.red {
    color: #ff0000;
}
.mr10 {
    width: 16%;
    margin-right: 10px;
}
.filmItem {
    width: 16%;
}
</style>

