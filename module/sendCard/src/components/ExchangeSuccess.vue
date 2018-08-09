<template>
	<div class="cards">
        <div class="orderFinish">
            <h2>恭喜您兑换成功！</h2>
            <p>您选择的课程是</p>
            <div v-if="courseList !== ''">
                <ul class="classInfo" v-for="(item, index) in courseList" :key="item.id">
                    <li>{{item.course_name}}</li>
                    <li v-if="item.schooltime_name !== ''">上课时间&nbsp;:&nbsp;{{item.schooltime_name}}</li>
                </ul>
            </div>
            <div v-if="courseList === ''">
                <ul class="classInfo">
                    <li>兑换成功啦！</li>
                    <li>数据稍后就到啦</li>
                </ul>
            </div>
            <div class="tips">
                请下载电脑客户端，体验更稳定听课环境和更趣味的课堂互动！
            </div>
        </div>
	</div>
</template>

<script>
import accountNav from '@/components/sub/accountNav.vue'

export default {
  name: 'account',
  metaInfo: {
    title: '兑换成功'
  },
  components: {
   accountNav
  },
  data () {
    return {
        courseList: []
    }
  },
  methods: {
      getExchangeInfos () {
        let _this = this
        _this.$http({
            method: 'post',
            url: _this.Service.StuGiftCard.getShowCouInfo,
            data: {
                productId: _this.$route.query.productId
            }
            }).then(function (res) {
                if (res.stat === 1) {
                    _this.courseList.push(res.data)
                } else {
                    alert(res.data)
                }
            }).catch(function (err) {
                console.log(err)
            })      
        }
  },

  mounted () {
      let _this = this
      console.log(';;;;;;;;', this.$route.query)
      _this.getExchangeInfos()
  }
}
</script>

<style lang='less' scoped>
.cards{
    .orderFinish{
        width: 100%;
        // height: 200px;
        text-align: center;
        background: url(../../../../common/assets/img/monkey_success.png) no-repeat center 30px;
        background-size: 200px 200px;
        padding-top: 260px;
        // border-bottom: 1px solid #ededed;
        h2{
            line-height: 40px;
            font-size: 28px;
            font-weight: normal;
            color: #333;
        }
        P{
            height: 41px;
            line-height: 41px;
            font-size: 16px;
            color: #999;
        }
        .classInfo{
            color: #f13232;
        }
        .tips{
            color: #f13232;
        }
    }
}
</style>
