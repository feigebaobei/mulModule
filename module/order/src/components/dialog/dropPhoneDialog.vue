<template>
  <account-model
    :title="'退课验证'"
    :hasFooter="false"
    :modelStyles="{'width': '397px'}"
    :titleStyles="{'font-size': '16px', 'font-weight': 'normal', 'background': 'rgba(245,245,245,1)'}"
    @closeModel="closeModel"
  >
  <!-- 用户有手机号的弹框 -->
    <div class="success-wrapper" slot="content" v-if="userPhone.length">
       <div class="phone-tips">
          <p class="phone-tips-text"><i class="phone-code-icon"></i><span>为避免非本人操作，需短信验证退课</span></p>
        </div>
        <div class="phone-box">
          <div class="phone phone-have">
                <span >当前手机号：</span>
                <span class="phone-user">{{userPhone.substr(0, 3) + '****' + userPhone.substr(7)}}</span>
            </div>
              <div class="phone">
                    <input type="text" class="number-text" maxlength="6"    v-model="phoneCode"   
                      placeholder="请输入短信验证码"
                    :disabled="!canInputFlag"
                    @input="handleInput($event)"
                      >
                    <span  class="sms-number" :class="[{'sms-disabled':!canClick}]" @click="sendSms">{{smsBtnTest}}</span>
                    <p class="phone-error" v-show="phoneCodeError"><i class="warn-icon"></i><span class="warn-text">{{phoneCodeError}}</span></p>
              </div>
        </div>
        <div class="submit-btn">
          <button class="confirm-btn" :class="{'btn-active': canConfirmFlag}" @click="submit($event)">确定退课</button>
          <div class="phone-modify">
            <span>当前手机号有误?</span>
              <a href="//account.xueersi.com/Webs/phoneMgr/#/setPhone">更换手机号</a>
          </div>
        </div>
	  </div>
    <!-- 用户没有手机号的提示去绑定手机号 -->
    <div class="success-wrapper" slot="content" v-if="!userPhone.length" style="height:173px">
      <div class="phone-tips">
          <p class="phone-tips-text"><i class="phone-code-icon"></i><span>为避免非本人操作，需短信验证退课</span></p>
      </div>
      <p class="phone-title">当前账户没有绑定手机号，请完善信息</p>
      <div class="submit-btn">
          <a href="//account.xueersi.com/Webs/phoneMgr/#/setPhone" class="confirm-btn btn-active">立即绑定</a>
      </div>
    </div>
  </account-model>
</template>

<script>
import accountModel from '@/components/sub/accountModel.vue'
import axios from '~common/assets/js/axios.js'
// 倒计时间隔
const Countdown = 60
export default {
  name: 'dropPhoneDialog',
  props: ['checkedReason', 'advises', 'stuConId', 'userPhone'],
  data () {
    return {
      timer: null,  // 定时器标识
      phoneCode: '', // 输入的验证码
      phoneCodeError: '',  // 验证码不正确
      smsBtnTest: '获取验证码',  // 按钮文案
      canInputFlag: false,  // 没发送验证码不能输入
      countTime: Countdown, // 倒计时发送短信验证码的时间
      canClick: true,  // 是否能点击获取短信验证码
      canConfirmFlag: false // 能否点击确定按钮
    }
  },
  components: {
    accountModel
  },
  methods: {
    closeModel () {
      this.$emit('closeDropPhoneDialog')
      this.resetDialog()
    },
    // 重置弹框
    resetDialog () {
       // 点击关闭短信退课的时候，重置弹框信息
          clearInterval(this.timer)
          this.phoneCode = ''
          this.canConfirmFlag = false
          this.canInputFlag = false
          this.canClick = true
          this.smsBtnTest = '获取验证码'
          this.phoneCodeError = ''
          this.countTime = Countdown
    },
   // 发送短信
    sendSms () {
      if (!this.canClick) return
      axios.post('/MyInfoData/getReturnCourseCode', {
        phone: this.userPhone,
        cancelGroupName: 'getReturnCourseCodeRequest'
      }).then((res) => {
        if (res.status === 1) {
           this.countTime = Countdown
            this.canInputFlag = true
            this.phoneCode = ''
            this.canConfirmFlag = false
            this.phoneCodeError = ''
            this.canClick = false
            this.smsBtnTest = this.countTime + 's'
             this.timer = setInterval(() => {
                this.countTime --
                this.smsBtnTest = this.countTime + 's'
                 if (this.countTime < 0) {         
                        // 当倒计时小于0时清除定时器
                     clearInterval(this.timer)
                      this.smsBtnTest = '重新发送'
                      this.canClick = true
                    }
            }, 1000)
        } else {
          // 短信发送失败
            this.canInputFlag = false
            this.canConfirmFlag = false
            this.phoneCodeError = res.data
        }
      })
    },
    submit (event) {
      // 阻止button的默认事件
      event.preventDefault()
      // 不能点击的时候，点击无效
      if (!this.canConfirmFlag) return
      axios.post(this.Service.Order.ajaxReturnCourse, {
        stuCouId: this.stuConId,
        returnReasonId: this.checkedReason.join(','),
        suggestion: this.advises,
        phone: this.userPhone,
        code: this.phoneCode
      }).then((res) => {
        //  短信验证失败
        if (res.status == -1) {
           this.canConfirmFlag = false
          this.phoneCodeError = res.data
        } else if (res.status == 1) {
          this.$emit('showDropDiolag', 1)
           this.resetDialog()
         } else {
            this.$emit('showDropDiolag', 0)
             this.resetDialog()
         }
       })
    },
    // 实时监听input的输入值
    handleInput (e) {
      // 每一次输入都清空提示信息
       this.phoneCodeError = ''
      // 监听input 值的变化，满足只能输入数字并且长度是6位的情况下才能激活
      this.phoneCode = e.target.value.replace(/[^\d]/g, '')
      if (this.phoneCode.length === 6) {
        this.canConfirmFlag = true
        return false
      } 
        this.canConfirmFlag = false
    }
  }
}
</script>

<style lang='less' scoped>
  .success-wrapper{
		height: 240px;
		position: relative;
    font-size: 14px;
    box-sizing: border-box;
    color: #666666;
    &:after{
      content: '';
      display: block;
      clear: both;
    }
    .phone-tips{
      margin-top: 10px;
      height: 38px;
      line-height: 38px;
      background:rgba(241,50,50,.1);
      border-radius:2px;
      .phone-tips-text{
        color:rgba(51,51,51,1);
        text-align: center;
        span{
          display: inline-block;
          vertical-align: middle;
          line-height: 38px;
          font-size:14px;
        }
        .phone-code-icon{
          display: inline-block;
          width:14px;
          height: 14px;
          background: url('~common/assets/img/phone_warn.png') no-repeat center;
          background-size: 100% 100%;
          vertical-align: middle;
          margin-right: 8px;
        }
      }
    }
    .phone-box{
      padding: 20px 48px;
      .phone{
        position: relative;
        span{
          display: inline-block;
          height:14px;
          line-height: 14px;
        }
        a{
          display: inline-block;
          font-size: 12px;
          width:60px;
          margin-left: 15px;
          height:14px;
          color:rgba(241,50,50,1);
          line-height:14px;
        }
        .sms-common{
          display: inline-block;
          position: absolute;
          right:6px;
          top:6px;;
          width:80px;
          height:24px;
          border-radius:2px;
          text-align: center;
          line-height: 24px;
          font-size: 12px;
        }
         .sms-number{
          .sms-common;
          color:rgba(241,50,50,1);
          cursor: pointer;
          border:1px solid rgba(241,50,50,1);
        }
         .sms-disabled{
          .sms-common;
          cursor:not-allowed;
          color:rgba(102,102,102,1);
          border:1px solid #ccc;
          background:rgba(230,230,230,1);
          color:rgba(153,153,153,1);
          border:none;
        }
        input{
          padding:10px;
          width:260px;
          height: 36px;
          line-height: 36px;
          color:#333;
          font-size: 14px;
          position: relative;
          border: 1px solid #ccc;
          border-radius: 2px;
          box-sizing: border-box;
          &::-webkit-input-placeholder{
            color:#999;
          }
           &::-moz-input-placeholder{
            color:#999;
          }
           &::-ms-input-placeholder{
            color:#999;
          }
        }
        .phone-user{
          width: 83px;
          color:#333;
        }
        .phone-error{
          position: absolute;
          top:40px;
          left:10px;
          height:12px;
          font-size:12px;
          color:rgba(241,50,50,1);
          line-height:12px;
          .warn-icon{
            display: inline-block;
            width:12px;
            height: 12px;
            background: url('~common/assets/img/phone_error.png') no-repeat center;
            background-size: 100% 100%;
            vertical-align: middle;
            margin-right: 5px;
          }
          .warn-text{
             display: inline-block;
            vertical-align: middle;
            line-height:12px;
          }
        }
      }
      .phone-info{
         margin-bottom: 30px;
      }
      .phone-have{
        margin-bottom: 20px;
      }
    }
    .submit-btn{
          width: 100%;
          padding-top:10px;
         .confirm-btn{
           display: block;
           margin:0 auto;
            width:130px;
            height:30px;
            background:rgba(220,220,220,1);
            border-radius:2px;
            border: none;
            line-height: 30px;
            font-size: 14px;
            color: #ffffff;
            cursor:not-allowed;
            text-align: center;
          }
          .btn-active{
              cursor: pointer;
              background:rgba(241,50,50,1);
            }
      }
      .phone-modify{
        text-align: center;
        margin-top: 20px;
        font-size:12px;
        color:rgba(153,153,153,1);
        line-height:12px;
        a {
          color:#4A90E2;
        }
      }
      .phone-title{
        font-size: 14px;
        line-height: 14px;
        margin: 30px auto;
        text-align: center;
        color:rgba(51,51,51,1);
      }
	}
</style>
