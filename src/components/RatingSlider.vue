<template>
  <div class="rating-slider">
    <label>Rating</label>
    <input type="range" min="0" max="10" v-model="ratingSliderValue"
           :class="{'rating-slider-norating': ratingSliderValue==0}"
           @change="onNewRatingSet">
    <label :class="{'rating-number': ratingSliderValue>0, 'none-text': ratingSliderValue==0}">
      {{convertSliderValue(ratingSliderValue)}}</label>
  </div>
</template>

<script>
import comicApi from '../api/comicApi'

export default {
  name: 'rating-slider',

  data: function () {
    return {
      ratingSliderValue: 0,
      isRecentlyOpened: false,
			lastRatingSetTime: new Date(),
			ratingSpamBlocked: undefined
    }
  },

  methods: {
    convertSliderValue (sliderNumber) {
      return sliderNumber==0 ? 'None' : sliderNumber
    },

    setRatingSliderValue () {
      this.ratingSliderValue = this.$store.getters.comicForVotingModal.yourRating || 0
    },

		async onNewRatingSet (newRating) {
       newRating = Number(newRating.target.value)
			if (new Date() - this.lastRatingSetTime > 500) {
				this.ratingSpamBlocked = undefined
        this.lastRatingSetTime = new Date()
        this.setNewRating(newRating)
			}
			else {
				this.ratingSpamBlocked = newRating
				setTimeout(
					() => this.assignNewRatingFromTimeout(newRating), 
					500
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
      await comicApi.rateComic(this.$store.getters.comicForVotingModal.id, newRating)
      await this.$store.dispatch('refreshOneComicInList', this.$store.getters.comicForVotingModal.name)
      this.$store.dispatch('refreshComicForVotingModal')
    }
  },
  
  created () {
		this.$store.watch(this.$store.getters.getComicForVotingModal, this.setRatingSliderValue)
  }
}
</script>

<style lang="scss">
@import "../scss/colors.scss";

.rating-slider {
  max-width: 340px;
  height: 22px;
  margin: 8px 0;
  padding: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  input {
    margin: 0 6px;
  }
  label {
    width: 42px;
    flex-shrink: 0;
  }
  .rating-number {
    font-weight: 400;
    font-size: 16px;
  }
}

$track-color: $themeDark1 !default;
$track-background: linear-gradient(to right, $theme2, $theme6);
$track-background-norating: linear-gradient(to right, #006d4c90, #78fdd690);
$thumb-color: $themeDark1 !default;

$thumb-radius: 12px !default;
$thumb-height: 18px !default;
$thumb-width: 18px !default;
$thumb-shadow-size: 2px !default;
$thumb-shadow-blur: 2px !default;
$thumb-shadow-color: rgba(0, 0, 0, .2) !default;
$thumb-border-width: 2px !default;
$thumb-border-color: #eceff1 !default;

$track-width: 100% !default;
$track-height: 12px !default;
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
  cursor: default;
  height: $track-height;
  transition: all .2s ease;
  width: $track-width;
}

@mixin thumb($adjustment: 0) {
  @include shadow($thumb-shadow-size, $thumb-shadow-blur, $thumb-shadow-color);
  background: $thumb-color;
  border: $thumb-border-width solid $thumb-border-color;
  border-radius: $thumb-radius;
  cursor: default;
  height: $thumb-height + $adjustment;
  width: $thumb-width + $adjustment;
}

@mixin disabled {
  cursor: not-allowed;
}

[type='range'] {
  -webkit-appearance: none;
  background: transparent;
  margin: $thumb-height / 2 0;
  width: $track-width;

  &::-moz-focus-outer {
    border: 0;
  }

  &:focus {
    outline: 0;

    &::-webkit-slider-runnable-track {
      background: lighten($track-color, $contrast);
    }

    &::-ms-fill-lower {
      background: $track-background;
    }

    &::-ms-fill-upper {
      background: lighten($track-color, $contrast);
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
.rating-slider-norating   {
  &::-webkit-slider-runnable-track {
    background: $track-background-norating !important;
  }
}

</style>
