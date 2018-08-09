import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import Password from '@/components/Password.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect: {
      	name: 'password'
      },
      children: [{
      	path: '/password', // 修改密码； account
      	name: 'password',
      	component: Password
      }]
    }]
})
