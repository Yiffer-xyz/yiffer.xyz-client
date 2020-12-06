import axios from 'axios'
axios.defaults.withCredentials = true
import config from '@/config.json'
const baseUrl = config.apiBaseUrl

export default {
  async refreshAuth () {
    let response = await axios.get(baseUrl + '/refresh-auth')
    return response.data
  },

  async login (username, password) {
    let response = await axios.post(baseUrl + '/login', {
      username, password
    })

    if (response.data.success) {
      return {success: true, result: response.data.userData }
    }
    else {
      return {success: false, message: response.data.error}
    }
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
      return {success: false, message: 'New passwords not equal'}
    }
    let response = await axios.post(baseUrl + '/changepassword', {
      oldPassword: oldPassword,
      newPassword: newPassword1
    })

    if (response.data.success) { return {success: true} }
    else { return {success: false, message: response.data.error} }
  },

  async changeEmail (oldPassword, newEmail) {
    let response = await axios.post(baseUrl + '/change-email', {
      email: newEmail,
      password: oldPassword,
    })
    
    if (response.status === 204) { return {success: true} }
    else { return {success: false, message: response.data.error} }
  },

  async submitForgotPassword (email) {
    try {
      await axios.post(baseUrl + '/reset-password', {
        email: email,
      })
      return {success: true}
    }
    catch (err) {
      return {success: false, message: err.response.data}
    }    
  },

  async submitResetPassword (password1, password2, token) {
    try {
      await axios.post(`${baseUrl}/reset-password-link/${token}`, {
        password1, password2,
      })
      return {success: true}
    }
    catch (err) {
      return {success: false, message: err.response.data}
    }    
  }
}
