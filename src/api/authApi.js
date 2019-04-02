import axios from 'axios'

let baseUrl = 'http://localhost:8012'

export default {
	async login (username, password) {
		let response = await axios.post(baseUrl + '/login', {username: username, password: password})
		if (response.data.success) { return {success: true, result: response.data.userData } }
		else { return {success: false, message: response.data.message} }
	},

	async signup (username, password) {
		let response = await axios.post(baseUrl + '/register', {username: username, password: password})
		if (response.data.success) { return {success: true, result: response.data.userData} }
		else { return {success: false, message: response.data.message} }
	},

	async changePassword (oldPassword, newPassword1, newPassword2) {
		return new Promise( async resolve => {
			resolve({success: true})
		})
	},

	async setEmailPreference (preference) {
		return new Promise( async resolve => {
			resolve({success: true})
		})
	},

	async getEmailPreference () {
		return new Promise( async resolve => {
			resolve({success: true, result: "updates"})
		})
	},

	async forgottenPassword (email) {
		return new Promise( async resolve => {
			resolve({success: true, message: 'asd'})
		})
	}
}