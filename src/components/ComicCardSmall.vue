<template>
  <div
    @click="onCardClicked" 
    :class="{'new-comic-border': isNewComic, 'wip-comic-border': !comic.finished && !isNewComic, 'comic-card-small': true, 'simple-shadow': true}"
    >

    <div v-if="isNewComic || !comic.finished" class="label-box-container">
      <!-- WIP LABEL -->
      <div class="wip-label-box" v-if="comic.state === 'wip'">
        WIP
      </div>
      <div class="wip-label-box" v-if="comic.state === 'cancelled'">
        CUT
      </div>
      
      <!-- NEW LABEL -->
      <div v-if="isNewComic" :class="{'new-label-box': true, 'not-rounded-new-box': !comic.finished}">
        NEW
      </div>
    </div>

    <!-- TAG AND CAT -->
    <div style="flex: 0 0 40px; display: flex; flex-direction: column; 
    border-right: 0.5px solid #ccc; font-size: 13px; font-weight: 300;">
      <div style="flex-grow: 1; text-align: left; display: flex; align-items: center;">
        {{convertTagName(comic.tag)}}</div>
      <div style="flex-grow: 1; text-align: left; display: flex; align-items: center;">
        {{comic.cat}}</div>
    </div>

    <div style="display: flex; flex-direction: column; margin-left: 4px; width: 100%;">
      <!-- TITLE AND ARTIST -->
      <div style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 0.5rem;">
        <p style="font-size: 16px; font-weight: 400; text-align: left;">
          {{comic.name}}</p>
        <p style="font-size: 13px; font-weight: 300; margin-left: auto;
        text-align: right;">
          {{comic.artist}}</p>
      </div>

      <!-- PAGES, VOTES -->
      <div style="display: flex; flex-direction: row; font-weight: 300; font-size: 13px;">
        <p title="Number of pages">
          <PagesIcon title="Number of pages"/>
          {{comic.numberOfPages}}
        </p>

        <p title="User rating">
          <UsersIcon title="User rating" style="margin-left: 16px;"/>
          {{formatRating(comic.userRating)}}
        </p>

        <p title="Your rating" v-if="$store.getters.isAuthenticated" style="margin-left: 16px;">
          <UserIcon title="Your rating"/>
          {{comic.yourRating || '-'}}
        </p>
      </div>

      <!-- TAGS -->
      <div v-if="$store.getters.detailLevel==='high'" style="display: flex; flex-direction: row; flex-wrap: wrap; margin-top: 2px;"
      :style="{'margin-right': keywordsMarginRight}">
        <div 
          class="keyword keyword2"
          v-for="keyword in comic.keywords"
          :key="keyword"
          @click="addSelectedKeyword(keyword, $event)">
          {{keyword}}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import VotingButton from '@/components/VotingButton.vue'
import PagesIcon from 'vue-material-design-icons/FileOutline.vue'
import UserIcon from 'vue-material-design-icons/AccountOutline.vue'
import UsersIcon from 'vue-material-design-icons/AccountMultipleOutline.vue'
import PlusIcon from 'vue-material-design-icons/Plus.vue'
import RefreshIcon from 'vue-material-design-icons/Refresh.vue'

export default {
  name: 'comic-card',
  
  components: {
    VotingButton, PagesIcon, UserIcon, UsersIcon, PlusIcon, RefreshIcon, 
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
      isNewComic: new Date() - new Date(this.comic.created) < 10*604800000,  // todo 1 week = 604800000
      recentlyFinished: this.comic.finished && (new Date() - new Date(this.comic.updated) < 604800000),
      showLocalKeywords: false
    }
  },
  
  methods: {
    onCardClicked () {
      this.$store.dispatch('setExpandedComic', this.comic)
      this.$store.commit('setComicForVotingModal', this.comic)
    },

    formatRating: function (number) {
      if (number > 8.5) { return Math.round(number * 100) / 100 }
      else { return Math.round(number * 10) / 10 }
    },
    
    prettyDate: inputDateString => (new Date(inputDateString)).toDateString().substring(4),
    storeClickedComicData: function () {
      this.$store.dispatch('storeClickedComic', this.comic)
    },
    
    addSelectedKeyword (keywordName, clickEvent) {
      clickEvent.stopPropagation()
      if ( this.clickableKeyword ) { this.$store.dispatch('addSelectedKeywordByNameOnly', keywordName) }
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
    },

    keywordsMarginRight () {
      if (this.isNewComic && !this.comic.finished) { return '56px' }
      else if (!this.isNewComic && this.comic.finished) { return '0' }
      else { return '30px' }
    }
  }
}
</script>

<style lang="scss">
@import "../scss/colors.scss";
$comicCardSmallPadding: 6px;

.comic-card-small {
  display: flex;
  width: 97%;
  flex-direction: row;
  padding: $comicCardSmallPadding;
  box-sizing: border-box;
  background-color: $themeGray0p5;
  margin: 6px 4px;
  position: relative;
  border-radius: 4px;
  &:hover {
    cursor: pointer;
  }
  .label-box-container {
    position: absolute;
    right: $comicCardSmallPadding;
    bottom: $comicCardSmallPadding;
    margin: 0;
    font-size: 10px;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }
  .wip-label-box, .new-label-box {
    font-weight: 600;
    // color: white; 
    padding: 1px 3.5px;
    border-top-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background: transparent;
  }
  .new-label-box {
    color: $theme5;
  }
  .wip-label-box {
    color: $themeGray6;
  }
  .not-rounded-new-box {
    border-top-left-radius: 0px;
  }
}
.dark {
  .comic-card-small {
    background-color: $themeDark3;
  }
}
</style>
