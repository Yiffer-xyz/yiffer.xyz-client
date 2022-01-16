/* eslint-disable no-undef */
import authApi from '../api/authApi';

export default {
  state: {
    userData: undefined,
    isAuthenticated: false,
  },

  actions: {
    async logout ({dispatch}) {
      dispatch('destroyUserData')
      authApi.logout()
    },

    async checkAndSetLoginStatus ({commit, dispatch}) {
      if ($cookies.isKey('yiffer_userdata')) {
        commit('setUserData', $cookies.get('yiffer_userdata'))
        commit('setIsAuthenticated', true)
        dispatch('refreshUserData')
        return true
      }
      else {
        dispatch('destroyUserData')
        return false
      }
    },

    async refreshUserData ({commit, dispatch}) {
      try {
        let response = await authApi.refreshAuth()
        if (response === null) {
          dispatch('destroyUserData')
        }
        else {
          commit('setUserData', response)
          commit('setIsAuthenticated', true)
        }
      }
      catch (err) {
        commit('setIsAuthenticated', false)
        commit('setUserData', undefined)
      }
    },

    setUserData (context, userData) {
      context.commit('setUserData', userData)
      context.commit('setIsAuthenticated', true)
    },

    destroyUserData (context) {
      context.commit('setUserData', undefined)
      context.commit('setIsAuthenticated', false)
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