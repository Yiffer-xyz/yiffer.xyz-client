import comicApi from '../api/comicApi'
import keywordApi from '../api/keywordApi'
import adApi from '../api/advertisingApi'
import config from '@/config.json'
import Vue from 'vue'
import { registerFetchNames, doFetch } from '../utils/statefulFetch'

const store = {
  state: {
    comicList: [],
    hasFetchedComicListOnce: false,
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
    isComicCardExpanded: false,
    expandedComic: {'name': '', 'userRating': 0, 'yourRating': 0, 'artist': ''},
    comicKeywords: {},
    isFilterSectionExpanded: false,
    wasKwSelectedFromList: true,
  },

  actions: {
    async fetchComics ({commit, dispatch}, searchParams) {
      await doFetch(commit, 'paginatedComics', comicApi.getComicsPaginated(searchParams))
      commit('setHasFetchedComicListOnce')
        dispatch('addAdsToComicList')
    },
    
    async loadActiveAds ({state, commit, dispatch}) {
      await doFetch(commit, 'paidImages', adApi.getAdsBasic())
      if (state.comicList.length === 0) {
        dispatch('addAdsToComicList')
      }
    },

    async getComicKeywords ({state, commit}, comicId) {
      let keywords = await keywordApi.getComicKeywords(comicId)
      commit('setComicKeywords', {...state.comicKeywords, [comicId]: keywords})
    },

    addAdsToComicList({state, getters, commit}) {
      if (!state.paginatedComics.fetched) {
        return
      }

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

      if (!paidImages || paidImages.length === 0) {
        return;
      }

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

    async refreshOneComicInList ({dispatch}, comicName) {
      let response = await comicApi.getComic(comicName)
      dispatch('updateOneComicInList', response)
      return response
    },

    refreshExpandedComicIfExpanded ({state, dispatch}, newComic) {
      if (state.isComicCardExpanded) {
        dispatch('setExpandedComic', newComic)
      }
    },

    setSearchFiltering ({commit}, searchFiltering) {
      commit('setSearchFiltering', searchFiltering)
      commit('setPageNumber', 1)
    },

    setSorting ({commit}, newSorting) {
      if (newSorting) {
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

    addSelectedKeyword ({state, commit}, keyword) {
      commit('setPageNumber', 1);
      if (!state.selectedKeywords.find(kw => kw.id === keyword.id)) {
        commit('setSelectedKeywords', [...state.selectedKeywords, keyword]);
      }
      keywordApi.logKeywordSearch(keyword.id, false)
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
    setDisplayedComics (state, newDisplayedComics) { state.displayedComics = newDisplayedComics },
    setPageNumber (state, newPageNumber) { state.pageNumber = newPageNumber },
    setSorting (state, newSorting) { state.sorting = newSorting },
    setSearchFiltering (state, newSearchFiltering) { state.searchFiltering = newSearchFiltering },
    setCategoryFilter (state, filterList) { state.categoryFilter = filterList },
    setTagFilter (state, filterList) { state.tagFilter = filterList },
    setSelectedKeywords (state, keywordList) { state.selectedKeywords = keywordList },
    setFilteredComics (state, comicList) { state.filteredComics =  comicList },
    setDetailLevel (state, detailLevel) { state.detailLevel = detailLevel },
    setExpandedComic (state, comic) { state.expandedComic = comic },
    setIsComicCardExpanded (state, isExpanded) { state.isExpanded = isExpanded },
    setNumberOfFilteredComics (state, num) { state.numberOfFilteredComics = num },
    setHasFetchedComicListOnce (state) { state.hasFetchedComicListOnce = true },
    setComicKeywords (state, comicKeywords) { state.comicKeywords = comicKeywords },
    setIsFilterSectionExpanded (state, isExpanded) { state.isFilterSectionExpanded = isExpanded },
    setWasKwSelectedFromList (state, wasSelected) { state.wasKwSelectedFromList = wasSelected },
  },

  getters: {
    comicList: state => state.comicList,
    comicListF: state => () => state.comicList,
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
    isComicCardExpanded: state => state.isComicCardExpanded,
    expandedComic: state => state.expandedComic,
    paidImagesCard: state => () => state.paidImages.payload
      .filter(ad => ad.adType.includes('card'))
      .map(ad => ({
        ...ad,
        isPaidImage: true,
      })),
    paidImagesBanner: state => () => {
      return state.paidImages.payload.filter(ad => ad.adType.includes('banner'))
    },
    hasFetchedComicListOnce: state => state.hasFetchedComicListOnce,
    comicKeywords: state => state.comicKeywords,
    isFilterSectionExpanded: state => state.isFilterSectionExpanded,
    wasKwSelectedFromList: state => state.wasKwSelectedFromList,
  },
}

registerFetchNames(store, 
  {name: 'paginatedComics', defaultValue: {comics: [], numberOfPages: 1, page: 1}},
  {name: 'paidImages', defaultValue: []},
)

export default store;
