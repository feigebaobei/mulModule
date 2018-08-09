<template>
	<div class="acco-area-wrapper" :style="areaStyles">
		<!-- 省市区级联 -->
		<el-cascader
			:options="areaOptions"
			v-model="selectedOptions"
			@change="handleChange">
		</el-cascader>
	</div>
</template>

<script>
export default {
	data () {
		return {
			selectedOptions: this.defaultOptions, // 当前选中值
			newOption: []
		}
	},
	props: {
		areaOptions: {
			type: Array,
			default: function () {
				return [
					{
						'value': '-1',
    			  'label': '数据加载失败'
					}
				]
			}
		},
		areaStyles: {
			type: Object
		},
		defaultOptions: { // 默认选项
			type: Array
		}
	},
	methods: {
		setNull (arr) {
			this.selectedOptions = arr
		},
		// 设置选中值
		setOptions (value) {
			this.selectedOptions = value
		},

		handleChange (value) {
			let selected = this.getCascaderObj(value, this.areaOptions)
			this.newOption = []
			for (let item of selected) {
				this.newOption.push(item.label)
			}
			// @value，数组，改变后的省市区id；@this.newOption，数组，改变后的省市区对应值
			this.$emit('areaChange', value, this.newOption)
		},

		// 获取val对应的opt值
		getCascaderObj (val, opt) {
			return val.map(function (value, index, array) {
				for (let itm of opt) {
					if (itm.value == value) {
						opt = itm.children
						return itm
					}
				}
				return null
			})
		}
	}
}
</script>

<style lang='less'>
	.acco-area-wrapper{
		display: inline-block;
		.el-cascader{
			width: 100%;
			height: 35px;
			line-height: 35px;
			border-radius: 0;
			.el-input{
				border-radius: 0;
				.el-input__inner{
					height: 35px;
					line-height: 35px;
					font-size: 12px;
					padding-left: 10px;
					border-radius: 2px;
					border: solid 1px #E0E0E0;
					color: #666666;
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
				.el-input__suffix{
					.el-input__icon{
						height: 35px;
						line-height: 35px;
						color: #666666;
					}
				}
			}
		}
		.el-cascader__label{
			font-size: 12px;
			color: #666666;
			span{
				color: #666666;
			}
		}
		.is-opened{
			.el-input{
				.el-input__inner{
					color: #333333;
					border-color: #F13232;
				}
			}
			.el-cascader__label{
				color: #333333;
				span{
					color: #333333;
				}
			}
		}
	}
	.el-cascader-menu .el-cascader-menu__item.is-active{
		color: #F13232;
	}
	.el-cascader-menu .el-cascader-menu__item{
		font-size: 12px;
	}
</style>
