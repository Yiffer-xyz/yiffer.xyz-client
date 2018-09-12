<template>
	<div id="modalAndBackdropWrapper">
		<span class="modal-backdrop"></span>
		<div id="loginModal">
			<div id="loginModalInnerWrapper">
				<h3>Log in</h3>
				<form class="login-register-form">
					<label for="loginUsername">Username</label>
					<input type="text"/>

					<label for="loginPassword">Password</label>
					<input type="password"/>

					<button type="submit" class="y-button">Log in</button>

				</form>
				<p class="link-text register-button"><u>Forgotten</u> login details?</p>
				<p class="link-text register-button">Click here to <u>register</u></p>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'login-modal',
	methods: {
	},
  data: function () {
		return {
    }
	},
	computed: {
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
	background: rgba(255, 255, 255, 0.5)
	z-index: 5
</style>

<style lang="scss">
$linkColor: #3984d4;
#loginModalInnerWrapper {
	width: 240px;
}

#loginModal {
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: 6;
	transform: translateX(-50%) translateY(-50%);
	display: flex;
	justify-content: center;
	padding: 40px 180px;
	background-color: white;
	border-top: 6px solid $linkColor;
	box-shadow: rgba(0,0,0,0.3) 0px 5px 28px 3px;
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
		margin-bottom: 17px;
		margin-top: 3px;
		border: 0.5px solid #555;
	}
}

.link-text {
	color: $linkColor;
	&:hover {
		cursor: pointer;
	}
}

.register-button {
	font-size: 14px;
	text-align: center;
	margin-top: 20px;
}
</style>

<style>
	@media (max-width: 795px) {
	}
</style>
