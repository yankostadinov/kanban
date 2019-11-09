const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
require('babel-polyfill');

module.exports = {
	entry: ['babel-polyfill', './src/index.js'],
	mode: 'production',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new CompressionPlugin(),
	],
	module: {
		rules: [
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
