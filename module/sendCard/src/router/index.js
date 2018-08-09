import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import Address from '@/components/Address.vue'
// 赠课卡
import SendCard from '@/components/SendCard.vue'
import ActiveCard from '@/components/ActiveCard.vue'
import ClassItem from '@/components/ClassItem.vue'
import ExchangeSuccess from '@/components/ExchangeSuccess.vue'
import ExchangeRecord from '@/components/ExchangeRecord.vue'
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
      	name: 'sendCard'
      },
      children: [{ 
        path: '/account/address', 
        name: 'address',
        component: Address
      }, {
      	path: '/account/card', // 赠课卡；
      	name: 'sendCard',
      	component: SendCard 
      }, {
          path: '/account/ExchangeRecord', // 赠课卡兑换记录；
          name: 'exchangeRecord',
          component: ExchangeRecord 
        }, {
      	path: '/account/activeCard', // 赠课卡激活；
      	name: 'activeCard',
      	component: ActiveCard 
      }, { 
        path: '/account/classItem', // 赠课卡 课程项；    
      	name: 'classItem',
      	component: ClassItem 
      }, {
      	path: '/account/exchangeSuccess', // 兑换成功页面；
      	name: 'exchange',
      	component: ExchangeSuccess
      }]
    }, {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})
