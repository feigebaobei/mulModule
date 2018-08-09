<template>
	<div class="userInfo">
        <account-nav
        :type="'text'" 
        :tabValue="'第三方账户绑定'"
        :slipper="false"
        ></account-nav>
        <div class="bindAccount">
          <p>绑定第三方账户后，就可以使用以下网站账户登录，并同步分享</p>
          <ul v-for="(item, index) in bindList" :key="item.id">
            <li>
              <h5 :class="{weibo: item.pType == 3, 'jiazhangbang': item.pType == 4, 'wx': item.pType == 1}">{{item.name}}</h5>
              <span v-if="item.status == 1" class="hasBind">已绑定</span>
              <span v-if="item.status == 2" class="noBind">未绑定</span>
              <a @click="bindAccount(item.pToken)" v-if="item.status == 2" class="bind">立即绑定</a>
              <a @click="unBindAccount(item.pToken)" v-if="item.status == 1" class="unBind">解除绑定</a>
            </li>
          </ul>
        </div>
    </div>
</template>

<script>
import accountNav from '@/components/sub/accountNav.vue'
let Base64 = require('js-base64').Base64

export default {
  name: 'account',
  metaInfo: {
    title: '第三方账户绑定'
  },

   components: {
    accountNav
  },

  data () {
    return {
      bindList: []
    }
  },

  methods: {
    // 获取三方绑定信息
    getBindInfo () {
      let _this = this
      let baseUrl = window.location.search
      let jsonAfter = Base64.decode(baseUrl)
      _this.$http({
            method: 'get',
            url: '/Profile/bindInfos'
            }).then(function (res) {
              if (res.stat == 1) {
                // 遍历数据列表
                for (let i = 0; i < res.data.length; i++) {
                  _this.bindList.push(res.data[i])
                }
                  if (baseUrl) {
                    if (JSON.parse(jsonAfter).s == -1) {
                      alert('该用户已被其他用户绑定')
                    }
                    if (JSON.parse(jsonAfter).s == 0) {
                      alert('请刷新页面再试')
                  }
                  window.location.href = 'https://account.xueersi.com/Webs/platMgr#/bindAccount'
                } 
              } 
            }).catch(function (err) {
                console.log(err)
            })      
      },
      // 绑定账户
      bindAccount (pToken) {
        window.location.href = 'https://account.xueersi.com/Profile/bindPlat?pToken=' + pToken
      },
      // 解绑账户
      unBindAccount (pToken) {
        let _this = this
         _this.$http({
            method: 'post',
            url: '/Profile/unbindPlat',
            data: {
              pToken: pToken
            }
            }).then(function (res) {
               if (res.stat == 1) {
                 alert('解除绑定')
                 setTimeout(() => {
                    window.location.reload()
                  }, 500)
               } else {
                 alert(res.data)
               }
            }).catch(function (err) {
                console.log(err)
            })      
      }
  },
  
  mounted () {
    this.getBindInfo()
  }
}
</script>

<style lang='less' scoped>
	.userInfo{
    .bindAccount{
      padding:0 12px;
      p{
        font-size: 12px;
        color: #999;
        padding: 20px 0 0 10px;
        margin-bottom: 10px;
      }
      ul{
        li{
          padding: 12px 0;
          height: 60px;
          margin-bottom: 20px;
          background-color: #f9f9f9;
          h5.weibo{
          font-family: inherit;
          font-weight: 500;
          box-sizing: border-box;
          float: left;
          display: block;
          width: 20%;
          min-width: 115px;
          height: 45px;
          line-height: 30px;
          margin-left: 15px;
          padding: 7px 0 0 50px;
          font-size: 14px;
          color: #666;
          background: url(../../../../common/assets/img/app-logo.png) no-repeat;
          background-position: 0 -160px;
          }
          h5.jiazhangbang{
          font-family: inherit;
          font-weight: 500;
          box-sizing: border-box;
          float: left;
          display: block;
          width: 20%;
          min-width: 115px;
          height: 45px;
          line-height: 30px;
          margin-left: 15px;
          padding: 7px 0 0 50px;
          font-size: 14px;
          color: #666;
          background: url(../../../../common/assets/img/app-logo.png) no-repeat;
          background-position: 0 -242px;
          }
          h5.wx{
          font-family: inherit;
          font-weight: 500;
          box-sizing: border-box;
          float: left;
          display: block;
          width: 20%;
          min-width: 115px;
          height: 45px;
          line-height: 30px;
          margin-left: 15px;
          padding: 7px 0 0 50px;
          font-size: 14px;
          color: #666;
          background: url(../../../../common/assets/img/app-logo.png) no-repeat;
          background-position: 0 -82px;
          }
          // 预留QQ
          h5.qq{
          font-family: inherit;
          font-weight: 500;
          box-sizing: border-box;
          float: left;
          display: block;
          width: 20%;
          min-width: 115px;
          height: 45px;
          line-height: 30px;
          margin-left: 15px;
          padding: 7px 0 0 50px;
          font-size: 14px;
          color: #666;
          background: url(../../../../common/assets/img/app-logo.png) no-repeat;
          background-position: 0 6px;
          }
          span.noBind{
             font-size: 14px;
             color: #f13232;
             float: left;
             width: 15%;
             min-width: 50px;
             margin-top: 10px;
          }
          span.hasBind{
             font-size: 14px;
             color: #ffbc3c;
             float: left;
             width: 15%;
             min-width: 50px;
             margin-top: 10px;
          }
          a.bind{
            cursor: pointer;
            float: right;
            width: 100px;
            color: #fff;
            height: 35px;
            line-height: 35px;
            text-align: center;
            background: #f13232;
            border-radius: 2px;
            font-size: 12px;
            border-color: transparent;
            vertical-align: middle;
            margin-right:20px;
          }
          a.unBind{
            cursor: pointer;
            float: right;
            width: 100px;
            color: #666666;
            height: 35px;
            line-height: 35px;
            text-align: center;
            background: #ffffff;
            border-radius: 2px;
            font-size: 12px;
            border: 1px solid #ccc;
            vertical-align: middle;
            margin-right:20px;
          }
        }
      }
    }
  }
  </style>
