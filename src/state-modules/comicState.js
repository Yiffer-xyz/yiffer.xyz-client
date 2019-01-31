import comicApi from '../api/comicApi.js';
import Vue from 'vue';

export default {
	state: {
		selectedComic: undefined,
	},

	actions: {
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
	},

	mutations: {
		setSelectedComic: (state, comicData) => state.selectedComic = comicData,
	},

	getters: {
		selectedComic: state => state.selectedComic
	}
}