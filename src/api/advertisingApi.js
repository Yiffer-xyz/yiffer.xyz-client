import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async getMyAds () {
    try {
      let response = await axios.get(baseUrl + '/paid-images/me')
      return response.data
    }
    catch (err) {
      throw {message: err.response?.data}
    }
  },

  async getAdsBasic () {
    try {
      let response = await axios.get(baseUrl + '/paid-images-basic')
      if (!response.data.error) { return response.data }
      else { return [] }
    }
    catch (err) {
      return []
    }
  },

  async logAdClick (adId) {
    axios.post(baseUrl + '/paid-images-click', {adId})
  },
}
