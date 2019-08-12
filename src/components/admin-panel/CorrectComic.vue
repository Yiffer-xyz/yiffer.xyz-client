<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Correct comic data</h2>
    <span class="admin-content-box-inner" v-if="isOpen">
      <div class="horizontal-flex flex-wrap" style="margin-top: 8px;">
        <p class="admin-mini-header" style="margin-right: 8px;">Comic:</p>
        <select v-model="comic">
          <option v-for="comic in comicList" :key="comic.id" :value="comic">
            {{comic.name}}
          </option>
        </select>
        <router-link :to="{name: 'comic', params: {'comicName': comic.name}}" v-if="comic"
                     style="margin-left: 8px;" target="_blank" class="underline-link">
          Go to comic <right-arrow/>
        </router-link>
      </div>

      <span v-if="comic" class="margin-top-8" style="width: 100%;">
				<button @click="toggleRename(true)" v-if="!renameActive" class="y-button y-button-neutral margin-bottom-16">Rename comic</button>
				<span v-if="renameActive" class="horizontal-flex margin-bottom-16" style="align-items: center;">
					<input type="text" v-model="newComicName" style="width: 240px; height: 18px;"/>
					<button @click="toggleRename(false)" class="y-button y-button-neutral no-margin-bot" style="margin-left: 8px;"><cross-icon/> Cancel rename</button>
				</span>
				

        <div class="horizontal-flex horiz-space-items-8px" style="flex-wrap: wrap;">
          <div class="vertical-flex">
            <p style="text-align: left;">Artist</p>
            <select v-model="artist">
              <option v-for="artist in artistList" :key="artist.name" :value="artist.name">
                {{artist.name}}
              </option>
            </select>
          </div>

          <div class="vertical-flex">
            <p style="text-align: left;">Category</p>
            <select v-model="tag">
              <option value="Furry">Furry</option>
              <option value="MLP">MLP</option>
              <option value="Pokemon">Pokemon</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="vertical-flex">
            <p style="text-align: left;">Classification</p>
            <select v-model="cat">
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="MF">MF</option>
              <option value="MM">MM</option>
              <option value="FF">FF</option>
              <option value="MF+">MF+</option>
              <option value="I">I</option>
            </select>
          </div>
          
          <div class="vertical-flex">
            <p style="text-align: left;">Finished</p>
            <select v-model="finished">
              <option value="true">Finished</option>
              <option value="false">Unfinished</option>
            </select>
          </div>
        </div>

        <!-- PREVIOUS COMIC -->
        <p class="admin-mini-header" style="margin-top: 32px;">Add previous or next comic</p>
          <p>Previous comic 
          </p>
        <div class="horizontal-flex horiz-space-items-8px" style="align-items: center; flex-wrap: wrap;">
            <select v-model="previousComic">
              <option v-for="comic in comicList" :key="comic.id" :value="comic">
                {{comic.name}}
              </option>
            </select>
          <button v-if="previousComic" class="y-button y-button-neutral button-with-icon" 
                  style="margin-left: 4px;" @click="removePreviousLink()">
            <cross-icon/> remove link
          </button>
        </div>
        <!-- NEXT COMIC -->
        <p class="margin-top-4">Next comic</p>
        <div class="horizontal-flex horiz-space-items-8px" style="align-items: center; flex-wrap: wrap;">
            <select v-model="nextComic">
              <option v-for="comic in comicList" :key="comic.id" :value="comic">
                {{comic.name}}
              </option>
            </select>
          <button v-if="nextComic" class="y-button y-button-neutral button-with-icon"
                  style="margin-left: 4px;" @click="removeNextLink()">
            <cross-icon/> remove link
          </button>
        </div>

				<span class="horizontal-flex no-margin-bot" style="margin-top: 16px;">
        	<button @click="submitChanges()" class="y-button" style="margin-right: 4px;">
            Submit changes
          </button>
        	<button @click="resetFields()"
                  class="y-button y-button-neutral button-with-icon" style="margin-left: 4px;">
            <refresh-icon/> Reset
          </button>
				</span>
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
import CrossIcon from 'vue-material-design-icons/Close.vue'
import RefreshIcon from 'vue-material-design-icons/Refresh.vue'
import RightArrow from 'vue-material-design-icons/ArrowRight.vue'

import comicApi from '../../api/comicApi'

export default {
	name: 'correctComic',
	
	components: {
		'cross-icon': CrossIcon,
		'refresh-icon': RefreshIcon,
		'right-arrow': RightArrow,
	},

  props: {
    comicList: Array,
    artistList: Array,
  },

  data: function () {
    return {
			renameActive: false,
			newComicName: '',
      isOpen: false,
      comic: undefined,
      artist: undefined,
      tag: undefined,
      cat: undefined,
      finished: undefined,
      lastComicId: undefined,
      originalPreviousComic: undefined,
      originalNextComic: undefined,
      previousComic: undefined,
      nextComic: undefined,

      errorMessage: '',
      successMessage: '',
    }
  },

  methods: {
    async submitChanges () {
      let response = await comicApi.updateComic({
				id: this.comic.id,
				name: (this.renameActive && this.newComicName.length>0) ? this.newComicName : this.comic.name,
				oldName: this.comic.name,
				cat: this.cat,
				tag: this.tag,
				finished: this.finished=='true' ? 1 : 0,
        artist: this.artist,
        previousComic: this.previousComic ? this.previousComic.id : null,
        nextComic: this.nextComic ? this.nextComic.id : null
			})

      if (response.success) {
        this.successMessage = 'Successfully updated info of ' + this.comic.name
				this.errorMessage = ''
				this.toggleRename(false)
				this.lastComicId = this.comic.id
				this.$emit('refresh-comic-list')
      }
      else {
        this.errorMessage = 'Error updating comic: ' + response.message
        this.successMessage = ''
      }
		},
		
		toggleRename (isActive) {
			this.renameActive = isActive
			if (!isActive) { this.newComicName = '' }
    },
    
    removePreviousLink () {
      this.previousComic = undefined
    },

    removeNextLink () {
      this.nextComic = undefined
    },

		resetFields () {
			this.tag = this.comic.tag + ''
			this.cat = this.comic.cat + ''
			this.finished = this.comic.finished ? 'true' : 'false'
      this.artist = this.comic.artist + ''
      this.nextComic = this.originalNextComic + ''
      this.previousComic = this.originalPreviousComic + ''
      this.toggleRename(false)
      this.findComicLinks()      
    },
    
    async findComicLinks () {
      let comicData = await comicApi.getComic(this.comic.name)
      this.previousComic = comicData.result.previousComic ? 
        this.comicList.find(c => c.name === comicData.result.previousComic)
        : undefined
      this.nextComic = comicData.result.nextComic ? 
        this.comicList.find(c => c.name === comicData.result.nextComic)
        : undefined
      this.originalPreviousComic = this.previousComic + ''
      this.originalNextComic = this.nextComic + ''
    },

    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },

  watch: {
    comic () {
      if (this.comic) { this.resetFields() }
		},

		comicList () {
			this.comic = this.comicList.find(c => c.id===this.lastComicId)
		} 
  },
}
</script>

<style lang="scss">
.horiz-space-items-8px {
  &>div {
    margin: 0px 8px;
  }
}
</style>
