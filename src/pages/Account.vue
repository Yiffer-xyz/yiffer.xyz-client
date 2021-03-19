<template>
  <div style="width: 100%">

    <h1 class="margin-bottom-8">Account: {{$store.getters.userData.username}}</h1>
    <BackToIndex style="margin: auto;"/>

    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"
                     class="margin-bottom-10 margin-top-10"/>

    <div class="smaller-width-text">
      <div class="verticalFlex mt-16">
        <p v-if="$store.getters.userData.email">
          Your email: {{$store.getters.userData.email}}
        </p>
        <p v-else>
          Your account does not have an email. This is because your account was created before this website started using emails for accounts. We recommend that you connect your email address now, for account recovery purposes.
        </p>

        <button v-if="!$store.getters.userData.email && !isChangingPassword && !isChangingEmail"
                @click="isChangingEmail=true"
                class="y-button y-button mt-16"
                style="width: fit-content;">
          Add email address
        </button>
        
        <button v-if="!isChangingPassword && !isChangingEmail"
                @click="isChangingPassword=true"
                class="y-button y-button-neutral y-button mt-16"
                style="width: fit-content;">
          Change password
        </button>
      </div>

      <!-- CHANGE EMAIL -->
      <form v-if="isChangingEmail" class="margin-top-16">
        <p class="bold">Set email address</p>
        <table id="changePasswordTable">
          <tr>
            <td><label>New email address: </label></td>
            <td><input v-model="newEmail" type="email" class="margin-top-4"/></td>
          </tr>
          <tr>
            <td><label>Current password: </label> </td>
            <td><input v-model="currentPassword" type="password" class="margin-top-4"/></td>
          </tr>
        </table>

        <div v-if="!isSubmittingEmailChange" style="margin: 0.75rem auto 0 auto; width: fit-content;">
          <button @click="cancelChangeEmail"
                  type="button"
                  class="y-button y-button-neutral">
            Cancel
          </button>

          <button @click="submitChangeEmail"
                  @submit.prevent="submitChangeEmail"
                  type="submit"
                  class="y-button" 
                  style="width: fit-content; margin-left: 8px;">
            Set email
          </button>
        </div>
        <Loading v-else text="Submitting" class="mt-16" />
      </form>

      <!-- CHANGE PASSWORD -->
      <form v-if="isChangingPassword" class="margin-top-16">
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

        <div v-if="!isSubmittingPassword" style="margin-top: 0.75rem;">
          <button @click="cancelChangePassword"
                  type="button"
                  class="y-button y-button-neutral">
            Cancel
          </button>

          <button @click="submitChangePassword"
                  @submit.prevent="submitChangePassword"
                  type="submit"
                  class="y-button" 
                  style="width: fit-content; margin-left: 8px;">
            Change password
          </button>
        </div>
        <Loading v-else text="Submitting" class="mt-16" />
      </form>

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

      <router-link v-if="myPaidImages.fetched && myPaidImages.payload.length > 0 && !isChangingPassword && !isChangingEmail"
                   :to="{name: 'adsDashboard'}"
                   class="adDashboardButton simpleShadow">
        Go to advertising dashboard
        <RightArrow/>
      </router-link>
    </div>
  </div>
</template>

<script>
import authApi from '../api/authApi'
import miscApi from '../api/miscApi'
import config from '@/config.json'
import { doFetch } from '../utils/statefulFetch'

import ResponseMessage from '@/components/ResponseMessage.vue'
import BackToIndex from '@/components/BackToIndex.vue'
import Loading from '@/components/LoadingIndicator.vue'
import advertisingApi from '../api/advertisingApi'

import RightArrow from 'vue-material-design-icons/ArrowRight.vue'
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
    BackToIndex, ResponseMessage, Loading, RightArrow,
  },

  computed: {
    showModApplicationStatus () {
      return !this.isChangingPassword
             && this.userData
             && this.modApplicationStatus !== MOD_APPLICATION_STATUSES.loading
             && this.modApplicationStatus !== MOD_APPLICATION_STATUSES.none
    },

    ...mapGetters(['userData', 'myPaidImages']),
  },

  async mounted () {
    miscApi.logRoute('account')
    this.getModApplicationStatus()
    doFetch(this.$store.commit, 'myPaidImages', advertisingApi.getMyAds())
  },

  data: function () {
    return {
      isChangingPassword: false,
      isChangingEmail: false,
      currentPassword: '',
      newEmail: '',
      newPassword1: '',
      newPassword2: '',
      responseMessage: '',
      responseMessageType: 'info',
      isSubmittingPassword: false,
      isSubmittingEmailChange: false,
      modApplicationStatus: MOD_APPLICATION_STATUSES.loading,
      modApplicationStatuses: MOD_APPLICATION_STATUSES,
      config,
    }
  },

  methods: {
    async submitChangeEmail () {
      if (!this.currentPassword || !this.newEmail) {
        this.responseMessage = 'Please fill in all fields'
        this.responseMessageType = 'error'
        return
      }

      this.isSubmittingEmailChange = true
      let response = await authApi.changeEmail(this.currentPassword, this.newEmail)
      this.isSubmittingEmailChange = false

      if (response.success) {
        this.responseMessage = 'Email set successfully!'
        this.responseMessageType = 'success'
        this.cancelChangeEmail()
        this.$store.dispatch('refreshUserData')
      }
      else {
        this.responseMessage = `Error changing email: ${response.message}`
        this.responseMessageType = 'error'
      }
    },

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

      this.isSubmittingPassword = true
      let response = await authApi.changePassword(this.currentPassword, this.newPassword1, this.newPassword2)
      this.isSubmittingPassword = false

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
      this.currentPassword = ''
      this.newPassword1 = ''
      this.newPassword2 = ''
      this.isChangingPassword = false
    },

    cancelChangeEmail () {
      this.newEmail = ''
      this.currentPassword = ''
      this.isChangingEmail = false
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

  metaInfo() {
    let title = `Account - Yiffer.xyz`
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
#changePasswordTable {
  border: none;
  td {
    text-align: left;
  }
}

.adDashboardButton {
  width: 100%;
  color: $themeDark1;
  border: none;
  outline: none;
  height: 3rem;
  font-size: 1rem;
  margin-top: 1.5rem;
  padding: 0 1rem;
  background: linear-gradient(to right, $themeGreen1, $themeGreen2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  
  &:hover {
    cursor: pointer;
  }

  span {
    margin-bottom: 2px;
    margin-left: 0.25rem;
  }
}
</style>
