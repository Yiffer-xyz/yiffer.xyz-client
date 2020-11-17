<template>
  <div style="width: 100%;">
    <h1>Apply as an advertiser</h1>
    <BackToIndex></BackToIndex>

    <div class="full-width-text">
      <p>
        We're delighted to see a potential advertiser! Here's a little info about the process forward. The status of your applications can be seen on your user page.
        <ol class="spaced-list">
          <li>
            You apply using the forms below, attaching images/gifs. Your application is given an ID and can be found in your user page. Your application gets the status of <span class="monoInfo">PENDING</span>. You are sent an email from advertising@yiffer.xyz to the address connected to your account.
          </li>
          <li>
            We review your application. If something needs correcting, we will communicate this via <u>email</u>. If this is the case, your application gets the status of <span class="monoWarning">NEEDS CORRECTION</span>, and the details are sent via email.
          </li>
          <li>
            Your application is accepted. You are then asked to pay the amount in question via PayPal. You must add the ad-ID in the message when paying. Your application gets the status of <span class="monoWarning">AWAITING PAYMENT</span>.
          </li>
          <li>
            We receive the payment and process it manually. This may take at most a few days. The status of your advertisement is updated to <span class="monoInfo">ACTIVE SOON</span>. Your ads will be displayed for the paid for duration of months, <u>starting the first day of the next month</u> (For example, if your payment is processed August 8th, and you paid for two months of ads, your ads will be displayed from September 1st to October 31st). 
          </li>
          <li>
            Finally, your application is shown and the status is set to <span class="monoSuccess">ACTIVE</span>.
          </li>
          <li>
            You may turn on auto-renewal of your ads at any time. You still have to manually pay each time period, within each time period's starting date. The application status is set to <span class="monoWarning">ACTIVE, AWAITING RENEWAL PAYMENT</span> before you have paid, and <span class="monoSuccess">ACTIVE, RENEWAL PAID</span> after you have paid for the next period.
          </li>
        </ol>
      </p>

      <p class="bold textAlignCenter">
        Keep in mind that as long as this notice stands, there is a 50% discount on all ads!
      </p>

      <form class="y-form" enctype="multipart/form-data" style="width: fit-content; margin: 1rem auto;">
        <h3>Application form</h3>

        <BigSuccess v-show="success" text="Success! See your account page for details."/>

        <span v-show="!success">
          <div class="field">
            <label for="adType">Type of ad</label>
            <select id="adType" v-model="adType">
              <option value="card2M">Comic card, 2 months (̶$̶4̶0̶) ($20!)</option>
              <option value="card4M">Comic card, 4 months (̶$̶6̶0̶) ($30!)</option>
              <option value="banner1M">Wide banner, 1 month (̶$̶3̶5̶) ($17!)</option>
            </select>
          </div>

          <div class="field">
            <label for="adLinks">Link (where the users end up when clicking your ad):</label>
            <input type="text" v-model="adLink" id="adLinks"/>
          </div>

          <div class="field" v-if="isCardAd">
            <label for="adMainText">Main text:</label>
            <input type="text" v-model="adMainText" id="adMainText"/>
            <p v-if="adMainText" class="smaller-text" :class="{'red-color': remainingCharsMainText<0}">
              {{remainingCharsMainText}} characters left
            </p>
          </div>

          <div class="field" v-if="isCardAd">
            <label for="adSecondaryText">Secondary text (optional):</label>
            <input type="text" v-model="adSecondaryText" id="adSecondaryText"/>
            <p v-if="adSecondaryText" class="smaller-text" :class="{'red-color': remainingCharsSecondaryText<0}">
              {{remainingCharsSecondaryText}} characters left
            </p>
          </div>

          <div class="field" v-if="adType">
            <label for="cardAdFile">Image or gif:</label>
            <div class="horizontalFlexLeft flexWrap mt-4">
              <div class="pretty-input-upload mr-8">
                <input type="file" @change="processFileUploadChange" id="cardAdFile" accept="image/x-png,image/gif,image/jpeg" class="input-file"/>
                <p>Select file</p>
              </div>
              <p v-if="file" class="alignSelfCenter">Selected: {{file.name}}</p>
            </div>

            <p v-if="fileErrorMessage" class="red-color mt-4" style="max-width: 24rem;">
              {{fileErrorMessage}}
            </p>
            <p v-else-if="file" class="mt-4">
              <CheckIcon/> File matches size requirements.
            </p>
          </div>


          <div class="field">
            <label for="notesText">Notes or comments for our staff? (optional)</label>
            <input type="text" v-model="notes" id="notesText"/>
          </div>

          <Loading v-if="isAwaitingResponse" text="Submitting..."/>

          <ResponseMessage :message="responseMessage" messageType="error" @closeMessage="closeResponseMessage"/>

          <button @click.prevent="submitApplication" 
                  class="y-button"
                  :class="{'y-button-disabled': !isReadyForSubmit}"
                  style="align-self: center;"
                  v-if="!isAwaitingResponse">
            Submit application
          </button>
        </span>
      </form>
    </div>
  </div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import Loading from '@/components/LoadingIndicator.vue'
import BigSuccess from '@/components/BigSuccessMessage.vue'
import ResponseMessage from '@/components/ResponseMessage.vue'

import miscApi from '../api/miscApi'
import adApi from '../api/advertisingApi'

import RightArrow from 'vue-material-design-icons/ArrowRight.vue'
import LoginIcon from 'vue-material-design-icons/Login.vue'
import CheckIcon from 'vue-material-design-icons/CheckCircle.vue'

export default {
  name: 'advertisingApply',
  
  components: {
    BackToIndex, Loading, BigSuccess, ResponseMessage,
    RightArrow, LoginIcon, CheckIcon,
  },

  data () {
    return {
      adType: undefined,
      adLink: '',
      adMainText: '',
      adSecondaryText: '',
      file: undefined,
      notes: '',
      fileErrorMessage: '',
      isAwaitingResponse: false,
      success: false,
      responseMessage: '',
    }
  },

  watch: {
    adType () {
      this.checkFileRequirements()
    }
  },

  mounted () {
    miscApi.logRoute('advertising apply')
  },

  methods: {
    async submitApplication () {
      if (!this.isReadyForSubmit) { return }

      this.responseMessage = ''
      this.isAwaitingResponse = true
      let result = await adApi.submitAdvertisingApplication(
        this.adType, this.adLink, this.adMainText, this.adSecondaryText, this.file, this.notes)
      this.isAwaitingResponse = false

      if (result.success) {
        this.success = true
      }
      else {
        this.responseMessage = result.message
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
          if (this.isCardAd) {
            if (tempImage.width !== 200 || tempImage.height !== 283) {
              this.fileErrorMessage = `The file does not match the 200x283 pixel requirement (is ${tempImage.width}x${tempImage.height}).`
            }
          }
          else if (this.isBannerAd) {
            if (tempImage.width !== 680 || tempImage.height !== 100) {
              this.fileErrorMessage = `The file does not match the 680x100 pixel requirement (is ${tempImage.width}x${tempImage.height}).`
            }
          }
				}
			}
			fileReader.readAsDataURL(this.file)
		},
    
    closeResponseMessage () { this.responseMessage = '' },
  },

  computed: {
    isCardAd () {
      return this.adType === 'card2M' || this.adType === 'card4M'
    },

    isBannerAd () {
      return this.adType === 'banner1M'
    },

    remainingCharsMainText () {
      return 25 - this.adMainText.length
    },

    remainingCharsSecondaryText () {
      return 40 - this.adSecondaryText.length
    },

    isReadyForSubmit () {
      if (!this.adType || !this.adLink || !this.file || this.fileErrorMessage || this.isAwaitingResponse) {
        return false
      }
      if (this.isCardAd) {
        if (!this.adMainText || this.remainingCharsMainText<0 || this.remainingCharsSecondaryText<0) {
          return false
        }
      }

      return true
    },
  },

  metaInfo () {
    let title = `Advertising - Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry porn comics, easily readable and free!"},
        {vmid: 'ogDesc', property: 'og:description', content: "The internet's best collection of high quality furry porn comics, easily readable and free!"}
      ]
    }
  },
}
</script>

<style lang="scss">
</style>