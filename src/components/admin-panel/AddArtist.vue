<template>
  <div class="admin-content-box" @click="openComponent" v-bind:class="{'admin-content-box-open': isOpen}">
    <h2>Add or modify artist</h2>
    <span class="admin-content-box-inner" v-if="isOpen">

      <p class="add-kw-mini-header no-margin-bot">Add new artist</p>
      <div class="horizontal-flex" style="align-items: center;">
        <p style="margin-right: 8px;">Artist name:</p>
        <input type="text" v-model="artistName"/>
        <button @click="addNewArtist()" class="y-button" style="margin: 0 0 0 8px;">Add artist</button>
      </div>


      <p class="add-kw-mini-header no-margin-bot" style="margin-top: 16px;">Add artist links</p>
      <div class="horizontal-flex" style="align-items: center;">
        <p style="margin-right: 8px;">Artist:</p>
        <select v-model="artist" class="no-margin-bot">
          <option v-for="artist in artistList" :key="artist.id" :value="artist">
            {{artist.name}}
          </option>
        </select>
      </div>

      <p class="error-message" v-if="errorMessage" style="margin-top: 8px;">{{errorMessage}}</p>
      <p class="success-message" v-if="successMessage" style="margin-top: 8px;">{{successMessage}}</p>

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

      errorMessage: '',
      successMessage: '',
    }
  },
  methods: {
    addNewArtist () {

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
