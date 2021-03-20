<template>
  <div class="login-modal-inner-wrapper">
    <p class="modal-header">Forgot password?</p>

    <ResponseMessage :message="forgotPwResponseMessage"
                     :messageType="forgotPwResponseMessageType"
                     preventClose
                     classes="mt-32 mb-32"/>

    <form @submit.prevent="forgotPasswordSubmit"
          v-if="forgotPwResponseMessageType !== 'success'"
          class="login-register-form">

      <TextInput @change="newVal => forgotPwEmail = newVal"
                  type="email"
                  title="Email address"
                  textAlign="left"
                  classes="width100 mb-32"/>
      
      <LoadingButton text="Reset password"
                     :isLoading="isForgotPasswordLoading"/>
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

export default {
  components: {
    ResponseMessage, LoadingButton, TextInput,
  },

  data () {
    return { 
      forgotPwEmail: '',
      isForgotPasswordLoading: false,
      forgotPwResponseMessage: '',
      forgotPwResponseMessageType: '',
    }
  },

  methods: {
    setModalContext (modalContext) {
      this.$store.commit('setLoginModalContext', modalContext)
    },

    async forgotPasswordSubmit () {
      this.forgotPwResponseMessage = ''
      this.forgotPwResponseMessageType = 'error'
      if (!this.forgotPwEmail || this.forgotPwEmail.length === 0) {
        this.forgotPwResponseMessage = 'Please fill in email'
        return
      }

      this.isForgotPasswordLoading = true
      let result = await authApi.submitForgotPassword(this.forgotPwEmail)
      this.isForgotPasswordLoading = false

      if (result.success) {
        this.forgotPwResponseMessage = `We have sent a password reset link to this email, if it is connected with an account on Yiffer.xyz.`
        this.forgotPwResponseMessageType = 'success'
        this.forgotPwEmail = ''
      }
      else {
        this.forgotPwResponseMessage = result.message
        this.forgotPwResponseMessageType = 'error'
      }
    },
  }
}
</script>

<style>

</style>