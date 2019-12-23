<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 卖品活动管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select clearable v-model="query.reduceType" placeholder="优惠方式" class="handle-select mr10">
                    <el-option key="1" label="特惠活动" value="1"></el-option>
                    <el-option key="2" label="满减活动" value="2"></el-option>
                </el-select>
                <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="启用" value="1"></el-option>
                    <el-option key="2" label="未启用" value="0"></el-option>
                </el-select>
                <el-select clearable v-model="query.cinemaCode" placeholder="影院" class="handle-select mr10">
                    <el-option
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="活动名称" class="handle-input mr10"></el-input>
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
                <el-table-column prop="name" label="适用影院" width="200">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <!--<el-table-column prop="name" label="适用商品" width="100">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-tag v-if="scope.row.selectMerchandiseType == 0">全部商品</el-tag>-->
                        <!--<el-tag v-else-if="scope.row.selectMerchandiseType == 1" >{{scope.row.merchandiseName}}</el-tag>-->
                        <!--<el-tag v-else-if="scope.row.selectMerchandiseType == 2" >除{{scope.row.merchandiseName}}外所有商品</el-tag>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="活动名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="活动有效期" width="320">
                    <template slot-scope="scope">{{scope.row.startDate}}至{{scope.row.endDate}}</template>
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
                <el-table-column prop="sort" label="优惠方式" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.reduceType == 1">特惠价格</el-tag>
                        <el-tag v-else-if="scope.row.reduceType == 2" >满减金额</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="金额" width="60">
                    <template slot-scope="scope">{{scope.row.discountMoney}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220" align="center" fixed="right">
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
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible">
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
                <el-form-item :required="true" label="优惠方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.reduceType" @change="clearDiscountMoney()">
                        <el-radio label="1">固定价格（特惠价格）</el-radio>
                        <el-radio label="2">满减（满减金额）</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="固定金额：" :label-width="formLabelWidth" v-if="oForm.reduceType == 1">
                    <el-input placeholder="所选卖品以此价格结算" style="width: 160px" v-model="oForm.discountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="减免金额：" :label-width="formLabelWidth" v-if="oForm.reduceType == 2">
                    满
                    <el-input style="width: 150px" v-model="oForm.achieveMoney" autocomplete="off"></el-input>减
                    <el-input style="width: 150px" v-model="oForm.discountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择商品：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.selectFilmType" @change="clearSelectedSell()">
                        <el-radio label="0">全部商品</el-radio>
                        <el-radio label="1">部分商品</el-radio>
                        <el-radio label="2">排除商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.selectFilmType != 0" label="选择商品" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选商品"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0&&oForm.selectFilmType!=0"
                        :required="true"
                >
                    <div v-for="(item, index) in selectedSell" style="margin-bottom: 5px" :key="index">
                        <el-input
                                style="width: 250px"
                                v-model="item.merchandiseName"
                                autocomplete="off"
                                :value="item.merchandiseCode"
                                :disabled="true"
                                :change="one(item.merchandiseCode)"
                        >
                        </el-input>
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deleteSell(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="活动有效期：" :label-width="formLabelWidth">
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
                <el-form-item :required="true" label="可用支付方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.validPayType">
                        <el-radio label="0">全部可用</el-radio>
                        <el-radio label="1">仅非会员卡支付可用</el-radio>
                        <el-radio label="2">仅会员卡支付可用</el-radio>
                    </el-radio-group>
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
                    <el-checkbox-group :max="6" v-model="oForm.checkedDays" @change="selectDay">
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
                <el-form-item v-if="oForm.reduceType!=2" :required="true" label="是否限制张数：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.oCanNum" placeholder="请选择" @change="clearOnum()">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="活动总张数：" v-if="oForm.oCanNum==1&&(oForm.reduceType!=2)" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.oNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="oForm.reduceType!=2" :required="true" label="是否限制个人张数：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.oneCanNum" placeholder="请选择" @change="clearOneNum()">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="限购时间：" v-if="oForm.oneCanNum==1&&(oForm.reduceType!=2)" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.limitSingleUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="个人总张数：" v-if="oForm.oneCanNum==1&&(oForm.reduceType!=2)" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.oneNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="使用须知：" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="200"
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
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="活动名称：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oName" autocomplete="off"></el-input>
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
                <el-form-item :required="true" label="优惠方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oReduceType" @change="clearDiscountMoney()">
                        <el-radio label="1">固定价格（特惠价格）</el-radio>
                        <el-radio label="2">满减（满减金额）</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="固定金额：" :label-width="formLabelWidth" v-if="oReduceType == 1">
                    <el-input placeholder="所选卖品以此价格结算" style="width: 160px" v-model="oDiscountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="减免金额：" :label-width="formLabelWidth" v-if="oReduceType == 2">
                    满
                    <el-input style="width: 150px" v-model="oAchieveMoney" autocomplete="off"></el-input>减
                    <el-input style="width: 150px" v-model="oDiscountMoney" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择商品：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oSelectMerchandiseType" @change="clearSelectedSell()">
                        <el-radio label="0">全部商品</el-radio>
                        <el-radio label="1">部分商品</el-radio>
                        <el-radio label="2">排除商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oSelectMerchandiseType != 0" label="选择商品" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext1">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选商品"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0&&oSelectMerchandiseType != 0"
                        :required="true"
                >
                    <div v-for="(item, index) in selectedSell" style="margin-bottom: 5px" :key="index">
                        <el-input
                                style="width: 250px"
                                v-model="item.merchandiseName"
                                autocomplete="off"
                                :value="item.merchandiseCode"
                                :disabled="true"
                                :change="one(item.merchandiseCode)"
                        >
                        </el-input>
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deleteSell(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="活动有效期：" :label-width="formLabelWidth">
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
                <el-form-item :required="true" label="可用支付方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oValidPayType">
                        <el-radio label="0">全部可用</el-radio>
                        <el-radio label="1">仅非会员卡支付可用</el-radio>
                        <el-radio label="2">仅会员卡支付可用</el-radio>
                    </el-radio-group>
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
                    <el-checkbox-group :max="6" v-model="oCheckedDays" @change="selectDay">
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
                <el-form-item v-if="oReduceType!=2" :required="true" label="是否限制张数：" :label-width="formLabelWidth">
                    <el-select v-model="oIsLimitTotal" placeholder="请选择" @change="clearOnum()">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="活动总张数：" v-if="oIsLimitTotal==1&&(oReduceType!=2)" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oTotalNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="oReduceType!=2" :required="true" label="是否限制个人张数：" :label-width="formLabelWidth">
                    <el-select v-model="oIsLimitSingle" placeholder="请选择" @change="clearOneNum()">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="限购时间：" v-if="oIsLimitSingle==1&&(oReduceType!=2)" :label-width="formLabelWidth">
                    <el-radio-group v-model="oLimitSingleUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="个人总张数：" v-if="oIsLimitSingle==1&&(oReduceType!=2)" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oSingleNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="使用须知：" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="200"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="oActivityDesc"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                 <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增抽屉弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择卖品" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.merchandiseName" placeholder="卖品名称" class="handle-input mr12"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="SearchSell">搜索</el-button>
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
                                <img style="width:400px" :src="scope.row.merchandisePic"/>
                                <img slot="reference" :src="scope.row.merchandisePic" :alt="scope.row.merchandisePic" style="max-height: 50px;max-width: 130px">
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="卖品名称" width="150">
                        <template slot-scope="scope">{{scope.row.merchandiseName}}</template>
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
                oStartDate:'',
                oLimitSingleUnit:'',
                oEndDate:'',
                oSelectMerchandiseType:'',
                oActivityDesc:'',
                selectedSell:[],
                oCheckedDays:[],
                sellIndex:'',
                sellTableData:[],
                drawer: false,//新增抽屉弹出框
                value1:'',
                oCinemaName: '',
                oScreenName: '',
                oFilmFormatName:'',
                selectFilmFormatType:'',
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
                    pageSize: 15,
                    aPageNo: 1,
                    aPageSize: 15
                },
                restaurants: [],
                merSelect:[],
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
                    code:[],//选择影院
                    filmCode: '',
                    filmName: '',
                    checkedDays: [],
                    exceptWeekDay: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                    startDate: '',
                    endDate: '',
                    validPayType: '0',
                    activityTogether: '0',
                    oCanNum: '0',
                    oneCanNum: '0',
                    limitSingleUnit: '年',
                    achieveMoney: '',
                    discountMoney: '',
                    reduceType: '1',
                    holidayValid: '1',
                    couponDesc: '',
                    id: '',
                    status: '0',
                    oNum: '',
                    oneNum: '',
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
                rowMess:'',
            };
        },
        created() {},
        mounted() {
            this.getMenu();
        },
        methods: {
            clearOneNum(){
                this.oForm.limitSingleUnit='';
                this.oForm.oneNum='';
                this.oLimitSingleUnit='';
                this.oSingleNumber='';
            },
            clearOnum(){
                this.oForm.oNum='';
                this.oTotalNumber='';
            },
            clearSelectedSell(){
                this.selectedSell=[];
            },
            clearDiscountMoney(){
                this.oForm.discountMoney='';
                this.oForm.achieveMoney='';
                this.oDiscountMoney='';
                this.oAchieveMoney='';
            },
            deleteSell(index) {
                this.selectedSell.splice(index, 1);
            },
            getCurrentRow(index){
                this.sellIndex=index
            },
            addTime(){
                // 筛选重复时间段
                if(this.value1){
                    var result = this.dateInfo.some(item => {
                        if (item == this.value1) {
                            return true;
                        }
                    });
                    if (result) {
                        this.message = '不可添加相同时间段，请检查！';
                        this.open();
                        return;
                    }
                    this.dateInfo.push(this.value1);
                    this.startArr.push(this.value1[0])
                    this.endArr.push(this.value1[1])
                }
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
                https.fetchPost('/merchandiseDiscountActivity/addPage', '').then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.selectedSell=[];
                        this.oForm.code = this.cinemaInfo[0].cinemaCode;
                        // let formats = JSON.parse(Decrypt(data.data.data)).formatList;
                        // this.formatList = [];
                        // for (let i = 0; i < formats.length; i++) {
                        //     let formatList = {};
                        //     formatList.formatCode = formats[i].formatCode;
                        //     formatList.formatName = formats[i].formatName;
                        //     this.formatList.push(formatList);
                        // }
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
                for(let x in this.selectedSell){
                    this.merSelect.push(this.selectedSell[x].merchandiseCode)
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                if(!this.oForm.name){
                    this.message = '活动名称不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oForm.code){
                    this.message = '所选影院不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oForm.reduceType){
                    this.message = '优惠方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oForm.reduceType==1){
                    if(this.oForm.discountMoney>=0){
                        if(!this.oForm.discountMoney){
                            this.message = '固定金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if(this.oForm.discountMoney<0){
                        this.message = '固定金额不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if(this.oForm.selectFilmType!=1){
                        this.message = '固定金额只能选择部分商品！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oForm.reduceType==2){
                    if(this.oForm.discountMoney>=0||this.oForm.achieveMoney>=0){
                        if(!this.oForm.discountMoney||!this.oForm.achieveMoney){
                            this.message = '减免金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if(this.oForm.discountMoney<0||this.oForm.achieveMoney<0){
                        this.message = '减免金额不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(!this.oForm.selectFilmType){
                    this.message = '商品类型不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oForm.selectFilmType==1||this.oForm.selectFilmType==2){
                    if(this.selectedSell.length==0){
                        this.message = '所选卖品不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(!this.oForm.startDate||!this.oForm.endDate){
                    this.message = '有效期不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oForm.validPayType){
                    this.message = '可用支付方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oForm.status){
                    this.message = '开启状态不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oForm.holidayValid){
                    this.message = '节假日是否可用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oForm.activityTogether){
                    this.message = '是否和券共用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oForm.reduceType!=2){
                    if(!this.oForm.oCanNum){
                        this.message = '是否限制张数不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }else if(this.oForm.oCanNum==1){
                        if(!this.oForm.oNum){
                            this.message = '活动总张数不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if(this.oForm.oNum<=0){
                            this.message = '活动总张数必须大于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if(!this.oForm.oneCanNum){
                        this.message = '是否限制个人张数不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }else if(this.oForm.oneCanNum==1){
                        if(!this.oForm.limitSingleUnit){
                            this.message = '限购时间不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if(!this.oForm.oneNum){
                            this.message = '个人总张数不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if(this.oForm.oneNum<=0){
                            this.message = '个人总张数必须大于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                }
                if(!this.oForm.couponDesc){
                    this.message = '使用须知不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.code == true) {
                    this.oForm.code = this.cinemaInfo[0].code;
                }
                let filmeCodes = [];
                for (let i = 0; i < this.filmInfo.length; i++) {
                    filmeCodes.push(this.filmInfo[i].filmCode);
                }
                if (this.oForm.reduceType == 1) {
                    this.oForm.achieveMoney = '';
                }
                var jsonArr = [];
                jsonArr.push({ key: 'name', value: this.oForm.name });
                jsonArr.push({ key: 'cinemaCode', value: this.selectValue });
                jsonArr.push({ key: 'selectMerchandiseType', value: this.oForm.selectFilmType });
                if(this.oForm.selectFilmType!=0){
                    jsonArr.push({ key: 'merchandiseCode', value: this.merSelect.join(',') });
                }
                jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
                jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
                jsonArr.push({ key: 'reduceType', value: this.oForm.reduceType });
                if( this.oForm.reduceType==2){
                    jsonArr.push({ key: 'achieveMoney', value: this.oForm.achieveMoney });
                    jsonArr.push({ key: 'isLimitTotal', value: '0' });
                    jsonArr.push({ key: 'isLimitSingle', value: '0' });
                }else{
                    jsonArr.push({ key: 'isLimitTotal', value: this.oForm.oCanNum });
                    jsonArr.push({ key: 'isLimitSingle', value: this.oForm.oneCanNum });
                }
                jsonArr.push({ key: 'validPayType', value: this.oForm.validPayType });
                jsonArr.push({ key: 'discountMoney', value: this.oForm.discountMoney });
                jsonArr.push({ key: 'status', value: this.oForm.status });
                jsonArr.push({ key: 'isHolidayValid', value: this.oForm.holidayValid });
                jsonArr.push({ key: 'validWeekDay', value: this.checkedDays });
                jsonArr.push({ key: 'isCouponTogether', value: this.oForm.activityTogether });
                jsonArr.push({ key: 'activityDesc', value: this.oForm.couponDesc });
                jsonArr.push({ key: 'startTimeVal', value: this.startArr.join(',')});
                jsonArr.push({ key: 'endTimeVal', value: this.endArr.join(',')});
                if(this.oForm.oCanNum!=0){
                    jsonArr.push({ key: 'totalNumber', value: this.oForm.oNum });
                }
                if(this.oForm.oneCanNum!=0){
                    jsonArr.push({ key: 'singleNumber', value: this.oForm.oneNum });
                    jsonArr.push({ key: 'limitSingleUnit', value: this.oForm.limitSingleUnit });
                }
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https.fetchPost('/merchandiseDiscountActivity/addActivity', params).then(data => {//新增
                        loading.close();
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.selectedSell=[];
                            this.merSelect=[];
                            this.oForm.name = '';
                            this.selectValue = [];
                            this.selectScreenCode = '';
                            this.value1 = '';
                            this.oForm.selectFilmType = '0';
                            this.oForm.filmCode = '';
                            this.oForm.startDate = '';
                            this.oForm.endDate = '';
                            this.oForm.validPayType = '0';
                            this.oForm.reduceType = '1';
                            this.oForm.achieveMoney = '';
                            this.oForm.discountMoney = '';
                            this.oForm.holidayValid = '1';
                            this.oForm.checkedDays = [];
                            this.dateInfo=[];
                            this.startArr=[];
                            this.endArr=[];
                            this.oForm.status = '0';
                            this.oForm.activityTogether = '0';
                            this.oForm.sendNumber = '';
                            this.oForm.couponDesc = '';
                            this.oForm.oCanNum = '0';
                            this.oForm.oNum = '';
                            this.oForm.oneCanNum = '0';
                            this.oForm.oneNum = '';
                            this.oForm.formatCode = '';
                            this.oForm.code = '';
                            this.oForm.limitSingleUnit = '年';
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
                    https.fetchPost('/merchandiseDiscountActivity/deleteById', params).then(data => {
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

                }).catch(err => {
                    loading.close();
                    console.log(err);
                });
                https.fetchPost('/merchandiseDiscountActivity/getActivityById', params).then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        this.oName = JSON.parse(Decrypt(data.data.data)).name;
                        this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).cinemaCode;
                        if (JSON.parse(Decrypt(data.data.data)).reduceType == 1) {
                            this.oReduceType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).reduceType == 2) {
                            this.oReduceType = '2';
                        }
                        this.oAchieveMoney = JSON.parse(Decrypt(data.data.data)).achieveMoney;
                        this.oDiscountMoney = JSON.parse(Decrypt(data.data.data)).discountMoney;
                        if (JSON.parse(Decrypt(data.data.data)).selectMerchandiseType == 0) {
                            this.oSelectMerchandiseType = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).selectMerchandiseType == 1) {
                            this.oSelectMerchandiseType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).selectMerchandiseType == 2) {
                            this.oSelectMerchandiseType = '2';
                        }
                        if(JSON.parse(Decrypt(data.data.data)).merchandiseCode&&JSON.parse(Decrypt(data.data.data)).merchandiseName){
                            let exFilmCodeList=JSON.parse(Decrypt(data.data.data)).merchandiseCode.split(',');
                            let exFilmNameList=JSON.parse(Decrypt(data.data.data)).merchandiseName.split('|');
                            this.selectedSell=[];
                            for(let x in exFilmNameList){
                                let json={};
                                json.merchandiseName=exFilmNameList[x];
                                json.merchandiseCode=exFilmCodeList[x];
                                this.selectedSell.push(json)
                            }
                        }
                        this.oStartDate = JSON.parse(Decrypt(data.data.data)).startDate;
                        this.oEndDate = JSON.parse(Decrypt(data.data.data)).endDate;
                        if (JSON.parse(Decrypt(data.data.data)).validPayType == 0) {
                            this.oValidPayType = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).validPayType == 1) {
                            this.oValidPayType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).validPayType == 2) {
                            this.oValidPayType = '2';
                        }
                        for (let x in this.options) {
                            if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).status) {
                                this.oStatus = this.options[x].value;
                                break;
                            }
                        }
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).isHolidayValid) {
                                this.oIsHolidayValid = this.canUse[x].value;
                                break;
                            }
                        }
                        if(JSON.parse(Decrypt(data.data.data)).validWeekDay){
                            this.oCheckedDays = JSON.parse(Decrypt(data.data.data)).validWeekDay.split(",");
                        }
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).isCouponTogether) {
                                this.oIsCouponTogether = this.canUse[x].value;
                                break;
                            }
                        }
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).isLimitTotal) {
                                this.oIsLimitTotal = this.canUse[x].value;
                                break;
                            }
                        }
                        this.oTotalNumber = JSON.parse(Decrypt(data.data.data)).totalNumber;
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).isLimitSingle) {
                                this.oIsLimitSingle = this.canUse[x].value;
                                break;
                            }
                        }
                        if (JSON.parse(Decrypt(data.data.data)).limitSingleUnit == '年') {
                            this.oLimitSingleUnit = '年';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).limitSingleUnit == '月') {
                            this.oLimitSingleUnit = '月';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).limitSingleUnit == '周') {
                            this.oLimitSingleUnit = '周';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).limitSingleUnit == '日') {
                            this.oLimitSingleUnit = '日';
                        }
                        this.oSingleNumber = JSON.parse(Decrypt(data.data.data)).singleNumber
                        this.oActivityDesc = JSON.parse(Decrypt(data.data.data)).activityDesc;
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
                let merchandiseCodeList=[];
                for(let x in this.selectedSell){
                    merchandiseCodeList.push(this.selectedSell[x].merchandiseCode)
                }
                if(!this.oName){
                    this.message = '活动名称不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oCinemaCode){
                    this.message = '所选影院不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oReduceType){
                    this.message = '优惠方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oReduceType==1){
                    if(this.oDiscountMoney>0){
                        if(!this.oDiscountMoney){
                            this.message = '固定金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if(this.oDiscountMoney<0){
                        this.message = '固定金额不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if(this.oSelectMerchandiseType!=1){
                        this.message = '固定金额只能选择部分商品！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(this.oReduceType==2){
                    if(this.oDiscountMoney>=0||this.oAchieveMoney>=0){
                        if((!this.oDiscountMoney&&this.oDiscountMoney!=0)||(!this.oAchieveMoney&&this.oAchieveMoney!=0)){
                            this.message = '减免金额不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if(this.oDiscountMoney<0||this.oAchieveMoney<0){
                        this.message = '减免金额不能小于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(!this.oSelectMerchandiseType){
                    this.message = '商品类型不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oSelectMerchandiseType==1||this.oSelectMerchandiseType==2){
                    if(this.selectedSell.length==0){
                        this.message = '所选卖品不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(!this.oStartDate||!this.oEndDate){
                    this.message = '有效期不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oValidPayType){
                    this.message = '可用支付方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oStatus){
                    this.message = '开启状态不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oIsHolidayValid){
                    this.message = '节假日是否可用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(!this.oIsCouponTogether){
                    this.message = '是否和券共用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if(this.oReduceType!=2){
                    if(!this.oIsLimitTotal){
                        this.message = '是否限制张数不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }else if(this.oIsLimitTotal==1){
                        if(!this.oTotalNumber){
                            this.message = '活动总张数不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if(this.oTotalNumber<=0){
                            this.message = '活动总张数必须大于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if(!this.oIsLimitSingle){
                        this.message = '是否限制个人张数不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }else if(this.oIsLimitSingle==1){
                        if(!this.oLimitSingleUnit){
                            this.message = '限购时间不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if(!this.oSingleNumber){
                            this.message = '个人总张数不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if(this.oSingleNumber<=0){
                            this.message = '个人总张数必须大于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                }
                if(!this.oActivityDesc){
                    this.message = '使用须知不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                var jsonArr = [];
                jsonArr.push({ key: 'name', value: this.oName });
                jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode });
                jsonArr.push({ key: 'selectMerchandiseType', value: this.oSelectMerchandiseType });
                if(this.oSelectFilmType!=0){
                    jsonArr.push({ key: 'merchandiseCode', value: merchandiseCodeList.join(',') });
                }
                jsonArr.push({ key: 'startDate', value: this.oStartDate });
                jsonArr.push({ key: 'endDate', value: this.oEndDate });
                jsonArr.push({ key: 'reduceType', value: this.oReduceType });
                if( this.oReduceType==2){
                    jsonArr.push({ key: 'achieveMoney', value: this.oAchieveMoney });
                    jsonArr.push({ key: 'isLimitTotal', value: '0'});
                    jsonArr.push({ key: 'isLimitSingle', value: '0'});
                }else{
                    jsonArr.push({ key: 'isLimitTotal', value: this.oIsLimitTotal });
                    jsonArr.push({ key: 'isLimitSingle', value: this.oIsLimitSingle });
                }
                jsonArr.push({ key: 'validPayType', value: this.oValidPayType });
                jsonArr.push({ key: 'discountMoney', value: this.oDiscountMoney });
                jsonArr.push({ key: 'status', value: this.oStatus });
                jsonArr.push({ key: 'isHolidayValid', value: this.oIsHolidayValid });
                jsonArr.push({ key: 'validWeekDay', value: this.oCheckedDays });
                jsonArr.push({ key: 'isCouponTogether', value: this.oIsCouponTogether });
                jsonArr.push({ key: 'activityDesc', value: this.oActivityDesc });
                jsonArr.push({ key: 'startTimeVal', value: this.startArr.join(',')});
                jsonArr.push({ key: 'endTimeVal', value: this.endArr.join(',')});

                if(this.oIsLimitTotal!=0){
                    jsonArr.push({ key: 'totalNumber', value: this.oTotalNumber });
                }
                if(this.oIsLimitSingle!=0){
                    jsonArr.push({ key: 'singleNumber', value: this.oSingleNumber });
                    jsonArr.push({ key: 'limitSingleUnit', value: this.oLimitSingleUnit });
                }

                jsonArr.push({ key: 'id', value: this.form.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https.fetchPost('merchandiseDiscountActivity/updateById', params).then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = false;
                        this.$message.success(`编辑成功`);
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
                if(row.status==0){
                    this.rowMess='启用'
                }
                if(row.status==1){
                    this.rowMess='停用'
                }
                this.$confirm('是否确定'+this.rowMess+'此活动?', '提示', {
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
                        let params = ParamsAppend(jsonArr);
                        https.fetchPost('/merchandiseDiscountActivity/updateStatusById', params).then(data => {
                            loading.close();
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
                    })  .catch(() => {
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
            SearchSell() {
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
                var params = ParamsAppend(jsonArr);
                https.fetchPost('/merchandiseDiscountActivity/page', params).then(data => {
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
                // let selectValue = val.join(',');
                this.selectValue = val;
                this.getAllScreen(val);
            },
            selectScreens(val) {
                let selectValue = val.join(',');
                this.selectScreenCode = selectValue;
            },
            selectFormat(val) {
                this.selectFormatCode = val.join(',');
            },
            selectDay(val) {
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
            handleSizeChange(val) {
                this.query.pageSize=val;
                this.getMenu()
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
                this.oForm.filmCode =a
            },
            sureNext() {
                if(this.sellIndex>=0){
                    // console.log('选了数据');
                    if(this.selectedSell.length<=0){
                        // console.log('长度为0');
                        this.selectedSell.push(this.sellTableData[this.sellIndex]);
                    }
                    else if(this.selectedSell.length>0){
                        // console.log('有数据');
                        for(let x in this.selectedSell){
                            if(this.selectedSell[x].merchandiseCode==this.sellTableData[this.sellIndex].merchandiseCode){
                                this.message = '不能添加相同卖品！';
                                this.open();
                                return
                            }
                        }
                        // console.log('判断不重复');
                        this.selectedSell.push(this.sellTableData[this.sellIndex]);
                    }

                }
                this.drawer = false;
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
                    let jsonArr = [];
                    let merchandiseName = this.query.merchandiseName;
                    if(!merchandiseName){
                        merchandiseName=''
                    }
                    jsonArr.push({key:"merchandiseName",value:merchandiseName});
                    jsonArr.push({key:"pageNo",value:this.query.aPageNo});
                    jsonArr.push({key:"pageSize",value:this.query.aPageSize});
                    jsonArr.push({key:"merchandiseStatus",value:1});
                    jsonArr.push({key:"cinemaCode",value:this.oForm.code});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/merchandise/list',params).then((data) => {
                        loading.close();
                        if(data.data.code=='success') {
                            this.drawer=true;
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.sellTableData = oData.data;
                            this.query.aPageSize = oData.pageSize;
                            this.query.aPageNo = oData.pageNo;
                            this.query.aTotalCount = oData.totalCount;
                            this.query.aTotalPage = oData.totalPage
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
            openNext1() {
                //获取商品列表
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let jsonArr = [];
                    let merchandiseName = this.query.merchandiseName;
                    if(!merchandiseName){
                        merchandiseName=''
                    }
                    jsonArr.push({key:"merchandiseName",value:merchandiseName});
                    jsonArr.push({key:"pageNo",value:this.query.aPageNo});
                    jsonArr.push({key:"pageSize",value:this.query.aPageSize});
                    jsonArr.push({key:"merchandiseStatus",value:1});
                    jsonArr.push({key:"cinemaCode",value:this.oCinemaCode});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/merchandise/list',params).then((data) => {
                        loading.close();
                        if(data.data.code=='success') {
                            this.drawer=true;
                            var oData = JSON.parse(Decrypt(data.data.data));
                            this.sellTableData = oData.data;
                            this.query.aPageSize = oData.pageSize;
                            this.query.aPageNo = oData.pageNo;
                            this.query.aTotalCount = oData.totalCount;
                            this.query.aTotalPage = oData.totalPage
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
            aHandleSizeChange(val) {
                this.query.aPageSize=val;
                this.openNext()
            },
            aCurrentChange(val){//点击选择具体页数
                this.query.aPageNo = val;
                this.openNext()
            },
            aPrev(){//分页按钮上一页
                this.query.aPageNo--;
                this.openNext()
            },
            aNext(){//分页按钮下一页
                this.query.aPageNo++;
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
    .mr12 {
        width: 30%;
        margin-right: 10px;
    }
</style>

