<template>
	<div class="balance">
		<account-nav
      :type="'text'"
      :tabValue="'我的余额'"
      :slipper="false"
    ></account-nav>
    <div class="balance-content balance-loading">
      <div v-if="balanceDetail && balanceDetail != -1 || noData">
        <p class="o-title" style="margin-bottom: 0;">我的账户余额</p>
        <p class="o-balance">{{balance}}元</p>
        <p class="o-title">余额明细</p>
        <ul class="balance-detail" v-if="!noData">
          <li class="balance-detail-title">
            <span class="time">交易时间</span>
            <span class="count">收入/支出</span>
            <span class="desc">详细说明</span>
          </li>
          <li v-for="(detail, index) in balanceDetail" :key="index">
            <span class="time">{{detail.time}}</span>
            <span :class="Number(detail.count) > 0 ? 'count red' : 'count'">{{detail.count}}</span>
            <span class="desc" :title="detail.desc"><em class="wrap">{{detail.desc}}</em></span>
          </li>
        </ul>
        <error
          :type="'blank'"
          v-if="noData"
          :warning="'你还没有账户交易记录'"
        ></error>
      </div>
    </div>
    <error
      :type="'fail'"
      v-if="balanceDetail == 0 && !noData"
      :warning="warning"
      :mainStyles="{'margin-top': '14%'}"
    ></error>
    <Pagination
      v-show="total > pageSize"
      @pageChange='pageChange'
      :total='total'
      :pageSize='pageSize'
      style="margin-bottom: 50px;"
    ></Pagination>
	</div>
</template>

<script>
import axios from 'axios'
import { Loading } from 'element-ui'
import error from '@/components/sub/error.vue'
import Pagination from '~common/components/PaginationTwo.vue'
import accountNav from '@/components/sub/accountNav.vue'
export default {
  name: 'account',
  metaInfo: {
    title: '我的余额'
  },
  components: {
    accountNav,
    Pagination,
    error
  },
  data () {
    return {
      pageSize: 10,
      total: 0,
      balance: 0,
      balanceDetail: -1, // 余额明细数据，-1-未请求，0-请求失败，[]/''-无数据
      noData: false,
      warning: '请求失败,请重试......',
      loadFlag: false,
      loadingInstance: null,
      loadingTimer: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loading('.balance-loading')
      this.pageChange(1)
    })
  },
  watch: {
    loadFlag: function () {
      if (!this.loadFlag) {
        this.loadingInstance.close()
        this.loadingInstance = null
      }
    }
  },
  methods: {
    pageChange (page) {
      let url = '/MyInfoData/ajaxGetFinances'
      axios.post(url, {
        pageSize: 10,
        page: page
      })
      .then((res) => {
        clearTimeout(this.loadingTimer)
        this.loadFlag = false
        if (res.status == 1) {
          this.total = Number(res.data.total)
          this.balance = res.data.balance
          this.balanceDetail = res.data.detailLists
          if (!res.data.detailLists || res.data.detailLists.length <= 0) {
            this.noData = true
          }
        } else {
          this.balanceDetail = 0
          this.warning = res.data
        }
      })
      .catch((err) => {
        clearTimeout(this.loadingTimer)
        this.loadFlag = false
        this.balanceDetail = 0
        console.log('获取余额明细 error', err)
      })
    },

    loading (selector) {
      let loadTime = 500
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

<style lang='less' scoped>
  .balance{
    height: 100%;
  }
  .balance-content{
    padding: 10px 20px;
    font-size: 12px;
    color: #666666;
    position: relative;
    .o-title{
      font-weight: bolder;
      margin-bottom: 10px;
    }
    .o-balance{
      font-size: 40px;
      color: #EF5C51;
      margin-bottom: 10px;
    }
    .balance-detail{
      li {
        border: 1px solid #E0E0E0;
        border-top: none;
        &:first-child{
          border: 1px solid #E0E0E0;
          background: #F5F5F5;
        }
        .time, .count, .desc{
          width: 33%;
          display: inline-block;
          height: 50px;
          line-height: 47px;
          text-align: center;
          color: #333333;
        }
        .desc{
          line-height: 55px;
          vertical-align: middle;
          .wrap{
            display: inline-block;
            max-height: 32px;
            line-height: 16px;
            margin-top: 9px;
            overflow: hidden;
          }
        }
        .time, .count{
          border-right: 1px solid #E0E0E0;
        }
        .red{
          color: #F13232;
        }
        .gray{
          color: #666666;
        }
      }
      .balance-detail-title{
        .time, .count{
          border-right: none;
          color: #666666;
        }
        .desc{
          line-height: 50px;
          color: #666666;
        }
      }
    }
  }
  .el-loading-parent--relative{
    height: 85%;
  }
</style>
