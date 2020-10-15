<template>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <Spinner/>
    <p v-if="text">{{text}}</p>
  </div>
</template>

<script>
import Spinner from 'vue-loading-spinner/src/components/DoubleBounce'

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
