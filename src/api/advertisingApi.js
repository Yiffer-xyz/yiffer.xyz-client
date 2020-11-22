import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async submitAdvertisingApplication (adType, adLink, adMainText, adSecondaryText, file, notes) {
    let formData = new FormData()
    formData.append('adType', adType)
    formData.append('adLink', adLink)
    formData.append('adMainText', adMainText)
    formData.append('adSecondaryText', adSecondaryText)
    formData.append('notes', notes)
    formData.append('file', file)

    let response = await axios.post(
      baseUrl + '/paid-images',
      formData,
      {
        headers: {'Content-Type': 'multipart/form-data'},
      }
    )

    if (!response.data.error) { return {success: true} }
    else { return {success: false, message: response.data.error} }
  },

  async updateAd ({id, price, status, activationDate, deactivationDate, adminNotes}) {
    let response = await axios.post(`${baseUrl}/paid-images/${id}`, {
      price, status, activationDate, deactivationDate, adminNotes
    })
    if (!response.data.error) { return response.data }
    else { return {success: false, message: response.data.error} }
  },

  async updateAdNeedingCorrection (id, link, mainText, secondaryText, file) {
    let formData = new FormData()
    formData.append('link', link)
    if (mainText) { formData.append('mainText', mainText) }
    if (secondaryText) { formData.append('secondaryText', secondaryText) }
    if (file) { formData.append('file', file) }

    try {
      let response = await axios.post(
        `${baseUrl}/paid-images/${id}/correct`,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        }
      )

      return response.data
    }
    catch (err) {
      return {success: false, message: err.response.data}
    }
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
    let response = await axios.get(baseUrl + '/paid-images/me')
    if (!response.data.error) { return {success: true, ads: response.data} }
    else { return {success: false, message: response.data.error} }
  },

  async toggleRenewal (adId, shouldRenew) {
    try {
      let response = await axios.post(`${baseUrl}/paid-images/${adId}/toggle-renew`, {shouldRenew})
      return response.data
    }
    catch (err) {
      return {success: false, message: err.response.data}
    }
  },

  async getAdsBasic () {
    let response = await axios.get(baseUrl + '/paid-images-basic')
    if (!response.data.error) { return response.data }
    else { return [] }
  },

  async logAdClick (adId) {
    console.log('clicked ', adId)
    axios.post(baseUrl + '/paid-images-click', {adId})
  }
}
