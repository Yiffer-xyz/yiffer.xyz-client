module.exports = {
  publicPath: '/',
  devServer: {
    proxy: 'http://localhost:8012',
    https: false,
    disableHostCheck: true
  },
  outputDir: './dist',
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