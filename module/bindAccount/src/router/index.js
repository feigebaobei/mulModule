import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
// 用户中心
import BindAccount from '@/components/BindAccount.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect: {                   
      	name: 'bindAccount'
      },
      children: [{ 
        path: '/bindAccount', 
        name: 'bindAccount',
        component: BindAccount
      }]
    }
  ]
})
