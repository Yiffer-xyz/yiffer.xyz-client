<template>
	<div id="modalAndBackdropWrapper">
		<span class="modal-backdrop" @click="closeModal()"></span>
		<div class="voting-modal">
      <button class="y-button-close" @click="closeModal"><cross-icon :size="28"/></button>

			<p class="modal-header">Rate {{$store.getters.comicForVotingModal.name}}</p>
			<p class="margin-top-16">User rating: {{formatRating($store.getters.comicForVotingModal.userRating)}}</p>

			<rating-slider/>
		</div>
	</div>
</template>

<script>
import RatingSlider from '@/components/RatingSlider.vue'
import CrossIcon from 'vue-material-design-icons/Close.vue'

export default {
	name: 'voting-modal',

	components: {
		'rating-slider': RatingSlider,
		'cross-icon': CrossIcon,
	},

	methods: {
		closeModal () {
			this.$store.commit('setVotingModalVisibility', false)
		},
		
		formatRating (number) {
			if (!number) { return 'None' }
			if (number > 8.5) { return Math.round(number * 100) / 100 }
			else { return Math.round(number * 10) / 10 }
		},
	},
}
</script>


<style lang="scss">
.modal-backdrop {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(255, 255, 255, 0.6);
	z-index: 5;
	&:hover {
		cursor: pointer;
	}
}

.voting-modal {
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: 6;
	transform: translateX(-50%) translateY(-50%);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 50px 0px 40px 0px;
	width: 50%;
	background-color: white;
	box-shadow: rgba(0,0,0,0.3) 0px 5px 28px 3px;
	transform: translateX(-50%) translateY(-50%);

	&>span {
		width: 100%;
		padding: 0px 40px;
	}

	@media (max-width: 900px) {
		width: 100%;
	}

	.y-button-close {
		position: absolute;
		right: 10px;
		top: 14px;
	}
}

.voting-modal:before {
	height: 10px;
	width: 100%;

	position: absolute;
	content: "";
	background: linear-gradient(to right, $theme2, $theme6);
	top: -3px;

}

.dark {
	.voting-modal {
		background-color: $themeBlue0p5;
		color: white;
		input {
			color: #ccc;
		}
		label {
			color: #ccc;
		}
	}

	.modal-backdrop {
		background-color: rgba(255, 255, 255, 0.4);
	}
}
</style>
