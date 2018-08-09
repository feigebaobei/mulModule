<template>
	<div class="order-detail">
    <account-nav
      :type="'text'"
      :tabValue="'订单详情'"
      :slipper="false"
    ></account-nav>

    <div class="order-loading">
      <div v-if="ajaxStatus && ajaxStatus !=-1" class="detail-content">
        <div v-if="detailData.order">
          <p class="o-title">订单信息</p>
          <div class="o-order">
            <p class="o-order-p">
              <span class="title">订单编号</span>
              <span class="text">{{detailData.order.id}}</span>
            </p>
            <p class="o-order-p">
              <span class="title">下单时间</span>
              <span class="text">{{detailData.order.time}}</span>
            </p>
            <p class="o-order-p">
              <span class="title">支付方式</span>
              <span class="text">{{detailData.order.payWay ? detailData.order.payWay : '无'}}</span>
            </p>
            <p class="o-order-p">
              <span class="title">支付状态</span>
              <span class="text">{{detailData.order.payStatus}}</span>
            </p>
          </div>
        </div>

        <div v-if="addressData">
          <p class="o-title">收件人信息</p>
          <div class="o-address">
            <p class="o-address-p">
              <span class="title">收货信息</span>
              <span class="text" :title='addressData.name + "，" + addressData.phone + "，" + addressData.province + "，" + addressData.city + "，" + addressData.region + "，" + addressData.address'>{{addressData.name}}，{{addressData.phone}}，{{addressData.province}} {{addressData.city}} {{addressData.region}} {{addressData.address}}</span>
              <a v-show="addressData.canModifyAddr" href="javascript:void(0)" class="oprate" @click="showAddressDialog" data-xeslog-params="key=xeslog_web_orderDetail_addr_ocenter&action=click_modify_addr">修改地址</a>
            </p>
            <div v-if="detailData.express && detailData.express.length > 0">
              <p class="o-address-p no-border-top">
                <span class="title">配送方式</span>
                <span class="text">
                  <em v-for="(firm, index) in detailData.express" :key="index">{{firm.firmName}}
                    <em class="vertical-line" v-if="index < (detailData.express.length - 1)">|</em>
                  </em>
                </span>
              </p>
              <p class="o-address-p">
                <span class="title">快递单号</span>
                <span class="text">
                  <span v-for="(firm, index1) in detailData.express" :key="index1">
                    <span v-for="(express, index2) in firm.firmExpress" :key="index2">
                      <em>{{express.expressId}}</em>
                      <em v-if="index2 < (firm.firmExpress.length - 1)">，</em>
                    </span>
                    <em class="vertical-line" v-if="index1 < (detailData.express.length - 1)">|</em>
                  </span>
                </span>
                <span class="oprate" @click="showLogisticsDialog" data-xeslog-params="key=xeslog_web_orderDetail_express_ocenter&action=click_look_express">查看物流</span>
              </p>
            </div>
            <div v-if="detailData.express && detailData.express.length == 0 && detailData.hasDelivery">
              <p class="o-address-p no-border-top">
                <span class="title">快递单号</span>
                <span class="text red">
                  暂无快递单号
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- 普通订单-商品信息 -->
        <div v-if="detailData.courses">
          <p class="o-title">商品信息</p>
          <div class="order-wrapper" v-for="(course, courseIndex) in detailData.courses" :key="courseIndex">
            <div class="order-title-wrapper">
                <p class="or-title">
                    <span class="or-first">商品详情</span>
                    <span class="or-second">原价</span>
                    <span class="or-third">优惠</span>
                    <span class="or-forth">实际金额</span>
                </p>
                <!-- <p class="or-warning">
                    <span class="orange">[拼购中]</span>不可取消订单，拼团成功后可在学习中心查看课程，拼团失败后将原路退款
                </p> -->
            </div>
            <div class="order-content-wrapper">
              <div class="or-con or-first">
                  <!-- 课程信息 -->
                  <div class="or-course">
                    <p class="course-name">
                      <span v-show="course.subjectName" class="tag course-tag">{{course.subjectName.substr(0, 1)}}</span>
                      <span class="text"><a :href='"http:\/\/www.xueersi.com\/kc\/" + course.courseId' target="_blank">{{course.name}}</a></span>
                    </p>
                    <p class="course-time">
                      {{course.time}}
                    </p>
                    <p class="course-teacher">
                      <span class="teach">授课：
                        <em class="black" v-for="(mainTea, mainTeaIndex) in course.mainTeacher" :key="mainTeaIndex">{{mainTea.name}}<em v-if="mainTeaIndex < (course.mainTeacher.length - 1)">，</em>
                        </em>
                      </span>
                      <!-- <span class="coach">辅导：<em class="black" v-for="(tutorTea, index) in course.tutorTeacher">{{tutorTea.name}}<em v-if="index < (course.tutorTeacher.length - 1)">，</em>
                        </em></span> -->
                    </p>
                  </div>
              </div>
              <div class="or-con or-second">
                <p>¥{{course.origPrice}}</p>
              </div>
              <div class="or-con or-third">
                <p>¥{{course.discPrice}}</p>
              </div>
              <div class="or-con or-forth">
                <p>¥{{course.currPrice}}</p>
              </div>
            </div>
            <div class="order-welfare" v-if="course.welfare && course.welfare.length > 0">
              <div class="welfare-icon-wrapper"><em class="welfare-icon">福利</em></div>
              <div class="welfare-detail">
                <p class="welfare-detail-p" v-for="(welfare, welfareIndex) in course.welfare" :key="welfareIndex">
                  <span class="welfare-text">{{welfare.name}} ×{{welfare.count}}</span>
                  <span class="welfare-status">{{welfare.status}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 兑换卡订单-商品信息-卡片信息 -->
        <div v-if="detailData.preCard">
          <p class="o-title">商品信息</p>
          <div class="order-wrapper">
            <div class="order-title-wrapper">
                <p class="or-title">
                    <span class="or-first">商品详情</span>
                    <span class="or-second">原价</span>
                    <span class="or-third">优惠</span>
                    <span class="or-forth">实际金额</span>
                </p>
            </div>
            <div class="order-content-wrapper">
              <div class="or-con or-first">
                  <!-- 卡片信息 -->
                  <div class="or-course">
                    <p class="course-name">
                      <span class="text">{{detailData.preCard.name}}</span>
                    </p>
                    <p class="course-time">
                      {{detailData.preCard.time}}
                    </p>
                  </div>
              </div>
              <div class="or-con or-second">
                <p>¥{{detailData.preCard.origPrice}}</p>
              </div>
              <div class="or-con or-third">
                <p>¥{{detailData.preCard.discPrice}}</p>
              </div>
              <div class="or-con or-forth">
                <p>¥{{detailData.preCard.currPrice}}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 兑换卡订单-兑换课程信息 -->
        <div v-if="detailData.preCourses">
          <p class="o-title">兑换课程记录</p>
          <div class="order-wrapper" v-for="(course, courseIndex) in detailData.preCourses" :key="courseIndex">
            <div class="order-title-wrapper">
                <p class="or-title">
                    <span class="or-first">兑换课程</span>
                    <span class="or-second">兑换时间</span>
                    <span class="or-third">状态</span>
                    <span class="or-forth">操作</span>
                </p>
            </div>
            <div class="order-content-wrapper">
              <div class="or-con or-first">
                  <!-- 课程信息 -->
                  <div class="or-course">
                    <p class="course-name">
                      <span class="tag course-tag">{{course.subjectName.substr(0, 1)}}</span>
                      <span class="text"><a :href='"http:\/\/www.xueersi.com\/kc\/" + course.courseId' target="_blank">{{course.name}}</a></span>
                    </p>
                    <p class="course-time">
                      {{course.time}}
                    </p>
                    <p class="course-teacher">
                      <span class="teach">授课：
                        <em class="black" v-for="(mainTea, mainTeaIndex) in course.mainTeacher" :key="mainTeaIndex">{{mainTea.name}}<em v-if="mainTeaIndex < (course.mainTeacher.length - 1)">，</em>
                        </em>
                      </span>
                      <!-- <span class="coach" v-if="course.tutorTeacher">辅导：<em class="black" v-for="(tutorTea, index) in course.tutorTeacher">{{tutorTea.name}}<em v-if="index < (course.tutorTeacher.length - 1)">，</em>
                        </em></span> -->
                    </p>
                  </div>
              </div>
              <div class="or-con or-second">
                <p>{{course.exchangeTime}}</p>
              </div>
              <div class="or-con or-third">
                <p>{{course.exchangeStatus}}</p>
              </div>
              <div class="or-con or-forth">
                <p v-if="course.dropStatusId == 1">
                  <a class="oprate-btn-b" :href="dropLink" v-if="course.dropStatusId == 1">申请退课</a>
                </p>
              </div>
            </div>
            <div class="order-welfare" v-if="course.welfare && course.welfare.length > 0">
              <div class="welfare-icon-wrapper"><em class="welfare-icon">福利</em></div>
              <div class="welfare-detail">
                <p class="welfare-detail-p" v-for="(welfare, welfareIndex) in course.welfare" :key="welfareIndex">
                  <span class="welfare-text">{{welfare.name}} ×{{welfare.count}}</span>
                  <span class="welfare-status">{{welfare.status}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="detailData.price">
          <p class="o-title">结算信息</p>
          <div class="o-address o-price">
            <p class="o-address-p">
              <span class="title">原价</span>
              <span class="text">{{detailData.price.originalPrice}}元</span>
            </p>
            <p class="o-address-p" v-if="detailData.price.couponPrice">
              <span class="title">优惠券金额</span>
              <span class="text">{{detailData.price.couponPrice}}元</span>
            </p>
            <p class="o-address-p" v-if="detailData.price.discountPrice">
              <span class="title">优惠金额</span>
              <span class="text">{{detailData.price.discountPrice}}元</span>
            </p>
            <p class="o-address-p">
              <span class="title">实际金额</span>
              <span class="text red">{{detailData.price.realityPrice}}元</span>
            </p>
          </div>
        </div>

        <div class="order-oprate" v-if="detailData.order">
          <a class="oprate-btn" data-xeslog-params="key=xeslog_web_orderDetail_ocenter&action=goToPay_order" :href="'http://trade.xueersi.com/Order/show?orderNum=' + detailData.order.id" v-if="detailData.order.payStatusId < 3">立即支付</a>
        </div>
      </div>
      <error :type="'fail'"
        v-if="!ajaxStatus"
        :warning="warning"
        :mainStyles="{'margin-top': '-3%','height': '100%'}"
      ></error>
    </div>

    <logistics-dialog
      ref="logistics"
      v-show="showLogistics"
      :logistics="logistics"
      :orderId="editData.orderId"
      @closeLogisticsDialog="closeLogisticsDialog"
    ></logistics-dialog>

    <address-dialog
      ref="address"
      :type="'edit'"
      :editData="editData"
      :showAddress="showAddress"
      :sourceType="sourceType"
      @closeAddressDialog="closeAddressDialog"
    ></address-dialog>
	</div>
</template>

<script>
import axios from 'axios'
import { Loading } from 'element-ui'
import {getQueryParamValue} from '~common/util/assist.js'
import error from '@/components/sub/error.vue'
import accountNav from '@/components/sub/accountNav.vue'
import logisticsDialog from '@/components/dialog/logisticsDialog.vue'
import addressDialog from '@/components/dialog/addressDialog.vue'
// import * as MockData from '@/MockData/MockData.js'
// axios.defaults.baseURL = 'http://ocenter.xueersi.com'
export default {
  name: 'account',
  metaInfo: {
    title: '订单详情'
  },
  components: {
    accountNav,
    logisticsDialog,
    addressDialog,
    error
  },
  data () {
    return {
      showLogistics: false,
      detailData: {},
      addressData: '', // 地址信息
      showAddress: false,
      editData: {
        orderId: '', // 订单id
        courseId: '' // 课程id
      },
      logistics: [],
      ajaxStatus: -1, // 订单信息请求状态：-1-未请求，0-请求失败，1-请求成功
      warning: '请求失败,请重试......',
      loadFlag: false,
      loadingInstance: null,
      loadingTimer: null,
      dropLink: '#', // 退课链接
      sourceType: '1' // 订单类型 1-普通订单；2-兑换卡订单
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loading('.order-loading')
      let orderType = getQueryParamValue('orderType')
      let orderNum = getQueryParamValue('orderNum')
      this.sourceType = (orderType == '2' ? '2' : '1') // 订单类型
      this.editData.orderId = orderNum // 订单号
      this.getOrderData(orderType, orderNum)
      // this.getOrderData(this.$route.query.orderType, this.$route.query.orderNum)
    })
  },
  watch: {
    loadFlag: function () {
      if (!this.loadFlag) {
        this.loadingInstance.close()
        this.loadingInstance = null
      }
    }
  },
  methods: {
    /*
    * 获取订单数据
    * @orderNum: 订单号
    * @orderType: 1/不传(默认为普通订单)，2(兑换卡订单)
    */
    getOrderData (orderType, orderNum) {
      let url = (orderType == '2' ? '/MyOrderData/getECardOrderDetail' : '/MyOrderData/getNormalOrderDetail')
      axios.post(url, {
        orderType: this.sourceType,
        orderNum: orderNum
      })
      .then((res) => {
        this.loadFlag = false
        clearTimeout(this.loadingTimer)
        if (res.status == 1) {
          this.ajaxStatus = 1
          this.detailData = res.data
          this.addressData = res.data.receiver
          if (res.data.preCard) {
            this.editData.orderId = res.data.preCard.stuEcardId
            this.dropLink = '//ocenter.xueersi.com/MyOrders/show/#/MyOrders/drop?stuCouId=' + res.data.preCard.stuCouIdEncode
          }

          // 封装物流查询需要的数据信息；
          if (!this.detailData.express) return
          for (let firm of this.detailData.express) {
            if (!firm.firmExpress) continue
            for (let item of firm.firmExpress) {
              let obj = {}
              obj.firmId = firm.firmId // 公司id；
              obj.expressId = item.expressId // 物流单号id
              this.logistics.push(obj)
            }
          }
        } else {
          this.ajaxStatus = 0
          this.warning = res.data
        }
      })
      .catch((err) => {
        clearTimeout(this.loadingTimer)
        this.loadFlag = false
        this.ajaxStatus = 0
        console.log('订单信息获取 error', err)
      })
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
            fullscreen: false,
            background: 'rgba(255, 255, 255, 0.8)',
            customClass: 'loading'
          })
        }
        clearTimeout(this.loadingTimer)
      }, loadTime)
    },

    // 显示物流弹框；
    showLogisticsDialog () {
      this.$refs.logistics.setIndex(0)
      this.showLogistics = true
    },
    // 关闭物流弹框；
    closeLogisticsDialog () {
      this.showLogistics = false
    },

    // 显示 添加／修改地址弹框
    showAddressDialog () {
      this.showAddress = true
      this.$refs.address.addressEdit()
    },

    /*
    * 地址弹框关闭
    * @address 新地址信息，只进行关闭操作 address=false
    */
    closeAddressDialog (address) {
      this.showAddress = false
      if (!address) return
      this.addressData.name = address.name
      this.addressData.phone = address.phone
      this.addressData.province_id = address.province_id
      this.addressData.province = address.province_name
      this.addressData.city_id = address.city_id
      this.addressData.city = address.city_name
      this.addressData.county_id = address.county_id
      this.addressData.region = address.county_name
      this.addressData.address = address.recipient_adds || address.detail
    }
  }
}
</script>


<style lang='less' rel="stylesheet/less" scoped>
  .order-detail{
    height: 100%;
  }
  .order-loading{
    height: 100%;
    height: calc(~'100% - 70px');
  }
  .course-tag{
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    display: inline-block;
    font-size: 14px;
    border-radius: 2px;
    border: 1px solid #ff0021;
    color: #ff0021;
    margin-bottom: 4px;
  }
  .welfare-icon{
    padding: 1px 8px 2px 8px;
    border-radius: 2px;
    margin-right: 5px;
    vertical-align: top;
    color: #ef3232;
    border: 1px solid #ef3232;
  }
  .detail-content{
    padding: 10px 10px 50px 10px;
    font-size: 12px;
    color: #666666;
    .vertical-line{
      display: inline-block;
      margin: 0 10px 0 7px;
    }
    .o-title{
      font-weight: bolder;
      padding-bottom: 10px;
    }
    .o-order, .o-detail, .o-address{
      margin-bottom: 20px;
      .title{
        min-width: 90px;
        display: inline-block;
        padding: 15px 20px;
        border-right: solid 1px #E0E0E0;
      }
      .text{
        display: inline-block;
        padding: 15px 20px;
        color: #333333;
        max-width: 820px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: bottom;
      }
      .oprate{
        cursor: pointer;
        color: #f13232;
      }
      .border-bottom{
        border-bottom: solid 1px #E0E0E0;
      }
    }
    .o-order{
      &:after{
        content: '';
        display: block;
        clear: both;
        visibility:hidden;
        height:0;
      }
      .o-order-p{
        width: 50%;
        float: left;
        border: solid 1px #E0E0E0;
        &:nth-child(even){
          border-left: none;
        }
        &:nth-last-child(2), &:last-child{
          border-top: none;
        }
      }
    }
    .o-address{
      .o-address-p{
        border: solid 1px #E0E0E0;
        &:not(:first-child){
          border-top: none;
        }
        .title{
          text-align: right;
        }
        .red{
          color: #ff0021;
        }
      }
      .no-border-top{
        border-top: none;
      }
    }
    .o-price{
      .o-address-p{
        .title{
          min-width: 101px;
          text-align: center;
        }
      }
    }
    .or-middle{
      position: relative;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
    }
    .order-wrapper{
      width: 100%;
      margin-bottom: 15px;
      border: solid 1px #E0E0E0;
      color:#666666;
      .order-title-wrapper, .order-content-wrapper{
        .or-first{
          display: inline-block;
          width: 64%;
        }
        .or-second, .or-third, .or-forth{
          display: inline-block;
          width: 11%;
        }
      }
      .order-title-wrapper{
        padding: 10px 20px;
        font-size:12px;
        border-bottom: solid 1px #E0E0E0;
        background: #f5f5f5;
        .or-first, .or-second, .or-third, .or-forth{
          text-align: center;
        }
        .or-warning{
            height: 30px;
            line-height: 30px;
            .orange{
                color: #F0773C;
            }
        }
      }
      .order-content-wrapper{
        display:-webkit-flex;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
        font-size: 12px;
        &:after{
          content: '';
          display: block;
          clear: both;
        }
        .or-con{
          float: left;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          -ms-box-sizing: border-box;
          box-sizing: border-box;
          &>div:last-child{
           border-bottom: none;
          }
          .or-course{
            padding: 20px;
            border-bottom: solid 1px #E0E0E0;
            .course-name{
                margin-bottom: 5px;
                .text{
                    color: #333333;
                    a{
                        font-size: 14px;
                        color: #333333;
                        &:hover{
                            color: #666666;
                        }
                    }
                }
            }
            .course-time{
                margin-bottom: 5px;

            }
            .course-teacher{
                margin-bottom: 0;
                .coach{
                    margin-left: 15px;
                }
            }
          }
        }
        .or-first{
        }
        .or-second{
          padding: 20px 0;
          &>p{
            text-align: center;
          }
        }
        .or-third{
          padding: 20px 0;
          &>p{
            text-align: center;
          }
          a{
            color: #333333;
            &:hover{
              color: #666666;
            }
          }
        }
        .or-forth{
          padding: 20px 0;
          &>p{
            text-align: center;
          }
          a{
            color: #333333;
            &:hover{
              color: #F13232;
            }
          }
        }
      }
      .order-welfare{
        padding: 0 20px;
        display:-webkit-flex;
        display: -ms-flexbox;
        display: flex;
        border-top: solid 1px #E0E0E0;
        .welfare-icon-wrapper{
          width: 6%;
          display: inline-block;
          padding-top: 20px;
        }
        .welfare-detail{
          width: 93%;
          display: inline-block;
          &>p:last-child{
           border-bottom: none;
          }
        }
        .welfare-detail-p{
          width: 100%;
          height: 50px;
          line-height: 50px;
          border-bottom: solid 1px #E0E0E0;
          .welfare-status{
            float: right;
            margin-right: 35px;
          }
        }
      }
      .black{
        color: #333333;
      }
      .bd-bottom{
        border-bottom: solid 1px #E0E0E0;
      }
      .bd-top{
        border-top: solid 1px #E0E0E0;
      }
      .no-border{
        border: none;
      }
    }
    .order-oprate{
      text-align: right;
      padding: 10px 20px;
      .oprate-btn{
        padding: 8px 20px;
        border: none;
        font-size: 14px;
        border-radius: 2px;
        background: #F13232;
        color: #ffffff;
        cursor: pointer;
        &:hover{
          background: #f14747;
        }
      }
    }
    .oprate-btn-b{
      display: block;
    }
  }
</style>
