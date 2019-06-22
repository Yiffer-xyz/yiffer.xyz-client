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
		comicForVotingModal: {},
	},

	actions: {
		storeClickedComic (context, comic) {
			context.commit('setClickedComic', comic)
			context.commit('setComicForVotingModal', comic)
		}
	},

  mutations: {
		setDarkTheme (state, isDarkTheme) { state.darkTheme = isDarkTheme },
		setClickedComic (state, comic) { state.clickedComic = comic },
		setLoginModalVisibility (state, isVisible) { state.loginModalVisibility = isVisible; },
		setLoginModalContext (state, context) { state.loginModalContext = context; },
		setVotingModalVisibility (state, isVisible) { state.votingModalVisibility = isVisible; },
		setComicForVotingModal (state, comic) { state.comicForVotingModal = comic },
	},

	getters: {
		loginModalContext: state => state.loginModalContext,
		getLoginModalVisibility: state => () => state.loginModalVisibility,
		comicForVotingModal: state => state.comicForVotingModal,
		getComicForVotingModal: state => () => state.comicForVotingModal,
	}
})
