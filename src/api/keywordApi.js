import axios from 'axios'

let baseUrl = 'http://localhost:8012/api'

export default {
  async getKeywordList () {
		let response = await axios.get(baseUrl + '/keywords')
		if (!response.data.error) { return response.data }
		else { return [] }
  },

  async getKeywordSuggestionList () {
		let response = await axios.get(baseUrl + '/keywordsuggestions')
		if (!response.data.error) { return response.data }
		else { return [] }
  },

  async processKeywordSuggestion (suggestion, isApproved) {
		let response = await axios.post(baseUrl + '/keywordsuggestions/process', 
			{suggestion: suggestion, isApproved: isApproved})
		if (!response.data.error) { return {success: true} }
		else { return {success: false, message: response.data.error} }
  },

  async addKeywordsToComic (comicData, keywordList) {
		return new Promise(async resolve => {
			resolve({'success': false, 'message': 'ok adding the KWs my fren'})
		})
  },

  async removeKeywordsFromComic (comicData, keywordList) {
    return new Promise(async resolve => {
			resolve({'success': false, 'message': 'The something not logged in or someting'})
    })
	},

	async addKeywordsToPendingComic (comicData, keywordList) {
		let response = await axios.post(`${baseUrl}/pendingcomics/${comicData.id}/addkeywords`, {
			keywords: keywordList
		})

		if (!response.data.error) { return {success: true} }
		else { return {success: false, message: response.data.error} }
	},

	async removeKeywordsFromPendingComic (comicData, keywordList) {
		let response = await axios.post(`${baseUrl}/pendingcomics/${comicData.id}/removeKeywords`, {
			keywords: keywordList
		})

		if (!response.data.error) { return {success: true} }
		else { return {success: false, message: response.data.error} }
	},

  async createKeyword (keywordName) {
    return new Promise(async resolve => {
			resolve({'success': false, 'message': 'BAD SHIT HAPPEN'})
    })
	},
	
	async addKeywordSuggestion (comicId, keywordName, addOrRemoveKeyword) {
		let response = await axios.post(baseUrl + '/keywordsuggestions', 
			{comicId: comicId, keyword: keywordName, extension: addOrRemoveKeyword=='add'})
		if (!response.data.error) { return {success: true} }
		else { return {success: false, message: response.data.error} }	
	}
}