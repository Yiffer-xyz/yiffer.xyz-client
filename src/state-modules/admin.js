import adminAPI from '../api/adminApi.js'
console.log('we find admin.js')

export default {
	state: {
		comicList2: []
	},

	actions: {
		loadComicList2 ({commit}) {
			console.log('LOAD COMIC LIST CALLEFD IN ADMIN JS')
			adminAPI.getComics()
				.then( response => {
					commit('setComicList2', response)
					console.log('comic list response', response)
				})
		}
	},

	mutations: {
		setComicList2 (state, comicList) {
			state.comicList2 = comicList
		}
	},

	getters: {
		getComicList2 (state) {
			console.log('GETTING COMIC LIST FROM THE ADIMN JS')
			return state.comicList2
		}
	}
}