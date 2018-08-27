import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

let scrollBehavior = function ( to, from, savedPosition ) {
	if ( savedPosition ) { return savedPosition }
	else { return {x: 0, y: 0} }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
