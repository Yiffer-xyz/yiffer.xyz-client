<template>
  <div id="app">
		<div class="theme-button-container">
			<button class="theme-button" @click="setTheme('light')" v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}">Light</button>
			<button class="theme-button" @click="setTheme('dark')"  v-bind:class="{'theme-button-white-text': $store.state.whiteThemeButtons}">Dark</button>
		</div>
    <router-view/>
  </div>
</template>

<script>
export default {
	methods: {
		setTheme( themeColor ) {
			if ( themeColor === 'dark' ) { document.body.classList.add('dark') }
			else { document.body.classList.remove('dark') }
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
	text-align: center;
}
</style>

<style lang="sass">
$linkColor: #3984d4

div, table, span, img, body, h1, h2, h3, p
	margin: 0px

router-link, p, td
	font-weight: 300

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
	right: 3px

.theme-button
	background: transparent
	border: none
	color: #009fff
	padding: 
	&:hover
		cursor: pointer
		background: rgba(255, 255, 255, 0.1)
	&:focus
		outline: none

.theme-button-white-text
	color: white
	background: rgba(255, 255, 255, 0.2)
	&:hover
		background: rgba(255, 255, 255, 0.4)

.y-button
	border: 0.8px solid $linkColor
	border-radius: 5px
	color: $linkColor
	background: rgba(0,0,0,0)
	padding: 4px 9px

	&:hover
		background-color: $linkColor
		color: white
		cursor: pointer

.dark
	background-color: #091014
	p, h1, h2, div, td, h3, span
		color: #ddd
</style>

<style lang="scss">
$linkColor: #3984d4;
.text-button {
	font-size: 14px;
	text-align: center;
	font-weight: 300;
	font-family: 'Open Sans', sans-serif;
	background: transparent;
	border: none;
	color: $linkColor;
	padding: 0px;
	margin: 0px;
	&:hover {
		cursor: pointer;
	}
}
</style>
