<template>
	<div class="comic-card">
		<router-link v-bind:comic="comic" :to="{ name: 'comic', params: { comicName: `${comic.name }` } }">
			<img :src="`/comics/${comic.name}/s.jpg`" v-on:click="storeClickedComicData()">
		</router-link>
		<router-link v-bind:comic="comic" :to="{ name: 'comic', params: { comicName: `${comic.name }` } }">
			<p class="comic-card-comic-title"><b>{{comic.name}}</b></p>
		</router-link>
		<router-link v-bind:comic="comic" :to="{ name: 'artist', params: { artistName: comic.artist } }">
			<p class="link-color">{{comic.artist}}</p>
		</router-link>

		<div class="horiz-card-row" v-if="detailLevel === 'Medium detail' || detailLevel === 'High detail'">
			<p><i class="fas fa-file"></i> {{comic.numberOfPages}}</p>
			<p><i class="fas fa-users"></i> {{formatRating(comic.userRating)}}</p>
			<p><i class="fas fa-user"></i> {{comic.yourRating}}</p>
		</div>

		<div class="horiz-card-row" v-if="detailLevel === 'Medium detail' || detailLevel === 'High detail'">
			<div v-if="isNewComic" class="circled-text">NEW</div>
			<div v-if="!comic.finished" class="circled-text">WIP</div>
		</div>

		<div class="keyword-container" v-if="detailLevel === 'High detail'">
			<div 
				v-bind:class="{'keyword': clickableKeyword, 'keyword-static': !clickableKeyword}"
				v-for="keyword in comic.keywords"
				v-bind:key="keyword"
				@click="addSelectedKeyword(keyword)"
			>
				{{keyword}}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'comic-card',
	props: {
		comic: Object,
		detailLevel: String,
		clickableKeyword: {
			type: Boolean,
			default: true
		}
	},
	data: function () {
		return {
			isNewComic: new Date() - new Date(this.comic.created) < 604800000,
		}
	},
	methods: {
		formatRating: function (number) {
			if (number > 8.5) { return Math.round(number * 100) / 100 }
			else { return Math.round(number * 10) / 10 }
		},
		storeClickedComicData: function () {
			this.$store.commit('clickComic', this.comic)
		},
		addSelectedKeyword (keywordName) {
			if ( this.clickableKeyword ) { this.$store.commit('addSelectedKeyword', keywordName) }
		}
	}
}
</script>

<style lang="scss">
$linkColor: #3984d4;

.keyword, .keyword-static {
	font-size: 12px;
	border: 0.5px solid #ccc;
	margin: 1px 3px;
	padding: 0.5px 6px 1px 6px;
	border-radius: 10px;
}
.keyword:hover {
	color: $linkColor !important;
	cursor: pointer;
	border-color: $linkColor;
}
.keyword-static:hover {
	cursor: default;
}
.circled-text {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 33px;
	width: 33px;
	// border: 0.5px solid #444;
	border-radius: 35px;
	font-size: 12px;
	font-weight: 400;
	margin-top: 3px;
	color: #444 !important;
	background-color: #ddd;
}

.dark {
	.circled-text {
		background-color: #333;
		color: #bbb !important;
		// border-color: #444;
	}
}
</style>


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

.dark
	.comic-card
		background-color: $cardBgColorDark
		p, div
			color: #ddd
</style>
