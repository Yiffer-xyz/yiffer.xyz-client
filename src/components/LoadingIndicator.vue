<template>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <Spinner v-if="text" line-fg-color="#de2a60" :message="text"/>
    <Spinner v-else line-fg-color="#de2a60"/>
  </div>
</template>

<script>
import Spinner from 'vue-simple-spinner'

export default {
  name: 'loadingSpinner',

  props: {
    text: String,
  },
  
  components: {
    Spinner,
  },
}
</script>
