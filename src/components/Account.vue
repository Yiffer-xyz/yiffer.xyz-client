<template>
	<div style="width: 100%">

		<vue-headful :title="'Account - Yiffer.xyz'"/>
		<h1 class="margin-bottom-8">Account: {{$store.getters.userData.username}}</h1>
		<back-to-index style="margin: auto;"/>

		<div class="smaller-width-text vertical-flex center-on-mobile">
			<button v-if="!isChangingPassword"
							@click="isChangingPassword=true"
							class="y-button y-button-neutral margin-top-16"
							style="width: fit-content;">
				Change password
			</button>

			<div v-if="isChangingPassword" class="margin-top-16">
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

				<div style="margin: 4px auto 0 auto; width: fit-content;">
					<button @click="cancelChangePassword"
									class="y-button y-button-neutral">
						Cancel
					</button>

					<button @click="submitChangePassword"
									class="y-button" 
									style="width: fit-content; margin-left: 8px;">
						Change password
					</button>
				</div>
			</div>

			<p class="error-message" v-if="errorMessagePassword">{{errorMessagePassword}}</p>
			<p class="success-message" v-if="successMessagePassword">{{successMessagePassword}}</p>

			<div class="margin-top-16" v-show="!isChangingPassword">
				<b>Donator</b>: {{$store.getters.userData.donator ? 'Yes' : 'No'}}
			</div>

			<div class="margin-top-16" v-show="!isChangingPassword">
				<b>Tag blacklist</b>
				<p style="font-style: italic; margin-top: 0;">Coming soon!</p>
			</div>
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
			isChangingPassword: false,
			currentPassword: '',
			newPassword: '',
			newPassword2: '',
			errorMessagePassword: '',
			successMessagePassword: '',
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
				this.cancelChangePassword()
			}
			else {
				this.errorMessagePassword = `Error changing password: ${response.message}`
				this.successMessagePassword = ''
			}
		},

		cancelChangePassword () {
			this.errorMessagePassword = ''
			this.currentPassword = ''
			this.newPassword1 = ''
			this.newPassword2 = ''
			this.isChangingPassword = false
		}
	},
	
  created: async function () {
		let loggedin = await this.$store.dispatch('checkAndSetLoginStatus')
		if (!loggedin) { this.$router.replace('/') }
	},
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
