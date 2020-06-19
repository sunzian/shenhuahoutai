<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 秒杀活动管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                        clearable
                        v-model="query.cinemaCode"
                        placeholder="影院"
                        class="handle-select mr10"
                >
                    <el-option
                            v-for="item in cinemaInfo"
                            :key="item.cinemaCode"
                            :label="item.cinemaName"
                            :value="item.cinemaCode"
                    ></el-option>
                </el-select>
                <el-input v-model="query.activityName" placeholder="活动名称" class="handle-input mr10"></el-input>
                <el-select
                        clearable
                        v-model="query.status"
                        placeholder="活动状态"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="未开启" value="1"></el-option>
                    <el-option key="2" label="开启" value="2"></el-option>
                    <el-option key="3" label="秒杀过期" value="3"></el-option>
                </el-select>
                <el-date-picker
                        v-model="query.startDate"
                        type="datetime"
                        class="mr10"
                        style="margin-bottom: 10px"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        default-time="06:00:00"
                        placeholder="活动开始时间"
                ></el-date-picker>
                <el-date-picker
                        v-model="query.endDate"
                        type="datetime"
                        class="mr10"
                        style="margin-bottom: 10px"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="活动结束时间"
                ></el-date-picker>
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
                        style="float: right;margin-top: 10px"
                >新增活动
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
                <el-table-column prop="sort" label="通用类型" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.commonType == 1">全部影院</el-tag>
                        <el-tag v-else-if="scope.row.commonType == 2">部分影院</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="80">
                    <template slot-scope="scope">{{scope.row.sortNo}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="影院名称" width="260">
                    <template slot-scope="scope">{{scope.row.cinemaNames}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="商品名称" width="150">
                    <template slot-scope="scope">{{scope.row.commodityName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="秒杀商品图片" width="90">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width:400px" :src="scope.row.activityImage"/>
                            <img
                                    slot="reference"
                                    :src="scope.row.activityImage"
                                    :alt="scope.row.activityImage"
                                    style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="活动名称" width="150">
                    <template slot-scope="scope">{{scope.row.activityName}}</template>
                </el-table-column>
                <el-table-column label="开始日期" width="180">
                    <template slot-scope="scope">{{scope.row.startDate}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="结束日期" width="180">
                    <template slot-scope="scope">{{scope.row.endDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="限制用户限购" width="160">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.purchaseType == 1">不限购</el-tag>
                        <el-tag
                                v-else-if="scope.row.purchaseType == 2"
                        >{{scope.row.purchaseCount}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="活动状态" width="90" fixed="right">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1">未开启</el-tag>
                        <el-tag v-else-if="scope.row.status == 2">开启</el-tag>
                        <el-tag v-else-if="scope.row.status == 3">秒杀过期</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="success"
                                v-if="scope.row.status == 1"
                                @click="changeStatus(scope.$index, scope.row)"
                        >启用
                        </el-button>
                        <el-button
                                type="success"
                                v-if="scope.row.status == 2"
                                @click="changeStatus(scope.$index, scope.row)"
                        >停用
                        </el-button>
                        <el-button
                                type="success"
                                style="margin-top: 5px;"
                                @click="copyActivity(scope.$index, scope.row)"
                        >复制活动
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" align="center" fixed="right">
                    <template slot-scope="scope">
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
        <el-dialog :close-on-click-modal="false" title="新增" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="通用方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.commonType" @change="selectCinema">
                        <el-radio :label="1">全部影院</el-radio>
                        <el-radio :label="2">指定影院</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="选择影院"
                        :label-width="formLabelWidth"
                        v-if="oForm.commonType == 2"
                >
                    <el-checkbox-group v-model="oMerchandiseCode" @change="selectGoods">
                        <el-checkbox
                                v-for="item in goodsInfo"
                                :label="item.merchandiseCode"
                                :key="item.merchandiseCode"
                                :value="item.merchandiseName"
                        >{{item.merchandiseName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="活动名称" :label-width="formLabelWidth">
                    <el-input
                            maxlength="50"
                            style="width: 250px"
                            v-model="oForm.activityName"
                            autocomplete="off"
                            placeholder="限50个汉字"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="活动时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oForm.startDate"
                            type="datetime"
                            placeholder="开始时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                    至
                    <el-date-picker
                            v-model="oForm.endDate"
                            type="datetime"
                            placeholder="结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <!-- <el-form-item :required="true" label="是否立即显示" :label-width="formLabelWidth">
                    <el-select v-model="oForm.showStatus" placeholder="请选择兑换方式">
                        <el-option
                                v-for="item in showStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item> -->
                <!--<el-form-item :required="true" label="适用场次时间 " :label-width="formLabelWidth">-->
                    <!--<el-time-picker-->
                            <!--is-range-->
                            <!--type="date"-->
                            <!--format="HH:mm:ss"-->
                            <!--value-format="HH:mm:ss"-->
                            <!--v-model="value1"-->
                            <!--range-separator="至"-->
                            <!--start-placeholder="开始时间"-->
                            <!--end-placeholder="结束时间"-->
                            <!--placeholder="选择时间范围">-->
                    <!--</el-time-picker>-->
                    <!--<span style="cursor: pointer;color: blue" @click="addTime">添加</span>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="所选时间段" :label-width="formLabelWidth" v-if="dateInfo.length>0">-->
                    <!--<div v-for="(item, index) in dateInfo" :key="index">-->
                        <!--{{item}}-->
                        <!--<span-->
                                <!--style="color:red;cursor: pointer;"-->
                                <!--@click="deletTime(index)"-->
                        <!--&gt;删除</span>-->
                    <!--</div>-->
                <!--</el-form-item>-->
                <el-form-item :required="true" label="是否限制用户限购" :label-width="formLabelWidth">
                    <el-select v-model="oForm.purchaseType" placeholder="请选择">
                        <el-option
                                v-for="item in canUse1"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="限购数量"
                        v-if="oForm.purchaseType==2"
                        :label-width="formLabelWidth"
                >
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')" placeholder="请输入正确的的数字" style="width: 150px" v-model="oForm.purchaseCount " autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="兑换方式" :label-width="formLabelWidth">
                    <el-select v-model="oForm.changeType" placeholder="请选择兑换方式" @change="changeSkuPrice">
                        <el-option
                                v-for="item in showType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :required="true"
                        v-if="oForm.changeType==1||oForm.changeType==3"
                        label="所需金币数量"
                        :label-width="formLabelWidth"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            style="width: 250px"
                            v-model.trim="oForm.gold"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        :required="true"
                        v-if="oForm.changeType==2||oForm.changeType==3"
                        label="所需RMB"
                        :label-width="formLabelWidth"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                            style="width: 250px"
                            v-model.trim="oForm.money"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <!-- <el-form-item :required="true" label="是否可发送短信提醒用户" :label-width="formLabelWidth">
                    <el-select v-model="oForm.smsStatus" placeholder="请选择">
                        <el-option
                                v-for="item in canUse2"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item
                        :required="true"
                        label="选择商品"
                        :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选商品"
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input style="width: 150px" v-model="commodityName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                            v-if="commodityName"
                            style="color:red;cursor: pointer;"
                            @click="deletCoupon"
                    >删除</span>
                </el-form-item>
                <el-form-item v-if="skuStatus==1" :required="true" label="商品规格属性" :label-width="formLabelWidth">
                    <el-table
                            :data="changeSkuList"
                            border
                            class="table"
                            ref="multipleTable"
                            highlight-current-row
                            header-cell-class-name="table-header"
                            @selection-change="handleSelectionChange"
                    >
                        <el-table-column prop="memo" label="规格" width="90">
                            <template slot-scope="scope">{{scope.row.specifications}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="属性" width="90">
                            <template slot-scope="scope">{{scope.row.attribute}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="图片" width="90">
                            <template slot-scope="scope">
                                <el-popover placement="right" title trigger="hover">
                                    <img style="width: 400px" :src="scope.row.image" />
                                    <img
                                            slot="reference"
                                            :src="scope.row.image"
                                            :alt="scope.row.image"
                                            style="max-height: 50px;max-width: 130px"
                                    />
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sort" label="是否参与" width="110">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status=='1'">参与</el-tag>
                                <el-tag v-else-if="scope.row.status=='2'">不参与</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sort" label="库存" width="90">
                            <template slot-scope="scope">{{scope.row.store}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="所需金币数量" width="130">
                            <template slot-scope="scope">{{scope.row.activityGold}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="所需RMB" width="110">
                            <template slot-scope="scope">{{scope.row.activityMoney}}</template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-edit" @click="changeSku(scope.$index, scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item :required="true" label="秒杀商品数量" :label-width="formLabelWidth">
                    <el-input
                            show-word-limit
                            style="width: 150px"
                            v-model="oForm.commodityStore"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            placeholder="请输入大于0的数字"
                            :disabled="skuStatus == 1"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="排序" :label-width="formLabelWidth">
                    <el-input
                            style="width: 150px"
                            v-model="oForm.sortNo"
                            maxlength="9"
                    ></el-input>
                    <span style="color:red">请输入大于等于0的数字，数值越大越靠前</span>
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
                <el-form-item label="秒杀商品图片" :label-width="formLabelWidth">
                    <span>可空，若不上传则默认显示商品图片</span>
                    <el-upload
                            class="upload-demo"
                            action="/api/upload/uploadImage"
                            :before-upload="beforeUpload"
                            :data="type"
                            :limit="1"
                            :on-exceed="exceed"
                            ref="download"
                            :on-success="onSuccess"
                            :file-list="fileList"
                            list-type="picture"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div
                                slot="tip"
                                class="el-upload__tip"
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸200*200或按比例上传
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="活动介绍" :label-width="formLabelWidth">
                    <el-input
                            maxlength="20"
                            style="width: 300px"
                            v-model="oForm.description"
                            placeholder="限20字，秒杀列表中展示"
                    ></el-input>
                </el-form-item>
                <el-form-item label="秒杀详情" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="200"
                            style="width: 300px"
                            v-model="oForm.activityNotice"
                    ></el-input>
                </el-form-item>
                <el-form-item label="兑换须知" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="200"
                            style="width: 300px"
                            v-model="oForm.notice"
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
                <el-form-item :required="true" label="通用方式" :label-width="formLabelWidth">
                    <el-radio-group v-model="oCommonType" @change="selectCinema">
                        <el-radio :label="1">全部影院</el-radio>
                        <el-radio :label="2">指定影院</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="选择影院"
                        :label-width="formLabelWidth"
                        v-if="oCommonType == 2"
                >
                    <el-checkbox-group v-model="oMerchandiseCode" @change="selectGoods">
                        <el-checkbox
                                v-for="item in goodsInfo"
                                :label="item.merchandiseCode"
                                :key="item.merchandiseCode"
                                :value="item.merchandiseName"
                        >{{item.merchandiseName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="活动名称" :label-width="formLabelWidth">
                    <el-input
                            maxlength="50"
                            style="width: 250px"
                            v-model="oActivityName"
                            autocomplete="off"
                            placeholder="限50个汉字"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="活动时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oStartDate"
                            type="datetime"
                            placeholder="开始时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                    至
                    <el-date-picker
                            v-model="oEndDate"
                            type="datetime"
                            placeholder="结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <!-- <el-form-item :required="true" label="是否立即显示" :label-width="formLabelWidth">
                    <el-select v-model="oShowStatus" placeholder="请选择兑换方式">
                        <el-option
                                v-for="item in showStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item> -->
                <!--<el-form-item :required="true" label="适用场次时间" :label-width="formLabelWidth">-->
                    <!--<el-time-picker-->
                            <!--is-range-->
                            <!--type="date"-->
                            <!--format="HH:mm:ss"-->
                            <!--value-format="HH:mm:ss"-->
                            <!--v-model="value1"-->
                            <!--range-separator="至"-->
                            <!--start-placeholder="开始时间"-->
                            <!--end-placeholder="结束时间"-->
                            <!--placeholder="选择时间范围">-->
                    <!--</el-time-picker>-->
                    <!--<span style="cursor: pointer;color: blue" @click="addTime">添加</span>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="所选时间段" :label-width="formLabelWidth" v-if="dateInfo.length>0">-->
                    <!--<div v-for="(item, index) in dateInfo" :key="index">-->
                        <!--{{item}}-->
                        <!--<span-->
                                <!--style="color:red;cursor: pointer;"-->
                                <!--@click="deletTime(index)"-->
                        <!--&gt;删除</span>-->
                    <!--</div>-->
                <!--</el-form-item>-->
                <el-form-item :required="true" label="是否限制用户限购" :label-width="formLabelWidth">
                    <el-select v-model="oPurchaseType" placeholder="请选择">
                        <el-option
                                v-for="item in canUse1"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="限购数量"
                        v-if="oPurchaseType==2"
                        :label-width="formLabelWidth"
                >
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')" placeholder="请输入正确的的数字" style="width: 150px" v-model="oPurchaseCount " autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="兑换方式" :label-width="formLabelWidth">
                    <el-select v-model="oChangeType" placeholder="请选择兑换方式" @change="changeSkuPrice2">
                        <el-option
                                v-for="item in showType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :required="true"
                        v-if="oChangeType==1||oChangeType==3"
                        label="所需金币数量"
                        :label-width="formLabelWidth"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            style="width: 250px"
                            v-model.trim="oGold"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        :required="true"
                        v-if="oChangeType==2||oChangeType==3"
                        label="所需RMB"
                        :label-width="formLabelWidth"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                            style="width: 250px"
                            v-model.trim="oMoney"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <!-- <el-form-item :required="true" label="是否可发送短信提醒用户" :label-width="formLabelWidth">
                    <el-select v-model="oSmsStatus" placeholder="请选择">
                        <el-option
                                v-for="item in canUse2"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item
                        :required="true"
                        label="选择商品"
                        :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="openNext1">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        label="所选商品"
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input style="width: 150px" v-model="commodityName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                            v-if="commodityName"
                            style="color:red;cursor: pointer;"
                            @click="deletCoupon"
                    >删除</span>
                </el-form-item>
                <el-form-item v-if="skuStatus==1" :required="true" label="商品规格属性" :label-width="formLabelWidth">
                    <el-table
                            :data="changeSkuList"
                            border
                            class="table"
                            ref="multipleTable"
                            highlight-current-row
                            header-cell-class-name="table-header"
                            @selection-change="handleSelectionChange"
                    >
                        <el-table-column prop="memo" label="规格" width="90">
                            <template slot-scope="scope">{{scope.row.specifications}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="属性" width="90">
                            <template slot-scope="scope">{{scope.row.attribute}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="图片" width="90">
                            <template slot-scope="scope">
                                <el-popover placement="right" title trigger="hover">
                                    <img style="width: 400px" :src="scope.row.image" />
                                    <img
                                            slot="reference"
                                            :src="scope.row.image"
                                            :alt="scope.row.image"
                                            style="max-height: 50px;max-width: 130px"
                                    />
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sort" label="是否参与" width="110">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status=='1'">参与</el-tag>
                                <el-tag v-else-if="scope.row.status=='2'">不参与</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sort" label="库存" width="90">
                            <template slot-scope="scope">{{scope.row.store}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="所需金币数量" width="130">
                            <template slot-scope="scope">{{scope.row.activityGold}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="所需RMB" width="110">
                            <template slot-scope="scope">{{scope.row.activityMoney}}</template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-edit" @click="changeChangeSku(scope.$index, scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item :required="true" label="秒杀商品数量" :label-width="formLabelWidth">
                    <el-input
                            show-word-limit
                            style="width: 150px"
                            v-model="oCommodityStore"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            placeholder="请输入大于0的数字"
                            :disabled="skuStatus == 1"
                    ></el-input>
                </el-form-item>
                <el-form-item label="已售数量" :label-width="formLabelWidth">
                    <el-input
                            show-word-limit
                            :disabled="true"
                            style="width: 150px"
                            v-model="oHasSoldNumber"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="排序" :label-width="formLabelWidth">
                    <el-input
                            style="width: 150px"
                            v-model="oSortNo"
                            maxlength="9"
                    ></el-input>
                    <span style="color:red">请输入大于等于0的数字，数值越大越靠前</span>
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
                <el-form-item label="秒杀商品图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img :src="oActivityImg"/>
                        <img
                                slot="reference"
                                :src="oActivityImg"
                                :alt="oActivityImg"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <span
                            v-if="oActivityImg"
                            style="color:red;cursor: pointer;margin-left:20px;"
                            @click="deletImg"
                    >删除</span>
                    <span>可空，若不上传则默认显示商品图片</span>
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            drag
                            action="/api/upload/uploadImage"
                            ref="download"
                            :limit="1"
                            :on-exceed="exceed"
                            :on-success="unSuccess"
                            multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            <em>点击上传</em>
                        </div>
                        <div
                                class="el-upload__tip"
                                slot="tip"
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸200*200或按比例上传
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="活动介绍" :label-width="formLabelWidth">
                    <el-input
                            maxlength="20"
                            style="width: 300px"
                            v-model="oDescription"
                            placeholder="限20字，秒杀列表中展示"
                    ></el-input>
                </el-form-item>
                <el-form-item label="秒杀详情" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="200"
                            style="width: 300px"
                            v-model="oActivityNotice"
                    ></el-input>
                </el-form-item>
                <el-form-item label="兑换须知" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="200"
                            style="width: 300px"
                            v-model="oNotice"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增抽屉弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择商品" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input
                            v-model="query.name"
                            placeholder="商品名称"
                            class="handle-input mr12"
                    ></el-input>
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
                            <el-radio
                                    v-model="id"
                                    :label="scope.$index"
                                    @change.native="getCurrentRow(scope.$index,scope.row)"
                            >&nbsp;
                            </el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="图片">
                        <template slot-scope="scope">
                            <el-popover placement="right" title trigger="hover">
                                <img style="width:400px" :src="scope.row.imageUrl"/>
                                <img
                                        slot="reference"
                                        :src="scope.row.imageUrl"
                                        :alt="scope.row.imageUrl"
                                        style="max-height: 50px;max-width: 130px"
                                />
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="商品名称">
                        <template slot-scope="scope">{{scope.row.name}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="上架状态" width="90">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status == 1">上架</el-tag>
                            <el-tag v-else-if="scope.row.status == 2">未上架</el-tag>
                        </template>
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
        <!--新增sku弹出框修改-->
        <el-dialog :close-on-click-modal="false" title="新增" :visible.sync="dialogoSkuFormVisible">
            <el-form :model="skuChangeForm">
                <el-form-item :required="true" label="规格" :label-width="formLabelWidth">
                    <span>{{skuChangeForm.specifications}}</span>
                </el-form-item>
                <el-form-item label="属性" :label-width="formLabelWidth">
                    <span>{{skuChangeForm.attribute}}</span>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="skuChangeForm.image"/>
                        <img
                                slot="reference"
                                :src="skuChangeForm.image"
                                :alt="skuChangeForm.image"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                </el-form-item>
                <el-form-item :required="true" label="是否参与秒杀" :label-width="formLabelWidth">
                    <el-select v-model="skuChangeForm.status" @change="changeSkuStatus" placeholder="请选择">
                        <el-option
                                v-for="item in skuJoin"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="skuChangeForm.status == 1">
                    <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                        <el-input placeholder="请输入大于0的数字" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')" style="width: 250px" min="1" v-model="skuChangeForm.store" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item v-if="oForm.changeType==1||oForm.changeType==3" :required="true" label="所需金币数量" :label-width="formLabelWidth">
                        <el-input  style="width: 250px" min="1" v-model="skuChangeForm.gold" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item v-if="oForm.changeType==2||oForm.changeType==3" :required="true" label="所需RMB" :label-width="formLabelWidth">
                        <el-input  style="width: 250px" min="1" v-model="skuChangeForm.money" autocomplete="off"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogskuChangeFormVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="sureChangeUseSku">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑sku弹出框修改-->
        <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="dialogoSkuChangeFormVisible">
            <el-form :model="oSkuChangeForm">
                <el-form-item :required="true" label="规格" :label-width="formLabelWidth">
                    <span>{{oSkuChangeForm.specifications}}</span>
                </el-form-item>
                <el-form-item label="属性" :label-width="formLabelWidth">
                    <span>{{oSkuChangeForm.attribute}}</span>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oSkuChangeForm.image"/>
                        <img
                                slot="reference"
                                :src="oSkuChangeForm.image"
                                :alt="oSkuChangeForm.image"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                </el-form-item>
                <el-form-item :required="true" label="是否参与秒杀" :label-width="formLabelWidth">
                    <el-select v-model="oSkuChangeForm.status" @change="changeSkuStatus" placeholder="请选择">
                        <el-option
                                v-for="item in skuJoin"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="oSkuChangeForm.status == 1">
                    <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                        <el-input placeholder="请输入大于0的数字" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')" style="width: 250px" min="1" v-model="oSkuChangeForm.store" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item v-if="oChangeType==1||oChangeType==3" :required="true" label="所需金币数量" :label-width="formLabelWidth">
                        <el-input placeholder="请输入正确的数字" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')" style="width: 250px" min="1" v-model="oSkuChangeForm.activityGold" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item v-if="oChangeType==2||oChangeType==3" :required="true" label="所需RMB" :label-width="formLabelWidth">
                        <el-input placeholder="请输入正确的数字" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')" style="width: 250px" min="1" v-model="oSkuChangeForm.activityMoney" autocomplete="off"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogoSkuChangeFormVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="sureChangeChanger">确 定</el-button>
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
                dialogoSkuFormVisible: false,
                dialogoSkuChangeFormVisible: false,
                changeSkuList: [],
                skuChangeForm: [],
                oSkuChangeForm: [],
                skuStatus: '',
                oCommonType: '',
                num: 0,
                oActivityName: '',
                oStartDate: '',
                oEndDate: '',
                oPurchaseType: '',
                oPurchaseCount: '',
                oSmsStatus: '',
                oChangeType: '',
                oGold: '',
                oMoney: '',
                oCommodityStore: '',
                oHasSoldNumber: '',
                oStatus: '',
                oDescription: '',
                oActivityNotice: '',
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
                oCinemaCode: [],
                oMerchandiseCode: [],
                selectGoodsCode: {},
                goodsInfo: [],
                oSelectMerchandiseType: '',
                oActivityDesc: '',
                selectedSell: [],
                oCheckedDays: [],
                sellIndex: '',
                sellTableData: [],
                drawer: false, //新增抽屉弹出框
                value1: '',
                oCinemaName: '',
                oShowStatus: '',
                oScreenName: '',
                oFilmFormatName: '',
                selectFilmFormatType: '',
                selectFilmType: '',
                oFilmName: '',
                oName: '',
                oSortNo: '',
                oCreateDate: '',
                oValidPayType: '',
                oReduceType: '',
                oDiscountMoney: '',
                oAchieveMoney: '',
                oCouponDesc: '',
                oIsHolidayValid: '',
                oValidWeekDay: '',
                oIsCouponTogether: '',
                oId: '',
                oIsLimitTotal: '',
                oTotalNumber: '',
                oTotalSurplus: '',
                oIsLimitSingle: '', ////
                oSingleNumber: '',
                oActivityImg: '',
                oNotice: '',
                fileList: [],
                type: {
                    type: ''
                },
                formatList: [], //电影制式列表
                message: '', //弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 15,
                    aPageNo: 1,
                    aPageSize: 15,
                    merchandiseName: '',
                    name: ''
                },
                restaurants: [],
                merSelect: [],
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
                        value: '1',
                        label: '未开启'
                    },
                    {
                        value: '2',
                        label: '开启'
                    }
                    // {
                    //     value: '3',
                    //     label: '过期'
                    // }
                ],
                skuJoin: [
                    {
                        value: '1',
                        label: '参与'
                    },
                    {
                        value: '2',
                        label: '不参与'
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
                canUse1: [
                    {
                        value: '1',
                        label: '不限制'
                    },
                    {
                        value: '2',
                        label: '限制'
                    }
                ],
                canUse2: [
                    {
                        value: '0',
                        label: '不发送'
                    },
                    {
                        value: '1',
                        label: '发送'
                    }
                ],
                showStatus:[
                    {
                        value: '2',
                        label: '显示'
                    },
                    {
                        value: '1',
                        label: '不显示'
                    }
                ],
                showType: [
                    {
                        value: '1',
                        label: '纯金币兑换'
                    },
                    {
                        value: '2',
                        label: '纯RMB兑换'
                    },
                    {
                        value: '3',
                        label: '金币 + RMB 兑换'
                    }
                ],
                oForm: {
                    commonType: '',
                    purchaseType: '',
                    purchaseCount: '',
                    changeType: '',
                    commodityStore: '',
                    gold: '',
                    money: '',
                    name: '',
                    sortNo: '0',
                    cinemaName: '',
                    showStatus: '2',
                    cinemaCode: [],
                    screenName: '',
                    screenCode: [],
                    formatCode: [],
                    type: [],
                    selectFilmType: '0', //选择影片
                    code: [], //选择影院
                    filmCode: '',
                    filmName: '',
                    activityImage: '',
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
                    status: '',
                    oNum: '',
                    oneNum: '',
                    description: '',
                    activityNotice: '',
                    notice: ''
                },
                formLabelWidth: '150px',
                selectScreenCode: {},
                selectFormatCode: {},
                selectFilm: {},
                cinemaInfo: [],
                screenInfo: [],
                filmInfo: [], //所选影片
                dateInfo: [], //所选时间段
                startArr: [],
                endArr: [],
                value: '',
                canTimeList: [], //可用时间段列表
                rowMess: '',
                commodityId: '',
                commodityName: '',
                commodityList: []
            };
        },
        created() {
        },
        mounted() {
            this.getMenu();
        },
        methods: {
            deletCoupon() {
                this.commodityName = '';
                this.commodityId = '';
                this.skuStatus = '';
                this.changeSkuList = [];
            },
            selectGoods(val) {
                // console.log(val)
                this.deletCoupon();
                let selectValue = val.join(',');
                this.selectGoodsCode = selectValue;
                // console.log(this.selectGoodsCode);
            },
            selectCinema() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    this.deletCoupon();
                    let jsonArr = [];
                    jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                    jsonArr.push({ key: 'pageSize', value: 200 });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/cinema/myCinemaPage', params).then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            let goods = JSON.parse(Decrypt(data.data.data)).data;
                            this.goodsInfo = [];
                            for (let i = 0; i < goods.length; i++) {
                                let goodsList = {};
                                goodsList.merchandiseCode = goods[i].cinemaCode;
                                goodsList.merchandiseName = goods[i].cinemaName;
                                this.goodsInfo.push(goodsList);
                            }
                            console.log(this.goodsInfo);
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
            selectCinema1() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let jsonArr = [];
                    jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                    jsonArr.push({ key: 'pageSize', value: 200 });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https.fetchPost('/cinema/myCinemaPage', params).then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            let goods = JSON.parse(Decrypt(data.data.data)).data;
                            this.goodsInfo = [];
                            for (let i = 0; i < goods.length; i++) {
                                let goodsList = {};
                                goodsList.merchandiseCode = goods[i].cinemaCode;
                                goodsList.merchandiseName = goods[i].cinemaName;
                                this.goodsInfo.push(goodsList);
                            }
                            console.log(this.goodsInfo);
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
            clearSelectedSell() {
                this.selectedSell = [];
            },
            deleteSell(index) {
                this.selectedSell.splice(index, 1);
            },
            getCurrentRow(index, row) {
                this.sellIndex = index;
                this.commodityList = row;
                console.log(index);
                console.log(row);
            },
            addTime() {
                // 筛选重复时间段
                if (this.value1) {
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
                    this.startArr.push(this.value1[0]);
                    this.endArr.push(this.value1[1]);
                } else {
                    this.message = '请选择适用场次时间！';
                    this.open();
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
                https
                    .fetchPost('/secondKillActivity/addPage', '')
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.commodityName = '';
                            this.commodityId = '';
                            this.oForm.showStatus = '2';
                            this.dateInfo = [];
                            this.changeSkuList = [];
                            this.skuStatus = '';
                            this.startArr = [];
                            this.endArr = [];
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
                if (this.changeSkuList.length > 0) {
                    let count = 0;
                    for (let i = 0; i < this.changeSkuList.length; i ++) {
                        if (!this.changeSkuList[i].status || this.changeSkuList[i].status == '') {
                            this.message = '请填写商品规格属性!';
                            this.open();
                            return
                        }
                        if (this.changeSkuList[i].status == 1) {
                            count += 1;
                        }
                    }
                    if (count == 0) {
                        this.message = '至少选择一项规格属性参与!';
                        this.open();
                        return
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
                if (this.skuStatus == 1) {
                    for (let i = 0; i < this.changeSkuList.length; i ++) {
                        delete this.changeSkuList[i].image;
                        delete this.changeSkuList[i].attribute;
                        delete this.changeSkuList[i].specifications;
                        delete this.changeSkuList[i].alreadyChangedNumber;
                        delete this.changeSkuList[i].remainNumber;
                        if (!this.changeSkuList[i].store || this.changeSkuList[i].store == '') {
                            this.changeSkuList[i].store = 0;
                        }
                        if (!this.changeSkuList[i].activityGold || this.changeSkuList[i].stoactivityGoldre == '') {
                            this.changeSkuList[i].activityGold = 0;
                        }
                        if (!this.changeSkuList[i].activityMoney || this.changeSkuList[i].activityMoney == '') {
                            this.changeSkuList[i].activityMoney = 0;
                        }
                    }
                    jsonArr.push({key: 'skuListJson', value:JSON.stringify(this.changeSkuList)});
                }
                jsonArr.push({ key: 'activityName', value: this.oForm.activityName });
                jsonArr.push({ key: 'commonType', value: this.oForm.commonType });
                jsonArr.push({ key: 'cinemaCodes', value: this.selectGoodsCode });
                jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
                jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
                jsonArr.push({ key: 'showStatus', value: this.oForm.showStatus });
                jsonArr.push({ key: 'activityImage', value: this.oForm.activityImage });
                jsonArr.push({ key: 'sortNo', value: this.oForm.sortNo.toString() });
                // jsonArr.push({ key: 'startTimePoints', value: this.startArr.join(',') });
                // jsonArr.push({ key: 'endTimePoints', value: this.endArr.join(',') });
                jsonArr.push({ key: 'purchaseType', value: this.oForm.purchaseType });
                jsonArr.push({ key: 'purchaseCount', value: this.oForm.purchaseCount });
                jsonArr.push({ key: 'smsStatus', value: 0 });
                jsonArr.push({ key: 'description', value: this.oForm.description });
                jsonArr.push({ key: 'activityNotice', value: this.oForm.activityNotice });
                jsonArr.push({ key: 'notice', value: this.oForm.notice });
                jsonArr.push({ key: 'commodityId', value: this.commodityId });
                jsonArr.push({ key: 'changeType', value: this.oForm.changeType });
                jsonArr.push({ key: 'gold', value: this.oForm.gold });
                jsonArr.push({ key: 'money', value: this.oForm.money });
                jsonArr.push({ key: 'commodityStore', value: this.oForm.commodityStore });
                jsonArr.push({ key: 'hasSoldNumber', value: this.oForm.hasSoldNumber });
                jsonArr.push({ key: 'status', value: this.oForm.status });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/secondKillActivity/add', params)
                        .then(data => {
                            //新增
                            loading.close();
                            if (data.data.code == 'success') {
                                this.dialogFormVisible = false;
                                this.$message.success(`新增成功`);
                                if (this.oForm.activityImage != '') {
                                    this.$refs.download.clearFiles();
                                };
                                this.changeSkuList = [];
                                this.oForm.activityName = '';
                                this.oForm.activityImage = '';
                                this.oForm.commonType = '';
                                this.selectGoodsCode = {};
                                this.oForm.startDate = '';
                                this.oForm.endDate = '';
                                this.oForm.sortNo = '0';
                                this.dateInfo = [];
                                this.startArr = [];
                                this.endArr = [];
                                this.goodsInfo = [];
                                this.oMerchandiseCode = [];
                                this.oForm.purchaseType = '';
                                this.oForm.purchaseCount = '';
                                this.oForm.smsStatus = '';
                                this.oForm.description = '';
                                this.commodityId = '';
                                this.commodityName = '';
                                this.value1 = '';
                                this.oForm.changeType = '';
                                this.oForm.gold = '';
                                this.oForm.money = '';
                                this.oForm.commodityStore = '';
                                this.oForm.hasSoldNumber = '';
                                this.oForm.status = '';
                                this.oForm.showStatus = '2';
                                this.oForm.activityNotice = '';
                                this.oForm.notice = '';
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
                this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
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
                            .fetchPost('/secondKillActivity/deleteById', params)
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
                this.selectCinema1();
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
                    .fetchPost('/secondKillActivity/updatePage', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            this.oCommonType = JSON.parse(Decrypt(data.data.data)).commonType;
                            this.oMerchandiseCode = [];
                            if (this.oCommonType == 2) {
                                if (JSON.parse(Decrypt(data.data.data)).cinemaCodes) {
                                    this.oMerchandiseCode = JSON.parse(Decrypt(data.data.data)).cinemaCodes.split(',');
                                }
                                this.selectGoodsCode = JSON.parse(Decrypt(data.data.data)).cinemaCodes.split(',');
                            }
                            this.oActivityName = JSON.parse(Decrypt(data.data.data)).activityName;
                            this.oActivityImg = JSON.parse(Decrypt(data.data.data)).activityImage;
                            this.oStartDate = JSON.parse(Decrypt(data.data.data)).startDate;
                            this.oSortNo = JSON.parse(Decrypt(data.data.data)).sortNo;
                            this.oEndDate = JSON.parse(Decrypt(data.data.data)).endDate;
                            for (let x in this.canUse1) {
                                if (this.canUse1[x].value == JSON.parse(Decrypt(data.data.data)).purchaseType) {
                                    this.oPurchaseType = this.canUse1[x].value;
                                    break;
                                }
                            }
                            this.oPurchaseCount = JSON.parse(Decrypt(data.data.data)).purchaseCount;
                            for (let x in this.canUse2) {
                                if (this.canUse2[x].value == JSON.parse(Decrypt(data.data.data)).smsStatus) {
                                    this.oSmsStatus = this.canUse2[x].value;
                                    break;
                                }
                            }
                            this.commodityId = JSON.parse(Decrypt(data.data.data)).commodityId;
                            let skuInfoList = JSON.parse(Decrypt(data.data.data)).skuInfoList;
                            let jsonArr2 = [];
                            jsonArr2.push({ key: 'id', value: this.commodityId });
                            let sign = md5(preSign(jsonArr2));
                            jsonArr2.push({ key: 'sign', value: sign });
                            var params2 = ParamsAppend(jsonArr2);
                            https
                                .fetchPost('/goldCommodity/getSKUInfo', params2)
                                .then(data => {
                                    loading.close();
                                    if (data.data.code == 'success') {
                                        var oData = JSON.parse(Decrypt(data.data.data));
                                        console.log(oData)
                                        this.skuStatus = oData.skuStatus;
                                        if (this.skuStatus == 1) {
                                            if (skuInfoList.length > 0) {
                                                this.changeSkuList = skuInfoList;
                                            } else {
                                                this.changeSkuList = oData.skuList
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
                            this.commodityName = JSON.parse(Decrypt(data.data.data)).commodityName;
                            for (let x in this.showType) {
                                if (this.showType[x].value == JSON.parse(Decrypt(data.data.data)).changeType) {
                                    this.oChangeType = this.showType[x].value;
                                    break;
                                }
                            }
                            this.oGold = JSON.parse(Decrypt(data.data.data)).gold;
                            this.oMoney = JSON.parse(Decrypt(data.data.data)).money;
                            this.oCommodityStore = JSON.parse(Decrypt(data.data.data)).commodityStore;
                            this.oHasSoldNumber = JSON.parse(Decrypt(data.data.data)).hasSoldNumber;
                            for (let x in this.options) {
                                if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).status) {
                                    this.oStatus = this.options[x].value;
                                    break;
                                }
                            }
                            this.oDescription = JSON.parse(Decrypt(data.data.data)).description;
                            this.oActivityNotice = JSON.parse(Decrypt(data.data.data)).activityNotice;
                            this.oNotice = JSON.parse(Decrypt(data.data.data)).notice;
                            for (let x in this.showStatus) {
                                if (this.showStatus[x].value == JSON.parse(Decrypt(data.data.data)).showStatus) {
                                    this.oShowStatus = this.showStatus[x].value;
                                    break;
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
            },
            // 编辑操作
            exChanger() {
                console.log(this.changeSkuList);
                if (this.changeSkuList.length > 0) {
                    let count = 0;
                    for (let i = 0; i < this.changeSkuList.length; i ++) {
                        if (!this.changeSkuList[i].status || this.changeSkuList[i].status == '') {
                            this.message = '请填写商品规格属性!';
                            this.open();
                            return
                        }
                        if (this.changeSkuList[i].status == 1) {
                            count += 1;
                        }
                    }
                    if (count == 0) {
                        this.message = '至少选择一项规格属性参与!';
                        this.open();
                        return
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
                if (this.skuStatus == 1) {
                    for (let i = 0; i < this.changeSkuList.length; i ++) {
                        delete this.changeSkuList[i].image;
                        delete this.changeSkuList[i].attribute;
                        delete this.changeSkuList[i].specifications;
                        delete this.changeSkuList[i].activityId;
                        delete this.changeSkuList[i].alreadyChangedNumber;
                        delete this.changeSkuList[i].remainNumber;
                        if (!this.changeSkuList[i].store || this.changeSkuList[i].store == '') {
                            this.changeSkuList[i].store = 0;
                        }
                        if (!this.changeSkuList[i].activityGold || this.changeSkuList[i].stoactivityGoldre == '') {
                            this.changeSkuList[i].activityGold = 0;
                        }
                        if (!this.changeSkuList[i].activityMoney || this.changeSkuList[i].activityMoney == '') {
                            this.changeSkuList[i].activityMoney = 0;
                        }
                    }
                    jsonArr.push({key: 'skuListJson', value:JSON.stringify(this.changeSkuList)});
                }
                jsonArr.push({ key: 'activityName', value: this.oActivityName });
                jsonArr.push({ key: 'commonType', value: this.oCommonType });
                jsonArr.push({ key: 'cinemaCodes', value: this.selectGoodsCode });
                jsonArr.push({ key: 'startDate', value: this.oStartDate });
                jsonArr.push({ key: 'endDate', value: this.oEndDate });
                jsonArr.push({ key: 'startTimePoints', value: this.startArr.join(',') });
                jsonArr.push({ key: 'endTimePoints', value: this.endArr.join(',') });
                jsonArr.push({ key: 'purchaseType', value: this.oPurchaseType });
                jsonArr.push({ key: 'purchaseCount', value: this.oPurchaseCount });
                jsonArr.push({ key: 'smsStatus', value: 0 });
                jsonArr.push({ key: 'description', value: this.oDescription });
                jsonArr.push({ key: 'activityNotice', value: this.oActivityNotice });
                jsonArr.push({ key: 'notice', value: this.oNotice });
                jsonArr.push({ key: 'activityImage', value: this.oActivityImg });
                jsonArr.push({ key: 'commodityId', value: this.commodityId });
                jsonArr.push({ key: 'changeType', value: this.oChangeType });
                jsonArr.push({ key: 'gold', value: this.oGold });
                jsonArr.push({ key: 'sortNo', value: this.oSortNo });
                jsonArr.push({ key: 'money', value: this.oMoney });
                jsonArr.push({ key: 'commodityStore', value: this.oCommodityStore });
                jsonArr.push({ key: 'hasSoldNumber', value: this.oHasSoldNumber });
                jsonArr.push({ key: 'status', value: this.oStatus });
                jsonArr.push({ key: 'showStatus', value: this.oShowStatus });
                jsonArr.push({ key: 'id', value: this.form.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/secondKillActivity/updateById', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.editVisible = false;
                            this.$message.success(`编辑成功`);
                            if (this.oActivityImg != '') {
                                this.$refs.download.clearFiles();
                            };
                            this.oActivityName = '';
                            this.oActivityImg = '';
                            this.oCommonType = '';
                            this.selectGoodsCode = {};
                            this.oStartDate = '';
                            this.oEndDate = '';
                            this.dateInfo = [];
                            this.startArr = [];
                            this.endArr = [];
                            this.goodsInfo = [];
                            this.oMerchandiseCode = [];
                            this.oPurchaseType = '';
                            this.oPurchaseCount = '';
                            this.oSmsStatus = '';
                            this.oDescription = '';
                            this.oActivityNotice = '';
                            this.oNotice = '';
                            this.commodityId = '';
                            this.commodityName = '';
                            this.value1 = '';
                            this.oChangeType = '';
                            this.oGold = '';
                            this.oMoney = '';
                            this.oCommodityStore = '';
                            this.oHasSoldNumber = '';
                            this.oStatus = '';
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
            // 复制活动
            copyActivity(index, row) {
                this.selectCinema1();
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
                    .fetchPost('/secondKillActivity/getCopyActivity', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = true;
                            this.changeSkuList = [];
                            console.log(JSON.parse(Decrypt(data.data.data)))
                            this.oForm.commonType = JSON.parse(Decrypt(data.data.data)).commonType;
                            this.oMerchandiseCode = [];
                            if (JSON.parse(Decrypt(data.data.data)).commonType == 2) {
                                this.oMerchandiseCode = JSON.parse(Decrypt(data.data.data)).cinemaCodes.split(',');
                                this.selectGoodsCode = JSON.parse(Decrypt(data.data.data)).cinemaCodes.split(',');
                            }
                            for (let x in this.canUse1) {
                                if (this.canUse1[x].value == JSON.parse(Decrypt(data.data.data)).purchaseType) {
                                    this.oForm.purchaseType = this.canUse1[x].value;
                                    break;
                                }
                            }
                            this.oPurchaseCount = JSON.parse(Decrypt(data.data.data)).purchaseCount;
                            for (let x in this.canUse2) {
                                if (this.canUse2[x].value == JSON.parse(Decrypt(data.data.data)).smsStatus) {
                                    this.oForm.smsStatus = this.canUse2[x].value;
                                    break;
                                }
                            }
                            this.commodityId = JSON.parse(Decrypt(data.data.data)).commodityId;
                            this.commodityName = JSON.parse(Decrypt(data.data.data)).commodityName;
                            let skuInfoList = JSON.parse(Decrypt(data.data.data)).skuInfoList;
                            let jsonArr2 = [];
                            jsonArr2.push({ key: 'id', value: this.commodityId });
                            let sign = md5(preSign(jsonArr2));
                            jsonArr2.push({ key: 'sign', value: sign });
                            var params2 = ParamsAppend(jsonArr2);
                            https
                                .fetchPost('/goldCommodity/getSKUInfo', params2)
                                .then(data => {
                                    loading.close();
                                    if (data.data.code == 'success') {
                                        var oData = JSON.parse(Decrypt(data.data.data));
                                        console.log(oData)
                                        this.skuStatus = oData.skuStatus;
                                        if (this.skuStatus == 1) {
                                            if (skuInfoList.length > 0) {
                                                this.changeSkuList = skuInfoList;
                                            } else {
                                                this.changeSkuList = oData.skuList
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
                            for (let x in this.showType) {
                                if (this.showType[x].value == JSON.parse(Decrypt(data.data.data)).changeType) {
                                    this.oForm.changeType = this.showType[x].value;
                                    break;
                                }
                            }
                            this.oForm.gold = JSON.parse(Decrypt(data.data.data)).gold;
                            this.oForm.money = JSON.parse(Decrypt(data.data.data)).money;
                            this.oForm.commodityStore = JSON.parse(Decrypt(data.data.data)).commodityStore;
                            this.oForm.hasSoldNumber = JSON.parse(Decrypt(data.data.data)).hasSoldNumber;
                            for (let x in this.options) {
                                if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).status) {
                                    this.oForm.status = this.options[x].value;
                                    break;
                                }
                            }
                            this.oForm.description = JSON.parse(Decrypt(data.data.data)).description;
                            this.oForm.activityNotice = JSON.parse(Decrypt(data.data.data)).activityNotice;
                            this.oForm.notice = JSON.parse(Decrypt(data.data.data)).notice;
                            for (let x in this.showStatus) {
                                if (this.showStatus[x].value == JSON.parse(Decrypt(data.data.data)).showStatus) {
                                    this.oForm.showStatus = this.showStatus[x].value;
                                    break;
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
            },
            // 修改状态
            changeStatus(index, row) {
                if (row.status == 1) {
                    this.rowMess = '启用';
                }
                if (row.status == 2) {
                    this.rowMess = '停用';
                }
                this.$confirm('是否确定' + this.rowMess + '此活动?', '提示', {
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
                            status = 2;
                        } else if (row.status == 2) {
                            status = 1;
                        }
                        jsonArr.push({ key: 'id', value: row.id });
                        jsonArr.push({ key: 'status', value: status });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/secondKillActivity/updateStatus', params)
                            .then(data => {
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
                let startDate = this.query.startDate;
                let endDate = this.query.endDate;
                let cinemaCode = this.query.cinemaCode;
                let activityName = this.query.activityName;
                let status = this.query.status;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                if (!activityName) {
                    activityName = '';
                }
                if (!status) {
                    status = '';
                }
                if (!startDate) {
                    startDate = '';
                }
                if (!endDate) {
                    endDate = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'activityName', value: this.query.activityName });
                jsonArr.push({ key: 'status', value: this.query.status });
                jsonArr.push({ key: 'cinemaCode', value: this.query.cinemaCode });
                jsonArr.push({ key: 'startDate', value: this.query.startDate });
                jsonArr.push({ key: 'endDate', value: this.query.endDate });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/secondKillActivity/page', params)
                    .then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            this.cinemaInfo = [];
                            for (let i = 0; i < oData.cinemaList.length; i++) {
                                let cinemaList = {};
                                cinemaList.cinemaCode = oData.cinemaList[i].cinemaCode;
                                cinemaList.cinemaName = oData.cinemaList[i].cinemaName;
                                this.cinemaInfo.push(cinemaList);
                            }
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
            selectFormat(val) {
                this.selectFormatCode = val.join(',');
            },
            selectDay(val) {
                this.checkedDays = val.join(',');
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
                this.query.pageSize = val;
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
            one(a) {
                //获取卖品绑定的value值
                this.oForm.filmCode = a;
            },
            sureNext() {
                this.commodityName = this.commodityList.name;
                this.commodityId = this.commodityList.id;
                this.drawer = false;
                this.getSkuInfo(this.commodityId);
            },
            getSkuInfo(id) {
                //获取商品sku信息
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                setTimeout(() => {
                    let jsonArr = [];
                    jsonArr.push({ key: 'id', value: id });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/goldCommodity/getSKUInfo', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                var oData = JSON.parse(Decrypt(data.data.data));
                                console.log(oData);
                                this.skuStatus = oData.skuStatus;
                                if (oData.skuStatus == 1) {
                                    if (oData.skuList.length > 0) {
                                        for (let i = 0; i < oData.skuList.length; i ++) {
                                            oData.skuList[i].skuId = oData.skuList[i].id
                                            delete oData.skuList[i].id;
                                        }
                                        console.log(oData.skuList)
                                        this.changeSkuList = oData.skuList
                                    }
                                    for (let i = 0; i < this.changeSkuList.length; i ++) {
                                        this.changeSkuList[i].gold = '';
                                        this.changeSkuList[i].money = '';
                                        this.changeSkuList[i].store = '';
                                        this.changeSkuList[i].status = '2';
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
                    let name = this.query.name;
                    if (!name) {
                        name = '';
                    }
                    jsonArr.push({ key: 'name', value: name });
                    jsonArr.push({ key: 'pageNo', value: this.query.aPageNo });
                    jsonArr.push({ key: 'pageSize', value: this.query.aPageSize });
                    jsonArr.push({ key: 'commonType', value: this.oForm.commonType });
                    jsonArr.push({ key: 'cinemaCode', value: this.selectGoodsCode });
                    jsonArr.push({ key: 'status', value: 3 });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    console.log(jsonArr);
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/goldCommodity/getByCinemaPage', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.drawer = true;
                                var oData = JSON.parse(Decrypt(data.data.data));
                                console.log(oData);
                                this.query.name = '';
                                this.sellTableData = oData.data;
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
                    let name = this.query.name;
                    if (!name) {
                        name = '';
                    }
                    jsonArr.push({ key: 'name', value: name });
                    jsonArr.push({ key: 'pageNo', value: this.query.aPageNo });
                    jsonArr.push({ key: 'pageSize', value: this.query.aPageSize });
                    jsonArr.push({ key: 'commonType', value: this.oCommonType });
                    jsonArr.push({ key: 'cinemaCode', value: this.selectGoodsCode });
                    jsonArr.push({ key: 'status', value: 3 });
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({ key: 'sign', value: sign });
                    console.log(jsonArr);
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/goldCommodity/getByCinemaPage', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.drawer = true;
                                var oData = JSON.parse(Decrypt(data.data.data));
                                console.log(oData);
                                this.query.name = '';
                                this.sellTableData = oData.data;
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
            exceed(data) {
                if (data.length == 1) {
                    this.message = '只能上传一张图片，如需重新上传请删除第一张图！';
                    this.open();
                }
            },
            beforeUpload(file) {
                //上传之前
                this.type.type = EncryptReplace('business');
                const isLt200Kb = file.size / 1024 < 200;
                if (!isLt200Kb) {
                    this.message = '图片大小不能超过200kb！';
                    this.open();
                    return false;
                }
                return isLt200Kb;
            },
            onSuccess(data) {
                //上传文件 登录超时
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.upload.clearFiles();
                    return;
                }
                this.oForm.activityImage = data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            unSuccess(data) {
                //修改上传文件 登录超时
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.download.clearFiles();
                    return;
                }
                this.oActivityImg = data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            deletImg() {
                this.oActivityImg = '';
            },
            //新增套餐选择卖品页面
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
            },
            //修改sku弹出
            changeSku(index,row){
                if (!row.skuId) {
                    row.skuId = row.id;
                }
                this.skuChangeForm = row;
                console.log(row)
                this.oIndex=index;
                this.dialogoSkuFormVisible=true
            },
            changeChangeSku(index,row){
                // row.skuId = row.id;
                if (!row.skuId) {
                    row.skuId = row.id;
                }
                this.oSkuChangeForm = row;
                console.log(row);
                this.oChangeIndex=index;
                for (let x in this.skuJoin) {
                    if (this.skuJoin[x].value == this.oSkuChangeForm.status) {
                        this.oSkuChangeForm.status = this.skuJoin[x].value;
                        break;
                    }
                }
                this.dialogoSkuChangeFormVisible=true
            },
            sureChangeUseSku(){
                if (!this.skuChangeForm.status || this.skuChangeForm.status == '') {
                    this.message = '请选择是否参与！';
                    this.open();
                    return;
                }
                if (this.skuChangeForm.status == 1) {
                    if (!this.skuChangeForm.store || this.skuChangeForm.store == '' || this.skuChangeForm.store == 0) {
                        this.message = '库存不能为空，请检查！';
                        this.open();
                        return;
                    }
                    if (this.oForm.changeType==1||this.oForm.changeType==3) {
                        if (!this.skuChangeForm.gold) {
                            this.message = '所需金币数量不能为空，请检查！';
                            this.open();
                            return;
                        }
                    }
                    if (this.oForm.changeType==2||this.oForm.changeType==3) {
                        if (!this.skuChangeForm.money) {
                            this.message = '所需RMB不能为空，请检查！';
                            this.open();
                            return;
                        }
                    }
                    if(!this.skuChangeForm.gold) {
                        this.skuChangeForm.gold = 0
                    }
                    if(!this.skuChangeForm.money) {
                        this.skuChangeForm.money = 0
                    }
                } else if (this.skuChangeForm.status == 2) {
                    this.skuChangeForm.gold = 0;
                    this.skuChangeForm.money = 0;
                    this.skuChangeForm.store = 0;
                }
                let oneSku = {
                    activityType: '1',
                    skuId:this.skuChangeForm.skuId,
                    commodityId:this.skuChangeForm.commodityId,
                    store: this.skuChangeForm.store,
                    activityGold: this.skuChangeForm.gold,
                    activityMoney: this.skuChangeForm.money,
                    status: this.skuChangeForm.status,
                    image: this.skuChangeForm.image,
                    specifications: this.skuChangeForm.specifications,
                    attribute: this.skuChangeForm.attribute,
                };
                this.changeSkuList[this.oIndex] = oneSku;
                this.skuChangeForm.specifications = '';
                this.skuChangeForm.attribute = '';
                this.skuChangeForm.image = '';
                this.skuChangeForm.store = '';
                this.skuChangeForm.gold = '';
                this.skuChangeForm.money = '';
                this.skuChangeForm.status = '2';
                this.skuChangeForm.id = '';
                let num=0;
                console.log(this.changeSkuList);
                for(let x in this.changeSkuList){
                    if (this.changeSkuList[x].status == 1) {
                        num+= Number(this.changeSkuList[x].store)
                    }
                }
                this.oForm.commodityStore=num;
                this.dialogoSkuFormVisible = false;
            },
            sureChangeChanger() {
                // 编辑sku操作
                if (!this.oSkuChangeForm.status || this.oSkuChangeForm.status == '') {
                    this.message = '请选择是否参与！';
                    this.open();
                    return;
                }
                if (this.oSkuChangeForm.status == 1) {
                    if (!this.oSkuChangeForm.store || this.oSkuChangeForm.store == '' || this.oSkuChangeForm.store == 0) {
                        this.message = '库存不能为空，请检查！';
                        this.open();
                        return;
                    }
                    if (this.oChangeType==1||this.oChangeType==3) {
                        if (!this.oSkuChangeForm.activityGold) {
                            this.message = '所需金币数量不能为空，请检查！';
                            this.open();
                            return;
                        }
                    }
                    if (this.oChangeType==2||this.oChangeType==3) {
                        if (!this.oSkuChangeForm.activityMoney) {
                            this.message = '所需RMB不能为空，请检查！';
                            this.open();
                            return;
                        }
                    }
                    if(!this.oSkuChangeForm.activityGold){
                        this.oSkuChangeForm.activityGold=0
                    }
                    if(!this.oSkuChangeForm.activityMoney){
                        this.oSkuChangeForm.activityMoney=0
                    }
                } else if (this.oSkuChangeForm.status == 2) {
                    this.oSkuChangeForm.activityMoney = 0;
                    this.oSkuChangeForm.activityGold = 0;
                    this.oSkuChangeForm.store = 0;
                }
                let oneSku = {
                    activityType: '1',
                    skuId:this.oSkuChangeForm.skuId,
                    commodityId:this.oSkuChangeForm.commodityId,
                    store: this.oSkuChangeForm.store,
                    activityGold: this.oSkuChangeForm.activityGold,
                    activityMoney: this.oSkuChangeForm.activityMoney,
                    status: this.oSkuChangeForm.status,
                    image: this.oSkuChangeForm.image,
                    specifications: this.oSkuChangeForm.specifications,
                    attribute: this.oSkuChangeForm.attribute,
                };
                this.changeSkuList[this.oChangeIndex] = oneSku;
                this.oSkuChangeForm.specifications = '';
                this.oSkuChangeForm.skuId = '';
                this.oSkuChangeForm.attribute = '';
                this.oSkuChangeForm.image = '';
                this.oSkuChangeForm.store = '';
                this.oSkuChangeForm.activityGold = '';
                this.oSkuChangeForm.activityMoney = '';
                this.oSkuChangeForm.status = '';
                let num=0;
                for(let x in this.changeSkuList){
                    if (this.changeSkuList[x].status == 1) {
                        num+= Number(this.changeSkuList[x].store)
                    }
                }
                this.oCommodityStore=num;
                this.dialogoSkuChangeFormVisible = false;
            },
            changeSkuStatus() {
                this.$forceUpdate();
            },
            changeSkuPrice() {
                if (this.oForm.changeType == 1) {
                    if (this.changeSkuList.length > 0) {
                        for(let x in this.changeSkuList){
                            this.changeSkuList[x].activityMoney = 0;
                        }
                    }
                }
                if (this.oForm.changeType == 2) {
                    if (this.changeSkuList.length > 0) {
                        for(let x in this.changeSkuList){
                            this.changeSkuList[x].activityGold = 0;
                        }
                    }
                }
            },
            changeSkuPrice2() {
                if (this.oChangeType == 1) {
                    if (this.changeSkuList.length > 0) {
                        for(let x in this.changeSkuList){
                            this.changeSkuList[x].activityMoney = 0;
                        }
                    }
                }
                if (this.oChangeType == 2) {
                    if (this.changeSkuList.length > 0) {
                        for(let x in this.changeSkuList){
                            this.changeSkuList[x].activityGold = 0;
                        }
                    }
                }
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

