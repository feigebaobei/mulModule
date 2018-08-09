<template>
	<div :class="baseline ? 'account-nav baseline' : 'account-nav'">
		<h3 v-if="typeof tabValue == 'string'">{{tabValue}}</h3>
		<ul v-if="typeof tabValue == 'object'" :style="mainStyles">
			<li
        v-for="(item, index) in tabValue"
        :key="item.id"
        @click="handleClick($event, index)"
        :class="(value == index ? 'active' + (slipper ? ' slipper': '') : '') "
        :style="liStyles"
			>{{item}}</li>
		</ul>
	</div>
</template>

<script>
import {oneOf} from '~common/util/assist.js'
export default {
	name: 'accountNav',
	data () {
		return {
			// currIndex: -1
		}
	},
	props: {
		type: { // tab: 切换按钮； text: 纯文本展示；
      validator: function (value) {
        return oneOf(value, ['tab', 'text'])
      }
    },
    tabValue: {
      type: [String, Array],
      required: true
    },
    animated: { // 是否有动画
      type: Boolean,
      default: true
    },
    baseline: { // 是否显示基线
      type: Boolean,
      default: true
    },
    slipper: { // 是否显示滑块
      type: Boolean,
      default: true
    },
    mainStyles: {
      type: Object
    },
    liStyles: {
      type: Object
    },
    value: {
      type: Number,
      default: 0
    }
	},
	mounted () {
		// this.$nextTick(() => {
    //   this.currIndex = 0
    // })
  },
	methods: {
		handleClick (event, index) {
			// this.currIndex = index
      this.$emit('tabClick', index)
      this.$emit('input', index)
    }
	}
}
</script>

<style lang='less' scoped>
  .baseline{
	border-bottom: 1px solid #E0E0E0;
  }
  .account-nav{
	margin: 0 0 10px 0;
  	h3{
  		color: #666666;
	    font-weight: normal;
	    margin: 0;
	    line-height: 50px;
	    padding: 0 20px;
	    font-size: 16px;
  	}
  	&>ul{
  		line-height: 50px;
	    padding: 0 20px;
	    font-size: 16px;
    	color: #666666;
	    li{
	    	&:hover{
	    		color: #f13232;
	    	}
	    	display: inline-block;
	    	position: relative;
	    	padding: 0 5px;
    		margin-right: 30px;
    		cursor: pointer;
	    }
	    .slipper{
	    	&:after{
    			content: '';
    			display: block;
    			width: 100%;
    			height: 2px;
    			position: absolute;
    			bottom: -1px;
    			left: 0;
    			background: #f13232;
    		}
	    }
	    .active{
	    	&:hover{
	    		color: #f13232;
	    	}
    		color: #f13232;
    		cursor: default;
    	}
  	}
  }
</style>
