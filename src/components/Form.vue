<template>
  <form class="yForm2"
        enctype="multipart/form-data"
        :style="`width: min(${maxWidth || '600'}px, 95%); margin: 1rem auto;`">
    <h3>{{header}}</h3>

    <slot v-if="!fetchState.fetched"></slot>

    <ResponseMessage :message="fetchState.failed ? errorText : (fetchState.fetched ? successText : null)"
                     :messageType="fetchState.failed ? 'error' : 'success'"
                     preventClose
                     :style="fetchState.fetched ? 'margin-top: 0; width: 100%;' : 'margin-top: 2rem; width: 100%;'"/>

    <div v-if="!fetchState.fetched && !hideSubmit">
      <Loading v-if="fetchState.fetching" :text="fetchingText" classes="mb-16 mt-32"/>

      <button @click.prevent="submit"
              class="y-button"
              :class="{'y-button-disabled': !canSubmit || fetchState.fetching}"
              style="align-self: center;"
              v-if="!fetchState.fetching && !fetchState.fetching">
        {{buttonText}}
      </button>
    </div>
  </form>
</template>

<script>
import Loading from '@/components/LoadingIndicator.vue'
import ResponseMessage from '@/components/ResponseMessage.vue'

export default {
  name: 'yifferForm',

  components: { ResponseMessage, Loading, },

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
  },

  data: function () {
    return {}
  },

  methods: {
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
