<template>
  <span>
    <div id="comicKeywords" class="mt-24 horizontalFlex flexWrap justifyCenter" style="max-width: 42.5rem;">
      <router-link :to="`/?tags=${keyword.name}`"
                   v-for="keyword in comicKeywords"
                   :key="keyword.name"
                   class="linkKeyword">
        <div class="keyword">
          {{keyword.name}}
        </div>
      </router-link>

      <span v-if="comicKeywords.length===0" style="margin-right: 8px;">
        <p>No tags</p>
      </span>
    </div>

    <div class="horizontalFlex flexWrap mt-24"
         v-if="!isSuggestingKeywords && !isReportingProblem">
      <button class="y-button y-button-small m-4"
              @click="toggleProblemReporting()">
        Report problem
      </button>
      <button class="y-button y-button-small m-4"
              @click="toggleKeywordSuggestions('add')">
        Add tag
      </button>
      <button class="y-button y-button-small m-4"
              @click="toggleKeywordSuggestions('remove')"
              v-if="comicKeywords.length > 0">
        Remove tag
      </button>
    </div>

    <div v-if="isSuggestingKeywords && allKeywords.failed">
      <p class="mt-16">There was an error fetching all tags. Please try again later.</p>
    </div>

    <div id="keywordEditing"
         v-if="isSuggestingKeywords && !allKeywords.failed"
         class="mt-16 mb-8 verticalFlex fitContent marginAuto themeBox">
      <p class="bold textAlignLeft">
        {{isAddingKeywords ? 'Add tag' : 'Remove tag'}}
      </p>

      <div v-if="isAddingKeywords" class="mt-8">
        <Select :options="keywordsNotInComic"
                title="Tag to add"
                isSearchable
                searchKeepSelected
                :searchSelected="addKeyword ? addKeyword.name : null"
                :resetValue="kwResetValue"
                @searchSelectedClicked="addKeyword = null"
                @change="onAddKeywordChange"/>
      </div>

      <div v-if="isRemovingKeywords" class="mt-8">
        <Select :options="comicKeywordOptions"
                title="Tag to remove"
                isSearchable
                searchKeepSelected
                :searchSelected="removeKeyword ? removeKeyword.name : null"
                :resetValue="kwResetValue"
                @searchSelectedClicked="removeKeyword = null"
                @change="onRemoveKeywordChange"/>
      </div>

      <div class="horizontalFlex mt-16 alignItemsEnd width100 mr-8">
        <button class="y-button y-button-neutral button-with-icon mr-8"
                @click="toggleKeywordSuggestions()">
          <CrossIcon title=""/> Cancel
        </button>

        <LoadingButton text="Submit"
                       :isLoading="isSubmittingSuggestion"
                       :isDisabled="!addKeyword && !removeKeyword"
                       iconType="check"
                       @click="suggestKeywordChange(isAdding=isAddingKeywords)"
                       styles="height: fit-content;"/>
      </div>
    </div>

    <div v-if="isReportingProblem" class="mt-16 mb-8 verticalFlex fitContent marginAuto themeBox">
      <p class="bold textAlignLeft">
        Report a problem with this comic
      </p>

      <div v-if="singleComicProblemCategories.fetched && singleComicProblemCategories.payload.length > 0"
           class="textAlignLeft mt-16 mb-16">
        <p>
          Existing reports for this comic:
        </p>
        <p v-for="reportedProblem in singleComicProblemCategories.payload" :key="reportedProblem.categoryId">
          - {{reportedProblem.categoryName}}
        </p>
      </div>


      <ResponseMessage :message="fetchError"
                       messageType="error"
                       @closeMessage="toggleProblemReporting()"
                       class="mt-8 mb-16"/>

      <FetchResponseMessage successMessage="Thank you for helping out! Our moderators will have a look at this shortly."
                            :fetchStates="[submitComicProblem]"
                            disableElevation
                            class="mb-16 mt-16"
                            style="max-width: 20rem"/>

      <div class="mt-8">
        <Select :options="comicProblemOptions"
                title="Problem type"
                @change="cat => newProblemCategory = cat"
                :resetValue="problemResetValue"/>

        <p v-if="newProblemCategory" style="max-width: 20rem" class="textAlignLeft mt-16 italic">
          <i>{{newProblemCategory.helperText}}</i>
        </p>

        <TextInput @change="newVal => newProblemDescription = newVal"
                  title="Description"
                  textAlign="left"
                  classes="mt-32"
                  type="textarea"
                  :resetValue="problemResetValue"/>
      </div>

      <div class="horizontalFlex mt-16 justifyEnd width100">
        <button class="y-button y-button-neutral button-with-icon mr-8"
                @click="toggleProblemReporting()">
          <CrossIcon title=""/> Cancel
        </button>

        <LoadingButton text="Submit"
                       :isLoading="submitComicProblem.fetching"
                       :isDisabled="!newProblemCategory || !newProblemDescription"
                       iconType="check"
                       @click="sendProblem()"
                       styles="height: fit-content;"/>
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
import FetchResponseMessage from '@/components/FetchResponseMessage.vue'
import Select from '../../components/Select.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import CrossIcon from 'vue-material-design-icons/Close.vue'
import { fetchClear, doFetch } from '../../utils/statefulFetch'
import miscApi from '@/api/miscApi'
import TextInput from '../../components/TextInput.vue'

export default {
  props: {
    comicData: Object,
  },

  components: {
    ResponseMessage, Select, LoadingButton, TextInput,
    CrossIcon, FetchResponseMessage,
  },

  computed: {
    ...mapGetters([
      'allKeywords',
      'comicProblemCategories',
      'singleComicProblemCategories',
      'submitComicProblem',
    ]),

    fetchError () {
      if (this.comicProblemCategories.failed) {
        return this.comicProblemCategories.errorMessage
      }
      if (this.singleComicProblemCategories.failed) {
        return this.singleComicProblemCategories.errorMessage
      }
      return ''
    },
    
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

    comicProblemOptions () {
      return this.comicProblemCategories.payload
        .filter(category => !this.singleComicProblemCategories.payload.find(problem => category.id === problem.categoryId))
        .map(category => ({value: category, text: category.name}))
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
      kwResetValue: null,

      isReportingProblem: false,
      thisComicExistingProblems: [],
      newProblemCategory: null,
      newProblemDescription: '',
      problemResetValue: '',
    }
  },

  async mounted () {
    if (!this.comicKeywords || this.comicKeywords.length === 0) {
      this.comicKeywords = await keywordApi.getComicKeywords(this.comicData.id)
    }
    fetchClear(this.$store.commit, 'singleComicProblemCategories')
  },

  methods: {
    onAddKeywordChange (newKeyword) {
      this.addKeyword = newKeyword
      this.kwResetValue = Math.random().toString()
    },

    onRemoveKeywordChange (newKeyword) {
      this.removeKeyword = newKeyword
      this.kwResetValue = Math.random().toString()
    },

    async sendProblem () {
      let isSuccess = await doFetch(
        this.$store.commit,
        'submitComicProblem',
        miscApi.submitComicProblem(this.comicData.id, this.newProblemCategory.id, this.newProblemDescription)
      )
      if (isSuccess) {
        fetchClear(this.$store.commit, 'submitComicProblem')
        this.newProblemCategory = null
        this.newProblemDescription = ''
        this.problemResetValue = Math.random().toString()
        doFetch(this.$store.commit, 'singleComicProblemCategories', miscApi.getSingleComicProblemCategories(this.comicData.id))
      }
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

    toggleProblemReporting () {
      this.isReportingProblem = !this.isReportingProblem
      fetchClear(this.$store.commit, 'submitComicProblem')
      this.problemResetValue = Math.random().toString()

      if (this.isReportingProblem) {
        if (!this.comicProblemCategories.fetched) {
          doFetch(this.$store.commit, 'comicProblemCategories', miscApi.getProblemCategories())
        }
        doFetch(this.$store.commit, 'singleComicProblemCategories', miscApi.getSingleComicProblemCategories(this.comicData.id))
      }
      else {
        fetchClear(this.$store.commit, 'singleComicProblemCategories')
        if (this.comicProblemCategories.failed) {
          fetchClear(this.$store.commit, 'comicProblemCategories')
        }
      }
    },

    mounted () {
      fetchClear(this.$store.commit, 'submitComicProblem')
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

.linkKeyword {
  line-height: normal;
}

.dark {
  .keywordButton {
    border-color: $themeBlueDTText !important;
    color: $themeBlueDTText !important;
  }
}
</style>