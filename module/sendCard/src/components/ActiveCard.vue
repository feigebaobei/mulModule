<template>
	<div class="cards">
		<account-nav
      :type="'text'" 
      :tabValue="'激活赠课卡'"
      :slipper="false"
        ></account-nav>
        <ul class="activeInput">
            <li>
                <label>卡号：</label>
                <input type="text" v-model="cardNum"/>
            </li>
            <li></li>
            <li>
                <label>密码：</label>
                <input type="password" v-model="passWord"/>
            </li>
            <li></li>
            <li class="commit">
                <span @click="activeCard">激活</span>
            </li>
        </ul>
	</div>
</template>

<script>
import accountNav from '@/components/sub/accountNav.vue'

export default {
  name: 'account',
  metaInfo: {
    title: '激活赠课卡'
  },
  components: {
    accountNav
  },
  data () {
    return {
      cardNum: '',
      passWord: ''
    }
  },
  methods: {
      activeCard () {
        let _this = this
        _this.$http({
            method: 'post',
            url: _this.Service.StuGiftCard.ajaxActiveGcard,
            data: {
               cardNo: _this.cardNum,
               cardPass: _this.passWord
            }
            }).then(function (res) {
                if (res.stat === 1) {
                    alert('激活成功！')
                    setTimeout(function () {
                        _this.$router.go(-1)
                    }, 2000)
                } else {
                    alert(res.msg)
                }
            }).catch(function (err) {
                console.log(err)
            })      
        }
  },
  mounted () {
      
  }
}
</script>

<style lang='less' scoped>
.cards{
    .activeInput{
        font-size: 12px;
        margin: 30px 0 0 100px;
        li{
            height: 35px;
            label{
                float: left;
                clear: both;
                width: 40px;
                margin-top: 8px;
                font-weight: normal;
                color: #666;
                font-size: 12px;
            }
            input{
                width: 250px;
                padding: 8px 5px;
                border: 1px solid #d2d2d2;
                font-size: 12px;
            }
        }
        .commit{
            span{
                width: 100px;
                font-size: 14px;
                color: #fff;
                background-color: #f13232;
                border-radius: 2px;
                padding: 6px 30px;
                border-color: transparent;
                cursor: pointer;
                margin-left: 40px;
            }
        }
    }
}
</style>
