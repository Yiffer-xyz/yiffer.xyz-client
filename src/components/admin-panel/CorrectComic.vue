<template>
  <div class="admin-content-box" @click="openComponent" v-bind:class="{'admin-content-box-open': isOpen}">
    <h2>Correct comic data</h2>
    <span class="admin-content-box-inner" v-if="isOpen">
      <div class="horizontal-flex" style="margin-top: 8px;">
        <p class="add-kw-mini-header" style="margin-right: 8px;">Comic:</p>
        <select v-model="comic">
          <option v-for="comic in comicList" v-bind:key="comic.id" v-bind:value="comic">
            {{comic.name}}
          </option>
        </select>
      </div>

      <span v-if="comic" style="width: 100%;">

        <div class="horizontal-flex horiz-space-items-8px">
          <div class="vertical-flex">
            <p>Artist</p>
            <select v-model="artist">
              <option v-for="artist in artistList" v-bind:key="artist.name" v-bind:value="artist.name">
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

      <i class="fas fa-sort-up arrow-symbol" @click="closeComponent"></i>
    </span>

    <span v-else>
      <i class="fas fa-sort-down arrow-symbol"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'correctComic',
  props: {
    artistList: Array,
    comicList: Array,
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
    submitChanges () {
      // todo finne artistId for vi har alle i artistList
      let artistId
      for (var artist of this.artistList) {
        if (artist.name === this.artist) {
          artistId = artist.id
          break
        }
      }

      let finished = this.finished==='true' ? 1 : 0

      let mockQueryElns = [this.comic.id, artistId, this.tag, this.cat, finished]
      // todo request

      let response = {success: false, message: 'Somethign went wrong'}

      if (response.success) {
        this.successMessage = 'Successfully updated info of ' + this.comic.name
        this.errorMessage = ''
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
      console.log(this.comic.name, this.comic.artist)
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
$linkColor: #009fff;
$themeRed: #ec2f4b;

.horiz-space-items-8px {
  &>div {
    margin: 0px 8px;
  }
}

</style>
