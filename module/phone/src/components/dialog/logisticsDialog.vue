<template>
	<div v-if="showLogistics">
		<account-model
			:title="'订单跟踪'"
			:hasFooter="false"
			@closeModel="closeModel"
		>
			<div class="logistics-content" slot="content">
				<account-nav
			      :type="'tab'"
			      :tabValue="logicticsTabs"
			      :slipper="true"
			      :mainStyles="{'font-size':'12px','padding':'0','line-height': '30px'}"
			      @tabClick="getLogictics"
			    ></account-nav>
			    <div class="logistics-loading">
				    <div v-if="expressData && expressData != -1 && expressData != -2 || logistics.length == 0">
					    <div class="logi-info">
							<div>
								<p v-if="logistics.length !== 0" class="title">货物运品：</p>
                <p class="text">
                  <span v-for="(good, index) in expressData.send_name" :key="good.id">{{good.name}} *{{good.count}}<em v-if="index < (expressData.send_name.length - 1)">，</em></span>
                </p>
							</div>
							<div>
								<p class="title" v-if="logistics.length !== 0">快递公司：</p>
								<p class="text">{{expressData.express_company_name}}</p>
							</div>
							<div>
								<p class="title" v-if="logistics.length !== 0">快递单号：</p>
								<p class="text">{{expressData.expressNum}}</p>
							</div>
							<div v-if="expressData.address">
								<p class="title">配送地址：</p>
								<p class="text">{{expressData.address}}</p>
							</div>
					    </div>
						<div class="logi-timeline">
							<ul class="logi-timeline-content" v-if="expressData.trace && expressData.trace.length > 0">
								<li class="logi-timeline-item" v-for="trace in expressData.trace" :key="trace.id">
									<em class="logi-timeline-icon"></em>
									<span>{{trace.content}}</span>
									<p>{{trace.time}}</p>
								</li>
							</ul>
							<error
								:type="'blank'"
								v-if="!expressData.trace || expressData.trace.length <= 0 || logistics.length == 0"
								:warning="'暂时没有物流信息'"
							></error>
						</div>
					</div>
					<error v-if="expressData == -2" :warning="warning"></error>
				</div>
			</div>
		</account-model>
	</div>
</template>

<script>
import axios from 'axios'
import { Loading } from 'element-ui'
import accountModel from '@/components/sub/accountModel.vue'
import accountNav from '@/components/sub/accountNav.vue'
import error from '@/components/sub/error.vue'
export default {
	components: {
		accountModel,
		accountNav,
		error
	},
	data () {
		return {
			logicticsTabs: [],
			expressData: -1,
			warning: '请求失败,请重试......',
			loadFlag: false,
			loadingInstance: null,
			loadingTimer: null,
			cardId: ''
		}
	},
	props: {
	    showLogistics: {
	    	type: Boolean,
	    	default: false
	    },
	    orderId: {
	    	type: String, // 订单号
	    	default: ''
		},
	    logistics: {
	    	type: Array, // 物流公司
			required: true,
	    	default: function () {
				return [{
					firmId: '',
					expressId: ''
				}] || [{
					orderNum: '',
					logisticsCompany: '',
					logisticsNo: ''
				}]
	    	}
		}
	},
	watch: {
		// 物流tab标题
		logistics () {
			this.logicticsTabs = []
			console.log('llllll33333', this.logistics)
			this.logistics.forEach((item, index) => {
				this.logicticsTabs.push('包裹' + (++index))
			})
		},
		loadFlag: function () {
	    if (!this.loadFlag && this.loadingInstance) {
        this.loadingInstance.close()
        this.loadingInstance = null
	    }
	  }
	},
	methods: {
		// 获取物流信息
		getLogictics (index) {
			console.log(index)
			this.loading('.logistics-loading')
			let url = '/MyInfoData/ajaxGetExpress'
			console.log('+++', this.logistics[index])
			if (!this.logistics[index]) {
				this.loadingInstance.close()
				return
			}
			axios.post(url, {
				orderNum: this.orderId || this.logistics[index].orderNum,
				logisticsCompany: this.logistics[index].firmId || this.logistics[index].logisticsCompany, 
				logisticsNo: this.logistics[index].expressId || this.logistics[index].logisticsNo
			})
		    .then((res) => {
		      this.loadFlag = false
		      if (res.status == 1) {
		    	  this.expressData = res.data
		      } else {
  		    	this.warning = res.data
  		    	this.expressData = -2
  		    }
		    })
		    .catch(() => {
	   			this.loadFlag = false
				this.expressData = -2
				console.log('获取物流 error')
		    })
		},

		closeModel () {
			this.expressData = ''
			this.$emit('closeLogisticsDialog')
		},

		loading (selector) {	
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
	  }
	}
}
</script>

<style lang='less' scoped>
	.logistics-loading{
		min-height: 260px;
	}
	.logistics-content{
		.logi-info{
			font-size: 12px;
			margin: 15px 0 5px 0;
      &>div {
        margin-bottom: 5px;
      }
      .title{
        float: left;
      }
      .text{
        margin-left: 60px;
      }
		}
	}
	.logi-timeline{
		max-height: 260px;
	    font-size: 12px;
	    overflow: hidden;
	    position: relative;
	    color: #6e6e6e;
		  background-color: #fff;
	    z-index: 1;
	    margin-bottom: 15px;
	    overflow-y: auto;
		.logi-timeline-content{
			margin-left: 7px;
    		border-left: 1px solid #DCDCDC;
			.logi-timeline-item{
				position: relative;
				padding: 6px 0;
			    margin-left: 20px;
			    position: relative;
				&:after{
					content: "";
				    position: absolute;
				    bottom: 0;
				    left: 0;
				    width: 100%;
				    -webkit-transform: scaleY(.5);
				    transform: scaleY(.5);
				    -webkit-transform-origin: 0 0;
				    transform-origin: 0 0;
				    z-index: 0;
				}
				&:first-child{
					margin-top: 16px;
				    padding-top: 0;
				    color: #333333;
				    font-weight: bolder;
				    &:before{
						content: "";
					    width: 16px;
					    height: 16px;
					    position: absolute;
					    top: 0;
					    left: -28px;
					    background-color: #fbbfbf;
					    border-radius: 99px;
					    z-index: 0;
					}
				    &>.logi-timeline-icon{
					    width: 10px;
					    height: 10px;
					    top: 3px;
						background-color: #f23030;
				    	border: none;
					}
				}
				&:last-child{
					&:after{
						content: "";
					    width: 4px;
					    height: 113%;
					    position: absolute;
					    top: 26px;
					    left: -22px;
					    background-color: #ffffff;
					    z-index: 0;
					}
				}
				&>p{
					height: 20px;
					line-height: 20px;
				}
				.logi-timeline-icon{
					width: 12px;
				    height: 12px;
				    content: "";
				    position: absolute;
				    z-index: 1;
				    left: -20px;
				    display: block;
				    top: 14px;
				    -webkit-transform: translate(-50%);
				    transform: translate(-50%);
				    border: solid 3px #ffffff;
				    border-radius: 99px;
				    background-color: #e4e5e9;
				}

			}
		}
	}
</style>
