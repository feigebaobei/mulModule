<template>
	<div class="invoice">
    <!--我的发票标题 start-->
		<account-nav  :type="'text'" :tabValue="'我的发票'" :slipper="false"></account-nav>
    <!--我的发票标题 end-->
    <!--我的发票列表 start-->
    <div class="invoice-content invoice-loading">
        <div class="bill-content">
              <h4 class="xue-account-tips">网校课程开发票的有效期是365天，需要发票的童鞋抓点紧哦！</h4>
              <div class="some-bill"  v-if="invoiceDetail.length">
                  <ul class="bill-title">
                      <li class="bill-first">发票详情</li>
                      <li class="bill-second">订单金额</li>
                      <li class="bill-third">状态</li>
                  </ul>
                  <div class="bill-details-list">
                      <div class="bill-details" v-for="(myList,index) in invoiceDetail" :key="index">
                          <div class="bill-number">
                              <span class="bill-number-time">{{myList.order_time}}</span>
                              <span v-if="myList.order_type==1" class="bill-order-num">订单号：<em>{{myList.order_no}}</em></span>
                              <span v-else class="bill-order-num">用户兑换卡ID：<em>{{myList.order_no}}</em></span>
                          </div>
                          <ul>
                              <li class="bd-lif">
                                  <div class="bill-subtitle-left">
                                      <div class="order-teacher ot-first">
                                          <!--<div class="bill-details-left">
                                              <p>9月9日-1月13日</p>
                                              <p>每周六18：30-21：00</p>
                                          </div>-->
                                          <div class="course-detail">
                                              <p class="c-title">
                                                  <span class="courseDetail-icon" v-if="myList.subject_name.length">{{myList.subject_name}}</span>
                                                  <span>{{myList.course_name}}</span>
                                              </p>                           
                                          </div>                  
                                      </div>
                                  </div>
                              </li>
                              <li class="bill-li">
                                  <div>
                                      ￥<em>{{myList.order_price}}</em>
                                  </div>
                              </li>
                              <li class="bill-status applyBill" >
                                  <div class="applyBox" v-if="myList.type==0">
                                      <p>未开发票</p>
                                      <button  type="button" @click="applyFun(myList.id)"  class="apply-btn">申请开票</button>
                                  </div>
                                  <div class="applyBox" v-else-if="myList.type==2">
                                      <p>全部已退课，发票作废</p>
                                      <button  type="button" class="apply-btn apply-btn-gray">申请开票</button>
                                  </div>
                                  <div class="applyBox" v-else-if="myList.type==3">
                                      <p>已部分退课，原发票已经作废，请下载新发票</p>
                                      <a class="download-btn" download="" :href="myList.pdf_url" >下载发票</a>
                                  </div>
                                  <div class="applyBox" v-else>
                                      <p>已经为你开具电子发票</p>
                                    <a class="download-btn" download="" :href="myList.pdf_url" >下载发票</a>
                                  </div>
                              </li>
                              <!--<li class="bill-status unableBill bill-hidden">
                                  <p>已过了开票时效，不能开票</p>
                              </li>-->
                          </ul>
                      </div>
                      
                      <div class="load_container" v-if="hasMore">
                          <div class="bill-check-more" @click="invoiceList(pageIndex)">查看更多</div>
                      </div>
                  </div>
                  
              </div>
              <!--完善发票信息弹框 start-->
              <div class="invoice-mask" v-if="dialogShow">
                  <div class="invoice-dialog">
                      <div class="invoice-hd">完善发票信息
                          <a href="javascript: void(0)" @click="closeDialog" class="invoice-close">&times;</a>
                      </div>
                      <div class="invoice-main">
                        <div class="invoice-type">
                              <span>请选择发票类型</span>
                              <select v-model='invoiceType' name="bill-title-select" id="bill-title-select">
                                  <option value="">请选择</option>
                                  <option value="1">服务费</option>
                                  <option value="2">培训费</option>
                              </select>
                          </div>
                          <div class="invoice-title">
                              <span>发票抬头</span>
                              <input type="text" class="bill-title-input" readonly="true" value="个人" placeholder="详细填写发票公司名称">
                          </div>
                          <p class="invoice-tips">注：网校课程发票抬头只能开个人，不能开公司，</p>
                          <p class="invoice-tips">开具的是电子发票，请开具后自行下载打印</p>
                          <p class="invoice-tips-error" ><span v-if="invoiceMsgErr">发票信息错误，请重新申请！</span></p>
                          <div class="invoice-btn">
                              <a  href="javascript:void(0)" @click="perfectMsg($event)" class="btn-confirm" :class="[{'confirm-active':invoiceTypeFlag},{'confirm-error':invoiceMsgErr}]">确认</a>
                              <a  href="javascript:void(0)" @click="closeDialog" class="btn-cancel">取消</a>
                          </div>
                      </div>
                  </div>
              </div>
              <!--完善发票信息弹框 end-->
              <!---提示输入发票信息 star-->
              <div class="invoice-type-tips-box" v-if="invoiceTypeFlag && dialogShow">
                <p class="invoice-type-tips-text">请选择发票类型</p>
                <el-button type="primary" @click="cancleTip" class="invoice-type-tips-btn" size="small">确定</el-button>
              </div>
                <!---提示输入发票信息 end-->
          </div>
          <!--我的发票列表 end-->
        <!--无数据页面 start-->
        <error
        :type="'blank'"
        v-if="!invoiceDetail.length"
        :warning="'暂无可开发票的商品~'"
      ></error>
    <!--错误页面 start-->
    <!-- <error
      :type="'fail'"
      v-if="invoiceDetail.length == 0 && !noData"
      :warning="warning"
    ></error> -->
    </div>
	</div>
</template>

<script>
import axios from 'axios'
import { Loading, Button } from 'element-ui'
import error from '@/components/sub/error.vue'
import accountNav from '@/components/sub/accountNav.vue'
export default {
  name: 'myInvoice',
  metaInfo: {
    title: '我的发票'
  },
  components: {
    accountNav,
    error,
    'el-button': Button
  },
  data () {
    return {
      perPageNum: 5,  // 一页数据有5条
      invoiceTypeFlag: false,  // 提示信息显示
      dialogShow: false,    // 弹框显示隐藏
      invoiceDetail: [], // 发票列表数据，0-请求失败，[]/''-无数据
      hasMore: true, // 是否显示加载更多
      pageIndex: 1,  // 发票列表请求起始页码
      total: 0, // 发票列表总条数  
      invoiceMsgErr: false, // 发票信息有误显示隐藏
      invoiceType: '',  // 发票类型
      noData: false, // 实际初始值为false
      warning: '请求失败,请重试......',
      loadFlag: false,
      nowId: '',  // 当前订单Id
      loadingInstance: null,
      loadingTimer: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loading('.invoice-loading')
      this.invoiceList(this.pageIndex)
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
    invoiceList (page) {
      let url = '/MyOrderData/getInvoiceCouList'
      axios.post(url, {
        curpage: page
      })
      .then((res) => {
        clearTimeout(this.loadingTimer)
        this.loadFlag = false
        if (res.status == 1) {
          this.total = Number(res.data.total)
           this.invoiceDetail = this.invoiceDetail.concat(res.data.list)
          // 如果数据不够一页，则不显示加载更多
          if (this.total <= this.perPageNum * this.pageIndex) {
             this.hasMore = false
          }
          this.pageIndex++
          if (!res.data.list || res.data.list.length <= 0) {
            this.hasMore = false
          }
          if (this.invoiceDetail.length == 0 || JSON.stringify(this.invoiceDetail) == '[]') {
            this.noData = true
            this.hasMore = false
          }
        } else {
          this.invoiceDetail = []
          this.warning = res.data
        }
      })
      .catch((err) => {
        clearTimeout(this.loadingTimer)
        this.loadFlag = false
        this.invoiceDetail = []
        console.log(err)
      })
    },
    perfectMsg (event) {
       event.preventDefault()
      if (this.invoiceType == '') {
          this.invoiceTypeFlag = true
        return
      }
      this.invoiceTypeFlag = false
      let url = '/MyOrders/ajaxInvoiceAdd'
      axios.post(url, {
        id: this.nowId,
        invoice_type: this.invoiceType,
        invoice_title: '个人'
      })
      .then((res) => {
        if (res.sign == 1) {
          this.dialogShow = false
          let nowIndex = this.pageIndex
          this.invoiceType = ''
          // 遍历数组，讲点击的申请发票变成下载发票
          this.invoiceDetail.filter((item, index) => {
            if (item.id == this.nowId) {
              item.type = 1
              item.pdf_url = res.msg
              return item
            }
          })
        } else {
          this.invoiceMsgErr = true
          return false
        }
      })
      .catch((err) => {
        console.log('申请开票 error', err)
      })
    },
    closeDialog () {
      this.invoiceTypeFlag = false
      this.dialogShow = false
      this.invoiceType = ''
    },
    applyFun (id) {
        this.nowId = id
        this.dialogShow = true
    },
    cancleTip () {
      this.invoiceTypeFlag = false
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
    }
  }
}
</script>

<style lang='less' scoped>
.invoice-type-tips-box{
  position: fixed;
  left:50%;
  top:0;
  z-index: 2010;
  background: #fff;
  width: 420px;
  height: 100px;
  padding-bottom: 10px;
  transform:translate(-50%,0);
  border-radius: 4px;
  border: 1px solid #ebeef5;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  text-align: left;
  overflow: hidden;
  .invoice-type-tips-text{
    line-height: 24px;
    color:#666;
    padding: 25px 10px 0 15px;
  }
  .invoice-type-tips-btn{
    position: absolute;
    right: 15px;
    cursor: pointer;
  }
}
  .invoice{
    height: 100%;
  }
  .invoice-content{
    padding:0 20px 10px 20px;
    font-size: 12px;
    color: #666666;
    position: relative;
    height:85%;
  }

  .bill-content {
  padding: 0 10px;
    .xue-account-tips {
      text-align: right;
      font-size: 12px;
      font-weight: normal;
      color: #f13232;
      margin: 20px 0 0;
      padding-right: 10px;
    }
    .some-bill {
      padding: 20px 10px;
      .bill-title {
        height: 50px;
        width: 100%;
        margin-bottom: 10px;
        background-color: #fcfcfc;
        border: 1px solid #eaeaea;
        li {
          float: left;
          padding-top: 16px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .bill-first {
          width: 57%;
          text-align: center;
        }
        .bill-second {
          width: 21%;
        }
        .bill-third {
          width: 22%;
        }
      }
      .bill-details {
        margin-bottom: 20px;
        overflow: hidden;
        border: 1px solid #eaeaea;
        background-color: #fff;
        height: 1%;
        .bill-number {
          padding: 15px 0 15px 20px;
          border-bottom: 1px solid #eaeaea;
          font-size: 12px;
          color: #333;
          background: #f3f3f3;
        }
        .bill-number .bill-number-time {
          color: #9a9a9a;
          margin-right: 57px;
        }
        ul {
          float: left;
          position: relative;
          width: 100%;
          padding: 20px;
        }
        ul .bd-lif {
          width: 57%;
          height: 79px;
          float: left;
          border-right: 1px solid #eaeaea;
        }
        ul .bd-lif .bsl-margin {
          margin-left: 13%;
        }
        ul .bd-lif .bill-subtitle-left .bn-second {
          border-top: 1px solid #eaeaea;
        }
        ul .bd-lif .bill-subtitle-left .drop-class {
          color: #a0a0a0;
        }
        ul .bd-lif .bill-subtitle-left .drop-class .course-icon {
          background-color: #d2d2d2;
        }
        ul .bd-lif .bill-subtitle-left .course-icon {
          margin: 25px 5px 0 0;
          padding: 1px 8px;
          border-radius: 2px;
          color: #fff;
          background-color: #ffbc3c;
        }
        ul .bd-lif .bill-subtitle-left .order-teacher {
          width: 100%;
          overflow: hidden;
        }
        ul .bd-lif .bill-subtitle-left .order-teacher .bill-details-left {
          font-size: 14px;
          float: left;
          width: 28%;
          margin-top: 2px;
        }
        ul .bd-lif .bill-subtitle-left .order-teacher .bill-details-left p {
          margin: 0;
          color: #666;
        }
        ul .bd-lif .bill-subtitle-left .order-teacher .course-detail {
          float: left;
          width: 72%;
          padding-left: 10px;
          margin-top: 22px;
          font-size: 14px;
        }
        ul .bd-lif .bill-subtitle-left .order-teacher .course-detail .c-title {
          width: 100%;
        }
        ul .bd-lif .bill-subtitle-left .order-teacher .course-detail .c-info {
          width: 100%;
        }
        ul .bd-lif .bill-subtitle-left .order-teacher .course-detail .c-info span {
          height: 18px;
          font-size: 14px;
          overflow: hidden;
          margin-right: 18px;
        }
        ul .bd-lif .bill-subtitle-left .order-teacher .course-detail .c-info .bill-look {
          color: #9a9a9a;
        }
        ul .bd-lif .bill-subtitle-left .order-teacher .course-detail .bill-gifts {
          padding-bottom: 10px;
        }
        ul .bd-lif .bill-subtitle-left .order-teacher .course-detail .bill-gifts p {
          margin: 0;
          line-height: 20px;
        }
        ul .bd-lif .bill-subtitle-left .order-teacher em {
          padding: 1px 8px;
          border-radius: 2px;
          font-style: normal;
          color: #fff;
          background-color: #ffbc3c;
        }
        ul .bill-li {
          width: 21%;
          height: 79px;
          text-align: center;
          position: absolute;
          left: 57%;
          border-right: 1px solid #eaeaea;
          font-size: 16px;
        }
        ul .bill-li div {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 50%;
          height: 16%;
          margin: -6% 0 0 -25%;
        }
        ul .bill-status {
          width: 22%;
          height: 100%;
          font-size: 14px;
          position: absolute;
          left: 78%;
        }
        ul .bill-status p {
          text-align: center;
          font-size: 12px;
          padding-bottom:8.5px;
        }
        ul .bill-status div.applyBox {
          text-align: center;
        }
        ul .bill-status div.applyBox a {
            display: inline-block;
            width: 98px;
            height: 32px;
            line-height: 32px;
            color: #fff;
            border-radius: 2px;
            text-align: center;
        }
        ul .applyBill div button {
          background-color: #f13232;
          display: inline-block;
          width: 98px;
          height: 32px;
          line-height: 32px;
          color: #fff;
          border-radius: 2px;
          text-align: center;
          padding: 0;
          border: none;
          cursor: pointer;
        }
        ul .applyBill div button:hover {
          background-color: #fa4747;
        }
        ul .applyBill div button:focus,ul .applyBill div button:active {
          background-color: #d42525;
        }
        ul .applyBill div button.apply-btn-gray {
          background-color: #eaeaea;
        }
        ul .applyBill div .download-btn {
          display: inline-block;
          width: 98px;
          height: 32px;
          line-height: 32px;
          color: #fff;
          border-radius: 2px;
          text-align: center;
          background-color: #f13232;
          border: none;
          cursor: pointer;
        }
        ul .applyBill div .download-btn:hover {
          background-color: #fa4747;
        }
        ul .applyBill .applyBox {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 34%;
          margin: -25% 0 0 -50%;
        }
        ul .billing div a {
          background-color: #ccc;
        }
        ul .billing .billingBox {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 34%;
          margin: -15% 0 0 -50%;
        }
        ul .download div {
          text-align: center;
        }
        ul .download div a.downloadBox-btn {
          background-color: #f13232;
          display: inline-block;
          width: 100px;
          height: 34px;
          text-align: center;
          line-height: 34px;
          font-size: 13px;
          border-radius: 2px;
          color: #fff;
        }
        ul .download div a.downloadBox-btn:hover {
          background: #fa4747;
        }
        ul .download div a.downloadBox-btn:focus,ul .download div a.downloadBox-btn:active {
          background: #d42525;
        }
        ul .download .downloadBox {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 34%;
          margin: -25% 0 0 -50%;
        }
        ul .applyBox a.applyBillBox-btn {
            background-color: #f13232;
            display: inline-block;
            width: 100px;
            height: 34px;
            text-align: center;
            line-height: 34px;
            font-size: 13px;
            border-radius: 2px;
            color: #fff;
        }
        ul .applyBox a.applyBillBox-btn:hover {
          background: #d73433;
        }
        ul .unableBill p {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 80%;
          height: 16%;
          margin: -5% 0 0 -40%;
        }

      }

    }
}

.invoice-mask{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
    .invoice-dialog {
      width: 580px;
      height: 350px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -290px;
      margin-top: -175px;
      background:#ffffff;
      border-radius: 2px;
      .invoice-hd {
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        font-size: 16px;
        color: #666666;
        border-bottom: 1px solid #eaeaea;
        margin-bottom: 8.5px;
        .invoice-close {
          display: block;
          position: absolute;
          right: 18px;
          top: 0;
          font-size:20px;
        }

      }
      .invoice-main {
        padding-left: 77px;
        .invoice-type {
          padding-top:30px;
          span {
             display: inline-block;
             width: 120px;
             text-align: right;
          }
          select {
            width:115px;
            height:36px;
            margin-left:12px;
            padding-left:5px;
          }
        }
        .invoice-title{
           padding-top: 30px;
           padding-bottom: 28px;
           span {
             display: inline-block;
             width: 120px;
             text-align: right;
           }
           input {
             width: 260px;
             height: 36px;
             color: #aaa;
             margin-left: 12px;
             padding-left: 5px;
             border: 1px solid #d2d2d2;
           }
        }
        .invoice-tips {
          width:264px;
          color:#ff3334;
          margin-left: 135px;
          overflow:hidden;
        }
        .invoice-tips-error {
          color:#f00;
          margin-left: 135px;
          height: 17px;
          overflow:hidden;
          margin-bottom: 7px;
        }
        .invoice-btn {
          margin-left: 135px;
          a {
            display: inline-block;
            width: 100px;
            height: 34px;
            text-align: center;
            line-height: 32px;
            font-size: 13px;
            border-radius: 2px;
            margin-right: 10px;
            cursor: pointer;
            padding: 0;
          }
          .btn-confirm {
            color:#fff;
            background-color: #ff3334;
            border: 1px solid #ff3334;
          }
          .btn-confirm:hover {
            background-color: #d73433;
          }
          .confirm-active{
            background-color: #d73433;
          }
          .confirm-error{
            background-color: #ccc;
            border: 1px solid #ccc;
            cursor: default;
            &:hover{
               background-color: #ccc;
            }
          }
          .btn-cancel {
            color:#333;
            background-color: #eaeaea;
            border: 1px solid #eaeaea;
          }
          .btn-cancel:hover {
            background-color: #c0c0c0;
          }
        }
      }
    }
}

.bill-check-more {
  height: 50px;
  width: 100%;
  margin-bottom: 20px;
  background-color: #fcfcfc;
  border: 1px solid #eaeaea;
  text-align: center;
  line-height: 50px;
  color: #656565;
  cursor: pointer;
}

.courseDetail-icon {
  display: inline-block;
  min-width: 10px;
  padding: 1px;
  font-size:14px;
  color: #fff;
  line-height: 1;
  vertical-align: baseline;
  white-space: nowrap;
  text-align: center;
  border-radius: 2px;
  font-weight: normal;
  border: 1px solid #f13232;
  color: #f13232;
}

</style>
