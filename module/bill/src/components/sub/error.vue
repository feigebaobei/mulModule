<template>
	<div class="error-wrapper" :style="mainStyles">
		<div class="middle">
			<img v-if="type == 'blank'" src="~common/assets/img/monkey_null.png" alt="没有数据">
			<img v-if="type == 'fail'" src="~common/assets/img/monkey_fail.png" alt="请求失败icon">
	      	<p>{{warning}}</p>
		</div>
	</div>
</template>

<script>
import {oneOf} from '~common/util/assist.js'
export default {
	name: 'ajaxError',
	props: {
		type: { // blank: 空数据 fail: 请求失败
			default: 'fail',
			validator: function (value) {
		    	return oneOf(value, ['blank', 'fail'])
		    }
	    },
	    mainStyles: {
	    	type: Object // 自定义样式
	    },
	    warning: {
	    	default: '请求失败,请重试......'
	    }
	}
}
</script>

<style lang='less' scoped>
	.error-wrapper{
		min-height: 220px;
		position: relative;
		text-align: center;
		font-size: 14px;
		width:100%;
		box-sizing: border-box;
		margin-top:100px;
		.middle{
			position: absolute;
			top: 50%;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			-moz-transform: translate(-50%, -50%);
			-ms-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			margin:0 auto;
			color: #666666;
			&>p{
				margin-top: -15px;
			}
		}
	}
</style>
