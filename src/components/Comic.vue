<template>
	<span>
		<vue-headful :title="$route.params.comicName + ' - Yiffer.xyz'"/>
		<div class="upper-body-div-comic">
			<span v-if="comic" class="comic-upper-div">
				<h1>{{$route.params.comicName}}</h1>
				<share-icon class="share-icon" v-if="showShareIcon" @click.native="shareClicked()"/>
				<h2>by 
					<router-link :to="{ name: 'artist', params: { artistName: comic.artist } }" style="font-weight:300;">
						{{comic.artist}}
					</router-link>
				</h2>

				<back-to-index class="margin-top-16"></back-to-index>

				<button v-if="$store.getters.isAuthenticated && $store.getters.userData.donator" class="y-button">Download comic</button>

				<voting-button
					:comic="comic"
					:backgroundColors="{light: 'white', dark: '#091014'}"
				></voting-button>

				<div class="margin-top-16" v-if="comic">
					<p v-if="comic.links.previousComic || comic.links.nextComic">This comic is part of a series!</p>
					<p v-if="comic.links.previousComic">
						<router-link :to="{ name: 'comic', params: { comicName: comic.links.previousComic } }">
							
							<left-arrow/>
							{{comic.links.previousComic}}
						</router-link>
					</p>
					<p v-if="comic.links.nextComic">
						<router-link :to="{ name: 'comic', params: { comicName: comic.links.nextComic } }">
							{{comic.links.nextComic}} 
							<right-arrow/>
						</router-link>
					</p>
				</div>

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
								<option v-for="keyword in keywordsNotInComic" :key="keyword.Keyword">
									{{keyword.Keyword}}
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

				<div class="normal-button-row margin-top-16">
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
	
		<div v-if="comic" id="comic-page-container" class="margin-top-16 margin-bottom-8">
			<img 
				v-for="pageNumber in comic.numberOfPages" 
				:src="`https://yiffer.xyz/comics/${comic.name}/${formattedPageNumber(pageNumber)}.jpg`"
				:alt="`${comic.name} page ${pageNumber}`"
				:id="'page' + (pageNumber-1)"
				:key="pageNumber"
				:class="['img-fit-height', 'comic-page']"
				@click="cycleOneImageFit(pageNumber-1)"/>
		</div>



		<voting-button
			:comic="comic"
			:backgroundColors="{light: 'white', dark: '#091014'}"
			v-if="comic"
		></voting-button>
		<br/>

		<div class="margin-top-8 margin-bottom-8" v-if="comic">
			<p v-if="comic.links.previousComic || comic.links.nextComic">This comic is part of a series!</p>
			<p v-if="comic.links.previousComic">
				<router-link :to="{ name: 'comic', params: { comicName: comic.links.previousComic } }">
					
					<left-arrow/>
					{{comic.links.previousComic}}
				</router-link>
			</p>
			<p v-if="comic.links.nextComic">
				<router-link :to="{ name: 'comic', params: { comicName: comic.links.nextComic } }">
					{{comic.links.nextComic}} 
					<right-arrow/>
				</router-link>
			</p>
		</div>

		<back-to-index></back-to-index>
		<div style="margin-top: 16px;"> </div>
	</span>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import VotingButton from '@/components/VotingButton.vue'
import LeftArrow from 'vue-material-design-icons/ArrowLeft.vue'
import RightArrow from 'vue-material-design-icons/ArrowRight.vue'
import ShareIcon from 'vue-material-design-icons/ShareVariant.vue'

import comicApi from '../api/comicApi'
import keywordApi from '../api/keywordApi'

export default {
	name: 'comic',

	props: {
		userInfo: Object,
	},

	components: {
		'back-to-index': BackToIndex,
		'voting-button': VotingButton,
		'left-arrow': LeftArrow,
		'right-arrow': RightArrow,
		'share-icon': ShareIcon,
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
		formattedPageNumber: pageNumber => pageNumber<10 ? '0'+pageNumber : pageNumber,

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
			if ( this.keywordsNotInComic.length === 0 ) { this.getKeywordsNotInComic() }
		},

		async getKeywordsNotInComic () {
			let allKeywords = await keywordApi.getKeywordList()
			for ( var keyword of allKeywords ) {
				if ( this.comic.keywords.indexOf(keyword) < 0 ) {
					this.keywordsNotInComic.push(keyword)
				}
			}
		},

		async suggestKeywordChange ( typeOfChange ) {
			let relevantKeyword = typeOfChange==='add' ? this.addKeyword : this.removeKeyword
			let suggestionResponse = await keywordApi.addKeywordSuggestion(this.comic.Id, relevantKeyword, typeOfChange)

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
				this.keywordErrorMessage = `Error adding keyword ${relevantKeyword}.` // todo better logging
				this.keywordSuccessMessage = undefined
			}
		},

		fitImagesForMobile () {
			if (window.innerWidth < 900) {
				let resizeIntervalHook = setInterval(() => {
					if (this.comic && document.getElementById('comic-page-container').childElementCount === this.comic.numberOfPages) {
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
		}
	},

	created: async function () {
		if (navigator.share === undefined) {
			// this.showShareIcon = false todo
		}
		this.$store.commit('setLoginModalVisibility', false)
		this.$store.commit('setWhiteThemeButtonStyle', false)
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
	}
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

.comic-upper-div {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 90%;

	.y-button {
		margin-top: 16px;
	}
}

.margin-bottom-8 {
	margin-bottom: 8px;
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

.upper-body-div-comic {
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

#comic-page-container {
	img {
		margin-bottom: 16px;
		display: block;
		margin: auto;
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

.normal-button-row {
	.y-button {
		margin: 0px 2px;
	}
}
</style>
