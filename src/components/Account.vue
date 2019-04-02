<template>
	<div style="width: 100%">
		<div class="whole-body-text whole-body-text-centered">

			<vue-headful :title="'Account - Yiffer.xyz'"/>
			<h1 class="margin-bottom-8">Account: {{$store.getters.userData.username}}</h1>
			<back-to-index></back-to-index>

			<span class="margin-top-8"><b>Email</b>: {{$store.getters.userData.email}}</span> 

			<span class="margin-top-8"><b>Donator</b>: {{$store.getters.userData.donator ? 'yes' : 'no'}}</span>

			<b class="margin-top-8">Change password</b>
			<table id="changePasswordTable">
				<tr>
					<td><label>Current password: </label> </td>
					<td><input v-model="currentPassword" type="password" class="margin-top-4"/></td>
				</tr>
				<tr>
					<td><label>New password: </label></td>
					<td><input v-model="newPassword1" type="password" class="margin-top-4"/></td>
				</tr>
				<tr>
					<td><label>Repeat new password: </label></td>
					<td><input v-model="newPassword2" type="password" class="margin-top-4"/></td>
				</tr>
			</table>

			<p class="error-message" v-if="errorMessagePassword">{{errorMessagePassword}}</p>
			<p class="success-message" v-if="successMessagePassword">{{successMessagePassword}}</p>
			
			<button @click="submitChangePassword()" class="y-button margin-top-16">Submit password change</button>
		</div>
	</div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'

import authApi from '../api/authApi'

export default {
	name: 'account',

	components: { 'back-to-index': BackToIndex },

	data: function () {
		return {
			'userData': {
				'email': '',
			},
			'emailSetting': 'none',
			'emailSettingChanged': false,
			'currentPassword': '',
			'newPassword1': '',
			'newPassword2': '',
			'errorMessagePassword': '',
			'successMessagePassword': '',
			'errorMessageEmail': '',
			'successMessageEmail': '',
		}
	},

	methods: {
		async submitChangePassword () {
			let response = undefined
			if (!this.currentPassword || !this.newPassword1 || !this.newPassword2) {
				response = {success: false, message: 'Please fill in all fields'}
			}
			else if (this.newPassword1 != this.newPassword2) {
				response = {success: false, message: 'New passwords do not match'}
			}
			else {
				response = await authApi.changePassword(this.currentPassword, this.newPassword1, this.newPassword2)
			}
			if (response.success) {
				this.successMessagePassword = 'Password changed successfully!'
				this.errorMessagePassword = ''
				this.currentPassword = ''
				this.newPassword1 = ''
				this.newPassword2 = ''
			}
			else {
				this.errorMessagePassword = `Error changing password: ${response.message}`
				this.successMessagePassword = ''
			}
		},

		async submitEmailPreference () {
			let response = await authApi.setEmailPreference(this.emailSetting)
			if (response.success) {
				this.savedEmailSetting = this.emailSetting
				this.emailSettingChanged = false
				this.successMessageEmail = 'Email preferences updated!'
				this.errorMessageEmail = ''
			}
			else { //todo test
				this.errorMessageEmail = 'Error updating email preferences'
				this.successMessageEmail = ''
			}
		}
	},
	
  created: async function () {
		let loggedin = await this.$store.dispatch('checkAndSetLoginStatus')
		if (!loggedin) { this.$router.replace('/') }
		this.savedEmailSetting = (await authApi.getEmailPreference()).result
		this.emailSetting = this.savedEmailSetting
	},

	watch: {
		// Need to use watch instead of computed because vue won't redraw when
		// submitEmailPreference() is called
		emailSetting () {
			this.emailSettingChanged = this.emailSetting != this.savedEmailSetting
		}
	}
}

</script>

<style lang="scss">
#changePasswordTable {
	border: none;
	td {
		text-align: left;
	}
}
</style>
