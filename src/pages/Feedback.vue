<template>
  <div style="width: 100%">
    <h1>Feedback</h1>
    <BackToIndex></BackToIndex>

    <div class="full-width-text margin-top-12">
      <p>
        Thank you for taking the time to help improve our site! Enter your feedback below.
      </p>

      <Form :header="'Submit feedback'"
            :buttonText="'Submit feedback'"
            :errorText="'We apologize - there was an error saving your feedback'"
            :fetchingText="'Submitting...'"
            :fetchState="submitFeedback"
            :successText="'Thank you for your feedback!'"
            showCloseOnSuccess
            @cancel="resetForm"
            @submit="sendFeedback"
      >
        <TextInput :value="feedbackText"
                   @change="newVal => feedbackText = newVal"
                   title="Your feedback"
                   type="textarea"/>
      </Form>
    </div>
  </div>
</template>

<script>
import miscApi from '../api/miscApi'
import { doFetch, fetchClear } from '../utils/statefulFetch'
import { mapGetters } from 'vuex'

import BackToIndex from '@/components/BackToIndex.vue'
import TextInput from '@/components/TextInput.vue'
import Form from '@/components/Form.vue'
export default {
  name: 'feedback',

  components: {
    BackToIndex, Form, TextInput,
  },

  computed: {
    ...mapGetters(['submitFeedback']),
  },

  data: function () {
    return {
      feedbackText: '',
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

    resetForm () {
      fetchClear(this.$store.commit, 'submitFeedback')
      this.feedbackText = ''
    }
  },

  metaInfo () {
    let title = `Feedback - Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"},
        {vmid: 'ogDesc', property: 'og:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"},
      ]
    }
  },
}
</script>
