<template>
	<div style="width: 100%">
		<vue-headful :title="'Admin - Yiffer.xyz'"/>
    <h1>Admin</h1>
    <back-to-index></back-to-index>

		<div class="admin-content-container" v-if="$store.getters.isAuthenticated">
	
			<keyword-suggestions :keywordSuggestionList="keywordSuggestionList"
				@refresh-keyword-suggestions="refreshKeywordSuggestions"></keyword-suggestions>

			<comic-suggestions :comicSuggestionList="comicSuggestionList"
				@refresh-comic-suggestions="refreshComicSuggestions"></comic-suggestions>

			<add-page :comicList="alphabeticComicList"
				@refresh-comic-list="refreshComicList"></add-page>

			<add-keywords :comicList="alphabeticComicList" :keywordList="[...keywordList]"
				@refresh-comic-list="refreshComicList"
				@refresh-keyword-list="refreshKeywordList"></add-keywords>

			<correct-comic :comicList="alphabeticComicList" :artistList="artistList"
				@refresh-comic-list="refreshComicList"></correct-comic>

			<page-manager :comicList="alphabeticComicList"
				@refresh-comic-list="refreshComicList"/>

			<add-comic :artistList="artistList" :keywordList="[...keywordList]"
				@refresh-pending-comics="refreshPendingComics"></add-comic>

			<add-artist :artistList="artistList"
				@refresh-artist-list="refreshArtistList"></add-artist>

			<pending-comics ref="PendingComics"
				@refresh-comic-list="refreshComicList"></pending-comics>

			<mod-scoreboard/>

			<mod-log v-if="$store.getters.userData.userType==='admin'"/>

		</div>

		<div v-else class="margin-top-32">
			<p>Not logged in</p>
			<button @click="showLoginModal()" class="y-button margin-top-8">
				<i data-feather="log-in"></i>Log in
			</button>
		</div>
		<login-modal v-if="$store.state.loginModalVisibility"></login-modal>
	</div>
</template>

<script>
import LoginModal from '@/components/LoginModal.vue'
import BackToIndex from '@/components/BackToIndex.vue'
import AddPage from '@/components/admin-panel/AddPage.vue'
import AddKeywords from '@/components/admin-panel/AddKeywords.vue'
import CorrectComic from '@/components/admin-panel/CorrectComic.vue'
import AddComic from '@/components/admin-panel/AddComic.vue'
import AddArtist from '@/components/admin-panel/AddArtist.vue'
import PendingComics from '@/components/admin-panel/PendingComics.vue'
import KeywordSuggestions from '@/components/admin-panel/KeywordSuggestions.vue'
import ComicSuggestions from '@/components/admin-panel/ComicSuggestions.vue'
import PageManager from '@/components/admin-panel/PageManager.vue'
import ModScoreboard from '@/components/admin-panel/ModScoreboard.vue'
import ModLog from '@/components/admin-panel/ModLog.vue'

import ArtistApi from '../api/artistApi'
import keywordApi from '../api/keywordApi'
import comicApi from '../api/comicApi'

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
		'comic-suggestions': ComicSuggestions,
		'page-manager': PageManager,
		'mod-scoreboard': ModScoreboard,
		'mod-log': ModLog,
	},
	data: function () {
		return {
			alphabeticComicList: [],
			keywordList: [],
			artistList: [],
			pendingComicList: [],
			keywordSuggestionList: [],
			comicSuggestionList: [],
		}
	},
	methods: {
		async loadData () {
			this.artistList = await ArtistApi.getArtistList()
			this.pendingComicList = await comicApi.getPendingComics()
			this.keywordSuggestionList = await keywordApi.getKeywordSuggestionList()
			this.comicSuggestionList = await comicApi.getSuggestedComicList()
			this.alphabeticComicList = this.$store.getters.comicList.sort((c1, c2) => c1.name>c2.name ? 1 : -1)
		},
		showLoginModal () {
			this.$store.commit('setLoginModalVisibility', true)			
		},
		async refreshComicList () {
			this.alphabeticComicList = (await this.$store.dispatch('loadComicList')).sort((c1, c2) => c1.name>c2.name ? 1 : -1)
		},
		refreshKeywordSuggestions () {
			this.keywordSuggestionList.splice(0, 1)
		},
		refreshComicSuggestions() {
			this.comicSuggestionList.splice(0, 1)
		},
		refreshKeywordList () {
			this.keywordList.push({name: 'KW DEMO TEST', count: 0})
		},
		async refreshPendingComics () {
			this.$refs.PendingComics.getPendingComicList()
		},
		refreshArtistList () {
			this.artistList.push({name: 'Artisten raggi', id: 1231233})
		},
  },
  async created () {
		this.loadData()
		let loggedin = await this.$store.dispatch('checkAndSetLoginStatus')
		if (!loggedin) { this.$router.replace('/') }
  }
}

</script>

<style lang="scss">
.mdi-arrow {
	font-size: 28px;
}
.close-component-arrow {
	margin-top: 16px;
  &:hover {
    cursor: pointer;
  }
}

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
	h2 {
		margin-bottom: 16px;
	}

	&.admin-content-box-grow {
		width: 200%;
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

