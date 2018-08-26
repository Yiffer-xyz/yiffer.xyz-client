<template>
	<div class="comic-card" v-bind:class="{ 'comic-card-dark': darkTheme }">
	</div>
</template>

<script>
export default {
	name: 'comic',
	props: {
		comic: Object
	},
	data: function () {
		return {
			darkTheme: window.darkTheme
		}
	},
	methods: {
	}
}
</script>

<style lang="sass">
$linkColor: #3984d4
$cardBgColorLight: #f1f1f1
$cardBgColorDark: #222426

</style>
