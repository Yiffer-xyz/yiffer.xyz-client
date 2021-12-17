import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async getPatreonTiers () {
    let response = await axios.get(`${baseUrl}/patreon/tiers`)

    if (!response.data.error) { return response.data }
    else { return [] }
  },

  async unlinkPatreonAccount () {
    let response = await axios.post(`${baseUrl}/patreon/unlink`)
    return response.data
  },

  async syncPatreonTier () {
    let response = await axios.post(`${baseUrl}/patreon/sync-account`)
    return response.data
  },

  async udatePatreonDisplayName (newName) {
    let response = await axios.post(`${baseUrl}/patreon/update-name`, { newName })
    return response.data
  },

  async removePatreonDisplayName () {
    let response = await axios.post(`${baseUrl}/patreon/remove-name`)
    return response.data
  },

  async udatePatreonDisplayLink (newLink) {
    let response = await axios.post(`${baseUrl}/patreon/update-link`, { newLink: newLink })
    return response.data
  },

  async removePatreonDisplayLink () {
    let response = await axios.post(`${baseUrl}/patreon/remove-link`)
    return response.data
  },

  async updatePatreonPicture (newPic) {
    let formData = new FormData()
    formData.append('file', newPic)

    let response = await axios.post(`${baseUrl}/patreon/update-picture`,
      formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      }
    )

    return response.data
  },

  async removePatreonPicture () {
    let response = await axios.post(`${baseUrl}/patreon/remove-picture`)
    return response.data
  },

  async fetchVIPSupporter () {
    let response = await axios.get(`${baseUrl}/patreon/vip-supporter`)
    return response.data
  },

  async fetchSupportersForList () {
    let response = await axios.get(`${baseUrl}/patreon/supporter-list`)
    return response.data
  },
}