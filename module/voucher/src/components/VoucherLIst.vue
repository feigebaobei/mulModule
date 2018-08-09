<template>
	<div class="voucher">
      <ul class="voucherHeader">
          <li>综合排序</li>
          <li><a href="https://ocenter.xueersi.com/Ocenter/myCoupon/#/coupon">我的优惠券</a></li>
      </ul>
       <ul class="voucherList">
           <li class="voucherItem" v-for="(item, index) in voucherList" :key="item.id">
               <div class="common">
                   <ul class="type">
                       <li class="comm" v-bind:class="{orange: item.coupon_type === 255, 'blue': item.coupon_type !== 255}">
                       <!-- <li class="comm" v-bind:class="calcColor(item)"> -->
                          <!-- <span v-if="item.type == '1'">通用券</span>
                          <span v-if="item.type == '2'">品类券</span> -->
                          <span v-html="couponType(item.coupon_type)"></span>
                          <el-tooltip :popper-class="toolTipClass" placement="right-start" effect="light" visible-arrow :offset="10">
                            <!-- <span v-if="item.type == 2"><img src="../../../../common/assets/img/voucher/tips.png"  v-if="item.coupon_conditions"></span> -->
                            <span v-if="item.coupon_conditions" style="cursor: pointer;">!</span>
                                <ul slot="content" v-if="item.coupon_conditions" style="color:#666666; width: 177px; padding: 5px;">
                                    <li class="range" style="font-size: 12px;font-weight:bold;margin-bottom: 14px;color:#666666;background: #ffffff;">适用范围</li>
                                    <li style="line-height:12px; margin-bottom: 7px;">年级&nbsp;:&nbsp;{{item.coupon_conditions.grade_show_names}}</li>
                                    <li style="line-height:12px; margin-bottom: 7px;">学科&nbsp;:&nbsp;{{item.coupon_conditions.subject_show_names}}</li>
                                    <li v-if="item.coupon_conditions.term_show_names" style="line-height:12px; margin-bottom: 7px;">学期&nbsp;:&nbsp;{{item.coupon_conditions.term_show_names}}</li>
                                </ul>
                           </el-tooltip>
                        </li>
                       <!-- <li class="explain"  v-if="item.type == '1'">全平台可用</li>
                       <li class="explain"  v-if="(item.type == '2' && item.coupon_conditions) && item.coupon_conditions.condition_type == '1'">仅可购买限定课程（特殊商品除外）</li>
                       <li class="explain"  v-if="item.type == '2' && !item.coupon_conditions">仅可购买限定课程（指定课程专用）</li> -->
                       <li class="explain" v-html="describeContent(item)"></li>
                   </ul>
                   <ul class="money" v-bind:class="{orange: item.coupon_type === 255, 'blue': item.coupon_type !== 255}">
                   <!-- <ul class="money" :class="calcColor(item)"> -->
                       <!-- <li v-if="item.type == 1" class="orangeNum">{{item.face_value}}</li>
                       <li v-if="item.type == 2" class="blueNum">{{item.face_value}}</li>
                       <li v-if="item.type == 1" class="orangeIcon"><img src="../../../../common/assets/img/voucher/comm.png"></li>
                       <li v-if="item.type == 2" class="blueIcon"><img src="../../../../common/assets/img/voucher/notcomm.png"></li> -->
                       <li class="number yuan" :style="numberBgImg"></li>
                       <li class="number" v-for="(subItem, subIndex) in destruction(item.face_value)" :key="subIndex" :style="numberBgImg" :class="{'one': subItem === '1', 'two': subItem === '2', 'three': subItem === '3', 'four': subItem === '4', 'five': subItem === '5', 'six': subItem === '6', 'seven': subItem === '7', 'eight': subItem === '8', 'nine': subItem === '9', 'zero': subItem === '0'}"></li>
                   </ul>
                   <ul class="text">
                       <li class="manjian">订单满{{item.order_full_price}}可用</li>
                       <li class="time">有效期:{{item.valid_start_date}}-{{item.valid_end_date}}</li>
                   </ul>
                   <span v-if="item.is_stu_received == 0" v-bind:class="{orangeBg: item.coupon_type === 255, 'blueBg': item.coupon_type !== 255, 'commonBtn': item.is_stu_received == 0, 'hasBtn': item.is_stu_received == 1}" @click="handleVoucher(item, index)">立即领取</span>
                   <span class="hasBtn" v-if="item.is_stu_received == 1">已领取</span>
               </div>
           </li>
       </ul>
       <div class="noneVoucher" v-if="isVoucher">
            <img src="../../../../common/assets/img/monkey_null.png">
            <p>近期无可领取的优惠券，请改天再来看哦~</p>
       </div>
       <account-model
      :hasFooter="true"
      :content="alertContent"
      :stat="status"
      :maskStyles="{'z-index': '502'}"
      :modelStyles="{'width': '466px','height': '240px','z-index': '503'}"
      :titleStyles="{'height': '40px', 'line-height': '40px'}"
      @closeModel="closeAlertModel"
      v-show="alertModel"
    >
    </account-model>
	</div>
</template>

<script>
import {Loading, Tooltip, MessageBox} from 'element-ui'
import accountModel from '@/components/sub/accountModel.vue'
import numberImg from '@/assets/images/number.png'
export default {
  name: 'account',
  metaInfo: {
    title: '领券中心'
  },

  components: {
    accountModel
  },

  data () {
    return {
        voucherList: [],
        isActive: true,
        alertModel: false, // 提示框
        alertContent: '',
        btnFlag: true,
        isVoucher: false,
        toolTipClass: 'voucher-toolTipClass',
        status: 1,
        numberBgImg: {
          backgroundImage: 'url(' + numberImg + ')'
        }
    }
  },

  methods: {
       CurentTime () {   
        var now = new Date()
        var year = now.getFullYear()       // 年  
        var month = now.getMonth() + 1     // 月  
        var day = now.getDate()            // 日  
        var hh = now.getHours()            // 时  
        var mm = now.getMinutes()          // 分  
        var ss = now.getSeconds()           // 秒  
          
        var clock = year + '-'  
          
        if (month < 10) {
             clock += '0'
        } 
             
        clock += month + '-'  
          
        if (day < 10) {
             clock += '0' 
        }
                
        clock += day + ' ' 
          
        if (hh < 10) {
            clock += '0'
        }
              
        clock += hh + ':'  
        if (mm < 10) clock += '0'   
        clock += mm + ':' 
           
        if (ss < 10) clock += '0'  
        clock += ss   
        return (clock)   
    },
   
      // 获取券列表
      ajaxGetCouponList () {
        let _this = this
        _this.$http.post(_this.Service.Vencher.ajaxGetCouponList)
        .then(function (res) {
            if (res.stat == 1) {
                 for (let i in res.data) {
                     _this.voucherList.push(res.data[i])
                 }
                 if (_this.voucherList) {
                    _this.isVoucher = false
                 } else {
                    _this.isVoucher = true
                 }
            } else {
                _this.isVoucher = true
                console.log(res.data)
            }
        })
        .catch(function (error) {
            console.log(error)
        })
    },
    // 领取兑换券
    handleVoucher (Id, Index) {
      let _this = this
      if (!_this.btnFlag) {
          _this.status = 0
          _this.alertContent = '手速太快啦～'
          _this.alertModel = true
          return
      }
      let d1 = _this.CurentTime().replace('-', '/')
      let d2 = Id.receive_end_time.replace('-', '/')
      let currentTime = new Date(d1).getTime()
      let endTime = new Date(d2).getTime()
      if (currentTime > endTime) {
          _this.status = 0
          _this.alertContent = '已超过领取时间！'
          _this.alertModel = true
          _this.voucherList.splice(Index, 1)
          return
      }
      _this.btnFlag = false
      _this.$http({
          method: 'post',
          url: _this.Service.Vencher.stuReceiveCoupon,
          data: {
             couponId: Id.id
          }
          }).then(function (res) {
              if (res.stat === 1) {
                   _this.status = 1
                   _this.btnFlag = true
                   Id.is_stu_received = 1
                   _this.alertContent = res.msg
                   _this.alertModel = true
              } else if (res.stat === 9) {
                  window.location.href = 'https://login.xueersi.com/?redirect_url=%2f%2focenter.xueersi.com%2fCoupon%2fgetCouponList%23%2faccount%2fvoucherList'
              } else {
                  _this.status = 0
                  _this.btnFlag = true
                  _this.alertContent = res.msg
                  _this.alertModel = true
                  if (res.data.couponLeftNum == 0) {
                      _this.voucherList.splice(Index, 1)
                  }
              }
          }).catch(function (err) {
              _this.btnFlag = true
              console.log(err)
          })      
      },
    closeAlertModel () {
        this.alertModel = false
    },
    // 计算优惠券的颜色
    calcColor (obj) {
      let str = ''
      if (obj.is_stu_received) {
        str = 'grey'
      } else {
        str = obj.coupon_type === 255 ? 'orange' : 'blue'
      }
      return str
    },
    // 优惠券的类型
    couponType (int) {
      if (int === 255) {
        return '通用券'
      } else {
        return '品类券'
      }
    },
    // 判断对象是否为空
    isEmptyObj (obj) {
      var string = JSON.stringify(obj)
      return string === '{}' || string === '[]'
    },
    // 解构数值
    destruction (string) {
      return [...string]
    },
    // 描述的内容
    describeContent (obj) {
      // console.log(obj)
      let str = ''
      switch (obj.coupon_type) {
        case 255:
          str = '全平台可用<br>（特殊商品除外）'
          break
        case 1:
          str = '所有课程可用<br>（特殊课程除外）'
          break
        case 2:
          str = '部分课程可用<br>（特殊课程除外）'
          break
        case 3:
          str = '指定课程专用'
          break
        case 4:
          str = '所有次卡可用<br>（特殊次卡除外）'
          break
        case 5:
          str = '部分次卡可用<br>（特殊次卡除外）'
          break
        case 6:
          str = '指定次卡专用'
          break
      }
      return str
    }
  },

  mounted () {
      this.ajaxGetCouponList()
  }
}
</script>

<style lang='less'>
    .voucher-toolTipClass{
        border: 1px solid #E5E5E5 !important;
        box-shadow:0px 0px 5px 0px rgba(0,0,0,0.1) !important;
    }
    .right {
        width: 1200px !important;
        background:#f5f5f5 !important;
        margin-right: -15px !important;
		min-height: 630px !important;
    }
    .voucher{
        margin-right: -15px;
        ul.voucherHeader{
            width: 100%;
            margin-bottom: 20px;
            
            border-bottom: 2px solid #333333;
            font-size: 14px;
            height: 48px;
            line-height: 48px;
            li:nth-child(1){
                background: #333333;
                color: #fff;
                width: 100px;
                text-align: center;
                float: left;
            }
            li:nth-child(2){
                    width: 90px;
                    height: 30px;
                    display: block;
                    line-height: 30px;
                    text-align: center;
                    color: #fff;
                    background-color: #F13232;
                    float: right;
                    margin-top: 7px;
                a{
                    width: 90px;
                    height: 30px;
                    display: block;
                    line-height: 30px;
                    text-align: center;
                    color: #fff;
                    background-color: #F13232;
                    float: right;
                    margin-right: 15px;
                    cursor: pointer;
                }
            }
        }
        .voucherList{
            .voucherItem{
                width: 390px;
                height: 240px;
                margin-bottom: 20px;
                float: left;
                margin-right: 15px;
                color: #999999;
                cursor: pointer;
                .common{
                    position: relative;
                    padding: 15px 30px 10px;
                    width: 390px;
                    height: 240px;
                    background-size: cover;
                    background-image: url('../../../../common/assets/img/voucher/common.png');
                    border-radius: 10px;
                    cursor: auto;
                    /*&:hover {
                      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                      margin-top: -5px;
                      transition: box-shadow 1s ease, margin-top 1s ease;
                    }*/
                    .type{
                        font-family: MicrosoftYaHei;
                        float: left;
                        margin-top: 10px;
                        .comm{
                            font-weight: bold;
                            font-size: 20px;
                            width: 150px;
                            font-size: 18px;
                            margin-bottom: 8px;
                            .el-tooltip {
                              color: #fff;
                              border-radius: 50%;
                              width: 14px;
                              height: 14px;
                              display: inline-block;
                              vertical-align: middle;
                              line-height: 14px;
                              font-size: 14px;
                              text-align: center;
                              background-color: #618BE5;
                            }
                        }
                        .explain{
                            font-size: 12px;
                            width: 100px;
                        }
                    }
                    .orange{
                        color: #FF8B00;
                    }
                    .blue{
                        color: #618BE5;
                    }
                    .orangeBg{
                        background: #FF8B00;
                    }
                    .blueBg{
                        background: #618BE5;
                    }
                    .money{
                        float: right;
                        height: 52px;
                        font-size: 60px;
                        font-size: 0px;
                        /*margin: 10px 0 0 0;*/
                        position: absolute;
                        top: 30px;
                        right: 30px;
                        text-align: right;
                        .orangeNum{
                            float: right;
                            color: #FF8B00;
                            font-weight: 900;
                        }
                        .orangeIcon{
                            float: right;
                        }
                        .blueNum{
                            float: right;
                            color: #618BE5;
                            font-weight: 900;
                        }
                        .blueIcon{
                            float: right;
                        }
                    }
                    .text{
                        font-size:12px;
                        position: absolute;
                        top: 50%;
                        right: 30px;
                        .manjian{
                            text-align: right;
                        }
                        .time{
                            text-align: right;
                        }
                    }
                    .commonBtn{
                        position: absolute;
                        top: 78%;
                        left: 95px;
                        width:200px;
                        height:40px;
                        line-height: 40px;
                        border-radius:4px;
                        color: #FFFFFF;
                        display: block;
                        text-align: center;
                        font-weight: bold;
                        font-size: 16px;
                        cursor: pointer;
                    }
                    .hasBtn{
                        position: absolute;
                        top: 78%;
                        left: 95px;
                        width:200px;
                        height:40px;
                        line-height: 40px;
                        border-radius:4px;
                        color: #FFFFFF;
                        display: block;
                        text-align: center;
                        font-weight: bold;
                        font-size: 16px;
                        background: #DCDCDC;
                    }
                }
            }
        }
        .noneVoucher{
            img{
                margin: 0 auto;
                display: block;
            }
            p{
                text-align: center;
                color: #666666;
                font-size: 14px;
            }
        }
    }

    /* 数字 start */
    .number {
      height: 52px;
      display: inline-block;
      vertical-align: middle;
    }
    .orange {
      .yuan {
        background-position: -4px -4px;
        width: 25px;
      }
      .one {
        background-position: -37px -4px;
        width: 28px;
      }
      .two {
        background-position: -71px -4px;
        width: 40px;
      }
      .three {
        background-position: -111px -4px;
        width: 39px;
      }
      .four {
        background-position: -150px -4px;
        width: 41px;
      }
      .five {
        background-position: -192px -4px;
        width: 39px;
      }
      .six {
        background-position: -232px -4px;
        width: 40px;
      }
      .seven {
        background-position: -271px -4px;
        width: 40px;
      }
      .eight {
        background-position: -310px -4px;
        width: 41px;
      }
      .nine {
        background-position: -351px -4px;
        width: 40px;
      }
      .zero {
        background-position: -390px -4px;
        width: 43px;
      }
    }
    .blue {
      .yuan {
        background-position: -4px -72px;
        width: 25px;
      }
      .one {
        background-position: -37px -72px;
        width: 28px;
      }
      .two {
        background-position: -71px -72px;
        width: 40px;
      }
      .three {
        background-position: -111px -72px;
        width: 39px;
      }
      .four {
        background-position: -150px -72px;
        width: 41px;
      }
      .five {
        background-position: -192px -72px;
        width: 39px;
      }
      .six {
        background-position: -232px -72px;
        width: 40px;
      }
      .seven {
        background-position: -271px -72px;
        width: 40px;
      }
      .eight {
        background-position: -310px -72px;
        width: 41px;
      }
      .nine {
        background-position: -351px -72px;
        width: 40px;
      }
      .zero {
        background-position: -390px -72px;
        width: 43px;
      }
    }
    .grey {
      .yuan {
        background-position: -4px -139px;
        width: 25px;
      }
      .one {
        background-position: -37px -139px;
        width: 28px;
      }
      .two {
        background-position: -71px -139px;
        width: 40px;
      }
      .three {
        background-position: -111px -139px;
        width: 39px;
      }
      .four {
        background-position: -150px -139px;
        width: 41px;
      }
      .five {
        background-position: -192px -139px;
        width: 39px;
      }
      .six {
        background-position: -232px -139px;
        width: 40px;
      }
      .seven {
        background-position: -271px -139px;
        width: 40px;
      }
      .eight {
        background-position: -310px -139px;
        width: 41px;
      }
      .nine {
        background-position: -351px -139px;
        width: 40px;
      }
      .zero {
        background-position: -390px -139px;
        width: 43px;
      }
    }
    /* 数字 end */
</style>