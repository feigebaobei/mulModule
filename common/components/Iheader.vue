<template>
  <section>
  	<header class="xue-mall-header-topbar">
      <div class="container">
        <div class="xue-mall-topbar-meun">
            <ul class="fr">
              <li><a target="_blank" data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=http://www.xueersi.com/' href="http://www.xueersi.com/">网校首页</a></li>
              <li><a  target="_blank" data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//www.xueersi.com/d/' href="http://www.xueersi.com/d/">客户端下载</a></li>
              <li><a data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//i.xueersi.com/MyCollects/' href="http://i.xueersi.com/MyCollects/">收藏夹</a></li>
              <li><a  target="_blank" data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//ocenter.xueersi.com/MyOrders/show/' href="//ocenter.xueersi.com/MyOrders/show/">我的订单</a></li>
              <li><a  target="_blank" data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//account.xueersi.com/MyInfos/stuShow' href="//account.xueersi.com/MyInfos/stuShow">设置</a></li>
              <li class="xue-mall-topbar-dropdown">
                  <a target='_blank' href='//account.xueersi.com/' class="xue-mall-topbar-text">
                    <!-- <img :src="userInfo.headUrl" alt=""> -->
                    {{userName}}
                   <i class='el-icon-arrow-down'></i>
                  </a>
                  <div class="xue-mall-topbar-dropdown-list">
                      <div class="xue-mall-topbar-dropdown-box xue-mall-userInfo-list">
                          <ul>
                              <!-- <li class="">
                                  <a  target="_blank" data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//ocenter.xueersi.com/ActiveGift/activeGift' href="//ocenter.xueersi.com/ActiveGift/activeGift">
                                      <span class="xue-mall-userList-style">
                                         <i class="iconfont icon-qiajihuo"></i><em>卡激活</em>
                                      </span>
                                  </a>
                              </li> -->
                              <li>
                                  <a data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-logout&targetHref=https://login.xueersi.com/newLogin/logout/' href="https://login.xueersi.com/newLogin/logout/">
                                      <span class="xue-mall-userList-style">
                                         <i class="iconfont icon-tuichu"></i><em>退出</em>
                                      </span>
                                  </a>
                              </li>
                          </ul>
                      </div>
                  </div>
              </li>
          </ul>
        </div>
      </div>
    </header>
		<nav>
			<div class="container">
				<a href='http://www.xueersi.com' class="logo">
					<img src="~common/assets/img/logo.svg" alt="">
				</a>
				<ul>
					<li :class='{active: pageType == 1}'>
						<a data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//i.xueersi.com/study/MyCourses/index' href="http://i.xueersi.com/study/MyCourses/index">学习中心</a>
					</li>
					<li :class='{active: pageType == 2}'>
						<a href="javascript:void(0)">我的试题<i class='el-icon-caret-bottom'></i></a>
						<div class="hoverStatus">
							<a data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//i.xueersi.com/WrongTestsNew' href="http://i.xueersi.com/WrongTestsNew">错题本</a>
							<!-- <a data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//i.xueersi.com/study/MyCourses/stuWrongTest' href="http://i.xueersi.com/study/MyCourses/stuWrongTest">错题本</a> -->
							<a data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//i.xueersi.com/PaperSetsNew' href="http://i.xueersi.com/PaperSetsNew">试卷集</a>
						</div>
					</li>
					<li :class='{active: pageType == 3}'><a data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//i.xueersi.com/MyLectures' href="http://i.xueersi.com/MyLectures">我的讲座</a></li>
					<li :class='{active: pageType == 4}'>
						<a href="javascript:void(0)">我的应用<i class='el-icon-caret-bottom'></i></a>
						<div class="hoverStatus">
							<!-- <a data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//i.xueersi.com/dynamic/' href="//i.xueersi.com/Dynamic/">新鲜事</a> -->
							<a data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//i.xueersi.com/GroupInfo/index' href="http://i.xueersi.com/GroupInfo/index">群资料</a>
							<a data-xeslog-params='key=xeslog-ocenter-ocenter&action=click-jump&targetHref=//i.xueersi.com/GoldShop/goldShop' href="http://i.xueersi.com/GoldShop/goldShop">金币商城</a>
						</div>
					</li>
				</ul>
			</div>
		</nav>
  </section>
</template>

<style lang='less' scoped>
	.icon-closeWrap {
		position: absolute;
		top: 0;
		left: 50%;
		margin-left: -600px;
		width: 1200px;
		z-index: 10;
		i.el-icon-close {
			cursor: pointer !important;
			transform: rotate(0);
			z-index: 20;
	    position: absolute;
	    right: 0px;
	    top: 8px;
	    font-weight: bold;
	    font-size: 14px;
	    color: #fff;
	    width: 20px;
	    text-align: center;
	    line-height: 20px;
	    height: 20px;
	    background: rgba(0, 0, 0, 0.5);
		}
	}
	.xue-mall-header-topbar {
		height: 30px;
		background: #333333;
		color: #afafaf;
		line-height: 30px;
		font-size: 12px;
		font-family: Microsoft YaHei,tahoma,arial,Hiragino Sans GB,sans-serif;
	}
	.xue-mall-topbar-meun {
		position: relative;
		z-index: 10;
		ul {
			li {
				display: inline-block;
				height: 30px;
				a {
					padding: 0 15px 0 7px;
					color: #d0d0d0;
					&:hover {
						color: #fff;
					}
				}
				.xue-mall-topbar-text {
					padding: 0 15px 0 7px;
					img {
						width: 14px;
						height: 14px;
						border-radius: 50%;
						position: relative;
						top: 4px;
					}
					.xue-mall-locate-icon {
						float: left;
						margin-right: 5px;
					}
					a {
						i {
							margin-right: 5px;
							font-size: 10px;
						}
					}
					.xue-mall-userAvatar {
						width: 15px;
						height: 15px;
						vertical-align: middle;
						margin-right: 5px;
						border-radius: 50%;
					}
				}
				&:after {
					content: "|\00a0";
					padding: 0;
				}
				&:last-child {
					&:after {
						content: "";
					}
				}
			}
			li.xue-mall-topbar-dropdown {
				width: auto;
				position: relative;
				.xue-mall-topbar-text {
					display: inline-block;
					cursor: pointer;
					border: 1px solid #333333;
					border-bottom: none;
					border-top: none;
					height: 30px;
					padding-right: 0;
				}
				&:hover {
					color: #fff;
					.xue-mall-topbar-dropdown-list {
						display: block;
					}
					.xue-mall-topbar-dropdown-list#xue-mall-locate-list {
						display: none;
					}
					.xue-mall-dropdown-icon {
						transform: rotate(180deg);
						transition: transform 0.1s ease-in 0s;
					}
				}
			}
			li.xue-mall-topbar-dropdown.active {
				color: #fff;
			}
		}
		.el-icon-arrow-down {
			width: 12px;
		}
	}
	.el-icon-arrow-down {
		transition: transform .1s;
	}
	.xue-mall-topbar-text {
		&:hover {
			.el-icon-arrow-down {
				transform: rotate(180deg);
				color: #fff;
			}
		}
	}
	.xue-mall-topbar-dropdown-list {
		display: none;
		position: absolute;
		left: 50%;
		margin-left: -54.5px;
		top: 30px;
		width: 109px;
		.xue-mall-topbar-dropdown-box {
			float: left;
			margin-top: 3px;
			position: relative;
			width: 328px;
			background: #ffffff;
			box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.05);
			z-index: 1;
			box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.05);
			border-top: none;
			padding: 10px 8px;
			border: 1px solid #f1f1f1;
			border-radius: 4px;
			&:after {
				left: 50%;
				margin-left: -11px;
				pointer-events: none;
				position: absolute;
				display: block;
				content: "";
				width: 0;
				height: 0;
				border: 11px dashed transparent;
				z-index: 1;
				border-bottom-style: solid;
				border-width: 0 11px 11px;
				top: -10px;
				border-bottom-color: #fff;
				bottom: -1px;
			}
			&:before {
				left: 50%;
				margin-left: -11px;
				pointer-events: none;
				position: absolute;
				display: block;
				content: "";
				width: 0;
				height: 0;
				border: 11px dashed transparent;
				z-index: 1;
				border-bottom-style: solid;
				border-width: 0 11px 11px;
				border-bottom-color: #e5e5e5;
				bottom: 0;
				top: -11px;
			}
			li {
				float: left;
				display: block;
				width: 52px;
				height: 25px;
				line-height: 25px;
				text-align: center;
				padding: 0;
				margin-right: 10px;
				&:after {
					content: "";
				}
				a {
					padding: 0 6px;
					color: #333;
					&:hover {
						color: #ff0020;
					}
				}
			}
			li.active {
				a {
					color: #ff0020;
				}
			}
		}
		.xue-mall-topbar-dropdown-box.xue-mall-locate-list {
			width: 266px;
		}
		.xue-mall-topbar-dropdown-box.xue-mall-triangle-left {
			&:after {
				left: 20px;
				margin-left: 0;
			}
			&:before {
				left: 20px;
				margin-left: 0;
			}
		}
		.xue-mall-topbar-dropdown-box.xue-mall-triangle-right {
			&:after {
				right: 20px;
				left: auto;
				margin-left: 0;
			}
			&:before {
				right: 20px;
				left: auto;
				margin-left: 0;
			}
		}
		.xue-mall-topbar-dropdown-box.xue-mall-visit-list {
			width: 234px;
			ul {
				border-bottom: 1px solid #e5e5e5;
				display: block;
				overflow: hidden;
				&:last-child {
					border-bottom: none;
					padding-top: 10px;
				}
				&:first-child {
					padding-bottom: 10px;
				}
			}
			li {
				width: 60px;
				text-align: left;
			}
			li.xue-mall-li-title {
				width: 100%;
				color: #333;
			}
		}
		.xue-mall-topbar-dropdown-box.xue-mall-userInfo-list {
			width: 100%;
			min-width: 70px;
			padding: 0;
			li {
				width: 100%;
				line-height: 44px;
				height: 44px;
				margin: 0;
				cursor: pointer;
				border-bottom: 1px solid #e5e5e5;
				i {
					margin-right: 8px;
					float: left;
				}
				a {
					float: left;
					width: 100%;
					padding: 0 0;
					text-align: left;
					&:hover {
						background: #f5f5f5;
						color: #333;
					}
					.xue-mall-userList-style {
						width: 61px;
						margin: 0 auto;
						display: table;
						text-align: left;
						i {
							width: 16px;
							height: 16px;
							font-size: 16px;
							position: relative;
						}
					}
				}
			}
			lilast-child {
				border-bottom: none;
			}
			li.active {
				a {
					background: #f5f5f5;
					color: #333;
				}
			}
		}
	}
	.xue-mall-topbar-dropdown-list.xue-mall-dropdown-lr {
		left: auto;
		right: 0;
	}
	.homeIndex_advertising {
		width: 100%;
		height: 80px;
		max-width: 1920px;
		margin: 0 auto;
	}
	.el-carousel__indicators {
		display: none !important;
	}
	nav {
		background: #f13232;
		width: 100%;
		height: 60px;
		.container {
			height: 100%;
			line-height: 60px;
			.logo {
				width: 132px;
				display: inline-block;
				height: 100%;
				margin-right: 12px;
				vertical-align: top;
				border:none;
				img {
					vertical-align: middle;
				}
			}
			ul {
				display: inline-block;
				height: 100%;
			}
			ul li {
				display: block;
				height: 100%;
				padding: 0 24px;
				text-align: center;
				cursor: pointer;
				font-size: 16px;
				float: left;
				position: relative;
				a {
					color: #fff;
					position: relative;
					height: 100%;
					display: block;
					i {
						width: 16px;
						height: 16px;
					}
				}
				&.active {
					background: #fff;
					a {
						color: #f13232;
					}
				}
				&:hover {
					background: #fff;
					color: #f13232;
					&>.hoverStatus {
						display: block;
					}
					&>a {
						color: #f13232;
					}
					i {
						transform: rotate(180deg);
					}
				}
				i {
					margin-left: 5px;
					transition: transform .2s;
				}
				.hoverStatus {
					display: none;
					box-shadow: 0 2px 1px 1px rgba(0, 0, 0, 0.05);
					position: absolute;
					z-index: 2;
					width: 100%;
					left: 0;
					top: 60px;
					border-radius: 2px;
					line-height: 40px;
					a {
						display: block;
						background: #fff;
						height: 40px;
						font-size: 14px;
						color: #333;
						position: relative;
						border-bottom: 1px solid #f2f2f5;
						&:last-child {
							border-bottom: none;
						}
						&:last-child::before {
							display: none;
						}
						&:hover {
							background: #f2f2f5;
						}
					}
				}
			}
		}
	}
</style>

<script>
import axios from '~common/assets/js/axios'
// import * as MockData from '../MockData/mockData.js'
// axios.defaults.baseURL = 'http://account.xueersi.com'
export default {
  name: 'iheader',
  data () {
    return {
    	userInfo: {},
    	advertising: [],
    	userName: '网校学员'
    }
  },
  props: {
  	advertShow: {
  		default: false
  	},
  	pageType: {
  		default: 1
  	}
  },
  methods: {
  	getUserInfo () { // 获取用户信息
  		let that = this
  		let url = '//account.xueersi.com/Profile/info'
  		axios.get(url)
  		.then(res => {
  			that.userInfo = res
  			that.userName = res.data.realname ? res.data.realname : '网校学员'
  			that.$emit('getUserInfo', that.userInfo)
  		})
  	},
  	closeAdvert () {
  		this.advertShow = false
  	}
  },
  mounted () {
  	this.getUserInfo()
  }
}
</script>
