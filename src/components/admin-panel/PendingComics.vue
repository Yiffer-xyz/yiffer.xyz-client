<template>
  <div class="admin-content-box" @click="openComponent" v-bind:class="{'admin-content-box-open': isOpen}">
    <h2>Pending comics</h2>
    <span class="admin-content-box-inner" v-if="isOpen">

      <table class="y-table">
        <thead>
          <tr>
            <th>Comic name</th>
            <th>Artist</th>
            <th>Category</th>
            <th>Class.</th>
            <th>Finished</th>
            <th>Mod name</th>
            <th v-if="$store.state.userType === 'admin'">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="suggestion in comicList" :key="suggestion.Id">
            <td><router-link :to="{ name: 'pendingComic', params: { comicName: `${suggestion.Name }` } }" target="_blank">
              {{suggestion.Name}}
            </router-link></td>
            <td><router-link :to="{ name: 'artist', params: { artistName: `${suggestion.ArtistName }` } }" target="_blank">
              {{suggestion.ArtistName}}
            </router-link></td>
            <td>{{suggestion.Tag}}</td>
            <td>{{suggestion.Cat}}</td>
            <td>{{suggestion.Finished ? 'Yes' : 'No'}}</td>
            <td>{{suggestion.ModName}}</td>
            <td v-if="$store.state.userType === 'admin'">
              <button @click="approveComic(suggestion.Id)" class="y-button" style="margin-bottom: 2px;">Approve</button>
              <button @click="rejectComic(suggestion.Id)" class="y-button y-button-red" style="margin-bottom: 0;">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>


      <i class="fas fa-sort-up arrow-symbol" @click="closeComponent" style="margin-top: 16px;"></i>
    </span>

    <span v-else>
      <i class="fas fa-sort-down arrow-symbol"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'pendingComics',
  props: {
    comicList: Array,
  },
  data: function () {
    return {
      isOpen: false,
    }
  },
  methods: {
    approveComic (comicId) {
      let response = {success: true, message: 'umm'}
      if (response.success) {
        this.comicList = this.comicList.filter(comic => comic.id != comicId)
      }
    },
    openComponent () { if (!this.isOpen) { this.isOpen = true } },
    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },
  created: function () {
    this.comicList = this.comicList.filter(suggestion => !suggestion.Processed)
  }
}
</script>

<style lang="scss">
$linkColor: #009fff;
$themeRed: #ec2f4b;

.y-table {
  border-collapse: collapse;
  td, th {
    border: 1px solid #aaa;
    padding: 2px 4px;
  }
  th {
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
  }
}
</style>
