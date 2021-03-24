<template>
  <div class="rating-slider" :style="styles">
    <input type="range" min="0" max="10" v-model="ratingSliderValue"
           :class="{'rating-slider-norating': ratingSliderValue==0}"
           @change="onNewRatingSet">

    <label :class="{'rating-number': ratingSliderValue>0, 'none-text': ratingSliderValue==0}"
           class="yourRatingValue"
           :style="yourRatingStyle">
      {{convertSliderValue(ratingSliderValue)}}
    </label>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import comicApi from '../api/comicApi'

export default {
  name: 'rating-slider',

  props: {
    styles: String,
  },

  computed: {
    ...mapGetters(['comicForVotingModal'])
  },

  data: function () {
    return {
      comicName: '',
      loadingCount: 0,
      ratingSliderValue: 0,
      yourRatingStyle: 'font-size: 1rem;',
      isRecentlyOpened: false,
      lastRatingSetTime: new Date(),
      ratingSpamBlocked: undefined,
      vuexWatcher: undefined,
    }
  },

  methods: {
    convertSliderValue (sliderNumber) {
      return sliderNumber==0 ? '-' : sliderNumber
    },

    setRatingSliderValue () {
      if (this.loadingCount === 0) {
        this.ratingSliderValue = this.comicForVotingModal.yourRating || 0
      }
    },

    async onNewRatingSet (newRating) {
      newRating = Number(newRating.target.value)
      if (new Date() - this.lastRatingSetTime > 200) {
        this.ratingSpamBlocked = undefined
        this.lastRatingSetTime = new Date()
        this.setNewRating(newRating)
      }
      else {
        this.ratingSpamBlocked = newRating
        setTimeout(
          () => this.assignNewRatingFromTimeout(newRating), 
          200
        )
      }
    },

    assignNewRatingFromTimeout (newRating) {
      if (newRating != this.ratingSpamBlocked) {
        return
      }
      this.lastRatingSetTime = new Date()
      this.ratingSpamBlocked = undefined
      this.setNewRating(newRating)
    },
    
    async setNewRating (newRating) {
      this.yourRatingStyle = 'font-size: 1.35rem;'
      setTimeout(() => {
        this.yourRatingStyle = 'font-size: 1rem;'
      }, 200)

      this.$emit('loading')
      this.loadingCount += 1
      let comicNameToRefresh = this.comicForVotingModal.name
      await comicApi.rateComic(this.comicForVotingModal.id, newRating)
      let updatedComic = await this.$store.dispatch('refreshOneComicInList', comicNameToRefresh)
      this.$store.dispatch('refreshExpandedComicIfExpanded', updatedComic)
      
      if (this.$store.getters.comicForVotingModal.id === updatedComic.id) {
        this.$store.commit('setComicForVotingModal', updatedComic)
        this.$emit('updatedComic', updatedComic)
        this.loadingCount -= 1
      }
    }
  },

  mounted () {
    this.vuexWatcher = this.$store.watch(this.$store.getters.getComicForVotingModal, () => {
      if (this.comicForVotingModal.name !== this.comicName || this.$route.name !== 'comicList') {
        this.comicName = this.comicForVotingModal.name
        this.setRatingSliderValue()
      }
    })
    this.setRatingSliderValue()
  },

  beforeDestroy () {
    this.vuexWatcher()
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/colors.scss";

.rating-slider {
  max-width: 272px;
  height: 22px;
  margin: 0.5rem auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  cursor: pointer !important;
  input {
    cursor: pointer !important;
  }
  label {
    width: 1.75rem;
    flex-shrink: 0;
  }
  .rating-number {
    font-weight: 400;
    font-size: 16px;
  }
}

.yourRatingValue {
  transition: all 200ms;
  border: 1px solid $themeGreen1;
  border-radius: 40px;
  padding: 2px;
  border-color: transparent;
}

$track-color: $themeDark1 !default;
$track-background: linear-gradient(to right, $themeGreen1Dark, $themeGreen2Dark);
$track-background-norating: linear-gradient(to right, $themeGreen1Trans, $themeGreen2Trans);
$thumb-color: $themeDark1 !default;
$thumb-color-focused: $themeDark4 !default;

$thumb-radius: 12px !default;
$thumb-height: 20px !default;
$thumb-width: 20px !default;
$thumb-shadow-size: 2px !default;
$thumb-shadow-blur: 2px !default;
$thumb-shadow-color: rgba(0, 0, 0, .2) !default;
$thumb-border-width: 2px !default;
$thumb-border-color: #eceff1 !default;

$track-width: 100% !default;
$track-height: 14px !default;
$track-shadow-size: 0px !default;
$track-shadow-blur: 0px !default;
$track-shadow-color: rgba(0, 0, 0, .2) !default;
$track-border-width: 0px !default;
$track-border-color: #cfd8dc !default;

$track-radius: 12px !default;
$contrast: 5% !default;

$ie-bottom-track-color: darken($track-color, $contrast) !default;

@mixin shadow($shadow-size, $shadow-blur, $shadow-color) {
  box-shadow: $shadow-size $shadow-size $shadow-blur $shadow-color, 0 0 $shadow-size lighten($shadow-color, 5%);
}

@mixin track {
  height: $track-height;
  transition: all .2s ease;
  width: $track-width;
}

@mixin thumb($adjustment: 0) {
  @include shadow($thumb-shadow-size, $thumb-shadow-blur, $thumb-shadow-color);
  background: $thumb-color;
  border: $thumb-border-width solid $thumb-border-color;
  border-radius: $thumb-radius;
  height: $thumb-height + $adjustment;
  width: $thumb-width + $adjustment;
}

@mixin disabled {
  // cursor: not-allowed;
}

[type='range'] {
  -webkit-appearance: none;
  background: transparent;
  margin: $thumb-height / 2 0;
  width: $track-width;
  border: none !important;
  cursor: pointer !important;

  &::-moz-focus-outer {
    border: 0;
  }

  &:focus {
    outline: 0;

    &::-webkit-slider-thumb {
      background: $thumb-color-focused;
    }
    &::-moz-range-thumb {
      height: $thumb-height + 4px;
      width: $thumb-height + 4px;
    }
    &::-ms-thumb  {
      height: 50px;
    }
  }

  &::-webkit-slider-runnable-track {
    @include track;
    @include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color);
    background: $track-background;
    border: $track-border-width solid $track-border-color;
    border-radius: $track-radius;

  }



  &::-webkit-slider-thumb {
    @include thumb;
    -webkit-appearance: none;
    margin-top: ((-$track-border-width * 2 + $track-height) / 2 - $thumb-height / 2);
  }

  &::-moz-range-track {
    @include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color);
    @include track;
    background: $track-background;
    border: $track-border-width solid $track-border-color;
    border-radius: $track-radius;
    height: $track-height / 2;
  }

  &::-moz-range-thumb {
    @include thumb(-4);
  }

  &::-ms-track {
    @include track;
    background: transparent;
    border-color: transparent;
    border-width: ($thumb-height / 2) 0;
    color: transparent;
  }

  &::-ms-fill-lower {
    @include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color);
    background: $ie-bottom-track-color;
    border: $track-border-width solid $track-border-color;
    border-radius: ($track-radius * 2);
  }

  &::-ms-fill-upper {
    @include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color);
    background: $track-background;
    border: $track-border-width solid $track-border-color;
    border-radius: ($track-radius * 2);
  }

  &::-ms-thumb {
    @include thumb(-4);
    margin-top: $track-height / 4;
  }

  &:disabled {
    &::-webkit-slider-thumb {
      @include disabled;
    }

    &::-moz-range-thumb {
      @include disabled;
    }

    &::-ms-thumb {
      @include disabled;
    }

    &::-webkit-slider-runnable-track {
      @include disabled;
    }

    &::-ms-fill-lower {
      @include disabled;
    }

    &::-ms-fill-upper {
      @include disabled;
    }
  }
}
.rating-slider-norating {
  &::-webkit-slider-runnable-track {
    background: $track-background-norating !important;
  }
}

</style>
