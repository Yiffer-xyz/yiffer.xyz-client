<template>
  <div style="width: 100%">

    <h1 class="margin-bottom-8" v-if="$store.getters.isAuthenticated">Account: {{$store.getters.userData.username}}</h1>
    <h1 class="margin-bottom-8" v-else>Account</h1>
    <BackToIndex style="margin: auto;"/>

    <div class="narrowContentWrapper mb-24" v-if="!isFetchingInitialData && !isChangingPassword && !isAddingEmail && userData">
      <div class="verticalFlex mt-16">
        <h3>
          Account info
        </h3>
        <p v-if="$store.getters.userData.email">
          Email: {{$store.getters.userData.email}}
        </p>
        <p v-else>
          Your account does not have an email. This is because your account was created before this website started using emails for accounts. We recommend that you connect your email address now, for account recovery purposes. Don't worry, we will never spam you.
        </p>

        <button v-if="!$store.getters.userData.email"
                @click="isAddingEmail=true"
                class="y-button y-button mt-4"
                style="width: fit-content;">
          Add email address
        </button>
        
        <button @click="isChangingPassword=true"
                class="y-button y-button mt-4 button-with-icon">
          Change password
        </button>
      </div>

      <div class="mt-24"
           v-show="showModApplicationStatus && !isChangingPassword && !isAddingEmail">
        <h3>
          Mod application status
        </h3>
        <p class="mt-0" v-if="modApplicationStatus === modApplicationStatuses.pending">
          Pending review
        </p>
        <p class="mt-0" v-else-if="modApplicationStatus === modApplicationStatuses.waiting">
          Your application looks promising. We're either currently not in need of more mods, or we need some time deciding. You can consider this a "waiting list" of sorts. We won't guarantee that you'll get a mod spot, but your application is not rejected. We will contact you on Telegram should we decide to include you as a mod!
        </p>
        <p class="mt-0" v-else-if="modApplicationStatus === modApplicationStatuses.removed">
          Sorry, your application has been rejected. This is most likely because there were simply more mods with better capabilities applying. Thank you for wanting to contribute though!
        </p>
      </div>

      <div v-if="myPaidImages.fetched && myPaidImages.payload.length > 0 && !isChangingPassword && !isAddingEmail" class="mt-24">
        <h3>
          Advertising
        </h3>
        <p>
          You have active or inactive ads
        </p>
        <a href="https://pi.yiffer.xyz/dashboard"
           class="fitContent" style="display: block;">
          <button class="y-button button-with-icon-right mt-4">
            Go to advertising dashboard
            <RightArrow/>
          </button>
        </a>
      </div>

      <div class="mt-24">
        <Patreon/>
      </div>
    </div>

    <ChangePassword v-if="isChangingPassword && userData" @cancel="isChangingPassword = false"/>

    <AddEmail v-if="isAddingEmail && userData" @cancel="isAddingEmail = false"/>

    <div v-if="isFetchingInitialData"
         class="horizontalFlex width100 justifyCenter alignItemsCenter"
         style="height: 40vh;">
      <Loading/>
    </div>

    <p v-if="!userData" class="mt-32">
      Something seems to have gone wrong.
    </p>
  </div>
</template>

<script>
import Vue from 'vue'
import VueCroppie from "vue-croppie"
import 'croppie/croppie.css'

Vue.use(VueCroppie);

import miscApi from '@/api/miscApi'
import config from '@/config.json'
import { doFetch } from '@/utils/statefulFetch'

import ChangePassword from './ChangePassword.vue'
import AddEmail from './AddEmail.vue'
import Patreon from './Patreon.vue'
import Loading from '@/components/LoadingIndicator.vue'
import BackToIndex from '@/components/BackToIndex.vue'
import advertisingApi from '@/api/advertisingApi'

import RightArrow from 'vue-material-design-icons/ArrowRight.vue'

import { mapGetters } from 'vuex'

const MOD_APPLICATION_STATUSES = {
  none: 'none',
  pending: 'pending',
  waiting: 'waiting',
  removed: 'removed'
}

export default {
  name: 'account',

  components: {
    BackToIndex, RightArrow, ChangePassword, AddEmail, Loading, Patreon,
  },

  computed: {
    showModApplicationStatus () {
      return !this.isChangingPassword
             && this.userData
             && this.modApplicationStatus
             && this.modApplicationStatus !== MOD_APPLICATION_STATUSES.none
             && !this.isModOrAdmin
    },

    ...mapGetters(['userData', 'myPaidImages']),

    isModOrAdmin () {
      return this.userData && (this.userData.userType === 'moderator' || this.userData.userType === 'admin')
    },

    isFetchingInitialData () {
      return this.userData?.fetching || this.myPaidImages?.fetching
    }
  },

  async mounted () {
    miscApi.logRoute('account')
    this.getModApplicationStatus()
    doFetch(this.$store.commit, 'myPaidImages', advertisingApi.getMyAds())
  },

  data: function () {
    return {
      isChangingPassword: false,
      isAddingEmail: false,
      modApplicationStatus: MOD_APPLICATION_STATUSES.loading,
      modApplicationStatuses: MOD_APPLICATION_STATUSES,
      config,
    }
  },

  methods: {
    async getModApplicationStatus () {
      try {
        let { success, applicationStatus }  = await miscApi.getMyModApplicationStatus()
        if (success) { 
          this.modApplicationStatus = applicationStatus
          return
        }
      }
      catch (err) {
        this.modApplicationStatus = MOD_APPLICATION_STATUSES.none
      }
    },
    
    formatTimestamp (timestamp) {
      if (!timestamp) { return '' }
      return (new Date(timestamp)).toDateString().substr(4)
    },

    formatShortTimestamp (timestamp) {
      return (new Date(timestamp)).toDateString().substr(4, 6)
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
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"},
        {vmid: 'ogDesc', property: 'og:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"}
      ]
    }
  },
}
</script>
