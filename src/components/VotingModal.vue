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
						v-bind:class="[
							'vote-box-colored-' + currentMouseoverNumber,
							{'vote-box-uncolored': currentMouseoverNumber>i}
						]"
						@mouseover="onNumberMouseover(i)"
						@mouseout="onNumberMouseOut()"
						@click="onNumberClick(i)"
					>
						{{i}}
					</td>
				</tr>
			</table>

			<button @click="onNumberClick(0)">Delete vote</button>
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
			currentMouseoverNumber: this.comic.yourRating,
		}
	},
	methods: {
		onNumberMouseover ( number ) {
			this.currentMouseoverNumber = number
		},
		onNumberMouseOut () {
			this.currentMouseoverNumber = this.comic.yourRating
		},
		async onNumberClick ( number ) {
			this.closeModal()
			let votingResponse = await mockSendVote(number)
			if ( votingResponse.success ) {
				let updatedComic = await mockGetComicDetails()
				this.$store.commit('updateOneComicInList', updatedComic)
				this.comic.yourRating = updatedComic.yourRating
				this.comic.userRating = updatedComic.userRating
			}
		},
		closeModal () {
			this.$store.commit('setVotingModalVisibility', false)
		}
	},
	computed: {

	}
}

async function mockSendVote () {
	return {success: true}
}
async function mockGetComicDetails () {
	return {"tag": "Furry", "name": "Anarchy", "keywords": ["bird", "fox mccloud", "autofellatio", "cub", "draenei", "animal crossing", "discord"], "cat": "MF", "lastUpdateNewPageCount": 0, "updated": "2015-01-01T00:00:00.000Z", "numberOfPages": 4, "userRating": 7.4, "id": 252, "created": "2017-07-01T00:00:00.000Z", "finished": 1, "artist": "Wolfy-Nail", "yourRating": 0}
}
</script>


<style lang="scss">
$linkColor: #3984d4;
$themeRed: #ec2f4b;

.vote-box-colored-1 { background-color: #009FFF; }
.vote-box-colored-2 { background-color: #1A92EB; }
.vote-box-colored-3 { background-color: #3486D7; }
.vote-box-colored-4 { background-color: #4E79C3; }
.vote-box-colored-5 { background-color: #686DAF; }
.vote-box-colored-6 { background-color: #83609B; }
.vote-box-colored-7 { background-color: #9D5487; }
.vote-box-colored-8 { background-color: #B74773; }
.vote-box-colored-9 { background-color: #D13B5F; }
.vote-box-colored-10 { background-color: #EC2F4B; }
.vote-box-colored {
	color: white;
}
.vote-box-uncolored {
	background-color: #ccc;
	color: #222;
}

.voting-numbers-table {
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
	.vote-box-uncolored {
		background-color: #333;
		color: white;
	}
	
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
