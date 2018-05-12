var path = require('path');

module.exports = {
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	entry: {
		page: './src/page.ts',
		background: './src/background.ts'
	},
	output: {
		path: path.resolve(__dirname, './build'),
		filename: '[name].js'
	}
};
