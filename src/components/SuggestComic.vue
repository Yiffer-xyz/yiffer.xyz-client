<template>
	<div style="width: 100%">
		<div class="whole-body-text whole-body-text-centered">

			<vue-headful :title="'Profile - Yiffer.xyz'"/>
			<h1 class="upper-body-div-comic">Suggest new comic</h1>
			<back-to-index></back-to-index>

			<p>Thank you for wanting to improve our collection! Here are a few things to keep in mind:</p>
			<span style="text-align: left;">
				<ul>
					<li>
						The comic should be at least 4 pages long. If the pages have lots of panels or if the comic is of very high quality, 3-page comics might be accepted.
					</li>
					<li>
						Low-quality comics (visually) will not be accepted.
					</li>
					<li>
						The comic <i>might</i> not be accepted if it is uncolored.
					</li>
					<li>
						The comic will not be accepted if it is not in English.
					</li>
					<li>
						The comic will not be accepted if it has censoring bars, dots, etc.
					</li>
				</ul>
			</span>

			<table class="suggest-table">
				<tr>
					<td class="label-cell">
						<label>Comic name:</label>
					</td>
					<td class="input-cell">
						<input type="text" v-model="comicName"/>
					</td>
				</tr>
				<tr>
					<td class="label-cell">
						<label>Artist (if known):</label>
					</td>
					<td class="input-cell">
						<input type="text" v-model="artist"/>
					</td>
				</tr>
				<tr>
					<td class="label-cell">
						<label>Links, comments:</label>
					</td>
					<td class="input-cell">
						<textarea v-model="linksComments" rows="4"></textarea>
					</td>
				</tr>
			</table>

			<label>Please provide some link (e.g. e621, FurAffinity, u18chan, reddit, anything not behind a paywall), and any other helpful comments you may have.</label>

			<p class="success-message" v-if="successMessage">{{successMessage}}</p>
			<p class="error-message" v-if="errorMessage">{{errorMessage}}</p>

			<button class="y-button margin-top-8" @click="submitButtonClicked()">Submit</button>
		</div>
	</div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'

import comicApi from '../api/comicApi'

export default {
	name: 'suggestComic',

	components: { 'back-to-index': BackToIndex },

	data: function () {
		return {
			comicName: '',
			artist: '',
			linksComments: '',
			successMessage: '',
			errorMessage: '',
		}
	},

	methods: {
		async submitButtonClicked () {
			let response
			if (!this.comicName || !this.linksComments) {
				response = {success: false, message: 'Please provide a comic name and some link to some page or an album somehwere.'}
			}
			else {
				response = await comicApi.addComicSuggestion(this.comicName, this.artist, this.linksComments)
			}
			if (response.success) {
				this.successMessage = `Thank you for your suggestion of ${this.comicName+''}!`
				this.comicName = ''
				this.artist = ''
				this.linksComments = ''
				this.errorMessage = ''
			}
			else {
				this.errorMessage = response.message
				this.successMessage = ''
			}
		}
  },
}
</script>

<style lang="scss">
.suggest-table {
	input, textarea {
		width: 100%;
	}
	textarea {
		padding: 1px;
		margin: 0;
	}
	.input-cell {
		width: 400px;
	}
}
</style>
