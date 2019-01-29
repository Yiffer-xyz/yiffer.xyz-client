<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2>Correct comic data</h2>
    <span class="admin-content-box-inner" v-if="isOpen">
      <div class="horizontal-flex" style="margin-top: 8px;">
        <p class="add-kw-mini-header" style="margin-right: 8px;">Comic:</p>
        <select v-model="comic">
          <option v-for="comic in $store.getters.comicList" :key="comic.id" :value="comic">
            {{comic.name}}
          </option>
        </select>
      </div>

      <span v-if="comic" style="width: 100%;">

        <div class="horizontal-flex horiz-space-items-8px" style="flex-wrap: wrap;">
          <div class="vertical-flex">
            <p>Artist</p>
            <select v-model="artist">
              <option v-for="artist in artistList" :key="artist.name" :value="artist.name">
                {{artist.name}}
              </option>
            </select>
          </div>

          <div class="vertical-flex">
            <p>Category</p>
            <select v-model="tag">
              <option value="Furry">Furry</option>
              <option value="MLP">MLP</option>
              <option value="Pokemon">Pokemon</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="vertical-flex">
            <p>Classification</p>
            <select v-model="cat">
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="MF">MF</option>
              <option value="MM">MM</option>
              <option value="FF">FF</option>
              <option value="MF+">MF+</option>
              <option value="I">I</option>
            </select>
          </div>
          
          <div class="vertical-flex">
            <p>Finished</p>
            <select v-model="finished">
              <option value="true">Finished</option>
              <option value="false">Unfinished</option>
            </select>
          </div>

        </div>
        <button @click="submitChanges()" class="y-button no-margin-bot">Submit changes</button>
      </span>


      <p class="error-message" v-if="errorMessage" style="margin-top: 8px;">{{errorMessage}}</p>
      <p class="success-message" v-if="successMessage" style="margin-top: 8px;">{{successMessage}}</p>

      <menu-up-icon @click.native="closeComponent" class="mdi-arrow close-component-arrow"/>
    </span>

    <span v-else>
      <menu-down-icon class="mdi-arrow"/>
    </span>
  </div>
</template>

<script>
import comicApi from '../../api/comicApi'

export default {
  name: 'correctComic',

  props: {
    artistList: Array,
  },

  data: function () {
    return {
      isOpen: false,
      comic: undefined,
      artist: undefined,
      tag: undefined,
      cat: undefined,
      finished: undefined,

      errorMessage: '',
      successMessage: '',
    }
  },

  methods: {
    async submitChanges () {
      // todo request
      // todo check at this.comc faktisk blir sendt med oppdaterte felter, se watch for hvordan de settes
      // this.tag, this.cat, this.artist, this.finished
      let response = await comicApi.updateComic(this.comic)

      if (response.success) {
        this.successMessage = 'Successfully updated info of ' + this.comic.name
        this.errorMessage = ''
        this.$emit('refresh-comic-list')
      }
      else {
        this.errorMessage = 'Error updating comic: ' + response.message
        this.successMessage = ''
      }
    },

    openComponent () { if (!this.isOpen) { this.isOpen = true } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },

  watch: {
    comic: function () {
      if (this.comic) {
        this.tag = this.comic.tag
        this.cat = this.comic.cat
        this.finished = this.comic.finished ? 'true' : 'false'
        this.artist = this.comic.artist
      }
    }
  }
}
</script>

<style lang="scss">
.horiz-space-items-8px {
  &>div {
    margin: 0px 8px;
  }
}

</style>
