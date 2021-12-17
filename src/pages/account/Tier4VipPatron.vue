<template>
  <div>
    <h4 class="mb-8">
      Reward: VIP patron
    </h4>

    <p>
      I, the owner and developer, cannot thank you enough for your immense support. If you go to the <router-link to="/" class="underline-link">main page</router-link> you'll see a special thank you message as long as your display name above is set! If there are other VIP patrons, you'll see yours show up randomly in equal amounts to the others.
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