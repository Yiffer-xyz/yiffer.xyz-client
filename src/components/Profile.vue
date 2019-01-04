<template>
	<div style="width: 100%">
		<div class="whole-body-text whole-body-text-centered">

			<vue-headful :title="'Profile - Yiffer.xyz'"/>
			<h1 class="upper-body-div-comic">Profile: {{userData.username}}</h1>
			<back-to-index></back-to-index>
			<br/>

			<span><b>Email notifications on updates</b>: 
			<select v-model="emailSetting">
				<option value="none">No emails</option>
				<option value="updates">Emails for updates*</option>
				<option value="new">Emails for new comics</option>
				<option value="updatesAndNew">Emails for updates* and new comics</option>
			</select>
			</span>
			<label>Turn these on if you would like to be notified via email when your selected comics
				are updated, or when new comics are uploaded!</label>
			<label><b>*</b> will only regard updates to comics you have assigned some rating to.</label>
			<br/>
			

			<span><b>Email</b>: {{userData.email}}</span> 
			<br/>
			
			<span><b>Donator</b>: {{userData.donator ? 'yes' : 'no'}}</span>
			<br/>

			<b>Change password</b>
			<table class="change-password-table">
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

			<p class="error-message" v-if="errorMessage">{{errorMessage}}</p>
			<p class="success-message" v-if="successMessage">{{successMessage}}</p>
			
			<button @click="submitChangePassword()" class="y-button margin-top-4">Submit password change</button>
		</div>
	</div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'

export default {
	name: 'account',
	components: { 'back-to-index': BackToIndex },
	data: function () {
		return {
			'userData': {
				'username': '',
				'email': '',
				'donator': false,
			},
			'emailSetting': 'none',
			'currentPassword': '',
			'newPassword1': '',
			'newPassword2': '',
			'errorMessage': '',
			'successMessage': '',
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
				response = {'success': true, 'message': 'Password change successful'}
			}
			if (response.success) {
				this.successMessage = 'Password changed successfully!'
				this.errorMessage = ''
				this.currentPassword = ''
				this.newPassword1 = ''
				this.newPassword2 = ''
			}
			else {
				this.errorMessage = response.message
				this.successMessage = ''
			}
		},

  },
  created: function () {
		this.userData = {
			username: 'malann',
			email: 'malann.sjakk@gmail.com',
			donator: true,
		}
		this.emailSetting = 'updates'
  }
}

</script>

<style lang="scss">
.change-password-table {
	border: none;
	td {
		text-align: left;
	}
}
</style>
