import axios from 'axios'
import config from '@/config.json'
let baseUrl = config.apiBaseUrl

export default {
	async getModScores () {
		let response = await axios.get(baseUrl + '/modscores')
		if (!response.data.error) { return response.data }
		else { return [] }
	},

	async getModLog () {
		let response = await axios.get(baseUrl + '/modlog')
		if (!response.data.error) { return response.data }
		else { return [] }
	}
}
