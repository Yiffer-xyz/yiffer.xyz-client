import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async getBlogs () {
    let response = await axios.get(baseUrl + '/blogs')
    if (!response.data.error) { return response.data }
    else { return [] }
  },

  async getDisplayedBlog () {
    let response = await axios.get(baseUrl + '/blogs/current')
    if (!response.data.error) { return response.data }
    else { return { shouldDisplay: false } }
  },

  async addBlog (title, isImportant, content, displayDays) {
    let response = await axios.post(baseUrl + '/blogs', {title, isImportant, content, displayDays})
    if (!response.data.error) { return {success: true} }
    else { return {success: false, message: response.data.error} }
  }
}