<template>
	<div style="width: 100%">
		<div class="upper-body-div">
			<h1>Lalala overskrift</h1>

			<h2>A collection of high-quality comics</h2>

			<p><a href="#">Log in</a> to vote</p>

			<p style="margin-top: 10px;"><a href="#">Donate?</a></p>

			<div class="buttons-container">
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

					<div style="width: 40%; display: flex; flex-direction: row; justify-content: space-between;">
									<div class="one-searchbox" id="mainSearchBox">
											<input v-model="searchFiltering" type="text" name="someName" placeholder="name or artist" />
									</div>

									<div id="keywordSearchWrapper">
											<div class="one-searchbox keyword-searching">
													<input type="text" name="someName" placeholder="keywords" id="keywordSearch" />
											</div>
											<div id="keywordResults">
													<div class="keyword-result">asdasd (235)</div>
													<div class="keyword-result">asdasd (114)</div>
													<div class="keyword-result">asdasd (4)</div>
													<div class="keyword-result">asdasd (2)</div>
											</div>
									</div>
					</div>

					<div id="selectedKeywords">
							<div class="selected-keyword">asdsd</div>
							<div class="selected-keyword">qe werwe</div>

					</div>

					<table class="button-row">
							<tr>
									<td
										v-bind:class="{'button-selected': sorting === 'updated'}"
										v-on:click="onSortingButtonClick('updated')">
										Recently updated
									</td>
									<td
										v-bind:class="{'button-selected': sorting === 'userRating'}"
										v-on:click="onSortingButtonClick('userRating')">
										User rating
									</td>
									<td
										v-bind:class="{'button-selected': sorting === 'yourRating'}"
										v-on:click="onSortingButtonClick('yourRating')">
										Your rating
									</td>
							</tr>
					</table>

						<table class="button-row">
								<tr>
										<td>No detail</td>
										<td>Medium detail</td>
										<td class="button-selected">High detail</td>
								</tr>
						</table>


					<table class="pagination-table">
							<tr>
									<td style="padding-bottom: 6px">&larr;</td>
									<td v-for="pageNo in Math.ceil(totalNumberOfComics/config.comicsPerPage)" 
											v-bind:key="pageNo"
											v-bind:class="{'button-selected': pageNumber===pageNo}"
											v-on:click="paginate(pageNo)">
											{{pageNo}}
									</td>
									<td style="padding-bottom: 6px">&rarr;</td>
							</tr>
					</table>
			</div>
		</div>

		<div class="comic-card-container">
			<comic-card v-for="comic in displayComics" v-bind:key="comic.id" v-bind:comic="comic">
			</comic-card>
		</div>
	</div>
</template>

<script>
import ComicCard from '@/components/ComicCard.vue'
import config from '@/config.json'

export default {
	name: 'comic-list',
	components: { 'comic-card': ComicCard },
	methods: {
		onFilterClick: function ( typeOfFilter, filterItem ) {
			if (filterItem === 'All') { this.resetFilter( typeOfFilter ) }
			else if ( this.filters[typeOfFilter].indexOf(filterItem) >= 0 ) {
				if ( this.filters[typeOfFilter].length === 1 ) { this.resetFilter( typeOfFilter ) }
				else { this.filters[typeOfFilter].splice( this.filters[typeOfFilter].indexOf(filterItem), 1 ) }
			}
			else {
				if ( this.filters[typeOfFilter].indexOf('All') >= 0 ) { this.filters[typeOfFilter] = [filterItem] }
				else { this.filters[typeOfFilter].push( filterItem ) }
			}
			this.paginate()
		},
		resetFilter: function ( typeOfFilter ) { this.filters[typeOfFilter] = ['All'] },
		onSortingButtonClick: function ( sortButtonName ) {
			if ( this.sorting === sortButtonName ) { return }
			this.sorting = sortButtonName
			this.sortComicList()
		},
		sortComicList: function () {
			this.comicList.sort( (c1, c2) => {
				if ( c1[this.sorting] < c2[this.sorting] ) { return 1 }
				else if ( c1[this.sorting] > c2[this.sorting] ) { return -1 }
				else { return 0 }
			})
			this.paginate()
		},
		paginate: function ( pageNumber ) {
			if ( pageNumber ) { this.pageNumber = pageNumber }
			this.displayComics = this.comicList.filter( this.filterComicByTag )
				.filter( this.filterComicByCategory )
				.filter( this.filterComicByNameOrArtist )
				.slice( (this.pageNumber-1) * config.comicsPerPage, (this.pageNumber) * config.comicsPerPage )
		},

		filterComicByTag: function ( comicObject ) {
			return this.filters.category.indexOf('All') === 0 || this.filters.category.indexOf(comicObject.tag) >= 0
		},
		filterComicByCategory: function ( comicObject ) {
			return this.filters.tag.indexOf('All') === 0 || this.filters.tag.indexOf(comicObject.cat) >= 0
		},
		filterComicByNameOrArtist: function ( comicObject ) {
			return comicObject.name.toLowerCase().indexOf( this.searchFiltering.toLowerCase() ) >= 0 
				|| comicObject.artist.toLowerCase().indexOf( this.searchFiltering.toLowerCase() ) >= 0
		}
	},
	watch: {
		searchFiltering: function () { this.paginate() }
	},
  data: function () {
    return {
			keywordList: [],
      filters: {
				category: ['All'],
        tag: ['All']
			},
			sorting: 'updated',
			selectedKeywords: [],
			searchInput: '',
			pageNumber: 1,
			comicList: [],
			displayComics: [],
			totalNumberOfComics: 0,
			config: config,
			searchFiltering: ''
    }
	},
  created: function() {
		setTimeout( () => {
			this.comicList = this.config.comicList
			this.totalNumberOfComics = 950
			this.paginate()
		}, 800)
  }
}
</script>

<style lang="sass">
$linkColor: #3984d4

.upper-body-div
	width: 100%
	display: flex
	flex-direction: column
	align-items: center
	background: linear-gradient(to top right, #009fff, #ec2f4b)
	color: white
	h1, h2, td, p, div, span, a
		color: white
	h2
		margin: 45px 0px

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
	width: 40%
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

.pagination-table
	table-layout: fixed
	margin-top: 30px
	border-collapse: collapse
	width: 40%
	td
		padding: 5px 6px
		border: 0.5px solid white
		text-align: center
		font-size: 14px

#keywordResults
	position: absolute
	display: none
	flex-direction: column
	justify-content: center
	box-shadow: 0px 4px 13px 0px rgba(0,0,0,0.2)

.keyword-result 
	width: 100%
	text-align: center
	background-color: white
	color: #444
	font-size: 12px
	padding: 3px 0px
	background: rgba(255, 255, 255, 0.9)
	&:hover
		background-color: #e3e3e3
		color: $linkColor
		cursor: pointer

#keywordSearch
	width: 100%
	box-sizing: border-box

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
		background: $linkColor !important
	.one-searchbox input
		border-color: Black
		background: rgba(0, 0, 0, 0.1)
	.keyword, .selected-keyword
		border-color: #555
		color: #eee
	.keyword-result
		color: #ddd
		background: rgba(22, 22, 22, 0.96)
		&:hover
			background: rgba(18, 18, 18, 1)
			color: $linkColor
	.button-row td:hover, .pagination-table td:hover
		cursor: pointer
		background: rgba(255, 255, 255, 0.1)

</style>
