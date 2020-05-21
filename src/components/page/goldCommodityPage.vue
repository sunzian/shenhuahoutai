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
                        v-model="query.partnerCode"
                        placeholder="请选择商户"
                        class="handle-input mr10"
                >
                    <el-option
                            v-for="item in partnerInfo"
                            :key="item.partnerCode"
                            :label="item.partnerName"
                            :value="item.partnerCode"
                    ></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="商品名称" class="handle-input mr10"></el-input>
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
                    <el-option key="4" label="商户商品" value="4"></el-option>
                    <el-option key="5" label="权益卡" value="5"></el-option>
                </el-select>
                <el-select
                        clearable
                        v-model="query.topStatus"
                        placeholder="是否今日大牌"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="否" value="1"></el-option>
                    <el-option key="2" label="是" value="2"></el-option>
                </el-select>
                <el-select
                        clearable
                        v-model="query.recommendStatus"
                        placeholder="是否推荐"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="否" value="1"></el-option>
                    <el-option key="2" label="是" value="2"></el-option>
                </el-select>
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
                >新增
                </el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="sort" label="允许兑换的门店" width="240">
                    <template slot-scope="scope">{{scope.row.cinemaNames}}</template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" width="260">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="商品图片" width="90">
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
                <el-table-column prop="sort" label="取货方式" width="130">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.supportExpressStatus=='1'">自提</el-tag>
                        <el-tag v-else-if="scope.row.supportExpressStatus=='2'">快递</el-tag>
                        <el-tag v-else-if="scope.row.supportExpressStatus=='3'">自提加快递</el-tag>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="sort" label="快递费用" width="110">-->
                <!--<template slot-scope="scope">{{scope.row.expressFee}}</template>-->
                <!--</el-table-column>-->
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
                        <el-tag v-else-if="scope.row.commodityType=='4'">商品</el-tag>
                        <el-tag v-else-if="scope.row.commodityType=='5'">权益卡</el-tag>
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
                <!-- <el-table-column prop="sort" label="是否限购" width="160">
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
                <!-- <el-table-column prop="sort" label="限购数量" width="160">
                    <template slot-scope="scope">{{scope.row.limitNumber}}</template>
                </el-table-column>-->
                <el-table-column label="操作" width="140" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="addChange(scope.$index, scope.row)"
                        >编辑
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
        <el-dialog :close-on-click-modal="false" title="新增商品" :visible.sync="dialogFormVisible">
            <el-form v-model="oForm">
                <el-form-item :required="true" label="允许兑换的门店" :label-width="formLabelWidth">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <el-checkbox-group v-model="oCheckedCities" @change="getCinemaCode">
                        <el-checkbox
                                v-for="city in cities"
                                :label="city.cinemaCode"
                                :key="city.cinemaCode"
                                :value="city.cinemaCode"
                        >{{city.cinemaName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="商品类型" :label-width="formLabelWidth">
                    <el-select v-model="oForm.commodity_type" placeholder="请选择商品类型" @change="changeAddType">
                        <el-option
                                v-for="item in commodityType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="商品类别" :label-width="formLabelWidth">
                    <el-select v-model="oForm.commodityCategory" placeholder="请选择商品类别">
                        <el-option
                                v-for="item in commodityCategoryType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        v-if="oForm.commodity_type==4"
                        :required="true"
                        label="选择商户"
                        :label-width="formLabelWidth"
                >
                    <el-button size="small" type="primary" @click="getPartner()">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        v-if="partnerCode&&oForm.commodity_type==4"
                        label="所选商户："
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input
                            style="width: 280px"
                            v-model="partnerName"
                            autocomplete="off"
                            disabled
                    ></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                            v-if="partnerName"
                            style="color:red;cursor: pointer;"
                            @click="deletPartner"
                    >删除</span>
                </el-form-item>
                <el-form-item v-if="oForm.commodity_type==4||oForm.commodity_type==1" :required="true" label="取货方式"
                              :label-width="formLabelWidth">
                    <el-select v-model="oForm.supportExpressStatus" placeholder="请选择取货方式">
                        <el-option
                                v-for="item in supportType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        v-if="oForm.commodity_type==4 && oForm.supportExpressStatus == 1"
                        :required="true"
                        label="领取方式"
                        :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="oForm.pickupType">
                        <el-radio label="1">到影院领取</el-radio>
                        <el-radio label="2">到商户门店领取</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :required="true"
                        v-if="oForm.commodity_type==1||oForm.commodity_type==4"
                        label="商品名称"
                        :label-width="formLabelWidth"
                >
                    <el-input placeholder="限15个汉字" style="width: 250px" v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="商品图片" :label-width="formLabelWidth">
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
                <el-form-item
                        :required="true"
                        v-if="oForm.commodity_type==1||oForm.commodity_type==4"
                        label="原价"
                        :label-width="formLabelWidth"
                >
                    <el-input
                            style="width: 250px"
                            v-model.trim="oForm.originalPrice"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                            placeholder="请输入正确的数字"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="兑换方式" :label-width="formLabelWidth"
                              v-if="oForm.commodity_type != 5">
                    <el-select v-model="oForm.change_type" placeholder="请选择兑换方式" @change="clearList()">
                        <el-option
                                v-for="item in showType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="兑换方式" :label-width="formLabelWidth" v-else>
                    <el-select v-model="oForm.change_type" placeholder="请选择兑换方式" @change="clearList()">
                        <el-option
                                v-for="item in showType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :required="true"
                        v-if="oForm.change_type==1||oForm.change_type==3"
                        label="所需金币数量"
                        :label-width="formLabelWidth"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            style="width: 250px"
                            v-model.trim="oForm.gold"
                            autocomplete="off"
                            placeholder="请输入正确的数字"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        :required="true"
                        v-if="oForm.change_type==2||oForm.change_type==3||oForm.change_type==5"
                        label="所需RMB"
                        :label-width="formLabelWidth"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                            style="width: 250px"
                            v-model.trim="oForm.money"
                            autocomplete="off"
                            placeholder="请输入正确的数字"
                    ></el-input>
                </el-form-item>
                <el-form-item v-if="oForm.commodity_type==1||oForm.commodity_type==4" :required="true" label="是否有多种规格属性" :label-width="formLabelWidth">
                    <el-radio-group v-model="oForm.isUseSku">
                        <el-radio :label="2">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="oForm.isUseSku==1&&(oForm.commodity_type==1||oForm.commodity_type==4)" :required="true" label="商品规格属性" :label-width="formLabelWidth">
                    <el-button
                            type="primary"
                            @click="addUseSku"
                            icon="el-icon-circle-plus-outline"
                    >新增
                    </el-button>
                    <el-table
                            :data="skuList"
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
                        <el-table-column prop="sort" label="库存" width="90">
                            <template slot-scope="scope">{{scope.row.store}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="所需金币数量" width="130">
                            <template slot-scope="scope">{{scope.row.gold}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="所需RMB" width="110">
                            <template slot-scope="scope">{{scope.row.money}}</template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-edit" @click="changeSku(scope.$index, scope.row)"></el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" @click="delSku(scope.$index, scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                    <el-input
                            :disabled="oForm.isUseSku==1"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            style="width: 250px"
                            v-model="oForm.store"
                            autocomplete="off"
                            placeholder="请输入正确的数字"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="优惠券生效方式"
                        :label-width="formLabelWidth"
                        v-if="oForm.commodity_type!=1&&oForm.commodity_type!=4"
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
                        v-if="oForm.effectiveType==1 && oForm.commodity_type!=1&&oForm.commodity_type!=4"
                        label="领取后几天开始生效"
                        :label-width="formLabelWidth"
                >
                    <el-input
                            style="width: 250px"
                            v-model="oForm.laterDays"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="优惠券有效期："
                        :label-width="formLabelWidth"
                        v-if="oForm.commodity_type!=1 && oForm.effectiveType==2&&oForm.commodity_type!=4"
                >
                    <el-date-picker
                            v-model="oForm.startEffectiveDate"
                            type="datetime"
                            placeholder="请选择有效期开始时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                    至
                    <el-date-picker
                            v-model="oForm.endEffectiveDate"
                            type="datetime"
                            placeholder="请选择有效期结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="有效期天数"
                        :label-width="formLabelWidth"
                        v-if="oForm.effectiveType!=2&&oForm.supportExpressStatus==1"
                >
                    <el-input
                            style="width: 250px"
                            placeholder="自兑换之日起计算"
                            v-model.trim="oForm.expireDay"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                    ></el-input>
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
                    <div>可在小程序金币商城今日大牌区展示</div>
                </el-form-item>
                <el-form-item :required="true" label="是否推荐" :label-width="formLabelWidth">
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
                        label="下架日期："
                        :label-width="formLabelWidth"
                >
                    <el-date-picker
                            v-model="oForm.endDate"
                            type="datetime"
                            placeholder="请选择时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="商品基础销量值" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            v-model="oForm.baseSaleNumber"
                            autocomplete="off"
                            placeholder="请输入正确的数字，可不填"
                    ></el-input>
                    <div style="color: red;">
                        小程序展示销量=基础销量+实际销量
                    </div>
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
                <el-form-item
                        :required="true"
                        v-if="oForm.commodity_type==5"
                        label="选择权益卡"
                        :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="changeCard">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        v-if="cardId&&oForm.commodity_type==5"
                        label="所选权益卡："
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input style="width: 150px" v-model="cardName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                            v-if="cardName"
                            style="color:red;cursor: pointer;"
                            @click="deletCard"
                    >删除</span>
                </el-form-item>
                <el-form-item :required="true" label="是否指定日期可以兑换" :label-width="formLabelWidth">
                    <el-select
                            v-model="oForm.assign_type"
                            placeholder="请选择指定日期"
                            @change="clearAssignType()"
                    >
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
                <el-form-item :required="true" label="是否限购" :label-width="formLabelWidth">
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
                        v-if="oForm.limit_type==2||oForm.limit_type==3||oForm.limit_type==4||oForm.limit_type==5"
                        label="限购数量"
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            style="width: 250px"
                            v-model="oForm.limit_number"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            v-model="oForm.sort"
                            autocomplete="off"
                            placeholder="请输入数字，数字越小优先级越高"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="兑换须知" :label-width="formLabelWidth">
                    <el-input
                            style="width: 360px"
                            type="textarea"
                            show-word-limit
                            maxlength="400"
                            :rows="5"
                            v-model="oForm.memo"
                            placeholder="1.可领取时间段2.领取地址3.其他注意事项"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="详情" :label-width="formLabelWidth">
                    <editor-bar v-model="oForm.details" :isClear="isClear" @change="changeMarkdown"></editor-bar>
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
                <el-form-item :required="true" label="允许兑换的门店" :label-width="formLabelWidth">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="oHandleCheckAllChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="oCheckedCities" @change="changeCinema"
                                       v-if="form.commodityCategory != 5">
                        <el-checkbox
                                v-for="city in oCities"
                                :label="city.cinemaCode"
                                :key="city.cinemaCode"
                                :value="city.cinemaCode"
                        >{{city.cinemaName}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="oCheckedCities" @change="changeCinema2" v-else :max="1">
                        <el-checkbox
                                v-for="city in oCities"
                                :label="city.cinemaCode"
                                :key="city.cinemaCode"
                                :value="city.cinemaCode"
                        >{{city.cinemaName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
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
                <el-form-item label="商品类别" :label-width="formLabelWidth">
                    <el-select v-model="oCommodityCategory" placeholder="商品类型">
                        <el-option
                                v-for="item in commodityCategoryType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        v-if="form.commodityType==1 || form.commodityType==4"
                        label="商品名称"
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input placeholder="限15个汉字" style="width: 250px" v-model="oName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                        v-if="form.commodityType==4"
                        :required="true"
                        label="选择商户"
                        :label-width="formLabelWidth"
                >
                    <el-button size="small" type="primary" @click="getPartner()">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        v-if="partnerCode&&form.commodityType==4"
                        label="所选商户："
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input
                            style="width: 280px"
                            v-model="partnerName"
                            autocomplete="off"
                            disabled
                    ></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                            v-if="partnerName"
                            style="color:red;cursor: pointer;"
                            @click="deletPartner"
                    >删除</span>
                </el-form-item>
                <el-form-item v-if="form.commodityType==4||form.commodityType==1" :required="true" label="取货方式" :label-width="formLabelWidth">
                    <el-select v-model="form.supportExpressStatus" placeholder="请选择取货方式">
                        <el-option
                                v-for="item in supportType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        v-if="form.commodityType==4&& form.supportExpressStatus == 1"
                        :required="true"
                        label="领取方式"
                        :label-width="formLabelWidth"
                >
                    <el-radio-group v-model="form.pickupType">
                        <el-radio label="1">到影院领取</el-radio>
                        <el-radio label="2">到商户门店领取</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :required="true" label="商品图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img :src="oImageUrl"/>
                        <img
                                slot="reference"
                                :src="oImageUrl"
                                :alt="oImageUrl"
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
                            :limit="1"
                            :on-exceed="exceed"
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
                        >只能上传jpg/png文件，且不超过200kb 建议尺寸200*200或按比例上传
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item
                        v-if="form.commodityType==1 || form.commodityType==4"
                        :required="true"
                        label="原价"
                        :label-width="formLabelWidth"
                >
                    <el-input
                            style="width: 250px"
                            v-model.trim="form.originalPrice"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                            placeholder="请输入正确的数字"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="兑换方式" :label-width="formLabelWidth"
                              v-if="form.commodityType != 5">
                    <el-select v-model="form.changeType" placeholder="请选择兑换方式" @change="clearList()">
                        <el-option
                                v-for="item in showType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="兑换方式" :label-width="formLabelWidth" v-else>
                    <el-select v-model="form.changeType" placeholder="请选择兑换方式" @change="clearList()">
                        <el-option
                                v-for="item in showType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        v-if="form.changeType==1||form.changeType==3"
                        label="所需金币数量"
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            style="width: 250px"
                            v-model.trim="form.gold"
                            autocomplete="off"
                            placeholder="请输入正确的数字"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        v-if="form.changeType==2||form.changeType==3||form.changeType==5"
                        label="所需RMB"
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                            style="width: 250px"
                            v-model.trim="form.money"
                            autocomplete="off"
                            placeholder="请输入正确的数字"
                    ></el-input>
                </el-form-item>
                <el-form-item v-if="form.commodityType==1||form.commodityType==4" :required="true" label="是否有多种规格属性" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.isUseSku">
                        <el-radio :label="2">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.isUseSku==1" :required="true" label="商品规格属性" :label-width="formLabelWidth">
                    <el-button
                            type="primary"
                            @click="addChangeUseSku"
                            icon="el-icon-circle-plus-outline"
                    >新增
                    </el-button>
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
                        <el-table-column prop="sort" label="库存" width="90">
                            <template slot-scope="scope">{{scope.row.store}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="所需金币数量" width="130">
                            <template slot-scope="scope">{{scope.row.gold}}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="所需RMB" width="110">
                            <template slot-scope="scope">{{scope.row.money}}</template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-edit" @click="changeChangeSku(scope.$index, scope.row)"></el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" @click="delChangeSku(scope.$index, scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                    <el-input
                            :disabled="form.isUseSku==1"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            style="width: 250px"
                            v-model="form.store"
                            autocomplete="off"
                            placeholder="请输入正确的数字"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="优惠券生效方式"
                        :label-width="formLabelWidth"
                        v-if="form.commodityType!=1&&form.commodityType!=4"
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
                        v-if="oEffectiveType==1 && form.commodityType!=1&&form.commodityType!=4"
                        label="领取后几天开始生效"
                        :label-width="formLabelWidth"
                >
                    <el-input
                            style="width: 250px"
                            v-model="oLaterDays"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="优惠券有效期："
                        :label-width="formLabelWidth"
                        v-if="form.commodityType!=1 && oEffectiveType==2&&form.commodityType!=4"
                >
                    <el-date-picker
                            v-model="oStartEffectiveDate"
                            type="datetime"
                            placeholder="请选择有效期开始时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                    至
                    <el-date-picker
                            v-model="oEndEffectiveDate"
                            type="datetime"
                            placeholder="请选择有效期结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                        :required="true"
                        label="有效期天数"
                        :label-width="formLabelWidth"
                        v-if="oEffectiveType!=2&&form.supportExpressStatus==1"
                >
                    <el-input
                            style="width: 250px"
                            placeholder="自兑换之日起计算"
                            v-model.trim="form.expireDay"
                            autocomplete="off"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                    ></el-input>
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
                    <div>可在小程序金币商城今日大牌区展示</div>
                </el-form-item>
                <el-form-item :required="true" label="是否推荐" :label-width="formLabelWidth">
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
                        label="下架日期："
                        :label-width="formLabelWidth"
                >
                    <el-date-picker
                            v-model="form.endDate"
                            type="datetime"
                            placeholder="请选择时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="商品基础销量值" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            v-model="oBaseSaleNumber"
                            autocomplete="off"
                            placeholder="请输入正确的数字，可不填"
                    ></el-input>
                    <div style="color: red;">
                        小程序展示销量=基础销量+实际销量
                    </div>
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
                <el-form-item
                        :required="true"
                        v-if="form.commodityType==5"
                        label="选择权益卡"
                        :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="changeCard">点击选择</el-button>
                </el-form-item>
                <el-form-item
                        v-if="cardId&&form.commodityType==5"
                        label="所选权益卡："
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input style="width: 150px" v-model="cardName" autocomplete="off" disabled></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                            v-if="cardName"
                            style="color:red;cursor: pointer;"
                            @click="deletCard"
                    >删除</span>
                </el-form-item>
                <el-form-item :required="true" label="是否指定日期可以兑换" :label-width="formLabelWidth">
                    <el-select
                            v-model="form.assignType"
                            placeholder="请选择指定日期"
                            @change="clearAssignType()"
                    >
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
                <el-form-item :required="true" label="是否限购" :label-width="formLabelWidth">
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
                        v-if="form.limitType==2||form.limitType==3||form.limitType==4||form.limitType==5"
                        label="限购数量"
                        :label-width="formLabelWidth"
                        :required="true"
                >
                    <el-input
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            style="width: 250px"
                            v-model="form.limitNumber"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input
                            style="width: 250px"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            v-model="form.sort"
                            autocomplete="off"
                            placeholder="请输入数字，数字越小优先级越高"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="兑换须知" :label-width="formLabelWidth">
                    <el-input
                            style="width: 360px"
                            type="textarea"
                            show-word-limit
                            :rows="5"
                            maxlength="400"
                            placeholder="1.可领取时间段2.领取地址3.其他注意事项"
                            v-model="form.memo"
                            autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="详情" :label-width="formLabelWidth">
                    <editor-bar v-model="form.markdown" :isClear="isClear" @change="changeFormMarkdown"></editor-bar>
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
                        highlight-current-row
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio
                                    v-model="id"
                                    :label="scope.$index"
                                    @change.native="getCurrentRow(scope.$index)"
                            >&nbsp;
                            </el-radio>
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
        <!-- 选择权益卡弹出窗 -->
        <el-dialog :close-on-click-modal="false" title="选择权益卡" :visible.sync="drawerCard">
            <div class="container">
                <div class="handle-box">
                    <el-input
                            v-model="query.cardName"
                            placeholder="权益卡名称"
                            class="handle-input mr12"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="changeCard">搜索</el-button>
                </div>
                <el-table
                        :data="cardList"
                        border
                        class="table"
                        ref="multipleTable"
                        highlight-current-row
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="cardId" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="权益卡名称" width="150">
                        <template slot-scope="scope">{{scope.row.name}}</template>
                    </el-table-column>
                    <el-table-column label="权益卡有效期" width="150">
                        <template slot-scope="scope">{{scope.row.number}}{{scope.row.unit}}</template>
                    </el-table-column>
                    <el-table-column prop="name" label="影票" width="90">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.isFilmJoin == 0">不参与</el-tag>
                            <el-tag v-else-if="scope.row.isFilmJoin == 1">参与</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="卖品" width="90">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.isMerchandiseJoin == 0">不参与</el-tag>
                            <el-tag v-else-if="scope.row.isMerchandiseJoin == 1">参与</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="券包" width="90">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.isGroupJoin == 0">不赠送</el-tag>
                            <el-tag v-else-if="scope.row.isGroupJoin == 1">赠送</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            @size-change="cHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.cPageNo"
                            :page-sizes="[10, 15, 20, 30]"
                            :page-size="query.cPageSize"
                            :total="query.cTotalCount"
                            @current-change="cCurrentChange"
                            @prev-click="cPrev"
                            @next-click="cNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawerCard = false">取 消</el-button>
                <el-button type="primary" @click="sureAddCard(cardId)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 选择商户弹出窗 -->
        <el-dialog :close-on-click-modal="false" title="选择商户" :visible.sync="drawerPartner">
            <div class="container">
                <div class="handle-box">
                    <el-input
                            v-model="query.partnerName"
                            placeholder="商户名称"
                            class="handle-input mr12"
                            @input="changePartnerName($event)"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="getPartner">搜索</el-button>
                </div>
                <el-table
                        :data="partnerList"
                        border
                        class="table"
                        ref="multipleTable"
                        highlight-current-row
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="partnerCode" :label="scope.row.partnerCode">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="商户名称" width="150">
                        <template slot-scope="scope">{{scope.row.partnerName}}</template>
                    </el-table-column>
                    <el-table-column label="门店地址">
                        <template slot-scope="scope">{{scope.row.address}}</template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            @size-change="bHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="query.oPageNo"
                            :page-sizes="[10, 15, 20, 30]"
                            :page-size="query.oPageSize"
                            :total="query.oTotalCount"
                            @current-change="oCurrentChange"
                            @prev-click="oPrev"
                            @next-click="oNext"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="drawerPartner = false">取 消</el-button>
                <el-button type="primary" @click="surePartner(partnerCode)">确 定</el-button>
            </div>
        </el-dialog>
        <!--新增sku弹出框新增-->
        <el-dialog :close-on-click-modal="false" title="新增" :visible.sync="dialogskuFormVisible">
            <el-form :model="skuForm">
                <el-form-item :required="true" label="规格" :label-width="formLabelWidth">
                    <el-input placeholder="例如：颜色、包装..." style="width: 350px" min="1" maxlength="30" v-model.trim="skuForm.specifications" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="属性" :label-width="formLabelWidth">
                    <el-input placeholder="例如：尺寸、容量..." style="width: 200px" min="1" maxlength="10" v-model="skuForm.attribute" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="skuForm.image"/>
                        <img
                                slot="reference"
                                :src="skuForm.image"
                                :alt="skuForm.image"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <span
                            v-if="skuForm.image"
                            style="color:red;cursor: pointer;margin-left:20px;"
                            @click="deletImg"
                    >删除</span>
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            :limit="1"
                            :on-exceed="exceed"
                            ref="download"
                            class="upload-demo"
                            drag
                            action="/api/upload/uploadImage"
                            :on-success="skuSuccess"
                            multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                    <el-input placeholder="请输入大于0的数字" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')" style="width: 250px" min="1" v-model="skuForm.store" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="oForm.change_type==1||oForm.change_type==3" :required="true" label="所需金币数量" :label-width="formLabelWidth">
                    <el-input placeholder="请输入正确的数字" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')" style="width: 250px" min="1" v-model="skuForm.gold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="oForm.change_type==2||oForm.change_type==3" :required="true" label="所需RMB" :label-width="formLabelWidth">
                    <el-input placeholder="请输入正确的数字" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')" style="width: 250px" min="1" v-model="skuForm.money" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogskuFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureUseSku">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑sku弹出框新增-->
        <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="dialogoSkuFormVisible">
            <el-form :model="oSkuForm">
                <el-form-item :required="true" label="规格" :label-width="formLabelWidth">
                    <el-input placeholder="例如：颜色、包装..." style="width: 350px" min="1" maxlength="30" v-model.trim="oSkuForm.specifications" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="属性" :label-width="formLabelWidth">
                    <el-input placeholder="例如：尺寸、容量..." style="width: 200px" min="1" maxlength="10" v-model="oSkuForm.attribute" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oSkuForm.image"/>
                        <img
                                slot="reference"
                                :src="oSkuForm.image"
                                :alt="oSkuForm.image"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <span
                            v-if="oSkuForm.image"
                            style="color:red;cursor: pointer;margin-left:20px;"
                            @click="deletImg2"
                    >删除</span>
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            :limit="1"
                            :on-exceed="exceed"
                            ref="download"
                            class="upload-demo"
                            drag
                            action="/api/upload/uploadImage"
                            :on-success="oSkuSuccess"
                            multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                    <el-input placeholder="请输入大于0的数字" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')" style="width: 250px" min="1" v-model="oSkuForm.store" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="oForm.change_type==1||oForm.change_type==3" :required="true" label="所需金币数量" :label-width="formLabelWidth">
                    <el-input placeholder="请输入正确的数字" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')" style="width: 250px" min="1" v-model="oSkuForm.gold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="oForm.change_type==2||oForm.change_type==3" :required="true" label="所需RMB" :label-width="formLabelWidth">
                    <el-input placeholder="请输入正确的数字" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')" style="width: 250px" min="1" v-model="oSkuForm.money" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogoSkuFormVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="sureChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增sku弹出框修改-->
        <el-dialog :close-on-click-modal="false" title="新增" :visible.sync="dialogskuChangeFormVisible">
            <el-form :model="skuChangeForm">
                <el-form-item :required="true" label="规格" :label-width="formLabelWidth">
                    <el-input placeholder="例如：颜色、包装..." style="width: 350px" min="1" maxlength="30" v-model.trim="skuChangeForm.specifications" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="属性" :label-width="formLabelWidth">
                    <el-input placeholder="例如：尺寸、容量..." style="width: 200px" min="1" maxlength="10" v-model="skuChangeForm.attribute" autocomplete="off"></el-input>
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
                    <span
                            v-if="skuChangeForm.image"
                            style="color:red;cursor: pointer;margin-left:20px;"
                            @click="deletImg3"
                    >删除</span>
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            :limit="1"
                            :on-exceed="exceed"
                            ref="download"
                            class="upload-demo"
                            drag
                            action="/api/upload/uploadImage"
                            :on-success="skuChangeSuccess"
                            multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                    <el-input placeholder="请输入大于0的数字" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')" style="width: 250px" min="1" v-model="skuChangeForm.store" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="form.changeType==1||form.changeType==3" :required="true" label="所需金币数量" :label-width="formLabelWidth">
                    <el-input placeholder="请输入正确的数字" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')" style="width: 250px" min="1" v-model="skuChangeForm.gold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="form.changeType==2||form.changeType==3" :required="true" label="所需RMB" :label-width="formLabelWidth">
                    <el-input placeholder="请输入正确的数字" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')" style="width: 250px" min="1" v-model="skuChangeForm.money" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogskuChangeFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureChangeUseSku">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑sku弹出框修改-->
        <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="dialogoSkuChangeFormVisible">
            <el-form :model="oSkuChangeForm">
                <el-form-item :required="true" label="规格" :label-width="formLabelWidth">
                    <el-input placeholder="例如：颜色、包装..." style="width: 350px" min="1" maxlength="30" v-model.trim="oSkuChangeForm.specifications" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="属性" :label-width="formLabelWidth">
                    <el-input placeholder="例如：尺寸、容量..." style="width: 200px" min="1" maxlength="10" v-model="oSkuChangeForm.attribute" autocomplete="off"></el-input>
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
                    <span
                            v-if="oSkuChangeForm.image"
                            style="color:red;cursor: pointer;margin-left:20px;"
                            @click="deletImg4"
                    >删除</span>
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            :limit="1"
                            :on-exceed="exceed"
                            ref="download"
                            class="upload-demo"
                            drag
                            action="/api/upload/uploadImage"
                            :on-success="oSkuChangeSuccess"
                            multiple
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="库存" :label-width="formLabelWidth">
                    <el-input placeholder="请输入大于0的数字" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')" style="width: 250px" min="1" v-model="oSkuChangeForm.store" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="form.changeType==1||form.changeType==3" :required="true" label="所需金币数量" :label-width="formLabelWidth">
                    <el-input placeholder="请输入正确的数字" onkeyup="this.value=this.value.replace(/[^0-9]+/,'')" style="width: 250px" min="1" v-model="oSkuChangeForm.gold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="form.changeType==2||form.changeType==3" :required="true" label="所需RMB" :label-width="formLabelWidth">
                    <el-input placeholder="请输入正确的数字" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')" style="width: 250px" min="1" v-model="oSkuChangeForm.money" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogoSkuChangeFormVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="sureChangeChanger">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {quillEditor} from 'vue-quill-editor';
    import {fetchData} from '../../api/index';
    import {Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend} from '@/aes/utils';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import md5 from 'js-md5';
    import axios from 'axios';
    import https from '../../https';
    import EditorBar from '../common/Editor';

    export default {
        name: 'basetable',
        data() {
            return {
                dialogskuFormVisible: false,//新增
                dialogskuChangeFormVisible: false,//新增
                dialogoSkuFormVisible: false,//修改
                dialogoSkuChangeFormVisible: false,//修改
                skuForm: {
                    specifications: '',
                    attribute: '',
                    image: '',
                    store: '',
                    gold: '',
                    money: '',
                },
                skuChangeForm: {
                    specifications: '',
                    attribute: '',
                    image: '',
                    store: '',
                    gold: '',
                    money: '',
                },
                oSkuForm: {
                    specifications: '',
                    attribute: '',
                    image: '',
                    store: '',
                    gold: '',
                    money: '',
                },
                oSkuChangeForm: {
                    specifications: '',
                    attribute: '',
                    image: '',
                    store: '',
                    gold: '',
                    money: '',
                    id: '',
                },
                skuList: [],
                changeSkuList: [],
                oIndex: "",
                oChangeIndex: "",
                isClear: false,
                isIndeterminate: true,
                checkAll: false,
                content: '',
                partnerName: '',
                partnerCode: '',
                oImageUrl: '',
                editorOption: {
                    placeholder: "请在这里输入"
                },
                img_file: {},
                oTopstatus: '',
                oBaseSaleNumber: '',
                oRecommendStatus: '',
                oEffectiveType: '',
                oLaterDays: '',
                oStartEffectiveDate: '',
                oEndEffectiveDate: '',
                type: {
                    type: ''
                },
                oName: '',
                oCommodityCategory: '',
                message: '', //弹出框消息
                query: {
                    partnerCode: '',
                    pageNo: 1,
                    pageSize: 15,
                    aPageNo: 1,
                    aPageSize: 15,
                    bPageNo: 1,
                    bPageSize: 15,
                    cPageNo: 1,
                    cPageSize: 15,
                    oPageNo: 1,
                    oPageSize: 15
                },
                fileList: [],
                tableData: [],
                partnerList: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                drawerPartner: false,
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
                    assignInfo: '',
                    gold: '',
                    money: '',
                    supportExpressStatus: '',
                    expressFee: '',
                    store: '',
                    commodityCategory: '',
                    endDate: '',
                    isUseSku: '',
                },
                idx: -1,
                id: -1,
                dialogFormVisible: false,
                oForm: {
                    name: '',
                    memo: '',
                    sort: '',
                    pickupType: '1',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: '',
                    value: '1',
                    commodity_type: '1',
                    details: '',
                    commodityCategory: '',
                    markdown: '',
                    effectiveType: '1',
                    laterDays: '',
                    startEffectiveDate: '',
                    endEffectiveDate: '',
                    assign_info: '',
                    gold: '',
                    money: '',
                    supportExpressStatus: '1',
                    expressFee: '',
                    store: '',
                    endDate: '',
                    baseSaleNumber: '',
                    isUseSku: 2,
                },

                formLabelWidth: '120px',
                selectValue: {},
                days: [
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
                    }
                ],
                weeks: [
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
                    }
                ],
                dates: [
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
                    }
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
                        label: '纯金币兑换',
                        disabled: true
                    },
                    {
                        value: '2',
                        label: '纯RMB兑换',
                    },
                    {
                        value: '3',
                        label: '金币 + RMB 兑换',
                        disabled: true
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
                supportType: [
                    {
                        value: '1',
                        label: '自提'
                    },
                    {
                        value: '2',
                        label: '快递'
                    },
                    // {
                    //     value: '3',
                    //     label: '自提加快递'
                    // },
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
                    },
                    {
                        value: '4',
                        label: '商户商品'
                    },
                    {
                        value: '5',
                        label: '权益卡'
                    }
                ],
                commodityCategoryType: [
                    {
                        value: '1',
                        label: '影院周边'
                    },
                    {
                        value: '2',
                        label: '超值美食'
                    },
                    {
                        value: '3',
                        label: '优选精品'
                    },
                    {
                        value: '4',
                        label: '健身美容'
                    },
                    {
                        value: '5',
                        label: '休闲娱乐'
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
                        label: '不限购'
                    },
                    {
                        value: '5',
                        label: '每个会员每天可兑换数量'
                    },
                    {
                        value: '4',
                        label: '每个会员每周可兑换数量'
                    },
                    {
                        value: '3',
                        label: '每个会员每月可兑换数量'
                    },
                    {
                        value: '2',
                        label: '每个会员每年可兑换数量'
                    },
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
                partnerInfo: [],
                drawer: false, //选择优惠券弹出框,
                ticketIds: '',
                couponList: [],
                cardList: [],
                drawerCoupon: false,
                drawerCard: false,
                couponId: '',
                cardId: '',
                groupName: '',
                cardName: ''
            };
        },
        components: {quillEditor, EditorBar},
        created() {
        },
        mounted() {
            this.getMenu();
        },
        methods: {
            clearList(){
                this.skuList=[];
                this.changeSkuList=[];
                this.oForm.store='';
                this.form.store=''
            },
            //新增sku弹出
            addUseSku(){
                if (!this.oForm.change_type) {
                    this.message = '兑换方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                this.dialogskuFormVisible=true
            },
            addChangeUseSku(){
                if (!this.form.changeType) {
                    this.message = '兑换方式不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                console.log(this.changeSkuList);
                this.dialogskuChangeFormVisible=true
            },
            sureUseSku(){
                if (!this.skuForm.specifications) {
                    this.message = '规格不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.skuForm.store) {
                    this.message = '库存不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.change_type==1||this.oForm.change_type==3) {
                    if (!this.skuForm.gold) {
                        this.message = '所需金币数量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.change_type==2||this.oForm.change_type==3) {
                    if (!this.skuForm.money) {
                        this.message = '所需RMB不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(!this.skuForm.gold){
                    this.skuForm.gold=0
                }
                if(!this.skuForm.money){
                    this.skuForm.money=0
                }
                let oneSku = {
                    specifications: this.skuForm.specifications,
                    attribute: this.skuForm.attribute,
                    image: this.skuForm.image,
                    store: this.skuForm.store,
                    gold: this.skuForm.gold,
                    money: this.skuForm.money,
                };
                this.skuList.push(oneSku);
                this.skuForm.specifications = '';
                this.skuForm.attribute = '';
                this.skuForm.image = '';
                this.skuForm.store = '';
                this.skuForm.gold = '';
                this.skuForm.money = '';
                let num=0;
                for(let x in this.skuList){
                    num+= Number(this.skuList[x].store)

                }
                this.oForm.store=num;
                this.dialogskuFormVisible = false;
            },
            sureChangeUseSku(){
                if (!this.skuChangeForm.specifications) {
                    this.message = '规格不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.skuChangeForm.store) {
                    this.message = '库存不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.form.changeType==1||this.form.changeType==3) {
                    if (!this.skuChangeForm.gold) {
                        this.message = '所需金币数量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.form.changeType==2||this.form.changeType==3) {
                    if (!this.skuChangeForm.money) {
                        this.message = '所需RMB不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(!this.skuChangeForm.gold){
                    this.skuChangeForm.gold=0
                }
                if(!this.skuChangeForm.money){
                    this.skuChangeForm.money=0
                }
                let oneSku = {
                    specifications: this.skuChangeForm.specifications,
                    attribute: this.skuChangeForm.attribute,
                    image: this.skuChangeForm.image,
                    store: this.skuChangeForm.store,
                    gold: this.skuChangeForm.gold,
                    money: this.skuChangeForm.money,
                };
                console.log(oneSku);
                this.changeSkuList.push(oneSku);
                console.log(this.changeSkuList);
                this.skuChangeForm.specifications = '';
                this.skuChangeForm.attribute = '';
                this.skuChangeForm.image = '';
                this.skuChangeForm.store = '';
                this.skuChangeForm.gold = '';
                this.skuChangeForm.money = '';
                let num=0;
                console.log(this.changeSkuList);

                for(let x in this.changeSkuList){
                    num+= Number(this.changeSkuList[x].store)

                }
                this.form.store=num;
                this.dialogskuChangeFormVisible = false;
            },
            //修改sku弹出
            changeSku(index,row){
                this.oSkuForm = row;
                this.oIndex=index;
                this.dialogoSkuFormVisible=true
            },
            changeChangeSku(index,row){
                this.oSkuChangeForm = row;
                console.log(row);
                this.oChangeIndex=index;
                this.dialogoSkuChangeFormVisible=true
            },
            sureChanger() {
                // 编辑sku操作
                if (!this.oSkuForm.specifications) {
                    this.message = '规格不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oSkuForm.store) {
                    this.message = '库存不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.change_type==1||this.oForm.change_type==3) {
                    if (!this.oSkuForm.gold) {
                        this.message = '所需金币数量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.change_type==2||this.oForm.change_type==3) {
                    if (!this.oSkuForm.money) {
                        this.message = '所需RMB不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(!this.oSkuForm.gold){
                    this.oSkuForm.gold=0
                }
                if(!this.oSkuForm.money){
                    this.oSkuForm.money=0
                }
                let oneSku = {
                    specifications: this.oSkuForm.specifications,
                    attribute: this.oSkuForm.attribute,
                    image: this.oSkuForm.image,
                    store: this.oSkuForm.store,
                    gold: this.oSkuForm.gold,
                    money: this.oSkuForm.money,
                };
                this.skuList[this.oIndex] = oneSku;
                this.oSkuForm.specifications = '';
                this.oSkuForm.attribute = '';
                this.oSkuForm.image = '';
                this.oSkuForm.store = '';
                this.oSkuForm.gold = '';
                this.oSkuForm.money = '';
                let num=0;
                for(let x in this.skuList){
                    num+= Number(this.skuList[x].store)

                }
                this.oForm.store=num;
                this.dialogoSkuFormVisible = false;
            },
            sureChangeChanger() {
                // 编辑sku操作
                if (!this.oSkuChangeForm.specifications) {
                    this.message = '规格不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oSkuChangeForm.store) {
                    this.message = '库存不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.form.changeType==1||this.form.changeType==3) {
                    if (!this.oSkuChangeForm.gold) {
                        this.message = '所需金币数量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.form.changeType==2||this.form.changeType==3) {
                    if (!this.oSkuChangeForm.money) {
                        this.message = '所需RMB不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if(!this.oSkuChangeForm.gold){
                    this.oSkuChangeForm.gold=0
                }
                if(!this.oSkuChangeForm.money){
                    this.oSkuChangeForm.money=0
                }
                let oneSku = {
                    id:this.oSkuChangeForm.id,
                    specifications: this.oSkuChangeForm.specifications,
                    attribute: this.oSkuChangeForm.attribute,
                    image: this.oSkuChangeForm.image,
                    store: this.oSkuChangeForm.store,
                    gold: this.oSkuChangeForm.gold,
                    money: this.oSkuChangeForm.money,
                };
                this.changeSkuList[this.oChangeIndex] = oneSku;
                this.oSkuChangeForm.specifications = '';
                this.oSkuChangeForm.id = '';
                this.oSkuChangeForm.attribute = '';
                this.oSkuChangeForm.image = '';
                this.oSkuChangeForm.store = '';
                this.oSkuChangeForm.gold = '';
                this.oSkuChangeForm.money = '';
                let num=0;
                for(let x in this.changeSkuList){
                    num+= Number(this.changeSkuList[x].store)

                }
                this.form.store=num;
                this.dialogoSkuChangeFormVisible = false;
            },
            delSku(index, row) {
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
                            // this.idx = index;
                            // this.form = row;
                            this.skuList.splice(index, 1);
                            this.$message.error(`删除了`);
                            let num=0;
                            for(let x in this.skuList){
                                num+= Number(this.skuList[x].store)

                            }
                            this.oForm.store=num;
                            loading.close()
                        }, 500);
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            delChangeSku(index, row) {
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
                            this.changeSkuList.splice(index, 1);
                            this.$message.error(`删除了`);
                            let num=0;
                            for(let x in this.changeSkuList){
                                num+= Number(this.changeSkuList[x].store)

                            }
                            this.form.store=num;
                            loading.close()
                        }, 500);
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            skuSuccess(data) {
                //修改上传文件 登录超时
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.download.clearFiles();
                    return;
                }
                this.skuForm.image = data.data;
                this.$refs.download.clearFiles();
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            skuChangeSuccess(data) {
                //修改上传文件 登录超时
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.download.clearFiles();
                    return;
                }
                this.skuChangeForm.image = data.data;
                this.$refs.download.clearFiles();
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            // 删除新增sku图片
            deletImg() {
                this.skuForm.image = '';
            },
            // 删除编辑sku图片
            deletImg2() {
                this.oSkuForm.image = '';
            },
            deletImg3() {
                this.skuChangeForm.image = '';
            },
            deletImg4() {
                this.oSkuChangeForm.image = '';
            },
            oSkuSuccess(data) {
                //修改上传文件 登录超时
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.download.clearFiles();
                    return;
                }
                this.oSkuForm.image = data.data;
                this.$refs.download.clearFiles();
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            oSkuChangeSuccess(data) {
                //修改上传文件 登录超时
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.download.clearFiles();
                    return;
                }
                this.oSkuChangeForm.image = data.data;
                this.$refs.download.clearFiles();
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            handleCheckAllChange(val) {
                let arr = [];
                for (let x in this.cities) {
                    arr.push(this.cities[x].cinemaCode)
                }
                this.oCheckedCities = val ? arr : [];
                this.cardName = "";
                this.groupName = '';
                if (this.selectedSell.length>0) {
                    this.selectedSell.splice(0, 1);
                }
                this.isIndeterminate = false;
            },
            oHandleCheckAllChange(val) {
                let arr = [];
                for (let x in this.oCities) {
                    arr.push(this.oCities[x].cinemaCode)
                }
                this.oCheckedCities = val ? arr : [];
                console.log(this.oCheckedCities);
                this.cardName = "";
                this.groupName = '';
                if (this.selectedSell.length>0) {
                    this.selectedSell.splice(0, 1);
                }
                this.isIndeterminate = false;
            },
            surePartner(id) {
                this.partnerCode = id;
                for (let i = 0; i < this.partnerList.length; i++) {
                    if (this.partnerList[i].partnerCode == this.partnerCode) {
                        this.partnerName = this.partnerList[i].partnerName;
                    }
                }
                this.drawerPartner = false;
            },
            changePartnerName(e) {
                this.$forceUpdate();
            },
            changeSearchCinema(val) {
                this.query.partnerCode = '';
                this.partnerInfo = [];
                this.getSearchPartner(val);
            },
            getSearchPartner(val) {
                let cinemaCode = val;
                if (!cinemaCode) {
                    cinemaCode = '';
                }
                let jsonArr = [];
                jsonArr.push({key: 'pageSize', value: 200});
                jsonArr.push({key: 'cinemaCodes', value: cinemaCode});
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/cinemaPartner/page', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            var res = JSON.parse(Decrypt(data.data.data));
                            this.partnerInfo = res.data;
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
            getPartner() {
                if (this.oCheckedCities.length == 0) {
                    this.message = '请选择允许兑换的门店！';
                    this.open();
                    return;
                }
                let partnerName = this.query.partnerName;
                if (!partnerName) {
                    partnerName = '';
                }
                let jsonArr = [];
                jsonArr.push({key: 'cinemaCodes', value: this.oCheckedCities});
                jsonArr.push({key: 'partnerName', value: partnerName});
                jsonArr.push({key: 'pageNo', value: this.query.oPageNo});
                jsonArr.push({key: 'pageSize', value: this.query.oPageSize});
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/cinemaPartner/getPartnerPage', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            var res = JSON.parse(Decrypt(data.data.data));
                            console.log(res);
                            this.query.partnerName = '';
                            this.partnerList = res.data;
                            this.query.oPageSize = res.pageSize;
                            this.query.oPageNo = res.pageNo;
                            this.query.oTotalCount = res.totalCount;
                            this.query.oTotalPage = res.totalPage;
                            this.drawerPartner = true;
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
            exceed(data) {
                if (data.length == 1) {
                    this.message = '只能上传一张图片，如需重新上传请删除第一张图！';
                    this.open();
                }
            },
            clearAssignType() {
                this.oForm.assign_info = '';
                this.form.assignInfo = '';
            },
            deletPartner() {
                this.partnerCode = '';
                this.partnerName = '';
            },
            deletCoupon() {
                this.groupName = '';
                this.couponId = '';
            },
            deletCard() {
                this.cardName = '';
                this.cardId = '';
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
            sureAddCard(id) {
                this.cardId = id;
                for (let i = 0; i < this.cardList.length; i++) {
                    if (this.cardList[i].id == this.cardId) {
                        this.cardName = this.cardList[i].name;
                    }
                }
                this.drawerCard = false;
            },
            // 更换券包
            changeCoupon() {
                if (this.oCheckedCities.length == 0) {
                    this.message = '请选择影院！';
                    this.open();
                    return;
                }
                let groupName = this.query.groupName;
                if (!groupName) {
                    groupName = '';
                }
                let jsonArr = [];
                jsonArr.push({key: 'cinemaCodes', value: this.oCheckedCities.join(',')});
                jsonArr.push({key: 'groupName', value: groupName});
                jsonArr.push({key: 'status', value: 1});
                jsonArr.push({key: 'pageNo', value: this.query.bPageNo});
                jsonArr.push({key: 'pageSize', value: this.query.bPageSize});
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                var params = ParamsAppend(jsonArr);
                console.log(jsonArr)
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
            // 更换权益卡
            changeCard() {
                let cardName = this.query.cardName;
                if (!cardName) {
                    cardName = '';
                }
                let jsonArr = [];
                if (this.oCheckedCities.length == 0) {
                    this.message = '请选择影院！';
                    this.open();
                    return;
                }
                if (this.oCheckedCities.length > 1) {
                    jsonArr.push({key: 'commonType', value: '2'});
                } else {
                    jsonArr.push({key: 'cinemaCode', value: this.oCheckedCities[0]});
                }
                jsonArr.push({key: 'name', value: cardName});
                jsonArr.push({key: 'status', value: 1});
                jsonArr.push({key: 'pageNo', value: this.query.cPageNo});
                jsonArr.push({key: 'pageSize', value: this.query.cPageSize});
                console.log(jsonArr)
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/benefitCard/page', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            var res = JSON.parse(Decrypt(data.data.data));
                            console.log(res);
                            if (res.pageResult.data.length == 0) {
                                this.message = '暂无权益卡';
                                this.open();
                                return;
                            }
                            this.cardList = res.pageResult.data;
                            this.query.cPageSize = res.pageResult.pageSize;
                            this.query.cPageNo = res.pageResult.pageNo;
                            this.query.cTotalCount = res.pageResult.totalCount;
                            this.query.cTotalPage = res.pageResult.totalPage;
                            this.drawerCard = true;
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
                this.oCheckedCities = val;
                this.partnerName = '';
                this.partnerCode = '';
                this.cardName = "";
                this.groupName = '';
                if (this.selectedSell.length>0) {
                    this.selectedSell.splice(0, 1);
                }
                let checkedCount = val.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
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
                if (this.oCheckedCities.length == 0) {
                    this.message = '请选择影院！';
                    this.open();
                    return;
                }
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
                    jsonArr.push({key: 'name', value: name});
                    jsonArr.push({key: 'cinemaCode', value: this.oCheckedCities.join(',')});
                    jsonArr.push({key: 'pageNo', value: this.query.aPageNo});
                    jsonArr.push({key: 'pageSize', value: this.query.aPageSize});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({key: 'sign', value: sign});
                    var params = ParamsAppend(jsonArr);
                    console.log(jsonArr)
                    https
                        .fetchPost('merchandiseCoupon/getCouponByCinemaCode', params)
                        .then(data => {
                            loading.close();
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
            changeAddType() {
                // if (this.oForm.commodity_type == 5) {
                //     if (this.oCheckedCities.length > 1) {
                //         this.message = '权益卡只支持单影院！';
                //         this.open();
                //         this.oCheckedCities = [];
                //         this.oForm.commodity_type = '1';
                //         return;
                //     } else {
                //         this.oForm.change_type = "2"
                //     }
                // }
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
                                this.fileList = [];
                                this.cities = JSON.parse(Decrypt(data.data.data));
                                this.oCheckedCities = [];
                                this.skuList = [];
                                this.dialogFormVisible = true;
                                this.isIndeterminate = false;
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
                if (this.oForm.commodity_type == 1 || this.oForm.commodity_type == 4) {
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
                    if (this.oForm.originalPrice <= 0) {
                        this.message = '原价必须大于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.commodity_type == 4) {
                    if (!this.partnerCode) {
                        this.message = '所选商户不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (!this.oForm.pickupType) {
                        this.message = '领取方式不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (!this.oForm.supportExpressStatus) {
                        this.message = '支持快递不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    // if(this.oForm.supportExpressStatus==1){
                    //     if (!this.oForm.expressFee&&this.oForm.expressFee!=0) {
                    //         this.message = '快递费用不能为空，请检查！';
                    //         this.open();
                    //         loading.close();
                    //         return;
                    //     }
                    //     if (this.oForm.expressFee<0) {
                    //         this.message = '快递费用不能小于0，请检查！';
                    //         this.open();
                    //         loading.close();
                    //         return;
                    //     }
                    // }
                }
                if (!this.oForm.image_url) {
                    this.message = '商品图片不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oCheckedCities.length == 0) {
                    this.message = '允许兑换的门店不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.memo) {
                    this.message = '兑换须知不能为空，请检查！';
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
                if (!this.oForm.store && this.oForm.store != 0) {
                    this.message = '库存不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.store < 0) {
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
                if (this.oForm.change_type == 1 && this.oForm.change_type == 3) {
                    if ((!this.oForm.gold && this.oForm.gold != 0) || this.oForm.gold == '') {
                        this.message = '所需金币数量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oForm.gold <= 0) {
                        this.message = '所需金币数量必须大于0，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.change_type == 2 || this.oForm.change_type == 3 || this.oForm.change_type == 5) {
                    if (!this.oForm.money && this.oForm.money != 0) {
                        this.message = '所需RMB不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oForm.money <= 0) {
                        this.message = '所需RMB必须大于0，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.commodity_type != 1 && this.oForm.commodity_type != 4) {
                    if (!this.oForm.effectiveType) {
                        this.message = '生效方式不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.effectiveType == 1 && this.oForm.commodity_type != 1 && this.oForm.commodity_type != 4) {
                    if (!this.oForm.laterDays) {
                        this.message = '领取后几天开始生效不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oForm.laterDays < 0) {
                        this.message = '领取后几天开始生效不能小于0，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.commodity_type != 1 && this.oForm.commodity_type != 4 && this.oForm.effectiveType == 2) {
                    if (!this.oForm.startEffectiveDate || !this.oForm.endEffectiveDate) {
                        this.message = '有效期不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                // if (this.oForm.effectiveType != 2) {
                //     if (!this.oForm.expireDay || this.oForm.expireDay == '') {
                //         this.message = '有效期天数不能为空，请检查！';
                //         this.open();
                //         loading.close();
                //         return;
                //     }
                //     if (this.oForm.expireDay < 1) {
                //         this.message = '有效期天数不能小于1，请检查！';
                //         this.open();
                //         loading.close();
                //         return;
                //     }
                // }
                if (!this.oForm.topStatus) {
                    this.message = '是否今日大牌不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oForm.recommendStatus) {
                    this.message = '是否推荐不能为空，请检查！';
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
                if (this.oForm.commodity_type == 2) {
                    if (this.selectedSell.length == 0) {
                        this.message = '所选优惠券不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.commodity_type == 3) {
                    if (!this.groupName) {
                        this.message = '所选券包不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.commodity_type == 5) {
                    if (!this.cardName) {
                        this.message = '所选权益卡不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    this.oForm.gold = 0;
                }
                if (!this.oForm.assign_type) {
                    this.message = '是否指定日期可以兑换不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.assign_type == 2) {
                    if (!this.oForm.assign_info) {
                        this.message = '指定日期不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.assign_type == 3) {
                    if (!this.oForm.assign_info) {
                        this.message = '每月几号不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.assign_type == 4) {
                    if (!this.oForm.assign_info) {
                        this.message = '每月第几周不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oForm.assign_type == 5) {
                    if (!this.oForm.assign_info) {
                        this.message = '每周几不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (!this.oForm.limit_type) {
                    this.message = '是否限购不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oForm.limit_type == 2 || this.oForm.limit_type == 3 || this.oForm.limit_type == 4) {
                    if (!this.oForm.limit_number) {
                        this.message = '限制兑换数量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oForm.limit_number <= 0) {
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
                jsonArr.push({key: 'effectiveType', value: this.oForm.effectiveType});
                jsonArr.push({key: 'imageUrl', value: this.oForm.image_url});
                jsonArr.push({key: 'memo', value: this.oForm.memo});
                jsonArr.push({key: 'store', value: this.oForm.store});
                jsonArr.push({key: 'changeType', value: this.oForm.change_type});
                jsonArr.push({key: 'gold', value: this.oForm.gold});
                jsonArr.push({key: 'money', value: this.oForm.money});
                jsonArr.push({key: 'cinemaCodes', value: this.oCheckedCities});
                jsonArr.push({key: 'status', value: this.oForm.status});
                jsonArr.push({key: 'commodityType', value: this.oForm.commodity_type});
                jsonArr.push({key: 'commodityCategory', value: this.oForm.commodityCategory});
                jsonArr.push({key: 'assignType', value: this.oForm.assign_type});
                jsonArr.push({key: 'assignInfo', value: this.oForm.assign_info});
                jsonArr.push({key: 'limitType', value: this.oForm.limit_type});
                jsonArr.push({key: 'limitNumber', value: this.oForm.limit_number});
                jsonArr.push({key: 'details', value: this.oForm.details});
                jsonArr.push({key: 'originalPrice', value: this.oForm.originalPrice});
                jsonArr.push({key: 'topStatus', value: this.oForm.topStatus});
                jsonArr.push({key: 'recommendStatus', value: this.oForm.recommendStatus});
                jsonArr.push({key: 'expireDay', value: this.oForm.expireDay});
                jsonArr.push({key: 'sort', value: this.oForm.sort});
                jsonArr.push({key: 'endDate', value: this.oForm.endDate});
                jsonArr.push({key: 'baseSaleNumber', value: this.oForm.baseSaleNumber});
                if (this.oForm.commodity_type == 4||this.oForm.commodity_type==1) {
                    jsonArr.push({key: 'skuListJson', value:JSON.stringify(this.skuList)});
                    jsonArr.push({key: 'isUseSku', value: this.oForm.isUseSku});
                    jsonArr.push({key: 'supportExpressStatus', value: this.oForm.supportExpressStatus});
                }
                if (this.oForm.commodity_type == 4) {
                    jsonArr.push({key: 'partnerCode', value: this.partnerCode});
                    jsonArr.push({key: 'pickupType', value: this.oForm.pickupType});
                }
                if (this.oForm.commodity_type == 1) {
                    jsonArr.push({key: 'pickupType', value: 1});
                }
                if (this.oForm.commodity_type == 3 || this.oForm.commodity_type == 5) {
                    if (this.oForm.commodity_type == 3) {
                        jsonArr.push({key: 'ticketIds', value: this.couponId});
                        jsonArr.push({key: 'name', value: this.groupName});
                    }
                    if (this.oForm.commodity_type == 5) {
                        jsonArr.push({key: 'ticketIds', value: this.cardId});
                        jsonArr.push({key: 'name', value: this.cardName});
                    }
                } else {
                    jsonArr.push({key: 'name', value: this.oForm.name});
                    jsonArr.push({key: 'ticketIds', value: this.ticketIds});
                }
                if (this.oForm.commodity_type != 1) {
                    if (this.oForm.effectiveType == 1) {
                        jsonArr.push({key: 'laterDays', value: this.oForm.laterDays});
                    } else {
                        jsonArr.push({key: 'startEffectiveDate', value: this.oForm.startEffectiveDate});
                        jsonArr.push({key: 'endEffectiveDate', value: this.oForm.endEffectiveDate});
                    }
                }
                let sign = md5(preSign(jsonArr));
                jsonArr.push({key: 'sign', value: sign});
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/goldCommodity/addGoldCommodity', params)
                        .then(data => {
                            //新增
                            if (data.data.code == 'success') {
                                loading.close();
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
                                this.oCheckedCities = [];
                                this.oForm.status = '';
                                this.oForm.commodity_type = '';
                                this.oForm.ticketIds = '';
                                this.oForm.assign_type = '';
                                this.oForm.assign_info = '';
                                this.oForm.limit_type = '';
                                this.oForm.limit_number = '';
                                this.oForm.details = '';
                                this.oForm.baseSaleNumber = '';
                                this.oForm.originalPrice = '';
                                this.oForm.topStatus = '';
                                this.oForm.recommendStatus = '';
                                this.oForm.sort = '';
                                this.partnerCode = '';
                                this.oForm.endDate = '';
                                this.oForm.supportExpressStatus = '1';
                                this.dialogFormVisible = false;
                                this.checkAll = false;
                                this.$message.success(`新增成功`);
                                this.getMenu();
                            } else if (data.data.code == 'nologin') {
                                loading.close();
                                this.message = data.data.message;
                                this.open();
                                this.$router.push('/login');
                            } else {
                                loading.close();
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
                            jsonArr.push({key: 'id', value: row.id});
                            let sign = md5(preSign(jsonArr));
                            jsonArr.push({key: 'sign', value: sign});
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
                    jsonArr.push({key: 'id', value: row.id});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({key: 'sign', value: sign});
                    let params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('goldCommodity/modifyPage', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                this.editVisible = true;
                                //优惠券
                                console.log(JSON.parse(Decrypt(data.data.data)));
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
                                this.oName = JSON.parse(Decrypt(data.data.data)).goldCommodity.name;
                                this.partnerCode = JSON.parse(Decrypt(data.data.data)).goldCommodity.partnerCode;
                                this.partnerName = JSON.parse(Decrypt(data.data.data)).goldCommodity.partnerName;
                                if (JSON.parse(Decrypt(data.data.data)).goldCommodity.pickupType == 1) {
                                    this.form.pickupType = '1';
                                }
                                if (JSON.parse(Decrypt(data.data.data)).goldCommodity.pickupType == 2) {
                                    this.form.pickupType = '2';
                                }
                                this.changeSkuList=JSON.parse(Decrypt(data.data.data)).commoditySku;
                                if (JSON.parse(Decrypt(data.data.data)).goldCommodity.isUseSku == 1) {
                                    this.form.isUseSku = 1;
                                }
                                if (JSON.parse(Decrypt(data.data.data)).goldCommodity.isUseSku == 2) {
                                    this.form.isUseSku = 2;
                                }
                                this.oImageUrl = JSON.parse(Decrypt(data.data.data)).goldCommodity.imageUrl;
                                this.form.memo = JSON.parse(Decrypt(data.data.data)).goldCommodity.memo;
                                this.form.store = JSON.parse(Decrypt(data.data.data)).goldCommodity.store;
                                this.form.expireDay = JSON.parse(Decrypt(data.data.data)).goldCommodity.expireDay;
                                this.form.originalPrice = JSON.parse(Decrypt(data.data.data)).goldCommodity.originalPrice;
                                this.form.markdown = JSON.parse(Decrypt(data.data.data)).goldCommodity.details;
                                this.form.alreadyChangedNumber = JSON.parse(Decrypt(data.data.data)).goldCommodity.alreadyChangedNumber;
                                this.form.gold = JSON.parse(Decrypt(data.data.data)).goldCommodity.gold;
                                this.form.money = JSON.parse(Decrypt(data.data.data)).goldCommodity.money;
                                this.form.cinemaCodes = JSON.parse(Decrypt(data.data.data)).goldCommodity.cinemaCodes;
                                this.oCheckedCities = this.form.cinemaCodes.split(',');
                                this.form.status = JSON.parse(Decrypt(data.data.data)).goldCommodity.status;
                                this.form.commodityType = JSON.parse(Decrypt(data.data.data)).goldCommodity.commodityType;
                                if (JSON.parse(Decrypt(data.data.data)).goldCommodity.commodityType == 3) {
                                    this.ticketIds = JSON.parse(Decrypt(data.data.data)).goldCommodity.ticketIds;
                                    this.couponId = JSON.parse(Decrypt(data.data.data)).goldCommodity.ticketIds;
                                    this.groupName = JSON.parse(Decrypt(data.data.data)).goldCommodity.name;
                                }
                                if (JSON.parse(Decrypt(data.data.data)).goldCommodity.commodityType == 5) {
                                    this.ticketIds = JSON.parse(Decrypt(data.data.data)).goldCommodity.ticketIds;
                                    this.cardId = JSON.parse(Decrypt(data.data.data)).goldCommodity.ticketIds;
                                    this.cardName = JSON.parse(Decrypt(data.data.data)).goldCommodity.name;
                                }
                                this.oTopstatus = JSON.parse(Decrypt(data.data.data)).goldCommodity.topStatus;
                                this.form.assignType = JSON.parse(Decrypt(data.data.data)).goldCommodity.assignType;
                                this.form.assignInfo = JSON.parse(Decrypt(data.data.data)).goldCommodity.assignInfo;
                                this.form.limitType = JSON.parse(Decrypt(data.data.data)).goldCommodity.limitType;
                                this.form.limitNumber = JSON.parse(Decrypt(data.data.data)).goldCommodity.limitNumber;
                                this.form.sort = JSON.parse(Decrypt(data.data.data)).goldCommodity.sort;
                                this.form.endDate = JSON.parse(Decrypt(data.data.data)).goldCommodity.endDate;
                                // this.form.expressFee = JSON.parse(Decrypt(data.data.data)).goldCommodity.expressFee;
                                this.oCities = JSON.parse(Decrypt(data.data.data)).cinemas;
                                this.oLaterDays = JSON.parse(Decrypt(data.data.data)).goldCommodity.laterDays;
                                this.oStartEffectiveDate = JSON.parse(Decrypt(data.data.data)).goldCommodity.startEffectiveDate;
                                this.oEndEffectiveDate = JSON.parse(Decrypt(data.data.data)).goldCommodity.endEffectiveDate;
                                this.oBaseSaleNumber = JSON.parse(Decrypt(data.data.data)).goldCommodity.baseSaleNumber;
                                //商品类型下拉选显示对应的选项
                                for (let x in this.commodityType) {
                                    if (this.commodityType[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.commodityType) {
                                        this.form.commodityType = this.commodityType[x].value;
                                        break;
                                    }
                                }
                                //商品类别下拉选显示对应的选项
                                for (let x in this.commodityCategoryType) {
                                    if (this.commodityCategoryType[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.commodityCategory) {
                                        this.oCommodityCategory = this.commodityCategoryType[x].value;
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
                                //是否推荐下拉选显示对应的选项
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
                                // console.log(typeof JSON.parse(Decrypt(data.data.data)).goldCommodity.effectiveType);
                                for (let x in this.effectiveType) {
                                    if (this.effectiveType[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.effectiveType) {
                                        this.oEffectiveType = this.effectiveType[x].value;
                                        break;
                                    }
                                }
                                // console.log(this.oEffectiveType);
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

                                //是否限购下拉选显示对应的选项
                                for (let x in this.limitType) {
                                    if (this.limitType[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.limitType) {
                                        this.form.limitType = this.limitType[x].value;
                                        break;
                                    }
                                }
                                //是否快递下拉选显示对应的选项
                                for (let x in this.supportType) {
                                    if (this.supportType[x].value == JSON.parse(Decrypt(data.data.data)).goldCommodity.supportExpressStatus) {
                                        this.form.supportExpressStatus = this.supportType[x].value;
                                        break;
                                    }
                                }
                                console.log(this.form.commodityType)
                                console.log(this.form.isUseSku)
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
                if (this.form.commodityType == 1 || this.form.commodityType == 4) {
                    if (!this.oName) {
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
                    if (this.form.originalPrice <= 0) {
                        this.message = '原价必须大于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (!this.form.supportExpressStatus) {
                        this.message = '支持快递不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.form.commodityType == 4) {
                    if (!this.partnerCode) {
                        this.message = '所选商户不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (!this.form.pickupType) {
                        this.message = '领取方式不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (!this.oImageUrl) {
                    this.message = '商品图片不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.oCheckedCities.length == 0) {
                    this.message = '允许兑换的门店不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.form.memo) {
                    this.message = '兑换须知不能为空，请检查！';
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
                if (!this.form.store && this.form.store != 0) {
                    this.message = '库存不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.form.store < 0) {
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
                if (this.form.changeType == 1 || this.form.changeType == 3) {
                    if ((!this.form.gold && this.form.gold != 0) || this.form.gold == '') {
                        this.message = '所需金币数量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.form.gold <= 0) {
                        this.message = '所需金币数量必须大于0，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.form.changeType == 2 || this.form.changeType == 3 || this.form.changeType == 5) {
                    if (!this.form.money && this.form.money != 0) {
                        this.message = '所需RMB不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.form.money <= 0) {
                        this.message = '所需RMB必须大于0，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.form.commodityType != 1 && this.form.commodityType != 4) {
                    if (!this.oEffectiveType) {
                        this.message = '生效方式不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.oEffectiveType == 1 && this.form.commodityType != 1 && this.form.commodityType != 4) {
                    if (!this.oLaterDays && this.oLaterDays != 0) {
                        this.message = '领取后几天开始生效不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.oLaterDays < 0) {
                        this.message = '领取后几天开始生效不能小于0，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.form.commodityType != 1 && this.oEffectiveType == 2 && this.form.commodityType != 4) {
                    if (!this.oStartEffectiveDate || !this.oEndEffectiveDate) {
                        this.message = '有效期不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                // if (this.oEffectiveType != 2) {
                //     if (!this.form.expireDay || this.form.expireDay == '') {
                //         this.message = '有效期天数不能为空，请检查！';
                //         this.open();
                //         loading.close();
                //         return;
                //     }
                //     if (this.form.expireDay < 1) {
                //         this.message = '有效期天数不能小于1，请检查！';
                //         this.open();
                //         loading.close();
                //         return;
                //     }
                // }
                if (!this.oTopstatus) {
                    this.message = '是否今日大牌不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (!this.oRecommendStatus) {
                    this.message = '是否推荐不能为空，请检查！';
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
                if (this.form.commodityType == 2) {
                    if (this.selectedSell.length == 0) {
                        this.message = '所选优惠券不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.form.commodityType == 3) {
                    if (!this.groupName) {
                        this.message = '所选券包不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.form.commodityType == 5) {
                    if (!this.cardName) {
                        this.message = '所选权益卡不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    this.form.gold = 0;
                }
                if (!this.form.assignType) {
                    this.message = '是否指定日期可以兑换不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.form.assignType == 2) {
                    if (!this.form.assignInfo) {
                        this.message = '指定日期不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.form.assignType == 3) {
                    if (!this.form.assignInfo) {
                        this.message = '每月几号不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.form.assignType == 4) {
                    if (!this.form.assignInfo) {
                        this.message = '每月第几周不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (this.form.assignType == 5) {
                    if (!this.form.assignInfo) {
                        this.message = '每周几不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                if (!this.form.limitType) {
                    this.message = '是否限购不能为空，请检查！';
                    this.open();
                    loading.close();
                    return;
                }
                if (this.form.limitType == 2 || this.form.limitType == 3 || this.form.limitType == 4 || this.form.limitType == 5) {
                    if (!this.form.limitNumber) {
                        this.message = '限制兑换数量不能为空，请检查！';
                        this.open();
                        loading.close();
                        return;
                    }
                    if (this.form.limitNumber <= 0) {
                        this.message = '限制兑换数量必须大于0！';
                        this.open();
                        loading.close();
                        return;
                    }
                }
                setTimeout(() => {
                    var jsonArr = [];
                    this.form.cinemaCode = this.oCheckedCities.join(',');
                    jsonArr.push({key: 'id', value: this.form.id});
                    jsonArr.push({key: 'effectiveType', value: this.oEffectiveType});
                    jsonArr.push({key: 'imageUrl', value: this.oImageUrl});
                    jsonArr.push({key: 'memo', value: this.form.memo});
                    jsonArr.push({key: 'store', value: this.form.store});
                    jsonArr.push({key: 'alreadyChangedNumber', value: this.form.alreadyChangedNumber.toString()});
                    jsonArr.push({key: 'changeType', value: this.form.changeType});
                    jsonArr.push({key: 'gold', value: this.form.gold});
                    jsonArr.push({key: 'money', value: this.form.money});
                    jsonArr.push({key: 'cinemaCodes', value: this.form.cinemaCode});
                    jsonArr.push({key: 'status', value: this.form.status});
                    jsonArr.push({key: 'commodityType', value: this.form.commodityType});
                    jsonArr.push({key: 'commodityCategory', value: this.oCommodityCategory});
                    jsonArr.push({key: 'assignType', value: this.form.assignType});
                    jsonArr.push({key: 'assignInfo', value: this.form.assignInfo});
                    jsonArr.push({key: 'limitType', value: this.form.limitType});
                    jsonArr.push({key: 'limitNumber', value: this.form.limitNumber});
                    jsonArr.push({key: 'details', value: this.form.markdown});
                    jsonArr.push({key: 'originalPrice', value: this.form.originalPrice});
                    jsonArr.push({key: 'expireDay', value: this.form.expireDay});
                    jsonArr.push({key: 'topStatus', value: this.oTopstatus});
                    jsonArr.push({key: 'recommendStatus', value: this.oRecommendStatus});
                    jsonArr.push({key: 'sort', value: this.form.sort});
                    jsonArr.push({key: 'endDate', value: this.form.endDate});
                    jsonArr.push({key: 'baseSaleNumber', value: this.oBaseSaleNumber});
                    if (this.form.commodityType == 4) {
                        jsonArr.push({key: 'partnerCode', value: this.partnerCode});
                        jsonArr.push({key: 'pickupType', value: this.form.pickupType});
                        // jsonArr.push({ key: 'expressFee', value: this.form.expressFee });
                    }
                    if (this.form.commodityType == 1) {
                        jsonArr.push({key: 'pickupType', value: 1});
                    }
                    if (this.form.commodityType == 4||this.form.commodityType==1) {
                        jsonArr.push({key: 'skuListJson', value:JSON.stringify(this.changeSkuList)});
                        jsonArr.push({key: 'isUseSku', value: this.form.isUseSku});
                        jsonArr.push({key: 'supportExpressStatus', value: this.form.supportExpressStatus});
                    }
                    // if (this.form.commodityType == 2) {
                    //     jsonArr.push({key: 'ticketIds', value: this.ticketIds});
                    // }
                    if (this.form.commodityType == 3 || this.form.commodityType == 5) {
                        if (this.form.commodityType == 3) {
                            jsonArr.push({key: 'ticketIds', value: this.couponId});
                            jsonArr.push({key: 'name', value: this.groupName});
                        }
                        if (this.form.commodityType == 5) {
                            jsonArr.push({key: 'ticketIds', value: this.cardId});
                            jsonArr.push({key: 'name', value: this.cardName});
                        }
                    } else {
                        jsonArr.push({key: 'name', value: this.oName});
                        jsonArr.push({key: 'ticketIds', value: this.ticketIds});
                    }
                    if (this.form.commodityType != 1) {
                        if (this.oEffectiveType == 1) {
                            jsonArr.push({key: 'laterDays', value: this.oLaterDays});
                        }
                        if (this.oEffectiveType == 2) {
                            jsonArr.push({key: 'startEffectiveDate', value: this.oStartEffectiveDate});
                            jsonArr.push({key: 'endEffectiveDate', value: this.oEndEffectiveDate});
                        }
                    }
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({key: 'sign', value: sign});
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
                    let partnerCode = this.query.partnerCode;
                    let status = this.query.status;
                    let changeType = this.query.changeType;
                    let commodityType = this.query.commodityType;
                    let topStatus = this.query.topStatus;
                    let recommendStatus = this.query.recommendStatus;
                    let name = this.query.name;
                    if (!cinemaCodes) {
                        cinemaCodes = '';
                    }
                    if (!partnerCode) {
                        partnerCode = '';
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
                    if (!topStatus) {
                        topStatus = '';
                    }
                    if (!recommendStatus) {
                        recommendStatus = '';
                    }
                    if (!name) {
                        name = '';
                    }
                    let jsonArr = [];
                    jsonArr.push({key: 'name', value: name});
                    jsonArr.push({key: 'recommendStatus', value: recommendStatus});
                    jsonArr.push({key: 'topStatus', value: topStatus});
                    jsonArr.push({key: 'cinemaCodes', value: cinemaCodes});
                    jsonArr.push({key: 'partnerCode', value: partnerCode});
                    jsonArr.push({key: 'status', value: status});
                    jsonArr.push({key: 'changeType', value: changeType});
                    jsonArr.push({key: 'commodityType', value: commodityType});
                    jsonArr.push({key: 'pageNo', value: this.query.pageNo});
                    jsonArr.push({key: 'pageSize', value: this.query.pageSize});
                    let sign = md5(preSign(jsonArr));
                    jsonArr.push({key: 'sign', value: sign});
                    var params = ParamsAppend(jsonArr);
                    https
                        .fetchPost('/goldCommodity/goldCommodityPage', params)
                        .then(data => {
                            loading.close();
                            if (data.data.code == 'success') {
                                var oData = JSON.parse(Decrypt(data.data.data));
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
                this.oImageUrl = data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            changeCinema(val) {
                this.oCheckedCities = val;
                this.partnerCode = '';
                this.partnerName = '';
                this.cardName = "";
                let checkedCount = val.length;
                this.checkAll = checkedCount === this.oCities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.oCities.length;

            },
            changeCinema2(val) {
                this.oCheckedCities = val;
                this.partnerCode = '';
                this.partnerName = '';
                this.cardName = "";
                this.groupName = '';
                if (this.selectedSell.length>0) {
                    this.selectedSell.splice(0, 1);
                }
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
                this.query.pageSize = val;
                this.getMenu();
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
                this.query.aPageSize = val;
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
            //新增优惠券页面
            aCurrentChange(val) {
                //点击选择具体页数
                this.query.aPageNo = val;
                this.openNext();
            },
            bHandleSizeChange(val) {
                this.query.bPageSize = val;
                this.changeCoupon();
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
            cHandleSizeChange(val) {
                this.query.cPageSize = val;
                this.changeCard();
            },
            cCurrentChange(val) {
                //点击选择具体页数
                this.query.cPageNo = val;
                this.changeCard();
            },
            cPrev() {
                //分页按钮上一页
                this.query.cPageNo--;
                this.changeCard();
            },
            cNext() {
                //分页按钮下一页
                this.query.cPageNo++;
                this.changeCard();
            },
            oCurrentChange(val) {
                //点击选择具体页数
                this.query.oPageNo = val;
                this.getPartner();
            },
            oPrev() {
                //分页按钮上一页
                this.query.oPageNo--;
                this.getPartner();
            },
            oNext() {
                //分页按钮下一页
                this.query.oPageNo++;
                this.getPartner();
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
                instance.post('/upload/uploadImage', formdata, {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
                    let _res = res.data;
                    this.$refs.md.$img2Url(pos, _res.data);
                });
            },
            $imgDel(pos) {
                delete this.img_file[pos];
            },
            changeMarkdown(val) {
                this.oForm.details = val
            },
            changeFormMarkdown(val) {
                this.form.details = val;
            },
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
