<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 权益卡管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    v-model="query.businessCode"
                    placeholder="请选择商家"
                    class="mr10"
                    clearable
                    filterable
                    @change="changeBusiness"
                >
                    <el-option
                        v-for="item in businessInfo"
                        :key="item.businessCode"
                        :label="item.businessName"
                        :value="item.businessCode"
                    ></el-option>
                </el-select>
                <el-select
                    clearable
                    filterable
                    v-model="query.cinemaCode"
                    placeholder="影院"
                    class="handle-select mr10"
                    @change="changeSearchCinema"
                >
                    <el-option
                        v-for="item in cinemaInfo"
                        :key="item.cinemaCode"
                        :label="item.cinemaName"
                        :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.reduceTypeFilm"
                    placeholder="影片优惠方式"
                    class="handle-select mr10"
                >
                    <el-option key="0" label="不参加" value="0"></el-option>
                    <el-option key="1" label="特惠" value="1"></el-option>
                    <el-option key="2" label="满减" value="2"></el-option>
                    <el-option key="3" label="折扣" value="3"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.reduceTypeMerchandise"
                    placeholder="卖品优惠方式"
                    class="handle-select mr10"
                >
                    <el-option key="0" label="不参加" value="0"></el-option>
                    <el-option key="1" label="特惠" value="1"></el-option>
                    <el-option key="2" label="满减" value="2"></el-option>
                    <el-option key="3" label="折扣" value="3"></el-option>
                </el-select>
                <!-- <el-select
                    clearable
                    v-model="query.cardType"
                    placeholder="权益卡类型"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="活动类型" value="1"></el-option>
                    <el-option key="2" label="券包类型" value="2"></el-option>
                </el-select>-->
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="启用" value="1"></el-option>
                    <el-option key="2" label="未启用" value="0"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="权益卡名称" class="handle-input mr10"></el-input>
                <el-button
                    style="margin-top: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="Search"
                >搜索</el-button>
                <!-- <el-button
                        type="primary"
                        @click="addPage"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px"
                >新增权益卡</el-button>-->
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
                <el-table-column prop="name" label="权益卡名称" width="150">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="name" label="适用影院" width="200">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <!-- <el-table-column prop="name" label="权益卡类型" width="110">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cardType == 1">优惠活动</el-tag>
                        <el-tag v-else-if="scope.row.cardType == 2">赠送券包{{scope.row.groupName}}</el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="name" label="影票优惠" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isFilmJoin == 0">不参与</el-tag>
                        <el-tag
                            v-else-if="scope.row.isFilmJoin == 1&&scope.row.reduceTypeFilm==1"
                        >特惠{{scope.row.discountMoneyFilm}}元</el-tag>
                        <el-tag
                            v-else-if="scope.row.isFilmJoin == 1&&scope.row.reduceTypeFilm==2"
                        >立减{{scope.row.discountMoneyFilm}}元</el-tag>
                        <el-tag
                            v-else-if="scope.row.isFilmJoin == 1&&scope.row.reduceTypeFilm==3"
                        >打折{{scope.row.discountMoneyFilm}}%</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="卖品优惠" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isMerchandiseJoin == 0">不参与</el-tag>
                        <el-tag
                            v-else-if="scope.row.isMerchandiseJoin == 1&&scope.row.reduceTypeMerchandise==1"
                        >特惠{{scope.row.discountMoneyMerchandise}}元</el-tag>
                        <el-tag
                            v-else-if="scope.row.isMerchandiseJoin == 1&&scope.row.reduceTypeMerchandise==2"
                        >满{{scope.row.achieveMoneyMerchandise}}元减{{scope.row.discountMoneyMerchandise}}元</el-tag>
                        <el-tag
                            v-else-if="scope.row.isMerchandiseJoin == 1&&scope.row.reduceTypeMerchandise==3"
                        >打折{{scope.row.discountMoneyMerchandise}}%</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="适用影厅" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.selectHallType == 0">全部影厅</el-tag>
                        <el-tag v-else-if="scope.row.selectHallType == 1">{{scope.row.screenName}}</el-tag>
                        <el-tag
                            v-else-if="scope.row.selectHallType == 2"
                        >除{{scope.row.screenName}}外所有影厅</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="适用制式" width="180">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.selectFilmFormatType == 0">全部制式</el-tag>
                        <el-tag
                            v-else-if="scope.row.selectFilmFormatType == 1"
                        >{{scope.row.filmFormatName}}</el-tag>
                        <el-tag
                            v-else-if="scope.row.selectFilmFormatType == 2"
                        >除{{scope.row.filmFormatName}}外所有制式</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="有效期" width="70">
                    <template slot-scope="scope">{{scope.row.number}}{{scope.row.unit}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="卡费" width="70">
                    <template slot-scope="scope">{{scope.row.expense}}元</template>
                </el-table-column>
                <el-table-column prop="memo" label="售卖时间" width="320">
                    <template slot-scope="scope">{{scope.row.startDate}}至{{scope.row.endDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <!-- <el-button
                                type="success"
                                v-if="scope.row.status == 0"
                                @click="changeStatus(scope.$index, scope.row)"
                        >启用</el-button>-->
                        <!-- <el-button
                                type="success"
                                v-if="scope.row.status == 1"
                                @click="changeStatus(scope.$index, scope.row)"
                        >停用</el-button>-->
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.$index, scope.row)"
                        >详情</el-button>
                        <!-- <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="delChange(scope.$index, scope.row)"
                        >删除</el-button>-->
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
                <el-form-item :required="true" label="权益卡名称：" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        v-model="oForm.name"
                        maxlength="15"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="权益卡简短描述：" :label-width="formLabelWidth">
                    <el-input
                        style="width: 150px"
                        v-model="oForm.simpleDesc"
                        maxlength="16"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择影院：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.cinemaCode" @change="selectCinema">
                        <el-radio
                            v-for="item in cinemaInfo"
                            :label="item.cinemaCode"
                            :key="item.cinemaCode"
                            :value="item.cinemaName"
                        >{{item.cinemaName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="权益类型：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.cardType">
                        <el-radio label="1">优惠活动</el-radio>
                        <el-radio label="2">赠送券包</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.cardType==1"
                    label="影票是否参与："
                    :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oForm.isFilmJoin">
                        <el-radio label="1">参加</el-radio>
                        <el-radio label="0">不参加</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.isFilmJoin==1&&oForm.cardType==1"
                    label="影票优惠简短描述："
                    :label-width="formLabelWidth"
                >
                    <el-input
                        v-model="oForm.filmSimpleDesc"
                        maxlength="200"
                        show-word-limit
                        type="textarea"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.isFilmJoin==1&&oForm.cardType==1"
                    label="选择影厅："
                    :label-width="formLabelWidth"
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
                        >{{item.screenName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.isFilmJoin==1&&oForm.cardType==1"
                    label="选择制式："
                    :label-width="formLabelWidth"
                >
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
                        >{{item.formatName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.isFilmJoin==1&&oForm.cardType==1"
                    label="选择影片："
                    :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oForm.selectFilmType" @change="clearSelectedSell()">
                        <el-radio label="0">全部影片</el-radio>
                        <el-radio label="1">部分影片</el-radio>
                        <el-radio label="2">排除影片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.isFilmJoin==1&&oForm.selectFilmType!=0&&oForm.cardType==1"
                    label="选择影片"
                    :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                    label="所选影片"
                    :label-width="formLabelWidth"
                    v-if="oForm.isFilmJoin==1&&selectedSell.length>0&&oForm.cardType==1&&oForm.selectFilmType!=0"
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
                <el-form-item
                    :required="true"
                    v-if="oForm.isFilmJoin==1&&oForm.cardType==1"
                    label="影票优惠方式："
                    :label-width="formLabelWidth"
                >
                    <el-radio-group
                        v-model="oForm.reduceTypeFilm"
                        @change="clearDiscountMoneyFilm()"
                    >
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">立减</el-radio>
                        <el-radio label="3">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="固定金额："
                    :label-width="formLabelWidth"
                    v-if="oForm.reduceTypeFilm == 1&&oForm.cardType==1&&oForm.isFilmJoin==1"
                >
                    <el-input
                        style="width: 150px"
                        v-model="oForm.discountMoneyFilm"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="立减金额："
                    :label-width="formLabelWidth"
                    v-if="oForm.reduceTypeFilm == 2&&oForm.cardType==1&&oForm.isFilmJoin==1"
                >
                    减
                    <el-input
                        style="width: 150px"
                        v-model="oForm.discountMoneyFilm"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="折扣："
                    :label-width="formLabelWidth"
                    v-if="oForm.reduceTypeFilm == 3&&oForm.cardType==1&&oForm.isFilmJoin==1"
                >
                    <el-input
                        style="width: 150px"
                        v-model="oForm.discountMoneyFilm"
                        autocomplete="off"
                    ></el-input>%
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.isFilmJoin==1&&oForm.cardType==1"
                    label="是否限制每部影片购买数量："
                    :label-width="formLabelWidth"
                >
                    <el-select v-model="oForm.isLimitEachFilm" placeholder="请选择">
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="每部影片限购数量："
                    v-if="oForm.isLimitEachFilm==1&&oForm.cardType==1&&oForm.isFilmJoin==1"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        style="width: 150px"
                        v-model="oForm.eachFilmNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.isFilmJoin==1&&oForm.cardType==1"
                    label="是否限量："
                    :label-width="formLabelWidth"
                >
                    <el-select v-model="oForm.isLimitFilm" placeholder="请选择">
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="限购时间："
                    v-if="oForm.isLimitFilm==1&&oForm.cardType==1&&oForm.isFilmJoin==1"
                    :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oForm.limitFilmUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="限购张数："
                    v-if="oForm.isLimitFilm==1&&oForm.cardType==1&&oForm.isFilmJoin==1"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 150px" v-model="oForm.numberFilm" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.cardType==1"
                    label="卖品是否参与："
                    :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oForm.isMerchandiseJoin">
                        <el-radio label="1">参加</el-radio>
                        <el-radio label="0">不参加</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1"
                    label="卖品优惠简短描述："
                    :label-width="formLabelWidth"
                >
                    <el-input
                        v-model="oForm.merchandiseSimpleDesc"
                        maxlength="200"
                        show-word-limit
                        type="textarea"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1"
                    label="卖品优惠方式："
                    :label-width="formLabelWidth"
                >
                    <el-radio-group
                        v-model="oForm.reduceTypeMerchandise"
                        @change="clearDiscountMoneyMerchandise()"
                    >
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">满减</el-radio>
                        <el-radio label="3">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="固定金额："
                    :label-width="formLabelWidth"
                    v-if="oForm.reduceTypeMerchandise == 1&&oForm.cardType==1&&oForm.isMerchandiseJoin==1"
                >
                    <el-input
                        style="width: 150px"
                        v-model="oForm.discountMoneyMerchandise"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="立减金额："
                    :label-width="formLabelWidth"
                    v-if="oForm.reduceTypeMerchandise == 2&&oForm.cardType==1&&oForm.isMerchandiseJoin==1"
                >
                    满
                    <el-input
                        style="width: 150px"
                        v-model="oForm.achieveMoneyMerchandise"
                        autocomplete="off"
                    ></el-input>减
                    <el-input
                        style="width: 150px"
                        v-model="oForm.discountMoneyMerchandise"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="折扣："
                    :label-width="formLabelWidth"
                    v-if="oForm.reduceTypeMerchandise == 3&&oForm.cardType==1&&oForm.isMerchandiseJoin==1"
                >
                    <el-input
                        style="width: 150px"
                        v-model="oForm.discountMoneyMerchandise"
                        autocomplete="off"
                    ></el-input>%
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1"
                    label="选择商品："
                    :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oForm.selectMerchandiseType">
                        <el-radio label="0">全部商品</el-radio>
                        <el-radio label="1">部分商品</el-radio>
                        <el-radio label="2">排除商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.selectMerchandiseType!=0&&oForm.isMerchandiseJoin==1&&oForm.cardType==1"
                    label="选择商品"
                    :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="selectSell">点击选择</el-button>
                </el-form-item>
                <el-form-item
                    label="所选商品"
                    :label-width="formLabelWidth"
                    v-if="oSelectedSell.length>0&&oForm.cardType==1&&oForm.selectMerchandiseType!=0&&oForm.isMerchandiseJoin==1"
                    :required="true"
                >
                    <div
                        v-for="(item, index) in oSelectedSell"
                        style="margin-bottom: 5px"
                        :key="index"
                    >
                        <el-input
                            style="width: 250px"
                            v-model="item.merchandiseName"
                            autocomplete="off"
                            :value="item.merchandiseCode"
                            :disabled="true"
                            :change="oOne(item.merchandiseCode)"
                        ></el-input>
                        <span style="color:red;cursor: pointer;" @click="oDeleteSell(index)">删除</span>
                    </div>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1&&(oForm.reduceTypeMerchandise!=2)"
                    label="是否限量："
                    :label-width="formLabelWidth"
                >
                    <el-select v-model="oForm.isLimitMerchandise" placeholder="请选择">
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="限购时间："
                    v-if="oForm.isLimitMerchandise==1&&oForm.cardType==1&&oForm.isMerchandiseJoin==1&&(oForm.reduceTypeMerchandise!=2)"
                    :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oForm.limitMerchandiseUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="限购次数："
                    v-if="oForm.isLimitMerchandise==1&&oForm.cardType==1&&oForm.isMerchandiseJoin==1&&(oForm.reduceTypeMerchandise!=2)"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        style="width: 150px"
                        v-model="oForm.numberMerchandise"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.cardType==2"
                    label="券包简短描述："
                    :label-width="formLabelWidth"
                >
                    <el-input
                        style="width: 150px"
                        v-model="oForm.couponSimpleDesc"
                        maxlength="200"
                        show-word-limit
                        type="textarea"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    v-if="oForm.cardType==2"
                    label="设置券包："
                    :label-width="formLabelWidth"
                    :required="true"
                >
                    <el-button type="primary" @click="changeCoupon">选择券包</el-button>
                </el-form-item>
                <el-form-item
                    v-if="couponId&&oForm.cardType==2"
                    label="所选券包："
                    :label-width="formLabelWidth"
                    :required="true"
                >
                    <el-input style="width: 150px" v-model="groupName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                        v-if="groupName"
                        style="color:red;cursor: pointer;"
                        @click="deletCoupon"
                    >删除</span>
                </el-form-item>
                <el-form-item :required="true" label="有效期单位：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.unit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="季">季</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="有效期数量：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="支付类型："
                    :label-width="formLabelWidth"
                    v-if="oForm.cardType==1"
                >
                    <el-radio-group v-model="oForm.validPayType">
                        <el-radio label="0">全部</el-radio>
                        <el-radio label="1">仅非会员卡支付</el-radio>
                        <el-radio label="2">仅会员卡支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="节假日是否可用："
                    :label-width="formLabelWidth"
                    v-if="oForm.cardType==1"
                >
                    <el-select v-model="oForm.isHolidayValid" placeholder="请选择">
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="影票可用时间段："
                    :label-width="formLabelWidth"
                    v-if="oForm.cardType==1"
                >
                    <el-time-picker
                        is-range
                        type="date"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        v-model="value1"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围"
                    ></el-time-picker>
                    <span style="cursor: pointer;color: blue" @click="addTime">添加</span>
                </el-form-item>
                <el-form-item
                    label="所选时间段："
                    :label-width="formLabelWidth"
                    v-if="dateInfo.length>0&&oForm.cardType==1"
                >
                    <div v-for="(item, index) in dateInfo" :key="index">
                        {{item}}
                        <span
                            style="color:red;cursor: pointer;"
                            @click="deletTime(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item
                    label="星期几不可用："
                    :label-width="formLabelWidth"
                    v-if="oForm.cardType==1"
                >
                    <el-checkbox-group :max="6" v-model="oForm.validWeekDay" @change="selectDay">
                        <el-checkbox
                            v-for="(day, index) in oForm.exceptWeekDay"
                            :label="index+1"
                            :key="day"
                        >{{day}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="是否和券共用"
                    :label-width="formLabelWidth"
                    v-if="oForm.cardType==1"
                >
                    <el-select v-model="oForm.isCouponTogether" placeholder="请选择">
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="卡费：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.expense" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="售卖时间：" :label-width="formLabelWidth">
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
                <el-form-item :required="true" label="售卖状态：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="是否限制每人购买次数：" :label-width="formLabelWidth">
                    <el-select
                        v-model="oForm.isLimitBuy"
                        placeholder="请选择"
                        @change="clearLimitBuyNumber()"
                    >
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="限制购买次数："
                    v-if="oForm.isLimitBuy==1"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        style="width: 150px"
                        v-model="oForm.limitBuyNumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="是否推荐：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.isRecommend" placeholder="请选择">
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="使用说明：" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        maxlength="200"
                        show-word-limit
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="oForm.benefitDesc"
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
                <el-form-item :required="true" label="权益卡名称" :label-width="formLabelWidth">
                    <el-input
                        placeholder="最多输入15个汉字"
                        style="width: 250px"
                        v-model="oName"
                        maxlength="15"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="权益卡描述" :label-width="formLabelWidth">
                    <el-input
                        placeholder="最多输入16个汉字"
                        style="width: 250px"
                        v-model="oSimpleDesc"
                        maxlength="16"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="所选影院" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        v-model="oCinemaName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <!-- <el-form-item :required="true" label="选择影院" :label-width="formLabelWidth">
                    <el-radio-group v-model="oCinemaCode" @change="selectCinema">
                        <el-radio
                            v-for="item in cinemaInfo"
                            :label="item.cinemaCode"
                            :key="item.cinemaCode"
                            :value="item.cinemaName"
                        >{{item.cinemaName}}</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <!--<el-form-item :required="true" label="权益类型" :label-width="formLabelWidth">-->
                <!--<el-radio-group v-model="oCardType" @change="clearCardType()">-->
                <!--<el-radio label="1">优惠活动</el-radio>-->
                <!--<el-radio label="2">赠送券包</el-radio>-->
                <!--</el-radio-group>-->
                <!--</el-form-item>-->
                <el-form-item :required="true" label="影票是否参与" :label-width="formLabelWidth">
                    <el-radio-group v-model="oIsFilmJoin" @change="clearFilmJoin()">
                        <el-radio label="1">参加</el-radio>
                        <el-radio label="0">不参加</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsFilmJoin==1"
                    label="选择影厅"
                    :label-width="formLabelWidth"
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
                        >{{item.screenName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsFilmJoin==1"
                    label="选择制式"
                    :label-width="formLabelWidth"
                >
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
                        >{{item.formatName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsFilmJoin==1"
                    label="选择影片"
                    :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oSelectFilmType" @change="clearSelectedSell()">
                        <el-radio label="0">全部影片</el-radio>
                        <el-radio label="1">部分影片</el-radio>
                        <el-radio label="2">排除影片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item
                    :required="true"
                    v-if="oIsFilmJoin==1&&oSelectFilmType!=0"
                    label="选择影片"
                    :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item> -->
                <el-form-item
                    label="所选影片"
                    :label-width="formLabelWidth"
                    v-if="oIsFilmJoin==1&&selectedSell.length>0&&oSelectFilmType!=0"
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
                        <!-- <span style="color:red;cursor: pointer;" @click="deleteSell(index)">删除</span> -->
                    </div>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsFilmJoin==1"
                    label="影票优惠方式"
                    :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oReduceTypeFilm" @change="clearDiscountMoneyFilm()">
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">立减</el-radio>
                        <el-radio label="3">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="固定金额"
                    :label-width="formLabelWidth"
                    v-if="oReduceTypeFilm == 1&&oIsFilmJoin==1"
                >
                    <el-input
                        placeholder="符合条件的影票按固定金额*张数"
                        style="width: 250px"
                        v-model="oDiscountMoneyFilm"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="立减金额"
                    :label-width="formLabelWidth"
                    v-if="oReduceTypeFilm == 2&&oIsFilmJoin==1"
                >
                    减
                    <el-input
                        placeholder="(每张票价-立减金额)*张数"
                        style="width: 250px"
                        v-model="oDiscountMoneyFilm"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="折扣"
                    :label-width="formLabelWidth"
                    v-if="oReduceTypeFilm == 3&&oIsFilmJoin==1"
                >
                    <el-input
                        placeholder="影票订单总价进行打折"
                        style="width: 250px"
                        v-model="oDiscountMoneyFilm"
                        autocomplete="off"
                    ></el-input>%
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsFilmJoin==1"
                    label="是否限制每部影片购买数量"
                    :label-width="formLabelWidth"
                >
                    <el-select
                        v-model="oIsLimitEachFilm"
                        placeholder="请选择"
                        @change="clearIsLimitEachFilm()"
                    >
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="每部影片限购数量"
                    v-if="oIsLimitEachFilm==1&&oIsFilmJoin==1"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 150px" v-model="oEachFilmNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsFilmJoin==1"
                    label="是否限量"
                    :label-width="formLabelWidth"
                >
                    <el-select
                        v-model="oIsLimitFilm"
                        placeholder="请选择"
                        @change="clearIsLimitFilm()"
                    >
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="限购时间单位"
                    v-if="oIsLimitFilm==1&&oIsFilmJoin==1"
                    :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oLimitFilmUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="单位内限购张数"
                    v-if="oIsLimitFilm==1&&oIsFilmJoin==1"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 150px" v-model="oNumberFilm" autocomplete="off"></el-input>
                    <div>限购时间单位为'日'，单位内限购张数输入'2'，即每日限制使用该权益卡购买2张影票</div>
                </el-form-item>
                <el-form-item label="影票可用时间段" :label-width="formLabelWidth" v-if="oIsFilmJoin==1">
                    <el-time-picker
                        is-range
                        type="date"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        v-model="value1"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围"
                    ></el-time-picker>
                    <!-- <span style="cursor: pointer;color: blue" @click="addTime">添加</span> -->
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsFilmJoin==1"
                    label="影票权益说明"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        style="width: 300px"
                        :rows="5"
                        placeholder="如：适用的影厅，制式，影片以及优惠的方式，限制数量和可用时间段等说明。方便用户了解使用规则。"
                        v-model="oFilmSimpleDesc"
                        maxlength="200"
                        show-word-limit
                        type="textarea"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="所选时间段"
                    :label-width="formLabelWidth"
                    v-if="dateInfo.length>0&&oIsFilmJoin==1"
                >
                    <div v-for="(item, index) in dateInfo" :key="index">
                        {{item}}
                        <!-- <span
                            style="color:red;cursor: pointer;"
                            @click="deletTime(index)"
                        >删除</span> -->
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="卖品是否参与" :label-width="formLabelWidth">
                    <el-radio-group v-model="oIsMerchandiseJoin" @change="clearMerchandiseJoin()">
                        <el-radio label="1">参加</el-radio>
                        <el-radio label="0">不参加</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsMerchandiseJoin==1"
                    label="优惠方式"
                    :label-width="formLabelWidth"
                >
                    <el-radio-group
                        v-model="oReduceTypeMerchandise"
                        @change="clearDiscountMoneyMerchandise()"
                    >
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">满减</el-radio>
                        <el-radio label="3">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="固定金额"
                    :label-width="formLabelWidth"
                    v-if="oIsMerchandiseJoin==1&&oReduceTypeMerchandise == 1"
                >
                    <el-input
                        placeholder="卖品按固定金额*数量"
                        style="width: 250px"
                        v-model="oDiscountMoneyMerchandise"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="满减金额"
                    :label-width="formLabelWidth"
                    v-if="oIsMerchandiseJoin==1&&oReduceTypeMerchandise == 2"
                >
                    满
                    <el-input
                        placeholder="订单总额满多少减多少"
                        style="width: 250px"
                        v-model="oAchieveMoneyMerchandise"
                        autocomplete="off"
                    ></el-input>减
                    <el-input
                        style="width: 150px"
                        v-model="oDiscountMoneyMerchandise"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="折扣"
                    :label-width="formLabelWidth"
                    v-if="oIsMerchandiseJoin==1&&oReduceTypeMerchandise == 3"
                >
                    <el-input
                        placeholder="卖品订单总价打折"
                        style="width: 250px"
                        v-model="oDiscountMoneyMerchandise"
                        autocomplete="off"
                    ></el-input>%
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsMerchandiseJoin==1"
                    label="选择商品"
                    :label-width="formLabelWidth"
                >
                    <el-radio-group
                        v-model="oSelectMerchandiseType"
                        @change="clearMerchandiseType()"
                    >
                        <el-radio label="0">全部商品</el-radio>
                        <el-radio label="1">部分商品</el-radio>
                        <el-radio label="2">排除商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item
                    :required="true"
                    v-if="oSelectMerchandiseType!=0&&oIsMerchandiseJoin==1"
                    label="选择商品"
                    :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="selectSell">点击选择</el-button>
                </el-form-item> -->
                <el-form-item
                    label="所选商品"
                    :label-width="formLabelWidth"
                    v-if="oSelectedSell.length>0&&oSelectMerchandiseType!=0&&oIsMerchandiseJoin==1"
                    :required="true"
                >
                    <div
                        v-for="(item, index) in oSelectedSell"
                        style="margin-bottom: 5px"
                        :key="index"
                    >
                        <el-input
                            style="width: 250px"
                            v-model="item.merchandiseName"
                            autocomplete="off"
                            :value="item.merchandiseCode"
                            :disabled="true"
                            :change="oOne(item.merchandiseCode)"
                        ></el-input>
                        <!-- <span style="color:red;cursor: pointer;" @click="oDeleteSell(index)">删除</span> -->
                    </div>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsMerchandiseJoin==1&&(oReduceTypeMerchandise!=2)"
                    label="是否限量"
                    :label-width="formLabelWidth"
                >
                    <el-select
                        v-model="oIsLimitMerchandise"
                        placeholder="请选择"
                        @change="clearIsLimitMerchandise()"
                    >
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="限购时间单位"
                    v-if="oIsLimitMerchandise==1&&oIsMerchandiseJoin==1&&(oReduceTypeMerchandise!=2)"
                    :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oLimitMerchandiseUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="限购次数"
                    v-if="oIsLimitMerchandise==1&&oIsMerchandiseJoin==1&&(oReduceTypeMerchandise!=2)"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 150px" v-model="oNumberMerchandise" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsMerchandiseJoin==1"
                    label="卖品权益说明"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        style="width: 300px"
                        :rows="5"
                        placeholder="如：适用的卖品以及优惠的方式，限制数量和可用时间段等说明。方便用户了解使用规则。"
                        v-model="oMerchandiseSimpleDesc"
                        maxlength="200"
                        show-word-limit
                        type="textarea"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="是否赠送券包" :label-width="formLabelWidth">
                    <el-radio-group v-model="oIsGroupJoin" @change="clearFilmJoin()">
                        <el-radio label="1">参加</el-radio>
                        <el-radio label="0">不参加</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="设置券包"
                    v-if="oIsGroupJoin==1"
                    :label-width="formLabelWidth"
                    :required="true"
                >
                    <!-- <el-button type="primary" @click="changeCoupon">选择券包</el-button> -->
                </el-form-item>
                <el-form-item
                    v-if="couponId&&oIsGroupJoin==1"
                    label="所选券包"
                    :label-width="formLabelWidth"
                    :required="true"
                >
                    <el-input style="width: 150px" v-model="groupName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <!-- <span
                        v-if="groupName"
                        style="color:red;cursor: pointer;"
                        @click="deletCoupon"
                    >删除</span> -->
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsGroupJoin==1"
                    label="券包过期方式"
                    :label-width="formLabelWidth"
                >
                    <el-select
                        v-model="oGroupDateType"
                        placeholder="请选择"
                        @change="clearGroupDateType()"
                    >
                        <el-option key="0" label="固定时间段" value="0"></el-option>
                        <el-option key="1" label="固定天数" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsGroupJoin==1&&oGroupDateType==0"
                    label="固定时间段"
                    :label-width="formLabelWidth"
                >
                    <el-date-picker
                        v-model="oGroupStartDate"
                        type="datetime"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>至
                    <el-date-picker
                        v-model="oGroupEndDate"
                        type="datetime"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsGroupJoin==1&&oGroupDateType==1"
                    label="券包有效期单位"
                    :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oGroupUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="季">季</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oIsGroupJoin==1&&oGroupDateType==1"
                    label="券包有效期数量"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 150px" v-model="oGroupNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="oIsGroupJoin==1"
                    :required="true"
                    label="券包权益说明"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        :rows="6"
                        placeholder="如：券包的内容及有效期等说明"
                        style="width: 300px"
                        v-model="oCouponSimpleDesc"
                        maxlength="200"
                        show-word-limit
                        type="textarea"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="有效期单位" :label-width="formLabelWidth">
                    <el-radio-group v-model="oUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="季">季</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="有效期数量" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="可用支付方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oValidPayType">
                        <el-radio label="0">全部可用</el-radio>
                        <el-radio label="1">仅非会员卡支付可用</el-radio>
                        <el-radio label="2">仅会员卡支付可用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="节假日可用" :label-width="formLabelWidth">
                    <el-select v-model="oIsHolidayValid" placeholder="请选择">
                        <el-option
                            v-for="item in canUse1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="星期几不可用" :label-width="formLabelWidth">
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
                <el-form-item :required="true" label="售卖时间" :label-width="formLabelWidth">
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
                <el-form-item :required="true" label="售卖状态" :label-width="formLabelWidth">
                    <el-select v-model="oStatus" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="限制购买次数" :label-width="formLabelWidth">
                    <el-select
                        v-model="oIsLimitBuy"
                        placeholder="请选择"
                        @change="clearLimitBuyNumber()"
                    >
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="限制购买次数"
                    v-if="oIsLimitBuy==1"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 150px" v-model="oLimitBuyNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="是否推荐" :label-width="formLabelWidth">
                    <el-select v-model="oIsRecommend" placeholder="请选择">
                        <el-option
                            v-for="item in canUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="卡费" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oExpense" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="使用说明" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        maxlength="200"
                        show-word-limit
                        placeholder="如：
            1、权益卡的适用门店
            2、权益卡购买后有效期时间
            3、权益卡可享受的优惠描述等等"
                        style="width: 300px"
                        :rows="6"
                        v-model="oBenefitDesc"
                    ></el-input>
                </el-form-item>
            </el-form>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span> -->
        </el-dialog>
        <!--新增影片弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择影片" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.filmName" placeholder="影片名称" class="handle-input mr12"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="openNext">搜索</el-button>
                </div>
                <el-table
                    :data="sellTableData"
                    border
                    class="table"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="50" align="center">
                        <template slot-scope="scope">
                            <el-radio
                                v-model="id"
                                :label="scope.$index"
                                @change.native="getCurrentRow(scope.$index)"
                            >&nbsp;</el-radio>
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
                        layout="total, prev, pager, next"
                        :current-page="query.aPageNo"
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
        <!--新增卖品弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择卖品" :visible.sync="oDrawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.merName" placeholder="卖品名称" class="handle-input mr12"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="selectSell">搜索</el-button>
                </div>
                <el-table
                    :data="oSellTableData"
                    border
                    class="table"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio
                                v-model="id"
                                :label="scope.$index"
                                @change.native="oGetCurrentRow(scope.$index)"
                            >&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="图片">
                        <template slot-scope="scope">
                            <el-popover placement="right" title trigger="hover">
                                <img style="width:400px" :src="scope.row.merchandisePic" />
                                <img
                                    slot="reference"
                                    :src="scope.row.merchandisePic"
                                    :alt="scope.row.merchandisePic"
                                    style="max-height: 50px;max-width: 130px"
                                />
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="卖品名称" width="150">
                        <template slot-scope="scope">{{scope.row.merchandiseName}}</template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.oPageNo"
                        :page-size="query.oPageSize"
                        :total="query.oTotalCount"
                        @current-change="oCurrentChange"
                        @prev-click="oPrev"
                        @next-click="oNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="oDrawer = false">取 消</el-button>
                <el-button type="primary" @click="oSureNext">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 选择券包弹出窗 -->
        <el-dialog :close-on-click-modal="false" title="选择券包" :visible.sync="drawerCoupon">
            <div class="container">
                <div class="handle-box">
                    <el-input
                        v-model="query.groupName"
                        placeholder="券包名称"
                        class="handle-input mr12"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="changeCoupon">搜索</el-button>
                </div>
                <el-table
                    :data="couponList"
                    border
                    class="table"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="couponId" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="券包名称" width="150">
                        <template slot-scope="scope">{{scope.row.groupName}}</template>
                    </el-table-column>
                    <el-table-column label="优惠券详情">
                        <template slot-scope="scope">
                            <span
                                v-for="item in scope.row.couponList"
                                :key="item"
                            >{{item.couponName}}x{{item.number}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.bPageNo"
                        :page-size="query.bPageSize"
                        :total="query.bTotalCount"
                        @current-change="bCurrentChange"
                        @prev-click="bPrev"
                        @next-click="bNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawerCoupon = false">取 消</el-button>
                <el-button type="primary" @click="sureAdd(couponId)">确 定</el-button>
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
            oForm: {
                groupStartDate: '',
                groupEndDate: '',
                groupUnit: '',
                groupNumber: '',
                name: '',
                simpleDesc: '',
                cinemaName: '',
                cinemaCode: [],
                screenName: '',
                screenCode: [],
                filmFormatCode: [],
                isFilmJoin: '0',
                isMerchandiseJoin: '0',
                isGroupJoin: '0',
                cardType: '1', //权益类型
                selectFilmType: '0', //选择影片
                selectMerchandiseType: '0', //选择商品
                selectHallType: '0', //选择影厅
                benefitType: '0', //权益类型
                selectFilmFormatType: '0', //选择制式
                isLimitEachFilm: '0', //是否限制每部影片限购数量
                isLimitBuy: '0', //限制购买次数
                code: [], //选择影院
                filmCode: '',
                filmName: '',
                validWeekDay: [],
                exceptWeekDay: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                startDate: '',
                endDate: '',
                validPayType: '0',
                achieveMoney: '',
                discountMoney: '',
                reduceType: '1',
                reduceTypeFilm: '1',
                isHolidayValid: '1',
                reduceTypeMerchandise: '1',
                isLimitFilm: '0',
                isLimitMerchandise: '0',
                isCouponTogether: '0',
                limitFilmUnit: '年',
                limitMerchandiseUnit: '年',
                unit: '年',
                couponDesc: '',
                id: '',
                status: '0',
                isRecommend: '0',
                limitBuyNumber: '',
                benefitDesc: '',
                expense: '',
                number: '',
                couponSimpleDesc: '',
                numberMerchandise: '',
                discountMoneyMerchandise: '',
                achieveMoneyMerchandise: '',
                merchandiseSimpleDesc: '',
                numberFilm: '',
                eachFilmNumber: '',
                discountMoneyFilm: '',
                filmSimpleDesc: ''
            },
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
            selectedSell: [],
            oSelectedSell: [],
            oCheckedDays: [],
            oScreenCode: [],
            oFilmFormatCode: [],
            sellIndex: '',
            oSimpleDesc: '',
            oSelectMerchandiseType: '',
            oMerchandiseSimpleDesc: '',
            oLimitFilmUnit: '',
            oSelectFilmType: '',
            oFilmSimpleDesc: '',
            oIsRecommend: '',
            oIsGroupJoin: '',
            oCinemaCode: '',
            oBenefitDesc: '',
            oSellIndex: '',
            oDiscountMoneyMerchandise: '',
            oCouponSimpleDesc: '',
            oNumberMerchandise: '',
            oLimitMerchandiseUnit: '',
            oIsLimitMerchandise: '',
            oSelectHallType: '',
            oReduceTypeMerchandise: '',
            oSelectFilmFormatType: '',
            oIsLimitBuy: '',
            oLimitBuyNumber: '',
            sellTableData: [],
            oSellTableData: [],
            drawer: false, //选择影片弹出框
            drawerCoupon: false, //选择优惠券弹出框
            oDrawer: false, //选择商品弹出框
            value1: '',
            oCardType: '',
            oIsLimitEachFilm: '',
            oEachFilmNumber: '',
            oIsFilmJoin: '',
            oCinemaName: '',
            oNumberFilm: '',
            oStartDate: '',
            oScreenName: '',
            oFilmFormatName: '',
            selectFilmFormatType: '',
            selectHallType: '',
            selectFilmType: '',
            oFilmName: '',
            oName: '',
            oCreateDate: '',
            oEndDate: '',
            oValidPayType: '',
            oReduceType: '',
            oDiscountMoney: '',
            oDiscountMoneyFilm: '',
            oMerchandiseName: '',
            oReduceTypeFilm: '',
            oAchieveMoney: '',
            oIsMerchandiseJoin: '',
            oCouponDesc: '',
            oIsHolidayValid: '',
            oValidWeekDay: '',
            oIsLimitFilm: '',
            oIsCouponTogether: '',
            oId: '',
            oExpense: '',
            oIsLimitTotal: '',
            oTotalNumber: '',
            oTotalSurplus: '',
            oIsLimitSingle: '', ////
            oSingleNumber: '',
            selectMerchandiseType: '',
            oNumber: '',
            oAchieveMoneyMerchandise: '',
            oGroupName: '',
            oUnit: '',
            oStatus: '',
            formatList: [], //电影制式列表
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                aPageNo: 1,
                aPageSize: 15,
                oPageNo: 1,
                oPageSize: 15,
                bPageNo: 1,
                bPageSize: 15
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
            canUse1: [{
                    value: '0',
                    label: '不可用'
                },
                    {
                        value: '1',
                        label: '可用'
                    }],
            formLabelWidth: '120px',
            selectValue: {},
            selectScreenCode: {},
            selectFormatCode: {},
            selectFilm: {},
            cinemaInfo: [],
            businessInfo: [],
            screenInfo: [],
            filmInfo: [], //所选影片
            dateInfo: [], //所选时间段
            startArr: [],
            endArr: [],
            value: '',
            canTimeList: [], //可用时间段列表
            couponId: '',
            couponName: '',
            couponList: [],
            groupName: '',
            rowMess: ''
        };
    },
    created() {},
    mounted() {
        this.getAllBusiness();
    },
    methods: {
        clearDiscountMoneyMerchandise() {
            this.oForm.discountMoneyMerchandise = '';
            this.oForm.achieveMoneyMerchandise = '';
            this.oDiscountMoneyMerchandise = '';
            this.oAchieveMoneyMerchandise = '';
        },
        clearDiscountMoneyFilm() {
            this.oForm.discountMoneyFilm = '';
            this.oDiscountMoneyFilm = '';
        },
        clearSelectedSell() {
            this.selectedSell = [];
        },
        clearFilmFormatCode() {
            this.oForm.filmFormatCode = [];
            this.oFilmFormatCode = [];
        },
        clearScreenCode() {
            this.oForm.screenCode = [];
            this.oScreenCode = [];
        },
        clearLimitBuyNumber() {
            this.oForm.limitBuyNumber = '';
            this.oLimitBuyNumber = '';
        },
        sureAdd(id) {
            this.couponId = id;
            for (let i = 0; i < this.couponList.length; i++) {
                if (this.couponList[i].id == this.couponId) {
                    this.groupName = this.couponList[i].groupName;
                }
            }
            this.drawerCoupon = false;
        },
        deletCoupon() {
            this.groupName = '';
            this.couponId = '';
        },
        // 更换券包
        changeCoupon() {
            let groupName = this.query.groupName;
            if (!groupName) {
                groupName = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCodes', value: this.oForm.cinemaCode });
            jsonArr.push({ key: 'groupName', value: groupName });
            jsonArr.push({ key: 'status', value: 1 });
            jsonArr.push({ key: 'pageNo', value: this.query.bPageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.bPageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            console.log(jsonArr);
            https
                .fetchPost('/couponGroup/couponGroupPage', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        console.log(res);
                        if (res.data.length == 0) {
                            this.message = '暂无券包';
                            this.open();
                            return;
                        }
                        this.couponList = res.data;
                        this.query.bPageSize = res.pageSize;
                        this.query.bPageNo = res.pageNo;
                        this.query.bTotalCount = res.totalCount;
                        this.query.bTotalPage = res.totalPage;
                        this.drawerCoupon = true;
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
        deleteSell(index) {
            this.selectedSell.splice(index, 1);
        },
        oDeleteSell(index) {
            this.oSelectedSell.splice(index, 1);
        },
        addTime() {
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
            this.value1 = '';
            console.log(this.dateInfo);
            console.log(this.startArr);
            console.log(this.endArr);
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
            https
                .fetchPost('/benefitCard/addPage', '')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.selectedSell = [];
                        this.oForm.code = this.cinemaInfo[0].cinemaCode;
                        this.getAllScreen(this.oForm.code);
                        let formats = JSON.parse(Decrypt(data.data.data)).formatList;
                        this.formatList = [];
                        for (let i = 0; i < formats.length; i++) {
                            let formatArr = {};
                            formatArr.formatCode = formats[i].formatCode;
                            formatArr.formatName = formats[i].formatName;
                            this.formatList.push(formatArr);
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
        addRole() {
            //新增按钮操作
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if (this.oForm.code == true) {
                this.oForm.code = this.cinemaInfo[0].code;
            }
            let filmeCodes = []; //影片编码
            for (let i = 0; i < this.selectedSell.length; i++) {
                filmeCodes.push(this.selectedSell[i].filmCode);
            }
            this.oForm.filmCode = filmeCodes.join(',');
            let merchandiseCodes = []; //卖品编码
            for (let i = 0; i < this.oSelectedSell.length; i++) {
                merchandiseCodes.push(this.oSelectedSell[i].merchandiseCode);
            }
            this.oForm.merchandiseCode = merchandiseCodes.join(',');
            if (this.oForm.selectFilmType == 0) {
                this.oForm.filmCode = '';
            }
            if (this.oForm.selectHallType == 0) {
                this.selectScreenCode = '';
            }
            if (this.oForm.reduceType == 1) {
                this.oForm.achieveMoney = '';
            }
            //权益卡判断
            if (!this.oForm.name) {
                this.message = '权益卡名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.simpleDesc) {
                this.message = '权益卡简短描述不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.cinemaCode) {
                this.message = '所选影院不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.cardType) {
                this.message = '权益类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            //赠送券包下的判断
            if (this.oForm.cardType == 2) {
                if (!this.oForm.couponSimpleDesc) {
                    this.message = '券包简短描述不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.groupName) {
                    this.message = '所选券包不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            //优惠活动下的判断
            if (this.oForm.cardType == 1) {
                if (!this.oForm.isFilmJoin) {
                    this.message = '影票是否参与不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.isMerchandiseJoin) {
                    this.message = '卖品是否参与不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.isFilmJoin == 0 && this.oForm.isMerchandiseJoin == 0) {
                    this.message = '影票和卖品至少有一个参与，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.validPayType) {
                    this.message = '支付类型不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.isHolidayValid) {
                    this.message = '节假日是否可用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.isCouponTogether) {
                    this.message = '是否和券共用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                //影票参与
                if (this.oForm.isFilmJoin == 1) {
                    if (!this.oForm.filmSimpleDesc) {
                        this.message = '影票优惠简短描述不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (!this.oForm.selectHallType) {
                        this.message = '影厅类型不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oForm.selectHallType != 0) {
                        if (this.oForm.screenCode.length == 0) {
                            this.message = '所选影厅不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (!this.oForm.selectFilmFormatType) {
                        this.message = '制式类型不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oForm.selectFilmFormatType != 0) {
                        if (this.oForm.filmFormatCode.length == 0) {
                            this.message = '所选制式不能为空，请检查！';
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
                    } else if (this.oForm.selectFilmType != 0) {
                        if (this.selectedSell.length == 0) {
                            this.message = '所选影片不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (!this.oForm.reduceTypeFilm) {
                        this.message = '影票优惠方式不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oForm.reduceTypeFilm == 1) {
                        if (this.oForm.discountMoneyFilm >= 0) {
                            if (!this.oForm.discountMoneyFilm) {
                                this.message = '固定金额不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oForm.discountMoneyFilm < 0) {
                            this.message = '固定金额不能小于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                    } else if (this.oForm.reduceTypeFilm == 2) {
                        if (this.oForm.discountMoneyFilm >= 0) {
                            if (!this.oForm.discountMoneyFilm) {
                                this.message = '减免金额不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oForm.discountMoneyFilm < 0) {
                            this.message = '减免金额不能小于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                    } else if (this.oForm.reduceTypeFilm == 3) {
                        if (this.oForm.discountMoneyFilm >= 0) {
                            if (!this.oForm.discountMoneyFilm) {
                                this.message = '折扣不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oForm.discountMoneyFilm <= 0 || this.oForm.discountMoneyFilm >= 100) {
                            this.message = '折扣不能小于等于0或大于等于100！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (!this.oForm.isLimitEachFilm) {
                        this.message = '是否限制每部影片购买数量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oForm.isLimitEachFilm == 1) {
                        if (!this.oForm.eachFilmNumber) {
                            this.message = '是每部影片限购数量不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (this.oForm.eachFilmNumber <= 0) {
                            this.message = '是每部影片限购数量必须大于0，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (!this.oForm.isLimitFilm) {
                        this.message = '是否限量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oForm.isLimitFilm == 1) {
                        if (!this.oForm.limitFilmUnit) {
                            this.message = '限购时间不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (!this.oForm.numberFilm) {
                            this.message = '限购张数不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (this.oForm.numberFilm <= 0) {
                            this.message = '限购张数必须大于0，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                }
                //卖品参与
                if (this.oForm.isMerchandiseJoin == 1) {
                    if (!this.oForm.merchandiseSimpleDesc) {
                        this.message = '卖品优惠简短描述不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (!this.oForm.reduceTypeMerchandise) {
                        this.message = '卖品优惠方式不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oForm.reduceTypeMerchandise == 1) {
                        if (this.oForm.discountMoneyMerchandise >= 0) {
                            if (!this.oForm.discountMoneyMerchandise) {
                                this.message = '固定金额不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oForm.discountMoneyMerchandise < 0) {
                            this.message = '固定金额不能小于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (this.oForm.selectMerchandiseType == 0 || this.oForm.selectMerchandiseType == 2) {
                            this.message = '固定金额只能选择部分商品！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (!this.oForm.isLimitMerchandise) {
                            this.message = '是否限量不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        } else if (this.oForm.isLimitMerchandise == 1) {
                            if (!this.oForm.limitMerchandiseUnit) {
                                this.message = '限购时间不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                            if (!this.oForm.numberMerchandise) {
                                this.message = '限购张数不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                            if (this.oForm.numberMerchandise <= 0) {
                                this.message = '限购张数必须大于0，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                    } else if (this.oForm.reduceTypeMerchandise == 2) {
                        if (this.oForm.discountMoneyMerchandise >= 0 || this.oForm.achieveMoneyMerchandise >= 0) {
                            if (!this.oForm.discountMoneyMerchandise || !this.oForm.achieveMoneyMerchandise) {
                                this.message = '减免金额不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oForm.discountMoneyMerchandise < 0 || this.oForm.achieveMoneyMerchandise < 0) {
                            this.message = '减免金额不能小于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                    } else if (this.oForm.reduceTypeMerchandise == 3) {
                        if (this.oForm.discountMoneyMerchandise >= 0) {
                            if (!this.oForm.discountMoneyMerchandise) {
                                this.message = '折扣不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oForm.discountMoneyMerchandise <= 0 || this.oForm.discountMoneyMerchandise >= 100) {
                            this.message = '折扣不能小于等于0或大于等于100！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (!this.oForm.isLimitMerchandise) {
                            this.message = '是否限量不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        } else if (this.oForm.isLimitMerchandise == 1) {
                            if (!this.oForm.limitMerchandiseUnit) {
                                this.message = '限购时间不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                            if (!this.oForm.numberMerchandise) {
                                this.message = '限购张数不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                            if (this.oForm.numberMerchandise <= 0) {
                                this.message = '限购张数必须大于0，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                    }
                    if (!this.oForm.selectMerchandiseType) {
                        this.message = '卖品类型不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oForm.selectMerchandiseType == 1 || this.oForm.selectMerchandiseType == 2) {
                        if (this.oSelectedSell.length == 0) {
                            this.message = '所选卖品不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                }
            }
            //权益卡下判断
            if (!this.oForm.unit) {
                this.message = '有效期单位不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.number) {
                this.message = '有效期数量不能为空，请检查！';
                this.open();
                loading.close();
                return;
            } else if (this.oForm.number <= 0) {
                this.message = '有效期数量必须大于0，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.expense) {
                this.message = '卡费不能为空，请检查！';
                this.open();
                loading.close();
                return;
            } else if (this.oForm.expense <= 0) {
                this.message = '卡费必须大于0，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.startDate || !this.oForm.endDate) {
                this.message = '售卖时间不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.status) {
                this.message = '售卖状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.isLimitBuy) {
                this.message = '是否限制每人购买次数不能为空，请检查！';
                this.open();
                loading.close();
                return;
            } else if (this.oForm.isLimitBuy == 1) {
                if (!this.oForm.limitBuyNumber) {
                    this.message = '购买次数不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                } else if (this.oForm.limitBuyNumber <= 0) {
                    this.message = '购买次数必须大于0，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oForm.isRecommend) {
                this.message = '是否推荐不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.benefitDesc) {
                this.message = '使用说明不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            var jsonArr = [];
            jsonArr.push({ key: 'name', value: this.oForm.name });
            jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
            jsonArr.push({ key: 'cardType', value: this.oForm.cardType });
            jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
            jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
            jsonArr.push({ key: 'status', value: this.oForm.status });
            jsonArr.push({ key: 'benefitDesc', value: this.oForm.benefitDesc });
            jsonArr.push({ key: 'unit', value: this.oForm.unit });
            jsonArr.push({ key: 'number', value: this.oForm.number });
            jsonArr.push({ key: 'expense', value: this.oForm.expense });
            jsonArr.push({ key: 'simpleDesc', value: this.oForm.simpleDesc });
            jsonArr.push({ key: 'isRecommend', value: this.oForm.isRecommend });
            jsonArr.push({ key: 'isLimitBuy', value: this.oForm.isLimitBuy });
            if (this.oForm.isLimitBuy == 1) {
                jsonArr.push({ key: 'limitBuyNumber', value: this.oForm.limitBuyNumber });
            }
            if (this.oForm.cardType == 1) {
                jsonArr.push({ key: 'isFilmJoin', value: this.oForm.isFilmJoin });
                jsonArr.push({ key: 'startTimeVal', value: this.startArr.join(',') });
                jsonArr.push({ key: 'endTimeVal', value: this.endArr.join(',') });
                jsonArr.push({ key: 'isMerchandiseJoin', value: this.oForm.isMerchandiseJoin });
                jsonArr.push({ key: 'isHolidayValid', value: this.oForm.isHolidayValid });
                jsonArr.push({ key: 'validWeekDay', value: this.oForm.validWeekDay });
                jsonArr.push({ key: 'validPayType', value: this.oForm.validPayType });
                jsonArr.push({ key: 'isCouponTogether', value: this.oForm.isCouponTogether });
                if (this.oForm.isFilmJoin == 1) {
                    jsonArr.push({ key: 'filmSimpleDesc', value: this.oForm.filmSimpleDesc });
                    jsonArr.push({ key: 'reduceTypeFilm', value: this.oForm.reduceTypeFilm });
                    jsonArr.push({ key: 'discountMoneyFilm', value: this.oForm.discountMoneyFilm });
                    jsonArr.push({ key: 'selectHallType', value: this.oForm.selectHallType });
                    jsonArr.push({ key: 'selectFilmFormatType', value: this.oForm.selectFilmFormatType });
                    jsonArr.push({ key: 'selectFilmType', value: this.oForm.selectFilmType });
                    jsonArr.push({ key: 'isLimitFilm', value: this.oForm.isLimitFilm });
                    jsonArr.push({ key: 'isLimitEachFilm', value: this.oForm.isLimitEachFilm });
                    if (this.oForm.isLimitEachFilm != 0) {
                        jsonArr.push({ key: 'eachFilmNumber', value: this.oForm.eachFilmNumber });
                    }
                    if (this.oForm.selectHallType != 0) {
                        jsonArr.push({ key: 'screenCode', value: this.oForm.screenCode });
                    }
                    if (this.oForm.selectFilmFormatType != 0) {
                        jsonArr.push({ key: 'filmFormatCode', value: this.oForm.filmFormatCode });
                    }
                    if (this.oForm.selectFilmType != 0) {
                        jsonArr.push({ key: 'filmCode', value: this.oForm.filmCode });
                    }
                    if (this.oForm.isLimitFilm != 0) {
                        jsonArr.push({ key: 'numberFilm', value: this.oForm.numberFilm });
                        jsonArr.push({ key: 'limitFilmUnit', value: this.oForm.limitFilmUnit });
                    }
                }
                if (this.oForm.isMerchandiseJoin == 1) {
                    jsonArr.push({ key: 'reduceTypeMerchandise', value: this.oForm.reduceTypeMerchandise });
                    jsonArr.push({ key: 'merchandiseSimpleDesc', value: this.oForm.merchandiseSimpleDesc });
                    jsonArr.push({ key: 'discountMoneyMerchandise', value: this.oForm.discountMoneyMerchandise });
                    jsonArr.push({ key: 'selectMerchandiseType', value: this.oForm.selectMerchandiseType });
                    if (this.oForm.selectMerchandiseType != 0) {
                        jsonArr.push({ key: 'merchandiseCode', value: this.oForm.merchandiseCode });
                    }
                    if (this.oForm.reduceTypeMerchandise == 2) {
                        jsonArr.push({ key: 'achieveMoneyMerchandise', value: this.oForm.achieveMoneyMerchandise });
                        jsonArr.push({ key: 'isLimitMerchandise', value: '0' });
                    } else {
                        jsonArr.push({ key: 'isLimitMerchandise', value: this.oForm.isLimitMerchandise });
                    }
                    if (this.oForm.isLimitMerchandise != 0) {
                        jsonArr.push({ key: 'numberMerchandise', value: this.oForm.numberMerchandise });
                        jsonArr.push({ key: 'limitMerchandiseUnit', value: this.oForm.limitMerchandiseUnit });
                    }
                }
            } else if (this.oForm.cardType == 2) {
                jsonArr.push({ key: 'couponGroupId', value: this.couponId });
                jsonArr.push({ key: 'couponSimpleDesc', value: this.oForm.couponSimpleDesc });
            }
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/benefitCard/addBenefit', params)
                    .then(data => {
                        //新增
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.oForm.name = '';
                            this.groupName = '';
                            this.couponId = '';
                            this.oForm.simpleDesc = '';
                            this.oForm.filmSimpleDesc = '';
                            this.oForm.merchandiseSimpleDesc = '';
                            this.oForm.value1 = '';
                            this.oForm.cinemaCode = '';
                            this.oForm.cardType = '1';
                            this.oForm.startDate = '';
                            this.oForm.endDate = '';
                            this.oForm.status = '0';
                            this.oForm.benefitDesc = '';
                            this.oForm.unit = '年';
                            this.oForm.number = '';
                            this.oForm.expense = '';
                            this.oForm.isFilmJoin = '0';
                            this.oForm.isMerchandiseJoin = '0';
                            this.oForm.isHolidayValid = '1';
                            this.oForm.validWeekDay = [];
                            this.oForm.screenCode = [];
                            this.oForm.filmFormatCode = [];
                            this.selectedSell = [];
                            this.oSelectedSell = [];
                            this.dateInfo = [];
                            this.startArr = [];
                            this.endArr = [];
                            this.oForm.validPayType = '0';
                            this.oForm.isCouponTogether = '0';
                            this.oForm.reduceTypeFilm = '1';
                            this.oForm.discountMoneyFilm = '';
                            this.oForm.selectHallType = '0';
                            this.oForm.benefitType = '0';
                            this.oForm.reduceType = '1';
                            this.oForm.selectFilmFormatType = '0';
                            this.oForm.selectFilmType = '0';
                            this.oForm.isLimitEachFilm = '0';
                            this.oForm.isLimitFilm = '0';
                            this.oForm.filmCode = '';
                            this.oForm.numberFilm = '';
                            this.oForm.reduceTypeMerchandise = '1';
                            this.oForm.discountMoneyMerchandise = '';
                            this.oForm.selectMerchandiseType = '0';
                            this.oForm.isRecommend = '0';
                            this.oForm.isLimitMerchandise = '0';
                            this.oForm.isLimitBuy = '0';
                            this.oForm.merchandiseCode = '';
                            this.oForm.limitBuyNumber = '';
                            this.oForm.achieveMoneyMerchandise = '';
                            this.oForm.numberMerchandise = '';
                            this.oForm.limitFilmUnit = '年';
                            this.oForm.limitMerchandiseUnit = '年';
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
                    let jsonArr = [];
                    jsonArr.push({ key: 'id', value: row.id });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/benefitCard/deleteById', params)
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
            https
                .fetchPost('/admin/benefitCard/getTimesById', params)
                .then(data => {
                    //查询可用时间段
                    loading.close();
                    this.dateInfo = [];
                    this.startArr = [];
                    this.endArr = [];
                    for (let x in JSON.parse(Decrypt(data.data.data))) {
                        let jsonarr = [];
                        jsonarr.push(JSON.parse(Decrypt(data.data.data))[x].startTime);
                        jsonarr.push(JSON.parse(Decrypt(data.data.data))[x].endTime);
                        this.dateInfo.push(jsonarr);
                    }
                    for (let x in this.dateInfo) {
                        this.startArr.push(this.dateInfo[x][0]);
                        this.endArr.push(this.dateInfo[x][1]);
                    }
                })
                .catch(err => {
                    loading.close();
                    console.log(err);
                });
            https
                .fetchPost('/admin/benefitCard/getBenefitById', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.getAllCinema();
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        //电影
                        if (
                            JSON.parse(Decrypt(data.data.data)).benefitCard.filmCode &&
                            JSON.parse(Decrypt(data.data.data)).benefitCard.filmName
                        ) {
                            let exFilmCodeList = JSON.parse(Decrypt(data.data.data)).benefitCard.filmCode.split(',');
                            let exFilmNameList = JSON.parse(Decrypt(data.data.data)).benefitCard.filmName.split('|');
                            this.selectedSell = [];
                            for (let x in exFilmNameList) {
                                let json = {};
                                json.filmName = exFilmNameList[x];
                                json.filmCode = exFilmCodeList[x];
                                this.selectedSell.push(json);
                            }
                            console.log(this.selectedSell);
                        }
                        //卖品
                        if (
                            JSON.parse(Decrypt(data.data.data)).benefitCard.merchandiseCode &&
                            JSON.parse(Decrypt(data.data.data)).benefitCard.merchandiseName
                        ) {
                            let exFilmCodeList = JSON.parse(Decrypt(data.data.data)).benefitCard.merchandiseCode.split(',');
                            let exFilmNameList = JSON.parse(Decrypt(data.data.data)).benefitCard.merchandiseName.split('|');
                            this.oSelectedSell = [];
                            for (let x in exFilmNameList) {
                                let json = {};
                                json.merchandiseName = exFilmNameList[x];
                                json.merchandiseCode = exFilmCodeList[x];
                                this.oSelectedSell.push(json);
                            }
                        }
                        let formats = JSON.parse(Decrypt(data.data.data)).formatList;
                        this.formatList = [];
                        for (let i = 0; i < formats.length; i++) {
                            let formatList = {};
                            formatList.formatCode = formats[i].formatCode;
                            formatList.formatName = formats[i].formatName;
                            this.formatList.push(formatList);
                        }
                        this.oName = JSON.parse(Decrypt(data.data.data)).benefitCard.name;
                        this.oSimpleDesc = JSON.parse(Decrypt(data.data.data)).benefitCard.simpleDesc;
                        this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).benefitCard.cinemaCode;
                        this.couponId = JSON.parse(Decrypt(data.data.data)).benefitCard.couponGroupId;
                        this.getAllScreen(this.oCinemaCode);
                        // if (JSON.parse(Decrypt(data.data.data)).benefitCard.cardType == 1) {
                        //     this.oCardType = '1';
                        // }
                        // if (JSON.parse(Decrypt(data.data.data)).benefitCard.cardType == 2) {
                        //     this.oCardType = '2';
                        // }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.isFilmJoin == 0) {
                            this.oIsFilmJoin = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.isFilmJoin == 1) {
                            this.oIsFilmJoin = '1';
                        }
                        this.oFilmSimpleDesc = JSON.parse(Decrypt(data.data.data)).benefitCard.filmSimpleDesc;
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectHallType == 0) {
                            this.oSelectHallType = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectHallType == 1) {
                            this.oSelectHallType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectHallType == 2) {
                            this.oSelectHallType = '2';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.screenCode) {
                            this.oScreenCode = JSON.parse(Decrypt(data.data.data)).benefitCard.screenCode.split(',');
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectFilmFormatType == 0) {
                            this.oSelectFilmFormatType = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectFilmFormatType == 1) {
                            this.oSelectFilmFormatType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectFilmFormatType == 2) {
                            this.oSelectFilmFormatType = '2';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.filmFormatCode) {
                            this.oFilmFormatCode = JSON.parse(Decrypt(data.data.data)).benefitCard.filmFormatCode.split(',');
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectFilmType == 0) {
                            this.oSelectFilmType = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectFilmType == 1) {
                            this.oSelectFilmType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectFilmType == 2) {
                            this.oSelectFilmType = '2';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.reduceTypeFilm == 1) {
                            this.oReduceTypeFilm = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.reduceTypeFilm == 2) {
                            this.oReduceTypeFilm = '2';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.reduceTypeFilm == 3) {
                            this.oReduceTypeFilm = '3';
                        }
                        this.oDiscountMoneyFilm = JSON.parse(Decrypt(data.data.data)).benefitCard.discountMoneyFilm;
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).benefitCard.isLimitFilm) {
                                this.oIsLimitFilm = this.canUse[x].value;
                                break;
                            }
                        }
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).benefitCard.isLimitBuy) {
                                this.oIsLimitBuy = this.canUse[x].value;
                                break;
                            }
                        }
                        this.oLimitBuyNumber = JSON.parse(Decrypt(data.data.data)).benefitCard.limitBuyNumber;
                        this.oEachFilmNumber = JSON.parse(Decrypt(data.data.data)).benefitCard.eachFilmNumber;
                        this.oLimitFilmUnit = JSON.parse(Decrypt(data.data.data)).benefitCard.limitFilmUnit;
                        this.oNumberFilm = JSON.parse(Decrypt(data.data.data)).benefitCard.numberFilm;
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).benefitCard.isLimitEachFilm) {
                                this.oIsLimitEachFilm = this.canUse[x].value;
                                break;
                            }
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.isMerchandiseJoin == 0) {
                            this.oIsMerchandiseJoin = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.isMerchandiseJoin == 1) {
                            this.oIsMerchandiseJoin = '1';
                        }
                        this.oMerchandiseSimpleDesc = JSON.parse(Decrypt(data.data.data)).benefitCard.merchandiseSimpleDesc;
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.reduceTypeMerchandise == 1) {
                            this.oReduceTypeMerchandise = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.reduceTypeMerchandise == 2) {
                            this.oReduceTypeMerchandise = '2';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.reduceTypeMerchandise == 3) {
                            this.oReduceTypeMerchandise = '3';
                        }
                        this.oAchieveMoneyMerchandise = JSON.parse(Decrypt(data.data.data)).benefitCard.achieveMoneyMerchandise;
                        this.oDiscountMoneyMerchandise = JSON.parse(Decrypt(data.data.data)).benefitCard.discountMoneyMerchandise;
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectMerchandiseType == 0) {
                            this.oSelectMerchandiseType = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectMerchandiseType == 1) {
                            this.oSelectMerchandiseType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectMerchandiseType == 2) {
                            this.oSelectMerchandiseType = '2';
                        }
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).benefitCard.isLimitMerchandise) {
                                this.oIsLimitMerchandise = this.canUse[x].value;
                                break;
                            }
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.limitMerchandiseUnit == '年') {
                            this.oLimitMerchandiseUnit = '年';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.limitMerchandiseUnit == '月') {
                            this.oLimitMerchandiseUnit = '月';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.limitMerchandiseUnit == '周') {
                            this.oLimitMerchandiseUnit = '周';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.limitMerchandiseUnit == '日') {
                            this.oLimitMerchandiseUnit = '日';
                        }
                        this.oNumberMerchandise = JSON.parse(Decrypt(data.data.data)).benefitCard.numberMerchandise;
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.isGroupJoin == 0) {
                            this.oIsGroupJoin = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.isGroupJoin == 1) {
                            this.oIsGroupJoin = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.groupDateType == 0) {
                            this.oGroupDateType = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.groupDateType == 1) {
                            this.oGroupDateType = '1';
                        }
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).benefitCard.cinemaName;
                        this.groupNumber = JSON.parse(Decrypt(data.data.data)).benefitCard.groupNumber;
                        this.oGroupStartDate = JSON.parse(Decrypt(data.data.data)).benefitCard.groupStartDate;
                        this.oGroupEndDate = JSON.parse(Decrypt(data.data.data)).benefitCard.groupEndDate;
                        this.oCouponSimpleDesc = JSON.parse(Decrypt(data.data.data)).benefitCard.couponSimpleDesc;
                        this.groupName = JSON.parse(Decrypt(data.data.data)).benefitCard.groupName;
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.groupUnit == '年') {
                            this.oGroupUnit = '年';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.groupUnit == '季') {
                            this.oGroupUnit = '季';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.groupUnit == '月') {
                            this.oGroupUnit = '月';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.groupUnit == '周') {
                            this.oGroupUnit = '周';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.groupUnit == '日') {
                            this.oGroupUnit = '日';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.unit == '年') {
                            this.oUnit = '年';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.unit == '季') {
                            this.oUnit = '季';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.unit == '月') {
                            this.oUnit = '月';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.unit == '周') {
                            this.oUnit = '周';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.unit == '日') {
                            this.oUnit = '日';
                        }
                        this.oNumber = JSON.parse(Decrypt(data.data.data)).benefitCard.number;
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.validPayType == 0) {
                            this.oValidPayType = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.validPayType == 1) {
                            this.oValidPayType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.validPayType == 2) {
                            this.oValidPayType = '2';
                        }
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).benefitCard.isHolidayValid) {
                                this.oIsHolidayValid = this.canUse[x].value;
                                break;
                            }
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.validWeekDay) {
                            this.oCheckedDays = JSON.parse(Decrypt(data.data.data)).benefitCard.validWeekDay.split(',');
                        }
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).benefitCard.isCouponTogether) {
                                this.oIsCouponTogether = this.canUse[x].value;
                                break;
                            }
                        }
                        this.oExpense = JSON.parse(Decrypt(data.data.data)).benefitCard.expense;
                        this.oStartDate = JSON.parse(Decrypt(data.data.data)).benefitCard.startDate;
                        this.oEndDate = JSON.parse(Decrypt(data.data.data)).benefitCard.endDate;
                        for (let x in this.options) {
                            if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).benefitCard.status) {
                                this.oStatus = this.options[x].value;
                                break;
                            }
                        }
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).benefitCard.isRecommend) {
                                this.oIsRecommend = this.canUse[x].value;
                                break;
                            }
                        }
                        this.oBenefitDesc = JSON.parse(Decrypt(data.data.data)).benefitCard.benefitDesc;
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
            let filmCodeList = [];
            for (let x in this.selectedSell) {
                filmCodeList.push(this.selectedSell[x].filmCode);
            }
            let merchandiseCodeList = [];
            for (let x in this.oSelectedSell) {
                merchandiseCodeList.push(this.oSelectedSell[x].merchandiseCode);
            }
            //权益卡判断
            if (!this.oName) {
                this.message = '权益卡名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oSimpleDesc) {
                this.message = '权益卡简短描述不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oCinemaCode) {
                this.message = '所选影院不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oCardType) {
                this.message = '权益类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            //赠送券包下的判断
            if (this.oCardType == 2) {
                if (!this.oCouponSimpleDesc) {
                    this.message = '券包简短描述不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.groupName) {
                    this.message = '所选券包不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            //优惠活动下的判断
            if (this.oCardType == 1) {
                if (!this.oIsFilmJoin) {
                    this.message = '影票是否参与不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oIsMerchandiseJoin) {
                    this.message = '卖品是否参与不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oIsFilmJoin == 0 && this.oIsMerchandiseJoin == 0) {
                    this.message = '影票和卖品至少有一个参与，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oValidPayType) {
                    this.message = '支付类型不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oIsHolidayValid) {
                    this.message = '节假日是否可用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oIsCouponTogether) {
                    this.message = '是否和券共用不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                //影票参与
                if (this.oIsFilmJoin == 1) {
                    if (!this.oFilmSimpleDesc) {
                        this.message = '影票优惠简短描述不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (!this.oSelectHallType) {
                        this.message = '影厅类型不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oSelectHallType != 0) {
                        if (this.oScreenCode.length == 0) {
                            this.message = '所选影厅不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (!this.oSelectFilmFormatType) {
                        this.message = '制式类型不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oSelectFilmFormatType != 0) {
                        if (this.oFilmFormatCode.length == 0) {
                            this.message = '所选制式不能为空，请检查！';
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
                    } else if (this.oSelectFilmType != 0) {
                        if (this.selectedSell.length == 0) {
                            this.message = '所选影片不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (!this.oReduceTypeFilm) {
                        this.message = '影票优惠方式不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oReduceTypeFilm == 1) {
                        if (this.oDiscountMoneyFilm >= 0) {
                            if (!this.oDiscountMoneyFilm) {
                                this.message = '固定金额不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oDiscountMoneyFilm < 0) {
                            this.message = '固定金额不能小于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                    } else if (this.oReduceTypeFilm == 2) {
                        if (this.oDiscountMoneyFilm >= 0) {
                            if (!this.oDiscountMoneyFilm) {
                                this.message = '减免金额不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oDiscountMoneyFilm < 0) {
                            this.message = '减免金额不能小于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                    } else if (this.oReduceTypeFilm == 3) {
                        if (this.oDiscountMoneyFilm >= 0) {
                            if (!this.oDiscountMoneyFilm) {
                                this.message = '折扣不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oDiscountMoneyFilm <= 0 || this.oDiscountMoneyFilm >= 100) {
                            this.message = '折扣不能小于等于0或大于等于100！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (!this.oIsLimitEachFilm) {
                        this.message = '是否限制每部影片购买数量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oIsLimitEachFilm == 1) {
                        if (!this.oEachFilmNumber) {
                            this.message = '是每部影片限购数量不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (this.oEachFilmNumber <= 0) {
                            this.message = '是每部影片限购数量必须大于0，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                    if (!this.oIsLimitFilm) {
                        this.message = '是否限量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oIsLimitFilm == 1) {
                        if (!this.oLimitFilmUnit) {
                            this.message = '限购时间不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (!this.oNumberFilm) {
                            this.message = '限购张数不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (this.oNumberFilm <= 0) {
                            this.message = '限购张数必须大于0，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                }
                //卖品参与
                if (this.oIsMerchandiseJoin == 1) {
                    if (!this.oMerchandiseSimpleDesc) {
                        this.message = '卖品优惠简短描述不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (!this.oReduceTypeMerchandise) {
                        this.message = '卖品优惠方式不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    } else if (this.oReduceTypeMerchandise == 1) {
                        if (this.oDiscountMoneyMerchandise >= 0) {
                            if (!this.oDiscountMoneyMerchandise) {
                                this.message = '固定金额不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oDiscountMoneyMerchandise < 0) {
                            this.message = '固定金额不能小于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (this.oSelectMerchandiseType == 0 || this.oSelectMerchandiseType == 2) {
                            this.message = '固定金额只能选择部分商品！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (!this.oIsLimitMerchandise) {
                            this.message = '是否限量不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        } else if (this.oIsLimitMerchandise == 1) {
                            if (!this.oLimitMerchandiseUnit) {
                                this.message = '限购时间不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                            if (!this.oNumberMerchandise) {
                                this.message = '限购张数不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                            if (this.oNumberMerchandise <= 0) {
                                this.message = '限购张数必须大于0，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                    } else if (this.oReduceTypeMerchandise == 2) {
                        if (this.oDiscountMoneyMerchandise >= 0 || this.oAchieveMoneyMerchandise >= 0) {
                            if (!this.oDiscountMoneyMerchandise || !this.oAchieveMoneyMerchandise) {
                                this.message = '减免金额不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oDiscountMoneyMerchandise < 0 || this.oAchieveMoneyMerchandise < 0) {
                            this.message = '减免金额不能小于0！';
                            this.open();
                            loading.close();
                            return;
                        }
                    } else if (this.oReduceTypeMerchandise == 3) {
                        if (this.oDiscountMoneyMerchandise >= 0) {
                            if (!this.oDiscountMoneyMerchandise) {
                                this.message = '折扣不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                        if (this.oDiscountMoneyMerchandise <= 0 || this.oDiscountMoneyMerchandise >= 100) {
                            this.message = '折扣不能小于等于0或大于等于100！';
                            this.open();
                            loading.close();
                            return;
                        }
                        if (!this.oIsLimitMerchandise) {
                            this.message = '是否限量不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        } else if (this.oIsLimitMerchandise == 1) {
                            if (!this.oLimitMerchandiseUnit) {
                                this.message = '限购时间不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                            if (!this.oNumberMerchandise) {
                                this.message = '限购张数不能为空，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                            if (this.oNumberMerchandise <= 0) {
                                this.message = '限购张数必须大于0，请检查！';
                                this.open();
                                loading.close();
                                return;
                            }
                        }
                    }
                    if (!this.oSelectMerchandiseType) {
                        this.message = '卖品类型不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oSelectMerchandiseType == 1 || this.oSelectMerchandiseType == 2) {
                        if (this.oSelectedSell.length == 0) {
                            this.message = '所选卖品不能为空，请检查！';
                            this.open();
                            loading.close();
                            return;
                        }
                    }
                }
            }
            //权益卡下判断
            if (!this.oUnit) {
                this.message = '有效期单位不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oNumber) {
                this.message = '有效期数量不能为空，请检查！';
                this.open();
                loading.close();
                return;
            } else if (this.oNumber <= 0) {
                this.message = '有效期数量必须大于0，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oExpense) {
                this.message = '卡费不能为空，请检查！';
                this.open();
                loading.close();
                return;
            } else if (this.oExpense <= 0) {
                this.message = '卡费必须大于0，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oStartDate || !this.oEndDate) {
                this.message = '售卖时间不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oStatus) {
                this.message = '售卖状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oIsLimitBuy) {
                this.message = '是否限制每人购买次数不能为空，请检查！';
                this.open();
                loading.close();
                return;
            } else if (this.oIsLimitBuy == 1) {
                if (!this.oLimitBuyNumber) {
                    this.message = '购买次数不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                } else if (this.oLimitBuyNumber <= 0) {
                    this.message = '购买次数必须大于0，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oIsRecommend) {
                this.message = '是否推荐不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oBenefitDesc) {
                this.message = '使用说明不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            var jsonArr = [];
            jsonArr.push({ key: 'name', value: this.oName });
            jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode });
            jsonArr.push({ key: 'cardType', value: this.oCardType });
            jsonArr.push({ key: 'startDate', value: this.oStartDate });
            jsonArr.push({ key: 'endDate', value: this.oEndDate });
            jsonArr.push({ key: 'status', value: this.oStatus });
            jsonArr.push({ key: 'benefitDesc', value: this.oBenefitDesc });
            jsonArr.push({ key: 'unit', value: this.oUnit });
            jsonArr.push({ key: 'number', value: this.oNumber });
            jsonArr.push({ key: 'expense', value: this.oExpense });
            jsonArr.push({ key: 'simpleDesc', value: this.oSimpleDesc });
            jsonArr.push({ key: 'isRecommend', value: this.oIsRecommend });
            jsonArr.push({ key: 'isLimitBuy', value: this.oIsLimitBuy });
            if (this.oIsLimitBuy == 1) {
                jsonArr.push({ key: 'limitBuyNumber', value: this.oLimitBuyNumber });
            }
            if (this.oCardType == 1) {
                jsonArr.push({ key: 'isFilmJoin', value: this.oIsFilmJoin });
                jsonArr.push({ key: 'startTimeVal', value: this.startArr.join(',') });
                jsonArr.push({ key: 'endTimeVal', value: this.endArr.join(',') });
                jsonArr.push({ key: 'isMerchandiseJoin', value: this.oIsMerchandiseJoin });
                jsonArr.push({ key: 'isHolidayValid', value: this.oIsHolidayValid });
                jsonArr.push({ key: 'validWeekDay', value: this.oCheckedDays });
                jsonArr.push({ key: 'validPayType', value: this.oValidPayType });
                jsonArr.push({ key: 'isCouponTogether', value: this.oIsCouponTogether });
                if (this.oIsFilmJoin == 1) {
                    jsonArr.push({ key: 'filmSimpleDesc', value: this.oFilmSimpleDesc });
                    jsonArr.push({ key: 'reduceTypeFilm', value: this.oReduceTypeFilm });
                    jsonArr.push({ key: 'discountMoneyFilm', value: this.oDiscountMoneyFilm });
                    jsonArr.push({ key: 'selectHallType', value: this.oSelectHallType });
                    jsonArr.push({ key: 'selectFilmFormatType', value: this.oSelectFilmFormatType });
                    jsonArr.push({ key: 'selectFilmType', value: this.oSelectFilmType });
                    jsonArr.push({ key: 'isLimitFilm', value: this.oIsLimitFilm });
                    jsonArr.push({ key: 'isLimitEachFilm', value: this.oIsLimitEachFilm });
                    if (this.oIsLimitEachFilm != 0) {
                        jsonArr.push({ key: 'eachFilmNumber', value: this.oEachFilmNumber });
                    }
                    if (this.oSelectHallType != 0) {
                        jsonArr.push({ key: 'screenCode', value: this.oScreenCode });
                    }
                    if (this.oSelectFilmFormatType != 0) {
                        jsonArr.push({ key: 'filmFormatCode', value: this.oFilmFormatCode });
                    }
                    if (this.oSelectFilmType != 0) {
                        jsonArr.push({ key: 'filmCode', value: filmCodeList.join(',') });
                    }
                    if (this.oIsLimitFilm != 0) {
                        jsonArr.push({ key: 'numberFilm', value: this.oNumberFilm });
                        jsonArr.push({ key: 'limitFilmUnit', value: this.oLimitFilmUnit });
                    }
                }
                if (this.oIsMerchandiseJoin == 1) {
                    jsonArr.push({ key: 'reduceTypeMerchandise', value: this.oReduceTypeMerchandise });
                    jsonArr.push({ key: 'merchandiseSimpleDesc', value: this.oMerchandiseSimpleDesc });
                    jsonArr.push({ key: 'discountMoneyMerchandise', value: this.oDiscountMoneyMerchandise });
                    jsonArr.push({ key: 'selectMerchandiseType', value: this.oSelectMerchandiseType });

                    if (this.oSelectMerchandiseType != 0) {
                        jsonArr.push({ key: 'merchandiseCode', value: merchandiseCodeList.join(',') });
                    }
                    if (this.oReduceTypeMerchandise == 2) {
                        jsonArr.push({ key: 'achieveMoneyMerchandise', value: this.oAchieveMoneyMerchandise });
                        jsonArr.push({ key: 'isLimitMerchandise', value: '0' });
                    } else {
                        jsonArr.push({ key: 'isLimitMerchandise', value: this.oIsLimitMerchandise });
                    }
                    if (this.oIsLimitMerchandise != 0) {
                        jsonArr.push({ key: 'numberMerchandise', value: this.oNumberMerchandise });
                        jsonArr.push({ key: 'limitMerchandiseUnit', value: this.oLimitMerchandiseUnit });
                    }
                }
            } else if (this.oCardType == 2) {
                jsonArr.push({ key: 'couponGroupId', value: this.couponId });
                jsonArr.push({ key: 'couponSimpleDesc', value: this.oCouponSimpleDesc });
            }
            jsonArr.push({ key: 'id', value: this.form.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/benefitCard/updateBenefitById', params)
                .then(data => {
                    loading.close();
                    // console.log(JSON.parse(Decrypt(data.data.data)));
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
            if (row.status == 0) {
                this.rowMess = '启用';
            }
            if (row.status == 1) {
                this.rowMess = '停用';
            }
            this.$confirm('是否确定' + this.rowMess + '此权益卡?', '提示', {
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
                    https
                        .fetchPost('/benefitCard/updateStatusById', params)
                        .then(data => {
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
            setTimeout(() => {
                let reduceTypeFilm = this.query.reduceTypeFilm;
                let reduceTypeMerchandise = this.query.reduceTypeMerchandise;
                let cinemaCode = this.query.cinemaCode;
                let status = this.query.status;
                let businessCode = this.query.businessCode;
                let name = this.query.name;
                if (!reduceTypeFilm) {
                    reduceTypeFilm = '';
                }
                if (!reduceTypeMerchandise) {
                    reduceTypeMerchandise = '';
                }
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!status) {
                    status = '';
                }
                if (!name) {
                    name = '';
                }
                if (!businessCode) {
                    businessCode = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'name', value: name });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'reduceTypeFilm', value: reduceTypeFilm });
                jsonArr.push({ key: 'reduceTypeMerchandise', value: reduceTypeMerchandise });
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'businessCode', value: businessCode });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/admin/benefitCard/page', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            if (data.data && data.data.data) {
                                var oData = JSON.parse(Decrypt(data.data.data));
                                console.log(oData)
                                this.tableData = oData.pageResult.data;
                                this.query.pageSize = oData.pageResult.pageSize;
                                this.query.pageNo = oData.pageResult.pageNo;
                                this.query.totalCount = oData.pageResult.totalCount;
                                this.query.totalPage = oData.pageResult.totalPage;
                            } else {
                                this.tableData = [];
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
            }, 1000);
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        selectCinema(val) {
            console.log(val);
            // let selectValue = val.join(',');
            this.selectValue = val;
            this.getAllScreen(val);
        },
        selectScreens(val) {
            console.log(val);
            let selectValue = val.join(',');
            this.selectScreenCode = selectValue;
            console.log(selectValue);
        },
        selectFormat(val) {
            console.log(val);
            this.selectFormatCode = val.join(',');
            console.log(this.selectFormatCode);
        },
        selectDay(val) {
            // console.log(val)
            this.checkedDays = val.join(',');
        },
        getAllBusiness() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            https
                .fetchPost('/businessInfo/getBusinessList')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.businessInfo = res;
                        this.query.businessCode = res[0].businessCode;
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
        handleSizeChange(val) {
            this.query.pageSize = val;
            this.getMenu();
        },
        changeBusiness(val) {
            this.query.cinemaCode = '';
            this.cinemaInfo = [];
            this.query.businessCode = val;
            this.getAllCinema();
            this.$forceUpdate();
        },
        changeSearchCinema(val) {
            this.$forceUpdate();
            this.query.cinemaCode = val;
        },
        getAllCinema() {
            if (!this.query.businessCode) {
                return;
            }
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            jsonArr.push({ key: 'businessCode', value: this.query.businessCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/cinema/getCinemaListByBusinessCode', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.cinemaInfo = res;
                        this.oForm.cinemaCode = this.cinemaInfo[0].cinemaCode;
                        this.selectValue = this.cinemaInfo[0].cinemaCode;
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
        oCurrentChange(val) {
            //点击选择具体页数
            this.query.oPageNo = val;
            this.selectSell();
        },
        oPrev() {
            //分页按钮上一页
            this.query.oPageNo--;
            this.selectSell();
        },
        oNext() {
            //分页按钮下一页
            this.query.oPageNo++;
            this.selectSell();
        },
        bCurrentChange(val) {
            //点击选择具体页数
            this.query.bPageNo = val;
            this.changeCoupon();
        },
        bPrev() {
            //分页按钮上一页
            this.query.bPageNo--;
            this.changeCoupon();
        },
        bNext() {
            //分页按钮下一页
            this.query.bPageNo++;
            this.changeCoupon();
        },
        getCurrentRow(index) {
            //影片弹出框index
            this.sellIndex = index;
        },
        oGetCurrentRow(index) {
            //商品弹出框index
            this.oSellIndex = index;
        },
        one(a) {
            //获取影片绑定的value值
            // console.log(a);
            this.oForm.filmCode = a;
        },
        oOne(a) {
            //获取卖品绑定的value值
            // console.log(a);
            this.oForm.merchandiseCode = a;
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
            console.log(this.selectedSell);
            this.drawer = false;
        },
        oSureNext() {
            if (this.oSellIndex >= 0) {
                // console.log('选了数据');
                if (this.oSelectedSell.length <= 0) {
                    // console.log('长度为0');
                    this.oSelectedSell.push(this.oSellTableData[this.oSellIndex]);
                } else if (this.oSelectedSell.length > 0) {
                    // console.log('有数据');
                    for (let x in this.oSelectedSell) {
                        if (this.oSelectedSell[x].merchandiseCode == this.oSellTableData[this.oSellIndex].merchandiseCode) {
                            this.message = '不能添加相同卖品！';
                            this.open();
                            return;
                        }
                    }
                    // console.log('判断不重复');
                    this.oSelectedSell.push(this.oSellTableData[this.oSellIndex]);
                }
            }
            console.log(this.oSelectedSell);
            this.oDrawer = false;
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
                jsonArr.push({ key: 'filmName', value: filmName });
                jsonArr.push({ key: 'pageNo', value: this.query.aPageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.aPageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
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
                            console.log(this.sellTableData);
                            this.query.aPageSize = oData.pageSize;
                            this.query.aPageNo = oData.pageNo;
                            this.query.aTotalCount = oData.totalCount;
                            this.query.aTotalPage = oData.totalPage;
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
        selectSell() {
            //获取商品列表
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let merchandiseName = this.query.merName;
                let cinemaCode = '';
                if (this.oForm.cinemaCode) {
                    cinemaCode = this.oForm.cinemaCode;
                }
                if (this.oCinemaCode) {
                    cinemaCode = this.oCinemaCode;
                }
                if (!merchandiseName) {
                    merchandiseName = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: cinemaCode });
                jsonArr.push({ key: 'merchandiseName', value: merchandiseName });
                jsonArr.push({ key: 'merchandiseStatus', value: '1' });
                jsonArr.push({ key: 'pageNo', value: this.query.oPageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.oPageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/merchandise/list', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.oDrawer = true;
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
                            this.oSellTableData = oData.data;
                            this.query.oPageSize = oData.pageSize;
                            this.query.oPageNo = oData.pageNo;
                            this.query.oTotalCount = oData.totalCount;
                            this.query.oTotalPage = oData.totalPage;
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
        //新增套餐选择卖品页面
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

