<template>
	<div class="userInfo">
		<account-nav
      :type="'text'" 
      :tabValue="'地址管理'"
      :slipper="false"
    ></account-nav>
    <div class="editAddr">
      <p class="siteTitle"> 
        你已创建<em>&nbsp;{{addrList.length}}&nbsp;</em>个收货地址，最多可以创建<em>&nbsp;10&nbsp;</em>个
        &nbsp;&nbsp;&nbsp;&nbsp;<span>如需要修改订单配送地址，请前往【我的订单】 <a href="https://ocenter.xueersi.com/MyOrders/show">点击跳转</a></span>
        <button @click="showAddress" v-if="addrList.length < 10 && addrList.length >= 0">新增收货地址</button>
        <button class="moreTen" v-if="addrList.length > 9" :disabled="addrList.length > 9">新增收货地址</button>
      </p>
      <div class="addrList">
        <ul>
          <li v-for="(item, index) in addrList" :key="item.id">
            <p>
              <span v-bind:title="item.name" class="Consignee">{{item.name}}</span>
              <span v-bind:title="item.province_name + '  ' + item.city_name + '  ' + item.county_name + '  ' +item.detail" class="addressInfos">{{item.province_name}}&nbsp;&nbsp;{{item.city_name}}&nbsp;&nbsp;{{item.county_name}}&nbsp;&nbsp;{{item.detail}}</span>
              <span class="hidePhone">{{item.phone.substr(0, 3) + '****' + item.phone.substr(7)}}</span>
              <span class="defaultAddr" v-if="item.is_default == '1'">常用地址</span>
              <ul class="operate">
                 <li class="defaultBtn" @click="defaultAddress(item.id, index)" v-if="item.is_default == '0'">设为常用地址</li>
                <li class="editBtn" @click="editAddress(item.id, item.name, item.province_name, item.city_name, item.county_name, item.detail, item.phone, index, item.province_id, item.city_id, item.county_id)">编辑</li>
                <li class="delBtn" @click="delAddress(item.id, index)">删除</li>
              </ul>
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="addAddress" v-show="controlAddr">
      <p>新增收货地址<span @click="closeAddress"><img src="../../../../common/assets/img/cards/close.png"></span></p>
      <div class="addrForm">
        <ul>
          <li>
            <label>收货人</label>
            <input type="text" class="reciever" v-model="reciever">
            <span class="comment">请准确填写真实姓名</span>
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
            <input type="text" v-model="detailAddr">
            <span class="comment">请填写详细路名及门牌号</span>
          </li>
          <li>
            <label>手机号码</label>
            <input type="text" v-model="phoneNum">
            <span class="comment">用于接收发货通知短信和送货前通知</span>
          </li>
        </ul>
        <button class="save" @click="VerifyInfos">保存收货人地址</button>
      </div>
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
    title: '地址管理'
  },
   components: {
    accountNav, accountArea
  },
  data () {
    return {
      areaOptions: areaData,
      addrList: [],
      controlAddr: false,
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
      idAddr: '',
      selectAddr: [],
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
            url: '/Profile/addrInfos'
            }).then(function (res) {
                if (res.stat === 1) {
                     if (res.data !== '') {
                       _this.addrList = res.data.list
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
        // 默认地址Btn
        defaultAddress (id, index) {
          let _this = this
          _this.idAddr = id
          _this.$http({
            method: 'post',
            url: '/Profile/addrMod',
            data: {
              addrId: id,
              isDef: 1
            }
            }).then(function (res) {
                if (res.stat === 1) {
                     // 设置地址后更新列表
                     _this.getAddress()
                } else {
                  if (res.data == '') {

                  } else {
                    alert(res.data)
                  }
                }
            }).catch(function (err) {
                console.log(err)
            })      
        },
        // 删除地址
        delAddress (id, index) {
          let _this = this
          if (confirm('确定删除此地址？')) {
            _this.$http({
            method: 'post',
            url: '/Profile/addrRm',
            data: {
              addrId: id
            }
            }).then(function (res) {
               _this.addrList.splice(index, 1) 
               _this.closeAddress()
               _this.getAddress()  
            }).catch(function (err) {
                console.log(err)
            })      
          } else {
            return false
          }
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
        // 验证表单信息
        VerifyInfos () {
          let _this = this
          let myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
          if (!_this.phoneNum || !_this.reciever || !_this.detailAddr || !_this.provinceId || !_this.cityId || !_this.countryId) {
            alert('请输入完整的信息')
            return false
          }
          if (_this.reciever.length > 10) {
            alert('请输入10个字以内的名字') 
            return false
          }
          if (!myreg.test(_this.phoneNum)) {
            alert('请输入正确的手机格式')
            return false
          }
          _this.saveAddress()
        },
        // 保存地址
        saveAddress () {
          // 保存新增地址
          let _this = this
          _this.$http({
            method: 'post',
            url: '/Profile/addrMod',
            data: {
              addrId: _this.addrId || '',
              name: _this.reciever,
              phone: _this.phoneNum,
              proId: _this.provinceId,
              citId: _this.cityId,
              couId: _this.countryId,
              detail: _this.detailAddr
            }
            }).then(function (res) {
                if (res.stat === 1) {
                  // 新增地址
                  if (_this.addrId === '') {
                    let newAddr = {}
                     for (let i in res.data) {
                       newAddr.id = res.data.id
                       newAddr.name = res.data.name
                       newAddr.detail = res.data.detail
                       newAddr.phone = res.data.phone
                       newAddr.province_name = res.data.province_name
                       newAddr.city_name = res.data.city_name
                       newAddr.county_name = res.data.country_name
                       newAddr.province_id = res.data.province_id
                       newAddr.city_id = res.data.city_id
                       newAddr.county_id = res.data.county_id
                     }
                     _this.addrList.push(newAddr)
                     _this.controlAddr = false
                     _this.$refs.accountArea.setNull([])
                  } else {
                    // 编辑地址
                    for (let j = 0; j < _this.addrList.length; j++) {
                      if (_this.addrList[j].id === res.data.id) {
                        for (let k in res.data) {
                          _this.addrList[j].name = res.data.name
                          _this.addrList[j].detail = res.data.detail
                          _this.addrList[j].phone = res.data.phone
                          _this.addrList[j].province_name = res.data.province_name
                          _this.addrList[j].city_name = res.data.city_name
                          _this.addrList[j].county_name = res.data.county_name
                          _this.addrList[j].province_id = res.data.province_id
                          _this.addrList[j].city_id = res.data.city_id
                          _this.addrList[j].county_id = res.data.county_id
                          _this.$refs.accountArea.setNull([_this.addrList[j].province_id, _this.addrList[j].city_id, _this.addrList[j].county_id])
                        }
                      }
                    }
                     _this.controlAddr = false
                  }
                  _this.getAddress()
                } else {
                    alert(res.data)
                }
            }).catch(function (err) {
                console.log(err)
            })      
        }
 },

  mounted () {
    this.getAddress()
  }
}
</script>

<style lang='less' scoped>
.el-input{
      border-color: #cccccc !important;
    }
	.userInfo{
    .editAddr{
      padding: 20px;
      margin: 20px 0;
      .siteTitle{
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        padding: 0 10px;
        font-family:MicrosoftYaHei;
        span{
          color:#f13232;
          a{
            color:#999999;
          }
        }
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
            p{
              padding: 10px;
              height: 60px;
              line-height: 40px;
              box-sizing: border-box;
              font-size: 12px;
              font-family:MicrosoftYaHei;
              position: relative;
              .Consignee{
                float: left;
                display: block;
                width: 100px;
                text-align: left;
                box-sizing: border-box;
                height: 38px;
                line-height: 38x;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              .addressInfos{
                width: 300px;
                height: 38px;
                line-height: 38x;
                display: block;
                float: left;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              .hidePhone{
                float: left;
                display: block;
                width: 100px;
                text-align: left;
                box-sizing: border-box;
                height: 38px;
                line-height: 38x;
                margin-left: 20px;
              }
              .defaultAddr{
                position: absolute;
                top: 27%;
                right: 30%;
                color: #fff;
                background-color: #ffbc3c;
                font-size: 12px;
                display: inline-block;
                width: 70px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                border-radius: 2px; 
              }
              .operate{
                float: right;
                color: #999999;
                .defaultBtn{
                  border: none;
                  background: none;
                }
                li{
                  float: left;
                  margin-left: 20px;
                }
              }
            }
            p:hover{
              background-color: #f5f5f5;
            }
          }
          li:nth-child(1){
            p{
              span:nth-child(1){
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
        .dropDown{
          display: block;
          float: left;
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
          float: left;
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
                  color: #666666;
                }
                span{
                  color: #999999;
                  font-size: 14px;
                }
                select{
                  height: 35px;
                  line-height: 35px;
                  width: 118px;
                }
                .reciever{
                  margin-left: 15px;
                  color:#666666;
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
  }
</style>