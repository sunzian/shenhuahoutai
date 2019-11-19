<template>
    <div class="sidebar" v-if="!cinemaCode">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in menuList">
                <template v-if="item.submenuList" >
                    <el-submenu :index="item.id+''" :key="item.id">
                        <template slot="title">
                            <i :class=" item.menuIcon "></i>
                            <span slot="title">{{ item.menuName }}</span>
                        </template>
                        <template v-for="subItem in item.submenuList" >
                            <el-submenu
                                v-if="subItem.submenuList"
                                :index="subItem.dashboard"
                                :key="subItem.dashboard"
                            >
                                <template slot="title" >{{ subItem.menuName }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.submenuList"
                                    :key="i"
                                    :index="threeItem.dashboard"
                                >{{ threeItem.menuName }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.dashboard"
                                :key="subItem.dashboard"
                            >{{ subItem.menuName }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.dashboard" :key="item.dashboard">
                        <!--<i :class="item.icon"></i>-->
                        <span slot="title">{{ item.menuName }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
import {Decrypt,Encrypt,preSign,EncryptReplace} from '@/aes/utils';
import md5 from 'js-md5';
import axios from 'axios';
import https from "../../https";
export default {
    data() {
        return {
            collapse: false,
            menuList:[],
        };
    },
    mounted() {
        https.fetchPost('/admin/getMenus','').then((data) => {//获取菜单栏
            // console.log(data.data.code)
            if(data.data.code=='nologin'){
                this.$router.push('/login');
            }
           else if(data.data.code == 'success'){
                let menus=Decrypt(data.data.data)//返回的数据进行解密
                // console.log(menus);
                this.menuList =JSON.parse(menus)
                // console.log(this.menuList);
            }
        }).catch(err=>{
                console.log(err)
            }
        )
    },
    watch: {

    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    methods:{
    },
    created() {
        this.cinemaCode = this.$route.query.cinemaCode
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
