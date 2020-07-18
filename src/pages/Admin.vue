<template>
  <div style="width: 100%">
    <vue-headful :title="'Admin - Yiffer.xyz'"/>
    <h1>Admin</h1>
    <back-to-index></back-to-index>

    <div class="admin-content-container" v-if="$store.getters.isAuthenticated">
  
      <keyword-suggestions />

      <comic-suggestions />

      <add-page :comicList="alphabeticComicList"
                @refresh-comic-list="refreshComicList()" />

      <add-keywords :comicList="alphabeticComicList"
                    :keywordList="keywordList"
                    @refresh-comic-list="refreshComicList()"
                    @refresh-keyword-list="refreshKeywordList()" />

      <correct-comic :comicList="alphabeticComicList" 
                     :artistList="artistList"
                     @refresh-comic-list="refreshComicList()" />

      <page-manager :comicList="alphabeticComicList"
                    @refresh-comic-list="refreshComicList()" />

      <add-comic :artistList="artistList" 
                 :comicList="alphabeticComicList"
                 :keywordList="keywordList"
                 @refresh-pending-comics="refreshPendingComics()" />

      <artist-manager :artistList="artistList"
                      @refresh-artist-list="refreshArtistList()" />

      <pending-comics :pendingComics="pendingComics"
                      @refresh-pending-comics="refreshPendingComics()"
                      @refresh-comic-list="refreshComicList()" />

      <user-manager/>

      <mod-scoreboard/>

      <VisitorStats v-if="$store.getters.userData.userType==='admin'"/>

      <AddBlog v-if="$store.getters.userData.userType==='admin'"/>

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
import ArtistManager from '@/components/admin-panel/ArtistManager.vue'
import PendingComics from '@/components/admin-panel/PendingComics.vue'
import KeywordSuggestions from '@/components/admin-panel/KeywordSuggestions.vue'
import ComicSuggestions from '@/components/admin-panel/ComicSuggestions.vue'
import PageManager from '@/components/admin-panel/PageManager.vue'
import UserManager from '@/components/admin-panel/UserManager.vue'
import ModScoreboard from '@/components/admin-panel/ModScoreboard.vue'
import ModLog from '@/components/admin-panel/ModLog.vue'
import VisitorStats from '@/components/admin-panel/VisitorStats.vue'
import AddBlog from '@/components/admin-panel/AddBlog.vue'

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
    'artist-manager': ArtistManager,
    'pending-comics': PendingComics,
    'keyword-suggestions': KeywordSuggestions,
    'comic-suggestions': ComicSuggestions,
    'page-manager': PageManager,
    'user-manager': UserManager,
    'mod-scoreboard': ModScoreboard,
    'mod-log': ModLog,
    VisitorStats,
    AddBlog,
  },
  data: function () {
    return {
      alphabeticComicList: [],
      keywordList: [],
      artistList: [],
      keywordSuggestionList: [],
      pendingComics: [],
    }
  },
  methods: {
    async loadData () {
      this.artistList = await ArtistApi.getArtistList()
      this.alphabeticComicList = this.$store.getters.comicList.concat().sort((c1, c2) => c1.name.toLowerCase()>c2.name.toLowerCase() ? 1 : -1)
      this.refreshPendingComics()
    },
    showLoginModal () {
      this.$store.commit('setLoginModalVisibility', true)      
    },
    async refreshComicList () {
      this.alphabeticComicList = (await this.$store.dispatch('loadComicList')).sort((c1, c2) => c1.name>c2.name ? 1 : -1)
    },
    async refreshKeywordList () {
      this.keywordList = await keywordApi.getKeywordList()
    },
    async refreshArtistList () {
      this.artistList = await ArtistApi.getArtistList()
    },
    async refreshPendingComics () {
      this.pendingComics = await comicApi.getPendingComics()
    },
  },
  async mounted () {
    this.loadData()

    this.$store.watch(this.$store.getters.comicListF, () => {
      this.alphabeticComicList = this.$store.getters.comicList.concat().sort((c1, c2) => c1.name.toLowerCase()>c2.name.toLowerCase() ? 1 : -1)
    })
  }
}

</script>

<style lang="scss">
@import "../scss/shadows.scss";

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
  max-width: 90%;
  margin: auto;
  justify-content: center;

  @media (max-width: 900px) {
    max-width: 100%;    
  }
}

.admin-content-box {
  @include simpleshadow;
  width: 300px;
  margin: 16px;
  height: 156px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 8px 12px 8px;
  &:hover {
    cursor: pointer;
  }

  .description-text {
    text-align: left;
    margin-left: 20px;
    margin-right: 20px;
  }

  @media (max-width: 900px) {
    height: auto;
    padding: 4px;
    margin: 8px 2px;
    h2 {
      font-size: 24px;
    }
    .description-text {
      margin-left: 10px;
      margin-right: 10px;
    }
  }
}

.admin-content-box-open {
  @include simpleshadow-active;
  width: 95%;
  height: auto;
  &:hover {
    cursor: initial;
  }
  h2 {
    margin-bottom: 8px;
    @media (max-width: 900px) {
      margin-bottom: 4px;
    }
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
}

.dark {
  .admin-content-box {
    border: 1px solid #444;
  }
}
</style>

