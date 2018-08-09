import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
// 用户中心
import SetAddress from '@/components/SetAddress.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect: {                   
      	name: 'setAddress'
      },
      children: [{ 
        path: '/setAddress', 
        name: 'setAddress',
        component: SetAddress
      }]
    }
  ]
})
