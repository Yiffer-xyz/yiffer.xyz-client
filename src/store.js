import Vue from 'vue'
import Vuex from 'vuex'
import comicList from './state-modules/comicListState'
import auth from './state-modules/authState'
import keywordApi from './api/keywordApi.js'
import { registerFetchNames, doFetch } from './utils/statefulFetch'

Vue.use(Vuex)

const store = {
  modules: {
    comicList,
    auth
  },

  state: {
    darkTheme: false,
    clickedComic: undefined,
    loginModalVisibility: false,
    loginModalContext: 'login',
    votingModalVisibility: false,
    comicForVotingModal: {},
    orderedKeywordList: [],
    comicKeywords: {},
  },

  actions: {
    storeClickedComic (context, comic) {
      context.commit('setClickedComic', comic)
      context.commit('setComicForVotingModal', comic)
    },

    async fetchKeywordList ({commit}) {
      let keywords = await doFetch(commit, 'allKeywords', keywordApi.getKeywordList())
      commit('setOrderedKeywordList', keywords)
    },

    findKeywordDataFromName (context, keywordName) {
      return context.state.keywordList.find(kw => kw.name === keywordName)
    },
  },

  mutations: {
    setDarkTheme (state, isDarkTheme) { state.darkTheme = isDarkTheme },
    setClickedComic (state, comic) { state.clickedComic = comic },
    setLoginModalVisibility (state, isVisible) { state.loginModalVisibility = isVisible; },
    setLoginModalContext (state, context) { state.loginModalContext = context; },
    setVotingModalVisibility (state, isVisible) { state.votingModalVisibility = isVisible; },
    setComicForVotingModal (state, comic) { state.comicForVotingModal = comic },
    setOrderedKeywordList (state, keywordList) {
      keywordList.sort((a, b) => a.count > b.count ? -1 : 1)
      state.orderedKeywordList = keywordList
    },
  },

  getters: {
    loginModalContext: state => state.loginModalContext,
    getLoginModalVisibility: state => () => state.loginModalVisibility,
    comicForVotingModal: state => state.comicForVotingModal,
    getComicForVotingModal: state => () => state.comicForVotingModal,
    orderedKeywordListF: state => () => state.orderedKeywordList,
    orderedKeywordList: state => state.orderedKeywordList,
    isDarkTheme: state => state.darkTheme,
  }
}

registerFetchNames(store, 
  {name: 'allKeywords', defaultValue: []},
  {name: 'allComics', defaultValue: []},
)

export default new Vuex.Store(store)
