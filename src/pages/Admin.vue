<template>
  <div style="width: 100%">
    <h1>Admin</h1>
    <back-to-index></back-to-index>

    <div class="admin-content-container" v-if="$store.getters.isAuthenticated">
  
      <keyword-suggestions />

      <comic-suggestions />

      <add-page :comicList="allComics.payload"
                @refresh-comic-list="refreshComicList" />

      <add-keywords :comicList="allComics.payload"
                    @refresh-comic-list="refreshComicList" />

      <correct-comic :comicList="allComics.payload" 
                     :artistList="artistList"
                     @refresh-comic-list="refreshComicList" />

      <page-manager :comicList="allComics.payload"
                    @refresh-comic-list="refreshComicList" />

      <add-comic :artistList="artistList" 
                 :comicList="allComics.payload"
                 @refresh-pending-comics="refreshPendingComics" />

      <artist-manager :artistList="artistList"
                      @refresh-artist-list="refreshArtistList" />

      <pending-comics :pendingComics="pendingComics"
                      @refresh-pending-comics="refreshPendingComics"
                      @refresh-comic-list="refreshComicList" />

      <user-manager/>

      <mod-scoreboard/>

      <AdAdmin/>

      <VisitorStats v-if="$store.getters.userData.userType==='admin'"/>

      <AddBlog v-if="$store.getters.userData.userType==='admin'"/>

      <mod-log v-if="$store.getters.userData.userType==='admin'"/>

      <ModApplications v-if="$store.getters.userData.userType==='admin'"/>

      <Feedback v-if="$store.getters.userData.userType==='admin'"/>
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
import AdAdmin from '@/components/admin-panel/AdAdmin.vue'
import VisitorStats from '@/components/admin-panel/VisitorStats.vue'
import AddBlog from '@/components/admin-panel/AddBlog.vue'
import ModApplications from '@/components/admin-panel/ModApplications.vue'
import Feedback from '@/components/admin-panel/Feedback.vue'

import ArtistApi from '../api/artistApi'
import keywordApi from '../api/keywordApi'
import comicApi from '../api/comicApi'
import { mapGetters } from 'vuex'
import { doFetch } from '../utils/statefulFetch'

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
    AdAdmin,
    VisitorStats,
    AddBlog,
    ModApplications,
    Feedback,
  },

  data: function () {
    return {
      alphabeticComicList: [],
      artistList: [],
      keywordSuggestionList: [],
      pendingComics: [],
    }
  },

  computed: {
    ...mapGetters([
      'allComics',
    ])
  },

  async mounted () {
    if (!this.allComics.fetched && !this.allComics.fetching) {
      doFetch(this.$store.commit, 'allComics', comicApi.getAllComics())
    }
    this.artistList = await ArtistApi.getArtistList()
    this.refreshPendingComics()
  },

  methods: {
    showLoginModal () {
      this.$store.commit('setLoginModalVisibility', true)      
    },
    async refreshComicList () {
      doFetch(this.$store.commit, 'allComics', comicApi.getAllComics())
    },
    async refreshArtistList () {
      this.artistList = await ArtistApi.getArtistList()
    },
    async refreshPendingComics () {
      this.pendingComics = await comicApi.getPendingComics()
    },
  },

  metaInfo () {
    let title = `Admin - Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
      ]
    }
  },
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

  background-color: white;
  width: 300px;
  margin: 16px;
  height: 156px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem 0.75rem 0.75rem 0.75rem;
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

  border-style: solid;
  border-width: 0;
  border-top-width: 10px;
  border-image: linear-gradient(to right, $theme2, $theme6) 1; 

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

.paddedAdminBox {
  padding-left: 1rem;
  padding-right: 1rem;
  p {
    text-align: left;
  }
}

.dark {
  .admin-content-box {
    background-color: $themeDark4;
  }
}
</style>

