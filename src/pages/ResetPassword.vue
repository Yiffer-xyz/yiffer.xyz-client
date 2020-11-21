<template>
  <div style="width: 100%; padding-top: 2rem;">
    <form class="yForm2"
          enctype="multipart/form-data"
          style="margin: 3rem auto; width: 14rem;">

      <h3>Reset password</h3>

      <ResponseMessage :message="responseMessage" :messageType="responseMessageType" preventClose
                       outsideStyle="margin-top: 1rem;"/>

      <Loading v-if="isSubmitting" text="Submitting" class="mt-48 mb-32" />

      <BigSuccess v-show="isSucess" text="Success! You may now log in with your new password."/>
      <BackToIndex v-show="isSucess" classes="mt-16 mb-16"/>

      <div class="yForm2Field" v-if="!isSubmitting && !isSucess">
        <label for="password1">Password, 6+ characters:</label>
        <input type="password" v-model="password1" id="password1" class="simpleInput" />
      </div>

      <div class="yForm2Field" v-if="!isSubmitting && !isSucess">
        <label for="password2">Repeat password:</label>
        <input type="password" v-model="password2" id="password2" class="simpleInput" />
      </div>

        <button @click.prevent="submit" 
                class="y-button"
                type="submit"
                :class="{'y-button-disabled': !isReadyForSubmit}"
                v-if="!isSubmitting && !isSucess">
          Submit
        </button>
    </form>
  </div>
</template>

<script>
import miscApi from '../api/miscApi'

import BackToIndex from '@/components/BackToIndex.vue'
import ResponseMessage from '@/components/ResponseMessage.vue'
import BigSuccess from '@/components/BigSuccessMessage.vue'
import Loading from '@/components/LoadingIndicator.vue'
import authApi from '../api/authApi'
export default {
  name: 'feedback',

  components: { BackToIndex, ResponseMessage, Loading, BigSuccess },

  data: function () {
    return {
      password1: '',
      password2: '',
      responseMessage: '',
      responseMessageType: 'info',
      isSubmitting: false,
      isSucess: false,
    }
  },
  
  async mounted () {
    miscApi.logRoute('forgot password')
  },

  computed: {
    isReadyForSubmit () {
      return this.password1.length >= 6 && this.password2.length >= 6
    }
  },

  methods: {
    async submit () {
      if (!this.isReadyForSubmit) { return }
      this.responseMessage = ''
      this.isSucess = false

      this.isSubmitting = true
      let response = await authApi.submitResetPassword(this.password1, this.password2, this.$route.params.token)
      this.isSubmitting = false

      if (response.success) {
        this.isSucess = true
      }
      else {
        this.responseMessage = response.message
        this.responseMessageType = 'error'
      }
    },

    closeResponseMessage () { this.responseMessage = '' },
  },
}
</script>

<style lang="scss" scoped>
#inputContainer {
  input, textarea {
    width: 100%;
  }
  textarea {
    padding: 1px;
  }
  .input-cell {
    width: 400px;
  }
}
</style>
