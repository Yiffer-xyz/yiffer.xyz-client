<template>
  <div id="app">
		<div class="theme-button-container">
			<span
				class="navigation-button underline-link" 
				@click="setTheme('light')" 
			>Light</span>

			<span
				class="navigation-button underline-link" 
				@click="setTheme('dark')"  
			>Dark</span>
		</div>

		<div class="theme-button-container theme-button-container-left">
			<router-link 
				:to="{ name: 'comicList' }"
				class="navigation-button underline-link"
				style="margin-left: 2px;">Home</router-link>

			<router-link 
				v-if="$store.getters.isAuthenticated"
				:to="{ name: 'account' }"
				class="navigation-button underline-link">Account</router-link>

			<router-link 
				v-if="$store.getters.isAuthenticated && ($store.getters.userData.userType === 'mod' || $store.getters.userData.userType === 'admin')"
				:to="{ name: 'admin' }"
				class="navigation-button underline-link">Admin</router-link>

			<span
				v-show="!$store.getters.isAuthenticated" 
				class="navigation-button underline-link" 
				@click="showLoginModal()">Log in</span>

			<span
				v-show="!$store.getters.isAuthenticated" 
				class="navigation-button underline-link" 
				@click="showSignupModal()">Sign up</span>

			<span 
				v-show="$store.getters.isAuthenticated" 
				class="navigation-button underline-link" 
				@click="logout()">Log out</span>
		</div>

		<login-modal v-show="$store.getters.getLoginModalVisibility()"></login-modal>
		<voting-modal v-show="$store.state.votingModalVisibility"></voting-modal>
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

		showSignupModal () {
			this.$store.commit('setLoginModalContext', 'register')
			this.showLoginModal()
		},

		logout () {
			this.$store.dispatch('logout')
			if (this.$router.history.current.fullPath == '/profile' || this.$router.history.current.fullPath == '/admin') {
				this.$router.replace('/')
			}
		}
	},

	data: function () {
		return {
			darkTheme: false
		}
	},

	created: function () {
		this.$store.dispatch('loadComicList')
		this.$cookies.config('60d')
		this.$store.dispatch('checkAndSetLoginStatus')
		this.$store.dispatch('fetchKeywordList')
		if (this.$cookies.get('theme') && this.$cookies.get('theme')==='dark') {
			this.setTheme('dark')
		}
		else {
			this.setTheme('light')
		}
	},

	watch: {
		'$route' (to, from) {
			console.log('Route changed from ' + from.path + ' to ' + to.path)
		}
	}
}
</script>

<style lang="scss">
@import "@/scss/button-styles.scss";
@import "@/scss/text-styles.scss";
@import "@/scss/general.scss";
</style>