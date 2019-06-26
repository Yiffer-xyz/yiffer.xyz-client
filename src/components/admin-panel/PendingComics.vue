<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Pending comics
      <span style="margin-right: 3px;">
        <span v-if="pendingComicList.length>0" class="red-color">({{pendingComicList.length}})</span>
        <span v-else style="color: #999;">(0)</span>
      </span>
      <span style="margin-right: 3px;">
        <span v-if="comicsMissingKeywords>0"> ({{comicsMissingKeywords}})</span>
        <span v-else style="color: #999;">(0)</span>
      </span>
      <span>
        <span v-if="comicsMissingThumbnails>0"> ({{comicsMissingThumbnails}})</span>
        <span v-else style="color: #999;">(0)</span>
      </span>
    </h2>
    <span class="admin-content-box-inner" v-if="isOpen">

      <span v-if="pendingComicList.length > 0">
        <p>You can add keywords, a thumbnail, or more pages by <u>clicking the comic title</u>. <br/>
        Comics are approved by admins.<br/>
        The <span class="red-color">numbers</span> in the header mean (1) amount of pending comics, (2) how many are missing tags, and (3) how many are missing a thumbnail.</p>

        <table class="y-table" style="margin: 8px auto 0 auto">
          <thead>
            <tr>
              <th>Comic name</th>
              <th>Artist</th>
              <th>Category</th>
              <th>Class.</th>
              <th>Pages</th>
              <th>Finished</th>
              <th>Tags</th>
              <th>Thumbnail</th>
              <th>Mod name</th>
              <th v-if="$store.getters.userData.userType === 'admin'">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pendingComic in pendingComicList" :key="pendingComic.id">
              <td><router-link :to="{ name: 'pendingComic', params: {comicName: pendingComic.name} }" target="_blank">
                {{pendingComic.name}}
              </router-link></td>
              <td><router-link :to="{ name: 'artist', params: {artistName: pendingComic.artist} }" target="_blank">
                {{pendingComic.artist}}
              </router-link></td>
              <td>{{pendingComic.tag}}</td>
              <td>{{pendingComic.cat}}</td>
              <td>{{pendingComic.numberOfPages}}</td>
              <td>{{pendingComic.finished ? 'Yes' : 'No'}}</td>
              <td v-if="pendingComic.keywords.length>0"><checkbox-icon/></td> <td v-else>-</td>
              <td v-if="pendingComic.hasThumbnail"><checkbox-icon/></td> <td v-else>-</td>
              <td>{{pendingComic.modName}}</td>
              <td v-if="$store.getters.userData.userType === 'admin'">
                <button @click="processComic(pendingComic.id, true, pendingComic.name)" class="y-button">Approve</button>
                <button @click="processComic(pendingComic.id, false, pendingComic.name)" class="y-button y-button-red">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>

				<p class="error-message" v-if="errorMessage" style="margin-top: 8px;">{{errorMessage}}</p>
				<p class="success-message" v-if="successMessage" style="margin-top: 8px;">{{successMessage}}</p>
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
			comicsMissingThumbnails: 0,
			errorMessage: '',
			successMessage: '',
    }
  },

  methods: {
    async processComic (comicId, isApproved, comicName) {
			this.errorMessage = ''
			this.successMessage = ''
			let response = await comicApi.processPendingComic(comicId, isApproved)
      
      if (response.success) {
				this.successMessage = `Success ${isApproved ? 'approving' : 'rejecting'} ${comicName}`
				this.getPendingComicList()
        if (isApproved) {
					this.$store.dispatch('loadComicList')
				}
			}
			else {
				this.errorMessage = response.message
			}
		},
		
		async getPendingComicList () {
			this.pendingComicList = await comicApi.getPendingComics()
			for (var comic of this.pendingComicList) {
				if (comic.keywords.length == 0) { this.comicsMissingKeywords++ }
				if (!comic.hasThumbnail) { this.comicsMissingThumbnails++ }
			}
		},

    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },

  async created () {
		this.getPendingComicList()
  }
}
</script>