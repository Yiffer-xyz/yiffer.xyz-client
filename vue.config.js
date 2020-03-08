module.exports = {
  devServer: {
    proxy: 'http://localhost:8012'
  },
  outputDir: '../test',
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/scss/colors.scss";`
			}
    }
  }
}