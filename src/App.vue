<template>
  <div id="app">
		<div class="theme-button-container">

			<button
				v-if="!this.$store.state.username" 
				class="theme-button" 
				@click="showLoginModal()" 
				v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}"
			>
				Log in
			</button>

			<button 
				v-if="this.$store.state.username" 
				class="theme-button" 
				@click="logout()" 
				v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}"
			>
				Log out
			</button>

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
			}
			else {
				document.body.classList.remove('dark')
				this.$store.commit('setDarkTheme', false)
			}
		},
		showLoginModal () {
			this.$store.commit('setLoginModalVisibility', true)
		},
		logout () {
			this.$store.commit('setUsername', undefined)
		}
	},
	data: function () {
		return { darkTheme: false }
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

<style lang="sass">
$linkColor: #3984d4
$themeRed: #ec2f4b

div, table, span, img, body, h1, h2, h3, p
	margin: 0px

router-link, p, td
	font-weight: 300

h1, h2, h3, h4, p, div, span
	color: #111

h1
	font-weight: 300
	font-size: 70px
	margin-top: 50px

h2
	font-weight: 300
	font-size: 35px

a
	color: $linkColor
	font-weight: 400

label
	font-weight: 300

.theme-button-container
	position: absolute
	top: 0
	right: 3px

.theme-button
	background: transparent
	border: none
	color: #009fff
	padding: 
	&:hover
		cursor: pointer
		background: rgba(255, 255, 255, 0.1)
	&:focus
		outline: none

.theme-button-white-text
	color: white
	background: rgba(255, 255, 255, 0.2)
	&:hover
		background: rgba(255, 255, 255, 0.4)

.y-button, .vote-button
	border: 0.8px solid $linkColor
	border-radius: 5px
	color: $linkColor
	background: rgba(0,0,0,0)
	padding: 4px 9px

	&:hover
		background-color: $linkColor
		color: white
		cursor: pointer

.y-button-small
	border: 0.8px solid $linkColor
	border-radius: 5px
	color: $linkColor
	background: rgba(0,0,0,0)
	padding: 2px 6px

	&:hover
		background-color: $linkColor
		color: white
		cursor: pointer

.y-button-red
	color: $themeRed
	border-color: $themeRed
	&:hover
		background-color: $themeRed

.y-button-disabled
	color: #999
	border-color: #999
	&:hover
		cursor: not-allowed
		color: #999
		background: none

.dark
	background-color: #091014
	p, h1, h2, div, td, h3, span
		color: #ddd
</style>

<style lang="scss">
	$themeBlue: #009fff;
	$themeRed: #ec2f4b;
	$linkColor: #3984d4;

	.link-color {
		color: $linkColor !important;
	}

	.text-button {
		font-size: 14px;
		text-align: center;
		font-weight: 300;
		font-family: 'Open Sans', sans-serif;
		background: transparent;
		border: none;
		color: $linkColor;
		padding: 0px;
		margin: 0px;
		&:hover {
			cursor: pointer;
		}
	}
</style>