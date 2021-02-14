<template>
  <div style="width: 100%">
    <h1>Feedback</h1>
    <BackToIndex></BackToIndex>

    <div class="full-width-text margin-top-12">
      <p>Thank you for taking the time to help improve our site! Enter your feedback below.</p>

      <Form :canSubmit="feedbackText.length > 5"
            :header="'Submit feedback'"
            :buttonText="'Submit feedback'"
            :errorText="'We apologize, there was an error saving your feedback'"
            :fetchingText="'Submitting...'"
            :fetchState="submitFeedback"
            :successText="'Thank you!'"
            @submit="sendFeedback"
      >
        <div class="yForm2Field">
          <textarea type="text" v-model="feedbackText" id="adLinks" rows="6"/>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import miscApi from '../api/miscApi'
import { doFetch, fetchClear } from '../utils/statefulFetch'
import { mapGetters } from 'vuex'

import BackToIndex from '@/components/BackToIndex.vue'
import Form from '../components/Form.vue'
export default {
  name: 'feedback',

  components: { BackToIndex, Form, },

  computed: {
    ...mapGetters(['submitFeedback']),
  },

  data: function () {
    return {
      feedbackText: '',
      hideResponseMessage: false,
      isSubmitting: false,
    }
  },
  
  async mounted () {
    miscApi.logRoute('feedback')
    fetchClear(this.$store.commit, 'submitFeedback')
  },

  methods: {
    async sendFeedback () {
      if (!this.feedbackText) { return }

      doFetch(this.$store.commit, 'submitFeedback', miscApi.submitFeedback(this.feedbackText))
    },
  },

  metaInfo () {
    let title = `Feedback - Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry porn comics, easily readable and free!"},
        {vmid: 'ogDesc', property: 'og:description', content: "The internet's best collection of high quality furry porn comics, easily readable and free!"},
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
