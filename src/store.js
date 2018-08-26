import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		username: undefined,
		clickedComic: undefined,
  },
  mutations: {
		clickComic (state, comic) {
			state.clickedComic = comic
		}
  },
  actions: {}
})
