<template>
  <Form buttonText="Set email"
        :errorText="addEmailSubmit.errorMessage"
        :fetchState="addEmailSubmit"
        header="Add email to your account"
        :canSubmit="!!currentPassword && !!newEmail"
        successText="Email set successfully - thank you!"
        includeCancel
        showCloseOnSuccess
        :width="400"
        @submit="submitEmailChange"
        @cancel="$emit('cancel')">

    <TextInput :value="newEmail"
                @change="newVal => newEmail = newVal"
                title="Email"
                textAlign="left"
                type="email"
                classes="width100 mb-48"/>

    <TextInput :value="currentPassword"
                @change="newVal => currentPassword = newVal"
                title="Current password"
                textAlign="left"
                type="password"
                classes="width100 mb-16"/>
  </Form>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchClear, doFetch } from '../../utils/statefulFetch'
import authApi from '@/api/authApi'
import Form from '@/components/Form.vue'
import TextInput from '@/components/TextInput.vue'

export default {
  components: {
    TextInput, Form,
  },

  computed: {
    ...mapGetters(['addEmailSubmit']),
  },

  data () {
    return {
      currentPassword: '',
      newEmail: '',
    }
  },

  methods: {
    async submitEmailChange () {
      let result = await doFetch(this.$store.commit, 'addEmailSubmit', 
        authApi.changeEmail(this.currentPassword, this.newEmail))
        
      console.log(result);
      this.$store.dispatch('refreshUserData')
    },
  },

  mounted () {
    fetchClear(this.$store.commit, 'addEmailSubmit')
  }
}
</script>