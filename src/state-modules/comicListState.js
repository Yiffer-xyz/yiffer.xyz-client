import comicApi from '../api/comicApi.js'
import config from '@/config.json'
import Vue from 'vue'

export default {
	state: {
		comicList: [],
		displayedComics: [],
		filteredComics: [],
		categoryFilter: ['All'],
		tagFilter: ['All'],
		sorting: 'updated',
		pageNumber: 1,
		searchFiltering: '',
		selectedKeywords: [],
		numberOfFilteredComics: 0,
		detailLevel: 'Medium detail',
	},

	actions: {
		loadComicList: context => {
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

		calculateFilteredComics: context => {
			recalculateFilteredComics(context.state)
		},
	},

	mutations: {
		setComicList: (state, comicList) => {
			state.comicList = comicList
			recalculateFilteredComics(state)
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
			if (state.selectedKeywords.indexOf(keyword) < 0) {
				state.selectedKeywords.push(keyword) 
			}
			recalculateFilteredComics(state)
		},
		removeSelectedKeyword: (state, keyword) => {
			state.pageNumber = 1
			state.selectedKeywords.splice(state.selectedKeywords.indexOf(keyword), 1)
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
		detailLevel: state => state.detailLevel,
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
		.filter(comicObj => ! state.selectedKeywords.some(kw => comicObj.keywords.indexOf(kw) === -1))
		state.filteredComics = filteredComics

	state.numberOfFilteredComics = filteredComics.length

	recalculateDisplayedComics(state)
}

function recalculateDisplayedComics (state) {
	state.displayedComics = state.filteredComics.slice(
		config.comicsPerPage*(state.pageNumber-1), config.comicsPerPage*state.pageNumber
	)
}