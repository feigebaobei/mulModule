import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import Profile from '@/components/Profile.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect: {
      	name: 'profile'
      },
      children: [{
      	path: '/profile', // 我的资料； account
      	name: 'profile',
      	component: Profile
      }]
    }]
})
