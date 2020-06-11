<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Comic suggestions
      <span v-if="unprocessedSuggestions.length>0" class="red-color"> ({{unprocessedSuggestions.length}})</span>
      <span v-else style="color: #999;">(0)</span>
    </h2>
    <span class="admin-content-box-inner description-text" v-if="isOpen">
      <p>Comics suggested by users will appear here.</p>
      <p class="margin-bottom-8">
				- Click '<u>Added</u>' when the comic has been uploaded (here, in the admin panel, via <i>Add new comic</i>). Please don't choose this before you have uploaded the comic.
				<br/>
				- Click '<u>Reject, add to rejected-list</u>' if the comic fails to meet the criteria listed  
				<router-link :to="{name: 'suggestComic'}" target="_blank" class="underline-link">here</router-link>. This will show up in the list of previously rejected comics, along with the reason.
				<br/>
        - Click '<u>Reject as spam/dupl.</u>' if the comic has been suggested before, or if it's not a serious suggestion.
				<br/>
				<br/>
				Please don't hesitate to ask for opinions in the mod Telegram chat!
			</p>

      <div v-if="unprocessedSuggestions.length > 0" class="scrolling-table-container">
        <table class="y-table">
          <thead>
            <tr>
              <th>Comic name</th>
              <th>Artist</th>
              <th>Links and comments</th>
              <th>User/IP</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(suggestion, index) in unprocessedSuggestions" :key="index">
              <td>{{suggestion.name}}</td>
              <td>{{suggestion.artist || ''}}</td>
              <td style="word-break: break-word;">{{suggestion.description}}</td>
              <td>{{suggestion.user}}</td>
              <td>
								<div class="horizontal-flex">
									<button 
										@click="processSuggestion(suggestion, true)"
										class="y-button no-margin-bot"
										style="margin-right: 2px;">
										Added
									</button>
									<button 
										@click="processSuggestion(suggestion, true)"
										class="y-button y-button-red no-margin-bot"
										style="margin-right: 2px;">
										Reject, add to rejected-list
									</button>
									<button
										@click="processSuggestion(suggestion, false)"
										class="y-button y-button-red no-margin-bot">
										Reject as spam/dupl.
									</button>
								</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <span v-else>
        <p>There are currently no new suggestions.</p>
      </span>


      <span v-if="processedSuggestions.length>0 && !showProcessedSuggestions">
        <button @click="showProcessedSuggestions = true" class="y-button y-button-neutral margin-top-32">Show processed suggestions <down-arrow/></button>
      </span>

      <span v-if="showProcessedSuggestions">
        <button @click="showProcessedSuggestions = false" class="y-button y-button-neutral margin-top-32">Hide this list <up-arrow/></button>
      </span>

      <table v-if="showProcessedSuggestions" class="y-table">
        <thead>
          <tr>
            <th>Comic name</th>
            <th>Artist</th>
            <th>Links and comments</th>
            <th>User/IP</th>
            <th>Mod</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(suggestion, index) in processedSuggestions" :key="index">
            <td>{{suggestion.name}}</td>
            <td>{{suggestion.artist || ''}}</td>
            <td style="word-break: break-word;">{{suggestion.description}}</td>
            <td>{{suggestion.user}}</td>
            <td>{{suggestion.mod}}</td>
            <td v-if="suggestion.verdict === 'added'"><checkbox-icon/> Added</td>
            <td v-else>Rejected</td>
          </tr>
        </tbody>
      </table>

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
import DownArrow from 'vue-material-design-icons/ArrowDown.vue'
import UpArrow from 'vue-material-design-icons/ArrowUp.vue'
import CheckboxIcon from 'vue-material-design-icons/CheckboxMarkedCircle.vue'

import comicApi from '../../api/comicApi'

export default {
  name: 'comicSuggestions',

	components: {
		'down-arrow': DownArrow,
		'up-arrow': UpArrow,
		'checkbox-icon': CheckboxIcon,
	},

  data: function () {
    return {
      isOpen: false,
      successMessage: '',
      errorMessage: '',
      showProcessedSuggestions: false,
      comicSuggestionList: [],
    }
  },

  methods: {
    async processSuggestion (suggestionData, isApproved) {
      let response = await comicApi.processComicSuggestion({suggestionId: suggestionData.id, isApproved: isApproved})

      if (response.success) {
        this.successMessage = `Successfully processed suggestion of ${suggestionData.name} (${isApproved ? 'added' : 'rejected'})`
        this.errorMessage = ''
        this.getComicSuggestions()
      }
      else {
        this.errorMessage = 'Error processing comic suggestion: ' + response.message
        this.successMessage = ''
      }
    },

    async getComicSuggestions () {
      this.comicSuggestionList = await comicApi.getSuggestedComicList()
      
      for (var suggestion of this.comicSuggestionList) {
        suggestion.user = suggestion.user || suggestion.userIP
      }
    },

    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },

  computed: {
    unprocessedSuggestions () { return this.comicSuggestionList.filter(s => !s.processed) },
    processedSuggestions () { return this.comicSuggestionList.filter(s => !!s.processed) }
  },

  created () {
    this.getComicSuggestions()
  }
}
</script>
