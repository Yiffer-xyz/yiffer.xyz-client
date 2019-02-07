export default {
	async login (username, password) {
		return new Promise( async resolve => {
			// resolve({success: true, result: {username: 'tullebruker23', donator: false, userType: 'normal', email: 'testemail.com'}})
			resolve({success: false, message: 'U bad bro'})
		})
	},

	async signup (username, password, email) {
		return new Promise( async resolve => {
			resolve({success: true, result: {username: 'signupbruker99', donator: false, userType: 'admin', email: '99mail.com'}})
		})
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
			resolve({success: true, result: {preference: "updates"}})
		})
	},

	async forgottenPassword (email) {
		return new Promise( async resolve => {
			resolve({success: true, message: 'asd'})
		})
	}
}