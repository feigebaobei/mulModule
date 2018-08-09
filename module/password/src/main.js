// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Meta from 'vue-meta'
import 'element-ui/lib/theme-chalk/index.css'
// import '~common/assets/css/default.css'
import {
	Carousel,
	CarouselItem,
	Pagination,
	Select,
	Option,
	Radio,
	Input,
	Popover,
	Form,
	FormItem,
	Message
} from 'element-ui'
Vue.config.productionTip = false
Vue.use(Meta)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Popover)
Vue.use(Form)
Vue.use(FormItem)

Vue.prototype.$message = Message
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
