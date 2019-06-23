<template>
	<div style="width: 100%">
		<vue-headful :title="$route.params.artistName + ' - Artist - Yiffer.xyz'"/>
    <h1 id="artistTitle">{{$route.params.artistName}}</h1>
    <back-to-index></back-to-index>
  
    <span v-if="artistData">
      <h2 id="artistLinksTitle" style="margin-top: 16px;">Links</h2>
      <div class="artist-link-container">
        <div v-for="link in artistData.links" :key="link.linkUrl" class="artist-link">
          <img :src="`/icons/${link.linkType}.png`" style="height: 18px;"/>
          <a :href="link.linkUrl" target="_blank" class="underline-link" style="word-break: break-all;">{{prettifyUrl(link.linkUrl)}}</a>
        </div>
      </div>

      <h2 id="artistComicsTitle" class="margin-top-16">Comics</h2>
      <div class="comic-card-container" id="comicCardContainerArtist">
        <comic-card v-for="comic in this.artistData.comics" :key="comic.id" :clickableKeyword="false" :comic="comic" :detailLevel="'High detail'"></comic-card>
      </div>

      <login-modal v-if="$store.state.loginModalVisibility"></login-modal>
    </span>
    <p v-if="artistNotFound" class="margin-top-16"><sad-face/> Artist not found</p>
	</div>
</template>

<script>
import ComicCard from '@/components/ComicCard.vue'
import LoginModal from '@/components/LoginModal.vue'
import BackToIndex from '@/components/BackToIndex.vue'

import artistApi from '../api/artistApi'
import SadFace from 'vue-material-design-icons/EmoticonSadOutline.vue'

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
		}
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

  async created () {
    this.$store.commit('setLoginModalVisibility', false)
    this.clickableKeyword = false
    let apiResponse = await artistApi.getArtistByName(this.$route.params.artistName)
    if (!apiResponse.success) {
      this.artistNotFound = true
    }
    else {
      this.artistData = apiResponse.result
    }
  }
}
</script>

<style lang="scss">
.artist-link-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.artist-link {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin-right: 5px;
  }
}

#artistComicsTitle, #artistLinksTitle {
  @media (max-width: 900px) {
    font-size: 22px
  }
}
#artistTitle {
  @media (max-width: 900px) {
    font-size: 32px
  }
}

#comicCardContainerArtist {
  @media (max-width: 900px) {
    .keyword-container {
      display: none;
    }
  }
}
</style>

