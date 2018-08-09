import Mock from 'mockjs'
Mock.setup({
  // timeout: 6000
})

// 订单详情接口-普通订单
export const orderDetail = Mock.mock(/\/\/ocenter.xueersi.com\/MyOrderData\/getNormalOrderDetail[\w\W]?/, {
  "status": "1",
  "data": {
    "orderType": "1",
    "expressIds": ["392437878584","2","3"],
    "hasDelivery": 1,
    "order": {
      "id": "201893839238889999",
      "time": "2018-03-24 13:34:34",
      "payWay": "余额支付",
      "payStatusId": 1,
      "payStatus": "已支付"
    },
    "receiver": {
      "name": "蜗牛",
      "phone": "18839383028",
      "province": "北京市",
      "city": "北京市",
      "region": "海淀区",
      "address": "中关村科贸大厦",
      "canModifyAddr": "1"
    },
    // "express": [],
    "express": [{
      "firmId": "aa",
      "firmName": "顺丰快递",
      "firmExpress": [{
        "status": "1",
        "expressId": "11"
      }, {
        "status": "2",
        "expressId": "22"
      }]
    }, {
      "firmId": "bb",
      "firmName": "圆通",
      "firmExpress": [{
        "status": "1",
        "expressId": "33"
      }]
    }],
    "courses": [{
      "courseId": "784636",
      "subjectId": "12",
      "subjectName": "数学",
      "name": "2019春季课回复 i 扫诶杰附近",
      "time": "9月9日-3月12日 每周六18:39-21:22",
      "origPrice": "1222.22",
      "discPrice": "333",
      "currPrice": "77777",
      "mainTeacher": [{
        "id": "1609",
        "name": "魏云辅导1",
        "imgUrl": "http://xesfile.xesimg.com/web/2015/12/21/14506863313674.png",
        "type": "1"
      }, {
        "id": "1490",
        "name": "刘小羊",
        "imgUrl": "http://xesfile.xesimg.com/teacher/2017/05/26/14957682036837.jpg",
        "type": "1"
      }],
      "tutorTeacher": [{
        "id": "1609",
        "name": "魏云辅导1",
        "imgUrl": "http://xesfile.xesimg.com/web/2015/12/21/14506863313674.png",
        "type": "4"
      }],
      "welfare": [{
        "welfareId": "894326576",
        "name": "春初二语文全国讲义",
        "count": "3",
        "statusId": "0",
        "status": "未发货"
      }, {
        "welfareId": "89432657633",
        "name": "春初二语文全国讲义",
        "count": "1",
        "statusId": "1",
        "status": "已发货"
      }]
    }],
    "price": {
      "originalPrice": "6888",
      "realityPrice": "333",
      "couponPrice": "444",
      "discountPrice": "333"
    },
    "preCard": {
      "id": "378959356",
      "name": "预购卡11111",
      "time": "9月9日-3月12日 每周六18:39-21:22",
      "origPrice": "1222.22",
      "discPrice": "333",
      "currPrice": "77777",
    },
    "preCourses": [{
      "courseId": "784636",
      "subjectId": "12",
      "subjectName": "数学",
      "name": "2019春季课回复 i 扫诶杰附近",
      "time": "9月9日-3月12日 每周六18:39-21:22",
      "exchangeTime": "2018-03-05 15:32:32",
      "exchangeStatusId": "1",
      "exchangeStatus": "已兑换",
      "dropStatusId": "1",
      "dropStatus": "可退课",
      "addressStatusId": "1",
      "addressStatus": "地址可修改",
      "mainTeacher": [{
        "id": "1609",
        "name": "魏云辅导1",
        "imgUrl": "http://xesfile.xesimg.com/web/2015/12/21/14506863313674.png",
        "type": "1"
      }, {
        "id": "1490",
        "name": "刘小羊",
        "imgUrl": "http://xesfile.xesimg.com/teacher/2017/05/26/14957682036837.jpg",
        "type": "1"
      }],
      "tutorTeacher": [{
        "id": "1609",
        "name": "魏云辅导1",
        "imgUrl": "http://xesfile.xesimg.com/web/2015/12/21/14506863313674.png",
        "type": "4"
      }],
      "welfare": [{
        "welfareId": "894326576",
        "name": "春初二语文全国讲义",
        "count": "3",
        "statusId": "0",
        "status": "未发货"
      }, {
        "welfareId": "89432657633",
        "name": "春初二语文全国讲义",
        "count": "1",
        "statusId": "1",
        "status": "已发货"
      }]
    }]
  }
})

// 订单详情接口-兑换卡订单
export const orderEcardDetail = Mock.mock(/\/\/ocenter.xueersi.com\/MyOrderData\/getECardOrderDetail[\w\W]?/, {
  "status": 1,
  "data": {
    "orderType": 2,
    "order": {
      "id": "2018041011431118958971",
      "time": "2018-04-10 11:43:11",
      "payWay": "余额支付",
      "payStatusId": 3,
      "payStatus": "支付成功"
    },
    "preCard": {
      "e_card_name": "卡重新兑换课test001",
      "origPrice": "99",
      "discPrice": "0",
      "currPrice": 99,
      "id": "158",
      "time": "卡重新兑换课test001-预购卡销售备注",
      "stuCouIdEncode": "ODE1NTQ5MC0xMjM0NTY4NDA="
    },
    "preCourses": [
      {
        "recordId": 1391,
        "courseId": "40804",
        "subjectId": "3",
        "subjectName": "英",
        "name": "预购卡兑换录播课-测试专用",
        "time": "上课时间描述-录播",
        "exchangeTime": "2018-04-10 11:44:09",
        "exchangeStatusId": 1,
        "exchangeStatus": "已兑换",
        "stuCouIdEncode": "ODE1NTQ5MC0xMjM0NTY4NDA=",
        "dropStatusId": 0,
        "dropStatus": "不可退课",
        "addressStatusId": 0,
        "addressStatus": "地址不修改",
        "mainTeacher": [
          {
            "id": "2463",
            "name": "杨丽",
            "infoUrl": "http://www.xueersi.com/t/yangli",
            "imgUrl": "http://xesfile.xesimg.com/web/2017/11/22/15113381801151.png",
            "type": "1"
          }
        ]
      }
    ],
    "originalPrice": 99,
    "realityPrice": "99",
    "couponPrice": 0,
    "discountPrice": 0
  }
})

// 物流跟踪接口
export const expressDetail = Mock.mock(/\/\/ocenter.xueersi.com\/MyInfoData\/ajaxGetExpress[\w\W]?/, {
  "status": "1",
  "data": {
    "express_company_name": "京东",
    "expressNum": "VA39141972166",
    "send_name": [{
      "name": "寒Level3-1-5讲义",
      "count": "1"
    }, {
      "name": "寒Level3-1-5单词手册",
      "count": "2"
    }, {
      "name": "寒Level3-1-5绘",
      "count": "4"
    }, {
      "name": "寒Level3-1-5练习册",
      "count": "1"
    }, {
      "name": "寒Level3-1-5练习册",
      "count": "1"
    }, {
      "name": "寒Level3-1-5练习册",
      "count": "1"
    }, {
      "name": "寒Level3-1-5练习册",
      "count": "1"
    }, {
      "name": "寒Level3-1-5练习册",
      "count": "1"
    }, {
      "name": "寒Level3-1-5练习册",
      "count": "1"
    }, {
      "name": "寒Level3-1-5练习册",
      "count": "1"
    }],
    "address": "北京市 海淀区 坎坎坷坷坎坎坷坷",
    "trace": [
      {
        "time": "2018-01-21 10:50:29",
        "content": "【西城区】 订单已经完成，感谢您对京东物流的支持，期待再次为您服务。",
        "action": 3
      }, {
        "time": "2018-01-21 08:26:34,",
        "content": "【西城区】 您的订单正在配送途中，请您准备签收（配送员：万剑星，电话：18513231622或010-62213970），感谢您的耐心等待。",
        "action": 3
      }, {
        "time": "2018-01-21 08:01:30",
        "content": "【西城区】 您的订单已到达【西直门站】",
        "action": 3
      }, {
        "time": "2018-01-21 04:09:08",
        "content": "【通州区】 您的订单在京东【北京通州分拣中心】发货完成，准备送往京东【西直门站】",
        "action": 3
      }, {
        "time": "2018-01-21 02:51:22",
        "content": "【通州区】 您的订单在京东【北京通州分拣中心】分拣完成",
        "action": 3
      }, {
        "time": "2018-01-21 02:51:21",
        "content": "【通州区】 您的订单已到达京东【北京通州分拣中心】",
        "action": 3
      }
    ]
  }
})

// 编辑地址 弹框
export const addressData = Mock.mock(/\/\/ocenter.xueersi.com\/MyInfoData\/ajaxGetPackageAdd[\w\W]?/, {
    "status": 1,
    "data": {
        "name": "老王",
        "phone": "13059266666",
        "province_id": "2",
        "province_name": "加州",
        "city_id": "3",
        "city_name": "硅谷",
        "county_id": "19",
        "county_name": "湾区",
        "recipient_adds": "尔湾"
    }
})

// 地址 弹框 - 保存地址
export const saveAddress = Mock.mock(/\/\/ocenter.xueersi.com\/MyInfoData\/saveNewSendInfosAdds[\w\W]?/, {
    "status": 1,
    "data": "保存成功"
})

// 编辑／添加地址 弹框-展开全部地址
export const allAddressData = Mock.mock(/\/\/ocenter.xueersi.com\/MyInfoData\/ajaxStuAdds[\w\W]?/, {
  "status": "1",
  "data": [{
    "id": "160123",
    "uid": "2361797",
    "name": "测试地址",
    "phone": "13611111112",
    "mobile": "",
    "zipcode": "",
    "province_id": "1",
    "province_name": "北京市",
    "city_id": "1",
    "city_name": "市辖区",
    "county_id": "1",
    "county_name": "东城区",
    "detail": "aaaaaaa",
    "note": "",
    "is_default": "1",
    "create_time": "2018-03-06 09:56:12",
    "modify_time": "2018-04-09 10:46:44"
  }, {
    "id": "160123",
    "uid": "2361797",
    "name": "测试地址",
    "phone": "13611111112",
    "mobile": "",
    "zipcode": "",
    "province_id": "1",
    "province_name": "北京市",
    "city_id": "1",
    "city_name": "市辖区",
    "county_id": "1",
    "county_name": "东城区",
    "detail": "北京市bbbbb",
    "note": "",
    "is_default": "1",
    "create_time": "2018-03-06 09:56:12",
    "modify_time": "2018-04-09 10:46:44"
  }, {
    "id": "160123",
    "uid": "2361797",
    "name": "测试地址",
    "phone": "13611111112",
    "mobile": "",
    "zipcode": "",
    "province_id": "1",
    "province_name": "北京市",
    "city_id": "1",
    "city_name": "市辖区",
    "county_id": "1",
    "county_name": "东城区",
    "detail": "北京市ccccc",
    "note": "",
    "is_default": "1",
    "create_time": "2018-03-06 09:56:12",
    "modify_time": "2018-04-09 10:46:44"
  }]
})

// 地址 弹框 - 选择此地址
export const selectAddress = Mock.mock(/\/\/ocenter.xueersi.com\/MyInfoData\/saveSendInfosAddsById[\w\W]?/, {
    "status": 1,
    "data": "修改成功"
})

// 我的余额
export const getBalance = Mock.mock(/\/\/ocenter.xueersi.com\/MyInfoData\/ajaxGetFinances[\w\W]?/, {
    "status": 1,
    "data": {
      "total": 20,
      "balance": "2333",
      "detailLists": [{
        "time": "2018-03-92 24:87:32",
        "count": "-333",
        "desc": "详情描述"
      }, {
        "time": "2018-03-92 24:87:32",
        "count": "-333",
        "desc": "详情描述"
      }, {
        "time": "2018-03-92 24:87:32",
        "count": "+333",
        "desc": "详情描述"
      }]
    }
    // "data": {
    //   "total": 0,
    //   "balance": "0",
    //   "detailLists": []
    // }
})
