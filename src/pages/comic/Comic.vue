<template>
  <div>
    <div class="upperBodyDivComic">
      <div v-if="comic" id="comicUpperDiv">

        <div style="display: grid; grid-template-columns: 3.5rem 1fr 3.5rem; width: 100%;" class="pt-32">
          <div></div>

          <h1 class="loadedComicHeader" style="padding: 0;">{{$route.params.comicName}}</h1>

          <button v-if="showShareIcon" @click="shareClicked" class="shareIconContainer">
            <ShareIcon class="shareIcon" />
          </button>
          <div v-else></div>
        </div>

        <h2>by 
          <router-link :to="{ name: 'artist', params: { artistName: comic.artist } }"
                       class="underline-link artistNameLink"
                       style="font-family: 'Mulish', sans-serif;">
            {{comic.artist}}
          </router-link>
        </h2>

        <button @click="downloadZippedComic()"
                v-if="$store.getters.isAuthenticated 
                      && $store.getters.userData.donator 
                      && !isZipping 
                      && !downloadStarted" 
                class="y-button">
          <DownloadIcon/>  Download comic
        </button>

        <Loading text="Zipping, please wait..." v-if="$store.getters.isAuthenticated && $store.getters.userData.donator && isZipping" class="mt-16"/>
        <p v-if="downloadStarted" class="margin-top-16">
          Download started!
        </p>

        <div class="verticalFlex mt-32" style="align-items: flex-start; min-width: 13rem;">
          <div class="textAlignLeft mb-32" v-if="comic && (comic.previousComic || comic.nextComic)">
            <p>This comic is part of a series!</p>
            <p v-if="comic.previousComic">
              <router-link :to="{ name: 'comic', params: { comicName: comic.previousComic } }" 
                          class="underline-link">
                <LeftArrow/>
                {{comic.previousComic}}
              </router-link>
            </p>
            <p v-if="comic.nextComic">
              <router-link :to="{ name: 'comic', params: { comicName: comic.nextComic } }"
                          class="underline-link">
                {{comic.nextComic}} 
                <RightArrow/>
              </router-link>
            </p>
          </div>

          <div class="horizontalFlex">
            <p style="padding-left: 2px;">
              Average rating: 
            </p>
            <p v-if="isLoading === 0" style="width: 2.75rem;">
              {{formatRating(userRating)}}
            </p>
            <Spinner v-else
                    size="12"
                    :line-size="1"
                    :line-bg-color="'transparent'"
                    :line-fg-color="isDarkTheme ? 'white' : 'black'"
                    style="margin-top: 0.3rem; width: 2.75rem;"/>
          </div>

          <RatingSlider v-if="Object.keys(comicForVotingModal).length !== 0 && isAuthenticated"
                        @loading="isLoading = isLoading+1"
                        @updatedComic="onUpdatedComic"/>

          <button v-else-if="!isAuthenticated" class="y-button mt-8 button-with-icon loginButton" 
                  @click="$store.commit('setLoginModalVisibility', true)">
            <LoginIcon/> Log in to rate comic
          </button>
        </div>

      <ComicKeywords v-if="comic"
                     :comicData="comic"/>
      </div>
    </div>

    <div v-if="!comic && comicNotFound">
      <h2 class="comicLoadingInfo">
        There is no comic with the name "{{$route.params.comicName}}".
      </h2>
    </div>

    <div v-else-if="!comic && fetchComicError">
      <h2 class="comicLoadingInfo">
        Comic fetch error
      </h2>
      <p class="mb-32">
        {{fetchComicError}}
      </p>
    </div>

    <div v-else-if="!comic">
      <h2 class="comicLoadingInfo">
        Loading comic...
      </h2>
    </div>
  

    <div v-if="comic">
      <div class="marginAuto margin-top-16 fitContent verticalFlex">
        <div id="comicSizingButtonsRow" class="horizontalFlex" style="align-items: center;">
          <p style="margin-right: 4px;">Image fit:</p>
          <button @click="setAllImagesFit('height')" class="y-button y-button-small">Height</button>
          <button @click="setAllImagesFit('width')"  class="y-button y-button-small">Width</button>
          <button @click="setAllImagesFit('big')"    class="y-button y-button-small">Full</button>
          <button @click="setAllImagesFit('thumb')"  class="y-button y-button-small">Tiny</button>
        </div>
        <p class="smaller-text textAlignLeft">You may also click any one image to resize it</p>
      </div>


      <div class="paidImageBannerLink" style="max-height: 100px !important;">
        <a v-if="paidImage" :href="paidImage.link" target="_blank">
          <img :src="`${config.paidImagesDirectory}/${paidImage.id}.${paidImage.filetype}`" class="paidImageBanner" />
        </a>

        <div v-else style="height: 100px; width: 680px;"/>
      </div>
    </div>
    <div v-if="comic" id="comicPageContainer" class="margin-top-8 margin-bottom-8">
      <img 
        v-for="pageNumber in comic.numberOfPages" 
        :src="`${config.comicDirectory}/${comic.name}/${formatPageNumber(pageNumber)}.jpg`"
        :alt="`${comic.name} page ${pageNumber}`"
        :id="'page' + (pageNumber-1)"
        :key="pageNumber"
        :class="['img-fit-height', 'comic-page']"
        @click="cycleOneImageFit(pageNumber-1)"/>
    </div>

    <div class="lowerLinksAndRating" v-if="comic">
      <div v-if="comic.previousComic || comic.nextComic" class="mb-16 verticalFlex alignItemsStart">
        <p>This comic is part of a series!</p>
        <p v-if="comic.previousComic">
          <router-link :to="{ name: 'comic', params: { comicName: comic.previousComic } }" class="underline-link">
            <LeftArrow/>
            {{comic.previousComic}}
          </router-link>
        </p>
        <p v-if="comic.nextComic">
          <router-link :to="{ name: 'comic', params: { comicName: comic.nextComic } }" class="underline-link">
            {{comic.nextComic}} 
            <RightArrow/>
          </router-link>
        </p>
      </div>


      <div class="horizontalFlex justifyStart" :style="isAuthenticated ? 'min-width: 13rem;' : ''">
        <p style="padding-left: 2px;">
          Average rating: 
        </p>
        <p v-if="isLoading === 0" style="width: 2.75rem;">
          {{formatRating(userRating)}}
        </p>
        <Spinner v-else
                size="12"
                :line-size="1"
                :line-bg-color="'transparent'"
                :line-fg-color="isDarkTheme ? 'white' : 'black'"
                style="margin-top: 0.3rem; width: 2.75rem;"/>
      </div>

      <RatingSlider v-if="Object.keys(comicForVotingModal).length !== 0 && isAuthenticated"
                    @loading="isLoading = isLoading+1"
                    @updatedComic="onUpdatedComic"
                    styles="margin-bottom: 2rem;"/>

      <button v-else-if="!isAuthenticated" class="y-button mt-8 mb-32 button-with-icon loginButton" 
              @click="$store.commit('setLoginModalVisibility', true)">
        <LoginIcon/> Log in to rate comic
      </button>


      <button class="y-button m-auto mb-16" @click="scrollToTop()">
        <up-arrow/> to top
      </button>
    </div>

    <BackToIndex />
    <div style="margin-top: 16px;"> </div>
  </div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import RatingSlider from '@/components/RatingSlider.vue'
import Loading from '@/components/LoadingIndicator.vue'
import LeftArrow from 'vue-material-design-icons/ArrowLeft.vue'
import RightArrow from 'vue-material-design-icons/ArrowRight.vue'
import ShareIcon from 'vue-material-design-icons/ShareVariant.vue'
import LoginIcon from 'vue-material-design-icons/Login.vue'
import UpArrow from 'vue-material-design-icons/ArrowUp.vue'
import DownloadIcon from 'vue-material-design-icons/Download.vue'
import ComicKeywords from './ComicKeywords.vue'
import Spinner from 'vue-simple-spinner'

import comicApi from '../../api/comicApi'
import miscApi from '../../api/miscApi'
import { mapGetters, mapActions } from 'vuex'
import config from '@/config.json'

export default {
  name: 'comic',

  props: {
    userInfo: Object,
  },

  components: {
    BackToIndex, RatingSlider, Loading, ComicKeywords, Spinner,
    LeftArrow, RightArrow, ShareIcon, LoginIcon, UpArrow, DownloadIcon,
  },

  data: function () {
    return {
      comic: this.$store.state.clickedComic || undefined,
      userRating: this.comicForVotingModal?.userRating,
      isLoading: 0,
      userIsDonator: true,
      comicNotFound: false,
      fetchComicError: undefined,
      imageFitArray: [],
      keywords: [],
      showShareIcon: false,
      isZipping: false,
      downloadStarted: false,
      paidImage: null,
      config,
    }
  },

  computed: {
    ...mapGetters({
      paidImages: 'paidImagesBanner',
      allPaidImages: 'paidImages',
      isDarkTheme: 'isDarkTheme',
      comicForVotingModal: 'comicForVotingModal',
      isAuthenticated: 'isAuthenticated',
    }),
  },

  created() {
    console.log(this.comicForVotingModal.userRating, 'asdasd')
  },

  async mounted () {
    if (this.paidImages().length > 0) {
      this.paidImage = this.paidImages()[Math.floor(Math.random() * this.paidImages().length)]
    }
    else {
      if (!this.allPaidImages.fetching && !this.allPaidImages.fetched) {
        this.loadActiveAds()
      }

      this.$store.watch(this.paidImages, () => {
        if (this.paidImages().length > 0) {
          this.paidImage = this.paidImages()[Math.floor(Math.random() * this.paidImages().length)]
        }
      })
    }

    this.$store.commit('setLoginModalVisibility', false)
    this.loadComic(false)
    if (this.comic) {
      this.initializeImageFitArray()
      this.fitImagesForMobile()
    }

    if (navigator.share !== undefined) {
      this.showShareIcon = true
    }

    miscApi.logRoute('comic', this.$route.params.comicName)
  },

  methods: {
    ...mapActions([
      'loadActiveAds',
    ]),

    onUpdatedComic (updatedComic) {
      this.isLoading = Math.max(0, this.isLoading-1)
      this.userRating = updatedComic.userRating
    },

    formatPageNumber: pageNumber => pageNumber<100 ? (pageNumber<10 ? '00'+pageNumber : '0'+pageNumber) : pageNumber,

    formatRating: function (number) {
      if (!number) { return '-' }
      return Math.round(number * 100) / 100
    },

    setAllImagesFit ( imageFit, avoidLog=false ) {
      document.querySelectorAll('.comic-page').forEach(page => {
        page.classList.remove('img-fit-big', 'img-fit-thumb', 'img-fit-width', 'img-fit-height')
        page.classList.add('img-fit-' + imageFit)
      })

      if (!avoidLog) {
        miscApi.logEvent('all images fit', imageFit)
      }
    },

    cycleOneImageFit ( pageNumber ) {
      let imageElement = document.getElementById('page'+pageNumber)
      let oldClassList = [...imageElement.classList]
      let oldFit
      if (oldClassList.indexOf('img-fit-width') >= 0)       { oldFit = 'width' }
      else if (oldClassList.indexOf('img-fit-height') >= 0) { oldFit = 'height' }
      else if (oldClassList.indexOf('img-fit-big') >= 0)     { oldFit = 'big' }
      else if (oldClassList.indexOf('img-fit-thumb') >= 0)   { oldFit = 'thumb' }
      let newFit = imageFitCycleOrder[ (imageFitCycleOrder.indexOf(oldFit)+1) % 4 ]
      imageElement.classList.remove('img-fit-'+oldFit)
      imageElement.classList.add('img-fit-'+newFit)

      miscApi.logEvent('single image fit')
    },

    initializeImageFitArray () {
      if ( this.comic ) {
        for (var i=0; i<this.comic.numberOfPages; i++) { this.imageFitArray.push('height') }
      }
    },

    async loadComic (setCurrentUndefined=true) {
      if (setCurrentUndefined) {
        this.comic = undefined
      }
      try {
        let response = await comicApi.getComic(this.$route.params.comicName)
        this.comic = response
        console.log('response gots')
        this.$store.commit('setComicForVotingModal', this.comic)
        this.initializeImageFitArray()
        this.fitImagesForMobile()
        
        if (this.comic.userRating) {
          this.userRating = this.comic.userRating
        }
        if (this.comic.yourRating) {
          this.userRating = this.comic.userRating
        }
      }
      catch (err) {
        if (err.response?.status === 404) {
          this.comicNotFound = true
        }
        else {
          this.fetchComicError = err.response.data
        }
      }
    },

    fitImagesForMobile () {
      if (window.innerWidth < 900) {
        let resizeIntervalHook = setInterval(() => {
          if (this.comic && document.getElementById('comicPageContainer').childElementCount === this.comic.numberOfPages) {
            this.setAllImagesFit('width', true)
            clearInterval(resizeIntervalHook)
          }
        }, 30)
      }
    },

    async shareClicked () {
      if (navigator.share === undefined) { return }
      let artist = this.comic ? this.comic.artist : 'Unknown'
      let shareDataObject = {
        title: `Comic: ${this.$route.params.comicName} - beta.yiffer.xyz`,
        text: `${this.$route.params.comicName}, a comic by ${artist}`,
        url: `https://beta.yiffer.xyz${this.$route.path.replace(/%20/g, ' ')}`
      }
      
      navigator.share(shareDataObject)
        .catch(() => {})
    },

    async downloadZippedComic () {
      let needScriptTimeout = loadZippingScripts()
      this.isZipping = true

      setTimeout(async _ => {
        var jsZipper = new JSZip()
        let imageFiles = document.getElementsByClassName('comic-page')
        for (var i=1; i<imageFiles.length+1; i++) {
          let imageResponse = await fetch(`/comics/${this.comic.name}/${this.formatPageNumber(i)}.jpg`)
          jsZipper.file(this.formatPageNumber(i)+'.jpg', imageResponse.blob())
        }
  
        let zipContent = await jsZipper.generateAsync({type:"blob"})
        saveAs(zipContent, `${this.comic.name}.zip`)
        this.isZipping = false
        this.downloadStarted = true
      }, needScriptTimeout ? 2000 : 1)
      
      function loadZippingScripts () {
        try { 
          let x = JSZip || saveAs
          return false
        } 
        catch (err) {
          const jsZipScript = document.createElement('script')
          jsZipScript.setAttribute('src', 'scripts/jszip.min.js')
          document.head.appendChild(jsZipScript)
          const fileSaverScript = document.createElement('script')
          fileSaverScript.setAttribute('src', 'scripts/Filesaver.min.js')
          document.head.appendChild(fileSaverScript)
          return true
        }
      }
    },

    scrollToTop () {
      window.scrollTo(0, 0)
    },
  },

  watch: {
    $route (){
      this.loadComic()
    }
  },

  metaInfo() {
    let title = `${this.$route.params.comicName} - beta.yiffer.xyz`
    let description = "The internet's best collection of high quality furry porn comics, easily readable and free!"
    if (this.comic && this.comic.artist) {
      description = `${this.comic.numberOfPages}-page comic by ${this.comic.artist}, on the internet's best furry porn site.`
    }

    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
        {vmid: 'twitterDesc', name: 'twitter:description', content: description},
        {vmid: 'ogDesc', property: 'og:description', content: description},
      ]
    }
  },
}

let imageFitCycleOrder = ['height', 'width', 'big', 'thumb']
</script>

<style lang="scss" scoped>
.lowerLinksAndRating {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  margin: auto;
  margin-top: 1rem;
}

.comic-page {
  min-height: 90px;
  filter: blur(30px);
}

.shareIconContainer {
  background: none;
  border: none;
  padding: 8px 8px 10px 8px;
}
.shareIcon {
  font-size: 28px;
  color: $themeGreen1Dark;
  @media (min-width: 900px) {
    display: none !important;
  }
}

#comicUpperDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
}

.comicLoadingInfo {
  text-align:center;
  margin: 2rem 1rem 1.5rem 1rem;
  @media screen and (max-width: 900px) {
    font-size: 1.5rem;
  }
}

#keywordEditing {
  width: 100%;
  select {
    margin: 0 4px;
  }
}

.loginButton {
  span {
    margin-right: 0.5rem;
  }
}

.upperBodyDivComic {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
  text-align: center;
  h2 {
    @media (max-width: 900px) {
      font-size: 22px;
    }
  }
}

.artistNameLink {
  font-size: 30px;
  font-weight: 400;
  @media (max-width: 900px) {
    font-size: 22px;
  }
}

.paidImageBannerLink {
  margin: 1rem 0;
}
.paidImageBanner {
  @media (max-width: 900px) {
    max-width: 100%;
  }
}

.loadedComicHeader {
  margin: 0.25rem 0 0.5rem 0;
  @media (max-width: 900px) {
    font-size: 32px;
  }
}

#comicPageContainer {
  overflow: hidden;

  img:not(.paidImageBanner) {
    margin: 0 auto 16px auto;
    display: block;
  }
}


.img-fit-height {
  max-height: 100vh;
}

.img-fit-width {
  max-width: 97vw;
}

.img-fit-thumb {
  max-height: 90px;
}

#comicSizingButtonsRow {
  .y-button {
    margin: 0px 4px;
  }
}
</style>
