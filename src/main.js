import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueHeadful from 'vue-headful'
import VueCookies from 'vue-cookies'
import "vue-material-design-icons/styles.css"

import MenuDown from "vue-material-design-icons/ChevronDown.vue"
import MenuUp from "vue-material-design-icons/ChevronUp.vue"
Vue.component("menu-down-icon", MenuDown)
Vue.component("menu-up-icon", MenuUp)

Vue.config.productionTip = false

Vue.component('vue-headful', VueHeadful)
Vue.use(VueCookies)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
