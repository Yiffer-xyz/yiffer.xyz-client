<template>
  <div style="width: 100%">
    <vue-headful title="Yiffer.xyz"/>
    <div class="upperBodyDiv">
      <!-- <h1 class="yifferTitle">Title</h1> -->
      <h1 class="yifferTitle">Yiffer.xyz</h1>
      <p style="font-size: 20px">A collection of high-quality comics</p>
      <!-- <p style="font-size: 20px">Subtitle subtitle</p> -->

      <p class="margin-top-10" v-if="!$store.getters.isAuthenticated">
        <button class="underline-link text-button link-color" @click.prevent="showLoginModal" style="margin: 0 3px 0 0; font-size: 16px;">
          <login-icon/> Log in
        </button> 
        or
        <button class="underline-link text-button link-color" @click.prevent="showSignupModal" style="margin: 0 3px; font-size: 16px;">
          <signup-icon/> Sign up
        </button> 
        to rate comics
      </p>
      <p v-else class="margin-top-10">Welcome, {{$store.getters.userData.username}}</p>

      <p v-if="blogLink" class="mt-10">
        Blog: 
        <router-link :to="{name: 'blogWithId', params: {id: blogLink.id}}"
                           class="underline-link">
          {{blogLink.title}}
        </router-link>
      </p>

      <div class="top-links">
        <router-link :to="{name: 'advertising'}" class="underline-link" style="width: 8rem; margin-right: 0.5rem">
          <ExclamationIcon title=""/> Your ad here?
        </router-link>

        <DropdownMenu v-model="showDropdown" 
                      v-if="$breakpoint.smAndDown"
                      :hover="true" 
                      :right="true" 
                      class="dropdownElement ml-4" 
                      style="width: 8rem;">
          <p dropdown-toggle class="link-color" style="font-weight: 400;">
            More <MenuDownIcon/>
          </p>

          <div slot="dropdown" class="linkDropdown simpleShadowNoHover">
            <router-link :to="{name: 'donate'}" class="underline-link">
              <donate-icon title=""/> Donate
            </router-link>

            <router-link :to="{name: 'suggestComic'}" class="underline-link">
              <plus-icon title=""/> Suggest comic
            </router-link>

            <router-link :to="{name: 'joinUs'}" class="underline-link">
              <ModIcon title=""/> Become a mod
            </router-link>
          </div>
        </DropdownMenu>

        <span v-else class="allTopLinksContainer">
          <router-link :to="{name: 'donate'}" class="underline-link">
            <donate-icon title=""/> Donate
          </router-link>

          <router-link :to="{name: 'suggestComic'}" class="underline-link">
            <plus-icon title=""/> Suggest comic
          </router-link>

          <router-link :to="{name: 'joinUs'}" class="underline-link">
            <ModIcon title=""/> Become a mod
          </router-link>
        </span>
      </div>

      <div class="buttons-container">
        <span class="upperBodyWidth buttons-container-inner">
          <div class="upper-body-horiz-row">
            <table class="horiz-row-inner" id="catTable">
              <tr>
                <td 
                  v-bind:class="{'button-selected': $store.getters.categoryFilter.indexOf('All') >= 0}"
                  @click="onCategoryFilterClick('All')">
                  All
                </td>      
                <td 
                  v-bind:class="{'button-selected': $store.getters.categoryFilter.indexOf('Furry') >= 0}"
                  @click="onCategoryFilterClick('Furry')">
                  Furry
                  <!-- Ting A -->
                </td>        
                <td 
                  v-bind:class="{'button-selected': $store.getters.categoryFilter.indexOf('MLP') >= 0}"
                  @click="onCategoryFilterClick('MLP')">
                  MLP
                  <!-- Ting b -->
                </td>     
                <td 
                  v-bind:class="{'button-selected': $store.getters.categoryFilter.indexOf('Pokemon') >= 0}"
                  @click="onCategoryFilterClick('Pokemon')">
                  <!-- Ting C -->
                  Pokemon
                </td>     
                <td 
                  v-bind:class="{'button-selected': $store.getters.categoryFilter.indexOf('Other') >= 0}"
                  @click="onCategoryFilterClick('Other')">
                  Other
                </td>     
              </tr>
            </table>
          </div>

          <div class="upper-body-horiz-row">
            <table class="horiz-row-inner">
              <tr>
                <td
                  :class="{'button-selected': $store.getters.tagFilter.indexOf('All') >= 0}"
                  @click="onTagFilterClick('All')">
                  All
                </td>
                <td
                  :class="{'button-selected': $store.getters.tagFilter.indexOf('M') >= 0}"
                  @click="onTagFilterClick('M')">
                  M
                </td>
                <td
                  :class="{'button-selected': $store.getters.tagFilter.indexOf('F') >= 0}"
                  @click="onTagFilterClick('F')">
                  F
                </td>
                <td style="padding-left: 4px; padding-right: 4px;"
                  :class="{'button-selected': $store.getters.tagFilter.indexOf('MF') >= 0}"
                  @click="onTagFilterClick('MF')">
                  MF
                </td>
                <td style="padding-left: 4px; padding-right: 4px;"
                  :class="{'button-selected': $store.getters.tagFilter.indexOf('MM') >= 0}"
                  @click="onTagFilterClick('MM')">
                  MM
                </td>
                <td
                  :class="{'button-selected': $store.getters.tagFilter.indexOf('FF') >= 0}"
                  @click="onTagFilterClick('FF')">
                  FF
                </td>
                <td style="padding-left: 4px; padding-right: 4px;"
                  :class="{'button-selected': $store.getters.tagFilter.indexOf('MF+') >= 0}"
                  @click="onTagFilterClick('MF+')">
                  MF+
                </td>
                <td
                  :class="{'button-selected': $store.getters.tagFilter.indexOf('I') >= 0}"
                  @click="onTagFilterClick('I')">
                  I
                </td>
              </tr>
            </table>
          </div>

          <div style="width: 100%; margin: 7px 0;">
            <div class="two-search-row">
              <div class="search-wrapper">
                <div class="one-searchbox-container" id="mainSearchBox">
                  <span class="input-icon-wrapper input-icon-wrapper-left"><search-icon title=""/></span>
                  <input v-model="searchFiltering222" type="text" placeholder="title or artist" class="upper-body-searchbox"/>
                  <span class="input-icon-wrapper input-icon-wrapper-right cursor-pointer"
                        v-show="searchFiltering222"
                        @click="clearSearchField()">
                    <cross-icon title="Clear"/>
                  </span>
                </div>
              </div>

              <div class="search-wrapper" id="searchWrapper">
                <span class="input-icon-wrapper input-icon-wrapper-left"><tags-icon title=""/></span>
                <input 
                  type="text"
                  name="someName" 
                  placeholder="tags"
                  id="keywordSearch"
                  autocomplete="off"
                  class="upper-body-searchbox"
                  v-model="keywordSearch"
                  @click="lastActionWasDeselectingKeyword = false"
                  @focus="setKeywordSearchFocused(true)"
                  @blur="setKeywordSearchFocused(false)"
                />
                <span class="input-icon-wrapper input-icon-wrapper-right cursor-pointer"
                      v-show="keywordSearch"
                      @click="clearKeywordSearchField()">
                  <cross-icon title="Clear"/>
                </span>
                <div id="keywordResults" v-if="keywordSearchFocused" style="max-height: 11rem;">
                  <div
                    v-for="keywordObject in keywordsMatchingSearch" 
                    :key="keywordObject.id"
                    @click="addSelectedKeyword(keywordObject)"
                    @mouseover="keywordResultHovered = keywordObject"
                    @mouseout="keywordResultHovered = undefined"
                    class="keyword-result">
                      {{keywordObject.name}} ({{keywordObject.count}})
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div id="selectedKeywords" v-if="$store.getters.selectedKeywords.length > 0" 
                 class="upper-body-horiz-row" style="margin-top: 0px; border: none;">
              <div 
                v-for="keywordObject in $store.getters.selectedKeywords" 
                :key="keywordObject.id"
                @click="removeSelectedKeyword(keywordObject)"
                class="selected-keyword">
                  {{keywordObject.name}}<cross-icon/>
              </div>
            </div>

          <div class="upper-body-horiz-row">
            <table class="horiz-row-inner" style="table-layout: auto;">
              <tr>
                <td
                  :class="{'button-selected': $store.getters.sorting === 'updated'}"
                  @click="onSortingButtonClick('updated')">
                  Recently updated
                </td>
                <td
                  :class="{'button-selected': $store.getters.sorting === 'userRating'}"
                  @click="onSortingButtonClick('userRating')">
                  User rating
                </td>
                <td
                  :class="{'button-selected': $store.getters.sorting === 'yourRating'}"
                  @click="onSortingButtonClick('yourRating')">
                  Your rating
                </td>
              </tr>
            </table>
          </div>
          

          <div class="upper-body-horiz-row" style="display: flex; justify-content: space-evenly; width: fit-content; margin-left: auto; margin-right: auto; border: none;">
            <!-- MOBILE VIEW: LIST OR CARD -->
            <table class="horiz-row-inner horiz-row-inner-border" style="width: auto; margin-right: 30px;" v-if="$breakpoint.xsOnly">
              <tr>
                <td
                  @click="setViewMode('list')"
                  :class="{'button-selected': $store.getters.viewMode === 'list'}"
                >
                  List
                </td>
                <td
                  @click="setViewMode('card')"
                  :class="{'button-selected': $store.getters.viewMode === 'card'}"
                >
                  Cards
                </td>
              </tr>
            </table>
            
            <!-- BIG VIEW: DETAIL LEVEL -->
            <table class="horiz-row-inner horiz-row-inner-border" style="width: auto;">
              <tr>
                <td
                  @click="setDetailLevel('low')"
                  :class="{'button-selected': $store.getters.detailLevel === 'low'}"
                >
                  Simple
                </td>
                <td
                  @click="setDetailLevel('high')"
                  :class="{'button-selected': $store.getters.detailLevel === 'high'}"
                >
                  Detailed
                </td>
              </tr>
            </table>
          </div>

          <!-- <div v-if="false" -->
          <div v-if="hasFetchedComics"
               style="display: flex; flex-direction: row; align-items: center;"
               class="upper-body-horiz-row"
               id="upperPaginationButtons">
            <div @click="paginate('down')" class="pagination-button"><left-arrow/></div>
            <div v-for="(pageNo, index) in paginationButtons"
                :key="index"
                :class="{'button-selected': $store.getters.pageNumber===pageNo, 'dot-dot-dot-button': pageNo==='...'}"
                class="pagination-button"
                @click="paginate(pageNo)">
              {{pageNo}}
            </div>
            <div @click="paginate('up')" class="pagination-button"><right-arrow/></div>
          </div>
          <div v-else-if="!isErrorLoadingComics" class="upper-body-horiz-row" style="margin-top: -3px;">
            <SkeletonTheme color="#a6a6a6" highlight="#ddd">
              <Skeleton height="35px" width="100%"/>
            </SkeletonTheme>
          </div>
        </span>
      </div>
    </div>

    <p v-if="isErrorLoadingComics" class="comicListMessage">There was an error fetching comics.</p>

    <SkeletonTheme v-else-if="isLoadingComics" :color="isDarkTheme ? '#262d30' : '#eeeeee'" :highlight="isDarkTheme ? '#525456' : '#f5f5f5'" class="comic-card-container">
      <div :class="['comicCardSkeleton', $store.getters.isAuthenticated ? 'loggedInSkeleton' : '']" v-for="i in 80" :key="i">
        <Skeleton width="100%" height="100%"/>
      </div>
    </SkeletonTheme>

    <div class="comic-card-small-container" v-else-if="$breakpoint.xsOnly && $store.getters.viewMode=='list'">
      <comic-card-small v-for="comic in comicList"
                        :key="comic.id"
                        :comic="comic"/>
    </div>

    <div v-else-if="comicList.length > 0" class="comic-card-container" id="comicCardContainerList">
      <comic-card v-for="comic in comicList"
                  :key="comic.id"
                  :comic="comic">
      </comic-card>
    </div>

    <p v-else class="comicListMessage">There are no comics matching your query.</p>

    <button v-if="hasFetchedComics && !isErrorLoadingComics && comicList.length > 0"
            class="y-button y-button-neutral margin-top-16"
            @click="scrollToTop()">
      <up-arrow/> to top
    </button>

    <div v-if="hasFetchedComics && !isErrorLoadingComics && comicList.length > 0"
         style="display: flex; flex-direction: row; align-items: center; margin: 1rem auto;"
         class="upperBodyWidth upper-body-horiz-row">
      <div @click="paginate('down', shouldScrollToTopOfList=true)" class="pagination-button"><left-arrow/></div>
      <div v-for="(pageNo, index) in paginationButtons"
          :key="index"
          :class="{'button-selected': $store.getters.pageNumber===pageNo, 'dot-dot-dot-button': pageNo==='...'}"
          class="pagination-button"
          @click="paginate(pageNo, shouldScrollToTopOfList=true)">
        {{pageNo}}
      </div>
      <div @click="paginate('up', shouldScrollToTopOfList=true)" class="pagination-button"><right-arrow/></div>
    </div>

    <expanded-comic-card v-show="$store.getters.isComicCardExpanded"/>
  </div>
</template>

<script>
import ComicCard from '@/components/ComicCard.vue'
import ComicCardSmall from '@/components/ComicCardSmall.vue'
import ExpandedComicCard from '@/components/ExpandedComicCard.vue'
import config from '@/config.json'
import SearchIcon from 'vue-material-design-icons/Magnify.vue'
import TagsIcon from 'vue-material-design-icons/TagMultiple.vue'
import DonateIcon from 'vue-material-design-icons/CurrencyUsd.vue'
import CrossIcon from 'vue-material-design-icons/Close.vue'
import PlusIcon from 'vue-material-design-icons/Plus.vue'
import LeftArrow from 'vue-material-design-icons/ArrowLeft.vue'
import UpArrow from 'vue-material-design-icons/ArrowUp.vue'
import RightArrow from 'vue-material-design-icons/ArrowRight.vue'
import LoginIcon from 'vue-material-design-icons/Login.vue'
import SignupIcon from 'vue-material-design-icons/AccountPlusOutline.vue'
import ExclamationIcon from 'vue-material-design-icons/Bullhorn.vue'
import MenuDownIcon from 'vue-material-design-icons/MenuDown.vue'
import ModIcon from 'vue-material-design-icons/AccountStar.vue'

import DropdownMenu from '@innologica/vue-dropdown-menu'

import keywordApi from '../api/keywordApi'
import miscApi from '../api/miscApi'
import blogApi from '../api/blogApi'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { doFetch } from '../utils/statefulFetch'
import comicApi from '../api/comicApi'
import { Skeleton, SkeletonTheme } from 'vue-loading-skeleton'

export default {
  name: 'comic-list',

  components: {
    'comic-card': ComicCard,
    'comic-card-small': ComicCardSmall,
    'expanded-comic-card': ExpandedComicCard,
    'search-icon': SearchIcon,
    'tags-icon': TagsIcon,
    'donate-icon': DonateIcon,
    'plus-icon': PlusIcon,
    'cross-icon': CrossIcon,
    'left-arrow': LeftArrow,
    'up-arrow': UpArrow,
    'right-arrow': RightArrow,
    'login-icon': LoginIcon,
    'signup-icon': SignupIcon,
    ExclamationIcon,
    DropdownMenu,
    MenuDownIcon,
    ModIcon,
    Skeleton, SkeletonTheme,
  },

  data: function () {
    // Initially attempted to not use references like this (and instead only use
    // vuex state), but it seems vuex isn't quite ready for this yet.
    return {
      config: config,
      displayedComics: this.$store.getters.displayedComics,
      keywordSearch: '',
      keywordSearchFocused: false,
      keywordResultHovered: undefined,
      lastActionWasDeselectingKeyword: false, // needed because @click of keywordResult fires too often
      smallPagination: undefined,
      searchFiltering222: this.$store.getters.searchFiltering || '',
      suppressQueryUpdates: false,
      avoidLog: true,
      blogLink: undefined,
      showDropdown: false,
      searchFilteringHook: null,
    }
  },

  computed: {
    ...mapGetters([
      'isDarkTheme',
      'paginatedComics',
      'paidImages',
      'comicList',
      'searchFiltering',
      'pageNumber',
      'tagFilter',
      'categoryFilter',
      'sorting',
      'selectedKeywords',
      'hasFetchedComicListOnce',
      'orderedKeywordList',
    ]),

    isLoadingComics () {
      return !this.paidImages.failed && !this.paginatedComics.failed && 
        (this.paidImages.fetching || !this.paidImages.fetched
        || this.paginatedComics.fetching || !this.paginatedComics.fetched)
    },

    isErrorLoadingComics () {
      return this.paginatedComics.failed || this.paidImages.failed
    },

    hasFetchedComics () {
      return this.paginatedComics.fetched && this.paidImages.fetched
    },

    keywordsMatchingSearch () {
      return this.orderedKeywordList.filter(keyword => keyword.name.startsWith(this.keywordSearch))
    },

    paginationButtons () {
      if (!this.paginatedComics.fetched || this.paginatedComics.failed) { return [] }

      let currentPage = this.paginatedComics.payload.page
      let pages = this.paginatedComics.payload.numberOfPages

      let buttonList = []
      if (pages <= 9) {
        for (var i = 1; i < pages+1; i++) { buttonList.push(i) }
        return buttonList
      }
      if (currentPage <= 5) {
        return [1, 2, 3, 4, 5, 6, 7, '...', pages]
      }
      if (currentPage >= pages-4) {
        return [1, '...', pages-6, pages-5, pages-4, pages-3, pages-2, pages-1, pages]
      }
      else {
        return [1, '...', currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2, '...', pages]
      }
    }
  },

  methods: {
    ...mapMutations([
      'setPageNumber',
    ]),
    ...mapActions([
      'loadActiveAds',
      'addCategoryFilter',
      'addTagFilter',
      'setSorting',
      'setSearchFiltering',
    ]),
    
    fetchComics () {
      let searchParams = {
        search: this.searchFiltering || null,
        order: this.sorting,
        page: this.pageNumber,
      }
      if (!this.tagFilter.includes('All')) {
        searchParams.tags = this.tagFilter
      }
      if (!this.categoryFilter.includes('All')) {
        searchParams.categories = this.categoryFilter
      }
      if (this.selectedKeywords.length > 0) {
        searchParams.keywordIds = this.selectedKeywords.map(kw => kw.id)
      }
      this.$store.dispatch('fetchComics', searchParams)
    },

    onCategoryFilterClick (filter) {
      this.addCategoryFilter(filter)
      this.setRouterQuery()
      this.fetchComics()
      miscApi.logEvent('categoryfilter', filter)
    },

    onTagFilterClick (filter) {
      this.addTagFilter(filter)
      this.setRouterQuery()
      this.fetchComics()
      miscApi.logEvent('tagfilter', filter)
    },

    onSortingButtonClick ( sortButtonName ) {
      this.setSorting(sortButtonName)
      this.setRouterQuery()
      this.fetchComics()
      miscApi.logEvent('sort', sortButtonName)
    },

    paginate ( pageNumber, shouldScrollToTopOfList=false ) {
      if ( pageNumber === '...' ) { return }
      if (pageNumber === 'down') {
        if (this.pageNumber > 1) {
          this.setPageNumber(this.pageNumber-1)
        } 
      }
      else if (pageNumber === 'up') {
        if (this.pageNumber * config.comicsPerPage < this.$store.getters.filteredComics.length) {
          this.setPageNumber(this.pageNumber+1)
        }
      }
      else if ( typeof(pageNumber) !== 'number') {
        pageNumber = 1
      }
      else {
        this.setPageNumber(pageNumber)
      }

      this.setRouterQuery()
  
      if (shouldScrollToTopOfList) {
        let upperPaginationButtons = document.getElementById('upperPaginationButtons')
        upperPaginationButtons.scrollIntoView()
      }

      this.fetchComics()
    },

    addSelectedKeyword ( keyword ) {
      if (!this.lastActionWasDeselectingKeyword) {
        this.lastActionWasDeselectingKeyword = true
        this.$store.dispatch('addSelectedKeyword', keyword)
        this.keywordSearchFocused = undefined
        this.keywordSearch = ''
      }
      keywordApi.logKeywordSearch(keyword.id, false)
      this.setRouterQuery()
      this.fetchComics()
    },

    removeSelectedKeyword ( keyword ) {
      this.$store.dispatch('removeSelectedKeyword', keyword)
      this.setRouterQuery()
      this.fetchComics()
    },

    filterComicByTag ( comicObject ) {
      return this.$store.getters.categoryFilter.indexOf('All') === 0 || this.$store.getters.categoryFilter.indexOf(comicObject.tag) >= 0
    },

    filterComicByCategory ( comicObject ) {
      return this.$store.getters.tagFilter.indexOf('All') === 0 || this.$store.getters.tagFilter.indexOf(comicObject.cat) >= 0
    },

    filterComicByNameOrArtist ( comicObject ) {
      return comicObject.name.toLowerCase().indexOf( this.$store.getters.searchFiltering.toLowerCase() ) >= 0 
        || comicObject.artist.toLowerCase().indexOf( this.$store.getters.searchFiltering.toLowerCase() ) >= 0
    },

    filterComicByKeywords ( comicObject ) {
      if ( this.selectedKeywords.length === 0 ) { return true }
      for (var keyword of this.selectedKeywords) {
        if (comicObject.keywords.indexOf(keyword.name) === -1) { return false }
      }
      return true
    },

    setRouterQuery () {
      if (this.suppressQueryUpdates) { return }

      let queryObj = {}
      if (!this.$store.getters.categoryFilter.includes('All')) {
        queryObj.category = this.$store.getters.categoryFilter
      }
      if (!this.$store.getters.tagFilter.includes('All')) {
        queryObj.classification = this.$store.getters.tagFilter
      }
      if (this.$store.getters.sorting !== 'updated') {
        queryObj.orderBy = this.$store.getters.sorting
      }
      if (this.$store.getters.searchFiltering) {
        queryObj.search = this.$store.getters.searchFiltering
      }
      if (this.selectedKeywords.length > 0) { 
        queryObj.tags = this.selectedKeywords.map(kw => kw.name)
      }

      this.$router.push({path: '/', query: queryObj})
    },

    setFiltersFromRouterQuery () {
      this.suppressQueryUpdates = true
      
      if (!this.$route || !this.$route.query) { return }
      if (this.$route.query.category) {
        this.$store.commit('setCategoryFilter', this.listify(this.$route.query.category))
      }
      if (this.$route.query.classification) {
        this.$store.commit('setTagFilter', this.listify(this.$route.query.classification))
      }
      if (this.$route.query.orderBy) {
        this.setSorting(this.$route.query.orderBy)
      }
      if (this.$route.query.search) {
        this.setSearchFiltering(this.$route.query.search)
        this.searchFiltering222 = this.$route.query.search
      }
      if (this.$route.query.tags) {
        if (this.orderedKeywordList 
            && this.orderedKeywordList.length > 0) {
          this.setKeywordsFromQuery()
        }
        else {
          this.$store.watch(this.$store.getters.orderedKeywordListF, () => {
            this.setKeywordsFromQuery()
          })
        }
      }
      else {
        this.suppressQueryUpdates = false
      }
    },

    setKeywordsFromQuery () {
      let selectedKeywords = []
      for (let keywordName of this.listify(this.$route.query.tags)) {
        let keyword = this.orderedKeywordList.find(kw => kw.name === keywordName)
        if (keyword) {
          selectedKeywords.push(keyword)
        }
      }
      
      this.suppressQueryUpdates = false
      this.$store.commit('setSelectedKeywords', selectedKeywords)
    },

    showLoginModal () {
      this.$store.commit('setLoginModalVisibility', true)
    },

    showSignupModal () {
      this.$store.commit('setLoginModalContext', 'register')
      this.$store.commit('setLoginModalVisibility', true)
    },

    setKeywordSearchFocused ( isFocused ) {
      // Needed because if there is no search term, then technically the results div is 
      // hidden (by the onblur event invoking this method) before the onclick fires,
      // so there is nothing to be "onclicked".
      // In other words, the first if happens whenever the user clicks a keyword.
      if (this.keywordResultHovered) {
        this.addSelectedKeyword(this.keywordResultHovered)
        this.keywordResultHovered = null
      } 
      this.keywordSearchFocused = isFocused || this.keywordSearch != ''
    },

    setDetailLevel (detailLevel) {
      this.$store.commit('setDetailLevel', detailLevel)
      this.$cookies.set('detail', detailLevel)
      if (!this.avoidLog) { miscApi.logEvent('detail', detailLevel) }
    },

    setViewMode (viewMode) {
      this.$store.commit('setViewMode', viewMode)
      this.$cookies.set('viewmode', viewMode)
      if (!this.avoidLog) { miscApi.logEvent('viewmode', viewMode) }
    },

    clearSearchField () {
      this.searchFiltering222 = ''
      this.setRouterQuery()
    },

    clearKeywordSearchField () {
      this.keywordSearch = ''
      this.setKeywordSearchFocused(false)
    },

    async getDisplayedBlog () {
      let blog = await blogApi.getDisplayedBlog()
      if (blog && blog.shouldDisplay) {
        this.blogLink = blog
      }
    },

    handleResize () {
      this.smallPagination = document.body.clientWidth < 1200
    },

    listify ( input ) {
      if (typeof(input) === 'string') { return [input] }
      else { return input }
    },

    scrollToTop () {
      window.scrollTo(0, 0)
    },
  },

  watch: {
    searchFiltering222: function () {
      if (!this.hasFetchedComicListOnce) {
        return
      }
      if (this.searchFilteringHook) {
        clearTimeout(this.searchFilteringHook)
      }
      if (this.searchFiltering222 === '') {
        this.setSearchFiltering('')
        this.setRouterQuery()
        this.fetchComics()
      }
      else {
        this.searchFilteringHook = setTimeout(() => {
          this.setSearchFiltering(this.searchFiltering222)
          this.setRouterQuery()
          this.fetchComics()
        }, 1000)
      }
    },
  },

  async mounted () {
    if (this.$cookies.get('detail')) { this.setDetailLevel(this.$cookies.get('detail')) }
    if (this.$cookies.get('viewMode')) { this.setviewMode(this.$cookies.get('viewMode')) }
    if (this.$route.query && Object.keys(this.$route.query).length !== 0) {
      this.setFiltersFromRouterQuery()
    }
    else {
      this.setRouterQuery()
    }
    this.$store.commit('setLoginModalVisibility', false)
    this.$store.watch(this.$store.getters.getFilteredComics, this.paginate)
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    miscApi.logRoute('index')
    this.avoidLog = false
    this.getDisplayedBlog()

    if (!this.paginatedComics.fetching && !this.paginatedComics.fetched) {
      this.fetchComics()
    }
    if (!this.paidImages.fetching && !this.paidImages.fetched) {
      this.loadActiveAds()
    }
  },
}
</script>


<style lang="scss">
.top-links {
  display: flex;
  flex-direction: row;
  width: fit-content;
  margin: 10px auto 0 auto;
  @media (max-width: 900px) {
    margin-top: 8px;
  }
}

#upperBodyDiv {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: $themeGray0;
  color: white;
  h1 {
    color: #333; //todo
    font-family: 'Shrikhand', cursive;
  }
  h2 {
    margin: 45px 0px;
  }
  .text-button {
    color: $theme4;
    text-decoration: underline;
    font-size: 16px;
  }
}

#keywordResults {
  position: absolute;
  min-width: 100%;
  overflow: auto;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 4px 13px 0px rgba(0,0,0,0.2);
}

.keyword-result {
  width: 100%;
  text-align: center;
  color: #444 !important;
  font-size: 12px;
  padding: 3px 0px;
  font-weight: 300;
  &:hover {
    background-color: $themeGray1;
    color: $theme4 !important;
    cursor: pointer;
  }
}

#keywordSearch {
  min-width: 100%;
  box-sizing: border-box;
}

#selectedKeywords {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-bottom: 7px;
}
  
.selected-keyword {
  border: 0.5px solid #666;
  font-size: 12px;
  padding: 1px 4px 1.5px 6px;
  border-radius: 15px;
  font-weight: 300;
  margin: 0px 2px;
  &:hover {
    cursor: pointer;
    text-decoration: line-through;
    color: $themeRed2;
    border-color: $themeRed2;
  }
  span {
    svg {
      bottom: -0.22em !important;
      margin-right: -1px;
    }
  }
}

.pagination-button {
  padding: 5px;
  flex: 1;
  &:not(:first-child) {
    border-left: none;
  }
}

.buttons-container {
  box-shadow: 0px 0px 16px 0px $themeGray3;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  margin-top: 20px;
  background: $themeGray1;
  padding: 24px 0;
  border-top: 1px solid $themeGray3;
  border-bottom: 1px solid $themeGray3;
  >div, >table {
    margin: 7px 0px;
  }
  @media (max-width: 900px) {
    padding: 4px 0;
    >div, >table {
      margin: 5px 0px;
    }
  }
}

.upper-body-horiz-row {
  width: 100%;
  margin: 0.5rem 0;

  @media (max-width: 900px) {
    margin: 0.75rem 0;
  }
}

.pagination-button, .horiz-row-inner td {
  background: $themeGray5;
  color: white;
  padding: 8px 10px;
  font-weight: 400;

  font-size: 14px;

  &:hover {
    cursor: pointer;
    background: $themeGray3;
  }

  @media (max-width: 900px) {
    padding: 0.5rem 0.5rem;
  }
}

#catTable td {
  @media (max-width: 900px) {
    padding: 0.5rem 1px;
  }
}

.horiz-row-inner {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-radius: 20px;
  td {
    text-align: center;
    font-weight: 400;
  }
}

.button-selected {
  background: $theme5 !important;
  font-weight: 400;
}

.one-searchbox-container {
  position: relative;
}

.upper-body-searchbox {
  box-sizing: border-box;
  padding: 7px;
  text-align: center;
  border: 0.5px solid $themeGray5;
  background: #f0f0f0;
  outline: none;
  color: #333;
  width: 100%;
  @media (max-width: 900px) {
    padding: 5px;
  }
}

.input-icon-wrapper {
  color: $themeDark1;
  position: absolute;
  display: block;
  top: 6px;
  @media (max-width: 900px) {
    top: 4px;
  }
}

.input-icon-wrapper-right {
  right: 9px;
  @media (max-width: 900px) {
    right: 6px;
  }
  &:hover {
    color: $themeRed;
  }
}

.input-icon-wrapper-left {
  left: 9px;
  @media (max-width: 900px) {
    left: 6px;
  }
}

.search-wrapper {
  width: 47%;
  position: relative;
  @media (max-width: 900px) {
    width: 49%;
  }
}

.two-search-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media (max-width: 900px) {
    justify-content: space-evenly;
  }
}

::placeholder {
  color: $themeGray5;
  font-size: 12px;
}

.comic-card-container {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 900px) {
    margin-top: 12px;
  }
}

.comic-card-small-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 6px;
}

.dark {
  .buttons-container {
    background-color: rgba(255, 255, 255, 0.04);
    box-shadow: 0px 0px 16px 0px rgba(255, 255, 255, 0.04);
    border-top: 1px solid $themeDark2;
    border-bottom: 1px solid $themeDark2;
  }
  .button-selected {
    background: $theme4p5 !important;
    color: white;
  }
  #upperBodyDiv {
    background: linear-gradient(to top right, $themeBlue1, #0D1C23, $theme0);
    h1 {
      color: white;
    }
  }
  .upper-body-horiz-row {
    border: 1px solid $themeDark2;
  }
  .horiz-row-inner-border {
    border: 1px solid $themeDark2;
  }
  .horiz-row-inner td, .pagination-button {
    background: rgba(0, 0, 0, 0.3);
    &:hover {
      cursor: pointer;
      background: rgba(255, 255, 255, 0.1);
    }
  }
  .one-searchbox-container input, #keywordSearch {
    border-color: $themeDark2;
    background: rgba(0, 0, 0, 0.1);

  }
  .keyword, .selected-keyword {
    border-color: #555;
    color: white;
    &:hover {
      color: $themeRed2;
    }
  }
  .keyword-result {
    color: #eee !important;
    background: rgba(9, 15, 20, 0.96);
    &:hover {
      background: $themeBlue1;
      color: $themeBlue;
    }
  }
}
  
.upperBodyWidth {
  width: 50%;
  @media (max-width: 900px) {
    width: 100%;
  }
}

.dot-dot-dot-button {
  &:hover {
    cursor: default;
  }
}

.dropdownElement {
  &:hover {
    cursor: pointer;
  }
}
.linkDropdown {
  display: flex;
  flex-direction: column;
  &>* {
    width: fit-content;
    text-align: left;
  }
  padding: 0.5rem 1rem;
  a {
    margin: 0.5rem 0;
  }
  position: absolute;
  z-index: 4;
  background-color: white;
}
.allTopLinksContainer {
  &>* {
    margin: 0 0.5rem;
  }
}
.comicCardSkeleton {
  margin: 10px;
  width: 200px;
  height: 391.5px;
  @media screen and (max-width: 900px) {
    margin: 6px;
    width: 100px;
    height: 296px;
  }
}
.loggedInSkeleton {
  height: 427px;
  @media screen and (max-width: 900px) {
    height: 326px;
  }
}
.comicListMessage {
  padding: 3rem 1rem;
  font-size: 1.2rem !important;
}
.dark {
  .linkDropdown {
    background-color: $themeDark4;
    border: 1px solid #444;
  }
}
</style>