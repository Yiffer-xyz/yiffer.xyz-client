<template>
  <div style="width: 100%">
    <h1>Feedback</h1>
    <BackToIndex></BackToIndex>

    <div class="full-width-text margin-top-12">
      <p>Thank you for taking the time to help improve our site! Enter your feedback below.</p>

      <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"
                        outsideStyle="margin-bottom: 1rem; margin-top: 1rem;"/>

      <span v-if="!isSubmitting" class="mt-16">
        <textarea type="text" v-model="feedbackText" style="width: 100%; white-space: pre-wrap; margin-top: 0.5rem;" rows="6"/>

        <button class="y-button margin-top-8"
                :class="{'y-button-disabled': !feedbackText}"
                @click="submitFeedback">Submit feedback</button>
      </span>

      <Loading v-else text="Submitting feedback" class="mt-32" />
    </div>
  </div>
</template>

<script>
import miscApi from '../api/miscApi'

import BackToIndex from '@/components/BackToIndex.vue'
import ResponseMessage from '@/components/ResponseMessage.vue'
import Loading from '@/components/LoadingIndicator.vue'
export default {
  name: 'feedback',

  components: { BackToIndex, ResponseMessage, Loading },

  data: function () {
    return {
      feedbackText: '',
      responseMessage: '',
      responseMessageType: 'info',
      isSubmitting: false,
    }
  },
  
  async mounted () {
    miscApi.logRoute('feedback')
  },

  methods: {
    async submitFeedback () {
      if (!this.feedbackText) { return }

      this.isSubmitting = true
      let response = await miscApi.submitFeedback(this.feedbackText)
      this.isSubmitting = false

      if (response.success) {
        this.responseMessage = `Thank you for the feedback!`
        this.responseMessageType = 'success'
        this.feedbackText = ''
      }
      else {
        this.responseMessage = 'We apologize, there was an error recording your feedback.'
        this.responseMessageType = 'error'
      }
    },

    closeResponseMessage () { this.responseMessage = '' },
  },

  metaInfo () {
    let title = `Feedback - Yiffer.xyz`
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

<style lang="scss" scoped>
#inputContainer {
  input, textarea {
    width: 100%;
  }
  textarea {
    padding: 1px;
  }
  .input-cell {
    width: 400px;
  }
}
</style>
