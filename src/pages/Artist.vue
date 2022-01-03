<template>
  <div style="width: 100%">
    <h1 id="artistTitle">Artist: {{$route.params.artistName}}</h1>
    <back-to-index></back-to-index>
  
    <span v-if="artistData">
      <div class="margin-top-16 margin-bottom-16 artistBigLinksContainer">
        <a :href="'https://patreon.com/'+artistData.patreonName"
           v-if="artistData.patreonName"
           class="artist-big-link underline-link">
          <img src="/icons/patreon.png" style="height: 24px"/>
          {{$route.params.artistName}} on Patreon
        </a>
        <a :href="'https://e621.net/posts?tags='+artistData.e621Name"
           v-if="artistData.e621Name"
           class="artist-big-link underline-link margin-top-8">
          <img src="/icons/e621.png" style="height: 24px"/>
          {{$route.params.artistName}} on e621
        </a>
      </div>

      <div class="artist-link-container" v-if="artistData.links.length > 0">
        <p style="font-weight: 600;">
          {{(artistData.patreonName || artistData.e621Name) ? 'Other links:' : 'Links:'}}
        </p>
        <div v-for="link in artistData.links" :key="link.linkUrl" class="artist-link">
          <img :src="`/icons/${link.linkType}.png`" style="height: 22px;"/>
          <a :href="link.linkUrl"
             target="_blank"
             class="underline-link"
             style="word-break: break-all;">
            {{prettifyUrl(link.linkUrl)}}
          </a>
        </div>
      </div>

      <h2 id="artistComicsTitle" class="margin-top-16">Comics</h2>
      <div class="comic-card-container" id="comicCardContainerArtist" style="margin-top: 0;">
        <comic-card v-for="comic in this.artistData.comics"
                    :key="comic.id"
                    :clickableKeyword="false"
                    :comic="comic"
                    :detailLevel="'High detail'" />
      </div>

      <login-modal v-if="$store.state.loginModalVisibility"></login-modal>
    </span>
    <p v-if="artistNotFound" class="margin-top-16">
      <sad-face/> Artist not found
    </p>
    <p v-if="artistFetchError" class="margin-top-16">
      <sad-face/> Error fetching artist
    </p>
  </div>
</template>

<script>
import ComicCard from '@/components/ComicCard.vue'
import LoginModal from '@/components/login-modal/LoginModal.vue'
import BackToIndex from '@/components/BackToIndex.vue'
import SadFace from 'vue-material-design-icons/EmoticonSadOutline.vue'

import artistApi from '../api/artistApi'
import miscApi from '../api/miscApi'

export default {
  name: 'artist',

  components: {
    'comic-card': ComicCard,
    'login-modal': LoginModal,
    'back-to-index': BackToIndex,
    'sad-face': SadFace,
  },

  data: function () {
    return {
      artistData: undefined,
      modalIsVisible: false,
      artistNotFound: false,
      artistFetchError: false,
    }
  },

  async mounted () {
    this.$store.commit('setLoginModalVisibility', false)
    this.clickableKeyword = false
    let apiResponse = await artistApi.getArtistByName(this.$route.params.artistName)
    if (apiResponse.notFound) {
      this.artistNotFound = true
    }
    else if (apiResponse.isError) {
      this.artistFetchError = true
    }
    else {
      this.artistData = apiResponse.result
    }

    miscApi.logRoute('artist', this.$route.params.artistName)
  },

  methods: {
    showLoginModal ( clickEvent ) {
      clickEvent.preventDefault()
      this.$store.commit('setLoginModalVisibility', true)
    },
    prettifyUrl ( linkUrl ) {
      if ( linkUrl.endsWith('/') ) { linkUrl = linkUrl.substring(0, linkUrl.length-1) }
      return linkUrl.replace('https://', '').replace('http://', '').replace('www.', '').replace('%20', ' ')
    }
  },

  metaInfo () {
    let title = `${this.$route.params.artistName} - Artist - Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"},
        {vmid: 'ogDesc', property: 'og:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"}
      ]
    }
  },
}
</script>

<style lang="scss">
.artist-link-container {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  margin: auto;
}
.artist-link {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  img {
    margin-right: 5px;
  }
}

#artistComicsTitle, #artistLinksTitle {
  @media (max-width: 900px) {
    font-size: 1.5rem
  }
}
#artistTitle {
  @media (max-width: 900px) {
    font-size: 2rem;
  }
}

#comicCardContainerArtist {
  @media (max-width: 900px) {
    .keyword-container {
      display: none;
    }
  }
}

.artist-big-link {
  font-size: 17px;
  display: flex;
  width: fit-content;
  img {
    margin-right: 6px;
  }
}

.artistBigLinksContainer {
  margin: 1.5rem auto;
  width: fit-content
}

@media (min-width: 900px) {
  .artist-big-link {
    font-size: 20px;
  }
}
</style>

