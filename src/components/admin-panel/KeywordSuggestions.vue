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
              <td>{{suggestion.ComicName}}</td>
              <td>{{suggestion.Extension ? 'ADD' : 'REMOVE'}} {{suggestion.Keyword}}</td>
              <td>{{suggestion.User}}</td>
              <td>
								<div class="horizontal-flex">
									<button
										@click="processKeyword(suggestion.ComicId, suggestion.Keyword, true)"
										class="y-button no-margin-bot"
										style="margin-right: 2px;">
										Approve
									</button>
									<button
										@click="processKeyword(suggestion.ComicId, suggestion.Keyword, false)"
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

  props: {
    keywordSuggestionList: Array
  },

  data: function () {
    return {
      isOpen: false,
      successMessage: '',
      errorMessage: '',
    }
  },

  methods: {
    async processKeyword (comicId, keyword, isApproved) {
      let response = await keywordApi.processKeywordSuggestion(comicId, keyword, isApproved)

      if (response.success) {
        this.successMessage = `Successfully ${isApproved ? 'approved' : 'rejected'} tag ${keyword}`
        this.errorMessage = ''
        this.$emit('refresh-keyword-suggestions')
      }
      else {
        this.errorMessage = 'Error processing tag suggestion: ' + response.message
        this.successMessage = ''
      }
    },

    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },
}
</script>
