<template>
	<button class="y-button voting-button-todo" 
					@click="showVotingOrLoginModal()" 
					:class="{'disabled-voting-button': !$store.getters.isAuthenticated}">

		<span v-if="$store.getters.isAuthenticated">
			<star-icon/> Rate
		</span>

		<span v-else>
			<login-icon/> Log in to rate
		</span>
	</button>
</template>

<script>
import LoginIcon from 'vue-material-design-icons/Login.vue'
import StarIcon from 'vue-material-design-icons/Star.vue'

export default {
	name: 'votingButton',
	components: {
		'login-icon': LoginIcon,
		'star-icon': StarIcon,
	},
	props: {
		comic: Object,
	},
	methods: {
		showVotingOrLoginModal () {
			if (this.$store.getters.isAuthenticated) {
				this.$store.commit('setComicForVotingModal', this.comic)
				this.$store.commit('setVotingModalVisibility', true)
			}
			else {
				this.$store.commit('setLoginModalVisibility', true)
			}
		}
	}
}
</script>

<style lang="scss">
.voting-button-todo {
	@media (max-width: 900px) {
		padding: 3px 9px 3px 6px !important;
	}
}
</style>
