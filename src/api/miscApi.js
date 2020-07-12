import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
  async getModScores () {
    let response = await axios.get(baseUrl + '/modscores')
    if (!response.data.error) { return response.data }
    else { return [] }
  },

  async getModLog () {
    let response = await axios.get(baseUrl + '/modlog')
    if (!response.data.error) { return response.data }
    else { return [] }
  },

  async logRoute (route, description) {
    axios.post(baseUrl + '/log-route', {route, description})
  },

  async logEvent (event, description) {
    axios.post(baseUrl + '/log-event', {event, description: description || null})
  },

  async getVisitorStats (interval) {
    let response = await axios.get(baseUrl + `/stats/visitors?interval=${interval}`)
    if (!response.data.error) { return response.data }
    else { return [] }
  },

  async getComicViewStats (interval) {
    let response = await axios.get(baseUrl + `/stats/comic-views?interval=${interval}`)
    if (!response.data.error) { return response.data }
    else { return [] }
  },

  async getRouteStats (interval) {
    let response = await axios.get(baseUrl + `/stats/routes?interval=${interval}`)
    if (!response.data.error) { return response.data }
    else { return [] }
  }
}
