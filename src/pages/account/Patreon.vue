<template>
  <div>
    <div v-if="!userData.patreonTier">
      <h3>
        Patreon
      </h3>
      <p class="mt-0">
        You can connect your Yiffer.xyz account to your Patreon account. If you have subscribed to Yiffer.xyz on Patreon (<router-link :to="{ name: 'support'}" class="underline-link">read more here</router-link>), you will automatically receive the benefits according to your tier. If you are not a patron, connecting will not have any effect.
      </p>

      <a :href="`https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${config.patreonClientId}&redirect_uri=https://beta2.yiffer.xyz/api/patreon/callback&state=${userData.id}`"
          class="fitContent" style="display: block;">
        <button class="y-button mt-4">
          Connect to Patreon account
        </button>
      </a>
    </div>

    <div v-else>
      <h3>
        Patreon
      </h3>

      <div v-if="patreonTiers.fetched">
        <p>
          Connected to Patreon! Your current tier is <b>${{activeTierData.amountCents/100}}/month</b>.
        </p>
        <a href="https://www.patreon.com/yifferxyz" target="_blank" class="underline-link">
          Go to your pledge <RightArrow/>
        </a>

        <div class="mt-16">
          <!-- TIER 1 -->
          <p v-if="userData.patreonTier === 1">
            Your current tier gives no benefits on Yiffer.xyz, but we appreciate your support a whole lot ❤️. Without it, this website wouldn't survive!
          </p>

          <!-- TIER 2+, PIC AND NAME -->
          <Tier2SupportListView
            v-else-if="activeTierData.showInPatronList"
            :userData="userData"
            :canAddLink="activeTierData.showLinkInPatronList"
          />

          <!-- TIER 2+, PIC AND NAME -->
          <Tier3Voting
            v-if="activeTierData.canVoteOnFeatures"
            :userData="userData"
          />

          <!-- TIER 2+, PIC AND NAME -->
          <Tier4VIP
            v-if="activeTierData.isVIPPatron"
            :userData="userData"
          />
        </div>

        <p class="mt-8">
          Changed your tier recently? Use the button below to update. You can unlink your Patreon account from Yiffer.xyz. This will not affect your patreon pledge, and you can re-link it later.
        </p>

        <div class="horizontalFlex justifyStart mt-8">
          <LoadingButton @click="syncTier"
                         :isLoading="syncPatreonTier.fetching"
                         text="Sync tier"
                         iconType="refresh"
                         color="primary"
                         class="mr-16"/>

          <LoadingButton @click="unlinkAccount"
                         :isLoading="unlinkPatreonAccount.fetching"
                         text="Unlink Patreon account"
                         iconType="unlink"
                         color="error"/>
        </div>
      </div>
            
      <Loading v-else/>
    </div>
  </div>
</template>

<script>
import patreonApi from '@/api/patreonApi'
import { doFetch } from '@/utils/statefulFetch'
import config from '@/config.json'

import Loading from '@/components/LoadingIndicator.vue'
import LoadingButton from '@/components/LoadingButton.vue'

import RightArrow from 'vue-material-design-icons/ArrowRight.vue'

import Tier2SupportListView from './Tier2SupportListView.vue'
import Tier3Voting from './Tier3Voting.vue'
import Tier4VIP from './Tier4VipPatron.vue'

import { mapGetters } from 'vuex'



export default {
  components: {
    Loading, LoadingButton,
    RightArrow,
    Tier2SupportListView, Tier3Voting, Tier4VIP,
  },

  computed: {
    ...mapGetters(['userData', 'patreonTiers', 'unlinkPatreonAccount', 'syncPatreonTier']),

    activeTierData () {
      return this.patreonTiers.payload.find(tier => tier.dbTierNumber === this.userData.patreonTier)
    }
  },

  data () {
    return {
      config,
    }
  },

  async mounted () {
    if (!this.patreonTiers.fetched && !this.patreonTiers.fetching) {
      doFetch(this.$store.commit, 'patreonTiers', patreonApi.getPatreonTiers())
    }
  },

  methods: {
    async unlinkAccount () {
      let result = await doFetch(this.$store.commit, 'unlinkPatreonAccount', patreonApi.unlinkPatreonAccount())
      if (result) {
        this.$store.commit('setUserData', result)
      }
    },

    async syncTier () {
      let result = await doFetch(this.$store.commit, 'syncPatreonTier', patreonApi.syncPatreonTier())
      if (result) {
        this.$store.commit('setUserData', result)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
hr {
  margin: 1rem 0;
}
</style>