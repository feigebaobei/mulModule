<template>
  <account-model
    :title="dropSuccess ? '退课成功' : '退课失败'"
    :hasFooter="false"
    :modelStyles="{'width': '397px'}"
    @closeModel="closeModel"
  >
    <div class="success-wrapper" slot="content" v-if="dropSuccess">
      <div class="img-box">
         <img class="left-wrap" src="~common/assets/img/monkey_successed.png" alt="退课成功">
      </div>
      <div class="right-wrap">
        <p class="red">退课成功</p>
        <p class="count-tips">自动关闭 {{count}}s </p>
      </div>
	  </div>
     <div class="success-wrapper" slot="content" v-if="!dropSuccess">
      <div class="img-box">
         <img class="left-wrap" src="~common/assets/img/monkey_successed.png" alt="退课失败">
      </div>
      <div class="right-wrap">
        <p class="red">退课失败</p>
        <p class="count-tips">请稍后重试... </p>
      </div>
	  </div>
    <!-- <error slot="content" v-if="!dropSuccess" :mainStyles="{'height': '200px', 'min-height':'200px'}" :warning="'退课失败，请稍后重试...'"></error> -->
  </account-model>
</template>

<script>
import accountModel from '@/components/sub/accountModel.vue'
import error from '@/components/sub/error.vue'

export default {
  name: 'dropDialog',
  data () {
    return {
      timer: null,
      count: 3
    }
  },
  props: {
    dropSuccess: {
      type: Number,
      default: 0
    }
  },
  watch: {
    dropSuccess: function () {
      if (this.dropSuccess && this.dropSuccess != -1) { // 退课成功 倒计时
        this.timer = setInterval(() => {
          if (this.count > 0) {
            this.count --
          } else {
            this.$router.go(-1) // 跳转
            clearInterval(this.timer)
          }
        }, 1000)
      }
    }
  },
  components: {
    accountModel,
    error
  },
  methods: {
    closeModel () {
			this.$emit('closeDropDialog')
		}
  }
}
</script>

<style lang='less' scoped>
  .success-wrapper{
    height: 250px;
		position: relative;
    font-size: 14px;
    padding: 50px 0px 18px 44px;
    color: #666666;
    &:after{
      content: '';
      display: block;
      clear: both;
    }
    .img-box{
      float: left;
      width: 160px;
      height: 144px;
      margin-right: 35px;
    }
    .left-wrap{ 
      width: 153px;
      margin: 10px 3px 0 3px;
    }
    .right-wrap{
      float: left;
       margin-top: 45px;
      .red{
         color:rgba(102,102,102,1);
         font-size: 20px;
      }
      .count-tips{
        color:#999;
      }
    }
	}
</style>
