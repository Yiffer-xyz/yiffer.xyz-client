import axios from 'axios'

let baseUrl = 'http://localhost:8012/api'

export default {
  async getArtistList () {
		let response = await axios.get(baseUrl + '/artists')
		if (!response.data.error) { return response.data }
		else { return [] }
  },

  async getArtistByName (artistName) {
    let response = await axios.get(baseUrl + '/artists/' + artistName)
		if (!response.data.error) { return {success: true, result: response.data} }
		else { return {success: false, message: response.data.error} }
  },

  async addNewArtist (artistName) {
    let response = await axios.post(baseUrl + '/artist')
		if (!response.data.error) { return {success: true, result: response.data} }
		else { return {success: false, message: response.data.error} }

    return new Promise(resolve => {
      // todo note add new artist id
			resolve({success: true, message: 'artist no adderino', results: {artistId: 9123}})
    })
  },

  async addArtistLinks (artistId, linkList) {
    return new Promise(resolve => {
      // todo note add new artist id
			resolve({success: true, message: 'artist linkerino no adderino'})
    })
  }
}