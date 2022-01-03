import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async getBlogs () {
    let response = await axios.get(baseUrl + '/blogs')
    return response.data
  },

  async getDisplayedBlog () {
    try {
      let response = await axios.get(baseUrl + '/blogs/current')
      return response.data
    }
    catch (err) {
      return { shouldDisplay: false }
    }
  },
}