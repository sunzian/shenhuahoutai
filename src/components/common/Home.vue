<template>
    <div class="wrapper" v-if='key'>
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse,'show': !cinemaCode }">
            <!-- <v-tags></v-tags> -->
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';
import {Decrypt,Encrypt,preSign,EncryptReplace} from '@/aes/utils';
import md5 from 'js-md5';
import axios from 'axios';
import https from "../../https";
export default {
    data() {
        return {
            tagsList: [],
            collapse: false,
            key:false
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags
    },
    mounted() {
        https.fetchPost('/admin/getMenus','').then((data) => {//获取菜单栏
            if(data.data.code=='nologin'){
                this.$router.push('/login');
            }
            else if(data.data.code == 'success'){
                this.key=true;
                // let menus=;//返回的数据进行解密
                this.menuList =JSON.parse(Decrypt(data.data.data));
            }
        }).catch(err=>{
            console.log(err);
            this.$router.push('/login');
            }
        )
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });
        this.cinemaCode = this.$route.query.cinemaCode
        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    }
};
</script>
