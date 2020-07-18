<template>
  <div style="width: 100%">

    <vue-headful :title="'Account - Yiffer.xyz'"/>
    <h1 class="margin-bottom-8">Account: {{$store.getters.userData.username}}</h1>
    <BackToIndex style="margin: auto;"/>

    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"
                     class="margin-bottom-10 margin-top-10"/>

    <div class="smaller-width-text vertical-flex center-on-mobile">
      <button v-if="!isChangingPassword"
              @click="isChangingPassword=true"
              class="y-button y-button-neutral margin-top-16"
              style="width: fit-content;">
        Change password
      </button>

      <div v-if="isChangingPassword" class="margin-top-16">
        <b>Change password</b>
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
        <b>Donator</b>: {{$store.getters.userData.donator ? 'Yes' : 'No'}}
      </div>

      <div class="margin-top-16" v-show="!isChangingPassword">
        <b>Tag blacklist</b>
        <p style="font-style: italic; margin-top: 0;">Coming soon!</p>
      </div>
    </div>
  </div>
</template>

<script>
import authApi from '../api/authApi'
import miscApi from '../api/miscApi'

import ResponseMessage from '@/components/ResponseMessage.vue'
import BackToIndex from '@/components/BackToIndex.vue'

export default {
  name: 'account',

  components: { BackToIndex, ResponseMessage },

  data: function () {
    return {
      isChangingPassword: false,
      currentPassword: '',
      newPassword: '',
      newPassword2: '',
      responseMessage: '',
      responseMessageType: 'info',
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

    closeResponseMessage () { this.responseMessage = '' },
  },
  
  created: async function () {
    miscApi.logRoute('account')
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
</style>
