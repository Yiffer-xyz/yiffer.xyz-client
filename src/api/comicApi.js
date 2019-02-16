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
		if (!response.data.error) {
			console.log(response.data)
			return {success: true, result: response.data}
		}
		else {
			return {error: 'No comic with that name'}
		}
	},

	async getPendingComics () {//todo create. Need the add pending comic first to test
		let response = await axios.get(baseUrl + '/pendingcomics')
		console.log(response.data)
		return response.data
	},

	async getPendingComic (comicName) {//todo create. Wait, same as above
		// let response = await axios.get(baseUrl + '/pendingComics/' + comicName)
		// return response.data
		return new Promise( async resolve => {
			resolve({"hasThumbnail": false, "modName": "YeahNoIdea", "links": {"previousComic": null, "nextComic": null}, "tag": "Pokemon", "name": "Lost and Found", "keywords": ["creampie", "elf", "fat", "biting", "big penis", "eggs", "discord", "femdom", "feral penis", "canine"], "cat": "MM", "numberOfPages": 52, "id": 813, "created": "2018-02-10T15:40:44.000Z", "finished": 0, "artist": "Edesk"})
		})
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
		else { return {error: response.data.error} }
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
		return new Promise(resolve => {
			resolve({'success': true, 'message': 'ok o ko ko kok fine'})
		})
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