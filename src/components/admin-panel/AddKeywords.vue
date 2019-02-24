<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Add tags to comic</h2>
    <span class="admin-content-box-inner" v-if="isOpen">

      <p>Select a comic. Then, if you you click on the tag list below, you can navigate quickly to tags by typing, and press enter to add them. You <i>do</i> have to wait about a second between adding tags this way though.</p>

      <div class="horizontal-flex no-margin-bot" style="margin: 12px 0;">
        <p class="admin-mini-header" style="margin-right: 8px;">Comic:</p>
        <select v-model="comic">
          <option v-for="comic in $store.getters.comicList" :key="comic.id" :value="comic">
            {{comic.name}}
          </option>
        </select>
      </div>

  
      <div class="horizontal-flex" style="width: 100%; justify-content: space-evenly; margin-top: 8px;" v-if="comic">
        <div class="vertical-flex">
          <p class="admin-mini-header">Tag list</p>
          <select size="13" style="margin-bottom: 0" v-model="selectedKeyword" @keyup.13="addSelectedKeyword()"> 
            <option v-for="keyword in keywordList" :key="keyword.keyword" :value="keyword.keyword">{{keyword.keyword}}</option>
          </select>
          <button class="y-button y-button-small y-button-neutral" @click="addSelectedKeyword()">&rarr;</button>
        </div>
      
        <div class="vertical-flex">
          <p class="admin-mini-header">Tags you're adding</p>
          <p v-if="selectedKeywords.length > 0" style="margin-bottom: 6px;">Click tag to <span class="red-color">remove</span></p>
          <p v-for="keyword in selectedKeywords" @click="removeKeywordFromSelection(keyword)" 
             :key="keyword" class="selected-add-keyword">{{keyword}}</p>
          <button class="y-button" v-if="selectedKeywords.length > 0"
                  @click="confirmAddKeywords()" style="margin-top: 6px;">
            Add tags
          </button>
        </div>
      
        <div class="vertical-flex">
          <p class="admin-mini-header">This comic's tags</p>
          <p v-if="comic.keywords.length > 0" style="margin-bottom: 6px;">
            Click tags to <span class="red-color">remove</span>
          </p>
          <p v-for="keyword in comic.keywords" @click="addOrRemoveKeywordToDeleteList(keyword)" 
             :key="keyword" class="selected-add-keyword" 
             :class="{'keyword-to-be-deleted': keywordsToDelete.indexOf(keyword) >= 0}">{{keyword}}</p>
          <button @click="confirmRemoveKeywords()" class="y-button y-button-red"
                  v-if="keywordsToDelete.length > 0" style="margin-top: 6px;">
            Remove tags
          </button>
        </div>
      </div>

      <p class="error-message" v-if="errorMessage" style="margin-top: 8px;">{{errorMessage}}</p>
      <p class="success-message" v-if="successMessage" style="margin-top: 8px;">{{successMessage}}</p>


      <h2 style="margin-top: 32px;">Create new tag</h2>
      <p>If a tag is not in the list above, create it here.</p>
      <div class="horizontal-flex" style="align-items: center;">
        <p style="margin-right: 8px; font-weight: 400;">New tag name:</p>
        <input type="text" v-model="newKeyword"/>
        <button @click="createKeyword()" class="y-button" style="margin: 0 0 0 8px;">Create tag</button>
      </div>

      <p class="error-message" v-if="newKwErrorMessage" style="margin-top: 8px;">{{newKwErrorMessage}}</p>
      <p class="success-message" v-if="newKwSuccessMessage" style="margin-top: 8px;">{{newKwSuccessMessage}}</p>

      <menu-up-icon @click.native="closeComponent" class="mdi-arrow close-component-arrow"/>
    </span>

    <span v-else>
      <menu-down-icon class="mdi-arrow"/>
    </span>
  </div>
</template>

<script>
import keywordApi from '../../api/keywordApi'

export default {
  name: 'addKeywords',

  props: {
    keywordList: Array,
  },

  data: function () {
    return {
      isOpen: false,
      comic: undefined,
      errorMessage: '',
      successMessage: '',
      newKwErrorMessage: '',
      newKwSuccessMessage: '',
      selectedKeywords: [],
      selectedKeyword: undefined,
      keywordsToDelete: [],
			newKeyword: '',
			lastComicId: undefined,
    }
  },

  methods: {
    addSelectedKeyword () {
      if (this.selectedKeywords.indexOf(this.selectedKeyword) < 0) {
        this.selectedKeywords.push(this.selectedKeyword)
      }
    },

    removeKeywordFromSelection (keywordName) {
      this.selectedKeywords.splice(this.selectedKeywords.indexOf(keywordName), 1)
    },

    addOrRemoveKeywordToDeleteList (keywordName) {
      if (this.keywordsToDelete.indexOf(keywordName) < 0) {
        this.keywordsToDelete.push(keywordName)
      }
      else {
        this.keywordsToDelete.splice(this.keywordsToDelete.indexOf(keywordName), 1)
      }
    },
    
    async confirmAddKeywords () {
      let response = await keywordApi.addKeywordsToComic(this.comic, this.selectedKeywords)

      if (response.success) {
        this.successMessage = 'Successfully added tags to ' + this.comic.name
        this.errorMessage = ''
				this.selectedKeywords = []
				this.lastComicId = this.comic.id
        this.$emit('refresh-comic-list')
      }
      else {
        this.errorMessage = 'Error adding tags: ' + response.message
        this.successMessage = ''
      }
    },

    async confirmRemoveKeywords () {
      let response = await keywordApi.removeKeywordsFromComic(this.comic, this.keywordsToDelete)

      if (response.success) {
        this.successMessage = 'Successfully removed tags from ' + this.comic.name
        this.errorMessage = ''
        this.keywordsToDelete = []
				this.lastComicId = this.comic.id
        this.$emit('refresh-comic-list')
      }
      else {
        this.errorMessage = 'Error removing tags: ' + response.message
        this.successMessage = ''
      }
    },

    async createKeyword () {
      let response = await keywordApi.createKeyword(this.newKeyword)

      if (response.success) {
        this.newKwSuccessMessage = 'Successfully created tag ' + this.newKeyword
        this.newKwErrorMessage = ''
        this.newKeyword = ''
        this.$emit('refresh-keyword-list')
      }
      else {
        this.newKwErrorMessage = 'Error creating tag: ' + response.message
        this.newKwSuccessMessage = ''
      }
    },

    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
	},

	mounted () {
		this.$store.watch(this.$store.getters.comicListF, () => {
			this.comic = this.$store.getters.comicList.find(c => c.id===this.lastComicId)
		})
	}
}
</script>