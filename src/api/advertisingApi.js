import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async updateAd ({id, price, status, activationDate, deactivationDate, adminNotes, correctionNote}) {
    let response = await axios.post(`${baseUrl}/paid-images/${id}`, {
      price, status, activationDate, deactivationDate, adminNotes, correctionNote,
    })
    if (!response.data.error) { return response.data }
    else { return {success: false, message: response.data.error} }
  },

  async getAdsByStatuses (statuses) {
    let params = new URLSearchParams()
    statuses.forEach(status => params.append('statuses', status))
    let requestQuery = {params: params}

    let response = await axios.get(baseUrl + '/paid-images', requestQuery)
    if (!response.data.error) { return response.data }
    else { return [] }
  },
  
  async getAllAds () {
    let response = await axios.get(baseUrl + '/paid-images')
    if (!response.data.error) { return response.data }
    else { return [] }
  },

  async getMyAds () {
    try {
      let response = await axios.get(baseUrl + '/paid-images/me')
      return response.data
    }
    catch (err) {
      throw {message: err.response.data}
    }
  },

  async getAdsBasic () {
    let response = await axios.get(baseUrl + '/paid-images-basic')
    if (!response.data.error) { return response.data }
    else { return [] }
  },

  async logAdClick (adId) {
    axios.post(baseUrl + '/paid-images-click', {adId})
  },
}
