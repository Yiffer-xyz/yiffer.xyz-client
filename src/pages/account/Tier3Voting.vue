<template>
  <div>
    <h4 class="mb-8">
      Reward: Voting on features
    </h4>

    <p>
      Show us which upgrades you desire most! We will use your answers to prioritize tasks when further developing the website. We won't necessarily follow it from most upvoted to least, but answers will help us know our most valued users better.
    </p>

    <p class="mt-16">
      The current poll can be found on <a href="https://www.patreon.com/yifferxyz" target="_blank" class="underline-link">Patreon</a>! If you're a $15+ patron with quadrupled voting power, you'll have two polls to vote in. If you've got suggestions that are not in the list, you can always submit them on our <router-link to="/feedback" class="underline-link">Feedback</router-link> page. Suggestions received there might be included in future polls.
    </p>
    <hr class="mb-16 mt-16">
  </div>
</template>

<script>

export default {
  props: {
    userData: Object,
  },
  
  components: {
  },

  computed: {
  },

  data () {
    return {
    }
  },

  methods: {
  }
}
</script>

<style>

</style>