<template>
  <div>
    <hr class="mt-16 mb-16">
    <h4 class="mb-8">
      Reward: Supporter list display
    </h4>

    <p>
      Your current tier ($5 and above) places you in the <router-link to="/support" class="underline-link">supporter list</router-link>, with a name and picture of your choice. {{canAddLink ? `You can also add a link of your choice, since you're a $15+ supporter!` : ''}}
    </p>

    <!-- NAME -->
    <p class="mt-16">
      <b>Display name</b>
    </p>
    <p class="mt-4 mb-8" v-if="!isChangingName">
      {{userData.patreonDisplayName || 'None - not shown in list'}}
    </p>

    <div v-if="!isChangingName" class="horizontalFlex flexWrap justifyStart" style="gap: 0.5rem;">
      <button class="y-button"
              @click="() => isChangingName = true">
        {{userData.patreonDisplayName ? 'Change display name' : 'Set display name'}}
      </button>

      <LoadingButton @click="removeName"
                     color="error"
                     :isLoading="removePatreonDisplayName.fetching"
                     text="Remove display name"
                     v-if="userData.patreonDisplayName"/>
    </div>

    <TextInput v-if="isChangingName"
               :value="newName"
               @change="newVal => newName = newVal"
               title="Patron display name"
               textAlign="left"
               style="max-width: 16rem;"
               classes="mt-4"/>

    <ResponseMessage v-if="updatePatreonDisplayName.failed || removePatreonDisplayName.failed"
                     :message="updatePatreonDisplayName.errorMessage || removePatreonDisplayName.errorMessage"
                     messageType="error"
                     @closeMessage="clearErrorMsg"
                     style="margin: 1rem 0"/>

    <div class="horizontalFlex justifyStart mt-8" v-if="isChangingName">
      <button class="y-button y-button-neutral mr-8"
              @click="cancelNewName">
        Cancel
      </button>

      <LoadingButton @click="updateName"
                     :isLoading="updatePatreonDisplayName.fetching"
                     :isDisabled="!newName"
                     text="Set display name"
                     iconType="check"
                     color="primary"/>
    </div>

    <!-- LINK -->
    <span v-if="canAddLink">
      <p class="mt-24">
        <b>Supporter list link</b>
      </p>
      <p class="mt-4 mb-8" v-if="!isChangingLink">
        {{userData.patreonDisplayLink || 'None yet'}}
      </p>

      <div v-if="!isChangingLink" class="horizontalFlex flexWrap justifyStart" style="gap: 0.5rem;">
        <button class="y-button"
                @click="() => isChangingLink = true"
                v-if="!isChangingLink">
          {{userData.patreonDisplayLink ? 'Change link' : 'Add link'}}
        </button>

        <LoadingButton @click="removeLink"
                       :isLoading="removePatreonDisplayLink.fetching"
                       color="error"
                       text="Remove link"
                       v-if="userData.patreonDisplayLink"/>
      </div>

      <div class="themeBox" v-if="isChangingLink">
        <p>
          Links must start with http:// or https://.
        </p>
        <p class="mt-16">
          Links are reviewed before they become publicly visible in the supporter list. Do not submit offensive, harmful, or otherwise problematic links. If your link is rejected - either due to a violation of the above, or because the link does not work - this field will be cleared.
        </p>
      </div>

      <TextInput v-if="isChangingLink"
                :value="newLink"
                @change="newVal => newLink = newVal"
                title="Supporter list display link (max 100 char.)"
                textAlign="left"
                style="min-width: 20rem;"
                classes="mt-8"/>

      <ResponseMessage v-if="updatePatreonDisplayLink.failed"
                       :message="updatePatreonDisplayLink.errorMessage"
                       messageType="error"
                       @closeMessage="clearErrorMsg"
                       style="margin: 1rem 0"/>

      <div class="horizontalFlex justifyStart mt-16" v-if="isChangingLink">
        <button class="y-button y-button-neutral mr-8"
                @click="cancelNewLink">
          Cancel
        </button>

        <LoadingButton @click="updateLink"
                      :isLoading="updatePatreonDisplayLink.fetching"
                      :isDisabled="!newLink"
                      text="Set link"
                      iconType="check"
                      color="primary"/>
      </div>
    </span>

    <!-- PICTURE -->
    <p class="mt-24">
      <b>Picture</b>
    </p>
    <p v-if="userData.hasPatreonPicture && !isPictureReadyForCrop" class="mt-4 mb-4">
      <img :src="`${config.patreonBaseUrl}/${userData.id}.jpg`" class="roundImage"/>
    </p>
    <p v-else-if="!isAddingPicture" class="mt-4 mb-4">
      None yet
    </p>

    <div v-if="!isAddingPicture" class="horizontalFlex flexWrap justifyStart" style="gap: 0.5rem;">
      <button class="y-button"
              @click="() => isAddingPicture = true">
        {{userData.hasPatreonPicture ? 'Change' : 'Add'}} picture
      </button>

      <LoadingButton @click="removePicture"
                     :isLoading="removePatreonPicture.fetching"
                     color="error"
                     text="Remove picture"
                     v-if="userData.hasPatreonPicture"/>
    </div>


    <ResponseMessage v-if="updatePatreonPicture.failed || removePatreonPicture.failed"
                     :message="updatePatreonPicture.errorMessage || removePatreonPicture.errorMessage"
                     messageType="error"
                     @closeMessage="clearPictureErrorMessages"
                     style="margin: 1rem 0"/>

    <ResponseMessage :message="cropErrorMessage" messageType="error" @closeMessage="clearPictureErrorMessages"/>

    <ImageCropper buttonText="Select new file (click/drop)"
                  @imageReady="isReady => isPictureReadyForCrop = isReady"
                  @handleImage="submitProfilePic" 
                  @cancel="cancelProfilePicChange"
                  @cropError="errMsg => cropErrorMessage = errMsg"
                  @readyForCrop="() => isPictureReadyForCrop = true"
                  :isSubmitting="updatePatreonPicture.fetching"
                  v-if="1 && isAddingPicture"/>

    <p class="mt-16">
      No harmful or offensive names or images. Explicit images are allowed.
    </p>

    <hr class="mt-16 mb-16">
  </div>
</template>

<script>
import TextInput from '@/components/TextInput.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import { mapGetters } from 'vuex'
import { doFetch, fetchClear } from '@/utils/statefulFetch'
import patreonApi from '@/api/patreonApi'
import ResponseMessage from '@/components/ResponseMessage.vue'
import ImageCropper from '@/components/ImageCropper.vue'
import config from '@/config.json'

export default {
  props: {
    userData: Object,
    canAddLink: Boolean,
  },
  
  components: {
    TextInput, LoadingButton, ResponseMessage,
    ImageCropper,
  },

  computed: {
    ...mapGetters([
      'updatePatreonDisplayName', 'removePatreonDisplayName',
      'updatePatreonDisplayLink', 'removePatreonDisplayLink',
      'updatePatreonPicture', 'removePatreonPicture',
    ])
  },

  data () {
    return {
      config,
      isChangingName: false,
      isChangingLink: false,
      isAddingPicture: false,
      newName: this.userData.patreonDisplayName || '',
      newLink: this.userData.patreonDisplayLink || '',
      isPictureReadyForCrop: false,
      cropErrorMessage: '',
    }
  },

  methods: {
    async updateName () {
      let result = await doFetch(this.$store.commit, 'updatePatreonDisplayName', patreonApi.udatePatreonDisplayName(this.newName))
      if (result) {
        this.$store.commit('setUserData', result)
        this.isChangingName = false
        this.newName = result.patreonDisplayName || ''
      }
    },

    async removeName () {
      let result = await doFetch(this.$store.commit, 'removePatreonDisplayName', patreonApi.removePatreonDisplayName())
      if (result) {
        this.$store.commit('setUserData', result)
        this.newName = result.patreonDisplayName || ''
      }
    },

    async updateLink () {
      let result = await doFetch(this.$store.commit, 'updatePatreonDisplayLink', patreonApi.udatePatreonDisplayLink(this.newLink))
      if (result) {
        this.$store.commit('setUserData', result)
        this.isChangingLink = false
        this.newLink = result.patreonDisplayLink || ''
      }
    },

    async removeLink () {
      let result = await doFetch(this.$store.commit, 'removePatreonDisplayLink', patreonApi.removePatreonDisplayLink())
      if (result) {
        this.$store.commit('setUserData', result)
        this.newLink = result.patreonDisplayLink || ''
      }
    },

    cancelNewName () {
      this.isChangingName = false
      this.newName = this.userData.patreonDisplayName || ''
      this.clearErrorMsg()
    },

    cancelNewLink () {
      this.isChangingLink = false
      this.newLink = this.userData.patreonDisplayLink || ''
      this.clearErrorMsg()
    },

    clearErrorMsg () {
      fetchClear(this.$store.commit, 'updatePatreonDisplayName')
      fetchClear(this.$store.commit, 'removePatreonDisplayName')
      fetchClear(this.$store.commit, 'updatePatreonDisplayLink')
    },

    cancelProfilePicChange () {
      this.isAddingPicture = false
      this.isPictureReadyForCrop = false
    },

    async submitProfilePic (newPic) {
      let result = await doFetch(this.$store.commit, 'updatePatreonPicture', patreonApi.updatePatreonPicture(newPic.file))
      if (result) {
        this.$store.commit('setUserData', result)
        this.cancelProfilePicChange()
      }
    },

    async removePicture () {
      let result = await doFetch(this.$store.commit, 'removePatreonPicture', patreonApi.removePatreonPicture())
      if (result) {
        this.$store.commit('setUserData', result)
      }
    },

    clearPictureErrorMessages () {
      fetchClear(this.$store.commit, 'updatePatreonPicture')
      fetchClear(this.$store.commit, 'removePatreonPicture')
      this.cropErrorMessage = ''
    }
  }
}
</script>

<style>

</style>