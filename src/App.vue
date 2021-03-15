<template>
  <div id="app">
    <nav>
      <div class="navInner">
        <div class="navLeft">
          <router-link 
            :to="{ name: 'comicList' }"
            v-if="$breakpoint.xs"
            class="navlink">
            <HomeIcon/>
          </router-link>
          <router-link 
            :to="{ name: 'comicList' }"
            v-else
            style="font-size: 1.25rem"
            class="navlink shrikhand">
            Yiffer.xyz
          </router-link>

          <router-link 
            v-if="$store.getters.isAuthenticated"
            class="navlink"
            :to="{ name: 'account' }">
            Account
          </router-link>

          <router-link 
            v-if="$store.getters.isAuthenticated && ($store.getters.userData.userType === 'moderator' || $store.getters.userData.userType === 'admin')"
            class="navlink"
            :to="{ name: 'admin' }">
            Admin
          </router-link>

          <span
            v-show="!$store.getters.isAuthenticated" 
            class="navlink"
            @click="showLoginModal()">
            Log in
          </span>

          <span
            v-show="!$store.getters.isAuthenticated" 
            class="navlink"
            @click="showSignupModal()">
            Sign up
          </span>

          <span 
            v-show="$store.getters.isAuthenticated" 
            class="navlink"
            @click="logout()">
            Log out
          </span>
        </div>

        <div class="navRight">
          <span @click="setTheme('light')"
                v-if="$breakpoint.xs"
                class="navlink">
            <LightIcon/>
          </span>
          <span @click="setTheme('light')"
                v-else
                class="navlink">
            Light
          </span>

          <span @click="setTheme('dark')"
                v-if="$breakpoint.xs"
                class="navlink">
            <DarkIcon/>
          </span>
          <span @click="setTheme('dark')"
                v-else
                class="navlink">
            Dark
          </span>
        </div>
      </div>
    </nav>

    <login-modal v-show="$store.getters.getLoginModalVisibility()"></login-modal>
    <voting-modal v-show="$store.state.votingModalVisibility"></voting-modal>

    <div v-if="!hasConsented" class="consent-overlay">
      <div class="consent-content">
        <p>Yiffer.xyz contains explicit imagery not suited for those under 18 years old.</p>
        <p>We also use cookies to enhance your user experience.</p>

        <button @click="setConsent">
          I am 18+ and I consent to the use of cookies
        </button>
      </div>
    </div>

    <main class="main">
      <router-view/>
    </main>

    <footer class="footer" style="display: flex;"> 
      <p>
        <router-link to="/about" class="underline-link">Contact/about</router-link>
      </p>
      <p style="display: flex;">
        Made by
        <a href="https://twitter.com/Malann_kitty" target="_blank" class="underline-link ml-4">
          <TwitterIcon/>Malann
        </a>
      </p>
    </footer>
  </div>
</template>

<script>
import LoginModal from '@/components/LoginModal.vue'
import VotingModal from '@/components/VotingModal.vue'
import TwitterIcon from 'vue-material-design-icons/Twitter.vue'
import DarkIcon from 'vue-material-design-icons/LightbulbOutline.vue'
import LightIcon from 'vue-material-design-icons/Lightbulb.vue'
import HomeIcon from 'vue-material-design-icons/Home.vue'

import miscApi from './api/miscApi'

export default {
  components: {
    'login-modal': LoginModal,
    'voting-modal': VotingModal,
    TwitterIcon, DarkIcon, LightIcon, HomeIcon,
  },

  metaInfo() {
    return {
      meta: [
        {name: 'theme-color', content: '#de2a60'},
        {name: 'twitter:card', content: 'summary'},
        {vmid: 'twitterTitle', name: 'twitter:title', content: 'Yiffer.xyz'},
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry porn comics, easily readable and free!"},
        // image must be an absolute path
        {name: 'twitter:image', content: 'https://yiffer.xyz/preload-icon.jpg'},
        
        {vmid: 'ogTitle', property: 'og:title', content: 'Yiffer.xyz'},
        {property: 'og:site_name', content: 'Yiffer.xyz'},
        {property: 'og:type', content: 'website'},
        {property: 'og:image', content: 'https://yiffer.xyz/preload-icon.jpg'},
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
  },
}
</script>

<style lang="scss">
@import "@/scss/button-styles.scss";
@import "@/scss/text-styles.scss";
@import "@/scss/forms.scss";
@import "@/scss/general.scss";
@import "@/scss/shadows.scss";

$footerHeight: 2.25rem;

nav {
  background: linear-gradient(to right, $themeGreen1, $themeGreen2);
  width: 100%;
  box-shadow: 0 0px 5px #0000001a;
}

.navInner {
  max-width: 80%;
  @media screen and (max-width: 1000px) {
    max-width: 100%;
  }
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  button {
    border: none;
    outline: none;
  }
}

.navLeft, .navRight {
  padding: 0.5rem 4rem;
  @media screen and (max-width: 1000px) {
    padding: 0.5rem 0rem;
  }
}

.navlink {
  color: $themeDark1;
  padding: 0.5rem 1rem;
  @media screen and (max-width: 550px) {
    padding: 0.5rem 0.25rem;
  }
  font-weight: 600;
  &:hover {
    cursor: pointer;
    color: $themeBlueDarker;
  }
}

.navRight {
  @media screen and (max-width: 500px) {
    padding: 0.5rem 0.5rem 0.5rem 0;
    .navlink {
      padding: 0 0.5rem;
    }
  }
}
.navLeft {
  @media screen and (max-width: 500px) {
    .navlink:first-child {
      padding: 0 0.25rem 0 0.5rem !important;
      svg {
        margin-bottom: -1px;
      }
    }
  }
}

.footer {
  box-shadow: 0 0px 5px #0000001a;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, $themeGreen1, $themeGreen2);
  height: $footerHeight;
  width: 100%;
  margin-top: 2rem;
  position: absolute;
  bottom: 0;
  p, a {
    font-size: 0.85rem !important;
    font-weight: 400;
    color: $themeDark1;
  }
  p {
    margin: 0 1rem;
  }
}

.dark {
  nav {
    background: transparent;
    box-shadow: none;
    a, span {
      color: $themeBlueDark;
    }
  }
  .footer {
    border-style: solid;
    border-width: 0;
    border-top-width: 4px;
    border-image: linear-gradient(left, $themeGreen1, $themeGreen2) 1; 
    background: #161f23;
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
    background-color: $themeGray0;
    border-style: solid;
    border-width: 0;
    border-top-width: 10px;
    border-image: linear-gradient(to right, $themeGreen1, $themeGreen2) 1; 
  }

  p {
    font-size: 1.25rem;
    margin-top: 0.5rem;
  }
  button {
    @include simpleshadow;
    margin-top: 1rem;
    outline: none;
    border: none;
    font-size: 1.1rem;
    padding: 1rem 1.5rem;
    background-color: $themeBlueVeryLight;
    color: $themeDark4;
    border-radius: 4px;
    font-weight: 400;
    &:hover {
      background-color: $themeBlueLight;
      cursor: pointer;
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
