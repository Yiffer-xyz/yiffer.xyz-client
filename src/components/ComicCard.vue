<template>
	<div class="comic-card" v-bind:class="{ 'comic-card-dark': darkTheme }">
		<a href="#"><img :src="'comics/'+comic.name+'/s.jpg'"></a>
		<a href="#"><p class="comic-card-comic-title"><b>{{comic.name}}</b></p></a>
		<p><a href="#" class="comic-card-artist">{{comic.artist}}</a></p>

		<div class="horiz-card-row">
			<p><i class="fas fa-file"></i> {{comic.numberOfPages}}</p>
			<p><i class="fas fa-users"></i> {{formatRating(comic.userRating)}}</p>
			<p><i class="fas fa-user"></i> {{comic.yourRating}}</p>
		</div>

		<div class="keyword-container">
		</div>
	</div>
</template>

<script>
export default {
	name: 'comic-card',
	props: {
		comic: Object
	},
	data: function () {
		return {
			darkTheme: window.darkTheme
		}
	},
	methods: {
		formatRating: function (number) {
			if (number > 8.5) { return Math.round(number * 100) / 100 }
			else { return Math.round(number * 10) / 10 }
		}
	}
}
</script>

<style lang="sass">
$linkColor: #3984d4
$cardBgColorLight: #f1f1f1
$cardBgColorDark: #222426

.comic-card 
	width: 200px
	display: flex
	flex-direction: column
	align-items: center
	border-radius: 8px
	overflow: hidden
	margin: 10px
	padding-bottom: 8px
	background-color: $cardBgColorLight
	justify-content: space-between
	&:hover
		box-shadow: 0 0 10px 1px $linkColor
	img
		width: 100%
	a
		text-decoration: none
		color: $linkColor
	p, div
		color: black
	.horiz-card-row
		display: flex
		flex-direction: row
		justify-content: space-around
		width: 90%
		p:hover
			cursor: default
	.comic-card-comic-title
		font-weight: 400
		margin: 0px 10px
		text-align: center

.keyword-container 
	margin-top: 7px
	display: flex
	flex-direction: row
	flex-flow: row wrap
	justify-content: center
.keyword
	font-size: 12px
	border: 0.4px solid #ccc	 
	margin: 1px 3px
	padding: 1px 6px
	border-radius: 10px
	&:hover
		color: $linkColor !important
		cursor: pointer
		border-color: $linkColor

.dark
	.comic-card
		background-color: $cardBgColorDark
		p, div
			color: #ddd
</style>
