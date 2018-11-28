<template>
  <div id="app">
		<div class="theme-button-container">
			<button 
				class="theme-button" 
				@click="setTheme('light')" 
				v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}" 
				style="margin-left:10px;"
			>
				Light
			</button>

			<button 
				class="theme-button" 
				@click="setTheme('dark')"  
				v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}"
			>
				Dark
			</button>

			<button 
				class="theme-button" 
				@click="setTheme('redblue')"  
				v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}"
			>
				Redblue
			</button>

			<button 
				class="theme-button" 
				@click="setTheme('pink')"  
				v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}"
			>
				Pink
			</button>
		</div>

		<div class="theme-button-container theme-button-container-left">
			<router-link 
				:to="{ name: 'comicList' }"
				class="theme-button"
			>
				<button class="theme-button" v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}">
					Home
				</button>
			</router-link>

			<button
				v-if="!$store.state.username" 
				class="theme-button" 
				style="margin-left: 3px;"
				@click="showLoginModal()" 
				v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}"
			>
				Log in
			</button>


			<button 
				v-if="$store.state.username" 
				class="theme-button" 
				style="margin-left: 3px;"
				@click="logout()" 
				v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}"
			>
				Log out
			</button>

			<router-link 
				v-if="$store.state.userType === 'mod' || $store.state.userType === 'admin'"
				style="margin-left: 3px;"
				:to="{ name: 'admin' }"
				class="theme-button"
			>
				<button class="theme-button" v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}">
					Admin
				</button>
			</router-link>
		</div>

		<login-modal v-if="$store.state.loginModalVisibility"></login-modal>
		<voting-modal v-if="$store.state.votingModalVisibility"></voting-modal>
    <router-view/>
  </div>
</template>

<script>
import LoginModal from '@/components/LoginModal.vue'
import VotingModal from '@/components/VotingModal.vue'
export default {
	components: { 'login-modal': LoginModal, 'voting-modal': VotingModal },
	methods: {
		setTheme( themeColor ) {
			document.body.classList.remove('dark')
			document.body.classList.remove('redblue')
			document.body.classList.remove('pink')
			if ( themeColor === 'dark' ) {
				document.body.classList.add('dark')
				this.$store.commit('setDarkTheme', true)
				this.$cookies.set('theme', 'dark')
			}
			else if ( themeColor === 'redblue') {
				document.body.classList.add('redblue')
				this.$store.commit('setDarkTheme', false)
				this.$cookies.set('theme', 'light')
			}
			else if ( themeColor === 'pink') {
				document.body.classList.add('pink')
				this.$store.commit('setDarkTheme', false)
				this.$cookies.set('theme', 'light')
			}
			else {
				this.$store.commit('setDarkTheme', false)
				this.$cookies.set('theme', 'light')
			}
		},
		showLoginModal () {
			this.$store.commit('setLoginModalVisibility', true)
		},
		logout () {
			this.$store.commit('setUsername', undefined)
			this.$store.commit('setUserType', undefined)
		}
	},
	data: function () {
		return { darkTheme: false }
	},
	created: function () {
		this.$cookies.config('60d')
		if (this.$cookies.get('theme') && this.$cookies.get('theme')==='dark') {
			this.setTheme('dark')
		}
		else {
			this.setTheme('light')
		}
	}
}
</script>


<style>
#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
	text-align: center;
}
</style>

<style lang="scss">

$theme0: #0d201b;
$theme1: #0e4736;
$theme2: #006d4d;
$theme3: #00855e;
$theme3p5: #008f65;
$theme4: #00986b;
$theme4p5: #00ab79;
$theme5: #00d596;
$theme6: #78fdd6;
$theme7: #a9ffe6;
$themeGray0: #fafafa;
$themeGray1: #e7e7e7;
$themeGray2: #dcdcdc;
$themeGray3: #cbcbcb;
$themeGray4: #b0b0b0;
$themeGray5: #a6a6a6;
$themeGray6: #9a9a9a;
$themeGray7: #8e8e8e;
$themeGray8: #7e7e7e;
$themeDark1: #484e54;
$themeDark2: #383f45;
$themeDark3: #26302c;
$themeDark4: #1a201f;
$themeDark5: #0a0e0c;
$themeRed0: #6b090b;
$themeRed1: #a90509;
$themeRed2: #c80005;
$themeRed3: #fd8f91;
$themeBlue0: #090f14;
$themeBlue0p5: #0b1116;
$themeBlue1: #0e1a27;

div, table, span, img, body, h1, h2, h3, p {
	margin: 0px;
}

router-link, p, td {
	font-weight: 300;
}

h1, h2, h3, h4, p, div, span {
	color: #111;
}

h1 {
	font-weight: 300;
	font-size: 70px;
	margin-top: 32px;
}

h2 {
	font-weight: 300;
	font-size: 35px;
}

a {
	color: $theme4;
	font-weight: 400;
}

label {
	font-weight: 300;
}

::selection {
	background: rgba(120, 253, 214, 0.5);
}

.theme-button-container {
	position: absolute;
	top: 0;
	right: 3px;
}

.theme-button-container-left {
	left: 3px;
	right: auto;
}

.theme-button {
	background: transparent;
	border: none;
	color: $theme4;
	&:hover {
		cursor: pointer;
		background: rgba(255, 255, 255, 0.1);
	}
	&:focus {
		outline: none;
	}
}

.theme-button-white-text {
	// color: white;
	// background: $themeGray1;
	// &:hover {
	// 	background: rgba(255, 255, 255, 0.4);
	// }
}

.y-button, .vote-button {
	border: 0.8px solid $theme4;
	border-radius: 5px;
	color: $theme4;
	background: rgba(0,0,0,0);
	padding: 5px 10px;
	font-family: 'Open Sans', sans-serif;
	font-size: 14px;
	// box-shadow: 0px 1px 1px 0px rgba(130,130,130,1);
	background: $theme5;
	color: white;
	border: none;

	&:hover {
		background-color: $theme4;
		color: white;
		cursor: pointer;
	}

	span {
		color: white;
	}
}

.y-button-small {
	font-family: 'Open Sans', sans-serif;
	// box-shadow: 0px 1px 1px 0px rgba(130,130,130,1);
	// border: 0.8px solid $theme4;
	border-radius: 5px;
	// color: $theme4;
	// background: rgba(0,0,0,0);
	background: $theme5;
	color: white;
	padding: 2px 6px;
	border: none;

	&:hover {
		// background-color: $theme4;
		// color: white;
		background-color: $theme4;
		cursor: pointer;
	}
}

.y-button-red {
	background: $themeRed2;
	&:hover {
		background-color: $themeRed1;
	}
}

.y-button-disabled {
	background: transparent;
	background: $themeGray1;
	color: #444;
	// border-color: #444;
	&:hover {
		cursor: not-allowed;
		color: #444;
		background: $themeGray1;
	}
}

.y-button-neutral {
	background-color: $themeGray7 !important;
	&:hover {
		background-color: $themeDark1 !important;
	}
}

body {
	background-color: #fafafa;
}

.dark {
	background-color: #090f14;
	p, h1, h2, div, td, h3, span {
		color: #ddd;
	}
}

option, select, input {
	font-family: 'Open Sans', sans-serif;
}

.link-color {
	color: $theme4 !important;
}

.link-color-light {
	color: $theme5 !important;
}

.red-color {
	color: $themeRed2 !important;
}

.text-button {
	font-size: 14px;
	text-align: center;
	font-weight: 300;
	font-family: 'Open Sans', sans-serif;
	background: transparent;
	border: none;
	color: $theme4;
	padding: 0px;
	margin: 0px;
	&:hover {
		cursor: pointer;
	}
}

.success-message {
	color: #20ad0a !important;
	font-weight: 400;
	margin-bottom: 0px !important;
}

.error-message {
	color: $themeRed2 !important;
	font-weight: 400;
	margin-bottom: 0px !important;
}

.courier {
	font-family: 'Courier New', Courier, monospace;
	font-size: 13px;
}

.vertical-flex {
	display: flex;
	flex-direction: column;
}

.cursor-pointer {
	&:hover {
		cursor: pointer;
	}
}

.no-margin-bot {
	p, select, button {
		margin-bottom: 0 !important;
	}
}

.no-margin-top {
	margin-top: 0 !important;
}

h1 {
	@media (max-width: 900px) {
		font-size: 48px;
		margin-top: 24px;
	}
}

.whole-body-text {
	width: 70%;
	margin: auto;
	text-align: left;

	@media (max-width: 900px) {
		width: 90%;
	}

	p {
		margin-top: 16px;
	}
}

.dark {
	input {
		background: rgb(22, 26, 29);
		border: 1px solid #666;
		color: white;
	}

	option, select {
		background: rgb(22, 26, 29);
		color: white;
		border: 1px solid #666;
	}

	.link-color, a, .theme-button {
		color: $theme5 !important;
	}

	.y-button {
		background-color: $theme4p5;
		&:hover {
			background-color: $theme3;
		}
	}

	.y-button-red {
		background: $themeRed1;
		&:hover {
			background-color: $themeRed0;
		}
	}}










.redblue {
	$theme4: #0075bf;
	$theme5: #008fea;
	$themeRed: #ec2f4b;
	$themeRedDark1: #bc0e27;
	$gradientLeft: $theme5;
	$gradientRight: $themeRed;
	.y-button, .y-button-small, .button-selected {
		background-color: $theme5 !important;
	}
	.y-button, .y-button-small {
		&:hover {
			background-color: $theme4 !important;
		}
	}
	.y-button-red {
		background-color: $themeRed !important;
		&:hover {
			background-color: $themeRedDark1 !important;
		}
	}
	.y-button-disabled {
		background-color: $themeGray3 !important;
		&:hover {
			background-color: $themeGray3 !important;
		}
	}
	.link-color, a, .theme-button, .text-button {
		color: $theme5 !important;
	}
	.circled-text-red {
		border-color: $themeRed !important;
	}
	.keyword-button {
		color: $theme5 !important;
		border-color: $theme5 !important;
	}
	.loginModal:before, .voting-modal:before {
		background: linear-gradient(to right, $gradientLeft, $gradientRight);
	}
	.invalid-input {
		border: 2px solid $themeRed !important;
		padding: 4.5px 2.5px;
	}
	.valid-input {
		border: 2px solid $theme5 !important;
		padding: 4.5px 2.5px;
	}
	.comic-card {
		&:hover {
			box-shadow: 0 0 10px 1px $theme4;
		}
	}
	.vote-box-colored-1 { background-color: #009FFF; color: white; }
	.vote-box-colored-2 { background-color: #1A92EB; color: white; }
	.vote-box-colored-3 { background-color: #3486D7; color: white; }
	.vote-box-colored-4 { background-color: #4E79C3; color: white; }
	.vote-box-colored-5 { background-color: #686DAF; color: white; }
	.vote-box-colored-6 { background-color: #83609B; color: white; }
	.vote-box-colored-7 { background-color: #9D5487; color: white; }
	.vote-box-colored-8 { background-color: #B74773; color: white; }
	.vote-box-colored-9 { background-color: #D13B5F; color: white; }
	.vote-box-colored-10 { background-color: #EC2F4B; color: white; }
	.vote-box-uncolored {
		background-color: #f7f7f7;
		color: #222;
	}
}









.pink {
	$theme4: #ce1877;
	$theme5: #ee1185;
	$themeRed: #ec2f4b;
	$themeRedDark1: #bc0e27;
	$gradientLeft: #920550;
	$gradientRight: #ff8bc7;
	.y-button, .y-button-small, .button-selected {
		background-color: $theme5 !important;
	}
	.y-button, .y-button-small {
		&:hover {
			background-color: $theme4 !important;
		}
	}
	.y-button-red {
		background-color: $themeRed !important;
		&:hover {
			background-color: $themeRedDark1 !important;
		}
	}
	.y-button-disabled {
		background-color: $themeGray3 !important;
		&:hover {
			background-color: $themeGray3 !important;
		}
	}
	.link-color, a, .theme-button, .text-button {
		color: $theme5 !important;
	}
	.circled-text-red {
		border-color: $themeRed !important;
	}
	.keyword-button {
		color: $theme5 !important;
		border-color: $theme5 !important;
	}
	.loginModal:before, .voting-modal:before {
		background: linear-gradient(to right, $gradientLeft, $gradientRight);
	}
	.invalid-input {
		border: 2px solid $themeRed !important;
		padding: 4.5px 2.5px;
	}
	.valid-input {
		border: 2px solid $theme5 !important;
		padding: 4.5px 2.5px;
	}
	.comic-card {
		&:hover {
			box-shadow: 0 0 10px 1px $theme4;
		}
	}
	.vote-box-colored-1 { background-color: #009FFF; color: white; }
	.vote-box-colored-2 { background-color: #1A92EB; color: white; }
	.vote-box-colored-3 { background-color: #3486D7; color: white; }
	.vote-box-colored-4 { background-color: #4E79C3; color: white; }
	.vote-box-colored-5 { background-color: #686DAF; color: white; }
	.vote-box-colored-6 { background-color: #83609B; color: white; }
	.vote-box-colored-7 { background-color: #9D5487; color: white; }
	.vote-box-colored-8 { background-color: #B74773; color: white; }
	.vote-box-colored-9 { background-color: #D13B5F; color: white; }
	.vote-box-colored-10 { background-color: #EC2F4B; color: white; }
	.vote-box-uncolored {
		background-color: #f7f7f7;
		color: #222;
	}
}


.pink, .redblue {
	.y-button-neutral {
		background-color: $themeGray7 !important;
		&:hover {
			background-color: $themeDark1 !important;
		}
	}
}
.dark {
	.y-button-neutral {
		background-color: $themeDark1 !important;
		&:hover {
			background-color: $themeDark2 !important;
		}
	}
}

</style>