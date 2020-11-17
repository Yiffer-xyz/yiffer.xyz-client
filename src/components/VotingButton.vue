<template>
	<button class="y-button voting-button-todo" 
					@click="showVotingOrLoginModal()" 
					:class="{'disabled-voting-button': !$store.getters.isAuthenticated}">

		<span v-if="$store.getters.isAuthenticated && comic.yourRating !== null && comic.yourRating !== 0"
					class="lessIconMarginContainer">
			You: {{comic.yourRating}} <StarIcon />
		</span>

		<span v-else-if="$store.getters.isAuthenticated">
			<StarIcon title=""/> Rate
		</span>

	</button>
</template>

<script>
import LoginIcon from 'vue-material-design-icons/Login.vue'
import StarIcon from 'vue-material-design-icons/Star.vue'

export default {
	name: 'votingButton',
	components: {
		LoginIcon, StarIcon,
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

.lessIconMarginContainer {
	span {
		margin: auto -2px;
	}
}
</style>
