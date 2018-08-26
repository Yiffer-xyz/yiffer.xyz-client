<template>
  <div v-bind:class="{'dark': darkTheme}" id="app">
		<div class="theme-button-container">
			<button class="theme-button" @click="setTheme('light')">Light</button>
			<button class="theme-button" @click="setTheme('dark')">Dark</button>
		</div>
    <router-view/>
  </div>
</template>

<script>
export default {
	methods: {
		setTheme( themeColor ) {
			if ( themeColor === 'dark' ) { this.darkTheme = true }
			else { this.darkTheme = false }
		}
	},
	data: function () {
		return { darkTheme: false }
	}
}
</script>


<style>
#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style lang="sass">
$linkColor: #3984d4

div, table, span, img, body, h1, h2, h3, p
	margin: 0px

h1, h2, h3, h4, p, div, span
	color: #111

h1
	font-weight: 300
	font-size: 70px
	margin-top: 50px

h2
	font-weight: 300
	font-size: 35px

a
	color: $linkColor

.theme-button-container
	position: absolute
	top: 0
	right: 10px

.dark
	color: #ddd
	background-color: #091014
</style>
