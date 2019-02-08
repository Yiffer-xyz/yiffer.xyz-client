<template>
	<button class="y-button" @click="showSomeModal()" :class="{'disabled-voting-button': !$store.getters.isAuthenticated}">
		<!-- <span :style="{'background-color': this.backgroundColor}"> -->
			<span v-if="$store.getters.isAuthenticated">Rate</span>
			<span v-else><login-icon/> Log in to rate</span>
		<!-- </span> -->
	</button>
</template>

<script>
import LoginIcon from 'vue-material-design-icons/Login.vue'
export default {
	name: 'votingButton',
	components: {
		'login-icon': LoginIcon,
	},
	props: {
		comic: Object,
		backgroundColors: {
			type: Object,
			default: () => { return {light: 'blue', dark: 'red'} }
		},
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
	computed: {
		backgroundColor: function () {
			if (this.$store.state.darkTheme) { return this.backgroundColors.dark }
			else { return this.backgroundColors.light }
		}
	}
}
</script>

<style lang="scss">
.voting-button {
	box-shadow: 0px 1px 1px 0px rgba(130,130,130,1);
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
</style>
