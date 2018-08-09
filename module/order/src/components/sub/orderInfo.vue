<template>
	<div class="orderInfo">
        <div class="">
            <!-- {{msg}} -->
			<ul class="ao-title">
				<li class="ao-first">订单详情</li>
				<li class="ao-second">总计</li>
				<li class="ao-third">状态</li>
				<li class="ao-fourth">操作</li>
			</ul>
			<div class="orderDetails">
				<p class="orderTitle">
					<span class="orderTime">
						2018-05-09 14:02:02 
					</span>
					<span class="orderCode">
						订单号：2018050914020238868971
					</span>
				</p>
				<ul class="orderMain">
					<li class="classInfo"></li>
					<li class="money"></li>
					<li class="status"></li>
					<li class="operate"></li>
				</ul>
			</div>
        </div>
    </div>
</template>

<script>
import { Loading } from 'element-ui'
import accountModel from '@/components/sub/accountModel.vue'
import accountNav from '@/components/sub//accountNav.vue'
import error from '@/components/sub//error.vue'
export default {
	name: 'orderInfo',
	components: {
		accountModel,
		accountNav,
		error
	},
	data () {
		return {
			
		}
	},
	props: {
	   msg: {
            type: String,
            required: true
        }
	},
	watch: {
		
	},
	methods: {
		
	}
}
</script>

<style lang='less' scoped>
	.orderInfo{
		.ao-title{
			height: 50px;
			width: 100%;
			margin-bottom: 20px;
			background-color: #fff;
			border: 1px solid #eaeaea;
			li{
				float: left;
				padding-top: 16px;
				text-align: center;
				color: #666;
				font-size: 12px;
			}
			.ao-first{
				width: 70%;
			}
			.ao-second{
				width: 10%;
			}
			.ao-third{
				width: 10%;
			}
			.ao-fourth{
				width: 10%;
			}
		}
		.orderDetails{
			border: 1px solid #eaeaea;
			color: #666666;
			.orderTitle{
				padding: 0 20px;
				font-size: 12px;
				background: #f5f5f5;
				height: 50px;
				line-height: 50px;
				.orderTime{

				}
				.orderCode{
					margin-left: 50px;
				}
			}
			.orderMain{
				.classInfo{

				}
			}
		}
	}
</style>
