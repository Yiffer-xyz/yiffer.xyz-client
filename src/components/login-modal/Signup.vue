<template>
  <div class="login-modal-inner-wrapper">
    <p class="modal-header">Sign up</p>

    <ResponseMessage :message="signupErrorMessage"
                      :messageType="'error'"
                      @closeMessage="() => signupErrorMessage = ''"
                      outsideStyle="margin-top: 1rem;"/>

    <form @submit.prevent="signupConfirmClicked"
          class="login-register-form">

      <TextInput @change="newVal => signupEmail = newVal"
                 type="email"
                 title="Email"
                 textAlign="left"
                 classes="width100 mb-32"/>

      <TextInput @change="newVal => signupUsername = newVal"
                 title="Username"
                 textAlign="left"
                 classes="width100 mb-32"/>

      <TextInput @change="newVal => signupPassword = newVal"
                 type="password"
                 title="Password, 6+ characters"
                 textAlign="left"
                 classes="width100 mb-32"/>

      <TextInput @change="newVal => signupPassword2 = newVal"
                 type="password"
                 title="Repeat password"
                 textAlign="left"
                 classes="width100 mb-16"/>

      <LoadingButton text="Sign up"
                     :isLoading="signupLoading"/>
    </form>

    <button @click="setModalContext('login')"
            class="mt-32 underline-link link-color text-button">
      Click here to <b>log in</b>
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
      signupEmail: '',
      signupUsername: '',
      signupPassword: '',
      signupPassword2: '',
      signupErrorMessage: '',
      signupLoading: false,
    }
  },

  methods: {
    setModalContext (modalContext) {
      this.$store.commit('setLoginModalContext', modalContext)
    },

    async signupConfirmClicked () {
      this.signupErrorMessage = ''
      let signupData = {
        email: this.signupEmail,
        username: this.signupUsername,
        password: this.signupPassword,
        password2: this.signupPassword2,
      }

      this.signupLoading = true
      let response = await this.$store.dispatch('signup', signupData)
      this.signupLoading = false

      if (response.success) {
        this.closeModal()
      }
      else {
        this.signupErrorMessage = response.message
      }
    },
  },
}
</script>

<style>

</style>