import Mock from 'mockjs'
export const advertInfo = Mock.mock('//i.xueersi.com/MyCourses/getAdvertInfo', {
  data: {
    advert: [{
    	title: '1',
    	url: 'http://www.xueersi.com',
    	img_url: 'http://s02.xesimg.com/web/2017/11/20/15111760207581.jpg',
    	id: '23788'
    }, {
      title: '2',
      url: 'http://www.xueersi.com',
      img_url: 'http://r04.xesimg.com/web/2017/11/24/15115175293322.png',
      id: '237883'
    }]
  }
})

// export const stuInfo = Mock.mock('//i.xueersi.com/MyCourses/getStuInfo', {
//   "stat":1,
//   "data":{
//     "gradeName":"初一",
//     "gradeId":"8",
//     "stu_id":"11083",
//     "userName":"2542",
//     "headUrl":"http://h.xesimg.com/sys/1/small.jpg",
//     "gold":"151",
//     "expLevel":3
//   }
// })

// 用户信息接口
export const accountInfo = Mock.mock('//account.xueersi.com/Profile/info', {
  stat: 1, // 9 未登录
  data: {
    id: "327849",
    udi: "12344",
    name: "京津冀",
    phone: "188373738288",
    role: "1",
    sex: "3",
    relname: "",
    nickname: "学员333",
    en_name: "",
    email: "",
    qq: "",
    wechat: "",
    ref_grade: "0",
    year_id: "0",
    province_id: "0",
    city_id: "0",
    country_id: "0",
    school: "",
    birthday: "1973-92-28",
    avatar_path: "",
    avatar_version: "0",
    auth: "1",
    status: "1",
    create_time: "2018-02-31",
    modify_time: "2018-04-23",
    grade_id: 8,
    grade_name: "初一",
    grade_alias: "chu1",
    user_id: "1233434",
    province_name: "",
    city_name: "",
    country_name: ""
  }
})

