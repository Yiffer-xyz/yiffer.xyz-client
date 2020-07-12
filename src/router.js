import Vue from 'vue'
import Router from 'vue-router'
import ComicList from '@/pages/ComicList.vue'
import Comic from '@/pages/Comic.vue'
import About from '@/pages/About.vue'
import Artist from '@/pages/Artist.vue'
import Admin from '@/pages/Admin.vue'
import PendingComic from '@/pages/PendingComic.vue'
import Donate from '@/pages/Donate.vue'
import Account from '@/pages/Account.vue'
import SuggestComic from '@/pages/SuggestComic.vue'
import Blog from '@/pages/Blogs.vue'
import Advertising from '@/pages/Advertising.vue'

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
      path: '/blog/:id',
      name: 'blogWithId',
      component: Blog
    },
    {
      path: '/blog',
      name: 'blog',
      component: Blog
    },
    {
      path: '/advertising',
      name: 'advertising',
      component: Advertising
    },
    {
      path: '/join-us',
      name: 'moderating',
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
    if (to.path.includes('blog') && from.path.includes('blog')) { return }
    if ( savedPosition ) { return savedPosition }
    else { return {x: 0, y: 0} }
  }
})
