module.exports = {
  devServer: {
    proxy: 'http://localhost:8012'
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/scss/variables.scss";`
			}
    }
  }
}