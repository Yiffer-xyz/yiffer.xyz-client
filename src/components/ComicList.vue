<template>
	<div style="width: 100%">
		<vue-headful title="Yiffer.xyz"/>
		<div class="upperBodyDiv">
			<h1 class="yifferTitle">Yiffer.xyz</h1>
			<p style="font-size: 20px">A collection of high-quality comics</p>

			<p class="margin-top-10" v-if="!$store.getters.isAuthenticated">
				<button class="underline-link text-button link-color" @click="showLoginModal" style="margin: 0 3px 0 0; font-size: 16px;">
					<login-icon/> Log in
				</button> 
				or
				<button class="underline-link text-button link-color" @click="showSignupModal" style="margin: 0 3px; font-size: 16px;">
					<signup-icon/> Sign up
				</button> 
				to rate comics
			</p>
			<p v-else class="margin-top-10">Welcome, {{$store.getters.userData.username}}</p>

			<div class="donate-link">
				<router-link :to="{name: 'donate'}" class="underline-link" style="margin-right: 16px;">
					<donate-icon title=""/> Donate?
				</router-link>

				<router-link :to="{name: 'suggestComic'}" class="underline-link" style="margin-left: 16px;">
					<plus-icon title=""/> Suggest comic?
				</router-link>
			</div>

			<div class="buttons-container">
				<span id="upperBodyWidth" class="buttons-container-inner">
					<div class="upper-body-horiz-row">
						<table class="horiz-row-inner" id="catTable">
							<tr>
								<td 
									v-bind:class="{'button-selected': $store.getters.categoryFilter.indexOf('All') >= 0}"
									@click="onCategoryFilterClick('All')">
									All
								</td>      
								<td 
									v-bind:class="{'button-selected': $store.getters.categoryFilter.indexOf('Furry') >= 0}"
									@click="onCategoryFilterClick('Furry')">
									Furry
								</td>        
								<td 
									v-bind:class="{'button-selected': $store.getters.categoryFilter.indexOf('MLP') >= 0}"
									@click="onCategoryFilterClick('MLP')">
									MLP
								</td>     
								<td 
									v-bind:class="{'button-selected': $store.getters.categoryFilter.indexOf('Pokemon') >= 0}"
									@click="onCategoryFilterClick('Pokemon')">
									Pokemon
								</td>     
								<td 
									v-bind:class="{'button-selected': $store.getters.categoryFilter.indexOf('Other') >= 0}"
									@click="onCategoryFilterClick('Other')">
									Other
								</td>     
							</tr>
						</table>
					</div>

					<div class="upper-body-horiz-row">
						<table class="horiz-row-inner">
							<tr>
								<td
									:class="{'button-selected': $store.getters.tagFilter.indexOf('All') >= 0}"
									@click="onTagFilterClick('All')">
									All
								</td>
								<td
									:class="{'button-selected': $store.getters.tagFilter.indexOf('M') >= 0}"
									@click="onTagFilterClick('M')">
									M
								</td>
								<td
									:class="{'button-selected': $store.getters.tagFilter.indexOf('F') >= 0}"
									@click="onTagFilterClick('F')">
									F
								</td>
								<td
									:class="{'button-selected': $store.getters.tagFilter.indexOf('MF') >= 0}"
									@click="onTagFilterClick('MF')">
									MF
								</td>
								<td
									:class="{'button-selected': $store.getters.tagFilter.indexOf('MM') >= 0}"
									@click="onTagFilterClick('MM')">
									MM
								</td>
								<td
									:class="{'button-selected': $store.getters.tagFilter.indexOf('FF') >= 0}"
									@click="onTagFilterClick('FF')">
									FF
								</td>
								<td
									:class="{'button-selected': $store.getters.tagFilter.indexOf('MF+') >= 0}"
									@click="onTagFilterClick('MF+')">
									MF+
								</td>
								<td
									:class="{'button-selected': $store.getters.tagFilter.indexOf('I') >= 0}"
									@click="onTagFilterClick('I')">
									I
								</td>
							</tr>
						</table>
					</div>

					<div style="width: 100%; margin: 7px 0;">
						<div class="two-search-row">
							<div class="search-wrapper">
								<div class="one-searchbox-container" id="mainSearchBox">
									<span class="input-icon-wrapper input-icon-wrapper-left"><search-icon title=""/></span>
									<input v-model="searchFiltering" type="text" placeholder="title or artist" class="upper-body-searchbox"/>
									<span class="input-icon-wrapper input-icon-wrapper-right cursor-pointer"
												v-show="searchFiltering"
												@click="clearSearchField()">
										<cross-icon title="Clear"/>
									</span>
								</div>
							</div>

							<div class="search-wrapper">
								<span class="input-icon-wrapper input-icon-wrapper-left"><tags-icon title=""/></span>
								<input 
									type="text"
									name="someName" 
									placeholder="tags"
									id="keywordSearch"
									class="upper-body-searchbox"
									v-model="keywordSearch"
									@click="lastActionWasDeselectingKeyword = false"
									@focus="setKeywordSearchFocused(true)"
									@blur="setKeywordSearchFocused(false)"
								/>
								<span class="input-icon-wrapper input-icon-wrapper-right cursor-pointer"
											v-show="keywordSearch"
											@click="clearKeywordSearchField()">
									<cross-icon title="Clear"/>
								</span>
								<div id="keywordResults" v-if="keywordSearchFocused">
									<div
										v-for="keywordObject in keywordsMatchingSearch" 
										:key="keywordObject.keyword"
										@click="addSelectedKeyword(keywordObject.keyword)"
										@mouseover="keywordResultHovered = keywordObject.keyword"
										@mouseout="keywordResultHovered = undefined"
										class="keyword-result">
											{{keywordObject.keyword}} ({{keywordObject.count}})
									</div>
								</div>
							</div>
						</div>
					</div>
						<div id="selectedKeywords" v-if="$store.getters.selectedKeywords.length > 0" class="upper-body-horiz-row" style="margin-top: 0px;">
							<div 
								v-for="keyword in $store.getters.selectedKeywords" 
								:key="keyword"
								@click="removeSelectedKeyword(keyword)"
								class="selected-keyword">
									{{keyword}}<cross-icon/>
							</div>
						</div>

					<div class="upper-body-horiz-row">
						<table class="horiz-row-inner" style="table-layout: auto;">
							<tr>
								<td
									:class="{'button-selected': $store.getters.sorting === 'updated'}"
									@click="onSortingButtonClick('updated')">
									Recently updated
								</td>
								<td
									:class="{'button-selected': $store.getters.sorting === 'userRating'}"
									@click="onSortingButtonClick('userRating')">
									User rating
								</td>
								<td
									:class="{'button-selected': $store.getters.sorting === 'yourRating'}"
									@click="onSortingButtonClick('yourRating')">
									Your rating
								</td>
							</tr>
						</table>
					</div>
					

					<div class="upper-body-horiz-row" style="display: flex; justify-content: space-evenly;">
						<!-- MOBILE VIEW: LIST OR CARD -->
						<table class="horiz-row-inner" style="width: auto;" v-if="$breakpoint.xsOnly">
							<tr>
								<td
									@click="setViewMode('list')"
									:class="{'button-selected': $store.getters.viewMode === 'list'}"
								>
									List
								</td>
								<td
									@click="setViewMode('card')"
									:class="{'button-selected': $store.getters.viewMode === 'card'}"
								>
									Cards
								</td>
							</tr>
						</table>
						
						<!-- BIG VIEW: DETAIL LEVEL -->
						<table class="horiz-row-inner" style="width: auto;">
							<tr>
								<td
									@click="setDetailLevel('low')"
									:class="{'button-selected': $store.getters.detailLevel === 'low'}"
								>
									Simple
								</td>
								<td
									@click="setDetailLevel('high')"
									:class="{'button-selected': $store.getters.detailLevel === 'high'}"
								>
									Detailed
								</td>
							</tr>
						</table>
					</div>

					<div style="display: flex; flex-direction: row; align-items: center;" class="upper-body-horiz-row">
						<div @click="paginate('down')" class="pagination-button"><left-arrow/></div>
						<div v-for="(pageNo, index) in paginationButtons"
								:key="index"
								:class="{'button-selected': $store.getters.pageNumber===pageNo, 'dot-dot-dot-button': pageNo==='...'}"
								class="pagination-button"
								@click="paginate(pageNo)">
							{{pageNo}}
						</div>
						<div @click="paginate('up')" class="pagination-button"><right-arrow/></div>
					</div>
				</span>
			</div>
		</div>

		<div class="comic-card-small-container" v-if="$breakpoint.xsOnly && $store.getters.viewMode=='list'">
			<comic-card-small v-for="comic in $store.getters.displayedComics" :key="comic.id" :comic="comic"/>
		</div>
		<div class="comic-card-container" v-else>
			<comic-card v-for="comic in $store.getters.displayedComics" :key="comic.id" :comic="comic">
			</comic-card>
		</div>

		<expanded-comic-card v-show="$store.getters.comicCardExpanded"/>
	</div>
</template>

<script>
import ComicCard from '@/components/ComicCard.vue'
import ComicCardSmall from '@/components/ComicCardSmall.vue'
import ExpandedComicCard from '@/components/ExpandedComicCard.vue'
import config from '@/config.json'
import SearchIcon from 'vue-material-design-icons/Magnify.vue'
import TagsIcon from 'vue-material-design-icons/TagMultiple.vue'
import DonateIcon from 'vue-material-design-icons/CurrencyUsd.vue'
import CrossIcon from 'vue-material-design-icons/Close.vue'
import PlusIcon from 'vue-material-design-icons/Plus.vue'
import LeftArrow from 'vue-material-design-icons/ArrowLeft.vue'
import RightArrow from 'vue-material-design-icons/ArrowRight.vue'
import LoginIcon from 'vue-material-design-icons/Login.vue'
import SignupIcon from 'vue-material-design-icons/AccountPlusOutline.vue'

import keywordApi from '../api/keywordApi'

export default {
	name: 'comic-list',
	components: {
		'comic-card': ComicCard,
		'comic-card-small': ComicCardSmall,
		'expanded-comic-card': ExpandedComicCard,
		'search-icon': SearchIcon,
		'tags-icon': TagsIcon,
		'donate-icon': DonateIcon,
		'plus-icon': PlusIcon,
		'cross-icon': CrossIcon,
		'left-arrow': LeftArrow,
		'right-arrow': RightArrow,
		'login-icon': LoginIcon,
		'signup-icon': SignupIcon,
	},
	data: function () {
		// Initially attempted to not use references like this (and instead only use
		// vuex state), but it seems vuex isn't quite ready for this yet.
		return {
			config: config,
			allKeywords: [],
			displayedComics: this.$store.getters.displayedComics,
			keywordSearch: '',
			keywordSearchFocused: false,
			keywordResultHovered: undefined,
			lastActionWasDeselectingKeyword: false, // needed because @click of keywordResult fires too often
			smallPagination: undefined,
			searchFiltering: '',
		}
	},
	methods: {
		onCategoryFilterClick (filter) {
			this.$store.commit('addCategoryFilter', filter)
		},
		onTagFilterClick (filter) {
			this.$store.commit('addTagFilter', filter)
		},
		onSortingButtonClick ( sortButtonName ) {
			this.$store.commit('setSorting', sortButtonName)
		},
		paginate ( pageNumber ) {
			if ( pageNumber === '...' ) { return }
			if (pageNumber === 'down') {
				if (this.$store.getters.pageNumber > 1) {
					this.$store.commit('setPageNumber', this.$store.getters.pageNumber-1)
				} 
			}
			else if (pageNumber === 'up') {
				if (this.$store.getters.pageNumber * config.comicsPerPage < this.$store.getters.filteredComics.length) {
					this.$store.commit('setPageNumber', this.$store.getters.pageNumber+1)
				}
			}
			else if ( typeof(pageNumber) !== 'number') { pageNumber = 1 }
			else {
				this.$store.commit('setPageNumber', pageNumber)
			}

			this.setRouterQuery()
		},

		addSelectedKeyword ( keywordName ) {
			if (!this.lastActionWasDeselectingKeyword) {
				this.lastActionWasDeselectingKeyword = true
				this.$store.commit('addSelectedKeyword', keywordName+'')
				this.keywordSearchFocused = undefined
				this.keywordSearch = ''
			}
			keywordApi.logKeywordSearch(keywordName)
		},

		removeSelectedKeyword ( keywordName ) {
			this.$store.commit('removeSelectedKeyword', keywordName)
		},

		filterComicByTag ( comicObject ) {
			return this.$store.getters.categoryFilter.indexOf('All') === 0 || this.$store.getters.categoryFilter.indexOf(comicObject.tag) >= 0
		},
		filterComicByCategory ( comicObject ) {
			return this.$store.getters.tagFilter.indexOf('All') === 0 || this.$store.getters.tagFilter.indexOf(comicObject.cat) >= 0
		},
		filterComicByNameOrArtist ( comicObject ) {
			return comicObject.name.toLowerCase().indexOf( this.$store.getters.searchFiltering.toLowerCase() ) >= 0 
				|| comicObject.artist.toLowerCase().indexOf( this.$store.getters.searchFiltering.toLowerCase() ) >= 0
		},
		filterComicByKeywords ( comicObject ) {
			if ( this.$store.getters.selectedKeywords.length === 0 ) { return true }
			for (var keyword of this.$store.getters.selectedKeywords) {
				if (comicObject.keywords.indexOf(keyword) === -1) { return false }
			}
			return true
		},
		setRouterQuery () {
			let queryObj = {}
			if (this.$store.getters.categoryFilter.indexOf('All') < 0) {
				queryObj.category = this.$store.getters.categoryFilter
			}
			if (this.$store.getters.tagFilter.indexOf('All') < 0) {
				queryObj.classification = this.$store.getters.tagFilter
			}
			if (this.$store.getters.searchFiltering) {
				queryObj.search = this.$store.getters.searchFiltering
			}
			if (this.$store.getters.selectedKeywords.length > 0) { 
				queryObj.tags = this.$store.getters.selectedKeywords
			}
			this.$router.replace({query: queryObj})
		},
		setFiltersFromRouterQuery () {
			if (!this.$route || !this.$route.query) { return }
			if (this.$route.query.category) {
				this.$store.commit('setCategoryFilter', this.listify(this.$route.query.category))
			}
			if (this.$route.query.classification) {
				this.$store.commit('setTagFilter', this.listify(this.$route.query.classification))
			}
			if (this.$route.query.search) {
				this.$store.commit('setSearchFiltering', this.$route.query.search)
				this.searchFiltering = this.$route.query.search
			}
			if (this.$route.query.tags) {
				this.$store.commit('setSelectedKeywords', this.listify(this.$route.query.tags))
			}
		},
		showLoginModal ( clickEvent ) {
			clickEvent.preventDefault()
			this.$store.commit('setLoginModalVisibility', true)
		},
		showSignupModal (clickEvent) {
			clickEvent.preventDefault()
			this.$store.commit('setLoginModalContext', 'register')
			this.$store.commit('setLoginModalVisibility', true)
		},
		setKeywordSearchFocused ( isFocused ) {
			// Needed because if there is no search term, then technically the results div is 
			// hidden (by the onblur event invoking this method) before the onclick fires,
			// so there is nothing to be "onclicked".
			// In other words, the first if happens whenever the user clicks a keyword.
			if (this.keywordResultHovered) { this.addSelectedKeyword(this.keywordResultHovered) } 
			this.keywordSearchFocused = isFocused || this.keywordSearch != ''
		},
		setDetailLevel ( detailLevel ) {
			this.$store.commit('setDetailLevel', detailLevel)
			this.$cookies.set('detail', detailLevel)
		},
		setViewMode (viewMode) {
			this.$store.commit('setViewMode', viewMode)
			this.$cookies.set('viewmode', viewMode)
		},
		clearSearchField () {
			this.searchFiltering = ''
		},
		clearKeywordSearchField () {
			this.keywordSearch = ''
			this.setKeywordSearchFocused(false)
		},
		handleResize () {
			this.smallPagination = document.body.clientWidth < 1200
		},
		listify ( input ) {
			if (typeof(input) === 'string') { return [input] }
			else { return input }
		}
	},
	watch: {
		searchFiltering: function () {
			this.$store.commit('setSearchFiltering', this.searchFiltering)
		},
	},
  created: async function() {
		if (this.$cookies.get('detail')) { this.setDetailLevel(this.$cookies.get('detail')) }
		if (this.$cookies.get('viewMode')) { this.setviewMode(this.$cookies.get('viewMode')) }
		this.setFiltersFromRouterQuery()
		this.$store.commit('setLoginModalVisibility', false)
		this.$store.dispatch('calculateFilteredComics')
		this.$store.watch(this.$store.getters.getFilteredComics, this.paginate)
		this.handleResize()
		window.addEventListener('resize', this.handleResize)
		this.allKeywords = await keywordApi.getKeywordList()
	},
	computed: {
		keywordsMatchingSearch () {
			return this.allKeywords.filter(keyword => keyword.keyword.startsWith(this.keywordSearch))
				.slice(0, 8)
		},
		paginationButtons () {
			let pages = Math.ceil(this.$store.state.comicList.numberOfFilteredComics / config.comicsPerPage) //todo gettable?
			let currentPage = this.$store.getters.pageNumber
			let buttonList = []
			if (pages <= 9) {
				for (var i = 1; i < pages+1; i++) { buttonList.push(i) }
				return buttonList
			}
			if (currentPage <= 5) {
				return [1, 2, 3, 4, 5, 6, 7, '...', pages]
			}
			if (currentPage >= pages-4) {
				return [1, '...', pages-6, pages-5, pages-4, pages-3, pages-2, pages-1, pages]
			}
			else {
				return [1, '...', currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2, '...', pages]
			}
		}
	}
}
</script>


<style lang="scss">
.donate-link {
	margin-top: 10px;
	@media (max-width: 900px) {
		margin-top: 8px;
	}
}

#upperBodyDiv {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: $themeGray0;
	color: white;
	h1 {
		color: #333; //todo
		font-family: 'Shrikhand', cursive;
	}
	h2 {
		margin: 45px 0px;
	}
	.text-button {
		color: $theme4;
		text-decoration: underline;
		font-size: 16px;
	}
}

#keywordResults {
	position: absolute;
	min-width: 100%;
	overflow: auto;
	flex-direction: column;
	justify-content: center;
	z-index: 2;
	background: rgba(255, 255, 255, 0.95);
	box-shadow: 0px 4px 13px 0px rgba(0,0,0,0.2);
}

.keyword-result {
	width: 100%;
	text-align: center;
	color: #444 !important;
	font-size: 12px;
	padding: 3px 0px;
	font-weight: 300;
	&:hover {
		background-color: $themeGray1;
		color: $theme4 !important;
		cursor: pointer;
	}
}

#keywordSearch {
	min-width: 100%;
	box-sizing: border-box;
}

#selectedKeywords {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-end;
	margin-bottom: 7px;
}
	
.selected-keyword {
	border: 0.5px solid #666;
	font-size: 12px;
	padding: 1px 4px 1.5px 6px;
	border-radius: 15px;
	font-weight: 300;
	margin: 0px 2px;
	&:hover {
		cursor: pointer;
		text-decoration: line-through;
		color: $themeRed2;
		border-color: $themeRed2;
	}
	span {
		svg {
			bottom: -0.22em !important;
			margin-right: -1px;
		}
	}
}

.pagination-button {
	padding: 5px;
	flex: 1;
	&:not(:first-child) {
		border-left: none;
	}
}

.buttons-container {
	box-shadow: 0px 0px 16px 0px $themeGray3;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
	margin-top: 20px;
	background: $themeGray1;
	padding: 24px 0;
	border-top: 1px solid $themeGray3;
	border-bottom: 1px solid $themeGray3;
	>div, >table {
		margin: 7px 0px;
	}
	@media (max-width: 900px) {
		padding: 10px 0;
		>div, >table {
			margin: 5px 0px;
		}
	}
}

.upper-body-horiz-row {
	width: 100%;
	margin: 7px 0;

	@media (max-width: 900px) {
		margin: 6px 0;
	}
}

.pagination-button, .horiz-row-inner td {
	background: $themeGray5;
	color: white;
	padding: 8px 10px;
	font-weight: 400;

	font-size: 14px;

	&:hover {
		cursor: pointer;
		background: $themeGray3;
	}

	@media (max-width: 900px) {
		padding: 4px 10px;
	}
}

#catTable td {
	@media (max-width: 900px) {
		padding: 4px 1px;
	}
}

.horiz-row-inner {
	width: 100%;
	table-layout: fixed;
	border-collapse: collapse;
	border-radius: 20px;
	td {
		text-align: center;
		font-weight: 400;
	}
}

.button-selected {
	background: $theme5 !important;
	font-weight: 400;
}

.one-searchbox-container {
	position: relative;
}

.upper-body-searchbox {
	box-sizing: border-box;
	padding: 7px;
	text-align: center;
	border: 0.5px solid $themeGray5;
	background: #f0f0f0;
	outline: none;
	color: #333;
	width: 100%;
	@media (max-width: 900px) {
		padding: 5px;
	}
}

.input-icon-wrapper {
	color: $themeDark1;
	position: absolute;
	display: block;
	top: 6px;
	@media (max-width: 900px) {
		top: 4px;
	}
}

.input-icon-wrapper-right {
	right: 9px;
	@media (max-width: 900px) {
		right: 6px;
	}
	&:hover {
		color: $themeRed;
	}
}

.input-icon-wrapper-left {
	left: 9px;
	@media (max-width: 900px) {
		left: 6px;
	}
}

.search-wrapper {
	width: 47%;
	position: relative;
	@media (max-width: 900px) {
		width: 49%;
	}
}

.two-search-row {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	@media (max-width: 900px) {
		justify-content: space-evenly;
	}
}

::placeholder {
	color: $themeGray5;
	font-size: 12px;
}

.comic-card-container {
	margin-top: 16px;
	display: flex;
	flex-direction: row;
	width: 100%;
	flex-wrap: wrap;
	justify-content: center;

	@media (max-width: 900px) {
		margin-top: 12px;
	}
}

.comic-card-small-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 6px;
}

.dark {
	.buttons-container {
		background-color: rgba(255, 255, 255, 0.04);
		box-shadow: 0px 0px 16px 0px rgba(255, 255, 255, 0.04);
		border-top: 1px solid $themeDark2;
		border-bottom: 1px solid $themeDark2;
	}
	.button-selected {
		background: $theme4p5 !important;
		color: white;
	}
	#upperBodyDiv {
		background: linear-gradient(to top right, $themeBlue1, #0D1C23, $theme0);
		h1 {
			color: white;
		}
	}
	.upper-body-horiz-row {
		border: 1px solid $themeDark2;
	}
	.horiz-row-inner td, .pagination-button {
		background: rgba(0, 0, 0, 0.3);
		&:hover {
			cursor: pointer;
			background: rgba(255, 255, 255, 0.1);
		}
	}
	.one-searchbox-container input, #keywordSearch {
		border-color: $themeDark2;
		background: rgba(0, 0, 0, 0.1);

	}
	.keyword, .selected-keyword {
		border-color: #555;
		color: white;
		&:hover {
			color: $themeRed2;
		}
	}
	.keyword-result {
		color: #eee !important;
		background: rgba(9, 15, 20, 0.96);
		&:hover {
			background: $themeBlue1;
			color: $themeBlue;
		}
	}
}
	
#upperBodyWidth {
	width: 50%;
	@media (max-width: 900px) {
		width: 100%;
	}
}

.dot-dot-dot-button {
	&:hover {
		cursor: default;
	}
}
</style>