<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 卖品通知
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <audio
                autoplay
                controls="controls"
                @click="play"
                style="display:none"
                id="audio"
            >
                <source ref="audio" src="../../assets/notify.mp3"  type='audio/mp3'/>
            </audio>
            <el-table
                :data="tableData"
                border
                height="500"
                class="table"
                ref="multipleTable"
                highlight-current-row
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="送餐地址">
                    <template slot-scope="scope">{{scope.row.deliveryAddress}}</template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">{{scope.row.deliveryMemo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="取货码">
                    <template slot-scope="scope">{{scope.row.printNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="取货状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.deliveryStatus=='0'">未取货</el-tag>
                        <el-tag v-else-if="scope.row.deliveryStatus=='1'">已取货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="卖品内容">
                    <template slot-scope="scope">{{scope.row.merNames}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="手机号">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="订单号">
                    <template slot-scope="scope">{{scope.row.orderNo}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="用户名">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="原价">
                    <template slot-scope="scope">{{scope.row.totalOriginalPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="实付金额">
                    <template slot-scope="scope">{{scope.row.totalActualPrice}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="活动优惠金额">
                    <template slot-scope="scope">{{scope.row.totalActivityDiscount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="优惠券优惠金额">
                    <template slot-scope="scope">{{scope.row.totalCouponDiscount}}</template>
                </el-table-column>
                <el-table-column prop="memo" label="支付状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.payStatus=='0'">未支付</el-tag>
                        <el-tag v-else-if="scope.row.payStatus=='1'">已支付</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="支付时间" align="center">
                    <template slot-scope="scope">{{scope.row.payTime}}</template>
                </el-table-column>
                <el-table-column label="取货方式" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.deliveryType=='0'">自取</el-tag>
                        <el-tag v-else-if="scope.row.deliveryType=='1'">送至影厅</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.deliveryType=='0'&&scope.row.deliveryStatus=='0'"
                            type="text"
                            icon="el-icon-setting"
                            @click="addChange(scope.$index, scope.row)"
                        >取货</el-button>
                        <el-button
                            v-if="scope.row.deliveryType=='1'&&scope.row.deliveryStatus=='0'"
                            type="text"
                            icon="el-icon-setting"
                            @click="addChange(scope.$index, scope.row)"
                        >确认送达</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
            totalData: [],
            tableData: [],
            maxId: 0,
            message: '', //弹出框消息
            query: {
                pageNo: 1,
                pageSize: 15
            },
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            formLabelWidth: '120px',
            businessInfoList: [],
            value: '',
            form: [],
            cinemaCode: '',
            audioSrc: "../../assets/notify.mp3"
        };
    },
    created() {
        this.cinemaCode = this.$route.query.cinemaCode;
    },
    mounted() {
        let audio = document.getElementById('audio');
        audio.volume = 0.0
        setTimeout(() => {
            this.getMenu();
        },3000)
        setInterval(() => {
            this.getMenu();
        }, 10000);
    },
    methods: {
        addChange(index, row) {
            if (row.deliveryStatus == '1') {
                this.message = '已取货，无法重复取货';
                this.open();
                return;
            }
            this.$confirm('确认取货?', '提示', {
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
                        var jsonArr = [];
                        jsonArr.push({ key: 'id', value: row.id });
                        let sign = md5(preSign(jsonArr));
                        jsonArr.push({ key: 'sign', value: sign });
                        let params = ParamsAppend(jsonArr);
                        https
                            .fetchPost('/merchandiseOrder/updateStatusById', params)
                            .then(data => {
                                loading.close();
                                if (data.data.code == 'success') {
                                    this.message = '取货成功！';
                                    this.open();
                                    row.deliveryStatus = '1';
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
                        message: '已取消取货'
                    });
                });
        },
        Search() {
            this.query.pageNo = 1;
            this.getMenu();
        },
        getMenu() {
            let jsonArr = [];
            jsonArr.push({ key: 'maxId', value: this.maxId });
            jsonArr.push({ key: 'cinemaCode', value: this.cinemaCode });
            let sign = md5(preSign(jsonArr));
            jsonArr.push({ key: 'sign', value: sign });
            var params = ParamsAppend(jsonArr);
            setTimeout(() => {
                https
                    .fetchPost('/merchandiseOrder/merchandiseOrderNotice', params)
                    .then(data => {
                        if (data.data.code == 'success') {
                            var oData = JSON.parse(Decrypt(data.data.data));
                            let tableData = this.tableData;
                            if (oData.length > 0) {
                                this.maxId = oData[0].id;
                                oData.push.apply(oData, tableData);
                                this.tableData = oData;
                                let audio = document.getElementById('audio');
                                audio.volume = 1.0
                                this.play();
                                this.message = '您有新的订单，请及时处理！';
                                this.open();
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
            }, 500);
        },
        openOrderNotice() {
            const { href } = this.$router.resolve({
                path: `/merchandiseOrderNotice`
            });
            window.open(href, '_blank');
        },
        open() {
            //信息提示弹出框
            this.$alert(this.message, '信息提示', {
                dangerouslyUseHTMLString: true
            });
        },
        // 语音播放
        play() {
            const audio = document.getElementById('audio');
            audio.play();
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
    font-size: 14px;
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

