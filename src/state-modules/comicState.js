import comicApi from '../api/comicApi.js';
import Vue from 'vue';

export default {
	state: {
		selectedComic: undefined,
	},

	actions: {
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
						// todo write real thing
						resolve({success: false, message: 'Comic with this BLA BLA this is error message'})
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
		setSelectedComic: (state, comicData) => state.selectedComic = comicData,
		updateOneComicInList: (state, newComicData) => {
			let selectedComicIndex = state.comicList.findIndex(c => c.id === newComicData.id)
			Vue.set(state.comicList, selectedComicIndex, newComicData)  // because of list caveat
		},
	},

	getters: {
		selectedComic: state => state.selectedComic
	}
}