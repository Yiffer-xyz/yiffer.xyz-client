<template>
	<div id="modalAndBackdropWrapper">
		<span class="modal-backdrop" v-on:click="closeModal()"></span>
		<div class="voting-modal">
			<p class="modal-header">Vote for {{comic.name}}</p>
			<p>User rating: {{comic.userRating}}</p>

			<table class="voting-numbers-table">
				<tr>
					<td 
						v-for="i in 10"
						v-bind:key="i"
						@mouseover="onNumberMouseover(i)"
						@mouseout="onNumberMouseOut()"
						@click="onNumberClick(i)"
					>
						{{i}}
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>

export default {
	name: 'voting-modal',
	props: {
		comic: Object
	},
	data: function () {
		return {
			currentMouseoverNumber: this.comic.yourRating
		}
	},
	methods: {
		onNumberMouseover ( number ) {
			this.currentMouseoverNumber = number
		},
		onNumberMouseOut () {
			this.currentMouseoverNumber = this.comic.yourRating
		},
		onNumberClick ( number ) {

		}
	},
}
</script>


<style lang="scss">
$linkColor: #3984d4;
$themeRed: #ec2f4b;
.modal-backdrop {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(255, 255, 255, 0.95);
	z-index: 5;
	&:hover {
		cursor: pointer;
	}
}

.loginModalInnerWrapper {
	width: 240px;
	display: flex;
	flex-direction: column;
}

.voting-modal {
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: 6;
	transform: translateX(-50%) translateY(-50%);
	display: flex;
	justify-content: center;
	padding: 40px 180px;
	background-color: white;
	box-shadow: rgba(0,0,0,0.3) 0px 5px 28px 3px;
}

.voting-modal:before {
	height: 10px;
	width: 100%;

	position: absolute;
	content: "";
	background: linear-gradient(to right, rgb(0, 159, 255), rgb(236, 47, 75));
	top: -3px;

}

.modal-header {
	font-size: 35px;
	font-weight: 400;
}

.dark {
	.voting-modal {
		background-color: #222426;
		color: white;
		input {
			color: #ccc;
			border-bottom-color: #ccc;
		}
		label {
			color: #ccc;
		}
	}

	.modal-backdrop {
		background-color: rgba(255, 255, 255, 0.2);
	}
}
</style>

<style>
	@media (max-width: 795px) {
	}
</style>
