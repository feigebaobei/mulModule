import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import Order from '@/components/Order.vue'
import OrderList from '@/components/OrderList.vue'
import OrderDetail from '@/components/OrderDetail.vue'
import OrderDrop from '@/components/OrderDrop.vue'
import OrderDropEcard from '@/components/OrderDropEcard.vue'
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
      	name: 'order'
      },
      children: [
      {
      	path: '/MyOrders', // 我的订单； ocenter
      	name: 'order',
      	component: Order,
        redirect: {
          name: 'orderList',
          params: {
            type: 0,
            page: 1
          }
        },
        children: [{
          path: 'list/:type/:page', // 订单列表； ocenter
          name: 'orderList',
          component: OrderList
        }, {
          path: 'detail', // 订单详情； ocenter
          name: 'orderDetail',
          component: OrderDetail
        }]
      }, {
      	path: '/MyOrders/drop', // 申请退课-普通订单； ocenter
      	name: 'OrderDrop',
      	component: OrderDrop
      }, {
      	path: '/MyOrders/dropEcard', // 申请退课-兑换卡订单； ocenter
      	name: 'OrderDropEcard',
      	component: OrderDropEcard
      }]
    }, {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})
