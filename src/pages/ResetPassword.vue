<template>
  <Form header="Reset password"
        buttonText="Change password"
        successText="Password changed successfully. You can now log in."
        showCloseOnSuccess
        closeButtonText="Back to main page"
        styles="margin-top: 2rem;"
        :width="320"
        :errorText="resetPasswordSubmit.errorMessage"
        :fetchState="resetPasswordSubmit"
        :canSubmit="!!password1 && !!password2"
        @cancel="onClose"
        @submit="submit">

    <TextInput :value="password1"
                @change="newVal => password1 = newVal"
                title="Password, 6+ characters"
                textAlign="left"
                type="password"
                classes="width100 mb-48"/>

    <TextInput :value="password2"
                @change="newVal => password2 = newVal"
                title="Repeat password"
                textAlign="left"
                type="password"
                classes="width100 mb-16"/>
  </Form>
</template>

<script>
import miscApi from '../api/miscApi'
import authApi from '../api/authApi'
import { mapGetters } from 'vuex'
import { fetchClear, doFetch } from '@/utils/statefulFetch'
import Form from '@/components/Form.vue'
import TextInput from '@/components/TextInput.vue'

export default {
  components: {
    TextInput, Form,
  },
  
  async mounted () {
    miscApi.logRoute('forgot password')
    fetchClear(this.$store.commit, 'resetPasswordSubmit')
  },

  computed: {
    ...mapGetters(['resetPasswordSubmit']),
  },

  data: function () {
    return {
      password1: '',
      password2: '',
    }
  },

  methods: {
    async submit () {
      doFetch(this.$store.commit, 'resetPasswordSubmit', 
        authApi.submitResetPassword(this.password1, this.password2, this.$route.params.token))
    },

    onClose () {
      this.$router.replace('/')
    },
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
