import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		darkTheme: false,
		username: undefined,
		userType: undefined,
		clickedComic: undefined,
		comicList: [],
		displayComics: [],
		numberOfFilteredComics: 0,
		filters: {category: ['All'], tag: ['All']},
		sorting: 'updated',
		pageNumber: 1,
		searchFiltering: '',
		totalNumberOfComics: 0,
		selectedKeywords: [],
		keywordList: [],
		loginModalVisibility: false,
		votingModalVisibility: false,
		whiteThemeButtons: false,
		detailLevel: 'Medium detail',
		comicForVotingModal: {},
  },
  mutations: {
		setUsername ( state, username ) { state.username = username },
		setUserType ( state, userType ) { state.userType = userType },
		clickComic ( state, comic ) { state.clickedComic = comic },
		setComicList ( state, comicList ) { state.comicList = comicList },
		setFilter ( state, filterType, filterList ) { state.filters[filterType] = filterList },
		addFilter ( state, filterData ) {
			let selectedFilter = filterData.selectedFilter
			let filterType = filterData.filterType
			if (selectedFilter === 'All') { state.filters[filterType] = ['All'] }
			else if ( state.filters[filterType].indexOf(selectedFilter) >= 0 ) {
				if ( state.filters[filterType].length === 1 ) { state.filters[filterType] = ['All'] }
				else { state.filters[filterType].splice( state.filters[filterType].indexOf(selectedFilter), 1 ) }
			}
			else {
				if ( state.filters[filterType].indexOf('All') >= 0 ) { state.filters[filterType] = [selectedFilter] }
				else { state.filters[filterType].push( selectedFilter ) }
			}
		},
		setSorting ( state, sorting ) {
			state.sorting = sorting
			state.comicList.sort( (c1, c2) => {
				if ( c1[state.sorting] < c2[state.sorting] ) { return 1 }
				else if ( c1[state.sorting] > c2[state.sorting] ) { return -1 }
				else { return 0 }
			})
		},
		setPageNumber ( state, pageNumber ) { state.pageNumber = pageNumber },
		setSearchFiltering ( state, searchFiltering ) { state.searchFiltering = searchFiltering },
		setTotalNumberOfComics ( state, num ) { state.totalNumberOfComics = num },
		addSelectedKeyword ( state, keyword ) { 
			if (state.selectedKeywords.indexOf(keyword) < 0) {
				state.selectedKeywords.push(keyword) 
			}
		},
		removeSelectedKeyword ( state, keyword ) { state.selectedKeywords.splice(state.selectedKeywords.indexOf(keyword), 1) },
		setDisplayComics ( state, comicList ) { state.displayComics = comicList },
		setNumberOfFilteredComics ( state, number ) { state.numberOfFilteredComics = number },
		setAllKeywords ( state, keywordList ) { state.keywordList = keywordList },
		setLoginModalVisibility ( state, isVisible ) { state.loginModalVisibility = isVisible; },
		setVotingModalVisibility ( state, isVisible ) { state.votingModalVisibility = isVisible; },
		setWhiteThemeButtonStyle ( state, isWhite ) { state.whiteThemeButtons = isWhite },
		setDetailLevel ( state, detailLevel ) { state.detailLevel = detailLevel },
		updateOneComicInList ( state, updatedComic ) {
			for ( var i=0; i<state.comicList.length; i++ ) {
				if ( state.comicList[i].id === updatedComic.id ) {
					state.comicList[i] = updatedComic
				}
			}
		},
		setComicForVotingModal ( state, comic ) { state.comicForVotingModal = comic },
		setDarkTheme ( state, isDarkTheme ) { state.darkTheme = isDarkTheme },
	},
	getters: {
		getSelectedKeywords: state => () => state.selectedKeywords,
		getSorting: state => () => state.sorting,
	},
  actions: {}
})
