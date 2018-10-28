<template>
	<div style="width: 100%">
		<vue-headful :title="$route.params.artistName + ' - Artist - Yiffer.xyz'"/>
    <h1>{{$route.params.artistName}}</h1>
    <p v-if="!$store.state.username" style="margin-top: 8px;">
      <button class="text-button" v-on:click="showLoginModal" style="font-weight: 400; font-size: 16px; margin-bottom: 8px;">Log in</button>
      to vote
    </p>
    <back-to-index></back-to-index>
  
    <h2 style="margin-top: 16px;">Links</h2>
    <div class="artist-link-container">
      <div v-for="link in artistData.links" v-bind:key="link.linkUrl" class="artist-link">
        <img :src="`/icons/${link.linkType}.png`" style="height: 18px;"/>
        <a v-bind:href="link.linkUrl" target="_blank">{{prettifyUrl(link.linkUrl)}}</a>
      </div>
    </div>

    <h2 class="margin-top-16">Comics</h2>
		<div class="comic-card-container">
      <comic-card v-for="comic in this.artistData.comics" v-bind:key="comic.id" v-bind:clickableKeyword="false" v-bind:comic="comic" v-bind:detailLevel="'High detail'"></comic-card>
    </div>

		<login-modal v-if="$store.state.loginModalVisibility"></login-modal>
	</div>
</template>

<script>
import ComicCard from '@/components/ComicCard.vue'
import LoginModal from '@/components/LoginModal.vue'
import BackToIndex from '@/components/BackToIndex.vue'

export default {
	name: 'artist',
	components: { 'comic-card': ComicCard, 'login-modal': LoginModal, 'back-to-index': BackToIndex },
	data: function () {
		return {
      artistData: {},
      modalIsVisible: false,
		}
	},
	methods: {
    showLoginModal ( clickEvent ) {
      clickEvent.preventDefault()
			this.$store.commit('setLoginModalVisibility', true)
    },
    prettifyUrl ( linkUrl ) {
      if ( linkUrl.endsWith('/') ) { linkUrl = linkUrl.substring(0, linkUrl.length-1) }
      return linkUrl.replace('https://', '').replace('http://', '').replace('www.', '').replace('%20', ' ')
    }
  },
  created: function () {
    this.$store.commit('setLoginModalVisibility', false)
    this.artistData = mockGetArtist('$route.params.artistName')
    this.clickableKeyword = false
  }
}

function mockGetArtist (artistName) {
  return {
    links: [
      {
        "linkType": "e621",
        "linkUrl": "https://e621.net/post/index/1/Kabier%20order:score"
      },
      {
        "linkType": "furaffinity",
        "linkUrl": "https://www.furaffinity.net/user/Kabier"
      },
      {
        "linkType": "patreon",
        "linkUrl": "https://www.patreon.com/kabiercomics"
      },
      {
        "linkType": "twitter",
        "linkUrl": "https://twitter.com/kabier4"
      }
    ],
    comics: [
      {"tag": "Furry", "name": "Double Trouble", "keywords": ["double penetration", "demon", "diaper", "deer"], "cat": "MF", "lastUpdateNewPageCount": 0, "updated": "2018-06-30T22:14:50.000Z", "numberOfPages": 27, "userRating": 8.8452, "id": 773, "created": "2017-11-30T13:51:37.000Z", "finished": 0, "artist": "Kabier", "yourRating": 0},{"tag": "Pokemon", "name": "Baka!", "keywords": ["fluttershy", "alligator", "cub", "fizzle", "anal"], "cat": "FF", "lastUpdateNewPageCount": 3, "updated": "2018-04-12T05:46:35.000Z", "numberOfPages": 15, "userRating": 6.75, "id": 852, "created": "2018-04-12T05:46:35.000Z", "finished": 1, "artist": "Furball", "yourRating": 0}, {"tag": "MLP", "name": "Balloon Party", "keywords": ["equine", "blaziken", "asgore", "apple bloom", "fennec", "charmeleon", "christmas", "avian", "caught", "bukkake"], "cat": "FF", "lastUpdateNewPageCount": 4, "updated": "2018-06-14T18:28:43.000Z", "numberOfPages": 7, "userRating": 6.125, "id": 882, "created": "2018-06-14T18:28:43.000Z", "finished": 1, "artist": "Kevinsano", "yourRating": 0}, {"tag": "Furry", "name": "Barbed", "keywords": ["caught", "fennec", "fluttershy", "eevee", "buizel"], "cat": "MF", "lastUpdateNewPageCount": 2, "updated": "2017-12-15T14:55:05.000Z", "numberOfPages": 8, "userRating": 7.1, "id": 783, "created": "2017-12-15T14:55:05.000Z", "finished": 1, "artist": "Echoseed", "yourRating": 0}, {"tag": "Pokemon", "name": "Beach Dangers", "keywords": ["elf", "femdom", "fat", "fnaf", "big penis"], "cat": "MF", "lastUpdateNewPageCount": 0, "updated": "2017-06-30T00:00:00.000Z", "numberOfPages": 4, "userRating": 4.2, "id": 616, "created": "2017-07-01T00:00:00.000Z", "finished": 1, "artist": "Asbel_Lhant", "yourRating": 0}
    ]
  }
}
</script>

<style lang="scss">
$linkColor: #3984d4;

.artist-link-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.artist-link {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin-right: 5px;
  }
}

.comic-card-container {
	display: flex;
	flex-direction: row;
	width: 100%;
	flex-wrap: wrap;
	justify-content: center;
}

.dark {

}
</style>

