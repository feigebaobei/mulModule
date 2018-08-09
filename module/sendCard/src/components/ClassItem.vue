<template>
	<div class="cards">
		<account-nav
      :type="'text'" 
      :tabValue="'赠课卡'"
      :slipper="false"
        ></account-nav>
        <div class="classItem">
            <ul>
                <li class="classInfo" v-for="(item, index) in courseList" :key="item.id">
                    <p class="title" v-if="item.course_name.length >= 27">
                        <span v-if="item.subject_name !== ''">{{item.subject_name}}</span>
                        {{item.course_name.substr(0,27) + '...'}}
                    </p>
                    <p class="title" v-if="item.course_name.length < 27">
                        <span v-if="item.subject_name !== ''">{{item.subject_name}}</span>
                        {{item.course_name}}
                    </p>
                    <p class="timer">{{item.schooltime_name}}</p>
                    <ul class="teacher">
                        <li class="img"><img :src="item.teacher_avatar"/></li>
                        <li class="txt">授课老师<br>{{item.teacher_name}}</li>
                    </ul>
                    <a @click="judgeCourseInfos(item.course_id, item.stu_gcard_id ,item.kId, item.urlkey)">兑换课程</a>
                </li>
            </ul>
        </div>
	</div>
</template>

<script>
import accountNav from '@/components/sub/accountNav.vue'

export default {
  name: 'classItem',
  metaInfo: {
    title: '赠课卡'
  },
  components: {
    accountNav
  },
  data () {
    return {
      courseList: [],
      courseId: '',
      productType: '',
      classId: '',
      urlKey: ''
    }
  },
   methods: {
        getAllCourseInfos () {
        let _this = this
        _this.$http({
            method: 'post',
            url: _this.Service.StuGiftCard.getAllCourseInfos,
            data: {
                stuGcardId: _this.$route.query.stuGcardId,
                urlKey: _this.$route.query.urlKey
            }
            }).then(function (res) {
                if (res.stat === 1) {
                    for (let i in res.data) {
                        res.data[i]['kId'] = i
                        _this.courseList.push(res.data[i])
                    }
                } else {
                    alert(res.data)
                }
            }).catch(function (err) {
                console.log(err)
            })      
        },
        // 判断销售期状态 是否进入下个页面
        judgeCourseInfos (courseId, stuGcardId, kId, urlkey) {
            let _this = this
            _this.$http({
                method: 'post',
                url: _this.Service.StuGiftCard.getCourseInfo,
                data: {
                    productId: courseId,
                    stuGcardId: stuGcardId,
                    urlKey: urlkey
                }
                }).then(function (res) {
                    console.log(res.data[kId], kId, '-------------')
                    console.log('7777', res.data)
                    if (res.stat === 0) {
                        alert(res.data)
                        return false
                    }
                    if (res.stat === 1) {
                         _this.$router.push({path: '/account/address', query: {ids: courseId, stuGcardId: stuGcardId, classId: res.data.class_id, urlKey: urlkey}})
                    } 
                }).catch(function (err) {
                    console.log(err)
                })      
        }
  },
  mounted () {
    let _this = this
    // console.log('+++++', _this.$route.query)
    _this.getAllCourseInfos()
  }
}
</script>

<style lang='less' scoped>
.cards{
    .classItem{
        ul{
            .classInfo{
                position: relative;
                width: 195px;
                height: 139px;
                float: left;    
                padding: 10px;
                margin-left: 20px;
                margin-right: 10px;
                margin-top: 30px;
                box-shadow: 5px 5px 20px #eeeeee;
                position: relative;
                .title{
                    font-size: 12px;
                    color: #111111;
                    // display: -webkit-box;
                    // -webkit-box-orient: vertical;
                    // -webkit-line-clamp: 2;
                    // overflow: hidden;
                    // text-overflow: ellipsis;
                    span{
                        font-size: 12px;
                        color: #f13232;
                        border: 1px solid #f13232;
                        border-radius: 2px;
                    }
                }
                .timer{
                    height: 17px;
                    line-height: 17px;
                    font-size: 10px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    color: #666666;
                }
                .teacher{
                    color: #666666;
                    position: absolute;
                    left: 10px;
                    top: 65px;
                    .img{
                        img{
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                        }
                    }
                    .txt{
                        font-size: 10px;
                    }
                }
                a{
                    position: absolute;
                    right: 10px;
                    bottom: 10px;
                    color: #fff;
                    background-color: #F13232;
                    font-size: 12px;
                    text-align: center;
                    width: 70px;
                    height: 20px;
                    line-height: 20px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
