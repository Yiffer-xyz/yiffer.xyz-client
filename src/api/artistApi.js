import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async getArtistByName (artistName) {
    try {
      let response = await axios.get(`${baseUrl}/artists/${artistName}`)
      return { success: true, result: response.data }
    }
    catch (err) {
      if (err.response?.status === 404) {
        return { success: false, notFound: true }
      }
      else {
        return { success: false, isError: true }
      }
    }
  },
}
