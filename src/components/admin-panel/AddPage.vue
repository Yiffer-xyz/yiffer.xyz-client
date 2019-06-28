<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Add pages to comic</h2>
    <span class="admin-content-box-inner" v-if="isOpen">
      <p>
        Files must be either .jpg or .png. File name does not matter, except for ordering.<br/>
        If adding multiple pages, it is <i>very important</i> that they are named in some 
        ascending order.<br/>
        Example:
        <span class="courier">[01.jpg, 02.jpg, ...]</span>, or 
        <span class="courier">[a.jpg, b.jpg, ...]</span>. Note that
        <span class="courier">[1.jpg, 2.jpg, ...]</span> will not work for more than 9 pages!
      </p>

      <div class="horizontal-flex" style="align-items: center; margin-bottom: 12px;">
        <p style="margin-right: 8px; font-weight: 400;">Comic:</p>
        <select v-model="comic" style="margin-bottom: 0">
          <option v-for="comic in comicList" :key="comic.id" :value="comic">
            {{comic.name}} {{comic.finished ? '(Finished!)' : ''}}
          </option>
        </select>
        <router-link :to="{name: 'comic', params: {'comicName': comic.name}}" 
                     v-if="comic" style="margin-left: 8px;" target="_blank" class="underline-link">
          Go to comic <right-arrow/>
        </router-link>
      </div>
      
      <form enctype="multipart/form-data" novalidate>
        <div class="pretty-input-upload">
          <input type="file" multiple="true" @change="processFileUploadChange" id="newPageFiles" accept="image/x-png,image/jpeg" class="input-file"/>
          <p>Select files</p>
        </div>
      </form>

      <p v-if="filesAreInput" style="margin-bottom: 0px;"><b>{{selectedFiles.length}}</b> Selected files:</p>
      <p v-if="filesAreInput" class="courier">{{selectedFileNames.join(', ')}}</p>

      <button @click="uploadFiles()" v-if="filesAreInput && comic" class="y-button">Upload files{{ comic.finished ? ' (NOTE: this comic is marked as finished!)' : ''}}</button>

      <p class="success-message" v-if="uploadPercent">Uploading ({{uploadPercent}}%)</p>
      <p class="error-message" v-if="uploadErrorMessage">{{uploadErrorMessage}}</p>
      <p class="success-message" v-if="uploadSuccessMessage">{{uploadSuccessMessage}}</p>

      <button class="y-button y-button-neutral" @click="toggleAllUnfinishedComics()" style="margin-top:16px;"
         v-if="!showAllUnfinishedComics"> Show all unfinished comics, with most recent page (super useful!) <down-arrow/></button>
      <button class="y-button y-button-neutral" @click="toggleAllUnfinishedComics()" style="margin-top:16px;"
         v-if="showAllUnfinishedComics"> Hide this list <up-arrow/></button>

      <div v-if="showAllUnfinishedComics" class="vertical-flex;">
        <table class="y-table">
          <thead>
            <tr>
              <th>Comic name</th>
              <th>Pages</th>
              <th>Days since<br/>update</th>
              <th>Last page</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comic in unfinishedComicList" :key="comic.id">
              <td>
                <router-link :comic="comic" :to="{ name: 'comic', params: { comicName: `${comic.name }` } }"
                             target="_blank" class="underline-link">
                  {{comic.name}}
                </router-link>
              </td>
              <td>{{comic.numberOfPages}}</td>
              <td>{{comic.daysSinceUpdate}}</td>
              <td>
                <span v-if="!comic.lastPageUrl" class="link-color cursor-pointer" @click="showLastPage(comic)">Load image</span>
                <a v-if="comic.lastPageUrl" :href="comic.lastPageUrl" target="_blank">
                  <img :src="comic.lastPageUrl" style="max-width: 250px;"/>
                </a>
                <br>
                <span v-if="comic.lastPageUrl" class="link-color cursor-pointer" @click="unshowLastPage(comic)">Hide image</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <menu-up-icon @click.native="closeComponent" class="mdi-arrow close-component-arrow"/>
    </span>

    <span v-else>
      <menu-down-icon class="mdi-arrow"/>
    </span>
  </div>
</template>

<script>
import DownArrow from 'vue-material-design-icons/ArrowDown.vue'
import UpArrow from 'vue-material-design-icons/ArrowUp.vue'
import RightArrow from 'vue-material-design-icons/ArrowRight.vue'

import comicApi from '../../api/comicApi'

export default {
  name: 'addPage',

	components: {
		'down-arrow': DownArrow,
		'up-arrow': UpArrow,
		'right-arrow': RightArrow,
	},

	props: {
		comicList: Array
	},

  data: function () {
    return {
      isOpen: false,
			comic: undefined,
			uploadPercent: undefined,
      uploadErrorMessage: '',
      uploadSuccessMessage: '',
      selectedFiles: [],
      showAllUnfinishedComics: false,
    }
  },

  methods: {
    processFileUploadChange (changeEvent) {
      this.selectedFiles = [...changeEvent.target.files]
    },

    async uploadFiles () {
      let response = await comicApi.addPagesToComic(this.comic, this.selectedFiles, this.updateUploadProgress)

      if (response.success) {
        this.uploadSuccessMessage = 'Success updating ' + this.comic.name
        this.uploadErrorMessage = ''
        this.selectedFiles = []
        document.getElementById('newPageFiles').value = ''
        this.$emit('refresh-comic-list')
      }
      else {
        this.uploadErrorMessage = 'Error updating: ' + response.message
        this.uploadSuccessMessage = ''
      }
		},
		
		updateUploadProgress (progressEvent) {
			this.uploadPercent = Math.round((progressEvent.loaded/progressEvent.total)*100)
		},

    toggleAllUnfinishedComics () {
      this.showAllUnfinishedComics = !this.showAllUnfinishedComics
    },

    showLastPage (comic) {
      comic.lastPageUrl = `/comics/${comic.name}/${this.formattedPageNumber(comic.numberOfPages)}.jpg`
      comic.name = ' ' + comic.name + ' '
    },

    unshowLastPage (comic) {
      comic.lastPageUrl = undefined
      comic.name = comic.name.substring(1, comic.name.length-1)
    },

    formattedPageNumber (pageNumber) {
      return pageNumber<100 ? (pageNumber<10 ? '00'+pageNumber : '0'+pageNumber) : pageNumber
    },  

    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) },
  },

  computed: {
    filesAreInput () { return this.selectedFiles.length > 0 },

    selectedFileNames () { return this.selectedFiles.map( file => file.name ) },

    unfinishedComicList () {
      return this.comicList
        .filter(comic => !comic.finished)
        .sort((c1, c2) => c1.updated < c2.updated ? 1 : -1)
        .map(comic => {
          comic.daysSinceUpdate = Math.floor((nowTimestamp - (new Date(comic.updated)).getTime()) / 86400000)
          return comic
        })
    }
  },
}

let nowTimestamp = (new Date()).getTime()
</script>