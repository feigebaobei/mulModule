<template>
  <div id="app">
    <iheader :pageType='4' @getUserInfo="getUserInfo"></iheader>
    <router-view></router-view>
    <!-- <xDialog></xDialog> -->
    <RightBar></RightBar>
  </div>
</template>

<script>
// import xDialog from '~common/components/Dialog.vue'
import iheader from '~common/components/Iheader.vue'
import RightBar from '~common/components/RightBar.vue'
import getZhiManager from '~common/util/zhiManager.js'
export default {
  name: 'app',
  components: {
    // xDialog,
    iheader,
    RightBar
  },
  methods: {
    getUserInfo (user) {
      if (user.stat === 1) {
        // 设置智齿对接用户身份、预留字段、自定义字段
        let zhiManager = getZhiManager()
        zhiManager.set && zhiManager.set('userinfo', {
          partnerId: user.data.user_id
        })
      }
    }
  }
}
</script>
