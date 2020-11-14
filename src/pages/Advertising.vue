<template>
  <div style="width: 100%;">
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
        If you are a creator of arts or crafts (digital art, traditional art, fursuits, plushies, writing, photography, etc.), and your content is furry or at least somewhat related, you may apply using the form below! You will submit images or gifs detailed below, which will show up, either in the index page of Yiffer.xyz or in the page for all comics (for instance <router-link :to="'/Masodonia'">yiffer.xyz/Masodonia</router-link>), depending on ad type. Naturally, when a user clicks your ad, they will be directed to a website of your choosing, for instance your FA page, Twitter, etc.
      </p>

      <h3 class="mt-16">Is it worth it?</h3>
      <p class="no-margin-top">
        Probably! As of the summer of 2020, Yiffer.xyz has about 20,000 unique visitors per day, constantly growing. We record how many clicks your ads get and visualize this on your account page, so after you have been accepted as an advertiser, you can get a better idea of whether or not to keep going. Keep in mind that compared to other sites, Yiffer.xyz will probably - at least in the beginning - have much fewer advertisers, so <u>your own ads will appear more often</u> than they would on other sites. Additionally, these ads <u>cannot be blocked by adblockers</u>.
      </p>

      <p><span class="bold">*For the earliest advertisers, we are cutting the cost in half during the first few months!</span> So be sure to apply as soon as you're certain, or tell your creative friends!</p>

      <h3 v-if="$breakpoint.lgAndUp" class="mt-16">Pricing</h3>
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
          <td rowspan="2"><b>As comic card</b></td>
          <td>2 months</td>
          <td><b>20$</b> per month<br>(<b>10$ now*</b>)</td>
          <td rowspan="2">
            <p class="no-margin-top">Your ad will appear at random in the same style as a "comic card" on the index page.</p>
            <p>Pictures below illustrate this kind of ad, on desktop and mobile views respectively.</p>

            <div class="ad-pics-container">
              <img src="/assets/example-1.png" style="max-height: 300px;" class="ad-pic"/>
              <img src="/assets/example-1-mobile.png" style="max-height: 300px;" class="ad-pic"/>
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
          <td><b>15$</b> per month<br>(<b>7$ now*</b>)</td>
        </tr>

        <tr>
          <td><b>Wide banner</b></td>
          <td>1 month</td>
          <td><b>35$</b> per month<br>(<b>17$ now*</b>)</td>
          <td>
            <p class="no-margin-top">
              This is an experimental type of ad. If there is interest for it, we will offer long-term commitments for this as well.
            </p>
            <p>
              Your ad will be displayed <u>above comics</u>, between the comic's title and the first comic page. This placement is very eye-catching, hence the increased price. Every comic will have some ad displayed above it.
            </p>
            <p>
              The picture below illustrates this kind of ad, which looks very similar on desktop and mobile.
            </p>
            
            <div class="ad-pics-container" style="display: flex;">
              <img src="/assets/example-2.png" style="max-width: 420px;" class="ad-pic"/>
            </div>

            <p>
              Media: PNG or GIF format, 100x680 pixels precisely. Make sure that content is visible/readable when media is scaled down - it will shrink to a mobile phone's width on mobile devices.
            </p>
          </td>
        </tr>
      </table>

      <div v-else>
        <div class="mobile-list-table">
          <h3>Ad type: As comic card</h3>
          <p>
            <span class="bold">Price</span>:<br/>
            2 months: <b>20$</b> per month (<b>10$</b> now*)<br/>
            4 months: <b>15$</b> per month (<b>7$</b> now*)
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
            <p v-show="!ad1Expanded" class="link-color cursor-pointer" @click="ad1Expanded = true" style="margin-top: 0;">
              Bigger pictures
            </p>
            <p v-show="ad1Expanded" class="link-color cursor-pointer" @click="ad1Expanded = false" style="margin-top: 0;">
              Smaller pictures
            </p>
          </div>
          <p>
            Media: PNG or GIF format, 200x283 pixels precisely.<br/>
            Main text max 25 characters.<br/>
            Secondary text optional, and max 40 characters.
          </p>
        </div>
        <div class="mobile-list-table">
          <h3>Ad type: Banner above comic</h3>
          <p>
            <span class="bold">Price</span>:<br/>
            1 month: <b>35$</b> per month (<b>17$ now*</b>)<br/>
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
            The picture below illustrates this kind of ad, which looks very similar on desktop and mobile.
          </p>

          <img src="/assets/example-2.png" style="max-width: 100%; max-height: 20rem;" class="ad-pic"/>

          <p>
            Media: PNG or GIF format, 100x680 pixels precisely. Make sure that content is visible/readable when media is scaled down - it will shrink to a mobile phone's width on mobile devices.
          </p>
        </div>

      </div>

      <p>
        As we don't have any experience with advertisers yet, these prices may change in the future. If you have paid for an X-month commitment, you will not be affected by these changes for the duration of your commitment. Remember the 50% discount as long as it is stated here!
      </p>

      <h3 class="mt-16">Additional information</h3>
      <ul>
        <li>The frequency of your ads showing up entirely depends on how many advertisers there are in total. If there are ten advertisers, every tenth ad (give or take) will be your own. This goes for all types of ads.</li>

        <li>Each price is for a single ad with a single image/gif. It is perfectly fine to apply several times with different images/gifs, but these will be treated as separate ads and you will have to pay for each one. Naturally, if you've paid for two ads and there are ten in total, about <i>two</i> out of every ten ads displayed will be yours.</li>

        <li>We will happily answer any questions you may have regarding advertising at EPOST@EPOST.COM.</li>

        <li>The ads may be explicit, as this is mostly a porn site, after all. However, we don't allow content or kinks that are commonly frowned upon in the ad media. If you're uncertain, feel free to ask us at EPOST@EPOST.COM in advance.</li>

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

  mounted () {
    miscApi.logRoute('advertising')
  },

  methods: {
    showLoginModal () {
      this.$store.commit('setLoginModalVisibility', true)
    },
  },

  metaInfo () {
    let title = `Advertising - Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry porn comics, easily readable and free!"},
        {vmid: 'ogDesc', property: 'og:description', content: "The internet's best collection of high quality furry porn comics, easily readable and free!"}
      ]
    }
  },
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
  padding-top: 1rem;
  padding-bottom: 1rem;
  &:last-child {
    border-bottom: 1px solid #aaa;
  }
  &:first-child {
    margin-top: 1rem;
  }
  p {
    margin-top: 0.5rem;
  }
}
</style>