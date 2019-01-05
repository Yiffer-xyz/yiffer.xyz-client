import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		darkTheme: false,
		clickedComic: undefined,
		comicList: [],
		displayComics: [],
		numberOfFilteredComics: 0,
		categoryFilter: ['All'],
		tagFilter: ['All'],
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
		userData: {},
		authenticated: false,
  },
  mutations: {
		setUserDataFromCookies ( state ) {
			if ($cookies.isKey('user-data')) {
				state.userData = $cookies.get('user-data')
				state.authenticated = true
			}
		},
		setUserData ( state, userData ) {
			state.userData = userData
			state.authenticated = true
			$cookies.set('user-data', userData)
		},
		destroyUserData ( state ) {
			state.userData = {}
			state.authenticated = false
			$cookies.remove('user-data')
		},
		setUsername ( state, username ) { state.username = username },
		setUserType ( state, userType ) { state.userType = userType },
		clickComic ( state, comic ) { state.clickedComic = comic },
		setComicList ( state, comicList ) { state.comicList = comicList },

		setCategoryFilter ( state, filterList ) { state.categoryFilter = filterList },
		setTagFilter ( state, filterList ) { state.tagFilter = filterList },

		addCategoryFilter ( state, filter ) {
			if (filter === 'All') { state.categoryFilter = ['All'] }
			else if (state.categoryFilter.indexOf(filter) >= 0) {
				if (state.categoryFilter.length === 1) { state.categoryFilter = ['All'] }
				else { state.categoryFilter.splice( state.categoryFilter.indexOf(filter), 1 ) }
			}
			else {
				if ( state.categoryFilter.indexOf('All') >= 0 ) { state.categoryFilter = [filter] }
				else { state.categoryFilter.push( filter ) }
			}
		},
		addTagFilter ( state, filter ) {
			if (filter === 'All') { state.tagFilter = ['All'] }
			else if (state.tagFilter.indexOf(filter) >= 0) {
				if (state.tagFilter.length === 1) { state.tagFilter = ['All'] }
				else { state.tagFilter.splice( state.tagFilter.indexOf(filter), 1 ) }
			}
			else {
				if ( state.tagFilter.indexOf('All') >= 0 ) { state.tagFilter = [filter] }
				else { state.tagFilter.push( filter ) }
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
		setSelectedKeywords ( state, keywordList) { state.selectedKeywords = keywordList },		

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
		getCategoryFilter: state => () => state.categoryFilter,
		getTagFilter: state => () => state.tagFilter,
	},
  actions: {}
})
