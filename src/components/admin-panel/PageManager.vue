<template>
  <div class="admin-content-box admin-content-box-grow" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Insert / remove / swap pages / thumbnail</h2>

    <span class="admin-content-box-inner" v-if="isOpen">
      <div class="horizontal-flex" style="margin-top: 8px;">
        <p class="admin-mini-header" style="margin-right: 8px;">Comic:</p>
        <select v-model="comic" @change="comicChanged">
          <option v-for="comic in comicList" :key="comic.id" :value="comic">
            {{comic.name}}
          </option>
        </select>
        <router-link :to="{name: 'comic', params: {'comicName': comic.name}}" v-if="comic"
                     style="margin-left: 8px;" target="_blank" class="underline-link">
          Go to comic <right-arrow/>
        </router-link>
      </div>

      <div v-if="comic" class="horizontal-flex" style="margin-top: 8px;">
        <p class="admin-mini-header" style="margin-right: 8px;">Start page viewing range:</p>
        <select v-model="startPageViewing">
          <option v-for="pageNumber in comic.numberOfPages" :key="pageNumber" :value="pageNumber">
            &nbsp;&nbsp;{{pageNumber}}&nbsp;&nbsp;&nbsp;
          </option>
        </select>
      </div>

      <div v-if="comic" class="horizontal-flex" style="height: 386px">
        <div v-for="i in pagesToShow" :key="i" class="vertical-flex" style="margin: 4px;">
          <p>Page {{i}}</p>
          <a :href="`/comics/${comic.name}/${formattedPageNumber(i)}.jpg?${generateRandomQueryString()}`" target="_blank">
            <img :src="`/comics/${comic.name}/${formattedPageNumber(i)}.jpg?${generateRandomQueryString()}`" 
              class="page-manager-image"/>
          </a>
        </div>
      </div>

      <span v-if="comic" class="admin-content-box-inner">
        <h2 style="margin-top: 32px;">Swap pages</h2>
        <p>Swap the positions of two existing pages</p>
        <div class="horizontal-flex">
          <p>Swap page ...</p>
          <select v-model="swapPage1" style="margin: 0 8px;">
            <option v-for="pageNumber in comic.numberOfPages" :key="pageNumber" :value="pageNumber">
              &nbsp;&nbsp;{{pageNumber}}&nbsp;&nbsp;&nbsp;
            </option>
          </select>
          <p>with page...</p>
          <select v-model="swapPage2" style="margin: 0 8px;">
            <option v-for="pageNumber in comic.numberOfPages" :key="pageNumber" :value="pageNumber">
              &nbsp;&nbsp;{{pageNumber}}&nbsp;&nbsp;&nbsp;
            </option>
          </select>
        </div>
        <button @click="swapPages" class="y-button margin-top-8" v-if="swapPage1 && swapPage2 && swapPage1!=swapPage2">
          Swap
        </button>

        <p class="error-message" v-if="errorMessageSwap" style="margin-top: 8px;">{{errorMessageSwap}}</p>
        <p class="success-message" v-if="successMessageSwap" style="margin-top: 8px;">{{successMessageSwap}}</p>


        <h2 style="margin-top: 32px;">Insert page</h2>
        <p>Insert a page in between two other pages. <u>Don't</u> use this for adding a page to the end of a comic. 
          For that, go to <i>Add pages to comic</i></p>
        <div class="horizontal-flex">
          <p>Insert an image after page ...</p>
          <select v-model="insertPageAfterNumber" style="margin: 0 8px;">
            <option v-for="pageNumber in comic.numberOfPages" :key="pageNumber" :value="pageNumber">
              &nbsp;&nbsp;{{pageNumber}}&nbsp;&nbsp;&nbsp;
            </option>
          </select>
          <p v-if="insertPageAfterNumber">, and before page {{insertPageAfterNumber+1}}</p>
        </div>

        <span v-if="insertPageAfterNumber" style="display: flex; align-items: center; flex-direction: column;">
          <form enctype="multipart/form-data" novalidate class="margin-top-16 no-margin-bot" style="width: fit-content">
            <div class="pretty-input-upload">
              <input type="file" @change="processFileUploadChange" accept="image/x-png,image/jpeg" class="input-file"/>
              <p>Select file</p>
            </div>
          </form>
          <p v-if="imageToInsert">Selected file: <span class="courier">{{imageToInsert.name}}</span></p>

          <button @click="insertPage" v-if="imageToInsert" class="y-button margin-top-8">Insert {{imageToInsert.name}}</button>

          <p class="success-message" v-if="uploadPercent">Uploading ({{uploadPercent}}%)</p>
        </span>

        <p class="error-message" v-if="errorMessageInsert" style="margin-top: 8px;">{{errorMessageInsert}}</p>
        <p class="success-message" v-if="successMessageInsert" style="margin-top: 8px;">{{successMessageInsert}}</p>



        <h2 style="margin-top: 32px;">Delete page</h2>
        <p>Delete an existing page, in case of duplicate pages (or for some other reason)</p>
        <div class="horizontal-flex">
          <p>Delete page number...</p>
          <select v-model="deletePageNumber" style="margin: 0 8px;">
            <option v-for="pageNumber in comic.numberOfPages" :key="pageNumber" :value="pageNumber">
              &nbsp;&nbsp;{{pageNumber}}&nbsp;&nbsp;&nbsp;
            </option>
          </select>
        </div>
        <button @click="deletePage" class="y-button margin-top-8" v-if="deletePageNumber">
          Delete page {{deletePageNumber}}
        </button>

        <p class="error-message" v-if="errorMessageDelete" style="margin-top: 8px;">{{errorMessageDelete}}</p>
        <p class="success-message" v-if="successMessageDelete" style="margin-top: 8px;">{{successMessageDelete}}</p>


        <h2 style="margin-top: 32px;">Replace thumbnail</h2>
        <form enctype="multipart/form-data" novalidate class="no-margin-bot" style="width: fit-content">
          <div class="pretty-input-upload">
            <input type="file" @change="processThumbnailUploadChange" accept="image/x-png,image/jpeg" class="input-file"/>
            <p>Select file</p>
          </div>
        </form>
        <p v-if="thumbnailImageFile">Selected file: <span class="courier">{{thumbnailImageFile.name}}</span></p>

        <button @click="replaceThumbnail" v-if="thumbnailImageFile && !thumbnailImageWrongFormat" 
                class="y-button">Insert {{thumbnailImageFile.name}}</button>
        <p class="error-message" v-if="errorMessageThumbnail">{{errorMessageThumbnail}}</p>
        <p class="success-message margin-top-16" v-if="successMessageThumbnail">{{successMessageThumbnail}}</p>
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
import RightArrow from 'vue-material-design-icons/ArrowRight.vue'

import comicApi from '../../api/comicApi'

export default {
  name: 'pageManager',

	components: {
		'checkbox-icon': CheckboxIcon,
		'right-arrow': RightArrow,
	},

	props: {
		comicList: Array
	},

  data: function () {
    return {
      isOpen: false,
      comic: undefined,
      startPageViewing: 1,
      swapPage1: undefined,
      swapPage2: undefined,
      insertPageAfterNumber: undefined,
      imageToInsert: undefined,
      uploadPercent: undefined,
      deletePageNumber: undefined,
      comicChangeDate: undefined,
      thumbnailImageFile: undefined,
      thumbnailImageWrongFormat: false,

      errorMessageSwap: '',
      successMessageSwap: '',
      errorMessageInsert: '',
      successMessageInsert: '',
      errorMessageDelete: '',
      successMessageDelete: '',
      errorMessageThumbnail: '',
      successMessageThumbnail: '',
    }
  },

  methods: {
    async swapPages () {
      this.errorMessageSwap = ''
      this.successMessageSwap = ''
      let response = await comicApi.swapComicPages(this.comic.name, this.comic.id, this.swapPage1, this.swapPage2)

      if (response.success) {
        this.successMessageSwap = `Successfully swapped pages ${this.swapPage1} and ${this.swapPage2}`
        this.$store.dispatch('updateOneComicInList', this.comic)
      }
      else {
        this.errorMessageSwap = 'Error swapping pages: ' + response.message
      }
    },

    async insertPage () {
      this.errorMessageInsert = ''
      this.successMessageInsert = ''
      let response = await comicApi.insertComicPage(this.comic.name, this.comic.id, this.imageToInsert,
        this.insertPageAfterNumber, this.updateUploadProgress)

      this.uploadPercent = undefined
      if (response.success) {
        this.successMessageInsert = 'Successfully inserted new page ' + (Number(this.insertPageAfterNumber)+1)
        this.$store.dispatch('updateOneComicInList', this.comic)
        this.imageToInsert = undefined
      }
      else {
        this.errorMessageInsert = 'Error inserting page: ' + response.message
      }
    },

    async deletePage () {
      this.errorMessageDelete = ''
      this.successMessageDelete = ''
      let response = await comicApi.deleteComicPage(this.comic.name, this.comic.id, this.deletePageNumber)

      if (response.success) {
        this.successMessageDelete = `Successfully deleted page ${this.deletePageNumber}`
        this.$store.dispatch('updateOneComicInList', this.comic)
      }
      else {
        this.errorMessageDelete = 'Error deleting page: ' + response.message
      }
    },

    async replaceThumbnail () {
      this.errorMessageThumbnail = ''
      this.successMessageThumbnail = ''
      let response = await comicApi.replaceThumbnailImage(this.comic.name, this.comic.id, this.thumbnailImageFile)
      
      if (response.success) {
        this.successMessageThumbnail = 'Successfully replaced thumbnail!'
        this.thumbnailImageFile = undefined
      }
      else {
        this.errorMessageThumbnail = 'Error replacing thumbnail: ' + response.message
      }
    },

		updateUploadProgress (progressEvent) {
			this.uploadPercent = Math.round((progressEvent.loaded/progressEvent.total)*100)
		},

    async comicChanged () {
      this.resetAllInputsAndMessages()
    },

    processFileUploadChange (changeEvent) {
      this.imageToInsert = changeEvent.target.files[0]
    },

    processThumbnailUploadChange (changeEvent) {
      this.thumbnailImageFile = changeEvent.target.files[0]
      this.processNewThumbnail()
    },

		async processNewThumbnail () {
			this.errorMessageThumbnail = ''
			let fileReader = new FileReader()
			fileReader.onload = () => {
				let tempImage = new Image()
				tempImage.src = fileReader.result
				tempImage.onload = () => {
					if (tempImage.width !== 200 || tempImage.height !== 283) {
            this.thumbnailImageWrongFormat = true
						this.errorMessageThumbnail = `Sorry, the image does not match the 200x283 pixel requirement (is ${tempImage.width}x${tempImage.height}).`
          }
          else {
            this.thumbnailImageWrongFormat = false
          }
				}
			}
			fileReader.readAsDataURL(this.thumbnailImageFile)
		},

    resetAllInputsAndMessages () {
      this.startPageViewing = 1
      this.swapPage1 = undefined
      this.swapPage2 = undefined
      this.insertPageAfterNumber = undefined
      this.imageToInsert = undefined
      this.deletePageNumber = undefined
      this.comicChangeDate = undefined
      this.thumbnailImageFile = undefined

      this.errorMessageSwap = ''
      this.successMessageSwap = ''
      this.errorMessageInsert = ''
      this.successMessageInsert = ''
      this.errorMessageDelete = ''
      this.successMessageDelete = ''
      this.errorMessageThumbnail = ''
      this.successMessageThumbnail = ''
    },

    generateRandomQueryString () {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopq';
      const charactersLength = characters.length
      let queryString = ''
      for (var i=0; i<4; i++) {
        queryString += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return queryString
    },

    formattedPageNumber (pageNumber) {
      return pageNumber<100 ? (pageNumber<10 ? '00'+pageNumber : '0'+pageNumber) : pageNumber
    },   

    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },

  computed: {
    pagesToShow () {
      return this.comic ? [this.startPageViewing, this.startPageViewing+1, this.startPageViewing+2]
        .slice(0, this.comic.numberOfPages - this.startPageViewing + 1)
        : []
    }
  }
}
</script>

<style lang="scss">
.page-manager-image {
	max-height: 350px;
	max-width: 300px;
}
</style>
