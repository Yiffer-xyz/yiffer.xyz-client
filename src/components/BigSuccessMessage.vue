<template>
  <div style="display: flex; flex-direction: column; align-items: center;"
       :class="classes">
    <CheckIcon class="icon-2x"/>
    <p>{{text ? text : 'Success!'}}</p>
  </div>
</template>

<script>
import CheckIcon from 'vue-material-design-icons/Check.vue'

export default {
  name: 'bigSuccessMessage',

  props: {
    text: String,
    classes: String,
  },
  
  components: {
    CheckIcon,
  },
}
</script>
