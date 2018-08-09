import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
// 领券
import VoucherList from '@/components/VoucherList.vue'
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
      	name: 'voucherList'
      },
      children: [{
      	path: '/account/voucherList', // 领券列表；
      	name: 'voucherList',
      	component: VoucherList
      }]
    }, {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})
