<template>
  <form class="yForm2" enctype="multipart/form-data" style="width: min(600px, 95%); margin: 1rem auto;">
    <h3>{{header}}</h3>

    <span v-show="!fetchState.fetched">
      <slot></slot>
    </span>

    <BigSuccess v-show="fetchState.fetched" :text="successText" classes="mb-16"/>

    <ErrorMessage v-if="fetchState.failed"
                  :message="errorText"
                  class="mb-16"/>

    <div style="height: 3.65rem" class="mt-32" v-if="!fetchState.fetched">
      <Loading v-if="fetchState.fetching" :text="fetchingText" classes="mb-8"/>

      <button @click.prevent="submit"
              class="y-button"
              :class="{'y-button-disabled': !canSubmit || fetchState.fetching}"
              style="align-self: center;"
              v-if="!fetchState.fetching && !fetchState.fetching && !fetchState.fetched">
        {{buttonText}}
      </button>
    </div>
  </form>
</template>

<script>
import BigSuccess from '@/components/BigSuccessMessage.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import Loading from '@/components/LoadingIndicator.vue'

export default {
  name: 'yifferForm',

  components: { ErrorMessage, Loading, BigSuccess, },

  props: {
    fetchState: Object,
    header: String,
    successText: String,
    fetchingText: String,
    errorText: String,
    buttonText: String,
    canSubmit: Boolean,
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
