<template>
	<div id="modalAndBackdropWrapper">
		<span class="modal-backdrop" @click="closeModal()"></span>
		<div class="voting-modal">
			<span style="display: flex; flex-direction: column;">
				<p class="modal-header">Vote for {{$store.state.comicForVotingModal.name}}</p>
				<p class="margin-top-16">User rating: {{$store.state.comicForVotingModal.userRating}}</p>

				<table id="votingNumbersTable" class="margin-top-16">
					<tr>
						<td 
							v-for="i in 10"
							:key="i"
							:class="[
								'vote-box-colored-' + i,
								{'vote-box-uncolored': numberToHover<i}
							]"
							@mouseover="onNumberMouseover(i)"
							@mouseout="onNumberMouseOut()"
							@click="onNumberClick(i)"
							class="voting-number"
						>
							{{i}}
						</td>
					</tr>
				</table>

				<button @click="onNumberClick(0)" v-if="$store.state.comicForVotingModal.yourRating" 
				id="deleteVoteButton" class="margin-top-16 y-button">
					Delete vote
				</button>

			</span>
		</div>
	</div>
</template>

<script>
import comicApi from '../api/comicApi'

export default {
	name: 'voting-modal',

	data: function () {
		return {
			currentMouseoverNumber: undefined,
		}
	},

	computed: {
		numberToHover () {
			return this.currentMouseoverNumber || this.$store.state.comicForVotingModal.yourRating || 0
		}
	},

	methods: {
		onNumberMouseover ( number ) {
			this.currentMouseoverNumber = number
		},

		onNumberMouseOut () {
			this.currentMouseoverNumber = undefined
		},

		async onNumberClick ( number ) {
			this.closeModal()
			let votingResponse = await comicApi.rateComic(this.$store. number)
			if ( votingResponse.success ) {
				let updatedComicResponse = await comicApi.getComic(this.$store.state.comicForVotingModal.Name)
				if (updatedComicResponse.success) {
					this.$store.dispatch('updateOneComicInList', updatedComicResponse.result)
				}
			}	
		},

		closeModal () {
			this.$store.commit('setVotingModalVisibility', false)
		}
	},
}
</script>


<style lang="scss">
.vote-box-colored-1 { background-color: #006D4D; color: white; }
.vote-box-colored-2 { background-color: #007C57; color: white; }
.vote-box-colored-3 { background-color: #008B62; color: white; }
.vote-box-colored-4 { background-color: #009B6D; color: white; }
.vote-box-colored-5 { background-color: #00AA78; color: white; }
.vote-box-colored-6 { background-color: #00BA83; color: white; }
.vote-box-colored-7 { background-color: #00C98E; color: white; }
.vote-box-colored-8 { background-color: #00D999; color: white; }
.vote-box-colored-9 { background-color: #00E8A4; color: white; }
.vote-box-colored-10 { background-color: #00F8AF; color: white; }
.vote-box-colored {
	color: white;
}
.vote-box-uncolored {
	background-color: #f7f7f7;
	color: #222;
}

#votingNumbersTable {
	border-collapse: collapse;
	td {
		&:hover {
			cursor: pointer;
		}
	}
}

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
	justify-content: center;
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
}

.voting-modal:before {
	height: 10px;
	width: 100%;

	position: absolute;
	content: "";
	background: linear-gradient(to right, $theme2, $theme6);
	top: -3px;

}

.voting-number {
	width: 10%;
	font-weight: 600;
	padding: 24px 0;

	@media (max-width: 900px) {
		padding: 18px 0;
	}
	@media (max-width: 500px) {
		padding: 6px 0;
	}
}

#deleteVoteButton {
	width: 100px;
	margin-left: auto;
	margin-right: auto;
}

.dark {
	.vote-box-uncolored {
		color: white;
	}

	.vote-box-uncolored {
		background-color: transparent;
	}
	
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

<style>
	@media (max-width: 795px) {
	}
</style>
