<template>
  <span>
    <div id="comicKeywords" class="mt-32 horizontalFlex flexWrap justifyCenter" style="max-width: 42.5rem;">
      <div class="keywordStatic"
            v-for="keyword in comicKeywords"
            :key="keyword.name">
        {{keyword.name}}
      </div>

      <span v-if="comicKeywords.length===0" style="margin-right: 8px;">
        <p>No tags</p>
      </span>

      <div class="keywordStatic keywordButton" @click="toggleKeywordSuggestions('add')" v-if="!isSuggestingKeywords">
        add tags
      </div>
      <div class="keywordStatic keywordButton" @click="toggleKeywordSuggestions('remove')" v-if="!isSuggestingKeywords && comicKeywords.length > 0">
        remove tags
      </div>
      <div class="keywordStatic keywordButton" @click="toggleKeywordSuggestions()" v-if="isSuggestingKeywords">
        stop {{isAddingKeywords ? 'adding' : 'removing'}} tags
      </div>
    </div>

    <div v-if="isSuggestingKeywords && allKeywords.failed">
      <p class="mt-16">There was an error fetching all tags. Please try again later.</p>
    </div>

    <div id="keywordEditing"
         v-if="isSuggestingKeywords && !allKeywords.failed"
         class="mt-8 mb-8 verticalFlex alignCenter">

      <div v-if="isAddingKeywords" class="mt-8 horizontalFlex">
        <Select :options="keywordsNotInComic"
                title="Tag to add"
                @change="onAddKeywordChange"
                wrapperStyle="min-width: 13rem;"
                :resetValue="responseMessage"/>

        <LoadingButton text="Submit"
                       :isLoading="isSubmittingSuggestion"
                       :isDisabled="!addKeyword"
                       iconType="check"
                       @click="suggestKeywordChange(isAdding=true)"
                       styles="height: fit-content; align-self: flex-end; margin-left: 1rem;"/>
      </div>

      <div v-else-if="isRemovingKeywords" class="mt-8 horizontalFlex">
        <Select :options="comicKeywordOptions"
                title="Tag to remove"
                @change="onRemoveKeywordChange"
                wrapperStyle="min-width: 13rem;"
                :resetValue="responseMessage"/>

        <LoadingButton text="Submit"
                       :isLoading="isSubmittingSuggestion"
                       :isDisabled="!removeKeyword"
                       iconType="check"
                       @click="suggestKeywordChange(isAdding=false)"
                       styles="height: fit-content; align-self: flex-end; margin-left: 1rem;"/>
      </div>
    </div>

    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" 
                     @closeMessage="closeResponseMessage" class="mt-16"/>
  </span>
</template>

<script>
import keywordApi from '../../api/keywordApi'
import { mapGetters } from 'vuex'
import ResponseMessage from '@/components/ResponseMessage.vue'
import Select from '../../components/Select.vue'
import LoadingButton from '@/components/LoadingButton.vue'

export default {
  props: {
    comicData: Object,
  },

  components: {
    ResponseMessage, Select, LoadingButton,
  },

  computed: {
    ...mapGetters([
      'allKeywords'
    ]),
    
    isSuggestingKeywords () {
      return this.isAddingKeywords || this.isRemovingKeywords
    },

    keywordsNotInComic () {
      if (this.allKeywords.failed) { return [] }
      let keywords = this.allKeywords.payload
        .filter(kw => !this.comicKeywords.find(thisKw => thisKw.id === kw.id))
        .sort((kw1, kw2) => kw1.name > kw2.name ? 1 : -1)
        .map(kw => ({value: kw, text: kw.name}))
      return keywords
    },

    comicKeywordOptions () {
      return this.comicKeywords.map(kw => ({value: kw, text: kw.name}))
    },
  },

  data () {
    return {
      isSubmittingSuggestion: false,
      comicKeywords: [],
      addKeyword: null,
      removeKeyword: undefined,
      isAddingKeywords: false,
      isRemovingKeywords: false,
      responseMessage: '',
      responseMessageType: 'info',
    }
  },

  async mounted () {
    if (!this.comicKeywords || this.comicKeywords.length === 0) {
      this.comicKeywords = await keywordApi.getComicKeywords(this.comicData.id)
    }
  },

  methods: {
    onAddKeywordChange (newKeyword) {
      this.addKeyword = newKeyword
    },

    onRemoveKeywordChange (newKeyword) {
      this.removeKeyword = newKeyword
    },

    async loadComicKeywords () {
      if (!this.keywords || this.keywords.length === 0) {
        this.keywords = await keywordApi.getComicKeywords(this.comicData.id)
      }
    },

    toggleKeywordSuggestions (action) {
      if (action === 'add') { this.isAddingKeywords = true }
      else if (action === 'remove') { this.isRemovingKeywords = true }
      else {
        this.isAddingKeywords = false
        this.isRemovingKeywords = false
      }
      this.addKeyword = null
      this.removeKeyword = null
    },

    async suggestKeywordChange (isAdding) {
      this.closeResponseMessage()
      let relevantKeyword = isAdding===true ? this.addKeyword : this.removeKeyword
      if (!relevantKeyword) { return }

      this.isSubmittingSuggestion = true
      let suggestionResponse = await keywordApi.addKeywordSuggestion(this.comicData.id, relevantKeyword.id, isAdding)
      this.isSubmittingSuggestion = false

      if (suggestionResponse.success) {
        this.responseMessage = `Thank you! Your suggestion will be reviewed soon (${isAdding ? 'Add' : 'Remove'} ${relevantKeyword.name})`
        this.responseMessageType = 'success'

        this.addKeyword = undefined
        this.removeKeyword = undefined
      }
      else {
        this.responseMessage = suggestionResponse.message
        this.responseMessageType = 'error'
      }
    },

    getKeywordIdFromName (keywordName) {
      return this.allKeywords.payload.find(kw => kw.name === keywordName).id
    },
    
    closeResponseMessage () { this.responseMessage = '' },
  },
}
</script>

<style lang="scss" scoped>
.keywordButton {
  border-color: $themeBlueDark !important;
  color: $themeBlueDark !important;
  &:hover {
    cursor: pointer;
  }
}

.dark {
  .keywordButton {
    border-color: $themeBlueDTText !important;
    color: $themeBlueDTText !important;
  }
}
</style>