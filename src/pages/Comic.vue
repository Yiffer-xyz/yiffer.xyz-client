<template>
  <span>
    <vue-headful :title="$route.params.comicName + ' - Yiffer.xyz'"/>
    <div id="upperBodyDivComic">
      <span v-if="comic" id="comicUpperDiv">
        <h1 class="loadedComicHeader">{{$route.params.comicName}}</h1>
        <share-icon class="share-icon" v-if="showShareIcon" @click.native="shareClicked()"/>
        <h2>by 
          <router-link :to="{ name: 'artist', params: { artistName: comic.artist } }" class="underline-link" style="font-weight:300;">
            {{comic.artist}}
          </router-link>
        </h2>

        <back-to-index class="margin-top-16"></back-to-index>

        <button @click="downloadZippedComic()"
                v-if="$store.getters.isAuthenticated 
                      && $store.getters.userData.donator 
                      && !isZipping 
                      && !downloadStarted" 
                class="y-button">
          <download/>  Download comic
        </button>

        <Loading text="Zipping, please wait..." v-if="$store.getters.isAuthenticated && $store.getters.userData.donator && isZipping" class="mt-16"/>
        <p v-if="downloadStarted" class="margin-top-16">
          Download started!
        </p>

        <div class="margin-top-16" v-if="comic && (comic.previousComic || comic.nextComic)">
          <p>This comic is part of a series!</p>
          <p v-if="comic.previousComic">
            <router-link :to="{ name: 'comic', params: { comicName: comic.previousComic } }" 
                         class="underline-link" style="font-weight: 400;">
              <left-arrow/>
              {{comic.previousComic}}
            </router-link>
          </p>
          <p v-if="comic.nextComic">
            <router-link :to="{ name: 'comic', params: { comicName: comic.nextComic } }"
                         class="underline-link" style="font-weight: 400;">
              {{comic.nextComic}} 
              <right-arrow/>
            </router-link>
          </p>
        </div>

        <p class="margin-top-16">
          User rating: 
          <span style="font-weight: 400;">{{formatRating($store.getters.comicForVotingModal.userRating)}}</span>
        </p>
        <rating-slider v-if="$store.getters.isAuthenticated" style="margin-top: 0.5rem;"/>
        <p v-else class="margin-bottom-8"> 
          <button class="underline-link text-button link-color" 
                  @click="$store.commit('setLoginModalVisibility', true)">
            <login-icon/> Log in
          </button> to rate comic
        </p>

        <div id="comicKeywords" class="margin-top-8 horizontal-flex flexWrap">
          <span v-if="keywords.length > 0" class="horizontal-flex flexWrap">
            <div class="keyword-static"
                 v-for="keyword in keywords"
                 :key="keyword.id">
              {{keyword.name}}
            </div>
          </span>
          <span v-if="keywords.length===0" style="margin-right: 8px;">
            <p>No tags</p>
          </span>

          <div class="keyword-static keyword-button" @click="toggleKeywordSuggestions()" v-if="!keywordSuggestionsActive">
            add/remove tags
          </div>
          <div class="keyword-static keyword-button" @click="toggleKeywordSuggestions()" v-if="keywordSuggestionsActive">
            hide adding/removing tags
          </div>
        </div>

        <div id="keywordEditing" v-if="keywordSuggestionsActive" class="margin-top-8 horizontal-flex">
          <div id="dropdownContainer">
            <span class="vertical-flex" style="align-items: center;">
              <label for="addKeyword">Add tag</label>
              <select v-model="addKeyword">
                <option v-for="keyword in keywordsNotInComic" :key="keyword.id">
                  {{keyword.name}}
                </option>
              </select>
              <button 
                @click="suggestKeywordChange(isAdding=true)"
                :class="{'y-button-disabled': !addKeyword}"
                class="y-button"
                style="width: fit-zipContent; margin-top: 2px;"
              >
                Add
              </button>
            </span>

            <span style="margin-left: 20px; align-items: center;" class="vertical-flex">
              <label for="removeKeyword">Remove tag</label>
              <select v-model="removeKeyword">
                <option v-for="keyword in keywords" :key="keyword.id">
                  {{keyword.name}}
                </option>
              </select>
              <button 
                @click="suggestKeywordChange(isAdding=false)"
                class="y-button"
                :class="{'y-button-disabled': !removeKeyword, 'y-button-red': removeKeyword}"
                style="width: fit-zipContent; margin-top: 2px;"
              >
                Remove
              </button>
            </span>
          </div>
        </div>

        <ResponseMessage :message="responseMessage" :messageType="responseMessageType" 
                         @closeMessage="closeResponseMessage" class="mt-16"/>

        <div id="paidImageBanner" class="mt-16" style="height: 100px;">
          <a v-if="paidImage" :href="paidImage.link" target="_blank">
            <img :src="`/paid-images/${paidImage.id}.${paidImage.filetype}`" height="100"/>
          </a>

          <div v-else style="height: 100px; width: 680px;"/>
        </div>

        <div id="comicSizingButtonsRow" class="margin-top-16 horizontal-flex" style="align-items: center;">
          <p style="margin-right: 4px;">Image fit:</p>
          <button @click="setAllImagesFit('height')" class="y-button y-button-neutral">Height</button>
          <button @click="setAllImagesFit('width')"  class="y-button y-button-neutral">Width</button>
          <button @click="setAllImagesFit('big')"    class="y-button y-button-neutral">Full</button>
          <button @click="setAllImagesFit('thumb')"  class="y-button y-button-neutral">Tiny</button>
        </div>
        <p class="smaller-text">You may also click any one image to resize it</p>
      </span>

      
      <div v-else-if="!comicNotFound">
        <h1>{{$route.params.comicName}}</h1>
        <h2 style="text-align:center; margin: 2rem 0;">
          Loading comic...
        </h2>
      </div>

      <div v-else>
        <h1>{{$route.params.comicName}}</h1>
        <h2 style="text-align:center; margin: 2rem 0;">
          There is no comic with this name.
        </h2>
      </div>

    </div>
  
    <div v-if="comic" id="comicPageContainer" class="margin-top-8 margin-bottom-8">
      <img 
        v-for="pageNumber in comic.numberOfPages" 
        :src="`/comics/${comic.name}/${formatPageNumber(pageNumber)}.jpg`"
        :alt="`${comic.name} page ${pageNumber}`"
        :id="'page' + (pageNumber-1)"
        :key="pageNumber"
        :class="['img-fit-height', 'comic-page']"
        @click="cycleOneImageFit(pageNumber-1)"/>
    </div>

    <div class="margin-top-8 margin-bottom-8" v-if="comic">
      <p v-if="comic.previousComic || comic.nextComic">This comic is part of a series!</p>
      <p v-if="comic.previousComic">
        <router-link :to="{ name: 'comic', params: { comicName: comic.previousComic } }" class="underline-link" style="font-weight: 400;">
          <left-arrow/>
          {{comic.previousComic}}
        </router-link>
      </p>
      <p v-if="comic.nextComic">
        <router-link :to="{ name: 'comic', params: { comicName: comic.nextComic } }" class="underline-link" style="font-weight: 400;">
          {{comic.nextComic}} 
          <right-arrow/>
        </router-link>
      </p>
    </div>

    <span v-if="comic">
      <p class="margin-top-8">User rating: {{formatRating($store.getters.comicForVotingModal.userRating)}}</p>
      <rating-slider v-if="$store.getters.isAuthenticated" style="margin-top: 0;" class="margin-bottom-16"/>
      <p v-else class="margin-bottom-16"> 
        <button class="underline-link text-button link-color" 
                @click="$store.commit('setLoginModalVisibility', true)">
          <login-icon/> Log in
        </button> to rate comic
      </p>

      <button class="y-button y-button-neutral margin-bottom-16" @click="scrollToTop()"><up-arrow/> to top</button>
      <br>
    </span>
    <back-to-index />
    <div style="margin-top: 16px;"> </div>
  </span>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import RatingSlider from '@/components/RatingSlider.vue'
import Loading from '@/components/LoadingIndicator.vue'
import ResponseMessage from '@/components/ResponseMessage.vue'
import LeftArrow from 'vue-material-design-icons/ArrowLeft.vue'
import RightArrow from 'vue-material-design-icons/ArrowRight.vue'
import ShareIcon from 'vue-material-design-icons/ShareVariant.vue'
import LoginIcon from 'vue-material-design-icons/Login.vue'
import UpArrow from 'vue-material-design-icons/ArrowUp.vue'
import ExpandWidth from 'vue-material-design-icons/ArrowExpandHorizontal.vue'
import ExpandHeight from 'vue-material-design-icons/ArrowExpandVertical.vue'
import Download from 'vue-material-design-icons/Download.vue'
import Tags from 'vue-material-design-icons/TagMultiple.vue'

import comicApi from '../api/comicApi'
import keywordApi from '../api/keywordApi'
import miscApi from '../api/miscApi'
import { mapGetters, mapActions } from 'vuex'
import { doFetch } from '../utils/statefulFetch'

export default {
  name: 'comic',

  props: {
    userInfo: Object,
  },

  components: {
    'back-to-index': BackToIndex,
    'rating-slider': RatingSlider,
    Loading, ResponseMessage,
    'left-arrow': LeftArrow,
    'right-arrow': RightArrow,
    'share-icon': ShareIcon,
    'login-icon': LoginIcon,
    'up-arrow': UpArrow,
    'expand-width': ExpandWidth,
    'expand-height': ExpandHeight,
    'download': Download,
    'tags': Tags,
  },

  data: function () {
    return {
      comic: this.$store.state.clickedComic || undefined,
      userIsDonator: true,
      comicNotFound: false,
      imageFitArray: [],
      keywordSuggestionsActive: false,
      keywords: [],
      addKeyword: undefined,
      responseMessage: '',
      responseMessageType: 'info',
      removeKeyword: undefined,
      showShareIcon: true,
      isZipping: false,
      downloadStarted: false,
      paidImage: null,
      
    }
  },

  computed: {
    ...mapGetters({
      paidImages: 'paidImagesBanner',
      allKeywords: 'allKeywords',
      allPaidImages: 'paidImages'
    }),

    keywordsNotInComic () {
      return this.allKeywords.payload.filter(kw => !this.keywords.find(thisKw => thisKw.id === kw.id))
    }
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

    if (this.comic && !this.keywords) {
      this.keywords = await keywordApi.getComicKeywords(this.comic.id)
    }

    this.$store.commit('setLoginModalVisibility', false)
    if (!this.comic) {
      this.loadComic()
    }
    else {
      this.initializeImageFitArray()
      this.fitImagesForMobile()
    }

    miscApi.logRoute('comic', this.$route.params.comicName)
  },

  methods: {
    ...mapActions([
      'loadActiveAds',
    ]),

    formatPageNumber: pageNumber => pageNumber<100 ? (pageNumber<10 ? '00'+pageNumber : '0'+pageNumber) : pageNumber,

    formatRating: function (number) {
      if (!number) { return 'None' }
      if (number > 8.5) { return Math.round(number * 100) / 100 }
      else { return Math.round(number * 10) / 10 }
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

    toggleKeywordSuggestions () {
      this.keywordSuggestionsActive = !this.keywordSuggestionsActive
    },

    async loadKeywords () {
      doFetch(this.$store.commit, 'comicKeywords', keywordApi.getKeywordForComic(this.comic.id))
    },

    async suggestKeywordChange (isAdding) {
      this.closeResponseMessage()
      let relevantKeywordName = isAdding===true ? this.addKeyword : this.removeKeyword
      if (!relevantKeywordName) { return }

      let relevantKeywordId = this.getKeywordIdFromName(relevantKeywordName)
      let suggestionResponse = await keywordApi.addKeywordSuggestion(this.comic.id, relevantKeywordId, isAdding)

      if (suggestionResponse.success) {
        this.responseMessage = `Thank you! Your suggestion will be reviewed soon (${isAdding ? 'Add' : 'Remove'} ${relevantKeywordName})`
        this.responseMessageType = 'success'

        this.addKeyword = undefined
        this.removeKeyword = undefined
      }
      else {
        this.responseMessage = suggestionResponse.message
        this.responseMessageType = 'error'
      }
    },

    async loadComic () {
      this.comic = undefined
      let response = await comicApi.getComic(this.$route.params.comicName)
      if (response.success) {
        this.comic = response.result
        this.$store.commit('setComicForVotingModal', this.comic)
        this.initializeImageFitArray()
        this.fitImagesForMobile()
        this.keywords = await keywordApi.getComicKeywords(this.comic.id)
      }
      else {
        this.comicNotFound = true
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
      let shareDataObject = {
        'title': this.$route.params.comicName + ' - Yiffer.xyz',
        'text': '',
        'url': 'https://yiffer.xyz/' + this.$route.path
      }
      await navigator.share(shareDataObject)
      // todo log something
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

    getKeywordIdFromName (keywordName) {
      return this.allKeywords.payload.find(kw => kw.name === keywordName).id
    },
    
    closeResponseMessage () { this.responseMessage = '' },
  },

  watch: {
    $route (to, from){
      this.loadComic()
    }
  }
}

let imageFitCycleOrder = ['height', 'width', 'big', 'thumb']
</script>

<style lang="scss">
.comic-page {
  min-height: 90px;
}

.share-icon {
  position:absolute !important;
  top: 30px;
  right: 12px;
  font-size: 28px;
  @media (min-width: 900px) {
    display: none !important;
  }
}

#comicUpperDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;

  .y-button {
    margin-top: 16px;
  }
}

#comicKeywords {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.keyword-button {
  border-color: $theme4 !important;
  color: $theme4 !important;
  &:hover {
    cursor: pointer;
  }
}

#keywordEditing {
  width: 100%;
  select {
    margin: 0 4px;
  }
}

#dropdownContainer {
  display: flex;
  flex-direction: row;
  justify-zipContent: center;
}

#upperBodyDivComic {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  h2 {
    @media (max-width: 900px) {
      font-size: 22px;
    }
  }
}
a {
  text-decoration: none;
}

#loadedComicHeader {
  @media (max-width: 900px) {
    font-size: 32px;
    max-width: calc(100% - 84px);
  }
}

#comicPageContainer {
  img {
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
