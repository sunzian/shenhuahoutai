<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影票活动管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.cinemaCode" placeholder="影院" class="handle-select mr10">
                    <el-option
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="活动名称" class="handle-input mr10"></el-input>
                <el-select clearable v-model="query.reduceType" placeholder="优惠方式" class="handle-select mr10">
                    <el-option key="1" label="特惠活动" value="1"></el-option>
                    <el-option key="2" label="立减活动" value="2"></el-option>
                </el-select>
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="启用" value="1"></el-option>
                    <el-option key="2" label="未启用" value="0"></el-option>
                </el-select>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                        type="primary"
                        @click="addPage"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px"
                >新增活动</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    height="500"
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="适用影院" width="160">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column label="活动名称" width="160">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="name" label="适用影厅">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.selectHallType == 0">全部影厅</el-tag>
                        <el-tag v-else-if="scope.row.reduceType == 1" >{{scope.row.screenName}}</el-tag>
                        <el-tag v-else-if="scope.row.reduceType == 2" >除{{scope.row.screenName}}外所有影厅</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="适用制式" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.selectFilmFormatType == 0">全部制式</el-tag>
                        <el-tag v-else-if="scope.row.selectFilmFormatType == 1" >{{scope.row.filmFormatName}}</el-tag>
                        <el-tag v-else-if="scope.row.selectFilmFormatType == 2" >除{{scope.row.filmFormatName}}外所有制式</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="适用影片">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.selectFilmType == 0">全部影片</el-tag>
                        <el-tag v-else-if="scope.row.selectFilmType == 1" >{{scope.row.filmName}}</el-tag>
                        <el-tag v-else-if="scope.row.selectFilmType == 2" >除{{scope.row.filmName}}外所有影片</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="限购总数" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isLimitTotal == 0">不限购</el-tag>
                        <el-tag v-else-if="scope.row.isLimitTotal == 1" >{{scope.row.totalNumber}}/{{scope.row.totalSurplus}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="个人限购" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isLimitSingle == 0">不限购</el-tag>
                        <el-tag v-else-if="scope.row.isLimitSingle == 1" >{{scope.row.singleNumber}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="优惠方式" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.reduceType == 1">特惠价格</el-tag>
                        <el-tag v-else-if="scope.row.reduceType == 2" >立减金额</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="金额" width="60">
                    <template slot-scope="scope">{{scope.row.discountMoney}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="有效期" width="170">
                    <template slot-scope="scope">{{scope.row.startDate}}至{{scope.row.endDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="success"
                                v-if="scope.row.status == 0"
                                @click="changeStatus(scope.$index, scope.row)"
                        >启用</el-button>
                        <el-button
                                type="success"
                                v-if="scope.row.status == 1"
                                @click="changeStatus(scope.$index, scope.row)"
                        >停用</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-circle-plus-outline"
                                @click="addChange(scope.$index, scope.row)"
                        >修改</el-button>
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
                        @prev-click="prev"
                        @next-click="next"
                ></el-pagination>
            </div>
        </div>
        <!--新增弹出框-->
        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="活动名称：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择影院：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.code" @change="selectCinema">
                        <el-radio
                                v-for="item in cinemaInfo"
                                :label="item.cinemaCode"
                                :key="item.cinemaCode"
                                :value="item.cinemaName"
                        >{{item.cinemaName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="选择影厅：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.selectHallType">
                        <el-radio label="0">全部影厅</el-radio>
                        <el-radio label="1">指定影厅参加</el-radio>
                        <el-radio label="2">指定影厅不参加</el-radio>
                     </el-radio-group>
                <el-checkbox-group :required="true" v-model="oForm.screenCode" @change="selectScreens" v-if="oForm.selectHallType != 0">
                    <el-checkbox
                            v-for="item in screenInfo"
                            :label="item.screenCode"
                            :key="item.screenCode"
                            :value="item.screenName"
                    >{{item.screenName}}</el-checkbox>
                </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="选择制式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.selectMovieType">
                        <el-radio label="0">全部制式参加</el-radio>
                        <el-radio label="1">指定制式参加</el-radio>
                        <el-radio label="2">指定制式不参加</el-radio>
                    </el-radio-group>
                    <el-checkbox-group v-model="oForm.formatCode" @change="selectFormat" v-if="oForm.selectMovieType != 0">
                        <el-checkbox
                                v-for="item in formatList"
                                :label="item.formatCode"
                                :key="item.formatCode"
                                :value="item.formatName"
                        >{{item.formatName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="选择影片：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.selectFilmType">
                        <el-radio label="0">全部影片</el-radio>
                        <el-radio label="1">部分影片</el-radio>
                        <el-radio label="2">排除影片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.selectFilmType != 0" label="选择影片" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选影片"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0"
                        :required="true"
                >
                    <div v-for="(item, index) in selectedSell" style="margin-bottom: 5px" :key="index">
                        <el-input
                                style="width: 250px"
                                v-model="item.filmName"
                                autocomplete="off"
                                :value="item.filmCode"
                                :disabled="true"
                                :change="one(item.filmCode)"
                        >
                        </el-input>
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deleteSell(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="有效期：" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oForm.startDate"
                            type="datetime"
                            placeholder="开始时间"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>至
                    <el-date-picker
                            v-model="oForm.endDate"
                            type="datetime"
                            placeholder="结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="支付类型：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.validPayType">
                        <el-radio label="0">全部</el-radio>
                        <el-radio label="1">仅非会员卡支付</el-radio>
                        <el-radio label="2">仅会员卡支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="优惠方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.reduceType">
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">立减</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="固定金额：" :label-width="formLabelWidth" v-if="oForm.reduceType == 1">
                    <el-input style="width: 150px" v-model="oForm.discountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="立减金额：" :label-width="formLabelWidth" v-if="oForm.reduceType == 2">
                    <!--满-->
                    <!--<el-input style="width: 150px" v-model="oForm.achieveMoney" autocomplete="off"></el-input>-->
                    减
                    <el-input style="width: 150px" v-model="oForm.discountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="开启状态：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="节假日是否可用：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.holidayValid" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="可用时间段：" :label-width="formLabelWidth">
                    <el-time-picker
                            is-range
                            type="date"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            v-model="value1"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围">
                    </el-time-picker>
                    <span style="cursor: pointer;color: blue" @click="addTime">添加</span>
                </el-form-item>
                <el-form-item
                        label="所选时间段："
                        :label-width="formLabelWidth"
                        v-if="dateInfo.length>0">
                    <div v-for="(item, index) in dateInfo" :key="index">
                        {{item}}
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deletTime(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="星期几不可用：" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="oForm.checkedDays" @change="selectDay">
                        <el-checkbox
                                v-for="(day, index) in oForm.exceptWeekDay"
                                :label="index+1"
                                :key="day"
                        >{{day}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="是否和券共用" :label-width="formLabelWidth">
                    <el-select v-model="oForm.activityTogether" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="是否限制张数：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.oCanNum" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="活动总张数：" v-if="oForm.oCanNum==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.oNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="是否限制个人张数：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.oneCanNum" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="限购时间：" v-if="oForm.oneCanNum==1" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.limitSingleUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="个人总张数：" v-if="oForm.oneCanNum==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.oneNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="使用须知：" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="250"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="oForm.couponDesc"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!--新增抽屉弹出框-->
        <el-dialog title="选择影片" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.filmName" placeholder="影片名称" class="handle-input mr10"></el-input>
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
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="id" :label="scope.$index" @change.native="getCurrentRow(scope.$index)">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="图片">
                        <template slot-scope="scope">
                            <el-popover
                                    placement="right"
                                    title=""
                                    trigger="hover">
                                <img style="width:400px" :src="scope.row.image"/>
                                <img slot="reference" :src="scope.row.image" :alt="scope.row.image" style="max-height: 50px;max-width: 130px">
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="影片名称" width="150">
                        <template slot-scope="scope">{{scope.row.filmName}}</template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="query.pageNo"
                            :page-size="query.pageSize"
                            :total="query.totalCount"
                            @current-change="aCurrentChange"
                            @prev-click='aPrev'
                            @next-click="aNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button type="primary" @click="sureNext">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="修改" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="活动名称：" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择影院：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oCinemaCode" @change="selectCinema">
                        <el-radio
                                v-for="item in cinemaInfo"
                                :label="item.cinemaCode"
                                :key="item.cinemaCode"
                                :value="item.cinemaName"
                        >{{item.cinemaName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="选择影厅：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oSelectHallType">
                        <el-radio label="0">全部影厅</el-radio>
                        <el-radio label="1">指定影厅参加</el-radio>
                        <el-radio label="2">指定影厅不参加</el-radio>
                    </el-radio-group>
                    <el-checkbox-group v-model="oScreenCode" @change="selectScreens" v-if="oSelectHallType != 0">
                        <el-checkbox
                                v-for="item in screenInfo"
                                :label="item.screenCode"
                                :key="item.screenCode"
                                :value="item.screenName"
                        >{{item.screenName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="选择制式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oSelectFilmFormatType">
                        <el-radio label="0">全部制式参加</el-radio>
                        <el-radio label="1">指定制式参加</el-radio>
                        <el-radio label="2">指定制式不参加</el-radio>
                    </el-radio-group>
                    <el-checkbox-group v-model="oFilmFormatCode" @change="selectFormat" v-if="oSelectFilmFormatType != 0">
                        <el-checkbox
                                v-for="item in formatList"
                                :label="item.formatCode"
                                :key="item.formatCode"
                                :value="item.formatName"
                        >{{item.formatName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="选择影片：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oSelectFilmType">
                        <el-radio label="0">全部影片</el-radio>
                        <el-radio label="1">部分影片</el-radio>
                        <el-radio label="2">排除影片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oSelectFilmType != 0" label="选择影片" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选影片"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0"
                        :required="true"
                >
                    <div v-for="(item, index) in selectedSell" style="margin-bottom: 5px" :key="index">
                        <el-input
                                style="width: 250px"
                                v-model="item.filmName"
                                autocomplete="off"
                                :value="item.filmCode"
                                :disabled="true"
                                :change="one(item.filmCode)"
                        >
                        </el-input>
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deleteSell(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="有效期：" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oStartDate"
                            type="datetime"
                            placeholder="开始时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>至
                    <el-date-picker
                            v-model="oEndDate"
                            type="datetime"
                            placeholder="结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="支付类型：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oValidPayType">
                        <el-radio label="0">全部</el-radio>
                        <el-radio label="1">仅非会员卡支付</el-radio>
                        <el-radio label="2">仅会员卡支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="优惠方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oReduceType">
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">立减</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="固定金额：" :label-width="formLabelWidth" v-if="oReduceType == 1">
                    <el-input style="width: 150px" v-model="oDiscountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="立减金额：" :label-width="formLabelWidth" v-if="oReduceType == 2">
                    <!--满-->
                    <!--<el-input style="width: 150px" v-model="oForm.achieveMoney" autocomplete="off"></el-input>-->
                    减
                    <el-input style="width: 150px" v-model="oDiscountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="开启状态：" :label-width="formLabelWidth">
                    <el-select v-model="oStatus" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="节假日是否可用：" :label-width="formLabelWidth">
                    <el-select v-model="oIsHolidayValid" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="可用时间段：" :label-width="formLabelWidth">
                    <el-time-picker
                            is-range
                            type="date"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            v-model="value1"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围">
                    </el-time-picker>
                    <span style="cursor: pointer;color: blue" @click="addTime">添加</span>
                </el-form-item>
                <el-form-item
                        label="所选时间段："
                        :label-width="formLabelWidth"
                        v-if="dateInfo.length>0">
                    <div v-for="(item, index) in dateInfo" :key="index">
                        {{item}}
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deletTime(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="星期几不可用：" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="oCheckedDays" @change="selectDay">
                        <el-checkbox
                                v-for="item in oExceptWeekDay"
                                :label="item.index"
                                :key="item.index"
                                :value="item.value"
                        >{{item.value}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="是否和券共用" :label-width="formLabelWidth">
                    <el-select v-model="oIsCouponTogether" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="是否限制张数：" :label-width="formLabelWidth">
                    <el-select v-model="oIsLimitTotal" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="活动总张数：" v-if="oIsLimitTotal==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oTotalNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="是否限制个人张数：" :label-width="formLabelWidth">
                    <el-select v-model="oIsLimitSingle" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="限购时间：" v-if="oIsLimitSingle==1" :label-width="formLabelWidth">
                    <el-radio-group v-model="oLimitSingleUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="个人总张数：" v-if="oIsLimitSingle==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oSingleNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="使用须知：" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="250"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="oActivityDesc"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button @click="exChanger">确 定</el-button>
            </span>
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
                oExceptWeekDay: [
                    {
                        index:"1",
                        value:'星期一'
                    },
                    {
                        index:"2",
                        value:'星期二'
                    },
                    {
                        index:"3",
                        value:'星期三'
                    },
                    {
                        index:"4",
                        value:'星期四'
                    },
                    {
                        index:"5",
                        value:'星期五'
                    },
                    {
                        index:"6",
                        value:'星期六'
                    },
                    {
                        index:"7",
                        value:'星期日'
                    },
                ],
                oCinemaCode:'',
                oSelectHallType:'',
                oSelectFilmFormatType:'',
                oActivityDesc:'',
                oStartDate:'',
                oEndDate:'',
                oSelectFilmType:'',
                oLimitSingleUnit:'',
                oScreenCode:[],
                selectedSell:[],
                oCheckedDays:[],
                oFilmFormatCode:[],
                sellIndex:'',
                sellTableData:[],
                drawer: false,//新增抽屉弹出框
                value1:'',
                oCinemaName: '',
                oScreenName: '',
                oFilmFormatName:'',
                selectFilmFormatType:'',
                selectHallType:'',
                selectFilmType:'',
                oFilmName: '',
                oName: '',
                oCreateDate: '',
                oValidPayType: '',
                oReduceType: '',
                oDiscountMoney: '',
                oAchieveMoney: '',
                oCouponDesc: '',
                oIsHolidayValid:'',
                oValidWeekDay:'',
                oIsCouponTogether:'',
                oId: '',
                oIsLimitTotal:'',
                oTotalNumber:'',
                oTotalSurplus:'',
                oIsLimitSingle:'',////
                oSingleNumber:'',
                oStatus: '',
                formatList:[],//电影制式列表
                message: '', //弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 15
                },
                restaurants: [],
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                selectScreen: '', // 选中的影厅
                idx: -1,
                id: -1,
                dialogFormVisible: false,
                options: [{
                        value: '0',
                        label: '未启用'
                    },
                    {
                        value: '1',
                        label: '启用'
                    }],
                canUse: [{
                        value: '0',
                        label: '否'
                    },
                    {
                        value: '1',
                        label: '是'
                    }],
                oForm: {
                    name: '',
                    cinemaName: '',
                    cinemaCode: [],
                    screenName: '',
                    screenCode: [],
                    formatCode:[],
                    selectFilmType: '0',//选择影片
                    selectHallType: '0',//选择影厅
                    selectMovieType:'0',//选择制式
                    code:[],//选择影院
                    filmCode: '',
                    filmName: '',
                    checkedDays: [],
                    exceptWeekDay: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                    startDate: '',
                    endDate: '',
                    validPayType: '0',
                    holidayValid: '1',
                    activityTogether: '0',
                    oCanNum: '0',
                    oneCanNum: '0',
                    limitSingleUnit: '年',
                    achieveMoney: '',
                    discountMoney: '',
                    reduceType: '1',
                    couponDesc: '',
                    id: '',
                    status: '0'
                },
                formLabelWidth: '120px',
                selectValue: {},
                selectScreenCode: {},
                selectFormatCode: {},
                selectFilm: {},
                cinemaInfo: [],
                screenInfo: [],
                filmInfo: [],//所选影片
                dateInfo:[],//所选时间段
                startArr:[],
                endArr:[],
                value: '',
                canTimeList:[],//可用时间段列表
            };
        },
        created() {},
        mounted() {
            this.getMenu();
        },
        methods: {
            deleteSell(index) {
                this.selectedSell.splice(index, 1);
            },
            getCurrentRow(index){
                this.sellIndex=index
            },
            addTime(){
                // 筛选重复时间段
                var result = this.dateInfo.some(item => {
                    if (item == this.value1) {
                        return true;
                    }
                });
                if (result) {
                    return;
                }
                this.dateInfo.push(this.value1);
                this.startArr.push(this.value1[0]);
                this.endArr.push(this.value1[1]);
                console.log(this.startArr.join(','));
                console.log(this.endArr.join(','));
                console.log(this.dateInfo);
            },
            deletTime(index) {
                this.dateInfo.splice(index, 1);
                this.startArr.splice(index, 1);
                this.endArr.splice(index, 1);
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
                https.fetchPost('/filmDiscountActivity/addPage', '').then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.selectedSell=[];
                            this.oForm.code = this.cinemaInfo[0].cinemaCode;
                            this.getAllScreen( this.oForm.code);
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            let formats = JSON.parse(Decrypt(data.data.data)).formatList;
                            this.formatList = [];
                            for (let i = 0; i < formats.length; i++) {
                                let formatList = {};
                                formatList.formatCode = formats[i].formatCode;
                                formatList.formatName = formats[i].formatName;
                                this.formatList.push(formatList);
                            }
                            // this.formatList=JSON.parse(Decrypt(data.data.data)).formatList
                            this.dialogFormVisible = true;
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
            addRole() {//新增按钮操作
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                if(!this.oForm.name||!this.oForm.startDate||!this.oForm.endDate||!this.oForm.couponDesc){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oForm.discountMoney!=0){
                    if(!this.oForm.discountMoney){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oForm.selectHallType==1||this.oForm.selectHallType==2){
                    if(!this.oForm.screenCode){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oForm.selectMovieType==1||this.oForm.selectMovieType==2){
                    if(!this.oForm.formatCode){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oForm.selectFilmType==1||this.oForm.selectFilmType==2){
                    if(!this.selectedSell){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oForm.oCanNum==1){
                    if(!this.oForm.oNum){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oForm.oneCanNum==1){
                    if(!this.oForm.oneNum){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.code == true) {
                    this.oForm.code = this.cinemaInfo[0].code;
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
                jsonArr.push({ key: 'name', value: this.oForm.name });
                jsonArr.push({ key: 'cinemaCode', value: this.selectValue });
                jsonArr.push({ key: 'selectHallType', value: this.oForm.selectHallType });
                if(this.oForm.selectHallType!=0){
                    jsonArr.push({ key: 'screenCode', value: this.selectScreenCode });
                }
                jsonArr.push({ key: 'selectFilmType', value: this.oForm.selectFilmType });
                if(this.oForm.selectFilmType!=0){
                    jsonArr.push({ key: 'filmCode', value: this.oForm.filmCode });
                }
                jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
                jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
                jsonArr.push({ key: 'reduceType', value: this.oForm.reduceType });
                jsonArr.push({ key: 'validPayType', value: this.oForm.validPayType });
                jsonArr.push({ key: 'discountMoney', value: this.oForm.discountMoney });
                jsonArr.push({ key: 'status', value: this.oForm.status });
                jsonArr.push({ key: 'isHolidayValid', value: this.oForm.holidayValid });
                jsonArr.push({ key: 'validWeekDay', value: this.checkedDays });
                jsonArr.push({ key: 'isCouponTogether', value: this.oForm.activityTogether });
                jsonArr.push({ key: 'activityDesc', value: this.oForm.couponDesc });
                jsonArr.push({ key: 'startTimeVal', value: this.startArr.join(',')});
                jsonArr.push({ key: 'endTimeVal', value: this.endArr.join(',')});
                jsonArr.push({ key: 'isLimitTotal', value: this.oForm.oCanNum });
                if(this.oForm.oCanNum!=0){
                    jsonArr.push({ key: 'totalNumber', value: this.oForm.oNum });
                }
                if(this.oForm.oneCanNum!=0){
                    jsonArr.push({ key: 'singleNumber', value: this.oForm.oneNum });
                    jsonArr.push({ key: 'limitSingleUnit', value: this.oForm.limitSingleUnit });
                }
                jsonArr.push({ key: 'isLimitSingle', value: this.oForm.oneCanNum });
                jsonArr.push({ key: 'selectFilmFormatType', value: this.oForm.selectMovieType});
                if(this.oForm.selectMovieType!=0){
                    jsonArr.push({ key: 'FilmFormatCode', value: this.oForm.formatCode});
                }
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https.fetchPost('/filmDiscountActivity/addActivity', params).then(data => {//新增
                            loading.close();
                            console.log(data);
                            if (data.data.code == 'success') {
                                this.dialogFormVisible = false;
                                this.$message.success(`新增成功`);
                                this.oForm.selectFilmType='0';
                                this.oForm.selectHallType='0';
                                this.oForm.selectMovieType='0';
                                this.oForm.validPayType='0';
                                this.oForm.holidayValid='1';
                                this.oForm.activityTogether='0';
                                this.oForm.oCanNum='0';
                                this.oForm.oneCanNum='0';
                                this.oForm.limitSingleUnit='年';
                                this.oForm.reduceType='1';
                                this.oForm.status='0';
                                this.value1='';
                                this.dateInfo=[];
                                this.oForm.name = '';
                                this.selectValue = [];
                                this.selectScreenCode = '';
                                this.oForm.filmCode = '';
                                this.oForm.startDate = '';
                                this.oForm.endDate = '';
                                this.oForm.achieveMoney = '';
                                this.oForm.discountMoney = '';
                                this.oForm.checkedDays = [];
                                this.startArr = [];
                                this.endArr = [];
                                this.oForm.sendNumber = '';
                                this.oForm.couponDesc = '';
                                this.oForm.oNum = '';
                                this.oForm.oneNum = '';
                                this.oForm.code = '';
                                this.oForm.formatCode = [];
                                this.oForm.screenCode = [];
                                this.getMenu();
                            } else if (data.data.code == 'nologin') {
                                this.message = data.data.message;
                                this.open();
                                this.$router.push('/login');
                            } else {
                                this.message = data.data.message;
                                this.open();
                            }
                        }).catch(err => {
                            loading.close();
                            console.log(err);
                        });
                }
            },
            delChange(index, row) {
                //删除数据
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
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
                        jsonArr.push({ key: 'id', value: row.id });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https.fetchPost('/filmDiscountActivity/deleteById', params).then(data => {
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
            addChange(index, row) {
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
                jsonArr.push({ key: 'id', value: row.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/filmDiscountActivity/getTimesById', params).then(data => { //查询可用时间段
                    loading.close();
                    console.log(data);
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    this.dateInfo=[];
                    this.startArr=[];
                    this.endArr=[];
                    for(let x in JSON.parse(Decrypt(data.data.data))){
                        let jsonarr=[];
                        jsonarr.push(JSON.parse(Decrypt(data.data.data))[x].startTime);
                        jsonarr.push(JSON.parse(Decrypt(data.data.data))[x].endTime);
                        this.dateInfo.push(jsonarr)
                    }
                    for(let x in this.dateInfo){
                        this.startArr.push(this.dateInfo[x][0])
                        this.endArr.push(this.dateInfo[x][1]);
                    }
                    console.log(this.startArr.join(','));
                    console.log(this.endArr.join(','));
                    console.log(this.dateInfo);
                }).catch(err => {
                    loading.close();
                    console.log(err);
                });
                https.fetchPost('/filmDiscountActivity/getActivityById', params).then(data => {
                        loading.close();
                        console.log(data);
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            if(JSON.parse(Decrypt(data.data.data)).discountActivity.filmCode&&JSON.parse(Decrypt(data.data.data)).discountActivity.filmName){
                                let exFilmCodeList=JSON.parse(Decrypt(data.data.data)).discountActivity.filmCode.split(',');
                                let exFilmNameList=JSON.parse(Decrypt(data.data.data)).discountActivity.filmName.split('|');
                                this.selectedSell=[];
                                for(let x in exFilmNameList){
                                    let json={};
                                    json.filmName=exFilmNameList[x];
                                    json.filmCode=exFilmCodeList[x];
                                    this.selectedSell.push(json)
                                }
                                console.log(this.selectedSell);
                            }
                            let formats = JSON.parse(Decrypt(data.data.data)).formatList;
                            this.formatList = [];
                            for (let i = 0; i < formats.length; i++) {
                                let formatList = {};
                                formatList.formatCode = formats[i].formatCode;
                                formatList.formatName = formats[i].formatName;
                                this.formatList.push(formatList);
                            }
                            this.oName = JSON.parse(Decrypt(data.data.data)).discountActivity.name;
                            this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).discountActivity.cinemaCode;
                            this.getAllScreen(this.oCinemaCode);
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.selectHallType == 0) {
                                this.oSelectHallType = '0';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.selectHallType == 1) {
                                this.oSelectHallType = '1';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.selectHallType == 2) {
                                this.oSelectHallType = '2';
                            }
                            if(JSON.parse(Decrypt(data.data.data)).discountActivity.screenCode){
                                this.oScreenCode = JSON.parse(Decrypt(data.data.data)).discountActivity.screenCode.split(",");
                            }
                        if(JSON.parse(Decrypt(data.data.data)).discountActivity.filmFormatCode){
                            this.oFilmFormatCode = JSON.parse(Decrypt(data.data.data)).discountActivity.filmFormatCode.split(",");
                        }
                           if(JSON.parse(Decrypt(data.data.data)).discountActivity.validWeekDay){
                               this.oCheckedDays = JSON.parse(Decrypt(data.data.data)).discountActivity.validWeekDay.split(",");
                           }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.selectFilmFormatType == 0) {
                                this.oSelectFilmFormatType = '0';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.selectFilmFormatType == 1) {
                                this.oSelectFilmFormatType = '1';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.selectFilmFormatType == 2) {
                                this.oSelectFilmFormatType = '2';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.selectFilmType == 0) {
                                this.oSelectFilmType = '0';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.selectFilmType == 1) {
                                this.oSelectFilmType = '1';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.selectFilmType == 2) {
                                this.oSelectFilmType = '2';
                            }
                            this.oStartDate = JSON.parse(Decrypt(data.data.data)).discountActivity.startDate;
                            this.oEndDate = JSON.parse(Decrypt(data.data.data)).discountActivity.endDate;
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.validPayType == 0) {
                                this.oValidPayType = '0';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.validPayType == 1) {
                                this.oValidPayType = '1';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.validPayType == 2) {
                                this.oValidPayType = '2';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.reduceType == 1) {
                                this.oReduceType = '1';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.reduceType == 2) {
                                this.oReduceType = '2';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.limitSingleUnit == '年') {
                                this.oLimitSingleUnit = '年';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.limitSingleUnit == '月') {
                                this.oLimitSingleUnit = '月';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.limitSingleUnit == '周') {
                                this.oLimitSingleUnit = '周';
                            }
                            if (JSON.parse(Decrypt(data.data.data)).discountActivity.limitSingleUnit == '日') {
                                this.oLimitSingleUnit = '日';
                            }
                            this.oDiscountMoney = JSON.parse(Decrypt(data.data.data)).discountActivity.discountMoney;
                            for (let x in this.options) {
                                if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).discountActivity.status) {
                                    this.oStatus = this.options[x].value;
                                    break;
                                }
                            }
                            for (let x in this.canUse) {
                                if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).discountActivity.isHolidayValid) {
                                    this.oIsHolidayValid = this.canUse[x].value;
                                    break;
                                }
                            }
                            for (let x in this.canUse) {
                                if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).discountActivity.isCouponTogether) {
                                    this.oIsCouponTogether = this.canUse[x].value;
                                    break;
                                }
                            }
                            for (let x in this.canUse) {
                                if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).discountActivity.isLimitTotal) {
                                    this.oIsLimitTotal = this.canUse[x].value;
                                    break;
                                }
                            }
                            for (let x in this.canUse) {
                                if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).discountActivity.isLimitSingle) {
                                    this.oIsLimitSingle = this.canUse[x].value;
                                    break;
                                }
                            }
                            this.oTotalNumber = JSON.parse(Decrypt(data.data.data)).discountActivity.totalNumber;
                            this.oSingleNumber = JSON.parse(Decrypt(data.data.data)).discountActivity.singleNumber;
                            this.oActivityDesc = JSON.parse(Decrypt(data.data.data)).discountActivity.activityDesc;
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
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                if(!this.oName||!this.oStartDate||!this.oEndDate||!this.oActivityDesc){
                    this.message = '必填项不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oDiscountMoney!=0){
                    if(!this.oDiscountMoney){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oSelectHallType==1||this.oSelectHallType==2){
                    if(!this.oScreenCode){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oSelectFilmFormatType==1||this.oSelectFilmFormatType==2){
                    if(!this.oFilmFormatCode){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oSelectFilmType==1||this.oSelectFilmType==2){
                    if(!this.selectedSell){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oIsLimitTotal==1){
                    if(!this.oTotalNumber){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oIsLimitSingle==1){
                    if(!this.oSingleNumber){
                        this.message = '必填项不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                console.log(this.selectedSell);
                let filmCodeList=[];
                for(let x in this.selectedSell){
                    filmCodeList.push(this.selectedSell[x].filmCode)
                }
                var jsonArr = [];
                jsonArr.push({ key: 'name', value: this.oName });
                jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode });
                jsonArr.push({ key: 'selectHallType', value: this.oSelectHallType });
                if(this.oSelectHallType!=0){
                    jsonArr.push({ key: 'screenCode', value: this.oScreenCode.join(',') });
                }
                jsonArr.push({ key: 'selectFilmType', value: this.oSelectFilmType });
                if(this.oSelectFilmType!=0){
                    jsonArr.push({ key: 'filmCode', value: filmCodeList.join(',')});
                }
                jsonArr.push({ key: 'startDate', value: this.oStartDate });
                jsonArr.push({ key: 'endDate', value: this.oEndDate });
                jsonArr.push({ key: 'reduceType', value: this.oReduceType });
                jsonArr.push({ key: 'validPayType', value: this.oValidPayType });
                jsonArr.push({ key: 'discountMoney', value: this.oDiscountMoney });
                jsonArr.push({ key: 'status', value: this.oStatus });
                jsonArr.push({ key: 'isHolidayValid', value: this.oIsHolidayValid});
                jsonArr.push({ key: 'validWeekDay', value: this.oCheckedDays });
                jsonArr.push({ key: 'isCouponTogether', value: this.oIsCouponTogether });
                jsonArr.push({ key: 'activityDesc', value: this.oActivityDesc });
                jsonArr.push({ key: 'startTimeVal', value: this.startArr.join(',')});
                jsonArr.push({ key: 'endTimeVal', value: this.endArr.join(',')});
                jsonArr.push({ key: 'isLimitTotal', value: this.oIsLimitTotal });
                if(this.oIsLimitTotal!=0){
                    jsonArr.push({ key: 'totalNumber', value: this.oTotalNumber });
                }
                if(this.oIsLimitSingle!=0){
                    jsonArr.push({ key: 'singleNumber', value: this.oSingleNumber});
                    jsonArr.push({ key: 'limitSingleUnit', value: this.oLimitSingleUnit });
                }
                jsonArr.push({ key: 'isLimitSingle', value: this.oIsLimitSingle});
                jsonArr.push({ key: 'selectFilmFormatType', value: this.oSelectFilmFormatType});
                if(this.oSelectMovieType!=0){
                    jsonArr.push({ key: 'FilmFormatCode', value: this.oFilmFormatCode});
                }
                jsonArr.push({ key: 'id', value: this.form.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https.fetchPost('/filmDiscountActivity/updateActivityById', params).then(data => {
                        loading.close();
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = false;
                            this.$message.success(`编辑成功`);
                            this.dateInfo=[];
                            this.startArr=[];
                            this.endArr=[];
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
                this.$confirm('此操作将修改状态, 是否继续?', '提示', {
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
                        jsonArr.push({ key: 'id', value: row.id });
                        jsonArr.push({ key: 'status', value: status });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        console.log(jsonArr);
                        let params = ParamsAppend(jsonArr);
                        https.fetchPost('/filmDiscountActivity/updateStatusById', params).then(data => {
                            loading.close();
                            console.log(data);
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
                    }) .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            },
            Search() {
                console.log(this.query.reduceType);
                console.log(this.query.status);
                console.log(this.query.cinemaCode);
                console.log(this.query.name);
                this.query.pageNo = 1;
                this.getMenu();
            },
            SearchFilm() {
                this.query.pageNo = 1;
                this.openNext();
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
                let jsonArr = [];
                jsonArr.push({ key: 'name', value: this.query.name });
                jsonArr.push({ key: 'status', value: this.query.status });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'reduceType', value: this.query.reduceType });
                jsonArr.push({ key: 'cinemaCode', value: this.query.cinemaCode });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                // jsonArr.push({ key: 'filmName', value: name });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                var params = ParamsAppend(jsonArr);
                https.fetchPost('/filmDiscountActivity/page', params).then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(oData.pageResult);
                            this.cinemaInfo = [];
                            for (let i = 0; i < oData.cinemaList.length; i++) {
                                let cinemaList = {};
                                cinemaList.cinemaCode = oData.cinemaList[i].cinemaCode;
                                cinemaList.cinemaName = oData.cinemaList[i].cinemaName;
                                this.cinemaInfo.push(cinemaList);
                            }
                            console.log(this.cinemaInfo)
                            this.oForm.cinemaCode = this.cinemaInfo[0].cinemaCode;
                            this.selectValue = this.cinemaInfo[0].cinemaCode;
                            this.tableData = oData.pageResult.data;
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
            open() {
                //信息提示弹出框
                this.$alert(this.message, '信息提示', {
                    dangerouslyUseHTMLString: true
                });
            },
            selectCinema(val) {
                this.selectedSell=[];
                console.log(val);
                // let selectValue = val.join(',');
                this.selectValue = val;
                this.getAllScreen(val);
            },
            selectScreens(val) {
                // console.log(val)
                this.selectScreenCode = val.join(',');
                // console.log(selectValue);
            },
            selectFormat(val) {
                console.log(val)
                this.selectFormatCode = val.join(',');
                console.log(this.selectFormatCode);
            },
            selectDay(val) {
                // console.log(val)
                this.checkedDays = val.join(',');
            },
            // 获取所选影院影厅
            getAllScreen(value) {
                if (!value) {
                    this.screenInfo = [];
                    return;
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: value });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https.fetchPost('filmCoupon/getScreenInfoByCinemaCode', params).then(data => {
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
            one(a){//获取卖品绑定的value值
                // console.log(a);
                this.oForm.filmCode =a
            },
            sureNext() {
                if(this.sellIndex>=0){
                    // this.selectedSell=[]
                    this.selectedSell.push(this.sellTableData[this.sellIndex]);
                }
                this.drawer = false;
                console.log(this.sellIndex);
                console.log(this.sellTableData);
                console.log(this.selectedSell);
            },
            openNext() {
                //获取商品列表
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let filmName=this.query.filmName;
                    if(!filmName){
                        filmName=''
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"filmName",value:filmName});
                    jsonArr.push({key:"pageNo",value:this.query.pageNo});
                    jsonArr.push({key:"pageSize",value:this.query.pageSize});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('film/filmPage',params).then((data) => {
                        loading.close();
                        console.log(data);
                        if(data.data.code=='success') {
                            this.drawer=true
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
                            this.sellTableData = oData.data;
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
            //新增套餐选择卖品页面
            aCurrentChange(val){//点击选择具体页数
                this.query.pageNo = val;
                this.openNext()
            },
            aPrev(){//分页按钮上一页
                this.query.pageNo--;
                this.openNext()
            },
            aNext(){//分页按钮下一页
                this.query.pageNo++;
                this.openNext()
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

