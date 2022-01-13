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
    try {
      let response = await axios.post(baseUrl + '/keywordsuggestions', {
        comicId: comicId, keywordId: keywordId, isAdding: isAdding
      })

      return { success: true, modOrAdminAdded: response.status === 204 }
    }
    catch (err) {
      return { error: err.response?.data }
    }
  },

  logKeywordSearch (keywordId, isFromCard) {
    axios.post(baseUrl + '/keywords/log', {keywordId, isFromCard})
  }
}
