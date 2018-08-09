<template>
	<div>
		<account-model
			:title="'修改地址'"
			:hasFooter="false"
			@closeModel="closeModel"
      v-if="showAddress"
		>
			<div class="address-content" slot="content">
				<div class="address">
					<div class="block">
						<span class="title">收货人</span>
						<input type="text" class="" v-model="addressData.name" @focus="clearErrorMsg">
						<span class="desc">请准确填写真实姓名</span>
					</div>
					<div class="block">
						<span class="title">所在地区</span>
						<account-area
							ref="accountArea"
							:areaOptions="areaOptions"
							:areaStyles="{'width': '260px', 'margin': '0 10px'}"
							@areaChange="areaChange"
						></account-area>
					</div>
					<div class="block">
						<span class="title">详细地址</span>
						<input type="text" class="" v-model="addressData.recipient_adds" @focus="clearErrorMsg">
						<span class="desc">请填写详细路名及门牌号</span>
					</div>
					<div class="block">
						<span class="title">手机号码</span>
						<input type="text" class="" v-model="addressData.phone" @focus="clearErrorMsg">
						<span class="desc">用于接收发货通知短信和送货前通知</span>
					</div>
					<div class="oprate">
						<button class="btn" @click="saveAddress(cardId)">保存收货人信息</button>
            <span class="errorMsg">{{errorMsg}}</span>
					</div>
				</div>
				<div class="all-address" v-if="showAll">
					<p class="title">
						<span @click="addressToggle">展开全部地址
							<i :class="showDetail ? 'el-icon-arrow-down el-icon--down active' : 'el-icon-arrow-down el-icon--down'"></i>
						</span>
					</p>
					<transition name="slider">
						<div v-show="showDetail">
							<div class="all-address-detail" v-if="allAddressData && allAddressData.length > 0">
								<p class="lists" v-for="(address, index) in allAddressData">
									<span>{{address.name}}</span>
									<span>{{address.province_name}} {{address.city_name}} {{address.county_name}} {{address.detail}}</span>
									<span>{{address.phone}}</span>
									<span class="oprate"><button @click="changeAddress(index)">选择此地址</button></span>
								</p>
							</div>
							<error :type="'fail'" v-if="allAddressData == -2" :warning="warning"></error>
							<error :type="'blank'" v-if="!!allAddressData && allAddressData !=-1 && allAddressData != -2 && allAddressData.length == 0" :warning="'您还没有地址信息哦'"></error>
						</div>
					</transition>
				</div>
			</div>
		</account-model>
    <account-model
      :hasFooter="false"
      :content="alertContent"
      :maskStyles="{'z-index': '502'}"
      :modelStyles="{'width': '300px','z-index': '503'}"
      :titleStyles="{'height': '40px', 'line-height': '40px'}"
      @closeModel="closeAlertModel"
      v-show="alertModel"
    >
    </account-model>
	</div>
</template>

<script>
import axios from 'axios'
import accountModel from '@/components/sub/accountModel.vue'
import accountArea from '@/components/sub/accountArea.vue'
import error from '@/components/sub/error.vue'
import areaData from '~common/util/areadata.js'
import {oneOf} from '~common/util/assist.js'
import {Validator} from '~common/util/Validator.js'
export default {
	components: {
		accountModel,
		accountArea,
		error
	},
	data () {
		return {
			areaOptions: areaData, // 加载省市区数据
			addressData: {
				name: '',
				phone: '',
				province_id: -1,
				province_name: '',
				city_id: -1,
				city_name: '',
				county_id: -1,
				county_name: '',
				recipient_adds: ''
			},
      alertModel: false, // 提示框
      alertContent: '',
			allAddressData: -1, // 全部地址的数据，-1-未请求，-2-请求失败，[]/''-请求数据为空
			showAll: true,
			showDetail: false,
			warning: '请求失败,请重试......',
			errorMsg: '',
			cardId: ''
		}
	},
	props: {
		type: { // add: 添加地址 edit: 修改地址
			default: 'add',
			validator: function (value) {
		    	return oneOf(value, ['add', 'edit'])
		    }
	    },
	    showAddress: {
	    	type: Boolean,
	    	default: false
	    },
	    editData: {
	    	type: Object,
	    	default: function () {
				return null
			}
			},
			// cardId: {
	    // 	type: String,
	    // 	default: function () {
			// 	return null
			// 	}
			// },
	    sourceType: { // 默认1，一般订单传1；兑换卡订单传2
	    	type: String,
	    	default: '1'
	    }
	},
  mounted () {
    this.$nextTick(() => {
      this.clearErrorMsg()
    })
  },
	methods: {
		// 修改地址
		addressEdit (cardId) {
			this.cardId = cardId
			if (this.type == 'edit') {
	    		if (!this.editData) {
	    			throw new Error('Whoops! Missing required prop : "editData" found in addressDialog.vue')
	    		} else {
	    			let url = '/MyInfoData/ajaxGetPackageAdd'
	    			axios.post(url, {
	    				orderNum: this.editData.orderId || cardId,
              sourceType: this.sourceType
	    			})
				    .then((res) => {
				      if (res.status == 1) {
				      	this.addressData = res.data

				      	// 设置默认省市区级联值；
				      	this.$refs.accountArea.setOptions([this.addressData.province_id, this.addressData.city_id, this.addressData.county_id])
				      } else {
				      	console.log(res.data)
				      }
				    })
				    .catch(() => {
				      console.log('获取默认编辑地址 error')
				    })
	    		}
	    	}
		},

		// 展开全部地址toggle
		addressToggle () {
			let url = '/MyInfoData/ajaxStuAdds'
			this.showDetail = !this.showDetail
			if (!this.showDetail) return
			if (this.allAddressData != -1) return
		    axios.post(url)
		    .then((res) => {
		      if (res.status == 1) {
		        this.allAddressData = res.data
		      } else {
		      	this.warning = res.data
		      	this.allAddressData = -2
		      }
		    })
		    .catch(() => {
		   	  this.allAddressData = -2
		      console.log('展开全部地址 error')
		    })
		},

		// 保存地址
		saveAddress () {
			let url = '/MyInfoData/saveNewSendInfosAdds'
      let errorMsg = this.validataFunc()
      if (errorMsg) {
        this.errorMsg = errorMsg
        return
      }
	    axios.post(url, {
	    	orderNum: this.editData.orderId || this.cardId,
        sourceType: this.sourceType,
	    	name: this.addressData.name,
	    	phone: this.addressData.phone,
	    	provinceId: this.addressData.province_id,
	    	provinceName: this.addressData.province_name,
	    	cityId: this.addressData.city_id,
	    	cityName: this.addressData.city_name,
	    	countyId: this.addressData.county_id,
	    	countyName: this.addressData.county_name,
	    	recipientAdds: this.addressData.recipient_adds
	    })
			.then((res) => {
			  if (res.status == 1) {
			  	this.$emit('closeAddressDialog', this.addressData)
          this.alertContent = '保存成功~'
          this.alertModel = true
			  } else {
          this.alertContent = res.data
          this.alertModel = true
			  }
			})
			.catch(() => {
        this.alertContent = '保存地址失败，请稍后重试~'
        this.alertModel = true
			})
		},

    // 错误验证
    validataFunc () {
      let validator = new Validator()
      validator.add(this.addressData.name, 'isNonEmpty', '用户名不能为空')
      validator.add(this.addressData.county_name, 'isNonEmpty', '所在地区选择不正确')
      validator.add(this.addressData.recipient_adds, 'isNonEmpty', '详细地址不能为空')
      validator.add(this.addressData.phone, 'isNonEmpty', '手机号码不能为空')
      validator.add(this.addressData.phone, 'isMobile', '手机号码格式不正确')
      let errorMsg = validator.start()
      return errorMsg
    },

    // 清除错误提示
    clearErrorMsg () {
      this.errorMsg = ''
    },

		// 选择此地址
		changeAddress (index) {
			let url = '/MyInfoData/saveSendInfosAddsById'
	    	axios.post(url, {
	    		orderNum: this.editData.orderId || this.cardId,
          sourceType: this.sourceType,
	    		addId: this.allAddressData[index].id
	    	})
			.then((res) => {
			  if (res.status == 1) {
          this.alertContent = '选择地址成功~'
          this.addressData = this.allAddressData[index]
          this.$emit('closeAddressDialog', this.addressData)
          this.alertModel = true
			  } else {
          this.alertContent = res.data
          this.alertModel = true
			  }
			})
			.catch(() => {
        this.alertContent = '选择此地址失败，请稍后重试~'
        this.alertModel = true
			})
		},

		/**
		* 省市区级联 change事件
		* @ids，数组，改变后的省市区id；
		* @values，数组，改变后的省市区对应值
		*/
		areaChange (ids, values) {
      this.clearErrorMsg()
			this.addressData.province_id = ids[0]
			this.addressData.city_id = ids[1]
			this.addressData.county_id = ids[2]
			this.addressData.province_name = values[0]
			this.addressData.city_name = values[1]
			this.addressData.county_name = values[2]
		},

		closeModel () {
			this.clearErrorMsg()
			this.showDetail = false
			this.$emit('closeAddressDialog', false)
		},

    closeAlertModel () {
      this.alertModel = false
    }
	}
}
</script>

<style lang='less' scoped>
	.address-content{
    .errorMsg{
      display: inline-block;
      margin-left: 5px;
      color: #F13232;
    }
		.address{
			.block{
				margin: 15px;
				font-size: 12px;
				color: #666666;
				text-align: left;
				&>span{
					display: inline-block;
				}
				&>input{
					width: 260px;
					height: 35px;
					line-height: 35px;
					margin: 0 10px;
					padding: 0 10px;
					border: solid 1px #E0E0E0;
					border-radius: 2px;
					color: #666666;
					outline: none;
					&::-webkit-input-placeholder {
						font-size: 12px;
						color: #A0A0A0;
				    }
				    &:-moz-placeholder {
						font-size: 12px;
						color: #A0A0A0;
				    }
				    &::-moz-placeholder {
						font-size: 12px;
						color: #A0A0A0;
				    }
				    &:-ms-input-placeholder {
						font-size: 12px;
						color: #A0A0A0;
				    }
				}
				&>input:focus{
					color: #333333;
					border-color: #F13232;
				}
				.title{
					min-width: 50px;
					text-align: right;

				}
				.desc{
					color: #666666;
				}
			}
			.oprate{
				margin-bottom: 25px;
        button{
          background: #ffffff;
        }
				.btn{
          margin-left: 18px;
					border-radius: 2px;
					border: none;
					outline: none;
					padding: 8px 15px;
					background: #F13232;
					color: #ffffff;
          cursor: pointer;
				}
			}
		}
		.all-address{
			font-size: 12px;
			padding: 20px 20px 15px 20px;
			border-top: 1px solid #E0E0E0;
			color: #666666;
			.title{
				&>span:first-child{
					cursor: pointer;
					i{
					    margin-left: 2px;
						-webkit-transition: -webkit-transform .2s;
					    transition: -webkit-transform .2s;
					    transition: transform .2s;
					    transition: transform .2s,-webkit-transform .2s;
					 	animation: rotateUp .5s reverse;
					}
					&:hover {
						color: #F13232;
					}
					.active{
						-webkit-transform: rotate(180deg);
						-moz-transform: rotate(180deg);
						-ms-transform: rotate(180deg);
						transform: rotate(180deg);
					}
				}
			}
			.lists{
				position: relative;
				margin: 10px 0;
				&:first-child{
					margin-top: 15px;
				}
				&>span{
					display: inline-block;
					vertical-align: top;
				}
				&>span:first-child{
					width: 15%;
					text-align: left;
				}
				&>span:nth-child(2){
					width: 54%;
				}
				&>span:nth-child(3){
					width: 15%;
				}
				&>span:nth-child(4){
					float: right;
					width: 11%;
					text-align: right;
				}
				button{
					border:none;
					color: #666666;
					cursor: pointer;
          background: #ffffff;
					&:hover{
						color: #F13232;
					}
				}
			}
      .all-address-detail{
        max-height: 90px;
        overflow-y: auto;
      }
		}
	}
	.slider-enter-active {
	  animation: accountSlideDownIn .5s;
	}
	.slider-leave-active {
	  animation: accountSlideDownIn .5s reverse;
	}
	@keyframes accountSlideDownIn {
	    0% {
	        opacity: 0;
	        transform-origin: 0 0;
	        transform: scaleY(.8);
	    }
	    100% {
	        opacity: 1;
	        transform-origin: 0 0;
	        transform: scaleY(1);
	    }
	}
	.rotate-enter-active {
	  animation: rotateUp .5s;
	}
	.rotate-leave-active {
	  animation: rotateUp .5s reverse;
	}
	@keyframes rotateUp {
		0% {
	        -webkit-transform: rotate(0);
			-moz-transform: rotate(0);
			-ms-transform: rotate(0);
			transform: rotate(0);
	    }
	    100% {
	        -webkit-transform: rotate(180deg);
			-moz-transform: rotate(180deg);
			-ms-transform: rotate(180deg);
			transform: rotate(180deg);
	    }
	}
</style>
