import Vue from 'vue'
import Vuex from 'vuex'
import comicList from './state-modules/comicListState'
import auth from './state-modules/authState'

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
		votingModalVisibility: false,
		whiteThemeButtons: false,
		comicForVotingModal: {},
	},

  mutations: {
		setDarkTheme (state, isDarkTheme) { state.darkTheme = isDarkTheme },
		storeClickedComic (state, comic) { state.clickedComic = comic },
		setAllKeywords (state, keywordList) { state.keywordList = keywordList },
		setLoginModalVisibility (state, isVisible) { state.loginModalVisibility = isVisible; },
		setVotingModalVisibility (state, isVisible) { state.votingModalVisibility = isVisible; },
		setWhiteThemeButtonStyle (state, isWhite) { state.whiteThemeButtons = isWhite },
		setComicForVotingModal (state, comic) { state.comicForVotingModal = comic },
	},
})
