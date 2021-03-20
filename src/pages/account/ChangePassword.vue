<template>
  <Form buttonText="Change password"
        :errorText="changePasswordSubmit.errorMessage"
        :fetchState="changePasswordSubmit"
        header="Change password"
        :canSubmit="currentPassword && newPassword1 && newPassword2"
        successText="Password changed successfully"
        includeCancel
        showCloseOnSuccess
        :width="320"
        @submit="submitPasswordChange"
        @cancel="$emit('cancel')">

    <TextInput :value="currentPassword"
                @change="newVal => currentPassword = newVal"
                title="Current password"
                textAlign="left"
                type="password"
                classes="width100 mb-48"/>

    <TextInput :value="newPassword1"
                @change="newVal => newPassword1 = newVal"
                title="New password"
                textAlign="left"
                type="password"
                classes="width100 mb-48"/>

    <TextInput :value="newPassword2"
                @change="newVal => newPassword2 = newVal"
                title="Repeat new password"
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
    ...mapGetters(['changePasswordSubmit']),
  },

  data () {
    return {
      currentPassword: '',
      newPassword1: '',
      newPassword2: '',
    }
  },

  methods: {
    async submitPasswordChange () {
      doFetch(this.$store.commit, 'changePasswordSubmit', 
        authApi.changePassword(this.currentPassword, this.newPassword1, this.newPassword2))
    },
  },

  mounted () {
    fetchClear(this.$store.commit, 'changePasswordSubmit')
  }
}
</script>