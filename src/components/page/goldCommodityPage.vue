<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 金币商品设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    clearable
                    v-model="query.cinemaCode"
                    placeholder="请选择影院"
                    class="handle-input mr10"
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
                    <el-option key="3" label="券包" value="3"></el-option>
                </el-select>
                <el-button
                    style="margin-top: 10px;width: 90px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="Search"
                >搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
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
                <el-table-column prop="sort" label="允许兑换的门店" width="240">
                    <template slot-scope="scope">{{scope.row.cinemaNames}}</template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="商品图片" width="90">
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
                <el-table-column prop="sort" label="库存" width="70">
                    <template slot-scope="scope">{{scope.row.store}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="已兑换数量" width="100">
                    <template slot-scope="scope">{{scope.row.alreadyChangedNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="兑换方式" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.changeType=='1'">纯金币兑换</el-tag>
                        <el-tag v-else-if="scope.row.changeType=='2'">纯RMB兑换</el-tag>
                        <el-tag v-else-if="scope.row.changeType=='3'">金币+RMB 兑换</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="所需金币数量" width="110">
                    <template slot-scope="scope">{{scope.row.gold}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="所需RMB" width="90">
                    <template slot-scope="scope">{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column label="上架状态" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'" type="success">上架</el-tag>
                        <el-tag v-else type="danger">未上架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="90">
                    <template slot-scope="scope">{{scope.row.sort}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="商品类型" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.commodityType=='1'">实物</el-tag>
                        <el-tag v-else-if="scope.row.commodityType=='2'">优惠券</el-tag>
                        <el-tag v-else-if="scope.row.commodityType=='3'">券包</el-tag>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="sort" label="优惠券名称" width="130">
                    <template slot-scope="scope">{{scope.row.ticketNames}}</template>
                </el-table-column>-->
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
                <el-table-column label="操作" width="140" align="center" fixed="right">
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
        <el-dialog :close-on-click-modal="false" title="新增商品" :visible.sync="dialogFormVisible">
            <el-form v-model="oForm">
                <el-form-item :required="true" label="商品类型" :label-width="formLabelWidth">
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
                    :required="true"
                    v-if="oForm.commodity_type==1"
                    label="商品名称"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="商品图片" :label-width="formLabelWidth">
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
                        <div
                            class="el-upload__tip"
                            slot="tip"
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸200*200或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="允许兑换的门店" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="checkedCities" :max="1" @change="getCinemaCode">
                        <el-checkbox
                            v-for="city in cities"
                            :label="city.cinemaCode"
                            :key="city.cinemaCode"
                            :value="city.cinemaCode"
                        >{{city.cinemaName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="兑换须知" :label-width="formLabelWidth">
                    <el-input
                        style="width: 360px"
                        type="textarea"
                        show-word-limit
                        maxlength="100"
                        v-model="oForm.memo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="详情" :label-width="formLabelWidth">
                    <mavon-editor
                        v-model="oForm.details"
                        ref="md"
                        @change="changeMarkdown"
                        @imgAdd="$imgAdd"
                        @imgDel="$imgDel"
                    />
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.commodity_type==1"
                    label="原价"
                    :label-width="formLabelWidth"
                >
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 250px" v-model="oForm.originalPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 250px" v-model="oForm.store" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="兑换方式" :label-width="formLabelWidth">
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
                    :required="true"
                    v-if="oForm.change_type==1||oForm.change_type==3"
                    label="所需金币数量"
                    onkeyup="this.value=this.value.replace(/\D/g,'')"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.gold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.change_type==2||oForm.change_type==3"
                    label="所需RMB"
                    onkeyup="this.value=this.value.replace(/\D/g,'')"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.money" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="生效方式"
                    :label-width="formLabelWidth"
                    v-if="oForm.commodity_type!=1"
                >
                    <el-select v-model="oForm.effectiveType" placeholder="请选择生效方式">
                        <el-option
                            v-for="item in effectiveType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.effectiveType==1 && oForm.commodity_type!=1"
                    label="领取后几天开始生效"
                    onkeyup="this.value=this.value.replace(/\D/g,'')"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oForm.laterDays" autocomplete="off" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="有效期："
                    :label-width="formLabelWidth"
                    v-if="oForm.commodity_type!=1 && oForm.effectiveType==2"
                >
                    <el-date-picker
                        v-model="oForm.startEffectiveDate"
                        type="datetime"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>至
                    <el-date-picker
                        v-model="oForm.endEffectiveDate"
                        type="datetime"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="有效期天数" :label-width="formLabelWidth"  v-if="oForm.effectiveType!=2">
                    <el-input style="width: 250px" placeholder="自领取之日起计算" v-model="oForm.expireDay" autocomplete="off" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="是否今日大牌" :label-width="formLabelWidth">
                    <el-select v-model="oForm.topStatus" placeholder="请选择">
                        <el-option
                            v-for="item in topStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="是否精品推荐" :label-width="formLabelWidth">
                    <el-select v-model="oForm.recommendStatus" placeholder="请选择">
                        <el-option
                            v-for="item in topStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="上架状态" :label-width="formLabelWidth">
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
                    :required="true"
                    v-if="oForm.commodity_type==2"
                    label="选择优惠券"
                    :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="所选优惠券"
                    :label-width="formLabelWidth"
                    v-if="oForm.commodity_type==2&&selectedSell.length>0"
                >
                    <div
                        v-for="(item, index) in selectedSell"
                        style="margin-bottom: 5px"
                        :key="index"
                    >
                        <el-input
                            style="width: 250px"
                            v-model="item.name"
                            autocomplete="off"
                            :value="item.id"
                            :disabled="true"
                            :change="one(item.id)"
                        ></el-input>
                        <span style="color:red;cursor: pointer;" @click="deleteSell()">删除</span>
                    </div>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.commodity_type==3"
                    label="选择券包"
                    :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="changeCoupon">点击选择</el-button>
                </el-form-item>
                <el-form-item
                    v-if="couponId&&oForm.commodity_type==3"
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
                <el-form-item :required="true" label="是否指定日期可以兑换" :label-width="formLabelWidth">
                    <el-select v-model="oForm.assign_type" placeholder="请选择指定日期" @change="clearAssignType()">
                        <el-option
                            v-for="item in assignType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
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
                    :required="true"
                    v-if="oForm.assign_type==3"
                    label="输入每月几号"
                    :label-width="formLabelWidth"
                >
                    <el-select v-model="oForm.assign_info">
                        <el-option
                                v-for="item in days"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.assign_type==4"
                    label="输入每月第几周"
                    :label-width="formLabelWidth"
                >
                    <el-select v-model="oForm.assign_info">
                        <el-option
                                v-for="item in weeks"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oForm.assign_type==5"
                    label="输入每周几"
                    :label-width="formLabelWidth"
                >
                    <el-select v-model="oForm.assign_info">
                        <el-option
                                v-for="item in dates"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="是否限制一段时间内可兑换数量" :label-width="formLabelWidth">
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
                    :required="true"
                >
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 250px" v-model="oForm.limit_number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                        v-model="oForm.sort"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="商品类型" :label-width="formLabelWidth">
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
                    :required="true"
                >
                    <el-input style="width: 250px" v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="商品图片" :label-width="formLabelWidth">
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
                        ref="download"
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
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸200*200或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="兑换须知" :label-width="formLabelWidth">
                    <el-input
                        style="width: 360px"
                        type="textarea"
                        show-word-limit
                        maxlength="100"
                        v-model="form.memo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="详情" :label-width="formLabelWidth">
                    <mavon-editor
                        class="markdown-body"
                        v-model="form.markdown"
                        ref="md"
                        @change="changeFormMarkdown"
                        @imgAdd="$imgAdd"
                        @imgDel="$imgDel"
                    />
                </el-form-item>
                <el-form-item v-if="form.commodityType==1" :required="true" label="原价" :label-width="formLabelWidth">
                    <el-input style="width: 250px" onkeyup="this.value=this.value.replace(/\D/g,'')" v-model="form.originalPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                    <el-input style="width: 250px" onkeyup="this.value=this.value.replace(/\D/g,'')"  v-model="form.store" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="兑换方式" :label-width="formLabelWidth">
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
                    :required="true"
                >
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')"  style="width: 250px" v-model="form.gold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="form.changeType==2||form.changeType==3"
                    label="所需RMB"
                    :label-width="formLabelWidth"
                    :required="true"
                >
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')"  style="width: 250px" v-model="form.money" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="生效方式"
                    :label-width="formLabelWidth"
                    v-if="form.commodityType!=1"
                >
                    <el-select v-model="oEffectiveType" placeholder="请选择生效方式">
                        <el-option
                            v-for="item in effectiveType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="oEffectiveType==1 && form.commodityType!=1"
                    label="领取后几天开始生效"
                    :label-width="formLabelWidth"
                >
                    <el-input style="width: 250px" v-model="oLaterDays" autocomplete="off" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
                </el-form-item>
                <el-form-item
                    :required="true"
                    label="有效期："
                    :label-width="formLabelWidth"
                    v-if="form.commodityType!=1 && oEffectiveType==2"
                >
                    <el-date-picker
                        v-model="oStartEffectiveDate"
                        type="datetime"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>至
                    <el-date-picker
                        v-model="oEndEffectiveDate"
                        type="datetime"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="有效期天数" :label-width="formLabelWidth" v-if="oEffectiveType!=2">
                    <el-input style="width: 250px" placeholder="自领取之日起计算" v-model="form.expireDay" autocomplete="off" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="允许兑换的门店" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="oCheckedCities" :max="1" @change="changeCinema">
                        <el-checkbox
                            v-for="city in oCities"
                            :label="city.cinemaCode"
                            :key="city.cinemaCode"
                            :value="city.cinemaCode"
                        >{{city.cinemaName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="是否今日大牌" :label-width="formLabelWidth">
                    <el-select v-model="oTopstatus" placeholder="请选择">
                        <el-option
                            v-for="item in topStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="是否精品推荐" :label-width="formLabelWidth">
                    <el-select v-model="oRecommendStatus" placeholder="请选择">
                        <el-option
                            v-for="item in topStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="上架状态" :label-width="formLabelWidth">
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
                    :required="true"
                    v-if="form.commodityType==2"
                    label="选择优惠券"
                    :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="openNext">点击选择</el-button>
                </el-form-item>
                <el-form-item
                    label="所选优惠券"
                    :label-width="formLabelWidth"
                    v-if="form.commodityType==2&&selectedSell.length>0"
                    :required="true"
                >
                    <div
                        v-for="(item, index) in selectedSell"
                        style="margin-bottom: 5px"
                        :key="index"
                    >
                        <el-input
                            style="width: 250px"
                            v-model="item.name"
                            autocomplete="off"
                            :value="item.id"
                            :disabled="true"
                            :change="one(item.id)"
                        ></el-input>
                        <span style="color:red;cursor: pointer;" @click="deleteSell()">删除</span>
                    </div>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="form.commodityType==3"
                    label="选择券包"
                    :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="changeCoupon">点击选择</el-button>
                </el-form-item>
                <el-form-item
                    v-if="couponId&&form.commodityType==3"
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
                <el-form-item :required="true" label="是否指定日期可以兑换" :label-width="formLabelWidth">
                    <el-select v-model="form.assignType" placeholder="请选择指定日期" @change="clearAssignType()">
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
                    :required="true"
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
                    :required="true"
                >
                    <el-select v-model="form.assignInfo">
                        <el-option
                                v-for="item in days"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="form.assignType==4"
                    label="输入每月第几周"
                    :label-width="formLabelWidth"
                    :required="true"
                >
                    <el-select v-model="form.assignInfo">
                        <el-option
                                v-for="item in weeks"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :required="true"
                    v-if="form.assignType==5"
                    label="输入每周几"
                    :label-width="formLabelWidth"
                >
                    <el-select v-model="form.assignInfo">
                        <el-option
                                v-for="item in dates"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="是否限制一段时间内可兑换数量" :label-width="formLabelWidth">
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
                    :required="true"
                >
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')"  style="width: 250px" v-model="form.limitNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input
                        style="width: 250px"
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                        v-model="form.sort"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增优惠券弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择优惠券" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.name" placeholder="优惠券名称" class="handle-input mr12"></el-input>
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
                            <el-radio
                                v-model="id"
                                :label="scope.$index"
                                @change.native="getCurrentRow(scope.$index)"
                            >&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="优惠券名称">
                        <template slot-scope="scope">{{scope.row.name}}</template>
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
                                v-for="(item, index) in scope.row.couponList"
                                :key="index"
                            >{{item.couponName}}x{{item.number}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            @size-change="bHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.bPageNo"
                            :page-sizes="[10, 15, 20, 30]"
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
            img_file: {},
            oTopstatus: '',
            oRecommendStatus: '',
            oEffectiveType: '',
            oLaterDays: '',
            oStartEffectiveDate: '',
            oEndEffectiveDate: '',
            type: {
                type: ''
            },
            oName: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                aPageNo: 1,
                aPageSize: 15,
                bPageNo: 1,
                bPageSize: 15
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
                cinemaCodes: '',
                details: '',
                markdown: '',
                assignInfo:'',
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
                commodity_type: '1',
                details: '',
                markdown: '',
                effectiveType: '1',
                laterDays: '',
                startEffectiveDate: '',
                endEffectiveDate: '',
                assign_info:''
            },

            formLabelWidth: '120px',
            selectValue: {},
            days:[
                {
                    value: '1',
                    label: '1'
                },
                {
                    value: '2',
                    label: '2'
                },
                {
                    value: '3',
                    label: '3'
                },
                {
                    value: '4',
                    label: '4'
                },
                {
                    value: '5',
                    label: '5'
                },
                {
                    value: '6',
                    label: '6'
                },
                {
                    value: '7',
                    label: '7'
                },
                {
                    value: '8',
                    label: '8'
                },
                {
                    value: '9',
                    label: '9'
                },
                {
                    value: '10',
                    label: '10'
                },
                {
                    value: '11',
                    label: '11'
                },
                {
                    value: '12',
                    label: '12'
                },
                {
                    value: '13',
                    label: '13'
                },
                {
                    value: '14',
                    label: '14'
                },
                {
                    value: '15',
                    label: '15'
                },
                {
                    value: '16',
                    label: '16'
                },
                {
                    value: '17',
                    label: '17'
                },
                {
                    value: '18',
                    label: '18'
                },
                {
                    value: '19',
                    label: '19'
                },
                {
                    value: '20',
                    label: '20'
                },
                {
                    value: '21',
                    label: '21'
                },
                {
                    value: '22',
                    label: '22'
                },
                {
                    value: '23',
                    label: '23'
                },
                {
                    value: '24',
                    label: '24'
                },
                {
                    value: '25',
                    label: '25'
                },
                {
                    value: '26',
                    label: '26'
                },
                {
                    value: '27',
                    label: '27'
                },
                {
                    value: '28',
                    label: '28'
                },
                {
                    value: '29',
                    label: '29'
                },
                {
                    value: '30',
                    label: '30'
                },
                {
                    value: '31',
                    label: '31'
                },
            ],
            weeks:[
                {
                    value: '1',
                    label: '1'
                },
                {
                    value: '2',
                    label: '2'
                },
                {
                    value: '3',
                    label: '3'
                },
                {
                    value: '4',
                    label: '4'
                },
                {
                    value: '5',
                    label: '5'
                },
            ],
            dates:[
                {
                    value: '1',
                    label: '1'
                },
                {
                    value: '2',
                    label: '2'
                },
                {
                    value: '3',
                    label: '3'
                },
                {
                    value: '4',
                    label: '4'
                },
                {
                    value: '5',
                    label: '5'
                },
                {
                    value: '6',
                    label: '6'
                },
                {
                    value: '7',
                    label: '7'
                },
            ],
            effectiveType: [
                {
                    value: '1',
                    label: '领取后固定天数之后生效'
                },
                {
                    value: '2',
                    label: '固定时间段'
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
                },
                {
                    value: '3',
                    label: '券包'
                }
            ],
            assignType: [
                {
                    value: '1',
                    label: '不设置指定日期'
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
            sellIndex: '',
            timeout: null,
            selectFilm: {},
            filmInfo: [],
            cinemaInfo: [],
            sellTableData: [],
            selectedSell: [],
            drawer: false, //选择优惠券弹出框,
            ticketIds: '',
            couponList: [],
            drawerCoupon: false,
            couponId: '',
            groupName: ''
        };
    },
    components: { quillEditor },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
        clearAssignType(){
            this.oForm.assign_info='';
            this.form.assignInfo='';
        },
        deletCoupon() {
            this.groupName = '';
            this.couponId = '';
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
        // 更换券包
        changeCoupon() {
            let groupName = this.query.groupName;
            if (!groupName) {
                groupName = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'cinemaCodes', value: this.checkedCities[0] });
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
        one(a) {
            //获取影片绑定的value值
            this.ticketIds = a;
        },
        getCinemaCode(val) {
            this.checkedCities = val;
            console.log(this.checkedCities);
        },
        getCurrentRow(index) {
            //优惠券弹出框index
            this.sellIndex = index;
        },
        sureNext() {
            if (this.sellIndex >= 0) {
                this.selectedSell = [];
                this.selectedSell.push(this.sellTableData[this.sellIndex]);
            }
            this.drawer = false;
        },
        openNext() {
            //获取优惠券列表
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            setTimeout(() => {
                let name = this.query.name;
                if (!name) {
                    name = '';
                }
                let jsonArr = [];
                jsonArr.push({ key: 'name', value: name });
                jsonArr.push({ key: 'cinemaCode', value: this.checkedCities[0] });
                // jsonArr.push({ key: 'simpleType', value: '1' });
                // jsonArr.push({ key: 'status', value: '1' });
                jsonArr.push({ key: 'pageNo', value: this.query.aPageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.aPageSize });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('merchandiseCoupon/getCouponByCinemaCode', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        if (data.data.code == 'success') {
                            this.drawer = true;
                            var oData = JSON.parse(Decrypt(data.data.data));
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
            }, 500);
        },
        change() {
            console.log(this.form.changeType);
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
            if (!this.oForm.commodity_type) {
                this.message = '商品类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.commodity_type==1){
                if (!this.oForm.name) {
                    this.message = '商品名称不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.originalPrice) {
                    this.message = '原价不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.originalPrice<=0) {
                    this.message = '原价必须大于0！';
                    this.open();
                    loading.close();
                    return;
                }

            }
            if (!this.oForm.image_url) {
                this.message = '商品图片不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.checkedCities.length==0) {
                this.message = '允许兑换的门店不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.details) {
                this.message = '详情不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.store&&this.oForm.store!=0) {
                this.message = '库存不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oForm.store<0) {
                this.message = '库存不能小于0，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.change_type) {
                this.message = '兑换方式不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.change_type==1||this.oForm.change_type==3){
                if (!this.oForm.gold&&this.oForm.gold!=0) {
                    this.message = '所需金币数量不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.gold<=0) {
                    this.message = '所需金币数量必须大于0，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.change_type==2||this.oForm.change_type==3){
                if (!this.oForm.money&&this.oForm.money!=0) {
                    this.message = '所需RMB不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.money<=0) {
                    this.message = '所需RMB必须大于0，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.commodity_type!=1){
                if (!this.oForm.effectiveType) {
                    this.message = '生效方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.effectiveType==1 && this.oForm.commodity_type!=1){
                if (!this.oForm.laterDays) {
                    this.message = '领取后几天开始生效不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.laterDays<0) {
                    this.message = '领取后几天开始生效不能小于0，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.commodity_type!=1 && this.oForm.effectiveType==2){
                if (!this.oForm.startEffectiveDate||!this.oForm.endEffectiveDate) {
                    this.message = '有效期不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.effectiveType!=2){
                if (!this.oForm.expireDay) {
                    this.message = '有效期天数不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.expireDay<0) {
                    this.message = '有效期天数不能小于0，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oForm.topStatus) {
                this.message = '是否今日大牌不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.recommendStatus) {
                this.message = '是否精品推荐不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oForm.status) {
                this.message = '上架状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.commodity_type==2){
                if (this.selectedSell.length==0) {
                    this.message = '所选优惠券不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.commodity_type==3){
                if (!this.groupName) {
                    this.message = '所选券包不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oForm.assign_type) {
                this.message = '是否指定日期可以兑换不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.assign_type==2){
                if (!this.oForm.assign_info) {
                    this.message = '指定日期不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.assign_type==3){
                if (!this.oForm.assign_info) {
                    this.message = '每月几号不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.assign_type==4){
                if (!this.oForm.assign_info) {
                    this.message = '每月第几周不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oForm.assign_type==5){
                if (!this.oForm.assign_info) {
                    this.message = '每周几不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oForm.limit_type) {
                this.message = '是否限制一段时间内可兑换数量不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.oForm.limit_type==2||this.oForm.limit_type==3||this.oForm.limit_type==4){
                if (!this.oForm.limit_number) {
                    this.message = '限制兑换数量不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.limit_number<=0) {
                    this.message = '限制兑换数量必须大于0！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (this.filmInfo) {
                let couponList = []; //优惠券编码
                for (let x in this.filmInfo) {
                    couponList.push(this.filmInfo[x].address);
                }
                this.oForm.ticket_ids = couponList.join(',');
            }
            var jsonArr = [];
            jsonArr.push({ key: 'effectiveType', value: this.oForm.effectiveType });
            jsonArr.push({ key: 'imageUrl', value: this.oForm.image_url });
            jsonArr.push({ key: 'memo', value: this.oForm.memo });
            jsonArr.push({ key: 'store', value: this.oForm.store });
            jsonArr.push({ key: 'changeType', value: this.oForm.change_type });
            jsonArr.push({ key: 'gold', value: this.oForm.gold });
            jsonArr.push({ key: 'money', value: this.oForm.money });
            jsonArr.push({ key: 'cinemaCodes', value: this.checkedCities });
            jsonArr.push({ key: 'status', value: this.oForm.status });
            jsonArr.push({ key: 'commodityType', value: this.oForm.commodity_type });
            jsonArr.push({ key: 'assignType', value: this.oForm.assign_type });
            jsonArr.push({ key: 'assignInfo', value: this.oForm.assign_info });
            jsonArr.push({ key: 'limitType', value: this.oForm.limit_type });
            jsonArr.push({ key: 'limitNumber', value: this.oForm.limit_number });
            jsonArr.push({ key: 'details', value: this.content });
            jsonArr.push({ key: 'markdown', value: this.oForm.markdown });
            jsonArr.push({ key: 'originalPrice', value: this.oForm.originalPrice });
            jsonArr.push({ key: 'topStatus', value: this.oForm.topStatus });
            jsonArr.push({ key: 'recommendStatus', value: this.oForm.recommendStatus });
            jsonArr.push({ key: 'expireDay', value: this.oForm.expireDay });
            jsonArr.push({ key: 'sort', value: this.oForm.sort });
            if (this.oForm.commodity_type == 3) {
                jsonArr.push({ key: 'ticketIds', value: this.couponId });
                jsonArr.push({ key: 'name', value: this.groupName });
            } else {
                jsonArr.push({ key: 'name', value: this.oForm.name });
                jsonArr.push({ key: 'ticketIds', value: this.ticketIds });
            }
            if (this.oForm.commodity_type != 1) {
                if (this.oForm.effectiveType == 1) {
                    jsonArr.push({ key: 'laterDays', value: this.oForm.laterDays });
                } else {
                    jsonArr.push({ key: 'startEffectiveDate', value: this.oForm.startEffectiveDate });
                    jsonArr.push({ key: 'endEffectiveDate', value: this.oForm.endEffectiveDate });
                }
            }
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
                            this.selectedSell = [];
                            this.oForm.store = '';
                            this.oForm.change_type = '1';
                            this.oForm.effectiveType = '1';
                            this.oForm.laterDays = '';
                            this.oForm.expireDay = '';
                            this.oForm.startEffectiveDate = '';
                            this.oForm.endEffectiveDate = '';
                            this.oForm.gold = '';
                            this.oForm.money = '';
                            this.oForm.checkedCities = '';
                            this.oForm.status = '';
                            this.oForm.commodity_type = '';
                            this.oForm.ticketIds = '';
                            this.oForm.assign_type = '';
                            this.oForm.assign_info = '';
                            this.oForm.limit_type = '';
                            this.oForm.limit_number = '';
                            this.oForm.details = '';
                            this.oForm.markdown = '';
                            this.oForm.originalPrice = '';
                            this.oForm.topStatus = '';
                            this.oForm.recommendStatus = '';
                            this.oForm.sort = '';
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
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = true;
                            //优惠券
                            if (
                                JSON.parse(Decrypt(data.data.data)).goldCommodity.ticketIds &&
                                JSON.parse(Decrypt(data.data.data)).goldCommodity.name
                            ) {
                                let id = JSON.parse(Decrypt(data.data.data)).goldCommodity.ticketIds;
                                let name = JSON.parse(Decrypt(data.data.data)).goldCommodity.name;
                                this.selectedSell = [];
                                let json = {};
                                json.id = id;
                                json.name = name;
                                this.selectedSell.push(json);
                            }
                            this.form.name = JSON.parse(Decrypt(data.data.data)).goldCommodity.name;
                            this.form.image_url = JSON.parse(Decrypt(data.data.data)).goldCommodity.imageUrl;
                            this.form.memo = JSON.parse(Decrypt(data.data.data)).goldCommodity.memo;
                            this.form.store = JSON.parse(Decrypt(data.data.data)).goldCommodity.store;
                            this.form.expireDay = JSON.parse(Decrypt(data.data.data)).goldCommodity.expireDay;
                            this.form.originalPrice = JSON.parse(Decrypt(data.data.data)).goldCommodity.originalPrice;
                            this.form.markdown = JSON.parse(Decrypt(data.data.data)).goldCommodity.markdown;
                            this.form.alredyChangedNumber = JSON.parse(Decrypt(data.data.data)).goldCommodity.alredyChangedNumber;
                            this.form.gold = JSON.parse(Decrypt(data.data.data)).goldCommodity.gold;
                            this.form.money = JSON.parse(Decrypt(data.data.data)).goldCommodity.money;
                            this.form.cinemaCodes = JSON.parse(Decrypt(data.data.data)).goldCommodity.cinemaCodes;
                            this.oCheckedCities = this.form.cinemaCodes.split(',');
                            this.form.status = JSON.parse(Decrypt(data.data.data)).goldCommodity.status;
                            this.form.commodityType = JSON.parse(Decrypt(data.data.data)).goldCommodity.commodityType;
                            this.oTopstatus = JSON.parse(Decrypt(data.data.data)).goldCommodity.topStatus;
                            this.ticketIds = JSON.parse(Decrypt(data.data.data)).goldCommodity.ticketIds;
                            this.couponId = JSON.parse(Decrypt(data.data.data)).goldCommodity.ticketIds;
                            this.groupName = JSON.parse(Decrypt(data.data.data)).goldCommodity.name;
                            this.form.assignType = JSON.parse(Decrypt(data.data.data)).goldCommodity.assignType;
                            this.form.assignInfo = JSON.parse(Decrypt(data.data.data)).goldCommodity.assignInfo;
                            this.form.limitType = JSON.parse(Decrypt(data.data.data)).goldCommodity.limitType;
                            this.form.limitNumber = JSON.parse(Decrypt(data.data.data)).goldCommodity.limitNumber;
                            this.form.sort = JSON.parse(Decrypt(data.data.data)).goldCommodity.sort;
                            this.oCities = JSON.parse(Decrypt(data.data.data)).cinemas;
                            this.oLaterDays = JSON.parse(Decrypt(data.data.data)).goldCommodity.laterDays;
                            this.oStartEffectiveDate = JSON.parse(Decrypt(data.data.data)).goldCommodity.startEffectiveDate;
                            this.oEndEffectiveDate = JSON.parse(Decrypt(data.data.data)).goldCommodity.endEffectiveDate;
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
                            //是否精品推荐下拉选显示对应的选项
                            for (let x in this.topStatusList) {
                                if (this.topStatusList[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.recommendStatus) {
                                    this.oRecommendStatus = this.topStatusList[x].value;
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

                            //生效方式下拉选显示对应的选项
                              console.log(typeof JSON.parse(Decrypt(data.data.data)).goldCommodity.effectiveType);
                            for (let x in this.effectiveType) {
                                if (this.effectiveType[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.effectiveType) {
                                    this.oEffectiveType = this.effectiveType[x].value;
                                    break;
                                }
                            }
                            console.log(this.oEffectiveType)
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
            if (!this.form.commodityType) {
                this.message = '商品类型不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.form.commodityType==1){
                if (!this.form.name) {
                    this.message = '商品名称不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.form.originalPrice) {
                    this.message = '原价不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.form.originalPrice<=0) {
                    this.message = '原价必须大于0！';
                    this.open();
                    loading.close();
                    return;
                }

            }
            if (!this.form.image_url) {
                this.message = '商品图片不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.oCheckedCities.length==0) {
                this.message = '允许兑换的门店不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.form.markdown) {
                this.message = '详情不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.form.store&&this.form.store!=0) {
                this.message = '库存不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (this.form.store<0) {
                this.message = '库存不能小于0，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.form.changeType) {
                this.message = '兑换方式不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.form.changeType==1||this.form.changeType==3){
                if (!this.form.gold&&this.form.gold!=0) {
                    this.message = '所需金币数量不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.form.gold<=0) {
                    this.message = '所需金币数量必须大于0，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.form.changeType==2||this.form.changeType==3){
                if (!this.form.money&&this.form.money!=0) {
                    this.message = '所需RMB不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.form.money<=0) {
                    this.message = '所需RMB必须大于0，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.form.commodityType!=1){
                if (!this.oEffectiveType) {
                    this.message = '生效方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oEffectiveType==1 && this.form.commodityType!=1){
                if (!this.oLaterDays) {
                    this.message = '领取后几天开始生效不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oLaterDays<0) {
                    this.message = '领取后几天开始生效不能小于0，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.form.commodityType!=1 && this.oEffectiveType==2){
                if (!this.oStartEffectiveDate||!this.oEndEffectiveDate) {
                    this.message = '有效期不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.oEffectiveType!=2){
                if (!this.form.expireDay&&this.form.expireDay!=0) {
                    this.message = '有效期天数不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.form.expireDay<0) {
                    this.message = '有效期天数不能小于0，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.oTopstatus) {
                this.message = '是否今日大牌不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.oRecommendStatus) {
                this.message = '是否精品推荐不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if (!this.form.status) {
                this.message = '上架状态不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.form.commodityType==2){
                if (this.selectedSell.length==0) {
                    this.message = '所选优惠券不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.form.commodityType==3){
                if (!this.groupName) {
                    this.message = '所选券包不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.form.assignType) {
                this.message = '是否指定日期可以兑换不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.form.assignType==2){
                if (!this.form.assignInfo) {
                    this.message = '指定日期不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.form.assignType==3){
                if (!this.form.assignInfo) {
                    this.message = '每月几号不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.form.assignType==4){
                if (!this.form.assignInfo) {
                    this.message = '每月第几周不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if(this.form.assignType==5){
                if (!this.form.assignInfo) {
                    this.message = '每周几不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            if (!this.form.limitType) {
                this.message = '是否限制一段时间内可兑换数量不能为空，请检查！';
                this.open();
                loading.close();
                return;
            }
            if(this.form.limitType==2||this.form.limitType==3||this.form.limitType==4){
                if (!this.form.limitNumber) {
                    this.message = '限制兑换数量不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.form.limitNumber<=0) {
                    this.message = '限制兑换数量必须大于0！';
                    this.open();
                    loading.close();
                    return;
                }
            }
            setTimeout(() => {
                // console.log(this.from.sort.toString());
                var jsonArr = [];
                this.form.cinemaCode = this.oCheckedCities.join(',');
                jsonArr.push({ key: 'id', value: this.form.id });
                jsonArr.push({ key: 'effectiveType', value: this.oEffectiveType });
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
                jsonArr.push({ key: 'assignType', value: this.form.assignType });
                jsonArr.push({ key: 'assignInfo', value: this.form.assignInfo });
                jsonArr.push({ key: 'limitType', value: this.form.limitType });
                jsonArr.push({ key: 'limitNumber', value: this.form.limitNumber });
                jsonArr.push({ key: 'details', value: this.form.details });
                jsonArr.push({ key: 'markdown', value: this.form.markdown });
                jsonArr.push({ key: 'originalPrice', value: this.form.originalPrice });
                jsonArr.push({ key: 'expireDay', value: this.form.expireDay });
                jsonArr.push({ key: 'topStatus', value: this.oTopstatus });
                jsonArr.push({ key: 'recommendStatus', value: this.oRecommendStatus });
                jsonArr.push({ key: 'sort', value: this.form.sort });
                if (this.form.commodityType == 2) {
                    jsonArr.push({ key: 'ticketIds', value: this.ticketIds });
                }
                if (this.form.commodityType == 3) {
                    jsonArr.push({ key: 'ticketIds', value: this.couponId });
                }
                if (this.form.commodityType == 3) {
                    jsonArr.push({ key: 'name', value: this.groupName });
                } else {
                    jsonArr.push({ key: 'name', value: this.form.name });
                }
                if (this.form.commodityType != 1) {
                    if (this.oEffectiveType == 1) {
                        jsonArr.push({ key: 'laterDays', value: this.oLaterDays });
                    }
                    if (this.oEffectiveType == 2) {
                        jsonArr.push({ key: 'startEffectiveDate', value: this.oStartEffectiveDate });
                        jsonArr.push({ key: 'endEffectiveDate', value: this.oEndEffectiveDate });
                    }
                }
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('goldCommodity/updateById', params)
                    .then(data => {
                        loading.close();
                        // console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = false;
                            this.$message.success(`编辑成功`);
                            this.$refs.download.clearFiles();
                            this.selectedSell = [];
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
                let cinemaCodes = this.query.cinemaCode;
                let status = this.query.status;
                let changeType = this.query.changeType;
                let commodityType = this.query.commodityType;
                if (!cinemaCodes) {
                    cinemaCodes = '';
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
                jsonArr.push({ key: 'cinemaCodes', value: cinemaCodes });
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
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            console.log(oData)
                            this.tableData = oData.data;
                            this.query.pageSize = oData.pageSize;
                            this.query.pageNo = oData.pageNo;
                            this.query.totalCount = oData.totalCount;
                            this.query.totalPage = oData.totalPage;
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
            }, 500);
        },
        // 获取所有影院
        getAllCinema() {
            https
                .fetchPost('/cinema/getAllCinema')
                .then(data => {
                    if (data.data.code == 'success') {
                        var res = JSON.parse(Decrypt(data.data.data));
                        this.cinemaInfo = res;
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
            this.oForm.image_url = data.data;
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
            this.openNext()
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
        //新增优惠券页面
        aCurrentChange(val) {
            //点击选择具体页数
            this.query.aPageNo = val;
            this.openNext();
        },
        bHandleSizeChange(val) {
            this.query.bPageSize=val;
            this.changeCoupon()
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
        $imgAdd(pos, $file) {
            const isLt2M = $file.size / 1024 < 300;
            if (!isLt2M) {
                this.message = '上传图片大小不能超过 200kb!';
                this.open();
                delete this.img_file[pos];
                return;
            }
            var formdata = new FormData();
            formdata.append('file', $file);
            formdata.append('type', EncryptReplace('business'));
            this.img_file[pos] = $file;
            const instance = axios.create({
                withCredentials: true
            });
            instance.post('/upload/uploadImage', formdata, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
                let _res = res.data;
                this.$refs.md.$img2Url(pos, _res.data);
            });
        },
        $imgDel(pos) {
            delete this.img_file[pos];
        },
        changeMarkdown(value, render) {
            this.oForm.markdown = value;
            this.content = render;
        },
        changeFormMarkdown(value, render) {
            this.form.markdown = value;
            this.form.details = render;
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
