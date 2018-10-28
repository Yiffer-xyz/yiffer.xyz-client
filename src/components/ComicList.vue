<template>
	<div style="width: 100%">
		<vue-headful title="Yiffer.xyz"/>
		<div class="upper-body-div">
			<h1>Yiffer.xyz</h1>

			<p style="font-size: 20px">A collection of high-quality comics</p>

			<p style="margin-top: 10px;" v-if="!$store.state.username">
				<button class="text-button" v-on:click="showLoginModal" style="font-weight: 400;">Log in</button> 
				to vote
			</p>

			<p style="margin-top: 10px;"><a href="#">Donate?</a></p>

			<div class="buttons-container">
					<table class="button-row upper-body-width">
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

					<table class="button-row upper-body-width">
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

					<div class="two-search-row upper-body-width">
							<div class="search-wrapper">
								<div class="one-searchbox-container" id="mainSearchBox">
										<input v-model="searchFiltering" type="text" name="someName" placeholder="name or artist" class="upper-body-searchbox"/>
								</div>
							</div>

							<div class="search-wrapper">
									<input 
										type="text"
										name="someName" 
										placeholder="keywords"
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

					<div id="selectedKeywords" class="upper-body-width">
							<div 
								v-for="keyword in $store.state.selectedKeywords" 
								v-bind:key="keyword"
								@click="removeSelectedKeyword(keyword)"
								class="selected-keyword">
									{{keyword}}
							</div>
					</div>

					<table class="button-row upper-body-width">
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

						<table class="button-row">
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


					<table class="pagination-table upper-body-width">
							<tr>
									<td style="padding-bottom: 6px">&larr;</td>
									<td v-for="pageNo in Math.ceil($store.state.totalNumberOfComics/config.comicsPerPage)" 
											v-bind:key="pageNo"
											v-bind:class="{'button-selected': $store.state.pageNumber===pageNo}"
											v-on:click="paginate(pageNo)">
											{{pageNo}}
									</td>
									<td style="padding-bottom: 6px">&rarr;</td>
							</tr>
					</table>
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
		}
	},
	methods: {
		onFilterClick ( filterType, selectedFilter ) {
			this.$store.commit('addFilter', {filterType: filterType, selectedFilter: selectedFilter})
			this.paginate()
		},
		onSortingButtonClick: function ( sortButtonName ) {
			this.$store.commit('setSorting', sortButtonName)
		},
		paginate: function ( pageNumber ) {
			if ( pageNumber ) { this.$store.commit('setPageNumber', pageNumber) }
			this.$store.commit('setDisplayComics', this.$store.state.comicList.filter( this.filterComicByTag )
				.filter( this.filterComicByCategory )
				.filter( this.filterComicByNameOrArtist )
				.filter( this.filterComicByKeywords )
				.slice(
					(this.$store.state.pageNumber-1) * config.comicsPerPage,
					(this.$store.state.pageNumber) * config.comicsPerPage )
				)
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
			this.$store.commit('setTotalNumberOfComics', 950)
			this.paginate()
			this.$store.commit('setAllKeywords', config.demoKeywords)
		}, 800)

		this.$store.watch(this.$store.getters.getSelectedKeywords, () => this.paginate())
		this.$store.watch(this.$store.getters.getSorting, () => this.paginate())
	},
	computed: {
		keywordsMatchingSearch () {
			return this.$store.state.keywordList.filter(keyword => keyword.name.startsWith(this.keywordSearch))
				.sort((kw1, kw2) => kw1.count<kw2.count ? 1 : (kw1.count>kw2.count ? -1 : 0))
				.slice(0, 8)
		}
	}
}
</script>


<style lang="scss">
$themeBlue: #009fff;
$themeRed: #ec2f4b;

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
		background-color: #e3e3e3;
		color: $themeBlue !important;
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
	justify-content: flex-end;
}
	
.selected-keyword {
	border: 0.5px solid white;
	font-size: 12px;
	padding: 0.5px 4px 1px 4px;
	border-radius: 15px;
	font-weight: 300;
	margin: 0px 2px;
	&:hover {
		cursor: pointer;
		text-decoration: line-through;
	}
}
</style>


<style lang="sass">
$themeBlue: #3984d4
$themeBlue: #009fff
$themeRed: #ec2f4b 

.upper-body-div
	width: 100%
	display: flex
	flex-direction: column
	align-items: center
	background: linear-gradient(to top right, $themeBlue, $themeRed)
	color: white
	h1, h2, td, p, div, span, a
		color: white
	h2
		margin: 45px 0px
	a 
		text-decoration: underline
	.text-button
		color: white
		text-decoration: underline
		font-size: 16px

.buttons-container
	width: 100%
	display: flex
	flex-direction: column
	align-items: center
	margin-top: 30px
	background: rgba(255, 255, 255, 0.1)
	padding: 40px 0
	>div, >table
		margin: 7px 0px

.button-row
	table-layout: fixed
	border-collapse: collapse
	border-radius: 20px
	td
		text-align: center
		border: 0.5px solid white
		padding: 5px 10px

.button-row td:hover, .pagination-table td:hover
	cursor: pointer
	background: rgba(255, 255, 255, 0.1)

.button-selected
	background: rgba(255, 255, 255, 0.32) !important

.upper-body-searchbox
	background: rgba(0, 0, 0, 0.1)
	box-sizing: border-box
	padding: 7px
	text-align: center
	background: rgba(255, 255, 255, 0.0)
	border: 0.5px solid white
	outline: none
	color: white
	width: 100%

.search-wrapper
	width: 47%
	position: relative

.two-search-row
	display: flex
	flex-direction: row
	justify-content: space-between

.pagination-table
	table-layout: fixed
	margin-top: 30px
	border-collapse: collapse
	td
		padding: 5px 6px
		border: 0.5px solid white
		text-align: center
		font-size: 14px

::placeholder
	color: rgba(255, 255, 255, 0.4)
	font-size: 12px

.comic-card-container
	display: flex
	flex-direction: row
	width: 100%
	flex-wrap: wrap
	justify-content: center

.dark
	.upper-body-div
		background: linear-gradient(to bottom left, #330a10, #001726)
	.button-row td, .pagination-table td
		background: rgba(0, 0, 0, 0.2)
		border: 1px solid rgba(0,0,0,0)
	.button-selected
		background: $themeBlue !important
	.one-searchbox-container input, #keywordSearch
		border-color: #111
		background: rgba(0, 0, 0, 0.1)
	.keyword, .selected-keyword
		border-color: #555
		color: #ddd
		&:hover
			color: $themeRed
	.keyword-result
		color: #eee !important
		background: rgba(22, 22, 22, 0.96)
		&:hover
			background: rgba(18, 18, 18, 1)
			color: $themeBlue
	.button-row td:hover, .pagination-table td:hover
		cursor: pointer
		background: rgba(255, 255, 255, 0.1)
	
.upper-body-width
	width: 50%
</style>

<style>
	@media (max-width: 795px) {
		.upper-body-width {
			width: 100%;
		}
	}
</style>