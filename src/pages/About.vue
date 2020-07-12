<template>
  <span>
    <vue-headful :title="'About - Yiffer.xyz'"/>
    <h1>About lalal.xyz</h1>
    <back-to-index></back-to-index>
    
    <div class="full-width-text-container">
      <p class="mini-header">Mini header</p>
      <p>Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst</p> 
      <p class="mini-header">asd 2</p>
      <p>Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekstsadasdasd</p>
      <p>Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekstFiller tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst Filler tekst</p>
    </div>
  </span>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import VotingButton from '@/components/VotingButton.vue'

export default {
  name: 'about',
  components: { 'back-to-index': BackToIndex, 'voting-button': VotingButton },
  data: function () {
    return {
    }
  },
  methods: {
  },
  created: async function () {
  }
}

</script>

<style lang="scss">
.mini-header {
  font-weight: 400;
  margin-top: 15px;
}
.full-width-text-container {
  margin-right: 10%;
  margin-left: 10%;
  text-align: left;
}
</style>
