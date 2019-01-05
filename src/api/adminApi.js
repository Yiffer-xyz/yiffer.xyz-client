import config from '@/config.json'

export default {
	async getComics () {
		console.log('GETTING COMICS API')
		return await new Promise( (resolve) => {
			setTimeout(() => {
				resolve(config.comicList)
			}, 500)
		})
	}
}