import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import Coupon from '@/components/coupon.vue'
import CouponActive from '@/components/couponActive.vue'
import NotFound from '@/components/404.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect: {
      	name: 'coupon'
      },
      children: [{
      	path: '/coupon', // 优惠券
      	name: 'coupon',
      	component: Coupon
      }, {
        path: '/couponActive', // 优惠券激活
      	name: 'couponActive',
      	component: CouponActive
      }]
    }, {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})
