<template>
    <div class="cards">
        <account-nav
        :type="'text'" 
        :tabValue="'赠课卡'"
        :slipper="false"
        ></account-nav>
        <div class="exchange-loading" style="min-height: 300px;">
            <div class="recordList" v-if="exchangeList != ''">
                <ul class="title">
                    <li class="cardInfos">卡信息</li>
                    <li class="classInfos">课程信息</li>
                    <li class="status">教材物流状态</li>
                    <li class="operate">状态和操作</li>
                </ul>
                <ul class="recordInfos" v-for="(item, index) in exchangeList" :key="item.id">
                    <li class="cardName">{{item.info.card_name}}</li>
                    <li class="cardText">
                        <ul>
                            <li>
                                <em v-if="item.info.subject_name !== ''">{{item.info.subject_name}}</em>{{item.info.course_name}}
                            </li>
                            <li>{{item.info.schooltime_name}}</li>
                            <li>授课：{{item.info.teach_name}}</li>
                        </ul>
                    </li>
                    <li class="cardTatus">
                        <ul>
                            <li v-if="item.info.has_delivered != 0">教材已发货&nbsp;*{{item.info.has_delivered}}</li>
                            <li v-if="item.info.not_delivered != 0">教材未发货&nbsp;*{{item.info.not_delivered}}</li>
                        </ul>
                    </li>
                    <li class="cardOperate">
                        <ul>
                            <li class="retreat" v-if="item.info.is_return == 1">已退课</li>
                            <li class="logisticsModel" v-if="item.info.see_express == 1" @click="showLogisticsDialog(item.express)">查看物流</li>
                            <li class="addressModel" v-if="item.info.can_modifyAddr == 1" @click="showAddressDialog(item.info.card_id)">修改地址</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div v-show="isExchangeList" class="noneRecordList">
                <img src="../../../../common/assets/img/monkey_null.png">
                <p>暂无兑换信息</p>
            </div>
        </div>
        <Pagination
        v-show="total > pageSize"
        @pageChange='pageChange'
        :total='total'
        :pageSize='pageSize'
        style="margin-bottom: 50px;"
        ></Pagination>
        <logistics-dialog
        ref="logistics"
        :showLogistics="showLogistics"
        :logistics="logistics"
        :cardId="cardId"
        :orderId="editData.orderId"
        @closeLogisticsDialog="closeLogisticsDialog"
        ></logistics-dialog>
        <address-dialog
        ref="address"
        :type="'edit'"
        :editData="editData"
        :cardId="cardId"
        :showAddress="showAddress"
        :sourceType="sourceType"
        @closeAddressDialog="closeAddressDialog"
        ></address-dialog>
    </div>
</template>

<script>
import accountNav from '@/components/sub/accountNav.vue'
import accountArea from '@/components/sub/accountArea.vue'
import areaData from '~common/util/areadata.js'
import logisticsDialog from '@/components/dialog/logisticsDialog.vue'
import addressDialog from '@/components/dialog/addressDialog.vue'
import {Loading, Tooltip} from 'element-ui'
import Pagination from '~common/components/PaginationTwo.vue'

export default {
  name: 'account',
  metaInfo: {
    title: '赠课卡兑换记录'
  },
   components: {
    accountNav, 
    accountArea,
    logisticsDialog,
    addressDialog,
    Pagination
  },
  data () {
    return {
      isExchangeList: false,
      exchangeList: [],
      showLogistics: false,
      detailData: {},
      addressData: '', // 地址信息
      showAddress: false,
      editData: {
        orderId: '', // 订单id
        courseId: '' // 课程id
      },
      logistics: [],
      ajaxStatus: -1, // 订单信息请求状态：-1-未请求，0-请求失败，1-请求成功
      warning: '请求失败,请重试......',
      loadFlag: false,
      loadingInstance: null,
      loadingTimer: null,
      sourceType: '3', // 订单类型 1-普通订单；2-兑换卡订单 3-赠课卡
      pageSize: 5,
      total: 0,
      cardId: '',
      logisticsCompany: '',
      logisticsNo: '',
      orderNum: ''
    }
  },
  methods: {
        // 显示物流弹框；  
        showLogisticsDialog (express) {
            this.showLogistics = true 
            for (let i in express) {
                let arr = {}
                arr.orderNum = express[i].order_num
                arr.logisticsNo = express[i].logistics_no
                arr.logisticsCompany = express[i].logistics_company
               this.logistics.push(arr)
            }
            this.$refs.logistics.getLogictics(0)
        },
        // 关闭物流弹框；
        closeLogisticsDialog () {
            this.showLogistics = false
             this.logistics = []
        },
        // 显示 添加／修改地址弹框
        showAddressDialog (cardId) {
            this.showAddress = true
            this.$refs.address.addressEdit(cardId)
        },
        /*
        * 地址弹框关闭
        * @address 新地址信息，只进行关闭操作 address=false
        */
        closeAddressDialog (address) {
            this.showAddress = false
            if (!address) return
            this.addressData.name = address.name
            this.addressData.phone = address.phone
            this.addressData.province_id = address.province_id
            this.addressData.province = address.province_name
            this.addressData.city_id = address.city_id
            this.addressData.city = address.city_name
            this.addressData.county_id = address.county_id
            this.addressData.region = address.county_name
            this.addressData.address = address.recipient_adds || address.detail
        },
        // 分页-获取兑换记录列表
        pageChange (page) {
            let _this = this
            _this.$http({
                method: 'post',
                url: _this.Service.StuGiftCard.getExchangeList,
                data: {
                    page: page,
                    num: 5
                }
                }).then(function (res) {
                    _this.loadFlag = false
                    clearTimeout(_this.loadingTimer)
                    if (res.status === 1) {
                        _this.exchangeList = res.data.list
                        if (_this.exchangeList.length) {
                            _this.isExchangeList = false
                        } else {
                            _this.isExchangeList = true
                        }
                         _this.total = Number(res.data.total)
                    } else {
                        _this.isExchangeList = true
                    }
                }).catch(function (err) {
                    console.log(err)
                    _this.loadFlag = false
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
 },
  mounted () {
      this.$nextTick(() => {
      this.loading('.exchange-loading')
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
  }
}
</script>

<style lang='less' scoped>
	.cards{
        .recordList{
            width: 980px;
            margin: 0 auto 10px;
            border: 1px solid #EAEAEA;
            .title{
                height: 51px;
                line-height: 51px;
                color: #666666;
                font-family: MicrosoftYaHei;
                font-size: 12px;
                padding: 0 38px;
                font-weight: Regular;
                border-top: none;
                .cardInfos{
                    width: 15%;
                    float: left;
                }
                .classInfos{
                    width: 55%;
                    float: left;
                    padding-left: 15px;
                }
                .status{
                    width: 15%;
                    float: left;
                    text-align: center;
                    padding-left: 50px;
                }
                .operate{
                    width: 15%;
                    float: left;
                    padding-left: 30px;
                    text-align: center;
                    padding-left: 50px;
                }
            }
            .recordInfos{
                font-size: 14px;
                height: 120px;
                border-top: 1px solid #EAEAEA;
                padding: 20px;
                color: #333333;
                flex-wrap: nowrap;
                display: flex;
                align-items: center;
                // line-height: 30px;
                .cardName{
                    width: 15%;
                    // float: left;
                    padding-left: 17px;
                }
                .cardText{
                    width: 55%;
                    // float: left;
                    padding-left: 30px;
                    padding-right: 20px;
                    ul{
                        line-height: 22px;
                        li:nth-child(1){
                            color: #333333;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            em{
                                border-radius: 2px;
                                background-color: #fff;
                                color: #f13232;
                                border: 1px solid #f13232;
                                width: 18px;
                                height: 18px;
                                line-height: 18px;
                                text-align: center;
                                margin-right: 3px;
                            }
                        }
                        li:nth-child(2){
                            color: #999999;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        li:nth-child(3){
                            color: #999999;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
                .cardTatus{
                    width: 15%;
                    // float: left;
                    color: #666666;
                    text-align: center;
                    padding-left: 50px;
                }
                .cardOperate{
                    width: 15%;
                    float: left;
                    cursor: pointer;
                    text-align: center;
                    padding-left: 20px;
                }
                .cardOperate ul .retreat{
                    color: #999999;
                }
                .cardOperate ul .logisticsModel:hover{
                    color: #f13232;
                }
                .cardOperate ul .addressModel:hover{
                    color: #f13232;
                }
            }
        }
        .noneRecordList{
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
</style>