<template>
	<button class="voting-button" @click="showVotingModal()">
		<span v-bind:style="{'background-color': this.backgroundColor}">
			<p>Vote</p>
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
			showVotingModal () {
				this.$store.commit('setComicForVotingModal', this.comic)
				this.$store.commit('setVotingModalVisibility', true)
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
			// margin: 4px 9px;
			p {
				margin: 5px 9px;
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
</style>
