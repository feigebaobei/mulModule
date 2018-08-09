<template>
  <div class="account-model">
    <div class="account-model-mask" :style="maskStyles"></div>
    <div class="account-model-wrapper" :style="modelStyles">
      <div class="model-title" v-if="hasHeader" :style="titleStyles">
        <slot name="header">
          <span class="mod-title">{{title}}</span>
          <em class="el-icon-close" @click='closeModel($event)'></em>
        </slot>
      </div>
      <div class="model-content">
        <slot name="content">
          <p class="mainContent">{{content}}</p>
        </slot>
      </div>
      <div class="model-footer" v-if="hasFooter">
        <slot name="footer">
          <button class="close-btn" @click='closeModel($event)'>关闭</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accountModel',
  props: {
    title: {
      type: String, // 标题
      default: '温馨提示'
    },
    content: {
      type: String, // 默认提示语
      default: '这是一个提示框'
    },
    maskStyles: {
      type: Object // 自定义蒙层样式
    },
    modelStyles: {
      type: Object // 自定义样式
    },
    titleStyles: {
      type: Object // 自定义标题样式
    },
    hasHeader: {
      type: Boolean, // 是否有头部信息-title
      default: true
    },
    hasFooter: {
      type: Boolean, // 是否有脚部信息-一般为操作按钮
      default: true
    }
  },
  methods: {
    closeModel (event) {
      this.$emit('closeModel', event)
    }
  }
}
</script>

<style lang='less' scoped>
  .el-icon-close{
    &:hover{
      // background: #f13232;
      // color: #ffffff;
      color: #333333;
    }
    height: 30px;
    line-height: 30px;
    position: absolute;
    top: 50%;
    right: 15px;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    text-align: center;
    border-radius: 50%;
    font-size: 18px;
    color: #666666;
    cursor: pointer;
    -webkit-transition: all .2s;
      transition: all .2s;
  }
  .account-model{
    .account-model-mask{
      position: fixed;
      top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(32, 32, 33, 0.66);
        height: 100%;
        z-index: 500;
    }
    .account-model-wrapper{
      width: 800px;
      position: fixed;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      border-radius: 2px;
      z-index: 501;
      background: #ffffff;
    }
    .model-title{
      width: 100%;
      height: 50px;
      line-height: 50px;
      position: relative;
      padding: 0 20px;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      font-size: 14px;
      background: #EAEAEA;
    }
    .mod-title{
      display: inline-block;
      font-weight: bold;
      color: #666666;
    }
    .model-content{
      padding: 10px 20px;
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
      font-size: 14px;
      .mainContent{
        text-align: center;
        padding: 10px 0;
      }
    }
    .model-footer{
      width: 100%;
      position: relative;
      padding: 0 20px 10px 20px;
      margin-bottom: 10px;
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
      text-align: right;
      .close-btn{
        margin-left: 18px;
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
</style>
