// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Meta from 'vue-meta'
import axios from 'axios'
// import Service from '@/service/service'
import 'element-ui/lib/theme-chalk/index.css'
// import '~common/assets/css/default.css'
import {
  Carousel,
  CarouselItem,
  Cascader,
  Pagination,
  Select,
  Option,
  Radio,
  Input,
  Popover,
  Tabs,
  TabPane,
  Checkbox,
  CheckboxGroup,
  Row,
  Col,
  Button
} from 'element-ui'
Vue.config.productionTip = false
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Meta)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Cascader)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Popover)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)

Vue.prototype.$http = axios
// Vue.prototype.Service = Service

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
