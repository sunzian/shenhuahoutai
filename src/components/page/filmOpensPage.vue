<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 专场点映管理
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
                <el-input v-model="query.filmName" placeholder="影片名称" class="handle-input mr10"></el-input>
                <el-select
                        clearable
                        v-model="query.groupStatus"
                        placeholder="组团状态"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="组团中" value="1"></el-option>
                    <el-option key="2" label="组团失败" value="2"></el-option>
                    <el-option key="3" label="组团成功" value="3"></el-option>
                    <el-option key="4" label="已开场" value="4"></el-option>
                    <el-option key="5" label="已撤销" value="5"></el-option>
                </el-select>
                <el-select
                        clearable
                        v-model="query.status"
                        placeholder="开启状态"
                        class="handle-select mr10"
                >
                    <el-option key="1" label="启用" value="1"></el-option>
                    <el-option key="2" label="未启用" value="2"></el-option>
                </el-select>
                <el-date-picker
                        v-model="query.sessionStartDate"
                        type="datetime"
                        class="mr10"
                        style="margin-bottom: 10px"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        default-time="06:00:00"
                        placeholder="放映开始时间"
                ></el-date-picker>
                <el-date-picker
                        v-model="query.sessionEndDate"
                        type="datetime"
                        class="mr10"
                        style="margin-bottom: 10px"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="放映结束时间"
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
                    highlight-current-row
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="影院名称" width="220">
                    <template slot-scope="scope">{{scope.row.cinemaName}}</template>
                </el-table-column>
                <el-table-column label="点映活动名称" width="200">
                    <template slot-scope="scope">{{scope.row.filmOpensName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="电影名称">
                    <template slot-scope="scope">{{scope.row.filmName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="点映放映时间">
                    <template slot-scope="scope">{{scope.row.sessionTime}}</template>
                </el-table-column>
                <el-table-column prop="name" label="已报名人数" width="100">
                    <template slot-scope="scope">{{scope.row.enrolledNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="成团人数" width="90">
                    <template slot-scope="scope">{{scope.row.agglomerationNumber}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="状态" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 2">未启动</el-tag>
                        <el-tag v-else-if="scope.row.status == 1">已启动</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="组团状态" width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.groupStatus == 3">组团成功</el-tag>
                        <el-tag v-else-if="scope.row.groupStatus == 2">组团失败</el-tag>
                        <el-tag v-else-if="scope.row.groupStatus == 1">组团中</el-tag>
                        <el-tag v-else-if="scope.row.groupStatus == 4">已开场</el-tag>
                        <el-tag v-else-if="scope.row.groupStatus == 5">已撤销</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="success"
                                v-if="scope.row.status == 2 && scope.row.groupStatus == 1"
                                @click="changeStatus(scope.$index, scope.row)"
                        >启用
                        </el-button>
                        <el-button
                                type="success"
                                style="margin-top: 10px"
                                v-if="scope.row.groupStatus == 3"
                                @click="cancel(scope.$index, scope.row)"
                        >撤销点映
                        </el-button>
                        <el-button
                                type="success"
                                style="margin-top: 10px"
                                v-if="scope.row.groupStatus == 3"
                                @click="sendMessage(scope.$index, scope.row)"
                        >发送组团成功短信
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-circle-plus-outline"
                                @click="addChange(scope.$index, scope.row)"
                        >修改
                        </el-button>
                        <el-button
                                type="text"
                                v-if="scope.row.enrolledNumber == 0"
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
                <el-form-item :required="true" label="点映活动名称" :label-width="formLabelWidth">
                    <el-input
                            maxlength="20"
                            style="width: 250px"
                            v-model="oForm.filmOpensName"
                            autocomplete="off"
                            placeholder="限20个汉字"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择影院" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="oForm.code" @change="selectCinema" :max="1">
                        <el-checkbox
                                v-for="item in cinemaInfo"
                                :key="item.cinemaCode"
                                :label="item.cinemaCode"
                                :value="item.cinemaCode"
                        >{{item.cinemaName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                                <el-form-item
                        :required="true"
                        label="选择影片"
                        :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="openNext">点击新增</el-button>
                </el-form-item>
                <el-form-item
                        label="所选影片"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0"
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
                <el-form-item :required="true" label="选择影厅" :label-width="formLabelWidth">
                    <el-checkbox-group
                            :required="true"
                            v-model="oForm.screenCode"
                            :max="1"
                            @change="selectScreens"
                    >
                        <el-checkbox
                                v-for="item in screenInfo"
                                :label="item.screenCode"
                                :key="item.screenCode"
                                :value="item.screenName"
                        >{{item.screenName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="点映现场" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oForm.stagePhoto"/>
                        <img
                                slot="reference"
                                :src="oForm.stagePhoto"
                                :alt="oForm.stagePhoto"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <span style="color: red;">请上传点映影片放映现场图片</span>
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            drag
                            :limit="1"
                            :on-exceed="exceed"
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
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过200kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="点映放映时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oForm.sessionTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择点映放映时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="点映票价" :label-width="formLabelWidth">
                    <el-input style="width: 300px" v-model="oForm.ticketPrice" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')" placeholder="请输入正确的金额"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="报名时间" :label-width="formLabelWidth">
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
                <el-form-item :required="true" label="点映成团人数" :label-width="formLabelWidth">
                    <el-input placeholder="请输入正确的数字" style="width: 300px" v-model="oForm.agglomerationNumber" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="影厅有效座位数量" :label-width="formLabelWidth">
                    <el-input :disabled="true" style="width: 300px" v-model="oForm.fullSeatNumber"></el-input>
                </el-form-item>
                <el-form-item label="点映推荐说明" :label-width="formLabelWidth">
                    <el-input maxlength="10" placeholder="限10个字" style="width: 300px" v-model="oForm.recommendExplain"></el-input>
                </el-form-item>
                <el-form-item label="点映说明" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="250"
                            :rows="5"
                            style="width: 300px"
                            v-model="oForm.filmOpensExplain"
                    ></el-input>
                </el-form-item>
                <el-form-item label="购票须知" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="250"
                            :rows="5"
                            style="width: 300px"
                            v-model="oForm.buyTicketHint"
                    ></el-input>
                </el-form-item>
                <el-form-item label="取票说明" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="250"
                            :rows="5"
                            style="width: 300px"
                            v-model="oForm.printTicketExplain"
                    ></el-input>
                </el-form-item>
                <el-form-item label="官方公众号(二维码)" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oForm.officialAccount"/>
                        <img
                                slot="reference"
                                :src="oForm.officialAccount"
                                :alt="oForm.officialAccount"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <span style="color: red;">请上传影院公众号或者小程序二维码</span>
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            drag
                            :limit="1"
                            :on-exceed="exceed"
                            action="/api/upload/uploadImage"
                            ref="upload1"
                            :on-success="unSuccess"
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
                <el-form-item label="联系影院负责人" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oForm.filmDirector"/>
                        <img
                                slot="reference"
                                :src="oForm.filmDirector"
                                :alt="oForm.filmDirector"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <span style="color: red;">请上传影院负责人微信二维码</span>
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            drag
                            :limit="1"
                            :on-exceed="exceed"
                            action="/api/upload/uploadImage"
                            ref="upload2"
                            :on-success="snSuccess"
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
                <el-form-item
                        label="点映返利设置"
                        :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="addSelectedSell">增加</el-button>
                    <div
                            v-for="(item1, index) in selectedSell1"
                            style="margin-bottom: 5px"
                            :key="index"
                    >   累计推荐&nbsp;&nbsp;
                        <el-input
                                style="width: 100px"
                                v-model="item1.shareNumber"
                                autocomplete="off"
                                placeholder="请输入正确的数字"
                                onkeyup="this.value=this.value.replace(/[^0-9]+/,'')"
                        ></el-input>人&nbsp;&nbsp;&nbsp;&nbsp;返利&nbsp;&nbsp;
                        <el-input
                                style="width: 100px"
                                v-model="item1.rebateMoney"
                                autocomplete="off"
                                placeholder="请输入正确的金额"
                                onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                        ></el-input>元&nbsp;
                        <span style="color:blue;cursor: pointer;" @click="delSelectedSell(index)">删除</span>
                    </div>
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item :required="true" label="点映活动名称" :label-width="formLabelWidth">
                    <el-input
                            maxlength="20"
                            style="width: 250px"
                            v-model="oFilmOpensName"
                            autocomplete="off"
                            :disabled="oStatus==1"
                            placeholder="限20个汉字"
                    ></el-input>
                </el-form-item>
                <el-form-item :required="true" label="选择影院" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="oCinemaCode" @change="selectCinema" :max="1">
                        <el-checkbox
                                v-for="item in cinemaInfo"
                                :key="item.cinemaCode"
                                :label="item.cinemaCode"
                                :value="item.cinemaCode"
                                :disabled="oStatus==1"
                        >{{item.cinemaName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                                <el-form-item
                        :required="true"
                        label="选择影片"
                        :label-width="formLabelWidth"
                >
                    <el-button :disabled="oStatus==1" type="primary" @click="openNext">点击新增</el-button>
                </el-form-item>
                <el-form-item
                        label="所选影片"
                        :label-width="formLabelWidth"
                        v-if="selectedSell.length>0"
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
                <el-form-item :required="true" label="选择影厅" :label-width="formLabelWidth">
                    <el-checkbox-group
                            :required="true"
                            v-model="oScreenCode"
                            :max="1"
                            @change="selectScreens1"
                    >
                        <el-checkbox
                                v-for="item in screenInfo"
                                :label="item.screenCode"
                                :key="item.screenCode"
                                :value="item.screenName"
                                :disabled="oStatus==1"
                        >{{item.screenName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :required="true" label="点映现场" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oStagePhoto"/>
                        <img
                                slot="reference"
                                :src="oStagePhoto"
                                :alt="oStagePhoto"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <span style="color: red;">请上传点映影片放映现场图片</span>
                    <el-upload
                            v-if="oStatus==2"
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            drag
                            :limit="1"
                            :on-exceed="exceed"
                            action="/api/upload/uploadImage"
                            ref="upload3"
                            :on-success="anSuccess"
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
                <el-form-item :required="true" label="点映放映时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oSessionTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            :disabled="oGroupStatus==2||oGroupStatus==3||oGroupStatus==4||oGroupStatus==5||oStatus==1"
                            placeholder="请选择点映放映时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="点映票价" :label-width="formLabelWidth">
                    <el-input :disabled="oStatus==1" style="width: 300px" v-model="oTicketPrice" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')" placeholder="请输入正确的金额"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="报名时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oStartDate"
                            type="datetime"
                            placeholder="开始时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            :disabled="oGroupStatus==2||oGroupStatus==3||oGroupStatus==4||oGroupStatus==5||oStatus==1"
                    ></el-date-picker>
                    至
                    <el-date-picker
                            v-model="oEndDate"
                            type="datetime"
                            placeholder="结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            :disabled="oGroupStatus==2||oGroupStatus==3||oGroupStatus==4||oGroupStatus==5||oStatus==1"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :required="true" label="点映成团人数" :label-width="formLabelWidth">
                    <el-input placeholder="请输入正确的数字" :disabled="oGroupStatus==2||oGroupStatus==3||oGroupStatus==4||oGroupStatus==5||oStatus==1" style="width: 300px" v-model="oAgglomerationNumber" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="影厅有效座位数量" :label-width="formLabelWidth">
                    <el-input :disabled="true" style="width: 300px" v-model="oForm.fullSeatNumber "></el-input>
                </el-form-item>
                <el-form-item label="点映推荐说明" :label-width="formLabelWidth">
                    <el-input maxlength="10" placeholder="限10个字" style="width: 300px" v-model="oRecommendExplain"></el-input>
                </el-form-item>
                <el-form-item label="点映说明" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="250"
                            :rows="5"
                            style="width: 300px"
                            v-model="oFilmOpensExplain"
                    ></el-input>
                </el-form-item>
                <el-form-item label="购票须知" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="250"
                            :rows="5"
                            style="width: 300px"
                            v-model="oBuyTicketHint"
                    ></el-input>
                </el-form-item>
                <el-form-item label="取票说明" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            show-word-limit
                            maxlength="250"
                            :rows="5"
                            style="width: 300px"
                            v-model="oPrintTicketExplain"
                    ></el-input>
                </el-form-item>
                <el-form-item label="官方公众号(二维码)" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oOfficialAccount"/>
                        <img
                                slot="reference"
                                :src="oOfficialAccount"
                                :alt="oOfficialAccount"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <span style="color: red;">请上传影院公众号或者小程序二维码</span>
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            drag
                            :limit="1"
                            :on-exceed="exceed"
                            action="/api/upload/uploadImage"
                            ref="upload4"
                            :on-success="bnSuccess"
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
                <el-form-item label="联系影院负责人" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oFilmDirector"/>
                        <img
                                slot="reference"
                                :src="oFilmDirector"
                                :alt="oFilmDirector"
                                style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <span style="color: red;">请上传影院负责人微信二维码</span>
                    <el-upload
                            :before-upload="beforeUpload"
                            :data="type"
                            class="upload-demo"
                            drag
                            :limit="1"
                            :on-exceed="exceed"
                            action="/api/upload/uploadImage"
                            ref="upload5"
                            :on-success="cnSuccess"
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
                <el-form-item
                        label="点映返利设置"
                        :label-width="formLabelWidth"
                >
                    <el-button type="primary" @click="addSelectedSell">增加</el-button>
                    <div
                            v-for="(item1, index) in selectedSell1"
                            style="margin-bottom: 5px"
                            :key="index"
                    >   累计推荐&nbsp;&nbsp;
                        <el-input
                                style="width: 150px"
                                v-model="item1.shareNumber"
                                autocomplete="off"
                                placeholder="请输入正确的数字"
                                onkeyup="this.value=this.value.replace(/[^0-9]+/,'')"
                        ></el-input>人&nbsp;&nbsp;&nbsp;&nbsp;返利&nbsp;&nbsp;
                        <el-input
                                style="width: 150px"
                                v-model="item1.rebateMoney"
                                autocomplete="off"
                                placeholder="请输入正确的金额"
                                onkeyup="this.value=this.value.replace(/[^0-9.]+/,'')"
                        ></el-input>元&nbsp;
                        <span style="color:blue;cursor: pointer;" @click="delSelectedSell(index)">删除</span>
                    </div>
                </el-form-item>
                <el-form-item :required="true" label="开启状态" :label-width="formLabelWidth">
                    <el-select v-model="oStatus" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="oGroupStatus==2||oGroupStatus==3||oGroupStatus==4||oGroupStatus==5||oStatus==1"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增抽屉弹出框-->
        <el-dialog :close-on-click-modal="false" title="选择影片" :visible.sync="drawer">
            <div class="container">
                <div class="handle-box">
                    <el-input v-model="query.filmName" placeholder="影片名称" class="handle-input mr12"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="SearchFilm">搜索</el-button>
                </div>
                <el-table
                        :data="sellTableData"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column label="操作" width="50" align="center">
                        <template slot-scope="scope">
                            <el-radio
                                    v-model="id"
                                    :label="scope.$index"
                                    @change.native="getCurrentRow(scope.$index)"
                            >&nbsp;
                            </el-radio>
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
                selectedSell1:[],
                fileList:[],
                type: {
                    type: ''
                },
                oCinemaCode: '',
                oGroupStatus: '',
                oFilmOpensName: '',
                oStagePhoto: '',
                oFixedSatisfyMoney: '',
                oFixedAddMoney: '',
                oSelectHallType: '',
                oSessionTime: '',
                oTicketPrice: '',
                oBuyTicketHint: '',
                oOfficialAccount: '',
                oFilmDirector: '',
                oPrintTicketExplain: '',
                oFilmOpensExplain: '',
                oRecommendExplain: '',
                oStatus: '',
                oSelectFilmFormatType: '',
                oHolidayValid: '',
                oActivityDesc: '',
                oStartDate: '',
                oEndDate: '',
                oSelectFilmType: '',
                oAgglomerationNumber: '',
                oLimitSingleUnit: '',
                oScreenCode: [],
                selectedSell: [],
                oCheckedDays: [],
                oFilmFormatCode: [],
                sellIndex: '',
                sellTableData: [],
                drawer: false, //新增抽屉弹出框
                value1: '',
                oCinemaName: '',
                oScreenName: '',
                oFilmFormatName: '',
                selectFilmFormatType: '',
                selectHallType: '',
                selectFilmType: '',
                oFilmName: '',
                oName: '',
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
                oHolidayAddMoney: '',
                formatList: [], //电影制式列表
                message: '', //弹出框消息
                query: {
                    pageNo: 1,
                    pageSize: 15,
                    aPageNo: 1,
                    aPageSize: 15
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
                        value: '2',
                        label: '未启用'
                    },
                    {
                        value: '1',
                        label: '启用'
                    }
                ],
                canUse: [
                    {
                        value: '2',
                        label: '否'
                    },
                    {
                        value: '1',
                        label: '是'
                    }
                ],
                canUse1: [
                    {
                        value: '0',
                        label: '不限制'
                    },
                    {
                        value: '1',
                        label: '限制'
                    }
                ],
                canUse2: [
                    {
                        value: '0',
                        label: '不可用'
                    },
                    {
                        value: '1',
                        label: '可用'
                    }
                ],
                oForm: {
                    name: '',
                    cinemaName: '',
                    fixedSatisfyMoney: '',
                    fixedAddMoney: '',
                    cinemaCode: [],
                    screenName: '',
                    screenCode: [],
                    formatCode: [],
                    selectFilmType: '0', //选择影片
                    selectHallType: '0', //选择影厅
                    selectMovieType: '0', //选择制式
                    code: [], //选择影院
                    filmCode: '',
                    filmName: '',
                    checkedDays: [],
                    startDate: '',
                    endDate: '',
                    validPayType: '0',
                    holidayValid: '1',
                    activityTogether: '0',
                    oCanNum: '0',
                    oneCanNum: '0',
                    limitSingleUnit: '年',
                    achieveMoney: '',
                    discountMoney: '',
                    reduceType: '1',
                    couponDesc: '',
                    id: '',
                    status: '2',
                    oNum: '',
                    holidayAddMoney: '',
                    oneNum: '',
                    stagePhoto: '',
                    officialAccount: '',
                    recommendExplain: '',
                    filmDirector: '',
                    fullSeatNumber: ''
                },
                formLabelWidth: '120px',
                selectValue: [],
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
                hallType: false
            };
        },
        created() {
        },
        mounted() {
            this.getMenu();
        },
        methods: {
            addSelectedSell() {
                let obj = {
                    shareNumber: '',
                    rebateMoney: '',
                };
                this.selectedSell1.push(obj);
            },
            delSelectedSell(index) {
                this.selectedSell1.splice(index, 1);
            },
            cancel(index, row){
                this.$confirm('此操作将撤销点映, 是否继续?', '提示', {
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
                        var jsonArr = [];
                        jsonArr.push({ key: 'id', value: row.id });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        console.log(jsonArr);
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/filmOpens/opensCancel', params)
                            .then(data => {
                                loading.close();
                                console.log(data);
                                // console.log(JSON.parse(Decrypt(data.data.data)));
                                if (data.data.code == 'success') {
                                    this.$message.success(`撤销成功`);
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
                    }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        });
            },
            sendMessage(index, row){
                this.$confirm('此操作将发送组团成功短信, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.div1')
                });
                var jsonArr = [];
                jsonArr.push({ key: 'id', value: row.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/filmOpens/opensSendMessage', params)
                    .then(data => {
                        loading.close();
                        console.log(data);
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.$message.success(`发送成功`);
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
                }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消发送'
                            });
                        });
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
            exceed(data) {
                console.log(data);
                if (data.length == 1) {
                    this.message = '只能上传一张图片，如需重新上传请删除第一张图！';
                    this.open();
                }
            },
            onSuccess(data,file, fileList) {
                //上传文件 登录超时
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.upload.clearFiles();
                    return;
                }
                this.oForm.stagePhoto = data.data;
                this.$refs.upload.clearFiles();
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            unSuccess(data) {
                //上传文件 登录超时
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.upload1.clearFiles();
                    return;
                }
                this.$refs.upload1.clearFiles();
                this.oForm.officialAccount = data.data;
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
                    this.$refs.upload2.clearFiles();
                    return;
                }
                this.$refs.upload2.clearFiles();
                this.oForm.filmDirector = data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            anSuccess(data) {
                //上传文件 登录超时
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.upload3.clearFiles();
                    return;
                }
                this.$refs.upload3.clearFiles();
                this.oStagePhoto = data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            bnSuccess(data) {
                //上传文件 登录超时
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.upload4.clearFiles();
                    return;
                }
                this.$refs.upload4.clearFiles();
                this.oOfficialAccount = data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            cnSuccess(data) {
                //上传文件 登录超时
                if (data.status == '-1') {
                    this.message = data.message;
                    this.open();
                    this.$refs.upload5.clearFiles();
                    return;
                }
                this.$refs.upload5.clearFiles();
                this.oFilmDirector = data.data;
                if (data.code == 'nologin') {
                    this.message = data.message;
                    this.open();
                    this.$router.push('/login');
                }
            },
            deleteSell(index) {
                this.selectedSell.splice(index, 1);
            },
            getCurrentRow(index) {
                this.sellIndex = index;
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
                https.fetchPost('/filmOpens/filmOpensAddPage', '').then(data => {
                        loading.close();
                        if (data.data.code == 'success') {
                            this.selectedSell = [];
                            this.selectedSell1 = [];
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            this.oForm.fullSeatNumber='';
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
                console.log(this.selectedSell1);
                let filmeCodes = [];
                for (let i = 0; i < this.selectedSell.length; i++) {
                    filmeCodes.push(this.selectedSell[i].filmCode);
                }
                this.oForm.filmCode = filmeCodes.join(',');
                let cinemaCodes = this.oForm.code.join(',');
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: cinemaCodes });
                jsonArr.push({ key: 'screenCode', value: this.selectScreenCode });
                jsonArr.push({ key: 'filmCode', value: this.oForm.filmCode });
                jsonArr.push({ key: 'stagePhoto', value: this.oForm.stagePhoto });
                jsonArr.push({ key: 'sessionTime', value: this.oForm.sessionTime });
                jsonArr.push({ key: 'ticketPrice', value: this.oForm.ticketPrice });
                jsonArr.push({ key: 'filmOpensName', value: this.oForm.filmOpensName });
                jsonArr.push({ key: 'startDate', value: this.oForm.startDate });
                jsonArr.push({ key: 'endDate', value: this.oForm.endDate });
                jsonArr.push({ key: 'agglomerationNumber', value: this.oForm.agglomerationNumber });
                jsonArr.push({ key: 'status', value: this.oForm.status });
                jsonArr.push({ key: 'recommendExplain', value: this.oForm.recommendExplain });
                jsonArr.push({ key: 'filmOpensExplain', value: this.oForm.filmOpensExplain });
                jsonArr.push({ key: 'buyTicketHint', value: this.oForm.buyTicketHint });
                jsonArr.push({ key: 'printTicketExplain', value: this.oForm.printTicketExplain });
                jsonArr.push({ key: 'officialAccount', value: this.oForm.officialAccount });
                jsonArr.push({ key: 'filmDirector', value: this.oForm.filmDirector });
                jsonArr.push({ key: 'fullSeatNumber', value: this.oForm.fullSeatNumber });
                jsonArr.push({ key: 'rebateListJson', value: JSON.stringify(this.selectedSell1) });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                if (this.dialogFormVisible == true) {
                    https
                        .fetchPost('/filmOpens/addFilmOpens', params)
                        .then(data => {
                            //新增
                            loading.close();
                            console.log(data);
                            if (data.data.code == 'success') {
                                this.dialogFormVisible = false;
                                this.$message.success(`新增成功`);
                                this.oForm.code=[];
                                this.oForm.screenCode=[];
                                this.selectedSell=[];
                                this.oForm.stagePhoto='';
                                this.oForm.sessionTime='';
                                this.oForm.ticketPrice='';
                                this.oForm.filmOpensName='';
                                this.oForm.startDate='';
                                this.oForm.endDate='';
                                this.oForm.agglomerationNumber='';
                                this.oForm.status='2';
                                this.oForm.filmOpensExplain='';
                                this.oForm.recommendExplain = '';
                                this.oForm.buyTicketHint='';
                                this.oForm.printTicketExplain='';
                                this.oForm.officialAccount='';
                                this.oForm.filmDirector='';
                                this.oForm.fullSeatNumber='';
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
                        https.fetchPost('/filmOpens/deleteFilmOpens', params).then(data => {
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
                https.fetchPost('/filmOpens/getFilmOpensById', params).then(data => {
                    loading.close();
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.selectedSell1=JSON.parse(Decrypt(data.data.data)).opensRebateList;
                        this.screenInfo = [];
                        if (
                            JSON.parse(Decrypt(data.data.data)).filmOpens.filmCode &&
                            JSON.parse(Decrypt(data.data.data)).filmOpens.filmName
                        ) {
                            let exFilmCodeList = JSON.parse(Decrypt(data.data.data)).filmOpens.filmCode.split(',');
                            let exFilmNameList = JSON.parse(Decrypt(data.data.data)).filmOpens.filmName.split('|');
                            this.selectedSell = [];
                            for (let x in exFilmNameList) {
                                let json = {};
                                json.filmName = exFilmNameList[x];
                                json.filmCode = exFilmCodeList[x];
                                this.selectedSell.push(json);
                            }
                        }
                        this.oFilmOpensName = JSON.parse(Decrypt(data.data.data)).filmOpens.filmOpensName;
                        this.oCinemaCode = JSON.parse(Decrypt(data.data.data)).filmOpens.cinemaCode.split(',');
                        this.getAllScreen(this.oCinemaCode.join(','));
                        this.oScreenCode = JSON.parse(Decrypt(data.data.data)).filmOpens.screenCode.split(',');
                        this.selectScreens2();
                        this.oStagePhoto = JSON.parse(Decrypt(data.data.data)).filmOpens.stagePhoto;
                        this.oSessionTime = JSON.parse(Decrypt(data.data.data)).filmOpens.sessionTime;
                        this.oTicketPrice = JSON.parse(Decrypt(data.data.data)).filmOpens.ticketPrice;
                        this.oStartDate = JSON.parse(Decrypt(data.data.data)).filmOpens.startDate;
                        this.oEndDate = JSON.parse(Decrypt(data.data.data)).filmOpens.endDate;
                        this.oAgglomerationNumber = JSON.parse(Decrypt(data.data.data)).filmOpens.agglomerationNumber;
                        this.oRecommendExplain = JSON.parse(Decrypt(data.data.data)).filmOpens.recommendExplain;
                        this.oFilmOpensExplain = JSON.parse(Decrypt(data.data.data)).filmOpens.filmOpensExplain;
                        this.oBuyTicketHint = JSON.parse(Decrypt(data.data.data)).filmOpens.buyTicketHint;
                        this.oPrintTicketExplain = JSON.parse(Decrypt(data.data.data)).filmOpens.printTicketExplain;
                        this.oOfficialAccount = JSON.parse(Decrypt(data.data.data)).filmOpens.officialAccount;
                        this.oFilmDirector = JSON.parse(Decrypt(data.data.data)).filmOpens.filmDirector;
                        this.oGroupStatus = JSON.parse(Decrypt(data.data.data)).filmOpens.groupStatus;
                        for (let x in this.canUse) {
                            if (this.canUse[x].value == JSON.parse(Decrypt(data.data.data)).filmOpens.status) {
                                this.oStatus = this.canUse[x].value;
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
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode.join(',') });
                jsonArr.push({ key: 'screenCode', value: this.oScreenCode });
                jsonArr.push({ key: 'filmCode', value: filmCodeList.join(',') });
                jsonArr.push({ key: 'stagePhoto', value: this.oStagePhoto });
                jsonArr.push({ key: 'sessionTime', value: this.oSessionTime });
                jsonArr.push({ key: 'ticketPrice', value: this.oTicketPrice });
                jsonArr.push({ key: 'filmOpensName', value: this.oFilmOpensName });
                jsonArr.push({ key: 'startDate', value: this.oStartDate });
                jsonArr.push({ key: 'endDate', value: this.oEndDate });
                jsonArr.push({ key: 'agglomerationNumber', value: this.oAgglomerationNumber });
                jsonArr.push({ key: 'status', value: this.oStatus });
                jsonArr.push({ key: 'recommendExplain', value: this.oRecommendExplain });
                jsonArr.push({ key: 'filmOpensExplain', value: this.oFilmOpensExplain });
                jsonArr.push({ key: 'buyTicketHint', value: this.oBuyTicketHint });
                jsonArr.push({ key: 'printTicketExplain', value: this.oPrintTicketExplain });
                jsonArr.push({ key: 'officialAccount', value: this.oOfficialAccount });
                jsonArr.push({ key: 'filmDirector', value: this.oFilmDirector });
                jsonArr.push({ key: 'fullSeatNumber', value: this.oForm.fullSeatNumber });
                jsonArr.push({ key: 'rebateListJson', value: JSON.stringify(this.selectedSell1) });
                jsonArr.push({ key: 'id', value: this.form.id });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/filmOpens/updateFilmOpens', params)
                    .then(data => {
                        loading.close();
                        // console.log(JSON.parse(Decrypt(data.data.data)));
                        if (data.data.code == 'success') {
                            this.editVisible = false;
                            this.$message.success(`编辑成功`);
                            this.oCinemaCode=[];
                            this.oScreenCode=[];
                            this.selectedSell=[];
                            this.oStagePhoto='';
                            this.oSessionTime='';
                            this.oTicketPrice='';
                            this.oFilmOpensName='';
                            this.oStartDate='';
                            this.oEndDate='';
                            this.oAgglomerationNumber='';
                            this.oStatus='';
                            this.oFilmOpensExplain='';
                            this.oBuyTicketHint='';
                            this.oPrintTicketExplain='';
                            this.oOfficialAccount='';
                            this.oFilmDirector='';
                            this.oForm.fullSeatNumber='';
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
                this.$confirm('请确认信息，一经启用部分信息不可修改', '提示', {
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
                        console.log(jsonArr);
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/filmOpens/updateStatusById', params)
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
            SearchFilm() {
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
                jsonArr.push({ key: 'sessionStartDate', value: this.query.sessionStartDate });
                jsonArr.push({ key: 'sessionEndDate', value: this.query.sessionEndDate });
                jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
                jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
                jsonArr.push({ key: 'filmName', value: this.query.filmName });
                jsonArr.push({ key: 'cinemaCode', value: this.query.cinemaCode });
                jsonArr.push({ key: 'groupStatus', value: this.query.groupStatus });
                jsonArr.push({ key: 'status', value: this.query.status });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                var params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/filmOpens/filmOpensPage', params)
                    .then(data => {
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
                //信息提示弹出框
                this.$alert(this.message, '信息提示', {
                    dangerouslyUseHTMLString: true
                });
            },
            selectCinema(val) {
                // if (val.length > 1) {
                //     this.oForm.selectHallType = '0';
                //     this.hallType = true;
                // } else {
                //     this.hallType = false;
                //
                // }
                let cinemaCode = val.join(',');
                this.getAllScreen(cinemaCode);
                this.oForm.code = val;
            },
            selectCinema2(val) {
                if (val.length > 1) {
                    this.oSelectHallType = '0';
                    this.hallType = true;
                } else {
                    this.hallType = false;
                    let cinemaCode = val.join(',');
                    this.getAllScreen(cinemaCode);
                }
                this.oCinemaCode = val;
            },
            selectScreens(val) {
                this.selectScreenCode = val.join(',');
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.oForm.code.join(',') });
                jsonArr.push({ key: 'screenCode', value: this.selectScreenCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/filmOpens/getSeatCount', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            this.oForm.fullSeatNumber = JSON.parse(Decrypt(data.data.data));
                        } else if (data.data.code == 'nologin') {
                            this.message = data.data.message;
                            this.oForm.fullSeatNumber = '';
                            this.open();
                            this.$router.push('/login');
                        } else {
                            this.oForm.fullSeatNumber = '';
                            this.message = data.data.message;
                            this.open();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            selectScreens1(val) {
                this.selectScreenCode = val.join(',');
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode.join(',') });
                jsonArr.push({ key: 'screenCode', value: this.oScreenCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/filmOpens/getSeatCount', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            this.oForm.fullSeatNumber = JSON.parse(Decrypt(data.data.data));
                        } else if (data.data.code == 'nologin') {
                            this.message = data.data.message;
                            this.oForm.fullSeatNumber = '';
                            this.open();
                            this.$router.push('/login');
                        } else {
                            this.oForm.fullSeatNumber = '';
                            this.message = data.data.message;
                            this.open();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            selectScreens2() {
                var jsonArr = [];
                jsonArr.push({ key: 'cinemaCode', value: this.oCinemaCode.join(',') });
                jsonArr.push({ key: 'screenCode', value: this.oScreenCode });
                let sign = md5(preSign(jsonArr));
                jsonArr.push({ key: 'sign', value: sign });
                console.log(jsonArr);
                let params = ParamsAppend(jsonArr);
                https
                    .fetchPost('/filmOpens/getSeatCount', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            console.log(JSON.parse(Decrypt(data.data.data)));
                            this.oForm.fullSeatNumber = JSON.parse(Decrypt(data.data.data));
                        } else if (data.data.code == 'nologin') {
                            this.message = data.data.message;
                            this.oForm.fullSeatNumber = '';
                            this.open();
                            this.$router.push('/login');
                        } else {
                            this.oForm.fullSeatNumber = '';
                            this.message = data.data.message;
                            this.open();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            selectFormat(val) {
                this.selectFormatCode = val.join(',');
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
                // console.log(a);
                this.oForm.filmCode = a;
            },
            sureNext() {
                if(this.selectedSell.length>=1){
                    this.message = '只能添加一部影片！';
                    this.open();
                }
                else{
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
                }
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

