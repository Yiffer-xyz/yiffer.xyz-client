<template>
	<span>
		<vue-headful :title="'Pending: ' + $route.params.comicName + ' - Yiffer.xyz'"/>
		<h1>Pending: {{$route.params.comicName}}</h1>
		<span v-if="comic">

			<router-link :to="'/admin'">
				<back-arrow/> back to admin
			</router-link>

			<h2>Thumbnail</h2>
			<span v-if="comic.hasThumbnail">
				<img :src="`https://yiffer.xyz/comics/${comic.name}/s.jpg`"/>
			</span>
			<span style="display: flex; align-items: center; flex-direction: column;">
				<p v-if="!comic.hasThumbnail">There is no thumbnail yet! Help out by adding one? Find the guidelines in the mod panel's Adding new comic section.</p>
				<form enctype="multipart/form-data" novalidate style="width: fit-content" class="margin-top-8">
					<div class="pretty-input-upload">
						<input type="file" multiple="false" @change="processFileUploadChange" id="newPageFiles" accept="image/x-png,image/jpeg" class="input-file"/>
						<p v-if="!comic.hasThumbnail">Select file</p>
						<p v-else>Upload new thumbnail</p>
					</div>
				</form>
				<button v-if="thumbnailFile" @click="processNewThumbnail()" class="y-button margin-top-8">
					Add {{thumbnailFile.name}} as thumbnail
				</button>

				<p class="error-message margin-top-8" v-if="errorMessageThumbnail">{{errorMessageThumbnail}}</p>
				<p class="success-message margin-top-8" v-if="successMessageThumbnail">{{successMessageThumbnail}}</p>
				<p class="success-message margin-top-8" v-if="thumbnailUploading">Please wait, uploading...</p>
			</span>


			<h2 class="margin-top-32">Tags</h2>
			<p v-if="comic.keywords.length === 0">No tags have been added.</p>
      <div class="horizontal-flex" style="width: 100%; margin-top: 8px;">
        <div class="vertical-flex" style="margin: 0 12px 0 0;">
          <p class="admin-mini-header">Tag list</p>
          <select size="13" style="margin-bottom: 0" v-model="selectedKeyword" @keyup.13="addSelectedKeyword()"> 
            <option v-for="keyword in keywordsNotInComic" :key="keyword.keyword" :value="keyword.keyword">{{keyword.keyword}}</option>
          </select>
          <button class="y-button y-button-small y-button-neutral" @click="addSelectedKeyword()">&rarr;</button>
        </div>
      
        <div class="vertical-flex" style="margin: 0 12px 0 12px;">
          <p class="admin-mini-header">Tags you're adding</p>
          <p v-if="selectedKeywords.length > 0" style="margin-bottom: 6px;">Click tag to <span class="red-color">remove</span></p>
          <p v-for="keyword in selectedKeywords" @click="removeKeywordFromSelection(keyword)" 
             :key="keyword" class="selected-add-keyword">{{keyword}}</p>
          <button class="y-button" v-if="selectedKeywords.length > 0"
                  @click="confirmAddKeywords()" style="margin-top: 6px;">
            Add tags
          </button>
        </div>
      
        <div class="vertical-flex" style="margin: 0 0 0 12px;">
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
      <p class="error-message" v-if="errorMessageKeywords" style="margin-top: 8px;">{{errorMessageKeywords}}</p>
      <p class="success-message" v-if="successMessageKeywords" style="margin-top: 8px;">{{successMessageKeywords}}</p>

			

			<h2 class="margin-top-32">Comic pages</h2>
			<button @click="fitImages('full')" class="y-button y-button-neutral" style="margin: 4px;">Full size</button>
			<button @click="fitImages('fit')" class="y-button y-button-neutral" style="margin: 4px;">Fit images to page</button>
			<button @click="fitImages('small')" class="y-button y-button-neutral" style="margin: 4px;">Small</button>
			<br/>
			<img  
				v-for="pageNumber in comic.numberOfPages" 
				:src="`/comics/${comic.name}/${formattedPageNumber(pageNumber)}.jpg`"
				:key="pageNumber"
				:class="['comic-page', 'image-fit-full', 'comic-page-pending']"/>

			<br/>
			<button class="y-button y-button-neutral margin-bottom-16" @click="scrollToTop()"><up-arrow/> to top</button>
		</span>
		<span v-if="comicLoadErrorMessage">
			<p class="error-message margin-top-32">{{comicLoadErrorMessage}}</p>
		</span>
	</span>
</template>

<script>
import UpArrow from 'vue-material-design-icons/ArrowUp.vue'
import BackArrow from 'vue-material-design-icons/Undo.vue'

import comicApi from '../api/comicApi'
import keywordApi from '../api/keywordApi'

export default {
	name: 'pendingComic',

	components: {
		'up-arrow': UpArrow,
		'back-arrow': BackArrow,
	},

	data: function () {
		return {
			comic: undefined,
			keywordsNotInComic: [],
      selectedKeyword: undefined,
			selectedKeywords: [],
			keywordsToDelete: [],
			thumbnailFile: undefined,
			errorMessageThumbnail: '',
			successMessageThumbnail: '',
			thumbnailUploading: false,
			errorMessageKeywords: '',
			successMessageKeywords: '',
			comicLoadErrorMessage: '',
		}
	},

	methods: {
    processFileUploadChange (changeEvent) {
      this.thumbnailFile = changeEvent.target.files[0]
		},
		
		async processNewThumbnail () {
			this.successMessageThumbnail = ''
			this.errorMessageThumbnail = ''
			let fileReader = new FileReader()
			fileReader.onload = () => {
				let tempImage = new Image()
				tempImage.src = fileReader.result
				tempImage.onload = () => {
					if (tempImage.width !== 200 || tempImage.height !== 283) {
						this.errorMessageThumbnail = `Sorry, the image does not match the 200x283 pixel requirement (is ${tempImage.width}x${tempImage.height}).`
					}
					else {
						this.uploadThumbnailImage()
					}
				}
			}
			fileReader.readAsDataURL(this.thumbnailFile)
		},

		async uploadThumbnailImage () {
			this.thumbnailUploading = true
			let response = await comicApi.addThumbnailToPendingComic(this.comic.id, this.thumbnailFile)
			this.thumbnailUploading = false
			if (response.success) {
				this.successMessageThumbnail = 'Success adding thumbnail!'
				this.reloadComic()
				this.thumbnailFile = undefined
			}
			else {
				this.errorMessageThumbnail = 'Error adding thumbnail: ' + response.message
			}
		},

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
        this.successMessageKeywords = 'Successfully added tags!'
				this.errorMessageKeywords = ''
        this.selectedKeywords = []
				this.reloadComic()
      }
      else {
        this.errorMessageKeywords = 'Error adding tags: ' + response.message
        this.successMessageKeywords = ''
      }
		},

    async confirmRemoveKeywords () {
      let response = await keywordApi.removeKeywordsFromComic(this.comic, this.keywordsToDelete)

      if (response.success) {
        this.successMessageKeywords = 'Successfully removed tags!'
        this.errorMessageKeywords = ''
        this.keywordsToDelete = []
        this.reloadComic()
      }
      else {
        this.errorMessageKeywords = 'Error removing tags: ' + response.message
        this.successMessageKeywords = ''
      }
    },

		fitImages (fit) {
			document.querySelectorAll('.comic-page').forEach(page => {
				page.classList.remove('image-fit-full')
				page.classList.remove('image-fit-small')
				if (fit === 'fit') {
					page.classList.add('image-fit-full')
				}
				else if (fit === 'small') {
					page.classList.add('image-fit-small')
				}
			})
		},

		async reloadComic () {
			let response = await comicApi.getPendingComic(this.$route.params.comicName)
			if (response.success) {
				this.comic = response.result
				this.keywordsNotInComic = (await keywordApi.getKeywordList()).filter(kw => this.comic.keywords.indexOf(kw.keyword) === -1)
			}
			else {
				this.comicLoadErrorMessage = response.message
			}
		},

		formattedPageNumber: pageNumber => pageNumber<10 ? '0'+pageNumber : pageNumber,
		
		scrollToTop () {
			window.scrollTo(0, 0)
		}
	},

	async created () {
		this.reloadComic()
	}
}
</script>

<style lang="scss">
.image-fit-full {
	max-width: 100vw;
	max-height: 100vh;
}
.image-fit-small {
	max-width: 240px;
	max-width: 240px;
}
.comic-page-pending {
	margin: 6px;
}
</style>
