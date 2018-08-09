import Vue from 'vue'
import Router from 'vue-router'
// import index from '../pages/index.vue'
// import Coupon from '@/components/coupon.vue'
// import CouponActive from '@/components/couponActive.vue'
import couponList from '../components/couponList.vue'
import NotFound from '@/components/404.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: couponList,
      redirect: {
        name: 'couponList'
      },
      children: [
        {
          path: '/couponList', // 领取优惠券
          name: 'couponList',
          component: couponList
        }
      ]
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})
