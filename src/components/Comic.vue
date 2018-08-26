<template>
	<span class="text-align-center">
		<div>
			<h1>{{$route.params.comicName}}</h1>
		</div>
		<div v-if="comic">
			<h2>by <a href="#">{{comic.artist}}</a></h2>
			<button v-if="userIsDonator" class="y-button-important">Download comic</button>
			<p>You must log in to vote. <a href="#">Log in</a></p>
			<router-link :to="'/'">← back to index</router-link>	

			<div class="normal-button-row">
				<button v-on:click=" imageFit='height' " class="y-button">Fit screen H</button>
				<button v-on:click=" imageFit='width'  " class="y-button">Fit screen W</button>
				<button v-on:click=" imageFit='big'    " class="y-button">Big</button>
				<button v-on:click=" imageFit='thumb'  " class="y-button">Thumb</button>
			</div>

			<div id="comic-page-container">
				<img 
					v-for="pageNumber in comic.numberOfPages" 
					:src="`https://yiffer.xyz/comics/${comic.name}/${formattedPageNumber(pageNumber)}.jpg`"
					:alt="`${comic.name} page ${pageNumber}`"
					v-bind:key="pageNumber"
					v-bind:class="{
						'img-fit-height': imageFit==='height', 
						'img-fit-width':  imageFit==='width',
						'img-fit-thumb':  imageFit==='thumb'
					}"
					v-on:click=""/>
				</div>
		</div>

		<div v-else-if="!comicNotFound">
			Loading comic
		</div>

		<div v-else>
			Comic not found
		</div>
	</span>
</template>

<script>
export default {
	name: 'comic',
	props: {
		userInfo: Object
	},
	data: function () {
		return {
			comic: this.$store.state.clickedComic || undefined,
			userIsDonator: false,
			comicNotFound: false,
			imageFit: undefined,
		}
	},
	methods: {
		formattedPageNumber: pageNumber => pageNumber<10 ? '0'+pageNumber : pageNumber,
	},
	created: async function () {
		if ( !this.comic ) {
			this.comic = await mockGetComic()
		}
	}
}

async function mockGetComic () {
	let x = await new Promise( (resolve, reject) => {
		setTimeout(() => {
			resolve({"id":343,"name":"Dress to Undress","cat":"MM","tag":"Furry","artist":"Seth-Iova","updated":"2017-10-24T11:04:46.000Z","finished":0,"created":"2017-07-01T00:00:00.000Z","numberOfPages":21,"userRating":7.881,"yourRating":0})
		}, 500)
	})
	return x
}


</script>

<style lang="sass">
$linkColor: #3984d4
$cardBgColorLight: #f1f1f1
$cardBgColorDark: #222426

.text-align-center
	text-align: center

#comic-page-container
	display: flex
	flex-direction: column
	align-items: center
	margin-top: 15px
	img
		margin-bottom: 15px

.img-fit-height
	max-height: 22px

.img-fit-width
	max-width: 95px

.img-fit-thumb
	max-height: 90px
</style>
