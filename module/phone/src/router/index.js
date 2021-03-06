import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
// 用户中心
import SetPhone from '@/components/SetPhone.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect: {                   
      	name: 'setPhone'
      },
      children: [{ 
        path: '/setPhone', 
        name: 'setPhone',
        component: SetPhone
      }]
    }
  ]
})
