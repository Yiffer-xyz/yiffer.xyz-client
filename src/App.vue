<template>
  <div id="app">
    <nav>
      <div class="navInner">
        <div class="navLeft">
          <span class="smallYifferTitle"
                style="padding: 0 1rem 0 0.5rem;">
            <router-link 
              :to="{ name: 'comicList' }"
              :class="{'coloredSmallYifferTitle': isDarkTheme && this.$route.path !== '/'}"
              class="shrikhand smallYifferTitleLink">
              {{$breakpoint.xs ? 'Y' : 'Yiffer.xyz'}}
            </router-link>
          </span>

          <router-link 
            v-if="$store.getters.isAuthenticated"
            class="navlink"
            :to="{ name: 'account' }">
            Account
          </router-link>

          <a href="https://admin.yiffer.xyz"
             v-if="$store.getters.isAuthenticated && ($store.getters.userData.userType === 'moderator' || $store.getters.userData.userType === 'admin')"
             class="navlink">
            Admin
          </a>

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

    <div v-if="!hasConsented && !isBot && hasCheckedBot" class="consentOverlay">
      <div class="consentContent">
        <p>Yiffer.xyz contains adult content not suited for those under 18 years of age.</p>
        <p>We also use cookies to enhance your user experience (in a nice way).</p>

        <button @click="setConsent" class="y-button-big marginAuto mt-16 consentButton">
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
        <a href="https://twitter.com/LewdMalann" target="_blank" class="underline-link ml-4">
          <TwitterIcon/>Malann
        </a>
      </p>
    </footer>
  </div>
</template>

<script>
import LoginModal from '@/components/login-modal/LoginModal.vue'
import VotingModal from '@/components/VotingModal.vue'
import TwitterIcon from 'vue-material-design-icons/Twitter.vue'
import DarkIcon from 'vue-material-design-icons/LightbulbOutline.vue'
import LightIcon from 'vue-material-design-icons/Lightbulb.vue'

import miscApi from './api/miscApi'
import { mapGetters } from 'vuex'

export default {
  components: {
    'login-modal': LoginModal,
    'voting-modal': VotingModal,
    TwitterIcon, DarkIcon, LightIcon,
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
    setTheme(themeColor, avoidLog) {
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

      if (!avoidLog) {
        miscApi.logEvent('theme', themeColor)
      }
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
      if (this.$route.meta.redirectOnLogout) {
        this.$router.replace('/')
      }
    }
  },

  computed: {
    ...mapGetters(['isDarkTheme']),
  },

  data: function () {
    return {
      darkTheme: false,
      hasConsented: true,
      isBot: false,
      hasCheckedBot: false,
    }
  },

  created: function () {
    var botPattern = "(Googlebot/|Googlebot-Mobile|Googlebot-Image|Googlebot-News|Googlebot-Video|AdsBot-Google([^-]|$)|AdsBot-Google-Mobile|Feedfetcher-Google|Mediapartners-Google|Mediapartners \(Googlebot\)|APIs-Google|bingbot|Slurp|[wW]get|LinkedInBot|Python-urllib|python-requests|aiohttp|httpx|libwww-perl|httpunit|nutch|Go-http-client|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|BIGLOTRON|Teoma|convera|seekbot|Gigabot|Gigablast|exabot|ia_archiver|GingerCrawler|webmon |HTTrack|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|findlink|msrbot|panscient|yacybot|AISearchBot|ips-agent|tagoobot|MJ12bot|woriobot|yanga|buzzbot|mlbot|YandexBot|YandexImages|YandexAccessibilityBot|YandexMobileBot|YandexMetrika|YandexTurbo|YandexImageResizer|YandexVideo|YandexAdNet|YandexBlogs|YandexCalendar|YandexDirect|YandexFavicons|YaDirectFetcher|YandexForDomain|YandexMarket|YandexMedia|YandexMobileScreenShotBot|YandexNews|YandexOntoDB|YandexPagechecker|YandexPartner|YandexRCA|YandexSearchShop|YandexSitelinks|YandexSpravBot|YandexTracker|YandexVertis|YandexVerticals|YandexWebmaster|YandexScreenshotBot|purebot|Linguee Bot|CyberPatrol|voilabot|Baiduspider|citeseerxbot|spbot|twengabot|postrank|TurnitinBot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|Ahrefs(Bot|SiteAudit)|fuelbot|CrunchBot|IndeedBot|mappydata|woobot|ZoominfoBot|PrivacyAwareBot|Multiviewbot|SWIMGBot|Grobbot|eright|Apercite|semanticbot|Aboundex|domaincrawler|wbsearchbot|summify|CCBot|edisterbot|seznambot|ec2linkfinder|gslfbot|aiHitBot|intelium_bot|facebookexternalhit|Yeti|RetrevoPageAnalyzer|lb-spider|Sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|OrangeBot\/|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|S[eE][mM]rushBot|yoozBot|lipperhey|Y!J|Domain Re-Animator Bot|AddThis|Screaming Frog SEO Spider|MetaURI|Scrapy|Livelap[bB]ot|OpenHoseBot|CapsuleChecker|collection@infegy.com|IstellaBot|DeuSu\/|betaBot|Cliqzbot\/|MojeekBot\/|netEstate NE Crawler|SafeSearch microdata crawler|Gluten Free Crawler\/|Sonic|Sysomos|Trove|deadlinkchecker|Slack-ImgProxy|Embedly|RankActiveLinkBot|iskanie|SafeDNSBot|SkypeUriPreview|Veoozbot|Slackbot|redditbot|datagnionbot|Google-Adwords-Instant|adbeat_bot|WhatsApp|contxbot|pinterest.com.bot|electricmonk|GarlikCrawler|BingPreview\/|vebidoobot|FemtosearchBot|Yahoo Link Preview|MetaJobBot|DomainStatsBot|mindUpBot|Daum\/|Jugendschutzprogramm-Crawler|Xenu Link Sleuth|Pcore-HTTP|moatbot|KosmioBot|pingdom|AppInsights|PhantomJS|Gowikibot|PiplBot|Discordbot|TelegramBot|Jetslide|newsharecounts|James BOT|Bark[rR]owler|TinEye|SocialRankIOBot|trendictionbot|Ocarinabot|epicbot|Primalbot|DuckDuckGo-Favicons-Bot|GnowitNewsbot|Leikibot|LinkArchiver|YaK\/|PaperLiBot|Digg Deeper|dcrawl|Snacktory|AndersPinkBot|Fyrebot|EveryoneSocialBot|Mediatoolkitbot|Luminator-robots|ExtLinksBot|SurveyBot|NING\/|okhttp|Nuzzel|omgili|PocketParser|YisouSpider|um-LN|ToutiaoSpider|MuckRack|Jamie's Spider|AHC\/|NetcraftSurveyAgent|Laserlikebot|^Apache-HttpClient|AppEngine-Google|Jetty|Upflow|Thinklab|Traackr.com|Twurly|Mastodon|http_get|DnyzBot|botify|007ac9 Crawler|BehloolBot|BrandVerity|check_http|BDCbot|ZumBot|EZID|ICC-Crawler|ArchiveBot|^LCC |filterdb.iss.net\/crawler|BLP_bbot|BomboraBot|Buck\/|Companybook-Crawler|Genieo|magpie-crawler|MeltwaterNews|Moreover|newspaper\/|ScoutJet|(^| )sentry\/|StorygizeBot|UptimeRobot|OutclicksBot|seoscanners|Hatena|Google Web Preview|MauiBot|AlphaBot|SBL-BOT|IAS crawler|adscanner|Netvibes|acapbot|Baidu-YunGuanCe|bitlybot|blogmuraBot|Bot.AraTurka.com|bot-pge.chlooe.com|BoxcarBot|BTWebClient|ContextAd Bot|Digincore bot|Disqus|Feedly|Fetch\/|Fever|Flamingo_SearchEngine|FlipboardProxy|g2reader-bot|G2 Web Services|imrbot|K7MLWCBot|Kemvibot|Landau-Media-Spider|linkapediabot|vkShare|Siteimprove.com|BLEXBot\/|DareBoost|ZuperlistBot\/|Miniflux\/|Feedspot|Diffbot\/|SEOkicks|tracemyfile|Nimbostratus-Bot|zgrab|PR-CY.RU|AdsTxtCrawler|Datafeedwatch|Zabbix|TangibleeBot|google-xrawler|axios|Amazon CloudFront|Pulsepoint|CloudFlare-AlwaysOnline|Google-Structured-Data-Testing-Tool|WordupInfoSearch|WebDataStats|HttpUrlConnection|Seekport Crawler|ZoomBot|VelenPublicWebCrawler|MoodleBot|jpg-newsbot|outbrain|W3C_Validator|Validator\.nu|W3C-checklink|W3C-mobileOK|W3C_I18n-Checker|FeedValidator|W3C_CSS_Validator|W3C_Unicorn|Google-PhysicalWeb|Blackboard|ICBot\/|BazQux|Twingly|Rivva|Experibot|awesomecrawler|Dataprovider.com|GroupHigh\/|theoldreader.com|AnyEvent|Uptimebot\.org|Nmap Scripting Engine|2ip.ru|Clickagy|Caliperbot|MBCrawler|online-webceo-bot|B2B Bot|AddSearchBot|Google Favicon|HubSpot|Chrome-Lighthouse|HeadlessChrome|CheckMarkNetwork\/|www\.uptime\.com|Streamline3Bot\/|serpstatbot\/|MixnodeCache\/|^curl|SimpleScraper|RSSingBot|Jooblebot|fedoraplanet|Friendica|NextCloud|Tiny Tiny RSS|RegionStuttgartBot|Bytespider|Datanyze|Google-Site-Verification|TrendsmapResolver|tweetedtimes|NTENTbot|Gwene|SimplePie|SearchAtlas|Superfeedr|feedbot|UT-Dorkbot|Amazonbot|SerendeputyBot|Eyeotabot|officestorebot|Neticle Crawler|SurdotlyBot|LinkisBot|AwarioSmartBot|AwarioRssBot|RyteBot|FreeWebMonitoring SiteChecker|AspiegelBot|NAVER Blog Rssbot|zenback bot|SentiBot|Domains Project\/|Pandalytics|VKRobot|bidswitchbot|tigerbot|NIXStatsbot|Atom Feed Robot|Curebot|PagePeeker\/|Vigil\/|rssbot\/|startmebot\/|JobboerseBot|seewithkids|NINJA bot|Cutbot|BublupBot|BrandONbot|RidderBot|Taboolabot|Dubbotbot|FindITAnswersbot|infoobot|Refindbot|BlogTraffic\/\d\.\d+ Feed-Fetcher|SeobilityBot|Cincraw|Dragonbot|VoluumDSP-content-bot|FreshRSS|BitBot|^PHP-Curl-Class|Google-Certificates-Bridge|Viber)"

    var botRegex = new RegExp(botPattern, 'i')
    this.isBot = !!navigator?.userAgent && botRegex.test(navigator.userAgent)
    this.hasCheckedBot = true
    console.log(!!navigator?.userAgent, botRegex.test(navigator.userAgent))

    this.$cookies.config('60d')
    this.$store.dispatch('checkAndSetLoginStatus')
    this.$store.dispatch('fetchKeywordList')
    if (this.$cookies.get('theme') && this.$cookies.get('theme')==='dark') {
      this.setTheme('dark', true)
    }
    else {
      this.setTheme('light', true)
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
  span {
    margin-bottom: 1px;
  }
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
  font-size: 0.95rem;
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
      color: $themeBlueDTText;
      &:hover {
        color: $themeBlueDTText;
      }
    }
  }
  .footer {
    border-style: solid;
    border-width: 0;
    border-top-width: 4px;
    border-image: linear-gradient(to left, $themeGreen1, $themeGreen2) 1; 
    background: $themeDark4;
    p {
      color: white;
    }
    a {
      color: $themeBlueDTText;
    }
  }
}

.main {
  padding-bottom: $footerHeight + 1.5rem;
}

.consentButton {
  @media (max-width: 400px) {
    height: 4rem;
  }
}

.consentOverlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(8px);

  .consentContent {
    padding: 2rem;
    background-color: white;
    border-style: solid;
    border-width: 0;
    border-top-width: 10px;
    border-image: linear-gradient(to right, $themeGreen1, $themeGreen2) 1; 
  }

  p {
    font-size: 1.25rem;
    margin-top: 0.5rem;
  }

  @media screen and (max-width: 900px) {
    .consentContent {
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
