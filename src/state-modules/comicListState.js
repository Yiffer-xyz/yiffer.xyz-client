import comicApi from '../api/comicApi.js';
import config from '@/config.json'

export default {
	state: {
		indexComicList: [],
		displayedComics: [],
		filteredComics: [],
		categoryFilter: ['All'],
		tagFilter: ['All'],
		sorting: 'updated',
		pageNumber: 1,
		searchFiltering: '',
		selectedKeywords: [],
		numberOfFilteredComics: 0,
	},

	actions: {
		loadComicList: context => {
			return new Promise (async (resolve) => {
				let response = await comicApi.getComics()
				context.commit('setComicList', response.data)
				resolve(response.data)
			})
		},

		calculateFilteredComics: context => {
			recalculateFilteredComics(context.state)
		}

		// recalculateFilteredComics: context => {console.log('recalculating..')
		// 	if (typeof context.getters.comicList !== "object") { return }
		// 	let filteredComics = context.getters.comicList
		// 		.filter(comicObj => context.getters.categoryFilter.indexOf('All')===0 || context.getters.categoryFilter.indexOf(comicObj.tag)>=0)
		// 		.filter(comicObj => context.getters.tagFilter.indexOf('All')===0 || context.getters.tagFilter.indexOf(comicObj.tag)>=0)
		// 		.filter(comicObj => {
		// 			return comicObj.name.toLowerCase().indexOf( context.getters.searchFiltering.toLowerCase() ) >= 0 
		// 				|| comicObj.artist.toLowerCase().indexOf( context.getters.searchFiltering.toLowerCase() ) >= 0
		// 		})
		// 		.filter(comicObj => ! context.getters.selectedKeywords.some(kw => comicObj.keywords.indexOf(kw) === -1))
		// 	context.commit('setFilteredComics', filteredComics)
		// 	console.log('new list made, is ', filteredComics)
		// }
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
			state.sorting = newSorting
			state.pageNumber = 1
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
	},

	getters: {
		comicList: state => state.comicList,
		displayedComics: state => state.displayedComics,
		filteredComics: state => state.filteredComics,
		getFilteredComics: () => state => state.filteredComics,
		categoryFilter: state => state.categoryFilter,
		tagFilter: state => state.tagFilter,
		sorting: state => state.sorting,
		pageNumber: state => state.pageNumber,
		searchFiltering: state => state.searchFiltering,
		selectedKeywords: state => state.selectedKeywords,
	}
}

function recalculateFilteredComics (state) {
	if (typeof state.comicList !== "object") { return }
	let filteredComics = state.comicList
		// .filter(comicObj => state.categoryFilter.indexOf('All')===0 || state.categoryFilter.indexOf(comicObj.cat)>=0)
		.filter(comicObj => state.tagFilter.indexOf('All')===0 || state.tagFilter.indexOf(comicObj.tag)>=0)
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