<template>
	<button class="voting-button" @click="showSomeModal()" v-bind:class="{'disabled-voting-button': !$store.state.username}">
		<span v-bind:style="{'background-color': this.backgroundColor}">
			<p v-if="$store.state.username">Vote</p>
			<p v-else>Log in to vote</p>
		</span>
	</button>
</template>

<script>
	export default {
		name: 'votingButton',
		props: {
			comic: Object,
			backgroundColors: {
				type: Object,
				default: () => { return {light: 'blue', dark: 'red'} }
			}
		},
		methods: {
			showSomeModal () {
				if (this.$store.state.username) {
					this.$store.commit('setComicForVotingModal', this.comic)
					this.$store.commit('setVotingModalVisibility', true)
				}
				else {
					this.$store.commit('setLoginModalVisibility', true)
				}
			}
		},
		computed: {
			backgroundColor: function () {
				if (this.$store.state.darkTheme) { return this.backgroundColors.dark }
				else { return this.backgroundColors.light }
			}
		}
	}
</script>

<style lang="scss">
	$themeBlue: #009fff;
	$themeRed: #ec2f4b;

	.voting-button {
		background-image: linear-gradient(to top right, $themeBlue 0%, $themeRed 100%);
		color: #00a84f;
		text-decoration: none;
		border-style: solid;
		padding: 2px;
		letter-spacing: 1px;
		border: none;
		border-radius: 7px;

		span {
			align-items: center;
			background: white;
			display: flex;
			justify-content: center;
			height: 100%;
			width: 100%;
			border-radius: 5px;
			p {
				margin: 4px 8px;
				font-family: 'Open Sans', sans-serif;
			}
		}

		&:hover {
			cursor: pointer;
			span {
				background: transparent !important;
				p {
					color: white;
				}
			}
		}
	}

	.disabled-voting-button {
		letter-spacing: 0px;
	}
</style>
