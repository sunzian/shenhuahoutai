import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/adminUserPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminUserPage.vue'),
                    meta: { title: '商家账号管理' }
                },
                {
                    path: '/businessPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/businessPage.vue'),
                    meta: { title: '商家管理' }
                },
                {
                    path: '/cinemaPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/cinemaPage.vue'),
                    meta: { title: '影院管理' }
                },
                {
                    path: '/screenInfoPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/screenInfoPage.vue'),
                    meta: { title: '影厅管理' }
                },
                {
                    path: '/filmPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/filmPage.vue'),
                    meta: { title: '影片信息维护' }
                },
                {
                    path: '/merchandiseCoupon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/merchandiseCoupon.vue'),
                    meta: { title: '卖品优惠券管理' }
                },
                {
                    path: '/filmCoupon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/filmCoupon.vue'),
                    meta: { title: '影票优惠券管理' }
                },
                {
                    path: '/couponGroup',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/couponGroup.vue'),
                    meta: { title: '券包管理' }
                },
                {
                    path: '/chatroomAwards',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/chatroomAwards.vue'),
                    meta: { title: '放映厅奖品设置' }
                },
                {
                    path: '/directorPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/directorPage.vue'),
                    meta: { title: '导演管理' }
                },
                {
                    path: '/sessionInfoPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/sessionInfoPage.vue'),
                    meta: { title: '排期管理' }
                },
                {
                    path: '/thirdPricePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/thirdPricePage.vue'),
                    meta: { title: '三方比价' }
                },
                {
                    path: '/rechargeCardRulePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/rechargeCardRulePage.vue'),
                    meta: { title: '充值规则管理' }
                },
                {
                    path: '/actorPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/actorPage.vue'),
                    meta: { title: '演员管理' }
                },
                {
                    path: '/rolePermission',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/rolePermission.vue'),
                    meta: { title: '角色权限管理' }
                },
                {
                    path: '/rolePage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/rolePage.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/userPage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/userPage.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/bannerPage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/bannerPage.vue'),
                    meta: { title: '轮播图管理' }
                },
                {
                    path: '/cardOpenRulesPage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/cardOpenRulesPage.vue'),
                    meta: { title: '开卡规则管理' }
                },
                {
                    path: '/couponPage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/couponPage.vue'),
                    meta: { title: '优惠券配置' }
                },
                {
                    path: '/goldCommodityPage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/goldCommodityPage.vue'),
                    meta: { title: '金币商品管理' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue')
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
