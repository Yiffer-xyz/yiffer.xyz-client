import axios from 'axios'
axios.defaults.withCredentials = true

let baseUrl = '/api'

export default {
	async login (username, password) {
		let response = await axios.post(baseUrl + '/login', {username: username, password: password})
		if (response.data.success) { return {success: true, result: response.data.userData } }
		else { return {success: false, message: response.data.error} }
	},

	async signup (username, password) {
		let response = await axios.post(baseUrl + '/register', {username: username, password: password})
		if (response.data.success) { return {success: true, result: response.data.userData} }
		else { return {success: false, message: response.data.error} }
	},
	
	logout () {
		axios.get(baseUrl + '/logout')
	},

	async changePassword (oldPassword, newPassword1, newPassword2) {
		if (newPassword1 !== newPassword2) {
			return {success: false, message: 'New passwords not equal'}
		}
		let response = await axios.post(baseUrl + '/changepassword', 
			{oldPassword: oldPassword, newPassword: newPassword1})
		if (response.data.success) { return {success: true} }
		else { return {success: false, message: response.data.error} }
	},
}
