<template>
	<div class="cards">
		<account-nav
      :type="'text'" 
      :tabValue="'收货地址'"
      :slipper="false"
      v-if="welfare !== ''"
    ></account-nav>
    <div class="editAddr" v-if="welfare !== ''">
      <p class="siteTitle"> 
        你已创建<em>&nbsp;{{addrList.length}}&nbsp;</em>个收货地址，最多可以创建<em>&nbsp;10&nbsp;</em>个
        <button @click="showAddress" v-if="addrList.length < 10 && addrList.length >= 0">新增收货地址</button>
        <button class="moreTen" v-if="addrList.length > 9" :disabled="addrList.length > 9">新增收货地址</button>
      </p>
      <div class="addrList">
        <ul>
          <li v-for="(item, index) in addrList" :key="item.id">
            <div v-if="index == 0 || showList" class="address-details">
              <p class="address-text"><span class="Consignee">{{item.name}}<img v-show="index == 0" src="../../../../common/assets/img/cards/yes.png"/></span>
              {{item.province_name}}&nbsp;&nbsp;{{item.city_name}}&nbsp;&nbsp;{{item.county_name}}&nbsp;&nbsp;{{item.detail}}&nbsp;&nbsp;
               <span class="hidePhone">{{item.phone.substr(0, 3) + '****' + item.phone.substr(7)}}</span>
              <!-- <span class="defaultAddr" v-show="index == 0">默认地址</span> -->
              </p>
              <div class="operate-box">
              <ul class="operate">
                <li class="defaultAddr" v-show="index == 0">默认地址</li>
                <li class="defaultBtn" @click="defaultAddress(item.id, index)" v-show="index !== 0">选择此地址</li>
                <li class="editBtn" @click="editAddress(item.id, item.name, item.province_name, item.city_name, item.county_name, item.detail, item.phone, index, item.province_id, item.city_id, item.county_id)">编辑</li>
                <li class="delBtn" @click="delAddress(item.id, index)">删除</li>
              </ul>
              </div>
            </div>
          </li>
        </ul>
        <span class="dropDown" @click="moreAddr" v-show="addrList.length > 0 && !showList">展开全部地址<img src="../../../../common/assets/img/cards/down.png"></span>
        <span class="dropUp" @click="rollAddr" v-show="addrList.length > 0 && showList">收起地址<img src="../../../../common/assets/img/cards/up.png"></span>
      </div>
    </div>

    <div class="addAddress" v-show="controlAddr" v-if="welfare !== ''">
      <p>新增收货地址<span @click="closeAddress"><img src="../../../../common/assets/img/cards/close.png"></span></p>
      <div class="addrForm">
        <ul>
          <li>
            <label>收货人</label>
            <input type="text" class="reciever" v-model="reciever">
          </li>
          <li>
            <label>所在地区</label>
            <account-area 
              ref="accountArea"
              :areaOptions="areaOptions"
              :areaStyles="{'width': '260px'}"
              @areaChange="areaChange"
              :defaultOptions="selectAddr">
            </account-area>
          </li>
          <li>
            <label>详细地址</label>
            <input type="text" v-model="detailAddr" maxlength="50">
          </li>
          <li>
            <label>手机号码</label>
            <input type="text" v-model="phoneNum">
          </li>
        </ul>
        <button class="save" @click="VerifyInfos">保存收货人地址</button>
      </div>
    </div>

    <div class="classList">
      <p>已选兑换课程清单</p>
      <div class="exchange">
        <ul class="head">
          <li class="time" v-if="schoolTime !== ''">上课时间</li>
          <li class="detail">课程明细</li>
          <li class="teach">教师</li>
        </ul>
        <ul class="body" v-for="(item, index) in courseList" :key="item.id">
          <li class="wrapInfo">
            <ul>
              <li class="schooltime_name" v-if="item.schooltime_name !== '' && item.schooltime_name.length >= 25">{{item.schooltime_name.substr(0,25) + '...'}}</li>
              <li class="schooltime_name" v-if="item.schooltime_name !== '' && item.schooltime_name.length < 25">{{item.schooltime_name}}</li>
              <li class="course_name"><em v-if="item.subject_name !== ''">{{item.subject_name}}</em>{{item.course_name}}</li>
              <li class="teacherName">
                <ul>
                  <li>授课:&nbsp;{{item.teacher_name}}</li>
                  <li v-if="item.counselor_name !== ''">辅导老师:&nbsp;{{item.counselor_name}}</li>
                </ul>
              </li>
            </ul>
          </li>
          <li class="wrapWel">
            <ul class="welfare" v-if="welfare !== '' && addrList !== ''">
              <li><span>福利</span></li>
              <li v-for="(item, index) in welfare" :key="item.id">{{item.gift_name}}&nbsp;|&nbsp;</li>
            </ul>
          </li>
        </ul>
      </div>
      <button class="yesBtn" @click="exchangeWelfareBtn">确认兑换</button>
    </div>

	</div>
</template>

<script>
import accountNav from '@/components/sub/accountNav.vue'
import accountArea from '@/components/sub/accountArea.vue'
import areaData from '~common/util/areadata.js'

export default {
  name: 'account',
  metaInfo: {
    title: '赠课卡兑换'
  },
   components: {
    accountNav, accountArea
  },
  data () {
    return {
      areaOptions: areaData,
      addrList: [],
      controlAddr: false,
      addressId: [],
      showList: false,
      courseList: [],
      reciever: '',
      detailAddr: '',
      phoneNum: '',
      addrId: '',
      provinceId: '',
      cityId: '',
      countryId: '',
      provinceName: '',
      cityName: '',
      countyName: '',
      welfare: '',
      idAddr: '',
      counselorName: '',
      courseId: '',
      stuGcardId: '',
      selectAddr: [],
      urlKey: '',
      btnFlag: true,
      schoolTime: ''
    }
  },
  methods: {
    // 省市级联动
    areaChange (val) {
      for (let i in val) {
        this.provinceId = val[0]
        this.cityId = val[1]
        this.countryId = val[2]
      }
    },
    // 获取地址列表
    getAddress (index) {
      let _this = this
        _this.$http({
            method: 'post',
            url: _this.Service.StuGiftCard.ajaxGetStuAdds
            }).then(function (res) {
                if (res.stat === 1) {
                     if (res.data !== '') {
                        for (let i in res.data) {
                        _this.addrList.push(res.data[i])
                        // 遍历id属性在一个接口获取用户地址id
                        _this.addressId.push(res.data[i].id)
                      }
                      // 页面加载进来选中第一个地址
                      if (res.data) {
                        _this.defaultAddress(_this.addressId[0], index)
                      }
                    }
                      // 有福利，无地址的情况
                      if (res.data === '' && _this.welfare !== '') {
                            alert('请新建地址!')
                           _this.showAddress()
                        } 
                } else {
                     alert(res.data)
                }
            }).catch(function (err) {
                console.log(err)
            })    
        },
        // 新建地址
        showAddress () {
          if (this.controlAddr == false) {
              this.controlAddr = true
          }
          this.addrId = ''
          this.reciever = ''
          this.provinceName = ''
          this.cityName = ''
          this.countyName = ''
          this.detailAddr = ''
          this.phoneNum = ''
          this.provinceId = ''
          this.cityId = ''
          this.countryId = ''
          this.$refs.accountArea.setNull([])
        },

        closeAddress () {
          if (this.controlAddr == true) {
            this.controlAddr = false
          }
        },
        // 更多地址
        moreAddr () {
          if (this.addrList.length > 1) {
            this.showList = true
          }
        },
        // 收起地址
        rollAddr () {
          if (this.addrList.length > 1) {
            this.showList = false
          }
        },
        // 默认地址Btn
        defaultAddress (id, index) {
          let _this = this
          _this.idAddr = id
          _this.$http({
            method: 'post',
            url: _this.Service.StuGiftCard.setDefaultAdds,
            data: {
              id: id
            }
            }).then(function (res) {
                if (res.stat === 1) {
                   if (index === 0) {
                     return false
                     }
                    _this.addrList.unshift(_this.addrList.splice(index, 1)[0])
                } else {
                     alert(res.data)
                }
            }).catch(function (err) {
                console.log(err)
            })      
        },
        // 编辑 地址
        editAddress (id, name, province, city, county, detail, phone, index, provinceId, cityId, countyId) {
          this.controlAddr = true
          this.addrId = id
          this.reciever = name
          this.provinceName = province
          this.cityName = city
          this.countyName = county
          this.detailAddr = detail
          this.phoneNum = phone
          this.selectAddr = [provinceId, cityId, countyId]
          this.provinceId = provinceId
          this.cityId = cityId
          this.countryId = countyId
          this.$refs.accountArea.setNull(this.selectAddr)
        },
        // 删除地址
        delAddress (id, index) {
           this.$confirm('确认删除地址?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                this.$http({
                  method: 'post',
                  url: this.Service.StuGiftCard.delStuAddress,
                  data: {
                    id: id
                  }
                }).then((res) => {
                    if (res.stat === 1) {
                          this.addrList.splice(index, 1) 
                          this.$message({
                              type: 'success',
                              message: '删除成功!'
                            })
                            this.closeAddress()
                        if (this.addrList.length < 1) {
                            alert('请新建地址!')
                           this.showAddress()
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                }) 
            }).catch((err) => {
                console.log(err)
            })       
        },
        // 验证表单信息
        VerifyInfos () {
          let _this = this
          let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
          if (!_this.phoneNum || !_this.reciever || !_this.detailAddr || !_this.provinceId || !_this.cityId || !_this.countryId) {
            _this.tipMessage('请输入完整的信息', 'error')
            return false
          }
          if (_this.reciever.length > 10) {
            _this.tipMessage('请输入10个字以内的名字', 'error')
            return false
          }
          if (!myreg.test(_this.phoneNum)) {
             _this.tipMessage('请输入正确的手机格式', 'error')
            return false
          }
          _this.saveAddress()
        },
        // 保存地址
        saveAddress () {
          let _this = this
          _this.$http({
            method: 'post',
            url: _this.Service.StuGiftCard.saveStuAdds,
            data: {
              id: _this.addrId || '',
              realname: _this.reciever,
              phone: _this.phoneNum,
              province_id: _this.provinceId,
              city_id: _this.cityId,
              country_id: _this.countryId,
              address: _this.detailAddr
            }
            }).then((res) => {
                if (res.stat === 1) {
                    // 新增地址
                  if (_this.addrId === '') {
                    let newAddr = {}
                     for (let i in res) {
                       newAddr.id = res.addId
                       newAddr.name = res.realname
                       newAddr.detail = res.detail
                       newAddr.phone = res.phone
                       newAddr.province_name = res.province
                       newAddr.city_name = res.city
                       newAddr.county_name = res.country
                       newAddr.province_id = res.province_id
                       newAddr.city_id = res.city_id
                       newAddr.county_id = res.county_id
                     }
                     _this.addrList.push(newAddr)
                     _this.controlAddr = false
                     _this.$refs.accountArea.setNull([])
                  } else {
                    // 编辑地址
                    for (let j = 0; j < _this.addrList.length; j++) {
                      if (_this.addrList[j].id === res.addId) {
                        for (let k in res) {
                          _this.addrList[j].name = res.realname
                          _this.addrList[j].detail = res.detail
                          _this.addrList[j].phone = res.phone
                          _this.addrList[j].province_name = res.province
                          _this.addrList[j].city_name = res.city
                          _this.addrList[j].county_name = res.country
                          _this.addrList[j].province_id = res.province_id
                          _this.addrList[j].city_id = res.city_id
                          _this.addrList[j].county_id = res.county_id
                          _this.$refs.accountArea.setNull([_this.addrList[j].province_id, _this.addrList[j].city_id, _this.addrList[j].county_id])
                        }
                      }
                    }
                     _this.controlAddr = false
                  }
                } else {
                     alert(res.data)
                }
            }).catch(function (err) {
                console.log(err)
            })      
        },
        // 获取福利信息
        getWelfareInfo () {
          let _this = this
          _this.$http({
              method: 'post',
              url: _this.Service.StuGiftCard.getGiveawayInfo,
              data: {
                  id: _this.$route.query.ids
              }
              }).then(function (res) {
                  if (res.stat === 1) {
                      for (let i in res.data) {
                        _this.welfare = res.data
                      }
                      _this.getAddress()
                  } else {
                       alert(res.data)
                  }
              }).catch(function (err) {
                  console.log(err)
              })      
        },
        // 获取福利信息卡的课程信息
        getCourseInfos () {
          let _this = this
          _this.$http({
              method: 'post',
              url: _this.Service.StuGiftCard.getCourseInfo,
              data: {
                  productId: _this.$route.query.ids,
                  stuGcardId: _this.$route.query.stuGcardId,
                  urlKey: _this.$route.query.urlKey
              }
              }).then(function (res) {
                  if (res.stat === 1) {
                      _this.courseList.push(res.data)
                      _this.schoolTime = res.data.schooltime_name
                      _this.courseId = res.data.course_id
                      _this.stuGcardId = res.data.stu_gcard_id
                      _this.urlKey = res.data.urlkey
                  } else {
                       alert(res.data)
                      if (res.data == '已经购买或兑换过该课程，尚未过期，不能重复兑换') {
                          _this.$router.go(-1)
                      }
                  }
              }).catch(function (err) {
                  console.log(err)
              })      
        },
        // 提示信息
        tipMessage (str, type) {
          this.$message({
              showClose: true,
              message: str,
              type: type
          })
        },
        // 确认兑换福利信息Btn
        exchangeWelfareBtn () {
          let _this = this
          if (!_this.btnFlag) {
              alert('正在提交中，请稍后。。。')
             return false
          } 
          if (_this.addrList.length === 0) {
              _this.idAddr = ''
          } else {
              _this.idAddr = _this.addrList[0].id
          }
          _this.btnFlag = false
           _this.$http({
              method: 'post',
              url: _this.Service.StuGiftCard.exchangeCourse,
              data: {
                  productId: _this.$route.query.ids,
                  stuGcardId: _this.$route.query.stuGcardId,
                  addId: _this.idAddr,
                  classId: _this.$route.query.classId,
                  urlKey: _this.urlKey
              }
              }).then(function (res) {
                  _this.btnFlag = true
                  if (res.stat === 1) { 
                      _this.$router.push({path: '/account/exchangeSuccess', query: {productId: res.data.product_id, stuGcardId: res.data.stu_gcard_id, urlKey: res.data.urlkey}})
                  } else {
                      _this.btnFlag = true
                       alert(res.data)
                  }
              }).catch(function (err) {
                  _this.btnFlag = true
                  console.log(err)
              })      
        }
 },
  mounted () {
    this.getWelfareInfo()
    this.getCourseInfos()
  }
}
</script>

<style lang='less' scoped>
	.cards{
    .editAddr{
      padding: 20px 20px 10px 20px;
      margin-top: 20px;
      .siteTitle{
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        font-family:MicrosoftYaHei;
        em{
          color: #f13232;
        }
        button{
          text-align: center;
          float: right;
          width: 100px;
          height: 34px;
          line-height: 34px;
          background-color: #f13232;
          color: #fff;
          border-radius: 3px;
          cursor: pointer;
          border: none;
        }
        .moreTen{
          text-align: center;
          float: right;
          width: 100px;
          height: 30px;
          line-height: 30px;
          background-color: #ccc;
          color: #fff;
          border-radius: 3px;
          cursor: pointer;
          border: none;
        }
      }
      .addrList{
        cursor: pointer;
        margin-top: 10px;
        ul{
          li{
            .address-details{
              position: relative;
              .address-text{
              height: 60px;
              line-height: 40px;
              padding:10px;
              box-sizing: border-box;
              font-size: 12px;
              font-family:MicrosoftYaHei;
                .hidePhone{
                  width: 100px;
                  text-align: left;
                  box-sizing: border-box;
                  height: 38px;
                  line-height: 38x;
                  margin-left: 20px;
                }
              }
              .Consignee{
                float: left;
                display: block;
                width: 160px;
                text-align: center;
                // background-color: #fff;
                box-sizing: border-box;
                height: 38px;
                line-height: 38x;
                // border: 1px solid #eee;
                margin-right: 20px;
              }
              .operate-box{
                position: relative;
                font-size: 12px;
                height: 40px;
                text-align: center;
                .operate{
                  position: absolute;
                  right: 0;
                  color: #1cadf6;
                  padding: 8px;
                .defaultBtn{
                  border: none;
                  background: none;
                }
                .defaultAddr{
                color: #fff;
                background-color: #ffbc3c;
                width: 70px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                border-radius: 2px; 
              }
                li{
                  float: left;
                  margin-left: 20px;
                  line-height: 24px;
                }
              }
              }
              &:hover{
                  background-color: #f5f5f5;
              }
            }
          }
          li:nth-child(1){
            // border: 2px solid #f13232;
            // background: #fffafa;
            p{
              // border: 2px solid #f13232;
              // background: #fffafa;
              span:nth-child(1){
                border: 2px solid #f13232;
                position: relative;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                img:nth-child(1){
                  position: absolute;
                  bottom: 0;
                  right: 0;
                  width: 30px;
                  height: 20px;
                }
              }
            }
          }
        }
        .dropDown{
          display: block;
          margin-left: 10px;
          margin-top: 10px;
          font-size: 14px;
          img{
            width: 15px;
            height: 10px;
            margin-left: 5px;
          }
        }
        .dropUp{
          display: block;
          margin-left: 10px;
          margin-top: 10px;
          font-size: 14px;
          img{
            width: 15px;
            height: 10px;
            margin-left: 5px;
          }
        }
      }
    }
    .addAddress{
          border-top: 1px solid #ccc;
          padding: 30px 20px;
          font-size: 16px;
          color: #666666;
          margin-top: 40px;
          p{
            span{
              display: block;
              float: right;
              width: 24px;
              height: 24px;
              cursor: pointer;
              img{
                width: 20px;
                height: 20px;
              }
            }
          }
          .addrForm{
            padding: 20px 30px;
            ul{
              li{
                height: 35px;
                line-height: 35px;
                margin-bottom: 30px;
                label{
                  height: 35px;
                  line-height: 35px;
                  margin-right: 20px;
                }
                input{
                  height: 35px;
                  line-height: 35px;
                  width: 260px;
                  padding-left: 15px;
                }
                select{
                  height: 35px;
                  line-height: 35px;
                  width: 118px;
                }
                .reciever{
                  margin-left: 15px;
                }
                .province{
                  width:118px;
                }
                .city{
                  width:118px;
                }
                .area{
                  width:118px;
                }
              }
            }
            .save{
              width: 100px;
              height: 35px;
              background: #f13232;
              color: #fff;
              cursor: pointer;
              border-radius: 3px;
              margin-left: 90px;
              border: none;
            }
          }
    }
    .classList{
      border-top: 1px solid #ccc;
      padding: 30px 20px;
      color: #666666;
      p{
        height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
      .exchange{
        width: 960px;
        border: 1px solid #ccc;
        margin:0 auto;
        color: #333333;
        .head{
          height: 50px;
          width: 100%;
          line-height: 50px;
          border-bottom: 1px solid #cccccc;
          background-color: #f5f5f5;
          padding-left: 20px;
          font-size:12px;
          .time{
            width: 20%;
            float: left;
          }
          .detail{
            width: 45%;
            float: left;
            padding-left: 10px;
          }
          .teach{
            width: 35%;
            float: left;
          }
        }
        .body{
          width: 100%;
          .wrapInfo{
            height: 118px;
            border-bottom: 1px solid #ccc;
            ul{
              padding: 20px;
              box-sizing: border-box;
              height: 118px;
              font-family:MicrosoftYaHei;
              .schooltime_name{
                width: 20%;
                height: 40px;
                float: left;
                font-size: 14px;
                margin-top: 20px;
                overflow: hidden;
                // text-overflow: ellipsis;
                // white-space: nowrap;
                }
              .course_name{
                width: 45%;
                float: left;
                margin-top: 20px;
                font-size:14px;
                padding-left: 10px;
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
              .teacherName{
                width: 35%;
                float: left;
                font-size: 14px;
                padding-left: 10px;
                ul{
                  height: auto;
                  padding: 0;
                  margin-top: 20px;
                  li{
                    
                  }
                }
              }
            }
          }
          .wrapWel{
            .welfare{
            clear: both;
            border-bottom: 1px solid #ccc;
            padding: 10px 20px;
            font-size: 12px;
            li{
              display: inline-block;
              span{
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
            }
          }
        } 
      }
      .yesBtn{
              width: 100px;
              height: 35px;
              background: #f13232;
              color: #fff;
              cursor: pointer;
              border-radius: 3px;
              margin: 25px 0;
              float: right;
              border: none;
      }
    }
  }
</style>