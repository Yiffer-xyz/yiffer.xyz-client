module.exports = {
  devServer: {
    proxy: 'http://localhost:8012',
    https: false,
    disableHostCheck: true
  },
  outputDir: '../test',
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/scss/colors.scss";`
      }
    }
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
}