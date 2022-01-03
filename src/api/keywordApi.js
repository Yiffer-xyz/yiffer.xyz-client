import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async getKeywordList () {
    let response = await axios.get(baseUrl + '/keywords')
    return response.data
  },

  async getComicKeywords (comicId) {
    let response = await axios.get(`${baseUrl}/comic-keywords/${comicId}`)
    if (!response.data.error) { return response.data }
    else { return [] }
  },

  async addKeywordSuggestion (comicId, keywordId, isAdding) {
    let response = await axios.post(baseUrl + '/keywordsuggestions', 
      {comicId: comicId, keywordId: keywordId, isAdding: isAdding})

    if (!response.data.error) { return {success: true} }
    else { return {success: false, message: response.data.error} }  
  },

  logKeywordSearch (keywordId, isFromCard) {
    axios.post(baseUrl + '/keywords/log', {keywordId, isFromCard})
  }
}
