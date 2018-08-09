<template>
  <section>
    <div class="xue-mall-sidebar-fixed">
      <ul>
        <li @mouseleave='leave($event)'  class="xue-mall-qrCode">
          <a @mouseenter='enter($event)'  href="###">
            <i class="icon-xiazaiAPP iconfont"></i>
            <span class="xue-mall-toolbar-text">下载</span>
          </a>
          <span class="xue-mall-toolbar-tips">
            <i @click='close($event)' class="xue-mall-qrCode-closeBtn iconfont icon-guanbi"></i>
            <img src="//res11.xesimg.com/x5mall/img/wx_code.png?v=1" alt="">
            <p>下载APP</p>
          </span>
        </li>
        <li @mouseleave='leave($event)' @click='zixun' data-xeslog-params="key=xeslog-myCourse-i&action=click-zixun">
          <a @mouseenter='enter($event)'  href="###">
            <i class="icon-xuankezixun iconfont"></i>
            <span class="xue-mall-toolbar-text">咨询</span>
          </a>
          <em class="xue-mall-toolbar-tips">选课咨询</em>
        </li>
        <li @mouseleave='leave($event)' data-xeslog-params="key=xeslog-myCourse-i&action=click-toFankui">
          <a target="_blank" @mouseenter='enter($event)'  href="http://www.xueersi.com/StudentFeedback/apply/">
            <i class="icon-yijianfankui iconfont"></i>
            <span class="xue-mall-toolbar-text">反馈</span>
          </a>
          <a target="_blank" href="//www.xueersi.com/StudentFeedback/apply/" class="xue-mall-toolbar-tips">意见反馈</a>
        </li>
        <li @click='toggleDialog(true)' @mouseleave='leave($event)' data-xeslog-params='key=xeslog-myCourse-i&action=click-liaojiao'>
          <a @mouseenter='enter($event)'  href="###">
            <i class="icon-guanyuliaojie iconfont"></i>
            <span class="xue-mall-toolbar-text">了解</span>
          </a>
          <em class="xue-mall-toolbar-tips">了解网校</em>
        </li>
        <li @click='toTop' @mouseleave='leave($event)' v-if='backTop' class="xue-mall-backTop">
          <a @mouseenter='enter($event)'  href="###">
            <i class="iconfont icon-fanhuidingbu"></i>
          </a>
          <em class="xue-mall-toolbar-tips">返回顶部</em>
        </li>
      </ul>
    </div>
    <!--右侧固定侧边栏结束-->
    <transition name="el-fade-in">
      <div v-if='dialogShow' class="modal">
        <div class="dialog-container">
          <div class="dialog-heading">
            3分钟了解网校
            <a @click='toggleDialog(false)' href="javascript:;" class="dialog-close"><i class="el-icon-close"></i></a>
          </div>
          <div class="dialog_content">
            <iframe allowfullscreen="" frameborder="0" scrolling="no" src="//video.xueersi.com/view/getPublicVideo/243904" width="100%" height="100%"></iframe>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
export default {
  name: 'RightBar',
  data () {
    return {
      backTop: false,
      dialogShow: false,
      hoverStatus: [0, 0, 0, 0, 0]
    }
  },
  methods: {
    zixun () {
      if (document.getElementById('zhichiBtn')) {
        document.getElementById('zhichiBtn').click()
      }
    },
    toggleDialog (val) {
      this.dialogShow = val
    },
    handleScroll () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      scrollTop > 100 ? this.backTop = true : this.backTop = false
    },
    close (event) {
      let li = event.target.parentNode.parentNode
      let hoverNode = li.childNodes[2]
      li.className = li.className.replace(/\s?xue-mall-sidebar-hover/ig, '')
      let timer = setTimeout(() => {
        if (li.className.indexOf('xue-mall-sidebar-hover') < 0) {
          hoverNode.className = hoverNode.className.replace(/\s?show/ig, '')
        }
        clearTimeout(timer)
      }, 300)
    },
    enter (event) {
      let hoverNode = event.target.parentNode.childNodes[2]
      hoverNode.className += ' show'
      let timer = setTimeout(() => {
        event.target.parentNode.className = event.target.parentNode.className + ' xue-mall-sidebar-hover'
        clearTimeout(timer)
      }, 0)
    },
    leave (event) {
      let hoverNode = event.target.childNodes[2]
      event.target.className = event.target.className.replace(/\s?xue-mall-sidebar-hover/ig, '')
      let timer = setTimeout(() => {
        if (event.target.className.indexOf('xue-mall-sidebar-hover') < 0) {
          hoverNode.className = hoverNode.className.replace(/\s?show/ig, '')
        }
        clearTimeout(timer)
      }, 300)
    },
    toTop () {
      window.scrollTo(0,0)
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
      window.removeEventListener('scroll', this.handleScroll)
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
    .xue-mall-sidebar-fixed {
    position: fixed;
    width: 50px;
    height: 250px;
    right: 0;
    bottom: 10%;
    z-index: 99999;
    ul {
      li {
        position: relative;
        width: 50px;
        height: 50px;
        cursor: pointer;
        text-align: center;
        background: #fff;
        font-size: 14px;
        margin: 0;
        a {
          width: 100%;
          height: 100%;
          display: block;
          color: #333;
          i {
            width: 100%;
            height: 30px;
            line-height: 30px;
            font-size: 18px;
          }
          .xue-mall-toolbar-text {
            float: left;
            width: 100%;
            height: 20px;
            line-height: 12px;
            font-size: 12px;
          }
        }
        .xue-mall-toolbar-icon {
          width: 100%;
          height: 50px;
          cursor: pointer;
          color: #333;
          font-size: 20px;
        }
        &.xue-mall-sidebar-hover {
          background: #262626;
          .xue-mall-toolbar-tips {
            left: -123px;
            opacity: 1;
          }
          .xue-mall-toolbar-icon {
            background: #262626;
            color: #fff;
          }
          i,a {
            color: #fff;
          }
          .icon-xiazaiAPP+.xue-mall-toolbar-tips {
            left: -128px;
          }
        }
        &.xue-mall-backTop {
          line-height: 50px;
        }
        .xue-mall-toolbar-tips{
          width: 123px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          position: absolute;
          z-index: 1;
          left: -180px;
          color: #fff;
          top: 0px;
          opacity: 0;
          display: none;
          font-size: 14px;
          background-color: #f13232;
          font-weight: 400;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
          transition: left .3s ease-in-out .1s, opacity .3s ease-in-out .1s;
          &.show {
            display: block;
          }
          &:after {
            border-bottom: 5px solid transparent;
            border-top: 5px solid transparent;
            border-left: 6px solid #f13232;
            right: -6px;
            top: 5px;
            content: "";
            height: 0;
            position: absolute;
            top: 20px;
            width: 0;
            z-index: 1;
          }
        }
        &.xue-mall-qrCode {
          .xue-mall-toolbar-tips {
            background: #fff;
            height: auto !important;
            padding: 15px 15px 15px 10px;
            line-height: 0;
            width: 128px;
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                        &:after {
                            border-left: 6px solid #fff;
                        }
                        img{
                            width: 100px;
                            height: auto;
                        }
                        p {
                            color: #333;
                            margin: 0;
                            line-height: 14px;
                            padding-top: 10px;
                        }
            .xue-mall-qrCode-closeBtn {
              width: auto;
              position: absolute;
              top: 11px;
              right: 4px;
              color: #999999;
              font-size: 12px;
              cursor: pointer;
              &:hover {
                color: #f13232;
              }
            }
          }
        }
      }
    }
  }
  .modal {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1999;
    background: rgba(0, 0, 0, .5);
    .dialog-container {
      position: absolute;
      width: 800px;
      margin-left: -400px;
      left: 50%;
      top: 50%;
      transform: translateY(-50%);
      background: #fff;
      border-radius: 4px;
      overflow: hidden;
      .dialog-heading {
        background: #f5f5f5;
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        color: #333;
        border-bottom: 1px solid #eaeaea;
        .dialog-close {
          display: block;
          color: #b4b4b4;
          float: right;
          width: 30px;
          height: 30px;
          line-height: 30px;
          font-size: 22px;
          text-align: center;
          font-weight: normal;
          margin-top: 8px;
          position: relative;
          left: 10px;
          &:hover {
            border-radius: 15px;
            background-color: #f13232;
            color: #fff;
          }
        }
      }
      .dialog_content {
        width: 100%;
        height: 450px;
        padding: 15px;
        overflow: hidden;
      }
    }
  }
</style>
