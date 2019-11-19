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
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="角色名" class="handle-input mr10"></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="审核中" value="1"></el-option>
                    <el-option key="2" label="未审核" value="2"></el-option>
                    <el-option key="3" label="通过" value="3"></el-option>
                    <el-option key="4" label="审核失败" value="4"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
            </div>
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
                <el-form-item label="游戏名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.gameName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="大转盘背景图" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="this.form.imageUrl" />
                        <img
                            slot="reference"
                            :src="this.form.imageUrl"
                            :alt="this.form.imageUrl"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        ref="upload"
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
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过300kb  建议尺寸120*120或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="活动开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width:250px"
                        v-model="oForm.startDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="活动结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width:250px"
                        v-model="oForm.endDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="消耗金币" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.consumeGold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="抽奖规则说明" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.gameRule" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="添加奖项" :label-width="formLabelWidth">-->
                <el-button
                    style="margin-top:-35px;float: right"
                    type="primary"
                    @click="changePrize"
                >添加奖项</el-button>
                <!--</el-form-item>-->
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
                <el-table-column prop="name" label="奖品等级">
                    <template slot-scope="scope">{{scope.row.prizeLevel}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="奖品名称">
                    <template slot-scope="scope">{{scope.row.prizeName}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="奖品图片">
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
                    style="margin-top: 10px;float: right"
                    type="primary"
                    @click="exAddChanger"
                >确 定</el-button>
            </span>
        </div>
        <!-- 新增奖项弹出框 -->
        <el-dialog title="新增" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="奖品等级" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.prizeLevel" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="奖品名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.prizeName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="奖品图片" :label-width="formLabelWidth">
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        drag
                        ref="download"
                        action="/api/upload/uploadImage"
                        :on-success="onSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过300kb 建议尺寸120*120或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="奖品个数" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.prizeNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="奖品概率（小数）" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.percent" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="过期天数" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.expireDay" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="奖品类型" :label-width="formLabelWidth">
                    <el-select v-model="form.prizeType" placeholder="请选择类型">
                        <el-option
                            v-for="item in prizeType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.prizeType==1" label="选择优惠券" :label-width="formLabelWidth">
                    <el-button type="primary" @click="getAllCoupon">选择优惠券</el-button>
                </el-form-item>
                <el-form-item v-if="form.prizeType==1" label="所选优惠券：" :label-width="formLabelWidth">
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
                    <el-input style="width: 250px" v-model="pForm.prizeLevel" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="奖品名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="pForm.prizeName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="奖品图片" :label-width="formLabelWidth">
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
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        drag
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
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过300kb 建议尺寸120*120或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="奖品个数" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="pForm.prizeNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="奖品概率（小数）" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="pForm.percent" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="过期天数" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="pForm.expireDay" autocomplete="off"></el-input>
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
                <el-form-item
                    v-if="pForm.prizeType==1"
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
                <el-form-item label="游戏名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.gameName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="大转盘背景图" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="this.form.imageUrl" />
                        <img
                            slot="reference"
                            :src="this.form.imageUrl"
                            :alt="this.form.imageUrl"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        ref="download"
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
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过300kb 建议尺寸375*600或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="活动开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width:250px"
                        v-model="form.startDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="活动结束时间" :label-width="formLabelWidth">
                    <el-date-picker
                        style="width:250px"
                        v-model="form.endDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    ></el-date-picker>
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
                <el-button style="float: right" type="primary" @click="changePrize">添加奖项</el-button>
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
                    style="margin-top: 10px;float: right"
                    type="primary"
                    @click="exChangeChanger"
                >确 定</el-button>
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
            showModify: false,
            addShow: false,
            changeShow: false,
            drawer: false,
            couponName: '',
            sellTableData: [],
            showSell: true, //卖品信息页面是否展示开关
            type: {
                type: ''
            },
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
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
            couponInfo: {},
            prizeInfoList: []
        };
    },
    created() {
        this.showSell = true;
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
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.download.clearFiles();
                return;
            }
            this.form.imageUrl = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        prizeModify(row, index) {
            this.oIndex = index;
            this.pForm = row;
            this.showModify = true;
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
            jsonArr.push({ key: 'simpleType', value: 1 });
            jsonArr.push({ key: 'name', value: name });
            jsonArr.push({ key: 'status', value: 1 });
            jsonArr.push({ key: 'cinemaCodes', value: this.cinemaCode });
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('merchandiseCoupon/merchandiseCouponPage', params)
                .then(data => {
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
        changePrize() {
            //调出编辑奖项页面
            // console.log(this.prizeInfoList);
            if (this.prizeInfoList.length >= 8) {
                this.message = '奖项数量最多添加8个';
                this.open();
            } else {
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
            setTimeout(() => {
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                jsonArr.push({ key: 'gameName', value: this.oForm.gameName });
                jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
                jsonArr.push({ key: 'imageUrl', value: this.form.imageUrl });
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
            setTimeout(() => {
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
                jsonArr.push({ key: 'gameName', value: this.form.gameName });
                jsonArr.push({ key: 'startDate', value: this.form.startDate });
                jsonArr.push({ key: 'imageUrl', value: this.form.imageUrl });
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
            let onePrize = {
                prizeLevel: this.form.prizeLevel,
                prizeName: this.form.prizeName,
                prizePicture: this.form.image_url,
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
            this.form.image_url = '';
            this.form.expireDay = '';
            this.form.prizeNumber = '';
            this.form.percent = '';
            this.form.prizeType = '';
            this.couponInfo = {};
            this.editVisible = false;
        },
        sureChanger() {
            // 编辑奖项操作
            let onePrize = {
                prizeLevel: this.pForm.prizeLevel,
                prizeName: this.pForm.prizeName,
                prizePicture: this.pForm.prizePicture,
                prizeNumber: this.pForm.prizeNumber,
                percent: this.pForm.percent,
                prizeType: this.pForm.prizeType,
                expireDay: this.pForm.expireDay,
                couponId: this.couponInfo.id,
                couponName: this.couponInfo.couponName
            };
            this.prizeInfoList[this.oIndex] = onePrize;
            this.pForm.prizeLevel = '';
            this.pForm.prizeName = '';
            this.pForm.image_url = '';
            this.pForm.expireDay = '';
            this.pForm.prizeNumber = '';
            this.pForm.percent = '';
            this.pForm.prizeType = '';
            this.couponInfo = {};
            this.showModify = false;
        },
        deletePrize(index) {
            //删除具体某一奖项
            this.prizeInfoList.splice(index, 1);
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
                            } else {
                                //编辑
                                console.log('编辑');
                                this.showSell = false;
                                this.changeShow = true;
                                console.log(JSON.parse(Decrypt(data.data.data)));
                                this.form = JSON.parse(Decrypt(data.data.data));
                                this.prizeInfoList = JSON.parse(Decrypt(data.data.data)).prizeInfoList;
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
            this.form.image_url = data.data;
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
            if (data.status == '-1') {
                this.message = data.message;
                this.open();
                this.$refs.onload.clearFiles();
                return;
            }
            this.form.image_url = data.data;
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

