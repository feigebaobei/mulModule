<template>
	<div class="coupon">
    <!--优惠券标题 start-->
		<account-nav  :type="'text'" :tabValue="'优惠券'" :slipper="false"></account-nav>
    <!--优惠券标题 end-->
    
    <!--优惠券列表 start-->
    <div class="coupon-content coupon-loading" v-if="couponDetail || noData">
        <el-select placeholder="placeholder" v-model="option.status" @change="select">
          <el-option :key="1" :label="'可用优惠券（' + total + '）'" :value="1"></el-option>
          <el-option :key="2" :label="'已使用'" :value="2"></el-option>
          <el-option :key="3" :label="'已过期'" :value="3"></el-option>
        </el-select>
        <el-select placeholder="placeholder" v-model="option.coupon_type" @change="select">
          <el-option :key="0" :label="'全部类型'" :value="0"></el-option>
          <el-option :key="1" :label="'通用券'" :value="1"></el-option>
          <el-option :key="2" :label="'品类券'" :value="2"></el-option>
        </el-select>
        <span class="discount-achor">
           <router-link to="/couponActive" tag="a">优惠券激活</router-link>
            <!--<a href='/couponActive' class="activate-coupons">优惠券激活</a>-->
            <!--<a @click='select(1)' :style='{display: option.status == 1 ? "inline-block" : "none"}' style="display: none"  href="####" class="due-soon">即将到期</a>-->
        </span>
        <div class="couponCardBox">
          <el-row :gutter="20">
            <el-col :span="8" class="couponCardCol" v-for="(item, index) in couponDetail" :key="index" :class="{'card-actives-unused': item.coupon_status == 1, 'card-actives-used': item.coupon_status == 2, 'card-actives-outlater': item.coupon_status == 3}">
              <div class="couponCard">
                <div class="couponCardMain">
                  <div class="upCard">
                    <h5>
                      <span class="title" v-html="couponType(item.coupon_type)" :class="{orange: item.coupon_type == 255 && item.coupon_status == 1, blue: item.coupon_type != 255 && item.coupon_status == 1, grey: item.coupon_status > 1}"></span>
                      <el-popover placement="right-start" width="207" trigger="hover" v-if="!isEmptyObj(item.coupon_conditions)">
                        <span class="attention" :class="{blueBg: couponType(item.coupon_type) === '品类券' && option.status !== 3, greyBg: couponType(item.coupon_type) === '品类券' && option.status === 3}" v-html='"!"' slot="reference"></span>
                        <div class="couponCardArea">
                          <h6>适用范围</h6>
                          <p v-html="'年级：' + item.coupon_conditions.grade_names"></p>
                          <p v-html="'学科：' + item.coupon_conditions.subject_names"></p>
                          <p v-if="item.coupon_conditions.term" v-html="'学期：' + item.coupon_conditions.term"></p>
                        </div>
                      </el-popover>
                    </h5>
                    <p class="describe" v-if="item.coupon_type == 255" v-html="'全平台可用<br>(特殊商品除外)'"></p>
                    <p class="describe" v-if="item.coupon_type == 1" v-html="'所有课程可用<br>(特殊课程除外)'"></p>
                    <p class="describe" v-if="item.coupon_type == 2" v-html="'部分课程可用<br>(特殊课程除外)'"></p>
                    <p class="describe" v-if="item.coupon_type == 3" v-html="'指定课程专用'"></p>
                    <p class="describe" v-if="item.coupon_type == 4" v-html="'所有次卡可用<br>(特殊次卡除外)'"></p>
                    <p class="describe" v-if="item.coupon_type == 5" v-html="'部分次卡可用<br>(特殊次卡除外)'"></p>
                    <p class="describe" v-if="item.coupon_type == 6" v-html="'指定次卡专用'"></p>
                    <p class="right" :class="{orange: item.coupon_type == 255 && item.coupon_status == 1, blue: item.coupon_type != 255 && item.coupon_status == 1, grey: item.coupon_status > 1}">
                      <span class="number yuan" :style="numberBgImg"></span>
                      <span v-for="(subItem, subIndex) in destruction(item.face_value)" 
                        :key="subIndex" 
                        :style="numberBgImg"
                        class="number" 
                        :class="{'one': subItem == '1', 'two': subItem == '2', 'three': subItem == '3', 'four': subItem == '4', 'five': subItem == '5', 'six': subItem == '6', 'seven': subItem == '7', 'eight': subItem == '8', 'nine': subItem == '9', 'zero': subItem == '0'}" 
                      >
                      </span>
                    </p>
                    <div class="empty"></div>
                  </div>
                  <div class="downCard">
                    <p v-html='"订单满" + item.full_price + "元可用"'></p>
                    <p v-html='"有效期：" + item.start_date + "-" + item.end_date'></p>
                  </div>
                </div>
                <!-- <div class="couponCardVice">
                  <el-button type="primary" class="color">去使用</el-button>
                </div> -->
              </div>
            </el-col>
          </el-row>
        </div>
        <error
          :type="'blank'"
          v-if="noData"
          :warning="'您还没有该类型的优惠券哦'"
        ></error>
    </div>
    <!--优惠券列表 end-->

    <!--错误页面 start-->
    <error
      :type="'fail'"
      v-if="couponDetail == 0 && !noData"
      :warning="warning"
      :mainStyles="{'margin-top': '14%'}"
    ></error>
    <!--错误页面 end-->
	</div>
</template>

<script>
import axios from 'axios'
import { Loading } from 'element-ui'
import error from '@/components/sub/error.vue'
import accountNav from '@/components/sub/accountNav.vue'
import numberImg from '@/assets/images/number.png'
export default {
  name: 'myCoupon',
  metaInfo: {
    title: '我的优惠券'
  },
  components: {
    accountNav,
    error
  },
  data () {
    return {
      option: {
         status: 1,
         coupon_type: 0
      },
      'card-actives-unused': 'card-actives-unused',
      'card-actives-used': 'card-actives-used',
      'card-actives-outlater': 'card-actives-outlater',
      couponDetail: [], // 优惠券列表数据，0-请求失败，[]/''-无数据
      pageIndex: 1,  // 优惠券列表请求起始页码
      total: 0, // 优惠券列表总条数  
      noData: false, // 实际初始值为false
      warning: '请求失败,请重试......',
      loadFlag: false,
      loadingInstance: null,
      loadingTimer: null,
      imgsrc: numberImg,
      numberBgImg: {
        backgroundImage: 'url(' + numberImg + ')'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loading('.invoice-loading')
      this.couponList(this.option.status, this.option.coupon_type, 0)
    })
  },
  watch: {
    loadFlag: function () {
      if (!this.loadFlag) {
        this.loadingInstance.close()
        this.loadingInstance = null
      }
    },
    total: function (to, from) {
      if (to > from) {
        this.total = to
      } else {
        this.total = from
      }
    }
  },
  computed: {
    // calcTotal: {
    //   get: function () {

    //   }
    // }
  },
  methods: {
    couponList (status, type, isDue) {
      let url = '/StuCouponData/getStuCouponList'
      // let url = 'https://ocenter.xueersi.com/StuCouponData/getStuCouponList'
      axios.post(url, {
        status: status,
        coupon_type: type,
        past_due: isDue
      })
      .then((res) => {
        clearTimeout(this.loadingTimer)
        this.loadFlag = false
        if (res.status == 1) {
          this.total = Number(res.data.total)
          this.couponDetail = res.data.list
          this.pageIndex++
          if (!res.data.list || res.data.list.length <= 0) {
            this.noData = true
          } else {
            this.noData = false
          }
        } else {
          this.couponDetail = 0
          this.warning = res.data
        }
      })
      .catch((err) => {
        clearTimeout(this.loadingTimer)
        this.loadFlag = false
        this.couponDetail = 0
        console.log('获取优惠券 error', err)
      })
    },
    select () {
      this.loading('.invoice-loading')
      this.couponList(this.option.status, this.option.coupon_type, 0)
    },
    loading (selector) {
      let loadTime = 500
      this.loadingTimer = setTimeout(() => {
        this.loadFlag = true
        if (this.loadFlag) {
          this.loadingInstance = Loading.service({
            target: document.querySelector(selector),
            text: '拼命加载中',
            spinner: 'el-icon-loading',
            fullscreen: true,
            background: 'rgba(255, 255, 255, 0.8)',
            customClass: 'loading'
          })
        }
        clearTimeout(this.loadingTimer)
      }, loadTime)
    },
    // 判断对象是否为空
    isEmptyObj (obj) {
      var string = JSON.stringify(obj)
      return string === '{}' || string === '[]'
    },
    // 优惠券的类型
    couponType (int) {
      if (int == 255) {
        return '通用券'
      } else {
        return '品类券'
      }
    },
    // 解构价格
    destruction (string) {
      return [...string]
    }
  }
}
</script>

<style lang='less' scoped>
  .coupon{
    height: 100%;
  }
  .coupon-content{
    padding:0 20px 10px 20px;
    font-size: 12px;
    color: #666666;
    position: relative;
    height:85%;
    select {
      width: 120px;
      height: 40px;
      padding: 10px;
      margin-right: 10px;
      border:1px solid gray;
      font-size: 12px;
      font-weight:400;
      color: #6b6a6a;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      padding-right: 14px;
      background: url("https://res11.xesimg.com/x5account/img/discount-select-downIcon.png") no-repeat scroll right center transparent;
      background-size: 26px;
    }
    .discount-achor {
      float: right;
      /*margin-right: 38px;*/
      height: 40px;
      line-height: 40px;
      font-size: 16px;
    }
    .card-actives-detail {
      padding: 10px 0 20px 0;
      display: block;
      overflow: hidden;
      .orange {color: #FF8B00;font-size: 14px;}
      .blue {color: #618BE5;font-size: 14px;}
      .gray {color: #999999;font-size: 14px;}
      .orangeBg {color: #FF8B00;}
      .blueBg {color: #618BE5;}
      .grayBg {color: #999999;}
      .voucherList {
        width: 300px;
        height: 130px;
        float: left;
        margin-left: 20px;
        margin-top: 20px;
        padding: 20px 20px 0;
        position: relative;
        .type {
          float:left;
          .comm {
            font-weight: bold;
          }
          .explain {
            font-size: 12px;
            width: 100px;
            color: #999999;
          }
        }
        .money {
          float: right;
          font-size: 40px;
          margin-top: -10px;
          .orangeNum {
            float: right;
            color: #FF8B00;
            font-weight: 900;
          }
          .orangeIcon {
            float:right;
            margin-top: -4px;
            img {
              width:15px;
              height:25px;
            }
          }
        }
        .text {
          font-size: 12px;
          position:absolute;
          top: 60%;
          right: 20px;
          color:#999999;
          .manjian {
            text-align: right;
          }
          .time {
            text-align: right;
          }
        }
      }
      .card-actives-unused {
        border-radius: 8px;
        border: 1px solid #e5e5e5;
        background-size: 300px;
        height: 130px;
        .type .blue,.type .orange {
          color: #999999;
        }
        .money .blueNum,.money .orangeNum {
          color: #999999;
        }
      }
      .card-actives-used {
        border-radius: 8px;
        border: 1px solid #e5e5e5;
        background-size: 300px 160px;
        width: 300px;
        height: 130px;
        position:relative;
        color: #999999;
        .type .blue,.type .orange {
          color: #999999;
        }
        .money .blueNum,.money .orangeNum {
          color: #999999;
        }
      }
      .card-actives-outlater {
        border-radius: 8px;
        border: 1px solid #e5e5e5;
        background-size: 300px 160px;
        width: 300px;
        height: 130px;
        position:relative;
        color: #999999;
        .type .blue,.type .orange {
          color:#999999;
        }
        .money .blueNum,.money .orangeNum {
          color:#999999;
        }
      }
    }
  }


  /* couponCard by lixd start */

  .blue {
    color: #618BE5;
  }
  .blueBg {
    color: #fff;
    background-color: #618BE5;
  }
  .orange {
    color: #FF8B00;
  }
  .orangeBg {
    color: #fff;
    background-color: #FF8B00;
  }
  .grey {
    color: #999;
  }
  .greyBg {
    color: #fff;
    background-color: #999;
  }
  .couponCardBox {
    margin-top: 30px;
    .couponCardCol {
      margin: 0 0 20px 0;
      .couponCard {
        width: auto;
        /*height: 180px;*/
        /* 添加支使用功能才会使用到 */
        height: 130px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        font-family: 'MicrosoftYaHei';
        .couponCardMain {
          padding: 20px 20px 0px 20px;
          width: auto;
          height: 130px;
          .upCard {
            height: 57px;
            position: relative;
            h5 {
              width: 75px;
              margin-bottom: 6px;
              margin-top: 0px;
              font-family: 'MicrosoftYaHei';
              font-size: 14px;
              font-weight: bold;
              .title {
              }
              .attention {
                width: 15px;
                height: 15px;
                border-radius: 50%;
                display: inline-block;
                line-height: 15px;
                text-align: center;
                margin: 0 3px;
                cursor: pointer;
              }
            }
            .describe {
              width: 120px;
              font-family: 'MicrosoftYaHei';
              float: left;
              font-size: 12px;
              margin: 0px;
              color: #999;
            }
            .right {
              float: right;
              font-size: 0px;
              font-weight: bold;
              font-family: 'QanelasSoftDEMO';
              position: absolute;
              top: 0px;
              right: 0px;
              zoom: 0.8;
              .yuan {
  
              }
              .priceNumber {
                font-size: 50px;
              }
            }
            .empty {
              clear: both;
            }
          }
          .downCard {
            clear: both;
            margin-top: 6px;
            text-align: right;
            font-size: 12px;
            color: #999;
            p {
              margin: 0px;
            }
          }
        }
        .couponCardVice {
          width: 100%;
          height: 50px;
          border-top: 1px dashed #e5e5e5;
          text-align: center;
          button {
            width: 140px;
            height: 30px;
            margin: 10px auto;
            padding: 0;
          }
        }
      }
    }
  }
  /* 适用范围 start */
  .couponCardArea {
    margin: 2px;
    height: 74px;
    h6 {
      font-size: 12px;
      margin-top: 0px;
      margin-bottom: 10px;
    }
    p {
      font-size: 12px;
      margin: 3px 0px;
      width: auto;
      word-wrap: asdf;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  /* 适用范围 end */
  /* 数字 start */
  @numberImg: '~common/assets/img/number.png';
  .number {
    height: 52px;
    display: inline-block;
  }
  .orange {
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
  /* couponCard by lixd end */

</style>
