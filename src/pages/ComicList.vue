<template>
  <div style="width: 100%">
    <div class="upperBodyDiv">
      <span :class="{'coloredYifferTitle': isDarkTheme, 'yifferTitle': !isDarkTheme}" >
        Yiffer.xyz
      </span>

      <div class="subtitleContainer" style="display: flex; flex-direction: column;">
        <p v-if="$breakpoint.smAndUp || $breakpoint.xl">
          The internet's best collection of quality furry comics,
        </p>
        <p v-if="$breakpoint.smAndUp || $breakpoint.xl">
          easily readable and free!
        </p>
      </div>

      <p v-if="blogLink" class="mt-16">
        Blog: 
        <router-link :to="{name: 'blogWithId', params: {id: blogLink.id}}"
                           class="underline-link">
          {{blogLink.title}}
        </router-link>
      </p>

      <div class="top-links">
        <a href="https://pi.yiffer.xyz" v-if="$breakpoint.smAndDown" class="underline-link mr-12" id="link1" style="width: 9rem;">
          <ExclamationIcon title=""/> Your ad here?
        </a>

        <DropdownMenu v-model="showDropdown" 
                      v-if="$breakpoint.smAndDown"
                      :hover="true" 
                      :right="true" 
                      class="dropdownElement ml-4" 
                      style="width: 8rem;">
          <p dropdown-toggle class="link-color" style="font-weight: 600;">
            More <MenuDownIcon/>
          </p>

          <div slot="dropdown" class="linkDropdown simpleShadowNoHover">
            <router-link :to="{name: 'suggestComic'}" class="underline-link">
              <plus-icon title=""/> Suggest comic
            </router-link>

            <router-link :to="{name: 'feedback'}" class="underline-link">
              <FeedbackIcon title=""/> Feedback
            </router-link>

            <router-link :to="{name: 'joinUs'}" class="underline-link">
              <ModIcon title=""/> Become a mod
            </router-link>
          </div>
        </DropdownMenu>

        <span v-else class="allTopLinksContainer">
          <a href="https://pi.yiffer.xyz" class="underline-link" id="link1" style="width: 9rem;">
            <ExclamationIcon title=""/> Your ad here?
          </a>

          <router-link :to="{name: 'suggestComic'}" class="underline-link" id="link2">
            <plus-icon title=""/> Suggest comic
          </router-link>

          <router-link :to="{name: 'feedback'}" class="underline-link" id="link3">
            <FeedbackIcon title=""/> Feedback
          </router-link>

          <router-link :to="{name: 'joinUs'}" class="underline-link" id="link4">
            <ModIcon title=""/> Become a mod
          </router-link>
        </span>
      </div>
    </div>

    <SearchFiltering @categoryFilter="onCategoryFilterClick"
                     @tagFilter="onTagFilterClick"
                     @setSort="onSortingButtonClick"
                     @searchChanged="onSearchChanged"
                     @addKeyword="addSelectedKeyword"
                     @removeKeyword="removeSelectedKeyword"
                     @setDetailLevel="setDetailLevel"
                     @toggleShowSearchFiltering="toggleShowSearchFiltering"
                     @resetAllFilters="resetAllFilters"
                     :isSearchFilteringActive="isSearchFilteringActive"/>

    <Pagination v-if="!isErrorLoadingComics && (!hasFetchedComics || comicList.length > 0)"
                :isLoading="!hasFetchedComics"
                :shouldHide="isErrorLoadingComics"
                :showWhileLoading="showPaginationWhileLoading"
                :onPaginate="paginate"/>

    <p v-if="isErrorLoadingComics" class="comicListMessage">
      There was an error fetching comics.
    </p>

    <SkeletonTheme v-if="isLoadingComics"
                   :color="isDarkTheme ? '#383f45' : 'rgba(238,238,238,0.75)'"
                   :highlight="isDarkTheme ? '#5f6163' : '#fbfbfb'"
                   class="comic-card-container">
      <div :class="['comicCardSkeleton', isAuthenticated ? 'loggedInSkeleton' : '']" v-for="i in 80" :key="i">
        <Skeleton width="100%" height="100%"/>
      </div>
    </SkeletonTheme>


    <div v-else-if="comicList.length > 0"
         class="comic-card-container"
         id="comicCardContainerList">
      <comic-card v-for="(comic, index) in comicList"
                  :key="index"
                  :comic="comic"
                  @image-load="onImageLoad">
      </comic-card>
    </div>

    <p v-else-if="!isErrorLoadingComics" class="comicListMessage">
      There are no comics matching your search.
    </p>

    <button v-if="hasFetchedComics && !isErrorLoadingComics && comicList.length > 0"
            class="y-button"
            style="margin: 1rem auto;"
            @click="scrollToTop()">
      <up-arrow/> to top
    </button>


    <Pagination v-if="hasFetchedComics && !isErrorLoadingComics && comicList.length > 0"
                :isLoading="!hasFetchedComics"
                :shouldHide="isErrorLoadingComics"
                :showWhileLoading="showPaginationWhileLoading"
                :onPaginate="paginate"
                scrollToTop/>

    <expanded-comic-card v-show="$store.getters.isComicCardExpanded"/>
  </div>
</template>

<script>
import ComicCard from '@/components/ComicCard.vue'
import ExpandedComicCard from '@/components/ExpandedComicCard.vue'
import config from '@/config.json'
import PlusIcon from 'vue-material-design-icons/Plus.vue'
import UpArrow from 'vue-material-design-icons/ArrowUp.vue'
import ExclamationIcon from 'vue-material-design-icons/Bullhorn.vue'
import MenuDownIcon from 'vue-material-design-icons/MenuDown.vue'
import FeedbackIcon from 'vue-material-design-icons/CommentText.vue'

import SearchFiltering from './comic-list/SearchFiltering.vue'
import Pagination from './comic-list/Pagination.vue'

import ModIcon from 'vue-material-design-icons/AccountStar.vue'

import DropdownMenu from '@innologica/vue-dropdown-menu'

import keywordApi from '../api/keywordApi'
import miscApi from '../api/miscApi'
import blogApi from '../api/blogApi'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Skeleton, SkeletonTheme } from 'vue-loading-skeleton'

import Vue from 'vue'

export default {
  name: 'comic-list',

  components: {
    'comic-card': ComicCard,
    'expanded-comic-card': ExpandedComicCard,
    'plus-icon': PlusIcon,
    'up-arrow': UpArrow,
    ExclamationIcon,
    DropdownMenu,
    MenuDownIcon,
    ModIcon,
    FeedbackIcon,
    Skeleton, SkeletonTheme,
    SearchFiltering,
    Pagination,
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
      smallPagination: undefined,
      searchFiltering222: this.$store.getters.searchFiltering || '',
      suppressQueryUpdates: false,
      avoidLog: true,
      blogLink: undefined,
      showDropdown: false,
      searchFilteringHook: null,
      showPaginationWhileLoading: false,
      lastClosedTime: new Date(),
      loadedImageCounter: 0,
      lastClosedSearchFilteringTime: new Date(),
      deferFetchingComics: false,
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
      'isFilterSectionExpanded',
      'wasKwSelectedFromList',
      'allKeywords',
      'isAuthenticated',
      'detailLevel',
    ]),

    availableSortOptions () {
      if (this.isAuthenticated) {
        return [
          {id: 'updated', text: 'Recently updated'},
          {id: 'userRating', text: 'User rating'},
          {id: 'yourRating', text: 'Your rating'},
        ]
      }
      return [
        {id: 'updated', text: 'Recently updated'},
        {id: 'userRating', text: 'User rating'},
      ]
    },

    isLoadingComics () {
      return !this.paidImages.failed && !this.paginatedComics.failed && 
        (this.paidImages.fetching || !this.paidImages.fetched
        || this.paginatedComics.fetching || !this.paginatedComics.fetched)
    },

    isSearchFilteringActive () {
      if (!this.categoryFilter.includes('All')) { return true }
      if (!this.tagFilter.includes('All')) { return true }
      if (this.searchFiltering) { return true }
      if (this.sorting !== 'updated') { return true }
      if (this.selectedKeywords.length > 0) { return true }
      return false;
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
  },

  watch: {
    selectedKeywords: function (newKws, oldKws) {
      let wasKwRemoved = newKws.length < oldKws.length
      this.onKeywordsChange(wasKwRemoved)
    },

    searchFiltering222: function () {
      this.showPaginationWhileLoading = false

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
    if (this.$route.query && Object.keys(this.$route.query).length !== 0) {
      this.setFiltersFromRouterQuery()
    }
    else {
      this.setRouterQuery()
    }
    this.$store.commit('setLoginModalVisibility', false)
    this.$store.watch(this.$store.getters.getFilteredComics, this.paginate)
    this.$store.watch(this.$store.getters.getSelectedKeywords, this.onKeywordsChange)
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
    window.prerenderReady = false
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
      if (this.deferFetchingComics) { return }

      let searchParams = {
        search: this.searchFiltering222 || null,
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
      searchParams.shouldGetKeywords = this.detailLevel === 'high'

      this.$store.dispatch('fetchComics', searchParams)
    },

    onCategoryFilterClick (filter) {
      this.showPaginationWhileLoading = false
      this.addCategoryFilter(filter)
      this.setRouterQuery()
      this.fetchComics()
      miscApi.logEvent('categoryfilter', filter)
    },

    onTagFilterClick (filter) {
      this.showPaginationWhileLoading = false
      this.addTagFilter(filter)
      this.setRouterQuery()
      this.fetchComics()
      miscApi.logEvent('tagfilter', filter)
    },

    onSortingButtonClick (sortButtonName) {
      if (this.sorting === sortButtonName) { return }
      this.showPaginationWhileLoading = false
      this.setSorting(sortButtonName)
      this.setRouterQuery()
      this.fetchComics()
      miscApi.logEvent('sort', sortButtonName)
    },

    onSearchChanged (newSearch) {
      this.searchFiltering222 = newSearch
    },

    paginate (pageNumber, shouldScrollToTopOfList=false, showPaginationWhileLoading=false) {
      if ( pageNumber === '...' ) { return }

      if (pageNumber === 'down') {
        if (this.paginatedComics.payload.page > 1) {
          this.setPageNumber(this.paginatedComics.payload.page-1)
        }
        else { return }
      }
      else if (pageNumber === 'up') {
        if (this.paginatedComics.payload.page < this.paginatedComics.payload.numberOfPages) {
          this.setPageNumber(this.paginatedComics.payload.page+1)
        }
        else { return }
      }
      else if (typeof(pageNumber) !== 'number') {
        pageNumber = 1
      }
      else if (pageNumber === this.pageNumber) {
        return
      }
      else {
        this.setPageNumber(pageNumber)
      }

      this.showPaginationWhileLoading = showPaginationWhileLoading

      this.setRouterQuery()
  
      if (shouldScrollToTopOfList) {
        let upperPaginationButtons = document.getElementById('upperPaginationButtons')
        upperPaginationButtons.scrollIntoView()
      }

      this.fetchComics()
    },

    addSelectedKeyword (keyword) {
      this.showPaginationWhileLoading = false

      this.$store.commit('setWasKwSelectedFromList', true)
      this.$store.dispatch('addSelectedKeyword', keyword)
      this.keywordSearchFocused = undefined
      this.keywordSearch = ''

      keywordApi.logKeywordSearch(keyword.id, false)
    },

    onKeywordsChange (wasKwRemoved) {
      this.showPaginationWhileLoading = false
      this.setRouterQuery()
      this.fetchComics()
      
      if (!this.wasKwSelectedFromList && !wasKwRemoved) {
        let searchContainer = document.getElementById('searchInputsContainer')
        searchContainer.scrollIntoView()
      }
    },

    removeSelectedKeyword (keyword) {
      this.showPaginationWhileLoading = false

      this.$store.dispatch('removeSelectedKeyword', keyword)
      this.setRouterQuery()
      this.fetchComics()
    },

    toggleShowSearchFiltering (shouldShow) {
      if (new Date() - this.lastClosedSearchFilteringTime < 200) { return }
      this.lastClosedSearchFilteringTime = new Date()

      if (shouldShow && (new Date()).getTime() - this.lastClosedTime.getTime() < 100) {
        return
      }
      this.$store.commit('setIsFilterSectionExpanded', shouldShow)

      if (!shouldShow) {
        this.lastClosedTime = new Date()
      }
      this.$cookies.set('isSearchFilteringExpanded', shouldShow ? 1 : 0)
    },

    minimizeSearchFiltering () {
      this.toggleShowSearchFiltering(false)
    },

    resetAllFilters () {
      this.showPaginationWhileLoading = false
      this.$store.commit('setCategoryFilter', ['All'])
      this.$store.commit('setTagFilter', ['All'])
      this.$store.commit('setSelectedKeywords', [])
      this.$store.commit('setSorting', 'updated')
      this.searchFiltering222 = ''
      this.paginate(1)
      this.fetchComics()
      this.deferFetchingComics = true
      this.toggleShowSearchFiltering(false)
      setTimeout(() => this.deferFetchingComics = false, 1500)
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
      if (this.$store.getters.sorting === 'updated') {
        delete queryObj.orderBy
      }
      else {
        queryObj.orderBy = this.$store.getters.sorting
      }
      if (this.$store.getters.searchFiltering) {
        queryObj.search = this.$store.getters.searchFiltering
      }
      if (this.selectedKeywords.length > 0) { 
        queryObj.tags = this.selectedKeywords.map(kw => kw.name)
      }

      if (Object.keys(queryObj).length > 0) {
        this.$router.push({path: '/', query: queryObj})
      }
      else if (this.$router.history.current.fullPath !== '/') {
        this.$router.push({path: '/'})
      }
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

    setDetailLevel (detailLevel) {
      this.$store.commit('setDetailLevel', detailLevel)
      this.$cookies.set('detail', detailLevel)
      if (!this.avoidLog) { miscApi.logEvent('detail', detailLevel) }

      if (detailLevel === 'high') {
        this.fetchComics()
      }
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

    onImageLoad () {
      this.loadedImageCounter++
      if (this.loadedImageCounter === this.config.comicsPerPage) {
        window.prerenderReady = true
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

  metaInfo () {
    let title = `Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"},
        {vmid: 'ogDesc', property: 'og:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"},
      ]
    }
  },
}
</script>

<style lang="scss">
@import "../scss/shadows.scss";

.top-links {
  display: flex;
  flex-direction: row;
  width: fit-content;
  margin: 2rem auto 0 auto;
  @media (max-width: 900px) {
    margin-top: 1rem;
  }
}

.subtitleContainer {
  display: flex;
  flex-direction: column;
  p {
    color: $themeText;
    font-size: 1.5rem;
    @media screen and (max-width: 900px) {
      font-size: 1.25rem;
    }
    @media screen and (max-width: 500px) {
      font-size: 1rem;
    }
  }
  p:first-child {
    align-self: flex-start;
    margin-right: calc(min(15vw, 8rem));
    @media screen and (max-width: 900px) {
      align-self: center;
      margin-right: auto;
    }
  }
  p:nth-child(2) {
    align-self: flex-end;
    margin-top: 0.25rem;
    @media screen and (max-width: 900px) {
      align-self: center;
    }
  }
}

.upperBodyDiv {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  p, h1, div {
    color: #333;
  }
  h1 {
    font-family: 'Shrikhand', cursive;
  }
  h2 {
    margin: 45px 0px;
  }

  padding: 5rem 0 3rem 0;
  border-style: solid;
  border-width: 0;

  @media screen and (max-width: 900px) {
    padding: 3rem 0 1rem 0;
    a, .link-color {
      font-weight: 400 !important;
    }
  }
}

.comic-card-container {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 900px) {
    margin-top: 12px;
  }
}

.dark {
  .upperBodyDiv {
    h1, p {
      color: white !important;
    }
  }
}
.upperBodyWidth {
  width: 50%;
  @media (max-width: 900px) {
    width: 100%;
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
    font-size: 1.15rem;
    margin: 0 0.75rem;
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
