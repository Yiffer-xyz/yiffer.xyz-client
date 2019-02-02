import config from '@/config.json'

export default {
	async getComics () {
		return new Promise( resolve => {
			setTimeout(() => {
				resolve({data: config.comicList}) // todo kanskje egen for admin og egen for ComicList?
			}, 1000)
		})
	},

	async getComic (comicName) {
		return new Promise( resolve => {
			// if comic exists
			resolve({success: true, result: {"links": {"nextComic": "asddda", "previousComic": undefined}, "tag": "Furry", "name": "Dress to Undress", "keywords": ['asd', 'asdasdasd', 'asdasdasdasd', 'asad asda', 'xccxxc', 'xcxcxcxc ', 'xccx', 'xcxc', 'asdasdasd a', 'asd  a a ', 'asdasd ',"finnick", "chipmunk", "charizard", "footjob", "fisting"], "cat": "MM", "lastUpdateNewPageCount": 0, "updated": "2017-10-24T11:04:46.000Z", "numberOfPages": 21, "userRating": 7.881, "id": 343, "created": "2017-07-01T00:00:00.000Z", "finished": 0, "artist": "Seth-Iova", "yourRating": 0}})
			// else 
			// resolve({success: false})
		})
	},

	async getPendingComics () {
		return new Promise( async resolve => {
			resolve([
				{"hasThumbnail": true, "modName": "raggis", "links": {"previousComic": null, "nextComic": "lalalala"} ,"tag": "Furry", "name": "Dress to Undress", "keywords": ["finnick", "chipmunk", "charizard", "footjob", "fisting"], "cat": "MM", "numberOfPages": 21, "id": 343, "created": "2017-07-01T00:00:00.000Z", "finished": 0, "artist": "Seth-Iova"},
				{"hasThumbnail": false, "modName": "YeahNoIdea", "links": {"previousComic": null, "nextComic": null}, "tag": "Pokemon", "name": "Lost and Found", "keywords": ["creampie", "elf", "fat", "biting", "big penis", "eggs", "discord", "femdom", "feral penis", "canine"], "cat": "MM", "numberOfPages": 52, "id": 813, "created": "2018-02-10T15:40:44.000Z", "finished": 0, "artist": "Edesk"},
				{"hasThumbnail": false, "modName": "Kit", "links": {"previousComic": null, "nextComic": "asd"}, "tag": "Furry", "name": "Critical Success", "keywords": [], "cat": "I", "numberOfPages": 47, "id": 24, "created": "2017-07-01T00:00:00.000Z", "finished": 1, "artist": "Roanoak", "yourRating": 0}
			])
		})
	},

	async getPendingComic (comicName) {
		return new Promise( async resolve => {
			resolve({"hasThumbnail": false, "modName": "YeahNoIdea", "links": {"previousComic": null, "nextComic": null}, "tag": "Pokemon", "name": "Lost and Found", "keywords": ["creampie", "elf", "fat", "biting", "big penis", "eggs", "discord", "femdom", "feral penis", "canine"], "cat": "MM", "numberOfPages": 52, "id": 813, "created": "2018-02-10T15:40:44.000Z", "finished": 0, "artist": "Edesk"})
		})
	},

	async getSuggestedComicList () {
		return new Promise( resolve => {
			resolve(config.comicSuggestionList)
		})
	},

	async getComicLinks (comicId) {
		return new Promise( resolve => {
			resolve({data: {'NextComic': 'einelleraen neste', 'PreviousComic': 'forrige'}})
		})
	},

	// bare sett de tingene som kan bli satt. Antar at ved success: true, s[ stemmer det sendte inn
	async updateComic (updatedComicData) {
		return new Promise(resolve => {
			resolve({'success': true, 'message': 'asd'})
		})
	},

	async addNewComic (comicData, newPagesList) {
		return new Promise(resolve => {
			resolve({'success': true, 'message': 'asd'})
		})
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
	}
}