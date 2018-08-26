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
											<input type="text" name="someName" placeholder="name or artist" />
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
									<td class="button-selected">Recently updated</td>
									<td>User rating</td>
									<td>Your rating</td>
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
									<td class="button-selected">1</td>
									<td>2</td>
									<td>3</td>
									<td>4</td>
									<td>5</td>
									<td>6</td>
									<td>7</td>
									<td>8</td>
									<td>9</td>
									<td>10</td>
									<td>11</td>
									<td>12</td>
									<td>13</td>
									<td style="padding-bottom: 6px">&rarr;</td>
							</tr>
					</table>
			</div>
		</div>

		<div class="comic-card-container">
			<comic-card v-for="comic in comicList" v-bind:key="comic.id" v-bind:comic="comic">
			</comic-card>
		</div>
	</div>
</template>

<script>
import ComicCard from '@/components/ComicCard.vue'

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
		},
		resetFilter: function ( typeOfFilter ) { this.filters[typeOfFilter] = ['All'] },
		onSortingButtonClick: function ( sortButtonName ) {
			if ( this.sorting === sortButtonName ) { return }
			this.sorting = sortButtonName
			this.sortComicList()
		},
		sortComicList: function () {
			this.comicList.sort( (c1, c2) => {
				if ( c1[this.sorting] > c2[this.sorting] ) { return 1 }
				else if ( c1[this.sorting] < c2[this.sorting] ) { return -1 }
				else { return 0 }
			})
		},
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
      comicList: [{"id":343,"name":"Dress to Undress","cat":"MM","tag":"Furry","artist":"Seth-Iova","updated":"2017-10-24T11:04:46.000Z","finished":0,"created":"2017-07-01T00:00:00.000Z","numberOfPages":21,"userRating":7.881,"yourRating":0},
				{"id":813,"name":"Lost and Found","cat":"MM","tag":"Furry","artist":"Edesk","updated":"2018-06-18T20:11:22.000Z","finished":0,"created":"2018-02-10T15:40:44.000Z","numberOfPages":52,"userRating":8.8226,"yourRating":0},
				{"id":24,"name":"Critical Success","cat":"I","tag":"Furry","artist":"Roanoak","updated":"2015-01-01T00:00:00.000Z","finished":1,"created":"2017-07-01T00:00:00.000Z","numberOfPages":47,"userRating":8.7143,"yourRating":0},
				{"id":773,"name":"Double Trouble","cat":"MF","tag":"Furry","artist":"Kabier","updated":"2018-06-30T22:14:50.000Z","finished":0,"created":"2017-11-30T13:51:37.000Z","numberOfPages":27,"userRating":8.8452,"yourRating":0},
				{"id":301,"name":"The Valet and the Vixen 1","cat":"MF","tag":"Furry","artist":"Meesh","updated":"2015-01-01T00:00:00.000Z","finished":1,"created":"2017-07-01T00:00:00.000Z","numberOfPages":11,"userRating":8.6,"yourRating":0},
				{"id":570,"name":"Outside the Box","cat":"MM","tag":"Furry","artist":"Tokifuji","updated":"2018-08-03T23:41:18.000Z","finished":0,"created":"2017-07-01T00:00:00.000Z","numberOfPages":67,"userRating":9.0282,"yourRating":0},
				{"id":22,"name":"Comic Relief","cat":"MM","tag":"MLP","artist":"Braeburned","updated":"2015-01-01T00:00:00.000Z","finished":1,"created":"2017-07-01T00:00:00.000Z","numberOfPages":43,"userRating":8.975,"yourRating":0},
				{"id":498,"name":"May the Best Man Win","cat":"MM","tag":"Furry","artist":"SigmaX","updated":"2018-06-10T11:43:18.000Z","finished":0,"created":"2017-07-01T00:00:00.000Z","numberOfPages":41,"userRating":8.9688,"yourRating":0},
				{"id":740,"name":"Wishes","cat":"MF","tag":"Furry","artist":"Zummeng","updated":"2018-02-07T02:22:37.000Z","finished":1,"created":"2017-08-30T00:00:00.000Z","numberOfPages":31,"userRating":8.873,"yourRating":0},
				{"id":11,"name":"A Taste of the Order","cat":"FF","tag":"Furry","artist":"Wolfy-Nail","updated":"2015-01-01T00:00:00.000Z","finished":1,"created":"2017-07-01T00:00:00.000Z","numberOfPages":7,"userRating":7.7188,"yourRating":0},
				{"id":464,"name":"No Pain, No Gain","cat":"MM","tag":"Furry","artist":"Powfooo","updated":"2015-01-01T00:00:00.000Z","finished":1,"created":"2017-07-01T00:00:00.000Z","numberOfPages":20,"userRating":8.6716,"yourRating":0},
				{"id":731,"name":"Our Secret","cat":"MM","tag":"Furry","artist":"Blackmailz","updated":"2017-08-25T10:27:13.000Z","finished":1,"created":"2017-08-25T00:00:00.000Z","numberOfPages":25,"userRating":8.6,"yourRating":0},
				{"id":289,"name":"Moving Day","cat":"FF","tag":"Furry","artist":"Kadath","updated":"2015-01-01T00:00:00.000Z","finished":1,"created":"2017-07-01T00:00:00.000Z","numberOfPages":23,"userRating":8.525,"yourRating":0},
				{"id":61,"name":"Night Mares 4","cat":"I","tag":"MLP","artist":"Slypon","updated":"2015-01-01T00:00:00.000Z","finished":1,"created":"2017-07-01T00:00:00.000Z","numberOfPages":25,"userRating":8.375,"yourRating":0},
				{"id":793,"name":"Motion of the Ocean","cat":"MM","tag":"Furry","artist":"Fluke","updated":"2017-12-31T16:25:39.000Z","finished":1,"created":"2017-12-31T16:25:39.000Z","numberOfPages":20,"userRating":8.4359,"yourRating":0},
				{"id":750,"name":"A Tale of Tails - Chapter 3","cat":"I","tag":"Furry","artist":"Feretta","updated":"2017-09-06T05:28:04.000Z","finished":1,"created":"2017-09-06T05:28:04.000Z","numberOfPages":62,"userRating":8.125,"yourRating":0},
				{"id":688,"name":"Furry University","cat":"MM","tag":"Furry","artist":"Tenaflux","updated":"2017-07-29T19:59:00.000Z","finished":1,"created":"2017-07-01T00:00:00.000Z","numberOfPages":28,"userRating":8.0909,"yourRating":0},
				{"id":28,"name":"Daddy Issues","cat":"MM","tag":"Furry","artist":"Black-Kitten","updated":"2018-06-18T20:11:30.000Z","finished":0,"created":"2017-07-01T00:00:00.000Z","numberOfPages":16,"userRating":7.7692,"yourRating":0},
				{"id":582,"name":"Safeword","cat":"MF","tag":"Furry","artist":"Roanoak","updated":"2017-10-24T11:10:12.000Z","finished":1,"created":"2017-07-01T00:00:00.000Z","numberOfPages":67,"userRating":8.9802,"yourRating":0},
				{"id":875,"name":"The Feast of Nero","cat":"MF+","tag":"Furry","artist":"DelKon","updated":"2018-08-03T22:59:41.000Z","finished":0,"created":"2018-06-02T17:14:20.000Z","numberOfPages":34,"userRating":8.6111,"yourRating":0}]
    }
  },
  created: function() {
  }
};
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
