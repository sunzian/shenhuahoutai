<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影片信息维护
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="影片名称" class="handle-input mr10"></el-input>
                <el-button style="margin-top: 10px;width: 90px;" type="primary" icon="el-icon-search" @click="Search">搜索</el-button>
                <el-button
                    type="primary"
                    @click="addPage"
                    icon="el-icon-circle-plus-outline"
                    style="float: right;margin-top: 10px"
                >添加</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="影片编码">
                    <template slot-scope="scope">{{scope.row.filmCode}}</template>
                </el-table-column>
                <el-table-column prop="name" label="影片名称">
                    <template slot-scope="scope">{{scope.row.filmName}}</template>
                </el-table-column>
                <el-table-column prop="name" label="图片">
                    <template slot-scope="scope">
                        <el-popover placement="right" title trigger="hover">
                            <img style="width:400px" :src="scope.row.image" />
                            <img
                                slot="reference"
                                :src="scope.row.image"
                                :alt="scope.row.image"
                                style="max-height: 50px;max-width: 130px"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="影片时长">
                    <template slot-scope="scope">{{scope.row.duration}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="影片上映日期">
                    <template slot-scope="scope">{{scope.row.publishDate}}</template>
                </el-table-column>
                <el-table-column prop="sort" label="通过状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">显示</el-tag>
                        <el-tag v-else type="danger">未显示</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
                            @click="addChange(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus-outline"
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
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item :required="true" label="影片编码" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.filmCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="影片名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.filmName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="影片版本" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.dimensional" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="影片时长" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.duration" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="上映时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oForm.publishDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="可选导演列表" :label-width="formLabelWidth">
                    <el-button type="primary" @click="getAllDirector">选择导演</el-button>
                </el-form-item>
                <el-form-item
                    label="已选导演"
                    :label-width="formLabelWidth"
                    v-if="directorList.length>0"
                >
                    <div v-for="(item, index) in directorList" :key="index">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="hover">
                            <img style="width: 400px" :src="item.picture"/>
                            <img slot="reference" :src="item.picture" :alt="item.picture" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                        {{item.name}}
                        <span
                            style="color:red;cursor: pointer;"
                            @click="deletDirector(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="可选演员列表" :label-width="formLabelWidth">
                    <el-button type="primary" @click="getAllActor">选择演员</el-button>
                </el-form-item>
                <el-form-item label="已选演员" :label-width="formLabelWidth" v-if="actorList.length>0">
                    <div v-for="(item, index) in actorList" :key="index">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="hover">
                            <img style="width: 400px" :src="item.picture"/>
                            <img slot="reference" :src="item.picture" :alt="item.picture" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                        {{item.name}}
                        <span
                            style="color:red;cursor: pointer;"
                            @click="deletActor(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="影片介绍" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.introduction" autocomplete="off"></el-input>
                </el-form-item>
                <!--<el-form-item label="评分" :label-width="formLabelWidth">-->
                    <!--<el-input style="width: 250px" v-model="oForm.score" autocomplete="off"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="地区" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.area" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.type" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="语言" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oForm.language" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :required="true" label="是否显示" :label-width="formLabelWidth">
                    <el-select v-model="oForm.status" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :required="true" label="图片" :label-width="formLabelWidth">
                    <el-upload
                        class="upload-demo"
                        action="/api/upload/uploadImage"
                        :before-upload="beforeUpload"
                        :data="type"
                        :limit="1"
                        :on-success="onSuccess"
                        :file-list="fileList"
                        list-type="picture"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过200kb 建议尺寸280*390或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="影片剧照" :label-width="formLabelWidth">
                    <el-upload
                        action="/api/upload/uploadImage"
                        :file-list="fileList"
                        list-type="picture-card"
                        :before-upload="beforeUploadPhoto"
                        :data="photoType"
                        ref="upload"
                        :on-success="onPhotoSuccess"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
                </el-form-item>
                <!-- 暂时只支持单视频上传,要做成多视频上传 -->
                <!--<el-form-item label="预告片" :label-width="formLabelWidth">-->
                    <!--<el-upload-->
                        <!--class="avatar-uploader el-upload&#45;&#45;text"-->
                        <!--action="/api/upload/uploadVideo"-->
                        <!--:show-file-list="false"-->
                        <!--:on-success="handleVideoSuccess"-->
                        <!--:before-upload="beforeUploadVideo"-->
                        <!--:on-progress="uploadVideoProcess"-->
                    <!--&gt;-->
                        <!--<video-->
                            <!--v-if="videoForm.Video !='' && videoFlag == false"-->
                            <!--:src="videoForm.Video"-->
                            <!--class="avatar el-upload&#45;&#45;text"-->
                            <!--controls="controls"-->
                        <!--&gt;您的浏览器不支持视频播放</video>-->
                        <!--<i-->
                            <!--v-if="videoForm.Video =='' && videoFlag == false"-->
                            <!--class="el-icon-plus avatar-uploader-icon"-->
                        <!--&gt;</i>-->
                        <!--<el-progress-->
                            <!--v-if="videoFlag == true"-->
                            <!--type="circle"-->
                            <!--:percentage="videoUploadPercent"-->
                            <!--style="margin-top:30px;"-->
                        <!--&gt;</el-progress>-->
                    <!--</el-upload>-->
                <!--</el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="影片编码" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oFilmCode" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="影片名称" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oFilmName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影片版本" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oDimensional" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="影片时长" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oDuration" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上映时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="oPublishDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="可选导演列表" :label-width="formLabelWidth">
                    <el-button type="primary" @click="getAllDirector">选择导演</el-button>
                </el-form-item>
                <el-form-item label="已选导演" :label-width="formLabelWidth">
                    <div v-for="(item, index) in directorList" :key="index">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="hover">
                            <img style="width: 400px" :src="item.picture"/>
                            <img slot="reference" :src="item.picture" :alt="item.picture" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                        {{item.name}}
                        <span
                            style="color:red;cursor: pointer;"
                            @click="deletDirector(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="可选演员列表" :label-width="formLabelWidth">
                    <el-button type="primary" @click="getAllActor">选择演员</el-button>
                </el-form-item>
                <el-form-item label="已选演员" :label-width="formLabelWidth">
                    <div v-for="(item, index) in actorList" :key="index">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="hover">
                            <img style="width: 400px" :src="item.picture"/>
                            <img slot="reference" :src="item.picture" :alt="item.picture" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                        {{item.name}}
                        <span
                            style="color:red;cursor: pointer;"
                            @click="deletActor(index)"
                        >删除</span>
                    </div>
                </el-form-item>
                <el-form-item label="影片介绍" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oIntroduction" autocomplete="off"></el-input>
                </el-form-item>
                <!--<el-form-item label="评分" :label-width="formLabelWidth">-->
                    <!--<el-input style="width: 250px" v-model="oScore" autocomplete="off"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="地区" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oArea" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="语言" :label-width="formLabelWidth">
                    <el-input style="width: 250px" v-model="oLanguage" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否显示" :label-width="formLabelWidth">
                    <el-select v-model="oStatus" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth">
                    <el-popover placement="right" title trigger="hover">
                        <img style="width: 400px" :src="oImage" />
                        <img
                            slot="reference"
                            :src="oImage"
                            :alt="oImage"
                            style="max-height: 50px;max-width: 130px"
                        />
                    </el-popover>
                    <el-upload
                        class="upload-demo"
                        action="/api/upload/uploadImage"
                        :before-upload="beforeUpload"
                        :data="type"
                        ref="upload"
                        :limit="1"
                        :on-success="onSuccessChange"
                        :file-list="fileList"
                        list-type="picture"
                    >
                        <el-button size="small" type="primary">点击上传修改</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过200kb 建议尺寸280*390或按比例上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="影片剧照" :label-width="formLabelWidth">
                    <el-popover placement="right" title v-for="(item,index) in oStagePhotoList" :key="index">
                        <!-- <img style="width: 400px" :src="item" /> -->
                        <img
                            slot="reference"
                            :src="item"
                            :alt="item"
                            style="height: 170px;width: 300px"
                        />
                    </el-popover>
                    <el-upload
                        action="/api/upload/uploadImage"
                        :file-list="fileList"
                        list-type="picture-card"
                        :before-upload="beforeUploadPhoto"
                        :data="photoType"
                        ref="download"
                        :on-success="onPhotoSuccessChange"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemoveChange"
                    >
                        <span class="el-icon-plus">重新上传</span>
                    </el-upload>
                    <span>只能上传jpg/png文件，且不超过200kb 建议尺寸300*170或按比例上传</span>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
                </el-form-item>
                <!--<el-form-item label="预告片" :label-width="formLabelWidth">-->
                    <!--<video-->
                            <!--:src="oTrailer"-->
                            <!--class="avatar el-upload&#45;&#45;text"-->
                            <!--controls="controls"-->
                        <!--&gt;您的浏览器不支持视频播放</video>-->
                <!--</el-form-item>-->
                <!--<el-form-item  label="重新上传" :label-width="formLabelWidth">-->
                    <!--<el-upload-->
                        <!--class="avatar-uploader el-upload&#45;&#45;text"-->
                        <!--action="/api/upload/uploadVideo"-->
                        <!--:show-file-list="false"-->
                        <!--:on-success="handleVideoSuccess"-->
                        <!--:before-upload="beforeUploadVideo"-->
                        <!--:on-progress="uploadVideoProcess"-->
                    <!--&gt;-->
                        <!--<video-->
                            <!--v-if="videoForm.Video !='' && videoFlag == false"-->
                            <!--:src="videoForm.Video"-->
                            <!--class="avatar el-upload&#45;&#45;text"-->
                            <!--controls="controls"-->
                        <!--&gt;您的浏览器不支持视频播放</video>-->
                        <!--<i-->
                            <!--v-if="videoForm.Video =='' && videoFlag == false"-->
                            <!--class="el-icon-plus avatar-uploader-icon"-->
                        <!--&gt;</i>-->
                        <!--<el-progress-->
                            <!--v-if="videoFlag == true"-->
                            <!--type="circle"-->
                            <!--:percentage="videoUploadPercent"-->
                            <!--style="margin-top:30px;"-->
                        <!--&gt;</el-progress>-->
                    <!--</el-upload>-->
                <!--</el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="exChanger">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 选择导演弹出窗 -->
        <el-dialog :close-on-click-modal="false" title="选择导演" :visible.sync="allDirector">
            <div class="handle-box">
                <el-input v-model="query.directorName" placeholder="导演名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="directorSearch">搜索</el-button>
            </div>
            <div class="container">
                <el-table
                    :data="directorTableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="selectDirector">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="name" label="图片">
                        <template slot-scope="scope">
                            <el-popover placement="right" title trigger="hover">
                                <img style="width:400px" :src="scope.row.picture" />
                                <img
                                    slot="reference"
                                    :src="scope.row.picture"
                                    :alt="scope.row.picture"
                                    style="max-height: 50px;max-width: 130px"
                                />
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="导演名称" width="150">
                        <template slot-scope="scope">{{scope.row.name}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="导演介绍" width="150">
                        <template slot-scope="scope">{{scope.row.introduction}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="国籍" width="150">
                        <template slot-scope="scope">{{scope.row.country}}</template>
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
                <el-button @click="allDirector = false">取 消</el-button>
                <el-button type="primary" @click="sureDirector">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 选择演员弹出窗 -->
        <el-dialog :close-on-click-modal="false" title="选择演员" :visible.sync="allActor">
            <div class="handle-box">
                <el-input v-model="query.actorName" placeholder="演员名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="actorSearch">搜索</el-button>
            </div>
            <div class="container">
                <el-table
                    :data="actorTableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="selectActor"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="name" label="图片">
                        <template slot-scope="scope">
                            <el-popover placement="right" title trigger="hover">
                                <img style="width:400px" :src="scope.row.picture" />
                                <img
                                    slot="reference"
                                    :src="scope.row.picture"
                                    :alt="scope.row.picture"
                                    style="max-height: 50px;max-width: 130px"
                                />
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="演员名称" width="150">
                        <template slot-scope="scope">{{scope.row.name}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="演员介绍" width="150">
                        <template slot-scope="scope">{{scope.row.introduction}}</template>
                    </el-table-column>
                    <el-table-column prop="sort" label="国籍" width="150">
                        <template slot-scope="scope">{{scope.row.country}}</template>
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
                <el-button @click="allActor = false">取 消</el-button>
                <el-button type="primary" @click="sureActor">确 定</el-button>
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
            directorList1:[],
            oFilmName: '',
            oArea: '',
            oActorId: '',
            oCreateDate: '',
            oDirectorId: '',
            oDuration: '',
            oFilmCode: '',
            oId: '',
            oImage: '',
            oIntroduction: '',
            oLanguage: '',
            oProducer: '',
            oPublishDate: '',
            oPublisher: '',
            oScore: '',
            oStagePhoto: [],
            oStagePhotoList: [],
            photoUrl: '',
            oStatus: '',
            oTrailer: '',
            oType: '',
            videoFlag: false,
            videoForm: {},
            type: {
                type: ''
            },
            photoType: {
                type: ''
            },
            dialogImageUrl: '',
            dialogVisible: false,
            oDimensional: '',
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15,
                oPageNo: 1,
                opageSize: 15,
                aPageNo: 1,
                apageSize: 15,
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            fileList: [],
            videoList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            director: '',
            actor: '',
            directorList: [],
            actorList: [],
            actorList1: [],
            directorArr: [],
            actorArr: [],
            directorTableData: [],
            actorTableData: [],
            allDirector: false,
            allActor: false,
            stageImg: '',
            selectScreen: '', // 选中的影厅
            idx: -1,
            id: '',
            dialogFormVisible: false,
            videoUploadPercent: 0,
            options: [
                {
                    value: '0',
                    label: '不显示'
                },
                {
                    value: '1',
                    label: '显示'
                }
            ],
            oForm: {
                area: '',
                castId: '',
                createDate: '',
                directorId: '',
                duration: '',
                filmCode: '',
                filmName: '',
                id: '',
                image: '',
                introduction: '',
                language: '',
                producer: '',
                publishDate: '',
                publisher: '',
                score: '',
                stagePhoto: [],
                status: '',
                trailer: '',
                type: '',
                dimensional: ''
            },
            formLabelWidth: '120px',
            selectValue: {},
            cinemaInfo: [],
            value: ''
        };
    },
    created() {},
    mounted() {
        this.getMenu();
    },
    methods: {
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
                .fetchPost('/film/addPage', '')
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        this.dialogFormVisible = true;
                        this.fileList = [];
                        this.videoList = [];
                        this.oForm.filmCode = '';
                        this.oForm.filmName = '';
                        this.oForm.dimensional = '';
                        this.oForm.duration = '';
                        this.oForm.publishDate = '';
                        this.directorList = [];
                        this.actorList = [];
                        this.oForm.introduction = '';
                        this.oForm.score = '';
                        this.oForm.area = '';
                        this.oForm.type = '';
                        this.oForm.language = '';
                        this.oForm.status = '';
                        this.oForm.image = '';
                        this.oForm.trailer = '';
                        this.videoForm = {};
                        this.oForm.stagePhoto = [];
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
            for (let i = 0; i < this.directorList.length; i++) {
                this.director += ',' + this.directorList[i].id;
            }
            if (this.director.substring(1).length > 0) {
                this.director = this.director.substring(1);
            }
            for (let i = 0; i < this.actorList.length; i++) {
                this.actor += ',' + this.actorList[i].id;
            }
            if (this.actor.substring(1).length > 0) {
                this.actor = this.actor.substring(1);
            }
            for (let i = 0; i < this.oForm.stagePhoto.length; i++) {
                this.stageImg += ',' + this.oForm.stagePhoto[i].url;
            }
            if (this.stageImg.substring(1).length > 0) {
                this.stageImg = this.stageImg.substring(1);
            }
            // console.log(this.oForm.stagePhoto);
            // console.log(this.stageImg);
            // console.log(this.actor);
            // console.log(this.director);
            var jsonArr = [];
            jsonArr.push({ key: 'filmCode', value: this.oForm.filmCode });
            jsonArr.push({ key: 'filmName', value: this.oForm.filmName });
            jsonArr.push({ key: 'dimensional', value: this.oForm.dimensional });
            jsonArr.push({ key: 'duration', value: this.oForm.duration });
            jsonArr.push({ key: 'publishDate', value: this.oForm.publishDate });
            jsonArr.push({ key: 'directorId', value: this.director });
            jsonArr.push({ key: 'actorId', value: this.actor });
            jsonArr.push({ key: 'introduction', value: this.oForm.introduction });
            jsonArr.push({ key: 'score', value: this.oForm.score });
            jsonArr.push({ key: 'area', value: this.oForm.area });
            jsonArr.push({ key: 'type', value: this.oForm.type });
            jsonArr.push({ key: 'language', value: this.oForm.language });
            jsonArr.push({ key: 'status', value: this.oForm.status });
            jsonArr.push({ key: 'image', value: this.oForm.image });
            jsonArr.push({ key: 'trailer', value: this.videoForm.Video });
            jsonArr.push({ key: 'stagePhoto', value: this.stageImg });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            if (this.dialogFormVisible == true) {
                https
                    .fetchPost('/film/addFilm', params)
                    .then(data => {
                        loading.close();
                        //新增
                        if (data.data.code == 'success') {
                            this.dialogFormVisible = false;
                            this.$message.success(`新增成功`);
                           this.directorList=[];
                           this.actorList=[];
                           this.oForm.stagePhoto=[];
                            this.director='';
                            this.actor='';
                            this.stageImg='';
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
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)',
                        target: document.querySelector('.div1')
                    });
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
                    https
                        .fetchPost('/film/deleteFilm', params)
                        .then(data => {
                            loading.close();
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
                })  .catch(() => {
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
            this.idx = index;
            this.form = row;
            var jsonArr = [];
            jsonArr.push({ key: 'id', value: row.id });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/film/getFilmById', params)
                .then(data => {
                    console.log(data);
                    loading.close();
                    console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = true;
                        this.oArea = JSON.parse(Decrypt(data.data.data)).area;
                        this.actorList = JSON.parse(Decrypt(data.data.data)).actorList;
                        this.oCreateDate = JSON.parse(Decrypt(data.data.data)).createDate;
                        this.directorList = JSON.parse(Decrypt(data.data.data)).directorList;
                        this.oDuration = JSON.parse(Decrypt(data.data.data)).duration;
                        this.oFilmCode = JSON.parse(Decrypt(data.data.data)).filmCode;
                        this.oFilmName = JSON.parse(Decrypt(data.data.data)).filmName;
                        this.oId = JSON.parse(Decrypt(data.data.data)).id;
                        this.oImage = JSON.parse(Decrypt(data.data.data)).image;
                        this.oIntroduction = JSON.parse(Decrypt(data.data.data)).introduction;
                        this.oLanguage = JSON.parse(Decrypt(data.data.data)).language;
                        this.oProducer = JSON.parse(Decrypt(data.data.data)).producer;
                        this.oPublishDate = JSON.parse(Decrypt(data.data.data)).publishDate;
                        this.oPublisher = JSON.parse(Decrypt(data.data.data)).publisher;
                        this.oScore = JSON.parse(Decrypt(data.data.data)).score;
                        this.oStagePhotoList = JSON.parse(Decrypt(data.data.data)).stagePhotoList;
                        this.oStatus = JSON.parse(Decrypt(data.data.data)).status;
                        for (let x in this.options) {
                            if (this.options[x].value == JSON.parse(Decrypt(data.data.data)).status) {
                                this.oStatus = this.options[x].value;
                                break;
                            }
                        }
                        this.oTrailer = JSON.parse(Decrypt(data.data.data)).trailer;
                        this.oType = JSON.parse(Decrypt(data.data.data)).type;
                        this.oDimensional = JSON.parse(Decrypt(data.data.data)).dimensional;
                        this.director = '';
                        this.actor = '';
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
            console.log(this.directorList);
            console.log(this.actorList);
            console.log(this.oStagePhoto);
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            var jsonArr = [];
            if(this.directorList&&this.directorList.length>0){
                for (let i = 0; i < this.directorList.length; i++) {
                    this.director += ',' + this.directorList[i].id;
                }
                if (this.director.substring(1).length > 0) {
                    this.director = this.director.substring(1);
                }
            }
            if(this.actorList&&this.actorList.length>0){
                for (let i = 0; i < this.actorList.length; i++) {
                    this.actor += ',' + this.actorList[i].id;
                }
                if (this.actor.substring(1).length > 0) {
                    this.actor = this.actor.substring(1);
                }
            }
            if(this.oStagePhoto&&this.oStagePhoto.length>0){
                if (this.oStagePhoto.length == 0) {
                    for (let i = 0; i < this.oStagePhotoList.length; i++) {
                        this.photoUrl += ',' + this.oStagePhotoList[i];
                    }
                    if (this.photoUrl.substring(1).length > 0) {
                        this.photoUrl = this.photoUrl.substring(1);
                    }
                } else {
                    for (let i = 0; i < this.oStagePhoto.length; i++) {
                        this.photoUrl += ',' + this.oStagePhoto[i].url;
                    }
                    if (this.photoUrl.substring(1).length > 0) {
                        this.photoUrl = this.photoUrl.substring(1);
                    }
                }
            }
            jsonArr.push({ key: 'filmCode', value: this.oFilmCode });
            jsonArr.push({ key: 'filmName', value: this.oFilmName });
            jsonArr.push({ key: 'dimensional', value: this.oDimensional });
            jsonArr.push({ key: 'duration', value: this.oDuration });
            jsonArr.push({ key: 'publishDate', value: this.oPublishDate });
            jsonArr.push({ key: 'directorId', value: this.director });
            jsonArr.push({ key: 'actorId', value: this.actor });
            jsonArr.push({ key: 'introduction', value: this.oIntroduction });
            jsonArr.push({ key: 'score', value: this.oScore });
            jsonArr.push({ key: 'area', value: this.oArea });
            jsonArr.push({ key: 'type', value: this.oType });
            jsonArr.push({ key: 'language', value: this.oLanguage });
            if (this.oStatus == '通过') {
                this.oStatus = 1;
            }
            if (this.oStatus == '未通过') {
                this.oStatus = 2;
            }
            jsonArr.push({ key: 'status', value: this.oStatus });
            jsonArr.push({ key: 'image', value: this.oImage });
            jsonArr.push({ key: 'trailer', value: this.oTrailer });
            jsonArr.push({ key: 'stagePhoto', value: this.photoUrl });
            jsonArr.push({ key: 'id', value: this.oId });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            console.log(jsonArr);
            let params = ParamsAppend(jsonArr);
            https
                .fetchPost('/film/updateFilm', params)
                .then(data => {
                    loading.close();
                    // console.log(JSON.parse(Decrypt(data.data.data)));
                    if (data.data.code == 'success') {
                        this.editVisible = false;
                        this.$message.success(`编辑成功`);
                        this.directorList=[];
                        this.actorList=[];
                        this.oStagePhotoList=[];
                        this.director='';
                        this.actor='';
                        this.photoUrl='';
                        this.$refs.upload.clearFiles();//清除已上传文件
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
            let name = this.query.name;
            let status = this.query.status;
            if (!name) {
                name = '';
            }
            if (!status) {
                status = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'pageNo', value: this.query.pageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.pageSize });
            jsonArr.push({ key: 'filmName', value: name });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/film/filmPage', params)
                .then(data => {
                    loading.close();
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
        },
        beforeUpload() {
            //上传之前
            this.type.type = EncryptReplace('movielogo');
        },
        onSuccess(response) {
            //上传文件 登录超时
            this.oForm.image = response.data;
            if (response.code == 'nologin') {
                this.message = response.message;
                this.open();
                this.$router.push('/login');
            }
        },
        onSuccessChange(response) {
            //上传文件 登录超时
            this.oImage = response.data;
            if (response.code == 'nologin') {
                this.message = response.message;
                this.open();
                this.$router.push('/login');
            }
        },
        beforeUploadPhoto() {
            //上传之前
            this.photoType.type = EncryptReplace('moviepic');
        },
        onPhotoSuccess(response, file) {
            if (response.status == '-1') {
                this.message = response.message;
                this.open();
                this.$refs.upload.clearFiles();
                return;
            }
            this.oForm.stagePhoto.push({ name: file.name, url: response.data });
            if (response.code == 'nologin') {
                this.message = response.message;
                this.open();
                this.$router.push('/login');
            }
        },
        onPhotoSuccessChange(response, file) {
            console.log(response);
            console.log(file);
            if (response.status == '-1') {
                this.message = response.message;
                this.open();
                this.$refs.download.clearFiles();
                return;
            }
            this.oStagePhoto.push({ name: file.name, url: response.data });
            console.log(this.oStagePhoto);
            if (response.code == 'nologin') {
                this.message = response.message;
                this.open();
                this.$router.push('/login');
            }
        },
        handleRemove(response) {
            this.oForm.stagePhoto.splice(
                // 找到要删除的元素的下标
                this.oForm.stagePhoto.indexOf(
                    this.oForm.stagePhoto.find(function(element) {
                        return element.name == response.name;
                    })
                ),
                1
            );
        },
        handleRemoveChange(response) {
            this.oStagePhoto.splice(
                // 找到要删除的元素的下标
                this.oStagePhoto.indexOf(
                    this.oStagePhoto.find(function(element) {
                        return element.name == response.name;
                    })
                ),
                1
            );
        },
        handleRemoveVideo(response) {
            console.log(response);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleVideoCardPreview(file) {
            console.log(file);
        },
        directorSearch() {
            this.query.pageNo = 1;
            this.getAllDirector();
        },
        // 获取所有导演
        getAllDirector() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let directorName = this.query.directorName;
            if (!directorName) {
                directorName = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'pageNo', value: this.query.oPageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.oPageSize });
            jsonArr.push({ key: 'name', value: directorName });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/director/directorPage',params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let director = JSON.parse(Decrypt(data.data.data));
                        console.log(director);
                        this.allDirector = true;
                        this.directorTableData = director.data;
                        this.query.oPageSize = director.pageSize;
                        this.query.oPageNo = director.pageNo;
                        this.query.oTotalCount = director.totalCount;
                        this.query.oTotalPage = director.totalPage;
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
        actorSearch() {
            this.query.aPageNo = 1;
            this.getAllActor();
        },
        // 获取所有演员
        getAllActor() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.div1')
            });
            let actorName = this.query.actorName;
            if (!actorName) {
                actorName = '';
            }
            let jsonArr = [];
            jsonArr.push({ key: 'pageNo', value: this.query.aPageNo });
            jsonArr.push({ key: 'pageSize', value: this.query.aPageSize });
            jsonArr.push({ key: 'name', value: actorName });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            https
                .fetchPost('/actor/actorPage', params)
                .then(data => {
                    loading.close();
                    if (data.data.code == 'success') {
                        let actor = JSON.parse(Decrypt(data.data.data));
                        console.log(actor);
                        this.allActor = true;
                        this.actorTableData = actor.data;
                        this.query.aPageSize = actor.pageSize;
                        this.query.aPageNo = actor.pageNo;
                        this.query.aTotalCount = actor.totalCount;
                        this.query.aTotalPage = actor.totalPage;
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
        sureDirector() {
            console.log(this.directorList);
            console.log(this.directorList1);
            for(let x in this.directorList1){
                this.directorList.push(this.directorList1[x])
            }
            if (this.directorList.length == 0) {
                this.message = '请选择导演';
                this.open();
                return;
            }
            this.allDirector = false;
        },
        sureActor() {
            for(let x in this.actorList1){
                this.actorList.push(this.actorList1[x])
            }
            if (this.actorList.length == 0) {
                this.message = '请选择演员';
                this.open();
                return;
            }
            this.allActor = false;
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
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        // 多选导演操作
        selectDirector(val) {
            console.log(val);
            // this.directorList = [];
            this.directorList1 = val;
        },
        // 多选演员操作
        selectActor(val) {
            // this.actorList = [];
            this.actorList1 = val;
        },
        // 删除已选导演
        deletDirector(index) {
            this.directorList.splice(index, 1);
        },
        // 删除已选演员
        deletActor(index) {
            this.actorList.splice(index, 1);
        },
        beforeUploadVideo(file) {
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) == -1) {
                this.$message.error('请上传正确的视频格式');
                return false;
            }
            if (!isLt10M) {
                this.$message.error('上传视频大小不能超过10MB哦!');
                return false;
            }
        },
        handleVideoSuccess(res, file) {
            //获取上传地址
            this.videoFlag = false;
            this.videoUploadPercent = 0;
            if (res.status == 0) {
                this.videoForm.Video = res.data;
            } else {
                this.$message.error(res.message);
            }
        },
        uploadVideoProcess(event, file, fileList) {
            this.videoFlag = true;
            this.videoUploadPercent = Number(file.percentage.toFixed(0));
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
            this.getAllDirector();
        },
        oPrev() {
            //分页按钮上一页
            this.query.oPageNo--;
            this.getAllDirector();
        },
        oNext() {
            //分页按钮下一页
            this.query.oPageNo++;
            this.getAllDirector();
        },
        aCurrentChange(val) {
            //点击选择具体页数
            this.query.aPageNo = val;
            this.getAllActor();
        },
        aPrev() {
            //分页按钮上一页
            this.query.aPageNo--;
            this.getAllActor();
        },
        aNext() {
            //分页按钮下一页
            this.query.aPageNo++;
            this.getAllActor();
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
    li {
        width: 300px;
        height: 170px;
    }
</style>
