<template>
  <div class="login-modal-inner-wrapper">
    <p class="modal-header">Log in</p>

    <ResponseMessage :message="loginErrorMessage"
                     :messageType="'error'"
                     @closeMessage="() => loginErrorMessage = ''"
                     style="margin-top: 1rem;"/>

    <form @submit.prevent="loginConfirmClicked"
          class="login-register-form">

      <TextInput @change="newVal => loginUsername = newVal"
                 ref="loginUsernameInput"
                 title="Username or email"
                 textAlign="left"
                 classes="width100 mb-32"/>

      <TextInput @change="newVal => loginPassword = newVal"
                 type="password"
                 title="Password"
                 textAlign="left"
                 classes="width100 mb-16"/>

      <LoadingButton text="Log in"
                     :isLoading="loginLoading"/>
    </form>

    <button @click="setModalContext('register')"
            class="mt-32 underline-link link-color text-button">
      Click here to <b>sign up</b>
    </button>

    <button @click="setModalContext('forgot-password')"
            class="mt-8 underline-link link-color text-button">
      Forgot password?
    </button>
  </div>
</template>

<script>
import ResponseMessage from '@/components/ResponseMessage.vue'
import TextInput from '@/components/TextInput.vue'
import LoadingButton from '@/components/LoadingButton.vue'

export default {
  components: {
    ResponseMessage, LoadingButton, TextInput,
  },

  props: {
    closeModal: {
      type: Function,
      required: true,
    },
  },

  data () {
    return { 
      loginUsername: '',
      loginPassword: '',
      loginErrorMessage: '',
      loginLoading: false,
    }
  },

  methods: {
    setModalContext (modalContext) {
      this.$store.commit('setLoginModalContext', modalContext)
    },

    async loginConfirmClicked () {
      this.loginErrorMessage = ''
      let loginData = {username: this.loginUsername, password: this.loginPassword}

      this.loginLoading = true
      let response = await this.$store.dispatch('login', loginData)
      this.loginLoading = false

      if (response.success) {
        this.closeModal()
      }
      else {
        this.loginErrorMessage = response.message
      }
    },
  },
}
</script>

<style>

</style>