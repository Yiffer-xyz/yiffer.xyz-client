<template>
  <div class="admin-content-box admin-content-box-grow" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Insert / remove / swap pages</h2>

    <span class="admin-content-box-inner" v-if="isOpen">
      <p>
        Because of how the Cloudflare caching works, it might take up to 30 days for these changes to go into effect.
        While unfortunate, this is unavoidable. This means that the page previews below will be faulty after one such
        change within a 30-day-period.
      </p>
      <p>
        So, if a comic has had page changes (other than normal adding pages) within the last 30 days, you may not 
        use this to do so again. If there are many pages that need to be swapped, inserted or deleted, please
        contact the site owner in the Discord channel.
      </p>

      <div class="horizontal-flex" style="margin-top: 8px;">
        <p class="add-kw-mini-header" style="margin-right: 8px;">Comic:</p>
        <select v-model="comic" @change="comicChanged">
          <option v-for="comic in $store.getters.comicList" :key="comic.id" :value="comic">
            {{comic.name}}
          </option>
        </select>
      </div>

      <div v-if="comicHasBeenChangedRecently" class="error-message">
        This comic was changed on {{comicChangeDate}}, and can not be changed again until 
        30 days have passed.
      </div>

      <div v-if="comic" class="horizontal-flex" style="margin-top: 8px;">
        <p class="add-kw-mini-header" style="margin-right: 8px;">Start page viewing range:</p>
        <select v-model="startPageViewing">
          <option v-for="pageNumber in comic.numberOfPages" :key="pageNumber" :value="pageNumber">
            &nbsp;&nbsp;{{pageNumber}}&nbsp;&nbsp;&nbsp;
          </option>
        </select>
      </div>

      <div v-if="comic" class="horizontal-flex" style="height: 386px">
        <div v-for="i in pagesToShow" :key="i" class="vertical-flex" style="margin: 4px;">
          <p>Page {{i}}</p>
          <a :href="`https://yiffer.xyz/comics/${comic.name}/${formattedPageNumber(i)}.jpg`" target="_blank">
            <img :src="`https://yiffer.xyz/comics/${comic.name}/${formattedPageNumber(i)}.jpg`" 
              class="page-manager-image"/> <!-- todo server change url -->
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
          <p v-if="imageToInsert"><b>{{imageToInsert.length}}</b> Selected file: 
            <span class="courier">{{imageToInsert.name}}</span>
          </p>

          <button @click="insertPage" v-if="imageToInsert" class="y-button margin-top-16">Insert {{imageToInsert.name}}</button>
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
  name: 'pageManager',

	components: {
		'checkbox-icon': CheckboxIcon,
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
      deletePageNumber: undefined,
      comicHasBeenChangedRecently: false,
      comicChangeDate: undefined,

      errorMessageSwap: '',
      successMessageSwap: '',
      errorMessageInsert: '',
      successMessageInsert: '',
      errorMessageDelete: '',
      successMessageDelete: '',
    }
  },

  methods: {
    async swapPages () {
      let response = await comicApi.swapComicPages(this.comic.id, this.swapPage1, this.swapPage2)
      this.errorMessageSwap = ''
      this.successMessageSwap = ''

      if (response.success) {
        this.successMessageSwap = 'Swap successful! Keep in mind the 30-day period described above.'
        this.$store.dispatch('updateOneComicInList', this.comic)
      }
      else {
        this.errorMessageSwap = 'Error swapping pages: ' + response.message
      }
    },

    async insertPage () {
      let response = await comicApi.insertComicPage(this.comic.id, this.insertPageAfterNumber)
      this.errorMessageInsert = ''
      this.successMessageInsert = ''

      if (response.success) {
        this.successMessageInsert = 'Insert successful! Keep in mind the 30-day period described above.'
        this.$store.dispatch('updateOneComicInList', this.comic)
      }
      else {
        this.errorMessageInsert = 'Error inserting page: ' + response.message
      }
    },

    async deletePage () {
      let response = await comicApi.deleteComicPage(this.comic.id, this.deletePageNumber)
      this.errorMessageDelete = ''
      this.successMessageDelete = ''

      if (response.success) {
        this.successMessageDelete = 'Delete successful! Keep in mind the 30-day period described above.'
        this.$store.dispatch('updateOneComicInList', this.comic)
      }
      else {
        this.errorMessageDelete = 'Error deleting page: ' + response.message
      }
    },

    async comicChanged () {
      this.startPageViewing=1

      let response = await comicApi.getComicPageChangeDate()
      this.comicHasBeenChangedRecently = ((new Date())-response) < 86400000*30
      this.comicChangeDate = response.toString().substring(0,10)
    },

    processFileUploadChange (changeEvent) {
      this.imageToInsert = changeEvent.target.files[0]
    },

		formattedPageNumber: pageNumber => pageNumber<10 ? '0'+pageNumber : pageNumber,

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
