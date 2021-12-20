import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async getComicsPaginated ({categories, tags, keywordIds, search, order, page, shouldGetKeywords}) {
    let params = {
      page: page || 1,
      order,
    }
    if (categories) { params.categories = categories }
    if (tags) { params.tags = tags }
    if (keywordIds && keywordIds.length>0) { params.keywordIds = keywordIds }
    if (search) { params.search = search }
    if (shouldGetKeywords) { params.getKeywords = true }

    let response = await axios.get(baseUrl + '/comicsPaginated', { params })
    for (var comic of response.data.comics) {
      comic.created = new Date(comic.created)
      comic.updated = new Date(comic.updated)
      comic.indexId = comic.id
    }

    return response.data
  },

  async getComic (comicName) {
    let response = await axios.get(baseUrl + '/comics/' + comicName)
    return response.data
  },

  async rateComic (comicId, newRating) {
    let response = await axios.post(`${baseUrl}/comics/${comicId}/rate`, {rating: newRating})
    if (response.data.error) { return {success: false, message: response.data.error} }
    if (!response.data.error) { return {success: true} }
  },

  async addComicSuggestion (comicName, artist, linksComments) {
    let response = await axios.post(baseUrl + '/comicsuggestions', 
      {comicName: comicName, artist: artist, comment: linksComments})
    return response.data
  },

  async getRejectedComics () {
    let response = await axios.get(baseUrl + '/comicsuggestions/rejected')
    if (!response.data.error) { return response.data }
    else { return [] }
  },
}
