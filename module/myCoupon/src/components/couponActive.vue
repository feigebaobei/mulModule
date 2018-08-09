<template>
	<div class="coupon">
    <!--优惠券激活标题 start-->
		<account-nav  :type="'text'" :tabValue="'优惠券激活'" :slipper="false"></account-nav>
    <!--优惠券激活标题 end-->
    
    <!--优惠券激活正文 start-->
    <div class="couponActive">
      <div><label for="acount">卡号：</label><input @blur="cardNumCheck" v-model="cardNum" class="cardNo" type="text" id="acount"></div>
      <div class="error-box"><span v-show="cardNumErr" class="error">{{cardNumMsg}}</span></div>
      <div><label for="password">密码：</label><input @blur="passNumCheck" v-model="passNum" class="cardPass" type="password" id="password"></div>
      <div class="error-box"><span v-show="passNumErr" class="error">{{passNumMsg}}</span></div>
      <span class="btn-active" @click="couponActiveFun">激活</span>
    </div>
    <!--优惠券激活正文 end-->
    <div class="boxbg" v-show="showPanel">
      <div class="box">
        <div class="boxheader">
          <span v-html="panel.title" class="title"></span>
          <span class="closebt" @click="closePanelBt"></span>
        </div>
        <div class="boxbody">
          <div class="monkey">
            <!-- <img src="~common/assets/img/monkey_success.png" :alt="panel.title"> -->
            <img :src="panel.imgSrc" :alt="panel.title">
          </div>
          <div class="hint">
            <p class="status" v-html="panel.title + '!'"></p>
            <p class="minclose">{{panel.acountClose}}秒后弹框自动关闭</p>
          </div>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
import axios from 'axios'
import { Loading } from 'element-ui'
import error from '@/components/sub/error.vue'
import accountNav from '@/components/sub/accountNav.vue'
// import imgCloseSrc from '@/assets/images/close.png'
import imgSucSrc from '~common/assets/img/monkey_success.png'
import imgFailSrc from '~common/assets/img/monkey_fail.png'
export default {
  name: 'myCoupon',
  metaInfo: {
    title: '优惠券激活'
  },
  components: {
    accountNav,
    error
  },
  data () {
    return {
      cardNum: '',  // 卡号
      passNum: '',  // 密码
      cardNumErr: false,  // 卡号错误显示隐藏
      passNumErr: false,  // 密码错误显示隐藏
      cardNumMsg: '',     // 卡号错误提示信息
      passNumMsg: '',     // 密码错误提示信息
      showPanel: false,    // 是否显示回馈面板
      panel: {            // 回馈信息的数据
        title: '',
        imgSrc: '',
        acountClose: 3,
        timer: ''
      }
    }
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    couponActiveFun () {
      if (this.cardNum == '') {
        this.cardNumMsg = '请输入代金卡卡号'
        this.cardNumErr = true
        return false
      }
      if (this.passNum == '') {
        this.passNumMsg = '请输入代金卡密码'
        this.cardNumErr = false
        this.passNumErr = true
        return false
      }
      let url = '/activeGift/ajaxactiveGift'
      // let url = 'https://ocenter.xueersi.com/activeGift/ajaxactiveGift'
      axios.post(url, {
        cardNo: this.cardNum,
        cardPass: this.passNum
      })
      .then((res) => {
        // console.log(res.data)
          // console.log(this)
        this.showPanel = true
        if (res.stat == 1) {
          // console.log('成功')
          this.panel.title = '激活成功'
          this.panel.imgSrc = imgSucSrc
          this.panel.acountClose = 3
          this.closePanelAuto()
        } else {
          this.panel.title = '激活失败'
          this.panel.imgSrc = imgFailSrc
          this.panel.acountClose = 3
          this.closePanelAuto()
        }
      })
      .catch((err) => {
        this.panel.title = '数据出错'
        this.panel.imgSrc = imgFailSrc
        this.panel.acountClose = 3
        console.log('获取优惠券 error', err)
        this.closePanelAuto()
      })
    },
    cardNumCheck () {
      if (this.cardNum == '') {
        this.cardNumMsg = '请输入代金卡卡号'
        this.cardNumErr = true
      } else {
        this.cardNumErr = false
      }
    },
    passNumCheck () {
      if (this.passNum == '') {
        this.passNumMsg = '请输入代金卡密码'
        this.passNumErr = true
      } else {
        this.passNumErr = false
      }
    },
    // 手动关闭提示面板
    closePanelBt () {
      this.showPanel = false
      clearInterval(this.panel.timer)
    },
    // 自动关闭提示面板
    closePanelAuto () {
      if (this.showPanel) {
        this.panel.timer = setInterval(() => {
          if (this.panel.acountClose > 1) {
            this.panel.acountClose--
          } else {
            this.showPanel = false
            clearInterval(this.panel.timer)
          }
        }, 1000)
      }
    }
  }
}
</script>

<style lang='less' scoped>
  .coupon{
    height: 100%;
  }
  .couponActive{
    margin: 30px 0 0 5px;
    div {
      padding-left: 100px;
      label {
        width: 40px;
        margin-top: 8px;
        color: #666;
        font-size: 12px;
        display:inline-block;
        margin-bottom: 5px;
      }
      input {
        width: 250px;
        padding: 8px 5px;
        border: 1px solid #d2d2d2;
        font-size: 12px;
      }
    }
    .error-box {
      display:block;
      height: 35px;
      margin: 0px 0 0 32px;
      padding-top: 5px;
      line-height: 19px;
      .error {
        color: #f13232;
        background:url('http://res11.xesimg.com/x5account/img/warning.png') no-repeat 10px 0;
        padding-left: 32px;
        height: 30px;
        font-size: 12px;
        display: inline-block;
      }
    }
    .btn-active {
      margin: 0px 30px 0 141px;
      width: 100px;
      font-size: 14px;
      color: #fff;
      background-color:#f13232;
      border-radius: 2px;
      padding: 6px 30px;
      float: left;
      border-color: transparent;
      cursor: pointer;
    }
    .btn-active:hover {
      background: #d62c1a;
    }
  }


  .boxbg {
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 500px;
      height: 290px;
      background-color: #fff;
      border-radius: 2px;
      line-height: 50px;
      vertical-align: center;
      .boxheader {
        width: auto;
        height: 50px;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        background-color: #eaeaea;
        padding-left: 15px;
        .title {
          color: #666;
        }
        .closebt {
          background: url('~common/assets/img/close.png') no-repeat;
          background-size: 100% 100%;
          width: 16px;
          height: 16px;
          float: right;
          display: inline-block;
          margin: 17px;
        }
      }
      .boxbody {
        width: auto;
        height: auto;
        padding: 20px 0;
        .monkey {
          float: left;
          width: 270px;
          text-align: right;
        }
        .hint {
          float: left;
          color: #666;
          height: inherit;
          margin-top: 65px;
          margin-left: 15px;
          .status {
            font-size: 25px;
            color: #dd453d;
          }
          .minclose {
            margin: 0;
            line-height: 16px;
            font-size: 16px;
          }
        }
        &:after {
          content: ' ';
          display: block;
          clear: both;
        }
      }
    }
  }

</style>
