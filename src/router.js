import Vue from 'vue'
import Router from 'vue-router'
import ComicList from './components/ComicList.vue'
import Comic from './components/Comic.vue'
import About from './components/About.vue'
import Artist from './components/Artist.vue'
import Admin from './components/Admin.vue'
import PendingComic from './components/PendingComic.vue'
import Donate from './components/Donate.vue'
import Account from './components/Account.vue'
import SuggestComic from './components/SuggestComic.vue'
import Blog from './components/Blogs.vue'

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
			path: '/admin',
			name: 'admin',
			component: Admin
		},
		{
			path: '/account',
			name: 'account',
			component: Account
		},
		{
			path: '/suggestcomic',
			name: 'suggestComic',
			component: SuggestComic
		},
		{
			path: '/donate',
			name: 'donate',
			component: Donate
		},
		{
			path: '/blog',
			name: 'blog',
			component: Blog
		},
		{
			path: '/pendingComics/:comicName',
			name: 'pendingComic',
			component: PendingComic
		},
		{
			path: '/:comicName',
			name: 'comic',
			component: Comic
		},
	],
	scrollBehavior ( to, from, savedPosition ) {
		if (to.path === '/' && from.path === '/') { return }
		if ( savedPosition ) { return savedPosition }
		else { return {x: 0, y: 0} }
	}
})
