<template>
  <div id="modalAndBackdropWrapper">
    <div class="votingModal"
         id="votingModal"
         :style="`${verticalOffset}; ${horizontalOffset}; height: ${modalHeight};`">

      <p>
        Rate {{comicForVotingModal.name}}
      </p>

      <RatingSlider @loading="isLoading = true"
                    @updatedComic="onUpdatedComic"/>

      <div class="horizontalFlex" style="justify-content: space-between; padding: 0 0.75rem;">
        <div style="height: 1.5rem" class="horizontalFlex inlineFlex">
          <p style="font-size: 0.85rem">
            Average: 
          </p>
          <p v-if="!isLoading" style="font-size: 0.85rem; width: 2.5rem;">
            {{formatRating(userRating)}}
          </p>
          <Spinner v-else
                  size="12"
                  :line-size="1"
                  :line-bg-color="'transparent'"
                  :line-fg-color="isDarkTheme ? 'white' : 'black'"
                  style="margin-top: 0.3rem; width: 2.5rem;"/>
        </div>

        <p style="font-size: 0.85rem" class="link-color cursorPointer closeBtn" @click="closeModal">
          Close
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from 'vue-simple-spinner'
import RatingSlider from '@/components/RatingSlider.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    RatingSlider, Spinner,
  },

  computed: {
    ...mapGetters([
      'votingModalVisibility',
      'comicForVotingModal',
      'isDarkTheme',
    ]),

    verticalOffset () {
      if (this.votingModalVisibility.y + 8*16 > this.windowHeight) {
        return `bottom: calc(${this.windowHeight}px - ${this.votingModalVisibility.y}px)`
      }
      else {
        return `top: ${this.votingModalVisibility.y}px`
      }
    },

    horizontalOffset () {
      return 'left: min(' +
        'max(' +
          '0.5rem, ' +
          `calc(${this.votingModalVisibility.x}px - 9rem)` +
        '), ' +
        `calc(${this.windowWidth}px - 20rem)` +
        ')'
    }
  },

  data () {
    return {
      isLoading: false,
      userRating: this.comicForVotingModal?.userRating,
      windowWidth: document.body.scrollWidth,
      windowHeight: window.innerHeight,
      modalHeight: '20px',
      lastModalOpenedTime: 0,
    }
  },

  watch: {
    comicForVotingModal () {
      this.isLoading = false
      this.userRating = this.comicForVotingModal.userRating
    },

    votingModalVisibility () {
      if (this.votingModalVisibility) {
        this.lastModalOpenedTime = (new Date()).getTime()
        setTimeout(() => this.modalHeight = '100px', 1)
      }
      else {
        this.modalHeight = '20px'
        this.isLoading = false
      }
    },
  },

  methods: {
    onUpdatedComic (updatedComic) {
      this.isLoading = false
      this.userRating = updatedComic.userRating
    },

    closeModal () {
      this.modalHeight='0px'
      setTimeout(() => this.$store.commit('setVotingModalVisibility', false), 200)
    },
    
    formatRating (number) {
      if (!number) { return '-' }
      if (number > 8.5) { return Math.round(number * 100) / 100 }
      else { return Math.round(number * 10) / 10 }
    },
  },
  
  created() {
    window.addEventListener("resize", () => {
      this.windowWidth = document.body.scrollWidth
      this.windowHeight = document.body.scrollHeight

    });
    window.addEventListener("scroll", () => {
      if (this.votingModalVisibility) {
        this.$store.commit('setVotingModalVisibility', false)
      }
    });
    window.addEventListener("click", (e) => {
      if (this.votingModalVisibility) {
        const clickedInModal = e.path.some(el => el.id === 'votingModal')
        const isOpenDelayPassed = (new Date()).getTime() - this.lastModalOpenedTime > 100
        if (!clickedInModal && isOpenDelayPassed) {
          this.closeModal()
        }
      }
    });
  },
}
</script>


<style lang="scss" scoped>
.votingModal {
  position: fixed;
  z-index: 6;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: rgba(100, 100, 111, 0.6) 0px 7px 29px 0px;
  width: 18rem;
  border-radius: 8px;
  padding: 0.5rem;
  justify-content: center;
  overflow: hidden;
  transition: height 200ms;
}

.dark {
  .votingModal {
    box-shadow: rgba(47, 48, 51, 0.6) 0px 7px 29px 0px;
    background-color: $themeGray10;
    color: white;
    input {
      color: white;
    }
    label {
      color: white;
    }
    p:not(.closeBtn) {
      color: white !important;
    }
  }
}
</style>
