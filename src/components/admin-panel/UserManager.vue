<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">User manager</h2>
    <span class="admin-content-box-inner" v-if="isOpen">

			<!-- USER SEARCH -->
			<div class="horizontal-flex">
				<form @submit="searchForUsers()" action="javascript:void(0)" class="no-margin-bot">
					<input type="text" v-model="userSearchText" />
					<button  @click="searchForUsers()" 
									 type="submit"
									 class="y-button y-button-neutral button-with-icon no-margin-bot margin-top-2"
									 style="margin-left: 2px">
						<search-icon/> Find users
					</button>
				</form>
				<button  @click="fetchModUsers()" class="y-button y-button-neutral button-with-icon no-margin-bot" style="margin-left: 32px">
					<mod-icon/> List mods
				</button>
			</div>

			<!-- USER SEARCH RESULT TABLE -->
			<div v-if="foundUsers.length > 0" class="scrolling-table-container">
				<table class="y-table margin-top-8">
					<thead>
						<tr>
							<th>Username</th>
							<th>Created</th>
							<th>Select</th>
						</tr>
					</thead>
					<tr v-for="user in foundUsers" :key="user.id">
						<td>{{user.username}}</td>
						<td>{{prettyDate(user.createdTime)}}</td>
						<td>
							<button class="y-button y-button-neutral no-margin-bot" @click="selectUser(user)">
								Select user
							</button>
						</td>
					</tr>
				</table>
			</div>
			<div v-if="noFoundUsers">
				No found users
			</div>

			<!-- SELECTED USER -->
			<div v-if="selectedUser">
				<div v-if="!selectedUserFound">
					Loading user data...
				</div>
				<div v-else>
					<p class="admin-mini-header no-margin-bot margin-top-16">User: {{selectedUser.username}}</p>

					<p>Account created {{prettyDate(selectedUser.createdTime)}}</p>

					<!-- ROLES & DONATOR -->
					<div class="horisontal-flex margin-top-8">
						<label>User type </label>
						<select v-model="selectedUser.userType">
							<option value="normal">Normal</option>
							<option value="moderator">Moderator</option>
							<option value="admin">Admin</option>
						</select>

						<label style="margin-left: 16px;">Donator </label>
						<select v-model="selectedUser.donator">
							<option value=0>No</option>
							<option value=1>Yes</option>
						</select>

						<button @click="submitNewUserData()" 
										:class="{'y-button': true, 'y-button-disabled': !isSelectedUserModified, 'margin-top-2': true}" 
										style="margin-left: 16px; margin-bottom: 0px;">
							Submit changes
						</button>
					</div>
					
					<p class="error-message margin-top-8 margin-bottom-8" v-if="errorMessage">{{errorMessage}}</p>
        	<p class="success-message margin-top-8 margin-bottom-8" v-if="successMessage">{{successMessage}}</p>

					<!-- COMIC VOTES -->
					<p v-if="selectedUserComicVotes.length == 0" class="margin-top-16">
						User has not rated any comics.
					</p>
					<div v-else class="margin-top-16">
						<button class="y-button y-button-neutral button-with-icon" @click="showComicRatings = true" v-if="!showComicRatings">
							<down-arrow/> Show {{selectedUserComicVotes.length}} comic votes
						</button>
						<button class="y-button y-button-neutral button-with-icon" @click="showComicRatings = false" v-if="showComicRatings">
							<up-arrow/> Hide comic votes
						</button>

						<div v-if="showComicRatings" class="scrolling-table-container margin-top-4">
							<table class="y-table y-table-compact" style="margin: auto;">
								<thead>
									<tr>
										<th>Comic name</th>
										<th>Rating</th>
										<th>Date assigned</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="comicRating in selectedUserComicVotes" :key="comicRating.comicName">
										<td>
											<router-link :to="{name: 'comic', params: {'comicName': comicRating.comicName}}" class="underline-link">
												{{comicRating.comicName}}
											</router-link>
										</td>
										<td>{{comicRating.vote}}</td>
										<td>{{prettyDate(comicRating.timestamp)}}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

      <menu-up-icon @click.native="closeComponent" class="mdi-arrow close-component-arrow"/>
    </span>

    <span v-else>
      <menu-down-icon class="mdi-arrow"/>
    </span>
  </div>
</template>

<script>
import SearchIcon from 'vue-material-design-icons/Magnify.vue'
import ModIcon from 'vue-material-design-icons/AccountStar.vue'
import DownArrow from 'vue-material-design-icons/ArrowDown.vue'
import UpArrow from 'vue-material-design-icons/ArrowUp.vue'

import userApi from '../../api/userApi'

export default {
	name: 'userManager',
	
	components: {
		'search-icon': SearchIcon,
		'mod-icon': ModIcon,
		'down-arrow': DownArrow,
		'up-arrow': UpArrow,

	},

  data: function () {
    return {
			isOpen: false,
			userSearchText: '',
			foundUsers: [],
			noFoundUsers: false,
			selectedUser: undefined,
			originalUser: undefined,
			selectedUserComicVotes: undefined,
			selectedUserFound: false,
			showComicRatings: false,
			moderatorUsers: [],
			successMessage: '',
			errorMessage: ''
    }
  },

  methods: {
		async searchForUsers () {
			if (!this.userSearchText) { return }

			this.resetSelectedUser()
			this.resetSearchResults()
		
			let result = await userApi.searchForUsers(this.userSearchText)
			if (result.length > 0) {
				this.foundUsers = result
			}
			else {
				this.noFoundUsers = true
			}
		},

		async fetchModUsers () {
			this.resetSelectedUser()
			this.resetSearchResults()

			let result = (await userApi.getModerators()).result
			this.noFoundUsers = false
			this.foundUsers = result
		},

		async selectUser (user) {
			this.resetSearchResults()
			this.resetSelectedUser()

			this.selectedUser = user
			this.selectedUserComicVotes = await userApi.getUserData(user.id)
			this.selectedUserFound = true
			this.originalUser = {
				userType: this.selectedUser.userType,
				donator: this.selectedUser.donator
			}
		},

		async submitNewUserData () {
			if (this.isSelectedUserModified) {
				this.successMessage = ''
				this.errorMessage = ''
				let response = await userApi.updateUserData(this.selectedUser)
				if (response.success) {
					this.successMessage = `Successfully altered user ${this.selectedUser.username}`
					this.originalUser = {
						userType: this.selectedUser.userType,
						donator: this.selectedUser.donator
					}				
				}
				else {
					this.errorMessage = 'Error altering user'
				}
			}
		},

		resetSearchResults () {
			this.foundUsers = []
			this.noFoundUsers = false
		},

		resetSelectedUser () {
			this.selectedUser = undefined
			this.selectedUserComicVotes = undefined
			this.selectedUserFound = false
			this.originalUser = undefined
			this.showComicRatings = false
		},

		prettyDate (mysqlDateString) {
			return (new Date(mysqlDateString)).toString().substring(0, 15)
		},

    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
	},

	computed: {
		isSelectedUserModified () {
			let result = this.selectedUser
				&& (this.selectedUser.userType !== this.originalUser.userType
				|| Number(this.selectedUser.donator) !== Number(this.originalUser.donator))
			if (this.successMessage && result === true) { this.successMessage = '' } 
			if (this.errorMessage && result === true) { this.errorMessage = '' } 
			return result
		}
	}
}
</script>