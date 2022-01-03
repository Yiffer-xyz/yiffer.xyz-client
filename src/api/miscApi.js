import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async logRoute (route, description) {
    try {
      axios.post(baseUrl + '/log-route', {route, description})
    }
    // eslint-disable-next-line no-empty
    catch (err) {}
  },

  async logEvent (event, description) {
    try {
      await axios.post(baseUrl + '/log-event', {event, description: description || null})
    }
    // eslint-disable-next-line no-empty
    catch (err) {}
  },

  async submitModApplication (notes, telegramUsername) {
    let response = await axios.post(`${baseUrl}/mod-applications`, {
      notes, telegramUsername
    })
    return response.data
  },

  async getMyModApplicationStatus () {
    let response = await axios.get(`${baseUrl}/mod-applications/me`)
    if (!response.data.error) {
      return { success: true, ...response.data }
    }
    else {
      return { success: false }
    }
  },

  async submitFeedback (feedbackText) {
    let response = await axios.post(`${baseUrl}/feedback`, {
      feedbackText
    })
    return response.data
  },

  async getProblemCategories () {
    let response = await axios.get(`${baseUrl}/comic-problem-categories`)
    return response.data
  },

  async getSingleComicProblemCategories (comicId) {
    let response = await axios.get(`${baseUrl}/comic-problems/${comicId}`)
    let categories = response.data.filter(p => p.categoryName !== 'Other')
    return categories
  },

  async submitComicProblem (comicId, categoryId, description) {
    let response = await axios.post(`${baseUrl}/comic-problems`, {
      comicId, categoryId, description,
    })
    return response.data
  }
}
