/**
 * 详细配置选项请参阅VUE-CLI官方文档: https://cli.vuejs.org/config/#vue-config-js
 */

module.exports = {
  productionSourceMap: false,
  lintOnSave: true,
  configureWebpack: { plugins: [] },
  devServer: {
    port: 9595,
    proxy: {
      '/apis': {
        target: 'http://192.168.50.100:8085',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/apis': '/'
        }
      }
    }
  }
}
