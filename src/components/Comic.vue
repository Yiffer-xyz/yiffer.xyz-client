<template>
	<span>
		<vue-headful :title="$route.params.comicName + ' - Yiffer.xyz'"/>
		<div id="upperBodyDivComic">
			<span v-if="comic" id="comicUpperDiv">
				<h1>{{$route.params.comicName}}</h1>
				<share-icon class="share-icon" v-if="showShareIcon" @click.native="shareClicked()"/>
				<h2>by 
					<router-link :to="{ name: 'artist', params: { artistName: comic.artist } }" class="underline-link" style="font-weight:300;">
						{{comic.artist}}
					</router-link>
				</h2>

				<back-to-index class="margin-top-16"></back-to-index>

				<button v-if="$store.getters.isAuthenticated && $store.getters.userData.donator" class="y-button">Download comic</button>

				<div class="margin-top-16" v-if="comic && (comic.previousComic || comic.nextComic)">
					<p>This comic is part of a series!</p>
					<p v-if="comic.previousComic">
						<router-link :to="{ name: 'comic', params: { comicName: comic.previousComic } }" class="underline-link" style="font-weight: 400;">
							
							<left-arrow/>
							{{comic.previousComic}}
						</router-link>
					</p>
					<p v-if="comic.nextComic">
						<router-link :to="{ name: 'comic', params: { comicName: comic.nextComic } }" class="underline-link" style="font-weight: 400;">
							{{comic.nextComic}} 
							<right-arrow/>
						</router-link>
					</p>
				</div>

				<p class="margin-top-16">User rating: {{formatRating($store.getters.comicForVotingModal.userRating)}}</p>
				<rating-slider v-if="$store.getters.isAuthenticated" style="margin-top: 0;"/>
				<p v-else> 
					<button class="underline-link text-button link-color" 
									@click="$store.commit('setLoginModalVisibility', true)">
						<login-icon/> Log in
					</button> to rate comic
				</p>

				<div id="comicKeywords" v-if="comic.keywords.length > 0" class="margin-top-16">
					<div 
						class="keyword-static"
						v-for="keyword in comic.keywords"
						:key="keyword"
					>
						{{keyword}}
					</div>

					<div class="keyword-static keyword-button" @click="toggleKeywordSuggestions()" v-if="!keywordSuggestionsActive">
						add/remove tags
					</div>
					<div class="keyword-static keyword-button" @click="toggleKeywordSuggestions()" v-if="keywordSuggestionsActive">
						hide adding/removing tags
					</div>
				</div>

				<div id="keywordEditing" v-if="keywordSuggestionsActive" class="margin-top-8">
					<div id="dropdownContainer">
						<span>
							<label for="addKeyword">Add tag</label>
							<select v-model="addKeyword" name="addKeyword">
								<option v-for="keyword in keywordsNotInComic" :key="keyword">
									{{keyword}}
								</option>
							</select>
							<button 
								@click="suggestKeywordChange('add')"
								:class="{'y-button-disabled': !addKeyword}"
								class="y-button-small"
							>
								Add
							</button>
						</span>

						<span style="margin-left: 20px;">
							<label for="removeKeyword">Remove tag</label>
							<select v-model="removeKeyword">
								<option v-for="keyword in comic.keywords" :key="keyword">
									{{keyword}}
								</option>
							</select>
							<button 
								@click="suggestKeywordChange('remove')"
								class="y-button-small"
								:class="{'y-button-disabled': !removeKeyword, 'y-button-red': removeKeyword}"
							>
								Remove
							</button>
						</span>
					</div>

					<p class="success-message margin-top-8" v-if="keywordSuccessMessage">{{keywordSuccessMessage}}</p>
					<p class="error-message margin-top-8" v-if="keywordErrorMessage">{{keywordErrorMessage}}</p>
				</div>

				<div id="comicSizingButtonsRow" class="margin-top-16">
					<button @click="setAllImagesFit('height')" class="y-button y-button-neutral">Fit screen H</button>
					<button @click="setAllImagesFit('width')"  class="y-button y-button-neutral">Fit screen W</button>
					<button @click="setAllImagesFit('big')"    class="y-button y-button-neutral">Big</button>
					<button @click="setAllImagesFit('thumb')"  class="y-button y-button-neutral">Thumb</button>
				</div>
			</span>

			
			<div v-else-if="!comicNotFound">
				<p style="text-align:center; margin-top: 48px;">Loading comic...</p>
			</div>

			<div v-else>
				<p style="text-align:center; margin-top: 48px;"><b>Comic not found</b><br/>There is no comic with the name {{$route.params.comicName}}</p>
			</div>

		</div>
	
		<div v-if="comic" id="comicPageContainer" class="margin-top-16 margin-bottom-8">
			<img 
				v-for="pageNumber in comic.numberOfPages" 
				:src="`/comics/${comic.name}/${formatPageNumber(pageNumber)}.jpg`"
				:alt="`${comic.name} page ${pageNumber}`"
				:id="'page' + (pageNumber-1)"
				:key="pageNumber"
				:class="['img-fit-height', 'comic-page']"
				@click="cycleOneImageFit(pageNumber-1)"/>
		</div>

		<div class="margin-top-8 margin-bottom-8" v-if="comic">
			<p v-if="comic.previousComic || comic.nextComic">This comic is part of a series!</p>
			<p v-if="comic.previousComic">
				<router-link :to="{ name: 'comic', params: { comicName: comic.previousComic } }" class="underline-link" style="font-weight: 400;">
					<left-arrow/>
					{{comic.previousComic}}
				</router-link>
			</p>
			<p v-if="comic.nextComic">
				<router-link :to="{ name: 'comic', params: { comicName: comic.nextComic } }" class="underline-link" style="font-weight: 400;">
					{{comic.nextComic}} 
					<right-arrow/>
				</router-link>
			</p>
		</div>

		<span v-if="comic">
			<p class="margin-top-8">User rating: {{formatRating($store.getters.comicForVotingModal.userRating)}}</p>
			<rating-slider v-if="$store.getters.isAuthenticated" style="margin-top: 0;" class="margin-bottom-16"/>
			<p v-else class="margin-bottom-16"> 
				<button class="underline-link text-button link-color" 
								@click="$store.commit('setLoginModalVisibility', true)">
					<login-icon/> Log in
				</button> to rate comic
			</p>

			<button class="y-button y-button-neutral margin-bottom-16" @click="scrollToTop()"><up-arrow/> to top</button>
			<br>
		</span>
		<back-to-index />
		<div style="margin-top: 16px;"> </div>
	</span>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import RatingSlider from '@/components/RatingSlider.vue'
import LeftArrow from 'vue-material-design-icons/ArrowLeft.vue'
import RightArrow from 'vue-material-design-icons/ArrowRight.vue'
import ShareIcon from 'vue-material-design-icons/ShareVariant.vue'
import LoginIcon from 'vue-material-design-icons/Login.vue'
import UpArrow from 'vue-material-design-icons/ArrowUp.vue'

import comicApi from '../api/comicApi'
import keywordApi from '../api/keywordApi'

export default {
	name: 'comic',

	props: {
		userInfo: Object,
	},

	components: {
		'back-to-index': BackToIndex,
		'rating-slider': RatingSlider,
		'left-arrow': LeftArrow,
		'right-arrow': RightArrow,
		'share-icon': ShareIcon,
		'login-icon': LoginIcon,
		'up-arrow': UpArrow,
	},

	data: function () {
		return {
			comic: this.$store.state.clickedComic || undefined,
			userIsDonator: true,
			comicNotFound: false,
			imageFitArray: [],
			keywordSuggestionsActive: false,
			keywordsNotInComic: [],
			addKeyword: undefined,
			removeKeyword: undefined,
			keywordSuccessMessage: '',
			keywordErrorMessage: '',
			showShareIcon: true,
		}
	},

	methods: {
		formatPageNumber: pageNumber => pageNumber<10 ? '0'+pageNumber : pageNumber,

		formatRating: function (number) {
			if (!number) { return 'None' }
			if (number > 8.5) { return Math.round(number * 100) / 100 }
			else { return Math.round(number * 10) / 10 }
		},

		setAllImagesFit ( imageFit ) {
			document.querySelectorAll('.comic-page').forEach(page => {
				page.classList.remove('img-fit-big', 'img-fit-thumb', 'img-fit-width', 'img-fit-height')
				page.classList.add('img-fit-' + imageFit)
			})
		},

		cycleOneImageFit ( pageNumber ) {
			let imageElement = document.getElementById('page'+pageNumber)
			let oldClassList = [...imageElement.classList]
			let oldFit
			if (oldClassList.indexOf('img-fit-width') >= 0) 			{ oldFit = 'width' }
			else if (oldClassList.indexOf('img-fit-height') >= 0) { oldFit = 'height' }
			else if (oldClassList.indexOf('img-fit-big') >= 0) 		{ oldFit = 'big' }
			else if (oldClassList.indexOf('img-fit-thumb') >= 0) 	{ oldFit = 'thumb' }
			let newFit = imageFitCycleOrder[ (imageFitCycleOrder.indexOf(oldFit)+1) % 4 ]
			imageElement.classList.remove('img-fit-'+oldFit)
			imageElement.classList.add('img-fit-'+newFit)
		},

		initializeImageFitArray () {
			if ( this.comic ) {
				for (var i=0; i<this.comic.numberOfPages; i++) { this.imageFitArray.push('height') }
			}
		},

		toggleKeywordSuggestions () {
			this.keywordSuggestionsActive = !this.keywordSuggestionsActive
			if ( this.keywordsNotInComic.length === 0 ) { this.setKeywordsNotInComic() }
		},

		async setKeywordsNotInComic () {
			let allKeywords = await keywordApi.getKeywordList()
			this.keywordsNotInComic = allKeywords
				.filter(kw => this.comic.keywords.indexOf(kw.keyword) == -1)
				.map(kw => kw.keyword)
				.sort()
		},

		async suggestKeywordChange ( typeOfChange ) {
			let relevantKeyword = typeOfChange==='add' ? this.addKeyword : this.removeKeyword
			let suggestionResponse = await keywordApi.addKeywordSuggestion(this.comic.id, relevantKeyword, typeOfChange)

			if ( suggestionResponse.success ) {
				this.keywordSuccessMessage = `Thank you! Your suggestion will be reviewed soon (${typeOfChange} ${relevantKeyword+''})`
				this.keywordErrorMessage = undefined

				if ( typeOfChange === 'add' ) {
					this.addKeyword = undefined
				}
				else {
					this.removeKeyword = undefined
				}
			}
			else {
				this.keywordErrorMessage = suggestionResponse.message
				this.keywordSuccessMessage = undefined
			}
		},

		fitImagesForMobile () {
			if (window.innerWidth < 900) {
				let resizeIntervalHook = setInterval(() => {
					if (this.comic && document.getElementById('comicPageContainer').childElementCount === this.comic.numberOfPages) {
						this.setAllImagesFit('width')
						clearInterval(resizeIntervalHook)
					}
				}, 30)
			}
		},

		async shareClicked () {
			if (navigator.share === undefined) { return }
			let shareDataObject = {
				'title': this.$route.params.comicName + ' - Yiffer.xyz',
				'text': '',
				'url': 'https://yiffer.xyz/' + this.$route.path
			}
			await navigator.share(shareDataObject)
			// todo log something
		},

		scrollToTop () {
			window.scrollTo(0, 0)
		}
	},

	created: async function () {
		if (navigator.share === undefined) {
			// this.showShareIcon = false todo
		}
		this.$store.commit('setLoginModalVisibility', false)
		if ( !this.comic ) {
			let response = await comicApi.getComic(this.$route.params.comicName)
			if (response.success) {
				this.comic = response.result
				this.$store.commit('setComicForVotingModal', this.comic)
				this.initializeImageFitArray()
				this.fitImagesForMobile()
			}
			else {
				this.comicNotFound = true
			}
		}
		else {
			this.initializeImageFitArray()
			this.fitImagesForMobile()
		}
	},
}

let imageFitCycleOrder = ['height', 'width', 'big', 'thumb']
</script>

<style lang="scss">
.share-icon {
	position:absolute !important;
	top: 30px;
	right: 12px;
	font-size: 28px;
	@media (min-width: 900px) {
		display: none !important;
	}
}

#comicUpperDiv {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 90%;

	.y-button {
		margin-top: 16px;
	}
}

#comicKeywords {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
}

.keyword-button {
	border-color: $theme4 !important;
	color: $theme4 !important;
	&:hover {
		cursor: pointer;
	}
}

#keywordEditing {
	width: 100%;
	select {
		margin: 0 4px;
	}
}

#dropdownContainer {
	display: flex;
	flex-direction: row;
	justify-content: center;
}

#upperBodyDivComic {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	h1 {
		@media (max-width: 900px) {
			font-size: 32px;
			max-width: calc(100% - 84px);
		}
	}
	h2 {
		@media (max-width: 900px) {
			font-size: 22px;
		}
	}
}
a {
	text-decoration: none;
}

#comicPageContainer {
	img {
		margin: 0 auto 16px auto;
		display: block;
	}
}

.img-fit-height {
	max-height: 100vh;
}

.img-fit-width {
	max-width: 97vw;
}

.img-fit-thumb {
	max-height: 90px;
}

#comicSizingButtonsRow {
	.y-button {
		margin: 0px 2px;
	}
}
</style>
