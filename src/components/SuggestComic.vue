<template>
	<div style="width: 100%">
		<vue-headful :title="'Profile - Yiffer.xyz'"/>
		<h1>Suggest new comic</h1>
		<back-to-index></back-to-index>

		<div class="full-width-text margin-top-12">
			<p>Thank you for wanting to improve our collection! Here are a few things to keep in mind:</p>

			<ul>
				<li>
					The comic should be at least 4 pages long. If the pages have lots of panels or if the comic is of very high quality, 3-page comics might be accepted.
				</li>
				<li>
					The comic will not be accepted if it is of low quality ("poorly drawn").
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

			<div class="vertical-flex margin-top-32">
				<label>Comic name</label>
				<input type="text" v-model="comicName" style="width: 200px;"/>

				<label class="margin-top-16">Artist (if known)</label>
				<input type="text" v-model="artist" style="width: 200px;"/>

				<div style="width: 460px;" class="margin-top-16">
					<label>Links, comments</label>
					<textarea type="text" v-model="linksComments" style="width: 100%;" rows="4"/>

					<p class="no-margin-top">
						Please provide some link (e.g. e621, FurAffinity, u18chan, reddit, anything not behind a paywall), and any other helpful comments you may have. If you have multiple sources, feel free to provide all of them!
					</p>
				</div>

				<p class="success-message" v-if="successMessage">{{successMessage}}</p>
				<p class="error-message" v-if="errorMessage">{{errorMessage}}</p>
			</div>

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
#inputContainer {
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
