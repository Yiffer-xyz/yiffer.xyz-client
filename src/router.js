import Vue from 'vue'
import Router from 'vue-router'
import ComicList from './components/ComicList.vue'
import Comic from './components/Comic.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
		{
			path: '/',
			name: 'comicList',
			component: ComicList
		},
		{
			path: '/:comicName',
			name: 'comic',
			component: Comic
		}
  ]
})
