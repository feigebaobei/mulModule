<template>
  <section class="couponListBox">
    <!-- <div class="header"></div> -->
    <header class="header">
      <div class="orderBt">
        <span>综合排序</span>
      </div>
      <a class="myCouponBt" href="https://ocenter.xueersi.com/Ocenter/myCoupon/#/coupon">
        <span>我的优惠券</span>
      </a>
    </header>
    <article class="couponList">
      <el-row :gutter="15" v-if="dataStatus">
        <el-col :span="8" class="couponCardCol" v-for="(item, index) in couponData" :key="index" :class="calcColor(item)">
          <div class="couponCard">
            <div class="couponCardMain">
              <h5>
                <span class="title" v-html="couponType(item.coupon_type)"></span>
                <!-- <span class="icon" v-if="item.coupon_type !== 255" v-html="'!'"></span> -->
                <el-popover placement="right-start" width="207" trigger="hover" v-if="item.coupon_conditions">
                  <span class="icon" slot="reference">!</span>
                  <div class="couponCardArea">
                    <h6>适用范围</h6>
                    <p v-html="'年级：' + item.coupon_conditions.grade_show_names"></p>
                    <p v-html="'学科：' + item.coupon_conditions.subject_show_names"></p>
                    <p v-if="item.coupon_conditions.term_show_names !== ''" v-html="'学期：' + item.coupon_conditions.term_show_names"></p>
                  </div>
                </el-popover>
              </h5>
              <p class="describe" v-html="item.description">
              </p>
              <p class="price">
                <span class="number yuan" :style="numberBgImg"></span>
                <span class="number" v-for="(subItem, subIndex) in destruction(item.face_value)" :key="subIndex" :style="numberBgImg" :class="{'one': subItem === '1', 'two': subItem === '2', 'three': subItem === '3', 'four': subItem === '4', 'five': subItem === '5', 'six': subItem === '6', 'seven': subItem === '7', 'eight': subItem === '8', 'nine': subItem === '9', 'zero': subItem === '0'}"></span>
              </p>
              <!-- <p class="allow">剩余名额：30</p> -->
              <p class="time" v-html="'订单满' + item.order_full_price + '元可用<br>' + '有效期：' + item.valid_start_date + '-' + item.valid_end_date"></p>
            </div>
            <div class="couponCardVice">
              <button v-html="item.is_stu_received ? '已领取' : '立即领取'" class="opBt" :class="calcColorBt(item)" @click="getCoupon()"></button>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="dataFail" v-else>
        <div class="monkey">
          <img :src="dataFail.imgSrc" alt="数据加载失败">
        </div>
        <div class="hint">
          <p class="status">数据加载失败！</p>
          <p class="reflesh">可以尝试刷新页面（command+r或f5）</p>
        </div>
      </div>
    </article>
  </section>
</template>

<style lang='less' scoped>
  .couponListBox {
    font-family: 'MicrosoftYaHei';
    margin-top: 20px;
    .header {
      border-bottom: 2px solid #333;
      width: 1200px;
      margin: 0 auto;
      &:after {
        content: '';
        display: block;
        clear: both;
      }
      .orderBt {
        width: 100px;
        height: 48px;
        background-color: #333;
        color: #fff;
        text-align: center;
        font-size: 14px;
        line-height: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        float: left;
      }
      .myCouponBt {
        width: 90px;
        height: 30px;
        color: #fff;
        font-size: 14px;
        line-height: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 2px;
        background-color: #F13232;
        float: right;
        margin: 9px 0;
        cursor: pointer;
      }
    }
    .couponList {
      width: 1200px;
      margin: 20px auto 0;
      position: relative;
      overflow: hidden;
      .couponCardCol {
        margin: 0 0 15px 0;
        .couponCard {
          height: 240px;
          background-image: url('../assets/images/bigCard2.png');
          background-size: 100% auto;
          background-repeat: no-repeat;
          .couponCardMain {
            width: auto;
            height: 173px;
            padding: 30px;
            position: relative;
            h5 {
              font-weight: bold;
              font-size: 18px;
              line-height: 18px;
              margin: 0 0 8px 0;
              .icon {
                width: 18px;
                height: 18px;
                color: #fff;
                border-radius: 50%;
                display: inline-block;
                margin: 0 3px;
                cursor: pointer;
                text-align: center;
              }
            }
            .describe {
              width: 180px;
              height: 30px;
              font-size: 12px;
              color: #999;
              line-height: 16px;
              margin: 0;
            }
            .price {
              float: right;
              font-size: 0px;
              position: absolute;
              top: 30px;
              right: 30px;
              text-align: right;
            }
            .allow {
              float: left;
              text-align: left;
              font-size: 12px;
              color: #999;
              position: absolute;
              bottom: 20px;
            }
            .time {
              float: right;
              text-align: right;
              font-size: 12px;
              color: #999;
              position: absolute;
              bottom: 20px;
              right: 30px;
            }
          }
          .circleLeft {
            position: absolute;
            left: -15px;
            top: 115px;
            width: 30px;
            height: 30px;
            border: 1px solid #999;
            border-radius: 50%;
            background-color: #fff;
          }
          .circleRight {
            position: absolute;
            right: -15px;
            top: 115px;
            width: 30px;
            height: 30px;
            border: 1px solid #999;
            border-radius: 50%;
            background-color: #fff;
          }
          .dashed {
            width: auto;
            height: 0px;
            /*border-top: 1px dashed #999;*/
          }
          .couponCardVice {
            /*border: 1px solid #999;*/
            border-top: 0px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            text-align: center;
            button {
              width: 200px;
              height: 40px;
              border-radius: 4px;
              border: 0px;
              color: #fff;
              font-size: 16px;
              font-weight: bold;
              line-height: 16px;
              vertical-align: middle;
              text-align: center;
              margin: 13px auto;
            }
            .orangeBt {
              background-color: #ff8b00;
            }
            .blueBt {
              background-color: #618be5;
            }
            .greyBt {
              background-color: #dcdcdc;
            }
          }
        }
      }
    }
    /* 数字 start */
    .number {
      height: 52px;
      display: inline-block;
      vertical-align: middle;
    }
    .orange {
      .title {
        color: #ff8b00;
      }
      .icon {
        background-color: #ff8b00;
      }
      .yuan {
        background-position: -4px -4px;
        width: 25px;
      }
      .one {
        background-position: -37px -4px;
        width: 28px;
      }
      .two {
        background-position: -71px -4px;
        width: 40px;
      }
      .three {
        background-position: -111px -4px;
        width: 39px;
      }
      .four {
        background-position: -150px -4px;
        width: 41px;
      }
      .five {
        background-position: -192px -4px;
        width: 39px;
      }
      .six {
        background-position: -232px -4px;
        width: 40px;
      }
      .seven {
        background-position: -271px -4px;
        width: 40px;
      }
      .eight {
        background-position: -310px -4px;
        width: 41px;
      }
      .nine {
        background-position: -351px -4px;
        width: 40px;
      }
      .zero {
        background-position: -390px -4px;
        width: 43px;
      }
    }
    .blue {
      .title {
        color: #618be5;
      }
      .icon {
        background-color: #618be5;
      }
      .yuan {
        background-position: -4px -72px;
        width: 25px;
      }
      .one {
        background-position: -37px -72px;
        width: 28px;
      }
      .two {
        background-position: -71px -72px;
        width: 40px;
      }
      .three {
        background-position: -111px -72px;
        width: 39px;
      }
      .four {
        background-position: -150px -72px;
        width: 41px;
      }
      .five {
        background-position: -192px -72px;
        width: 39px;
      }
      .six {
        background-position: -232px -72px;
        width: 40px;
      }
      .seven {
        background-position: -271px -72px;
        width: 40px;
      }
      .eight {
        background-position: -310px -72px;
        width: 41px;
      }
      .nine {
        background-position: -351px -72px;
        width: 40px;
      }
      .zero {
        background-position: -390px -72px;
        width: 43px;
      }
    }
    .grey {
      .title {
        color: #999;
      }
      .icon {
        background-color: #999;
      }
      .yuan {
        background-position: -4px -139px;
        width: 25px;
      }
      .one {
        background-position: -37px -139px;
        width: 28px;
      }
      .two {
        background-position: -71px -139px;
        width: 40px;
      }
      .three {
        background-position: -111px -139px;
        width: 39px;
      }
      .four {
        background-position: -150px -139px;
        width: 41px;
      }
      .five {
        background-position: -192px -139px;
        width: 39px;
      }
      .six {
        background-position: -232px -139px;
        width: 40px;
      }
      .seven {
        background-position: -271px -139px;
        width: 40px;
      }
      .eight {
        background-position: -310px -139px;
        width: 41px;
      }
      .nine {
        background-position: -351px -139px;
        width: 40px;
      }
      .zero {
        background-position: -390px -139px;
        width: 43px;
      }
    }
    /* 数字 end */
    /* 按钮的颜色 start */

    /* 按钮的颜色 end */
    /* dataFail start */
    .dataFail {
      width: 580px;
      height: 290px;
      border-radius: 2px;
      margin: 180px auto;
      .monkey {
        float: left;
        width: 270px;
        text-align: right;
      }
      .hint {
        float: left;
        color: #666;
        margin: 70px 0 0 15px;
        .status {
          font-size: 25px;
          color: #dd453d;
        }
        .reflesh {
          margin: 6px 0 0 0;
        }
      }
    }
    /* dataFail end */
  }
</style>

<script>
import numberImg from '@/assets/images/number.png'
import imgFailSrc from '~common/assets/img/monkey_fail.png'
import { Loading } from 'element-ui'
import fakeData from '@/assets/fakeData.json'
export default {
  metaInfo: {
    title: '领券中心'
  },
  data () {
    return {
      numberBgImg: {
        backgroundImage: 'url(' + numberImg + ')'
      },
      loadingTimer: null,
      fakeDatad: fakeData,
      dataStatus: true,
      couponData: [],
      dataFail: {
        imgSrc: imgFailSrc
      }
    }
  },
  methods: {
    getCouponList () {
      let url = 'https://ocenter.xueersi.com/Coupon/ajaxGetCouponList'
      this.$http.post(url).then((response) => {
        // 取消加载动画
        if (response.stat === 1) {
          this.dataStatus = true
          this.couponData = response.data
          // this.couponData = this.fakeDatad.data
        } else {
          this.dataStatus = false
        }
      }).catch((error) => {
        this.dataStatus = false
        // 取消加载动画
        console.log(error)
      })
    },
    loadingStart () {
      this.loadingTimer = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.8)'
      })
    },
    loadingEnd () {
      this.loadingTimer.close()
    },
    loadingOp () {
      let loadTime = 500
      this.loadingOp = setTimeout(() => {
        this.loadingStart()
      }, loadTime)
    },
    // 判断对象是否为空
    isEmptyObj (obj) {
      var string = JSON.stringify(obj)
      return string === '{}' || string === '[]'
    },
    // 优惠券的类型
    couponType (int) {
      if (int === 255) {
        return '通用券'
      } else {
        return '品类券'
      }
    },
    // 解构数值
    destruction (string) {
      return [...string]
    },
    // 计算优惠券的颜色
    calcColor (obj) {
      let str = ''
      if (obj.is_stu_received) {
        str = 'grey'
      } else {
        str = obj.coupon_type === 255 ? 'orange' : 'blue'
      }
      return str
    },
    // 计算优惠券按钮的颜色
    calcColorBt (obj) {
      let str = ''
      if (obj.is_stu_received) {
        str = 'greyBt'
      } else {
        str = obj.coupon_type === 255 ? 'orangeBt' : 'blueBt'
      }
      return str
    },
    // 是否是次卡
    isTimeCard (obj) {
      return obj.coupon_type === 4 || obj.coupon_type === 5 || obj.coupon_type === 6
    },
    // 是否是课程卡
    isCourseCard (obj) {
      console.log(obj)
      return obj
    },
    // 领取优惠券
    getCoupon () {
      let url = 'https://ocenter.xueersi.com/StuCoupon/stuReceiveCoupon'
      this.$http.post(url).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  mounted () {
    // this.loading()
    this.getCouponList()
  }
}
</script>
