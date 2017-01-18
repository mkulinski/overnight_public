const path = require('path');
const webpack = require('webpack');

const PATHS = {
	app: './client/index.js',
	dist: path.join(__dirname, 'client', 'dist'),
};

module.exports = {
  entry: [
    // 'webpack-dev-server/client?http://localhost:8080', //required for react-hot-loader
    // 'webpack/hot/only-dev-server',
    './client/index.js'
  ],
  output: {
    path: PATHS.dist,
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
  	loaders: [{
  		exclude: /node_modules/,
  		loaders: ['babel-loader']
  	}],
  },
  watch: true, //what does watch do?
  devTool: 'source-map', //what does devTool sourcemap do?
  // devServer: {
  // 	contentBase: PATHS.dist,
  // },
  resolve: {
  	extensions: ['', '.js', '.jsx'],
  }
  // ,
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin()
  // ]
}
