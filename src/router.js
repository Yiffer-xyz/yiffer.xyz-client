import Vue from 'vue'
import store from '@/store.js'
import Router from 'vue-router'

import ComicList from '@/pages/ComicList.vue'
import Comic from '@/pages/Comic.vue'
import About from '@/pages/About.vue'
import Feedback from '@/pages/Feedback.vue'
import SuggestComic from '@/pages/SuggestComic.vue'
import Blog from '@/pages/Blogs.vue'
import Advertising from '@/pages/Advertising.vue'
import JoinUs from '@/pages/JoinUs.vue'

Vue.use(Router)

async function rerouteIfNotLoggedIn(to, from, next) {
  try {
    let isLoggedIn = await store.dispatch('checkAndSetLoginStatus')
    if (isLoggedIn) {
      next()
    }
    else {
      next({ name: 'comicList' })
    }
  }
  catch (err) {
    next({ name: 'comicList' })
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'comicList',
      component: ComicList,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/artist/:artistName',
      name: 'artist',
      component: () => import('@/pages/Artist.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/pages/Admin.vue'),
      beforeEnter: rerouteIfNotLoggedIn,
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/pages/Account.vue'),
      beforeEnter: rerouteIfNotLoggedIn,
    },
    {
      path: '/suggestcomic',
      name: 'suggestComic',
      component: SuggestComic,
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: Feedback,
    },
    {
      path: '/join-us',
      name: 'joinUs',
      component: JoinUs,
    },
    {
      path: '/join-us-apply',
      name: 'joinUsApply',
      component: () => import('@/pages/JoinUsApply.vue'),
      beforeEnter: rerouteIfNotLoggedIn,
    },
    {
      path: '/blog/:id',
      name: 'blogWithId',
      component: Blog,
    },
    {
      path: '/blog',
      name: 'blog',
      component: Blog,
    },
    {
      path: '/advertising',
      name: 'advertising',
      component: Advertising,
    },
    {
      path: '/advertising-apply',
      name: 'apply-advertising',
      component: () => import('@/pages/AdvertisingApply.vue'),
      beforeEnter: rerouteIfNotLoggedIn,
    },
    {
      path: '/pendingComics/:comicName',
      name: 'pendingComic',
      component: () => import('@/pages/PendingComic.vue'),
      beforeEnter: rerouteIfNotLoggedIn,
    },
    {
      path: '/:comicName',
      name: 'comic',
      component: Comic,
    },
  ],
  scrollBehavior ( to, from, savedPosition ) {
    if (to.path === '/' && from.path === '/') { return }
    if (to.path.includes('blog') && from.path.includes('blog')) { return }
    if ( savedPosition ) { return savedPosition }
    else { return {x: 0, y: 0} }
  }
})
