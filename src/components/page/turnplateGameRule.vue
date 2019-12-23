<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 金币大转盘规则设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--影院信息展示页面-->
        <div class="container" v-if="showSell">
            <!--<div class="handle-box">-->
                <!--<el-select-->
                    <!--clearable-->
                    <!--v-model="query.cinemaCode"-->
                    <!--placeholder="请选择影院"-->
                    <!--class="handle-input mr10"-->
                <!--&gt;-->
                    <!--<el-option-->
                        <!--v-for="item in cinemaInfo"-->
                        <!--:key="item.cinemaCode"-->
                        <!--:label="item.cinemaName"-->
                        <!--:value="item.cinemaCode"-->
                    <!--&gt;</el-option>-->
                <!--</el-select>-->
                <!--<el-button style="margin-top: 10px;width: 90px;"  type="primary" icon="el-icon-search" @click="Search">搜索</el-button>-->
            <!--</div>-->
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="影院名称">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="游戏名称">
                    <template slot-scope="scope">{{scope.row.gameName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="消耗金币数量">
                    <template slot-scope="scope">{{scope.row.consumeGold}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖项数量">
                    <template slot-scope="scope">{{scope.row.prizeNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="show(scope.row)">编辑规则</el-button>
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
        <!-- 选择优惠券弹出窗 -->
        <el-dialog :close-on-click-modal="false" title="选择优惠券" :visible.sync="drawer">
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
                <el-button type="primary" @click="sureNext(id)">确 定</el-button>
            </div>
        </el-dialog>
        <!--新增游戏规则页面-->
        <div class="container" v-if="addShow">
            <div class="handle-box">
                <el-button
                    type="primary"
                    @click="back"
                    icon="el-icon-circle-plus-outline"
                    style="float: right"
                >返回影院列表</el-button>
            </div>
            <el-form ref="form" :model="oForm">
                <el-form-item :required="true" label="游戏名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.gameName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="大转盘背景图" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="this.oImageUrl" />
                        <img
                            slot="reference"
                            :src="this.oImageUrl"
                            :alt="this.oImageUrl"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        ref="upload"
                        drag
                        :limit="1"
                        :on-exceed="exceed"
                        action="/api/upload/uploadImage"
                        :on-success="unSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div
                            class="el-upload__tip"
                            slot="tip"
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸120*120或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="活动开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width:250px"
                        v-model="oForm.startDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="活动结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width:250px"
                        v-model="oForm.endDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="消耗金币" :label-width="formLabelWidth">
                    <el-input
                         style="width: 250px"
                         v-model="oForm.consumeGold"
                         autocomplete="off"
                         type="number"
                         onkeyup="this.value=this.value.replace(/\D/g,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="抽奖规则说明" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px;"
                        type="textarea"
                        show-word-limit
                        rows="6"
                        maxlength="300"
                        v-model="oForm.gameRule"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="状态" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-button
                    style="margin-top:-35px;float: right"
                    type="primary"
                    @click="changePrize"
                >添加奖项</el-button>
            </el-form>
            <el-table
                v-if="prizeInfoList.length!=0"
                :data="prizeInfoList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="奖品等级" width="100">
                    <template slot-scope="scope">{{scope.row.prizeLevel}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="奖品名称">
                    <template slot-scope="scope">{{scope.row.prizeName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品图片" width="100">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width: 400px" :src="scope.row.prizePicture" />
                            <img
                                slot="reference"
                                :src="scope.row.prizePicture"
                                :alt="scope.row.prizePicture"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品总数量">
                    <template slot-scope="scope">{{scope.row.prizeNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品概率" width="100">
                    <template slot-scope="scope">{{scope.row.percent}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已中奖数量">
                    <template slot-scope="scope">{{scope.row.hasTheNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品类型" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.prizeType=='1'">优惠券</el-tag>
                        <el-tag v-else-if="scope.row.prizeType=='2'">实物</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="优惠券名称">
                    <template slot-scope="scope">{{scope.row.couponName}}</template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="prizeModify(scope.row,scope.$index)"
                        >修改</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            @click="deletePrize(scope.$index)"
                            class="red"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer" style="margin-left: 1040px">
                <!--<el-button @click="addShow = false,showSell=true">取 消</el-button>-->
                <el-button
                    style="margin-top: 5px;float: right"
                    type="primary"
                    @click="exAddChanger"
                >确 定</el-button>
            </span>
        </div>
        <!--修改游戏规则页面-->
        <div class="container" v-if="changeShow">
            <div class="handle-box">
                <el-button
                    type="primary"
                    @click="back"
                    icon="el-icon-circle-plus-outline"
                    style="float: right"
                >返回影院列表</el-button>
            </div>
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="游戏名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.gameName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="大转盘背景图" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="this.oImageUrl" />
                        <img
                            slot="reference"
                            :src="this.oImageUrl"
                            :alt="this.oImageUrl"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        ref="download"
                        drag
                        :limit="1"
                        :on-exceed="exceed"
                        action="/api/upload/uploadImage"
                        :on-success="unSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div
                            class="el-upload__tip"
                            slot="tip"
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸375*600或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="活动开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width:250px"
                        v-model="form.startDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="活动结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width:250px"
                        v-model="form.endDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="消耗金币" :label-width="formLabelWidth">
                    <el-input style="width: 250px " onkeyup="this.value=this.value.replace(/\D/g,'')" v-model="form.consumeGold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="抽奖规则说明" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        type="textarea"
                        rows="6"
                        show-word-limit
                        maxlength="300"
                        v-model="form.gameRule"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="状态" :label-width="formLabelWidth">
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
                <el-button style="margin-top:-35px;float: right" type="primary" @click="changePrize">添加奖项</el-button>
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
                <el-table-column prop="name" label="奖品等级" width="100">
                    <template slot-scope="scope">{{scope.row.prizeLevel}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="奖品名称">
                    <template slot-scope="scope">{{scope.row.prizeName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品图片" width="100">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width: 400px" :src="scope.row.prizePicture" />
                            <img
                                slot="reference"
                                :src="scope.row.prizePicture"
                                :alt="scope.row.prizePicture"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品总数量">
                    <template slot-scope="scope">{{scope.row.prizeNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品概率" width="100">
                    <template slot-scope="scope">{{scope.row.percent}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已中奖数量">
                    <template slot-scope="scope">{{scope.row.hasTheNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品类型" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.prizeType=='1'">优惠券</el-tag>
                        <el-tag v-else-if="scope.row.prizeType=='2'">实物</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="优惠券名称">
                    <template slot-scope="scope">{{scope.row.couponName}}</template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="prizeModify(scope.row,scope.$index)"
                        >修改</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            @click="deletePrize(scope.$index)"
                            class="red"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer" style="margin-left: 1040px">
                <el-button
                    style="margin-top: 5px;float: right"
                    type="primary"
                    @click="exChangeChanger"
                >确 定</el-button>
            </span>
        </div>
        <!-- 新增奖项弹出框 -->
        <el-dialog :close-on-click-modal="false" title="新增" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="奖品等级" :label-width="formLabelWidth">
                    <el-select
                        v-model="form.prizeLevel"
                        placeholder="请选择奖品等级"
                    >
                    <el-option
                        v-for="item in levelInfo"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                </el-form-item>
                <el-form-item :required="true" label="奖品名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.prizeName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="奖品图片" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            action="/api/upload/uploadImage"
                            :before-upload="beforeUploadPrize"
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
                        >只能上传jpg/png文件，且不超过100kb 建议尺寸120*120或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="奖品个数" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.prizeNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="奖品概率" :label-width="formLabelWidth">
                    <el-input placeholder="大于0小于100的数字" style="width: 250px" v-model="form.percent" autocomplete="off"></el-input>%
                </el-form-item>
                <el-form-item :required="true" label="过期天数" :label-width="formLabelWidth">
                    <el-input placeholder="中奖后奖品过期天数" style="width: 250px" v-model="form.expireDay" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="奖品类型" :label-width="formLabelWidth">
                    <el-select v-model="form.prizeType" placeholder="请选择类型">
                        <el-option
                            v-for="item in prizeType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="form.prizeType==1"
                    label="选择优惠券"
                    :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="getAllCoupon">选择优惠券</el-button>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="form.prizeType==1"
                    label="所选优惠券："
                    :label-width="formLabelWidth"
                >
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
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="showModify">
            <el-form ref="form" :model="pForm">
                <el-form-item label="奖品等级" :label-width="formLabelWidth">
                    <el-select
                        v-model="pForm.prizeLevel"
                        placeholder="请选择奖品等级"
                    >
                    <el-option
                        v-for="item in levelInfo"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                </el-form-item>
                <el-form-item :required="true" label="奖品名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="pForm.prizeName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="奖品图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="pForm.prizePicture" />
                        <img
                            slot="reference"
                            :src="pForm.prizePicture"
                            :alt="pForm.prizePicture"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :before-upload="beforeUploadPrize"
                        :data="type"
                        class="upload-demo"
                        drag
                        :limit="1"
                        :on-exceed="exceed"
                        ref="snload"
                        action="/api/upload/uploadImage"
                        :on-success="snSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div
                            class="el-upload__tip"
                            slot="tip"
                        >只能上传jpg/png文件，且不超过100kb 建议尺寸120*120或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="奖品个数" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="pForm.prizeNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="奖品概率" :label-width="formLabelWidth">
                    <el-input placeholder="大于0小于100的数字" style="width: 250px" v-model="pForm.percent" autocomplete="off"></el-input>%
                </el-form-item>
                <el-form-item :required="true" label="过期天数" :label-width="formLabelWidth">
                    <el-input placeholder="中奖后奖品过期天数" style="width: 250px" v-model="pForm.expireDay" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="奖品类型" :label-width="formLabelWidth">
                    <el-select v-model="pForm.prizeType" placeholder="请选择类型">
                        <el-option
                            v-for="item in prizeType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="pForm.prizeType==1"
                    label="选择优惠券"
                    :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="getAllCoupon">选择优惠券</el-button>
                </el-form-item>
                <el-form-item
                    v-if="pForm.prizeType==1"
                    label="所选优惠券："
                    :label-width="formLabelWidth"
                    :required="true"
                >
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
            showModify: false,
            addShow: false,
            changeShow: false,
            drawer: false,
            couponName: '',
            fileList: [],
            sellTableData: [],
            cinemaInfo: [],
            showSell: true, //卖品信息页面是否展示开关
            type: {
                type: ''
            },
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                aPageNo: 1,
                aPageSize: 15
            },
            tableData: [],
            oTableData: [],
            multipleSelection: [],
            editVisible: false,
            pageTotal: 0,
            oImageUrl: '',
            pForm: {
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
            prizeType: [
                {
                    value: '1',
                    label: '优惠券'
                },
                {
                    value: '2',
                    label: '实物'
                }
            ],
            levelInfo: [
                {
                    value: '1',
                    label: '一等奖'
                },
                {
                    value: '2',
                    label: '二等奖'
                },
                {
                    value: '3',
                    label: '三等奖'
                },
                {
                    value: '4',
                    label: '四等奖'
                },
                {
                    value: '5',
                    label: '五等奖'
                },
                {
                    value: '6',
                    label: '六等奖'
                },
                {
                    value: '7',
                    label: '七等奖'
                }
            ],
            couponInfo: {
                couponName: '',
                id: ''
            },
            prizeInfoList: []
        };
    },
    created() {
        this.showSell = true;
    },
    mounted() {
        this.getMenu();
        this.getAllCinema();
    },
    methods: {
        exceed(data){
            console.log(data);
            if(data.length==1){
                this.message = '只能上传一张图片，如需重新上传请删除第一张图！';
                this.open();
            }
        },
        match() {
            if (this.form.prizeLevel < 1 || this.form.prizeLevel > 7) {
                this.message = '请输入1-7的数字';
                this.form.prizeLevel = '';
                this.open();
            }
        },
        oMatch() {
            if (this.pForm.prizeLevel < 1 || this.pForm.prizeLevel > 7) {
                this.message = '请输入1-7的数字';
                this.pForm.prizeLevel = '';
                this.open();
            }
        },
        beforeUpload(file) {
            //上传之前
            this.type.type = EncryptReplace('activity');
            const isLt200Kb = file.size / 1024 < 200;
            if (!isLt200Kb) {
                this.message = '图片大小不能超过200kb！';
                this.open();
                return false;
            }
            return isLt200Kb;
        },
        beforeUploadPrize(file) {
            //上传之前
            this.type.type = EncryptReplace('activity');
            const isLt100Kb = file.size / 1024 < 100;
            if (!isLt100Kb) {
                this.message = '图片大小不能超过100kb！';
                this.open();
                return false;
            }
            return isLt100Kb;
        },
        unSuccess(data) {
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.download.clearFiles();
                return;
            }
            this.oImageUrl = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        prizeModify(row, index) {
            console.log(row);
            this.couponInfo.couponName = row.couponName;
            this.couponInfo.id = row.couponId;
            this.oIndex = index;
            this.pForm = row;
            for (let x in this.prizeType) {
                if (this.prizeType[x].value == row.prizeType) {
                    console.log('22sd ');
                    this.pForm.prizeType = this.prizeType[x].value;
                    break;
                }
            }
            this.showModify = true;
        },
        // 获取所有影院
        getAllCinema() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            https
                .fetchPost('/cinema/getAllCinema', '')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let cinemas = JSON.parse(Decrypt(data.data.data));
                        for (let i = 0; i < cinemas.length; i++) {
                            let cinemaInfo = {};
                            cinemaInfo.cinemaName = cinemas[i].cinemaName;
                            cinemaInfo.cinemaCode = cinemas[i].cinemaCode;
                            this.cinemaInfo.push(cinemaInfo);
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
        getAllCoupon() {
            // 获取所有优惠券
            console.log(this.cinemaCode);
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
            // jsonArr.push({ key: 'simpleType', value: 1 });
            jsonArr.push({ key: 'name', value: name });
            // jsonArr.push({ key: 'status', value: 1 });
            jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
            jsonArr.push({ key: 'pageNo', value: this.query.aPageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.aPageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('merchandiseCoupon/getCouponByCinemaCode', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let oData = JSON.parse(Decrypt(data.data.data));
                        this.drawer = true;
                        this.sellTableData = oData.pageResult.data;
                        console.log(this.sellTableData);
                        this.query.aPageSize = oData.pageResult.pageSize;
                        this.query.aPageNo = oData.pageResult.pageNo;
                        this.query.aTotalCount = oData.pageResult.totalCount;
                        this.query.aTotalPage = oData.pageResult.totalPage;
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
        changePrize() {
            //调出编辑奖项页面
            console.log(this.prizeInfoList);
            if (this.prizeInfoList.length >= 8) {
                this.message = '奖项数量最多添加8个';
                this.open();
            } else {
                this.fileList=[];
                this.editVisible = true;
            }
        },
        exAddChanger() {
            //新增确定按钮
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if (!this.oForm.gameName) {
                this.message = '游戏名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            // if (!this.oImageUrl) {
            //     this.message = '大转盘背景图不能为空，请检查！';
            //     this.open();
            //     loading.close();
            //     return;
            // }
            if (!this.oForm.startDate) {
                this.message = '活动开始时间不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.endDate) {
                this.message = '活动结束时间不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if ( !this.oForm.consumeGold) {
                this.message = '消耗金币不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.status) {
                this.message = '状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oForm.startDate == this.oForm.endDate) {
                this.message = '活动开始时间不能等于活动结束时间！';
                this.open();
                loading.close();
                return;
            }
            if (this.prizeInfoList.length > 7 || this.prizeInfoList.length < 1) {
                this.message = '奖项数量应设置1-7个！';
                this.open();
                loading.close();
                return;
            }
            setTimeout(() => {
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                jsonArr.push({ key: 'gameName', value: this.oForm.gameName });
                jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
                jsonArr.push({ key: 'imageUrl', value: this.oImageUrl });
                jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
                jsonArr.push({ key: 'status', value: this.oForm.status });
                jsonArr.push({ key: 'prizeNumber', value: this.prizeInfoList.length });
                jsonArr.push({ key: 'consumeGold', value: this.oForm.consumeGold });
                jsonArr.push({ key: 'gameRule', value: this.oForm.gameRule });
                jsonArr.push({ key: 'prizeInfoJson', value: JSON.stringify(this.prizeInfoList) });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                console.log(params);
                https
                    .fetchPost('turnplateGameRule/addTurnplateGameRule', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.showSell = true;
                            this.addShow = false;
                            this.$message.success(`新增成功`);
                            this.$refs.upload.clearFiles(); //清除已上传文件
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
        exChangeChanger() {
            //修改确定按钮
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            if (!this.form.gameName) {
                this.message = '游戏名称不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            // if (!this.oImageUrl) {
            //     this.message = '大转盘背景图不能为空，请检查！';
            //     this.open();
            //     loading.close();
            //     return;
            // }
            if (!this.form.startDate) {
                this.message = '活动开始时间不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.form.endDate) {
                this.message = '活动结束时间不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if ( !this.form.consumeGold) {
                this.message = '消耗金币不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.form.status) {
                this.message = '状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.form.startDate == this.form.endDate) {
                this.message = '活动开始时间不能等于活动结束时间！';
                this.open();
                loading.close();
                return;
            }
            if (this.prizeInfoList.length > 7 || this.prizeInfoList.length < 1) {
                this.message = '奖项数量应设置1-7个！';
                this.open();
                loading.close();
                return;
            }
            setTimeout(() => {
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                jsonArr.push({ key: 'gameName', value: this.form.gameName });
                jsonArr.push({ key: 'startDate', value: this.form.startDate });
                jsonArr.push({ key: 'imageUrl', value: this.oImageUrl });
                jsonArr.push({ key: 'endDate', value: this.form.endDate });
                jsonArr.push({ key: 'status', value: this.form.status });
                jsonArr.push({ key: 'prizeNumber', value: this.prizeInfoList.length });
                jsonArr.push({ key: 'consumeGold', value: this.form.consumeGold });
                jsonArr.push({ key: 'gameRule', value: this.form.gameRule });
                jsonArr.push({ key: 'prizeInfoJson', value: JSON.stringify(this.prizeInfoList) });
                jsonArr.push({ key: 'id', value: this.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                console.log(params);
                https
                    .fetchPost('turnplateGameRule/updateTurnplateGameRuleById', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.showSell = true;
                            this.changeShow = false;
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
        exChanger() {
            // 新增奖项操作
            if (this.form.percent > 100 || this.form.percent < 0) {
                this.message = '只能输入0-100的数字';
                this.open();
                return;
            }
            if (!this.form.prizeLevel) {
                this.message = '奖品等级不能为空，请检查！';
                this.open();
                return;
            }
            if (!this.form.prizeName) {
                this.message = '奖品名称不能为空，请检查！';
                this.open();
                return;
            }
            if (!this.pForm.prizePicture) {
                this.message = '奖品图片不能为空，请检查！';
                this.open();
                return;
            }
            if (!this.form.prizeNumber) {
                this.message = '奖品个数不能为空，请检查！';
                this.open();
                return;
            }
            if (this.form.prizeNumber<=0) {
                this.message = '奖品个数必须大于0，请检查！';
                this.open();
                return;
            }
            if (!this.form.percent) {
                this.message = '奖品概率不能为空，请检查！';
                this.open();
                return;
            }
            if (!this.form.expireDay) {
                this.message = '过期天数不能为空，请检查！';
                this.open();
                return;
            }
            if (this.form.expireDay<0) {
                this.message = '过期天数不能小于0，请检查！';
                this.open();
                return;
            }
            if (!this.form.prizeType) {
                this.message = '奖品类型不能为空，请检查！';
                this.open();
                return;
            }
            if (this.form.prizeType == 1) {
                if (!this.couponInfo.couponName) {
                    this.message = '所选优惠券不能为空，请检查！';
                    this.open();
                    return;
                }
            }
            let onePrize = {
                prizeLevel: this.form.prizeLevel,
                prizeName: this.form.prizeName,
                prizePicture: this.pForm.prizePicture,
                prizeNumber: this.form.prizeNumber,
                percent: this.form.percent,
                prizeType: this.form.prizeType,
                expireDay: this.form.expireDay,
                couponId: this.couponInfo.id,
                couponName: this.couponInfo.couponName
            };
            this.prizeInfoList.push(onePrize);
            this.form.prizeLevel = '';
            this.form.prizeName = '';
            this.pForm.prizePicture = '';
            this.form.expireDay = '';
            this.form.prizeNumber = '';
            this.form.percent = '';
            this.form.prizeType = '';
            this.couponInfo.id = '';
            this.couponInfo.couponName = '';
            this.editVisible = false;
        },
        sureChanger() {
            // 编辑奖项操作
            console.log(this.pForm);
            if (this.pForm.percent > 100 || this.pForm.percent < 0) {
                this.message = '只能输入0-100的小数';
                this.open();
                return;
            }
            if (!this.pForm.prizeName) {
                this.message = '奖品名称不能为空，请检查！';
                this.open();
                return;
            }
            if (!this.pForm.prizePicture) {
                this.message = '奖品图片不能为空，请检查！';
                this.open();
                return;
            }
            if (!this.pForm.prizeNumber) {
                this.message = '奖品个数不能为空，请检查！';
                this.open();
                return;
            }
            if (this.pForm.prizeNumber<=0) {
                this.message = '奖品个数必须大于0，请检查！';
                this.open();
                return;
            }
            if (!this.pForm.percent) {
                this.message = '奖品概率不能为空，请检查！';
                this.open();
                return;
            }
            if (!this.pForm.expireDay) {
                this.message = '过期天数不能为空，请检查！';
                this.open();
                return;
            }
            if (this.pForm.expireDay<0) {
                this.message = '过期天数不能小于0，请检查！';
                this.open();
                return;
            }
            if (!this.pForm.prizeType) {
                this.message = '奖品类型不能为空，请检查！';
                this.open();
                return;
            }
            if (this.pForm.prizeType == 1) {
                if (!this.couponInfo.couponName) {
                    this.message = '所选优惠券不能为空，请检查！';
                    this.open();
                    return;
                }
            }
            let onePrize = {
                prizeLevel: this.pForm.prizeLevel,
                prizeName: this.pForm.prizeName,
                prizePicture: this.pForm.prizePicture,
                prizeNumber: this.pForm.prizeNumber,
                percent: this.pForm.percent,
                prizeType: this.pForm.prizeType,
                expireDay: this.pForm.expireDay,
                couponId: this.couponInfo.id,
                couponName: this.couponInfo.couponName,
                hasTheNumber: this.prizeInfoList[this.oIndex].hasTheNumber,
                id: this.prizeInfoList[this.oIndex].id
            };
            this.prizeInfoList[this.oIndex] = onePrize;
            this.pForm.prizeLevel = '';
            this.pForm.prizeName = '';
            this.pForm.image_url = '';
            this.pForm.expireDay = '';
            this.pForm.prizeNumber = '';
            this.pForm.percent = '';
            this.pForm.prizeType = '';
            this.couponInfo.id = '';
            this.couponInfo.couponName = '';
            this.showModify = false;
        },
        deletePrize(index) {
            //删除具体某一奖项
            this.$confirm('此操作将永久删除该奖项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.prizeInfoList.splice(index, 1);
                this.$message.error(`删除了`);
            })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
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
                let name = this.query.name;
                let status = this.query.status;
                if (!name) {
                    name = '';
                }
                if (!status) {
                    status = '';
                }
                let jsonArr = [];
                // jsonArr.push({key:"roleName",value:name});
                // jsonArr.push({key:"status",value:status});
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/turnplateGameRule/turnplateGameRulePage', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData);
                            // console.log(this.query);
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
        show(row) {
            this.id = row.id;
            this.cinemaCode = row.cinemaCode;
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
                https
                    .fetchPost('/turnplateGameRule/getByCinemaCode', params1)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.prizeInfoList = [];
                            if (data.data.data == null) {
                                //新增
                                console.log('新增');
                                this.showSell = false;
                                this.addShow = true;
                                this.oImageUrl = '';
                            } else {
                                //编辑
                                console.log('编辑');
                                this.showSell = false;
                                this.changeShow = true;
                                console.log(JSON.parse(Decrypt(data.data.data)));
                                this.form = JSON.parse(Decrypt(data.data.data));
                                this.prizeInfoList = JSON.parse(Decrypt(data.data.data)).prizeInfoList;
                                this.oImageUrl = JSON.parse(Decrypt(data.data.data)).imageUrl;
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
        onSuccess(data) {
            //上传文件 登录超时
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.download.clearFiles();
                return;
            }
            this.pForm.prizePicture = data.data;
            // this.$refs.download.clearFiles();//清除已上传文件
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        snSuccess(data) {
            //上传文件 登录超时
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.snload.clearFiles();
                return;
            }
            this.pForm.prizePicture = data.data;
            // this.$refs.onload.clearFiles();//清除已上传文件
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        back() {
            this.showSell = true;
            this.addShow = false;
            this.changeShow = false;
            this.getMenu();
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
        handleSizeChange(val) {
            this.query.pageSize=val;
            this.getMenu()
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
            this.query.aPageSize=val;
            this.getAllCoupon()
        },
        aCurrentChange(val) {
            //点击选择具体页数
            this.query.aPageNo = val;
            this.getAllCoupon();
        },
        aPrev() {
            //分页按钮上一页
            this.query.aPageNo--;
            this.getAllCoupon();
        },
        aNext() {
            //分页按钮下一页
            this.query.aPageNo++;
            this.getAllCoupon();
        }
    }
};
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

input[type='number'] {
    -moz-appearance: textfield;
}
</style>

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

