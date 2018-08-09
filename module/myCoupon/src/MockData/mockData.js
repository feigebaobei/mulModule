import Mock from 'mockjs'
Mock.setup({
  // timeout: 6000
})

// 编辑地址 弹框
export const addressData = Mock.mock(/\/\/ocenter.xueersi.com\/Coupon\/ajaxGetCouponList[\w\W]?/, {
    "status": 1,
    "data": {
        "county_name": "湾区",
        "recipient_adds": "尔湾"
    }
})
