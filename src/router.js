import Vue from 'vue'
import store from '@/store.js'
import Router from 'vue-router'

import ComicList from '@/pages/ComicList.vue'
import Comic from '@/pages/comic/Comic.vue'
import Artist from '@/pages/Artist.vue'

const Support = () => import('@/pages/Support.vue')
const Feedback = () => import('@/pages/Feedback.vue')
const Account = () => import('@/pages/account/Account.vue')
const About = () => import('@/pages/About.vue')
const SuggestComic = () => import('@/pages/SuggestComic.vue')
const Blog = () => import('@/pages/Blogs.vue')
const JoinUs = () => import('@/pages/JoinUs.vue')
const JoinUsApply = () => import('@/pages/JoinUsApply.vue')
const ResetPassword = () => import('@/pages/ResetPassword.vue')

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

async function rerouteIfLoggedIn(to, from, next) {
  try {
    let isLoggedIn = await store.dispatch('checkAndSetLoginStatus')
    if (!isLoggedIn) {
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
      meta: {
        reloadOnLogin: true,
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/artist/:artistName',
      name: 'artist',
      component: Artist,
    },
    {
      path: '/support',
      name: 'support',
      component: Support,
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      beforeEnter: rerouteIfNotLoggedIn,
      meta: {
        redirectOnLogout: true,
      }
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
      component: JoinUsApply,
      beforeEnter: rerouteIfNotLoggedIn,
      meta: {
        redirectOnLogout: true,
      }
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
      path: '/join-us',
      name: 'moderating',
      component: Blog,
    },
    {
      path: '/reset-password-link/:token',
      name: 'resetPassword',
      component: ResetPassword,
      beforeEnter: rerouteIfLoggedIn,
    },
    {
      path: '/:comicName',
      name: 'comic',
      component: Comic,
      meta: {
        reloadOnLogin: true,
      }
    },
  ],
  scrollBehavior ( to, from, savedPosition ) {
    if (to.path === '/' && from.path === '/') { return }
    if (to.path.includes('blog') && from.path.includes('blog')) { return }
    if ( savedPosition ) { return savedPosition }
    else { return {x: 0, y: 0} }
  }
})
