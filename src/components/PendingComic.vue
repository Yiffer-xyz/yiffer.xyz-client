<template>
	<span>
		<vue-headful :title="'Pending: ' + $route.params.comicName + ' - Yiffer.xyz'"/>
	</span>
</template>

<script>
export default {
	name: 'pendingComic',
	data: function () {
		return {
		}
	},
	methods: {
	},
	created: async function () {
	}
}
</script>