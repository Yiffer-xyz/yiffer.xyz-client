<template>
	<span>
		<vue-headful :title="'Pending: ' + $route.params.comicName + ' - Yiffer.xyz'"/>
		<h1>Pending: {{$route.params.comicName}}</h1>
		<span v-if="comic">
			<h2>Thumbnail</h2>
			
		</span>
	</span>
</template>

<script>
import comicApi from '../api/comicApi'

export default {
	name: 'pendingComic',

	data: function () {
		return {
			comic: undefined
		}
	},

	methods: {
	},

	async created () {
		this.comic = await comicApi.getPendingComic(this.$route.params.comicName)
	}
}
</script>