import Vue from 'vue'
import Vuex from 'vuex'
import comicList from './state-modules/comicListState'
import auth from './state-modules/authState'
import keywordApi from './api/keywordApi.js'

Vue.use(Vuex)
export default new Vuex.Store({
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
		keywordList: []
	},

	actions: {
		storeClickedComic (context, comic) {
			context.commit('setClickedComic', comic)
			context.commit('setComicForVotingModal', comic)
		},
		async fetchKeywordList (context) {
			let keywords = await keywordApi.getKeywordList()
			context.commit('setKeywordList', keywords)
		},
		findKeywordDataFromName (context, keywordName) {
			return context.state.keywordList.find(kw => kw.name === keywordName)
		}
	},

  mutations: {
		setDarkTheme (state, isDarkTheme) { state.darkTheme = isDarkTheme },
		setClickedComic (state, comic) { state.clickedComic = comic },
		setLoginModalVisibility (state, isVisible) { state.loginModalVisibility = isVisible; },
		setLoginModalContext (state, context) { state.loginModalContext = context; },
		setVotingModalVisibility (state, isVisible) { state.votingModalVisibility = isVisible; },
		setComicForVotingModal (state, comic) { state.comicForVotingModal = comic },
		setKeywordList (state, keywordList) { state.keywordList = keywordList },
	},

	getters: {
		loginModalContext: state => state.loginModalContext,
		getLoginModalVisibility: state => () => state.loginModalVisibility,
		comicForVotingModal: state => state.comicForVotingModal,
		getComicForVotingModal: state => () => state.comicForVotingModal,
		keywordList: state => state.keywordList,
	}
})
