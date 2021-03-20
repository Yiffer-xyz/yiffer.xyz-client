import axios from 'axios'
axios.defaults.withCredentials = true
import config from '@/config.json'
const baseUrl = config.apiBaseUrl

export default {
  async refreshAuth () {
    let response = await axios.get(`${baseUrl}/refresh-auth`)
    return response.data
  },

  async login (username, password) {
    let response = await axios.post(baseUrl + '/login', {
      username, password
    })

    return response.data
  },

  async signup (username, email, password) {
    let response = await axios.post(baseUrl + '/register', {
      username, password, email,
    })
    if (response.data.success) {
      return {success: true, result: response.data.userData}
    }
    else {
      return {success: false, message: response.data.error}
    }
  },
  
  logout () {
    axios.get(baseUrl + '/logout')
  },

  async changePassword (oldPassword, newPassword1, newPassword2) {
    if (newPassword1 !== newPassword2) {
      throw ({response: {data: 'New passwords are not equal'}})
    }

    await axios.post(baseUrl + '/changepassword', 
      {oldPassword: oldPassword, newPassword: newPassword1})
  },

  async changeEmail (oldPassword, newEmail) {
    await axios.post(baseUrl + '/change-email', {
      email: newEmail,
      password: oldPassword,
    })
  },

  async submitForgotPassword (email) {
    await axios.post(baseUrl + '/reset-password', {
      email: email,
    })
  },

  async submitResetPassword (password1, password2, token) {
    await axios.post(`${baseUrl}/reset-password-link/${token}`, {
      password1, password2,
    })
  }
}
