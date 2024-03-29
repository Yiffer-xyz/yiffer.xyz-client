import Vue from 'vue'
import Vuex from 'vuex'
import comicList from './state-modules/comicListState'
import auth from './state-modules/authState'
import keywordApi from './api/keywordApi.js'
import { registerFetchNames, doFetch, doFetchSilent } from './utils/statefulFetch'
import miscApi from './api/miscApi'

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
      if (keywords) {
        commit('setOrderedKeywordList', keywords)
      }
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
    votingModalVisibility: state => state.votingModalVisibility,
  }
}

registerFetchNames(store, 
  {name: 'allKeywords', defaultValue: []},
  {name: 'allComics', defaultValue: []},
  {name: 'feedback', defaultValue: []},
  {name: 'myPaidImages', defaultValue: []},
  {name: 'blogs', defaultValue: []},
  {name: 'submitFeedback', defaultValue: {}},
  {name: 'modApplicationSubmit', defaultValue: {}},
  {name: 'comicSuggestionSubmit', defaultValue: {}},
  {name: 'changePasswordSubmit', defaultValue: {}},
  {name: 'addEmailSubmit', defaultValue: {}},
  {name: 'forgottenPasswordSubmit', defaultValue: {}},
  {name: 'resetPasswordSubmit', defaultValue: {}},
  {name: 'advertisingApplySubmit', defaultValue: {}},
  {name: 'fetchLogin', defaultValue: {}},
  {name: 'fetchSignup', defaultValue: {}},
  {name: 'comicProblemCategories', defaultValue: []},
  {name: 'singleComicProblemCategories', defaultValue: []},
  {name: 'submitComicProblem', defaultValue: []},
  {name: 'patreonTiers', defaultValue: []},
  {name: 'unlinkPatreonAccount', defaultValue: null},
  {name: 'syncPatreonTier', defaultValue: null},
  {name: 'updatePatreonDisplayName', defaultValue: null},
  {name: 'removePatreonDisplayName', defaultValue: null},
  {name: 'updatePatreonDisplayLink', defaultValue: null},
  {name: 'removePatreonDisplayLink', defaultValue: null},
  {name: 'updatePatreonPicture', defaultValue: null},
  {name: 'removePatreonPicture', defaultValue: null},
  {name: 'vipSupporter', defaultValue: []},
  {name: 'supporterList', defaultValue: []},
)

export default new Vuex.Store(store)
