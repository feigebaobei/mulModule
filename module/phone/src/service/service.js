// 赠课卡
const StuGiftCard = {
    ajaxGetStuGiftCard: '/StuGiftCard/ajaxGetStuGiftCard',
    getAllCourseInfos: '/StuGiftCard/getAllCourseInfos',
    getCourseInfo: '/StuGiftCard/getCourseInfo',
    getGiveawayInfo: '/StuGiftCard/getGiveawayInfo',
    ajaxGetStuAdds: '/StuGiftCard/ajaxGetStuAdds',
    saveStuAdds: '/StuGiftCard/saveStuAdds',
    delStuAddress: '/StuGiftCard/delStuAddress',
    setDefaultAdds: '/StuGiftCard/setDefaultAdds',
    exchangeCourse: '/StuGiftCard/exchangeCourse',
    ajaxActiveGcard: '/ActiveGift/ajaxActiveGcard',
    getShowCouInfo: '/StuGiftCard/getShowCouInfo',
    // 兑换记录
    getExchangeList: '/StuGiftCard/getExchangeList'
}
// 领券中心
const Vencher = {
    ajaxGetCouponList: '/Coupon/ajaxGetCouponList',
    ajaxGetCouponRange: '/Coupon/ajaxGetCouponRange',
    stuReceiveCoupon: '/StuCoupon/stuReceiveCoupon'
}
// 用户中心
const Profile = {
    info: '/Profile/info',
    checkVCode: '/Profile/checkVCode',
    sendSMSCode: '/Profile/sendSMSCode',
    resetPwd: '/Profile/resetPwd',
    bindPhone: '/Profile/bindPhone',
    bindInfos: '/Profile/bindInfos',
    bindPlat: '/Profile/bindPlat',
    unbindPlat: '/Profile/unbindPlat',
    addrInfos: '/Profile/addrInfos',
    addrMod: '/Profile/addrMod',
    addrRm: '/Profile/addrRm'
}
// 订单相关
const Order = {
    ajaxGetOrderList: '/MyOrderData/ajaxGetOrderList',
    getNormalOrderDetail: '/MyOrderData/getNormalOrderDetail?',
    getECardOrderDetail: '/MyOrderData/getECardOrderDetail?',
    ajaxGetPackageAdd: '/MyInfoData/ajaxGetPackageAdd?',
    ajaxStuAdds: '/MyInfoData/ajaxStuAdds',
    saveSendInfosAddsById: '/MyInfoData/saveSendInfosAddsById',
    saveNewSendInfosAdds: '/MyInfoData/saveNewSendInfosAdds',
    ajaxGetExpress: '/MyInfoData/ajaxGetExpress?',
    ajaxGetFinances: '/MyInfoData/ajaxGetFinances',
    getReturnCourseInfo: '/MyOrderData/getReturnCourseInfo',
    ajaxReturnCourse: '/MyOrderData/ajaxReturnCourse'
}

export default {StuGiftCard, Order, Profile}
