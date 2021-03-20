<template>
  <div class="login-modal-inner-wrapper">
    <p class="modal-header">Log in</p>

    <ResponseMessage :message="loginErrorMessage"
                     :messageType="'error'"
                     @closeMessage="() => loginErrorMessage = ''"
                     style="margin-top: 1rem;"/>

    <form @submit.prevent="loginConfirmClicked"
          v-if="!loginLoading"
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
                 classes="width100 mb-32"/>

      <button type="submit" class="y-button login-button">Log in</button>
    </form>

    <Loading v-else text="Logging in" class="mt-48 mb-32" />

    <button @click="setModalContext('register')"
            v-if="!loginLoading"
            class="margin-top-4 underline-link link-color text-button">
      Click here to <b>sign up</b>
    </button>

    <button @click="setModalContext('forgot-password')"
            v-if="!loginLoading"
            class="mt-8 underline-link link-color text-button">
      Forgot password?
    </button>
  </div>
</template>

<script>
import ResponseMessage from '@/components/ResponseMessage.vue'
import Loading from '@/components/LoadingIndicator.vue'
import TextInput from '@/components/TextInput.vue'

export default {
  components: {
    ResponseMessage, Loading, TextInput,
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

  mounted () {
    this.$store.watch(this.$store.getters.getLoginModalVisibility, (visibility) => {
      if (visibility) {
        if (this.$store.getters.loginModalContext==='login') {
          this.$refs.loginUsernameInput.focus()
        }
      }
    })
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