<template>
  <div style="width: 100%" class="full-width-text full-width-text-wider mb-32">
    <h1 style="text-align: center;">Support us</h1>
    <BackToIndex/>

    <p>
      The costs of running Yiffer.xyz are significant. As of January 2022, the total monthly sum is around $500. We had hoped to balance these costs with the money paid by advertisers, but we've not received nearly as many of those as we had hoped. Until now, all expenses have been paid by the creator/owner of Yiffer.xyz himself - thousands of dollars every year. But it cannot continue like this. I truly want to provide something good to the community, and I've put so much time, effort, and money into it throughout the years. If you are able to, please help keep this website alive.
    </p>

    <a href="https://www.patreon.com/bePatron?u=61346131">
      <button class="patreonButton">
        <svg width="25px" height="24px" viewBox="0 0 256 247" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
          <g>
              <path d="M45.1355837,0 L45.1355837,246.35001 L0,246.35001 L0,0 L45.1355837,0 Z M163.657111,0 C214.65668,0 256,41.3433196 256,92.3428889 C256,143.342458 214.65668,184.685778 163.657111,184.685778 C112.657542,184.685778 71.3142222,143.342458 71.3142222,92.3428889 C71.3142222,41.3433196 112.657542,0 163.657111,0 Z" fill="#FFF"></path>
          </g>
      </svg>
        Become a patron!
      </button>
    </a>

    <h2>
      Connecting Patreon account &amp; tier rewards
    </h2>
    <p>
      Currently we've got four tiers, the three higher one with rewards. You can head over to the Patreon page to see the tier descriptions and prices. One tier benefit allows you to add your name and icon to the patron list below, as well as vote on which features you'd like Yiffer.xyz to implement next. The next tier allows you to also add a link to your name in the list, and gives you quadruple voting power in the features poll. Finally, the top tier - which we don't really expect anyone to choose, but it's there if you want to - will make your name "float" at the top of the <i>main page</i>. The message will be "Top patron: &lt;name&gt;❤️".
    </p>
    <p>
      To enable any of these rewards, you have to <u>go to your account page</u> on Yiffer.xyz and connect your Patreon account to your Yiffer.xyz-account. This is also where you'll set your display name and upload your profile picture for the patron list and the Top patron spot. You can only do this after you've connected your Patreon account.
    </p>

    <h2>
      Supporters of Yiffer.xyz❤️
    </h2>

    <p v-if="supporterList.fetching">
      Fetching...
    </p>

    <div v-if="supporterList.fetched" class="fitContent">
      <h4 class="mt-8">
        VIP, $50 supporters
      </h4>
      <div class="supporterContainer">
        <div v-for="sup in vipSupporters" :key="sup.userId" class="pt-2 pb-2 supporterItem">
          <div class="horizontalFlex alignItemsCenter justifyStart">
            <img v-if="sup.hasPatreonPicture" :src="`${config.patreonBaseUrl}/${sup.userId}.jpg`" class="supporterPic vipSupporterPic"/>
            <p>{{sup.patreonDisplayName}}</p>
          </div>
          <a v-if="sup.patreonDisplayLink" :href="sup.patreonDisplayLink" class="underline-link" target="_blank" rel="noopener noreferrer nofollow">
            {{sup.patreonDisplayLink.replaceAll('https://', '').replaceAll('http://', '')}}
          </a>
        </div>
        <p v-if="vipSupporters.length === 0">
          None yet
        </p>
      </div>

      <h4>
        $15 supporters
      </h4>
      <div class="supporterContainer">
        <div v-for="sup in betterSupporters" :key="sup.userId" class="pt-2 pb-2 supporterItem">
          <div class="horizontalFlex alignItemsCenter justifyStart">
            <img v-if="sup.hasPatreonPicture" :src="`${config.patreonBaseUrl}/${sup.userId}.jpg`" class="supporterPic"/>
            <p>{{sup.patreonDisplayName}}</p>
          </div>
          <a v-if="sup.patreonDisplayLink" :href="sup.patreonDisplayLink" class="underline-link" target="_blank" rel="noopener noreferrer nofollow">
            {{sup.patreonDisplayLink.replaceAll('https://', '').replaceAll('http://', '')}}
          </a>
        </div>
        <p v-if="betterSupporters.length === 0" class="pt-2 pb-2">
          None yet
        </p>
      </div>

      <h4>
        $5 supporters
      </h4>
      <div class="supporterContainer">
        <div v-for="sup in basicSupporters" :key="sup.userId" class="supporterItem horizontalFlex alignItemsCenter justifyStart pt-2 pb-2">
          <div class="horizontalFlex alignItemsCenter justifyStart">
            <img v-if="sup.hasPatreonPicture" :src="`${config.patreonBaseUrl}/${sup.userId}.jpg`" class="supporterPic"/>
            <p>{{sup.patreonDisplayName}}</p>
          </div>
        </div>
        <p v-if="basicSupporters.length === 0" class="pt-2 pb-2">
          None yet
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { doFetch } from '@/utils/statefulFetch'
import { mapGetters } from 'vuex'
import patreonApi from '@/api/patreonApi'
import BackToIndex from '@/components/BackToIndex.vue'
import config from '@/config.json'
import miscApi from '@/api/miscApi'

export default {
  name: 'support',

  components: {
    BackToIndex,
  },

  computed: {
    ...mapGetters(['supporterList']),

    basicSupporters () {
      if (!this.supporterList.fetched) { return [] }
      return this.supporterList.payload.filter(sup => sup.patreonTier === 2)
        .filter(sup => sup.patreonDisplayName)
        .sort(sup => sup.hasPatreonPicture ? -1 : 1)
    },

    betterSupporters () {
      if (!this.supporterList.fetched) { return [] }
      return this.supporterList.payload.filter(sup => sup.patreonTier === 3)
        .filter(sup => sup.patreonDisplayName)
        .sort((s1, s2) => {
          if (s1.hasPatreonPicture && !s2.hasPatreonPicture) { return -1 }
          if (s2.hasPatreonPicture && !s1.hasPatreonPicture) { return 1 }
          if (s1.patreonDisplayLink && !s2.patreonDisplayLink) { return -1 }
          if (s2.patreonDisplayLink && !s1.patreonDisplayLink) { return 1 }
          return 0
        })
    },

    vipSupporters () {
      if (!this.supporterList.fetched) { return [] }
      return this.supporterList.payload.filter(sup => sup.patreonTier === 4)
        .filter(sup => sup.patreonDisplayName)
        .sort((s1, s2) => {
          if (s1.hasPatreonPicture && !s2.hasPatreonPicture) { return -1 }
          if (s2.hasPatreonPicture && !s1.hasPatreonPicture) { return 1 }
          if (s1.patreonDisplayLink && !s2.patreonDisplayLink) { return -1 }
          if (s2.patreonDisplayLink && !s1.patreonDisplayLink) { return 1 }
          return 0
        })
    },
  },

  data () {
    return {
      config,
    }
  },

  methods: {
    removeUnprocessedLinks (patronList) {
      return patronList.map(patron => ({
        ...patron,
        patreonDisplayLink: patron.patreonDisplayLink
          ? (patron.isPatreonLinkApproved ? patron.patreonDisplayLink : null)
          : null
      }))
    }
  },

  mounted () {
    miscApi.logRoute('support')

    if (!this.supporterList.fetched && !this.supporterList.fetching) {
      doFetch(
        this.$store.commit,
        'supporterList',
        patreonApi.fetchSupportersForList(),
        this.removeUnprocessedLinks)
    }
  },

  metaInfo() {
    let title = `Support - Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"},
        {vmid: 'ogDesc', property: 'og:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"}
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/scss/shadows.scss";

h2 {
  margin-top: 2rem !important;
}
.patreonButton {
  @include simpleShadowSmallBtn;
  background-color: rgb(255, 66, 77);
  color: white;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 40px;
  box-shadow: none;
  outline: none;
  width: fit-content;
  border: none;
  font-size: 1.15rem;
  display: flex;
  flex-direction: row;
  margin-top: 2rem;
  transition: all 100ms;
  svg {
    margin-right: 0.75rem;
    // margin-bottom: 2px;
  }
  &:hover {
    cursor: pointer;
    background-color: rgb(230, 59, 68);
  }
}

.supporterContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: stretch;
  margin-bottom: 2rem;
}
.supporterItem {
  @include simpleshadowSmallNoHover;
  background-color: #cccccc22;
  border-radius: 8px;
  padding: 0.5rem;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.supporterPic {
  height: 46px;
  border-radius: 50%;
  margin-right: 0.25rem;
}
.vipSupporterPic {
  height: 70px;
}
</style>