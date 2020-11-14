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
      </ul>

      <div class="vertical-flex margin-top-32">
        <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"
                         class="margin-bottom-10"/>

        <label>Comic name</label>
        <input type="text" v-model="comicName" style="width: 200px;"/>

        <label class="margin-top-16">Artist (if known)</label>
        <input type="text" v-model="artist" style="width: 200px;"/>

        <div class="margin-top-16">
          <label>Links, comments</label>
          <textarea type="text" v-model="linksComments" style="width: 100%; white-space: pre-wrap;" rows="4"/>

          <p class="no-margin-top">
            Please provide some link (e.g. e621, FurAffinity, u18chan, reddit, anything not behind a paywall), and any other helpful comments you may have. If you have multiple sources, feel free to provide all of them!
          </p>
        </div>
      </div>

      <button class="y-button margin-top-8" @click="submitButtonClicked()">Submit</button>

      <div id="rejectedComics" class="margin-top-32 scrolling-table-container">
        <h2>Previously rejected comics</h2>
        <table class="y-table" v-if="rejectedComics.length > 0">
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
import ResponseMessage from '@/components/ResponseMessage.vue'
export default {
  name: 'suggestComic',

  components: { BackToIndex, ResponseMessage },

  data: function () {
    return {
      comicName: '',
      artist: '',
      linksComments: '',
      rejectedComics: [],
      responseMessage: '',
      responseMessageType: 'info',
    }
  },
  
  async mounted () {
    this.rejectedComics = await comicApi.getRejectedComics()
    miscApi.logRoute('suggestcomic')
  },

  methods: {
    async submitButtonClicked () {
      let response
      if (!this.comicName || !this.linksComments) {
        this.responseMessage = 'Please provide a comic name and some link to some page or an album somehwere'
        this.responseMessageType = 'error'
      }
      else {
        response = await comicApi.addComicSuggestion(this.comicName, this.artist, this.linksComments)
      }
      if (response.success) {
        this.responseMessage = `Thank you for your suggestion of ${this.comicName+''}!`
        this.responseMessageType = 'success'
        this.comicName = ''
        this.artist = ''
        this.linksComments = ''
      }
      else {
        this.responseMessage = response.message
        this.responseMessageType = 'error'
      }
    },

    closeResponseMessage () { this.responseMessage = '' },
  },

  metaInfo () {
    let title = `Suggest comic - Yiffer.xyz`
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

<style lang="scss">
#inputContainer {
  input, textarea {
    width: 100%;
  }
  textarea {
    padding: 1px;
    margin: 0;
  }
  .input-cell {
    width: 400px;
  }
}
</style>
