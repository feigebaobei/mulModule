import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import Bill from '@/components/Bill.vue'
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
      	name: 'bill'
      },
      children: [{
      	path: '/bill', // 我的余额； ocenter
      	name: 'bill',
      	component: Bill
      }]
    }, {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})
