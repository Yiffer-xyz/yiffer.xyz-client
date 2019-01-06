import comicApi from '../api/comicApi.js';
import Vue from 'vue';

export default {
	state: {
		selectedComic: undefined,
		comicList: []
	},

	actions: {
		loadComicList: context => {
			return new Promise (async (resolve) => {
				let response = await comicApi.getComics()
				context.commit('setComicList', response.data)
				resolve(response.data)
			})
		},

		loadSelectedComic: async (context, comicName) => {
			let response = await comicApi.getComic(comicName)
			context.commit('setSelectedComic', response.data)
		},

		rateSelectedComic: (context, rating) => {
			return new Promise( async (resolve) => {
				let rateResponse = await comicApi.rateComic(context.getters.selectedComic, rating)
				let updatedComicResponse = await comicApi.getComic(context.getters.selectedComic.name)
				context.commit('updateOneComicInList', updatedComicResponse.data)
				context.commit('setSelectedComic', updatedComicResponse.data)
				resolve(rateResponse.data)
			})
		},

		correctComic: (context, updatedComicData) => {
			return new Promise( async (resolve) => {
				let updateResponse = await comicApi.updateComic(updatedComicData)
				if (updateResponse.data.success) {
					context.commit('updateOneComicInList', updatedComicData)
				}
				resolve(updateResponse.data)
			})
		},

		addNewComic: (context, {comicData, newPagesList}) => {
			return new Promise( (resolve) => {
				// .then syntax here because uploading might fail, and we want to .catch 
				comicApi.addNewComic(comicData, newPagesList)
					.then( async (addComicResponse) => {
						if (addComicResponse.data.success) {
							await context.dispatch('loadComicList')
						}
						resolve(addComicResponse.data)
					})
					.catch( error => {
						// todo test todo
						console.log(error)
						alert(error)
					})
			})
		},

		addPagetoComic: (context, {comicData, newPagesList}) => {
			return new Promise( (resolve) => {
				comicApi.addPagesToComic(comicData, newPagesList)
					.then( async (addPagesResponse) => {
						if (addPagesResponse.data.success) {
							context.commit('updateOneComicInList', comicData)
						}
						resolve(addPagesResponse.data)
					})
					.catch( error => {
						console.log(error) // todo something
					})
			})
		}
	},

	mutations: {
		setComicList: (state, comicList) => state.comicList = comicList,
		setSelectedComic: (state, comicData) => state.selectedComic = comicData,
		updateOneComicInList: (state, newComicData) => {
			let selectedComicIndex = state.comicList.findIndex(c => c.id === newComicData.id)
			Vue.set(state.comicList, selectedComicIndex, newComicData)  // because of list caveat
		},
	},

	getters: {
		comicList: state => state.comicList,
		selectedComic: state => state.selectedComic
	}
}