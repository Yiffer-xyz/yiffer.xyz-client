<template>
  <div style="width: 100%;">
    <h1>Become a mod</h1>
    <BackToIndex></BackToIndex>

    <div class="full-width-text">
      <p>
        In order to be accepted as a mod, you must have and use a Telegram account. We use telegram for communication and announcements for mods. If you do not have an account, you will not be accepted.
      </p>

      <Form :buttonText="'Submit application'"
            :canSubmit="isReadyForSubmit"
            :errorText="modApplicationSubmit.errorMessage"
            :fetchingText="'Submitting...'"
            :fetchState="modApplicationSubmit"
            :header="'Mod application form'"
            :successText="'Success! We will contact you if we decide to take you in. Thank you!'"
            @submit="submitApplication">
        <div class="yForm2Field">
          <label for="adLinks">Tell us a little about why you want to be a mod, and what sources you use for finding comics (which websites):</label>
          <textarea type="text" v-model="notes" id="adLinks" rows="4"/>
        </div>

        <div class="yForm2Field">
          <label for="competentAnswerInput">Are you competent at cropping and resizing images (in order to make thumbnails)? MS Paint does not count, as it ruins the images.</label>
          <input type="text" v-model="competentAnswer" id="competentAnswerInput"/>
        </div>

        <div class="yForm2Field">
          <label for="telegramUsernameInput">Telegram username:</label>
          <input type="text" v-model="telegramUsername" id="telegramUsernameInput"/>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import Form from '../components/Form.vue'
import { doFetch, fetchClear } from '../utils/statefulFetch'

import miscApi from '../api/miscApi'
import { mapGetters } from 'vuex'

export default {
  name: 'joinUsApply',
  
  components: {
    BackToIndex, Form,
  },

  data () {
    return {
      notes: '',
      competentAnswer: '',
      telegramUsername: '',
    }
  },

  computed: {
    isReadyForSubmit () {
      return this.notes.length > 0 && this.competentAnswer.length > 0 && this.telegramUsername.length > 0
    },
    ...mapGetters(['modApplicationSubmit']),
  },

  mounted () {
    miscApi.logRoute('join us apply')
    fetchClear(this.$store.commit, 'modApplicationSubmit')
  },

  methods: {
    async submitApplication () {
      if (!this.isReadyForSubmit) { return }

      doFetch(this.$store.commit, 'modApplicationSubmit', 
        miscApi.submitModApplication(this.notes, this.competentAnswer, this.telegramUsername))
    },
  },

  metaInfo () {
    let title = `Join us - Yiffer.xyz`
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
