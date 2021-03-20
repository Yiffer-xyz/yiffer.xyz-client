<template>
  <div class="login-modal-inner-wrapper">
    <p class="modal-header">Log in</p>

    <form @submit.prevent="submitLogin"
          class="login-register-form">

      <TextInput @change="newVal => loginUsername = newVal"
                 v-if="!fetchLogin.fetched"
                 ref="loginUsernameInput"
                 title="Username or email"
                 textAlign="left"
                 classes="width100 mb-32"/>

      <TextInput @change="newVal => loginPassword = newVal"
                 v-if="!fetchLogin.fetched"
                 type="password"
                 title="Password"
                 textAlign="left"
                 classes="width100 mb-16"/>

      <ResponseMessage :message="responseMessage"
                       :messageType="fetchLogin.failed ? 'error' : 'success'"
                       :preventClose="fetchLogin.fetched"
                       @closeMessage="responseMessage = ''"
                       disableElevation
                       :style="fetchLogin.fetched ? 'margin-top: 1rem; width: 100%;' : 'margin-bottom: 1rem; width: 100%;'"/>

      <LoadingButton text="Log in"
                     v-if="!fetchLogin.fetched"
                     :isLoading="fetchLogin.fetching"/>
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
import authApi from '@/api/authApi'
import { fetchClear, doFetch } from '../../utils/statefulFetch'
import { mapGetters } from 'vuex'

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

  computed: {
    ...mapGetters(['fetchLogin'])
  },

  data () {
    return { 
      loginUsername: '',
      loginPassword: '',
      responseMessage: '',
    }
  },

  methods: {
    setModalContext (modalContext) {
      this.$store.commit('setLoginModalContext', modalContext)
    },

    async submitLogin () {
      await doFetch(this.$store.commit, 'fetchLogin', 
        authApi.login(this.loginUsername, this.loginPassword))
    },
  },
  
  watch: {
    fetchLogin () {
      if (this.fetchLogin.failed) {
        this.responseMessage = this.fetchLogin.errorMessage
      }
      else if (this.fetchLogin.fetching) {
        this.responseMessage = ''
      }
      else if (this.fetchLogin.fetched) {
        this.$store.dispatch('setUserData', this.fetchLogin.payload)
        if (this.$route.meta.reloadOnLogin) {
          setTimeout(() => window.location.reload(), 150)
        }
        this.closeModal()
        fetchClear(this.$store.commit, 'fetchLogin')
      }
    },
  },

  mounted () {
    fetchClear(this.$store.commit, 'fetchLogin')
  },
}
</script>

<style>

</style>