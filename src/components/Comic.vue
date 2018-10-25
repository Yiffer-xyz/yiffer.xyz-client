<template>
	<span>
		<div class="upper-body-div-comic">
			<h1>{{$route.params.comicName}}</h1>
			<span v-if="comic" style="display: flex; flex-direction: column; align-items: center; max-width: 65%;">
				<h2 style="margin-bottom: 16px;">by 
					<router-link :to="{ name: 'artist', params: { artistName: comic.artist } }" style="font-weight:300;">
						{{comic.artist}}
					</router-link>
					</h2>
				<button v-if="userIsDonator" class="y-button-important">Download comic</button>

				<back-to-index class="margin-top-16"></back-to-index>

				<p v-if="!$store.state.username">
					<button class="text-button margin-top-16" v-on:click="showLoginModal" style="font-size: 16px; font-weight: 400;">
						Log in
					</button> 
					to vote
				</p>

				<voting-button
					v-bind:comic="comic"
					v-bind:backgroundColors="{light: 'white', dark: '#091014'}"
				></voting-button>

				<div id="comicLinks" class="margin-top-16">
					<p v-if="comicLinks.previousComic || comicLinks.nextComic">This comic is part of a series!</p>
					<p v-if="comicLinks.previousComic">
						<router-link :to="{ name: 'comic', params: { comicName: comicLinks.previousComic } }">
							<i class="fas fa-arrow-circle-left"></i> 
							{{comicLinks.previousComic}}
						</router-link>
					</p>
					<p v-if="comicLinks.nextComic">
						<router-link :to="{ name: 'comic', params: { comicName: comicLinks.nextComic } }">
							{{comicLinks.nextComic}} 
							<i class="fas fa-arrow-circle-right"></i>
						</router-link>
					</p>
				</div>

				<div id="comicKeywords" v-if="comic.keywords.length > 0" class="margin-top-16">
					<div 
						class="keyword-static"
						v-for="keyword in comic.keywords"
						v-bind:key="keyword"
					>
						{{keyword}}
					</div>

					<div class="keyword-static keyword-button" v-on:click="toggleKeywordSuggestions()" v-if="!keywordSuggestionsActive">
						add/remove tags
					</div>
					<div class="keyword-static keyword-button" v-on:click="toggleKeywordSuggestions()" v-if="keywordSuggestionsActive">
						hide adding/removing tags
					</div>
				</div>

				<div id="keywordEditing" v-if="keywordSuggestionsActive" class="margin-top-8">
					<div id="dropdownContainer">
						<span>
							<label for="addKeyword">Add tag</label>
							<select v-model="addKeyword" name="addKeyword">
								<option v-for="keyword in keywordsNotInComic" v-bind:key="keyword">
									{{keyword}}
								</option>
							</select>
							<button 
								@click="suggestKeywordChange('add')"
								v-bind:class="{'y-button-disabled': !addKeyword}"
								class="y-button-small"
							>
								Add
							</button>
						</span>

						<span style="margin-left: 20px;">
							<label for="removeKeyword">Remove tag</label>
							<select v-model="removeKeyword">
								<option v-for="keyword in comic.keywords" v-bind:key="keyword">
									{{keyword}}
								</option>
							</select>
							<button 
								@click="suggestKeywordChange('remove')"
								v-bind:class="{'y-button-disabled': !removeKeyword}"
								class="y-button-small"
							>
								Remove
							</button>
						</span>
					</div>

					<p class="success-message" v-if="keywordSuccessMessage">{{keywordSuccessMessage}}</p>
					<p class="error-message" v-if="keywordErrorMessage">{{keywordErrorMessage}}</p>
				</div>

				<div class="normal-button-row margin-top-16">
					<button v-on:click="setAllImagesFit('height')" class="y-button">Fit screen H</button>
					<button v-on:click="setAllImagesFit('width')"  class="y-button">Fit screen W</button>
					<button v-on:click="setAllImagesFit('big')"    class="y-button">Big</button>
					<button v-on:click="setAllImagesFit('thumb')"  class="y-button">Thumb</button>
				</div>
			</span>

			<div v-else-if="!comicNotFound">
				Loading comic
			</div>

			<div v-else>
				Comic not found
			</div>
		</div>
	
		<div v-if="comic" id="comic-page-container" class="margin-top-16">
			<img 
				v-for="pageNumber in comic.numberOfPages" 
				:src="`https://yiffer.xyz/comics/${comic.name}/${formattedPageNumber(pageNumber)}.jpg`"
				:alt="`${comic.name} page ${pageNumber}`"
				:id="'page' + (pageNumber-1)"
				v-bind:key="pageNumber"
				v-bind:class="['img-fit-height', 'comic-page']"
				v-on:click="cycleImageFit(pageNumber-1)"/>
		</div>
	</span>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import VotingButton from '@/components/VotingButton.vue'

export default {
	name: 'comic',
	props: {
		userInfo: Object,
	},
	components: { 'back-to-index': BackToIndex, 'voting-button': VotingButton },
	data: function () {
		return {
			comic: this.$store.state.clickedComic || undefined,
			userIsDonator: false,
			comicNotFound: false,
			imageFitArray: [],
			comicLinks: { previousComic: undefined, nextComic: undefined },
			keywordSuggestionsActive: false,
			keywordsNotInComic: [],
			addKeyword: undefined,
			removeKeyword: undefined,
			keywordSuccessMessage: '',
			keywordErrorMessage: '',
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
		cycleImageFit ( pageNumber ) {
			let imageElement = document.getElementById('page'+pageNumber)
			let oldClassList = [...imageElement.classList]
			let oldFit
			if (oldClassList.indexOf('img-fit-width') >= 0) { oldFit = 'width' }
			else if (oldClassList.indexOf('img-fit-height') >= 0) { oldFit = 'height' }
			else if (oldClassList.indexOf('img-fit-big') >= 0) { oldFit = 'big' }
			else if (oldClassList.indexOf('img-fit-thumb') >= 0) { oldFit = 'thumb' }
			let newFit = imageFitCycleOrder[ (imageFitCycleOrder.indexOf(oldFit)+1) % 4 ]
			imageElement.classList.remove('img-fit-'+oldFit)
			imageElement.classList.add('img-fit-'+newFit)
		},
		initializeImageFitArray () {
			if ( this.comic ) {
				for (var i=0; i<this.comic.numberOfPages; i++) { this.imageFitArray.push('height') }
			}
		},
		showLoginModal () {
			this.$store.commit('setModalVisibility', true)
		},
		toggleKeywordSuggestions () {
			this.keywordSuggestionsActive = !this.keywordSuggestionsActive
			if ( this.keywordsNotInComic.length === 0 ) { this.getKeywordsNotInComic() }
		},
		async getKeywordsNotInComic () {
			let allKeywords = await mockGetAllKeywords()
			for ( var keyword of allKeywords ) {
				if ( this.comic.keywords.indexOf(keyword) < 0 ) {
					this.keywordsNotInComic.push(keyword)
				}
			}
		},
		async suggestKeywordChange ( typeOfChange ) {
			let relevantKeyword = typeOfChange==='add' ? this.addKeyword : this.removeKeyword
			let suggestionResponse = await mockKeywordSuggestion (relevantKeyword)

			if ( suggestionResponse.success ) {
				this.keywordSuccessMessage = `Thank you! Your suggestion will be reviewed soon (${suggestionResponse.message})`
				this.keywordErrorMessage = undefined

				if ( typeOfChange === 'add' ) {
					this.comic.keywords.splice(this.comic.keywords.indexOf(relevantKeyword))
					this.keywordsNotInComic.push(relevantKeyword)
					this.addKeyword = undefined
				}
				else {
					this.keywordsNotInComic.splice(this.keywordsNotInComic.indexOf(relevantKeyword))
					this.comic.keywords.push(relevantKeyword)
					this.removeKeyword = undefined
				}
			}
			else {
				this.keywordErrorMessage = suggestionResponse.message
				this.keywordSuccessMessage = undefined
			}
		}
	},
	created: async function () {
		this.$store.commit('setModalVisibility', false)
		this.$store.commit('setWhiteThemeButtonStyle', false)
		this.comicLinks = await mockGetLinks()
		if ( !this.comic ) {
			mockGetComic(this.$route.params.comicName)
				.then( comic => {
					this.comic = comic
					this.$store.commit('setComicForVotingModal', comic)
					this.initializeImageFitArray()
				})
		}
		else { this.initializeImageFitArray() }
	}
}

async function mockGetComic () {
	return await new Promise( (resolve) => {
		setTimeout(() => {
			resolve({"tag": "Furry", "name": "Dress to Undress", "keywords": ['asd', 'asdasdasd', 'asdasdasdasd', 'asad asda', 'xccxxc', 'xcxcxcxc ', 'xccx', 'xcxc', 'asdasdasd a', 'asd  a a ', 'asdasd ',"finnick", "chipmunk", "charizard", "footjob", "fisting"], "cat": "MM", "lastUpdateNewPageCount": 0, "updated": "2017-10-24T11:04:46.000Z", "numberOfPages": 21, "userRating": 7.881, "id": 343, "created": "2017-07-01T00:00:00.000Z", "finished": 0, "artist": "Seth-Iova", "yourRating": 0})
		}, 500)
	})
}

async function mockGetLinks () {
	return await new Promise( (resolve) => {
		setTimeout(() => {
			resolve({nextComic: 'asd'})
		}, 500)
	})
}

async function mockKeywordSuggestion () {
	return await new Promise( (resolve) => {
		setTimeout(() => {
			resolve({success: false, message: 'nasdnlasd nlaksd lkasdlna n ann nnad nn '})
		}, 500)
	})
}

async function mockGetAllKeywords () {
	return await new Promise( (resolve) => {
		setTimeout(() => {
			resolve(['a', 'bb', 'ccc', 'dd', 'ee', 'dasd', 'asda', 'asdasd', 'add', 'asddd', 'ddda', 'atr', 'dfg', 'dfgd', 'ghjg', 'ghjj', 'wer', 'wrrr'])
		}, 500)
	})
}

let imageFitCycleOrder = ['height', 'width', 'big', 'thumb']

</script>


<style lang="scss">
	.voting-button {
		margin-top: 16px;
	}
</style>


<style lang="scss">
	$linkColor: #3984d4;
	$themeRed: #ec2f4b;

	.margin-top-16 {
		margin-top: 16px;
	}
	.margin-top-8 {
		margin-top: 8px;
	}

	#comicKeywords {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}

	.keyword-button {
		border-color: $linkColor !important;
		color: $linkColor !important;
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
	}
</style>

<style lang="sass">
$linkColor: #3984d4
$cardBgColorLight: #f1f1f1
$cardBgColorDark: #222426

.upper-body-div-comic
	width: 100%
	display: flex
	flex-direction: column
	align-items: center
	text-align: center

a
	text-decoration: none

#comic-page-container
	display: flex
	flex-direction: column
	align-items: center
	img
		margin-bottom: 16px

.img-fit-height
	max-height: 100vh

.img-fit-width
	max-width: 97vw

.img-fit-thumb
	max-height: 90px

.normal-button-row
	.y-button
		margin: 0px 2px
</style>
