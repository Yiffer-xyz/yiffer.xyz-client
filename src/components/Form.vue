<template>
  <form class="yForm2"
        enctype="multipart/form-data"
        @submit.prevent="$emit('submit')"
        :style="`width: min(${maxWidth || '600'}px, 95%); margin: 1rem auto;`">
    <h3>{{header}}</h3>

    <slot v-if="!fetchState.fetched"></slot>

    <ResponseMessage :message="responseMessage"
                     :messageType="fetchState.failed ? 'error' : 'success'"
                     :preventClose="fetchState.fetched"
                     disableElevation
                     @closeMessage="onCloseErrorMessage"
                     :style="fetchState.fetched ? 'margin-top: 0; width: 100%;' : 'margin-top: 2rem; width: 100%;'"/>

    <div v-if="!hideSubmit && !fetchState.fetched">
      <LoadingButton :text="buttonText"
                     :iconType="buttonIconType"
                     :isDisabled="!canSubmit"
                     :isLoading="fetchState.fetching"
                     styles="align-self: center;"/>
    </div>
  </form>
</template>

<script>
import ResponseMessage from '@/components/ResponseMessage.vue'
import LoadingButton from '@/components/LoadingButton.vue'

export default {
  name: 'yifferForm',

  components: { ResponseMessage, LoadingButton, },

  props: {
    fetchState: Object,
    header: String,
    successText: String,
    fetchingText: String,
    errorText: String,
    buttonText: String,
    canSubmit: Boolean,
    hideSubmit: Boolean,
    maxWidth: String,
    buttonIconType: String,
  },

  data: function () {
    return {
      responseMessage: '',
    }
  },
  
  watch: {
    fetchState () {
      if (this.fetchState.failed) {
        this.responseMessage = this.fetchState.errorMessage
      }
      else if (this.fetchState.fetching) {
        this.responseMessage = ''
      }
      else if (this.fetchState.fetched) {
        this.responseMessage = this.successText
      }
    },
  },

  methods: {
    onCloseErrorMessage () {
      this.responseMessage = ''
    },

    async submit () {
      if (!this.canSubmit) { return }
      this.$emit('submit')
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
