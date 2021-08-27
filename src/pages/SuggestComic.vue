<template>
  <div style="width: 100%">
    <h1>Suggest new comic</h1>
    <BackToIndex />

    <div class="full-width-text margin-top-12">
      <p>Thank you for wanting to improve our collection! Here are a few things to keep in mind:</p>

      <ul>
        <li>
          The comic should be at least 4 pages long. If the pages have lots of panels or if the comic is of very high quality, 3-page comics might be accepted.
        </li>
        <li>
          The comic will not be accepted if it is of low quality ("poorly drawn").
        </li>
        <li>
          The comic <i>might</i> not be accepted if it is uncolored.
        </li>
        <li>
          The comic will not be accepted if it is not in English.
        </li>
        <li>
          The comic will not be accepted if it has censoring bars, dots, etc.
        </li>
        <li>
          The comic will not be accepted if it has cub content.
        </li>
      </ul>

      <Form :buttonText="'Submit suggestion'"
            :canSubmit="canSubmit"
            :errorText="comicSuggestionSubmit.errorMessage"
            :fetchingText="'Submitting...'"
            :fetchState="comicSuggestionSubmit"
            :header="'Suggest comic'"
            :successText="`Thank you for your suggestion of ${comicName+''}!`"
            showCloseOnSuccess
            @cancel="resetForm"
            @submit="submitSuggestion">

        <TextInput :value="comicName"
                    @change="newVal => comicName = newVal"
                    title="Comic name (required)"
                    textAlign="left"
                    classes="width100 mb-48"/>

        <TextInput :value="artist"
                   @change="newVal => artist = newVal"
                   title="Artist (if known)"
                   textAlign="left"
                   classes="width100 mb-48"/>

        <TextInput :value="linksComments"
                   @change="newVal => linksComments = newVal"
                   title="Links, comments (required)"
                   type="textarea"
                   classes="width100 mb-8"/>

        <p class="no-margin-top">
          Please provide some link (e.g. e621, FurAffinity, u18chan, reddit, anything not behind a paywall), and any other helpful comments you may have. If you have multiple sources, feel free to provide all of them!
        </p>
      </Form>

      <div id="rejectedComics" class="margin-top-32">
        <h2>Previously rejected comics</h2>
        <table class="yTable mt-8" v-if="rejectedComics.length > 0">
          <thead>
            <tr>
              <th>Comic name</th>
              <th>Artist</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rejectedSuggestion in rejectedComics" :key="rejectedSuggestion.name">
              <td>{{rejectedSuggestion.name}}</td>
              <td>{{rejectedSuggestion.artist}}</td>
              <td>{{rejectedSuggestion.reason}}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>None yet!</p>
      </div>
    </div>
  </div>
</template>

<script>
import comicApi from '../api/comicApi'
import miscApi from '../api/miscApi'

import BackToIndex from '@/components/BackToIndex.vue'
import TextInput from '@/components/TextInput.vue'
import Form from '../components/Form.vue'
import { mapGetters } from 'vuex'
import { fetchClear, doFetch } from '../utils/statefulFetch'
export default {
  name: 'suggestComic',

  components: {
    BackToIndex, Form, TextInput,
  },

  data: function () {
    return {
      comicName: '',
      artist: '',
      linksComments: '',
      rejectedComics: [],
    }
  },
  
  async mounted () {
    this.rejectedComics = await comicApi.getRejectedComics()
    miscApi.logRoute('suggestcomic')
    fetchClear(this.$store.commit, 'comicSuggestionSubmit')
  },

  computed: {
    ...mapGetters(['comicSuggestionSubmit']),

    canSubmit () {
      return this.comicName.length > 0 && this.linksComments.length > 0
    }
  },

  methods: {
    async submitSuggestion () {
      if (!this.comicName || !this.linksComments) { return }

      doFetch(this.$store.commit, 'comicSuggestionSubmit', 
        comicApi.addComicSuggestion(this.comicName, this.artist, this.linksComments))
    },

    resetForm () {
      fetchClear(this.$store.commit, 'comicSuggestionSubmit')
      this.comicName = ''
      this.artist = ''
      this.linksComments = ''
    }
  },

  beforeDestroy () {
    fetchClear(this.$store.commit, 'comicSuggestionSubmit')
  },

  metaInfo () {
    let title = `Suggest comic - Yiffer.xyz`
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
