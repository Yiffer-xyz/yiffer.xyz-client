<template>
  <router-link :to="'/'" class="underline-link backToIndex" :class="classes">
    <home-icon/> to front page
  </router-link>
</template>

<script>
import HomeIcon from 'vue-material-design-icons/Home.vue'
export default {
  name: 'backToIndex',

  props: {
    'classes': String,
  },

  components: {
    HomeIcon
  },
}
</script>

<style lang="scss">
.backToIndex {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
