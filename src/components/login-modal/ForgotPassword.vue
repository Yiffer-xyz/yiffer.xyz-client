<template>
  <div class="login-modal-inner-wrapper">
    <p class="modal-header">Forgot password?</p>

    <p class="mt-32 textAlignLeft">
      You can recover your password only if you created your account with an email - if you created it prior to May 2021 (and have not added your email since), you cannot recover your password.
    </p>

    <form @submit.prevent="forgotPasswordSubmit"
          class="login-register-form">

      <TextInput @change="newVal => forgotPwEmail = newVal"
                 v-if="!forgottenPasswordSubmit.fetched"
                 type="email"
                 title="Email address"
                 textAlign="left"
                 classes="width100 mb-16"/>

      <ResponseMessage :message="responseMessage"
                      :messageType="forgottenPasswordSubmit.failed ? 'error' : 'success'"
                      :preventClose="forgottenPasswordSubmit.fetched"
                      @closeMessage="responseMessage = ''"
                      disableElevation
                      :style="forgottenPasswordSubmit.fetched ? 'margin-top: 1rem; width: 100%;' : 'margin-bottom: 1rem; width: 100%;'"/>

      <LoadingButton text="Reset password"
                     v-if="!forgottenPasswordSubmit.fetched"
                     :isLoading="forgottenPasswordSubmit.fetching"/>
    </form>

    <button @click="setModalContext('login')"
            class="mt-32 underline-link link-color text-button">
      Click here to <b>log in</b>
    </button>

    <button @click="setModalContext('register')"
            class="mt-8 underline-link link-color text-button">
      Click here to <b>sign up</b>
    </button>
  </div>
</template>

<script>
import authApi from '../../api/authApi'
import ResponseMessage from '@/components/ResponseMessage.vue'
import TextInput from '@/components/TextInput.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import { fetchClear, doFetch } from '../../utils/statefulFetch'
import { mapGetters } from 'vuex'

export default {
  components: {
    ResponseMessage, LoadingButton, TextInput,
  },

  computed: {
    ...mapGetters(['forgottenPasswordSubmit'])
  },

  data () {
    return { 
      forgotPwEmail: '',
      responseMessage: '',
    }
  },

  methods: {
    setModalContext (modalContext) {
      this.$store.commit('setLoginModalContext', modalContext)
    },

    async forgotPasswordSubmit () {
      await doFetch(this.$store.commit, 'forgottenPasswordSubmit', 
        authApi.submitForgotPassword(this.forgotPwEmail))
    },
  },
  
  watch: {
    forgottenPasswordSubmit () {
      if (this.forgottenPasswordSubmit.failed) {
        this.responseMessage = this.forgottenPasswordSubmit.errorMessage
      }
      else if (this.forgottenPasswordSubmit.fetching) {
        this.responseMessage = ''
      }
      else if (this.forgottenPasswordSubmit.fetched) {
        this.responseMessage = `We have sent a password reset link to ${this.forgotPwEmail}, if it is connected with an account on Yiffer.xyz.`
      }
    },
  },

  mounted () {
    fetchClear(this.$store.commit, 'forgottenPasswordSubmit')
  },
}
</script>

<style>

</style>