import config from '@/config.json'

export default {
	async getModScores () {
		return new Promise( async resolve => {
			setTimeout(() => {resolve({'success': true, 'message': 'asd', 'result': config.modScores})}, 1000)
		})
	},

	async getModLog () {
		return new Promise( async resolve => {
			setTimeout(() => {resolve({'success': true, 'message': 'asd', 'result': config.modLog})}, 1000)
		})
	}
}