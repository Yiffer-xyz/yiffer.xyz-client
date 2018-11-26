<template>
	<div class="comic-card">
		<router-link v-bind:comic="comic" :to="{ name: 'comic', params: { comicName: `${comic.name }` } }">
			<img :src="`/comics/${comic.name}/s.jpg`" v-on:click="storeClickedComicData()">
		</router-link>
		<router-link v-bind:comic="comic" :to="{ name: 'comic', params: { comicName: `${comic.name }` } }">
			<p class="comic-card-comic-title"><b>{{comic.name}}</b></p>
		</router-link>
		<router-link v-bind:comic="comic" :to="{ name: 'artist', params: { artistName: comic.artist } }">
			<p class="link-color" style="font-weight: 400;">{{comic.artist}}</p>
		</router-link>

		<div class="horiz-card-row" v-if="detailLevel === 'Medium detail' || detailLevel === 'High detail'">
			<p><i class="fas fa-file"></i> {{comic.numberOfPages}}</p>
			<p><i class="fas fa-users"></i> {{formatRating(comic.userRating)}}</p>
			<p><i class="fas fa-user"></i> {{comic.yourRating}}</p>
		</div>

		<div class="horiz-card-row" v-if="detailLevel === 'Medium detail' || detailLevel === 'High detail'">
			<div v-if="isNewComic" class="circled-text circled-text-red">NEW</div>
			<div v-if="recentlyFinished" class="circled-text circled-text-red" title="Recently finished">RF</div>
			<div v-if="!comic.finished" class="circled-text" title="Work in progress (comic not finished)">WIP</div>
		</div>

		<voting-button
			v-bind:comic="comic"
			v-bind:backgroundColors="{light: '#f1f1f1', dark: '#222426'}"
			v-if="detailLevel === 'Medium detail' || detailLevel === 'High detail'"
		></voting-button>

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
import VotingButton from '@/components/VotingButton.vue'

export default {
	name: 'comic-card',
	components: { 'voting-button': VotingButton },
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
			isNewComic: new Date() - new Date(this.comic.created) < 55*604800000,  // todo 1 week = 604800000
			recentlyFinished: this.comic.finished && (new Date() - new Date(this.comic.updated) < 200*604800000)
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
$theme0: #2f0018;
$theme1: #4d0329;
$theme2: #770b43;
$theme3: #ba0763;
$theme4: #00986b;
$theme5: #00d596;
$theme6: #78fdd6;
$theme7: #ffd8ec;
$themeGray0: #fafafa;
$themeGray0p5: #f1f1f1;
$themeGray1: #e7e7e7;
$themeGray2: #dcdcdc;
$themeGray3: #cbcbcb;
$themeGray3p5: #bababa;
$themeGray4: #b0b0b0;
$themeGray5: #a6a6a6;
$themeGray6: #9a9a9a;
$themeGray7: #8e8e8e;
$themeGray8: #7e7e7e;
$themeRed0: #6b090b;
$themeRed1: #a90509;
$themeRed2: #c80005;
$themeRed3: #fd8f91;
$cardBgColorLight: #f1f1f1;
$cardBgColorDark: #222426;
$cardTextColorLight: #222;


.keyword, .keyword-static {
	font-size: 12px;
	border: 0.5px solid #ccc;
	margin: 1px 3px;
	padding: 0.5px 6px 1px 6px;
	border-radius: 10px;
}
.keyword:hover {
	color: $theme4 !important;
	cursor: pointer;
	border-color: $theme4;
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
	border-radius: 35px;
	font-size: 12px;
	font-weight: 400;
	margin: 3px 0;
	color: #444 !important;
	background-color: #ddd;

	&:hover {
		cursor: default;
	}
}

.circled-text-red {
	border: 0.5px solid $theme5;
}

.dark {
	.circled-text {
		background-color: #333;
		color: #bbb !important;
	}

	.keyword, .keyword-static {
		border-color: #555;
		color: #ddd;
	}
}

.comic-card {
	width: 200px;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 8px;
	overflow: hidden;
	margin: 10px;
	padding-bottom: 8px;
	background-color: $themeGray0p5;
	justify-content: space-between;
		box-shadow: 0 0 8px 0px $themeGray3p5;
	&:hover {
		box-shadow: 0 0 10px 1px $theme4;
	}
	img {
		width: 100%;
		height: 283px;
	}
	a {
		text-decoration: none;
		color: $theme4;
	}
	p, div {
		color: $cardTextColorLight;
	}
	.horiz-card-row {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 90%;
		p:hover {
			cursor: default;
		}
	}
	.comic-card-comic-title {
		font-weight: 400;
		margin: 0px 10px;
		text-align: center;
		color: $cardTextColorLight;
	}
	.voting-button {
		margin-top: 4px;
	}

	@media (max-width: 900px) {
		width: 100px;
		img {
			height: 141px;
		}
		.voting-button {
			width: 76%;
		}
	}
}

.keyword-container {
	margin-top: 7px;
	display: flex;
	flex-direction: row;
	flex-flow: row wrap;
	justify-content: center;
}

.dark {
	.comic-card {
		background-color: $cardBgColorDark;
		p, div, .fas {
			color: #ddd;
		}
	}
}

</style>
