<template>
  <div class="login-modal-inner-wrapper">
    <p class="modal-header">Sign up</p>

    <form @submit.prevent="submitSignup"
          class="login-register-form">

      <TextInput @change="newVal => signupEmail = newVal"
                 v-if="!fetchSignup.fetched"
                 type="email"
                 title="Email"
                 textAlign="left"
                 classes="width100 mb-32"/>

      <TextInput @change="newVal => signupUsername = newVal"
                 v-if="!fetchSignup.fetched"
                 title="Username"
                 textAlign="left"
                 classes="width100 mb-32"/>

      <TextInput @change="newVal => signupPassword1 = newVal"
                 v-if="!fetchSignup.fetched"
                 type="password"
                 title="Password, 6+ characters"
                 textAlign="left"
                 classes="width100 mb-32"/>

      <TextInput @change="newVal => signupPassword2 = newVal"
                 v-if="!fetchSignup.fetched"
                 type="password"
                 title="Repeat password"
                 textAlign="left"
                 classes="width100 mb-16"/>

      <ResponseMessage :message="responseMessage"
                       :messageType="fetchSignup.failed ? 'error' : 'success'"
                       :preventClose="fetchSignup.fetched"
                       @closeMessage="responseMessage = ''"
                       disableElevation
                       :style="fetchSignup.fetched ? 'margin-top: 1rem; width: 100%;' : 'margin-bottom: 1rem; width: 100%;'"/>

      <LoadingButton text="Sign up"
                     v-if="!fetchSignup.fetched"
                     :isLoading="fetchSignup.fetching"/>
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
    ...mapGetters(['fetchSignup'])
  },

  data () {
    return { 
      signupEmail: '',
      signupUsername: '',
      signupPassword1: '',
      signupPassword2: '',
      responseMessage: '',
    }
  },

  methods: {
    setModalContext (modalContext) {
      this.$store.commit('setLoginModalContext', modalContext)
    },

    async submitSignup () {
      await doFetch(this.$store.commit, 'fetchSignup', 
        authApi.signup(this.signupUsername, this.signupEmail, this.signupPassword1, this.signupPassword2))
    },
  },

  watch: {
    fetchSignup () {
      if (this.fetchSignup.failed) {
        this.responseMessage = this.fetchSignup.errorMessage
      }
      else if (this.fetchSignup.fetching) {
        this.responseMessage = ''
      }
      else if (this.fetchSignup.fetched) {
        this.$store.dispatch('setUserData', this.fetchSignup.payload)
        if (this.$route.meta.reloadOnLogin) {
          setTimeout(() => window.location.reload(), 150)
        }
        this.closeModal()
        fetchClear(this.$store.commit, 'fetchSignup')
      }
    },
  },

  mounted () {
    fetchClear(this.$store.commit, 'fetchSignup')
  },

}
</script>

<style>

</style>