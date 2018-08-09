let zhiManager = null

if (typeof getzhiSDKInstance !== 'undefined') {
    zhiManager = (getzhiSDKInstance())

    zhiManager.on("load", function (ret) {
        zhiManager.initBtnDOM()
    })

    zhiManager.set('title', '欢迎咨询')

    zhiManager.set('location', 1)

    // 对接用户身份、预留字段、自定义字段-在用户信息获取之后设置
    // zhiManager.set('userinfo', {
    //     // partnerId: 12353,
    // })
    zhiManager.set('customBtn', 'true')

    // 开启浏览轨迹
    zhiManager.set('manTrance', 'true')

    // 上一页信息
    zhiManager.set('preVisitArgs', {
        'preVisitUrl': document.referrer,
    })

    // 当前页信息
    zhiManager.set('curVisitArgs', {
        // 'curAbstract': '', // meta-keywords 做SEO用，ocenter域不需要
        'curVisitUrl': window.location.href,
        'curVisitTitle': document.title
    })

    zhiManager.set('moduleType', 4)
    zhiManager.set('powered', false)
    zhiManager.set('groupId', 'bd70a2e0d94c4dd48cb2baa21c579204') // 客服组id
    // time 显示历史聊天记录的时间范围，需传入分钟数，有效值10-2880（10分钟-48小时）
    zhiManager.set('time', 2880)
}



export default function getZhiManager() {
    return zhiManager || function () {}
}
