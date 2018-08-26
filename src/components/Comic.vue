<template>
	<span>
		<div>
			<h1>{{$route.params.comicName}}</h1>
		</div>
		<div v-if="comic">
			<h2>by <a href="#">{{comic.artist}}</a></h2>
			<div class="normal-button-row">
				<button v-on:click="setPageFit('height')" class="y-button">Fit screen H</button>
				<button v-on:click="setPageFit('width')" class="y-button">Fit screen W</button>
				<button v-on:click="setPageFit('big')" class="y-button">Big</button>
				<button v-on:click="setPageFit('thumb')" class="y-button">Thumb</button>
			</div>
			<button v-if="userIsDonator" class="y-button-important">Download comic</button>
			<p>You must log in to vote. <a href="#">Log in</a></p>
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
		}
	},
	methods: {
	},
	created: function () {
		if ( !this.comic ) {
			console.log('fetching comic lol')
		}
	}
}
</script>

<style lang="sass">
$linkColor: #3984d4
$cardBgColorLight: #f1f1f1
$cardBgColorDark: #222426

</style>
