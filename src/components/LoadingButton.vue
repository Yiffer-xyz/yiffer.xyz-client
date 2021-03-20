<template>
  <button type="submit"
          class="yButtonSubmit"
          :class="{yBtnIconPadding: iconType || isLoading, yButtonDisabled: isDisabled, yButtonLoading: isLoading}"
          @click="$emit('click')"
          :style="style">
    <div style="width: 1rem; height: 1rem; margin-right: 0.25rem;" v-if="iconType || isLoading">
      <Spinner v-if="isLoading"
               size="12"
               :line-size="1"
               :line-bg-color="'transparent'"
               :line-fg-color="'white'"
               style="margin-left: -0.2rem;"/>
      <CheckIcon v-else-if="iconType === 'check'"/>
      <SaveIcon v-else-if="iconType === 'save'"/>
    </div>
    {{text}}
  </button>
</template>

<script>
import Spinner from 'vue-simple-spinner'
import CheckIcon from 'vue-material-design-icons/Check.vue'
import SaveIcon from 'vue-material-design-icons/ContentSave.vue'

export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    iconType: {
      type: String,
      required: false,
      validator: prop => ['check', 'save'].includes(prop),
    },
    style: {
      type: String,
      required: false,
    }
  },

  components: {
    Spinner, CheckIcon, SaveIcon,
  }
}
</script>

<style lang="scss" scoped>
$buttonPaddingSides: 12px;
$buttonPaddingTopBot: 6px;
$buttonBorderWidth: 2px;

.yButtonSubmit {
  display: flex;
  outline: none;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.15);
  &:hover, &:focus {
    box-shadow: 0 3px 7px rgba(0,0,0,0.18);
  }
  border-radius: 4px;
  padding: $buttonPaddingTopBot $buttonPaddingSides;
  font-family: 'Mulish', sans-serif;
  font-size: 14px;
  font-weight: 600;
  background-color: $themeBlueDark;
  color: white;
  border: 2px solid $themeBlueDark;
  width: fit-content;
  word-break: keep-all;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  transition: background-color 100ms, border-color 100ms, box-shadow 100ms;

  &:hover, &:focus {
    cursor: pointer;
    background-color: $themeBlueDarker;
    border-color: $themeBlueDarker;
  }

  span {
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin-bottom: 1px;
  }
}

.yBtnIconPadding {
  padding-right: $buttonPaddingSides+2px;
  padding-left: $buttonPaddingSides - 2px;
}

.dark {
  .yButtonSubmit {
    background-color: $themeBlueDT;
    border-color: $themeBlueDT;
    &:hover, &:focus {
      background-color: $themeBlueDTDarker;
      border-color: $themeBlueDTDarker;
    }
  }
}
.yButtonDisabled {
  opacity: 0.7;
}
.yButtonLoading {
  opacity: 0.7;
}
</style>