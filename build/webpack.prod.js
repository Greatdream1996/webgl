const Webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = WebpackMerge.merge(webpackConfig, {
  mode: 'production',

  plugins: [new Webpack.HotModuleReplacementPlugin()],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        //压缩js
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  }
})
