import axios from 'axios'
axios.defaults.withCredentials = true
import config from '@/config.json'
const baseUrl = config.apiBaseUrl
const baseUrlNoApi = baseUrl.substring(0, baseUrl.length-4)

export default {
  async login (username, password) {
    let response = await axios.post(baseUrlNoApi + '/login', {username: username, password: password})
    if (response.data.success) { return {success: true, result: response.data.userData } }
    else { return {success: false, message: response.data.error} }
  },

  async signup (username, password) {
    let response = await axios.post(baseUrlNoApi + '/register', {username: username, password: password})
    if (response.data.success) { return {success: true, result: response.data.userData} }
    else { return {success: false, message: response.data.error} }
  },
  
  logout () {
    axios.get(baseUrlNoApi + '/logout')
  },

  async changePassword (oldPassword, newPassword1, newPassword2) {
    if (newPassword1 !== newPassword2) {
      return {success: false, message: 'New passwords not equal'}
    }
    let response = await axios.post(baseUrlNoApi + '/changepassword', 
      {oldPassword: oldPassword, newPassword: newPassword1})
    if (response.data.success) { return {success: true} }
    else { return {success: false, message: response.data.error} }
  },
}
