<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2>Comic suggestions
      <span v-if="comicSuggestionList.length>0" class="red-color"> ({{comicSuggestionList.length}})</span>
      <span v-else style="color: #999;">(0)</span>
    </h2>
    <span class="admin-content-box-inner" v-if="isOpen">
      <p>Comics suggested by users will appear here.</p>
      <p>
				Click 'Added' when the comic has been added to suggestions (here, in the admin panel).
				<br/>
				Click 'Reject' if the comic fails to meet the criteria listed  
				<router-link :to="{name: 'suggestComic'}" target="_blank">here</router-link>. 
				<br/>
				Please don't hesitate to ask for opinions in the mod discord chat!
			</p>

      <span v-if="comicSuggestionList.length > 0">
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
            <tr v-for="(suggestion, index) in comicSuggestionList" :key="index">
              <td>{{suggestion.ComicName}}</td>
              <td>{{suggestion.Artist || ''}}</td>
              <td style="word-break: break-word;">{{suggestion.LinksComments}}</td>
              <td>{{suggestion.User}}</td>
              <td>
                <button @click="processSuggestion(suggestion.ComicName, suggestion.User, true)" class="y-button no-margin-bot">Added</button>
                <button @click="processSuggestion(suggestion.ComicName, suggestion.User, false)" class="y-button y-button-red no-margin-bot">Reject</button>
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
export default {
  name: 'comicSuggestions',
  props: {
    comicSuggestionList: Array
  },
  data: function () {
    return {
      isOpen: false,
      successMessage: '',
      errorMessage: '',
    }
  },
  methods: {
    processSuggestion (comicName, user, isApproved) {
      let response = {success: true, message: 'umm feuil her'}

      if (response.success) {
        this.successMessage = `Successfully ${isApproved ? 'approved' : 'rejected'} comic ${comicName}`
        this.errorMessage = ''
        this.$emit('refresh-comic-suggestions')
      }
      else {
        this.errorMessage = 'Error processing comic suggestion: ' + response.message
        this.successMessage = ''
      }
    },
    openComponent () { if (!this.isOpen) { this.isOpen = true } },
    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },
}
</script>
