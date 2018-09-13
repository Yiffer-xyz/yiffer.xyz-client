import Vue from 'vue'
import Router from 'vue-router'
import ComicList from './components/ComicList.vue'
import Comic from './components/Comic.vue'
import About from './components/About.vue'

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
			path: '/about',
			name: 'about',
			component: About
		},
		{
			path: '/:comicName',
			name: 'comic',
			component: Comic
		},
	],
	scrollBehavior ( to, from, savedPosition ) {
		if ( savedPosition ) { return savedPosition }
		else { return {x: 0, y: 0} }
	}
})
