<template>
  <section class="drop-wrapper">
    <!-- 兑换卡订单退课 -->
    <account-nav
      :type="'text'"
      :tabValue="'申请退课'"
      :slipper="false"
    ></account-nav>
    <div class="drop-loading">
      <div class="drop-content" v-show="ajaxStatus && ajaxStatus != -1">
        <p class="drop-title">商品信息</p>
        <div class="ecard">
          <p>{{dropData.courseName}}</p>
          <p v-show="dropData.time" style="margin-top:10px;">{{dropData.time}}</p>
        </div>
        <p class="drop-title">退课金额</p>
        <p class="ecard">
          <span class="red" style="font-size: 20px;margin-right: 5px;">¥{{dropData.returnPrice}}</span>
          <span style="font-size: 14px;vertical-align: text-bottom;">(实际支付{{dropData.paidPrice}}元，应退金额{{dropData.returnPrice}}元)</span>
        </p>
        <p class="drop-remarks" v-if="dropData.hint">
          <span class="red">{{dropData.hint}}</span>
        </p>
        <div v-if="dropData.reason">
          <p class="drop-title">退课原因（必选）</p>
          <div class="drop-reason">
            <el-checkbox-group v-model="checkedReason">
              <el-checkbox v-for="item in dropData.reason" :key="item.reasonDesc" :label="item.reasonId">{{item.reasonDesc}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div v-if="ajaxStatus">
          <p class="drop-title">对网校的建议</p>
          <div class="drop-advise">
            <textarea v-model="advises" name="advise" id="advises" cols="30" rows="4" placeholder="快把您的想法告诉我们吧～"></textarea>
            <div class="count">{{count}}</div>
          </div>
          <div class="drop-submit">
            <button :class="dropData.returnPrice > 0 ? 'drop-submit-btn active' : 'drop-submit-btn'" @click="dropSubmit">提交</button>
          </div>
        </div>
        <!-- 错误提示框 -->
        <account-model
          v-show="showModel"
          :modelStyles="{'width': '320px'}"
          :titleStyles="{'height': '40px', 'lineHeight': '40px'}"
          :hasFooter="false"
          :content="warning"
          @closeModel="closeModel"
        ></account-model>
      </div>
      <error v-if="!ajaxStatus" :warning="warning" :mainStyles="{'margin-top': '15%','height': '100%'}"></error>
    </div>
    <!-- 退课结果弹框 -->
    <drop-Dialog
      v-show="dropSuccess != -1"
      :dropSuccess="dropSuccess"
      @closeDropDialog="closeDropDialog"
    ></drop-Dialog>
  </section>
</template>

<script>
import axios from 'axios'
import { Loading } from 'element-ui'
import accountNav from '@/components/sub/accountNav.vue'
import accountModel from '@/components/sub/accountModel.vue'
import error from '@/components/sub/error.vue'
import qrcodeDialog from '@/components/dialog/qrcodeDialog.vue'
import dropDialog from '@/components/dialog/dropDialog.vue'

export default {
  name: 'account',
  metaInfo: {
    title: '我的订单-申请退课'
  },
  components: {
    accountNav,
    accountModel,
    error,
    qrcodeDialog,
    dropDialog
  },
  data () {
    return {
      dropData: {}, // 退课-接口请求回来的数据
      showModel: false,
      warning: '请求失败，请重试......',
      checkedReason: [], // 退课原因
      advises: '', // 网校建议
      ajaxStatus: -1, // 页面信息接口请求状态；-1 未请求，1-成功，0-失败
      dropSuccess: -1, // 是否退课成功；-1 未请求，1-成功，0-失败
      loadFlag: false,
      loadingInstance: null,
      loadingTimer: null,
      stuECardId: '' // 提交接口的请求参数之一
    }
  },
  computed: {
    count () {
      return `${this.advises.length}/100`
    }
  },
  watch: {
    loadFlag: function () {
      if (!this.loadFlag) {
        this.loadingInstance.close()
        this.loadingInstance = null
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loading('.drop-loading')
      this.getDetail()
    })
  },
  methods: {
    // 获取退课页信息
    getDetail () {
      axios.post(this.Service.Order.getReturnECardInfo, {
        productId: this.$route.query.productId,
        stuECardId: this.$route.query.stuECardId
      })
      .then((res) => {
        clearTimeout(this.loadingTimer)
        this.loadFlag = false
        if (res.status == 1) {
          this.ajaxStatus = 1
          this.dropData = res.data
          this.stuECardId = res.data.stuECardId
        } else {
          this.warning = res.data
          this.ajaxStatus = 0
        }
      })
    },

    // 退课提交按钮
    dropSubmit () {
      // 退课金额为0时，不予退课
      if (this.dropData.returnPrice <= 0) return
      if (this.checkedReason.length <= 0) {
        this.warning = '请选择退课原因'
        this.showModel = true
        return
      }
      if (this.advises.length > 100) {
        this.warning = '对网校的建议不可以超过100个字哦～'
        this.showModel = true
        return
      }
      axios.post(this.Service.Order.ajaxReturnCard, {
        stuECardId: this.stuECardId,
        returnReasonId: this.checkedReason.join(','),
        suggestion: this.advises
      })
      .then((res) => {
        if (res.status == 1) {
          this.dropSuccess = 1
        } else {
          this.dropSuccess = 0
        }
      })
    },

    // 关闭退课成功与否的提示框
    closeDropDialog () {
      this.dropSuccess = -1
    },

    closeModel () {
      this.showModel = false
    },

    loading (selector) {
      let loadTime = 300
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
  .drop-wrapper{
    font-size: 12px;
  }
  .drop-loading{
    min-height: 500px;
  }
  .drop-content{
    padding: 0 20px;
    color: #666666;
    .ecard{
      width: 100%;
      padding: 10px 20px;
      border: solid 1px #EAEAEA;
    }
    .red{
      color: #F13232;
    }
    .drop-remarks{
      margin: 5px 0 0 0;
      font-size: 12px;
    }
    .drop-title{
      margin: 20px 0 10px 0;
      font-weight: bolder;
      font-size: 12px;
    }
    .drop-reason{
      border: solid 1px #EAEAEA;
      padding: 10px 20px 20px 20px;
    }
    .drop-advise{
      position: relative;
      #advises{
        width: 100%;
        padding: 10px 15px;
        outline:none;
        resize:none;
        font-size: 12px;
        border-color: #EAEAEA;
        color: #666666;
      }
      #advises::-webkit-input-placeholder {
        color: #989696 !important;
      }
      #advises:-moz-placeholder {
        color: #989696 !important;
      }
      #advises::-moz-placeholder {
        color: #989696 !important;
      }
      #advises:-ms-input-placeholder {
        color: #989696 !important;
      }
      .count {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
    .drop-submit{
      margin: 15px 20px 70px 20px;
      .drop-submit-btn{
        border: none;
        width: 100px;
        height: 30px;
        line-height: 30px;
        border-radius: 2px;
        font-size: 14px;
        background: gray;
        color: #ffffff;
        cursor: default;
      }
      .active{
        background: #F13232;
        cursor: pointer;
      }
    }
    .drop-reason{
      .el-checkbox-group{
        .el-checkbox+.el-checkbox{
          margin-left: 0;
        }
        .el-checkbox{
          margin-top: 10px;
          margin-right: 30px;
          .el-checkbox__inner{
            width: 12px;
            height: 12px;
            border-color: #bbbbbb;
            &:after{
              height: 6px;
              left: 3px;
            }
            &:hover{
              border-color: #F13232;
            }
          }
          .el-checkbox__label{
            min-width: 76px;
            padding-left: 5px;
            font-size: 12px;
            // color: #F13232;
          }
        }
        .is-focus{
          .el-checkbox__inner{
            border-color: #bbbbbb;
          }
        }
        .is-checked{
          .el-checkbox__inner{
            background-color: #F13232;
            border-color: #F13232;
          }
          .el-checkbox__label{
            color: #F13232;
          }
        }
      }
    }
  }
</style>

