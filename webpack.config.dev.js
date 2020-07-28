const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.config.common.js');
const { src } = require('./config.paths');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: src,
    port: 9000,
    index: 'index.html',
    watchContentBase: true,
  },
  plugins: [new MiniCssExtractPlugin()],
});
