const path = require('path');
require('babel-polyfill');

module.exports = {
	node: {
		fs: 'empty'
	},
	entry: ['babel-polyfill', './src/index.js'],
	mode: 'development',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
};
