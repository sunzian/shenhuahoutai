<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="dialogFormVisible = true" icon="el-icon-circle-plus-outline"  style="margin-left: 493px">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!--<el-table-column prop="id" label="ID" width="55" align="center">2222222222</el-table-column>-->
                <el-table-column prop="name" label="角色名">
                    <template slot-scope="scope">{{scope.row.roleName}}</template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">{{scope.row.createDate}}</template>
                </el-table-column>
                <!--<el-table-column label="头像(查看大图)" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-image-->
                            <!--class="table-td-thumb"-->
                            <!--:src="scope.row.thumb"-->
                            <!--:preview-src-list="[scope.row.thumb]"-->
                        <!--&gt;</el-image>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="address" label="描述">
                    <template slot-scope="scope">{{scope.row.memo}}</template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='1'" type='success'
                        >成功</el-tag>
                        <el-tag v-else type='danger'
                        >未通过</el-tag>
                        <!--<el-tag-->
                            <!--:type="scope.row.status==='1'?'success':(scope.row.status===null?'danger':'')"-->
                        <!--&gt;{{scope.row.status}}</el-tag>-->
                    </template>
                </el-table-column>
                <!--<el-table-column prop="date" label="注册时间"></el-table-column>-->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-zoom-in"
                                @click="handleEdit(scope.$index, scope.row)"
                        >查看</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
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
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!--新增弹出框-->
        <el-dialog title="新增角色" :visible.sync="dialogFormVisible">
            <el-form :model="oForm">
                <el-form-item label="角色名" :label-width="formLabelWidth">
                    <el-input maxlength="10" show-word-limit v-model="oForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input maxlength="30" type="textarea"
                              :rows="2" show-word-limit v-model="oForm.momo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input maxlength="3" v-model.number="oForm.sort" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                <el-select v-model="value" placeholder="请选择状态">
                    <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="角色名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import {Decrypt,Encrypt,preSign,EncryptReplace} from '@/aes/utils';
import md5 from 'js-md5';
import axios from 'axios';
import https from "../../https";
export default {
    name: 'basetable',
    data() {
        return {
            query: {},
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            oForm: {
                name: '',
                momo: '',
                sort: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px',
            options: [{
                value: '选项1',
                label: '审核中'
            }, {
                value: '选项2',
                label: '未审核'
            }, {
                value: '选项3',
                label: '通过'
            }, {
                value: '选项4',
                label: '审核失败'
            }],
            value: ''
        };
    },
    created() {
        // this.getData();
    },
    mounted(){
        https.fetchPost('/role/rolePage','').then((data) => {//获取菜单栏
               // console.log(JSON.parse(Decrypt(data.data.data)))
            var oData=JSON.parse(Decrypt(data.data.data))
            console.log(oData);
            console.log(this.query);
            this.tableData=oData.data
            this.query.pageSize=oData.pageSize
            this.query.pageNo=oData.pageNo
            this.query.totalCount=oData.totalCount
            this.query.totalPage=oData.totalPage

        }).catch(err=>{
                console.log(err)
            }
        )
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        // getData() {
        //     fetchData(this.query).then(res => {
        //         console.log(res);
        //         this.tableData = res.list;
        //         this.pageTotal = res.pageTotal || 50;
        //     });
        // },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
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
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
