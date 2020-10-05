import comicApi from '../api/comicApi'
import keywordApi from '../api/keywordApi'
import adApi from '../api/advertisingApi'
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
    isComicCardExpanded: false,
    expandedComic: {'name': '', 'userRating': 0, 'yourRating': 0, 'artist': ''},
    paidImages: [],
    numberOfPages: 1,
  },

  actions: {
    async loadComicList ({commit, dispatch, getters}) {
      comicApi.getFirstComics().then(response => {
        commit('setFirstComicsList', response)
      })
      return new Promise (async (resolve) => {
        let response = await comicApi.getComics()
        commit('setComicList', response)
        dispatch('setSorting', getters.sorting)
        resolve(response)
      })
    },
    
    async loadActiveAds (context) {
      let response = await adApi.getAdsBasic()
      context.commit('setPaidImages', response)
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
      if (context.state.isComicCardExpanded) {
        context.dispatch('setExpandedComic', newComic)
      }
    },

    calculateFilteredComics: context => {
      recalculateFilteredComics(context.state)
    },

    addSelectedKeywordByNameOnly (context, keywordName) {
      let keywordObject = context.rootState.keywordList.find(kw => kw.name===keywordName)
      context.dispatch('addSelectedKeyword', keywordObject)

      keywordApi.logKeywordSearch(keywordObject.id, true)
    },
    
    setSorting ({state, commit}, newSorting) {
      const sortedComicList = [...state.comicList]
      sortedComicList.sort( (c1, c2) => {
        if ( c1[state.sorting] < c2[state.sorting] ) { return 1 }
        else if ( c1[state.sorting] > c2[state.sorting] ) { return -1 }
        else { return 0 }
      })
      commit('setComicList', sortedComicList)
      commit('setPageNumber', 1)
      if (!!newSorting) { commit('setSorting', newSorting) }
      
      recalculateFilteredComics(state)
    },

    // todo finne ut når alle disse recalculates trengs. 
    // Kanskje noen av actionenen faktisk kan være mutations
    setComicList ({state, commit}, comicList) {
      commit('setComicList', comicList)
      recalculateFilteredComics(state) //todo
    },

    setPageNumber ({commit, state}, pageNumber) {
      commit('setPageNumber', pageNumber)
      recalculateDisplayedComics(state) // todo
    },

    setSearchFiltering ({commit, state}, searchFiltering) {
      commit('setSearchFiltering', searchFiltering)
      commit('setPageNumber', 1)
      recalculateFilteredComics(state) // todo
    },

    setCategoryFilter ({commit, state}, filterList) {
      commit('setCategoryFilter', filterList)
      recalculateFilteredComics(state) // todo
    },

    setTagFilter ({commit, state}, filterList) {
      commit('setTagFilter', filterList)
      recalculateFilteredComics(state) // todo
    },

    addCategoryFilter ({commit, state}, filter) {
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
      recalculateFilteredComics(state)
    },

    addTagFilter ({commit, state}, filter) {
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
      recalculateFilteredComics(state)
    },

    addSelectedKeyword ({commit, state}, keyword) {
      commit('setPageNumber', 1);
      if (!state.selectedKeywords.find(kw => kw.id === keyword.id)) {
        commit('setSelectedKeywords', [...state.selectedKeywords, keyword]);
      }
      recalculateFilteredComics(state)
      keywordApi.logKeywordSearch(keyword.id, false)
    },

    setAllSelectedKeywords ({commit, state}, keywords) {
      commit('setSelectedKeywords', keywords)
      recalculateFilteredComics(state)
    },

    removeSelectedKeyword ({commit, state}, keyword) {
      commit('setPageNumber', 1);
      commit('setSelectedKeywords', state.selectedKeywords.filter(kw => kw.id !== keyword.id))
      recalculateFilteredComics(state)
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
    }
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
    setPaidImages (state, images) { state.paidImages = images },
    setNumberOfPages (state, numberOfPages) { state.numberOfPages = numberOfPages },
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
    paidImagesCard: state => () => state.paidImagesCard
      .filter(ad => ad.adType.includes('card'))
      .map(ad => ({
        ...ad,
        isPaidImage: true,
      })),
    paidImagesBanner: state => () => state.paidImages.filter(ad => ad.adType.includes('banner')),
    numberOfPages: state => state.numberOfPages,
  }
}

function recalculateFilteredComics (state) {
  console.log('RECALC')
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
  let shouldIncludeAds = !state.searchFiltering && filteredComics.length > config.adsPerPage
  if (shouldIncludeAds) {
    state.numberOfPages = Math.ceil(filteredComics.length / (config.comicsPerPage-config.adsPerPage))
  }
  else {
    state.numberOfPages = Math.ceil(filteredComics.length / config.comicsPerPage)
  }

  recalculateDisplayedComics(state)
}

function recalculateDisplayedComics (state) {
  let numberOfComics = config.comicsPerPage - config.adsPerPage
  let shouldIncludeAds = false
  // let shouldIncludeAds = !state.searchFiltering && state.filteredComics.length >= numberOfComics

  if (shouldIncludeAds) {
    let indexesOfAds = []
    let numberOfSections = config.adsPerPage*2 - 1
    let excludedTopComics = 8
    let comicsPerSection = Math.floor((config.comicsPerPage-excludedTopComics) / numberOfSections)
  
    for (let sectionNo=0; sectionNo<=numberOfSections; sectionNo+=2) {
      let sectionPosition = Math.floor(Math.random() * comicsPerSection)
      let listPosition = excludedTopComics + sectionNo*comicsPerSection + sectionPosition
      indexesOfAds.push(listPosition)
    }
  
  
    let comicsToBeShown = state.filteredComics.slice(
      numberOfComics*(state.pageNumber-1), numberOfComics*state.pageNumber
    );
  
    let finalList = []
    let comicCounter = 0;
    for (let i=0; i<numberOfComics; i++) {
      if (indexesOfAds.includes(i)) {
        let indexOfAd = Math.floor(Math.random() * state.getters.paidImagesCard.length)
        let ad = state.getters.paidImagesCard.splice(indexOfAd, 1)[0]
        finalList.push(ad)
      }
      else {
        finalList.push(comicsToBeShown[comicCounter])
        comicCounter++
      }
    }

    state.displayedComics = finalList
  }
  else {
    let comicsToBeShown = state.filteredComics.slice(
      config.comicsPerPage*(state.pageNumber-1), config.comicsPerPage*state.pageNumber
    );
    state.displayedComics = comicsToBeShown
  }
}