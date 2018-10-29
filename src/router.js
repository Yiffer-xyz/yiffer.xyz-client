import Vue from 'vue'
import Router from 'vue-router'
import ComicList from './components/ComicList.vue'
import Comic from './components/Comic.vue'
import About from './components/About.vue'
import Artist from './components/Artist.vue'
import Admin from './components/Admin.vue'
import NewPassword from './components/NewPassword.vue'

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
			path: '/artist/:artistName',
			name: 'artist',
			component: Artist
		},
		{
			path: '/newPassword',
			name: 'newPassword',
			component: NewPassword
		},
		{
			path: '/admin',
			name: 'admin',
			component: Admin
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
