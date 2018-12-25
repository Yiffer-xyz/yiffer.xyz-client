<template>
	<div class="comic-card">
		<router-link :comic="comic" :to="{ name: 'comic', params: { comicName: `${comic.name }` } }">
			<img :src="`/comics/${comic.name}/s.jpg`" @click="storeClickedComicData()">
		</router-link>
		<router-link :comic="comic" :to="{ name: 'comic', params: { comicName: `${comic.name }` } }">
			<p class="comic-card-comic-title">{{comic.name}}</p>
		</router-link>
		<router-link :comic="comic" :to="{ name: 'artist', params: { artistName: comic.artist } }">
			<p class="link-color" style="font-weight: 400;">{{comic.artist}}</p>
		</router-link>

		<div class="horiz-card-row" v-if="detailLevel === 'Medium detail' || detailLevel === 'High detail'">
			<p><pages-icon/> {{comic.numberOfPages}}</p>
			<p><users-icon/> {{formatRating(comic.userRating)}}</p>
			<p v-if="$store.state.username"><user-icon/> {{comic.yourRating}}</p>
		</div>

		<div class="horiz-card-row" v-if="detailLevel === 'Medium detail' || detailLevel === 'High detail'">
			<div v-if="isNewComic" class="circled-text circled-text-red">NEW</div>
			<div v-if="recentlyFinished" class="circled-text circled-text-red" title="Recently finished">RF</div>
			<div v-if="!comic.finished" class="circled-text" title="Work in progress (comic not finished)">WIP</div>
		</div>

		<voting-button
			:comic="comic"
			:backgroundColors="{light: '#f1f1f1', dark: '#222426'}"
			v-if="$store.state.username && (detailLevel === 'Medium detail' || detailLevel === 'High detail')"
		></voting-button>

		<!-- <voting-button-single-color
			:comic="comic"
			v-if="detailLevel === 'Medium detail' || detailLevel === 'High detail'"
			style="margin-top: 10px;"
		></voting-button-single-color> -->

		<div class="keyword-container" v-if="detailLevel === 'High detail'">
			<div 
				:class="{'keyword': clickableKeyword, 'keyword-static': !clickableKeyword}"
				v-for="keyword in comic.keywords"
				:key="keyword"
				@click="addSelectedKeyword(keyword)"
			>
				{{keyword}}
			</div>
		</div>
	</div>
</template>

<script>
import VotingButton from '@/components/VotingButton.vue'
import VotingButtonSingleColor from '@/components/VotingButtonSingleColor.vue'
import PagesIcon from 'vue-material-design-icons/FileOutline.vue'
import UserIcon from 'vue-material-design-icons/AccountOutline.vue'
import UsersIcon from 'vue-material-design-icons/AccountMultipleOutline.vue'

export default {
	name: 'comic-card',
	components: {
		'voting-button': VotingButton,
		'voting-button-single-color': VotingButtonSingleColor,
		'pages-icon': PagesIcon,
		'user-icon': UserIcon,
		'users-icon': UsersIcon,
	},
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
.keyword, .keyword-static {
	font-size: 12px;
	border: 0.5px solid #ccc; //todo
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
	background-color: $themeGray2;

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
		color: #bbb !important; //todo
	}

	.keyword, .keyword-static {
		border-color: #555; //todo
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

.dark {
	.comic-card {
		background-color: $cardBgColorDark;
		p, div, .fas {
			color: #ddd; //todo
		}
		box-shadow: none;
		&:hover {
			box-shadow: 0 0 10px 1px $theme3;
		}
	}
}

</style>
