<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2>Add artist</h2>
    <span class="admin-content-box-inner" v-if="isOpen">
      <p class="add-kw-mini-header no-margin-bot">Add new artist</p>
      <div class="horizontal-flex" style="align-items: center;">
        <p style="margin-right: 8px;">Artist name:</p>
        <input type="text" v-model="artistName"/>
        <button @click="addNewArtist()" class="y-button" style="margin: 0 0 0 8px;">Add artist</button>
      </div>

      <p class="error-message" v-if="newArtistErrorMessage" style="margin-top: 8px;">{{newArtistErrorMessage}}</p>
      <p class="success-message" v-if="newArtistSuccessMessage" style="margin-top: 8px;">{{newArtistSuccessMessage}}</p>

      <h2 style="margin-top: 32px;">Add artist links</h2>
      <p>Any art website such as FurAffinity, Twitter, Pixiv, Weasyl, Furry Network,<br/>
        Artist's own website,
        <br/>e621.net with order:score, so for example <span class="courier">https://e621.net/post/index/1/Braeburned%20order:score</span></p>

      <div class="horizontal-flex" style="align-items: center; margin-bottom: 8px;">

        <p style="margin-right: 8px;">Artist:</p>
        <select v-model="artist" class="no-margin-bot">
          <option v-for="artist in artistList" :key="artist.id" :value="artist">
            {{artist.name}}
          </option>
        </select>
      </div>

      <span v-if="artist">
        <input type="text" v-model="link1" class="artist-link-input"/>
        <input type="text" v-model="link2" class="artist-link-input"/>
        <input type="text" v-model="link3" class="artist-link-input"/>
        <input type="text" v-model="link4" class="artist-link-input"/>
        <input type="text" v-model="link5" class="artist-link-input"/>
        <input type="text" v-model="link6" class="artist-link-input"/>
        <br/>
        
        <button @click="addArtistLinks()" class="y-button" style="margin-top: 8px;">Add links</button>
      </span>

      <p class="error-message" v-if="linksErrorMessage" style="margin-top: 8px;">{{linksErrorMessage}}</p>
      <p class="success-message" v-if="linksSuccessMessage" style="margin-top: 8px;">{{linksSuccessMessage}}</p>


      <i class="fas fa-sort-up arrow-symbol" @click="closeComponent"></i>
    </span>

    <span v-else>
      <i class="fas fa-sort-down arrow-symbol"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'addArtist',
  props: {
    artistList: Array,
  },
  data: function () {
    return {
      isOpen: false,
      artist: undefined,
			artistName: '',
      newArtistErrorMessage: '',
      newArtistSuccessMessage: '',
      linksErrorMessage: '',
      linksSuccessMessage: '',

      link1: '',
      link2: '',
      link3: '',
      link4: '',
      link5: '',
      link6: '',
    }
  },
  methods: {
    addNewArtist () {
      let name = this.artistName[0].toUpperCase() + this.artistName.substring(1)
      let response = {success: true, message: 'Artist already exists!', results: {artistId: 160}}

      if (response.success) {
        this.artistList.push({name: this.artistName, id: response.results.artistId})
        this.newArtistSuccessMessage = 'Success adding artist ' + this.artistName
        this.newArtistErrorMessage = ''
        this.artistName = ''
        this.$emit('refresh-artist-list')
      }
      else {
        this.newArtistErrorMessage = 'Error adding artist: ' + response.message
        this.newArtistSuccessMessage = ''
      }
    },
    addArtistLinks () {
      let newLinks = [this.link1, this.link2, this.link3, this.link4, this.link5, this.link6].filter(x => x)
      let response = {success: true, message: 'invalid link url'}

      if (response.success) {
        this.linksSuccessMessage = `Success adding ${newLinks.length} links to artist ${this.artist.name}`
        this.linksErrorMessage = ''
        this.link1 = this.link2 = this.link3 = this.link4 = this.link5 = this.link6 = ''
      }
      else {
        this.linksErrorMessage = 'Error adding links: ' + response.message
        this.linksSuccessMessage = ''
      }
    },

    openComponent () { if (!this.isOpen) { this.isOpen = true } },
    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },
}
</script>

<style lang="scss">
	.artist-link-input {
		margin-top: 2px;
		width: 350px;
	}
</style>
