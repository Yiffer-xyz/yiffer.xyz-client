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
			if ( themeColor === 'dark' ) {
				document.body.classList.add('dark')
				this.$store.commit('setDarkTheme', true)
				this.$cookies.set('theme', 'dark')
			}
			else {
				document.body.classList.remove('dark')
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

$theme0: #2f0018;
$theme1: #004934;
$theme2: #006d4d;
$theme3: #007754;
$theme4: #00986b;
$theme5: #00d596;
$theme6: #78fdd6;
$theme7: #ffd8ec;
$themeGray0: #fafafa;
$themeGray1: #e7e7e7;
$themeGray2: #dcdcdc;
$themeGray3: #cbcbcb;
$themeGray4: #b0b0b0;
$themeGray5: #a6a6a6;
$themeGray6: #9a9a9a;
$themeGray7: #8e8e8e;
$themeGray8: #7e7e7e;
$themeRed0: #6b090b;
$themeRed1: #a90509;
$themeRed2: #c80005;
$themeRed3: #fd8f91;

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
	padding: 4px 9px;
	font-family: 'Open Sans', sans-serif;
	// box-shadow: 0px 1px 1px 0px rgba(130,130,130,1);
	background: $theme5;
	color: white;
	border: none;

	&:hover {
		background-color: $theme4;
		color: white;
		cursor: pointer;
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

body {
	background-color: #fafafa;
}

.dark {
	background-color: #091014;
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
}
</style>