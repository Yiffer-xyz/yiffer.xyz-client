<template>
  <div class="admin-content-box" @click="openComponent" v-bind:class="{'admin-content-box-open': isOpen}">
    <h2>Add or modify artist</h2>
    <span class="admin-content-box-inner" v-if="isOpen">

			<p>Add a new artist by name. Then, add urls for any relevant website, such as FurAffinity,
         Twitter, SoFurry, Pixiv, or any custom website. Also, add
         <span class="courier">https://e621.net/post?tags=<i>ARTISTNAME</i>+order%3Ascore</span> if you
         can find the artist on e621.</p>

      <p class="add-kw-mini-header no-margin-bot">Add new artist</p>
      <div class="horizontal-flex" style="align-items: center;">
        <p style="margin-right: 8px;">Artist name:</p>
        <input type="text" v-model="artistName"/>
        <button @click="addNewArtist()" class="y-button" style="margin: 0 0 0 8px;">Add artist</button>
      </div>


      <p class="error-message" v-if="errorNewArtistMessage" style="margin-top: 8px;">{{errorNewArtistMessage}}</p>
      <p class="success-message" v-if="successNewArtistMessage" style="margin-top: 8px;">{{successNewArtistMessage}}</p>


      <p class="add-kw-mini-header no-margin-bot" style="margin-top: 32px;">Add artist links</p>
      <div class="horizontal-flex" style="align-items: center;">
        <p style="margin-right: 8px;">Artist:</p>
        <select v-model="artist" class="no-margin-bot">
          <option v-for="artist in artistList" :key="artist.id" :value="artist">
            {{artist.name}}
          </option>
        </select>
      </div>

			<div class="horizontal-flex" style="align-items: center; margin-top: 8px;" v-if="artist">
				<p style="margin-right: 8px;">Links</p>
				<div class="vertical-flex">
					<input type="text" v-for="i in 6" :key=i :v-model="'link'+i" style="margin-bottom: 2px; width: 320px;"/>
				</div>
			</div>
			<button @click="addArtistLinks()" class="y-button" style="margin-top: 8px;">Add links</button>

      <p class="error-message" v-if="errorLinksMessage" style="margin-top: 8px;">{{errorLinksMessage}}</p>
      <p class="success-message" v-if="successLinksMessage" style="margin-top: 8px;">{{successLinksMessage}}</p>

      <i class="fas fa-sort-up arrow-symbol" @click="closeComponent" style="margin-top: 16px;"></i>
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
			link1: undefined,
			link2: undefined,
			link3: undefined,
			link4: undefined,
			link5: undefined,
			link6: undefined,

      errorNewArtistMessage: '',
			successNewArtistMessage: '',
			errorLinksMessage: '',
			successLinksMessage: '',
    }
  },
  methods: {
    addNewArtist () {
			let response = {success: true, message: 123123}

			if (response.success) {
				this.successNewArtistMessage = 'Success adding artist ' + this.artistName
				this.errorNewArtistMessage = ''
				this.artistList.push({name: this.artistName, id: response.message})
				this.artistName = ''
			}
			else {
				this.errorNewArtistMessage = 'Error adding artist: ' + response.message
				this.successNewArtistMessage = ''
			}
		},
		addArtistLinks () {
			let newLinks = [this.link1, this.link2, this.link3, this.link4, this.link5, this.link6].filter(l => l)
			let artistId = this.artist.id

			// todo
			let response = {success: true, message: 'some wrong thing'}

			if (response.success) {
				this.successLinksMessage = 'Success adding links to ' + this.artist.name
				this.errorLinksMessage = ''
				this.link1 = this.link2 = this.link3 = this.link4 = this.link5 = this.link6 = ''
			}
			else {
				this.errorLinksMessage = 'Error adding links: ' + response.message
				this.successLinksMessage = ''
			}
		},
    openComponent () { if (!this.isOpen) { this.isOpen = true } },
    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },
}
</script>

<style lang="scss">
$linkColor: #009fff;
$themeRed: #ec2f4b;
</style>
