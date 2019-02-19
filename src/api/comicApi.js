import config from '@/config.json'
import axios from 'axios'

let baseUrl = 'http://localhost:8012/api'

export default {
	async getComics () {
		let response = await axios.get(baseUrl + '/comics')
		for (var comic of response.data) {
			comic.created = new Date(comic.created)
			comic.updated = new Date(comic.updated)
		}
		return response.data
	},

	async getComic (comicName) {
		let response = await axios.get(baseUrl + '/comics/' + comicName)
		if (!response.data.error) { return {success: true, result: response.data} }
		else { return {message: 'No comic with that name'} }
	},

	async getPendingComics () {
		let response = await axios.get(baseUrl + '/pendingcomics')
		if (!response.data.error) { return response.data }
		else { return [] }
	},

	async getPendingComic (comicName) {//todo create. Wait, same as above
		let response = await axios.get(baseUrl + '/pendingComics/' + comicName)
		if (!response.data.error) { return {success: true, result: response.data} }
		else { return {success: false, message: response.data.error} }
	},

	async getSuggestedComicList () {
		return new Promise( resolve => {
			resolve(config.comicSuggestionList)
		})
	},

	// bare sett de tingene som kan bli satt. Antar at ved success: true, s[ stemmer det sendte inn
	async updateComic (updatedComicData) {
		return new Promise(resolve => {
			resolve({'success': true, 'message': 'asd'})
		})
	},

	async addNewComic (comicData, {pageFiles, thumbnailFile}, progressFunction) {
		let formData = new FormData()
		for (var key in comicData) {
			formData.append(key, comicData[key])
		}
		for (var pageFile of pageFiles) { formData.append('pageFile', pageFile) }
		if (thumbnailFile) { formData.append('thumbnailFile', thumbnailFile) }

		let response = await axios.post(baseUrl + '/comics',
			formData, {
				headers: {'Content-Type': 'multipart/form-data'},
				onUploadProgress: progressEvent => progressFunction(progressEvent)
			}
		)
		if (!response.data.error) { return {success: true} }
		else { return {success: false, message: response.data.error} }
	},

	async addThumbnailToPendingComic (comicId, thumbnailImage) {
		return new Promise( async resolve => {
			setTimeout(() => {resolve({'success': true, 'message': 'asd'})}, 1000)
		})
	},

	async addPagesToComic (comicData, newPagesList) {
		return new Promise(resolve => {
			resolve({'success': true, 'message': 'asd'})
		})
	},

	async processComicSuggestion (comicId, user, isApproved) {
		return new Promise(resolve => {
			resolve({'success': true, 'message': 'ok o ko ko kok fine'})
		})
	},

	async processPendingComic (comicId, isApproved) {
		let response = await axios.put(baseUrl + '/pendingcomics', {comicId: comicId, isApproved: isApproved})
		if (response.data.error) { return {success: false, message: response.data.error} }
		if (!response.data.error) { return {success: true} }
	},

	async rateComic (comicId, newRating) {
		return new Promise(resolve => {
			resolve({success: true})
		})
	},

	async addComicSuggestion (comicName, artist, linksComments) {
		return new Promise(resolve => {
			resolve({success: true, message: 'Not no'})
		})
	},

	async swapComicPages (comicId, pageNumber1, pageNumber2) {
		return new Promise( async resolve => {
			setTimeout(() => {resolve({'success': true, 'message': 'asd'})}, 500)
		})
	},

	async insertComicPage (comicId, imageFile, insertAfterPageNumber) {
		return new Promise( async resolve => {
			setTimeout(() => {resolve({'success': true, 'message': 'asd'})}, 500)
		})
	},

	async deleteComicPage (comicId, pageNumber) {
		return new Promise( async resolve => {
			setTimeout(() => {resolve({'success': true, 'message': 'asd'})}, 500)
		})
	},

	async getComicPageChangeDate (comicId) {
		return new Promise( async resolve => {
			setTimeout(() => {resolve(new Date('2019-01-30'))}, 500)
		})
	},

	async replaceThumbnailImage (comicId, imageFile) {
		return new Promise( async resolve => {
			setTimeout(() => {resolve({'success': true, 'message': 'asd'})}, 1000)
		})
	}
}