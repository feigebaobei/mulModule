<template>
	<el-dialog
	  :visible='dialogVisible'
	  width="418px"
	  custom-class='x5home_dialog'
	  top='0'
	  :before-close="handleClose"
	  :close-on-click-modal='false'
	  >
	  <span v-text='tip'></span>
	  <span slot="footer" class="dialog-footer">
	    <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
	    <el-button type="primary" @click="handleClose">知道了</el-button>
	  </span>
	</el-dialog>
</template>

<style lang='less'>
	.el-dialog__wrapper {
		z-index: 10001 !important;
	}
	.x5home_dialog.el-dialog {
	  transform: translate3d(-50%,-50%,0);
	  position: absolute;
	  left: 50%;
	  top: 50%;
	  margin: 0;
	  padding-bottom: 10px;
	  border-radius: 2px;
	  .el-dialog__body {
	    padding: 10px 15px;
      font-size: 14px;
	  }
	  .el-dialog__footer {
	    padding: 5px 15px 0;
	  }
		.el-button {
	    background-color: #f13232;
	    border-color: #f13232;
	    border-radius: 2px;
	    padding: 9px 15px;
	    font-size: 12px;
	    &:hover {
	    	background-color: #fa4747;
	    	border-color: #fa4747;
	    }
		}
		.el-message-box__headerbtn {

		}
		.el-dialog__headerbtn{
			&:hover {
				.el-dialog__close {
					color: #f13232;
				}
			}
		}
	}
</style>

<script>
import { Dialog } from 'element-ui'
import { Button } from 'element-ui'
export default {
	data () {
		return {
			dialogVisible: false,
			tip: window.x5home_dialog_text || '网络异常，请重试。'
		}
	},
	methods: {
		handleClose (done) {
			window.x5home_dialogVisible = false
			setTimeout(() => {
				window.x5home_dialog_text = '网络异常，请重试。'
			}, 200)
			if (typeof done === 'function') done()
		}
	},
	components: {
		'el-dialog': Dialog,
		'el-button': Button
	},
	mounted () {
		let that = this
		Object.defineProperty(window, 'x5home_dialogVisible', {
		  get () {
		  	return window.x5home_errorTipVisable
		  },
		  set (newValue) {
		  	// 监听全局变量x5home_dialogVisible 发生变化时改变this.dialogVisible的值, 达到控制dialog的目的
		  	that.dialogVisible = newValue
		  	window.x5home_errorTipVisable = newValue
		  	if (newValue) document.body.style.overflow = 'hidden'
	  		else document.body.style.overflow = ''
		  }
		})
		Object.defineProperty(window, 'x5home_dialog_text', {
		  get () {
		  	return window.x5home_dialog_text_show
		  },
		  set (newValue) {
		  	// 监听全局变量x5home_dialogVisible 发生变化时改变this.dialogVisible的值, 达到控制dialog的目的
		  	that.tip = newValue
		  	window.x5home_dialog_text_show = newValue
		  }
		}) 
	}
}
</script>