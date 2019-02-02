<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2>Pending comics
      <span v-if="comicsMissingKeywords>0" class="red-color"> ({{comicsMissingKeywords}})</span>
      <span v-else style="color: #999;">(0)</span>
      
      <span v-if="comicsMissingThumbnails>0" class="red-color"> ({{comicsMissingThumbnails}})</span>
      <span v-else style="color: #999;">(0)</span>
    </h2>
    <span class="admin-content-box-inner" v-if="isOpen">

      <span v-if="pendingComicList.length > 0">
        <p>You can add keywords or a thumbnail by <u>clicking the comic title</u>. <br/>
        Comics are approved by admins.<br/>
        The <span class="red-color">numbers</span> in the title are equal to the amount of pending comics missing tags and thumbnails.</p>

        <table class="y-table" style="margin: 8px auto 0 auto">
          <thead>
            <tr>
              <th>Comic name</th>
              <th>Artist</th>
              <th>Category</th>
              <th>Class.</th>
              <th>Finished</th>
              <th>Tags</th>
              <th>Thumbnail</th>
              <th>Mod name</th>
              <th v-if="$store.getters.userData.userType === 'admin'">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="suggestion in pendingComicList" :key="suggestion.Id">
              <td><router-link :to="{ name: 'pendingComic', params: {comicName: suggestion.name} }" target="_blank">
                {{suggestion.name}}
              </router-link></td>
              <td><router-link :to="{ name: 'artist', params: {artistName: suggestion.artist} }" target="_blank">
                {{suggestion.artist}}
              </router-link></td>
              <td>{{suggestion.tag}}</td>
              <td>{{suggestion.cat}}</td>
              <td>{{suggestion.finished ? 'Yes' : 'No'}}</td>
              <td v-if="suggestion.keywords.length>0"><checkbox-icon/></td> <td v-else>-</td>
              <td v-if="suggestion.hasThumbnail"><checkbox-icon/></td> <td v-else>-</td>
              <td>{{suggestion.modName}}</td>
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
import CheckboxIcon from 'vue-material-design-icons/CheckboxMarkedCircle.vue'

import comicApi from '../../api/comicApi'

export default {
  name: 'pendingComics',

	components: {
		'checkbox-icon': CheckboxIcon,
	},

  data: function () {
    return {
      isOpen: false,
      pendingComicList: [],
      comicsMissingKeywords: 0,
      comicsMissingThumbnails: 0
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

  async created () {
    this.pendingComicList = await comicApi.getPendingComics()
    for (var comic of this.pendingComicList) {
      if (comic.keywords.length == 0) { this.comicsMissingKeywords++ }
      if (!comic.hasThumbnail) { this.comicsMissingThumbnails++ }
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
