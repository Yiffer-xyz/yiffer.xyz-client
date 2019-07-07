import axios from 'axios'

let baseUrl = '/api'

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
		let response = await axios.post(baseUrl + '/keywords/addtocomic', {comicId: comicData.id, keywords: keywordList})
		if (!response.data.error) { return {success: true} }
		else { return {success: false, message: response.data.error} }
  },

  async removeKeywordsFromComic (comicData, keywordList) {
		let response = await axios.post(baseUrl + '/keywords/removefromcomic', {comicId: comicData.id, keywords: keywordList})
		if (!response.data.error) { return {success: true} }
		else { return {success: false, message: response.data.error} }
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

  async createKeyword (keyword) {
		let response = await axios.post(baseUrl + '/keywords', {keyword: keyword})
		if (!response.data.error) { return {success: true} }
		else { return {success: false, message: response.data.error} }
	},
	
	async addKeywordSuggestion (comicId, keywordName, addOrRemoveKeyword) {
		let response = await axios.post(baseUrl + '/keywordsuggestions', 
			{comicId: comicId, keyword: keywordName, extension: addOrRemoveKeyword=='add'})
		if (!response.data.error) { return {success: true} }
		else { return {success: false, message: response.data.error} }	
	},

	logKeywordSearch (keyword) {
		axios.post(baseUrl + '/keywords/log', {keyword: keyword})
	}
}
