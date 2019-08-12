<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Add tags to comic</h2>
    <span class="admin-content-box-inner" v-if="isOpen">

      <p>Select a comic. Then, if you you click on the tag list below, you can navigate quickly to tags by typing, and press enter to add them. You <i>do</i> have to wait about a second between adding tags this way though.</p>

      <div class="horizontal-flex no-margin-bot margin-top-8" style="flex-wrap: wrap;">
        <p class="admin-mini-header" style="margin-right: 8px;">Comic:</p>
        <select v-model="comic">
          <option v-for="comic in comicList" :key="comic.id" :value="comic">
            {{comic.name}}
          </option>
        </select>
        <router-link :to="{name: 'comic', params: {'comicName': comic.name}}" 
                     v-if="comic" 
                     style="margin-left: 8px;" 
                     target="_blank"
                     class="underline-link">
          Go to comic <right-arrow/>
        </router-link>
      </div>

  
      <div class="horizontal-flex"
           style="width: 100%; justify-content: space-evenly; margin-top: 8px;"
           v-if="comic">
        <div class="vertical-flex" style="flex-wrap: wrap;">
          <p class="admin-mini-header">Tag list</p>
          <select size="13" style="margin-bottom: 0" v-model="selectedKeyword" @keyup.13="addSelectedKeyword()"> 
            <option v-for="keyword in keywordList" 
                    :key="keyword.name" 
                    :value="keyword">
              {{keyword.name}}
            </option>
          </select>
          <button class="y-button y-button-small y-button-neutral" @click="addSelectedKeyword()"><right-arrow/></button>
        </div>
      
        <div class="vertical-flex">
          <p class="admin-mini-header">Tags you're adding</p>
          <p v-if="selectedKeywords.length > 0" style="margin-bottom: 6px;">Click tag to <span class="red-color">remove</span></p>
          <p v-for="keyword in selectedKeywords" 
             @click="removeKeywordFromSelection(keyword)" 
             :key="keyword.id" class="selected-add-keyword">
            {{keyword.name}}
           </p>
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
          <p v-for="keywordName in comic.keywords" @click="addOrRemoveKeywordToDeleteList(keywordName)" 
             :key="keywordName" class="selected-add-keyword" 
             :class="{'keyword-to-be-deleted': keywordsToDelete.findIndex(kw=>kw.name===keywordName)>=0}">
              {{keywordName}}
          </p>
          <button @click="confirmRemoveKeywords()" class="y-button y-button-red"
                  v-if="keywordsToDelete.length > 0" style="margin-top: 6px;">
            Remove tags
          </button>
        </div>
      </div>

      <p class="error-message" v-if="errorMessage" style="margin-top: 8px;">{{errorMessage}}</p>
      <p class="success-message" v-if="successMessage" style="margin-top: 8px;">{{successMessage}}</p>


      <h2 style="margin-top: 32px;">Create new tag</h2>
      <p>If a tag is not in the list above, create it here. Double check first though, please.</p>
      <div class="horizontal-flex flex-wrap margin-top-8"
           style="align-items: center;">
        <p style="margin-right: 8px; font-weight: 400;">New tag name:</p>
        <input type="text" v-model="newKeyword" style="width: 128px;"/>
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
import RightArrow from 'vue-material-design-icons/ArrowRight.vue'

import keywordApi from '../../api/keywordApi'

export default {
	name: 'addKeywords',

	components: {
		'right-arrow': RightArrow,
	},

	props: {
		comicList: Array
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
      if (!this.selectedKeywords.find(kw => kw.id === this.selectedKeyword.id)) {
        this.selectedKeywords.push(this.selectedKeyword)
      }
    },

    removeKeywordFromSelection (keyword) {
      this.selectedKeywords.splice(this.selectedKeywords.findIndex(kw => kw.id===keyword.id), 1)
    },

    async addOrRemoveKeywordToDeleteList (keywordName) {
      if (!this.keywordsToDelete.find(kw => kw.name===keywordName)) {
        let keywordWithData = await this.$store.dispatch('findKeywordDataFromName', keywordName)
        console.log(keywordWithData)
        this.keywordsToDelete.push(keywordWithData)
      }
      else {
        this.keywordsToDelete.splice(this.keywordsToDelete.findIndex(kw => kw.name===keywordName), 1)
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
				this.refreshKeywordList()
      }
      else {
        this.newKwErrorMessage = 'Error creating tag: ' + response.message
        this.newKwSuccessMessage = ''
      }
		},
		
		async refreshKeywordList () {
			this.keywordList = await keywordApi.getKeywordList()
		},

    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
	},

	watch: {
		comicList () {
			this.comic = this.comicList.find(c => c.id===this.lastComicId)
		} 
	},

	mounted () {
		this.refreshKeywordList()
	}
}
</script>