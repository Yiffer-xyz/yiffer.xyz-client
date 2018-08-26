import Vue from 'vue'
import Router from 'vue-router'
import ComicList from './components/ComicList.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
		{
			path: '/',
			name: 'comicList',
			component: ComicList
    },
  ]
})
