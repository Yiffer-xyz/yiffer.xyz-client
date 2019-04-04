import authApi from '../api/authApi';

export default {
	state: {
		userData: undefined,
		isAuthenticated: false,
	},

	actions: {
		async login (context, {username, password}) {
			return new Promise( async resolve => {
				let response = await authApi.login(username, password)
				if (response.success) {
					context.dispatch('setUserData', response.result)
					resolve({success: true})
				}
				else {
					resolve({success: false, message: response.message})
				}
			})
		},

		async signup (context, {username, password, password2}) {
			if (password != password2) { return {success: false, message: 'Passwords do not match'} }
			return new Promise( async resolve => {
				let response = await authApi.signup(username, password)
				if (response.success) {
					context.dispatch('setUserData', response.result)
					resolve({success: true})
				}
				else {
					resolve({success: false, message: response.message})
				}
			})
		},

		async changePassword (context, {oldPassword, newPassword}) {
			return new Promise( async resolve => {
				let response = await authApi.changePassword(oldPassword, newPassword)
				if (response.success) {
					resolve({success: true})
				}
				else {
					resolve({success: false, message: 'asdasdasdasd todo'})
				}
			})
		},

		async logout (context) {
			context.dispatch('destroyUserData')
			authApi.logout()
		},

		checkAndSetLoginStatus (context) {
			return new Promise( async resolve => {
				if ($cookies.isKey('user-data')) {
					context.commit('setUserData', $cookies.get('user-data'))
					context.commit('setIsAuthenticated', true)
					resolve(true)
				}
				else {
					context.commit('setIsAuthenticated', false)
					context.commit('setUserData', undefined)
					resolve(false)
				}
			})
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
			console.log('userdata set.....', userData)
			state.userData = userData
		},

		setIsAuthenticated (state, isAuthenticated) {
			state.isAuthenticated = isAuthenticated
		}
	},

	getters: {
		isAuthenticated: state => state.isAuthenticated,
		userData: state => state.userData
	}
}