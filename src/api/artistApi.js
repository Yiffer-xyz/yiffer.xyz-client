import config from '@/config.json'

export default {
  async getArtistList () {
    return new Promise(resolve => {
			resolve(config.artistList)
    })
  },

  async addNewArtist (artistName) {
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