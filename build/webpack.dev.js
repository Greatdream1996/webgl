const Webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
module.exports = WebpackMerge.merge(webpackConfig, {
  mode: 'development',
  devServer: {
    port: 3000,
    hot: true
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()]
})
