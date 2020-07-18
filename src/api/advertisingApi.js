import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async submitAdvertisingApplication (adType, adLink, adMainText, adSecondaryText, file, notes) {
    try {
      let response = await axios.post(baseUrl + '/advertising/apply', {
        adType, adLink, adMainText, adSecondaryText, file, notes
      })
      if (!response.data.error) { return {success: true} }
      else { return {success: false, message: response.data.error} }
    }
    catch (err) {
      return {success: false, message: 'Error contacting server'}
    }
  }

  // async getArtistList () {
  //   let response = await axios.get(baseUrl + '/artists')
  //   if (!response.data.error) { return response.data }
  //   else { return [] }
  // },
}
