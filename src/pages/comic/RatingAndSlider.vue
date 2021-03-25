<template>
  <div class="marginAuto verticalFlex alignItemsCenter"
       :style="`${styles} ${isAuthenticated ? ' padding-left: 1rem;' : ''}`">
    <div class="horizontalFlex justifyStart" :style="isAuthenticated ? 'min-width: 13rem;' : ''">
      <p style="padding-left: 2px;">
        Average rating: {{isAuthenticated ? '' : formatRating(userRating)}}
      </p>
      <p v-if="isLoading === 0 && isAuthenticated" style="width: 2.75rem">
        {{formatRating(userRating)}}
      </p>
      <Spinner v-else-if="isLoading"
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
</template>

<script>
import RatingSlider from '@/components/RatingSlider.vue'
import Spinner from 'vue-simple-spinner'
import LoginIcon from 'vue-material-design-icons/Login.vue'

import { mapGetters } from 'vuex'


export default {
  props: {
    userRating: Number,
    styles: {
      type: String,
      required: false,
      default: '',
    },
  },

  components: {
    RatingSlider, Spinner, LoginIcon,
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'isDarkTheme', 'comicForVotingModal'])
  },

  data () {
    return {
      isLoading: 0,
    }
  },

  methods: {
    onUpdatedComic (updatedComic) {
      this.isLoading = Math.max(0, this.isLoading-1)
      this.$emit('updatedComic', updatedComic)
    },

    formatRating: function (number) {
      if (!number) { return '-' }
      return Math.round(number * 100) / 100
    },
  },
}
</script>

<style>

</style>