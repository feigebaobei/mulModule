import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import Balance from '@/components/Balance.vue'
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
      	name: 'balance'
      },
      children: [{
      	path: '/balance', // 我的余额； ocenter
      	name: 'balance',
      	component: Balance
      }]
    }, {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})
