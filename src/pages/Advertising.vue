<template>
  <div style="width: 100%;">
    <vue-headful :title="'Advertising - Yiffer.xyz'"/>
    <h1>Advertising</h1>
    <BackToIndex></BackToIndex>

    <div class="full-width-text full-width-text-wider">
      <p>From its initial launch in 2016, until the summer of 2020, Yiffer.xyz has been funded mostly out of the owner's pocket, but also by donators. With the huge upgrade of the site in 2020, costs have increased. As the owner of the site, I want nothing more than to give users the best browsing experience possible, but doing so without other sources of funding would be too expensive at this point. "Regular" ads organized through third parties are hideous and we would like to avoid them if possible. Therefore, we are going to try advertising furry* creators only! Not only will this give opportunities for creators in the community - the ads are much more likely to be relevant to viewers, and are much less annoying.</p>

      <div class="mt-16">
        <router-link :to="{name: 'apply-advertising'}" v-if="$store.getters.isAuthenticated" class="underline-link">
          Apply as an advertiser here <RightArrow/>
        </router-link>
        <div v-else>
          <p class="semiBold">
            To apply as an advertiser,
            <button class="underline-link text-button link-color" @click.prevent="showLoginModal">
              <LoginIcon/> Log in
            </button> 
          </p>
        </div>
      </div>

      <h3 class="mt-16">How it works</h3>
      <p class="no-margin-top">
        If you are a creator of arts or crafts (digital art, traditional art, fursuits, plushies, writing, photography, etc.), and your content is furry or at least somewhat related, you may apply using the form below! You will submit images or gifs detailed below, which will show up, either in the index page of Yiffer.xyz or in the page for all comics (for instance <router-link :to="'/Masodonia'">yiffer.xyz/Masodonia</router-link>), depending on ad type.
      </p>

      <h3 class="mt-16">Is it worth it?</h3>
      <p class="no-margin-top">
        Probably! As of the summer of 2020, Yiffer.xyz has about 20,000 unique visitors per day, constantly growing. We record how many clicks your ads get and visualize this on your profile page, so after you have been accepted as an advertiser, you can get a better idea of whether or not to keep going. Keep in mind that compared to other sites, Yiffer.xyz will probably - at least in the beginning - have much fewer advertisers, so <u>your own ads will appear more often</u> than they would on other sites. Additionally, these ads <u>cannot be blocked by adblockers</u>.
      </p>

      <p><span class="bold">*For the earliest advertisers, we are cutting the cost in half during the first few months!</span> So be sure to apply as soon as you're certain, or tell your creative friends!</p>

      <h3 class="mt-16">Pricing</h3>
      <table v-if="$breakpoint.lgAndUp" class="y-table no-table-hover">
        <thead>
          <tr>
            <th style="width: 7rem">Type</th>
            <th>Duration</th>
            <th style="width: 7.5rem">Price</th>
            <th>Explanation</th>
          </tr>
        </thead>
        <tr>
          <td rowspan="2">As comic card</td>
          <td>2 months</td>
          <td>20$ per month<br>(10$ now*)</td>
          <td rowspan="2">
            <p class="no-margin-top">Your ad will appear at random in the same style as a "comic card" on the index page.</p>
            <p>Pictures below illustrate this kind of ad, on desktop and mobile views respectively.</p>

            <div class="ad-pics-container">
              <img src="/assets/example-1.png" :style="{'max-height': ad1Expanded ? '330px' : '120px'}" class="ad-pic"/>
              <img src="/assets/example-1-mobile.png" :style="{'max-height': ad1Expanded ? '330px' : '120px'}" class="ad-pic"/>
              <p v-show="!ad1Expanded" class="link-color cursor-pointer" @click="ad1Expanded = true">Bigger pictures</p>
              <p v-show="ad1Expanded" class="link-color cursor-pointer" @click="ad1Expanded = false">Smaller pictures</p>
            </div>

            <p>
              Media: PNG or GIF format, 200x283 pixels precisely.<br/>
              Main text max 25 characters.<br/>
              Secondary text optional, and max 40 characters.
            </p>
          </td>
        </tr>

        <tr>
          <td>4 months</td>
          <td>15$ per month<br>(7$ now*)</td>
        </tr>

        <tr>
          <td>Wide banner</td>
          <td>1 month</td>
          <td>35$ per month<br>(17$ now*)</td>
          <td>
            <p class="no-margin-top">
              This is an experimental type of ad. If there is interest for it, we will offer long-term commitments for this as well.
            </p>
            <p>
              Your ad will be displayed <u>above comics</u>, between the comic's title and the first comic page. This placement is very eye-catching, hence the increased price. Every comic will have some ad displayed above it.
            </p>
            <p>
              Pictures below illustrate this kind of ad, on desktop and mobile views respectively.
            </p>
            
            <div class="ad-pics-container" style="display: flex;" :style="{'flex-direction': ad2Expanded ? 'column' : 'row'}">
              <img src="/assets/example-2.png" :style="{'max-width': ad2Expanded ? '330px' : '140px'}" class="ad-pic"/>
              <img src="/assets/example-2-mobile.png" :style="{'max-width': ad2Expanded ? '330px' : '140px'}" class="ad-pic"/>
            </div>

            <p v-show="!ad2Expanded" class="link-color cursor-pointer" @click="ad2Expanded = true" style="text-align: center;">
              Bigger pictures
            </p>
            <p v-show="ad2Expanded" class="link-color cursor-pointer" @click="ad2Expanded = false" style="text-align: center;">
              Smaller pictures
            </p>

            <p>
              Media: PNG or GIF format, 100x680 pixels precisely. Make sure that content is visible when media is scaled down - it will shrink to a mobile phone's width on mobile devices.
            </p>
          </td>
        </tr>
      </table>

      <div v-else>
        <div class="mobile-list-table">
          <p>
            <span class="bold">Type</span>: As comic card
          </p>
          <p>
            <span class="bold">Price</span>:<br/>
            2 months: 20$ per month (10$ now*)<br/>
            4 months: 15$ per month (7$ now*)
          </p>
          <p>
            <span class="bold">Explanation</span>:
          </p>
          <p class="no-margin-top">
            Your ad will appear at random in the same style as a "comic card" on the index page.
          </p>
          <p>
            Pictures below illustrate this kind of ad, on desktop and mobile views respectively.
          </p>
          <div class="ad-pics-container-mobile">
            <img src="/assets/example-1.png" :style="{'max-height': ad1Expanded ? '330px' : '120px'}" class="ad-pic"/>
            <img src="/assets/example-1-mobile.png" :style="{'max-height': ad1Expanded ? '330px' : '120px'}" class="ad-pic"/>
            <p v-show="!ad1Expanded" class="link-color cursor-pointer" @click="ad1Expanded = true">Bigger pictures</p>
            <p v-show="ad1Expanded" class="link-color cursor-pointer" @click="ad1Expanded = false">Smaller pictures</p>
          </div>
          <p>
            Media: PNG or GIF format, 200x283 pixels precisely.<br/>
            Main text max 25 characters.<br/>
            Secondary text optional, and max 40 characters.
          </p>
        </div>
        <div class="mobile-list-table">
          <p>
            <span class="bold">Type</span>: Wide banner above comic
          </p>
          <p>
            <span class="bold">Price</span>:<br/>
            1 month: 35$ per month (17$ now*)<br/>
          </p>
          <p>
            <span class="bold">Explanation</span>:
          </p>
          <p class="no-margin-top">
            This is an experimental type of ad. If there is interest for it, we will offer long-term commitments for this as well.
          </p>
          <p>
            Your ad will be displayed <u>above comics</u>, between the comic's title and the first comic page. This placement is very eye-catching, hence the increased price. Every comic will have some ad displayed above it.
          </p>
          <p>
            Pictures below illustrate this kind of ad, on desktop and mobile views respectively.
          </p>
          <div class="ad-pics-container-mobile" style="display: flex;" :style="{'flex-direction': ad2Expanded ? 'column' : 'row'}">
            <img src="/assets/example-2.png" :style="{'max-width': ad2Expanded ? '330px' : '140px'}" class="ad-pic"/>
            <img src="/assets/example-2-mobile.png" :style="{'max-width': ad2Expanded ? '330px' : '140px'}" class="ad-pic"/>
          </div>

          <p v-show="!ad2Expanded" class="link-color cursor-pointer" @click="ad2Expanded = true">
            Bigger pictures
          </p>
          <p v-show="ad2Expanded" class="link-color cursor-pointer" @click="ad2Expanded = false">
            Smaller pictures
          </p>

          <p>
            Media: PNG or GIF format, 100x680 pixels precisely. Make sure that content is visible when media is scaled down - it will shrink to a mobile phone's width on mobile devices.
          </p>
        </div>

      </div>

      <p>
        As we don't have any experience with advertisers yet, these prices may change in the future. If you have paid for an X-month commitment, you will not be affected by these changes for the duration of your commitment. Remember the 50% discount as long as it is stated here!
      </p>

      <h3 class="mt-16">Additional information</h3>
      <ul>
        <li>The frequency of your ads showing up entirely depends on how many advertisers there are in total. If there are ten advertisers, every tenth ad (give or take) will be your own. This goes for all types of ads.</li>
        <li>Each price is for a single ad with a single image/gif. It is perfectly fine to apply several times with different images/gifs, but these will be treated as separate ads and you will have to pay for each one.</li>
        <li>Any questions you have now or as an advertiser can be directed to EPOST@EPOST.COM. We will happily answer any questions you may have.</li>
        <li>The ads may be explicit, but don't go overboard. Geniatlia may be visible, but it should not be a big or the entire part of the image/gif.</li>
        <li>Gifs must not have rapidly flashing lights or colors.</li>
      </ul>

      <div class="mt-16">
        <router-link :to="{name: 'apply-advertising'}" v-if="$store.getters.isAuthenticated" class="underline-link">
          Apply as an advertiser here <RightArrow/>
        </router-link>
        <div v-else>
          <p class="semiBold">
            To apply as an advertiser,
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
import LoginIcon from 'vue-material-design-icons/Login.vue'

export default {
  name: 'advertising',
  
  components: {
    BackToIndex,
    RightArrow, LoginIcon,
  },

  data () {
    return {
      ad1Expanded: false,
      ad2Expanded: false,
    }
  },

  methods: {
    showLoginModal () {
      this.$store.commit('setLoginModalVisibility', true)
    },
  },

  mounted () {
    miscApi.logRoute('advertising')
  }
}
</script>

<style lang="scss">
.ad-pics-container {
  margin: 0 auto 0 auto;
  width: fit-content;
  p {
    text-align: center;
    margin-top: 0;
  }
  img {
    align-self: center;
  }
}
.ad-pics-container-mobile {
  margin: 0;
  p {
    margin-top: 0;
  }
  img {
    align-self: center;
  }
}
.ad-pic {
  margin: 0.5rem;
}
.mobile-list-table {
  border-top: 1px solid #aaa;
  border-bottom: 1px solid #aaa;
  p:first-child {
    margin-top: 0;
  }
  padding: 0.25rem 0;
}
</style>