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
    
    async loadActiveAds ({commit}) {
      let response = await adApi.getAdsBasic()
      commit('setPaidImages', response)
    },

    updateOneComicInList ({state, dispatch, getters}, comicData) {
      let selectedComicIndex = getters.comicList.findIndex(c => c.id === comicData.id)
      Vue.set(state.comicList, selectedComicIndex, comicData)
      dispatch('recalculateFilteredComics')
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

    calculateFilteredComics ({dispatch}) {
      dispatch('recalculateFilteredComics')
    },

    addSelectedKeywordByNameOnly (context, keywordName) {
      let keywordObject = context.rootState.keywordList.find(kw => kw.name===keywordName)
      context.dispatch('addSelectedKeyword', keywordObject)

      keywordApi.logKeywordSearch(keywordObject.id, true)
    },
    
    setSorting ({state, commit, dispatch}, newSorting) {
      const sortedComicList = [...state.comicList]
      sortedComicList.sort( (c1, c2) => {
        if ( c1[newSorting] < c2[newSorting] ) { return 1 }
        else if ( c1[newSorting] > c2[newSorting] ) { return -1 }
        else { return 0 }
      })
      commit('setComicList', sortedComicList)
      commit('setPageNumber', 1)
      if (!!newSorting) { commit('setSorting', newSorting) }
      
      dispatch('recalculateFilteredComics')
    },

    // todo finne ut når alle disse recalculates trengs. 
    // Kanskje noen av actionenen faktisk kan være mutations
    setComicList ({commit, dispatch}, comicList) {
      commit('setComicList', comicList)
      dispatch('recalculateFilteredComics') //todo
    },

    setPageNumber ({commit, dispatch}, pageNumber) {
      commit('setPageNumber', pageNumber)
      dispatch('recalculateDisplayedComics') // todo
    },

    setSearchFiltering ({commit, dispatch}, searchFiltering) {
      commit('setSearchFiltering', searchFiltering)
      commit('setPageNumber', 1)
      dispatch('recalculateFilteredComics') // todo
    },

    setCategoryFilter ({commit, dispatch}, filterList) {
      commit('setCategoryFilter', filterList)
      dispatch('recalculateFilteredComics') // todo
    },

    setTagFilter ({commit, dispatch}, filterList) {
      commit('setTagFilter', filterList)
      dispatch('recalculateFilteredComics') // todo
    },

    addCategoryFilter ({state, commit, dispatch}, filter) {
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
      dispatch('recalculateFilteredComics')
    },

    addTagFilter ({state, commit, dispatch}, filter) {
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
      dispatch('recalculateFilteredComics')
    },

    addSelectedKeyword ({state, commit, dispatch}, keyword) {
      commit('setPageNumber', 1);
      if (!state.selectedKeywords.find(kw => kw.id === keyword.id)) {
        commit('setSelectedKeywords', [...state.selectedKeywords, keyword]);
      }
      dispatch('recalculateFilteredComics')
      keywordApi.logKeywordSearch(keyword.id, false)
    },

    setAllSelectedKeywords ({commit, dispatch}, keywords) {
      commit('setSelectedKeywords', keywords)
      dispatch('recalculateFilteredComics')
    },

    removeSelectedKeyword ({state, commit, dispatch}, keyword) {
      commit('setPageNumber', 1);
      commit('setSelectedKeywords', state.selectedKeywords.filter(kw => kw.id !== keyword.id))
      dispatch('recalculateFilteredComics')
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

    recalculateFilteredComics ({state, commit, dispatch}) {
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

      commit('setFilteredComics', filteredComics)
      commit('setNumberOfFilteredComics', filteredComics.length)
      let shouldIncludeAds = !state.searchFiltering && filteredComics.length > config.adsPerPage
      let numberOfPages = shouldIncludeAds 
        ? Math.ceil(filteredComics.length / (config.comicsPerPage-config.adsPerPage))
        : Math.ceil(filteredComics.length / config.comicsPerPage)
      commit('setNumberOfPages', numberOfPages)
    
      dispatch('recalculateDisplayedComics')
    },

    recalculateDisplayedComics ({state, commit, getters}) {
      let numberOfComics = config.comicsPerPage - config.adsPerPage
      let shouldIncludeAds = !state.searchFiltering && state.filteredComics.length >= numberOfComics
    
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
        let comicCounter = 0
        let paidImages = [...getters.paidImagesCard()]
        for (let i=0; i<numberOfComics; i++) {
          if (indexesOfAds.includes(i)) {
            let indexOfAd = Math.floor(Math.random() * paidImages.length)
            let ad = paidImages.splice(indexOfAd, 1)[0]
            finalList.push(ad)
          }
          else {
            finalList.push(comicsToBeShown[comicCounter])
            comicCounter++
          }
        }
    
        commit('setDisplayedComics', finalList)
      }
      else {
        let comicsToBeShown = state.filteredComics.slice(
          config.comicsPerPage*(state.pageNumber-1), config.comicsPerPage*state.pageNumber
        );
        commit('setDisplayedComics', comicsToBeShown)
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
    paidImagesCard: state => () => state.paidImages
      .filter(ad => ad.adType.includes('card'))
      .map(ad => ({
        ...ad,
        isPaidImage: true,
      })),
    paidImagesBanner: state => () => state.paidImages.filter(ad => ad.adType.includes('banner')),
    numberOfPages: state => state.numberOfPages,
  }
}
