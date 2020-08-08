<template>
  <div style="width: 100%;">
    <vue-headful :title="'Join us - Yiffer.xyz'"/>
    <h1>Becoming a mod</h1>
    <back-to-index></back-to-index>

    <div class="full-width-text">
      <p>
        Yiffer.xyz would not be what it is without our wonderful mods. Being a mod is voluntary work - in addition to getting the feeling of helping our comic-loving community, a reward is the ability to <u>download any comic</u> at the click of a button. It's the least we could do.
      </p>

      <p>
        If we feel satisfied with the amount of mods we currently have, you may be put on a waiting list. While it might be the case that more is better, we believe it wise to keep the number from being too high.
      </p>

      <div class="mt-16">
        <router-link :to="{name: 'joinUsApply'}" v-if="$store.getters.isAuthenticated" class="underline-link">
          Apply as a mod here <RightArrow/>
        </router-link>
        <div v-else>
          <p class="semiBold">
            To apply as a mod,
            <button class="underline-link text-button link-color" @click.prevent="showLoginModal">
              <LoginIcon/> Log in
            </button> 
          </p>
        </div>
      </div>

      <p>
      </p>

      <h3>What are a mod's tasks?</h3>
      <p class="mt-0">
        In short, helping out with keeping comics up to date, adding new ones, and processing user suggestions. We have built a very well functioning admin panel which should make this as comfortable as possible, you should even be able to do the last part - processing user suggestions - on your phone comfortably. Longer and more comprehensive list of the tasks:
        <br/>
        <ul style="padding-left: 20px; margin-bottom: 16px;">
          <li>
            Processing comic suggestions from others (rejecting them, or uploading the comic with pages, information, and tags)
          </li>
          <li>
            Adding pages to existing comics as they are updated. Additionally swap, replace, insert pages, and update thumbnails as needed
          </li>
          <li>
            Processing tag suggestions from other users (suggestions of adding/removing tags to a comic)
          </li>
          <li>
            Adding tags to comics where needed
          </li>
          <li>
            Keeping artist information up to date
          </li>
          <li>
            You'll be able to see visitor statistics (numbers per day, and per route and comic) if you're interested
          </li>
          <li>
            If we decide to re-implement comments at some point, moderating these will also be a mod's job
          </li>
        </ul>
      </p>

      <p>
        There are some tasks that only the admin(s) of Yiffer.xyz do: Giving final approval of comics added by mods, dealing with ads, and writing "blog" posts.
      </p>

      <h3 class="mt-16">How much do I have to "work"?</h3>
      <p class="mt-0">
        There is no defined lower requirement for how much a mod should contribute. In the admin panel, there is a "Mod scoreboard" that we hope might motivate people to do more, <i>but you should not feel bad for not being far up</i>. If we notice that someone is really slacking off, and see no activity for months, we will always message the person in question before taking any action. If you at any point wish to stop being a mod, please do say so instead of simply going inactive.
      </p>

      <div class="mt-16">
        <router-link :to="{name: 'joinUsApply'}" v-if="$store.getters.isAuthenticated" class="underline-link">
          Apply as a mod here <RightArrow/>
        </router-link>
        <div v-else>
          <p class="semiBold">
            To apply as a mod,
            <button class="underline-link text-button link-color" @click.prevent="showLoginModal">
              <LoginIcon/> Log in
            </button> 
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'

import miscApi from '../api/miscApi'

import RightArrow from 'vue-material-design-icons/ArrowRight.vue'

export default {
  name: 'joinUs',
  
  components: {
    'back-to-index': BackToIndex,
    RightArrow,
  },

  methods: {
    showLoginModal () {
      this.$store.commit('setLoginModalVisibility', true)
    },
  },

  mounted () {
    miscApi.logRoute('join us')
  }
}
</script>
