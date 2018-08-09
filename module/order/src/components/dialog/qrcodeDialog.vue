<template>
  <div class="qrcode-dialog-wrapper" :style="{'left': left, 'top': top}">
    <div class="qrcode-content">
      <span class="qrcode-close" @click="closeModel">×</span>
      <div class="qrcode-qr">
        <img :src="qrScanImg" alt="" class="qrcode-gongzhonghao">
        <img :src="qrLogoImg" alt="" class="qrcode-logo">
      </div>
      <p class="qrcode-remarks">关注公众号去选课</p>
    </div>
  </div>
</template>

<script>
import qrScanImg from '~common/assets/img/xueqr.png'
import qrLogoImg from '~common/assets/img/xue_logo.png'
export default {
  name: 'qrcodeDialog',
  data () {
    return {
      qrScanImg: qrScanImg,
      qrLogoImg: qrLogoImg,
      left: 0,
      top: 0
    }
  },
  methods: {
    /*
    * 设置弹框相对位置；
    * @event触发展示该弹框的元素事件；
    */
    setQrcode (event) {
      let e = event.srcElement || event.target
      let pos = this.getPosition(e, false)
      this.left = (pos.left - 70 + e.offsetWidth / 2) + 'px'
      this.top = (pos.top - 180) + 'px'
    },

    /*
    * 获取当前元素node位置；
    * @isParent是否相对父元素, false时相对 整个视窗；
    */
    getPosition (node, isParent) {
      var left = node.offsetLeft
      var top = node.offsetTop
      // 获取元素父元素；
      var parent = node.offsetParent
      if (!isParent) {
        // 存在父元素时：
        while (parent != null) {
          left += parent.offsetLeft
          top += parent.offsetTop
          parent = parent.offsetParent
        }
      }
      // 同时返回left和top值；
      return {
        'left': left,
        'top': top
      }
    },

    closeModel (event) {
      this.$emit('closeModel', event)
    }
  }
}
</script>

<style lang='less' scoped>
  .qrcode-dialog-wrapper{
    width: 140px;
    height: 168px;
    position: absolute;
    background: #fff;
    top: 100px;
    left: 30px;
    z-index: 8;
    border-radius: 2px;
    font-size: 12px;
    box-shadow: 0 0 28px rgba(0, 0, 0, 0.4);
    .qrcode-content{
      position: relative;
      width: 100%;
      height: 100%;
      text-align: right;
      color: #666;
      &:after{
        content: '';
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        border: solid 10px;
        border-color: #fff transparent transparent transparent;
      }
      .qrcode-close{
        height: 25px;
        font-size: 18px;
        padding-right: 5px;
        margin: 0;
        cursor: pointer;
          &:hover{
            color: #999;
          }
      }
      .qrcode-qr{
        width: 100%;
        height: 110px;
        padding: 0 15px;
        position: relative;
        .qrcode-gongzhonghao{
          width: 100%;
          height: 100%;
        }
        .qrcode-logo{
          width: 20px;
          height: 20px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
      }
      .qrcode-remarks{
        text-align: center;
        margin: 8px 0;
      }
    }
  }
</style>
