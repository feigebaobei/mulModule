<template>
	<div class="cards">
		<account-nav
      :type="'text'" 
      :tabValue="'赠课卡'"
      :slipper="false"
        ></account-nav>
        <p>
            <span><router-link to='/account/activeCard'>激活赠课卡</router-link></span>
            <span><router-link to='/account/exchangeRecord'>兑换记录</router-link></span>
        </p>
        <div class="classCards">
            <ul>
                <li v-for="(item ,index) in cardList" :key="item.id">
                    <div v-bind:class="{will:item.stu_gcard_status == '1', 'done': item.stu_gcard_status == '2', 'overdue': item.stu_gcard_status == '3'}">
                        <h2>{{item.name}}</h2>
                        <p class="explain">{{item.exchange_description}}</p>
                        <span>有效期：{{item.valid_end_date}}</span>
                        <a v-if="item.stu_gcard_status == 1" @click="judgeAllCourseInfos(item.id, item.urlkey)">兑换课程</a> 
                    </div>
                </li>
            </ul>
        </div>
	</div>
</template>

<script>

import accountNav from '@/components/sub/accountNav.vue'

export default {
  name: 'account',
  metaInfo: {
    title: '我的赠课卡'
  },

  components: {
    accountNav
  },

  data () {
    return {
        cardList: []
    }
  },

  methods: {
      getCardInfos () {
        let _this = this
        _this.$http.post(_this.Service.StuGiftCard.ajaxGetStuGiftCard)
        .then(function (res) {
            if (res.stat == 1) {
                 _this.cardList = res.data.list  
            } else {
                alert(res.data)
            }
        })
        .catch(function (error) {
            console.log(error)
        })
    },
    // 判断 data 是否跳转到下个页面
    judgeAllCourseInfos (id, urlkey) {
        let _this = this
        _this.$http({
            method: 'post',
            url: _this.Service.StuGiftCard.getAllCourseInfos,
            data: {
                stuGcardId: id,
                urlKey: urlkey
            }
            }).then(function (res) {
                if (res.stat === 1) {
                    _this.$router.push({path: '/account/classItem', query: {stuGcardId: id, urlKey: urlkey}})
                } else {
                    alert(res.data)
                    return false
                }
            }).catch(function (err) {
                console.log(err)
            })      
        }
  },

  mounted () {
      let _this = this
      _this.getCardInfos()
  }
}
</script>

<style lang='less' scoped>
.cards{
    p{
        height: 40px;
        font-size: 14px;
        color: #353434;
        span{
            display: block;
            float: right;
            height: 40px;
            line-height: 40px;
            margin-right: 40px;
        }
    }
    .classCards{
        ul{
            li{
                width: 300px;
                height: 225px; 
                float: left; 
                margin-left: 20px;
                margin-top: 20px;
                .will{
                    width: 300px;
                    height: 225px;  
                    background-size: cover;
                    float: left;
                    margin-left: 20px;
                    margin-top: 20px;
                    color:#fff;
                    text-align: center;
                    padding-top: 30px;
                    background-image: url('../../../../common/assets/img/cards/will.png');
                        h2{
                            height: 35px; 
                            width: 275px;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            font-size: 24px;
                        }
                        .explain{
                            line-height: normal;
                            color: #fff;
                            margin-top: 25px;
                            padding: 10px;
                            overflow: hidden;
                        }
                        span{
                            color: #353434;
                            font-size: 12px;
                            display: block;
                            margin-top:20px;
                        }
                        a{
                            cursor: pointer;
                            display: block;
                            background-color: #f13232;
                            width: 98px;
                            height: 32px;
                            line-height: 30px;
                            border-radius: 2px;
                            color: #fff;
                            margin: 10px auto 0;
                            font-size: 14px;
                        }
                }
                .done{
                    width: 300px;
                    height: 160px;  
                    background-size: cover;
                    float: left;
                    margin-left: 20px;
                    margin-top: 20px;
                    color:#fff;
                    text-align: center;
                    padding-top: 30px;
                    background-image: url('../../../../common/assets/img/cards/done.png');
                        h2{
                            height: 35px; 
                            width: 275px;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            font-size: 24px;
                        }
                        .explain{
                            line-height: normal;
                            color: #fff;
                            margin-top: 15px;
                            overflow: hidden;
                        }
                        span{
                            color: #353434;
                            font-size: 12px;
                            display: block;
                            margin-top: 10px;
                        }
                        a{
                            cursor: pointer;
                            display: block;
                            background-color: #f13232;
                            width: 90px;
                            height: 30px;
                            line-height: 30px;
                            border-radius: 4px;
                            color: #fff;
                            margin: 10px auto 0;
                            font-size: 14px;
                        }
                }
                .overdue{
                    width: 300px;
                    height: 160px;  
                    background-size: 300px;
                    float: left;
                    margin-left: 20px;
                    margin-top: 20px;
                    color:#fff;
                    text-align: center;
                    padding-top: 30px;
                    background-image: url('../../../../common/assets/img/cards/overdue.png');
                        h2{
                            height: 35px; 
                            width: 275px;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            font-size: 24px;
                        }
                        .explain{
                            line-height: normal;
                            color: #fff;
                            margin-top: 15px;
                            overflow: hidden;
                        }
                        span{
                            color: #353434;
                            font-size: 12px;
                            display: block;
                            margin-top: 10px;
                        }
                        a{
                            cursor: pointer;
                            display: block;
                            background-color: #f13232;
                            width: 90px;
                            height: 30px;
                            line-height: 30px;
                            border-radius: 4px;
                            color: #fff;
                            margin: 10px auto 0;
                            font-size: 14px;
                        }
                }
                
            }
            // .will{
            //     background: url('../../../../common/assets/img/cards/will.png') no-repeat 0 0;
            // }
            // .done{
            //     background: url('../../../../common/assets/img/cards/done.png') no-repeat 0 0;
            // }
            // .overdue{
            //     background: url('../../../../common/assets/img/cards/overdue.png') no-repeat 0 0;
            // }
        }
    }
}
</style>