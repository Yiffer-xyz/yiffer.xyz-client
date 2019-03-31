<template>
	<div class="comic-card">
		<router-link :comic="comic" :to="{ name: 'comic', params: { comicName: `${comic.name }` } }">
		<div class="triangle-wrapper triangle-wrapper-left" v-if="isNewComic">
			<div class="triangle-inner">
				<label class="triangle-label" title="Added within 7 days">NEW</label>
			</div>
		</div>
		<div class="triangle-wrapper triangle-wrapper-right" v-if="!comic.finished">
			<div class="triangle-inner">
				<label class="triangle-label" title="Comic not finished">WIP</label>
			</div>
		</div>
			<img :src="`/comics/${comic.name}/s.jpg`" @click="storeClickedComicData()">
		</router-link>
		<router-link :comic="comic" :to="{ name: 'comic', params: { comicName: `${comic.name }` } }" class="comic-card-link">
			<p class="comic-card-comic-title">{{comic.name}}</p>
		</router-link>

		<router-link :comic="comic" :to="{ name: 'artist', params: { artistName: comic.artist } }" class="comic-card-link">
			<p class="link-color" style="font-weight: 400;">{{comic.artist}}</p>
		</router-link>

		<div class="horiz-card-row" v-if="$store.getters.detailLevel === 'Medium detail' || $store.getters.detailLevel === 'High detail'">
			<p title="Number of pages"><pages-icon/> {{comic.numberOfPages}}</p>
			<p title="User rating"><users-icon/> {{formatRating(comic.userRating)}}</p>
			<p title="Your rating" v-if="$store.getters.isAuthenticated"><user-icon/> {{comic.yourRating || '-'}}</p>
		</div>

		<div class="keyword-container" 
         v-if="!showKeywords && ($store.getters.detailLevel === 'Medium detail' || $store.getters.detailLevel === 'High detail')">
			<div class="emphasized-keyword">{{comic.cat}}</div>
			<div class="emphasized-keyword">{{convertTagName(comic.tag)}}</div>
			<div class="keyword" v-if="!showKeywords" @click="showLocalKeywords = true">show tags</div>
		</div>

		<div class="keyword-container" v-if="showKeywords">
			<div class="emphasized-keyword">{{comic.cat}}</div>
			<div class="emphasized-keyword">{{convertTagName(comic.tag)}}</div>
			<div 
				:class="{'keyword': clickableKeyword, 'keyword-static': !clickableKeyword}"
				v-for="keyword in comic.keywords"
				:key="keyword"
				@click="addSelectedKeyword(keyword)"
			>
				{{keyword}}
			</div>
		</div>
		<div class="keyword" v-if="showHideKeywordsButton" @click="showLocalKeywords = false">hide tags</div>


		<voting-button
			:comic="comic"
			v-if="$store.getters.isAuthenticated && ($store.getters.detailLevel === 'Medium detail' || $store.getters.detailLevel === 'High detail')"
		></voting-button>

		<p v-if="$store.getters.detailLevel === 'High detail'" class="margin-top-4" style="font-size: 12px;">
			<label title="Updated on"><refresh-icon/> {{prettyDate(comic.updated)}}</label> <br/>
			<label title="Created on"><plus-icon/> {{prettyDate(comic.created)}}</label>
		</p>

	</div>
</template>

<script>
import VotingButton from '@/components/VotingButton.vue'
import VotingButtonSingleColor from '@/components/VotingButtonSingleColor.vue'
import PagesIcon from 'vue-material-design-icons/FileOutline.vue'
import UserIcon from 'vue-material-design-icons/AccountOutline.vue'
import UsersIcon from 'vue-material-design-icons/AccountMultipleOutline.vue'
import PlusIcon from 'vue-material-design-icons/Plus.vue'
import RefreshIcon from 'vue-material-design-icons/Refresh.vue'

export default {
	name: 'comic-card',
	components: {
		'voting-button': VotingButton,
		'voting-button-single-color': VotingButtonSingleColor,
		'pages-icon': PagesIcon,
		'user-icon': UserIcon,
		'users-icon': UsersIcon,
		'plus-icon': PlusIcon,
		'refresh-icon': RefreshIcon,
	},
	props: {
		comic: Object,
		clickableKeyword: {
			type: Boolean,
			default: true
		}
	},
	data: function () {
		return {
			isNewComic: new Date() - new Date(this.comic.created) < 55*604800000,  // todo 1 week = 604800000
			recentlyFinished: this.comic.finished && (new Date() - new Date(this.comic.updated) < 200*604800000),
			showLocalKeywords: false
		}
	},
	methods: {
		formatRating: function (number) {
			if (number > 8.5) { return Math.round(number * 100) / 100 }
			else { return Math.round(number * 10) / 10 }
		},
		prettyDate: inputDateString => (new Date(inputDateString)).toDateString().substring(4),
		storeClickedComicData: function () {
			this.$store.commit('storeClickedComic', this.comic)
		},
		addSelectedKeyword (keywordName) {
			if ( this.clickableKeyword ) { this.$store.commit('addSelectedKeyword', keywordName) }
		},
		convertTagName (tagName) {
			return tagName=='Pokemon' ? 'Pkmn' : tagName
		}
	},
	computed: {
		showKeywords () {
			return this.$store.getters.detailLevel==='High detail' || this.showLocalKeywords
		},
		showHideKeywordsButton () {
			return this.showLocalKeywords && this.$store.getters.detailLevel!=='High detail'
		}
	}
}
</script>

<style lang="scss">
@import "../scss/colors.scss";
.triangle-wrapper {
	position: absolute; top: 0;
}
.triangle-wrapper-left {
	left: 0;
	.triangle-inner {
		border-width: 60px 60px 0 0;
		border-color: $themeGray0p5 transparent transparent transparent;
		.triangle-label {
			color: $theme5;
			position: absolute;
			top: 10px;
			transform: rotate(-45deg);
			left: 2px;
			font-weight: 400;
		}
	}
}
.triangle-wrapper-right {
	right: 0;
	.triangle-inner {
		border-width: 0 60px 60px 0;
		border-color: transparent $themeGray0p5 transparent transparent;
		.triangle-label {
			position: absolute;
			color: $themeDark1;
			top: 10px;
			font-weight: 400;
			transform: rotate(45deg);
			right: 5px;
		}
	}
}
.triangle-inner {
	width: 0;
	height: 0;
	border-style: solid;
	.triangle-label {
		cursor: pointer;
	}
}

.emphasized-keyword {
	font-size: 12px;
	border: 0.5px solid #a6a6a6;
	margin: 1px 3px;
	padding: 0.5px 6px 1px 6px;
	border-radius: 10px;
	background: $themeGray5;
	color: white !important;
	font-weight: bold !important;
	&:hover {
		cursor: default;
	}
}

@media (max-width: 900px) {
	.triangle-wrapper-left {
		.triangle-inner {
			border-width: 40px 40px 0 0;
			.triangle-label {
				font-size: 10px;
				top: 7px;
				left: 2px;
			}
		}
	}
}

.comic-card-link {
	width: 100%;
	p {
		word-wrap: break-word;
	}
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
	background-color: $themeGray2;

	&:hover {
		cursor: default;
	}
}

.circled-text-autowidth {
	min-width: 33px;
	width: auto;
}

.circled-text-red {
	border: 0.5px solid $theme5;
}

.dark {
	.circled-text {
		background-color: #333;
		color: #bbb !important; //todo
	}

	.triangle-wrapper-right {
		.triangle-inner {
			border-color: transparent $themeDark3 transparent transparent;
			.triangle-label {
				color: inherit;
			}
		}
	}
	.triangle-wrapper-left {
		.triangle-inner {
			border-color: $themeDark3 transparent transparent transparent;
		}
	}
}

.comic-card {
	position: relative;
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
		// box-shadow: 0 0 10px 1px $theme4;
		box-shadow: 0 0 10px 1px $themeGray6;
	}
	img {
		width: 100%;
		height: 283px;
	}
	a {
		text-decoration: none;
		color: $theme5;
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
		font-weight: 600;
		margin: 0px 10px;
		text-align: center;
		color: $cardTextColorLight;
	}
	.voting-button {
		margin-top: 4px;
	}

	@media (max-width: 900px) {
		width: 100px;
		margin: 6px;
		font-size: 14px;
		.comic-card-comic-title {
			font-size: 15px;
			margin: 0px 2px;
		}
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
</style>
