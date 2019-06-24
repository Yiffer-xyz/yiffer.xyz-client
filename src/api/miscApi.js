import config from '@/config.json'

import axios from 'axios'

let baseUrl = 'http://localhost:8012/api'


export default {
	async getModScores () {
		return new Promise( async resolve => {
			setTimeout(() => {resolve({'success': true, 'message': 'asd', 'result': config.modScores})}, 1000)
		})
	},

	async getModLog () {
		let response = await axios.get(baseUrl + '/modlog')
		if (!response.data.error) { return response.data }
		else { return [] }
	}
}