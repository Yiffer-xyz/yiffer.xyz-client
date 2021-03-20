/* eslint-disable no-undef */
import authApi from '../api/authApi';

export default {
  state: {
    userData: undefined,
    isAuthenticated: false,
  },

  actions: {
    async signup (context, {email, username, password, password2}) {
      if (password != password2) {
        return {success: false, message: 'Passwords do not match'}
      }

      return new Promise( async resolve => {
        let response = await authApi.signup(username, email, password)
        if (response.success) {
          context.dispatch('setUserData', response.result)
          resolve({success: true})
        }
        else {
          resolve({success: false, message: response.message})
        }
      })
    },

    async logout ({dispatch}) {
      dispatch('destroyUserData')
      authApi.logout()
    },

    async checkAndSetLoginStatus ({commit, dispatch}) {
      if ($cookies.isKey('user-data')) {
        commit('setUserData', $cookies.get('user-data'))
        commit('setIsAuthenticated', true)
        dispatch('refreshUserData')
        return true
      }
      else {
        commit('setIsAuthenticated', false)
        commit('setUserData', undefined)
        return false
      }
    },

    async refreshUserData ({commit}) {
      let response = await authApi.refreshAuth()
      if (response === null) {
        commit('setIsAuthenticated', false)
        commit('setUserData', undefined)
      }
      else {
        commit('setUserData', response)
        commit('setIsAuthenticated', true)
      }
    },

    setUserData (context, userData) {
      context.commit('setUserData', userData)
      context.commit('setIsAuthenticated', true)
      $cookies.set('user-data', userData)
    },

    destroyUserData (context) {
      context.commit('setUserData', undefined)
      context.commit('setIsAuthenticated', false)
      $cookies.remove('user-data')
    },
  },

  mutations: {
    setUserData (state, userData) {
      state.userData = userData
    },

    setIsAuthenticated (state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    }
  },

  getters: {
    isAuthenticated: state => state.isAuthenticated,
    getIsAuthenticated: () => state => state.isAuthenticated,
    userData: state => state.userData
  }
}