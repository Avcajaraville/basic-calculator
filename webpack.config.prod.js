const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.config.common.js');
const { dist } = require('./config.paths');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'none',
  output: {
    filename: 'js/[name]-[hash].js',
    path: dist,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles-[hash].css',
    }),
  ],
});
