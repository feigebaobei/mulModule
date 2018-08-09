<template>
	<div class="order-wrap">
    <account-nav
      :type="'text'"
      :tabValue="'我的订单'"
      :slipper="false"
    ></account-nav>
    <div class="order-lists-loading">
      <account-nav
        v-model="currType"
        :type="'tab'"
        :tabValue="listTabs"
        :slipper="true"
        :mainStyles="{'font-size':'12px','padding':'0 10px 10px 10px','line-height': '25px'}"
        :liStyles="{'margin-right':'20px','padding':'0'}"
        :baseline="false"
        @tabClick="tabClick"
      ></account-nav>
      <div class="ao-title-wrapper" v-show="listsData.length > 0">
        <ul class="ao-title">
          <li class="ao-first">订单详情</li>
          <li class="ao-second">总计</li>
          <li class="ao-third">状态</li>
          <li class="ao-fourth">操作</li>
        </ul>
      </div>
      <div class="order-lists">
        <!-- 订单列表 start-->
        <div class="ao-details order-wrapper" v-for="(list, index) in listsData" :key="index">
          <div class="order-title-wrapper">
            <p class="or-title">
              <span class="time">{{list.createTime}}</span>
              <span class="number">订单号：{{list.orderNum}}</span>
            </p>
            <p class="or-warning" v-if="list.hint.type">
              <span class="orange" v-if="list.hint.type == 31 && list.hint.desc">[团购中]</span>{{list.hint.desc}}
            </p>
          </div>

          <!-- 普通订单 -->
          <div class="order-content-wrapper" v-if="list.classify == 1">
            <div class="order-course-wrapper">
              <div class="or-con or-first">
                <!-- 课程信息 start -->
                <div class="or-con-course-wrapper"  v-for="(course, courseIndex) in list.course" :key="courseIndex">
                  <div class="or-con-course-left">
                    <div class="or-course">
                      <div class="or-con-course">
                        <p class="course-name">
                          <span class="xue-am-badge" v-show="course.subjectName">{{course.subjectName}}</span>
                          <span class="text"><a :href="course.courseHref" target="_blank">{{course.courseName}}</a></span>
                        </p>
                        <p class="course-time" v-if="course.time">
                          {{course.time}}
                        </p>
                        <p class="course-teacher" v-if="course.teachers">
                          <span class="teach">授课：
                            <a class="black" v-for="(mainTea, teacherIndex) in course.teachers" :key="teacherIndex" :href="mainTea.href" target="_blank">{{mainTea.name}}  </a>
                          </span>
                        </p>
                      </div>
                      <div class="or-con-price"><p>￥{{course.price}}</p></div>
                    </div>
                    <!-- 福利 -->
                    <div class="or-welfare" v-if="course.giveaway.hasDelivered || course.giveaway.notDelivered || course.giveaway.hasReceived || course.giveaway.contains">
                      <div class="welfare welfare-name">
                        <em class="welfare-icon">福利</em>
                        <span class="text">教材邮寄</span>
                      </div>
                      <div class="welfare welfare-status">
                        <p v-if="course.giveaway.hasDelivered">已发货 ×{{course.giveaway.hasDelivered}}</p>
                        <p v-if="course.giveaway.notDelivered">待发货 ×{{course.giveaway.notDelivered}}</p>
                        <p v-if="course.giveaway.hasReceived">已签收 ×{{course.giveaway.hasReceived}}</p>
                        <p v-if="course.giveaway.contains">×{{course.giveaway.contains}}</p>
                      </div>
                    </div>
                  </div>
                  <!-- 课程纬度的操作 -->
                  <div class="or-con-course-right" v-if="!list.operation.notSeparate">
                    <p v-if="course.canReturn">
                      <router-link data-xeslog-params="key=xeslog_web_orderList_returncourse_ocenter&action=refund_course" :to="{ name: 'OrderDrop', query: { stuCouId: course.stuCouIdsStrEncode }}">申请退课</router-link>
                    </p>
                    <!-- 添加课程调课的按钮 -->
                    <p v-if="course.canExchange"><a href="javascript:void(0)" data-xeslog-params="key=xeslog_web_orderList_aujustcourse_ocenter&action=aujust_course" @click='getAddjustableCourseInfo(course,courseIndex)'>调课</a></p>
                    <p v-if="course.isReturnCourse">已退课</p>
                    <p v-if="course.reSub"><a class="red" :href="course.courseHref" target="_blank">重新报名</a></p>
                  </div>
                </div>
                <!-- 课程信息 end -->
              </div>
            </div>
            <div class="or-con or-position or-second">
              <p>¥{{list.totalPrice}}</p>
            </div>
            <div class="or-con or-position or-third">
              <p>{{list.statusDesc}}</p>
              <p><a :href="list.detailHref" target="_blank">查看详情</a></p>
              <p v-if="list.action.seeExpress"><a data-xeslog-params="key=xeslog_web_orderList_express_ocenter&action=click_look_express" href="javascript:void(0)" @click="showLogisticsDialog(index)">查看物流</a></p>
              <p v-if="list.action.canModifyAddr"><a data-xeslog-params="key=xeslog_web_orderList_addr_ocenter&action=click_modify_addr" href="javascript:void(0)"  @click="showAddressDialog(index)">修改地址</a></p>
            </div>
            <div class="or-con or-position or-forth" v-if="list.operation.notSeparate || list.operation.unionReturn || list.operation.goPay || list.operation.cancelOrder">
              <p v-if="list.operation.unionReturn">
                <router-link data-xeslog-params="key=xeslog_web_orderList_returncourse_ocenter&action=refund_course" :to="{ name: 'OrderDrop', query: { stuCouId: list.operation.unionStuCouId }}">申请退课</router-link>
              </p>
              <p v-if="list.operation.goPay"><a data-xeslog-params="key=xeslog_web_orderList_pay_ocenter&action=goToPay_order" :href="'http://trade.xueersi.com/Order/show?orderNum=' + list.orderNum" target="_blank">立即支付</a></p>
              <p v-if="list.operation.cancelOrder"><a data-xeslog-params="key=xeslog_web_orderList_cancel_ocenter&action=cancel_order" href="javascript:void(0)" @click="cancelClick(index)">取消订单</a></p>
            </div>
          </div>

          <!-- 兑换卡订单 -->
          <div class="order-content-wrapper" v-if="list.classify == 2">
            <div class="order-course-wrapper">
              <div class="or-con or-first">
                <!-- 卡信息 start -->
                <div class="or-con-course-wrapper"  v-for="(ecard, ecardIndex) in list.ecard" :key="ecardIndex">
                  <div class="or-con-course-left">
                    <div class="or-course">
                      <div class="or-con-course">
                        <p class="course-name">
                          <span class="text">{{ecard.productName}}</span>
                        </p>
                        <p class="course-time" v-if="ecard.time">
                          {{ecard.time}}
                        </p>
                        <div class="ao-course-remarks">
                          关注公众号即可选课哦，点击<span class="blue courseQrcode-btn" @click="getQrcode($event)">扫码关注</span>
                        </div>
                      </div>
                      <div class="or-con-price"><p>￥{{ecard.price}}</p></div>
                    </div>
                  </div>
                </div>
                <!-- 卡信息 end -->
              </div>
            </div>
            <div class="or-con or-position or-second">
              <p>¥{{list.totalPrice}}</p>
            </div>
            <div class="or-con or-position or-third">
              <p>{{list.statusDesc}}</p>
              <p><a :href="list.detailHref" target="_blank">查看详情</a></p>
            </div>
            <div class="or-con or-position or-forth">
              <p v-if="list.operation.returnECard">
                <router-link data-xeslog-params="key=xeslog_web_orderList_returnecard_ocenter&action=refund_ecard" :to="{ name: 'OrderDropEcard', query: { stuECardId: list.operation.stuECardId, productId: list.operation.productId}}">申请退课</router-link>
              </p>
              <p v-if="list.operation.goPay"><a data-xeslog-params="key=xeslog_web_orderList_pay_ocenter&action=goToPay_order" :href="'http://trade.xueersi.com/Order/show?orderNum=' + list.orderNum" target="_blank">立即支付</a></p>
              <p v-if="list.operation.cancelOrder"><a data-xeslog-params="key=xeslog_web_orderList_cancel_ocenter&action=cancel_order" href="javascript:void(0)" @click="cancelClick(index)">取消订单</a></p>
            </div>
          </div>
        </div>
        <!-- 订单列表 end-->
      </div>

      <!-- 调课列表弹窗 -->
      <transition name="el-fade-in">
          <adjustCourse v-if='dialogAdjustCourse'
            :activeCourseInfo='activeCourseInfo'
            :adjustClassInfo='adjustableCourseInfo'
            @activeCourseInfoUpdate='activeCourseInfoUpdate'
            @toogleAdjustCourse='toogleAdjustCourse'>
          </adjustCourse>
        </transition>
      <!-- 分页 -->
      <el-pagination
        class="order-page"
        v-if="total > pageSize"
        @current-change="pageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>

      <!-- 错误提示 -->
      <error :type="'fail'"
        v-if="!ajaxStatus"
        :warning="warning"
        :mainStyles="{'margin-top': '115px'}"
      ></error>

      <!-- 为空提示 -->
      <error :type="'blank'"
        v-if="ajaxStatus == 1 && listsData.length == 0"
        :warning="'暂时没有该类型的订单'"
        :mainStyles="{'margin-top': '115px'}"
      ></error>
    </div>

    <!-- 物流弹框 -->
    <logistics-dialog
      ref="logistics"
      v-show="showLogistics"
      :logistics="logistics"
      :orderId="editData.orderId"
      @closeLogisticsDialog="closeLogisticsDialog"
    ></logistics-dialog>

    <!-- 修改地址弹框 -->
    <address-dialog
      ref="address"
      :type="'edit'"
      :editData="editData"
      :showAddress="showAddress"
      :sourceType="sourceType"
      @closeAddressDialog="closeAddressDialog"
    ></address-dialog>

    <!-- 确定取消订单弹框 -->
    <accountModel
      v-show="showCancelModel"
      :modelStyles="{'width': '340px'}"
      :hasFooter="false"
      @closeModel="closeCancelModel"
    >
      <div class="cancel-wrapper" slot="content">
        <p class="cancel-text">确定取消该订单吗？</p>
        <div class="cancel-footer">
          <button @click='confirmCancelModel'>确定</button>
          <button @click='closeCancelModel'>取消</button>
        </div>
      </div>
    </accountModel>

    <!-- 取消订单成功与否提示弹框 -->
    <accountModel
      v-show="succCancel"
      :modelStyles="{'width': '300px'}"
      :hasFooter="false"
      :content="cacelWarning"
      @closeModel="closeSuccCancelModel"
    ></accountModel>

    <!-- 关注公众号提示 -->
    <qrcode-dialog
      v-show="showWX"
      ref="qrcode"
      @closeModel="closeQrcodeDialog"
    ></qrcode-dialog>

	</div>
</template>

<script>
import axios from 'axios'
import { Loading } from 'element-ui'
import accountModel from '@/components/sub/accountModel.vue'
import accountNav from '@/components/sub/accountNav.vue'
import error from '@/components/sub/error.vue'
import logisticsDialog from '@/components/dialog/logisticsDialog.vue'
import addressDialog from '@/components/dialog/addressDialog.vue'
import qrcodeDialog from '@/components/dialog/qrcodeDialog.vue'
import adjustCourse from '@/components/dialog/adjustCourse.vue'

export default {
  name: 'account',
  metaInfo: {
    title: '我的订单-订单管理'
  },
  components: {
    accountNav,
    accountModel,
    error,
    logisticsDialog,
    addressDialog,
    qrcodeDialog,
    adjustCourse
  },
  data () {
    return {
      listTabs: [], // 列表tab切换值
      currentPage: null,
      pageSize: 5,
      total: 0,
      currType: 0, // 当前列表tab的index
      listsData: [], // 订单列表数据
      showAddress: false, // 是否展示修改地址弹框
      editData: {
        orderId: '', // 订单id
        courseId: '' // 课程id
      },
      sourceType: '1', // 当前选中的订单类型 1-普通订单；2-兑换卡订单
      showLogistics: false, // 是否展示查看物流弹框
      logistics: [],
      ajaxStatus: -1, // 订单信息请求状态：-1-未请求，0-请求失败，1-请求成功
      warning: '请求失败,请重试......',
      loadFlag: false,
      loadingInstance: null,
      loadingTimer: null,
      showWX: false, // 是否展示 关注公众号提示框
      showCancelModel: false, // 是否展示 取消订单提示框
      succCancel: false, // 是否展示 取消订单成功提示框
      currentCancelIndex: -1, // 当前取消订单的index
      cacelWarning: '',
      dialogAdjustCourse: false, // 控制调课弹框
      activeCourseInfo: {}, // 当前选中的课程
      adjustableCourseInfo: {} // 当前课程的可调课程信息
    }
  },
  created () {
    this.currentPage = isNaN(Number(this.$route.params.page)) ? 1 : Number(this.$route.params.page) // 设置当前页数
    this.currType = isNaN(Number(this.$route.params.type)) ? 0 : Number(this.$route.params.type) // 设置当前类型tab
  },
  mounted () {
    this.$nextTick(() => {
      this.getTabs()
      this.getOrderList(this.currentPage)
    })
  },
  watch: {
    loadFlag: function () {
      if (!this.loadFlag) {
        this.loadingInstance.close()
        this.loadingInstance = null
      }
    },
    $route: function () {
      this.currentPage = isNaN(Number(this.$route.params.page)) ? 1 : Number(this.$route.params.page)
      this.currType = isNaN(Number(this.$route.params.type)) ? 0 : Number(this.$route.params.type) // 设置当前类型tab
      this.getOrderList(this.currentPage)
    }
  },
  methods: {
    // 调课列表弹窗
    getAddjustableCourseInfo (item) {
    	let url = '//i.xueersi.com/study/Web/MyCourse/ajaxCourseList'
    	let that = this
      axios.post(url, {
      	stuCouId: item.stuCouId,
  			cancelGroupName: 'adjustCourseOcenter'
      })
      .then((res) => {
        if (res.stat == 1) {
           that.adjustableCourseInfo = res.data
        } else {
          that.adjustableCourseInfo = '加载失败'
        }
        that.toogleAdjustCourse(true)
      })
      .catch(() => {
        that.adjustableCourseInfo = '加载失败'
        that.toogleAdjustCourse(true)
      })
       that.activeCourseInfoUpdate(item)
    },
    adjustCourse (res) { // 调课信息更新
  		this.adjustableCourseInfo = res
  	},
    toogleAdjustCourse (val) {
  		this.dialogAdjustCourse = val // 调课弹框
    },
    activeCourseInfoUpdate (res) { // 当前点击的课程信息更新
    this.activeCourseInfo = res
  	},
    // tab切换点击事件
    tabClick (index) {
      clearTimeout(this.loadingTimer)
      this.loadFlag = false
      this.currType = index
      this.$router.push({path: `/MyOrders/list/${this.currType}/1`})
    },
    // 获取订单tab切换的数据
    getTabs () {
      axios.post(this.Service.Order.ajaxUserOrderAmount)
      .then((res) => {
        if (res.status == 1) {
          this.listTabs.push('全部订单 ' + res.data.total)
          this.listTabs.push('已支付 ' + res.data.paid)
          this.listTabs.push('待支付 ' + res.data.notyet)
          this.listTabs.push('已取消 ' + res.data.cancel)
        } else {
          this.listTabs.push('全部订单')
          this.listTabs.push('已支付')
          this.listTabs.push('待支付')
          this.listTabs.push('已取消')
        }
      })
    },

    // 获取订单列表数据
    getOrderList (page) {
      if (!this.loadingInstance) {
        this.loading('.order-lists-loading')
      }
      document.body.scrollTop = document.documentElement.scrollTop = 0
      axios.post(this.Service.Order.ajaxGetOrderList, {
        curpage: page,
        perpage: this.pageSize,
        type: this.currType
      })
      .then((res) => {
        clearTimeout(this.loadingTimer)
        this.loadFlag = false
        if (res.status == 1) {
          this.ajaxStatus = 1
          this.listsData = res.data.list
          this.total = Number(res.data.total)
        } else {
          this.ajaxStatus = 0
          this.listsData = []
          this.warning = res.data
        }
      })
      .catch(() => {
        clearTimeout(this.loadingTimer)
        this.loadFlag = false
        this.ajaxStatus = 0
        this.warning = '订单列表获取，请稍后重试～'
      })
    },

    // 页码切换
    pageChange (page) {
      this.$router.push({path: `/MyOrders/list/${this.currType}/${page}`})
    },

    // 显示物流弹框；
    showLogisticsDialog (index) {
      this.editData.orderId = this.listsData[index].orderNum // 订单号
      this.logistics = this.listsData[index].express
      this.$refs.logistics.setIndex(0)
      this.showLogistics = true
    },
    // 关闭物流弹框；
    closeLogisticsDialog () {
      this.showLogistics = false
    },

    // 显示 添加／修改地址弹框
    showAddressDialog (index) {
      this.showAddress = true
      this.sourceType = this.listsData[index].classify.toString() // 订单类型
      this.editData.orderId = this.listsData[index].orderNum // 订单号
      this.$refs.address.addressEdit()
    },

    // 地址弹框关闭
    closeAddressDialog () {
      this.showAddress = false
    },

    // 获取关注公众号弹框
    getQrcode (event) {
      this.$refs.qrcode.setQrcode(event)
      this.showWX = true
    },
    // 关注公众号弹框关闭
    closeQrcodeDialog () {
      this.showWX = false
    },

    // 取消订单
    cancelClick (index) {
      this.currentCancelIndex = index
      this.editData.orderId = this.listsData[index].orderNum // 订单号
      this.showCancelModel = true
    },

    // 确定取消订单
    confirmCancelModel () {
      axios.post(this.Service.Order.ajaxCancelOrder, {
        orderNum: this.editData.orderId
      })
      .then((res) => {
        this.showCancelModel = false
        this.succCancel = true
        if (res.status == 1) {
          this.listsData[this.currentCancelIndex].operation.cancelOrder = 0 // 成功后不显示取消订单按钮
          this.cacelWarning = '取消订单成功～'
          location.reload()
        } else {
          this.cacelWarning = res.data
        }
      })
      .catch(() => {
        this.showCancelModel = false
        this.succCancel = true
        this.cacelWarning = '取消订单失败，请稍后重试～'
      })
    },

    closeCancelModel () {
      this.currentCancelIndex = -1
      this.showCancelModel = false
    },

    closeSuccCancelModel () {
      this.succCancel = false
    },
    loading (selector) {
      let loadTime = 200
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
    }
  }
}
</script>

<style lang='less'>
  .xue-am-badge {
    display: inline-block;
    min-width: 10px;
    padding: 2px;
    font-size: 14px;
    line-height: 1;
    vertical-align: baseline;
    white-space: nowrap;
    text-align: center;
    border-radius: 2px;
    background-color: transparent;
    border: 1px solid #f13232;
    color: #f13232;
  }
  .ao-title-wrapper{
    padding: 0 10px;
  }
  .ao-title{
    height: 50px;
    width: 100%;
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    li{
      float: left;
      padding-top: 16px;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .ao-first{
      width: 70%;
    }
    .ao-second{
      width: 10%;
    }
    .ao-third{
      width: 10%;
    }
    .ao-fourth{
      width: 10%;
    }
  }
  .order-lists-loading{
    position: relative;
    min-height: 450px;
    padding-top: 1px; // 防止父子margin合并
  }
  .order-lists{
    padding: 0 10px;
    .order-wrapper{
      width: 100%;
      margin-bottom: 15px;
      border: solid 1px #E0E0E0;
      color:#666666;
      background-color: #ffffff;
      .order-title-wrapper{
        padding: 10px 20px;
        font-size:12px;
        background: #f5f5f5;
        p{
          margin: 0;
        }
        .or-title{
          height: 30px;
          line-height: 30px;
          .number{
            display: inline-block;
            margin-left: 60px;
          }
        }
        .or-warning{
          height: 30px;
          line-height: 30px;
          .orange{
            color: #F0773C;
          }
        }
      }
      .bd-top{
        border-top: solid 1px #E0E0E0;
      }
      .order-content-wrapper{
        position:relative;
        display: flex;
        font-size: 12px;
        &:after{
          content: '';
          display: block;
          clear: both;
        }
        &>div.or-con:last-child{
          border-right: none;
        }
        .order-course-wrapper{
          width: 100%;
        }
        .or-con{
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          -ms-box-sizing: border-box;
          box-sizing: border-box;
          .or-course{
            padding: 20px;
            border-bottom: solid 1px #E0E0E0;
            &:last-child{
            border-bottom: none;
            }
            .or-con-course{
              width: 92%;
              display: inline-block;
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
            .or-con-price{
              // float: right;
              display: inline-block;
              vertical-align: top;
            }
          }
          .or-welfare{
            padding: 10px 20px;
            &:after{
              content: '';
              display: block;
              clear: both;
            }
            .welfare{
              float: left;
            }
            .welfare-icon{
              padding: 1px 8px 2px 8px;
              border-radius: 2px;
              margin-right: 5px;
              vertical-align: top;
              color: #ef3232;
              border: 1px solid #ef3232;
            }
            .welfare-name{
              width: 60%;
            }
            .welfare-status{
              width: 25%;
            }
            .welfare-operate{
              width: 15%;
              &>p{
                text-align: right;
              }
              a{
                color: #333333;
                &:hover{
                  color: #666666;
                }
              }
            }
          }
        }
        .or-first{
          width: 100%;
          .or-con-course-wrapper{
            border-top: solid 1px #E0E0E0;
            position: relative;
            .or-con-course-left{
              display: inline-block;
              width: 70%;
            }
            .or-con-course-right{
              position: absolute;
              top: 0;
              right: 0;
              width:10%;
              height: 100%;
              padding-top: 20px;
              border-left: solid 1px #E0E0E0;
              text-align: center;
              &>p {
                color: #777777;
                a{
                  color: #333333;
                  &:hover{
                    color: #666666;
                  }
                }
                .red {
                  color: #f13232;
                  &:hover{
                    color: #fa4747;
                  }
                }
              }
            }
          }
        }
        .or-position{
          height: 100%;
          width: 10%;
          position: absolute;
          top:0;
          padding: 20px 0;
          background: #ffffff;
          border-left: solid 1px #E0E0E0;
          border-top: solid 1px #E0E0E0;
          &>p{
            text-align: center;
            color: #777777;
            &:last-child{
              margin: 0;
            }
          }
          a{
            color: #333333;
            &:hover{
              color: #f13232;
            }
          }
        }
        .or-second{
          right: 20%;
          &>p{
            height: 18px;
            line-height: 18px;
            color: #666666;
          }
        }
        .or-third{
          right: 10%;
        }
        .or-forth{
          right: 0;
        }
      }
      .black{
        color: #333333;
      }
      .bd-bottom{
        border-bottom: solid 1px #E0E0E0;
      }
      .no-border{
        border: none;
      }
    }
  }
  .ao-course-remarks{
    margin: 0;
    font-size: 12px;
    color: #333;
      .blue{
        color:#3bafda;
      }
      .courseQrcode-btn{
        cursor: pointer;
      }
  }
  .cancel-wrapper{
    .cancel-text{
      margin: 30px 0;
      text-align: center;
    }
    .cancel-footer{
      text-align: center;
      margin-bottom: 10px;
      button{
        &:first-child{
          margin-left: 0;
        }
        &:hover{
          background: #fa4747;
        }
        margin-left: 30px;
        border-radius: 2px;
        border: none;
        outline: none;
        padding: 6px 15px;
        background: #F13232;
        color: #ffffff;
        cursor: pointer;
      }
    }
  }
  .order-lists-loading .order-page{
    text-align: center;
    .btn-next,.btn-prev,.el-dialog, .el-pager li,.el-pagination button.disabled,.el-pager li.btn-quicknext, .el-pager li.btn-quickprev{
      background: #e0e0e0;
      color: #ffffff;
      font-size: 14px;
      height: 39px;
      width: 45px;
      line-height: 39px;
      margin-left: 1px;
    }
    .el-pagination button.disabled {
      cursor: default;
    }
    .btn-next{
      border-radius: 0 3px 3px 0;
    }
    .btn-prev{
      border-radius: 3px 0 0 3px;
    }
    .btn-next{
      margin: 0 2px;
    }
    .btn-prev{
      margin: 0 1px;
    }
    .el-pager li.active{
      color: #ffffff;
      background: #f13232;
      font-size: 14px;
    }
    .el-pager li:hover,.btn-next:hover, .btn-prev:hover{
      color: #ffffff;
      background: #f13232;
    }
    .el-pagination .disabled:hover{
      background: #e0e0e0;
    }
    .btn-next .el-icon, .btn-prev .el-icon{
      font-weight: 900;
      font-size: 14px;
    }
    .el-pagination button:disabled{
      color: #ffffff;
      background-color: #fff;
      cursor: not-allowed;
      background: #e0e0e0;
    }
  }
</style>

