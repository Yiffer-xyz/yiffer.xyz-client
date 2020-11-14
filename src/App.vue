<template>
  <div id="app">
    <div class="theme-button-container">
      <span
        class="navigation-button underline-link" 
        @click="setTheme('light')" 
      >Light</span>

      <span
        class="navigation-button underline-link" 
        @click="setTheme('dark')"  
      >Dark</span>
    </div>

    <div class="theme-button-container theme-button-container-left">
      <router-link 
        :to="{ name: 'comicList' }"
        class="navigation-button underline-link"
        style="margin-left: 2px;">Home</router-link>

      <router-link 
        v-if="$store.getters.isAuthenticated"
        :to="{ name: 'account' }"
        class="navigation-button underline-link">Account</router-link>

      <router-link 
        v-if="$store.getters.isAuthenticated && ($store.getters.userData.userType === 'mod' || $store.getters.userData.userType === 'admin')"
        :to="{ name: 'admin' }"
        class="navigation-button underline-link">Admin</router-link>

      <span
        v-show="!$store.getters.isAuthenticated" 
        class="navigation-button underline-link" 
        @click="showLoginModal()">Log in</span>

      <span
        v-show="!$store.getters.isAuthenticated" 
        class="navigation-button underline-link" 
        @click="showSignupModal()">Sign up</span>

      <span 
        v-show="$store.getters.isAuthenticated" 
        class="navigation-button underline-link" 
        @click="logout()">Log out</span>
    </div>

    <login-modal v-show="$store.getters.getLoginModalVisibility()"></login-modal>
    <voting-modal v-show="$store.state.votingModalVisibility"></voting-modal>

    <!-- <div v-if="!hasConsented" class="consent-overlay">
      <div class="consent-content">
        <p>Yiffer.xyz contains explicit imagery not suited for those under 18 years old.</p>
        <p>We also use cookies to enhance your user experience.</p>

        <button @click="setConsent">
          I am 18+ and I consent to the use of cookies
        </button>
      </div>
    </div> -->

    <main class="main">
      <router-view/>
    </main>

    <footer class="footer">
      <p><router-link to="/about">Contact/about</router-link></p>
      <p>Made by <a href="https://twitter.com/Malann_kitty" target="_blank"><TwitterIcon/>Malann</a></p>
    </footer>
  </div>
</template>

<script>
import LoginModal from '@/components/LoginModal.vue'
import VotingModal from '@/components/VotingModal.vue'
import TwitterIcon from 'vue-material-design-icons/Twitter.vue'

import miscApi from './api/miscApi'

export default {
  components: {
    'login-modal': LoginModal,
    'voting-modal': VotingModal,
    TwitterIcon,
  },

  metaInfo() {
    return {
      meta: [
        {name: 'twitter:card', content: 'summary'},
        {vmid: 'twitterTitle', name: 'twitter:title', content: 'Yiffer.xyz'},
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry porn comics, easily readable and free!"},
        // image must be an absolute path
        {name: 'twitter:image', content: '/assets/logo.png'},
        
        {vmid: 'ogTitle', property: 'og:title', content: 'Yiffer.xyz'},
        {property: 'og:site_name', content: 'Yiffer.xyz'},
        {property: 'og:type', content: 'website'},
        {property: 'og:image', content: '/assets/logo.png'},
        {vmid: 'ogDesc', property: 'og:description', content: "The internet's best collection of high quality furry porn comics, easily readable and free!"}
      ]
    }
  },

  methods: {
    setTheme( themeColor ) {
      document.body.classList.remove('dark')
      document.body.classList.remove('redblue')
      document.body.classList.remove('pink')
      if ( themeColor === 'dark' ) {
        document.body.classList.add('dark')
        this.$store.commit('setDarkTheme', true)
        this.$cookies.set('theme', 'dark')
      }
      else if ( themeColor === 'redblue') {
        document.body.classList.add('redblue')
        this.$store.commit('setDarkTheme', false)
        this.$cookies.set('theme', 'light')
      }
      else if ( themeColor === 'pink') {
        document.body.classList.add('pink')
        this.$store.commit('setDarkTheme', false)
        this.$cookies.set('theme', 'light')
      }
      else {
        this.$store.commit('setDarkTheme', false)
        this.$cookies.set('theme', 'light')
      }

      miscApi.logEvent('theme', themeColor)
    },

    setConsent () {
      this.hasConsented = true
      this.$cookies.set('hasConsented', '1')
    },

    showLoginModal () {
      this.$store.commit('setLoginModalVisibility', true)
    },

    showSignupModal () {
      this.$store.commit('setLoginModalContext', 'register')
      this.showLoginModal()
    },

    logout () {
      this.$store.dispatch('logout')
      if (this.$router.history.current.fullPath == '/profile' || this.$router.history.current.fullPath == '/admin') {
        this.$router.replace('/')
      }
    }
  },

  data: function () {
    return {
      darkTheme: false,
      hasConsented: true,
    }
  },

  created: function () {
    this.$cookies.config('60d')
    this.$store.dispatch('checkAndSetLoginStatus')
    this.$store.dispatch('fetchKeywordList')
    if (this.$cookies.get('theme') && this.$cookies.get('theme')==='dark') {
      this.setTheme('dark')
    }
    else {
      this.setTheme('light')
    }

    if (!this.$cookies.get('hasConsented')) {
      this.hasConsented = false
    }

    let isExpanded = this.$cookies.get('isSearchFilteringExpanded')
    if (isExpanded && Number(isExpanded) === 1) {
      this.$store.commit('setIsFilterSectionExpanded', true)
    }
  },

  watch: {
    '$route' (to, from) {
      console.log('Route changed from ' + from.path + ' to ' + to.path)
    }
  }
}
</script>

<style lang="scss">
@import "@/scss/button-styles.scss";
@import "@/scss/text-styles.scss";
@import "@/scss/forms.scss";
@import "@/scss/general.scss";
@import "@/scss/shadows.scss";

$footerHeight: 2.25rem;

.footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #202325;
  border-top: 1px solid $themeGray3;
  height: $footerHeight;
  width: 100%;
  margin-top: 2rem;
  box-shadow: 0 -2px 6px rgba(0,0,0,0.1);
  position: absolute;
  bottom: 0;
  p, a {
    font-size: 0.85rem !important;
  }
  p {
    margin: 0 1rem;
    color: white;
  }
    
  border-style: solid;
  border-width: 0;
  border-top-width: 10px;
  border-image: linear-gradient(to right, $theme2, $theme6) 1; 

}

.dark {
  .footer {
    background-color: $themeDark4;
    border-color: $themeDark1;
    color: #ddd;
  }
}

.main {
  padding-bottom: $footerHeight + 1.5rem;
}

.consent-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(8px);

  .consent-content {
    padding: 2rem;
    background-color: $themeGray1;
    border-style: solid;
    border-width: 0;
    border-top-width: 10px;
    border-image: linear-gradient(to right, $theme2, $theme6) 1; 
    // border-radius: 8px;
  }

  p {
    font-size: 1.25rem;
    margin-top: 0.5rem;
  }
  button {
    margin-top: 1rem;
    outline: none;
    border: none;
    font-size: 1.1rem;
    padding: 1rem 1.5rem;
    background-color: $theme5;
    color: white;
    border-radius: 4px;
    font-weight: 400;
    &:hover {
      cursor: pointer;
      background: $theme4;
    }
  }

  @media screen and (max-width: 900px) {
    .consent-content {
      padding: 2rem 1rem;
    }
    button {
      font-size: 1rem;
      padding: 1rem 1rem;
    }
    p {
      font-size: 1rem;
    }
  }
}
</style>
