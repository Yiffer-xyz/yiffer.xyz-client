<template>
	<div style="width: 100%">
		<vue-headful :title="'Admin - Yiffer.xyz'"/>
    <h1>Admin</h1>
    <back-to-index></back-to-index>

		<div class="admin-content-container">
	
			<keyword-suggestions :keywordSuggestionList="keywordSuggestionList"
				v-on:refresh-keyword-suggestions="refreshKeywordSuggestions"></keyword-suggestions>

			<add-page :comicList="comicList"
				v-on:refresh-comic-list="refreshComicList"></add-page>

			<add-keywords :comicList="comicList" :keywordList="[...keywordList]"
				v-on:refresh-comic-list="refreshComicList"
				v-on:refresh-keyword-list="refreshKeywordList"></add-keywords>

			<correct-comic :comicList="comicList" :artistList="artistList"
				v-on:refresh-comic-list="refreshComicList"></correct-comic>

			<add-comic :comicList="comicList" :artistList="artistList" :keywordList="[...keywordList]"
				v-on:refresh-pending-comics="refreshPendingComics"></add-comic>

			<add-artist :artistList="artistList"
				v-on:refresh-artist-list="refreshArtistList"></add-artist>

			<pending-comics :comicList="pendingComicList"
				v-on:refresh-pending-comics="refreshPendingComics"
				v-on:refresh-comic-list="refreshComicList"></pending-comics>

		</div>
		<login-modal v-if="$store.state.loginModalVisibility"></login-modal>
	</div>
</template>

<script>
import LoginModal from '@/components/LoginModal.vue'
import BackToIndex from '@/components/BackToIndex.vue'

// tag suggestions bare hvis
// re calculate and zip med i correct
// mod stats

// husk å ta med upload progress

import config from '@/config.json'
import AddPage from '@/components/admin-panel/AddPage.vue'
import AddKeywords from '@/components/admin-panel/AddKeywords.vue'
import CorrectComic from '@/components/admin-panel/CorrectComic.vue'
import AddComic from '@/components/admin-panel/AddComic.vue'
import AddArtist from '@/components/admin-panel/AddArtist.vue'
import PendingComics from '@/components/admin-panel/PendingComics.vue'
import KeywordSuggestions from '@/components/admin-panel/KeywordSuggestions.vue'

export default {
	name: 'admin',
	components: {
		'login-modal': LoginModal,
		'back-to-index': BackToIndex,
		'add-page': AddPage,
		'add-keywords': AddKeywords,
		'correct-comic': CorrectComic,
		'add-comic': AddComic,
		'add-artist': AddArtist,
		'pending-comics': PendingComics,
		'keyword-suggestions': KeywordSuggestions,
	},
	data: function () {
		return {
			comicList: [],
			keywordList: [],
			artistList: [],
			pendingComicList: [],
			keywordSuggestionList: [],
		}
	},
	methods: {
		async mockGetComicList () {
			this.comicList = config.comicList
			this.keywordList = config.demoKeywords
			this.artistList = config.artistList
			this.pendingComicList = config.pendingComicList
			this.keywordSuggestionList = config.keywordSuggestionList
		},

//todo alleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
		refreshKeywordSuggestions () {
			this.keywordSuggestionList.splice(0, 1)
		},
		refreshComicList () {
			let ret = []
			for (var c of config.comicList) {
				c.cat = 'I'
				c.tag = 'Other'
				c.numberOfPages = 999
				c.artist = 'Adamwan'
				c.keywords.push('RAGNAR')
				c.keywords.push('BAGNAR')
				ret.push(c)
			}
			this.comicList = ret
		},
		refreshKeywordList () {
			this.keywordList.push({name: 'KW DEMO TEST', count: 0})
		},
		refreshPendingComics () {
			let temp = []
			let ting = false
			for (var x of config.pendingComicList) {
				if (!x.Processed && !ting) {
					x.Processed = 1
					ting = true
				}
				temp.push(x)
			}
			this.pendingComicList = temp
		},
		refreshArtistList () {
			this.artistList.push({name: 'Artisten raggi', id: 1231233})
		},
  },
  created: function () {
		this.mockGetComicList()
  }
}

</script>

<style lang="scss">
.admin-content-container {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	max-width: 750px;
	margin: auto;
	justify-content: center;
}

.admin-content-box {
	width: 300px;
	border: 1px solid #aaa; //todo
	margin: 16px;
	height: 156px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 8px 8px 12px 8px;
	&:hover {
		cursor: pointer;
	}
}

.admin-content-box-open {
	width: 100%;
	height: auto;
	&:hover {
		cursor: initial;
	}
}

.admin-content-box-inner {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	> p, select, button, form {
		margin-bottom: 12px;
	}
}

.horizontal-flex {
	display: flex;
	flex-direction: row;
	justify-content: center;
}
</style>

