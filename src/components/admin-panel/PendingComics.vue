<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2>Pending comics</h2>
    <span class="admin-content-box-inner" v-if="isOpen">

      <span v-if="pendingComicList.length > 0">
        <table class="y-table">
          <thead>
            <tr>
              <th>Comic name</th>
              <th>Artist</th>
              <th>Category</th>
              <th>Class.</th>
              <th>Finished</th>
              <th>Mod name</th>
              <th v-if="$store.getters.userData.userType === 'admin'">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="suggestion in pendingComicList" :key="suggestion.Id">
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
              <td v-if="$store.getters.userData.userType === 'admin'">
                <button @click="processComic(suggestion.Id, true)" class="y-button" style="margin-bottom: 2px;">Approve</button>
                <button @click="processComic(suggestion.Id, false)" class="y-button y-button-red" style="margin-bottom: 0;">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </span>

      <span v-else>
        <p>There are no pending comics.</p>
      </span>

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
  name: 'pendingComics',

  data: function () {
    return {
      isOpen: false,
    }
  },

  methods: {
    processComic (comicId, isApproved) {
      let response = comicApi.processPendingComic(comicId, isApproved)
      
      if (response.success) {
        this.$emit('refresh-pending-comics')
        if (isApproved) {
          this.$emit('refresh-comic-list')
        }
      }
    },

    openComponent () { if (!this.isOpen) { this.isOpen = true } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },

  computed: {
    pendingComicList () {
      return this.$store.getters.comicList.filter(suggestion => !suggestion.Processed)
    }
  }
}
</script>

<style lang="scss">
.y-table {
  border-collapse: collapse;
  td, th {
    border: 1px solid #aaa; //todo
    padding: 2px 4px;
  }
  th {
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
  }
}
</style>
