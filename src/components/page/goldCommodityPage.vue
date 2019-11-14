<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 金币商品管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.cinemaNames" placeholder="门店名称" class="handle-input mr10"></el-input>
                <el-select
                    clearable
                    v-model="query.status"
                    placeholder="状态"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="上架" value="1"></el-option>
                    <el-option key="2" label="未上架" value="2"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.changeType"
                    placeholder="兑换方式"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="纯金币兑换" value="1"></el-option>
                    <el-option key="2" label="纯RMB兑换" value="2"></el-option>
                    <el-option key="3" label="金币加RMB兑换" value="3"></el-option>
                </el-select>
                <el-select
                    clearable
                    v-model="query.commodityType"
                    placeholder="商品类型"
                    class="handle-select mr10"
                >
                    <el-option key="1" label="实物" value="1"></el-option>
                    <el-option key="2" label="优惠券" value="2"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="margin-left: 340px"
                >新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="商品名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="商品图片" width="200px">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width:400px" :src="scope.row.imageUrl" />
                            <img
                                slot="reference"
                                :src="scope.row.imageUrl"
                                :alt="scope.row.imageUrl"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="商品描述">
                    <template slot-scope="scope">{{scope.row.memo}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="库存">
                    <template slot-scope="scope">{{scope.row.store}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="兑换方式">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.changeType=='1'">纯金币兑换</el-tag>
                        <el-tag v-else-if="scope.row.changeType=='2'">纯RMB兑换</el-tag>
                        <el-tag v-else-if="scope.row.changeType=='3'">金币 + RMB 兑换</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="所需金币数量">
                    <template slot-scope="scope">{{scope.row.gold}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="所需RMB" width="110">
                    <template slot-scope="scope">{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="允许兑换的门店" width="150">
                    <template slot-scope="scope">{{scope.row.cinemaNames}}</template>
                </el-table-column>
                <el-table-column label="上架状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'" type="success">上架</el-tag>
                        <el-tag v-else type="danger">未上架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序">
                    <template slot-scope="scope">{{scope.row.sort}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="商品类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.commodityType=='1'">实物</el-tag>
                        <el-tag v-else-if="scope.row.commodityType=='2'">优惠券</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="优惠券名称" width="130">
                    <template slot-scope="scope">{{scope.row.ticketNames}}</template>
                </el-table-column>
                <!-- <el-table-column prop="sort" label="是否指定日期可以兑换" width="160">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.assignType=='0'"
                        >不允许指定日期</el-tag>
                        <el-tag v-else-if="scope.row.assignType=='1'"
                        >指定日期</el-tag>
                        <el-tag v-else-if="scope.row.assignType=='2'"
                        >指定每月几号</el-tag>
                        <el-tag v-else-if="scope.row.assignType=='3'"
                        >指定每月第几周</el-tag>
                        <el-tag v-else-if="scope.row.assignType=='4'"
                        >指定每周几</el-tag>
                    </template>
                </el-table-column>-->
                <!-- <el-table-column prop="sort" label="对应上方参数的具体日期信息" width="160">
                    <template slot-scope="scope">{{scope.row.assignInfo}}</template>
                </el-table-column>-->
                <!-- <el-table-column prop="sort" label="是否限制一段时间内可兑换数量" width="160">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.limitType=='0'"
                        >不限制</el-tag>
                        <el-tag v-else-if="scope.row.limitType=='1'"
                        >限制每年可兑换数量</el-tag>
                        <el-tag v-else-if="scope.row.limitType=='2'"
                        >限制每月可兑换数量</el-tag>
                        <el-tag v-else-if="scope.row.limitType=='3'"
                        >限制每周可兑换数量</el-tag>
                    </template>
                </el-table-column>-->
                <!-- <el-table-column prop="sort" label="对应上方的限制兑换数量" width="160">
                    <template slot-scope="scope">{{scope.row.limitNumber}}</template>
                </el-table-column>-->
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
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
        <el-dialog title="新增商品" :visible.sync="dialogFormVisible">
            <el-form v-model="oForm">
                <el-form-item label="商品类型" :label-width="formLabelWidth">
                    <el-select v-model="oForm.commodity_type" placeholder="请选择商品类型">
                        <el-option
                            v-for="item in commodityType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="oForm.commodity_type==1"
                    label="商品名称"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="oForm.commodity_type==1"
                    label="商品图片"
                    :label-width="formLabelWidth"
                >
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
                        drag
                        :limit="1"
                        ref="upload"
                        action="/api/upload/uploadImage"
                        :on-success="onSuccess"
                        multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过300kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="兑换须知" :label-width="formLabelWidth">
                    <el-input
                        style="width: 360px"
                        type="textarea"
                        v-model="oForm.memo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="详情" :label-width="formLabelWidth">
                    <quill-editor
                        ref="text"
                        v-model="oForm.details"
                        class="myQuillEditor"
                        :options="editorOption"
                    />
                </el-form-item>
                <el-form-item
                    v-if="oForm.commodity_type==1"
                    label="原价"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.originalPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.store" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="领取几天后过期" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.expireDay" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="兑换方式" :label-width="formLabelWidth">
                    <el-select v-model="oForm.change_type" placeholder="请选择兑换方式">
                        <el-option
                            v-for="item in showType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="oForm.change_type==1||oForm.change_type==3"
                    label="所需金币数量"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.gold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="oForm.change_type==2||oForm.change_type==3"
                    label="所需RMB"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.money" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="允许兑换的门店" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="checkedCities" :max="1">
                        <el-checkbox
                            v-for="city in cities"
                            :label="city.cinemaCode"
                            :key="city.cinemaCode"
                            :value="city.cinemaCode"
                        >{{city.cinemaName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="是否今日大牌" :label-width="formLabelWidth">
                    <el-select v-model="oForm.topStatus" placeholder="请选择">
                        <el-option
                            v-for="item in topStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上架状态" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择上架状态">
                        <el-option
                            v-for="item in showStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="oForm.commodity_type==2"
                    label="选择优惠券"
                    :label-width="formLabelWidth"
                >
                    <el-autocomplete
                        class="inline-input"
                        v-model="oForm.filmName"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入内容"
                        :trigger-on-focus="false"
                        @select="handleSelect"
                    ></el-autocomplete>
                    <span style="color:blue;cursor:pointer;" @click="addFilm">添加</span>
                </el-form-item>
                <el-form-item
                    label="所选优惠券："
                    :label-width="formLabelWidth"
                    v-if="filmInfo.length>0 && oForm.selectFilmType != 0"
                >
                    <div v-for="(item, index) in filmInfo" :key="index">
                        {{item.value}}
                        <span
                            style="color:red;cursor: pointer;"
                            @click="deletFilm(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="是否指定日期可以兑换" :label-width="formLabelWidth">
                    <el-select v-model="oForm.assign_type" placeholder="请选择指定日期">
                        <el-option
                            v-for="item in assignType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="oForm.assign_type==2"
                    label="选择指定日期"
                    :label-width="formLabelWidth"
                >
                    <el-date-picker
                        v-model="oForm.assign_info"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    v-if="oForm.assign_type==3"
                    label="输入每月几号"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.assign_info" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="oForm.assign_type==4"
                    label="输入每月第几周"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.assign_info" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="oForm.assign_type==5"
                    label="输入每周几"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.assign_info" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否限制一段时间内可兑换数量" :label-width="formLabelWidth">
                    <el-select v-model="oForm.limit_type" placeholder="请选择限制时间">
                        <el-option
                            v-for="item in limitType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="oForm.limit_type==2||oForm.limit_type==3||oForm.limit_type==4"
                    label="对应上方的限制兑换数量"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.limit_number" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="商品类型" :label-width="formLabelWidth">
                    <el-select v-model="form.commodityType" placeholder="商品类型" :disabled="true">
                        <el-option
                            v-for="item in commodityType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="form.commodityType==1"
                    label="商品名称"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="form.commodityType==1"
                    label="商品图片"
                    :label-width="formLabelWidth"
                >
                    <el-popover placement="right" title trigger="hover">
                        <img :src="form.image_url" />
                        <img
                            slot="reference"
                            :src="form.image_url"
                            :alt="form.image_url"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        :before-upload="beforeUpload"
                        :data="type"
                        class="upload-demo"
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
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="兑换须知" :label-width="formLabelWidth">
                    <el-input
                        style="width: 360px"
                        type="textarea"
                        v-model="form.memo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="详情" :label-width="formLabelWidth">
                    <quill-editor
                        ref="text"
                        v-model="form.details"
                        class="myQuillEditor"
                        :options="editorOption"
                    />
                </el-form-item>
                <el-form-item label="原价" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.originalPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.store" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="领取几天后过期" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.expireDay" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="兑换方式" :label-width="formLabelWidth">
                    <el-select v-model="form.changeType" placeholder="请选择兑换方式" @change="change">
                        <el-option
                            v-for="item in showType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="form.changeType==1||form.changeType==3"
                    label="所需金币数量"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="form.gold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="form.changeType==2||form.changeType==3"
                    label="所需RMB"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="form.money" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="允许兑换的门店" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="oCheckedCities" :max="1" @change="changeCinema">
                        <el-checkbox
                            v-for="city in oCities"
                            :label="city.cinemaCode"
                            :key="city.cinemaCode"
                            :value="city.cinemaCode"
                        >{{city.cinemaName}}</el-checkbox>
                    </el-checkbox-group>
                    <!-- <el-checkbox-group
                        v-model="form.cinemaCode"
                        @change="changeCinema"
                    >
                        <el-checkbox
                            v-for="item in oCities"
                            :label="item.cinemaCode"
                            :key="item.cinemaCode"
                            :value="item.cinemaName"
                        >{{item.cinemaName}}</el-checkbox>
                    </el-checkbox-group> -->
                </el-form-item>
                <el-form-item label="是否今日大牌" :label-width="formLabelWidth">
                    <el-select v-model="oTopstatus" placeholder="请选择">
                        <el-option
                            v-for="item in topStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上架状态" :label-width="formLabelWidth">
                    <el-select v-model="form.status" placeholder="请选择上架状态">
                        <el-option
                            v-for="item in showStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="form.commodityType==2"
                    label="选择优惠券"
                    :label-width="formLabelWidth"
                >
                    <el-autocomplete
                        class="inline-input"
                        v-model="form.filmName"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入内容"
                        :trigger-on-focus="false"
                        @select="handleSelect"
                    ></el-autocomplete>
                    <span style="color:blue;cursor:pointer;" @click="addFilm2">添加</span>
                </el-form-item>
                <el-form-item
                    label="所选优惠券："
                    :label-width="formLabelWidth"
                    v-if="filmInfo.length>0 && form.selectFilmType != 0"
                >
                    <div v-for="(item, index) in filmInfo" :key="index">
                        {{item.value}}
                        <span
                            style="color:red;cursor: pointer;"
                            @click="deletFilm(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="是否指定日期可以兑换" :label-width="formLabelWidth">
                    <el-select v-model="form.assignType" placeholder="请选择指定日期">
                        <el-option
                            v-for="item in assignType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="form.assignType==2"
                    label="选择指定日期"
                    :label-width="formLabelWidth"
                >
                    <el-date-picker
                        v-model="form.assignInfo"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    v-if="form.assignType==3"
                    label="输入每月几号"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="form.assignInfo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="form.assignType==4"
                    label="输入每月第几周"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="form.assignInfo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="form.assignType==5" label="输入每周几" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="form.assignInfo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否限制一段时间内可兑换数量" :label-width="formLabelWidth">
                    <el-select v-model="form.limitType" placeholder="请选择限制时间">
                        <el-option
                            v-for="item in limitType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="form.limitType==2||form.limitType==3||form.limitType==4"
                    label="对应上方的限制兑换数量"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="form.limitNumber" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';
import { fetchData } from '../../api/index';
import { Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend } from '@/aes/utils';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import md5 from 'js-md5';
import axios from 'axios';
import https from '../../https';
export default {
    name: 'basetable',
    data() {
        return {
            content: '',
            editorOption: {},
            oTopstatus: '',
            type: {
                type: ''
            },
            oName: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            checkedCities: [],
            oCheckedCities: [],
            cities: [], //增加页面影院
            oCities: [], //修改页面影院
            pageTotal: 0,
            form: {
                memo: '',
                sort: '',
                id: '',
                cinemaCode: [],
                cinemaCodes: ''
            },
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            oForm: {
                name: '',
                memo: '',
                sort: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
                value: '1',
                commodity_type: '1'
            },
            formLabelWidth: '120px',
            selectValue: {},
            options: [
                {
                    value: '1',
                    label: '审核中'
                },
                {
                    value: '2',
                    label: '未审核'
                },
                {
                    value: '3',
                    label: '通过'
                },
                {
                    value: '4',
                    label: '审核失败'
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
            showStatus: [
                {
                    value: '1',
                    label: '上架'
                },
                {
                    value: '2',
                    label: '未上架'
                }
            ],
            topStatusList: [
                {
                    value: '1',
                    label: '否'
                },
                {
                    value: '2',
                    label: '是'
                }
            ],
            commodityType: [
                {
                    value: '1',
                    label: '实物'
                },
                {
                    value: '2',
                    label: '优惠券'
                }
            ],
            assignType: [
                {
                    value: '1',
                    label: '不允许指定日期'
                },
                {
                    value: '2',
                    label: '指定日期'
                },
                {
                    value: '3',
                    label: '指定每月几号'
                },
                {
                    value: '4',
                    label: '指定每月第几周'
                },
                {
                    value: '5',
                    label: '指定每周几'
                }
            ],
            limitType: [
                {
                    value: '1',
                    label: '不限制'
                },
                {
                    value: '2',
                    label: '限制每年可兑换数量'
                },
                {
                    value: '3',
                    label: '限制每月可兑换数量'
                },
                {
                    value: '4',
                    label: '限制每周可兑换数量'
                }
            ],
            value: '',
            restaurants: [],
            state: '',
            timeout: null,
            selectFilm: {},
            filmInfo: []
        };
    },
    components: { quillEditor },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        change() {
            console.log(this.form.changeType);
        },
        querySearch(queryString, cb) {
            let jsonArr = [];
            jsonArr.push({ key: 'couponName', value: queryString });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('merchandiseCoupon/getCouponByName', params)
                .then(data => {
                    if (data.data.code == 'success') {
                        let films = JSON.parse(Decrypt(data.data.data));
                        this.restaurants = films;
                        var restaurants = this.restaurants;
                        var results = restaurants;
                        // 调用 callback 返回建议列表的数据
                        cb(results);
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
        handleSelect(item) {
            this.selectFilm = {};
            this.selectFilm = item;
        },
        addFilm() {
            this.selectFilm = {};
            if (this.oForm.filmName == '') {
                return;
            }
            if (this.restaurants.length == 0) {
                this.message = '暂无优惠券可选';
                this.open();
                return;
            }
            for (let i = 0; i < this.restaurants.length; i++) {
                if (this.oForm.filmName == this.restaurants[i].value) {
                    this.selectFilm = this.restaurants[i];
                }
            }
            if (!this.selectFilm.value) {
                return;
            }
            var result = this.filmInfo.some(item => {
                if (item.value == this.selectFilm.value) {
                    return true;
                }
            });
            if (result) {
                return;
            }
            this.filmInfo.push(this.selectFilm);
        },
        addFilm2() {
            this.selectFilm = {};
            if (!this.form.filmName) {
                return;
            }
            if (this.restaurants.length == 0) {
                this.message = '暂无优惠券可选';
                this.open();
                return;
            }
            for (let i = 0; i < this.restaurants.length; i++) {
                if (this.form.filmName == this.restaurants[i].value) {
                    this.selectFilm = this.restaurants[i];
                }
            }
            if (!this.selectFilm.value) {
                return;
            }
            var result = this.filmInfo.some(item => {
                if (item.value == this.selectFilm.value) {
                    return true;
                }
            });
            if (result) {
                return;
            }
            this.filmInfo.push(this.selectFilm);
        },
        deletFilm(index) {
            this.filmInfo.splice(index, 1);
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
            setTimeout(() => {
                https
                    .fetchPost('/goldCommodity/addPage', '')
                    .then(data => {
                        loading.close();
                        // console.log(data);
                        if (data.data.code == 'success') {
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            this.cities = JSON.parse(Decrypt(data.data.data));
                            // this.oForm = [];
                            // this.oForm.name = '';
                            // this.oForm.value = '';
                            // this.oForm.memo = '';
                            // this.filmInfo = [];
                            // this.checkedCities = [];
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
            }, 500);
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
            setTimeout(() => {
                if (this.filmInfo) {
                    let couponList = []; //优惠券编码
                    for (let x in this.filmInfo) {
                        couponList.push(this.filmInfo[x].address);
                    }
                    console.log(couponList);
                    this.oForm.ticket_ids = couponList.join(',');
                    console.log(this.oForm.ticket_ids);
                }
                var jsonArr = [];
                jsonArr.push({ key: 'name', value: this.oForm.name });
                jsonArr.push({ key: 'imageUrl', value: this.oForm.image_url });
                jsonArr.push({ key: 'memo', value: this.oForm.memo });
                jsonArr.push({ key: 'store', value: this.oForm.store });
                jsonArr.push({ key: 'changeType', value: this.oForm.change_type });
                jsonArr.push({ key: 'gold', value: this.oForm.gold });
                jsonArr.push({ key: 'money', value: this.oForm.money });
                jsonArr.push({ key: 'cinemaCodes', value: this.checkedCities });
                jsonArr.push({ key: 'status', value: this.oForm.status });
                jsonArr.push({ key: 'commodityType', value: this.oForm.commodity_type });
                jsonArr.push({ key: 'ticketIds', value: this.oForm.ticket_ids });
                jsonArr.push({ key: 'assignType', value: this.oForm.assign_type });
                jsonArr.push({ key: 'assignInfo', value: this.oForm.assign_info });
                jsonArr.push({ key: 'limitType', value: this.oForm.limit_type });
                jsonArr.push({ key: 'limitNumber', value: this.oForm.limit_number });
                jsonArr.push({ key: 'details', value: this.oForm.details });
                jsonArr.push({ key: 'originalPrice', value: this.oForm.originalPrice });
                jsonArr.push({ key: 'topStatus', value: this.oForm.topStatus });
                jsonArr.push({ key: 'expireDay', value: this.oForm.expireDay });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/goldCommodity/addGoldCommodity', params)
                        .then(data => {
                            loading.close();
                            //新增
                            console.log(data);
                            if (data.data.code == 'success') {
                                this.$refs.upload.clearFiles(); //清除已上传文件
                                this.oForm.name = '';
                                this.oForm.image_url = '';
                                this.oForm.memo = '';
                                this.oForm.store = '';
                                this.oForm.change_type = '';
                                this.oForm.gold = '';
                                this.oForm.money = '';
                                this.oForm.checkedCities = '';
                                this.oForm.status = '';
                                this.oForm.commodity_type = '';
                                this.oForm.ticket_ids = '';
                                this.oForm.assign_type = '';
                                this.oForm.assign_info = '';
                                this.oForm.limit_type = '';
                                this.oForm.limit_number = '';
                                this.oForm.details = '';
                                this.oForm.originalPrice = '';
                                this.oForm.topStatus = '';
                                this.oForm.expireDay = '';
                                this.dialogFormVisible = false;
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
            }, 500);
        },
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
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)',
                        target: document.querySelector('.div1')
                    });
                    setTimeout(() => {
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
                        // jsonArr.push({key:"roleName",value:name});
                        // jsonArr.push({key:"status",value:status});
                        jsonArr.push({ key: 'id', value: row.id });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('goldCommodity/deleteById', params)
                            .then(data => {
                                loading.close();
                                // console.log(data);
                                // console.log(JSON.parse(Decrypt(data.data.data)));
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
                                loading.close();
                                console.log(err);
                            });
                    }, 500);
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        addChange(index, row) {
            //是否修改权限
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                this.idx = index;
                this.form = row;
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: row.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('goldCommodity/modifyPage', params)
                    .then(data => {
                        loading.close();
                        console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            this.form.name = JSON.parse(Decrypt(data.data.data)).goldCommodity.name;
                            this.form.image_url = JSON.parse(Decrypt(data.data.data)).goldCommodity.imageUrl;
                            this.form.memo = JSON.parse(Decrypt(data.data.data)).goldCommodity.memo;
                            this.form.store = JSON.parse(Decrypt(data.data.data)).goldCommodity.store;
                            this.form.alredyChangedNumber = JSON.parse(Decrypt(data.data.data)).goldCommodity.alredyChangedNumber;
                            this.form.gold = JSON.parse(Decrypt(data.data.data)).goldCommodity.gold;
                            this.form.money = JSON.parse(Decrypt(data.data.data)).goldCommodity.money;
                            this.form.cinemaCodes = JSON.parse(Decrypt(data.data.data)).goldCommodity.cinemaCodes;
                            this.oCheckedCities = this.form.cinemaCodes.split(',');
                            this.form.status = JSON.parse(Decrypt(data.data.data)).goldCommodity.status;
                            this.form.commodityType = JSON.parse(Decrypt(data.data.data)).goldCommodity.commodityType;
                            this.oTopstatus = JSON.parse(Decrypt(data.data.data)).goldCommodity.topStatus;
                            this.form.ticketIds = JSON.parse(Decrypt(data.data.data)).goldCommodity.ticketIds;
                            this.form.assignType = JSON.parse(Decrypt(data.data.data)).goldCommodity.assignType;
                            this.form.assignInfo = JSON.parse(Decrypt(data.data.data)).goldCommodity.assignInfo;
                            this.form.limitType = JSON.parse(Decrypt(data.data.data)).goldCommodity.limitType;
                            this.form.limitNumber = JSON.parse(Decrypt(data.data.data)).goldCommodity.limitNumber;
                            this.oCities = JSON.parse(Decrypt(data.data.data)).cinemas;
                            //商品类型下拉选显示对应的选项
                            for (let x in this.commodityType) {
                                if (this.commodityType[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.commodityType) {
                                    this.form.commodityType = this.commodityType[x].value;
                                    break;
                                }
                            }
                            //是否今日大牌下拉选显示对应的选项
                            for (let x in this.topStatusList) {
                                if (this.topStatusList[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.topStatus) {
                                    this.oTopstatus = this.topStatusList[x].value;
                                    break;
                                }
                            }
                            //兑换方式下拉选显示对应的选项
                            //   console.log(typeof JSON.parse(Decrypt(data.data.data)).goldCommodity.changeType);
                            for (let x in this.showType) {
                                if (this.showType[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.changeType) {
                                    this.form.changeType = this.showType[x].value;
                                    break;
                                }
                            }

                            //上架状态下拉选显示对应的选项
                            for (let x in this.showStatus) {
                                if (this.showStatus[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.status) {
                                    this.form.status = this.showStatus[x].value;
                                    break;
                                }
                            }

                            //是否指定日期可以兑换下拉选显示对应的选项
                            for (let x in this.assignType) {
                                if (this.assignType[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.assignType) {
                                    this.form.assignType = this.assignType[x].value;
                                    break;
                                }
                            }

                            //是否限制一段时间内可兑换数量下拉选显示对应的选项
                            for (let x in this.limitType) {
                                if (this.limitType[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.limitType) {
                                    this.form.limitType = this.limitType[x].value;
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
            }, 500);
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
            setTimeout(() => {
                console.log(this.form.sort);
                // console.log(this.from.sort.toString());
                var jsonArr = [];
                if (this.oCheckedCities.length == 0) {
                    this.message='请选择影院！'
                    this.open();
                    return
                }
                this.form.cinemaCode = this.oCheckedCities.join(",");
                jsonArr.push({ key: 'id', value: this.form.id });
                jsonArr.push({ key: 'name', value: this.form.name });
                jsonArr.push({ key: 'imageUrl', value: this.form.image_url });
                jsonArr.push({ key: 'memo', value: this.form.memo });
                jsonArr.push({ key: 'store', value: this.form.store });
                jsonArr.push({ key: 'alredyChangedNumber', value: this.form.alredyChangedNumber });
                jsonArr.push({ key: 'changeType', value: this.form.changeType });
                jsonArr.push({ key: 'gold', value: this.form.gold });
                jsonArr.push({ key: 'money', value: this.form.money });
                jsonArr.push({ key: 'cinemaCodes', value: this.form.cinemaCode });
                jsonArr.push({ key: 'status', value: this.form.status });
                jsonArr.push({ key: 'commodityType', value: this.form.commodityType });
                jsonArr.push({ key: 'ticketIds', value: this.form.ticketIds });
                jsonArr.push({ key: 'assignType', value: this.form.assignType });
                jsonArr.push({ key: 'assignInfo', value: this.form.assignInfo });
                jsonArr.push({ key: 'limitType', value: this.form.limitType });
                jsonArr.push({ key: 'limitNumber', value: this.form.limitNumber });
                jsonArr.push({ key: 'details', value: this.form.details });
                jsonArr.push({ key: 'originalPrice', value: this.form.originalPrice });
                jsonArr.push({ key: 'expireDay', value: this.form.expireDay });
                jsonArr.push({ key: 'topStatus', value: this.oTopstatus });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                this.editVisible = false;
                https
                    .fetchPost('goldCommodity/updateById', params)
                    .then(data => {
                        loading.close();
                        // console.log(data);
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
            }, 500);
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
                let cinemaNames = this.query.cinemaNames;
                let status = this.query.status;
                let changeType = this.query.changeType;
                let commodityType = this.query.commodityType;
                if (!cinemaNames) {
                    cinemaNames = '';
                }
                if (!status) {
                    status = '';
                }
                if (!changeType) {
                    changeType = '';
                }
                if (!commodityType) {
                    commodityType = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'cinemaNames', value: cinemaNames });
                jsonArr.push({ key: 'status', value: status });
                jsonArr.push({ key: 'changeType', value: changeType });
                jsonArr.push({ key: 'commodityType', value: commodityType });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/goldCommodity/goldCommodityPage', params)
                    .then(data => {
                        loading.close();
                        // console.log(data);
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
        beforeUpload() {
            //上传之前
            this.type.type = EncryptReplace('business');
        },
        onSuccess(data) {
            //上传文件 登录超时
            // console.log(data);
            this.oForm.image_url = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        unSuccess(data) {
            //修改上传文件 登录超时
            // console.log(data);
            this.form.image_url = data.data;
            if (data.code == 'nologin') {
                this.message = data.message;
                this.open();
                this.$router.push('/login');
            }
        },
        changeCinema(val) {
            this.oCheckedCities = val;
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
