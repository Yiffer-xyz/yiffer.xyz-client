<template>
	<div id="modalAndBackdropWrapper">
		<span class="modal-backdrop" v-on:click="closeModal()"></span>
		<div class="loginModal">

			<div v-if="modalContext==='login'" class="loginModalInnerWrapper">
				<p class="modal-header">Log in</p>
				<p v-if="loginErrorMessage" class="modal-error-message">{{loginErrorMessage}}</p>
				<form @submit="loginConfirmClicked" class="login-register-form">
					<label for="loginUsername">Username or email</label>
					<input v-model="loginUsername" name="loginUsername" type="text"/>

					<label for="loginPassword">Password</label>
					<input v-model="loginPassword" name="loginPassword" type="password"/>

					<button v-if="!loginLoading" type="submit" class="y-button login-button">Log in</button>
					<button v-if="loginLoading" class="y-button login-button pleasewait-button">Please wait...</button>
				</form>

				<button v-on:click="setModalContext('register')" class="text-button">Click here to <u>sign up</u></button>
				<button v-on:click="setModalContext('forgotten')" class="text-button"><u>Forgot</u> account details?</button>
			</div>


			<div v-if="modalContext==='register'" class="loginModalInnerWrapper">
				<p class="modal-header">Sign up</p>
				<p v-if="signupErrorMessage" class="modal-error-message">{{signupErrorMessage}}</p>
				<form @submit="signupConfirmClicked" class="login-register-form">
					<label for="signupUsername">Username</label>
					<input
						v-model="signupUsername"
						v-bind:class="{'valid-input': usernameValidity===true, 'invalid-input': usernameValidity===false}"
						name="signupUsername"
						type="text"
					/>

					<label for="signupPassword">Password</label>
					<input
						v-model="signupPassword"
						v-bind:class="{'valid-input': passwordValidity===true, 'invalid-input': passwordValidity===false}"
						name="signupPassword"
						type="password"
					/>

					<label for="signupEmail">Email <span style="font-size: 10px">(no spam!)</span></label>
					<input 
						v-model="signupEmail" 
						v-bind:class="{'valid-input': emailValidity===true, 'invalid-input': emailValidity===false}"
						name="signupEmail" 
						type="text" 
						style="margin-bottom: 5px;"
					/>
					<p class="modal-input-explanation">Email required only for recovery purposes. By default, 
						<u>no</u> emails will be sent, except for a "welcome" message. If you wish to be notified 
						of new comics or updates to existing ones, you may turn this on in your account settings.</p>

					<button v-if="!signupLoading" type="submit" class="y-button login-button">Sign up</button>
					<button v-if="signupLoading" class="y-button login-button pleasewait-button">Please wait...</button>
				</form>

				<button v-on:click="setModalContext('login')" class="text-button">Click here to <u>log in</u></button>
				<button v-on:click="setModalContext('forgotten')" class="text-button"><u>Forgot</u> account details?</button>
			</div>


			<div v-if="modalContext==='forgotten'" class="loginModalInnerWrapper">
				<p class="modal-header">Forgotten account details?</p>
				<p v-if="forgottenErrorMessage" class="modal-error-message">{{forgottenErrorMessage}}</p>
				<p v-if="forgottenSuccessMessage" style="margin: 20px 0;">
					<i class="fas fa-check-circle"></i> {{forgottenSuccessMessage}}
				</p>
				<form @submit="forgottenConfirmClicked" v-if="!forgottenSuccessMessage" class="login-register-form">
					<label for="forgottenUsername">Username or email</label>
					<input v-model="forgottenUsername" name="forgottenUsername" type="text" style="margin-bottom: 5px;">

					<p class="modal-input-explanation">Link for creating a new password will be sent to the input email, or the 
						email address associated with the input username.</p>


					<button v-if="!forgottenLoading" type="submit" class="y-button login-button">Submit</button>
					<button v-if="forgottenLoading" class="y-button login-button pleasewait-button">Please wait...</button>
				</form>

				<button v-on:click="setModalContext('login')" class="text-button">Click here to <u>log in</u></button>
				<button v-on:click="setModalContext('register')" class="text-button">Click here to <u>sign up</u></button>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'login-modal',
	data: function () {
		return {
			modalContext: 'login',

			loginUsername: '',
			loginPassword: '',
			loginErrorMessage: '',
			loginLoading: false,

			signupUsername: '',
			signupPassword: '',
			signupEmail: '',
			signupErrorMessage: '',
			signupLoading: false,

			forgottenUsername: '',
			forgottenErrorMessage: '',
			forgottenSuccessMessage: '',
			forgottenLoading: false,
		}
	},
	methods: {
		setModalContext ( modalContext ) {
			this.modalContext = modalContext
			this.emptyInputFields()
			this.clearErrorMessages()
		},
		loginConfirmClicked ( buttonEvent ) {
			buttonEvent.preventDefault()
			this.loginLoading = true
			let mockApiResponse = this.mockLoginError()

			this.loginLoading = false
			if ( mockApiResponse.success ) {
				this.$store.commit('setUsername', mockApiResponse.username)
				this.closeModal()
			}
			else {
				this.emptyInputFields()
				this.loginErrorMessage = mockApiResponse.message
			}
		},
		signupConfirmClicked ( buttonEvent ) {
			buttonEvent.preventDefault()
			this.signupLoading = true
			let mockApiResponse = this.mockSignupSuccess()

			this.signupLoading = false
			if ( mockApiResponse.success ) {
				this.$store.commit('setUsername', mockApiResponse.username)
				this.$store.commit('setUserType', 'admin') //todoooooooooooooooo
				this.closeModal()
			}
			else {
				this.emptyInputFields()
				this.signupErrorMessage = mockApiResponse.message
			}
		},
		forgottenConfirmClicked ( buttonEvent ) {
			buttonEvent.preventDefault()
			this.forgottenLoading = true
			let mockApiResponse = this.mockForgottenError()

			this.forgottenLoading = false
			if ( mockApiResponse.success ) {
				this.forgottenSuccessMessage = 'Link for resetting password sent to your email!'
			}
			else {
				this.forgottenErrorMessage = mockApiResponse.message
			}
		},
		emptyInputFields () {
			this.loginUsername = ''
			this.loginPassword = ''
			this.signupUsername = ''
			this.signupPassword = ''
			this.signupEmail = ''
			this.forgottenUsername = ''
		},
		clearErrorMessages () {
			this.signupErrorMessage = ''
			this.loginErrorMessage = ''
			this.forgottenErrorMessage = ''
		},
		closeModal () {
			this.$store.commit('setLoginModalVisibility', false)
			this.setModalContext('login')
		},

		mockLoginError () {
			return { success: false, message: 'User does not exist' }
		},
		mockLoginSuccess () {
			return { success: true, username: 'exempeluser' }
		},
		mockSignupError () {
			return { success: false, message: 'Password is too short' }
		},
		mockSignupSuccess () {
			return { success: true, username: 'tullebruker22' }
		},
		mockForgottenSuccess () {
			return { success: true }
		},
		mockForgottenError () {
			return { success: false, message: 'Username/email does not exist' }
		}
	},
	computed: {
		usernameValidity () {
			let validUsernamePattern = /^[a-zA-Z][\w\d_-]{1,19}$/
			if ( this.signupUsername.length === 0 ) { return undefined }
			else { return validUsernamePattern.test( this.signupUsername ) }
		},
		passwordValidity () {
			if ( this.signupPassword.length === 0 ) { return undefined }
			else { return this.signupPassword.length >= 6 }
		},
		emailValidity() {
			let validEmailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if ( this.signupEmail.length === 0 ) { return undefined }
			else { return validEmailPattern.test( this.signupEmail ) }
		}
	}
}
</script>


<style lang="scss">
.modal-backdrop {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(255, 255, 255, 0.95);
	z-index: 5;
	&:hover {
		cursor: pointer;
	}
}

.loginModalInnerWrapper {
	width: 240px;
	display: flex;
	flex-direction: column;
}

.loginModal {
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: 6;
	transform: translateX(-50%) translateY(-50%);
	display: flex;
	justify-content: center;
	padding: 40px 180px;
	background-color: white;
	box-shadow: rgba(0,0,0,0.3) 0px 5px 28px 3px;
	transform: translateX(-50%) translateY(-50%);

	.text-button {
		margin-top: 5px;
	}

	@media (max-width: 900px) {
		padding: 40px 0px;
		width: 100%;
	}
}
.loginModal:before {
	height: 10px;
	width: 100%;

	position: absolute;
	content: "";
	// background: linear-gradient(to right, rgb(0, 159, 255), rgb(236, 47, 75));
	background: linear-gradient(to right, $theme2, $theme6);
	top: -3px;

}

.login-register-form {
	display: flex;
	flex-direction: column;
	margin-top: 15px;
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
		border: 2px solid #ec2f4b !important; //todo
		padding: 4.5px 2.5px;
	}
	.valid-input {
		border: 2px solid $theme5 !important; //todo works? rett farge ??
		padding: 4.5px 2.5px;
	}
}

.register-button {
	font-size: 14px;
	font-weight: 300;
	margin-top: 10px;
}

.login-button {
	padding: 6px 30px;
	align-self: center;
	margin-bottom: 32px;
}

.modal-header {
	font-size: 35px;
	font-weight: 400;
}

.modal-input-explanation {
	font-size: 12px;
	margin-bottom: 16px;
}

.modal-error-message {
	margin-top: 5px;
	color: $themeRed2 !important;
	font-weight: 400;
}

.pleasewait-button {
	background-color: $theme5; //todo wut
	color: white;
	cursor: pointer;
	&:hover {
		cursor: default !important;
	}
}

.dark {
	.loginModal {
		background-color: $themeBlue0p5;
		color: white;
		input {
			color: #ccc;
			background-color: transparent;
			border-top: none;
			border-left: none;
			border-right: none;
		}
		label {
			color: #ccc;
		}
	}
	
	.modal-backdrop {
		background-color: rgba(0, 0, 0, 0.7);
	}
}
</style>

<style>
	@media (max-width: 795px) {
	}
</style>
