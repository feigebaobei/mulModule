<template>
  <section class="drop-wrapper">
    <!-- 普通订单退课 -->
    <account-nav
      :type="'text'"
      :tabValue="'申请退课'"
      :slipper="false"
    ></account-nav>
    <div class="drop-loading">
      <div class="drop-content" v-show="ajaxStatus != -1">
        <p class="drop-remarks" v-if="dropData.hint">
          <span class="red">温馨提示:</span>
          {{dropData.hint}}
        </p>
        <div v-if="dropData.course">
          <p class="drop-title">商品信息</p>
          <div class="drop-table">
            <div class="drop-th">
              <div class="drop-td td-first">课程信息</div>
              <div class="drop-td td-second">课程金额</div>
              <div class="drop-td td-third">已学场次</div>
              <div class="drop-td td-forth">剩余计费场次</div>
              <div class="drop-td td-fifth">教辅工本费</div>
              <div class="drop-td td-fifth">应退金额</div>
            </div>
            <div class="drop-tr" v-for="(item, index) in dropData.course" :key="index">
              <div class="drop-td td-first">
                  <span class="xue-am-badge" v-if="item.subjectName">数</span>
                  <span class="course-name">{{item.name}}</span>
                  <p class="course-date" v-if="item.time">上课时间：{{item.time}}</p>
                  <p class="course-teacher" v-if="item.teachers">授课老师：
                    <em v-for="(teacher, index1) in item.teachers" :key="index1">{{teacher}} </em>
                  </p>
              </div>
              <div class="drop-td td-second">
                <span class="td-vertical">¥{{item.realPrice}}</span>
              </div>
              <div class="drop-td td-third">
                <span class="td-vertical">{{item.payCnt}}</span>
              </div>
              <div class="drop-td td-forth">
                <span class="td-vertical">{{item.returnCnt}}</span>
              </div>
              <div class="drop-td td-fifth">
                <span class="td-vertical">¥{{item.gongbenfei}}</span>
              </div>
              <div class="drop-td td-sixth">
                <span class="td-vertical">¥{{item.returnPrice}}</span>
                <div class="td-vertical-hints" v-if="item.desc.length > 0">{{ item.desc}}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="dropData.reason">
          <p class="drop-money">应退总金额：¥{{dropData.totalRefund}}</p>
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
            <button  class="drop-submit-btn"  :class="dropData.isGray == 0 ? 'active' : '' " @click="dropSubmit">提交</button>
            <span v-show="dropData.isGray != 0" class="in-return-tips">课程应退金额为0，不予退课，如有疑问请联系在线客服。</span>
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
    <!-- 退课验证手机号 -->
    <drop-phone-dialog  v-show="dropPhoneSuccess != -1  && checkedReason.length > 0 && stuConId.length > 0"
      @closeDropPhoneDialog="closeDropPhoneDialog"
      @showDropDiolag="showDropDiolag"
      :advises="advises"
      :userPhone="userphone"
      :stuConId="stuConId"
      :checkedReason="checkedReason"
       > 
    </drop-phone-dialog>
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
import dropPhoneDialog from '@/components/dialog/dropPhoneDialog.vue'

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
    dropDialog,
    dropPhoneDialog
  },
  data () {
    return {
      dropData: {}, // 退课-接口请求回来的数据
      showModel: false,
      userphone: '', // 用户手机号
      warning: '请求失败，请重试......',
      checkedReason: [], // 退课原因
      advises: '', // 网校建议
      ajaxStatus: -1, // 页面信息接口请求状态；-1 未请求，1-成功，0-失败
      dropSuccess: -1, // 是否退课成功；-1 未请求，1-成功，0-失败
      dropPhoneSuccess: -1, // -1表示未验证手机号 1-表示成功
      loadFlag: false,
      loadingInstance: null,
      loadingTimer: null,
      stuConId: '' // 提交接口的请求参数之一
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
      axios.post(this.Service.Order.getReturnCourseInfo, {
        stuCouId: this.$route.query.stuCouId
      })
      .then((res) => {
        clearTimeout(this.loadingTimer)
        this.loadFlag = false
        if (res.status == 1) {
          this.ajaxStatus = 1
          this.dropData = res.data
          this.stuConId = res.data.stuCourseId
          this.userphone = res.data.phone
        } else {
          this.warning = res.data
          this.ajaxStatus = 0
        }
      })
    },

    // 退课提交按钮
    dropSubmit () {
      // 退课金额为0时，不予退课
      // if (this.dropData.totalRefund <= 0) return
      // isGray为1的情况下置灰，为0的情况可以提交
      if (this.dropData.isGray > 0) return
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
      this.dropPhoneSuccess = 1
    },
    // 短信验证码确认退课成功后
    showDropDiolag (val) {
      this.closeDropPhoneDialog()
      this.dropSuccess = val
    },
    // 关闭退课成功与否的提示框
    closeDropDialog () {
      this.dropSuccess = -1
    },
    closeDropPhoneDialog () {
      this.dropPhoneSuccess = -1
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
    .drop-remarks{
      margin: 20px 0 0 0;
      font-size: 12px;
      .red{
        color: #F13232;
      }
    }
    .drop-title{
      margin: 20px 0 10px 0;
      font-weight: bolder;
      font-size: 12px;
    }
    .drop-table{
      border: solid 1px #EAEAEA;
      .drop-th,.drop-tr{
        &:after{
          content: '';
          display: block;
          clear: both;
        }
        .drop-td{
          float: left;
          position: relative;
        }
        .td-first{
          width: 43%;
        }
        .td-second{
          width: 11%;
        }
        .td-third{
          width: 11%;
        }
        .td-forth{
          width: 11%;
        }
        .td-fifth{
          width: 11%;
        }
        .td-sixth{
          width: 13%;
        }
      }
      .drop-th{
        .drop-td{
          padding: 20px 10px;
          font-size: 12px;
          text-align: center;
        }
      }
      .drop-tr{
        display: flex;
        border-top: solid 1px #EAEAEA;
        .drop-td{
          text-align: center;
        }
        .td-first{
          text-align: left;
          padding: 20px 0 20px 20px;
        }
        .course-name{
          font-size: 14px;
          color: #333;
        }
        .course-date{
          font-size: 12px;
          margin: 5px 0 0 0;
          .course-time{
            margin-left: 5px;
          }
        }
        .course-teacher{
          font-size: 12px;
          margin: 5px 0 0 0;
        }
        .td-vertical{
          display: block;
          position: relative;
          top: 50%;
          -webkit-transform: translateY(-50%);
          -moz-transform: translateY(-50%);
          -ms-transform: translateY(-50%);
          transform: translateY(-50%);
          color: #333333;
        }
        .td-vertical-hints{
          min-width: 100%;
          position: absolute;
          top: 60%;
          left: 50%;
          -webkit-transform: translate(-50%, 0);
          -moz-transform: translate(-50%, 0);
          -ms-transform: translate(-50%, 0);
          transform: translate(-50%, 0);
          color: #F13232;
        }
      }
    }
    .drop-money{
      margin: 15px 18px 0 0;
      text-align: right;
      font-size: 14px;
      color: #F13232;
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
      font-size: 0;
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
      .in-return-tips{
        font-size: 12px;
        margin-left: 20px;
        color:#666;
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

