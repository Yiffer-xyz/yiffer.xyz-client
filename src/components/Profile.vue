<template>
	<div style="width: 100%">
		<div class="whole-body-text whole-body-text-centered">

			<vue-headful :title="'Profile - Yiffer.xyz'"/>
			<h1>Profile: {{$store.getters.userData.username}}</h1>
			<back-to-index></back-to-index>
			<br/>

			<span><b>Email notifications on updates</b>: 
			<select v-model="emailSetting">
				<option value="none">No emails</option>
				<option value="updates">Emails for updates*</option>
				<option value="updates10">Emails for updates (10)**</option>
				<option value="new">Emails for new comics</option>
				<option value="updatesAndNew">Emails for updates* and new comics</option>
				<option value="updatesAndNew10">Emails for updates (10)** and new comics</option>
			</select>
			</span>
			<label>Turn these on if you would like to be notified via email when your selected comics
				are updated, or when new comics are uploaded!</label>
			<label><b>*</b> will only regard updates to comics that you have given <u>some rating</u>.</label>
			<label><b>**</b> will only regard updates to comics that you have give a <u>rating of 10</u>.</label>
			<button @click="submitEmailPreference()" v-if="emailSettingChanged" class="y-button margin-top-4 no-margin-bot">Save</button>
						
			<p class="error-message" v-if="errorMessageEmail" style="margin-bottom: 16px">{{errorMessageEmail}}</p>
			<p class="success-message" v-if="successMessageEmail" style="margin-bottom: 16px">{{successMessageEmail}}</p>

			<span class="margin-top-16"><b>Email</b>: {{$store.getters.userData.email}}</span> 
			<br/>
			
			<span><b>Donator</b>: {{$store.getters.userData.donator ? 'yes' : 'no'}}</span>
			<br/>

			<b>Change password</b>
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
