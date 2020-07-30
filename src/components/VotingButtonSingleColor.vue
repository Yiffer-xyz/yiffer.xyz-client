<template>
  <button class="voting-button-single-color" @click="showSomeModal()" :class="{'disabled-voting-button': !$store.getters.isAuthenticated}">
    {{$store.getters.isAuthenticated ? 'Vote' : 'Log in to vote'}}
  </button>
</template>

<script>
	export default {
		name: 'votingButton',
		props: {
			comic: Object,
		},
		methods: {
			showSomeModal () {
				if (this.$store.getters.isAuthenticated) {
					this.$store.commit('setComicForVotingModal', this.comic)
					this.$store.commit('setVotingModalVisibility', true)
				}
				else {
					this.$store.commit('setLoginModalVisibility', true)
				}
			}
		},
	}
</script>

<style lang="scss">
	.voting-button-single-color {
    background: transparent;
		color: #00a84f;
		border-style: solid;
    border-color: $theme5;
		padding: 4px 8px;
		letter-spacing: 1px;
		border-radius: 7px;

		&:hover {
			cursor: pointer;
      background: $theme5;
      color: white;
		}
	}

	.disabled-voting-button {
		letter-spacing: 0px;
	}
</style>
