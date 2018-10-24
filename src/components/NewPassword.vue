<template>
	<div style="width: 100%; display: flex; align-items: center; flex-direction: column;">
    <h1>Create new password</h1>

      <back-to-index style="margin-bottom: 16px;"></back-to-index>

      <p>Username: {{$route.query.username}}</p>
      <p>Email: {{$route.query.email}}</p>

      <p v-if="passwordChangeSuccess" style="margin-top: 32px; font-weight: 600;">
        Password successfully changed!
      </p>
      
      <p v-if="errorMessage" class="error-message">{{errorMessage}}</p>
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

.login-register-form {
	display: flex;
	flex-direction: column;
	margin-top: 32px;
  width: 200px;
	label {
		font-size: 14px;
		color: #555;
	}
	input {
		outline: none;
		margin-bottom: 17px;
		margin-top: 3px;
		border: 0.5px solid #555;
		border-color: transparent transparent #555 transparent;
		color: #333;
		background: transparent;
		padding: 6px 4px;
	}
	.invalid-input {
		border: 2px solid #ec2f4b !important;
		padding: 4.5px 2.5px;
	}
	.valid-input {
		border: 2px solid #009fff !important;
		padding: 4.5px 2.5px;
	}
}

.error-message {
	margin-top: 16px;
  margin-bottom: -16px;
	color: $themeRed !important;
	font-weight: 400;
}

.dark {
  .login-register-form {
		color: white;
		input {
			color: #ccc;
			border-bottom-color: #ccc;
		}
		label {
			color: #ccc;
		}
  }
}
</style>

