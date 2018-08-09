<template>
	<div class="pull-left leftSidebar">
		<ul class="nav">
			<!-- <li class="title">资料管理</li>
			<li><router-link to='/MyInfos/stuShow'>我的资料</router-link></li>
			<li><router-link to='/MyInfos/passwordManager'>修改密码</router-link></li>
			<li><router-link to='/MyInfos/phoneManager'>修改手机号</router-link></li>
			<li><router-link to='/MyInfos/showAddressInfo'>收货地址</router-link></li>
			<li><router-link to='/MyInfos/showStuBindInfo'>第三方账户绑定</router-link></li>
			<li class="title">订单管理</li>
			<li><router-link to='/MyOrders/show'>我的订单</router-link></li>
			<li><router-link to='/MyOrders/invoice'>我的发票</router-link></li>
			<li class="title">账户管理</li>
			<li><router-link to='/MyInfos/getFinancesRecord'>我的余额</router-link></li>
			<li><router-link to='/StuCoupon/getStuCoupons'>优惠券</router-link></li> -->

			<li class="title">用户中心</li>
			<li :class="routeName(['profile'])"><a href='//account.xueersi.com/Webs/index/#/profile'>我的资料</a></li>
			<li :class="routeName(['password'])"><a href='//account.xueersi.com/Webs/pwdMgr/#/password'>修改密码</a></li>
			<!-- <li><a href='//account.xueersi.com/MyInfos/phoneManager/'>修改手机号</a></li> -->

			<!-- <li class="title">用户中心</li>
			<li><a href='//account.xueersi.com/MyInfos/stuShow/'>我的资料</a></li>
			<li><a href='//account.xueersi.com/MyInfos/passwordManager/'>修改密码</a></li> -->
			<!-- <li><a href='//account.xueersi.com/MyInfos/phoneManager/'>修改手机号</a></li>

			<li><a href='//account.xueersi.com/MyInfos/showAddressInfo/'>地址管理</a></li>
			<li><a href='//account.xueersi.com/MyInfos/showStuBindInfo'>第三方账户绑定</a></li> -->
			
			<!-- <li :class="routeName(['setPhone'])"><a href='//ocenter.xueersi.com/Ocenter/#/setPhone'>修改手机号</a></li>
			<li :class="routeName(['setAddress'])"><a href='//ocenter.xueersi.com/Ocenter/#/setAddress'>收货地址</a></li>
			<li :class="routeName(['bindAccount'])"><a href='//ocenter.xueersi.com/Ocenter/#/bindAccount'>第三方账户绑定</a></li> -->
			<li :class="routeName(['setPhone'])"><a href='//account.xueersi.com/Webs/phoneMgr/#/setPhone'>修改手机号</a></li>
			<li :class="routeName(['setAddress'])"><a href='//account.xueersi.com/Webs/addrMgr/#/setAddress'>收货地址</a></li>
			<li :class="routeName(['bindAccount'])"><a href='//account.xueersi.com/Webs/platMgr/#/bindAccount'>第三方账户绑定</a></li>
			
			<li class="title">订单中心</li>
			<li :class="routeName(['orderList', 'orderDetail', 'OrderDrop', 'OrderDropEcard'])"><a href='//ocenter.xueersi.com/MyOrders/show/#/MyOrders/list/0/1'>我的订单</a></li>
			<!-- <li><a href='//ocenter.xueersi.com/Ocenter/index/#/MyOrders/list/0/1'>我的订单</a></li> -->
			<li :class="routeName(['bill'])"><a href='//ocenter.xueersi.com/Ocenter/invoice/#/bill'>我的发票</a></li>
			<li class="title">资产中心</li>
			<!-- <li><router-link to='/MyInfos/getFinancesRecord/'>我的余额</router-link></li> -->
			<li :class="routeName(['balance'])"><a href='//ocenter.xueersi.com/Ocenter/balance/#/balance'>我的余额</a></li>
			<!-- <li><a href='//ocenter.xueersi.com/StuCoupon/getStuCoupons'>优惠券</a></li> -->
			<li :class="routeName(['coupon', 'couponActive'])"><a href='//ocenter.xueersi.com/Ocenter/myCoupon/#/coupon'>优惠券</a></li>
			<!-- <li><router-link to='/account/card'>赠课卡</router-link></li> -->
			<li :class="routeName(['sendCard', 'activeCard', 'classItem', 'exchange', 'exchangeRecord'])"><a href='//ocenter.xueersi.com/Ocenter/sendCard/#/account/card'>赠课卡</a></li>
			<!-- <li :class="routeName(['sendCard', 'activeCard', 'classItem', 'exchange', 'exchangeRecord'])"><a href='//ocenter.xueersi.com/MyInfos/getFinancesRecord/#/account/card'>赠课卡</a></li> -->
		</ul>
	</div>
</template>

<style lang='less' scoped>
	.leftSidebar {
		width: 190px;
		min-height: 630px;
		margin-right: 10px;
		background: #fff;
		.nav {
			padding: 0px 0 0 40px;
			.title {
				font-size: 16px;
			    color: #333333;
			    font-weight: bold;
			    margin-top: 20px;
			    height: 35px;
	    		line-height: 35px;
			}
			.active{
				a{
					color: #f13232;
				}
			}
			a {
			    color: #666;
	    		font-size: 14px;
	    		display: block;
	    		height: 34px;
	    		line-height: 34px;
	    		&:hover {
	    			color: #f13232;
	    		}
	    		&.router-link-active {
	    			color: #f13232;
	    		}
			}
		}
	}
</style>

<script>
export default {
	computed: {
		routePath () {
			return this.$route.path
		}
	},
	mounted () {
		window.app = this
	},
	methods: {
		// 根据路由匹配left左栏的高亮
		routeName (arr) {
			let name = this.$route.name
			for (let i = 0 , len = arr.length; i < len; i++) {
				if (arr[i] == name) {
					return 'active'
				}
			}
			return ''
		}
	}
}
</script>
