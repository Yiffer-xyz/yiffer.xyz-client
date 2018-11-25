<template>
	<div style="width: 100%; display: flex; align-items: center; flex-direction: column;">
    <h1>Create new password</h1>

      <back-to-index style="margin-bottom: 16px;"></back-to-index>

      <p>Username: {{$route.query.username}}</p>
      <p>Email: {{$route.query.email}}</p>

      <p v-if="passwordChangeSuccess" style="margin-top: 32px; font-weight: 600;">
        Password successfully changed!
      </p>
      
      <p v-if="errorMessage" id="newPasswordErrorMessage" class="error-message">{{errorMessage}}</p>
      <form @submit="submitClicked" v-if="!passwordChangeSuccess" class="login-register-form">
        <label for="newPassword">New password, 6+ characters</label>
        <input 
          v-model="newPassword"
          name="newPassword"
          type="password"
          v-bind:class="{'valid-input': passwordValidity===true, 'invalid-input': passwordValidity===false}"
        />

        <button class="y-button">Submit</button>
      </form>
	</div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'

export default {
	name: 'new-password',
	components: { 'back-to-index': BackToIndex },
	data: function () {
		return {
      errorMessage: '',
      newPassword: '',
      passwordChangeSuccess: false,
		}
	},
	methods: {
    submitClicked ( formEvent ) {
      formEvent.preventDefault()
      let mockApiResponse = this.mockSuccess()
      if ( mockApiResponse.success ) {
        this.passwordChangeSuccess = true
        $scope.commit('setUsername', $route.query.username)
      }
      else {
        this.errorMessage = mockApiResponse.message
      }
    },

    mockError () {
      return { success: false, message: 'lol nice tryu ng' }
    },
    mockSuccess () {
      return { success: true }
    }
  },
  computed: {
    passwordValidity () {
      if ( this.newPassword.length === 0 ) { return undefined }
      else { return this.newPassword.length >= 6 }
    }
  },
  created: function () {
  }
}

</script>

<style lang="scss">
$linkColor: #3984d4;
$themeRed: #ec2f4b;

.error-message {
	color: $themeRed !important;
	font-weight: 400;
}

#newPasswordErrorMessage {
	margin-top: 16px;
  margin-bottom: -16px;
}

.dark {
  .login-register-form {
		color: white;
		input {
			color: #ccc;
		}
		label {
			color: #ccc;
		}
  }
}
</style>

