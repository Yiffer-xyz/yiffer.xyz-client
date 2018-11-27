<template>
	<button class="y-button" @click="showSomeModal()" v-bind:class="{'disabled-voting-button': !$store.state.username}">
		<!-- <span v-bind:style="{'background-color': this.backgroundColor}"> -->
			<span v-if="$store.state.username">Vote</span>
			<span v-else><i class="fas fa-sign-in-alt"/> Log in to vote</span>
		<!-- </span> -->
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
$theme1: #004934;
$theme2: #006d4d;
$theme3: #00855e;
$theme4: #00986b;
$theme4p5: #00ab79;
$theme5: #00d596;
$theme6: #78fdd6;


.voting-button {
	box-shadow: 0px 1px 1px 0px rgba(130,130,130,1);
	// background-image: linear-gradient(to top right, $theme2 0%, $theme5 100%);
	text-decoration: none;
	border-style: solid;
	padding: 2px;
	border: none;
	border-radius: 7px;

	span {
		align-items: center;
		background: white;
		background: transparent !important;
		display: flex;
		justify-content: center;
		height: 100%;
		width: 100%;
		border-radius: 5px;
		p {
			margin: 4px 8px;
			font-family: 'Open Sans', sans-serif;
			color: white;
			font-weight: 400;
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

.dark {
	.comic-card {
		.y-button {
			background-color: $theme4p5;
			span {
				background-color: $theme4p5;
			}
			&:hover {
				background-color: $theme3;
				span {
					background-color: $theme3;
				}
			}
		}
	}
}
</style>
