<template>
  <div class="admin-content-box" @click="openComponent" v-bind:class="{'admin-content-box-open': isOpen}">
    <h2>Add tags to comic</h2>
    <span class="admin-content-box-inner" v-if="isOpen">

      <p>Select a comic. Then, if you you click on the tag list below, you can navigate quickly to tags by typing, and press enter to add them. You <i>do</i> have to wait about a second between adding tags this way though.</p>

      <div class="horizontal-flex" style="margin: 12px 0;">
        <p class="add-kw-mini-header" style="margin-right: 8px;">Comic:</p>
        <select v-model="comic">
          <option v-for="comic in comicList" v-bind:key="comic.id" v-bind:value="comic">
            {{comic.name}}
          </option>
        </select>
      </div>

  
      <div class="horizontal-flex" style="width: 100%; justify-content: space-evenly;" v-if="comic">
        <div class="vertical-flex">
          <p class="add-kw-mini-header">Tag list</p>
          <select size="13" style="margin-bottom: 0" v-model="selectedKeyword" v-on:keyup.13="addSelectedKeyword()"> 
            <option v-for="keyword in keywordList" v-bind:key="keyword.name" v-bind:value="keyword.name">{{keyword.name}}</option>
          </select>
          <button class="y-button" @click="addSelectedKeyword()">&rarr;</button>
        </div>
      
        <div class="vertical-flex">
          <p class="add-kw-mini-header">Tags you're adding</p>
          <p v-if="selectedKeywords.length > 0" style="margin-bottom: 6px;">Click tag to <span class="red-color">remove</span></p>
          <p v-for="keyword in selectedKeywords" @click="removeKeywordFromSelection(keyword)" 
             v-bind:key="keyword" class="selected-add-keyword">{{keyword}}</p>
          <button class="y-button" v-if="selectedKeywords.length > 0"
                  @click="confirmAddKeywords()" style="margin-top: 6px;">
            Add tags
          </button>
        </div>
      
        <div class="vertical-flex">
          <p class="add-kw-mini-header">This comic's tags</p>
          <p v-if="comic.keywords.length > 0" style="margin-bottom: 6px;">
            Click tags to <span class="red-color">remove</span>
          </p>
          <p v-for="keyword in comic.keywords" @click="addOrRemoveKeywordToDeleteList(keyword)" 
             v-bind:key="keyword" class="selected-add-keyword" 
             v-bind:class="{'keyword-to-be-deleted': keywordsToDelete.indexOf(keyword) >= 0}">{{keyword}}</p>
          <button @click="confirmRemoveKeywords()" class="y-button y-button-red"
                  v-if="keywordsToDelete.length > 0" style="margin-top: 6px;">
            Remove tags
          </button>
        </div>
      </div>

      <p class="error-message" v-if="errorMessage" style="margin-top: 8px;">{{errorMessage}}</p>
      <p class="success-message" v-if="successMessage" style="margin-top: 8px;">{{successMessage}}</p>


      <h2 style="margin-top: 16px;">Create new tag</h2>
      <p>If a tag is not in the list above, create it here.</p>
      <div class="horizontal-flex" style="align-items: center;">
        <p style="margin-right: 8px; font-weight: 400;">New tag name:</p>
        <input type="text" v-model="newKeyword"/>
        <button @click="createKeyword()" class="y-button" style="margin: 0 0 0 8px;">Create tag</button>
      </div>

      <p class="error-message" v-if="newKwErrorMessage" style="margin-top: 8px;">{{newKwErrorMessage}}</p>
      <p class="success-message" v-if="newKwSuccessMessage" style="margin-top: 8px;">{{newKwSuccessMessage}}</p>

      <i class="fas fa-sort-up arrow-symbol" @click="closeComponent" style="margin-top: 16px;"></i>
    </span>

    <span v-else>
      <p>Liten desc kan komme her</p>
      <i class="fas fa-sort-down arrow-symbol"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'addKeywords',
  props: {
    comicList: Array,
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
    confirmAddKeywords () {
      let response = {success: false, message: 'Tag already exists'}

      if (response.success) {
        this.successMessage = 'Successfully added tags to ' + this.comic.name
        this.errorMessage = ''
        this.selectedKeywords = []
        this.updateComicKeywordsFromBackend(this.comic.id)
      }
      else {
        this.errorMessage = 'Error adding tags: ' + response.message
        this.successMessage = ''
      }
    },
    confirmRemoveKeywords () {
      let response = {success: true}

      if (response.success) {
        this.successMessage = 'Successfully removed tags from ' + this.comic.name
        this.errorMessage = ''
        this.keywordsToDelete = []
        this.updateComicKeywordsFromBackend(this.comic.id)
      }
      else {
        this.errorMessage = 'Error removing tags: ' + response.message
        this.successMessage = ''
      }
    },
    updateComicKeywordsFromBackend (comicId) {
      // hotfix, hent det egentlig fra api med comic id
      let newComic = {}
      newComic.keywords = this.comic.keywords
      newComic.id = this.comicId
      newComic.keywords.push('new kw 1')
      newComic.keywords.push('new kw 222')

      // hotfix end, bruk dette
      for (var comic of this.comicList) {
        if (comic.id === comicId) {
          comic.keywords = newComic.keywords
        }
      }
    },
    createKeyword () {
      // make response using this.newKeyword
      // let response = {success: true}
      let response = {success: false, message: 'Tag already exists'}

      if (response.success) {
        this.newKwSuccessMessage = 'Successfully created tag ' + this.newKeyword
        this.newKwErrorMessage = ''
        this.keywordList.push({name: this.newKeyword})
        this.newKeyword = ''
      }
      else {
        this.newKwErrorMessage = 'Error creating tag: ' + response.message
        this.newKwSuccessMessage = ''
      }
    },
    openComponent () { if (!this.isOpen) { this.isOpen = true } },
    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },
  computed: {
  }
}
</script>

<style lang="scss">
$linkColor: #009fff;
$themeRed: #ec2f4b;

.add-kw-mini-header {
  font-weight: 400;
  margin-bottom: 6px;
}

.selected-add-keyword {
  &:hover {
    cursor: pointer;
    text-decoration: line-through;
    color: $themeRed;
  }
  font-size: 14px;
}

.keyword-to-be-deleted {
  color: $themeRed;
  text-decoration: line-through;
}

</style>
