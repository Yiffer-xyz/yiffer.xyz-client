import comicApi from '../api/comicApi'
import keywordApi from '../api/keywordApi'
import config from '@/config.json'
import Vue from 'vue'

export default {
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
    comicCardExpanded: false,
    expandedComic: {'name': '', 'userRating': 0, 'yourRating': 0, 'artist': ''},
  },

  actions: {
    loadComicList: context => {
      comicApi.getFirstComics().then(response => {
        context.commit('setFirstComicsList', response)
      })

      return new Promise (async (resolve) => {
        let response = await comicApi.getComics()
        context.commit('setComicList', response)
        resolve(response)
        context.commit('setSorting')
      })
    },

    updateOneComicInList (context, comicData) {
      let selectedComicIndex = context.getters.comicList.findIndex(c => c.id === comicData.id)
      Vue.set(context.state.comicList, selectedComicIndex, comicData)
      recalculateFilteredComics(context.state)
    },

    refreshOneComicInList (context, comicName) {
      return new Promise (async (resolve) => {
        let response = await comicApi.getComic(comicName)
        context.dispatch('updateOneComicInList', response.result)
        resolve(response.result)
      })
    },

    refreshExpandedComicIfExpanded (context, newComic) {
      if (context.state.comicCardExpanded) {
        context.commit('setExpandedComic', newComic)
      }
    },

    calculateFilteredComics: context => {
      recalculateFilteredComics(context.state)
    },

    addSelectedKeywordByNameOnly (context, keywordName) {
      let keywordObject = context.rootState.keywordList.find(kw => kw.name===keywordName)
      context.commit('addSelectedKeyword', keywordObject)

      keywordApi.logKeywordSearch(keywordObject.id, true)
    },
  },

  mutations: {
    setComicList: (state, comicList) => {
      state.comicList = comicList
      recalculateFilteredComics(state)
    },

    setFirstComicsList (state, comicList) {
      state.firstComicsList = comicList
    },

    setDisplayedComics: (state, newDisplayedComics) => state.displayedComics = newDisplayedComics,

    setPageNumber: (state, newPageNumber) => {
      state.pageNumber = newPageNumber
      recalculateDisplayedComics(state)
    },

    setSorting: (state, newSorting) => {
      if (!newSorting) { newSorting = state.sorting }

      state.sorting = newSorting
      state.pageNumber = 1
      state.comicList.sort( (c1, c2) => {
        if ( c1[state.sorting] < c2[state.sorting] ) { return 1 }
        else if ( c1[state.sorting] > c2[state.sorting] ) { return -1 }
        else { return 0 }
      })

      recalculateFilteredComics(state)
    },

    setSearchFiltering: (state, newSearchFiltering) => {
      state.searchFiltering = newSearchFiltering
      state.pageNumber = 1
      recalculateFilteredComics(state)
    },

    setCategoryFilter: (state, filterList) => {
      state.categoryFilter = filterList
      recalculateFilteredComics(state)
    },

    setTagFilter: (state, filterList) => {
      state.tagFilter = filterList
      recalculateFilteredComics(state)
    },

    addCategoryFilter: (state, filter) => {
      state.pageNumber = 1
      if (filter === 'All') {
        state.categoryFilter = ['All']
      }
      else if (state.categoryFilter.indexOf(filter) >= 0) {
        if (state.categoryFilter.length === 1) { state.categoryFilter = ['All'] }
        else { state.categoryFilter.splice( state.categoryFilter.indexOf(filter), 1 ) }
      }
      else {
        if ( state.categoryFilter.indexOf('All') >= 0 ) { state.categoryFilter = [filter] }
        else { state.categoryFilter.push( filter ) }
      }
      recalculateFilteredComics(state)
    },

    addTagFilter: (state, filter) => {
      state.pageNumber = 1
      if (filter === 'All') {
        state.tagFilter = ['All']
      }
      else if (state.tagFilter.indexOf(filter) >= 0) {
        if (state.tagFilter.length === 1) { state.tagFilter = ['All'] }
        else { state.tagFilter.splice( state.tagFilter.indexOf(filter), 1 ) }
      }
      else {
        if ( state.tagFilter.indexOf('All') >= 0 ) { state.tagFilter = [filter] }
        else { state.tagFilter.push( filter ) }
      }
      recalculateFilteredComics(state)
    },

    addSelectedKeyword: (state, keyword) => { 
      state.pageNumber = 1
      if (!state.selectedKeywords.find(kw => kw.id === keyword.id)) {
        state.selectedKeywords.push(keyword) 
      }
      recalculateFilteredComics(state)
      keywordApi.logKeywordSearch(keyword.id, false)
    },

    removeSelectedKeyword: (state, keyword) => {
      state.pageNumber = 1
      state.selectedKeywords.splice(state.selectedKeywords.findIndex(kw => kw.id === keyword.id), 1)
      recalculateFilteredComics(state)
    },

    setSelectedKeywords: (state, keywordList) => {
      state.selectedKeywords = keywordList
      recalculateFilteredComics(state)
    },

    setFilteredComics: (state, comicList) => {
      state.filteredComics =  comicList
    },

    setDetailLevel ( state, detailLevel ) {
      state.detailLevel = detailLevel
    },

    setViewMode (state, viewMode) {
      state.viewMode = viewMode
    },

    setExpandedComic (state, comic) {
      if (!comic) {
        state.comicCardExpanded = false
        state.expandedComic = {'name': '', 'userRating': 0, 'yourRating': 0, 'artist': ''}
      }
      else {
        state.expandedComic = comic
        state.comicCardExpanded = true
      }
    },
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
    getFilteredComics: () => state => state.selectedKeywords,
    detailLevel: state => state.detailLevel,
    viewMode: state => state.viewMode,
    comicCardExpanded: state => state.comicCardExpanded,
    expandedComic: state => state.expandedComic,
  }
}

function recalculateFilteredComics (state) {
  if (typeof state.comicList !== "object") { return }
  
  let filteredComics = state.comicList
    .filter(comicObj => state.categoryFilter.indexOf('All')===0 || state.categoryFilter.indexOf(comicObj.tag)>=0)
    .filter(comicObj => state.tagFilter.indexOf('All')===0 || state.tagFilter.indexOf(comicObj.cat)>=0)
    .filter(comicObj => {
      return comicObj.name.toLowerCase().indexOf( state.searchFiltering.toLowerCase() ) >= 0 
        || comicObj.artist.toLowerCase().indexOf( state.searchFiltering.toLowerCase() ) >= 0
    })
    .filter(comicObj => ! state.selectedKeywords.some(kw => comicObj.keywords.indexOf(kw.name) === -1))
    state.filteredComics = filteredComics

  state.numberOfFilteredComics = filteredComics.length

  recalculateDisplayedComics(state)
}

function recalculateDisplayedComics (state) {
  state.displayedComics = state.filteredComics.slice(
    config.comicsPerPage*(state.pageNumber-1), config.comicsPerPage*state.pageNumber
  )
}