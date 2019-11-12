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
                <el-select clearable v-model="query.reduceType" placeholder="优惠方式" class="handle-select mr10">
                    <el-option key="1" label="特惠活动" value="1"></el-option>
                    <el-option key="2" label="立减活动" value="2"></el-option>
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
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                        type="primary"
                        @click="addPage"
                        icon="el-icon-circle-plus-outline"
                        style="margin-left: 300px"
                >新增权益卡</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    height="500"
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="权益卡名称" width="130">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="name" label="适用影院" width="130">
                <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="权益卡类型" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cardType == 1">优惠活动</el-tag>
                        <el-tag v-else-if="scope.row.cardType == 2" >赠送券包{{scope.row.groupName}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="影票优惠" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isFilmJoin == 0">不参与</el-tag>
                        <el-tag v-else-if="scope.row.isFilmJoin == 1&&scope.row.reduceTypeFilm==1" >特惠{{scope.row.discountMoneyFilm}}元</el-tag>
                        <el-tag v-else-if="scope.row.isFilmJoin == 1&&scope.row.reduceTypeFilm==2" >立减{{scope.row.discountMoneyFilm}}元</el-tag>
                        <el-tag v-else-if="scope.row.isFilmJoin == 1&&scope.row.reduceTypeFilm==3" >打折{{scope.row.discountMoneyFilm}}%</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="适用影厅" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.selectHallType == 0">全部影厅</el-tag>
                        <el-tag v-else-if="scope.row.selectHallType == 1" >{{scope.row.screenName}}</el-tag>
                        <el-tag v-else-if="scope.row.selectHallType == 2" >除{{scope.row.screenName}}外所有影厅</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="适用制式" width="180">
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
                <el-table-column prop="name" label="影票每日限量" width="160">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isLimitFilm == 0">不限量</el-tag>
                        <el-tag v-else-if="scope.row.isLimitFilm == 1" >限量{{scope.row.numberFilm}}张</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="卖品优惠" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isMerchandiseJoin == 0">不参与</el-tag>
                        <el-tag v-else-if="scope.row.isMerchandiseJoin == 1&&scope.row.reduceTypeMerchandise==1" >特惠{{scope.row.discountMoneyMerchandise}}元</el-tag>
                        <el-tag v-else-if="scope.row.isMerchandiseJoin == 1&&scope.row.reduceTypeMerchandise==2" >
                            满{{scope.row.achieveMoneyMerchandise}}元减{{scope.row.discountMoneyMerchandise}}元
                        </el-tag>
                        <el-tag v-else-if="scope.row.isMerchandiseJoin == 1&&scope.row.reduceTypeMerchandise==3" >打折{{scope.row.discountMoneyMerchandise}}%</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="适用卖品">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.selectMerchandiseType == 0">全部商品</el-tag>
                        <el-tag v-else-if="scope.row.selectMerchandiseType == 1" >{{scope.row.merchandiseName}}</el-tag>
                        <el-tag v-else-if="scope.row.selectMerchandiseType == 2" >除{{scope.row.merchandiseName}}外所有商品</el-tag>
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
                        >查看详情</el-button>
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
                <el-form-item label="权益卡名称：" :label-width="formLabelWidth" prop="name">
                    <el-input style="width: 150px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权益卡简短描述：" :label-width="formLabelWidth" prop="name">
                    <el-input style="width: 150px" v-model="oForm.simpleDesc" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择影院：" :label-width="formLabelWidth" prop="cinemaName">
                    <el-radio-group v-model="oForm.cinemaCode" @change="selectCinema">
                        <el-radio
                                v-for="item in cinemaInfo"
                                :label="item.cinemaCode"
                                :key="item.cinemaCode"
                                :value="item.cinemaName"
                        >{{item.cinemaName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="权益类型：" :label-width="formLabelWidth" prop="cinemaName">
                    <el-radio-group v-model="oForm.cardType">
                        <el-radio label="1">优惠活动</el-radio>
                        <el-radio label="2">赠送券包</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item  v-if="oForm.cardType==1" label="影票是否参与：" :label-width="formLabelWidth" prop="cinemaName">
                    <el-radio-group v-model="oForm.isFilmJoin">
                        <el-radio label="1">参加</el-radio>
                        <el-radio label="0">不参加</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="oForm.isFilmJoin==1&&oForm.cardType==1" label="影票优惠简短描述：" :label-width="formLabelWidth" prop="screenName">
                  <el-input v-model="oForm.filmSimpleDesc"></el-input>
                </el-form-item>
                <el-form-item v-if="oForm.isFilmJoin==1&&oForm.cardType==1" label="选择影厅：" :label-width="formLabelWidth" prop="screenName">
                    <el-radio-group v-model="oForm.selectHallType">
                        <el-radio label="0">全部影厅</el-radio>
                        <el-radio label="1">指定影厅参加</el-radio>
                        <el-radio label="2">指定影厅不参加</el-radio>
                    </el-radio-group>
                    <el-checkbox-group v-model="oForm.screenCode" @change="selectScreens" v-if="oForm.selectHallType != 0">
                        <el-checkbox
                                v-for="item in screenInfo"
                                :label="item.screenCode"
                                :key="item.screenCode"
                                :value="item.screenName"
                        >{{item.screenName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="oForm.isFilmJoin==1&&oForm.cardType==1"  label="选择制式：" :label-width="formLabelWidth" prop="formatName">
                    <el-radio-group v-model="oForm.selectFilmFormatType">
                        <el-radio label="0">全部制式参加</el-radio>
                        <el-radio label="1">指定制式参加</el-radio>
                        <el-radio label="2">指定制式不参加</el-radio>
                    </el-radio-group>
                    <el-checkbox-group v-model="oForm.filmFormatCode" @change="selectFormat" v-if="oForm.selectFilmFormatType != 0">
                        <el-checkbox
                                v-for="item in formatList"
                                :label="item.formatCode"
                                :key="item.formatCode"
                                :value="item.formatName"
                        >{{item.formatName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="oForm.isFilmJoin==1&&oForm.cardType==1"  label="选择影片：" :label-width="formLabelWidth" prop="filmName">
                    <el-radio-group v-model="oForm.selectFilmType">
                        <el-radio label="0">全部影片</el-radio>
                        <el-radio label="1">部分影片</el-radio>
                        <el-radio label="2">排除影片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="oForm.isFilmJoin==1&&oForm.selectFilmType!=0&&oForm.cardType==1" label="选择影片" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选影片"
                        :label-width="formLabelWidth"
                        v-if="oForm.isFilmJoin==1&&selectedSell.length>0&&oForm.cardType==1&&oForm.selectFilmType!=0"
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
                                @click="deleteSell()"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item  v-if="oForm.isFilmJoin==1&&oForm.cardType==1"  label="影票优惠方式：" :label-width="formLabelWidth" prop="reduceType">
                    <el-radio-group v-model="oForm.reduceTypeFilm">
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">立减</el-radio>
                        <el-radio label="3">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="固定金额：" :label-width="formLabelWidth" v-if="oForm.reduceTypeFilm == 1&&oForm.cardType==1">
                    <el-input style="width: 150px" v-model="oForm.discountMoneyFilm" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="立减金额：" :label-width="formLabelWidth" v-if="oForm.reduceTypeFilm == 2&&oForm.cardType==1">
                    减
                    <el-input style="width: 150px" v-model="oForm.discountMoneyFilm" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="折扣：" :label-width="formLabelWidth" v-if="oForm.reduceTypeFilm == 3&&oForm.cardType==1">
                    <el-input style="width: 150px" v-model="oForm.discountMoneyFilm" autocomplete="off"></el-input>%
                </el-form-item>
                <el-form-item v-if="oForm.isFilmJoin==1&&oForm.cardType==1"  label="是否限量：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.isLimitFilm" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="限购时间：" v-if="oForm.isLimitFilm==1&&oForm.cardType==1&&oForm.isFilmJoin==1" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.limitFilmUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="限购张数：" v-if="oForm.isLimitFilm==1&&oForm.cardType==1&&oForm.isFilmJoin==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.numberFilm" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="oForm.cardType==1" label="卖品是否参与：" :label-width="formLabelWidth" prop="cinemaName">
                    <el-radio-group v-model="oForm.isMerchandiseJoin">
                        <el-radio label="1">参加</el-radio>
                        <el-radio label="0">不参加</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1" label="卖品优惠简短描述：" :label-width="formLabelWidth" prop="screenName">
                    <el-input v-model="oForm.merchandiseSimpleDesc"></el-input>
                </el-form-item>
                <el-form-item v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1"  label="优惠方式：" :label-width="formLabelWidth" prop="reduceType">
                    <el-radio-group v-model="oForm.reduceTypeMerchandise">
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">满减</el-radio>
                        <el-radio label="3">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="固定金额：" :label-width="formLabelWidth" v-if="oForm.reduceTypeMerchandise == 1&&oForm.cardType==1">
                    <el-input style="width: 150px" v-model="oForm.discountMoneyMerchandise" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="立减金额：" :label-width="formLabelWidth" v-if="oForm.reduceTypeMerchandise == 2&&oForm.cardType==1">
                    满
                    <el-input style="width: 150px" v-model="oForm.achieveMoneyMerchandise" autocomplete="off"></el-input>
                    减
                    <el-input style="width: 150px" v-model="oForm.discountMoneyMerchandise" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="折扣：" :label-width="formLabelWidth" v-if="oForm.reduceTypeMerchandise == 3&&oForm.cardType==1">
                    <el-input style="width: 150px" v-model="oForm.discountMoneyMerchandise" autocomplete="off"></el-input>%
                </el-form-item>
                <el-form-item v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1"  label="选择商品：" :label-width="formLabelWidth" prop="filmName">
                    <el-radio-group v-model="oForm.selectMerchandiseType">
                        <el-radio label="0">全部商品</el-radio>
                        <el-radio label="1">部分商品</el-radio>
                        <el-radio label="2">排除商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="oForm.selectMerchandiseType!=0&&oForm.isMerchandiseJoin==1&&oForm.cardType==1" label="选择商品" :label-width="formLabelWidth">
                    <el-button type="primary" @click="selectSell">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选商品"
                        :label-width="formLabelWidth"
                        v-if="oSelectedSell.length>0&&oForm.cardType==1&&oForm.selectMerchandiseType!=0"
                >
                    <div v-for="(item, index) in oSelectedSell" style="margin-bottom: 5px" :key="index">
                        <el-input
                                style="width: 250px"
                                v-model="item.merchandiseName"
                                autocomplete="off"
                                :value="item.merchandiseCode"
                                :disabled="true"
                                :change="oOne(item.merchandiseCode)"
                        >
                        </el-input>
                        <span
                                style="color:red;cursor: pointer;"
                                @click="oDeleteSell()"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1"  label="是否限量：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.isLimitMerchandise" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="限购时间：" v-if="oForm.isLimitMerchandise==1&&oForm.cardType==1&&oForm.isMerchandiseJoin==1" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.limitMerchandiseUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="限购次数：" v-if="oForm.isLimitMerchandise==1&&oForm.cardType==1&&oForm.isMerchandiseJoin==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.numberMerchandise" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="oForm.cardType==2" label="券包简短描述：" :label-width="formLabelWidth" prop="name">
                    <el-input style="width: 150px" v-model="oForm.couponSimpleDesc" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                        v-if="oForm.cardType==2"
                        label="设置券包："
                        :label-width="formLabelWidth">
                    <el-button type="primary" @click="changeCoupon">选择券包</el-button>
                </el-form-item>
                <el-form-item
                        v-if="couponId"
                        label="所选券包："
                        :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="groupName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                            v-if="groupName"
                            style="color:red;cursor: pointer;"
                            @click="deletCoupon"
                    >删除</span>
                </el-form-item>
                <el-form-item label="有效期单位：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.unit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="季">季</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="有效期数量：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="支付类型：" :label-width="formLabelWidth" prop="date2" v-if="oForm.cardType==1">
                    <el-radio-group v-model="oForm.validPayType">
                        <el-radio label="0">全部</el-radio>
                        <el-radio label="1">仅非会员卡支付</el-radio>
                        <el-radio label="2">仅会员卡支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="节假日是否可用：" :label-width="formLabelWidth" v-if="oForm.cardType==1">
                    <el-select v-model="oForm.isHolidayValid" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="可用时间段：" :label-width="formLabelWidth" v-if="oForm.cardType==1">
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
                        v-if="dateInfo.length>0&&oForm.cardType==1">
                    <div v-for="(item, index) in dateInfo" :key="index">
                        {{item}}
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deletTime(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="星期几不可用：" :label-width="formLabelWidth" v-if="oForm.cardType==1">
                    <el-checkbox-group v-model="oForm.validWeekDay" @change="selectDay">
                        <el-checkbox
                                v-for="(day, index) in oForm.exceptWeekDay"
                                :label="index+1"
                                :key="day"
                        >{{day}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="是否和券共用" :label-width="formLabelWidth" v-if="oForm.cardType==1">
                    <el-select v-model="oForm.isCouponTogether" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="卡费：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.expense" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="售卖时间：" :label-width="formLabelWidth" prop="date1">
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
                <el-form-item label="售卖状态：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否推荐：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.isRecommend" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="使用说明：" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
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
        <!--新增影片弹出框-->
        <el-dialog title="选择影片" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.name" placeholder="角色名" class="handle-input mr10"></el-input>
                    <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                        <el-option key="1" label="审核中" value="1"></el-option>
                        <el-option key="2" label="未审核" value="2"></el-option>
                        <el-option key="3" label="通过" value="3"></el-option>
                        <el-option key="4" label="审核失败" value="4"></el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
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
        <el-dialog title="详情" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="权益卡名称：" :label-width="formLabelWidth">
                    <span>{{oName}}</span>
                </el-form-item>
                <el-form-item label="选择影院：" :label-width="formLabelWidth">
                    <span>{{oCinemaName}}</span>
                </el-form-item>
                <el-form-item label="权益类型：" :label-width="formLabelWidth">
                    <span v-if="oCardType == 1">优惠活动</span>
                    <span v-if="oCardType == 2">赠送券包{{oGroupName}}</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="影票是否参与：" :label-width="formLabelWidth">
                    <span v-if="oIsFilmJoin == 0">不参加</span>
                    <span v-if="oIsFilmJoin == 1">参加</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="选择影厅：" :label-width="formLabelWidth">
                    <span v-if="selectHallType == 0">全部影厅</span>
                    <span v-if="selectHallType == 1">{{oScreenName}}</span>
                    <span v-if="selectHallType == 2">除{{oScreenName}}外所有影厅</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="选择制式：" :label-width="formLabelWidth">
                    <span>{{oFilmFormatName}}</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="选择影片：" :label-width="formLabelWidth">
                    <span v-if="selectFilmType == 0">全部影片</span>
                    <span v-if="selectFilmType == 1">{{oFilmName}}</span>
                    <span v-if="selectFilmType == 2">除{{oFilmName}}外所有影片</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="影票优惠方式：" :label-width="formLabelWidth">
                    <span v-if="oReduceTypeFilm == 1">特惠价格{{oDiscountMoneyFilm}}元</span>
                    <span v-if="oReduceTypeFilm == 2">立减{{oDiscountMoneyFilm}}元</span>
                    <span v-if="oReduceTypeFilm == 3">折扣{{oDiscountMoneyFilm}}%</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="卖品是否参与：" :label-width="formLabelWidth">
                    <span v-if="oIsMerchandiseJoin == 0">不参加</span>
                    <span v-if="oIsMerchandiseJoin == 1">参加</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="选择卖品：" :label-width="formLabelWidth">
                    <span v-if="selectMerchandiseType == 0">全部商品</span>
                    <span v-if="selectMerchandiseType == 1">{{oMerchandiseName}}</span>
                    <span v-if="selectMerchandiseType == 2">除{{oMerchandiseName}}外所有商品</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="卖品优惠方式：" :label-width="formLabelWidth">
                    <span v-if="oReduceTypeMerchandise == 1">特惠价格{{oDiscountMoneyMerchandise}}元</span>
                    <span v-if="oReduceTypeMerchandise == 2">满{{oAchieveMoneyMerchandise}}减{{oDiscountMoneyMerchandise}}元</span>
                    <span v-if="oReduceTypeMerchandise == 3">折扣{{oDiscountMoneyMerchandise}}</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="每日限量：" :label-width="formLabelWidth">
                    <span v-if="oIsLimitFilm == 1">限量{{oNumberFilm}}张</span>
                    <span v-if="oIsLimitFilm == 0">不限量</span>
                </el-form-item>
                <el-form-item label="有效期：" :label-width="formLabelWidth">
                    <span>{{oNumber}}</span>
                    <span>{{oUnit}}</span>
                </el-form-item>
                <el-form-item
                        label="可用时间段"
                        :label-width="formLabelWidth"
                        v-if="canTimeList.length>0"
                >
                    <div v-for="(item, index) in canTimeList" style="margin-bottom: 5px" :key="index">
                        <el-input
                                style="width: 150px"
                                v-model="item.startTime"
                                autocomplete="off"
                                :disabled="true"
                        >
                        </el-input>至
                        <el-input
                                style="width: 150px"
                                v-model="item.endTime"
                                autocomplete="off"
                                :disabled="true"
                        >
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="支付类型：" :label-width="formLabelWidth">
                    <span v-if="oValidPayType == 0">全部</span>
                    <span v-if="oValidPayType == 1">仅非会员卡支付</span>
                    <span v-if="oValidPayType == 2">仅会员卡支付</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="节假日是否可用：" :label-width="formLabelWidth">
                    <span v-if="oIsHolidayValid == 0">不可用</span>
                    <span v-if="oIsHolidayValid == 1">可用</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="星期几不可用：" :label-width="formLabelWidth">
                    <span>{{oValidWeekDay}}</span>
                </el-form-item>
                <el-form-item v-if="oCardType == 1" label="是否和券共用：" :label-width="formLabelWidth">
                    <span v-if="oIsCouponTogether == 1">是</span>
                    <span v-if="oIsCouponTogether == 0">否</span>
                </el-form-item>
                <el-form-item label="卡费：" :label-width="formLabelWidth">
                    <span>{{oExpense}}</span>
                </el-form-item>
                <el-form-item label="售卖时间：" :label-width="formLabelWidth">
                    <span>{{oStartDate}}</span>至
                    <span>{{oEndDate}}</span>
                </el-form-item>
                <el-form-item label="售卖状态：" :label-width="formLabelWidth">
                    <span v-if="oStatus == 1">启用</span>
                    <span v-if="oStatus == 0">未启用</span>
                </el-form-item>
                <el-form-item label="权益卡描述：" :label-width="formLabelWidth">
                    <span>{{oCouponDesc}}</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增卖品弹出框-->
        <el-dialog title="选择卖品" :visible.sync="oDrawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.name" placeholder="角色名" class="handle-input mr10"></el-input>
                    <el-select clearable v-model="query.status" placeholder="状态" class="handle-select mr10">
                        <el-option key="1" label="审核中" value="1"></el-option>
                        <el-option key="2" label="未审核" value="2"></el-option>
                        <el-option key="3" label="通过" value="3"></el-option>
                        <el-option key="4" label="审核失败" value="4"></el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                </div>
                <el-table
                        :data="oSellTableData"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="id" :label="scope.$index" @change.native="oGetCurrentRow(scope.$index)">&nbsp;</el-radio>
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
                <el-button @click="oDrawer = false">取 消</el-button>
                <el-button type="primary" @click="oSureNext">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 选择优惠券弹出窗 -->
        <el-dialog title="选择优惠券" :visible.sync="drawerCoupon">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="couponName" placeholder="券包名称" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="changeCoupon">搜索</el-button>
                </div>
                <el-table
                        :data="couponList"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="couponId" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="券包名称" width="150">
                        <template slot-scope="scope">{{scope.row.groupName}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠券详情">
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
                selectedSell:[],
                oSelectedSell:[],
                sellIndex:'',
                oSellIndex:'',
                sellTableData:[],
                oSellTableData:[],
                drawer: false,//选择影片弹出框
                drawerCoupon: false,//选择优惠券弹出框
                oDrawer: false,//选择商品弹出框
                value1:'',
                oCardType:'',
                oIsFilmJoin:'',
                oCinemaName: '',
                oNumberFilm: '',
                oStartDate: '',
                oScreenName: '',
                oFilmFormatName:'',
                selectFilmFormatType:'',
                selectHallType:'',
                selectFilmType:'',
                oFilmName: '',
                oName: '',
                oCreateDate: '',
                oEndDate: '',
                oValidPayType: '',
                oReduceType: '',
                oDiscountMoney: '',
                oDiscountMoneyFilm: '',
                oMerchandiseName: '',
                oReduceTypeFilm:'',
                oAchieveMoney: '',
                oIsMerchandiseJoin: '',
                oCouponDesc: '',
                oIsHolidayValid:'',
                oValidWeekDay:'',
                oIsLimitFilm:'',
                oIsCouponTogether:'',
                oId: '',
                oExpense: '',
                oIsLimitTotal:'',
                oTotalNumber:'',
                oTotalSurplus:'',
                oIsLimitSingle:'',////
                oSingleNumber:'',
                selectMerchandiseType:'',
                oNumber:'',
                oAchieveMoneyMerchandise:'',
                oGroupName:'',
                oUnit:'',
                oStatus: '',
                formatList:[],//电影制式列表
                message: '', //弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 10
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
                    filmFormatCode:[],
                    cardType:'1', //权益类型
                    selectFilmType: '0',//选择影片
                    selectMerchandiseType:'0',//选择商品
                    selectHallType: '0',//选择影厅
                    benefitType:'0',//权益类型
                    selectFilmFormatType:'0',//选择制式
                    code:[],//选择影院
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
                    couponDesc: '',
                    id: '',
                    status: ''
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
                couponId: '',
                couponName: '',
                couponList: [],
                groupName: '',
            };
        },
        created() {},
        mounted() {
            this.getMenu();
        },
        methods: {
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
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCodes', value: this.oForm.cinemaCode });
                jsonArr.push({ key: 'status', value: 1 });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                console.log(jsonArr);
                https.fetchPost('/couponGroup/couponGroupPage', params).then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        console.log(res);
                        if (res.data.length == 0) {
                            this.message = '暂无券包';
                            this.open();
                            return;
                        }
                        this.couponList = res.data;
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
                this.startArr.push(this.value1[0])
                this.endArr.push(this.value1[1])
                console.log(this.startArr.join(','));
                console.log(this.endArr.join(','));
            },
            deletTime(index) {
                this.dateInfo.splice(index, 1);
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
                https.fetchPost('/benefitCard/addPage', '').then(data => {
                    loading.close();
                    console.log(data);
                    if (data.data.code == 'success') {
                        this.selectedSell=[];
                        this.oForm.code = this.cinemaInfo[0].cinemaCode;
                        console.log(JSON.parse(Decrypt(data.data.data)));
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
            addRole() {//新增按钮操作
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
                let filmeCodes = [];//影片编码
                for (let i = 0; i < this.selectedSell.length; i++) {
                    filmeCodes.push(this.selectedSell[i].filmCode);
                }
                this.oForm.filmCode = filmeCodes.join(',');
                let merchandiseCodes = [];//卖品编码
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
                var jsonArr = [];
                jsonArr.push({ key: 'name', value: this.oForm.name });
                jsonArr.push({ key: 'cinemaCode', value: this.oForm.cinemaCode });
                jsonArr.push({ key: 'cardType', value: this.oForm.cardType});
                jsonArr.push({ key: 'startDate', value: this.oForm.startDate});
                jsonArr.push({ key: 'endDate', value: this.oForm.endDate});
                jsonArr.push({ key: 'status', value: this.oForm.status});
                jsonArr.push({ key: 'benefitDesc', value: this.oForm.benefitDesc});
                jsonArr.push({ key: 'unit', value: this.oForm.unit});
                jsonArr.push({ key: 'number', value: this.oForm.number});
                jsonArr.push({ key: 'expense', value: this.oForm.expense});
                jsonArr.push({ key: 'simpleDesc', value: this.oForm.simpleDesc});
                jsonArr.push({ key: 'isRecommend', value: this.oForm.isRecommend});
                if(this.oForm.cardType==1){
                    jsonArr.push({ key: 'isFilmJoin', value: this.oForm.isFilmJoin});
                    jsonArr.push({ key: 'startTimeVal', value: this.startArr.join(',')});
                    jsonArr.push({ key: 'endTimeVal', value: this.endArr.join(',')});
                    jsonArr.push({ key: 'isMerchandiseJoin', value: this.oForm.isMerchandiseJoin});
                    jsonArr.push({ key: 'isHolidayValid', value: this.oForm.isHolidayValid});
                    jsonArr.push({ key: 'validWeekDay', value: this.oForm.validWeekDay});
                    jsonArr.push({ key: 'validPayType', value: this.oForm.validPayType});
                    jsonArr.push({ key: 'isCouponTogether', value: this.oForm.isCouponTogether});
                    if(this.oForm.isFilmJoin==1){
                        jsonArr.push({ key: 'filmSimpleDesc', value: this.oForm.filmSimpleDesc});
                        jsonArr.push({ key: 'reduceTypeFilm', value: this.oForm.reduceTypeFilm});
                        jsonArr.push({ key: 'discountMoneyFilm', value: this.oForm.discountMoneyFilm});
                        jsonArr.push({ key: 'selectHallType', value: this.oForm.selectHallType});
                        jsonArr.push({ key: 'selectFilmFormatType', value: this.oForm.selectFilmFormatType});
                        jsonArr.push({ key: 'selectFilmType', value: this.oForm.selectFilmType});
                        jsonArr.push({ key: 'isLimitFilm', value: this.oForm.isLimitFilm});
                        if(this.oForm.selectHallType!=0){
                            jsonArr.push({ key: 'screenCode', value: this.oForm.screenCode});
                        }
                        if(this.oForm.selectFilmFormatType!=0){
                            jsonArr.push({ key: 'filmFormatCode', value: this.oForm.filmFormatCode});
                        }
                        if(this.oForm.selectFilmType!=0){
                            jsonArr.push({ key: 'filmCode', value: this.oForm.filmCode});
                        }
                        if(this.oForm.isLimitFilm!=0){
                            jsonArr.push({ key: 'numberFilm', value: this.oForm.numberFilm});
                            jsonArr.push({ key: 'limitFilmUnit', value: this.oForm.limitFilmUnit});
                        }
                    }
                    if(this.oForm.isMerchandiseJoin==1){
                        jsonArr.push({ key: 'reduceTypeMerchandise', value: this.oForm.reduceTypeMerchandise});
                        jsonArr.push({ key: 'merchandiseSimpleDesc', value: this.oForm.erchandiseSimpleDesc});
                        jsonArr.push({ key: 'discountMoneyMerchandise', value: this.oForm.discountMoneyMerchandise});
                        jsonArr.push({ key: 'selectMerchandiseType', value: this.oForm.selectMerchandiseType});
                        jsonArr.push({ key: 'isLimitMerchandise', value: this.oForm.isLimitMerchandise});
                        if(this.oForm.selectMerchandiseType!=0){
                            jsonArr.push({ key: 'merchandiseCode', value: this.oForm.merchandiseCode});
                        }
                        if(this.oForm.reduceTypeMerchandise==2){
                            jsonArr.push({ key: 'achieveMoneyMerchandise', value: this.oForm.achieveMoneyMerchandise});
                        }
                        if(this.oForm.isLimitMerchandise!=0){
                            jsonArr.push({ key: 'numberMerchandise', value: this.oForm.numberMerchandise});
                            jsonArr.push({ key: 'limitMerchandiseUnit', value: this.oForm.limitMerchandiseUnit});
                        }
                    }

                }
                else if(this.oForm.cardType==2){
                    jsonArr.push({ key: 'couponGroupId', value: this.couponId});
                    jsonArr.push({ key: 'couponSimpleDesc', value: this.oForm.couponSimpleDesc});
                }
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https.fetchPost('/benefitCard/addBenefit', params).then(data => {//新增
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                            this.oForm.name = '';
                            this.oForm.cinemaCode='';
                            this.oForm.cardType='1';
                            this.oForm.startDate='';
                            this.oForm.endDate='';
                            this.oForm.status='';
                            this.oForm.benefitDesc='';
                            this.oForm.unit='';
                            this.oForm.number='';
                            this.oForm.expense='';
                            this.oForm.isFilmJoin='';
                            this.oForm.isMerchandiseJoin='';
                            this.oForm.isHolidayValid='';
                            this.oForm.validWeekDay='';
                            this.oForm.validPayType='1';
                            this.oForm.isCouponTogether='';
                            this.oForm.reduceTypeFilm='';
                            this.oForm.discountMoneyFilm='';
                            this.oForm.selectHallType='';
                            this.oForm.selectFilmFormatType='';
                            this.oForm.selectFilmType='';
                            this.oForm.isLimitFilm='';
                            this.oForm.filmCode='';
                            this.oForm.numberFilm='';
                            this.oForm.reduceTypeMerchandise='';
                            this.oForm.discountMoneyMerchandise='';
                            this.oForm.selectMerchandiseType='';
                            this.oForm.isLimitMerchandise='';
                            this.oForm.merchandiseCode='';
                            this.oForm.achieveMoneyMerchandise='';
                            this.oForm.numberMerchandise='';
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
                    https.fetchPost('/benefitCard/deleteById', params).then(data => {
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
                https.fetchPost('/benefitCard/getTimesById', params).then(data => { //查询可用时间段
                    loading.close();
                    console.log(data);
                    if(JSON.parse(Decrypt(data.data.data))){
                        this.canTimeList=JSON.parse(Decrypt(data.data.data))
                    }
                    console.log(this.canTimeList);

                }).catch(err => {
                    loading.close();
                    console.log(err);
                });
                https.fetchPost('/benefitCard/getBenefitById', params).then(data => {
                    loading.close();
                    console.log(data);
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.oCinemaName = JSON.parse(Decrypt(data.data.data)).cinemaName;
                        this.oIsFilmJoin = JSON.parse(Decrypt(data.data.data)).isFilmJoin;
                        this.oNumberFilm = JSON.parse(Decrypt(data.data.data)).numberFilm;
                        this.oReduceTypeFilm = JSON.parse(Decrypt(data.data.data)).reduceTypeFilm;
                        this.selectMerchandiseType = JSON.parse(Decrypt(data.data.data)).selectMerchandiseType;
                        this.oNumber = JSON.parse(Decrypt(data.data.data)).number;
                        this.oUnit = JSON.parse(Decrypt(data.data.data)).unit;
                        this.oReduceTypeFilm = JSON.parse(Decrypt(data.data.data)).reduceTypeFilm;
                        this.oReduceTypeMerchandise = JSON.parse(Decrypt(data.data.data)).reduceTypeMerchandise;
                        this.oAchieveMoneyMerchandise = JSON.parse(Decrypt(data.data.data)).achieveMoneyMerchandise;
                        this.oDiscountMoneyMerchandise = JSON.parse(Decrypt(data.data.data)).discountMoneyMerchandise;
                        this.oIsLimitFilm = JSON.parse(Decrypt(data.data.data)).isLimitFilm;
                        this.oIsMerchandiseJoin = JSON.parse(Decrypt(data.data.data)).isMerchandiseJoin;
                        this.oExpense = JSON.parse(Decrypt(data.data.data)).expense;
                        this.oDiscountMoneyFilm = JSON.parse(Decrypt(data.data.data)).discountMoneyFilm;
                        this.oMerchandiseName = JSON.parse(Decrypt(data.data.data)).merchandiseName;
                        this.oGroupName = JSON.parse(Decrypt(data.data.data)).groupName;
                        this.oScreenName = JSON.parse(Decrypt(data.data.data)).screenName;
                        this.selectHallType =JSON.parse(Decrypt(data.data.data)).selectHallType;
                        this.selectFilmFormatType =JSON.parse(Decrypt(data.data.data)).selectFilmFormatType;
                        this.selectFilmType =JSON.parse(Decrypt(data.data.data)).selectFilmType;
                        this.oFilmFormatName = JSON.parse(Decrypt(data.data.data)).filmFormatName;
                        this.oFilmName = JSON.parse(Decrypt(data.data.data)).filmName;
                        this.oName = JSON.parse(Decrypt(data.data.data)).name;
                        this.oCreateDate = JSON.parse(Decrypt(data.data.data)).createDate;
                        this.oStartDate = JSON.parse(Decrypt(data.data.data)).startDate;
                        this.oEndDate = JSON.parse(Decrypt(data.data.data)).endDate;
                        this.oValidPayType = JSON.parse(Decrypt(data.data.data)).validPayType;
                        this.oReduceType = JSON.parse(Decrypt(data.data.data)).reduceType;
                        this.oCardType = JSON.parse(Decrypt(data.data.data)).cardType;
                        // this.oAchieveMoney = JSON.parse(Decrypt(data.data.data)).achieveMoney;
                        this.oDiscountMoney = JSON.parse(Decrypt(data.data.data)).discountMoney;
                        this.oIsHolidayValid = JSON.parse(Decrypt(data.data.data)).isHolidayValid;
                        this.oValidWeekDay = JSON.parse(Decrypt(data.data.data)).validWeekDay;
                        this.oIsCouponTogether = JSON.parse(Decrypt(data.data.data)).isCouponTogether;
                        this.oCouponDesc = JSON.parse(Decrypt(data.data.data)).benefitDesc
                        this.oIsLimitTotal = JSON.parse(Decrypt(data.data.data)).isLimitTotal
                        this.oTotalNumber = JSON.parse(Decrypt(data.data.data)).totalNumber
                        this.oTotalSurplus = JSON.parse(Decrypt(data.data.data)).totalSurplus
                        this.oIsLimitSingle = JSON.parse(Decrypt(data.data.data)).isLimitSingle
                        this.oSingleNumber = JSON.parse(Decrypt(data.data.data)).singleNumber
                        this.oStatus = JSON.parse(Decrypt(data.data.data)).status;
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
                var jsonArr = [];
                jsonArr.push({ key: 'filmCode', value: this.oFilmCode });
                jsonArr.push({ key: 'filmName', value: this.oFilmName });
                jsonArr.push({ key: 'version', value: this.oVersion });
                jsonArr.push({ key: 'duration', value: this.oDuration });
                jsonArr.push({ key: 'publishDate', value: this.oPublishDate });
                jsonArr.push({ key: 'directorId', value: this.oDirectorId });
                jsonArr.push({ key: 'castId', value: this.oCastId });
                jsonArr.push({ key: 'introduction', value: this.oIntroduction });
                jsonArr.push({ key: 'score', value: this.oScore });
                jsonArr.push({ key: 'area', value: this.oArea });
                jsonArr.push({ key: 'type', value: this.oType });
                jsonArr.push({ key: 'language', value: this.oLanguage });
                jsonArr.push({ key: 'status', value: this.oStatus });
                jsonArr.push({ key: 'image', value: this.oImage });
                jsonArr.push({ key: 'trailer', value: this.oTrailer });
                jsonArr.push({ key: 'stagePhoto', value: this.oStagePhoto });
                jsonArr.push({ key: 'id', value: this.oId });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                this.editVisible = false;
                https.fetchPost('/film/updateFilm', params).then(data => {
                    loading.close();
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
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
                https.fetchPost('/benefitCard/updateStatusById', params).then(data => {
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
            },
            Search() {
                console.log(this.query.reduceType);
                console.log(this.query.status);
                console.log(this.query.cinemaCode);
                console.log(this.query.name);
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
                https.fetchPost('/benefitCard/page', params).then(data => {
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
                //错误信息弹出框
                this.$alert(this.message, '错误信息', {
                    dangerouslyUseHTMLString: true
                });
            },
            selectCinema(val) {
                console.log(val)
                // let selectValue = val.join(',');
                this.selectValue = val;
                this.getAllScreen(val);
            },
            selectScreens(val) {
                console.log(val)
                let selectValue = val.join(',');
                this.selectScreenCode = selectValue;
                console.log(selectValue);
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
            getCurrentRow(index){//影片弹出框index
                this.sellIndex=index
            },
            oGetCurrentRow(index){//商品弹出框index
                this.oSellIndex=index
            },
            one(a){//获取影片绑定的value值
                // console.log(a);
                this.oForm.filmCode =a
            },
            oOne(a){//获取卖品绑定的value值
                // console.log(a);
                this.oForm.merchandiseCode =a
            },
            sureNext() {
                if(this.sellIndex>=0){
                    // this.selectedSell=[]
                    this.selectedSell.push(this.sellTableData[this.sellIndex]);
                }
                console.log(this.selectedSell);
                this.drawer = false;
            },
            oSureNext() {
                if(this.oSellIndex>=0){
                    // this.selectedSell=[]
                    this.oSelectedSell.push(this.oSellTableData[this.oSellIndex]);
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
                    let jsonArr = [];
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
                            console.log(this.sellTableData);
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
                    let jsonArr = [];
                    jsonArr.push({key:"pageNo",value:this.query.pageNo});
                    jsonArr.push({key:"pageSize",value:this.query.pageSize});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/merchandise/list',params).then((data) => {
                        loading.close();
                        console.log(data);
                        if(data.data.code=='success') {
                            this.oDrawer=true
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
                            this.oSellTableData = oData.data;
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

