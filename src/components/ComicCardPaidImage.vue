<template>
  <div>
    <a :href="paidImage.link"
       @click="savePaidImageClick"
       class="comic-card-link paidImageTextContainer"
       target="_blank">
      <p class="comic-card-comic-title" style="margin-top: 4px;">
        {{paidImage.mainText}}
      </p>

      <p class="paidImage2ndText">
        {{paidImage.secondaryText}}
      </p>
    </a>
  </div>
</template>

<script>
import paidImageApi from '../api/advertisingApi'

export default {
  name: 'comic-card-paid-image',
  
  props: {
    paidImage: Object,
  },

  methods: {
    async savePaidImageClick () {
      paidImageApi.logAdClick(this.paidImage.id)
    }
  },
}
</script>

<style lang="scss">
@import "../scss/colors.scss";
.paidImage2ndText {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  padding: 0 4px;
}
.paidImageTextContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
