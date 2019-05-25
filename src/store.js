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
		loginModalContext: 'login',
		votingModalVisibility: false,
		whiteThemeButtons: false,
		comicForVotingModal: {},
	},

	actions: {
		refreshComicForVotingModal (context) {
			let upToDateComicForVotingModal = 
				context.state.comicList.comicList.find(c => c.id===context.state.comicForVotingModal.id)
			context.commit('setComicForVotingModal', upToDateComicForVotingModal)
		}
	},

  mutations: {
		setDarkTheme (state, isDarkTheme) { state.darkTheme = isDarkTheme },
		storeClickedComic (state, comic) { state.clickedComic = comic },
		setLoginModalVisibility (state, isVisible) { state.loginModalVisibility = isVisible; },
		setLoginModalContext (state, context) { state.loginModalContext = context; },
		setVotingModalVisibility (state, isVisible) { state.votingModalVisibility = isVisible; },
		setWhiteThemeButtonStyle (state, isWhite) { state.whiteThemeButtons = isWhite },
		setComicForVotingModal (state, comic) { state.comicForVotingModal = comic },
	},

	getters: {
		loginModalContext: state => state.loginModalContext,
		getLoginModalVisibility: state => () => state.loginModalVisibility,
		comicForVotingModal: state => state.comicForVotingModal,
		getComicForVotingModal: state => () => state.comicForVotingModal,
	}
})
