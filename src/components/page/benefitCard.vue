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
                <el-select clearable v-model="query.reduceTypeFilm" placeholder="影片优惠方式" class="handle-select mr10">
                    <el-option key="0" label="不参加" value="0"></el-option>
                    <el-option key="1" label="特惠" value="1"></el-option>
                    <el-option key="2" label="满减" value="2"></el-option>
                    <el-option key="3" label="折扣" value="3"></el-option>
                </el-select>
                <el-select clearable v-model="query.reduceTypeMerchandise" placeholder="卖品优惠方式" class="handle-select mr10">
                    <el-option key="0" label="不参加" value="0"></el-option>
                    <el-option key="1" label="特惠" value="1"></el-option>
                    <el-option key="2" label="满减" value="2"></el-option>
                    <el-option key="3" label="折扣" value="3"></el-option>
                </el-select>
                <el-select clearable v-model="query.cardType" placeholder="权益卡类型" class="handle-select mr10">
                    <el-option key="1" label="活动类型" value="1"></el-option>
                    <el-option key="2" label="券包类型" value="2"></el-option>
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
                <el-input v-model="query.name" placeholder="权益卡名称" class="handle-input mr10"></el-input>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                        type="primary"
                        @click="addPage"
                        icon="el-icon-circle-plus-outline"
                        style="float: right;margin-top: 10px"
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
                <el-table-column prop="name" label="权益卡名称" width="150">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="name" label="适用影院" width="200">
                <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="权益卡类型" width="110">
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
                <el-form-item :required="true" label="权益卡名称：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.name" maxlength="15" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="权益卡简短描述：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.simpleDesc" maxlength="16" autocomplete="off"></el-input>
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
                <el-form-item :required="true"  v-if="oForm.cardType==1" label="影票是否参与：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.isFilmJoin">
                        <el-radio label="1">参加</el-radio>
                        <el-radio label="0">不参加</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.isFilmJoin==1&&oForm.cardType==1" label="影票优惠简短描述：" :label-width="formLabelWidth">
                  <el-input v-model="oForm.filmSimpleDesc" maxlength="70" type="textarea"></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.isFilmJoin==1&&oForm.cardType==1" label="选择影厅：" :label-width="formLabelWidth">
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
                <el-form-item :required="true" v-if="oForm.isFilmJoin==1&&oForm.cardType==1"  label="选择制式：" :label-width="formLabelWidth">
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
                <el-form-item :required="true" v-if="oForm.isFilmJoin==1&&oForm.cardType==1"  label="选择影片：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.selectFilmType">
                        <el-radio label="0">全部影片</el-radio>
                        <el-radio label="1">部分影片</el-radio>
                        <el-radio label="2">排除影片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.isFilmJoin==1&&oForm.selectFilmType!=0&&oForm.cardType==1" label="选择影片" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选影片"
                        :label-width="formLabelWidth"
                        v-if="oForm.isFilmJoin==1&&selectedSell.length>0&&oForm.cardType==1&&oForm.selectFilmType!=0"
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
                <el-form-item :required="true"  v-if="oForm.isFilmJoin==1&&oForm.cardType==1"  label="影票优惠方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.reduceTypeFilm">
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">立减</el-radio>
                        <el-radio label="3">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="固定金额：" :label-width="formLabelWidth" v-if="oForm.reduceTypeFilm == 1&&oForm.cardType==1&&oForm.isFilmJoin==1">
                    <el-input style="width: 150px" v-model="oForm.discountMoneyFilm" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="立减金额：" :label-width="formLabelWidth" v-if="oForm.reduceTypeFilm == 2&&oForm.cardType==1&&oForm.isFilmJoin==1">
                    减
                    <el-input style="width: 150px" v-model="oForm.discountMoneyFilm" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="折扣：" :label-width="formLabelWidth" v-if="oForm.reduceTypeFilm == 3&&oForm.cardType==1&&oForm.isFilmJoin==1">
                    <el-input style="width: 150px" v-model="oForm.discountMoneyFilm" autocomplete="off"></el-input>%
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.isFilmJoin==1&&oForm.cardType==1"  label="是否限量：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.isLimitFilm" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="限购时间：" v-if="oForm.isLimitFilm==1&&oForm.cardType==1&&oForm.isFilmJoin==1" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.limitFilmUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="限购张数：" v-if="oForm.isLimitFilm==1&&oForm.cardType==1&&oForm.isFilmJoin==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.numberFilm" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.cardType==1" label="卖品是否参与：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.isMerchandiseJoin">
                        <el-radio label="1">参加</el-radio>
                        <el-radio label="0">不参加</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1" label="卖品优惠简短描述：" :label-width="formLabelWidth">
                    <el-input v-model="oForm.merchandiseSimpleDesc" maxlength="70" type="textarea"></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1"  label="优惠方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.reduceTypeMerchandise">
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">满减</el-radio>
                        <el-radio label="3">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="固定金额：" :label-width="formLabelWidth" v-if="oForm.reduceTypeMerchandise == 1&&oForm.cardType==1&&oForm.isMerchandiseJoin==1">
                    <el-input style="width: 150px" v-model="oForm.discountMoneyMerchandise" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="立减金额：" :label-width="formLabelWidth" v-if="oForm.reduceTypeMerchandise == 2&&oForm.cardType==1&&oForm.isMerchandiseJoin==1">
                    满
                    <el-input style="width: 150px" v-model="oForm.achieveMoneyMerchandise" autocomplete="off"></el-input>
                    减
                    <el-input style="width: 150px" v-model="oForm.discountMoneyMerchandise" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="折扣：" :label-width="formLabelWidth" v-if="oForm.reduceTypeMerchandise == 3&&oForm.cardType==1&&oForm.isMerchandiseJoin==1">
                    <el-input style="width: 150px" v-model="oForm.discountMoneyMerchandise" autocomplete="off"></el-input>%
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1"  label="选择商品：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.selectMerchandiseType">
                        <el-radio label="0" v-if="oForm.reduceTypeMerchandise==2||oForm.reduceTypeMerchandise==3">全部商品</el-radio>
                        <el-radio label="1">部分商品</el-radio>
                        <el-radio label="2" v-if="oForm.reduceTypeMerchandise==2||oForm.reduceTypeMerchandise==3">排除商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.selectMerchandiseType!=0&&oForm.isMerchandiseJoin==1&&oForm.cardType==1" label="选择商品" :label-width="formLabelWidth">
                    <el-button type="primary" @click="selectSell">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选商品"
                        :label-width="formLabelWidth"
                        v-if="oSelectedSell.length>0&&oForm.cardType==1&&oForm.selectMerchandiseType!=0"
                        :required="true"
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
                                @click="oDeleteSell(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.isMerchandiseJoin==1&&oForm.cardType==1"  label="是否限量：" :label-width="formLabelWidth">
                    <el-select v-model="oForm.isLimitMerchandise" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="限购时间：" v-if="oForm.isLimitMerchandise==1&&oForm.cardType==1&&oForm.isMerchandiseJoin==1" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.limitMerchandiseUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="限购次数：" v-if="oForm.isLimitMerchandise==1&&oForm.cardType==1&&oForm.isMerchandiseJoin==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.numberMerchandise" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oForm.cardType==2" label="券包简短描述：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oForm.couponSimpleDesc" maxlength="70" type="textarea"  autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                        v-if="oForm.cardType==2"
                        label="设置券包："
                        :label-width="formLabelWidth"
                        :required="true">
                    <el-button type="primary" @click="changeCoupon">选择券包</el-button>
                </el-form-item>
                <el-form-item
                        v-if="couponId&&oForm.cardType==2"
                        label="所选券包："
                        :label-width="formLabelWidth"
                        :required="true">
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
                <el-form-item :required="true" label="支付类型：" :label-width="formLabelWidth" v-if="oForm.cardType==1">
                    <el-radio-group v-model="oForm.validPayType">
                        <el-radio label="0">全部</el-radio>
                        <el-radio label="1">仅非会员卡支付</el-radio>
                        <el-radio label="2">仅会员卡支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="节假日是否可用：" :label-width="formLabelWidth" v-if="oForm.cardType==1">
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
                <el-form-item :required="true" label="是否和券共用" :label-width="formLabelWidth" v-if="oForm.cardType==1">
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
                    <el-input v-model="query.filmName" placeholder="影片名称" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="openNext">搜索</el-button>
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
                            :current-page="query.aPageNo"
                            :page-size="query.aPageSize"
                            :total="query.aTotalCount"
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
                <el-form-item :required="true" label="权益卡名称：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oName" maxlength="15" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="权益卡简短描述：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oSimpleDesc" maxlength="16" autocomplete="off"></el-input>
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
                <el-form-item :required="true" label="权益类型：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oCardType">
                        <el-radio label="1">优惠活动</el-radio>
                        <el-radio label="2">赠送券包</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true"  v-if="oCardType==1" label="影票是否参与：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oIsFilmJoin">
                        <el-radio label="1">参加</el-radio>
                        <el-radio label="0">不参加</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oIsFilmJoin==1&&oCardType==1" label="影票优惠简短描述：" :label-width="formLabelWidth">
                    <el-input v-model="oFilmSimpleDesc"  maxlength="70" type="textarea"></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oIsFilmJoin==1&&oCardType==1" label="选择影厅：" :label-width="formLabelWidth">
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
                <el-form-item :required="true" v-if="oIsFilmJoin==1&&oCardType==1"  label="选择制式：" :label-width="formLabelWidth">
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
                <el-form-item :required="true" v-if="oIsFilmJoin==1&&oCardType==1"  label="选择影片：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oSelectFilmType">
                        <el-radio label="0">全部影片</el-radio>
                        <el-radio label="1">部分影片</el-radio>
                        <el-radio label="2">排除影片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oIsFilmJoin==1&&oSelectFilmType!=0&&oCardType==1" label="选择影片" :label-width="formLabelWidth">
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选影片"
                        :label-width="formLabelWidth"
                        v-if="oIsFilmJoin==1&&selectedSell.length>0&&oCardType==1&&oSelectFilmType!=0"
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
                <el-form-item :required="true" v-if="oIsFilmJoin==1&&oCardType==1"  label="影票优惠方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oReduceTypeFilm">
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">立减</el-radio>
                        <el-radio label="3">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="固定金额：" :label-width="formLabelWidth" v-if="oReduceTypeFilm == 1&&oCardType==1&&oIsFilmJoin==1">
                    <el-input style="width: 150px" v-model="oDiscountMoneyFilm" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="立减金额：" :label-width="formLabelWidth" v-if="oReduceTypeFilm == 2&&oCardType==1">
                    减
                    <el-input style="width: 150px" v-model="oDiscountMoneyFilm" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="折扣：" :label-width="formLabelWidth" v-if="oReduceTypeFilm == 3&&oCardType==1">
                    <el-input style="width: 150px" v-model="oDiscountMoneyFilm" autocomplete="off"></el-input>%
                </el-form-item>
                <el-form-item :required="true" v-if="oIsFilmJoin==1&&oCardType==1"  label="是否限量：" :label-width="formLabelWidth">
                    <el-select v-model="oIsLimitFilm" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="限购时间：" v-if="oIsLimitFilm==1&&oCardType==1&&oIsFilmJoin==1" :label-width="formLabelWidth">
                    <el-radio-group v-model="oLimitFilmUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="限购张数：" v-if="oIsLimitFilm==1&&oCardType==1&&oIsFilmJoin==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oNumberFilm" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oCardType==1" label="卖品是否参与：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oIsMerchandiseJoin">
                        <el-radio label="1">参加</el-radio>
                        <el-radio label="0">不参加</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oIsMerchandiseJoin==1&&oCardType==1" label="卖品优惠简短描述：" :label-width="formLabelWidth">
                    <el-input v-model="oMerchandiseSimpleDesc" maxlength="70" type="textarea"></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oIsMerchandiseJoin==1&&oCardType==1"  label="优惠方式：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oReduceTypeMerchandise">
                        <el-radio label="1">固定价格</el-radio>
                        <el-radio label="2">满减</el-radio>
                        <el-radio label="3">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="固定金额：" :label-width="formLabelWidth" v-if="oReduceTypeMerchandise == 1&&oCardType==1">
                    <el-input style="width: 150px" v-model="oDiscountMoneyMerchandise" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="立减金额：" :label-width="formLabelWidth" v-if="oReduceTypeMerchandise == 2&&oCardType==1">
                    满
                    <el-input style="width: 150px" v-model="oAchieveMoneyMerchandise" autocomplete="off"></el-input>
                    减
                    <el-input style="width: 150px" v-model="oDiscountMoneyMerchandise" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="折扣：" :label-width="formLabelWidth" v-if="oReduceTypeMerchandise == 3&&oCardType==1">
                    <el-input style="width: 150px" v-model="oDiscountMoneyMerchandise" autocomplete="off"></el-input>%
                </el-form-item>
                <el-form-item :required="true" v-if="oIsMerchandiseJoin==1&&oCardType==1"  label="选择商品：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oSelectMerchandiseType">
                        <el-radio label="0" v-if="oReduceTypeMerchandise==2||oReduceTypeMerchandise==3">全部商品</el-radio>
                        <el-radio label="1">部分商品</el-radio>
                        <el-radio label="2" v-if="oReduceTypeMerchandise==2||oReduceTypeMerchandise==3">排除商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" v-if="oSelectMerchandiseType!=0&&oIsMerchandiseJoin==1&&oCardType==1" label="选择商品" :label-width="formLabelWidth">
                    <el-button type="primary" @click="selectSell">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选商品"
                        :label-width="formLabelWidth"
                        v-if="oSelectedSell.length>0&&oCardType==1&&oSelectMerchandiseType!=0"
                        :required="true"
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
                                @click="oDeleteSell(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" v-if="oIsMerchandiseJoin==1&&oCardType==1"  label="是否限量：" :label-width="formLabelWidth">
                    <el-select v-model="oIsLimitMerchandise" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="限购时间：" v-if="oIsLimitMerchandise==1&&oCardType==1&&oIsMerchandiseJoin==1" :label-width="formLabelWidth">
                    <el-radio-group v-model="oLimitMerchandiseUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="限购次数：" v-if="oIsLimitMerchandise==1&&oCardType==1&&oIsMerchandiseJoin==1" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oNumberMerchandise" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" v-if="oCardType==2" label="券包简短描述：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oCouponSimpleDesc" maxlength="70" type="textarea" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                        v-if="oCardType==2"
                        label="设置券包："
                        :label-width="formLabelWidth"
                        :required="true">
                    <el-button type="primary" @click="changeCoupon">选择券包</el-button>
                </el-form-item>
                <el-form-item
                        v-if="couponId&&oCardType==2"
                        label="所选券包："
                        :label-width="formLabelWidth"
                        :required="true">
                    <el-input style="width: 150px" v-model="groupName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                            v-if="groupName"
                            style="color:red;cursor: pointer;"
                            @click="deletCoupon"
                    >删除</span>
                </el-form-item>
                <el-form-item :required="true" label="有效期单位：" :label-width="formLabelWidth">
                    <el-radio-group v-model="oUnit">
                        <el-radio label="年">年</el-radio>
                        <el-radio label="季">季</el-radio>
                        <el-radio label="月">月</el-radio>
                        <el-radio label="周">周</el-radio>
                        <el-radio label="日">日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="有效期数量：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="支付类型：" :label-width="formLabelWidth" v-if="oCardType==1">
                    <el-radio-group v-model="oValidPayType">
                        <el-radio label="0">全部</el-radio>
                        <el-radio label="1">仅非会员卡支付</el-radio>
                        <el-radio label="2">仅会员卡支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="节假日是否可用：" :label-width="formLabelWidth" v-if="oCardType==1">
                    <el-select v-model="oIsHolidayValid" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="可用时间段：" :label-width="formLabelWidth" v-if="oCardType==1">
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
                        v-if="dateInfo.length>0&&oCardType==1">
                    <div v-for="(item, index) in dateInfo" :key="index">
                        {{item}}
                        <span
                                style="color:red;cursor: pointer;"
                                @click="deletTime(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="星期几不可用：" :label-width="formLabelWidth" v-if="oCardType==1">
                    <el-checkbox-group v-model="oCheckedDays" @change="selectDay">
                        <el-checkbox
                                v-for="item in oExceptWeekDay"
                                :label="item.index"
                                :key="item.index"
                                :value="item.value"
                        >{{item.value}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="是否和券共用" :label-width="formLabelWidth" v-if="oCardType==1">
                    <el-select v-model="oIsCouponTogether" placeholder="请选择">
                        <el-option
                                v-for="item in canUse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="卡费：" :label-width="formLabelWidth">
                    <el-input style="width: 150px" v-model="oExpense" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="售卖时间：" :label-width="formLabelWidth">
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
                <el-form-item :required="true" label="售卖状态：" :label-width="formLabelWidth">
                    <el-select v-model="oStatus" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="是否推荐：" :label-width="formLabelWidth">
                    <el-select v-model="oIsRecommend" placeholder="请选择">
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
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="oBenefitDesc"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                  <el-button @click="editVisible = false">取 消</el-button>
                <el-button @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增卖品弹出框-->
        <el-dialog title="选择卖品" :visible.sync="oDrawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.merName" placeholder="卖品名称" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="selectSell">搜索</el-button>
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
                    <el-table-column label="图片">
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
                            @prev-click='oPrev'
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
        <el-dialog title="选择券包" :visible.sync="drawerCoupon">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.groupName" placeholder="券包名称" class="handle-input mr10"></el-input>
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
                selectedSell:[],
                oSelectedSell:[],
                oCheckedDays:[],
                oScreenCode:[],
                oFilmFormatCode:[],
                sellIndex:'',
                oSimpleDesc:'',
                oSelectMerchandiseType:'',
                oMerchandiseSimpleDesc:'',
                oLimitFilmUnit:'',
                oSelectFilmType:'',
                oFilmSimpleDesc:'',
                oIsRecommend:'',
                oCinemaCode:'',
                oBenefitDesc:'',
                oSellIndex:'',
                oDiscountMoneyMerchandise:'',
                oCouponSimpleDesc:'',
                oNumberMerchandise:'',
                oLimitMerchandiseUnit:'',
                oIsLimitMerchandise:'',
                oSelectHallType:'',
                oReduceTypeMerchandise:'',
                oSelectFilmFormatType:'',
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
                    pageSize: 15,
                    aPageNo: 1,
                    aPageSize: 15,
                    oPageNo: 1,
                    oPageSize: 15,
                    bPageNo: 1,
                    bPageSize: 15,
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
                    isFilmJoin:'0',
                    isMerchandiseJoin:'0',
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
                let groupName=this.query.groupName
                if(!groupName){
                    groupName=''
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCodes', value: this.oForm.cinemaCode });
                jsonArr.push({ key: 'groupName', value: groupName});
                jsonArr.push({ key: 'status', value: 1 });
                jsonArr.push({ key: 'pageNo', value: this.query.bPageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.bPageSize });
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
                this.value1='';
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
                https.fetchPost('/benefitCard/addPage', '').then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.selectedSell=[];
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
                        jsonArr.push({ key: 'merchandiseSimpleDesc', value: this.oForm.merchandiseSimpleDesc});
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
                            this.groupName = '';
                            this.couponId = '';
                            this.oForm.simpleDesc = '';
                            this.oForm.filmSimpleDesc = '';
                            this.oForm.merchandiseSimpleDesc = '';
                            this.oForm.value1 = '';
                            this.oForm.cinemaCode='';
                            this.oForm.cardType='1';
                            this.oForm.startDate='';
                            this.oForm.endDate='';
                            this.oForm.status='0';
                            this.oForm.benefitDesc='';
                            this.oForm.unit='年';
                            this.oForm.number='';
                            this.oForm.expense='';
                            this.oForm.isFilmJoin='0';
                            this.oForm.isMerchandiseJoin='0';
                            this.oForm.isHolidayValid='1';
                            this.oForm.validWeekDay=[];
                            this.oForm.screenCode=[];
                            this.oForm.filmFormatCode=[];
                            this.selectedSell=[];
                            this.oSelectedSell=[];
                            this.dateInfo=[];
                            this.startArr=[];
                            this.endArr=[];
                            this.oForm.validPayType='0';
                            this.oForm.isCouponTogether='0';
                            this.oForm.reduceTypeFilm='1';
                            this.oForm.discountMoneyFilm='';
                            this.oForm.selectHallType='0';
                            this.oForm.benefitType='0';
                            this.oForm.reduceType='1';
                            this.oForm.selectFilmFormatType='0';
                            this.oForm.selectFilmType='0';
                            this.oForm.isLimitFilm='0';
                            this.oForm.filmCode='';
                            this.oForm.numberFilm='';
                            this.oForm.reduceTypeMerchandise='1';
                            this.oForm.discountMoneyMerchandise='';
                            this.oForm.selectMerchandiseType='0';
                            this.oForm.isRecommend='0';
                            this.oForm.isLimitMerchandise='0';
                            this.oForm.merchandiseCode='';
                            this.oForm.achieveMoneyMerchandise='';
                            this.oForm.numberMerchandise='';
                            this.oForm.limitFilmUnit='年';
                            this.oForm.limitMerchandiseUnit='年';
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
                https.fetchPost('/benefitCard/getBenefitById', params).then(data => {
                    loading.close();
                    console.log(data);
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        //电影
                        if(JSON.parse(Decrypt(data.data.data)).benefitCard.filmCode&&JSON.parse(Decrypt(data.data.data)).benefitCard.filmName){
                            let exFilmCodeList=JSON.parse(Decrypt(data.data.data)).benefitCard.filmCode.split(',');
                            let exFilmNameList=JSON.parse(Decrypt(data.data.data)).benefitCard.filmName.split('|');
                            this.selectedSell=[];
                            for(let x in exFilmNameList){
                                let json={};
                                json.filmName=exFilmNameList[x];
                                json.filmCode=exFilmCodeList[x];
                                this.selectedSell.push(json)
                            }
                            console.log(this.selectedSell);
                        }
                        //卖品
                        if(JSON.parse(Decrypt(data.data.data)).benefitCard.merchandiseCode&&JSON.parse(Decrypt(data.data.data)).benefitCard.merchandiseName){
                            let exFilmCodeList=JSON.parse(Decrypt(data.data.data)).benefitCard.merchandiseCode.split(',');
                            let exFilmNameList=JSON.parse(Decrypt(data.data.data)).benefitCard.merchandiseName.split('|');
                            this.oSelectedSell=[];
                            for(let x in exFilmNameList){
                                let json={};
                                json.merchandiseName=exFilmNameList[x];
                                json.merchandiseCode=exFilmCodeList[x];
                                this.oSelectedSell.push(json)
                            }
                            console.log(this.oSelectedSell);
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
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.cardType == 1) {
                            this.oCardType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.cardType == 2) {
                            this.oCardType = '2';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.isFilmJoin == 0) {
                            this.oIsFilmJoin = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.isFilmJoin == 1) {
                            this.oIsFilmJoin = '1';
                        }
                        this.oFilmSimpleDesc= JSON.parse(Decrypt(data.data.data)).benefitCard.filmSimpleDesc;
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectHallType == 0) {
                            this.oSelectHallType = '0';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectHallType == 1) {
                            this.oSelectHallType = '1';
                        }
                        if (JSON.parse(Decrypt(data.data.data)).benefitCard.selectHallType == 2) {
                            this.oSelectHallType = '2';
                        }
                        if(JSON.parse(Decrypt(data.data.data)).benefitCard.screenCode){
                            this.oScreenCode= JSON.parse(Decrypt(data.data.data)).benefitCard.screenCode.split(",");
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
                        if(JSON.parse(Decrypt(data.data.data)).benefitCard.filmFormatCode){
                            this.oFilmFormatCode= JSON.parse(Decrypt(data.data.data)).benefitCard.filmFormatCode.split(",");
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
                        this.oLimitFilmUnit = JSON.parse(Decrypt(data.data.data)).benefitCard.limitFilmUnit;
                        this.oNumberFilm = JSON.parse(Decrypt(data.data.data)).benefitCard.numberFilm;
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
                        this.oCouponSimpleDesc = JSON.parse(Decrypt(data.data.data)).benefitCard.couponSimpleDesc;
                        this.groupName = JSON.parse(Decrypt(data.data.data)).benefitCard.groupName;
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
                        if(JSON.parse(Decrypt(data.data.data)).benefitCard.validWeekDay){
                            this.oCheckedDays = JSON.parse(Decrypt(data.data.data)).benefitCard.validWeekDay.split(",");
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
                let filmCodeList=[];
                for(let x in this.selectedSell){
                    filmCodeList.push(this.selectedSell[x].filmCode)
                }
                let merchandiseCodeList=[];
                for(let x in this.oSelectedSell){
                    merchandiseCodeList.push(this.oSelectedSell[x].merchandiseCode)
                }
                var jsonArr = [];
                jsonArr.push({ key: 'name', value: this.oName });
                jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode });
                jsonArr.push({ key: 'cardType', value: this.oCardType});
                jsonArr.push({ key: 'startDate', value: this.oStartDate});
                jsonArr.push({ key: 'endDate', value: this.oEndDate});
                jsonArr.push({ key: 'status', value: this.oStatus});
                jsonArr.push({ key: 'benefitDesc', value: this.oBenefitDesc});
                jsonArr.push({ key: 'unit', value: this.oUnit});
                jsonArr.push({ key: 'number', value: this.oNumber});
                jsonArr.push({ key: 'expense', value: this.oExpense});
                jsonArr.push({ key: 'simpleDesc', value: this.oSimpleDesc});
                jsonArr.push({ key: 'isRecommend', value: this.oIsRecommend});
                if(this.oCardType==1){
                    jsonArr.push({ key: 'isFilmJoin', value: this.oIsFilmJoin});
                    jsonArr.push({ key: 'startTimeVal', value: this.startArr.join(',')});
                    jsonArr.push({ key: 'endTimeVal', value: this.endArr.join(',')});
                    jsonArr.push({ key: 'isMerchandiseJoin', value: this.oIsMerchandiseJoin});
                    jsonArr.push({ key: 'isHolidayValid', value: this.oIsHolidayValid});
                    jsonArr.push({ key: 'validWeekDay', value: this.oValidWeekDay});
                    jsonArr.push({ key: 'validPayType', value: this.oValidPayType});
                    jsonArr.push({ key: 'isCouponTogether', value: this.oIsCouponTogether});
                    if(this.oIsFilmJoin==1){
                        jsonArr.push({ key: 'filmSimpleDesc', value: this.oFilmSimpleDesc});
                        jsonArr.push({ key: 'reduceTypeFilm', value: this.oReduceTypeFilm});
                        jsonArr.push({ key: 'discountMoneyFilm', value: this.oDiscountMoneyFilm});
                        jsonArr.push({ key: 'selectHallType', value: this.oSelectHallType});
                        jsonArr.push({ key: 'selectFilmFormatType', value: this.oSelectFilmFormatType});
                        jsonArr.push({ key: 'selectFilmType', value: this.oSelectFilmType});
                        jsonArr.push({ key: 'isLimitFilm', value: this.oIsLimitFilm});
                        if(this.oSelectHallType!=0){
                            jsonArr.push({ key: 'screenCode', value: this.oScreenCode});
                        }
                        if(this.oSelectFilmFormatType!=0){
                            jsonArr.push({ key: 'filmFormatCode', value: this.oFilmFormatCode});
                        }
                        if(this.oSelectFilmType!=0){
                            jsonArr.push({ key: 'filmCode', value: filmCodeList.join(',')});
                        }
                        if(this.oIsLimitFilm!=0){
                            jsonArr.push({ key: 'numberFilm', value: this.oNumberFilm});
                            jsonArr.push({ key: 'limitFilmUnit', value: this.oLimitFilmUnit});
                        }
                    }
                    if(this.oIsMerchandiseJoin==1){
                        jsonArr.push({ key: 'reduceTypeMerchandise', value: this.oReduceTypeMerchandise});
                        jsonArr.push({ key: 'merchandiseSimpleDesc', value: this.oMerchandiseSimpleDesc});
                        jsonArr.push({ key: 'discountMoneyMerchandise', value: this.oDiscountMoneyMerchandise});
                        jsonArr.push({ key: 'selectMerchandiseType', value: this.oSelectMerchandiseType});
                        jsonArr.push({ key: 'isLimitMerchandise', value: this.oIsLimitMerchandise});
                        if(this.oSelectMerchandiseType!=0){
                            jsonArr.push({ key: 'merchandiseCode', value: merchandiseCodeList.join(',')});
                        }
                        if(this.oReduceTypeMerchandise==2){
                            jsonArr.push({ key: 'achieveMoneyMerchandise', value: this.oAchieveMoneyMerchandise});
                        }
                        if(this.oIsLimitMerchandise!=0){
                            jsonArr.push({ key: 'numberMerchandise', value: this.oNumberMerchandise});
                            jsonArr.push({ key: 'limitMerchandiseUnit', value: this.oLimitMerchandiseUnit});
                        }
                    }

                }
                else if(this.oCardType==2){
                    jsonArr.push({ key: 'couponGroupId', value: this.couponId});
                    jsonArr.push({ key: 'couponSimpleDesc', value: this.oCouponSimpleDesc});
                }
                jsonArr.push({ key: 'id', value: this.form.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                this.editVisible = false;
                https.fetchPost('/benefitCard/updateBenefitById', params).then(data => {
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
                let reduceTypeFilm = this.query.reduceTypeFilm;
                let reduceTypeMerchandise = this.query.reduceTypeMerchandise;
                let cardType = this.query.cardType;
                if (!reduceTypeFilm) {
                    reduceTypeFilm = '';
                }
                if (!reduceTypeMerchandise) {
                    reduceTypeMerchandise = '';
                }
                if (!cardType) {
                    cardType = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'name', value: this.query.name });
                jsonArr.push({ key: 'status', value: this.query.status });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'reduceTypeFilm', value: reduceTypeFilm });
                jsonArr.push({ key: 'reduceTypeMerchandise', value: reduceTypeMerchandise });
                jsonArr.push({ key: 'cardType', value: cardType });
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
                        console.log(this.cinemaInfo);
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
                    let filmName=this.query.filmName;
                    if(!filmName){
                        filmName=''
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"filmName",value:filmName});
                    jsonArr.push({key:"pageNo",value:this.query.aPageNo});
                    jsonArr.push({key:"pageSize",value:this.query.aPageSize});
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
                    let merchandiseName=this.query.merName;
                    let cinemaCode='';
                    if(this.oForm.cinemaCode){
                         cinemaCode=this.oForm.cinemaCode
                    }
                    if(this.oCinemaCode){
                        cinemaCode=this.oCinemaCode
                    }
                    if(!merchandiseName){
                        merchandiseName=''
                    }
                    let jsonArr = [];
                    jsonArr.push({key:"cinemaCode",value:cinemaCode});
                    jsonArr.push({key:"merchandiseName",value:merchandiseName});
                    jsonArr.push({key:"merchandiseStatus",value:'1'});
                    jsonArr.push({key:"pageNo",value:this.query.oPageNo});
                    jsonArr.push({key:"pageSize",value:this.query.oPageSize});
                    let sign =md5(preSign(jsonArr));
                    jsonArr.push({key:"sign",value:sign});
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/merchandise/list',params).then((data) => {
                        loading.close();
                        console.log(data);
                        if(data.data.code=='success') {
                            this.oDrawer=true;
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
                            this.oSellTableData = oData.data;
                            this.query.oPageSize = oData.pageSize;
                            this.query.oPageNo = oData.pageNo;
                            this.query.oTotalCount = oData.totalCount;
                            this.query.oTotalPage = oData.totalPage
                        }else if(data.data.code=='nologin'){
                            this.message=data.data.message;
                            this.open();
                            this.$router.push('/login');
                        }else{
                            this.message=data.data.message;
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
</style>

