<template>
	<div id="modalAndBackdropWrapper">
		<span class="modal-backdrop"></span>
		<div class="loginModal">

			<div v-if="loginMode" class="loginModalInnerWrapper">
				<p class="modal-header">Log in</p>
				<form class="login-register-form">
					<label for="loginUsername">Username</label>
					<input v-model="loginUsername" name="loginUsername" type="text"/>

					<label for="loginPassword">Password</label>
					<input v-model="loginPassword" name="loginPassword" type="password"/>

					<button v-on:click="loginConfirmClicked" type="submit" class="y-button login-button">Log in</button>
				</form>

				<button v-on:click="toggleLoginModal()" class="text-button">Click here to <u>sign up</u></button>
				<router-link :to="'/forgottenpassword'" class="register-button" style="text-align: center;"><u>Forgot</u> login details?</router-link>
			</div>

			<div v-if="!loginMode" class="loginModalInnerWrapper">
				<p class="modal-header">Sign up</p>
				<form class="login-register-form">
					<label for="signupUsername">Username</label>
					<input 
						v-model="signupUsername"
						v-bind:class="{'valid-input': usernameValidity===true, 'invalid-input': usernameValidity===false}"
						name="signupUsername"
						type="text"
					/>

					<label for="signupPassword">Password</label>
					<input
						v-bind:class="{'valid-input': passwordValidity===true, 'invalid-input': passwordValidity===false}"
						v-model="signupPassword"
						name="signupPassword"
						type="password"
					/>

					<label for="signupEmail">Email</label>
					<input v-model="signupEmail" name="signupEmail" type="email"/>

					<button v-on:click="singupConfirmClicked" type="submit" class="y-button login-button">Sign up</button>
				</form>

				<button v-on:click="toggleLoginModal()" class="text-button">Click here to <u>log in</u></button>
			</div>

		</div>
	</div>
</template>

<script>

export default {
	name: 'login-modal',
	methods: {
		toggleLoginModal () {
			this.loginMode = !this.loginMode
			this.emptyInputFields()
		},
		loginConfirmClicked ( buttonEvent ) {
			buttonEvent.preventDefault()
			alert('log in placeholder')
		},
		singupConfirmClicked ( buttonEvent ) {
			buttonEvent.preventDefault()
			console.log (this.usernameValidity, this.passwordValidity)
			alert('signup placeholder')
		},
		emptyInputFields () {
			this.loginUsername = ''
			this.loginPassword = ''
			this.signupUsername = ''
			this.signupPassword = ''
			this.signupEmail = ''
		},
	},
  data: function () {
		return {
			loginMode: true,
			loginUsername: '',
			loginPassword: '',
			signupUsername: '',
			signupPassword: '',
			signupEmail: '',
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
		}
	}
}
</script>


<style lang="sass">
$linkColor: #3984d4

.modal-backdrop
	width: 100%
	height: 100%
	position: fixed
	top: 0
	left: 0
	background: rgba(255, 255, 255, 0.95)
	z-index: 5
</style>

<style lang="scss">
$linkColor: #3984d4;
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
}
.loginModal:before {
	height: 10px;
	width: 100%;

	position: absolute;
	content: "";
	background: linear-gradient(to right, rgb(0, 159, 255), rgb(236, 47, 75));
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
		border-width: 2px;
		border-style: solid;
		border-color: #555;
		border-top-color: transparent;
		border-left-color: transparent;
		border-right-color: transparent;
		color: #333;
		padding: 5px 4px;
	}

	.invalid-input {
		border: 2px solid #ec2f4b;
	}
	.valid-input {
		border: 2px solid #009fff;
	}
}

.text-button {
	font-size: 14px;
	text-align: center;
	margin-top: 20px;
	font-weight: 300;
	font-family: 'Open Sans', sans-serif;
	background: transparent;
	border: none;
	color: $linkColor;
	&:hover {
		cursor: pointer;
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
}

.modal-header {
	font-size: 35px;
	font-weight: 400;
}
</style>

<style>
	@media (max-width: 795px) {
	}
</style>
