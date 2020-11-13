<template>
  <div style="width: 100%">

    <h1 class="margin-bottom-8">Account: {{$store.getters.userData.username}}</h1>
    <BackToIndex style="margin: auto;"/>

    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"
                     class="margin-bottom-10 margin-top-10"/>

    <div :class="ads.length>0 ? 'full-width-text' : 'smaller-width-text'">
      <button v-if="!isChangingPassword"
              @click="isChangingPassword=true"
              class="y-button y-button-neutral margin-top-16"
              style="width: fit-content;">
        Change password
      </button>

      <div v-if="isChangingPassword" class="margin-top-16">
        <p class="bold">Change password</p>
        <table id="changePasswordTable">
          <tr>
            <td><label>Current password: </label> </td>
            <td><input v-model="currentPassword" type="password" class="margin-top-4"/></td>
          </tr>
          <tr>
            <td><label>New password: </label></td>
            <td><input v-model="newPassword1" type="password" class="margin-top-4"/></td>
          </tr>
          <tr>
            <td><label>Repeat new password: </label></td>
            <td><input v-model="newPassword2" type="password" class="margin-top-4"/></td>
          </tr>
        </table>

        <div style="margin: 4px auto 0 auto; width: fit-content;">
          <button @click="cancelChangePassword"
                  class="y-button y-button-neutral">
            Cancel
          </button>

          <button @click="submitChangePassword"
                  class="y-button" 
                  style="width: fit-content; margin-left: 8px;">
            Change password
          </button>
        </div>
      </div>

      <div class="margin-top-16" v-show="!isChangingPassword">
        <p><span class="bold">Donator</span>: {{$store.getters.userData.donator ? 'Yes' : 'No'}}</p>
      </div>

      <div class="margin-top-16" v-show="!isChangingPassword">
        <p class="bold">Tag blacklist</p>
        <p style="font-style: italic; margin-top: 0;">Coming soon!</p>
      </div>

      <div class="margin-top-16"
           v-show="showModApplicationStatus">
        <p class="bold">Mod application status</p>
        <p class="mt-0" v-if="modApplicationStatus === modApplicationStatuses.pending">
          Pending review
        </p>
        <p class="mt-0" v-else-if="modApplicationStatus === modApplicationStatuses.waiting">
          Your application looks promising, but we're full at the moment, or will take some time deciding. You can consider this a "waiting list" of sorts. We won't guarantee that you'll get a mod spot, but your application is not rejected. We will contact you on Telegram should we decide to include you as a mod.
        </p>
        <p class="mt-0" v-else-if="modApplicationStatus === modApplicationStatuses.removed">
          Sorry, your application has been rejected. This is most likely because there were simply more mods with better capabilities applying. Thank you for wanting to contribute though!
        </p>
      </div>

      <div v-if="(ads.length > 0 || adLoadingState==='error') && !isChangingPassword">
        <h3 class="mt-16">Advertising</h3>

        <ResponseMessage :message="responseMessageAds" :messageType="responseMessageTypeAds" @closeMessage="closeResponseMessageAds"
                         class="mb-8" style="margin-left: 0;"/>

        <p v-if="adLoadingState==='error'">
          Error fetching ads
        </p>

        <div v-if="adLoadingState==='success'">
          <p>To pay or renew, send the specified amount of USD to <span class="bold">TODO@paypal.com</span>, and <span class="bold">make sure to include the ad's ID in the message field!</span> You should not pay unless the status of an ad is <span class="monoWarning">AWAITING PAYMENT</span> or <span class="monoWarning">ACTIVE, AWAITING RENEWAL PAYMENT</span>. After paying, please wait a few days for the admins to process your payment and update the status of your ads. If you suspect that something has gone wrong, do not hesitate to contact us at MAIL@MAIL.COM</p>

          <div v-for="ad in ads" :key="ad.id" class="singleReklame simpleShadowNoHover">
            <div style="display: flex; justify-content: space-between;">
              <p>Id: <span class="bold">{{ad.id}}</span></p>
              <button v-if="ad.status === 'NEEDS CORRECTION' && !isThisAdBeingEdited(ad.id)" @click="startAdEditing(ad)" class="y-button">
                Edit ad
              </button>
              <div v-if="isThisAdBeingEdited(ad.id) && !isAwaitingCorrectionResponse">
                <button @click="cancelAdEditing()" class="y-button y-button-neutral">
                  Cancel
                </button>
                <button @click="saveEditedAd()" :class="{'y-button-disabled': !isUpdatedAdReadyForSubmit}" class="y-button ml-8">
                  Save
                </button>
              </div>
              <Loading v-if="isThisAdBeingEdited(ad.id) && isAwaitingCorrectionResponse" text="Updating..."/>
            </div>
            <p :class="getAdStatusClass(ad.status)" class="mb-10">
              {{ad.status}}
            </p>

            <span v-if="!isThisAdLoading(ad.id)">
              <p>Type: {{ad.adTypeLong}}</p>
              <p>Price: {{ad.price}}$</p>
              <p v-if="showAdActivePeriod(ad.status)">
                Active: {{formatTimestamp(ad.activationDate)}} to {{formatTimestamp(ad.deactivationDate)}} 
                <span v-if="ad.status === 'ACTIVE, RENEWAL PAID'">
                  (renewal paid, will renew on {{formatShortTimestamp(ad.deactivationDate)}})
                </span>
              </p>

              <button @click="toggleRenewal(ad, true)" v-if="ad.status === 'ACTIVE'" class="y-button y-button-neutral mt-8">
                Turn on renewal
              </button>
              <button @click="toggleRenewal(ad, false)" v-if="ad.status === 'ACTIVE, AWAITING RENEWAL PAYMENT'" class="y-button y-button-neutral mt-8">
                Cancel renewal
              </button>

              <p class="mt-8">
                Clicks: {{ad.clicks}}
              </p>

              <p v-if="!isThisAdBeingEdited(ad.id)" class="mt-8">
                Link: <i>{{ad.link}}</i>
              </p>
              <div v-else class="mt-8">
                <p>Link: </p>
                <input v-model="adBeingEdited.link" type="text" class="adInput"/>
              </div>

              <p v-if="ad.mainText && !isThisAdBeingEdited(ad.id)" class="mt-8">
                Main text: <i>{{ad.mainText}}</i>
              </p>
              <div v-else-if="isThisAdBeingEdited(ad.id) && doesAdHaveText(ad)" class="mt-8">
                <p>Main text: </p>
                <input v-model="adBeingEdited.mainText" type="text" class="adInput"/>
                <p v-if="adBeingEdited.mainText" class="smaller-text" :class="{'red-color': remainingCharsMainText<0}">
                  {{remainingCharsMainText}} characters left
                </p>
              </div>

              <p v-if="ad.secondaryText && !isThisAdBeingEdited(ad.id)" class="mt-8">
                Secondary text: <i>{{ad.secondaryText}}</i>
              </p>
              <div v-else-if="isThisAdBeingEdited(ad.id) && doesAdHaveText(ad)" class="mt-8">
                <p>Secondary text: </p>
                <input v-model="adBeingEdited.secondaryText" type="text" class="adInput"/>
                <p v-if="adBeingEdited.secondaryText" class="smaller-text" :class="{'red-color': remainingCharsSecondaryText<0}">
                  {{remainingCharsSecondaryText}} characters left
                </p>
              </div>

              <div v-if="!isThisAdBeingEdited(ad.id)" class="mt-8">
                <a :href="`${config.paidImagesDirectory}/${ad.id}.${ad.filetype}`" target="_blank" class="underline-link">
                  See media<RightArrow/>
                </a>
              </div>
              <form v-else class="mt-8">
                <p>Change media? If not, ignore this and the current one will be kept.</p>
                <div class="horizontalFlexLeft flexWrap mt-4">
                  <div class="pretty-input-upload mr-8">
                    <input type="file" @change="processFileUploadChange" id="cardAdFile" accept="image/x-png,image/gif,image/jpeg" class="input-file"/>
                    <p>Replace file</p>
                  </div>
                  <p v-if="file" class="alignSelfCenter bold" style="word-break: break-all;">
                    Selected: {{file.name}}
                  </p>
                </div>

                <p v-if="fileErrorMessage" class="red-color mt-4 bold">
                  {{fileErrorMessage}}
                </p>
                <p v-else-if="file" class="mt-4">
                  <CheckIcon/> File matches size requirements.
                </p>
              </form>
            </span>
            <Loading v-else class="mt-16"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authApi from '../api/authApi'
import miscApi from '../api/miscApi'
import config from '@/config.json'

import ResponseMessage from '@/components/ResponseMessage.vue'
import BackToIndex from '@/components/BackToIndex.vue'
import Loading from '@/components/LoadingIndicator.vue'
import advertisingApi from '../api/advertisingApi'

import RightArrow from 'vue-material-design-icons/ArrowRight.vue'
import CheckIcon from 'vue-material-design-icons/CheckCircle.vue'
import { format } from 'date-fns'

import { mapGetters } from 'vuex'

const MOD_APPLICATION_STATUSES = {
  loading: 'loading',
  none: 'none',
  pending: 'pending',
  waiting: 'waiting',
  removed: 'removed'
}

export default {
  name: 'account',

  components: {
    BackToIndex, ResponseMessage, Loading,
    CheckIcon, RightArrow,
  },

  data: function () {
    return {
      isChangingPassword: false,
      currentPassword: '',
      newPassword1: '',
      newPassword2: '',
      ads: [],
      adLoadingState: 'initial',
      adLoadingId: null,
      adBeingEdited: null,
      file: null,
      fileErrorMessage: '',
      isAwaitingCorrectionResponse: false,
      responseMessageAds: '',
      responseMessageTypeAds: 'info',
      responseMessage: '',
      responseMessageType: 'info',
      modApplicationStatus: MOD_APPLICATION_STATUSES.loading,
      modApplicationStatuses: MOD_APPLICATION_STATUSES,
      config,
    }
  },

  methods: {
    async submitChangePassword () {
      if (!this.currentPassword || !this.newPassword1 || !this.newPassword2) {
        this.responseMessage = 'Please fill in all fields'
        this.responseMessageType = 'error'
        return
      }
      else if (this.newPassword1 != this.newPassword2) {
        this.responseMessage = 'New passwords do not match'
        this.responseMessageType = 'error'
        this.newPassword1 = ''
        this.newPassword2 = ''
        return
      }

      let response = await authApi.changePassword(this.currentPassword, this.newPassword1, this.newPassword2)
      if (response.success) {
        this.responseMessage = 'Password changed successfully!'
        this.responseMessageType = 'success'
        this.cancelChangePassword()
      }
      else {
        this.responseMessage = `Error changing password: ${response.message}`
        this.responseMessageType = 'error'
      }
    },

    cancelChangePassword () {
      this.currentPassword = ''
      this.newPassword1 = ''
      this.newPassword2 = ''
      this.isChangingPassword = false
    },

    startAdEditing (ad) {
      this.adBeingEdited = {...ad}
    },

    async cancelAdEditing () {
      this.adBeingEdited = null
      this.file = null
      this.fileErrorMessage = ''
      this.responseMessageAds = ''
    },

    async saveEditedAd () {
      if (!this.isUpdatedAdReadyForSubmit) { return }
      
      this.isAwaitingCorrectionResponse = true
      let response = await advertisingApi.updateAdNeedingCorrection(
        this.adBeingEdited.id, this.adBeingEdited.link, this.adBeingEdited.mainText,
        this.adBeingEdited.secondaryText, this.file
      )
      this.isAwaitingCorrectionResponse = false

      if (response.success) {
        let adIndex = this.ads.findIndex(ad => ad.id === response.ad.id)
        this.$set(this.ads, adIndex, response.ad)
        this.cancelAdEditing()
        this.responseMessageTypeAds = 'success'
        this.responseMessageAds = `Successfully updated ${response.ad.id}`
      }
      else {
        this.responseMessageTypeAds = 'error'
        this.responseMessageAds = response.message
      }
    },

    processFileUploadChange (changeEvent) {
      this.file = changeEvent.target.files[0]
      this.checkFileRequirements()
    },

		async checkFileRequirements () {
      if (!this.file) { return }
      this.fileErrorMessage = ''

			let fileReader = new FileReader()
			fileReader.onload = () => {
				let tempImage = new Image()
				tempImage.src = fileReader.result
				tempImage.onload = () => {
          if (this.isEditedAdCard) {
            if (tempImage.width !== 200 || tempImage.height !== 283) {
              this.fileErrorMessage = `The file does not match the 200x283 pixel requirement (is ${tempImage.width}x${tempImage.height}).`
            }
          }
          else if (this.isEditedAdBanner) {
            if (tempImage.width !== 680 || tempImage.height !== 100) {
              this.fileErrorMessage = `The file does not match the 680x100 pixel requirement (is ${tempImage.width}x${tempImage.height}).`
            }
          }
				}
			}
			fileReader.readAsDataURL(this.file)
		},

    async toggleRenewal (ad, shouldRenew) {
      this.responseMessageAds = ''
      this.adLoadingId = ad.id
      let result = await advertisingApi.toggleRenewal(ad.id, shouldRenew)
      this.adLoadingId = null

      if (result.success) {
        this.getAds()
      }
      else {
        this.responseMessageTypeAds = 'error'
        this.responseMessageAds = result.message
      }
    },

    showAdActivePeriod (status) {
      return ['ACTIVE SOON', 'ACTIVE', 'ACTIVE, AWAITING RENEWAL PAYMENT', 'ACTIVE, RENEWAL PAID', 'ENDED'].includes(status)
    },

    getAdStatusClass (status) {
      if (['PENDING', 'ACTIVE SOON'].includes(status)) {
        return 'monoInfo'
      }
      else if (['NEEDS CORRECTION', 'AWAITING PAYMENT', 'ACTIVE, AWAITING RENEWAL PAYMENT '].includes(status)) {
        return 'monoWarning'
      }
      else if (status === 'ENDED') {
        return 'monoError'
      }
      else {
        return 'monoSuccess'
      }
    },

    toggleMediaVisibility (ad) {
      ad.showMedia = true
    },

    async getAds () {
      this.ads = []
      this.responseMessageAds = ''

      let response = await advertisingApi.getMyAds(this.$store.getters.userData.id)
      if (response.success) {
        this.ads = response.ads
        this.adLoadingState = 'success'
      }
      else {
        this.adLoadingState = 'error'
      }
    },

    async getModApplicationStatus () {
      let { success, applicationStatus }  = await miscApi.getMyModApplicationStatus()
      if (success) { 
        this.modApplicationStatus = applicationStatus
      }
      else {
        this.modApplicationStatus = MOD_APPLICATION_STATUSES.none
      }
    },
    
    isThisAdLoading (adId) {
      return this.adLoadingId === adId
    },

    isThisAdBeingEdited (adId) {
      return this.adBeingEdited && this.adBeingEdited.id === adId
    },

    doesAdHaveText (ad) {
      return ad.adType === 'card2M' || ad.adType === 'card4M'
    },

    formatTimestamp (timestamp) {
      if (!timestamp) { return '' }
      return format(new Date(timestamp), 'MMM do yyyy')
    },

    formatShortTimestamp (timestamp) {
      return format(new Date(timestamp), 'MMM do')
    },

    closeResponseMessage () { this.responseMessage = '' },
    closeResponseMessageAds () { this.responseMessageAds = '' },
  },

  computed: {
    isEditedAdCard () {
      return this.adBeingEdited.adType === 'card2M' || this.adBeingEdited.adType === 'card4M'
    },

    isEditedAdBanner () {
      return this.adBeingEdited.adType === 'banner1M'
    },

    isUpdatedAdReadyForSubmit () {
      if (this.isEditedAdCard) {
        return this.remainingCharsMainText>=0 
          && this.adBeingEdited.mainText.length > 0
          && this.remainingCharsSecondaryText>=0
          && !this.fileErrorMessage
      }

      return !this.fileErrorMessage
    },

    remainingCharsMainText () {
      return 25 - this.adBeingEdited.mainText.length
    },

    remainingCharsSecondaryText () {
      return 40 - this.adBeingEdited.secondaryText.length
    },

    showModApplicationStatus () {
      return !this.isChangingPassword
             && this.userData
             && this.modApplicationStatus !== MOD_APPLICATION_STATUSES.loading
             && this.modApplicationStatus !== MOD_APPLICATION_STATUSES.none
    },

    ...mapGetters(['userData']),
  },

  async mounted () {
    miscApi.logRoute('account')
    this.getAds()
    this.getModApplicationStatus()
  },

  metaInfo() {
    let title = `Account - Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
      ]
    }
  },
}
</script>

<style lang="scss">
#changePasswordTable {
  border: none;
  td {
    text-align: left;
  }
}

.singleReklame {
  padding: 1rem;
  margin: 1rem 0;
}

.adInput {
  width: 100%;
  box-sizing: border-box;
}
</style>
