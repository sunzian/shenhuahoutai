<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影票优惠券管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.commonType" placeholder="通用方式" class="handle-select mr10">
                    <el-option key="1" label="全部影院" value="1"></el-option>
                    <el-option key="2" label="指定影院" value="2"></el-option>
                </el-select>
                <el-select clearable v-model="query.cinemaCode" placeholder="请选择影院" class="mr10">
                    <el-option
                            v-for="item in cinemaData"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input placeholder="优惠券名称" class="mr10" v-model="query.name" autocomplete="off"></el-input>
                <el-select
                        clearable
                        v-model="query.reduceType"
                        placeholder="优惠券类型"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="兑换券" value="1"></el-option>
                    <el-option key="2" label="代金券" value="2"></el-option>
                </el-select>
                <el-select
                        clearable
                        v-model="query.status"
                        placeholder="状态"
                        class="handle-select mr10"
                >
                    <el-option key="0" label="未启用" value="0"></el-option>
                    <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <el-button
                        style="margin-top: 10px;width: 90px;"
                        type="primary"
                        icon="el-icon-search"
                        @click="Search"
                >搜索
                </el-button>
                <el-button
                        type="primary"
                        @click="addPage"
                        icon="el-icon-circle-plus-outline"
                        style="float:right;margin-top: 10px"
                >生成优惠券
                </el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    height="500"
                    class="table"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="适用影院" width="200">
                    <template slot-scope="scope">{{scope.row.cinemaNames}}</template>
                </el-table-column>
                <el-table-column label="优惠券名称" width="230">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="name" label="优惠券类型" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.reduceType == 1" type="success">兑换券</el-tag>
                        <el-tag v-else type="danger">代金券</el-tag>
                    </template>
                </el-table-column>

                <!-- <el-table-column prop="memo" label="有效期">
                    <template slot-scope="scope">{{scope.row.startDate}}至{{scope.row.endDate}}</template>
                </el-table-column>-->
                <!-- <el-table-column prop="sort" label="有效天数">
                    <template slot-scope="scope">{{scope.row.publishDate}}</template>
                </el-table-column>-->
                <el-table-column prop="sort" label="固定金额" width="90">
                    <template
                            v-if="scope.row.reduceType==1"
                            slot-scope="scope"
                    >{{scope.row.discountMoney}}
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="立减金额" width="90">
                    <template
                            v-if="scope.row.reduceType==2"
                            slot-scope="scope"
                    >{{scope.row.discountMoney}}
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="满多少张数减" width="120">
                    <template
                            v-if="scope.row.reduceType==3"
                            slot-scope="scope"
                    >{{scope.row.achieveMoney}}/{{scope.row.discountMoney}}
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="满多少金额减" width="120">
                    <template
                            v-if="scope.row.reduceType==4"
                            slot-scope="scope"
                    >{{scope.row.achieveMoney}}/{{scope.row.discountMoney}}
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="总库存" width="80">
                    <template slot-scope="scope">{{scope.row.sendNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已发放" width="80">
                    <template slot-scope="scope">{{scope.row.acquireNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已使用" width="80">
                    <template slot-scope="scope">{{scope.row.usedNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="success"
                                v-if="scope.row.status == 0"
                                @click="changeStatus(scope.$index, scope.row)"
                        >启用
                        </el-button>
                        <el-button
                                type="success"
                                v-if="scope.row.status == 1"
                                @click="changeStatus(scope.$index, scope.row)"
                        >停用
                        </el-button>
                        <el-button
                                type="success"
                                @click="canExportCoupon(scope.$index, scope.row)"
                        >导出
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-circle-plus-outline"
                                @click="addChange(scope.$index, scope.row)"
                        >修改
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="delChange(scope.$index, scope.row)"
                        >删除
                        </el-button>
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
        <!--新增弹出框-->
        <el-dialog title="新增" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="优惠券名称" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            placeholder="限15个字"
                            maxlength="15"
                            v-model="oForm.name"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="通用方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.commonType">
                        <el-radio :label="1" :disabled="showCommonType">全部影院</el-radio>
                        <el-radio :label="2" :disabled="showCommonType">指定影院</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="选择影院"
                        :label-width="formLabelWidth"
                        v-if="oForm.commonType == 2"
                >
                    <el-radio-group v-model="oForm.cinemaCode" @change="selectCinema">
                        <el-radio
                                v-for="item in cinemaInfo"
                                :label="item.cinemaCode"
                                :key="item.cinemaCode"
                                :value="item.cinemaName"
                        >{{item.cinemaName}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="选择影厅"
                        :label-width="formLabelWidth"
                        v-if="oForm.commonType == 2"
                >
                    <el-radio-group v-model="oForm.selectHallType" @change="clearScreenCode()">
                        <el-radio label="0">全部影厅</el-radio>
                        <el-radio label="1">指定影厅参加</el-radio>
                        <el-radio label="2">指定影厅不参加</el-radio>
                    </el-radio-group>
                    <el-checkbox-group
                            v-model="oForm.screenCode"
                            @change="selectScreens"
                            v-if="oForm.selectHallType != 0"
                    >
                        <el-checkbox
                                v-for="item in screenInfo"
                                :label="item.screenCode"
                                :key="item.screenCode"
                                :value="item.screenName"
                        >{{item.screenName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="选择制式" :label-width="formLabelWidth">
                    <el-radio-group
                            v-model="oForm.selectFilmFormatType"
                            @change="clearFilmFormatCode()"
                    >
                        <el-radio label="0">全部制式参加</el-radio>
                        <el-radio label="1">指定制式参加</el-radio>
                        <el-radio label="2">指定制式不参加</el-radio>
                    </el-radio-group>
                    <el-checkbox-group
                            v-model="oForm.filmFormatCode"
                            @change="selectFormat"
                            v-if="oForm.selectFilmFormatType != 0"
                    >
                        <el-checkbox
                                v-for="item in formatList"
                                :label="item.formatCode"
                                :key="item.formatCode"
                                :value="item.formatName"
                        >{{item.formatName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="选择影片" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.selectFilmType" @change="clearFilmList()">
                        <el-radio label="0">全部影片</el-radio>
                        <el-radio label="1">部分影片</el-radio>
                        <el-radio label="2">排除影片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        v-if="oForm.selectFilmType != 0"
                        label="选择影片"
                        :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选影片"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0&&oForm.selectFilmType != 0"
                        :required="true"
                >
                    <div
                            v-for="(item, index) in selectedSell"
                            style="margin-bottom: 5px"
                            :key="index"
                    >
                        <el-input
                                style="width: 250px"
                                v-model="item.filmName"
                                autocomplete="off"
                                :value="item.filmCode"
                                :disabled="true"
                                :change="one(item.filmCode)"
                        ></el-input>
                        <span style="color:red;cursor: pointer;" @click="deleteSell(index)">删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="可用支付方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.validPayType">
                        <el-radio label="0">全部可用</el-radio>
                        <el-radio label="1">仅非会员卡支付可用</el-radio>
                        <el-radio label="2">仅会员卡支付可用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="优惠方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.reduceType" @change="clearDiscountMoney()">
                        <el-radio label="4">满金额减</el-radio>
                        <el-radio label="3">满张数减</el-radio>
                        <el-radio label="2">立减</el-radio>
                        <el-radio label="1">固定价格（兑换券）</el-radio>
                        <el-radio label="5">最低票价结算</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        label="固定金额"
                        :label-width="formLabelWidth"
                        v-if="oForm.reduceType == 1"
                        :required="true"
                >
                    <el-input
                            placeholder="固定金额兑换一张票"
                            style="width: 250px"
                            v-model="oForm.discountMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="加价规则"
                        :label-width="formLabelWidth"
                        v-if="oForm.reduceType == 1"
                >
                    当影票最低票价大于
                    <el-input
                            style="width: 50px"
                            v-model="oForm.fixedSatisfyMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>
                    元,额外加价
                    <el-input
                            style="width: 50px"
                            v-model="oForm.fixedAddMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>
                    元 &nbsp;&nbsp;&nbsp;&nbsp;如果无限制，可不填
                </el-form-item>
                <el-form-item
                        label="减免金额"
                        :label-width="formLabelWidth"
                        v-if="oForm.reduceType == 2"
                        :required="true"
                >
                    立减&nbsp;
                    <el-input
                            placeholder="订单总金额立减多少"
                            style="width: 250px"
                            v-model="oForm.discountMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>&nbsp;元
                </el-form-item>
                <el-form-item
                        label="减免金额"
                        :label-width="formLabelWidth"
                        v-if="oForm.reduceType == 3"
                        :required="true"
                >
                    满&nbsp;
                    <el-input
                            placeholder="订单影票满张数减多少"
                            style="width: 250px"
                            v-model="oForm.achieveMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>&nbsp;张&nbsp;&nbsp;减&nbsp;
                    <el-input
                            style="width: 150px"
                            v-model="oForm.discountMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>&nbsp;元
                </el-form-item>
                <el-form-item
                        label="减免金额"
                        :label-width="formLabelWidth"
                        v-if="oForm.reduceType == 4"
                        :required="true"
                >
                    满&nbsp;
                    <el-input
                            placeholder="订单总额满多少减多少"
                            style="width: 250px"
                            v-model="oForm.achieveMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>&nbsp;元&nbsp;&nbsp;减&nbsp;
                    <el-input
                            style="width: 200px"
                            v-model="oForm.discountMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>&nbsp;元
                </el-form-item>
                <el-form-item :required="true" label="增减金额" :label-width="formLabelWidth" v-if="oForm.reduceType == 5">
                    <el-input placeholder="（最低票价+-金额）*张数" style="width: 250px" v-model="oForm.discountMoney"
                              autocomplete="off"></el-input>&nbsp;&nbsp;
                    <span style="color: #ccc;">在最低票价基础上加减多少金额 如果是减金额则填负数</span>
                </el-form-item>
                <el-form-item :required="true" label="开启状态" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="节假日是否可用" :label-width="formLabelWidth">
                    <el-select v-model="oForm.holidayValid" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        label="节假日加价金额"
                        :label-width="formLabelWidth"
                        v-if="oForm.holidayValid == 1&&(oForm.reduceType==1||oForm.reduceType==5)"
                >
                    <el-input
                            style="width: 250px"
                            placeholder="选填 填写大于等于0的数字"
                            v-model="oForm.holidayAddMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="星期几不可用" :label-width="formLabelWidth">
                    <el-checkbox-group :max="6" v-model="oForm.checkedDays" @change="selectDay">
                        <el-checkbox
                                v-for="(day, index) in oForm.exceptWeekDay"
                                :label="index+1"
                                :key="day"
                        >{{day}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="是否和活动共用" :label-width="formLabelWidth">
                    <el-select v-model="oForm.activityTogether" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.sendNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="使用须知" :label-width="formLabelWidth">
                    <el-input
                            style="width: 300px"
                            :rows="6"
                            type="textarea"
                            show-word-limit
                            maxlength="500"
                            v-model="oForm.couponDesc"
                            placeholder="例如：
1、制式和影片限制
2、可用支付方式 优惠形式
3、节假日和周几不可用
4、其他注意事项"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addRole" @keyup.enter.native="addRole()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="修改" :close-on-click-modal="false" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="优惠券名称" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            placeholder="限15个字"
                            maxlength="15"
                            v-model="oName"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="通用方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oCommonType">
                        <el-radio :label="1" disabled>全部影院</el-radio>
                        <el-radio :label="2" disabled>指定影院</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="选择影院"
                        :label-width="formLabelWidth"
                        v-if="oCommonType == 2"
                >
                    <el-radio-group v-model="oCinemaCode" @change="selectCinema">
                        <el-radio
                                v-for="item in cinemaInfo"
                                :label="item.cinemaCode"
                                :key="item.cinemaCode"
                                :value="item.cinemaName"
                        >{{item.cinemaName}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="选择影厅"
                        :label-width="formLabelWidth"
                        v-if="oCommonType == 2"
                >
                    <el-radio-group v-model="oSelectHallType" @change="clearScreenCode()">
                        <el-radio label="0">全部影厅</el-radio>
                        <el-radio label="1">指定影厅参加</el-radio>
                        <el-radio label="2">指定影厅不参加</el-radio>
                    </el-radio-group>
                    <el-checkbox-group
                            v-model="oScreenCode"
                            @change="selectScreens"
                            v-if="oSelectHallType != 0"
                    >
                        <el-checkbox
                                v-for="item in screenInfo"
                                :label="item.screenCode"
                                :key="item.screenCode"
                                :value="item.screenName"
                        >{{item.screenName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="选择制式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oSelectFilmFormatType" @change="clearFilmFormatCode()">
                        <el-radio label="0">全部制式参加</el-radio>
                        <el-radio label="1">指定制式参加</el-radio>
                        <el-radio label="2">指定制式不参加</el-radio>
                    </el-radio-group>
                    <el-checkbox-group
                            v-model="oFilmFormatCode"
                            @change="selectFormat"
                            v-if="oSelectFilmFormatType != 0"
                    >
                        <el-checkbox
                                v-for="item in formatList"
                                :label="item.formatCode"
                                :key="item.formatCode"
                                :value="item.formatName"
                        >{{item.formatName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="选择影片" :label-width="formLabelWidth">
                    <el-radio-group v-model="oSelectFilmType" @change="clearFilmList()">
                        <el-radio label="0">全部影片</el-radio>
                        <el-radio label="1">部分影片</el-radio>
                        <el-radio label="2">排除影片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        v-if="oSelectFilmType != 0"
                        label="选择影片"
                        :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选影片"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0&&oSelectFilmType != 0"
                        :required="true"
                >
                    <div
                            v-for="(item, index) in selectedSell"
                            style="margin-bottom: 5px"
                            :key="index"
                    >
                        <el-input
                                style="width: 250px"
                                v-model="item.filmName"
                                autocomplete="off"
                                :value="item.filmCode"
                                :disabled="true"
                                :change="one(item.filmCode)"
                        ></el-input>
                        <span style="color:red;cursor: pointer;" @click="deleteSell(index)">删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="可用支付方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oValidPayType">
                        <el-radio label="0">全部可用</el-radio>
                        <el-radio label="1">仅非会员卡支付可用</el-radio>
                        <el-radio label="2">仅会员卡支付可用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="优惠方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oReduceType" @change="clearDiscountMoney()">
                        <el-radio label="4">满金额减</el-radio>
                        <el-radio label="3">满张数减</el-radio>
                        <el-radio label="2">立减</el-radio>
                        <el-radio label="1">固定价格（兑换券）</el-radio>
                        <el-radio label="5">最低票价结算</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        label="固定金额"
                        :label-width="formLabelWidth"
                        v-if="oReduceType == 1"
                        :required="true"
                >
                    <el-input
                            placeholder="固定金额兑换一张票"
                            style="width: 250px"
                            v-model="oDiscountMoney"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="加价规则"
                        :label-width="formLabelWidth"
                        v-if="oReduceType == 1"
                >
                    当影票最低票价大于
                    <el-input
                            style="width: 50px"
                            v-model="oFixedSatisfyMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>
                    元,额外加价
                    <el-input
                            style="width: 50px"
                            v-model="oFixedAddMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>
                    元 &nbsp;&nbsp;&nbsp;&nbsp;如果无限制，可不填
                </el-form-item>
                <el-form-item
                        label="减免金额"
                        :label-width="formLabelWidth"
                        v-if="oReduceType == 2"
                        :required="true"
                >
                    立减&nbsp;
                    <el-input
                            placeholder="订单总金额立减多少"
                            style="width: 250px"
                            v-model="oDiscountMoney"
                            autocomplete="off"
                    ></el-input>&nbsp;元
                </el-form-item>
                <el-form-item
                        label="减免金额"
                        :label-width="formLabelWidth"
                        v-if="oReduceType == 3"
                        :required="true"
                >
                    满&nbsp;
                    <el-input
                            placeholder="订单影票满张数减多少"
                            style="width: 250px"
                            v-model="oAchieveMoney"
                            autocomplete="off"
                    ></el-input>&nbsp;张&nbsp;&nbsp;减&nbsp;
                    <el-input
                            style="width: 150px"
                            v-model="oDiscountMoney"
                            autocomplete="off"
                    ></el-input>&nbsp;元
                </el-form-item>
                <el-form-item
                        label="减免金额"
                        :label-width="formLabelWidth"
                        v-if="oReduceType == 4"
                        :required="true"
                >
                    满&nbsp;
                    <el-input
                            placeholder="订单总额满多少减多少"
                            style="width: 250px"
                            v-model="oAchieveMoney"
                            autocomplete="off"
                    ></el-input>&nbsp;元&nbsp;&nbsp;减&nbsp;
                    <el-input
                            style="width: 150px"
                            v-model="oDiscountMoney"
                            autocomplete="off"
                    ></el-input>&nbsp;元
                </el-form-item>
                <el-form-item :required="true" label="增减金额：" :label-width="formLabelWidth" v-if="oReduceType == 5">
                    <el-input placeholder="（最低票价+-金额）*张数" style="width: 250px" v-model="oDiscountMoney"
                              autocomplete="off"></el-input>&nbsp;&nbsp;
                    <span style="color: #ccc;">在最低票价基础上加减多少金额 如果是减金额则填负数</span>
                </el-form-item>
                <el-form-item :required="true" label="开启状态" :label-width="formLabelWidth">
                    <el-select v-model="oStatus" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="节假日是否可用" :label-width="formLabelWidth">
                    <el-select v-model="oHolidayValid" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        label="节假日加价金额"
                        :label-width="formLabelWidth"
                        v-if="oHolidayValid == 1&&(oReduceType==1||oReduceType==5)"
                >
                    <el-input
                            style="width: 250px"
                            placeholder="选填 填写大于等于0的数字"
                            v-model="oHolidayAddMoney"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="星期几不可用" :label-width="formLabelWidth">
                    <el-checkbox-group :max="6" v-model="oCheckedDays" @change="selectDay">
                        <el-checkbox
                                v-for="item in oExceptWeekDay"
                                :label="item.index"
                                :key="item.index"
                                :value="item.value"
                        >{{item.value}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="是否和活动共用" :label-width="formLabelWidth">
                    <el-select v-model="oActivityTogether" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oSendNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="使用须知" :label-width="formLabelWidth">
                    <el-input
                            style="width: 300px"
                            :rows="6"
                            placeholder="例如：
1、制式和影片限制
2、可用支付方式 优惠形式
3、节假日和周几不可用
4、其他注意事项"
                            type="textarea"
                            show-word-limit
                            maxlength="500"
                            v-model="oCouponDesc"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增抽屉弹出框-->
        <el-dialog title="选择影片" :close-on-click-modal="false" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.filmName" placeholder="影片名称" class="handle-input mr12"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="SearchFilm">搜索</el-button>
                </div>
                <el-table
                        :data="sellTableData"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="50" align="center">
                        <template slot-scope="scope">
                            <el-radio
                                    v-model="id"
                                    :label="scope.$index"
                                    @change.native="getCurrentRow(scope.$index)"
                            >&nbsp;
                            </el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="影片名称">
                        <template slot-scope="scope">{{scope.row.filmName}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="上映时间" width="160">
                        <template slot-scope="scope">{{scope.row.publishDate}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="制式" width="80">
                        <template slot-scope="scope">{{scope.row.dimensional}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="语言" width="80">
                        <template slot-scope="scope">{{scope.row.language}}</template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            @size-change="aHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.aPageNo"
                            :page-sizes="[10, 15, 20, 30]"
                            :page-size="query.aPageSize"
                            :total="query.aTotalCount"
                            @current-change="aCurrentChange"
                            @prev-click="aPrev"
                            @next-click="aNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button type="primary" @click="sureNext">确 定</el-button>
            </div>
        </el-dialog>
        <!--导出弹出框-->
        <el-dialog title="导出" :close-on-click-modal="false" :visible.sync="exportVisible">
            <el-form :model="exportForm">
                <el-form-item :required="true" label="有效期类型：" :label-width="formLabelWidth">
                    <el-radio-group v-model="exportForm.validityType">
                        <el-radio :label="1">固定天数后过期</el-radio>
                        <el-radio :label="2">固定有效时间段</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        label="用户绑定后有效期天数："
                        :label-width="formLabelWidth"
                        v-if="exportForm.validityType == 1"
                        :required="true"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/[^0-9]+/,'')"
                            style="width: 150px"
                            v-model="exportForm.validityDay"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="指定时间段："
                        :label-width="formLabelWidth"
                        v-if="exportForm.validityType == 2"
                        :required="true"
                >
                    <el-date-picker
                            v-model="exportForm.startDate"
                            type="date"
                            placeholder="有效期开始时间"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                    ></el-date-picker>
                    至
                    <el-date-picker
                            v-model="exportForm.endDate"
                            type="date"
                            placeholder="有效期结束时间"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                        label="导出数量："
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/[^0-9]+/,'')"
                            style="width: 150px"
                            v-model="exportForm.exportNum"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="exportVisible = false">取 消</el-button>
                <el-button type="primary" @click="exportCoupon">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {fetchData} from '../../api/index';
    import {Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend} from '@/aes/utils';
    import md5 from 'js-md5';
    import axios from 'axios';
    import https from '../../https';

    export default {
        name: 'basetable',
        data() {
            return {
                oExceptWeekDay: [
                    {
                        index: '1',
                        value: '星期一'
                    },
                    {
                        index: '2',
                        value: '星期二'
                    },
                    {
                        index: '3',
                        value: '星期三'
                    },
                    {
                        index: '4',
                        value: '星期四'
                    },
                    {
                        index: '5',
                        value: '星期五'
                    },
                    {
                        index: '6',
                        value: '星期六'
                    },
                    {
                        index: '7',
                        value: '星期日'
                    }
                ],
                showCommonType: false,
                oCommonType: '',
                oCinemaCode: '',
                oSelectHallType: '',
                oScreenCode: [],
                oFilmFormatCode: [],
                oSelectFilmFormatType: '',
                oCheckedDays: [],
                sellTableData: [],
                oCinemaName: '',
                oSelectFilmType: '',
                oHolidayAddMoney: '',
                oScreenName: '',
                oFilmName: '',
                oAchieveMoney: '',
                oName: '',
                oStartDate: '',
                oEndDate: '',
                oValidPayType: '',
                oReduceType: '',
                oDiscountMoney: '',
                oCouponDesc: '',
                oSendNumber: '',
                oActivityTogether: '',
                oHolidayValid: '',
                oFilmFormatName: '',
                oId: '',
                oStatus: '',
                oFixedSatisfyMoney: '',
                oFixedAddMoney: '',
                message: '', //弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 15,
                    aPageNo: 1,
                    aPageSize: 15,
                    filmName: ''
                },
                restaurants: [],
                tableData: [],
                multipleSelection: [],
                formatList: [], //电影制式列表
                delList: [],
                editVisible: false,
                drawer: false,
                pageTotal: 0,
                form: {},
                selectScreen: '', // 选中的影厅
                idx: -1,
                id: -1,
                dialogFormVisible: false,
                exportVisible: false,
                options: [
                    {
                        value: '0',
                        label: '未启用'
                    },
                    {
                        value: '1',
                        label: '启用'
                    }
                ],
                canUse: [
                    {
                        value: '0',
                        label: '否'
                    },
                    {
                        value: '1',
                        label: '是'
                    }
                ],
                oForm: {
                    name: '',
                    fixedSatisfyMoney: '',
                    fixedAddMoney: '',
                    commonType: '1',
                    cinemaName: '',
                    cinemaCode: [],
                    screenName: '',
                    screenCode: [],
                    selectFilmType: '0',
                    selectHallType: '0',
                    selectFilmFormatType: '0', //选择制式
                    filmCode: '',
                    holidayAddMoney: '',
                    filmName: '',
                    filmFormatCode: [],
                    checkedDays: [],
                    exceptWeekDay: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                    startDate: '',
                    endDate: '',
                    validPayType: '0',
                    achieveMoney: '',
                    discountMoney: '',
                    sendNumber: '',
                    reduceType: '4',
                    activityTogether: '1',
                    holidayValid: '1',
                    couponDesc: '',
                    id: '',
                    status: '0'
                },
                formLabelWidth: '120px',
                selectValue: {},
                selectScreenCode: {},
                selectFilm: {},
                selectFormatCode: {},
                cinemaInfo: [],
                cinemaData: [],
                screenInfo: [],
                filmInfo: [],
                value: '',
                selectFilmCode: [],
                selectedSell: [],
                sellIndex: '',
                rowMess: '',
                exportForm: {
                    id: '',
                    validityType: 1,
                    validityDay: '',
                    startDate: '',
                    endDate: '',
                    exportNum: ''
                },
                exportInfo: []
            };
        },
        created() {
        },
        mounted() {
            this.getMenu();
        },
        methods: {
            canExportCoupon(index, row) {
                //是否拥有权限
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                this.idx = index;
                var jsonArr = [];
                jsonArr.push({key: 'id', value: row.id});
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/CouponBackGround/pageIndex', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.exportVisible = true;
                            this.exportForm.id = row.id;
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
            exportCoupon() {
                if (this.exportForm.validityType == 1) {
                    if (this.exportForm.validityDay.trim() == '' || this.exportForm.validityDay.trim() == 0) {
                        this.message = '绑定后有效期天数必须大于0！';
                        this.open();
                        return;
                    }
                }
                if (this.exportForm.exportNum.trim() == '' || !this.exportForm.exportNum || this.exportForm.exportNum == 0) {
                    this.message = '导出数量必须大于0！';
                    this.open();
                    return;
                }
                if (this.exportForm.validityType == 2) {
                    if (
                        !this.exportForm.startDate ||
                        this.exportForm.startDate == '' ||
                        !this.exportForm.endDate ||
                        this.exportForm.endDate == ''
                    ) {
                        this.message = '指定时间段不能为空！';
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
                var jsonArr = [];
                jsonArr.push({key: 'validityType', value: this.exportForm.validityType});
                jsonArr.push({key: 'validityDay', value: this.exportForm.validityDay});
                jsonArr.push({key: 'startDate', value: this.exportForm.startDate});
                jsonArr.push({key: 'endDate', value: this.exportForm.endDate});
                jsonArr.push({key: 'exportNum', value: this.exportForm.exportNum});
                jsonArr.push({key: 'associatedId', value: this.exportForm.id});
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                let params = ParamsAppend(jsonArr);
                let myObj = {
                    method: 'post',
                    url: '/CouponBackGround/exportCoupon',
                    fileName: '影票优惠券统计',
                    params: params
                };
                https.exportCouponMethod(myObj);
                this.exportForm.id = '';
                this.exportForm.validityType = 1;
                this.exportForm.validityDay = '';
                this.exportForm.startDate = '';
                this.exportForm.endDate = '';
                this.exportForm.exportNum = '';
                this.exportVisible = false;
                loading.close();
            },
            clearDiscountMoney() {
                this.oForm.discountMoney = '';
                this.oForm.achieveMoney = '';
                this.oDiscountMoney = '';
                this.oAchieveMoney = '';
            },
            clearFilmList() {
                this.selectedSell = [];
            },
            clearScreenCode() {
                this.oForm.screenCode = [];
                this.oScreenCode = [];
            },
            clearFilmFormatCode() {
                this.oForm.filmFormatCode = [];
                this.oFilmFormatCode = [];
            },
            one(a) {
                //获取卖品绑定的value值
                // console.log(a);
                this.oForm.filmCode = a;
            },
            deleteSell(index) {
                this.selectedSell.splice(index, 1);
            },
            getCurrentRow(index) {
                this.sellIndex = index;
            },
            sureNext() {
                if (this.sellIndex >= 0) {
                    // console.log('选了数据');
                    if (this.selectedSell.length <= 0) {
                        // console.log('长度为0');
                        this.selectedSell.push(this.sellTableData[this.sellIndex]);
                    } else if (this.selectedSell.length > 0) {
                        // console.log('有数据');
                        for (let x in this.selectedSell) {
                            if (this.selectedSell[x].filmCode == this.sellTableData[this.sellIndex].filmCode) {
                                this.message = '不能添加相同影片！';
                                this.open();
                                return;
                            }
                        }
                        // console.log('判断不重复');
                        this.selectedSell.push(this.sellTableData[this.sellIndex]);
                    }
                }
                this.drawer = false;
            },
            SearchFilm() {
                this.query.pageNo = 1;
                this.openNext();
            },
            openNext() {
                //获取影片列表
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
                    jsonArr.push({key: 'filmName', value: filmName});
                    jsonArr.push({key: 'pageNo', value: this.query.aPageNo});
                    jsonArr.push({key: 'pageSize', value: this.query.aPageSize});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({key: 'sign', value: sign});
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('film/filmPage', params)
                        .then(data => {
                            loading.close();
                            console.log(data);
                            if (data.data.code == 'success') {
                                this.drawer = true;
                                var oData = JSON.parse(Decrypt(data.data.data));
                                console.log(oData);
                                // console.log(this.query);
                                this.sellTableData = oData.data;
                                this.query.aPageSize = oData.pageSize;
                                this.query.aPageNo = oData.pageNo;
                                this.query.aTotalCount = oData.totalCount;
                                this.query.aTotalPage = oData.totalPage;
                                this.query.filmName = '';
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
                https
                    .fetchPost('/filmCoupon/filmCouponAddPage', '')
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = true;
                            this.selectedSell = [];
                            this.getAllScreen(this.oForm.cinemaCode);
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            if (JSON.parse(Decrypt(data.data.data)).adminFlag <= 1) {
                                this.oForm.commonType = 1;
                            } else {
                                this.oForm.commonType = 2;
                                this.showCommonType = true;
                            }
                            let formats = JSON.parse(Decrypt(data.data.data)).formatList;
                            this.formatList = [];
                            for (let i = 0; i < formats.length; i++) {
                                let formatArr = {};
                                formatArr.formatCode = formats[i].formatCode;
                                formatArr.formatName = formats[i].formatName;
                                this.formatList.push(formatArr);
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
                    });
                loading.close();
            },
            addRole() {
                //新增按钮操作
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                if (!this.oForm.name) {
                    this.message = '优惠券名称不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.commonType) {
                    this.message = '类型不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.commonType == 2) {
                    if (!this.oForm.cinemaCode) {
                        this.message = '所选影院不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (!this.oForm.selectHallType) {
                        this.message = '影厅类型不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oForm.selectHallType == 1 || this.oForm.selectHallType == 2) {
                        if (this.oForm.screenCode.length == 0) {
                            this.message = '影厅名不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                }
                if (!this.oForm.selectFilmFormatType) {
                    this.message = '制式类型不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.selectFilmFormatType == 1 || this.oForm.selectFilmFormatType == 2) {
                    if (this.oForm.filmFormatCode.length == 0) {
                        this.message = '制式不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (!this.oForm.selectFilmType) {
                    this.message = '影片类型不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.selectFilmType == 1 || this.oForm.selectFilmType == 2) {
                    if (this.selectedSell.length == 0) {
                        this.message = '所选影片不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (!this.oForm.validPayType) {
                    this.message = '可用支付方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.reduceType) {
                    this.message = '优惠方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.reduceType == 1) {
                    if (this.oForm.discountMoney >= 0) {
                        if (!this.oForm.discountMoney) {
                            this.message = '固定金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (this.oForm.discountMoney < 0) {
                        this.message = '固定金额不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.reduceType == 2) {
                    if (this.oForm.discountMoney >= 0) {
                        if (!this.oForm.discountMoney) {
                            this.message = '减免金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (this.oForm.discountMoney < 0) {
                        this.message = '减免金额不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.reduceType == 3) {
                    if (this.oForm.discountMoney >= 0 || this.oForm.achieveMoney >= 0) {
                        if (!this.oForm.achieveMoney) {
                            this.message = '张数不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (!this.oForm.discountMoney) {
                            this.message = '减免金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (this.oForm.achieveMoney < 0 || this.oForm.achieveMoney > 4) {
                        this.message = '张数必须在0-4之间，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oForm.discountMoney <= 0) {
                        this.message = '减免金额必须大于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.reduceType == 4) {
                    if (this.oForm.discountMoney >= 0 || this.oForm.achieveMoney >= 0) {
                        if (!this.oForm.discountMoney || !this.oForm.achieveMoney) {
                            this.message = '减免金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (this.oForm.discountMoney < 0 || this.oForm.achieveMoney < 0) {
                        this.message = '减免金额不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oForm.achieveMoney == 0 && this.oForm.discountMoney == 0) {
                        this.message = '请输入合理的满减金额！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (Number(this.oForm.achieveMoney) < Number(this.oForm.discountMoney)) {
                        this.message = '减免金额不能大于满减金额！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.reduceType == 5) {
                    if (this.oForm.discountMoney > 0) {
                        if (!this.oForm.discountMoney) {
                            this.message = '增减金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                }
                if (!this.oForm.status) {
                    this.message = '开启状态不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.holidayValid) {
                    this.message = '节假日是否可用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                // if (this.oForm.reduceType == 1&&this.oForm.holidayValid==1) {
                //     if (this.oForm.holidayAddMoney > 0) {
                //         if (!this.oForm.holidayAddMoney) {
                //             this.message = '节假日加价金额不能为空，请检查！';
                //             this.open();
                //             loading.close();
                //             return;
                //         }
                //         if (this.oForm.holidayAddMoney<0) {
                //             this.message = '节假日加价金额不能小于0，请检查！';
                //             this.open();
                //             loading.close();
                //             return;
                //         }
                //     }
                // }
                if (!this.oForm.activityTogether) {
                    this.message = '是否和活动共用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.sendNumber != 0) {
                    if (!this.oForm.sendNumber) {
                        this.message = '库存不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oForm.sendNumber < 0) {
                        this.message = '库存不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                // if(this.oForm.reduceType==1&&this.oForm.discountMoney==0){
                //     if(this.oForm.validPayType==0||this.oForm.validPayType==2){
                //         this.message = '优惠券0元固定价格的时候只能选择非会员支付！';
                //         this.open();
                //         loading.close();
                //         return;
                //     }
                // }
                if (this.oForm.cinemaCode == true) {
                    this.oForm.cinemaCode = this.cinemaInfo[0].cinemaCode;
                }
                let filmeCodes = [];
                for (let i = 0; i < this.selectedSell.length; i++) {
                    filmeCodes.push(this.selectedSell[i].filmCode);
                }
                this.oForm.filmCode = filmeCodes.join(',');
                if (this.oForm.selectFilmType == 0) {
                    this.oForm.filmCode = '';
                }
                if (this.oForm.selectHallType == 0) {
                    this.selectScreenCode = '';
                }
                if (this.oForm.reduceType == 1) {
                    this.oForm.achieveMoney = '';
                }
                var jsonArr = [];
                jsonArr.push({key: 'name', value: this.oForm.name});
                jsonArr.push({key: 'commonType', value: this.oForm.commonType});
                jsonArr.push({key: 'cinemaCodes', value: this.selectValue});
                jsonArr.push({key: 'selectHallType', value: this.oForm.selectHallType});
                jsonArr.push({key: 'screenCode', value: this.selectScreenCode});
                jsonArr.push({key: 'selectFilmType', value: this.oForm.selectFilmType});
                jsonArr.push({key: 'filmCode', value: this.oForm.filmCode});
                // jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
                // jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
                jsonArr.push({key: 'reduceType', value: this.oForm.reduceType});
                jsonArr.push({key: 'validPayType', value: this.oForm.validPayType});
                jsonArr.push({key: 'achieveMoney', value: this.oForm.achieveMoney});
                jsonArr.push({key: 'discountMoney', value: this.oForm.discountMoney});
                jsonArr.push({key: 'status', value: this.oForm.status});
                jsonArr.push({key: 'holidayValid', value: this.oForm.holidayValid});
                jsonArr.push({key: 'exceptWeekDay', value: this.checkedDays});
                jsonArr.push({key: 'activityTogether', value: this.oForm.activityTogether});
                jsonArr.push({key: 'sendNumber', value: this.oForm.sendNumber});
                jsonArr.push({key: 'couponDesc', value: this.oForm.couponDesc});
                jsonArr.push({key: 'selectFilmFormatType', value: this.oForm.selectFilmFormatType});
                jsonArr.push({key: 'filmFormatCode', value: this.selectFormatCode});
                if (this.oForm.reduceType == 1) {
                    jsonArr.push({key: 'fixedSatisfyMoney', value: this.oForm.fixedSatisfyMoney});
                    jsonArr.push({key: 'fixedAddMoney', value: this.oForm.fixedAddMoney});
                }
                if (this.oForm.holidayValid == 1) {
                    if (this.oForm.reduceType == 1) {
                        jsonArr.push({key: 'holidayAddMoney', value: this.oForm.holidayAddMoney});
                    }
                    if (this.oForm.reduceType == 5) {
                        jsonArr.push({key: 'holidayAddMoney', value: this.oForm.holidayAddMoney});
                    }
                }
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/filmCoupon/addFilmCoupon', params)
                        .then(data => {
                            loading.close();
                            //新增
                            if (data.data.code == 'success') {
                                this.dialogFormVisible = false;
                                this.selectFilm = {};
                                this.oForm.filmName = '';
                                this.oForm.commonType = '1';
                                this.oForm.selectHallType = '0';
                                this.oForm.selectFilmType = '0';
                                this.oForm.name = '';
                                this.oForm.cinemaCode = [];
                                this.oForm.cinemaName = '';
                                this.oForm.merchandiseCode = [];
                                this.oForm.merchandiseName = '';
                                // this.oForm.startDate = '';
                                // this.oForm.endDate = '';
                                this.oForm.validPayType = '0';
                                this.oForm.reduceType = '1';
                                this.oForm.achieveMoney = '';
                                this.oForm.holidayAddMoney = '';
                                this.oForm.discountMoney = '';
                                this.oForm.holidayValid = '1';
                                this.oForm.checkedDays = [];
                                this.selectedSell = [];
                                this.oForm.status = '0';
                                this.oForm.filmCode = '';
                                this.oForm.activityTogether = '1';
                                this.oForm.sendNumber = '';
                                this.oForm.couponDesc = '';
                                this.$message.success(`新增成功`);
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
                }
            },
            // 取消按钮操作
            cancel() {
                this.$confirm('该操作将清空页面数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.dialogFormVisible = false;
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
            },
            delChange(index, row) {
                //删除数据
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.idx = index;
                        this.form = row;
                        let name = this.query.name;
                        let status = this.query.status;
                        if (!name) {
                            name = '';
                        }
                        if (!status) {
                            status = '';
                        }
                        let jsonArr = [];
                        jsonArr.push({key: 'id', value: row.id});
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({key: 'sign', value: sign});
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/filmCoupon/deleteById', params)
                            .then(data => {
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
                                console.log(err);
                            });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            addChange: function (index, row) {
                //是否拥有权限
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                this.idx = index;
                this.form = row;
                var jsonArr = [];
                jsonArr.push({key: 'id', value: row.id});
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/filmCoupon/getFilmCouponById', params)
                    .then(data => {
                        loading.close();
                        this.selectedSell = [];
                        if (data.data.code == 'success') {
                            if (JSON.parse(Decrypt(data.data.data)).coupon.filmCode && JSON.parse(Decrypt(data.data.data)).coupon.filmNames) {
                                let exFilmCodeList = JSON.parse(Decrypt(data.data.data)).coupon.filmCode.split(',');
                                let exFilmNameList = JSON.parse(Decrypt(data.data.data)).coupon.filmNames.split(',');
                                this.selectedSell = [];
                                for (let x in exFilmNameList) {
                                    let json = {};
                                    json.filmName = exFilmNameList[x];
                                    json.filmCode = exFilmCodeList[x];
                                    this.selectedSell.push(json);
                                }
                                console.log(this.selectedSell);
                            }
                            let formats = JSON.parse(Decrypt(data.data.data)).formatList;
                            this.formatList = [];
                            for (let i = 0; i < formats.length; i++) {
                                let formatArr = {};
                                formatArr.formatCode = formats[i].formatCode;
                                formatArr.formatName = formats[i].formatName;
                                this.formatList.push(formatArr);
                            }
                            this.editVisible = true;
                            this.oCinemaName = JSON.parse(Decrypt(data.data.data)).coupon.cinemaNames;
                            this.oScreenName = JSON.parse(Decrypt(data.data.data)).coupon.screenNames;
                            this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).coupon.cinemaCodes;
                            this.oCommonType = JSON.parse(Decrypt(data.data.data)).coupon.commonType;
                            this.oFilmFormatName = JSON.parse(Decrypt(data.data.data)).coupon.filmFormatName;
                            this.oHolidayAddMoney = JSON.parse(Decrypt(data.data.data)).coupon.holidayAddMoney;
                            this.oName = JSON.parse(Decrypt(data.data.data)).coupon.name;
                            this.oFixedSatisfyMoney = JSON.parse(Decrypt(data.data.data)).coupon.fixedSatisfyMoney;
                            this.oFixedAddMoney = JSON.parse(Decrypt(data.data.data)).coupon.fixedAddMoney;
                            // this.oStartDate = JSON.parse(Decrypt(data.data.data)).coupon.startDate;
                            if (JSON.parse(Decrypt(data.data.data)).coupon.exceptWeekDay) {
                                this.oCheckedDays = JSON.parse(Decrypt(data.data.data)).coupon.exceptWeekDay.split(',');
                            } else {
                                this.oCheckedDays = [];
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.screenCode) {
                                this.oScreenCode = JSON.parse(Decrypt(data.data.data)).coupon.screenCode.split(',');
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.filmFormatCode) {
                                this.oFilmFormatCode = JSON.parse(Decrypt(data.data.data)).coupon.filmFormatCode.split(',');
                            }
                            // this.oEndDate = JSON.parse(Decrypt(data.data.data)).coupon.endDate;
                            if (JSON.parse(Decrypt(data.data.data)).coupon.validPayType == 0) {
                                this.oValidPayType = '0';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.validPayType == 1) {
                                this.oValidPayType = '1';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.validPayType == 2) {
                                this.oValidPayType = '2';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.selectFilmType == 0) {
                                this.oSelectFilmType = '0';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.selectFilmType == 1) {
                                this.oSelectFilmType = '1';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.selectFilmType == 2) {
                                this.oSelectFilmType = '2';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.selectHallType == 0) {
                                this.oSelectHallType = '0';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.selectHallType == 1) {
                                this.oSelectHallType = '1';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.selectHallType == 2) {
                                this.oSelectHallType = '2';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.selectFilmFormatType == 0) {
                                this.oSelectFilmFormatType = '0';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.selectFilmFormatType == 1) {
                                this.oSelectFilmFormatType = '1';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.selectFilmFormatType == 2) {
                                this.oSelectFilmFormatType = '2';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.reduceType == 1) {
                                this.oReduceType = '1';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.reduceType == 2) {
                                this.oReduceType = '2';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.reduceType == 3) {
                                this.oReduceType = '3';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.reduceType == 4) {
                                this.oReduceType = '4';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).coupon.reduceType == 5) {
                                this.oReduceType = '5';
                            }
                            this.oDiscountMoney = JSON.parse(Decrypt(data.data.data)).coupon.discountMoney;
                            this.oAchieveMoney = JSON.parse(Decrypt(data.data.data)).coupon.achieveMoney;
                            this.oCouponDesc = JSON.parse(Decrypt(data.data.data)).coupon.couponDesc;
                            this.oSendNumber = JSON.parse(Decrypt(data.data.data)).coupon.sendNumber;
                            this.oId = JSON.parse(Decrypt(data.data.data)).coupon.id;
                            for (let x in this.canUse) {
                                if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).coupon.activityTogether) {
                                    this.oActivityTogether = this.canUse[x].value;
                                    break;
                                }
                            }
                            for (let x in this.canUse) {
                                if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).coupon.holidayValid) {
                                    this.oHolidayValid = this.canUse[x].value;
                                    break;
                                }
                            }
                            for (let x in this.options) {
                                if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).coupon.status) {
                                    this.oStatus = this.options[x].value;
                                    break;
                                }
                            }
                            this.getAllScreen(this.oCinemaCode);
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
            // 编辑操作
            exChanger() {
                for (let x in this.filmInfo) {
                    this.selectFilmCode.push(this.filmInfo[x].filmCode);
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                if (!this.oName) {
                    this.message = '优惠券名称不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oCommonType == 2) {
                    if (!this.oCinemaCode) {
                        this.message = '所选影院不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (!this.oSelectHallType) {
                        this.message = '影厅类型不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oSelectHallType == 1 || this.oSelectHallType == 2) {
                        if (this.oScreenCode.length == 0) {
                            this.message = '影厅名不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                }
                if (!this.oSelectFilmFormatType) {
                    this.message = '制式类型不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oSelectFilmFormatType == 1 || this.oSelectFilmFormatType == 2) {
                    if (this.oFilmFormatCode.length == 0) {
                        this.message = '制式不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (!this.oSelectFilmType) {
                    this.message = '影片类型不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oSelectFilmType == 1 || this.oSelectFilmType == 2) {
                    if (this.selectedSell.length == 0) {
                        this.message = '所选影片不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (!this.oValidPayType) {
                    this.message = '可用支付方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oReduceType) {
                    this.message = '优惠方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oReduceType == 1) {
                    if (this.oDiscountMoney > 0) {
                        if (!this.oDiscountMoney) {
                            this.message = '固定金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (this.oDiscountMoney < 0) {
                        this.message = '固定金额不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oReduceType == 2) {
                    if (this.oDiscountMoney > 0) {
                        if (!this.oDiscountMoney) {
                            this.message = '减免金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (this.oDiscountMoney < 0) {
                        this.message = '减免金额不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oReduceType == 3) {
                    if (this.oDiscountMoney >= 0 || this.oAchieveMoney >= 0) {
                        if (!this.oAchieveMoney) {
                            this.message = '张数不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (!this.oDiscountMoney) {
                            this.message = '减免金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (this.oAchieveMoney < 0 || this.oAchieveMoney > 4) {
                        this.message = '张数必须在0-4之间，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oDiscountMoney <= 0) {
                        this.message = '减免金额必须大于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                    // if(this.oDiscountMoney>=0||this.oAchieveMoney>=0){
                    //     if(!this.oAchieveMoney){
                    //         this.message = '张数不能为空，请检查！';
                    //         this.open();
                    //         loading.close();
                    //         return;
                    //     }
                    //     if(!this.oDiscountMoney){
                    //         this.message = '减免金额不能为空，请检查！';
                    //         this.open();
                    //         loading.close();
                    //         return;
                    //     }
                    // }
                    // if(this.oDiscountMoney<0||this.oAchieveMoney<0){
                    //     this.message = '请输入合理的满减金额以及张数！';
                    //     this.open();
                    //     loading.close();
                    //     return;
                    // }
                    // if(this.oAchieveMoney==0&&this.oDiscountMoney==0){
                    //     this.message = '请输入合理的满减金额以及张数！';
                    //     this.open();
                    //     loading.close();
                    //     return;
                    // }
                }
                if (this.oReduceType == 4) {
                    if (this.oAchieveMoney == 0 || this.oDiscountMoney == 0) {
                        this.message = '请输入合理的满减金额！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oDiscountMoney > 0 || this.oAchieveMoney > 0) {
                        if (!this.oDiscountMoney || !this.oAchieveMoney) {
                            this.message = '减免金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (this.oDiscountMoney < 0 || this.oAchieveMoney < 0) {
                        this.message = '减免金额不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (Number(this.oDiscountMoney) > Number(this.oAchieveMoney)) {
                        this.message = '减免金额不能大于满减金额！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oReduceType == 5) {
                    if (this.oDiscountMoney > 0) {
                        if (!this.oDiscountMoney) {
                            this.message = '增减金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                }
                if (!this.oStatus) {
                    this.message = '开启状态不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oHolidayValid) {
                    this.message = '节假日是否可用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                // if (this.oReduceType == 1&&this.oHolidayValid==1) {
                //     if (this.oHolidayAddMoney > 0) {
                //         if (!this.oHolidayAddMoney) {
                //             this.message = '节假日加价金额不能为空，请检查！';
                //             this.open();
                //             loading.close();
                //             return;
                //         }
                //         if (this.oHolidayAddMoney<0) {
                //             this.message = '节假日加价金额不能小于0，请检查！';
                //             this.open();
                //             loading.close();
                //             return;
                //         }
                //     }
                // }
                if (!this.oActivityTogether) {
                    this.message = '是否和活动共用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oSendNumber > 0) {
                    if (!this.oSendNumber) {
                        this.message = '库存不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oSendNumber < 0) {
                        this.message = '库存不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                // if(this.oReduceType==1&&this.oDiscountMoney==0){
                //     if(this.oValidPayType==0||this.oValidPayType==2){
                //         this.message = '优惠券0元固定价格的时候只能选择非会员支付！';
                //         this.open();
                //         loading.close();
                //         return;
                //     }
                //
                // }
                let filmCodeList = [];
                for (let x in this.selectedSell) {
                    filmCodeList.push(this.selectedSell[x].filmCode);
                }
                var jsonArr = [];
                jsonArr.push({key: 'name', value: this.oName});
                jsonArr.push({key: 'commonType', value: this.oCommonType});
                jsonArr.push({key: 'cinemaCodes', value: this.oCinemaCode});
                jsonArr.push({key: 'selectFilmFormatType', value: this.oSelectFilmFormatType});
                jsonArr.push({key: 'filmCode', value: filmCodeList.join(',')});
                jsonArr.push({key: 'selectFilmType', value: this.oSelectFilmType});
                jsonArr.push({key: 'filmFormatCode', value: this.oFilmFormatCode.join(',')});
                jsonArr.push({key: 'selectHallType', value: this.oSelectHallType});
                jsonArr.push({key: 'screenCode', value: this.oScreenCode.join(',')});
                jsonArr.push({key: 'discountMoney', value: this.oDiscountMoney});
                jsonArr.push({key: 'achieveMoney', value: this.oAchieveMoney});
                // jsonArr.push({ key: 'startDate', value: this.oStartDate });
                // jsonArr.push({ key: 'endDate', value: this.oEndDate });
                jsonArr.push({key: 'status', value: this.oStatus});
                jsonArr.push({key: 'couponDesc', value: this.oCouponDesc});
                jsonArr.push({key: 'holidayValid', value: this.oHolidayValid});
                jsonArr.push({key: 'exceptWeekDay', value: this.oCheckedDays.join(',')});
                jsonArr.push({key: 'validPayType', value: this.oValidPayType});
                jsonArr.push({key: 'sendNumber', value: this.oSendNumber});
                jsonArr.push({key: 'reduceType', value: this.oReduceType});
                jsonArr.push({key: 'activityTogether', value: this.oActivityTogether});
                jsonArr.push({key: 'id', value: this.oId});
                if (this.oReduceType == 1) {
                    jsonArr.push({key: 'fixedSatisfyMoney', value: this.oFixedSatisfyMoney});
                    jsonArr.push({key: 'fixedAddMoney', value: this.oFixedAddMoney});
                }
                if (this.oHolidayValid == 1) {
                    if (this.oReduceType == 1) {
                        jsonArr.push({key: 'holidayAddMoney', value: this.oHolidayAddMoney});
                    }
                    if (this.oReduceType == 5) {
                        jsonArr.push({key: 'holidayAddMoney', value: this.oHolidayAddMoney});
                    }
                }
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/filmCoupon/updateCouponById', params)
                    .then(data => {
                        loading.close();
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.$message.success(`编辑成功`);
                            this.editVisible = false;
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
            },
            // 修改状态
            changeStatus(index, row) {
                console.log(row);
                if (row.status == 0) {
                    this.rowMess = '启用';
                }
                if (row.status == 1) {
                    this.rowMess = '停用';
                }
                this.$confirm('是否确定' + this.rowMess + '此优惠券?', '提示', {
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
                        this.idx = index;
                        this.form = row;
                        var jsonArr = [];
                        let status;
                        if (row.status == 1) {
                            status = 0;
                        } else if (row.status == 0) {
                            status = 1;
                        }
                        jsonArr.push({key: 'id', value: row.id});
                        jsonArr.push({key: 'status', value: status});
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({key: 'sign', value: sign});
                        console.log(jsonArr);
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/filmCoupon/updateCouponStatusById', params)
                            .then(data => {
                                loading.close();
                                // console.log(JSON.parse(Decrypt(data.data.data)));
                                if (data.data.code == 'success') {
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
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        });
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
                let cinemaCode = this.query.cinemaCode;
                let reduceType = this.query.reduceType;
                let commonType = this.query.commonType;
                let name = this.query.name;
                let status = this.query.status;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!reduceType) {
                    reduceType = '';
                }
                if (!commonType) {
                    commonType = '';
                }
                if (!name) {
                    name = '';
                }
                if (!status) {
                    status = '';
                }
                let jsonArr = [];
                jsonArr.push({key: 'reduceType', value: reduceType});
                jsonArr.push({key: 'commonType', value: commonType});
                jsonArr.push({key: 'name', value: name});
                jsonArr.push({key: 'status', value: status});
                jsonArr.push({key: 'cinemaCodes', value: cinemaCode});
                jsonArr.push({key: 'pageNo', value: this.query.pageNo});
                jsonArr.push({key: 'pageSize', value: this.query.pageSize});
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/filmCoupon/filmCouponPage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.cinemaInfo = [];
                            for (let i = 0; i < oData.cinemaList.length; i++) {
                                let cinemaList = {};
                                cinemaList.cinemaCode = oData.cinemaList[i].cinemaCode;
                                cinemaList.cinemaName = oData.cinemaList[i].cinemaName;
                                this.cinemaInfo.push(cinemaList);
                            }
                            this.oForm.cinemaCode = this.cinemaInfo[0].cinemaCode;
                            this.selectValue = this.cinemaInfo[0].cinemaCode;
                            this.tableData = oData.pageResult.data;
                            this.query.pageSize = oData.pageResult.pageSize;
                            this.query.pageNo = oData.pageResult.pageNo;
                            this.query.totalCount = oData.pageResult.totalCount;
                            this.query.totalPage = oData.pageResult.totalPage;
                            this.getAllCinema();
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
            open() {
                //信息提示弹出框
                this.$alert(this.message, '信息提示', {
                    dangerouslyUseHTMLString: true
                });
            },
            selectCinema(val) {
                this.oScreenCode = [];
                this.filmInfo = [];
                this.oFilmFormatCode = [];
                this.selectValue = val;
                this.getAllScreen(val);
            },
            selectScreens(val) {
                let selectValue = val.join(',');
                this.selectScreenCode = selectValue;
            },
            selectDay(val) {
                this.checkedDays = val.join(',');
            },
            // 获取所有影院
            getAllCinema() {
                https
                    .fetchPost('/cinema/getAllCinema')
                    .then(data => {
                        if (data.data.code == 'success') {
                            var res = JSON.parse(Decrypt(data.data.data));
                            this.cinemaData = res;
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
            // 获取所选影院影厅
            getAllScreen(value) {
                if (!value) {
                    this.screenInfo = [];
                    return;
                }
                let jsonArr = [];
                jsonArr.push({key: 'cinemaCode', value: value});
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('filmCoupon/getScreenInfoByCinemaCode', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            let screens = JSON.parse(Decrypt(data.data.data));
                            this.screenInfo = [];
                            for (let i = 0; i < screens.length; i++) {
                                let screenList = {};
                                screenList.screenCode = screens[i].screenCode;
                                screenList.screenName = screens[i].screenName;
                                this.screenInfo.push(screenList);
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
                        console.log(err);
                    });
            },
            selectFormat(val) {
                this.selectFormatCode = val.join(',');
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(val) {
                this.query.pageSize = val;
                this.getMenu();
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
            aHandleSizeChange(val) {
                this.query.aPageSize = val;
                this.openNext();
            },
            aCurrentChange(val) {
                //点击选择具体页数
                this.query.aPageNo = val;
                this.openNext();
            },
            aPrev() {
                //分页按钮上一页
                this.query.aPageNo--;
                this.openNext();
            },
            aNext() {
                //分页按钮下一页
                this.query.aPageNo++;
                this.openNext();
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

    .mr12 {
        width: 30%;
        margin-right: 10px;
    }
</style>
