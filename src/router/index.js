import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login'
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
                    path: '/ticketOrderPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/ticketOrderPage.vue'),
                    meta: { title: '影票订单' }
                },
                {
                    path: '/adminTicketOrderPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminTicketOrderPage.vue'),
                    meta: { title: '影票订单' }
                },
                {
                    path: '/merchandiseOrderPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/merchandiseOrderPage.vue'),
                    meta: { title: '卖品订单' }
                },
                {
                    path: '/adminMerchandiseOrderPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminMerchandiseOrderPage.vue'),
                    meta: { title: '卖品订单' }
                },
                {
                    path: '/memberCardRechargePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/memberCardRechargePage.vue'),
                    meta: { title: '会员卡充值订单' }
                },
                {
                    path: '/adminMemberCardRechargePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminMemberCardRechargePage.vue'),
                    meta: { title: '会员卡充值订单' }
                },
                {
                    path: '/memberUserPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/memberUserPage.vue'),
                    meta: { title: '注册会员列表' }
                },
                {
                    path: '/adminMemberUserPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminMemberUserPage.vue'),
                    meta: { title: '注册会员列表' }
                },
                {
                    path: '/commodityChangeRecordPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/commodityChangeRecordPage.vue'),
                    meta: { title: '金币商城订单' }
                },
                {
                    path: '/adminCommodityChangeRecordPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminCommodityChangeRecordPage.vue'),
                    meta: { title: '金币商城订单' }
                },
                {
                    path: '/adminNoticeOfActivityPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminNoticeOfActivityPage.vue'),
                    meta: { title: '轮播图文章管理' }
                },
                {
                    path: '/noticeOfActivityPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/noticeOfActivityPage.vue'),
                    meta: { title: '轮播图文章管理' }
                },
                {
                    path: '/businessPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/businessPage.vue'),
                    meta: { title: '商家管理' }
                },
                {
                    path: '/goldAcquireRulePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/goldAcquireRulePage.vue'),
                    meta: { title: '金币获取规则设置' }
                },
                {
                    path: '/adminGoldAcquireRulePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminGoldAcquireRulePage.vue'),
                    meta: { title: '金币获取规则设置' }
                },
                {
                    path: '/cinemaPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/cinemaPage.vue'),
                    meta: { title: '影院管理' }
                },
                {
                    path: '/cinema',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/cinema.vue'),
                    meta: { title: '影院设置' }
                },
                {
                    path: '/screenInfoPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/screenInfoPage.vue'),
                    meta: { title: '影厅管理' }
                },
                {
                    path: '/adminScreenInfoPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminScreenInfoPage.vue'),
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
                    path: '/adminMerchandiseCoupon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminMerchandiseCoupon.vue'),
                    meta: { title: '卖品优惠券管理' }
                },
                {
                    path: '/memberCardPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/memberCardPage.vue'),
                    meta: { title: '会员卡用户' }
                },
                {
                    path: '/adminMemberCardPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminMemberCardPage.vue'),
                    meta: { title: '会员卡用户' }
                },
                {
                    path: '/userShareRegisterRecordPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/userShareRegisterRecordPage.vue'),
                    meta: { title: '用户分享邀请注册记录' }
                },
                {
                    path: '/cardConsumePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/cardConsumePage.vue'),
                    meta: { title: '会员卡消费记录' }
                },
                {
                    path: '/adminCardConsumePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminCardConsumePage.vue'),
                    meta: { title: '会员卡消费记录' }
                },
                {
                    path: '/creditsExchangeRecordPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/creditsExchangeRecordPage.vue'),
                    meta: { title: '会员积分兑换金币记录' }
                },
                {
                    path: '/adminCreditsExchangeRecordPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminCreditsExchangeRecordPage.vue'),
                    meta: { title: '会员积分兑换金币记录' }
                },
                {
                    path: '/chatroomUserGetRecord',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/chatroomUserGetRecord.vue'),
                    meta: { title: '放映厅领取记录' }
                },
                {
                    path: '/adminChatroomUserGetRecord',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminChatroomUserGetRecord.vue'),
                    meta: { title: '放映厅领取记录' }
                },
                {
                    path: '/chatroomSendRecords',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/chatroomSendRecords.vue'),
                    meta: { title: '放映厅发放记录' }
                },
                {
                    path: '/adminChatroomSendRecords',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminChatroomSendRecords.vue'),
                    meta: { title: '放映厅发放记录' }
                },
                {
                    path: '/turplateDrawLogPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/turplateDrawLogPage.vue'),
                    meta: { title: '金币转盘记录列表' }
                },
                {
                    path: '/adminTurplateDrawLogPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminTurplateDrawLogPage.vue'),
                    meta: { title: '金币转盘记录列表' }
                },
                {
                    path: '/userBenefitCard',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/userBenefitCard.vue'),
                    meta: { title: '权益卡用户列表' }
                },
                {
                    path: '/adminUserBenefitCard',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminUserBenefitCard.vue'),
                    meta: { title: '权益卡用户列表' }
                },
                {
                    path: '/sendCouponPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/sendCouponPage.vue'),
                    meta: { title: '优惠券发放' }
                },
                {
                    path: '/batchSendCouponRecord',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/batchSendCouponRecord.vue'),
                    meta: { title: '优惠券发放记录' }
                },
                {
                    path: '/adminBatchSendCouponRecord',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminBatchSendCouponRecord.vue'),
                    meta: { title: '优惠券发放记录' }
                },
                {
                    path: '/userCouponPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/userCouponPage.vue'),
                    meta: { title: '用户优惠券列表' }
                },
                {
                    path: '/adminUserCouponPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminUserCouponPage.vue'),
                    meta: { title: '用户优惠券列表' }
                },
                {
                    path: '/employeePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/employePage.vue'),
                    meta: { title: '员工管理' }
                },
                {
                    path: '/serviceFeePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/serviceFeePage.vue'),
                    meta: { title: '网络代售服务费' }
                },
                {
                    path: '/adminServiceFeePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminServiceFeePage.vue'),
                    meta: { title: '网络代售服务费' }
                },
                {
                    path: '/cinemaTicketNumRecords',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/cinemaTicketNumRecords.vue'),
                    meta: { title: '影院购票充值' }
                },
                {
                    path: '/merchandiseOrderNotice',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/merchandiseOrderNotice.vue'),
                    meta: { title: '卖品送餐通知' }
                },
                {
                    path: '/adminFilmCoupon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminFilmCoupon.vue'),
                    meta: { title: '影票优惠券管理' }
                },
                {
                    path: '/filmCoupon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/filmCoupon.vue'),
                    meta: { title: '影票优惠券管理' }
                },
                {
                    path: '/adminCouponGroup',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminCouponGroup.vue'),
                    meta: { title: '券包管理' }
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
                    path: '/adminChatroomAwards',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminChatroomAwards.vue'),
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
                    path: '/adminSessionInfoPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminSessionInfoPage.vue'),
                    meta: { title: '排期管理' }
                },
                {
                    path: '/thirdPricePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/thirdPricePage.vue'),
                    meta: { title: '三方比价' }
                },
                {
                    path: '/adminThirdPricePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminThirdPricePage.vue'),
                    meta: { title: '三方比价' }
                },
                {
                    path: '/rechargeCardRulePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/rechargeCardRulePage.vue'),
                    meta: { title: '充值规则管理' }
                },
                {
                    path: '/cinemaPartnerPage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/cinemaPartnerPage.vue'),
                    meta: { title: '充值规则管理' }
                },
                {
                    path: '/adminRechargeCardRulePage',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminRechargeCardRulePage.vue'),
                    meta: { title: '充值规则管理' }
                },
                {
                    path: '/memberCardLevel',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/memberCardLevel.vue'),
                    meta: { title: '卡类别管理' }
                },
                {
                    path: '/adminMemberCardLevel',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/adminMemberCardLevel.vue'),
                    meta: { title: '卡类别管理' }
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
                    path: '/adminBannerPage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminBannerPage.vue'),
                    meta: { title: '轮播图管理' }
                },
                {
                    path: '/cardOpenRulesPage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/cardOpenRulesPage.vue'),
                    meta: { title: '开卡规则管理' }
                },
                {
                    path: '/adminCardOpenRulesPage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminCardOpenRulesPage.vue'),
                    meta: { title: '开卡规则管理' }
                },
                {
                    path: '/goldCommodityPage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/goldCommodityPage.vue'),
                    meta: { title: '金币商品管理' }
                },
                {
                    path: '/adminGoldCommodityPage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminGoldCommodityPage.vue'),
                    meta: { title: '金币商品管理' }
                },
                {
                    path: '/merchandise',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/merchandise.vue'),
                    meta: { title: '卖品信息' }
                },
                {
                    path: '/adminMerchandise',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminMerchandise.vue'),
                    meta: { title: '卖品信息' }
                },
                {
                    path: '/merchandiseType',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/merchandiseType.vue'),
                    meta: { title: '卖品分类' }
                },
                {
                    path: '/adminMerchandiseType',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminMerchandiseType.vue'),
                    meta: { title: '卖品分类' }
                },
                {
                    path: '/merchandiseCombo',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/merchandiseCombo.vue'),
                    meta: { title: '卖品套餐' }
                },
                {
                    path: '/adminMerchandiseCombo',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminMerchandiseCombo.vue'),
                    meta: { title: '卖品套餐' }
                },
                {
                    path: '/filmActivity',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/filmActivity.vue'),
                    meta: { title: '影票活动管理' }
                },
                {
                    path: '/adminFilmActivity',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminFilmActivity.vue'),
                    meta: { title: '影票活动管理' }
                },
                {
                    path: '/adminMerchandiseActivity',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminMerchandiseActivity.vue'),
                    meta: { title: '卖品活动管理' }
                },
                {
                    path: '/merchandiseActivity',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/merchandiseActivity.vue'),
                    meta: { title: '卖品活动管理' }
                },
                {
                    path: '/benefitCard',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/benefitCard.vue'),
                    meta: { title: '权益卡管理' }
                },
                {
                    path: '/adminBenefitCard',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminBenefitCard.vue'),
                    meta: { title: '权益卡管理' }
                },
                {
                    path: '/couponSendActivity',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/couponSendActivity.vue'),
                    meta: { title: '送券活动管理' }
                },
                {
                    path: '/adminCouponSendActivity',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminCouponSendActivity.vue'),
                    meta: { title: '送券活动管理' }
                },
                {
                    path: '/turnplateGameRule',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/turnplateGameRule.vue'),
                    meta: { title: '大转盘游戏管理' }
                },
                {
                    path: '/adminTurnplateGameRule',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminTurnplateGameRule.vue'),
                    meta: { title: '大转盘游戏管理' }
                },
                {
                    path: '/adminSigninRule',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/adminSigninRule.vue'),
                    meta: { title: '签到规则' }
                },
                {
                    path: '/signinRule',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/signinRule.vue'),
                    meta: { title: '签到规则' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
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
