<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Tag suggestions
      <span v-if="keywordSuggestionList.length>0" class="red-color"> ({{keywordSuggestionList.length}})</span>
      <span v-else style="color: #999;">(0)</span>
    </h2>
    <span class="admin-content-box-inner" v-if="isOpen">
      <p>Tags suggested by users pending approval will appear here.</p>

      <span v-if="keywordSuggestionList.length > 0">
        <table class="y-table">
          <thead>
            <tr>
              <th>Comic name</th>
              <th>Suggestion</th>
              <th>Suggester</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(suggestion, index) in keywordSuggestionList" :key="index">
              <td><router-link :to="{name: 'comic', params: {'comicName': suggestion.comicName}}" target="_blank" class="underline-link">
                {{suggestion.comicName}}</router-link></td>
              <td>{{suggestion.addKeyword ? 'ADD' : 'REMOVE'}} {{suggestion.keyword.name}}</td>
              <td style="word-break: break-all;">{{suggestion.user}}</td>
              <td>
								<div class="horizontal-flex flex-wrap">
									<button
										@click="processKeyword(suggestion, true)"
										class="y-button no-margin-bot"
										style="margin-right: 2px;">
										Approve
									</button>
									<button
										@click="processKeyword(suggestion, false)"
										class="y-button y-button-red no-margin-bot">
										Reject
									</button>
								</div>
              </td>
            </tr>
          </tbody>
        </table>
      </span>

      <span v-else>
        <p>There are currently no new suggestions.</p>
      </span>

      <p class="error-message" v-if="errorMessage" style="margin-top: 8px;">{{errorMessage}}</p>
      <p class="success-message" v-if="successMessage" style="margin-top: 8px;">{{successMessage}}</p>

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
  name: 'keywordSuggestions',

  data () {
    return {
      keywordSuggestionList: [],
      isOpen: false,
      successMessage: '',
      errorMessage: '',
    }
  },

  methods: {
    async processKeyword (suggestion, isApproved) {
			let response = await keywordApi.processKeywordSuggestion(suggestion, isApproved)

      if (response.success) {
        this.successMessage = `Successfully ${isApproved ? 'approved' : 'rejected'} ${suggestion.addKeyword ? 'adding' : 'removing'} of tag ${suggestion.keyword.name}`
        this.errorMessage = ''
        this.loadSuggestions()
      }
      else {
        this.errorMessage = 'Error processing tag suggestion: ' + response.message
        this.successMessage = ''
      }
    },

    async loadSuggestions () {
      this.keywordSuggestionList = await keywordApi.getKeywordSuggestionList()
      for (var suggestion of this.keywordSuggestionList) {
        suggestion.keyword = {name: suggestion.keywordName, id: suggestion.keywordId}
        suggestion.user = suggestion.user || suggestion.userIP
      }
    },

    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },

  mounted () {
    this.loadSuggestions()
  }
}
</script>
