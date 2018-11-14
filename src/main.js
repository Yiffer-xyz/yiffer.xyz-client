import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueHeadful from 'vue-headful'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false

Vue.component('vue-headful', VueHeadful)
Vue.use(VueCookies)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
