<template>
  <div style="width: 100%;">
    <vue-headful :title="'Apply as an advertiser - Yiffer.xyz'"/>
    <h1>Apply as an advertiser</h1>
    <BackToIndex></BackToIndex>

    <p>Ok</p>
  </div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'

import miscApi from '../api/miscApi'

import RightArrow from 'vue-material-design-icons/ArrowRight.vue'
import LoginIcon from 'vue-material-design-icons/Login.vue'

export default {
  name: 'advertisingApply',
  
  components: {
    BackToIndex,
    RightArrow, LoginIcon,
  },

  data () {
    return {
    }
  },

  methods: {
  },

  mounted () {
    miscApi.logRoute('advertising apply')
  }
}
</script>

<style lang="scss">
</style>