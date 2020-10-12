import comicApi from '../api/comicApi'
import keywordApi from '../api/keywordApi'
import adApi from '../api/advertisingApi'
import config from '@/config.json'
import Vue from 'vue'
import { registerFetchNames, doFetch } from '../utils/statefulFetch'

const store = {
  state: {
    comicList: [],
    firstComicsList: [],
    displayedComics: [],
    filteredComics: [],
    categoryFilter: ['All'],
    tagFilter: ['All'],
    sorting: 'updated',
    pageNumber: 1,
    searchFiltering: '',
    selectedKeywords: [],
    numberOfFilteredComics: 0,
    detailLevel: 'low',
    viewMode: 'list',
    isComicCardExpanded: false,
    expandedComic: {'name': '', 'userRating': 0, 'yourRating': 0, 'artist': ''},
  },

  actions: {
    async fetchComics ({commit, dispatch}, searchParams) {
      await doFetch(commit, 'paginatedComics', comicApi.getComicsPaginated(searchParams))
      dispatch('addAdsToComicList')
    },
    
    async loadActiveAds ({state, commit, dispatch}) {
      await doFetch(commit, 'paidImages', adApi.getAdsBasic())
      if (state.comicList.length === 0) {
        dispatch('addAdsToComicList')
      }
    },

    addAdsToComicList({state, getters, commit}) {
      let indexesOfAds = []
      let numberOfSections = config.adsPerPage*2 - 1
      let excludedTopComics = 8
      let comicsPerSection = Math.floor((config.comicsPerPage-excludedTopComics) / numberOfSections)
    
      for (let sectionNo=0; sectionNo<=numberOfSections; sectionNo+=2) {
        if (sectionNo === 0) {
          let offsetFromStart = excludedTopComics + Math.floor(Math.random() * 4)
          indexesOfAds.push(offsetFromStart)
        }
        else {
          let sectionPosition = Math.floor(Math.random() * comicsPerSection)
          let listPosition = excludedTopComics + sectionNo*comicsPerSection + sectionPosition
          indexesOfAds.push(listPosition)
        }
      }

      let paidImages = [...getters.paidImagesCard()]
      let finalList = []
      let comicCounter = 0
      for (let i=0; i<config.comicsPerPage + config.adsPerPage; i++) {
        if (comicCounter === state.paginatedComics.payload.comics.length) {
          break
        }
        if (indexesOfAds.includes(i)) {
          let indexOfAd = Math.floor(Math.random() * paidImages.length)
          let ad = paidImages.splice(indexOfAd, 1)[0]
          finalList.push(ad)
        }
        else {
          finalList.push(state.paginatedComics.payload.comics[comicCounter])
          comicCounter++
        }
      }
  
      commit('setComicList', finalList)
    },

    updateOneComicInList ({state, getters}, comicData) {
      let selectedComicIndex = getters.comicList.findIndex(c => c.id === comicData.id)
      Vue.set(state.comicList, selectedComicIndex, comicData)
    },

    refreshOneComicInList ({dispatch}, comicName) {
      return new Promise (async (resolve) => {
        let response = await comicApi.getComic(comicName)
        dispatch('updateOneComicInList', response.result)
        resolve(response.result)
      })
    },

    refreshExpandedComicIfExpanded ({state, dispatch}, newComic) {
      if (state.isComicCardExpanded) {
        dispatch('setExpandedComic', newComic)
      }
    },

    addSelectedKeywordByNameOnly (context, keywordName) {
      let keywordObject = context.rootState.keywordList.find(kw => kw.name===keywordName)
      context.dispatch('addSelectedKeyword', keywordObject)

      keywordApi.logKeywordSearch(keywordObject.id, true)
    },

    setSearchFiltering ({commit}, searchFiltering) {
      commit('setSearchFiltering', searchFiltering)
      commit('setPageNumber', 1)
    },

    setSorting ({commit}, newSorting) {
      if (!!newSorting) {
        commit('setPageNumber', 1)
        commit('setSorting', newSorting)
      }
    },

    addTagFilter ({state, commit}, filter) {
      commit('setPageNumber', 1)
      let newFilter

      if (filter === 'All') { newFilter = ['All'] }
      else if (state.tagFilter.indexOf(filter) >= 0) {
        if (state.tagFilter.length === 1) { newFilter = ['All'] }
        else { newFilter = state.tagFilter.filter(c => c !== filter) }
      }
      else {
        if ( state.tagFilter.indexOf('All') >= 0 ) { newFilter = [filter] }
        else { newFilter = [...state.tagFilter, filter] }
      }

      commit('setTagFilter', newFilter)
    },

    addCategoryFilter ({state, commit}, filter) {
      commit('setPageNumber', 1)
      let newFilter

      if (filter === 'All') { newFilter = ['All'] }
      else if (state.categoryFilter.indexOf(filter) >= 0) {
        if (state.categoryFilter.length === 1) { newFilter = ['All'] }
        else { newFilter = state.categoryFilter.filter(c => c !== filter) }
      }
      else {
        if ( state.categoryFilter.indexOf('All') >= 0 ) { newFilter = [filter] }
        else { newFilter = [...state.categoryFilter, filter] }
      }

      commit('setCategoryFilter', newFilter)
    },

    addSelectedKeyword ({state, commit, dispatch}, keyword) {
      commit('setPageNumber', 1);
      if (!state.selectedKeywords.find(kw => kw.id === keyword.id)) {
        commit('setSelectedKeywords', [...state.selectedKeywords, keyword]);
      }
      keywordApi.logKeywordSearch(keyword.id, false)
    },

    setAllSelectedKeywords ({commit, dispatch}, keywords) {
      commit('setSelectedKeywords', keywords)
    },

    removeSelectedKeyword ({state, commit}, keyword) {
      commit('setPageNumber', 1);
      commit('setSelectedKeywords', state.selectedKeywords.filter(kw => kw.id !== keyword.id))
    },

    setExpandedComic ({commit}, comic) {
      if (!comic) {
        commit('setIsComicCardExpanded', false)
        commit('setExpandedComic', {name: '', userRating: 0, yourRating: 0, artist: ''})
      }
      else {
        commit('setExpandedComic', comic)
        commit('setIsComicCardExpanded', true)
      }
    },
  },

  mutations: {
    setComicList (state, comicList) { state.comicList = comicList },
    setFirstComicsList (state, comicList) { state.firstComicsList = comicList },
    setDisplayedComics (state, newDisplayedComics) { state.displayedComics = newDisplayedComics },
    setPageNumber (state, newPageNumber) { state.pageNumber = newPageNumber },
    setSorting (state, newSorting) { state.sorting = newSorting },
    setSearchFiltering (state, newSearchFiltering) { state.searchFiltering = newSearchFiltering },
    setCategoryFilter (state, filterList) { state.categoryFilter = filterList },
    setTagFilter (state, filterList) { state.tagFilter = filterList },
    setSelectedKeywords (state, keywordList) { state.selectedKeywords = keywordList },
    setFilteredComics (state, comicList) { state.filteredComics =  comicList },
    setDetailLevel (state, detailLevel) { state.detailLevel = detailLevel },
    setViewMode (state, viewMode) { state.viewMode = viewMode },
    setExpandedComic (state, comic) { state.expandedComic = comic },
    setIsComicCardExpanded (state, isExpanded) { state.isExpanded = isExpanded },
    // setNumberOfPages (state, numberOfPages) { state.numberOfPages = numberOfPages },
    setNumberOfFilteredComics (state, num) { state.numberOfFilteredComics = num },
  },

  getters: {
    comicList: state => state.comicList,
    comicListF: state => () => state.comicList,
    firstComicsList: state => state.firstComicsList,
    displayedComics: state => state.displayedComics,
    filteredComics: state => state.filteredComics,
    getFilteredComics: () => state => state.filteredComics,
    categoryFilter: state => state.categoryFilter,
    tagFilter: state => state.tagFilter,
    sorting: state => state.sorting,
    pageNumber: state => state.pageNumber,
    searchFiltering: state => state.searchFiltering,
    selectedKeywords: state => state.selectedKeywords,
    getSelectedKeywords: () => state => state.selectedKeywords,
    detailLevel: state => state.detailLevel,
    viewMode: state => state.viewMode,
    isComicCardExpanded: state => state.isComicCardExpanded,
    expandedComic: state => state.expandedComic,
    paidImagesCard: state => () => state.paidImages.payload
      .filter(ad => ad.adType.includes('card'))
      .map(ad => ({
        ...ad,
        isPaidImage: true,
      })),
    paidImagesBanner: state => () => state.paidImages.payload.filter(ad => ad.adType.includes('banner')),
  },
}

registerFetchNames(store, 
  {name: 'paginatedComics', defaultValue: {comics: [], numberOfPages: 1, page: 1}},
  {name: 'paidImages', defaultValue: []},
)

export default store;
