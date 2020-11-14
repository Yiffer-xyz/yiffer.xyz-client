<template>
  <div style="width: 100%;">
    <h1>Apply as an advertiser</h1>
    <BackToIndex></BackToIndex>

    <div class="full-width-text">
      <p>
        In order to be accepted as a mod, you must have and use a Telegram account. We use telegram for communication and announcements for mods. If you do not have an account, you will not be accepted.
      </p>

      <form class="y-form" enctype="multipart/form-data" style="width: fit-content; margin: 1rem auto;">
        <h3>Mod application form</h3>

        <BigSuccess v-show="success" text="Success! See your account page for details."/>

        <span v-show="!success">
          <label for="adLinks">Tell us a little about why you want to be a mod, and what sources you use for finding comics (which websites):</label>
          <textarea type="text" v-model="notes" id="adLinks" rows="4"/>

          <div class="field mt-32">
            <label for="competentAnswerInput">Are you competent at cropping and resizing images (in order to make thumbnails)? MS Paint does not count, as it ruins the images.</label>
            <input type="text" v-model="competentAnswer" id="competentAnswerInput"/>
          </div>

          <div class="field mt-32">
            <label for="telegramUsernameInput">Telegram username:</label>
            <input type="text" v-model="telegramUsername" id="telegramUsernameInput"/>
          </div>

          <Loading v-if="isAwaitingResponse" text="Submitting..."/>

          <ResponseMessage :message="responseMessage" messageType="error" @closeMessage="closeResponseMessage" class="mb-16"/>

          <button @click.prevent="submitApplication" 
                  class="y-button mt-32"
                  :class="{'y-button-disabled': !isReadyForSubmit}"
                  style="align-self: center;"
                  v-if="!isAwaitingResponse">
            Submit application
          </button>
        </span>
      </form>
    </div>
  </div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import Loading from '@/components/LoadingIndicator.vue'
import BigSuccess from '@/components/BigSuccessMessage.vue'
import ResponseMessage from '@/components/ResponseMessage.vue'

import miscApi from '../api/miscApi'

import RightArrow from 'vue-material-design-icons/ArrowRight.vue'
import LoginIcon from 'vue-material-design-icons/Login.vue'
import CheckIcon from 'vue-material-design-icons/CheckCircle.vue'

export default {
  name: 'joinUsApply',
  
  components: {
    BackToIndex, Loading, BigSuccess, ResponseMessage,
    RightArrow, LoginIcon, CheckIcon,
  },

  data () {
    return {
      notes: '',
      competentAnswer: '',
      telegramUsername: '',
      isAwaitingResponse: false,
      success: false,
      responseMessage: '',
    }
  },

  computed: {
    isReadyForSubmit () {
      return this.notes.length > 0 && this.competentAnswer.length > 0 && this.telegramUsername.length > 0
    },
  },

  mounted () {
    miscApi.logRoute('join us apply')
  },

  methods: {
    async submitApplication () {
      if (!this.isReadyForSubmit) { return }

      this.responseMessage = ''
      this.isAwaitingResponse = true
      let result = await miscApi.submitModApplication(this.notes, this.competentAnswer, this.telegramUsername)
      this.isAwaitingResponse = false

      if (result.success) {
        this.success = true
      }
      else {
        this.responseMessage = result.message
      }
    },

    closeResponseMessage () { this.responseMessage = '' },
  },

  metaInfo () {
    let title = `Join us - Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
      ]
    }
  },
}
</script>
