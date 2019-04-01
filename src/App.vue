<template>
  <div id="app">
		<div class="theme-button-container">
			<button 
				class="theme-button" 
				@click="setTheme('light')" 
				style="margin-left:10px;"
			>
				Light
			</button>

			<button 
				class="theme-button" 
				@click="setTheme('dark')"  
			>
				Dark
			</button>
		</div>

		<div class="theme-button-container theme-button-container-left">
			<router-link 
				:to="{ name: 'comicList' }"
				class="theme-button"
			>
				<button class="theme-button">Home</button>
			</router-link>

			<button
				v-if="!$store.getters.isAuthenticated" 
				class="theme-button" 
				style="margin-left: 3px;"
				@click="showLoginModal()" 
			>
				Log in
			</button>


			<button 
				v-if="$store.getters.isAuthenticated" 
				class="theme-button" 
				style="margin-left: 3px;"
				@click="logout()" 
			>
				Log out
			</button>


			<router-link 
				v-if="$store.getters.isAuthenticated"
				style="margin-left: 3px;"
				:to="{ name: 'account' }"
				class="theme-button"
			>
				<button class="theme-button">Account</button>
			</router-link>


			<router-link 
				v-if="$store.getters.isAuthenticated && ($store.getters.userData.userType === 'mod' || $store.getters.userData.userType === 'admin')"
				style="margin-left: 3px;"
				:to="{ name: 'admin' }"
				class="theme-button"
			>
				<button class="theme-button">Admin</button>
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
			this.$store.dispatch('logout')
			if (this.$router.history.current.fullPath == '/profile' || this.$router.history.current.fullPath == '/admin') {
				this.$router.replace('/')
			}
		}
	},
	data: function () {
		return { darkTheme: false }
	},
	created: function () {
		this.$store.dispatch('loadComicList')
		this.$cookies.config('60d')
		this.$store.dispatch('checkAndSetLoginStatus')
		if (this.$cookies.get('theme') && this.$cookies.get('theme')==='dark') {
			this.setTheme('dark')
		}
		else {
			this.setTheme('light')
		}
	}
}
</script>