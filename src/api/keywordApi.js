import config from '@/config.json'

export default {
  async getKeywordList () {
		return new Promise(resolve => {
			resolve(config.demoKeywords)
		})
  },

  async getKeywordSuggestionList () {
    return new Promise(async resolve => {
      resolve(config.keywordSuggestionList)
    })
  },

  async processKeywordSuggestion (comicId, keywordName, isApproved) {
    return new Promise(async resolve => {
			resolve({'success': true})
		})
  },

  async addKeywordsToComic (comicData, keywordList) {
		return new Promise(async resolve => {
			resolve({'success': false, 'message': 'ok adding the KWs my fren'})
		})
  },

  async removeKeywordsFromComic (comicData, keywordList) {
    return new Promise(async resolve => {
			resolve({'success': false, 'message': 'The something not logged in or someting'})
    })
  },

  async createKeyword (keywordName) {
    return new Promise(async resolve => {
			resolve({'success': false, 'message': 'BAD SHIT HAPPEN'})
    })
	},
	
	async addKeywordSuggestion (keywordName, addOrRemoveKeyword) {
		// add will be 'add', remove else
    return new Promise(async resolve => {
			resolve({'success': true, 'message': 'ty for kw suggestion'})
    })
	}
}