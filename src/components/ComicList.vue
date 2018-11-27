<template>
	<div style="width: 100%">
		<vue-headful title="Yiffer.xyz"/>
		<div class="upper-body-div">
			<h1>Yiffer.xyz</h1>
			<p style="font-size: 20px">A collection of high-quality comics</p>

			<p style="margin-top: 10px;" v-if="!$store.state.username">
				<button class="y-button" v-on:click="showLoginModal">
					<i data-feather="log-in"></i> Log in
				</button> 
				&nbsp;to vote
			</p>

			<router-link :to="{name: 'donate'}" style="margin-top: 16px;">
				<i class="fas fa-donate" style="text-decoration: none;"></i> Donate?
			</router-link>

			<div class="buttons-container">
				<span class="upper-body-width buttons-container-inner">
					<div class="div-row">
						<table class="button-row">
								<tr>
										<td 
											v-bind:class="{'button-selected': filters.category.indexOf('All') >= 0}"
											v-on:click="onFilterClick( 'category', 'All' )">
											All
										</td>      
										<td 
											v-bind:class="{'button-selected': filters.category.indexOf('Furry') >= 0}"
											v-on:click="onFilterClick( 'category', 'Furry' )">
											Furry
										</td>        
										<td 
											v-bind:class="{'button-selected': filters.category.indexOf('MLP') >= 0}"
											v-on:click="onFilterClick( 'category', 'MLP' )">
											MLP
										</td>     
										<td 
											v-bind:class="{'button-selected': filters.category.indexOf('Pokemon') >= 0}"
											v-on:click="onFilterClick( 'category', 'Pokemon' )">
											Pokemon
										</td>     
										<td 
											v-bind:class="{'button-selected': filters.category.indexOf('Other') >= 0}"
											v-on:click="onFilterClick( 'category', 'Other' )">
											Other
										</td>     
								</tr>
						</table>
					</div>

					<div class="div-row">
						<table class="button-row">
								<tr>
										<td
											v-bind:class="{'button-selected': filters.tag.indexOf('All') >= 0}"
											v-on:click="onFilterClick( 'tag', 'All' )">
											All
										</td>
										<td
											v-bind:class="{'button-selected': filters.tag.indexOf('M') >= 0}"
											v-on:click="onFilterClick( 'tag', 'M' )">
											M
										</td>
										<td
											v-bind:class="{'button-selected': filters.tag.indexOf('F') >= 0}"
											v-on:click="onFilterClick( 'tag', 'F' )">
											F
										</td>
										<td
											v-bind:class="{'button-selected': filters.tag.indexOf('MF') >= 0}"
											v-on:click="onFilterClick( 'tag', 'MF' )">
											MF
										</td>
										<td
											v-bind:class="{'button-selected': filters.tag.indexOf('MM') >= 0}"
											v-on:click="onFilterClick( 'tag', 'MM' )">
											MM
										</td>
										<td
											v-bind:class="{'button-selected': filters.tag.indexOf('FF') >= 0}"
											v-on:click="onFilterClick( 'tag', 'FF' )">
											FF
										</td>
										<td
											v-bind:class="{'button-selected': filters.tag.indexOf('MF+') >= 0}"
											v-on:click="onFilterClick( 'tag', 'MF+' )">
											MF+
										</td>
										<td
											v-bind:class="{'button-selected': filters.tag.indexOf('I') >= 0}"
											v-on:click="onFilterClick( 'tag', 'I' )">
											I
										</td>
								</tr>
						</table>
					</div>

					<div style="width: 100%; margin: 7px 0;">
						<div class="two-search-row">
								<div class="search-wrapper">
									<div class="one-searchbox-container" id="mainSearchBox">
											<input v-model="searchFiltering" type="text" name="someName" placeholder="name or artist" class="upper-body-searchbox"/>
									</div>
								</div>

								<div class="search-wrapper">
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
										<div id="keywordResults" v-if="keywordSearchFocused">
												<div 
													v-for="keywordObject in keywordsMatchingSearch" 
													v-bind:key="keywordObject.name"
													@click="addSelectedKeyword(keywordObject.name)"
													@mouseover="keywordResultHovered = keywordObject.name"
													@mouseout="keywordResultHovered = undefined"
													class="keyword-result">
														{{keywordObject.name}} ({{keywordObject.count}})
												</div>
										</div>
								</div>
						</div>
					</div>
						<div id="selectedKeywords" v-if="$store.state.selectedKeywords.length > 0" class="div-row" style="margin-top: 0px;">
								<div 
									v-for="keyword in $store.state.selectedKeywords" 
									v-bind:key="keyword"
									@click="removeSelectedKeyword(keyword)"
									class="selected-keyword">
										{{keyword}}
								</div>
						</div>

					<div class="div-row">
						<table class="button-row">
								<tr>
										<td
											v-bind:class="{'button-selected': $store.state.sorting === 'updated'}"
											v-on:click="onSortingButtonClick('updated')">
											Recently updated
										</td>
										<td
											v-bind:class="{'button-selected': $store.state.sorting === 'userRating'}"
											v-on:click="onSortingButtonClick('userRating')">
											User rating
										</td>
										<td
											v-bind:class="{'button-selected': $store.state.sorting === 'yourRating'}"
											v-on:click="onSortingButtonClick('yourRating')">
											Your rating
										</td>
								</tr>
						</table>
					</div>

					<div class="div-row" style="width: fit-content; ">
						<table class="button-row" style="width: auto;">
								<tr>
										<td
											@click="setDetailLevel('No detail')"
											v-bind:class="{'button-selected': $store.state.detailLevel === 'No detail'}"
										>
											No detail
										</td>
										<td
											@click="setDetailLevel('Medium detail')"
											v-bind:class="{'button-selected': $store.state.detailLevel === 'Medium detail'}"
										>
											Medium detail
										</td>
										<td
											@click="setDetailLevel('High detail')"
											v-bind:class="{'button-selected': $store.state.detailLevel === 'High detail'}"
										>
											High detail
										</td>
								</tr>
						</table>
					</div>

					<div style="display: flex; flex-direction: row; align-items: center;" class="div-row">
						<div style="padding-bottom: 10px; padding-top: 6px;" @click="paginateUpOrDown('down')" class="pagination-button">&larr;</div>
						<div v-for="(pageNo, index) in paginationButtons"
								:key="index"
								:class="{'button-selected': $store.state.pageNumber===pageNo, 'dot-dot-dot-button': pageNo==='...'}"
								class="pagination-button"
								@click="paginate(pageNo)">
							{{pageNo}}
						</div>
						<div style="padding-bottom: 10px; padding-top: 6px;" @click="paginateUpOrDown('up')" class="pagination-button">&rarr;</div>
					</div>
				</span>
			</div>
		</div>

		<div class="comic-card-container">
			<comic-card v-for="comic in $store.state.displayComics" v-bind:key="comic.id" v-bind:comic="comic" v-bind:detailLevel="$store.state.detailLevel">
			</comic-card>
		</div>
	</div>
</template>

<script>
import ComicCard from '@/components/ComicCard.vue'
import LoginModal from '@/components/LoginModal.vue'
import config from '@/config.json'

export default {
	name: 'comic-list',
	components: { 'comic-card': ComicCard, 'login-modal': LoginModal },
	data: function () {
		return {
			config: config,
			allKeywords: [],
			filters: this.$store.state.filters,
			selectedKeywords: this.$store.state.selectedKeywords,
			comicList: this.$store.state.comicList,
			displayComics: this.$store.state.displayComics,
			totalNumberOfComics: this.$store.state.totalNumberOfComics,
			searchFiltering: this.$store.state.searchFiltering,
			keywordSearch: '',
			keywordSearchFocused: false,
			keywordResultHovered: undefined,
			lastActionWasDeselectingKeyword: false, // needed because @click of keywordResult fires too often
			smallPagination: undefined,
			numberOfPages: Math.ceil(this.$store.state.comicList/config.comicsPerPage),
		}
	},
	methods: {
		onFilterClick ( filterType, selectedFilter ) {
			this.$store.commit('addFilter', {filterType: filterType, selectedFilter: selectedFilter})
			this.$store.commit('setPageNumber', 1)
			this.paginate()
		},
		onSortingButtonClick ( sortButtonName ) {
			this.$store.commit('setSorting', sortButtonName)
			this.$store.commit('setPageNumber', 1)
		},
		paginate ( pageNumber ) {
			if ( pageNumber === '...' ) { return }
			if ( pageNumber ) { this.$store.commit('setPageNumber', pageNumber) }

			let filteredComics = this.$store.state.comicList.filter( this.filterComicByTag )
				.filter( this.filterComicByCategory )
				.filter( this.filterComicByNameOrArtist )
				.filter( this.filterComicByKeywords )
			this.$store.commit('setNumberOfFilteredComics', filteredComics.length)
			this.$store.commit('setDisplayComics', filteredComics.slice (
					(this.$store.state.pageNumber-1) * config.comicsPerPage,
					(this.$store.state.pageNumber) * config.comicsPerPage 
				)
			)
		},
		paginateUpOrDown ( upOrDown ) {
			if (upOrDown === 'down') {
				if (this.$store.state.pageNumber > 1) {
					this.paginate(this.$store.state.pageNumber - 1)
				} 
			}
			else {
				if (this.$store.state.comicList.length > this.$store.state.pageNumber * config.comicsPerPage) {
					this.paginate(this.$store.state.pageNumber + 1)
				}
			}
		},
		addSelectedKeyword ( keywordName ) {
			if (!this.lastActionWasDeselectingKeyword) {
				this.lastActionWasDeselectingKeyword = true
				this.$store.commit('addSelectedKeyword', keywordName+'')
				this.keywordSearchFocused = undefined
				this.keywordSearch = ''
			}
		},

		removeSelectedKeyword ( keywordName ) {
			this.$store.commit('removeSelectedKeyword', keywordName)
		},

		filterComicByTag ( comicObject ) {
			return this.filters.category.indexOf('All') === 0 || this.filters.category.indexOf(comicObject.tag) >= 0
		},
		filterComicByCategory ( comicObject ) {
			return this.filters.tag.indexOf('All') === 0 || this.filters.tag.indexOf(comicObject.cat) >= 0
		},
		filterComicByNameOrArtist ( comicObject ) {
			return comicObject.name.toLowerCase().indexOf( this.searchFiltering.toLowerCase() ) >= 0 
				|| comicObject.artist.toLowerCase().indexOf( this.searchFiltering.toLowerCase() ) >= 0
		},
		filterComicByKeywords ( comicObject ) {
			if ( this.$store.state.selectedKeywords.length === 0 ) { return true }
			for (var keyword of this.$store.state.selectedKeywords) {
				if (comicObject.keywords.indexOf(keyword) === -1) { return false }
			}
			return true
		},
		showLoginModal ( clickEvent ) {
			clickEvent.preventDefault()
			this.$store.commit('setLoginModalVisibility', true)
		},
		setKeywordSearchFocused ( isFocused ) {
			// Needed because if there is no search term, then technically the results div is 
			// hidden (by the onblur event invoking this method) before the onclick fires,
			// so there is nothing to be "onclicked". 
			if (this.keywordResultHovered) { this.addSelectedKeyword(this.keywordResultHovered) } 
			this.keywordSearchFocused = isFocused || this.keywordSearch != ''
		},
		setDetailLevel ( detailLevel ) {
			this.$store.commit('setDetailLevel', detailLevel)
		},
		handleResize () {
			this.smallPagination = document.body.clientWidth < 1200
		}
	},
	watch: {
		searchFiltering: function () {
			this.$store.commit('setSearchFiltering', this.searchFiltering)
			this.paginate()
		},
	},
  created: function() {
		this.$store.commit('setLoginModalVisibility', false)
		this.$store.commit('setWhiteThemeButtonStyle', true)
		setTimeout( () => {
			this.$store.commit('setComicList', config.comicList)
			this.$store.commit('setComicList', this.config.comicList)
			// this.$store.commit('setTotalNumberOfComics', 950)
			this.paginate()
			this.$store.commit('setAllKeywords', config.demoKeywords)
		}, 800)

		this.$store.watch(this.$store.getters.getSelectedKeywords, () => this.paginate())
		this.$store.watch(this.$store.getters.getSorting, () => this.paginate())
		this.handleResize()
		window.addEventListener('resize', this.handleResize)
	},
	computed: {
		keywordsMatchingSearch () {
			return this.$store.state.keywordList.filter(keyword => keyword.name.startsWith(this.keywordSearch))
				.sort((kw1, kw2) => kw1.count<kw2.count ? 1 : (kw1.count>kw2.count ? -1 : 0))
				.slice(0, 8)
		},
		paginationButtons () {
			let pages = Math.ceil(this.$store.state.numberOfFilteredComics / config.comicsPerPage)
			let currentPage = this.$store.state.pageNumber
			let buttonList = []
			if (pages <= 9) {
				for (var i = 1; i < pages+1; i++) { buttonList.push(i) }
				return buttonList
			}
			if (currentPage <= 5) {
				return [1, 2, 3, 4, 5, 6, 7, 8, '...', pages]
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
$themeBlue: #009fff;
$themeRed: #ec2f4b;
$theme0: #0d201b;
$theme1: #0e4736;
$theme2: #006d4d;
$theme3: #007754;
$theme4: #00986b;
$theme5: #00d596;
$theme6: #78fdd6;
$theme7: #a9ffe6;
$themeGray0: #fafafa;
$themeGray1: #e7e7e7;
$themeGray2: #dcdcdc;
$themeGray3: #cbcbcb;
$themeGray3p5: #bababa;
$themeGray4: #b0b0b0;
$themeGray5: #a6a6a6;
$themeGray6: #9a9a9a;
$themeGray7: #8e8e8e;
$themeGray8: #7e7e7e;
$themeDark1: #495552;
$themeDark2: #384441;
$themeDark3: #26302c;
$themeDark4: #1a201f;
$themeDark5: #0a0e0c;
$themeRed0: #6b090b;
$themeRed1: #a90509;
$themeRed2: #c80005;
$themeRed3: #fd8f91;
$themeBlue0: #090f14;
$themeBlue1: #0e1a27;

.upper-body-div {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: $themeGray0;
	color: white;
	h1 {
		color: #333;
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
	flex-direction: column;
	justify-content: center;
	box-shadow: 0px 4px 13px 0px rgba(0,0,0,0.2);
}

.keyword-result {
	width: 100%;
	text-align: center;
	color: #444 !important;
	font-size: 12px;
	padding: 3px 0px;
	background: rgba(255, 255, 255, 0.9);
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
}
	
.selected-keyword {
	border: 0.5px solid #666;
	font-size: 12px;
	padding: 0.5px 6px 1px 6px;
	border-radius: 15px;
	font-weight: 300;
	margin: 0px 2px;
	&:hover {
		cursor: pointer;
		text-decoration: line-through;
		color: $themeRed2;
		border-color: $themeRed2;
	}
}

.pagination-button {
	padding: 5px;
	&:not(:first-child) {
		border-left: none;
	}
	flex-grow: 1;
}

.buttons-container {
	box-shadow: 0px 0px 16px 0px $themeGray3;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 30px;
	background: $themeGray1;
	// background: linear-gradient(to bottom left, #e3efeb, #d1dcd9);
	padding: 24px 0;
	border-top: 1px solid $themeGray3;
	border-bottom: 1px solid $themeGray3;
	>div, >table {
		margin: 7px 0px;
	}
	@media (max-width: 900px) {
		margin-top: 12px;
		padding: 10px 0;
		>div, >table {
			margin: 5px 0px;
		}
	}
}

.buttons-container-inner {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.div-row {
	// box-shadow: 0px 2px 6px 0px rgba(138,136,138,0.4);
	width: 100%;
	margin: 7px 0;
}


.pagination-button, .button-row td {
	// border: 0.5px solid $themeGray0;
	background: $themeGray5;
	color: white;
	padding: 8px 10px;
	font-weight: 400;

	&:hover {
		cursor: pointer;
		background: $themeGray3;
	}
}



.button-row {
	width: 100%;
	table-layout: fixed;
	border-collapse: collapse;
	border-radius: 20px;
	td {
		text-align: center;
	}
}

.button-selected {
	background: $themeGray0 !important;
	background: $theme5 !important;
	font-weight: 400;
	// color: $theme2 !important
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
}

.search-wrapper {
	width: 47%;
	position: relative;
}

.two-search-row {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
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
}

.dark {
	.buttons-container {
		background-color: rgba(255, 255, 255, 0.04);
		box-shadow: 0px 0px 16px 0px rgba(255, 255, 255, 0.04);
		border-top: 1px solid $themeDark2;
		border-bottom: 1px solid $themeDark2;
	}
	.upper-body-div {
		background: linear-gradient(to top right, $themeBlue1, #0D1C23, $theme0);
		// background: linear-gradient(to top right, $themeBlue1, $theme0);
		h1 {
			color: white;
		}
	}
	.button-row td, .pagination-button {
		background: rgba(0, 0, 0, 0.3);
	}
	.one-searchbox-container input, #keywordSearch {
		border-color: #111;
		background: rgba(0, 0, 0, 0.1);
	}
	.keyword, .selected-keyword {
		border-color: #555;
		color: #ddd;
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
	.button-row td:hover, .pagination-button:hover {
		cursor: pointer;
		background: rgba(255, 255, 255, 0.1);
	}
}
	
.upper-body-width {
	width: 50%;
}

.dot-dot-dot-button {
	&:hover {
		cursor: default;
	}
}
</style>


<style>
	@media (max-width: 900px) {
		.upper-body-width {
			width: 100%;
		}
	}
</style>